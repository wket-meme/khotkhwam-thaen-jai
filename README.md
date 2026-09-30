# ข้อความแทนใจ (khotkhwam-thaen-jai)

MVP web app: plant short text notes (messages for the heart) on a cream paper board. Inspired by Anna's Garden layout (board + plant panel), but **text notes** instead of drawings.

Thai display title: **ข้อความแทนใจ**

Live: https://khotkhwam-thaen-jai.vercel.app

## Stack

- Vite + React + TypeScript
- Persistence: **Supabase** shared gallery when configured, otherwise `localStorage` (`khotkhwam-thaen-jai-notes-v1`)
- No accounts / auth
- Admin cloud delete: Supabase Edge Function `admin-delete-note` (service role + `ADMIN_PIN`)

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
| `VITE_ADMIN_PIN` | Optional admin PIN to unlock delete buttons (client-side soft UX gate) |

Without both Supabase vars, the app runs in **local-only** mode (browser `localStorage`). Footer shows **กระดานสาธารณะร่วมกัน** when Supabase is configured.

**Vercel / production:** set the same names under Project → Settings → Environment Variables (Production + Preview).

SQL schema + RLS: run `supabase/migrations/001_notes.sql` in the Supabase SQL editor (or via Supabase CLI). There is **no** anon DELETE policy (see `002_notes_delete_service.sql`).

### Admin delete

- UI: footer **แอดมิน** → enter `VITE_ADMIN_PIN` → delete buttons appear. Unlock stores a session flag **and** the entered PIN in `sessionStorage` (tab session only).
- **Client-held PIN is a weak UX gate** (Vite embeds `VITE_*` in the bundle). Anyone who knows or extracts the PIN can unlock the UI. This is **not** strong security by itself.
- **localStorage mode:** delete works fully after PIN unlock (local only).
- **Supabase shared gallery:** delete calls Edge Function `admin-delete-note` with `{ id, pin }`. The function compares `pin` to server secret `ADMIN_PIN` (or `ADMIN_SECRET`) and deletes with the **service role**. Anon RLS still has **no** DELETE policy — do not add one.

#### Set server secret + deploy function

```bash
# Login once (interactive) if needed:
npx supabase login

# Server PIN — use the same value as VITE_ADMIN_PIN for UX consistency
npx supabase secrets set ADMIN_PIN=your-pin-here --project-ref ahisxvdbfjhhllysystl

# Deploy (SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are auto-injected into Edge Functions)
npx supabase functions deploy admin-delete-note --project-ref ahisxvdbfjhhllysystl
```

Invoke URL (the app uses `supabase.functions.invoke`):

`https://ahisxvdbfjhhllysystl.supabase.co/functions/v1/admin-delete-note`

CORS allows `https://khotkhwam-thaen-jai.vercel.app` and `http://localhost:5174`.

**Never** commit `service_role`, `.env.local`, or real PIN/secrets.

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
- **Admin delete** — PIN-gated UI; localStorage delete; shared delete via Edge Function + `ADMIN_PIN`
- **Thai UI** + cream paper theme

## Stubbed / out of scope

- No user accounts or auth
- No server-side moderation beyond RLS checks + client blocklist
- No drawings / canvas (text only)
