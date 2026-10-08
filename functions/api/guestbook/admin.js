// /api/guestbook/admin — for the owner only (needs "Authorization: Bearer <ADMIN_TOKEN>")
//   GET   every message, hidden ones included
//   POST  {"id": 12, "hidden": true}   hide or show a message
//   POST  {"id": 12, "delete": true}   remove it for good
import { json, isAdmin, ensureSchema } from '../../../lib/util.js';

export async function onRequest({ request, env }) {
  if (!env.DB) return json({ error: 'off' }, 503);
  if (!isAdmin(request, env)) return json({ error: 'not allowed' }, 401);
  await ensureSchema(env.DB);
  if (request.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT id, name, message, lang, created, hidden FROM guestbook ORDER BY created DESC LIMIT 500').all();
    return json({ entries: results });
  }
  if (request.method === 'POST') {
    let b; try { b = await request.json(); } catch (e) { return json({ error: 'bad request' }, 400); }
    const id = Number(b.id);
    if (!Number.isInteger(id)) return json({ error: 'bad id' }, 400);
    if (b.delete === true) await env.DB.prepare('DELETE FROM guestbook WHERE id = ?').bind(id).run();
    else await env.DB.prepare('UPDATE guestbook SET hidden = ? WHERE id = ?').bind(b.hidden ? 1 : 0, id).run();
    return json({ ok: true });
  }
  return json({ error: 'method' }, 405);
}
