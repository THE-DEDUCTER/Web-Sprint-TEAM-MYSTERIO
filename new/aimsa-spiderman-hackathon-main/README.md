# Cohort — A Social Platform for PCCOE (clone)

A clone of [cohortpccoe.in](https://www.cohortpccoe.in/), built with React + Vite +
TypeScript + Tailwind CSS. See `cohortpccoeclonespec.md` for the full product spec
this was built from.

**Cohort** is a campus-only social platform built for Pimpri Chinchwad College
of Engineering (PCCOE), Pune — *"A Social Platform for PCCOE."* It aggregates
30+ student clubs/communities, encrypted 1:1 messaging, an anonymous
meme/exchange feed (XD), an interactive campus map, an academic calendar, a
student profile/portfolio system, a notifications hub, a mini arcade
(Chess/Tic-Tac-Toe/Sudoku), and an AI chat assistant named "Buddy."

## Quick start (works immediately, no setup required)

```bash
npm install
npm run dev
```

Open the printed local URL. The app runs in **demo mode** out of the box: no
Supabase project, no Google OAuth, no TomTom key needed. Sign in by picking one
of four seeded demo students on the login screen. All data (posts, follows,
communities, DMs, etc.) is stored in your browser's `localStorage`, seeded with
realistic content the first time you load the app.

Everything works in demo mode **except** the live campus map, which needs a
TomTom key (see below) — it shows a styled placeholder with the seeded POI list
until you add one.

## Connecting real Supabase + Google OAuth (optional)

The app is written against one data-access layer (`src/lib/db.ts`) that
transparently switches from the local demo store to real Supabase the moment
you set the right environment variables. Nothing else in the code needs to
change.

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project.
2. Once it's created, go to **Project Settings → API** and copy the **Project
   URL** and the **anon public** key.

### 2. Run the database schema

1. In the Supabase dashboard, open **SQL Editor → New query**.
2. Paste the entire contents of [`supabase/schema.sql`](./supabase/schema.sql)
   and run it. This creates every table (`users`, `posts`, `communities`,
   `messages`, etc.), Row Level Security policies, and a trigger that creates a
   `users` row automatically the first time someone signs in with Google.
3. Optional: seed the `communities`, `xd_items`, `map_pois`, and
   `academic_events` tables with the same realistic data used in demo mode —
   the JS objects to copy from live in `src/lib/seed/*.ts`.

### 3. Enable Google sign-in

**In Google Cloud Console:**
1. Go to [console.cloud.google.com](https://console.cloud.google.com/) and
   create a project (or reuse one).
2. **APIs & Services → OAuth consent screen** — choose "External", fill in the
   app name ("Cohort"), your support email, and add your own email as a test
   user (or publish the app once ready).
3. **APIs & Services → Credentials → Create Credentials → OAuth client ID.**
   - Application type: **Web application**.
   - Authorized redirect URI: `https://<your-project-ref>.supabase.co/auth/v1/callback`
     (find `<your-project-ref>` in your Supabase project URL).
4. Save, then copy the generated **Client ID** and **Client Secret**.

**In Supabase:**
1. Go to **Authentication → Providers → Google**.
2. Toggle it on, paste the Client ID and Client Secret from above, and save.
3. Under **Authentication → URL Configuration**, set your site URL (e.g.
   `http://localhost:5173` for local dev, or your deployed URL) and add it to
   the redirect allow-list.

### 4. Add your keys to `.env`

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Restart `npm run dev`. The login screen will now show a real "Sign in with
Google" button instead of the demo picker, and all data will read/write to
Supabase Postgres (with Realtime enabled on `messages`, `posts`, and
`notifications`).

## Connecting the campus map (TomTom)

1. Create a free account at [developer.tomtom.com](https://developer.tomtom.com/).
2. Create an API key (Maps SDK product).
3. Add it to `.env`:
   ```env
   VITE_TOMTOM_API_KEY=your-tomtom-key
   ```
4. Restart the dev server — `/dashboard/map` will now render a live interactive
   map centered on PCCOE, Nigdi, with colored markers for the seeded POIs.

## The "Buddy" assistant

Buddy is implemented as a small deterministic keyword/tool-search assistant
(`src/lib/buddy.ts`) over the app's own users/communities/pages data — it
doesn't call an external LLM, so it works with zero extra configuration or
API keys. To upgrade it to a real LLM-backed assistant, replace the body of
`askBuddy()` with a call to your model of choice, keeping the same
`(question: string) => Promise<string>` signature.

## Deployment

This is a static Vite build — deploy the `dist/` folder anywhere that serves
static files.

```bash
npm run build
```

**Vercel:** import the repo, framework preset "Vite" is auto-detected.
`vercel.json` is already included for SPA client-side routing. Add your
`VITE_*` env vars in the Vercel project settings if you're connecting real
Supabase/TomTom.

**Netlify:** `npm run build`, publish directory `dist`. `public/_redirects` is
already included for SPA routing. Add env vars in Site settings → Environment
variables.

**Any static host (Cloudflare Pages, GitHub Pages, S3, etc.):** upload the
contents of `dist/` and configure a catch-all rewrite to `index.html` for
client-side routing to work on refresh/deep links.

## Project structure

```
src/
  lib/            data layer (db.ts unifies Supabase + local demo store),
                   seed data, Supabase client, sudoku generator, Buddy
  contexts/       Auth + Theme React contexts
  components/     shell (nav/sidebar/command palette/Buddy), ui primitives,
                   post cards, arcade games, profile editor
  pages/          one file per route (marketing landing, login, 11 dashboard pages)
supabase/
  schema.sql      full Postgres schema + RLS policies + auth trigger
```

## Known scope notes (see spec §7 for details)

- XD (Exchange) is built as the swipeable tagged-content feed, matching what
  was actually observed live on the original site (rather than open
  anonymous UGC posting).
- Chess supports castling, core movement, captures, and promotion to queen
  only (no en passant / underpromotion), matching the original's stated scope.
- The Shop/Marketplace is gated as "Coming soon" in the command palette, as
  it wasn't a live route on the original site either.
