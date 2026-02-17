# Alps White-Label Product Sheet Generator

A self-serve tool for brokers to generate branded insurance product sheets.

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
6. Add a custom domain in Vercel settings if you want (e.g. `sheets.alpsltd.co.uk`)

### Option B: Via CLI (one command)
```bash
npm install -g vercel
vercel
```
Follow the prompts. Done in 30 seconds.

## Deploy to Netlify (Alternative — Also Free)

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → **Add new site** → **Import from Git**
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Click Deploy

## Custom Domain

Both Vercel and Netlify let you add a custom domain for free.
Point a CNAME record from your domain (e.g. `sheets.alpsltd.co.uk`) to the provided URL.
