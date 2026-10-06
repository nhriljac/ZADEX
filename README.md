# Zadex

Your personal cannabis intelligence. Log what you try, and Zadex learns your taste,
explains why you like things, and recommends what to try next.

This is a standalone rebuild of the Base44 app at zadex.base44.app. It has no
dependency on Base44: it's a plain React app you can host anywhere for free.

## Run it on your computer

You need [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev
```

Then open the address it prints (usually http://localhost:5173).

## Put it online

```bash
npm run build
```

This creates a `dist/` folder: a finished static website. Any of these work:

- **Netlify:** drag the `dist` folder onto https://app.netlify.com/drop. Done.
- **Vercel:** push this folder to GitHub, then "Import project" on vercel.com. It detects Vite automatically.
- **GitHub Pages, Cloudflare Pages, any web host:** upload the contents of `dist/`.

Routing files for Netlify (`public/_redirects`) and Vercel (`vercel.json`) are
included, so links like `/journal` work when someone opens them directly.

## Personalize

`src/config.js` holds the user's name and email, and a switch for the 9 demo
journal entries that appear on first launch.

## How it's organized

```
src/
  config.js              name, email, demo-data switch
  App.jsx                routes
  components/
    Layout.jsx           sidebar (desktop), header + tab bar (mobile)
    ui.jsx               shared cards, chips, ratings, terpene bars and modal
  lib/
    data.js              product catalog, terpenes, stores, deals
    engine.js            taste profile, recommendations, insights, assistant answers
    storage.js           where journal entries are saved (see below)
    seed.js              demo journal
    ZadexContext.jsx     app state shared by every page
  pages/                 one file per screen
```

## Where data is saved

On Base44, journal entries lived in Base44's database. Here they're saved in the
browser on the user's device (`localStorage`), which means:

- No server, no accounts, no monthly cost.
- Entries stay on that device and browser. They don't sync between a phone and a laptop.
- Clearing browser data erases them.

When you want accounts and syncing, rewrite **only** `src/lib/storage.js` to talk
to a backend such as Supabase or Firebase. Every other file reads and writes
through its `list / create / update / remove` functions, so nothing else changes.

## What's simulated (same as the original)

- **Scan** picks a random catalog product. Swap the timeout in `src/pages/Scan.jsx` for a barcode/OCR API.
- **Deals** and **stores** are fictional sample data in `src/lib/data.js`.
- **Zadex AI** is rule-based: it answers from your real journal using the logic in `src/lib/engine.js`. It doesn't call an AI model.
