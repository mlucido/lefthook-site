# 2026-11-25 — Orrin removal, 410 rule, traffic check

## 1. Docroot
- FTP (107.180.12.16:21, login OK) lands in the cPanel home `/home/dh1ci8srgf9p/`, not the docroot.
- lefthookstrategy.com is served from **`public_html/` root** (SPA files: index.html, assets/, favicons, sitemap.xml, robots.txt, .htaccess, thumbs/, og-image.png).
- Other client domains are subfolders under it: lefthookcomms.com, payyourtaxesmikegarcia.com, thefabulouslifeofkarenhandel.com, thesweep.ai, thesweep.org, woketh.com, yesmeasureb.com. None were touched or downloaded.

## 2. Orrin hunt
**Live docroot (mirrored excluding the 7 client folders, 20 files): zero hits** for "orrin"/"evans" by filename or content (case-insensitive). So the old file is already gone; the "200" on /orrinevans.html was the SPA catch-all.

Hits elsewhere:
| Location | Path | Served? |
|---|---|---|
| FTP home (outside docroot) | `lefthookstrategy-pre-cutover-2026-05-26/orrin-evans.html` | No (not under public_html) |
| lefthook-site-archive | `email-sig/full/orrin.html`, `email-sig/small/small-orrin.html` (name + content) | n/a (repo) |
| lefthook-site-archive | `files/uploads/team/orrin_evans.jpg`, `orrin_evans_cover.jpg` | n/a |
| lefthook-site-archive | content mentions: `index.html`, `index-new.html` (team card linking `orrin-evans.html`), `email-sig/small.html` | n/a |
| lefthook-site-archive | `files/uploads/portfolio/coral_evans_schools.png`, `coralevans_environment.png` | Different person (Coral Evans client); not Orrin, left alone |
| lefthook-site (current) | none | |

