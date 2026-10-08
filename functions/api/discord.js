// GET /api/discord — member and online counts for The Crypt, fetched by Cloudflare and cached for 5 minutes.
import { json, cached } from '../../lib/util.js';

const INVITE = 'DRSZb9qqqh';              // EDIT: The Crypt invite code
const GUILD = '1556862328505507931';      // used only if the invite lookup fails (needs Server Settings → Widget on)

export async function onRequestGet(context) {
  return cached(context.request, context, 300, async () => {
    const headers = { 'user-agent': 'tehzombijesus.ca (Cloudflare Pages)' };
    try {
      const r = await fetch(`https://discord.com/api/v10/invites/${INVITE}?with_counts=true`, { headers });
      if (r.ok) {
        const j = await r.json();
        return json({ online: j.approximate_presence_count ?? null, members: j.approximate_member_count ?? null });
      }
    } catch (e) {}
    try {
      const r = await fetch(`https://discord.com/api/guilds/${GUILD}/widget.json`, { headers });
      if (r.ok) { const j = await r.json(); return json({ online: j.presence_count ?? null, members: null }); }
    } catch (e) {}
    return json({ error: 'unavailable' }, 503);
  });
}
