/**
 * Amazon KDP (Kindle Direct Publishing) Integration
 * 
 * NOTE: Amazon KDP does not have a public API for automated publishing.
 * This is a placeholder for manual KDP export functionality.
 * 
 * For automated publishing, you would need:
 * 1. Amazon KDP account with approved API access
 * 2. OAuth credentials from Amazon
 * 3. Book metadata preparation
 * 4. Cover image upload
 * 5. Manuscript file upload (EPUB or MOBI)
 */

import { BookProject, BookChapter } from '@prisma/client'

export interface KDPBookMetadata {
  title: string
  author: string
  description: string
  keywords: string[]
  categories: string[]
  language: string
  publicationDate?: Date
  isbn?: string
  price: number
  territories: string[]
}

export async function prepareKDPExport(
  book: BookProject & { chapters: BookChapter[] }
): Promise<KDPBookMetadata> {
  // Extract keywords from book content
  const keywords = book.seoKeywords?.split(',').map((k) => k.trim()) || []

  return {
    title: book.title,
    author: book.authorName,
    description: book.description || '',
    keywords: keywords.slice(0, 7), // KDP allows max 7 keywords
    categories: [book.genre || 'General'],
    language: 'en',
    price: 9.99, // Default price
    territories: ['WORLD'], // Worldwide distribution
  }
}

export async function generateKDPReadyFiles(
  book: BookProject & { chapters: BookChapter[] }
): Promise<{
  epub: Buffer
  metadata: KDPBookMetadata
  coverImage: string | null
}> {
  // Generate EPUB (KDP preferred format)
  const { generateEPUB } = await import('../export/epub')
  const epub = await generateEPUB(book)

  // Prepare metadata
  const metadata = await prepareKDPExport(book)

  return {
    epub,
    metadata,
    coverImage: book.coverImageUrl,
  }
}

/**
 * Manual KDP Publishing Instructions
 * 
 * To publish to Amazon KDP:
 * 1. Go to https://kdp.amazon.com
 * 2. Sign in with your Amazon account
 * 3. Click "Create New Title" > "Kindle eBook"
 * 4. Fill in metadata from the prepared data
 * 5. Upload the EPUB file
 * 6. Upload the cover image
 * 7. Set pricing and territories
 * 8. Preview the book
 * 9. Publish
 * 
 * Typical approval time: 24-48 hours
 */

export function getKDPPublishingInstructions(bookId: string): string {
  return `
# Amazon KDP Publishing Instructions

## Step 1: Download Required Files
- Download your book's EPUB file
- Download your book's cover image (minimum 1600x2560 pixels)

## Step 2: Go to Amazon KDP
Visit: https://kdp.amazon.com

## Step 3: Create New Title
1. Click "Create New Title"
2. Select "Kindle eBook"

## Step 4: Enter Book Details
Use the metadata provided in your export

## Step 5: Upload Files
- Upload the EPUB file
- Upload the cover image

## Step 6: Set Pricing
- Recommended: $2.99 - $9.99 for 70% royalty
- Select territories for distribution

## Step 7: Publish
- Preview your book
- Click "Publish Your Kindle eBook"

Your book will be live on Amazon within 24-48 hours!

Book ID: ${bookId}
  `.trim()
}
