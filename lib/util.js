// Shared helpers for the Cloudflare Pages Functions in /functions.
// Settings come from the Pages project (Settings → Variables and Secrets, and Bindings):
//   DB                    D1 database binding (guestbook, live counter, Spotify token)
//   ADMIN_TOKEN           secret: long random password for the guestbook admin page and Spotify setup
//   TURNSTILE_SITE_KEY    variable: the public Turnstile key
//   TURNSTILE_SECRET      secret: the private Turnstile key
//   SPOTIFY_CLIENT_ID     variable
//   SPOTIFY_CLIENT_SECRET secret
//   HASH_SALT             secret: any long random text, used to blur visitor IPs before rate limiting

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extra },
  });
}

export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// constant-time comparison for the admin token
export function sameText(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export function isAdmin(request, env) {
  if (!env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 24) return false;
  const h = request.headers.get('authorization') || '';
  return sameText(h.replace(/^Bearer\s+/i, ''), env.ADMIN_TOKEN);
}

let schemaReady = false;
export async function ensureSchema(db) {
  if (schemaReady) return;
  await db.batch([
    db.prepare(`CREATE TABLE IF NOT EXISTS guestbook (
      id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, message TEXT NOT NULL, lang TEXT NOT NULL DEFAULT 'en',
      created INTEGER NOT NULL, hidden INTEGER NOT NULL DEFAULT 0, who TEXT NOT NULL)`),
    db.prepare('CREATE INDEX IF NOT EXISTS guestbook_created ON guestbook (created)'),
    db.prepare('CREATE TABLE IF NOT EXISTS presence (id TEXT PRIMARY KEY, seen INTEGER NOT NULL)'),
    db.prepare('CREATE TABLE IF NOT EXISTS settings (k TEXT PRIMARY KEY, v TEXT NOT NULL)'),
  ]);
  schemaReady = true;
}

export async function getSetting(db, k) {
  const row = await db.prepare('SELECT v FROM settings WHERE k = ?').bind(k).first();
  return row ? row.v : null;
}
export async function setSetting(db, k, v) {
  await db.prepare('INSERT INTO settings (k, v) VALUES (?, ?) ON CONFLICT(k) DO UPDATE SET v = excluded.v').bind(k, v).run();
}

// Cache a GET response at Cloudflare's edge for a few seconds so busy moments don't hammer outside APIs
export async function cached(request, ctx, seconds, make) {
  const cache = caches.default;
  const key = new Request(new URL(request.url).toString(), { method: 'GET' });
  const hit = await cache.match(key);
  if (hit) return hit;
  const res = await make();
  if (res.ok) {
    const copy = new Response(res.body, res);
    copy.headers.set('cache-control', 'public, max-age=' + seconds);
    ctx.waitUntil(cache.put(key, copy.clone()));
    return copy;
  }
  return res;
}
