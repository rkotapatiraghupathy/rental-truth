# RentalTruth — Deployment Guide

## What's built
- Full Next.js app with AI-powered booking analysis
- Two-layer analysis: Terms + Booking page transparency
- Auto-generated complaint letter for HIGH/CRITICAL risk bookings
- Downloadable HTML report
- Waitlist signup (stored in waitlist.json locally, replace with DB in production)
- Founder story homepage with SEO metadata

---

## Go Live in 5 Steps

### Step 1 — Get your Anthropic API key
1. Go to https://console.anthropic.com
2. Create an account / sign in
3. Go to API Keys → Create Key
4. Copy the key (starts with `sk-ant-...`)

### Step 2 — Set up Vercel (free)
1. Go to https://vercel.com and sign up with GitHub
2. Push this project to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial RentalTruth launch"
   git remote add origin https://github.com/YOUR_USERNAME/rental-truth.git
   git push -u origin main
   ```
3. In Vercel: "Add New Project" → Import your GitHub repo
4. In Environment Variables, add:
   - `ANTHROPIC_API_KEY` = your key from Step 1
5. Click Deploy → live in ~2 minutes

### Step 3 — Get your domain
1. Go to Namecheap, GoDaddy, or 123-reg
2. Search for `rentaltruth.co.uk` (~£10/year)
3. In Vercel: Settings → Domains → Add `rentaltruth.co.uk`
4. Follow DNS instructions (takes ~10 minutes to propagate)

### Step 4 — Upgrade waitlist storage (optional but recommended)
The current waitlist uses a local JSON file which won't persist on Vercel.
Replace with a free Supabase database:

1. Sign up at https://supabase.com (free tier)
2. Create a table: `waitlist (id, email, created_at)`
3. Update `app/api/waitlist/route.ts` to use Supabase client
4. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to Vercel env vars

### Step 5 — Launch traction
Post your story with the link to:
- Reddit: r/HolidaysUK, r/LegalAdviceUK, r/UKPersonalFinance
- MoneySavingExpert forum (Car Hire section)
- Which? community
- Twitter/X with hashtags: #consumerrights #carhire #hiddenfees

---

## Local Development

```bash
# Install dependencies
npm install

# Create your env file
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY

# Run locally
npm run dev
# Open http://localhost:3000
```

---

## Project Structure

```
rental-truth/
├── app/
│   ├── api/
│   │   ├── analyse/route.ts    # AI analysis endpoint
│   │   ├── waitlist/route.ts   # Email signup
│   │   └── report/route.ts     # HTML report generation
│   ├── layout.tsx              # SEO metadata
│   ├── page.tsx                # Homepage
│   └── globals.css
├── components/
│   ├── AnalyserTool.tsx        # Main input tool
│   ├── AnalysisResults.tsx     # Results display
│   ├── FlagCard.tsx            # Individual restriction card
│   └── WaitlistSignup.tsx      # Email capture
├── lib/
│   ├── types.ts                # TypeScript types
│   └── prompts.ts              # AI system prompts
├── .env.example                # Environment template
└── vercel.json                 # Deployment config
```

---

## Future Roadmap
- [ ] Supabase database for waitlist + analysis history
- [ ] URL input (auto-fetch booking page)
- [ ] Screenshot/PDF upload
- [ ] Shareable report links
- [ ] FairBooking comparison engine
- [ ] CIC registration and social enterprise structure

---

Built by Rakesh · Liverpool, UK · June 2026
