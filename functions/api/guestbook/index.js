// /api/guestbook
//   GET   the latest visible messages
//   POST  {"name", "message", "lang", "token"}  sign the guestbook (token comes from the Turnstile widget)
// Spam protection: Turnstile, a length limit, no links, and one message per visitor every 10 minutes.
// Visitor IPs are never stored: only a salted hash, used for the 10-minute limit.
import { json, sha256, ensureSchema } from '../../../lib/util.js';

const MAX_NAME = 32, MAX_MSG = 280;
const LINKY = /(https?:|www\.|\.(com|net|org|ru|xyz|io|gg|ca|co)\b|discord\.gg)/i;

export async function onRequestGet({ env }) {
  if (!env.DB) return json({ error: 'off' }, 503);
  await ensureSchema(env.DB);
  const { results } = await env.DB.prepare(
    'SELECT id, name, message, lang, created FROM guestbook WHERE hidden = 0 ORDER BY created DESC LIMIT 60').all();
  return json({ entries: results });
}

export async function onRequestPost({ request, env }) {
  if (!env.DB || !env.TURNSTILE_SECRET || !env.HASH_SALT) return json({ error: 'off' }, 503);
  let body;
  try { body = await request.json(); } catch (e) { return json({ error: 'bad request' }, 400); }
  const name = String(body.name || '').replace(/\s+/g, ' ').trim();
  const message = String(body.message || '').replace(/\r/g, '').replace(/\n{3,}/g, '\n\n').trim();
  const lang = body.lang === 'fr' ? 'fr' : 'en';
  if (!name || name.length > MAX_NAME) return json({ error: 'name' }, 400);
  if (!message || message.length > MAX_MSG) return json({ error: 'message' }, 400);
  if (LINKY.test(name) || LINKY.test(message)) return json({ error: 'links' }, 400);

  // Turnstile: Cloudflare confirms a human sent this
  const ip = request.headers.get('cf-connecting-ip') || '';
  const form = new FormData();
  form.append('secret', env.TURNSTILE_SECRET);
  form.append('response', String(body.token || ''));
  if (ip) form.append('remoteip', ip);
  let verdict = {};
  try {
    const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    verdict = await check.json();
  } catch (e) { verdict = {}; }
  if (!verdict.success) return json({ error: 'captcha' }, 403);

  await ensureSchema(env.DB);
  const who = await sha256(env.HASH_SALT + '|' + ip);
  const now = Date.now();
  const recent = await env.DB.prepare('SELECT COUNT(*) AS n FROM guestbook WHERE who = ? AND created > ?').bind(who, now - 10 * 60 * 1000).first();
  if (recent && recent.n > 0) return json({ error: 'slow down' }, 429);
  const res = await env.DB.prepare('INSERT INTO guestbook (name, message, lang, created, who) VALUES (?, ?, ?, ?, ?)')
    .bind(name, message, lang, now, who).run();
  return json({ ok: true, entry: { id: res.meta && res.meta.last_row_id, name, message, lang, created: now } }, 201);
}
