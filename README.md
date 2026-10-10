# tehzombijesus.ca

The personal site of **TehZombiJesus**: link hub, portfolio, homelab, setup, devlog and the Ruenix network.
Plain HTML, CSS and JavaScript, plus a few small Cloudflare functions for the live parts. Hosted on Cloudflare Pages, in English and French.

## Versions

The site, Crypt Keeper and (later) the Minecraft server all use the same scheme, shown as **v1.2.0 · build b66769c**:

- **Version** (the `VERSION` file here) follows *major.minor.patch*:
  - **patch** (1.2.0 → 1.2.1): fixes, wording, small tweaks
  - **minor** (1.2.0 → 1.3.0): a new page, section or feature
  - **major** (1.2.0 → 2.0.0): a redesign or anything that changes how the site works
- **Build** is the GitHub commit the live site was published from (`/api/version`), so the footer always says exactly what's running.

Every update: bump `VERSION`, add an entry to `CHANGELOG.md`, write a devlog post with its `versions`
(for example `['Website v1.1.0']`), run the build, push, then push a tag (`git tag v1.1.0 && git push origin v1.1.0`): `.github/workflows/release.yml` turns it into a GitHub release with the CHANGELOG notes.
The footer of every page shows the version (from `VERSION`, added by the build) and the build (filled in by `assets/version.js`).

## How it deploys

Every push to `main` goes live on its own, about a minute later.

| Cloudflare Pages setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `site` |

The `functions/` folder is picked up automatically: those become the `/api/...` addresses.

## What's where

```
site/                    everything that gets published
  index.html             home              (English pages sit at the top)
  homelab.html           homelab, the network map and the next server
  setup.html             the battlestation and the next build
  ruenix.html            the Minecraft network, with the opening-day countdown
  now.html               what I'm up to right now
  guestbook.html         the guestbook (guestbook-admin.html is the private moderation page)
  devlog.html, devlog/   GENERATED from tools/devlog_posts.py
  changelog.html         GENERATED from the git history
  404.html               page not found, with the Crypt Run game
  offline.html           shown by the installed app when there's no connection
  fr/                    GENERATED: the same pages in French
  styles.css             every style
  site.js                age, motion, scroll reveals, living background
  extras.js              terminal, achievements, seasons, clock, pet zombie, map, trackers, live features
  sw.js, manifest.webmanifest   installable app + offline support
  assets/                images, fonts (self-hosted), game, preview images
  _headers               security headers (A+ on securityheaders.com)
  feed.xml, fr/feed.xml  GENERATED RSS feeds for the devlog
  sitemap.xml            GENERATED
functions/api/           the live features, run by Cloudflare (see below)
lib/util.js              helpers shared by the functions
tools/
  build.py               rebuilds everything GENERATED above; run it after any change
  devlog_posts.py        the devlog posts, in English and French
  fr_dict.py             every English sentence and its French version
  build_fr.py, i18n.py, pagekit.py   used by build.py
  og.js                  makes the link preview image for each page
```

## Changing things

After any change, run `python3 tools/build.py`. It rebuilds the devlog, feeds, changelog, sitemap and every French page,
and lists any sentence that is still missing a French translation.

- **Text on a page:** edit the English page in `site/`, add the sentence and its French version to `tools/fr_dict.py`, then build.
- **New devlog post:** add it to `tools/devlog_posts.py` (both languages), then build. For its link preview, add nothing: run `node tools/og.js`.
- **Build trackers:** on `setup.html` and `homelab.html`, change `data-got="no"` to `data-got="yes"` when a part is bought. 
- **Ruenix opening day:** on `ruenix.html`, put the date in `data-opening`, for example `2026-12-01T19:00:00-05:00`. A live countdown appears.
- **Now page:** edit `site/now.html` and the "Updated" month.
- **Seasons, clock hours, terminal commands:** marked `EDIT` in `extras.js`. Preview a season with `?season=christmas`.
- **Link preview images:** `npm install @napi-rs/canvas` once, then `node tools/og.js`.

## Live features (Cloudflare functions)

Each one stays hidden on the site until it's set up, so nothing ever looks broken.

| Feature | Address | Needs |
| --- | --- | --- |
| Discord member count | `/api/discord` | nothing |
| "In the Crypt right now" counter | `/api/presence` | `DB` |
| Guestbook | `/api/guestbook` | `DB`, `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET`, `HASH_SALT` |
| Guestbook moderation | `/guestbook-admin.html` | `ADMIN_TOKEN` |
| Spotify "now playing" | `/api/spotify` | `DB`, `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `ADMIN_TOKEN` |
| Homelab live status (board, dots on the map and service cards, lab console) | `/api/status` | `KUMA_URL`, `KUMA_SLUG` |

### One-time setup

1. **Database.** Cloudflare dashboard → Storage & Databases → D1 → Create database, name it `tzj-site`.
   Then Workers & Pages → `tehzombijesus-ca` → Settings → Bindings → Add → D1 database: variable name `DB`, database `tzj-site`.
   The tables create themselves on first use.
2. **Turnstile (bot check for the guestbook).** Cloudflare dashboard → Turnstile → Add widget, hostname `tehzombijesus.ca`, mode Managed.
   Copy the site key and the secret key.
3. **Variables and secrets.** Workers & Pages → `tehzombijesus-ca` → Settings → Variables and Secrets (Production):
   - `TURNSTILE_SITE_KEY` (text): the site key
   - `TURNSTILE_SECRET` (secret): the secret key
   - `HASH_SALT` (secret): any long random text
   - `ADMIN_TOKEN` (secret): a long random password, at least 24 characters. Keep it in 1Password.
4. **Spotify.** At developer.spotify.com → Dashboard → Create app. Redirect URI: `https://tehzombijesus.ca/api/spotify/callback`, API: Web API.
   Add `SPOTIFY_CLIENT_ID` (text) and `SPOTIFY_CLIENT_SECRET` (secret) to the variables above.
5. **Homelab live status (Uptime Kuma).** In Uptime Kuma, make a public **Status page** (for example slug `homelab`) and add the monitors you want shown.
   Name each monitor the way it should appear on the site, like `Immich`, never after a hostname or address. Names that match a service card or a map box get a live dot there too.
   Then add `KUMA_URL` (secret, e.g. `https://status.example.com`) and `KUMA_SLUG` (text, e.g. `homelab`). Visitors only ever see names, up/down, uptime and response time: the address stays hidden.
6. **Redeploy** so the new settings load: Deployments → latest → Retry deployment (or push any change).
7. **Connect Spotify once:** open `https://tehzombijesus.ca/api/spotify/login?key=YOUR_ADMIN_TOKEN` and allow access.

## Privacy

No tracking and no cookies. Fonts are hosted here, so visitors never contact Google. The live counter stores only a random ID made up
by the page. The guestbook stores a salted hash instead of IP addresses, only to enforce "one message per 10 minutes".
Achievements, game scores and the pet zombie setting stay in the visitor's own browser.

## Hidden things

Press `` ` `` for the terminal (`help` lists everything). Type `crypt` anywhere. Try the Konami code. There are 16 achievements.
