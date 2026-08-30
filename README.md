# F1rstme Tech — Fresh Website Files

## What's in this folder
- `index.html` — homepage
- `news.html` — news feed
- `reviews.html` — phone reviews
- `compare.html` — phone comparison tool
- `admin.html` — admin login + dashboard
- `styles.css` — all styling (white/yellow/black theme)
- `app.js` — public pages logic
- `admin.js` — admin dashboard logic
- `config.js` — **you must edit this file** (see Step 1 below)
- `logo.png`, `logo-cropped.png` — your logo
- `schema.sql` — database setup (run in Supabase, not GitHub)

## Step 1 — Edit config.js BEFORE uploading
Open `config.js` in any text editor (Notepad works). Replace the two placeholder lines with your real Supabase values, found in Supabase → Project Settings → API:

```javascript
const SUPABASE_URL = "https://xxxxx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOi...";
```

Save the file.

## Step 2 — Set up the database (only needed once)
In Supabase → SQL Editor → New query, paste the full contents of `schema.sql` and run it.

## Step 3 — Upload to GitHub
Upload every file in this folder to your repository (all 12 files, all at once). Do not add any other files.

## Step 4 — Turn on GitHub Pages
Repo → Settings → Pages → Source: "Deploy from a branch" → Branch: main → Folder: / (root) → Save.

Your site will be live at: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Step 5 — Log into Admin
Go to `yoursite/admin.html` and log in with the email/password you created in Supabase → Authentication → Users. Add phones and news from there — they'll appear on the site immediately.
