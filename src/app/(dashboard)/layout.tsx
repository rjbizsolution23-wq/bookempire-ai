import { ClerkProvider, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { Book, LayoutDashboard, Settings, CreditCard, FileText } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await currentUser()

  if (!user) {
    redirect('/sign-in')
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/books', label: 'My Books', icon: Book },
    { href: '/books/new', label: 'Generate Book', icon: FileText },
    { href: '/billing', label: 'Billing', icon: CreditCard },
    { href: '/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-gray-200 bg-white">
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Book className="h-8 w-8 text-cyan-600" />
            <span className="text-xl font-bold">BookEmpire</span>
          </Link>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <UserButton afterSignOutUrl="/" />
              <div className="flex flex-col">
                <span className="text-sm font-medium">{user.firstName}</span>
                <span className="text-xs text-gray-500">{user.emailAddresses[0]?.emailAddress}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 min-h-screen">
        <div className="h-16 border-b border-gray-200 bg-white px-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">BookEmpire AI</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Welcome back, {user.firstName}!
            </span>
          </div>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
