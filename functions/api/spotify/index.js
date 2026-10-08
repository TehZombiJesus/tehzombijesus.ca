// GET /api/spotify — what I'm listening to right now, or the last thing I played.
// Cached at the edge for 20 seconds. Podcasts are never shown.
import { json, ensureSchema, getSetting, setSetting, cached } from '../../../lib/util.js';

async function accessToken(env) {
  const saved = JSON.parse((await getSetting(env.DB, 'spotify_access')) || 'null');
  if (saved && saved.exp > Date.now() + 30000) return saved.token;
  const refresh = await getSetting(env.DB, 'spotify_refresh');
  if (!refresh) return null;
  const r = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded', authorization: 'Basic ' + btoa(env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET) },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
  });
  if (!r.ok) return null;
  const j = await r.json();
  await setSetting(env.DB, 'spotify_access', JSON.stringify({ token: j.access_token, exp: Date.now() + (j.expires_in || 3600) * 1000 }));
  if (j.refresh_token) await setSetting(env.DB, 'spotify_refresh', j.refresh_token);
  return j.access_token;
}

function shape(track, playing, at) {
  if (!track || track.type !== 'track') return null;
  const imgs = (track.album && track.album.images) || [];
  const art = imgs.slice().sort((a, b) => a.width - b.width).find(i => i.width >= 120) || imgs[0];
  return {
    playing, at: at || null,
    title: track.name,
    artist: (track.artists || []).map(a => a.name).join(', '),
    album: track.album ? track.album.name : '',
    art: art ? art.url : null,
    url: track.external_urls ? track.external_urls.spotify : null,
  };
}

export async function onRequestGet(context) {
  const { env } = context;
  if (!env.DB || !env.SPOTIFY_CLIENT_ID || !env.SPOTIFY_CLIENT_SECRET) return json({ error: 'off' }, 503);
  return cached(context.request, context, 20, async () => {
    await ensureSchema(env.DB);
    const token = await accessToken(env);
    if (!token) return json({ error: 'not connected' }, 503);
    const auth = { authorization: 'Bearer ' + token };
    const now = await fetch('https://api.spotify.com/v1/me/player/currently-playing', { headers: auth });
    if (now.status === 200) {
      const j = await now.json();
      const s = j && j.is_playing ? shape(j.item, true) : null;
      if (s) return json(s);
    }
    const recent = await fetch('https://api.spotify.com/v1/me/player/recently-played?limit=1', { headers: auth });
    if (recent.ok) {
      const j = await recent.json();
      const it = j.items && j.items[0];
      const s = it ? shape(it.track, false, it.played_at) : null;
      if (s) return json(s);
    }
    return json({ playing: false, title: null });
  });
}
