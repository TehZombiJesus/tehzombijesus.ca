// GET /api/config — tells the page which live features are switched on, so anything not set up stays hidden.
import { json } from '../../lib/util.js';

export async function onRequestGet({ env }) {
  return json({
    presence: !!env.DB,
    guestbook: !!(env.DB && env.TURNSTILE_SECRET && env.TURNSTILE_SITE_KEY && env.HASH_SALT),
    turnstileSiteKey: env.TURNSTILE_SITE_KEY || null,
    spotify: !!(env.DB && env.SPOTIFY_CLIENT_ID && env.SPOTIFY_CLIENT_SECRET),
  });
}
