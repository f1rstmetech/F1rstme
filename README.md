# F1RSTME TECH PRO

Includes a premium tech-news homepage, latest model catalogue, comparison engine, reviews, Instagram/YouTube controls and admin dashboard.

### Automatic news
The included Supabase Edge Function uses NewsAPI server-side. Keep the NewsAPI secret out of public GitHub code. Configure the function with `NEWS_API_KEY`, store articles in Supabase, and point `config.js` `NEWS_ENDPOINT` at your public endpoint.

### Admin
The current browser demo lets you add models/specs, reviews and social links. For production, connect Supabase Auth + Postgres + RLS. Supabase supports Auth and Postgres through its JS client.

### Files
`index.html` frontend
`admin.html` admin
`app.js` frontend data/rendering
`admin.js` admin controls
`config.js` configuration
`supabase/schema.sql` database
`supabase/functions/fetch-news/index.ts` automatic news ingestion
