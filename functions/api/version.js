// GET /api/version — the GitHub commit (build) this site was published from, for the footer: "v1.2.0 · build b66769c".
// Uses Cloudflare's own CF_PAGES_COMMIT_SHA when it's available; otherwise asks GitHub for the latest commit on main
// (the same thing once a deploy finishes), cached for 10 minutes.
import { json, cached } from '../../lib/util.js';

const REPO = 'TehZombiJesus/tehzombijesus.ca';

export async function onRequestGet(context) {
  const fromCloudflare = context.env.CF_PAGES_COMMIT_SHA;
  if (fromCloudflare) return json({ build: fromCloudflare, url: `https://github.com/${REPO}/commit/${fromCloudflare}` });
  return cached(context.request, context, 600, async () => {
    try {
      const r = await fetch(`https://api.github.com/repos/${REPO}/commits/main`, {
        headers: { 'user-agent': 'tehzombijesus.ca (Cloudflare Pages)', accept: 'application/vnd.github+json' },
      });
      if (r.ok) { const j = await r.json(); return json({ build: j.sha, url: j.html_url }); }
    } catch (e) {}
    return json({ error: 'unavailable' }, 503);
  });
}
