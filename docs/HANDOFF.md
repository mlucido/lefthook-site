# Left Hook Strategy — Engineering Handoff

**Last updated:** 2026-05-26
**Site:** https://lefthookstrategy.com
**Repo:** github.com/mlucido/lefthook-site

---

## What this site is

A 3-route React SPA marketing site for Left Hook Strategy, a political consulting firm. Routes:

- `/` — homepage with bio, video grid of campaign work, contact
- `/about` — about page
- `/privacy` — privacy policy

Total deployable artifact: ~3-5MB (excluding videos, which live on Cloudflare R2).

---

## Architecture at a glance

```
User browser
    │
    ▼
Cloudflare (CDN, SSL termination, security headers, cache rules)
    │
    ├──► Origin: GoDaddy cPanel shared hosting (HTML, JS, CSS, images)
    │         /home/dh1ci8srgf9p/public_html/
    │
    └──► Videos: Cloudflare R2 bucket "lefthook-videos"
              videos.lefthookstrategy.com → R2 custom domain
```

### Key facts
- Cloudflare SSL/TLS mode: **Full** (NOT Full-strict — GoDaddy's shared origin cert doesn't pass strict validation; the gain from strict mode is marginal given the Cloudflare-to-origin path is hard to MITM)
- The GoDaddy hosting plan also serves 7 OTHER client domains as subdirectories. **Never blanket-delete public_html/**.
- All video files (6 MP4s, ~87MB total) live on Cloudflare R2, served via `videos.lefthookstrategy.com`. NOT in the GoDaddy webroot, NOT in git (gitignored).

---

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router (BrowserRouter, basename `/`) |
| Video player | Plyr (lazy-loaded) |
| Build output | `dist/` (static files) |
| Deploy | FTP upload to GoDaddy cPanel + Cloudflare cache purge |

Brand color: `#6B8FC7` (steel blue). Defined as CSS variable in `src/index.css` and `tailwind.config.js`.

---

## Hosting infrastructure

### GoDaddy cPanel shared hosting (origin)

- **cPanel home:** `/home/dh1ci8srgf9p/`
- **Webroot:** `/home/dh1ci8srgf9p/public_html/`
- **FTP:**
  - Host: `107.180.12.16` (use raw IP — `lefthookstrategy.com:21` is blocked by Cloudflare)
  - Port: 21
  - User: `matt@lefthookstrategy.com` (also `admin@lefthookstrategy.com` exists)
  - Password: stored in 1Password under "Left Hook Strategy — FTP Production"
- **GoDaddy account holder:** Brandon Hall (`brandon@lefthookstrategy.com`)
- **GoDaddy plan:** cPanel shared hosting, multi-domain plan

### Protected subdirectories (DO NOT TOUCH during deploys)

`public_html/` contains the lefthookstrategy.com SPA at root, PLUS 7 other client domains as subdirectories. Treat these as off-limits:

```
public_html/lefthookcomms.com/
public_html/payyourtaxesmikegarcia.com/
public_html/thefabulouslifeofkarenhandel.com/
public_html/thesweep.ai/
public_html/thesweep.org/
public_html/woketh.com/
public_html/yesmeasureb.com/
```

When deploying, upload SPA files at the ROOT of `public_html/` only. Never `rm -rf public_html/*` or anything similar.

### Cloudflare

- **Account name:** "Left Hook" (historically labeled `Micaela@lefthookstrategy.com's Account` — same account, just renamed)
- **Account holders:** `matthewlucido@gmail.com` (Matt), `brandon@lefthookstrategy.com` (Brandon)
- **Zone:** `lefthookstrategy.com`
- **Zone ID:** retrievable via API: `GET /zones?name=lefthookstrategy.com`
- **SSL/TLS mode:** Full (NOT strict — see note above)
- **API token:** "lefthook-deploy-2026-05" — scoped to lefthookstrategy.com zone + R2. Stored in 1Password. Expires 2026-09-11.

#### Configured Cache Rules
| Rule | Match | Edge TTL | Browser TTL |
|---|---|---|---|
| Long cache for hashed assets | `/assets/*` | 30 days | 30 days (immutable) |
| Short cache for HTML | `/`, `*.html`, extension-less paths | 1 hour | 5 minutes |

#### Configured Transform Rules (response headers)
- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: SAMEORIGIN`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

#### Zone settings enabled
- Always Use HTTPS
- Brotli compression
- HTTP/3
- 0-RTT
- Early Hints

### Cloudflare R2 (video hosting)

- **Bucket:** `lefthook-videos` (Western North America)
- **Custom domain:** `videos.lefthookstrategy.com`
- **Account ID:** `e1b25a80eb5348e8d63ccb3442dbd26a`
- **R2 S3 API endpoint:** `https://e1b25a80eb5348e8d63ccb3442dbd26a.r2.cloudflarestorage.com`
- **R2 API tokens** stored in 1Password as "Left Hook R2 Upload Keys"
- **CORS policy:** allows GET/HEAD from `lefthookstrategy.com` and `www.lefthookstrategy.com`, includes `Range` header for video seeking
- **Objects:** 6 MP4 files, all with `Cache-Control: public, max-age=31536000, immutable`
  - web-aguilar.mp4, web-dunn.mp4, web-heinrich.mp4, web-kelly.mp4, web-ryan.mp4, web-titus.mp4

---

## Local development

```bash
git clone https://github.com/mlucido/lefthook-site.git
cd lefthook-site
npm install
npm run dev
```

`npm run dev` runs Vite at `http://localhost:5173`. Videos load from R2 cross-origin. If you hit CORS issues in dev, add `http://localhost:5173` to the R2 bucket CORS policy temporarily.

### File structure
```
src/
  App.jsx              Main router + layout
  index.css            Tailwind + custom CSS vars (brand blue, etc.)
  components/
    Hero.jsx, VideoCard.jsx, VideoModal.jsx, etc.
  data/
    videos.js          Video metadata + R2 URLs
  pages/
    Home.jsx, About.jsx, Privacy.jsx
public/
  index.html shell, og-image.png, favicons, manifest, .htaccess
```

Note: `.htaccess` lives in `public/` and gets copied to `dist/` root by Vite at build time.

---

## Build and deploy

### Build
```bash
npm run build
```
Outputs to `dist/`. JS and CSS bundles are hash-named for cache busting.

### Deploy to production

1. **Build:** `npm run build`
2. **FTP upload** to `/home/dh1ci8srgf9p/public_html/`:
   - `index.html`
   - `assets/` (overwrites old hashed bundles — old files are harmless leftovers, see "Stale assets" below)
   - Any other top-level static files (`og-image.png`, `favicon.ico`, etc.)
   - `.htaccess` (preserve the rules below)
3. **Purge Cloudflare cache** via dashboard → Caching → Configuration → Purge Everything
   - Manual step because the current API token lacks "Cache Purge" scope. To make this programmatic, add `Zone → Cache Purge → Purge` to the token's permissions.
4. **Verify:**
   ```bash
   curl -I https://lefthookstrategy.com/
   # Last-Modified should be today
   # CF-Cache-Status: MISS on first hit, then HIT
   ```

### `.htaccess` content (must preserve)

```apache
RewriteEngine On

# Force HTTPS + apex (www → apex, http → https)
RewriteCond %{HTTPS} off [OR]
RewriteCond %{HTTP_HOST} ^www\.lefthookstrategy\.com [NC]
RewriteRule ^(.*)$ https://lefthookstrategy.com/$1 [R=301,L]

# SPA fallback - any non-file/non-dir request → index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Stale assets

Each build creates new hashed filenames (`index-XYZ.js`). The OLD hashed files from prior deploys stay on the server harmlessly — they're never referenced again. Periodic cleanup is optional; they're tiny.

---

## Adding or replacing videos

1. **Encode the new MP4** — H.264, AAC audio, web-optimized (`-movflags +faststart` in ffmpeg)
2. **Upload to R2:**
   ```bash
   # Use rclone or aws-cli with the R2 S3-compatible API
   rclone copyto new-video.mp4 lefthook-r2:lefthook-videos/web-newname.mp4 \
     --header-upload "Cache-Control: public, max-age=31536000, immutable" \
     --header-upload "Content-Type: video/mp4"
   ```
3. **Update `src/data/videos.js`** with the new video metadata + R2 URL
4. **Rebuild and deploy** (see above)

R2 keys are in 1Password under "Left Hook R2 Upload Keys".

---

## Backups

### GitHub archive of pre-cutover site
The OLD static site (pre-React rebuild) is preserved at:
- `github.com/mlucido/lefthook-site-archive` (private repo)
- One commit, contains the full crawl of the original lefthookstrategy.com as of 2026-05-21

### Server-side archive
The old site files are also at:
- `/home/dh1ci8srgf9p/lefthookstrategy-pre-cutover-2026-05-26/`
- Safe to delete after ~30 days post-launch if no rollback is needed (i.e., after ~2026-06-26)

### Ongoing backups
GoDaddy runs free-tier scheduled backups daily (24-hour retention). To restore: Hosting dashboard → Backups → select date → Restore button.

---

## Rollback procedure (if production breaks)

```bash
# 1. FTP into GoDaddy
# 2. The OLD pre-cutover files are at:
#    /home/dh1ci8srgf9p/lefthookstrategy-pre-cutover-2026-05-26/
# 3. Move current SPA files out, restore old:
mv public_html/index.html public_html/assets/ public_html/og-image.png \
   public_html/favicon* public_html/site.webmanifest \
   public_html/apple-touch-icon.png public_html/android-chrome-* \
   /tmp/broken-deploy-backup/
mv /home/dh1ci8srgf9p/lefthookstrategy-pre-cutover-2026-05-26/* public_html/
# 4. Purge Cloudflare cache
# 5. Old site is back live within 30 seconds of cache purge
```

Good for ~30 days post-launch. After that, the archive directory may be cleaned up; restore from `mlucido/lefthook-site-archive` GitHub repo or GoDaddy daily backup instead.

---

## Known issues / future considerations

### Performance score
Lighthouse Performance is ~65-70 on simulated mobile. Root cause: render-blocking Google Fonts CSS. Fix would be async font loading via JS or a `<link rel="preload" as="font">` strategy. **Not blocking** — Core Web Vitals (TBT, CLS) are clean; this is synthetic score, not real-user impact. Low priority.

### `site.webmanifest` Content-Type
Currently served without an explicit `application/manifest+json` Content-Type. Browsers are forgiving — PWA install still works. To fix properly, add to `.htaccess`:
```apache
<Files "site.webmanifest">
  Header set Content-Type "application/manifest+json"
</Files>
```

### `thesweep.org` is broken (UNRELATED to lefthookstrategy.com)
`thesweep.org` (one of the protected subdirectories on the same hosting plan) returns 503 due to an SSL SAN mismatch on the GoDaddy origin cert. This was pre-existing — NOT caused by the May 2026 deploy. Brandon's separate problem if/when he wants to address it. Documented here so a future engineer doesn't get blamed.

### "Full (strict)" SSL not achievable on current setup
Cloudflare SSL is set to "Full" rather than "Full (strict)" because the GoDaddy shared origin cert doesn't pass strict validation (cert chain / SAN issues common on shared hosting). To upgrade to strict in the future, options are: (a) install a paid SSL cert on GoDaddy origin, (b) migrate to hosting that supports Let's Encrypt (Cloudflare Pages, Vercel, Netlify), or (c) leave at Full — the security delta is minimal and not worth $60+/yr.

---

## Credentials inventory (where to find them)

All actual secrets live in 1Password. This is just the directory.

| What | 1Password item |
|---|---|
| FTP creds for matt@lefthookstrategy.com | "Left Hook Strategy — FTP Production" |
| Cloudflare API deploy token | "Left Hook — CF API Deploy Token" |
| R2 S3-style upload keys | "Left Hook R2 Upload Keys" |
| GoDaddy account | Brandon owns; Matt has admin access via invitation |
| Cloudflare login | matthewlucido@gmail.com (Matt), brandon@lefthookstrategy.com (Brandon) |
| GitHub repos | github.com/mlucido (lefthook-site, lefthook-site-archive) |

---

## Project history

- **Pre-May 2026:** Old static HTML site (Oct 2025 era), served lefthookstrategy.com
- **April 2026:** New React site development begins
- **May 2026:** Final dev work + deploy planning
- **2026-05-21:** Deploy planning starts (FTP audit, Cloudflare audit, staging deploy)
- **2026-05-26:** Production cutover, R2 video migration, security hardening, social preview launch — all in one day
- **Major contributors:** Matt Lucido (deploy, infra), Brandon Hall (client, content, design direction)

---

## Contact

For questions about this site:
- **Engineering:** Matt Lucido (matthewlucido@gmail.com)
- **Business/Content:** Brandon Hall (brandon@lefthookstrategy.com)

For Cloudflare/DNS issues: both Matt and Brandon have admin access.
For GoDaddy hosting issues: Brandon is the account holder; Matt has admin via Brandon's invitation.
