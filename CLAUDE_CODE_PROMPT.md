# Claude Code Kickoff Prompt

Paste everything below this line as your first message to Claude Code:

---

Read HANDOFF.md first — it's the full project brief.

This is a 2-page marketing website + lightweight CMS for Left Hook Communications, a Democratic political consulting firm. We've already designed and iterated on the homepage (index.html) and about page (about.html) as static HTML mockups. These are the design source of truth — match them exactly.

## Project files in this directory:

- `HANDOFF.md` — Full spec: design system, page layouts, interactions, CMS requirements, data schema, deploy plan
- `index.html` — Homepage mockup (v5, approved). Has: sticky nav, hero, asymmetric video grid with hover effects (scan line, inner frame, brightness lift), Plyr video modal, contact section, footer
- `about.html` — About page mockup (approved). Has: hero, two-column bio with Brandon's headshot + pull quote, press quotes grid, contact section, footer
- `assets/brandon_hall.jpg` — Brandon Hall's headshot photo
- `videos/` — Client's video files will be here (6 total — 1 is 9:16 vertical, 5 are 16:9 horizontal)
- `thumbs/` — For video thumbnail images

## What to build (Phase 1 — Frontend):

1. Initialize a React + Vite project in this directory
2. Port `index.html` and `about.html` into React components with a shared layout (Nav, Footer, VideoModal)
3. Set up client-side routing: `/`, `/about`, `/privacy`
4. Create the privacy policy page (adapt from TKO Political's structure — details in HANDOFF.md)
5. Wire up Plyr for the video modal (it's already integrated via CDN in the mockup — port to npm package)
6. Make the video grid data-driven (array of video objects) so it's ready to connect to the CMS API later
7. Ensure all hover effects, animations, and responsive breakpoints match the mockups exactly
8. Spin up the local dev server so we can QA

## Critical design requirements:

- This MUST NOT look like AI-generated slop. Study the mockups carefully — the typography choices (Bebas Neue, DM Sans, Source Serif 4), the specific hover effects (scan line, inner frame, brightness/saturation lift), the editorial pull-quote styling, the Plyr theme overrides — all of this is intentional and must be preserved exactly.
- Dark theme: `#0A0A0A` background, `#F0EEE9` text, `#6B8FC7` brand blue
- Typography is oversized intentionally — hero subtitle is 28px, video card titles are 26px, section labels are 16px bold. This is a poster-like aesthetic, don't shrink anything.
- Mobile-first responsive: 1024px tablet, 768px mobile, 480px small. On mobile, all hover states (play buttons, labels, tags) are visible by default.

## After QA, Phase 2 (CMS):

We'll build admin.lefthookcomms.com as a separate step — simple Node/Express + SQLite backend with video CRUD, copy editing, and file uploads. Details in HANDOFF.md.

Start with Phase 1. Read the mockup HTML files carefully, then begin.
