import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/db'
import { Book, TrendingUp, Clock, DollarSign } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Fetch user's data
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: {
      books: {
        orderBy: { createdAt: 'desc' },
        take: 5,
      },
      subscription: true,
    },
  })

  if (!dbUser) {
    // Create user if doesn't exist
    await prisma.user.create({
      data: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
      },
    })
  }

  // Calculate statistics
  const totalBooks = await prisma.bookProject.count({
    where: { userId: dbUser?.id },
  })

  const completedBooks = await prisma.bookProject.count({
    where: { userId: dbUser?.id, status: 'COMPLETED' },
  })

  const totalWords = await prisma.bookProject.aggregate({
    where: { userId: dbUser?.id },
    _sum: { wordCount: true },
  })

  const stats = [
    {
      label: 'Total Books',
      value: totalBooks,
      icon: Book,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      label: 'Completed',
      value: completedBooks,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      label: 'Total Words',
      value: (totalWords._sum.wordCount || 0).toLocaleString(),
      icon: Clock,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      label: 'Books Remaining',
      value: dbUser?.booksRemaining || 0,
      icon: DollarSign,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your book empire.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`rounded-full p-3 ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Ready to create your next bestseller?</h2>
        <p className="text-cyan-100 mb-6">
          Generate a complete, professional book in just minutes with our AI-powered platform.
        </p>
        <Link
          href="/books/new"
          className="inline-flex items-center gap-2 bg-white text-cyan-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          <Book className="h-5 w-5" />
          Generate New Book
        </Link>
      </div>

      {/* Recent Books */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Recent Books</h2>
          <Link
            href="/books"
            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
          >
            View all →
          </Link>
        </div>

        {dbUser?.books && dbUser.books.length > 0 ? (
          <div className="grid gap-4">
            {dbUser.books.map((book) => (
              <Link
                key={book.id}
                href={`/books/${book.id}`}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-900">{book.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{book.description}</p>
                    <div className="flex items-center gap-4 mt-3">
                      <span className="text-xs text-gray-500">
                        {book.wordCount?.toLocaleString()} words
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(book.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
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
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
            <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books yet</h3>
            <p className="text-gray-600 mb-6">
              Start building your book empire by generating your first book!
            </p>
            <Link
              href="/books/new"
              className="inline-flex items-center gap-2 bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-cyan-700 transition-colors"
            >
              <Book className="h-5 w-5" />
              Generate Your First Book
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
