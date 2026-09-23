# ChalkTalk website — setup (Vercel + Supabase)

## 1. Supabase (one time, ~5 minutes)
1. Create a free project at https://supabase.com (no card needed).
2. Open **SQL Editor** → paste `supabase-setup.sql` → **Run**.
   This creates the `chalktalk` bucket, `shared_files` + `releases` tables and policies.
3. **Project Settings → API**: copy the **Project URL** and the **anon public** key.

## 2. This website
```bash
npm install
cp .env.example .env.local   # then fill the two values
npm run dev                  # http://localhost:3000
```

## 3. Deploy on Vercel
1. Push this folder to GitHub (already done: see repo).
2. https://vercel.com → **Add New Project** → import the repo.
3. Environment Variables: add `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_ANON_KEY` → **Deploy**.
4. Every `git push` redeploys automatically.

Without env vars the site still builds and runs — download/files sections
show a setup notice instead of crashing.

## 4. Publish the app .exe (what teachers download)
1. Build `ChalkTalk.exe`, then zip **only the exe**:
   `Compress-Archive ChalkTalk.exe ChalkTalk-1.1.0-win64.zip`
2. Supabase Dashboard → **Storage → chalktalk → releases/** → upload the zip.
   … → file → **Get URL** (public) + note its size. SHA256:
   `Get-FileHash ChalkTalk-1.1.0-win64.zip -Algorithm SHA256`
3. **Table Editor → releases → Insert row**:
   version `1.1.0`, notes, zip_url (public URL), sha256, size_bytes.
   The website card + the app auto-updater read this row instantly.
   Or automate all of it: `node scripts/publish-release.mjs --help`
   (needs `SUPABASE_URL` + `SUPABASE_SERVICE_KEY` env — service key stays
   on YOUR machine only, never in the repo or the app).

## 5. Connect the app (Send-to-Web + updates)
In `G:\Board\renderer\kbconfig.js` set `SUPABASE_URL` + `SUPABASE_ANON_KEY`
(the same anon key), rebuild the exe. Test: orb → File → **Web** → notes,
then check the website Files page. Orb → File → **Update** checks releases.
