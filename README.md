# tehzombijesus.ca

The personal site of **TehZombiJesus**: link hub, portfolio, homelab, setup and the Ruenix network.
Plain HTML, CSS and JavaScript. No framework and no build step. Hosted on Cloudflare Pages.

## How it deploys

Every push to `main` goes live on its own. Cloudflare Pages publishes the `site/` folder as it is.

| Cloudflare Pages setting | Value |
| --- | --- |
| Framework preset | None |
| Build command | *(empty)* |
| Build output directory | `site` |

## What's where

```
site/                 everything that gets published
  index.html          home          (English pages sit at the top)
  homelab.html        homelab, the network map and the next server
  setup.html          the battlestation and the next build
  ruenix.html         the Minecraft network
  now.html            what I'm up to right now
  404.html            page not found
  fr/                 the same pages in French (built by tools/build_fr.py)
  styles.css          every style, motion layer included
  site.js             age, motion, scroll reveals, living background
  extras.js           terminal, achievements, seasons, clock, map, trackers, Discord count
  assets/             images; assets/season/ holds the seasonal tab icons
  _headers            security headers (A+ on securityheaders.com)
  sitemap.xml, robots.txt
tools/
  build_fr.py         rebuilds site/fr/ from the English pages
  fr_dict.py          every English sentence and its French version
  i18n.py             finds all the text that needs translating
```

## Changing things

- **Text:** edit the English page in `site/`. Then add the new sentence and its French version to `tools/fr_dict.py`, and run `python3 tools/build_fr.py`. The script lists any sentence that is still missing a translation.
- **Build trackers:** on `setup.html` and `homelab.html`, change `data-got="no"` to `data-got="yes"` when a part is bought. Do it on the English page, then rebuild French.
- **Now page:** edit `site/now.html`, update the month, then rebuild French.
- **Seasons:** colours and labels live at the top of the seasons section in `extras.js`. Preview any season with `?season=christmas` at the end of the address.
- **Clock and status:** the hours for "probably asleep / working / gaming" are marked `EDIT` in `extras.js`.

## Hidden things

Press `` ` `` for the terminal. Type `crypt` anywhere. Try the Konami code. There are 15 achievements.
