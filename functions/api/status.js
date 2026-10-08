// GET /api/status — live service status for the homelab page, read from an Uptime Kuma status page.
// Settings (Pages project → Settings → Variables and Secrets):
//   KUMA_URL   secret: the address of your Uptime Kuma, e.g. https://status.example.com (never shown to visitors)
//   KUMA_SLUG  variable: the status page's slug (the last part of its address), e.g. homelab
// Only monitor names, up/down, uptime and response time leave this function: no addresses, hostnames or error messages.
// So name your monitors the way you want them shown (e.g. "Immich"), not after a hostname.
import { json, cached } from '../../lib/util.js';

const STATUS = { 0: 'down', 1: 'up', 2: 'pending', 3: 'maintenance' };
const when = t => { if (!t) return null; const d = new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(t) ? t : t.replace(' ', 'T') + 'Z'); return isNaN(d) ? null : d.toISOString(); };

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.KUMA_URL || !env.KUMA_SLUG) return json({ error: 'not set up' }, 404);
  return cached(context.request, context, 60, async () => {
    const base = env.KUMA_URL.replace(/\/+$/, ''), slug = encodeURIComponent(env.KUMA_SLUG);
    const get = async p => {
      const r = await fetch(base + p, { headers: { accept: 'application/json', 'user-agent': 'tehzombijesus.ca status' }, signal: AbortSignal.timeout(8000) });
      if (!r.ok) throw new Error(String(r.status));
      return r.json();
    };
    let page, beats;
    try { [page, beats] = await Promise.all([get(`/api/status-page/${slug}`), get(`/api/status-page/heartbeat/${slug}`)]); }
    catch (e) { return json({ error: 'unavailable' }, 503); }

    const services = [];
    let lastOutage = null;
    for (const group of page.publicGroupList || []) {
      for (const m of group.monitorList || []) {
        const list = ((beats.heartbeatList || {})[m.id] || []).slice().sort((a, b) => (when(a.time) || '').localeCompare(when(b.time) || ''));
        const last = list[list.length - 1];
        // when the current status started: walk back to the last different beat
        let since = last ? when(last.time) : null;
        for (let i = list.length - 2; i >= 0; i--) { if (list[i].status !== last.status) break; since = when(list[i].time); }
        for (const b of list) if (b.status === 0) { const t = when(b.time); if (t && (!lastOutage || t > lastOutage)) lastOutage = t; }
        const up = beats.uptimeList || {};
        services.push({
          name: String(m.name).slice(0, 60),
          group: String(group.name || '').slice(0, 40),
          status: last ? STATUS[last.status] || 'pending' : 'pending',
          since,
          ping: last && typeof last.ping === 'number' ? Math.round(last.ping) : null,
          uptime24: typeof up[`${m.id}_24`] === 'number' ? up[`${m.id}_24`] : null,
          uptime30: typeof up[`${m.id}_720`] === 'number' ? up[`${m.id}_720`] : null,
          recent: list.slice(-30).map(b => (b.status === 1 ? 1 : b.status === 0 ? 0 : 2)),
        });
      }
    }
    const down = services.filter(s => s.status === 'down').length;
    const odd = services.filter(s => s.status !== 'up').length;
    const inc = page.incident && page.incident.title ? { title: String(page.incident.title).slice(0, 120), at: when(page.incident.lastUpdatedDate || page.incident.createdDate) } : null;
    return json({
      updated: new Date().toISOString(),
      overall: !services.length ? 'unknown' : down === services.length ? 'down' : odd ? 'degraded' : 'up',
      services, lastOutage, incident: inc,
      maintenance: (page.maintenanceList || []).length > 0,
    });
  });
}
