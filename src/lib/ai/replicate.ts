import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export interface GenerateCoverOptions {
  title: string
  authorName: string
  genre?: string
  style?: string
}

export async function generateBookCover(options: GenerateCoverOptions): Promise<string> {
  const { title, authorName, genre, style = 'professional book cover' } = options

  const prompt = `Professional book cover design for "${title}" by ${authorName}. 
${genre ? `Genre: ${genre}.` : ''} 
${style}. 
High quality, ultra-realistic, bestseller aesthetic, modern typography, eye-catching design, professional publishing standard.`

  try {
    const output = await replicate.run(
      "stability-ai/sdxl:39ed52f2a78e934b3ba6e2a89f5b1c712de7dfea535525255b1aa35c5565e08b",
      {
        input: {
          prompt,
          width: 1024,
          height: 1536,
          num_outputs: 1,
          scheduler: "K_EULER",
          num_inference_steps: 50,
          guidance_scale: 7.5,
          prompt_strength: 0.8,
          refine: "expert_ensemble_refiner",
          high_noise_frac: 0.8,
        }
      }
    ) as string[]

    return output[0] || ''
  } catch (error) {
    console.error('Error generating book cover:', error)
    throw new Error('Failed to generate book cover')
  }
}

export async function generateMultipleCovers(
  options: GenerateCoverOptions,
  count: number = 3
): Promise<string[]> {
  const covers: string[] = []
  
  for (let i = 0; i < count; i++) {
    try {
      const cover = await generateBookCover({
        ...options,
        style: i === 0 ? 'professional minimalist' : 
               i === 1 ? 'bold modern design' : 
               'elegant classic style'
      })
      covers.push(cover)
    } catch (error) {
      console.error(`Failed to generate cover ${i + 1}:`, error)
    }
  }
  
  return covers
}

export default replicate
