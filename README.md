# F1RSTME TECH — Proper Website

This version includes:
- Real clickable device cards
- Dedicated `product.html?id=...` device pages
- Full specifications, price, rating, pros and cons
- Search
- Device comparison
- Reviews
- Instagram + YouTube links
- Admin dashboard for adding devices/specs/reviews/social links
- Optional automatic news endpoint
- Responsive mobile/desktop design

## Important
The static admin uses browser localStorage. This is suitable for testing only.
For a real public admin, use Supabase Auth + Postgres + Row Level Security.

## Automatic news
Deploy `supabase/functions/fetch-news/index.ts`, set server secrets, then put its public URL into `config.js` as `NEWS_ENDPOINT`.
Never put a private NewsAPI key in `index.html`, `app.js`, `admin.html`, or any public GitHub file.

## GitHub Pages
Upload the root files to your existing `F1rstme` repository:
index.html, product.html, admin.html, style.css, app.js, admin.js, config.js, README.md
The URL remains:
https://f1rstmetech.github.io/F1rstme/
