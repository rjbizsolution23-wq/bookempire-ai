import PDFDocument from 'pdfkit'
import { BookProject, BookChapter } from '@prisma/client'

export async function generatePDF(
  book: BookProject & { chapters: BookChapter[] }
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'letter',
      margins: {
        top: 72,
        bottom: 72,
        left: 72,
        right: 72,
      },
    })

    const buffers: Buffer[] = []

    doc.on('data', buffers.push.bind(buffers))
    doc.on('end', () => {
      const pdfBuffer = Buffer.concat(buffers)
      resolve(pdfBuffer)
    })
    doc.on('error', reject)

    // Title page
    doc
      .fontSize(36)
      .font('Helvetica-Bold')
      .text(book.title, {
        align: 'center',
      })
      .moveDown(2)

    doc
      .fontSize(18)
      .font('Helvetica')
      .text(`by ${book.authorName}`, {
        align: 'center',
      })
      .moveDown(4)

    // Description
    if (book.description) {
      doc
        .fontSize(12)
        .font('Helvetica')
        .text(book.description, {
          align: 'justify',
        })
        .moveDown(2)
    }

    // Add page break
    doc.addPage()

    // Table of contents
    doc
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('Table of Contents', { align: 'center' })
      .moveDown(2)

    book.chapters.forEach((chapter, index) => {
      doc
        .fontSize(12)
        .font('Helvetica')
        .text(`${index + 1}. ${chapter.title}`, {
          continued: true,
        })
        .text(` ....... ${index + 3}`, { align: 'right' })
        .moveDown(0.5)
    })

    // Chapters
    book.chapters.forEach((chapter, index) => {
      doc.addPage()

      // Chapter title
      doc
        .fontSize(28)
        .font('Helvetica-Bold')
        .text(`Chapter ${chapter.chapterNumber}`, {
          align: 'center',
        })
        .moveDown(0.5)

      doc
        .fontSize(20)
        .font('Helvetica-Bold')
        .text(chapter.title, {
          align: 'center',
        })
        .moveDown(2)

      // Chapter content
      const content = chapter.content || ''
      const paragraphs = content.split('\n\n')

      paragraphs.forEach((paragraph) => {
        if (paragraph.trim()) {
          doc
            .fontSize(12)
            .font('Helvetica')
            .text(paragraph.trim(), {
              align: 'justify',
              lineGap: 5,
            })
            .moveDown(1)
        }
      })
    })

    // Footer on each page
    const pageCount = doc.bufferedPageRange().count
    for (let i = 0; i < pageCount; i++) {
      doc.switchToPage(i)

      // Skip footer on title page
      if (i === 0) continue

      doc
        .fontSize(10)
        .font('Helvetica')
        .text(
          `${book.title} - ${i + 1}`,
          72,
          doc.page.height - 50,
          {
            align: 'center',
          }
        )
    }

    doc.end()
  })
}
