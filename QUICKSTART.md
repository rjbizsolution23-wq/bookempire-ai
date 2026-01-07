# ⚡ BookEmpire AI - Quick Start Guide

Get BookEmpire AI running in 5 minutes!

---

## 🚀 Instant Setup

### Step 1: Clone and Install (1 minute)
```bash
git clone https://github.com/rjbizsolution23-wq/bookempire-ai.git
cd bookempire-ai
npm install
```

### Step 2: Get Free Credentials (2 minutes)

**Database (Supabase - Free):**
1. Go to https://supabase.com/dashboard
2. Create project → Copy connection string
3. Add to `.env` as `DATABASE_URL`

**Redis (Upstash - Free):**
1. Go to https://console.upstash.com
2. Create database → Copy Redis URL
3. Add to `.env` as `REDIS_URL`

**Authentication (Clerk - Free):**
1. Go to https://dashboard.clerk.com
2. Create application → Copy API keys
3. Add to `.env`:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

**AI Services:**
- OpenAI: Get API key from https://platform.openai.com/api-keys
- Replicate: Sign up at https://replicate.com and get API token
- Cloudflare R2: Create R2 bucket and get access keys from Cloudflare dashboard

### Step 3: Setup Database (1 minute)
```bash
cp .env.example .env
# Edit .env with your credentials

npx prisma generate
npx prisma db push
```

### Step 4: Run (30 seconds)
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run worker:dev
```

**Open:** http://localhost:3000

---

## 🎯 Test Book Generation

1. Sign up at http://localhost:3000/sign-up
2. Navigate to generate book endpoint (will be dashboard in Phase 2)
3. Make POST request to `/api/books/generate`:

```bash
curl -X POST http://localhost:3000/api/books/generate \
  -H "Content-Type: application/json" \
  -d '{
    "title": "AI Business Strategies",
    "authorName": "Rick Jefferson",
    "inputType": "topic",
    "inputContent": "How to use AI to scale businesses",
    "targetWordCount": 20000,
    "genre": "Business"
  }'
```

4. Check generation progress:
```bash
curl http://localhost:3000/api/books
```

---

## 🛠️ Troubleshooting

**"Cannot find module '@prisma/client'"**
```bash
npx prisma generate
```

**"Database connection failed"**
- Check DATABASE_URL in .env
- Verify Supabase allows connections
- Try: `npx prisma db push --force-reset`

**"Redis connection refused"**
- Verify REDIS_URL in .env
- Check Upstash database is active
- Try local Redis: `redis-server`

**"OpenAI API error"**
- Verify OPENAI_API_KEY in .env
- Check API quota/billing
- Test key: `curl https://api.openai.com/v1/models -H "Authorization: Bearer $OPENAI_API_KEY"`

---

## 📦 Minimal .env File

```env
# Database (Supabase)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"

# Redis (Upstash)
REDIS_URL="redis://default:[PASSWORD]@[HOST].upstash.io:6379"

# Clerk (Authentication)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/dashboard"

# OpenAI (AI)
OPENAI_API_KEY="sk-proj-..."

# Replicate (Covers)
REPLICATE_API_TOKEN="r8_..."

# Cloudflare R2 (Storage)
R2_ACCOUNT_ID="58250b56ae5b45d940cd6e4b64314c01"
R2_ACCESS_KEY_ID="06bac079d8a642598c000a2c79e48eb7"
R2_SECRET_ACCESS_KEY="99ef1d10f5f8e9b616d481f72f8be75c93ade948e3fe22c780c4b83fb21f2bec"
R2_BUCKET_NAME="bookempire-files"

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NODE_ENV="development"
```

---

## 🎓 Next Steps

After setup:

1. **Test Generation:**
   - Generate a test book
   - Check database for entries
   - Verify covers uploaded to R2

2. **Customize:**
   - Update landing page text
   - Modify pricing tiers
   - Adjust word count limits

3. **Deploy:**
   - Push to GitHub
   - Deploy to Vercel
   - Set environment variables

4. **Build Phase 2:**
   - Add dashboard UI
   - Implement book editor
   - Add PDF export

---

## 💡 Pro Tips

**Development:**
- Use `npx prisma studio` to view database
- Check worker logs for generation errors
- Monitor Redis queue in Upstash dashboard

**Performance:**
- Set target word count lower for testing (10000)
- Use fewer chapters for faster generation
- Cache generated outlines

**Cost Optimization:**
- Use gpt-3.5-turbo for testing (change in openai.ts)
- Generate single cover initially
- Set lower word counts

---

## 📞 Need Help?

**Common Issues:**
- Database: Check Supabase connection string
- Redis: Verify Upstash database active
- Auth: Ensure Clerk redirect URLs correct
- API: Check OpenAI billing/quota

**Contact:**
- Email: rick@rjbizsolutions.com
- GitHub Issues: https://github.com/rjbizsolution23-wq/bookempire-ai/issues

---

## ✅ Success Checklist

- [ ] npm install completed
- [ ] .env file configured
- [ ] Database connection working
- [ ] Prisma client generated
- [ ] Dev server running (port 3000)
- [ ] Worker running
- [ ] Can sign up/sign in
- [ ] Can trigger book generation
- [ ] Book appears in database
- [ ] Covers uploaded to R2

---

**You're ready to build book empires! 🚀**

Built by Rick Jefferson - RJ Business Solutions
