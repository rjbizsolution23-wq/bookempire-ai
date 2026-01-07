import Epub from 'epub-gen'
import { BookProject, BookChapter } from '@prisma/client'

export async function generateEPUB(
  book: BookProject & { chapters: BookChapter[] }
): Promise<Buffer> {
  const content = book.chapters.map((chapter) => ({
    title: chapter.title,
    data: `
      <h1>Chapter ${chapter.chapterNumber}: ${chapter.title}</h1>
      ${(chapter.content || '')
        .split('\n\n')
        .map((p) => `<p>${p}</p>`)
        .join('\n')}
    `,
  }))

  const options = {
    title: book.title,
    author: book.authorName,
    publisher: 'BookEmpire AI',
    description: book.description || '',
    cover: book.coverImageUrl || undefined,
    content,
    verbose: false,
  }

  return new Promise((resolve, reject) => {
    const epub = new Epub(options, '/tmp/' + book.id + '.epub')

    epub.promise
      .then(() => {
        const fs = require('fs')
        const buffer = fs.readFileSync('/tmp/' + book.id + '.epub')
        fs.unlinkSync('/tmp/' + book.id + '.epub')
        resolve(buffer)
      })
      .catch(reject)
  })
}
