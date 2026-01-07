import { Queue, Worker, Job } from 'bullmq'
import IORedis from 'ioredis'
import { prisma } from '@/lib/db'
import { generateBookOutline, generateChapter, generateSEOKeywords } from '@/lib/ai/openai'
import { generateMultipleCovers } from '@/lib/ai/replicate'
import { uploadFromUrl } from '@/lib/storage/r2'

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
})

export const bookGenerationQueue = new Queue('book-generation', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: {
      count: 100,
      age: 24 * 3600,
    },
    removeOnFail: {
      age: 7 * 24 * 3600,
    },
  },
})

interface BookGenerationJobData {
  bookProjectId: string
  userId: string
  config: {
    targetWordCount: number
    genre?: string
    language: string
  }
}

export const bookGenerationWorker = new Worker<BookGenerationJobData>(
  'book-generation',
  async (job: Job<BookGenerationJobData>) => {
    const { bookProjectId, userId, config } = job.data

    try {
      await job.log('Starting book generation...')
      await updateProgress(bookProjectId, 5, 'Initializing')

      // Get book details
      const book = await prisma.bookProject.findUnique({
        where: { id: bookProjectId },
      })

      if (!book) {
        throw new Error('Book not found')
      }

      // Step 1: Generate outline (10% of progress)
      await job.log('Generating book outline...')
      const outline = await generateBookOutline({
        title: book.title,
        subtitle: book.subtitle || undefined,
        inputContent: book.inputContent || '',
        targetWordCount: config.targetWordCount,
        genre: config.genre,
      })

      // Create chapter records
      const chapterPromises = outline.chapters.map((ch) =>
        prisma.bookChapter.create({
          data: {
            bookProjectId,
            chapterNumber: ch.number,
            title: ch.title,
            outline: ch.outline,
            status: 'pending',
          },
        })
      )
      await Promise.all(chapterPromises)

      await updateProgress(bookProjectId, 15, 'Outline complete')

      // Step 2: Generate chapters (60% of progress)
      const chapters = outline.chapters
      let totalWords = 0

      for (let i = 0; i < chapters.length; i++) {
        const chapter = chapters[i]
        await job.log(`Generating chapter ${i + 1}/${chapters.length}...`)

        const previousSummary = i > 0 ? `Previous chapter covered: ${chapters[i - 1].outline}` : undefined

        const content = await generateChapter({
          bookTitle: book.title,
          chapterNumber: chapter.number,
          chapterTitle: chapter.title,
          outline: chapter.outline,
          targetWordCount: chapter.targetWordCount,
          genre: config.genre,
          previousChapterSummary: previousSummary,
        })

        const wordCount = content.split(/\s+/).length
        totalWords += wordCount

        await prisma.bookChapter.update({
          where: {
            bookProjectId_chapterNumber: {
              bookProjectId,
              chapterNumber: chapter.number,
            },
          },
          data: {
            content,
            wordCount,
            status: 'completed',
            generatedAt: new Date(),
          },
        })

        const chapterProgress = 15 + ((i + 1) / chapters.length) * 60
        await updateProgress(bookProjectId, chapterProgress, `Chapter ${i + 1} complete`)
      }

      // Update book with total word count
      await prisma.bookProject.update({
        where: { id: bookProjectId },
        data: { actualWordCount: totalWords },
      })

      // Step 3: Generate covers (15% of progress)
      await job.log('Generating book covers...')
      await updateProgress(bookProjectId, 75, 'Creating cover designs')

      const coverUrls = await generateMultipleCovers(
        {
          title: book.title,
          authorName: book.authorName || 'Anonymous',
          genre: config.genre,
        },
        3
      )

      // Upload covers to R2
      const coverRecords = []
      for (let i = 0; i < coverUrls.length; i++) {
        const url = coverUrls[i]
        const uploadedUrl = await uploadFromUrl(url, bookProjectId, 'cover')

        const cover = await prisma.bookCover.create({
          data: {
            bookProjectId,
            coverType: 'front',
            imageUrl: uploadedUrl,
            thumbnailUrl: uploadedUrl,
            designPrompt: `Design variation ${i + 1}`,
            isSelected: i === 0,
          },
        })
        coverRecords.push(cover)
      }

      await updateProgress(bookProjectId, 90, 'Covers generated')

      // Step 4: Generate SEO keywords (5% of progress)
      await job.log('Optimizing SEO...')
      const allContent = (
        await prisma.bookChapter.findMany({
          where: { bookProjectId },
          select: { content: true },
        })
      )
        .map((ch) => ch.content)
        .join('\n\n')

      const keywords = await generateSEOKeywords({
        title: book.title,
        content: allContent,
        genre: config.genre,
      })

      await updateProgress(bookProjectId, 95, 'SEO optimization complete')

      // Step 5: Finalize
      await job.log('Finalizing book...')
      await prisma.bookProject.update({
        where: { id: bookProjectId },
        data: {
          status: 'completed',
          generationProgress: 100,
          coverUrl: coverRecords[0]?.imageUrl,
          seoKeywords: keywords,
          generationCompletedAt: new Date(),
        },
      })

      // Log activity
      await prisma.activityLog.create({
        data: {
          userId,
          bookProjectId,
          action: 'book_generation_completed',
          description: `Successfully generated "${book.title}"`,
          metadata: {
            wordCount: totalWords,
            chapterCount: chapters.length,
            coverCount: coverRecords.length,
          },
        },
      })

      await job.log('Book generation completed successfully!')

      return {
        success: true,
        bookProjectId,
        wordCount: totalWords,
        chapterCount: chapters.length,
      }
    } catch (error) {
      console.error('Book generation failed:', error)

      await prisma.bookProject.update({
        where: { id: bookProjectId },
        data: {
          status: 'failed',
          metadata: {
            error: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      })

      throw error
    }
  },
  {
    connection,
    concurrency: 2,
    limiter: {
      max: 5,
      duration: 60000,
    },
  }
)

async function updateProgress(bookProjectId: string, progress: number, statusMessage?: string) {
  await prisma.bookProject.update({
    where: { id: bookProjectId },
    data: {
      generationProgress: Math.round(progress),
      ...(statusMessage && {
        metadata: {
          currentStep: statusMessage,
        },
      }),
    },
  })
}

bookGenerationWorker.on('completed', (job) => {
  console.log(`✅ Book generation completed: ${job.id}`)
})

bookGenerationWorker.on('failed', (job, error) => {
  console.error(`❌ Book generation failed: ${job?.id}`, error)
})
