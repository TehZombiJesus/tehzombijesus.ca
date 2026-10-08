/* TehZombiJesus site — small scripts used on every page. */

// ===== Age: EDIT this to your birthday (YYYY-MM-DD). Until it's set, the page shows the number written in the HTML. =====
var BIRTHDAY = "1998-04-02";
(function () {
  var el = document.getElementById('age');
  var m = /^([0-9]{4})-([0-9]{2})-([0-9]{2})$/.exec(BIRTHDAY);
  if (!el || !m) return;
  var now = new Date(), age = now.getFullYear() - (+m[1]);
  if (now.getMonth() + 1 < +m[2] || (now.getMonth() + 1 === +m[2] && now.getDate() < +m[3])) age--;
  el.textContent = age;
})();

// Copy buttons (Riot ID, and the Ruenix address once it opens)
document.querySelectorAll('[data-copy]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var text = btn.getAttribute('data-copy');
    var done = function () { btn.textContent = 'Copied'; setTimeout(function () { btn.textContent = 'Copy'; }, 1600); };
    if (navigator.clipboard) { navigator.clipboard.writeText(text).then(done, function(){}); }
  });
});

/* =====================================================================
   MOTION LAYER — the living background, scroll reveals, tilt cards,
   the typed "Right now" line and a little easter egg.
   It all switches itself off for visitors who ask for less motion.
   ===================================================================== */
