import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth()
    const { id } = await params

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const book = await prisma.bookProject.findFirst({
      where: {
        id,
        userId: user.id,
      },
      include: {
        chapters: {
          select: {
            id: true,
            chapterNumber: true,
            title: true,
            status: true,
            wordCount: true,
          },
          orderBy: { chapterNumber: 'asc' },
        },
        covers: {
          select: {
            id: true,
            coverType: true,
            imageUrl: true,
            thumbnailUrl: true,
            isSelected: true,
          },
        },
        publishingPlatforms: {
          select: {
            id: true,
            platform: true,
            publishStatus: true,
            url: true,
            totalSalesCount: true,
            totalRevenueCents: true,
          },
        },
      },
    })

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 })
    }

    return NextResponse.json(book)
  } catch (error) {
    console.error('Error fetching book:', error)
    return NextResponse.json({ error: 'Failed to fetch book' }, { status: 500 })
  }
}
