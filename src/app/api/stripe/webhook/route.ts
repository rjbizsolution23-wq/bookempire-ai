import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { prisma } from '@/lib/db'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      await handleCheckoutCompleted(session)
      break
    }

    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionUpdate(subscription)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await handleSubscriptionDeleted(subscription)
      break
    }

    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice
      await handleInvoicePaymentSucceeded(invoice)
      break
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      await handleInvoicePaymentFailed(invoice)
      break
    }

    default:
      console.log(`Unhandled event type: ${event.type}`)
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId

  if (!userId) {
    console.error('No userId in session metadata')
    return
  }

  // Get subscription details
  const subscription = await stripe.subscriptions.retrieve(
    session.subscription as string
  )

  // Update or create subscription record
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0]?.price.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0]?.price.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
    },
  })

  // Update user's plan
  const planName = session.metadata?.planName || 'free'
  const booksRemaining =
    planName === 'professional' ? 50 : planName === 'enterprise' ? 999999 : 3

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: planName,
      booksRemaining,
    },
  })

  // Log payment
  await prisma.payment.create({
    data: {
      userId,
      amount: (session.amount_total || 0) / 100,
      currency: session.currency || 'usd',
      status: 'succeeded',
      stripePaymentId: session.payment_intent as string,
    },
  })
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const customer = await stripe.customers.retrieve(customerId)

  if (customer.deleted) return

  const userId = customer.metadata?.userId

  if (!userId) {
    console.error('No userId in customer metadata')
    return
  }

  await prisma.subscription.upsert({
    where: { userId },
    update: {
      status: subscription.status,
      priceId: subscription.items.data[0]?.price.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
    create: {
      userId,
      stripeSubscriptionId: subscription.id,
      status: subscription.status,
      priceId: subscription.items.data[0]?.price.id,
      currentPeriodStart: new Date(subscription.current_period_start * 1000),
      currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
    },
  })
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string
  const customer = await stripe.customers.retrieve(customerId)

  if (customer.deleted) return

  const userId = customer.metadata?.userId

  if (!userId) return

  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'canceled',
      canceledAt: new Date(),
    },
  })

  // Revert to free tier
  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionTier: 'free',
      booksRemaining: 3,
    },
  })
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const customer = await stripe.customers.retrieve(customerId)

  if (customer.deleted) return

  const userId = customer.metadata?.userId

  if (!userId) return

  // Log payment
  await prisma.payment.create({
    data: {
      userId,
      amount: (invoice.amount_paid || 0) / 100,
      currency: invoice.currency || 'usd',
      status: 'succeeded',
      stripePaymentId: invoice.payment_intent as string,
    },
  })

  // Reset monthly quota
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  })

  const booksRemaining =
    user?.subscriptionTier === 'professional'
      ? 50
      : user?.subscriptionTier === 'enterprise'
      ? 999999
      : 3

  await prisma.user.update({
    where: { id: userId },
    data: { booksRemaining },
  })
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string
  const customer = await stripe.customers.retrieve(customerId)

  if (customer.deleted) return

  const userId = customer.metadata?.userId

  if (!userId) return

  // Log failed payment
  await prisma.payment.create({
    data: {
      userId,
      amount: (invoice.amount_due || 0) / 100,
      currency: invoice.currency || 'usd',
      status: 'failed',
      stripePaymentId: invoice.payment_intent as string,
    },
  })

  // TODO: Send email notification about failed payment
}
