import { currentUser } from '@clerk/nextjs/server'
import { redirect, notFound } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import Image from 'next/image'
import { Book, Download, Edit, Share2, FileText, Clock, CheckCircle } from 'lucide-react'

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  })

  if (!dbUser) {
    redirect('/dashboard')
  }

  const book = await prisma.bookProject.findUnique({
    where: { id: params.id, userId: dbUser.id },
    include: {
      chapters: {
        orderBy: { chapterNumber: 'asc' },
      },
      covers: true,
      citations: {
        include: {
          researchPaper: true,
        },
      },
    },
  })

  if (!book) {
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/books"
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to Books
            </Link>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                book.status === 'COMPLETED'
                  ? 'bg-green-100 text-green-700'
                  : book.status === 'GENERATING'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {book.status}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
          <p className="text-gray-600 mt-1">by {book.authorName}</p>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Edit className="h-4 w-4" />
            Edit
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Share2 className="h-4 w-4" />
            Share
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700">
            <Download className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>

      {/* Book Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Cover & Stats */}
        <div className="space-y-6">
          {/* Cover */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-[3/4] bg-gradient-to-br from-cyan-500 to-blue-600 relative">
              {book.covers[0]?.imageUrl ? (
                <Image
                  src={book.covers[0].imageUrl}
                  alt={book.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Book className="h-24 w-24 text-white/50" />
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
            <h3 className="font-semibold text-gray-900">Book Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Chapters</span>
                <span className="text-sm font-medium text-gray-900">
                  {book.chapters.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Word Count</span>
                <span className="text-sm font-medium text-gray-900">
                  {book.wordCount?.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Genre</span>
                <span className="text-sm font-medium text-gray-900">{book.genre}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Created</span>
                <span className="text-sm font-medium text-gray-900">
                  {new Date(book.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Export Options */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-3">
            <h3 className="font-semibold text-gray-900">Export Formats</h3>
            <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">PDF</span>
              <Download className="h-4 w-4" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">EPUB</span>
              <Download className="h-4 w-4" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">MOBI</span>
              <Download className="h-4 w-4" />
            </button>
            <button className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium">DOCX</span>
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Column - Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{book.description}</p>
          </div>

          {/* Chapters */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Chapters</h3>
              <span className="text-sm text-gray-600">
                {book.chapters.length} chapters
              </span>
            </div>

            <div className="space-y-2">
              {book.chapters.map((chapter) => (
                <Link
                  key={chapter.id}
                  href={`/books/${book.id}/chapters/${chapter.id}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-cyan-100 text-cyan-700 font-semibold text-sm">
                      {chapter.chapterNumber}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{chapter.title}</h4>
                      <p className="text-sm text-gray-600">
                        {chapter.wordCount?.toLocaleString()} words
                      </p>
                    </div>
                  </div>
                  <FileText className="h-5 w-5 text-gray-400" />
                </Link>
              ))}
            </div>
          </div>

          {/* Cover Variants */}
          {book.covers.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Cover Variants</h3>
              <div className="grid grid-cols-3 gap-4">
                {book.covers.map((cover) => (
                  <div
                    key={cover.id}
                    className="aspect-[3/4] bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg overflow-hidden relative group"
                  >
                    {cover.imageUrl && (
                      <Image
                        src={cover.imageUrl}
                        alt={`Cover ${cover.variantNumber}`}
                        fill
                        className="object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button className="px-4 py-2 bg-white text-gray-900 rounded-lg text-sm font-medium">
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Generation Progress */}
          {book.status === 'GENERATING' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <div className="flex-1">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Generating your book...
                  </h3>
                  <p className="text-sm text-blue-700">
                    Your book is being generated. This typically takes 5-10 minutes. We'll
                    notify you when it's ready!
                  </p>
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <CheckCircle className="h-4 w-4" />
                      Outline created
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-700">
                      <Clock className="h-4 w-4 animate-pulse" />
                      Generating chapters...
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
