# Left Hook Communications — Claude Code Handoff

## Project Overview

Build a 2-page marketing website + lightweight CMS for **Left Hook Communications**, a Democratic political consulting and media firm founded by Brandon Hall. The site showcases video ad work and Brandon's bio.

**Live domain:** lefthookcomms.com  
**CMS subdomain:** admin.lefthookcomms.com  
**Hosting:** GoDaddy (credentials pending from client)  
**Client:** Brandon Hall — manages campaigns and strategy for US Congressional and Governor races

---

## What's Been Done

We've designed and iterated on the homepage and about page as static HTML mockups. These are the **source of truth** for design, layout, copy, and interactions. The files are in this project folder:

```
lefthook-site/
├── index.html          ← Homepage (v5 — final layout approved)
├── about.html          ← About page (final copy + headshot wired)
├── assets/
│   └── brandon_hall.jpg   ← Brandon's headshot
├── public/
│   └── assets/
│       └── brandon_hall.jpg
└── videos/             ← DROP VIDEO FILES HERE (6 videos from client)
```

### Design Decisions (locked in)

- **Dark theme:** `#0A0A0A` background, warm white text `#F0EEE9`
- **Typography:** Bebas Neue (display/headlines), DM Sans (body/UI), Source Serif 4 (editorial/bio/quotes)
- **Brand color:** Left Hook blue `#6B8FC7` (light) / `#4A6FA5` (base)
- **No accent gold** — contact section uses blue + white, CTA button is white with blue text
- **Mobile-first responsive** — single column on mobile, grid on desktop

### Pages

#### Homepage (`/`)
1. **Sticky nav:** Logo top-left ("LEFT" in blue, "HOOK" in white), "About" link top-right. Blur + darken on scroll.
2. **Hero (~50vh):** "HIT 'EM WITH THAT LEFT HOOK" — "LEFT" is blue, rest is white. Subtitle: "Marrying strategy with award-winning media."
3. **Our Work section:** "OUR WORK" label + video grid. Asymmetric layout — first card is tall (9:16, spans 2 rows), remaining cards are standard 16:9 in a 2-column layout beside it. Total: 5-6 videos.
4. **Hover effects on video cards:** Thumbnail scales up + brightness/saturation lifts. Blue scan line sweeps top to bottom. Faint blue inner frame fades in. Play button fades in at center. Campaign name + ad title slides up at bottom. Category tag fades in at top-left.
5. **Video modal:** Full-screen black overlay (95% opacity, 24px backdrop blur). Plyr video player themed with Left Hook blue. Campaign name + title below the player. Scale-up animation on open. Close via X button (rotates on hover), backdrop click, or Escape key.
6. **Contact section:** "LET'S" in blue, "TALK" in white (stacked, huge display type). Right side: description text + "GET IN TOUCH" white pill button with blue text and subtle pulse animation.
7. **Footer:** Same background as contact (no divider). "© 2026 Left Hook Communications" left, "Privacy Policy" link right.

#### About (`/about`)
1. **Same nav** — "About" link has underline to indicate active page.
2. **Hero:** "About Left Hook" label in blue + "AWARD-WINNING POLITICAL STRATEGY & MEDIA" display title.
3. **Bio section:** Two-column — 3:4 portrait photo left, bio content right. Photo has subtle blue corner accent at bottom-left. Name in display type, "Founder & Partner" in blue, bio in Source Serif with embedded Ralston pull-quote.
4. **Press quotes:** 2x2 grid with blue left borders — Politico, NYT, Maddow, Adweek.
5. **Contact + Footer:** Identical to homepage.

#### Privacy Policy (`/privacy`)
- Adapt structure from TKO Political's privacy policy (see reference below)
- Same nav/footer wrapper
- Simple text page

---

## Technical Requirements

### Frontend
- **Framework:** React (Vite) or Next.js — keep it simple, no over-engineering
- **Styling:** The HTML mockups use vanilla CSS with CSS variables. Convert to CSS modules, Tailwind, or keep as global CSS — whatever ships fastest. Preserve the exact design system (colors, fonts, spacing, animations).
- **Routing:** Client-side — `/`, `/about`, `/privacy`
- **Video player:** Plyr (already integrated in the mockup via CDN). Theme overrides are in the CSS.
- **Animations:** Scroll-triggered reveals via IntersectionObserver (already implemented). Hero fade-up on load. Video card hover effects (scan line, inner frame, etc.).
- **Fonts:** Google Fonts — Bebas Neue, DM Sans, Source Serif 4
- **Responsive breakpoints:** 1024px (tablet), 768px (mobile), 480px (small mobile)

### Video Hosting (Self-hosted MP4s)
- Videos stored in `/videos/` directory or served from a CDN (Cloudflare R2 or similar)
- The video modal supports both self-hosted MP4 and Vimeo iframe (see `openVideo()` function in index.html)
- Each video card has `data-video`, `data-campaign`, and `data-title` attributes
- Client will provide 6 videos — 1 is 9:16 (tall/vertical), 5 are standard 16:9
- Thumbnails should be auto-generated from video frames or provided by client

