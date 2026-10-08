/* Crypt Run: a tiny endless runner for the 404 page.
   Jump the tombstones with Space, ↑, a click or a tap. Best score is saved in the visitor's browser. */
(function () {
  'use strict';
  var cv = document.getElementById('crypt-run');
  if (!cv) return;
  var FR = document.documentElement.lang === 'fr';
  function t(en, fr) { return FR ? fr : en; }
  var ctx = cv.getContext('2d');
  var W = 800, H = 240, GROUND = 196, dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  var best = 0; try { best = +localStorage.getItem('tzj.runBest') || 0; } catch (e) {}
  var state, raf = 0, last = 0;

  function reset() {
    state = { run: false, over: false, t: 0, score: 0, speed: 330, y: 0, vy: 0, obs: [], next: 1.2, legs: 0, stars: [] };
    for (var i = 0; i < 40; i++) state.stars.push([Math.random() * W, Math.random() * (GROUND - 60), Math.random()]);
  }
  function jump() {
    if (state.over) { reset(); state.run = true; loop(); return; }
    if (!state.run) { state.run = true; loop(); }
    if (state.y === 0) state.vy = -560;
  }
  function spawn() {
    var tall = Math.random() < 0.3, bat = state.score > 12 && Math.random() < 0.25;
    if (bat) state.obs.push({ x: W + 20, w: 30, h: 16, y: GROUND - 74, bat: true, f: 0 });
    else state.obs.push({ x: W + 20, w: tall ? 26 : 22, h: tall ? 46 : 34, y: GROUND, bat: false });
    if (!bat && Math.random() < 0.18 && state.score > 6) state.obs.push({ x: W + 52, w: 22, h: 34, y: GROUND, bat: false });
    state.next = 0.9 + Math.random() * 1.1 - Math.min(0.4, state.score / 120);
  }
  function step(dt) {
    var s = state;
    s.t += dt; s.speed = 330 + s.score * 6; s.score += dt * 2.2; s.legs += dt * 12;
    s.vy += 1700 * dt; s.y = Math.min(0, s.y + s.vy * dt); if (s.y === 0) s.vy = 0;
    s.next -= dt; if (s.next <= 0) spawn();
    var zx = 90, zy = GROUND + s.y;
    for (var i = s.obs.length - 1; i >= 0; i--) {
      var o = s.obs[i]; o.x -= s.speed * dt; if (o.bat) o.f += dt * 14;
      if (o.x < -60) { s.obs.splice(i, 1); continue; }
      // forgiving hitbox
      var top = o.bat ? o.y - o.h / 2 : o.y - o.h, bottom = o.bat ? o.y + o.h / 2 : o.y;
      if (zx + 20 > o.x + 4 && zx + 4 < o.x + o.w - 4 && zy > top + 6 && zy - 46 < bottom - 2) gameOver();
    }
  }
  function gameOver() {
    state.over = true; state.run = false;
    var sc = Math.floor(state.score);
    if (sc > best) { best = sc; try { localStorage.setItem('tzj.runBest', best); } catch (e) {} }
    if (sc >= 25 && window.TZJ) window.TZJ.unlock('survivor');
  }
  function zombie(x, y, legs) {
    var c = ctx, sw = Math.sin(legs) * 5;
    c.fillStyle = '#2f4a22'; c.fillRect(x + 4 + sw, y - 14, 6, 14); c.fillRect(x + 12 - sw, y - 14, 6, 14);     // legs
    c.fillStyle = '#8300fb'; c.fillRect(x + 2, y - 32, 20, 19);                                                  // hoodie
    c.fillStyle = '#7fb069'; c.fillRect(x + 18, y - 30, 16, 6);                                                  // arms out
    c.fillRect(x + 4, y - 48, 16, 16);                                                                            // head
    c.fillStyle = '#0e080d'; c.fillRect(x + 13, y - 43, 3, 3); c.fillRect(x + 7, y - 43, 3, 3);                 // eyes
    c.fillStyle = '#fb54f7'; c.fillRect(x + 8, y - 36, 8, 2);                                                    // mouth
    c.fillStyle = '#3a2a3a'; c.fillRect(x + 3, y - 50, 18, 4);                                                   // hair
  }
  function draw() {
    var s = state, c = ctx;
    var g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1a0f22'); g.addColorStop(1, '#2a1630');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    s.stars.forEach(function (st) { c.globalAlpha = 0.3 + 0.5 * Math.abs(Math.sin(s.t * 2 + st[2] * 9)); c.fillStyle = '#f4ecf3'; c.fillRect((st[0] - s.t * 8 * st[2]) % W < 0 ? (st[0] - s.t * 8 * st[2]) % W + W : (st[0] - s.t * 8 * st[2]) % W, st[1], 2, 2); });
    c.globalAlpha = 1;
    c.fillStyle = '#e8a850'; c.beginPath(); c.arc(W - 90, 52, 26, 0, 7); c.fill();
    c.fillStyle = '#1a0f22'; c.beginPath(); c.arc(W - 80, 46, 24, 0, 7); c.fill();
    c.fillStyle = '#3a2a3a'; c.fillRect(0, GROUND, W, H - GROUND);
    c.fillStyle = '#472f4a'; for (var i = 0; i < W; i += 40) c.fillRect((i - (s.t * s.speed) % 40 + 40) % (W + 40) - 20, GROUND + 14, 18, 3);
    s.obs.forEach(function (o) {
      if (o.bat) {
        var f = Math.sin(o.f) * 7; c.fillStyle = '#0e080d';
        c.beginPath(); c.moveTo(o.x, o.y); c.lineTo(o.x + 15, o.y - 10 - f); c.lineTo(o.x + 15, o.y + 4); c.lineTo(o.x + 30, o.y - 10 - f); c.lineTo(o.x + 30, o.y); c.lineTo(o.x + 15, o.y + 8); c.closePath(); c.fill();
        c.fillStyle = '#fb54f7'; c.fillRect(o.x + 12, o.y - 2, 2, 2); c.fillRect(o.x + 17, o.y - 2, 2, 2);
      } else {
        c.fillStyle = '#6b6370'; c.fillRect(o.x, o.y - o.h + 8, o.w, o.h - 8);
        c.beginPath(); c.arc(o.x + o.w / 2, o.y - o.h + 9, o.w / 2, Math.PI, 0); c.fill();
        c.fillStyle = '#4a4350'; c.fillRect(o.x + o.w / 2 - 1, o.y - o.h + 10, 2, 12); c.fillRect(o.x + o.w / 2 - 5, o.y - o.h + 14, 10, 2);
      }
    });
    zombie(90, GROUND + s.y, s.y === 0 ? s.legs : 0.6);
    c.fillStyle = '#f4ecf3'; c.font = '700 20px "Chakra Petch", sans-serif'; c.textAlign = 'right';
    c.fillText(String(Math.floor(s.score)).padStart(3, '0'), W - 20, 30);
    c.fillStyle = '#b6a6b5'; c.font = '600 14px Inter, sans-serif';
    c.fillText(t('Best ', 'Record ') + best, W - 20, 52);
    c.textAlign = 'center';
    if (!s.run && !s.over) {
      c.fillStyle = '#f4ecf3'; c.font = '700 26px "Chakra Petch", sans-serif';
      c.fillText(t('Crypt Run', 'Course de la Crypte'), W / 2, 92);
      c.font = '400 16px Inter, sans-serif'; c.fillStyle = '#b6a6b5';
      c.fillText(t('Press Space or tap to jump the graves', 'Appuie sur Espace ou touche l\'écran pour sauter les tombes'), W / 2, 122);
    }
    if (s.over) {
      c.fillStyle = 'rgba(14,8,13,.6)'; c.fillRect(0, 0, W, H);
      c.fillStyle = '#fb54f7'; c.font = '700 30px "Chakra Petch", sans-serif';
      c.fillText(t('You got buried', 'Tu t\'es fait enterrer'), W / 2, 96);
      c.fillStyle = '#f4ecf3'; c.font = '400 16px Inter, sans-serif';
      c.fillText(t('Score ', 'Pointage ') + Math.floor(s.score) + ' · ' + t('Space or tap to rise again', 'Espace ou touche pour te relever'), W / 2, 128);
    }
  }
  function loop(ts) {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(function frame(now) {
      if (!last) last = now;
      var dt = Math.min(0.04, (now - last) / 1000); last = now;
      if (state.run) step(dt);
      draw();
      if (state.run) raf = requestAnimationFrame(frame); else last = 0;
    });
  }
  addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('input, textarea, .term')) return;
    if (e.code === 'Space' || e.key === 'ArrowUp') {
      var r = cv.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      e.preventDefault(); jump();
    }
  });
  cv.addEventListener('pointerdown', function (e) { e.preventDefault(); jump(); });
  reset(); draw();
})();
