# ข้อความแทนใจ (khotkhwam-thaen-jai)

MVP web app: plant short text notes (messages for the heart) on a cream paper board. Inspired by Anna's Garden, but **text notes** instead of drawings.

Thai display title: **ข้อความแทนใจ**

## Stack

- Vite + React + TypeScript
- Persistence: **Supabase** shared gallery when configured, otherwise `localStorage` (`khotkhwam-thaen-jai-notes-v1`)
- No accounts / auth

## Environment

Copy `.env.example` → `.env.local` (gitignored) and fill in:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key |

Without both vars, the app runs in **local-only** mode (browser `localStorage`).

**Vercel / production:** set the same two names under Project → Settings → Environment Variables.

SQL schema + RLS: run `supabase/migrations/001_notes.sql` in the Supabase SQL editor (or via Supabase CLI).

## Run locally

```bash
cd /workspace/khotkhwam-thaen-jai
npm install
npm run dev
```

Dev server uses **port 5174** (see `vite.config.ts`). Open `http://localhost:5174/`.

Build for Vercel later:

```bash
npm run build
npm run preview   # also port 5174
```

Do not `git push` or publish from this MVP unless explicitly asked.

## What works (MVP)

- **Plant a note** — optional nickname (max 20), text max 40 chars, pick one of 4 highlighter accents (red / blue / green / purple)
- **Profanity filter** — client-side Thai + English blocklist on nickname and text; blocks submit with Thai error message (`src/lib/profanity.ts`)
- **Public gallery** — list planted notes on the cream board; shared across visitors when Supabase is configured
- **Persistence** — Supabase `notes` table (body↔text, color↔accent) or `localStorage` fallback
- **Thai UI** — title and main labels in Thai
- **Theme** — cream paper background, ink feel, note slips with highlighter edge strip

## Stubbed / out of scope

- No user accounts or auth
- No server-side moderation beyond RLS checks + client blocklist
- No drawings / canvas (text only)
- Not published until Pace says
