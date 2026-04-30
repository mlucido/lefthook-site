# Left Hook Communications

## On Session Start

Run `npm run dev` in the background immediately. Confirm server is live at localhost:5173 before doing anything else.

```bash
npm run dev
```

## Project

Political consulting portfolio site for Brandon Hall / Left Hook Communications.
- **Stack:** React 19 + Vite + react-router-dom v7 + Plyr
- **Routes:** `/` (home + video grid), `/about` (bio + press), `/privacy`
- **Dev server:** `npm run dev` → localhost:5173
- **Design source of truth:** `_mockups/about.html` (original mockup preserved)

## Key Files

- `src/data/videos.js` — swap video URLs here for production (point to GoDaddy or R2)
- `src/index.css` — all styles, single file
- `src/components/VideoModal.jsx` — Plyr player, StrictMode-safe init
- `public/videos/` — web-compressed MP4s (36MB max). Originals in `/videos/` locally, NOT in git.
- `public/thumbs/` — 6 thumbnail JPGs

## Git

Repo: https://github.com/mlucido/lefthook-site (private)
Push directly to `main`.

## Phase 2 (not started)

CMS backend at admin.lefthookcomms.com — Node/Express + SQLite.
See HANDOFF.md for full spec.
