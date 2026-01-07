import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'
import { generatePDF } from '@/lib/export/pdf'
import { generateEPUB } from '@/lib/export/epub'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await currentUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Get format from query params
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'pdf'

    // Fetch book with chapters
    const book = await prisma.bookProject.findUnique({
      where: {
        id: params.id,
        userId: dbUser.id,
      },
      include: {
        chapters: {
          orderBy: { chapterNumber: 'asc' },
        },
      },
    })

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    if (book.status !== 'COMPLETED') {
      return NextResponse.json(
        { error: 'Book generation not completed yet' },
        { status: 400 }
      )
    }

    let buffer: Buffer
    let mimeType: string
    let filename: string

    switch (format.toLowerCase()) {
      case 'pdf':
        buffer = await generatePDF(book)
        mimeType = 'application/pdf'
        filename = `${book.title.replace(/[^a-z0-9]/gi, '_')}.pdf`
        break

      case 'epub':
        buffer = await generateEPUB(book)
        mimeType = 'application/epub+zip'
        filename = `${book.title.replace(/[^a-z0-9]/gi, '_')}.epub`
        break

      case 'docx':
        // TODO: Implement DOCX export
        return NextResponse.json(
          { error: 'DOCX export coming soon' },
          { status: 501 }
        )

      case 'mobi':
        // TODO: Implement MOBI export (convert from EPUB)
        return NextResponse.json(
          { error: 'MOBI export coming soon' },
          { status: 501 }
        )

      default:
        return NextResponse.json(
          { error: 'Invalid export format' },
          { status: 400 }
        )
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: dbUser.id,
        action: 'EXPORT_BOOK',
        entityType: 'BOOK',
        entityId: book.id,
        metadata: { format },
      },
    })

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': mimeType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json(
      { error: 'Failed to export book' },
      { status: 500 }
    )
  }
}
