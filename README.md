# tehzombijesus.ca

The personal site of **TehZombiJesus**: link hub, portfolio, homelab, setup, devlog and the Ruenix network.
Plain HTML, CSS and JavaScript, plus a few small Cloudflare functions for the live parts. Hosted on Cloudflare Pages, in English and French.

## How it deploys

Every push to `main` goes live on its own, about a minute later.

| Cloudflare Pages setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `site` |

The `functions/` folder is picked up automatically: those become the `/api/...` addresses.

### The `dev` branch (try things without touching the live site)

Pushes to `dev` never go to tehzombijesus.ca. Cloudflare builds them as a **preview** at
`https://dev.tehzombijesus-ca.pages.dev` (the exact address shows under Workers & Pages → `tehzombijesus-ca` → Deployments).
Previews use the *Preview* variables, not *Production*, so the live features that need secrets stay hidden there unless you add them.
When you like what's on `dev`, merge it into `main` and it goes live.

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
- **New devlog post:** every update to anything (this site, the Discord server and bot, the Minecraft server, the homelab, the setup) gets one. Add it to `tools/devlog_posts.py` in both languages with its `project`, then build. For its link preview, run `node tools/og.js`. When it reaches `main`, it's announced on Discord by itself (see below).
- **Build trackers:** on `setup.html` and `homelab.html`, change `data-got="no"` to `data-got="yes"` when a part is bought. On the homelab page, that part also lights up in the server drawing (matched by `data-key`).
- **Ruenix opening day:** on `ruenix.html`, put the date in `data-opening`, for example `2026-12-01T19:00:00-05:00`. A live countdown appears.
- **Now page:** edit `site/now.html` and the "Updated" month.
- **Seasons, clock hours, terminal commands:** marked `EDIT` in `extras.js`. Preview a season with `?season=christmas`.
- **Link preview images:** `npm install @napi-rs/canvas` once, then `node tools/og.js`.
- **Illustrations** (`site/assets/art/*.svg`: the rack room, battlestation, Crypt window, terminal and the rings behind the portrait) are drawn in code by `tools/make_art.py`. Change a colour or a number and run `python3 tools/make_art.py`. `portrait.webp` is the avatar cut out and relit in the brand colours.

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

## Discord announcements

`.github/workflows/discord.yml` runs on GitHub after every push to `main` (never for `dev`). It waits for the site to publish, then:

- posts each **new devlog post** to Discord, in English and French, with a link (`DISCORD_DEVLOG_WEBHOOK`)
- optionally posts the **list of changes** in that push (`DISCORD_CHANGELOG_WEBHOOK`)

One-time setup:

1. In Discord, open the channel's settings → Integrations → Webhooks → New Webhook. Name it, pick the channel, and Copy Webhook URL.
2. On GitHub: this repository → Settings → Secrets and variables → Actions → New repository secret.
   Name `DISCORD_DEVLOG_WEBHOOK`, paste the URL. (Optional: a second webhook for a changelog channel as `DISCORD_CHANGELOG_WEBHOOK`.)
3. That's it. To post an entry again: Actions → Announce on Discord → Run workflow → type the post's slug.

Treat a webhook URL like a password: anyone who has it can post in that channel. If it leaks, delete the webhook in Discord and make a new one.

## Privacy

No tracking and no cookies. Fonts are hosted here, so visitors never contact Google. The live counter stores only a random ID made up
by the page. The guestbook stores a salted hash instead of IP addresses, only to enforce "one message per 10 minutes".
Achievements, game scores and the pet zombie setting stay in the visitor's own browser.

## Hidden things

Press `` ` `` for the terminal (`help` lists everything). Type `crypt` anywhere. Try the Konami code. There are 17 achievements.
