# ข้อความแทนใจ (khotkhwam-thaen-jai)

MVP web app: plant short text notes (messages for the heart) on a cream paper board. Inspired by Anna's Garden, but **text notes** instead of drawings.

Thai display title: **ข้อความแทนใจ**

## Stack

- Vite + React + TypeScript
- Persistence: `localStorage` key `khotkhwam-thaen-jai-notes-v1` only
- No accounts, no backend, no `.env`

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
- **Public gallery** — list all planted notes on the cream board (notes that passed the filter)
- **Persistence** — reload keeps notes via `localStorage`
- **Thai UI** — title and main labels in Thai
- **Theme** — cream paper background, ink feel, note slips with highlighter edge strip

## Stubbed / out of scope

- No user accounts or auth
- No shared/server-side gallery across devices (localStorage only)
- No moderation beyond client blocklist
- No drawings / canvas (text only)
- Not published to Vercel yet
