# ข้อความแทนใจ (khotkhwam-thaen-jai)

MVP web app: plant short text notes (messages for the heart) on a cream paper board. Inspired by Anna's Garden layout (board + plant panel), but **text notes** instead of drawings.

Thai display title: **ข้อความแทนใจ**

Live: https://khotkhwam-thaen-jai.vercel.app

## Stack

- Vite + React + TypeScript
- Persistence: **Supabase** shared gallery when configured, otherwise `localStorage` (`khotkhwam-thaen-jai-notes-v1`)
- No accounts / auth

## Layout

- **Desktop:** LEFT = shared notes board (paper slips), RIGHT = plant panel (colors + text + Plant)
- **Mobile:** stacked — board first, plant panel below (accessible by scroll)
- Single screen — no tab switching

## Environment

Copy `.env.example` → `.env.local` (gitignored) and fill in:

| Variable | Description |
|---|---|
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon (public) key |
| `VITE_ADMIN_PIN` | Optional admin PIN to unlock delete buttons (client-side MVP) |

Without both Supabase vars, the app runs in **local-only** mode (browser `localStorage`). Footer shows **กระดานสาธารณะร่วมกัน** when Supabase is configured.

**Vercel / production:** set the same names under Project → Settings → Environment Variables (Production + Preview).

SQL schema + RLS: run `supabase/migrations/001_notes.sql` in the Supabase SQL editor (or via Supabase CLI).

### Admin delete (MVP — read this)

- UI: footer **แอดมิน** → enter `VITE_ADMIN_PIN` → delete buttons appear on notes. Unlock is stored in `sessionStorage` for the tab session.
- **PIN is client-side only** (Vite embeds `VITE_*` in the bundle). Anyone who knows or extracts the PIN can unlock the UI. This is **not** strong security — fine for a soft MVP gate only.
- **localStorage mode:** delete works fully after PIN unlock.
- **Supabase shared gallery:** there is **no** anon DELETE RLS policy (by design). `deleteNote` calls `supabase.from('notes').delete()` and will fail under RLS; the UI shows a Thai message to delete via **Supabase Dashboard** (or a future Edge Function with service role — never put the service key in Vite). See `supabase/migrations/002_notes_delete_service.sql` (documentation / no-op — do **not** open public DELETE).

## Run locally

```bash
cd /workspace/khotkhwam-thaen-jai
npm install
npm run dev
```

Dev server uses **port 5174** (see `vite.config.ts`). Open `http://localhost:5174/`.

```bash
npm run build
npm run preview   # also port 5174
```

## What works (MVP)

- **Single screen** — board + plant panel (garden-style split on desktop)
- **Plant a note** — optional nickname (max 20), text max 40 chars, pick one of 4 highlighter accents (red / blue / green / purple)
- **Profanity filter** — client-side Thai + English blocklist on nickname and text (`src/lib/profanity.ts`)
- **Public gallery** — shared across visitors when Supabase is configured
- **Admin delete** — PIN-gated UI; full delete in localStorage; Supabase delete blocked by RLS until Edge Function / Dashboard
- **Thai UI** + cream paper theme

## Stubbed / out of scope

- No user accounts or auth
- No server-side moderation beyond RLS checks + client blocklist
- No drawings / canvas (text only)
- No secure server-side admin delete yet (use Dashboard / future Edge Function)
