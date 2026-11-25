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
