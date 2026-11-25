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

---

# Purge + traffic analysis (token retry)

## Token
New account-owned token written to `.env` as `CF_TOKEN` (`.env` is gitignored, not tracked). Verified via `/accounts/{id}/tokens/verify`: **active** (the `/user/tokens/verify` endpoint returns "Invalid API Token" for account-owned tokens, which is expected). Zone read OK. Capabilities used: Cache Purge and Analytics Read both worked. Global API key not used.

## Purge
237 unique URLs (233 paths from the 410 block in `public/.htaccess` + `/orrinevans.html`, `/404.html`, `/`, `/about`, `/privacy`; the space in `jobs 2.html` was URL-encoded) in 8 batches of 30 (last 27): **all 8 returned success**. The 410 URLs and `/orrinevans.html` were purged under the https apex host only (not www or other hosts).

`curl -sI /orrinevans.html` x3, 4 s apart:
```
HTTP/2 410  cf-cache-status: MISS
HTTP/2 410  cf-cache-status: HIT
HTTP/2 410  cf-cache-status: HIT
```
Always 410. The HITs are the 410 response itself being cached, not a stale 200.

## Traffic analysis, 2026-11-15 to 2026-11-17 (UTC)
Plan limits: `httpRequests1hGroups` only reaches back 3 days, so I used `httpRequestsAdaptiveGroups` (sampled, so counts are approximate). **ASN dimensions (`clientAsn`, `clientASNDescription`) are not available on this plan**; country and client IP are used instead. Raw output: `~/cg-ops/lh-t1/analytics.txt`.

**Volume by day (adaptive sample):** 11/15 4,025; 11/16 9,954; 11/17 10,510. Hourly peaks: 11/16 06:00 = 1,219 (daily peak); the overall 3-day peak was 11/17 15:00 = 1,599. So the elevated level lasted into 11/17, not just 11/16.

**Edge status (3 days):** 403 9,082; 301 3,554; 200 3,553; 404 2,801; 525 1,957; 502 1,643; 504 1,132; 204 280; 499 251; other < 120 each.
**Origin status:** 0 (no origin contact, i.e. edge-served or CF error) 8,754; 403 8,345; 404 2,766; 200 2,354; 502 1,643; 301 260; 304 204.
**Top paths:** `/` 2,820; `/robots.txt` 384; `/cdn-cgi/rum` 280; `/z0f76a1d14fd21a8fb5fd0d03e0fdc3d3cedae52f` 120; `/userfiles` 119; `/assets/index-DfTdr2Aw.js` 113; `/api/session/properties` 88; `/favicon.ico` 88; `/assets/index-DSX8lW2F.css` 87; `/sitemap.xml` 74; `/favicon-32x32.png` 72; `/index.php` 69; `/console` 67; `/site.webmanifest` 62; `/cgi-bin/php` 61. Also seen: `/.git/HEAD`, `/terraform.tfvars`, `/v1/.env`, `/Dockerrun.aws.json`, a `../../proc/self/environ` traversal.
**Top user agents:** empty UA 4,203; generic `Mozilla/5.0 (Windows NT 10.0...)` 1,345; "nginx-ssl early hints" 1,100 (Cloudflare internal); Chrome/131 Windows 986; Android Chrome/151 678; old iPhone iOS 13 489; then ~330-380 each for KimiBot, CCBot, Googlebot, Amazonbot, DuckAssistBot, ClaudeBot, Meta-ExternalAgent, Perplexity-User, cohere-ai (the same set also appears with Qwenbot, Bytespider, GrokBot, GPTBot).
**Top countries:** BE 5,517; US 4,509; SG 3,301; GB 3,193; ZA 2,364; JP 1,028; NL 712; FR 509; KR 473; DE 390.
**Top IPs:** 34.156.39.58 (3,458), 34.147.217.109, 34.21.138.242, 34.76.159.14 (all 34.x ranges, plausibly Google Cloud in Belgium/Europe; I did not look up ownership), 40.123.240.128, 20.106.103.160 (20.x / 40.x look like Azure ranges, also unverified).
**Hosts:** traffic is far wider than the apex. Over the 3 days: apex+www 403 4,615 / 200 3,466 / 301 2,105 / 504 982; plus `billing.` (1,643 x 502), `reels.` (404/301/403), `whm.` (403/404), `analytics.` (403), `drive.`, `dashboard.` (670 x 525) subdomains.

## Classification of the 11/16 spike: **scanner** (with a smaller origin-instability component)
- 06:00 UTC hour (1,219 requests): 1,056 came from the Belgium IP **34.156.39.58**, mostly against `billing.lefthookstrategy.com` (657 requests, 609 of them 502 from origin). Across the 3 days the same IP swept `whm.`, `billing.`, `drive.` and the apex, rotating User-Agents (KimiBot, GPTBot, Meta-ExternalAgent, Android Chrome) from a single IP, which is UA spoofing, not real crawlers. It requested `/.git/HEAD`, `/terraform.tfvars`, `/userfiles`, `/v1/.env`, `/Dockerrun.aws.json`.
- Human traffic is not the driver. Real-looking pageviews are `/` plus its assets, a few hundred per day, and the home page is a small share of the spike.
- Real crawlers (Googlebot, ClaudeBot, GPTBot, etc.) are steady background noise, about 330-380 each, not the spike.
- Origin (GoDaddy) instability is real but secondary: 982 x 504 on the apex over the 3 days, and 1,643 x 502 + 1,957 x 525 on subdomains with no working origin. It looks like a consequence of the scan hitting hostnames that don't serve anything, plus origin timeouts, rather than the cause.

**Action warranted?** Yes, low urgency: the site was not harmed (no 5xx on the 410/404 paths, probes mostly got 403/404), but I'd remove or un-proxy dangling proxied DNS records (`billing`, `whm`, `drive`, `dashboard`, `analytics`, `reels` if unused) and add a free-plan WAF rule blocking `/.git`, `.env`, `terraform` and `/proc/` paths.

## Risks and unverified
- Adaptive analytics are sampled; numbers are approximate. No ASN data on this plan. Scanner identification rests on one IP's behavior across subdomains; IP ownership was not checked (no whois).
- Purge covered the apex https URLs only; other cached copies (www, http) were not purged.
- "Spike" was classified from the 3-day data; the 11/16 06:00 UTC hour is the 11/16 peak, but 11/17 15:00 was higher.
- The DNS records named above were inferred from traffic, not read from the Cloudflare DNS table.

## Diffstat
Repo `lefthook-site`: this doc only (plus this commit); `.env` changed locally but is gitignored. No code changed.

## Numbers that moved
Cache purge: 237 URLs purged. `/orrinevans.html`: 410 (unchanged, now confirmed after purge).
