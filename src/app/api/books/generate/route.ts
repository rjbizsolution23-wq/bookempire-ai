import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { bookGenerationQueue } from '@/lib/queues/book-generation'
import { z } from 'zod'

const generateBookSchema = z.object({
  title: z.string().min(1).max(500),
  subtitle: z.string().max(500).optional(),
  authorName: z.string().min(1).max(255),
  inputType: z.enum(['topic', 'website', 'keywords', 'outline', 'research']),
  inputContent: z.string().min(1),
  targetWordCount: z.number().min(10000).max(200000).default(50000),
  genre: z.string().optional(),
  targetAudience: z.string().optional(),
  language: z.string().default('en'),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user from database
    let user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    // Create user if doesn't exist
    if (!user) {
      const clerkUser = await (await import('@clerk/nextjs/server')).currentUser()
      if (!clerkUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      user = await prisma.user.create({
        data: {
          clerkUserId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          fullName: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
          avatarUrl: clerkUser.imageUrl,
        },
      })
    }

    // Check usage limits
    if (user.booksGeneratedCount >= user.monthlyBookLimit) {
      return NextResponse.json(
        {
          error: 'Monthly book generation limit reached. Please upgrade your plan.',
          limit: user.monthlyBookLimit,
          used: user.booksGeneratedCount,
        },
        { status: 403 }
      )
    }

    // Validate input
    const body = await req.json()
    const data = generateBookSchema.parse(body)

    // Create book project
    const bookProject = await prisma.bookProject.create({
      data: {
        userId: user.id,
        title: data.title,
        subtitle: data.subtitle,
        authorName: data.authorName,
        inputType: data.inputType,
        inputContent: data.inputContent,
        targetWordCount: data.targetWordCount,
        genre: data.genre,
        targetAudience: data.targetAudience,
        language: data.language,
        status: 'generating',
        generationProgress: 0,
        generationStartedAt: new Date(),
      },
    })

    // Update user book count
    await prisma.user.update({
      where: { id: user.id },
      data: { booksGeneratedCount: { increment: 1 } },
    })

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: user.id,
        bookProjectId: bookProject.id,
        action: 'book_generation_started',
        description: `Started generating "${data.title}"`,
        metadata: { inputType: data.inputType },
      },
    })

    // Queue book generation job
    await bookGenerationQueue.add(
      'generate-complete-book',
      {
        bookProjectId: bookProject.id,
        userId: user.id,
        config: {
          targetWordCount: data.targetWordCount,
          genre: data.genre,
          language: data.language,
        },
      },
      {
        priority: user.subscriptionTier === 'enterprise' ? 1 : user.subscriptionTier === 'professional' ? 2 : 3,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      }
    )

    return NextResponse.json(
      {
        success: true,
        bookProject: {
          id: bookProject.id,
          title: bookProject.title,
          status: bookProject.status,
          generationProgress: bookProject.generationProgress,
        },
        message: 'Book generation started. This may take 5-10 minutes.',
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 })
    }

    console.error('Book generation error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to start book generation' },
      { status: 500 }
    )
  }
}
