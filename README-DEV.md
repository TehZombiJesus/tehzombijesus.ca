# Development preview — branding and homelab correction

Preview: https://dev-site-refresh-2026-10-18.tehzombijesus-ca.pages.dev
Draft PR: https://github.com/TehZombiJesus/tehzombijesus.ca/pull/1

Production and the pre-existing dev branch are untouched.

## Brand

The original favicon/logo, wordmark, slanted purple/plum/magenta artwork and portrait are restored prominently. The editorial layout is retained, but the original identity anchors it again.

## Homelab source of truth

The owner supplied a system export on October 18, 2026. Confirmed public hardware facts: HP EliteDesk 800 G5 Desktop Mini, Intel Core i5-9500T with 6 cores/6 threads, 64 GB DDR4 (2×32 GB Kingston, configured at 2667 MT/s), two approximately 2 TB NVMe drives, Intel UHD Graphics 630 and Intel I219-LM. The export does not establish the pool layout, mirror configuration, application inventory, router or off-site server. Serial numbers, UUID, raw diagnostics, memory-module identifiers, and firmware/security diagnostics are not included in the website or repository.

The homelab page is now only:

1. Today — confirmed current hardware.
2. Planned software — Stavo, Servio, Budvo, Labvo and Pingvo, with clearly described intended roles and release limitations. Servio Docker support comes from the owner's confirmation from Ronnie. Stavo is not described as a current full TrueNAS replacement.
3. Possibly later — Routvo and Termvo.

The unverified What's running inventory, mixed current/future connection map, duplicate chapter sections and old larger-server proposal were removed from this page. Their old source remains in Git history. Current applications and real topology can be added after the owner confirms them; do not recreate them from older pages or assume a mirror from two drives.

## Run and verify

Node.js 24+: node dev-server.mjs, then http://127.0.0.1:4173. Local preview does not execute Cloudflare Functions. Run node verify-dev.mjs. CI also runs python tools/build.py and repeats source checks against regenerated pages. Live integrations are retained unchanged and have not been tested for writes.

The preceding full redesign passed desktop/mobile browser review. This correction is checked separately on the deployed preview. Preview-only noindex directives and disabled service-worker registration remain deliberate. Do not merge or promote to production without review.
