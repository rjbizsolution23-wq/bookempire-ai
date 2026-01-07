'use client'

import { useState, useEffect } from 'react'
import { Check, Zap, Crown, Sparkles } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const plans = [
  {
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      '3 books per month',
      'Basic cover designs',
      '30,000 word limit',
      'Community support',
      'Standard generation speed',
    ],
    icon: Sparkles,
    color: 'gray',
    popular: false,
  },
  {
    name: 'Professional',
    price: 97,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL,
    features: [
      '50 books per month',
      '3 premium cover variants',
      '100,000 word limit',
      'Priority generation',
      'SEO optimization',
      'Export to KDP/Apple Books',
      'Email support',
    ],
    icon: Zap,
    color: 'cyan',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 497,
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE,
    features: [
      'Unlimited books',
      'Custom cover design',
      'Unlimited word count',
      'Fastest generation',
      'White-label option',
      'Team collaboration (5 seats)',
      'API access',
      'Dedicated account manager',
      'Priority phone support',
    ],
    icon: Crown,
    color: 'purple',
    popular: false,
  },
]

export default function BillingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string | null, planName: string) => {
    if (!priceId) return

    setLoading(planName)

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, planName }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        alert('Failed to create checkout session')
        setLoading(null)
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Failed to start checkout')
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
        <p className="text-xl text-gray-600 mt-2">
          Unlock the full power of AI book generation
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`relative bg-white border-2 rounded-2xl p-8 ${
              plan.popular
                ? 'border-cyan-500 shadow-xl scale-105'
                : 'border-gray-200 shadow-sm'
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                  plan.color === 'cyan'
                    ? 'bg-cyan-100'
                    : plan.color === 'purple'
                    ? 'bg-purple-100'
                    : 'bg-gray-100'
                }`}
              >
                <plan.icon
                  className={`h-6 w-6 ${
                    plan.color === 'cyan'
                      ? 'text-cyan-600'
                      : plan.color === 'purple'
                      ? 'text-purple-600'
                      : 'text-gray-600'
                  }`}
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4">
                <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.priceId || '', plan.name.toLowerCase())}
              disabled={!plan.priceId || loading === plan.name.toLowerCase()}
              className={`w-full py-3 rounded-lg font-semibold transition-colors ${
                plan.popular
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700'
                  : plan.priceId
                  ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              } ${loading === plan.name.toLowerCase() ? 'opacity-50 cursor-wait' : ''}`}
            >
              {loading === plan.name.toLowerCase() ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Loading...
                </div>
              ) : plan.priceId ? (
                'Subscribe Now'
              ) : (
                'Current Plan'
              )}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto mt-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <details className="bg-white border border-gray-200 rounded-lg p-6">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Can I cancel anytime?
            </summary>
            <p className="text-gray-600 mt-2">
              Yes! You can cancel your subscription at any time. You'll continue to have access
              until the end of your billing period.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-6">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              What happens if I exceed my book limit?
            </summary>
            <p className="text-gray-600 mt-2">
              Your account will prompt you to upgrade to the next tier. Alternatively, you can
              wait until your quota resets at the start of the next billing cycle.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-6">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Do you offer refunds?
            </summary>
            <p className="text-gray-600 mt-2">
              We offer a 30-day money-back guarantee if you're not satisfied with our service.
              Just contact support for a full refund.
            </p>
          </details>

          <details className="bg-white border border-gray-200 rounded-lg p-6">
            <summary className="font-semibold text-gray-900 cursor-pointer">
              Can I upgrade or downgrade my plan?
            </summary>
            <p className="text-gray-600 mt-2">
              Yes! You can change your plan at any time. Upgrades take effect immediately, while
              downgrades take effect at the end of your current billing period.
            </p>
          </details>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-gray-50 rounded-lg p-8 max-w-4xl mx-auto">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-3xl font-bold text-gray-900">15,847+</p>
            <p className="text-gray-600 mt-1">Books Generated</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">3,291+</p>
            <p className="text-gray-600 mt-1">Active Authors</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">4.9/5</p>
            <p className="text-gray-600 mt-1">Customer Rating</p>
          </div>
        </div>
      </div>
    </div>
  )
}
