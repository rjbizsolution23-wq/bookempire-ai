import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import Link from 'next/link'
import { Book, Plus, Search, Filter } from 'lucide-react'
import Image from 'next/image'

export default async function BooksPage() {
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

  const books = await prisma.bookProject.findMany({
    where: { userId: dbUser.id },
    include: {
      covers: {
        take: 1,
      },
      chapters: {
        select: { id: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Books</h1>
          <p className="text-gray-600 mt-1">
            Manage and view all your generated books
          </p>
        </div>
        <Link
          href="/books/new"
          className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Generate New Book
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search books..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="h-5 w-5" />
          Filter
        </button>
      </div>

      {/* Books Grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map((book) => (
            <Link
              key={book.id}
              href={`/books/${book.id}`}
              className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Cover Image */}
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
                    <Book className="h-16 w-16 text-white/50" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      book.status === 'COMPLETED'
                        ? 'bg-green-500 text-white'
                        : book.status === 'GENERATING'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    {book.status}
                  </span>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-4">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-2">
                  {book.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {book.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{book.chapters.length} chapters</span>
                  <span>{book.wordCount?.toLocaleString()} words</span>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  {new Date(book.createdAt).toLocaleDateString()}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Book className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No books yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't generated any books yet. Click the button above to create your first
            bestseller with AI!
          </p>
          <Link
            href="/books/new"
            className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            Generate Your First Book
          </Link>
        </div>
      )}

      {/* Stats Footer */}
      <div className="bg-gray-50 rounded-lg p-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-2xl font-bold text-gray-900">{books.length}</p>
          <p className="text-sm text-gray-600">Total Books</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {books.filter((b) => b.status === 'COMPLETED').length}
          </p>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {books.reduce((sum, b) => sum + (b.wordCount || 0), 0).toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Total Words</p>
        </div>
      </div>
    </div>
  )
}
