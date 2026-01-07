import Link from 'next/link'
import { ArrowRight, BookOpen, Zap, Image, FileText, TrendingUp, Check } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            <span className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BookEmpire AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Pricing
            </Link>
            <Link href="/sign-in" className="text-gray-700 hover:text-indigo-600 transition-colors">
              Log In
            </Link>
            <Link
              href="/sign-up"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Zap className="w-4 h-4" />
              Generate complete books in minutes, not months
            </div>
            <h1 className="text-6xl md:text-8xl font-black mb-6">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-gray-900">Book Empire</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform any idea into a complete, production-ready book with ultra-realistic covers,
              50,000+ word manuscripts, and instant publishing capabilities. No writing required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/sign-up"
                className="text-lg px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-2xl transition-all inline-flex items-center justify-center"
              >
                Generate Your First Book Free <ArrowRight className="ml-2" />
              </Link>
              <Link
                href="#demo"
                className="text-lg px-10 py-4 border-2 border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all inline-flex items-center justify-center"
              >
                Watch Live Demo
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {[
                { label: 'Books Generated', value: '15,847+' },
                { label: 'Active Authors', value: '3,291+' },
                { label: 'Total Words', value: '892M+' },
                { label: 'Avg Generation Time', value: '7 min' },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                >
                  <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto px-4 py-20 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              Everything You Need to Build a{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Book Empire
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete book creation system with zero human intervention required
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 border-transparent hover:border-indigo-200"
              >
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="text-white" size={28} />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-4">{feature.description}</p>
                {feature.details && (
                  <ul className="space-y-2">
                    {feature.details.map((detail, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4">
              Simple,{' '}
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Transparent Pricing
              </span>
            </h2>
            <p className="text-xl text-gray-600">
              Start free, scale as you grow your book empire
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <div
                key={i}
                className={`relative bg-white p-10 rounded-3xl shadow-xl ${
                  tier.featured
                    ? 'ring-4 ring-indigo-600 scale-105 z-10'
                    : 'hover:shadow-2xl'
                } transition-all duration-300`}
              >
                {tier.featured && (
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2 text-gray-900">{tier.name}</h3>
                  <div className="flex items-baseline justify-center gap-2 mb-4">
                    <span className="text-5xl font-black text-gray-900">${tier.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600">{tier.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/sign-up"
                  className={`block w-full py-4 text-center text-lg rounded-lg transition-all ${
                    tier.featured
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl'
                      : 'bg-gray-900 text-white hover:bg-gray-800'
                  }`}
                >
                  {tier.cta}
                </Link>

                {tier.additionalInfo && (
                  <p className="text-center text-sm text-gray-500 mt-4">{tier.additionalInfo}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
          <h2 className="text-4xl md:text-6xl font-black mb-6">
            Ready to Build Your Book Empire?
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Join 3,000+ authors generating complete books in minutes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="bg-white text-indigo-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-all inline-flex items-center justify-center"
            >
              Start Free Trial <ArrowRight className="ml-2" />
            </Link>
          </div>
          <p className="text-sm mt-6 opacity-75">
            No credit card required • Generate your first book free • Cancel anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BookOpen className="w-6 h-6" />
                <span className="text-xl font-bold">BookEmpire AI</span>
              </div>
              <p className="text-gray-400 text-sm">
                The world&apos;s most advanced AI book creation platform.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/features" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/pricing" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/docs" className="hover:text-white transition-colors">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/about" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm text-gray-400">
            <p>© 2026 RJ Business Solutions. Built by Rick Jefferson.</p>
            <p className="mt-2">Powered by Supreme AI Technology</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

const features = [
  {
    icon: Zap,
    title: 'Instant Generation',
    description: 'Complete 50,000+ word manuscripts generated in 5-10 minutes',
    details: [
      'AI-powered content creation',
      'Zero human intervention required',
      'Professional writing quality',
      'Customizable tone and style',
    ],
  },
  {
    icon: Image,
    title: 'Ultra-Realistic Covers',
    description: 'Professional book covers that rival top bestsellers',
    details: [
      'AI design technology',
      'Multiple design variations',
      'Print-ready 300+ DPI',
      'Front, back, and spine designs',
    ],
  },
  {
    icon: FileText,
    title: 'Multi-Format Export',
    description: 'Instant PDF, EPUB, and MOBI files ready for all platforms',
    details: [
      'Amazon KDP compliance',
      'Apple Books formatting',
      'Google Play optimization',
      'Universal compatibility',
    ],
  },
  {
    icon: TrendingUp,
    title: 'SEO Optimization',
    description: 'Automatic keyword research and metadata optimization',
    details: [
      'Competitive keyword analysis',
      'Category recommendations',
      'Amazon ranking optimization',
      'Discoverability enhancement',
    ],
  },
  {
    icon: BookOpen,
    title: 'Research Integration',
    description: 'Access to millions of academic papers and research',
    details: [
      'arXiv, Semantic Scholar, PubMed',
      'Automatic citation generation',
      'Fact verification',
      'Authority building',
    ],
  },
  {
    icon: TrendingUp,
    title: 'Publishing Pipeline',
    description: 'Direct integration with major publishing platforms',
    details: [
      'One-click Amazon KDP',
      'Apple Books connect',
      'Sales tracking dashboard',
      'Revenue analytics',
    ],
  },
]

const pricingTiers = [
  {
    name: 'Starter',
    price: 0,
    description: 'Perfect for trying out BookEmpire AI',
    features: [
      '3 books per month',
      'Up to 50,000 words per book',
      'Basic cover designs',
      'PDF export only',
      'Email support',
      'Community access',
    ],
    cta: 'Start Free',
    featured: false,
    additionalInfo: 'No credit card required',
  },
  {
    name: 'Professional',
    price: 97,
    description: 'For serious authors building their catalog',
    features: [
      '50 books per month',
      'Up to 150,000 words per book',
      'Ultra-realistic covers',
      'PDF, EPUB, MOBI exports',
      'Priority support',
      'Advanced SEO optimization',
      'Publishing integrations',
      'Sales analytics',
    ],
    cta: 'Start 14-Day Free Trial',
    featured: true,
    additionalInfo: 'Most popular plan',
  },
  {
    name: 'Enterprise',
    price: 497,
    description: 'For publishers and agencies',
    features: [
      'Unlimited books',
      'Unlimited words',
      'White-label options',
      'All export formats',
      'Dedicated account manager',
      'Custom AI training',
      'API access',
      'Team collaboration',
      'Advanced analytics',
    ],
    cta: 'Contact Sales',
    featured: false,
    additionalInfo: 'Custom solutions available',
  },
]