(The archive's "evans" content grep also matched ~14 client pages, e.g. franktorres.html, heatherhutt.html — surname matches, not Orrin.)

## 3. Delete live Orrin files
Nothing to delete: no Orrin files exist in the live docroot. No commit to the archive repo, nothing removed from the server. The pre-cutover backup folder in the FTP home was left untouched (outside the lefthookstrategy.com docroot).

## 4. 410 rule
- Backup of live .htaccess committed first (`ac08f27`): `docs/audits/2026-11-25-artifacts/htaccess.live-backup-before`.
- Added above the SPA fallback (below the HTTPS/www redirect), host-scoped, `[G,NC,L]`. 234 paths: `orrinevans.html`, `orrin-evans.html`, the 2 email-sig Orrin pages, the 2 Orrin jpgs, plus every legacy `.html` in the archive repo except `index.html` (live SPA file).
- Uploaded to `public_html/.htaccess` (5732 bytes). New copy: `...-artifacts/htaccess.live-after`.
- Also inserted the same block into `public/.htaccess` so a rebuild/deploy doesn't drop it.

Diff (long regex truncated):
```
+# 410 Gone: removed Orrin Evans pages and legacy static-site pages (added 2026-11-25)
+# Scoped to this host only (other client domains share this docroot tree).
+RewriteCond %{HTTP_HOST} ^(www\.)?lefthookstrategy\.com$ [NC]
+RewriteRule ^(2020reel\.html|2021reel\.html|314action\.html|404\.html|...|orrinevans\.html|...)$ - [G,NC,L]
```

## 5. Cloudflare purge — NOT DONE
`CF_TOKEN` in .env fails `/user/tokens/verify` with `Invalid API Token` (code 1000); HANDOFF says it expired 2026-09-11. I did not fall back to the global API key also in .env. Effect: Cloudflare's HTML rule caches 1h edge TTL per colo, so any colo that cached the old soft-200 may serve it up to ~1h after the .htaccess change (~until 21:05 UTC). Origin check from my location already shows 410.

## 6. Verification
```
orrinevans.html                       410
orrin-evans.html                      410
email-sig/full/orrin.html             410
email-sig/small/small-orrin.html      410
files/uploads/team/orrin_evans.jpg    410
files/uploads/team/orrin_evans_cover.jpg 410
2020reel.html, AFSCME.html            410
/  /about  /privacy                   200 (2822 bytes, SPA shell; JS render not checked in a browser)
/sitemap.xml                          200
videos.lefthookstrategy.com/web-kelly.mp4 (Range 0-99)  206 video/mp4
thesweep.ai                           200
```
Other domains (observations, **not caused by this change**; the 410 rule is host-scoped):
- `https://woketh.com`, `yesmeasureb.com`, `thefabulouslifeofkarenhandel.com`, `thesweep.org`: HTTPS fails with `SSL certificate problem: self signed certificate` (origin cert issue; HANDOFF already notes thesweep.org).
- `http://woketh.com/` returns `301 Location: https://lefthookstrategy.com/`. Cause is the pre-existing, un-scoped HTTPS rule in the root .htaccess (`RewriteCond %{HTTPS} off` → `https://lefthookstrategy.com/$1`), which parent-inherits into the client folders. Worth scoping to this host; I did not change it.
- `payyourtaxesmikegarcia.com` has no DNS A record.

## 7. Traffic spike (11/15–11/17) — NOT DONE
Same invalid Cloudflare token; analytics read cannot be called. No classification made. Needs a fresh token with Zone Analytics:Read (and Cache Purge:Purge for step 5).

## Not completed
- Step 5 (URL purge) and step 7 (GraphQL analytics): Cloudflare token expired/invalid.
- Step 3 had nothing to do.

## Notes
- The FTP password appeared in tool output once (an lftp URL echo during my first connection attempt). Consider rotating it.
- `public/.htaccess` in the repo has drifted from the live file (live has the HTTPS/www redirect; repo has `Options -MultiViews`). Not reconciled.
- FTP home also holds stray `index.html`, `index-*.js/css`, `brandon_hall.jpg`, `.htaccess` outside public_html; not touched.

---

# T1 follow-up: 404 fix + host scoping

## Backup
Live `.htaccess` (5732 bytes) saved before any change: `docs/audits/2026-11-25-artifacts/htaccess.live-before-t1` (committed first). Final live copy: `htaccess.live-after-t1`.

## Changes
- `public/404.html` added (#0A0A0A / #F0EEE9 / #6B8FC7, Bebas Neue "PAGE NOT FOUND", DM Sans line, link to `/`, `noindex`). Fonts come from Google Fonts with system fallbacks.
- Live root `.htaccess` rewritten; every rule is scoped to `^(www\.)?lefthookstrategy\.com$`, in this order:
  1. 410 block (now 233 paths, see note), first.
  2. HTTPS redirect and www to apex redirect, host-scoped (the old rule was unscoped, which sent `http://woketh.com` etc. to Left Hook).
  3. Real files/dirs served as-is.
  4. Only `/`, `/about`, `/privacy` (optional trailing slash) rewrite to `/index.html`.
  5. Everything else gets `[R=404]`, with `ErrorDocument 404 /404.html` inside an Apache 2.4 `<If>` on `HTTP_HOST`.
- **Deviation:** `404\.html` was one of the 234 paths in the 410 block, so `/404.html` would have returned 410 and the error page would never render. I removed that one entry (233 remain). Nothing else in the block changed.
- Uploaded `404.html` and `.htaccess` only. Re-downloaded both and confirmed they are byte-identical to `public/404.html` and `public/.htaccess`.

## Verification (curl -sI, via Cloudflare)
```
/                          200 text/html
/about                     200 text/html
/privacy                   200 text/html
/orrinevans.html           410
/orrin-evans.html          410
/2020reel.html             410
/zzz-test-123              404 text/html, body <h1>PAGE NOT FOUND</h1>
/team.html                 404 text/html
/404.html                  200
/og-image.png              200 image/png
/assets/brandon_hall.jpg   200 image/jpeg
videos.lefthookstrategy.com/web-kelly.mp4 (Range 0-99)  206 video/mp4
http://lefthookstrategy.com/about   301 -> https://lefthookstrategy.com/about
https://www.lefthookstrategy.com/about  301 -> https://lefthookstrategy.com/about
http://woketh.com/         200 (no longer redirects to Left Hook)
```
Headless Chromium (networkidle): `/` renders h1 "HIT 'EM WITH THAT LEFT HOOK", `/about` renders h1 "AWARD-WINNING POLITICAL STRATEGY & MEDIA".

## Cohosted domains, before vs after (status and Location)
| URL | Before | After |
|---|---|---|
| http://thesweep.ai/ , https://thesweep.ai/ (and /zzz-test-123) | 200 | 200 (unchanged) |
| http://thesweep.org/ | 301 -> https://lefthookstrategy.com/ | 200 |
| https://thesweep.org/ | 200 | 200 |
| https://thesweep.org/zzz-test-123 | 404 | 404 |
| http://woketh.com/ | 301 -> https://lefthookstrategy.com/ | 200 |
| http://yesmeasureb.com/ | 301 -> https://lefthookstrategy.com/ | 200 |
| http://thefabulouslifeofkarenhandel.com/ | 301 -> https://lefthookstrategy.com/ | 200 |
| https://woketh.com/, yesmeasureb.com, thefabulouslifeofkarenhandel.com `/` | 200 | 200 |
| https://woketh.com/zzz-test-123 (same for yesmeasureb, karenhandel) | 200 | 404 |
| http://woketh.com/zzz-test-123 (same pattern on the other 3) | 301 -> lefthookstrategy.com | 404 |
| lefthookcomms.com (http and https, `/` and missing path) | 301 -> https://www.lefthookstrategy.com/ | 301 -> https://www.lefthookstrategy.com/ (unchanged; comes from its own config) |
| payyourtaxesmikegarcia.com | no DNS (000) | not retested |

Intended changes: the http-to-Left-Hook redirects are gone. **Unrequested side effect:** missing paths on woketh.com, yesmeasureb.com and thefabulouslifeofkarenhandel.com used to get a soft 200 (their own `index.html`, via the old unscoped SPA fallback) and now return a real 404. Those are static sites, not SPAs, so I scoped the fallback as asked. If any of them relied on it, add a per-folder `.htaccess`. Raw before/after captures are in `~/cg-ops/lh-t1/`. The HTTPS cert errors on these domains from the earlier audit were not retested, and `-k` was used.

## Cloudflare purge: NOT DONE (needs new token)
Both token variables in `.env` (`CF_TOKEN`, `CF_TOKEN_USER`) fail verification (`Invalid API Token` on user and account verify endpoints). `docs/HANDOFF.md` has no token values, only the 1Password name. The global key `CF_API_KEY` was not used. Observed: `/orrinevans.html` already returns 410 at the edge (cache HIT, age ~1190s), so no stale 200 was seen from my location, but other colos may still hold old copies until the edge TTL expires. Pages cached before the change (e.g. `/privacy` HIT) are unaffected because their content did not change.

# Traffic analysis: NOT DONE (needs new token)
The Cloudflare GraphQL analytics call needs a valid token with Zone Analytics:Read. No classification of the 11/16 spike was made. Needs new token.
