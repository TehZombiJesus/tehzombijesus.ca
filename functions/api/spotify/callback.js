// GET /api/spotify/callback — Spotify sends you back here after you allow access. The refresh token is kept in D1.
import { ensureSchema, getSetting, setSetting } from '../../../lib/util.js';

function page(title, text, status = 200) {
  const html = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>${title}</title><body style="margin:0;min-height:100vh;display:grid;place-items:center;background:#0e080d;color:#f4ecf3;font:18px/1.5 system-ui,sans-serif">
<main style="max-width:30em;padding:24px;text-align:center"><h1 style="font-size:28px">${title}</h1><p>${text}</p><p><a style="color:#a855ff" href="/">Back to the site</a></p></main></body></html>`;
  return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if (!env.DB || !env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) return page('Not set up', 'The Spotify settings are missing.', 503);
  await ensureSchema(env.DB);
  const saved = JSON.parse((await getSetting(env.DB, 'spotify_state')) || 'null');
  const state = url.searchParams.get('state');
  if (!saved || saved.state !== state || saved.exp < Date.now()) return page('Link expired', 'Start again from the setup link.', 400);
  await setSetting(env.DB, 'spotify_state', 'null');
  if (url.searchParams.get('error')) return page('Cancelled', 'Spotify access was not allowed.', 400);
  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', authorization: 'Basic ' + btoa(env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET) },
    body: new URLSearchParams({ grant_type: 'authorization_code', code: url.searchParams.get('code') || '', redirect_uri: url.origin + '/api/spotify/callback' }),
  });
  if (!r.ok) return page('Something went wrong', 'Spotify did not accept the code. Check the client ID, secret and redirect address.', 502);
  const j = await r.json();
  await setSetting(env.DB, 'spotify_refresh', j.refresh_token);
  await setSetting(env.DB, 'spotify_access', JSON.stringify({ token: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 }));
  return page('Spotify connected 🎧', 'The site can now show what you are listening to. You can close this tab.');
}
