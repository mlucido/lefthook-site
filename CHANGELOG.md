## 2026-05-26 — Phase 7: Post-deploy hardening

- Cache Rules: 30d edge/browser TTL for /assets/* (hashed bundles)
- Cache Rules: 1h edge / 5min browser TTL for HTML routes
- Security headers via Cloudflare Transform Rules:
  - Strict-Transport-Security: max-age=31536000; includeSubDomains
  - X-Content-Type-Options: nosniff
  - X-Frame-Options: SAMEORIGIN
  - Referrer-Policy: strict-origin-when-cross-origin
  - Permissions-Policy: camera=(), microphone=(), geolocation=()
- Zone settings enabled: always_use_https, brotli, http3, 0rtt, early_hints
- SSL mode: Full (strict attempted, reverted — GoDaddy origin cert doesn't pass strict validation)
- TODO: install origin cert on GoDaddy to enable Full (strict)

## 2026-05-26 — Production cutover

- Replaced legacy static site with React SPA at root
- Migrated video hosting to Cloudflare R2 (videos.lefthookstrategy.com)
- Old site archived in private repo: mlucido/lefthook-site-archive
- Pre-cutover server-side snapshot at /home/dh1ci8srgf9p/lefthookstrategy-pre-cutover-2026-05-26/
- Rollback: FTP mv files back from snapshot dir to public_html/

## 2026-05-26 — Phase 5: R2 video migration

- All 6 campaign videos uploaded to Cloudflare R2 bucket lefthook-videos
- Custom subdomain videos.lefthookstrategy.com serving via Cloudflare CDN
- Cache-Control: public, max-age=31536000, immutable on all video assets
- Accept-Ranges: bytes confirmed (video seeking works)

## 2026-05-21 — Phase 4: Staging deploy

- Deployed React SPA to staging-new/ subdirectory on GoDaddy shared hosting
- Fixed page title (Left Hook Communications → Left Hook Strategy)
- Added OG meta tags, WCAG AA contrast fixes, React 19 per-route titles
- Added <main> landmark for accessibility
