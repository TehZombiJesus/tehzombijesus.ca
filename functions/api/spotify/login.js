// GET /api/spotify/login?key=<ADMIN_TOKEN> — one-time setup: sends you to Spotify to allow "currently playing".
import { ensureSchema, setSetting, sameText } from '../../../lib/util.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  if (!env.DB || !env.SPOTIFY_CLIENT_ID || !env.ADMIN_TOKEN || env.ADMIN_TOKEN.length < 24 || !sameText(url.searchParams.get('key') || '', env.ADMIN_TOKEN)) {
    return new Response('Not allowed.', { status: 401 });
  }
  await ensureSchema(env.DB);
  const state = crypto.randomUUID();
  await setSetting(env.DB, 'spotify_state', JSON.stringify({ state, exp: Date.now() + 10 * 60 * 1000 }));
  const go = new URL('https://accounts.spotify.com/authorize');
  go.search = new URLSearchParams({
    client_id: env.SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: url.origin + '/api/spotify/callback',
    scope: 'user-read-currently-playing user-read-recently-played',
    state,
  });
  return Response.redirect(go.toString(), 302);
}
