# 🚀 BookEmpire AI - Deployment Guide

## Quick Deployment Checklist

### 1. Prerequisites
- [ ] Node.js 20+ installed
- [ ] Git installed
- [ ] GitHub account
- [ ] Vercel account
- [ ] Supabase account (or PostgreSQL instance)
- [ ] Upstash account (Redis)
- [ ] Clerk account (authentication)
- [ ] OpenAI API key
- [ ] Replicate API token
- [ ] Cloudflare R2 bucket

### 2. Database Setup (Supabase)

1. Go to https://supabase.com and create a new project
2. Copy your database connection string
3. Update `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```
4. Run migrations:
   ```bash
   npx prisma db push
   ```

### 3. Redis Setup (Upstash)

1. Go to https://upstash.com and create a Redis database
2. Copy the Redis URL
3. Update `.env`:
   ```env
   REDIS_URL="redis://default:[PASSWORD]@[HOST]:6379"
   ```

### 4. Authentication Setup (Clerk)

1. Go to https://clerk.com and create an application
2. Copy your publishable and secret keys
3. Update `.env`:
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_live_..."
   CLERK_SECRET_KEY="sk_live_..."
   ```
4. Configure redirect URLs in Clerk dashboard:
   - Sign-in URL: `/sign-in`
   - Sign-up URL: `/sign-up`
   - After sign-in: `/dashboard`

### 5. AI Services Setup

**OpenAI:**
1. Get API key from https://platform.openai.com/api-keys
2. Update `.env`:
   ```env
   OPENAI_API_KEY="sk-proj-..."
   ```

**Replicate:**
1. Get API token from https://replicate.com/account/api-tokens
2. Update `.env`:
   ```env
   REPLICATE_API_TOKEN="r8_..."
   ```

### 6. File Storage Setup (Cloudflare R2)

1. Create R2 bucket in Cloudflare dashboard
2. Generate API credentials
3. Update `.env`:
   ```env
   R2_ACCOUNT_ID="your-account-id"
   R2_ACCESS_KEY_ID="your-access-key"
   R2_SECRET_ACCESS_KEY="your-secret"
   R2_BUCKET_NAME="bookempire-files"
   ```

### 7. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Add environment variables in Vercel dashboard
# Go to: Project Settings > Environment Variables
# Add all variables from .env
```

### 8. Start Background Worker

For production, you need to run the worker separately:

**Option A: Vercel Serverless Functions** (Recommended)
- Workers automatically started by Vercel
- No additional setup needed

**Option B: Separate Server**
```bash
npm run worker:start
```

### 9. Post-Deployment Verification

- [ ] Visit your deployment URL
- [ ] Test user sign up
- [ ] Try generating a test book
- [ ] Check worker logs
- [ ] Verify file uploads to R2
- [ ] Test API endpoints

## Environment Variables for Production

Create these in Vercel dashboard:

```env
# Database
DATABASE_URL=postgresql://...

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding

# Redis
REDIS_URL=redis://...

# AI Services
OPENAI_API_KEY=sk-proj-...
REPLICATE_API_TOKEN=r8_...

# Cloudflare R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET_NAME=bookempire-files
R2_PUBLIC_URL=https://files.bookempire.ai

# Stripe (when ready)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# Application
NEXT_PUBLIC_APP_URL=https://bookempire.ai
NODE_ENV=production
```

## Troubleshooting

**Build fails on Vercel:**
- Check all environment variables are set
- Verify Node.js version (should be 20+)
- Check build logs for specific errors

**Database connection issues:**
- Verify DATABASE_URL is correct
- Check if database allows connections from Vercel IPs
- Try running `npx prisma db push` locally first

**Worker not processing jobs:**
- Verify REDIS_URL is correct
- Check worker logs
- Ensure worker is running separately if not using Vercel

**Cover generation fails:**
- Verify Replicate API token
- Check API quota/credits
- Review Replicate logs

## Cost Estimates

**Free Tier (Development):**
- Vercel: Free (hobby plan)
- Supabase: Free (500MB, 2 CPU hours)
- Upstash: Free (10K commands/day)
- Cloudflare R2: Free (10GB storage)

**Paid Services:**
- OpenAI: ~$4-6 per book
- Replicate: ~$0.50 per cover
- **Total per book: ~$5-7**

**Recommended Pricing:**
- Free tier: 3 books/month
- Pro tier: $97/month (50 books = $1.94/book)
- Profit margin: ~65%

## Support

For deployment issues:
- Email: rick@rjbizsolutions.com
- Check logs in Vercel dashboard
- Review Prisma migrations
- Test locally first

## Next Steps After Deployment

1. Set up custom domain
2. Configure SSL certificate
3. Set up monitoring (Sentry)
4. Configure analytics (PostHog)
5. Set up backup strategy
6. Implement rate limiting
7. Add health check endpoint
8. Set up CI/CD pipeline

---

**Built by Rick Jefferson - RJ Business Solutions**
