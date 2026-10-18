# TehZombiJesus development build

Based on upstream main d5d48a0a9acdec8aa8f6d2309b6d65e53640fea7, reviewed October 18, 2026. This is an isolated development copy. Production is untouched. Development branch: dev-site-refresh-2026-10-18.

## Preview

Requires Node.js 24 or later. From this folder run:

    node dev-server.mjs

Open http://127.0.0.1:4173. English and French pages are included. The local server serves static files; it does not execute Cloudflare Functions. It returns disabled integration configuration, so guestbook submission, Discord counts, Spotify, presence, and live lab status are not connected locally.

## Changes

- Compact branded hero and project-first homepage.
- Dedicated bilingual Crypt page; clear distinction from Ruenix.
- Curated devlog links and Now summary.
- Responsive menu with always-visible language switch.
- Visible persistent effects control; effects off by default. OS reduced-motion preference remains respected.
- Current setup before future build details.
- Lab map before the product roadmap.
- NullDaily roadmap: Stavo, Servio, Budvo planned adoption; Labvo and Pingvo intended when released; Routvo and Termvo possible later. No implication these are already installed. Product status comes from nulldaily.com on October 18, 2026, not independent software validation.
- Preview noindex headers, robots policy, labels, and no service-worker registration.
- Full-birthday constant removed from site.js; existing birthday celebration logic in extras.js retained.

## Cloudflare Pages preview

Use a separate Pages project or a preview branch that is NOT the production branch. Keep output directory site. This bundle includes functions/ and lib/ unchanged. Do not reuse production secrets or D1 bindings for a preview.

The original generator requires Python 3. Run python tools/build.py before deploying if changing source content. New copy is included in tools/fr_dict.py and the Crypt page is included in the French generator. Generated HTML is already bundled. The Python build and live Cloudflare integrations were not executed in this environment.

This is deliberately marked noindex and preview-only. Before promoting a reviewed version, remove preview labels and noindex policy, re-enable the intended service-worker behavior, and regenerate the sitemap/feeds. Do not merge this development copy directly into production without that review.

## Verification

JavaScript syntax, source completeness, bilingual navigation, local link targets, and new product states are checked with node verify-dev.mjs. The browser could not reach the local preview in the execution environment; desktop/mobile visual QA of this build remains pending.
