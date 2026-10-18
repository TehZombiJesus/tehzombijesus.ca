# Full redesign development preview

Preview: https://dev-site-refresh-2026-10-18.tehzombijesus-ca.pages.dev
Draft review: https://github.com/TehZombiJesus/tehzombijesus.ca/pull/1

Production and the existing dev branch are untouched. This is design study 02 on the isolated dev-site-refresh-2026-10-18 branch.

## Design

A complete editorial redesign with a large portrait, typographic introduction, three distinct project worlds, personal introduction, journal links and an after-hours section. The new design applies across the existing English and French pages, including the journal, setup, homelab, community, Now page and guestbook. No made-up testimonials, uptime statistics or hardware photos. Original assets are reused.

Long pages get a section index. Mobile navigation keeps the language switch visible. Effects remain off by default and OS reduced-motion preferences are respected.

## Updated migration plan

- Proxmox remains the compute foundation.
- Uptime Kuma → Pingvo, planned after Pingvo is released. The current status adapter still reads Uptime Kuma; a Pingvo adapter needs the actual API when migration happens.
- Coolify → Servio. Docker hosting capability was confirmed by the owner through Ronnie. The migration is planned, not claimed complete.
- TrueNAS ⇢ Stavo is conditional. Stavo is intended for the personal cloud, but is not a full TrueNAS replacement today. Broader storage features are planned according to Ronnie; retain TrueNAS until real storage requirements are met.
- Budvo, Labvo and Pingvo are intended additions; Routvo and Termvo are later possibilities. Labvo and Pingvo are described as planned products, not installed services.

The architecture drawing includes planned hardware and is now labeled accordingly.

## Page improvements

- Home: project-first introduction, stronger portrait, reduced repetition, separate personal and project stories.
- Homelab: explicit migration scope; architecture before product roadmap; current and future software distinguished.
- Setup: current equipment first; future equipment labeled; buying choices can be revisited and compatibility is checked before ordering.
- The Crypt: a community-led introduction with distinct Discord, Minecraft and Crypt Keeper sections.
- Ruenix: launch status and its own Discord appear before the longer details.
- Now: a concise focus statement before the project lists.
- Devlog: a quieter editorial list with existing filters, article navigation and RSS preserved.
- Guestbook: clearer form styling; moderation and anti-spam code unchanged.

## Suggestions for a next iteration

1. Add real desk/lab photographs and screenshots as they become available. Avoid representing concepts as existing equipment.
2. Replace hard-coded featured journal links with entries generated from tools/devlog_posts.py so new stories appear automatically.
3. Make migration notes into small case studies: requirements, tradeoffs, cutover and outcome. Do not promise data migration or parity without checking real product behavior.
4. Add a private pre-cutover checklist for backups, restore tests and rollback; keep sensitive topology out of the public site.
5. When Pingvo ships, review its API and replace the Kuma adapter separately from this visual redesign.

## Preview and checks

Requires Node.js 24+. Run node dev-server.mjs and open http://127.0.0.1:4173. Static preview does not execute Cloudflare Functions or connect production services. Cloudflare keeps the existing functions/ and lib/ unchanged.

Run node verify-dev.mjs. The GitHub workflow also runs python tools/build.py and repeats the checks against regenerated output. New English/French content and inline fragments are in tools/fr_dict.py.

This branch is deliberately noindex and preview-only; service-worker registration is disabled. Before a reviewed production merge, remove preview labels/noindex policy, restore intended service-worker behavior and regenerate outputs. Never point production at this branch directly.

The earlier development build passed desktop/mobile browser review. The full redesign is being validated separately on the hosted preview; only the final review report should be used for its QA status. API writes and private integrations are not tested.
