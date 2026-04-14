# Alps Broker Toolkit

A self-serve toolkit for insurance brokers. Generate branded product sheets, claims guidance cards, email templates, and more.

## Tools Included

- **Product Sheet Generator** — Create branded product PDFs for 19 Alps insurance products
- **Claims Guidance Card** — Generate A5 leave-behind flyers and business cards for motor, breakdown, and landlord claims
- **Email Templates** — Branded, ready-to-send emails for every stage of the client journey

## Quick Start (Local)

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Deploy to Vercel (Recommended — Free)

1. Push this folder to a GitHub repo
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click **"Add New Project"** → Import your repo
4. Vercel auto-detects Vite — just click **Deploy**

Or via CLI: `npm install -g vercel && vercel`

## Deploy to Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Build command: `npm run build`
4. Publish directory: `dist`

## Custom Domain

Both Vercel and Netlify support custom domains for free. Point a CNAME to the provided URL.