### CMS Backend (admin.lefthookcomms.com)
Keep this **dead simple**. One user (Brandon). Basic requirements:

**Auth:**
- Simple login (email + password)
- Single admin user, no roles/permissions
- JWT or session-based, doesn't matter

**Video Management:**
- CRUD for video entries
- Fields: campaign name, ad title, category tag, video file (MP4 upload), thumbnail (image upload or auto-generate), sort order, is_tall (boolean for the 9:16 card)
- Drag-to-reorder
- Upload to local storage or S3/R2 bucket

**Copy Management:**
- Editable text fields for: hero title, hero subtitle, contact section description, contact email
- Editable text fields for about page: bio text, page title
- Simple form, save button, done

**API:**
- REST endpoint: `GET /api/videos` → returns ordered array of video objects
- REST endpoint: `GET /api/content` → returns site copy
- Frontend fetches these on load to render dynamically

**Tech stack suggestion:**
- Node.js + Express or Python + FastAPI
- SQLite for DB (this is a 6-record database, don't over-engineer)
- File uploads to disk or S3-compatible storage
- Serve the admin UI as a simple React app or even server-rendered HTML

### Data Schema

```json
// Video
{
  "id": 1,
  "campaign": "Reid for Senate",
  "title": "Determination — :60 TV",
  "category": "U.S. Senate",
  "video_url": "/videos/reid-determination.mp4",
  "thumbnail_url": "/thumbs/reid-determination.jpg",
  "sort_order": 1,
  "is_tall": false,
  "created_at": "2026-04-30T00:00:00Z"
}

// Site Content
{
  "hero_title": "HIT 'EM WITH THAT <span style=\"color:var(--blue-light)\">LEFT</span> HOOK",
  "hero_subtitle": "Marrying strategy with award-winning media.",
  "contact_description": "Running for public office or advancing a ballot measure? We'd love to hear about your race.",
  "contact_email": "info@lefthookcomms.com",
  "about_title": "AWARD-WINNING POLITICAL STRATEGY & MEDIA",
  "about_bio": "...(HTML string)..."
}
```

---

## Privacy Policy Content

Adapt from TKO Political's structure (https://tkopolitical.com/legal/privacy-policy). Replace company name with "Left Hook Communications" and update date. Sections:

1. Information We Collect (personal info + usage data)
2. How We Use Your Information
3. Sharing Your Information (we don't sell data)
4. Cookies and Tracking
5. Security
6. Your Rights
7. Changes to This Policy

---

## Competitor References

These sites were analyzed for design/UX patterns:
- https://tkopolitical.com/ — Best overall design, bold type, video grid (primary comp)
- https://www.mvarmedia.com/ — Clean video portfolio grid
- https://declarationmediagroup.com/ — Strong testimonials, team bios
- https://www.versusmediagroup.com/ — Punchy tagline, Squarespace
- https://dixondavismedia.com/ — Minimal (low bar)
- https://www.rlgmediagroup.com/ — Strong credentials
- https://www.fight.agency/ — Pure visual gallery
- https://fp1.com/ — Republican comp, good structure for case studies

---

## Build Steps

### Phase 1: Frontend
1. `npm create vite@latest lefthook -- --template react` (or Next.js)
2. Port the two HTML mockups into React components with shared layout (Nav, Footer)
3. Set up client-side routing
4. Wire up Plyr for the video modal
5. Create the privacy policy page
6. Spin up local dev server, QA all pages + responsive + interactions
7. Drop in client's 6 video files when they arrive

### Phase 2: CMS
1. Set up backend (Express or FastAPI)
2. Create SQLite DB + migrations for videos and content tables
3. Build auth (simple login)
4. Build admin UI: video list with drag-reorder, upload, edit; content editor
5. Create API endpoints
6. Update frontend to fetch from API instead of hardcoded content

### Phase 3: Deploy
1. Get GoDaddy credentials from client
2. Deploy frontend to lefthookcomms.com
3. Deploy CMS to admin.lefthookcomms.com
4. Set up Cloudflare (free) in front for CDN + SSL
5. Configure DNS

---

## Key Design Principles

1. **Not AI slop.** This site must look hand-crafted by a senior designer. No generic gradients, no Inter font, no purple, no cookie-cutter layouts.
2. **Typography does the heavy lifting.** Bebas Neue at massive sizes, generous letter-spacing, high contrast white-on-black. Everything should read like a campaign poster.
3. **Video is the product.** The video grid and player are the centerpiece. Every interaction (hover, click, play) should feel cinematic and premium.
4. **Simple > clever.** Two pages, handful of videos, one person's bio. Don't over-build. Ship fast, iterate.
5. **Brandon is the client.** He runs campaigns for senators and governors. The site needs to project that level of credibility and professionalism.
