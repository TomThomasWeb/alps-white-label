# Alps Broker Toolkit

A self-serve toolkit for insurance brokers. Generate branded product sheets, claims guidance cards, and more.

## Tools Included

- **Product Sheet Generator** — Create branded product PDFs for 17 Alps insurance products
- **Claims Guidance Card** — Generate A5 leave-behind flyers and business cards for motor, breakdown, and landlord claims

## Quick Start (Local)

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Deploy to Vercel (Recommended — Free)

### Option A: Via GitHub (auto-deploys on every push)
1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"** → Import your repo
4. Vercel auto-detects Vite — just click **Deploy**
5. Done! You'll get a URL like `your-project.vercel.app`

### Option B: Via CLI (one command)
```bash
npm install -g vercel
vercel
```

## Deploy to Netlify (Alternative — Also Free)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click Deploy

## Custom Domain

Both Vercel and Netlify let you add a custom domain for free.
Point a CNAME record from your domain (e.g. `toolkit.alpsltd.co.uk`) to the provided URL.

## SPA Routing

Both `vercel.json` and `public/_redirects` are included to handle client-side routing on Vercel and Netlify respectively.
