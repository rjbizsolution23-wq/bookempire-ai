import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface GenerateChapterOptions {
  bookTitle: string
  chapterNumber: number
  chapterTitle: string
  outline: string
  targetWordCount: number
  genre?: string
  previousChapterSummary?: string
}

export async function generateChapter(options: GenerateChapterOptions): Promise<string> {
  const {
    bookTitle,
    chapterNumber,
    chapterTitle,
    outline,
    targetWordCount,
    genre,
    previousChapterSummary
  } = options

  const prompt = `You are a professional author writing a ${genre || 'non-fiction'} book titled "${bookTitle}".

Write Chapter ${chapterNumber}: "${chapterTitle}"

Outline: ${outline}

${previousChapterSummary ? `Previous chapter summary: ${previousChapterSummary}` : ''}

Requirements:
- Target word count: ${targetWordCount} words
- Professional, engaging writing style
- Clear structure with subheadings
- Include relevant examples and explanations
- Smooth transitions between sections
- Natural conclusion that leads to the next chapter

Write the complete chapter content now:`

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are a professional author who writes engaging, well-structured book chapters.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: Math.min(targetWordCount * 2, 4000),
  })

  return response.choices[0]?.message?.content || ''
}

export interface GenerateOutlineOptions {
  title: string
  subtitle?: string
  inputContent: string
  targetWordCount: number
  genre?: string
  numberOfChapters?: number
}

export async function generateBookOutline(options: GenerateOutlineOptions): Promise<{
  chapters: Array<{
    number: number
    title: string
    outline: string
    targetWordCount: number
  }>
}> {
  const {
    title,
    subtitle,
    inputContent,
    targetWordCount,
    genre,
    numberOfChapters = Math.ceil(targetWordCount / 5000)
  } = options

  const prompt = `Create a detailed outline for a ${genre || 'non-fiction'} book:

Title: ${title}
${subtitle ? `Subtitle: ${subtitle}` : ''}

Book concept: ${inputContent}

Requirements:
- Total target word count: ${targetWordCount}
- Number of chapters: ${numberOfChapters}
- Each chapter should have a clear purpose and outline
- Logical progression from chapter to chapter

Provide the outline in this JSON format:
{
  "chapters": [
    {
      "number": 1,
      "title": "Chapter Title",
      "outline": "Detailed outline of what this chapter covers",
      "targetWordCount": 5000
    }
  ]
}

Generate the complete book outline now:`

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an expert book planner and outline creator. Always respond with valid JSON.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.8,
    max_tokens: 3000,
    response_format: { type: 'json_object' }
  })

  const content = response.choices[0]?.message?.content || '{}'
  return JSON.parse(content)
}

export async function generateSEOKeywords(options: {
  title: string
  content: string
  genre?: string
}): Promise<string[]> {
  const { title, content, genre } = options

  const prompt = `Analyze this book and generate 10-15 SEO-optimized keywords for Amazon and book stores:

Title: ${title}
Genre: ${genre || 'General'}
Content excerpt: ${content.slice(0, 2000)}

Generate keywords that:
- Are relevant to the book content
- Have high search volume
- Are commonly used by readers
- Mix broad and specific terms
- Include genre-specific keywords

Return as JSON array of strings: ["keyword1", "keyword2", ...]`

  const response = await openai.chat.completions.create({
    model: 'gpt-4-turbo-preview',
    messages: [
      {
        role: 'system',
        content: 'You are an SEO expert specializing in book marketing. Always respond with valid JSON.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 500,
    response_format: { type: 'json_object' }
  })

  const content_text = response.choices[0]?.message?.content || '{"keywords":[]}'
  const parsed = JSON.parse(content_text)
  return parsed.keywords || []
}

export default openai
