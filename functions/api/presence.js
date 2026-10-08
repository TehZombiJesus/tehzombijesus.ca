// POST /api/presence  {"id": "<random id kept in the visitor's browser tab>"}
// Records a heartbeat and answers with how many visitors were seen in the last 70 seconds.
// Nothing personal is stored: only a random id made up by the page, and a timestamp.
import { json, ensureSchema } from '../../lib/util.js';

export async function onRequestPost({ request, env }) {
  if (!env.DB) return json({ error: 'off' }, 503);
  let id = '';
  try { id = String((await request.json()).id || ''); } catch (e) {}
  if (!/^[a-z0-9]{12,40}$/.test(id)) return json({ error: 'bad id' }, 400);
  await ensureSchema(env.DB);
  const now = Date.now();
  await env.DB.batch([
    env.DB.prepare('INSERT INTO presence (id, seen) VALUES (?, ?) ON CONFLICT(id) DO UPDATE SET seen = excluded.seen').bind(id, now),
    env.DB.prepare('DELETE FROM presence WHERE seen < ?').bind(now - 5 * 60 * 1000),
  ]);
  const row = await env.DB.prepare('SELECT COUNT(*) AS n FROM presence WHERE seen > ?').bind(now - 70 * 1000).first();
  return json({ here: row ? row.n : 1 });
}