(function () {
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && matchMedia('(pointer: fine)').matches;
  var root = document.documentElement;
  root.classList.add('fx');

  // ----- Glowing clouds + progress line -----
  var aurora = document.createElement('div');
  aurora.className = 'fx-aurora'; aurora.setAttribute('aria-hidden', 'true');
  aurora.innerHTML = '<i></i><i></i><i></i>';
  document.body.prepend(aurora);
  var progress = document.createElement('div');
  progress.className = 'fx-progress'; progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);

  // ----- Scroll: progress, menu shadow, band parallax -----
  var nav = document.querySelector('.nav');
  var band = document.querySelector('.band svg');
  var ticking = false;
  function onScroll() {
    var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
    progress.style.setProperty('--p', max > 0 ? (y / max).toFixed(4) : 0);
    if (nav) nav.classList.toggle('scrolled', y > 10);
    if (band && !calm && y < 600) band.style.setProperty('--band-y', (y * 0.35).toFixed(1) + 'px');
    ticking = false;
  }
  addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // ----- Home hero: wrap the portrait for the spinning ring -----
  var av = document.querySelector('.hero .avatar');
  if (av && !av.parentElement.classList.contains('avatar-ring')) {
    var ring = document.createElement('div');
    ring.className = 'avatar-ring';
    av.parentNode.insertBefore(ring, av); ring.appendChild(av);
  }

  // ----- Scroll reveal, staggered inside each group -----
  var groups = [
    'section > h2', 'section > .lede', 'section > h3',
    '.links li', '.cols > .col', '.chips li', '.about', '.split > *', '.rows li',
    '.services > .svc', '.groups > .panel', '.rules > div', '.fig-grid > *',
    '.rx', '.contact', '.tags li', 'section > .panel', 'section > div'
  ];
  var seen = new Set(), targets = [];
  groups.forEach(function (sel) {
    var parents = new Map();
    document.querySelectorAll('main ' + sel).forEach(function (el) {
      if (seen.has(el) || el.closest('.hero, .page-head')) return;
      // skip wrappers whose pieces already animate on their own
      for (var s of seen) if (el.contains(s)) return;
      // skip anything already inside a revealed element (avoids double fades)
      for (var p = el.parentElement; p; p = p.parentElement) if (seen.has(p)) return;
      seen.add(el);
      var n = parents.get(el.parentElement) || 0;
      parents.set(el.parentElement, n + 1);
      el.style.setProperty('--d', Math.min(n * 0.07, 0.5) + 's');
      el.classList.add('reveal'); targets.push(el);
    });
  });
  if ('IntersectionObserver' in window && !calm) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    targets.forEach(function (el) { io.observe(el); });
  } else {
    targets.forEach(function (el) { el.classList.add('in'); });
  }

  // ----- Age counts up the first time it's seen -----
  var age = document.getElementById('age');
  if (age && !calm && 'IntersectionObserver' in window) {
    var final = +age.textContent;
    var aio = new IntersectionObserver(function (es) {
      if (!es[0].isIntersecting) return;
      aio.disconnect();
      var t0 = performance.now();
      (function step(t) {
        var k = Math.min(1, (t - t0) / 1200);
        age.textContent = Math.round(final * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    });
    aio.observe(age);
  }

  // ----- "Right now:" typed line -----
  var typed = document.querySelector('.typed-text');
  if (typed) {
    var words = (typed.getAttribute('data-words') || '').split('|').filter(Boolean);
    if (words.length > 1 && !calm) {
      var wi = 0, ci = words[0].length, deleting = true;
      setTimeout(function tick() {
        var w = words[wi];
        if (deleting) {
          ci--; typed.textContent = w.slice(0, ci);
          if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; return setTimeout(tick, 300); }
          return setTimeout(tick, 28);
        }
        w = words[wi]; ci++; typed.textContent = w.slice(0, ci);
        if (ci === w.length) { deleting = true; return setTimeout(tick, 2600); }
        setTimeout(tick, 55 + Math.random() * 45);
      }, 3200);
    }
  }

  // ----- Cards: tilt + cursor spotlight (mouse only) -----
  if (finePointer && !calm) {
    document.querySelectorAll('.panel, .svc, .rx, .tags li, .me li, .layout-fig').forEach(function (el) { el.classList.add('spot'); });
    document.querySelectorAll('.cols > .col, .groups > .panel, .split > .panel, .rx').forEach(function (el) { el.classList.add('tilt'); });
    document.addEventListener('pointermove', function (e) {
      var el = e.target.closest && e.target.closest('.spot, .tilt');
      if (!el) return;
      var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      el.style.setProperty('--mx', x + 'px'); el.style.setProperty('--my', y + 'px');
      if (el.classList.contains('tilt')) {
        el.classList.add('tracking');
        var strength = el.classList.contains('rx') ? 3 : 6;
        el.style.setProperty('--ry', ((x / r.width - 0.5) * strength).toFixed(2) + 'deg');
        el.style.setProperty('--rx', ((0.5 - y / r.height) * strength).toFixed(2) + 'deg');
      }
    }, { passive: true });
    document.addEventListener('pointerout', function (e) {
      var el = e.target.closest && e.target.closest('.tilt');
      if (el && !el.contains(e.relatedTarget)) {
        el.classList.remove('tracking'); el.style.setProperty('--rx', '0deg'); el.style.setProperty('--ry', '0deg');
      }
    });
    // Buttons lean gently toward the cursor
    document.querySelectorAll('.btn').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.12).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.2).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }

  // ----- The living sky: embers that drift up and dodge the cursor -----
  if (calm) return;
  var cv = document.createElement('canvas');
  cv.id = 'fx-sky'; cv.setAttribute('aria-hidden', 'true');
  document.body.prepend(cv);
  var ctx = cv.getContext('2d');
  var month = new Date().getMonth(); // 9 = October, 11 = December
  var spooky = month === 9, snowy = month === 11 || month === 0;
  var palette = spooky ? ['#fb54f7', '#8300fb', '#e8a850', '#ff8a3d'] : snowy ? ['#ffffff', '#d8c7ff', '#bfe3ff'] : ['#fb54f7', '#a855ff', '#8300fb', '#e8a850'];
  var W, H, dpr, parts = [], bats = [], mouse = { x: -999, y: -999 };
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = innerWidth; H = innerHeight;
    cv.width = W * dpr; cv.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var want = Math.round(Math.min(90, W * H / 18000));
    while (parts.length < want) parts.push(make(true));
    parts.length = want;
  }
  function make(anywhere) {
    return {
      x: Math.random() * W, y: anywhere ? Math.random() * H : H + 10,
      r: snowy ? 1 + Math.random() * 2.4 : 0.6 + Math.random() * 1.9,
      vy: snowy ? 0.25 + Math.random() * 0.6 : -(0.15 + Math.random() * 0.45),
      vx: (Math.random() - 0.5) * 0.25, a: 0, life: 0, max: 400 + Math.random() * 600,
      c: palette[(Math.random() * palette.length) | 0], tw: Math.random() * 6.28
    };
  }
  if (spooky) for (var b = 0; b < 3; b++) bats.push({ x: Math.random() * innerWidth, y: 80 + Math.random() * innerHeight * 0.5, s: 0.6 + Math.random() * 0.5, v: 0.4 + Math.random() * 0.5, f: Math.random() * 6 });
  function drawBat(x, y, s, flap) {
    var w = Math.sin(flap) * 6 * s;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(20, 8, 24, 0.85)';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-10, -8 - w, -22, -4 - w * 1.4); ctx.quadraticCurveTo(-16, -1, -14, 4);
    ctx.quadraticCurveTo(-8, 1, -4, 5); ctx.quadraticCurveTo(0, 2, 4, 5);
    ctx.quadraticCurveTo(8, 1, 14, 4); ctx.quadraticCurveTo(16, -1, 22, -4 - w * 1.4);
    ctx.quadraticCurveTo(10, -8 - w, 0, 0); ctx.fill();
    ctx.beginPath(); ctx.arc(0, 0, 3.2, 0, 6.3); ctx.fill();
    ctx.restore();
  }
  var running = true, last = 0;
  function frame(t) {
    if (!running) return;
    requestAnimationFrame(frame);
    if (t - last < 30) return; // ~30 fps is plenty and kind to laptops
    last = t;
    ctx.clearRect(0, 0, W, H);
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.life++; p.tw += 0.05;
      var dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
      if (d2 < 14000) { var f = (14000 - d2) / 14000 * 0.9; p.x += dx / Math.sqrt(d2 + 1) * f * 2; p.y += dy / Math.sqrt(d2 + 1) * f * 2; }
      p.x += p.vx + Math.sin(p.tw * 0.5) * 0.15; p.y += p.vy;
      var fade = Math.min(1, p.life / 60, (p.max - p.life) / 60);
      if (p.life > p.max || p.y < -10 || p.y > H + 12) { parts[i] = make(false); if (snowy) parts[i].y = -10; continue; }
      ctx.globalAlpha = Math.max(0, fade) * (0.45 + Math.sin(p.tw) * 0.25);
      ctx.fillStyle = p.c;
      ctx.shadowColor = p.c; ctx.shadowBlur = snowy ? 0 : 8;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.3); ctx.fill();
    }
    ctx.shadowBlur = 0; ctx.globalAlpha = 1;
    bats.forEach(function (bt) {
      bt.f += 0.35; bt.x += bt.v; bt.y += Math.sin(bt.f * 0.15) * 0.6;
      if (bt.x > W + 40) { bt.x = -40; bt.y = 80 + Math.random() * H * 0.5; }
      drawBat(bt.x, bt.y, bt.s, bt.f);
    });
  }
  size();
  addEventListener('resize', size);
  addEventListener('pointermove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
  document.addEventListener('pointerleave', function () { mouse.x = mouse.y = -999; });
  document.addEventListener('visibilitychange', function () {
    running = !document.hidden;
    if (running) requestAnimationFrame(frame);
  });
  requestAnimationFrame(frame);

  // ----- Easter egg: type "crypt" anywhere to release the bats -----
  var buffer = '';
  addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    buffer = (buffer + (e.key || '')).slice(-5).toLowerCase();
    if (buffer !== 'crypt') return;
    for (var i = 0; i < 14; i++) {
      var bat = document.createElement('span');
      bat.className = 'fx-bat'; bat.textContent = '🦇'; bat.setAttribute('aria-hidden', 'true');
      bat.style.top = (10 + Math.random() * 70) + 'vh';
      bat.style.setProperty('--t', (2.2 + Math.random() * 2) + 's');
      bat.style.animationDelay = (Math.random() * 1.2) + 's';
      bat.style.fontSize = (22 + Math.random() * 26) + 'px';
      document.body.appendChild(bat);
      bat.addEventListener('animationend', function () { this.remove(); });
    }
  });
})();
