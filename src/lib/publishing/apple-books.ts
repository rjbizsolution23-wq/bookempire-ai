/**
 * Apple Books Integration
 * 
 * NOTE: Apple Books requires iTunes Connect access and approval.
 * This provides helper functions for Apple Books publishing.
 * 
 * Requirements:
 * 1. Apple ID enrolled in Apple Books for Authors
 * 2. Books must pass Apple's content guidelines
 * 3. EPUB 3.0 format with specific requirements
 * 4. High-resolution cover (at least 1400px on shortest side)
 */

import { BookProject, BookChapter } from '@prisma/client'

export interface AppleBooksMetadata {
  title: string
  author: string
  description: string
  publisher: string
  language: string
  publicationDate: Date
  isbn?: string
  price: number
  categories: string[]
  keywords: string[]
  ageRating: string
}

export async function prepareAppleBooksExport(
  book: BookProject & { chapters: BookChapter[] }
): Promise<AppleBooksMetadata> {
  const keywords = book.seoKeywords?.split(',').map((k) => k.trim()) || []

  return {
    title: book.title,
    author: book.authorName,
    description: book.description || '',
    publisher: 'BookEmpire AI',
    language: 'en',
    publicationDate: new Date(),
    price: 9.99,
    categories: [book.genre || 'General'],
    keywords: keywords.slice(0, 10),
    ageRating: '12+', // Default rating
  }
}

export async function validateEPUBForAppleBooks(epubBuffer: Buffer): Promise<{
  valid: boolean
  errors: string[]
  warnings: string[]
}> {
  // Basic validation rules for Apple Books
  const errors: string[] = []
  const warnings: string[] = []

  // Check file size (Apple Books limit: 2GB)
  const fileSizeMB = epubBuffer.length / (1024 * 1024)
  if (fileSizeMB > 2048) {
    errors.push('File size exceeds 2GB limit')
  } else if (fileSizeMB > 1024) {
    warnings.push('File size is large (>1GB), consider optimizing images')
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}

export function getAppleBooksPublishingInstructions(bookId: string): string {
  return `
# Apple Books Publishing Instructions

## Requirements
- Apple ID enrolled in Apple Books for Authors
- EPUB 3.0 format file
- High-resolution cover image (minimum 1400px shortest side)
- ISBN (optional but recommended)

## Step 1: Download Files
- Download your book's EPUB file
- Download your book's cover image

## Step 2: Access Apple Books for Authors
Visit: https://authors.apple.com

## Step 3: Validate Your EPUB
1. Download Apple's EPUBCheck tool
2. Validate your EPUB file
3. Fix any errors before proceeding

## Step 4: Upload Book
1. Sign in to iTunes Connect
2. Click "My Books"
3. Click the "+" button to add a new book
4. Fill in metadata
5. Upload EPUB file
6. Upload cover image

## Step 5: Set Pricing & Territories
- Select pricing tier
- Choose territories for distribution
- Set pre-order options (if applicable)

## Step 6: Submit for Review
- Review all information
- Click "Submit for Review"

Apple typically reviews books within 1-3 business days.

Book ID: ${bookId}

## Tips for Approval
- Ensure content meets Apple's guidelines
- Use high-quality images
- Check for formatting issues
- Test on multiple devices if possible
  `.trim()
}

export interface PublishingPlatform {
  name: string
  requiresApproval: boolean
  typicalApprovalTime: string
  royaltyRate: string
  fileFormats: string[]
  supportedTerritories: string[]
}

export const platforms: PublishingPlatform[] = [
  {
    name: 'Amazon KDP',
    requiresApproval: true,
    typicalApprovalTime: '24-48 hours',
    royaltyRate: 'Up to 70%',
    fileFormats: ['EPUB', 'MOBI', 'PDF'],
    supportedTerritories: ['Worldwide'],
  },
  {
    name: 'Apple Books',
    requiresApproval: true,
    typicalApprovalTime: '1-3 business days',
    royaltyRate: '70%',
    fileFormats: ['EPUB 3.0'],
    supportedTerritories: ['50+ countries'],
  },
  {
    name: 'Google Play Books',
    requiresApproval: true,
    typicalApprovalTime: '1-2 business days',
    royaltyRate: '52-70%',
    fileFormats: ['EPUB', 'PDF'],
    supportedTerritories: ['Worldwide'],
  },
  {
    name: 'Barnes & Noble Press',
    requiresApproval: true,
    typicalApprovalTime: '24-72 hours',
    royaltyRate: 'Up to 70%',
    fileFormats: ['EPUB'],
    supportedTerritories: ['US, UK'],
  },
]
