# ChalkTalk website

Marketing + download + class-files library for the ChalkTalk smart classroom board.
Next.js 14 (App Router) + motion + anime.js + Supabase. Deploys on Vercel.

- `npm install` → copy `.env.example` to `.env.local` → `npm run dev`
- Supabase schema + policies: `supabase-setup.sql`
- Full steps: `SETUP.md`
- Publish helper: `scripts/publish-release.mjs`

UI sources (used appropriately, per component comments):
ReactBits-style spotlight/stagger, Uiverse-style gradient cards/buttons,
Anime.js v4 hero timeline, Motion transitions/gestures/layout,
Kokonut gradient-button/shimmer/smooth-tab recipes, Bklit chart theme +
grow/stagger language for the stats visuals.
