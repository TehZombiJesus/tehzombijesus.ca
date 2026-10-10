/* =====================================================================
   TehZombiJesus site — extras.
   Seasons, birthday mode, local time, portrait flip, copy email,
   back-to-top hand, achievements, the hidden terminal, the homelab map,
   the setup drawing, build trackers and the live Discord count.
   Works in English and French: the page's <html lang="..."> decides.
   ===================================================================== */
(function () {
  'use strict';
  var FR = document.documentElement.lang === 'fr';
  function t(en, fr) { return FR ? fr : en; }
  var BASE = ((document.currentScript && document.currentScript.src) || '').replace(/[^/]*$/, '');
  var calm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var TZ = 'America/Toronto';               // EDIT: my time zone (Gatineau runs on Eastern time)
  var DISCORD_INVITE = 'DRSZb9qqqh';        // EDIT: The Crypt invite code
  var DISCORD_GUILD = '1556862328505507931';
  var EMAIL = 'hello@tehzombijesus.ca';

  // ---------- tiny helpers ----------
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem('tzj.' + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem('tzj.' + k, JSON.stringify(v)); } catch (e) {} }
  };
  function el(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function zoned(d) { // date parts in my time zone
    var p = {}; new Intl.DateTimeFormat('en-CA', { timeZone: TZ, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' })
      .formatToParts(d || new Date()).forEach(function (x) { p[x.type] = +x.value; });
    return p;
  }
  var page = (location.pathname.split('/').pop() || 'index.html').replace(/\.html$/, '') || 'index';
  if (document.querySelector('.page-head.lost')) page = '404';

  var toastBox = el('div', 'fx-toasts'); toastBox.setAttribute('aria-live', 'polite');
  document.body.appendChild(toastBox);
  // toasts wait their turn: at most two on screen at once
  var queue = [], showing = 0;
  function toast(html, cls, ms) { queue.push([html, cls, ms]); pump(); }
  function pump() {
    if (showing >= 2 || !queue.length) return;
    var q = queue.shift(); showing++;
    var n = el('div', 'fx-toast ' + (q[1] || ''), q[0]);
    toastBox.appendChild(n);
    requestAnimationFrame(function () { requestAnimationFrame(function () { n.classList.add('show'); }); });
    setTimeout(function () {
      n.classList.remove('show');
      setTimeout(function () { n.remove(); showing--; pump(); }, 400);
    }, q[2] || 2600);
  }
  function copy(text, done) {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(done, function () { fallback(); });
    else fallback();
    function fallback() {
      var ta = el('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) {} ta.remove();
    }
  }

  // =====================================================================
  // ACHIEVEMENTS — saved only in the visitor's own browser
  // =====================================================================
  var ACH = [
    ['welcome', '🕯️', 'Welcome to the Crypt', 'Bienvenue dans la Crypte', 'Visit the site for the first time.', 'Visiter le site pour la première fois.'],
    ['explorer', '🧭', 'Explorer', 'Explorateur', 'Visit every page.', 'Visiter toutes les pages.'],
    ['terminal', '💻', 'Root access', 'Accès root', 'Open the hidden terminal.', 'Ouvrir le terminal caché.'],
    ['sudo', '🚫', 'Nice try', 'Bien essayé', 'Try sudo in the terminal.', 'Essayer sudo dans le terminal.'],
    ['bats', '🦇', 'Release the bats', 'Libérez les chauves-souris', 'Type "crypt" anywhere.', 'Taper « crypt » n\'importe où.'],
    ['faces', '🎭', 'Two faces', 'Deux visages', 'Flip the portrait.', 'Retourner le portrait.'],
    ['email', '📋', 'Copy that', 'Bien reçu', 'Copy the email address.', 'Copier l\'adresse courriel.'],
    ['map', '🗺️', 'Network admin', 'Admin réseau', 'Inspect the homelab map.', 'Explorer la carte du homelab.'],
    ['deep', '🤿', 'Deep diver', 'Plongeur', 'Read the homelab page to the bottom.', 'Lire la page Homelab jusqu\'en bas.'],
    ['owl', '🦉', 'Night owl', 'Oiseau de nuit', 'Visit between midnight and 5 AM.', 'Visiter entre minuit et 5 h.'],
    ['konami', '🕹️', 'Old school', 'À l\'ancienne', 'Enter the Konami code.', 'Entrer le code Konami.'],
    ['lost', '👻', 'Lost soul', 'Âme perdue', 'Find the 404 page.', 'Trouver la page 404.'],
    ['bilingual', '⚜️', 'Bilingual', 'Bilingue', 'Read the site in both languages.', 'Lire le site dans les deux langues.'],
    ['cake', '🎂', 'Party guest', 'Invité de la fête', 'Visit on my birthday.', 'Visiter le jour de ma fête.'],
    ['survivor', '🏃', 'Survivor', 'Survivant', 'Score 25 in the 404 game.', 'Faire 25 points au jeu de la page 404.'],
    ['guest', '✍️', 'Signed in blood', 'Signé avec du sang', 'Sign the guestbook.', 'Signer le livre d\'or.'],
    ['completionist', '🏆', 'Completionist', 'Complétionniste', 'Unlock every other achievement.', 'Débloquer tous les autres succès.']
  ];
  var got = store.get('ach', {});
  function achName(a) { return FR ? a[3] : a[2]; }
  function unlock(id) {
    if (got[id]) return;
    var a = ACH.filter(function (x) { return x[0] === id; })[0]; if (!a) return;
    got[id] = Date.now(); store.set('ach', got);
    toast('<span class="ach-ico">' + a[1] + '</span><span><small>' + t('Achievement unlocked', 'Succès débloqué') + '</small><b>' + esc(achName(a)) + '</b></span>', 'ach', 3800);
    updateTrophy();
    var others = ACH.filter(function (x) { return x[0] !== 'completionist'; });
    if (id !== 'completionist' && others.every(function (x) { return got[x[0]]; })) setTimeout(function () { unlock('completionist'); }, 1500);
  }
  window.TZJ = { unlock: unlock, toast: toast };

  // trophy button in the footer
  var trophy = el('button', 'trophy-btn'); trophy.type = 'button';
  var foot = document.querySelector('footer .wrap');
  if (foot) foot.appendChild(trophy);
  function updateTrophy() {
    var n = ACH.filter(function (a) { return got[a[0]]; }).length;
    trophy.innerHTML = '🏆 <span>' + n + '/' + ACH.length + '</span>';
    trophy.title = t('Achievements', 'Succès');
  }
  updateTrophy();
  trophy.addEventListener('click', showAchievements);
  function showAchievements() {
    var n = ACH.filter(function (a) { return got[a[0]]; }).length;
    var list = ACH.map(function (a) {
      var on = !!got[a[0]];
      return '<li class="' + (on ? 'on' : '') + '"><span class="ach-ico">' + (on ? a[1] : '🔒') + '</span><span><b>' + esc(on ? achName(a) : '???') +
        '</b><small>' + esc(FR ? a[5] : a[4]) + '</small></span></li>';
    }).join('');
    modal('<h2>' + t('Achievements', 'Succès') + '</h2><p class="muted">' + n + ' / ' + ACH.length + ' · ' +
      t('Saved in your browser only.', 'Sauvegardés dans ton navigateur seulement.') + '</p><div class="ach-bar"><i style="width:' + Math.round(n / ACH.length * 100) + '%"></i></div><ul class="ach-list">' + list + '</ul>');
  }
  function modal(html) {
    var back = el('div', 'fx-modal'), box = el('div', 'fx-modal-box', html), x = el('button', 'fx-close', '×');
    x.type = 'button'; x.setAttribute('aria-label', t('Close', 'Fermer'));
    box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true');
    box.prepend(x); back.appendChild(box); document.body.appendChild(back);
    function close() { back.remove(); removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }
    x.addEventListener('click', close); back.addEventListener('click', function (e) { if (e.target === back) close(); });
    addEventListener('keydown', onKey); x.focus();
  }

  // page visits, language, time-based achievements
  var seen = store.get('pages', {}); seen[page] = 1; store.set('pages', seen);
  var langs = store.get('langs', {}); langs[FR ? 'fr' : 'en'] = 1; store.set('langs', langs);
  setTimeout(function () {
    unlock('welcome');
    if (['index', 'homelab', 'setup', 'ruenix', 'now'].every(function (p) { return seen[p]; })) unlock('explorer');
    if (langs.en && langs.fr) unlock('bilingual');
    if (page === '404') unlock('lost');
    var h = new Date().getHours(); if (h < 5) unlock('owl');
  }, 2500);
  if (page === 'homelab') {
    addEventListener('scroll', function onS() {
      if (innerHeight + scrollY >= document.documentElement.scrollHeight - 40) { unlock('deep'); removeEventListener('scroll', onS); }
    }, { passive: true });
  }
  // "crypt" bats live in site.js; listen for the same word here for the achievement
  var buf = '';
  addEventListener('keydown', function (e) {
    if (e.target.closest && e.target.closest('input, textarea')) return;
    buf = (buf + (e.key || '')).slice(-5).toLowerCase();
    if (buf === 'crypt') unlock('bats');
  });

  // =====================================================================
  // SEASONS — same calendar as the Discord server icon
  // =====================================================================
  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    var g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
    var l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    return [Math.floor((h + l - 7 * m + 114) / 31), ((h + l - 7 * m + 114) % 31) + 1];
  }
  function seasonFor(y, m, d) {
    var md = m * 100 + d;
    if (md >= 1231 || md <= 102) return 'new-year';
    if (md === 214) return 'valentines';
    if (md === 317) return 'st-patricks';
    if (md === 401) return 'april-fools';
    if (md === 402) return 'birthday';
    var es = easter(y), day = Date.UTC(y, m - 1, d), sun = Date.UTC(y, es[0] - 1, es[1]);
    if (day >= sun - 864e5 && day <= sun + 864e5) return 'easter';
    if (md === 624) return 'fete-nationale';
    if (md === 701) return 'canada-day';
    if (md === 1006) return 'crypt-anniversary';
    var starts = { 320: 'spring', 621: 'summer', 922: 'fall', 1221: 'winter' };
    if (starts[md]) return starts[md];
    if (m === 10) return 'halloween';
    if (m === 12) return 'christmas';
    if (m === 6) return 'pride';
    return 'normal';
  }
  // EDIT: accent colour and label for each season
  var SEASONS = {
    'new-year': ['#e8a850', '🎆', 'Happy New Year', 'Bonne année'],
    valentines: ['#ff5c8a', '💕', 'Valentine\'s Day', 'Saint-Valentin'],
    'st-patricks': ['#4ade80', '☘️', 'St. Patrick\'s Day', 'Saint-Patrick'],
    'april-fools': ['#fbbf24', '🤡', 'April Fools\' Day', 'Poisson d\'avril'],
    easter: ['#c4b5fd', '🥚', 'Easter', 'Pâques'],
    'fete-nationale': ['#60a5fa', '⚜️', 'Fête nationale', 'Fête nationale'],
    'canada-day': ['#ef4444', '🍁', 'Canada Day', 'Fête du Canada'],
    'crypt-anniversary': ['#fb54f7', '🎂', 'The Crypt\'s birthday', 'La fête de la Crypte'],
    spring: ['#f9a8d4', '🌸', 'First day of spring', 'Premier jour du printemps'],
    summer: ['#fbbf24', '☀️', 'First day of summer', 'Premier jour de l\'été'],
    fall: ['#f97316', '🍂', 'First day of fall', 'Premier jour de l\'automne'],
    winter: ['#7dd3fc', '❄️', 'First day of winter', 'Premier jour de l\'hiver'],
    halloween: ['#ff8a3d', '🎃', 'Halloween mode', 'Mode Halloween'],
    christmas: ['#ef4444', '🎄', 'Christmas mode', 'Mode Noël'],
    pride: ['rainbow', '🌈', 'Pride Month', 'Mois de la fierté'],
    birthday: ['#fb54f7', '🎂', 'It\'s my birthday', 'C\'est ma fête']
  };
  var now = zoned();
  var season = seasonFor(now.year, now.month, now.day);
  if (/[?&]season=([a-z-]+)/.test(location.search)) season = RegExp.$1; // preview: ?season=christmas
  var S = SEASONS[season];
  if (S) {
    var rootEl = document.documentElement;
    rootEl.setAttribute('data-season', season);
    if (S[0] !== 'rainbow') rootEl.style.setProperty('--magenta', S[0]);
    var icon = season === 'birthday' ? 'normal' : season;
    var link = document.querySelector('link[rel="icon"]');
    if (link) { link.href = BASE + 'assets/season/' + icon + '.png'; link.type = 'image/png'; }
    if (foot) {
      var tag = el('span', 'season-tag', S[1] + ' ' + esc(FR ? S[3] : S[2]));
      foot.insertBefore(tag, trophy);
    }
  }

  // ---------- Birthday mode (April 2) ----------
  if (season === 'birthday') {
    setTimeout(function () { unlock('cake'); }, 3000);
    var banner = el('div', 'bday-banner', '🎂 ' + t('It\'s my birthday today! Thanks for stopping by.', 'C\'est ma fête aujourd\'hui! Merci de passer faire un tour.'));
    var nav = document.querySelector('.nav'); if (nav) nav.after(banner);
    if (!calm) confetti(160);
  }
  function confetti(n) {
    var colors = ['#8300fb', '#fb54f7', '#e8a850', '#a855ff', '#ffffff', '#4ade80'];
    for (var i = 0; i < n; i++) {
      var c = el('i', 'confetti');
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colors[i % colors.length];
      c.style.setProperty('--x', (Math.random() * 30 - 15) + 'vw');
      c.style.setProperty('--r', (Math.random() * 900 - 450) + 'deg');
      c.style.animationDuration = (2.6 + Math.random() * 2.4) + 's';
      c.style.animationDelay = Math.random() * 1.2 + 's';
      document.body.appendChild(c);
      c.addEventListener('animationend', function () { this.remove(); });
    }
  }

  // =====================================================================
  // SMALL DETAILS
  // =====================================================================
  // ---------- Local time + what I'm probably doing ----------
  var clock = document.querySelector('.clock-text');
  if (clock) {
    var tick = function () {
      var d = new Date();
      var time = new Intl.DateTimeFormat(FR ? 'fr-CA' : 'en-CA', { timeZone: TZ, hour: 'numeric', minute: '2-digit' }).format(d);
      var h = zoned(d).hour, mood;
      // EDIT: what I'm probably doing at each hour
      if (h < 7) mood = t('probably asleep', 'sûrement en train de dormir');
      else if (h < 9) mood = t('coffee first', 'café d\'abord');
      else if (h < 17) mood = t('probably working', 'sûrement au travail');
      else if (h < 19) mood = t('dinner time', 'l\'heure du souper');
      else mood = t('probably gaming', 'sûrement en train de jouer');
      clock.textContent = t(time + ' for me · ' + mood, time + ' chez moi · ' + mood);
      clock.parentNode.classList.toggle('asleep', h < 7);
    };
    tick(); setInterval(tick, 30000);
  }

  // ---------- Click the portrait to flip it ----------
  var av = document.querySelector('.avatar[data-flip]');
  if (av) {
    av.setAttribute('tabindex', '0'); av.setAttribute('role', 'button');
    av.setAttribute('aria-label', t('Flip the portrait', 'Retourner le portrait'));
    new Image().src = av.getAttribute('data-flip');
    var flip = function () {
      if (av.classList.contains('flipping')) return;
      av.classList.add('flipping');
      setTimeout(function () {
        var other = av.getAttribute('data-flip');
        av.setAttribute('data-flip', av.getAttribute('src')); av.setAttribute('src', other);
      }, calm ? 0 : 250);
      setTimeout(function () { av.classList.remove('flipping'); }, calm ? 0 : 520);
      unlock('faces');
    };
    av.addEventListener('click', flip);
    av.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  }

  // ---------- Copy email ----------
  document.querySelectorAll('.copy-email').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();   // copy instead of opening the mail app
      // Cloudflare's email obfuscation may scramble the address in the page, so only trust a real-looking one
      var addr = b.getAttribute('data-email') || '';
      if (!/^[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(addr)) addr = EMAIL;
      copy(addr, function () {
        toast('📋 ' + t('Email copied', 'Courriel copié'));
        if (!b.dataset.label) b.dataset.label = b.textContent;
        b.textContent = t('Copied!', 'Copié!'); b.classList.add('copied');
        clearTimeout(b._t); b._t = setTimeout(function () { b.textContent = b.dataset.label; b.classList.remove('copied'); }, 1800);
        unlock('email');
      });
    });
  });

  // ---------- Back to top: a zombie hand rising from the dirt ----------
  var up = el('button', 'fx-top',
    '<svg viewBox="0 0 64 80" aria-hidden="true"><g class="hand"><path d="M20 78 L20 44 Q20 38 25 38 L25 18 Q25 13 29 13 Q33 13 33 18 L33 34 L33 10 Q33 5 37 5 Q41 5 41 10 L41 34 L41 14 Q41 9 45 9 Q49 9 49 14 L49 40 L52 32 Q54 27 58 29 Q61 31 59 36 L50 58 L50 78 Z"/></g><path class="dirt" d="M0 80 Q8 66 18 70 Q26 62 34 68 Q44 60 52 68 Q60 64 64 72 L64 80 Z"/></svg>');
  up.type = 'button'; up.setAttribute('aria-label', t('Back to top', 'Retour en haut'));
  document.body.appendChild(up);
  addEventListener('scroll', function () { up.classList.toggle('show', scrollY > 900); }, { passive: true });
  up.addEventListener('click', function () { scrollTo({ top: 0, behavior: calm ? 'auto' : 'smooth' }); });

  // ---------- Konami code ----------
  var KON = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'], ki = 0;
  addEventListener('keydown', function (e) {
    var k = e.key && e.key.length === 1 ? e.key.toLowerCase() : e.key;
    ki = k === KON[ki] ? ki + 1 : (k === KON[0] ? 1 : 0);
    if (ki === KON.length) { ki = 0; zombieMode(); }
  });
  function zombieMode() {
    unlock('konami');
    document.documentElement.classList.add('zombie');
    toast('🧟 ' + t('Zombie mode activated', 'Mode zombie activé'), '', 3000);
    setTimeout(function () { document.documentElement.classList.remove('zombie'); }, 8000);
  }

  // =====================================================================
  // HIDDEN TERMINAL — press ` (or the >_ button in the footer)
  // =====================================================================
  var term, out, input, hist = [], hi = 0;
  var termBtn = el('button', 'term-btn', '&gt;_'); termBtn.type = 'button'; termBtn.title = t('Terminal (press `)', 'Terminal (touche `)');
  if (foot) foot.insertBefore(termBtn, trophy);
  termBtn.addEventListener('click', function () { openTerm(); });
  addEventListener('keydown', function (e) {
    if ((e.key === '`' || e.key === '~') && !(e.target.closest && e.target.closest('input, textarea'))) { e.preventDefault(); term && term.classList.contains('open') ? closeTerm() : openTerm(); }
    else if (e.key === 'Escape' && term && term.classList.contains('open')) closeTerm();
  });
  function openTerm() {
    if (!term) buildTerm();
    term.classList.add('open'); term.setAttribute('aria-hidden', 'false');
    setTimeout(function () { input.focus(); }, 50);
    unlock('terminal');
  }
  function closeTerm() { term.classList.remove('open'); term.setAttribute('aria-hidden', 'true'); input.blur(); }
  function buildTerm() {
    term = el('div', 'term');
    term.setAttribute('role', 'dialog'); term.setAttribute('aria-label', t('Terminal', 'Terminal'));
    term.innerHTML = '<div class="term-bar"><i></i><i></i><i></i><span>kevin@tehzombijesus: ~</span><button type="button" class="term-x" aria-label="' + t('Close', 'Fermer') + '">×</button></div>' +
      '<div class="term-out" aria-live="polite"></div><label class="term-line"><span class="ps1">kevin@crypt:~$</span><input type="text" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="' + t('Command', 'Commande') + '"></label>';
    document.body.appendChild(term);
    out = term.querySelector('.term-out'); input = term.querySelector('input');
    term.querySelector('.term-x').addEventListener('click', closeTerm);
    term.addEventListener('click', function (e) { if (!e.target.closest('a, button')) input.focus(); });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' || (e.key === '`' && !input.value)) { e.preventDefault(); closeTerm(); }
      else if (e.key === 'Enter') { var v = input.value; input.value = ''; run(v); }
      else if (e.key === 'ArrowUp') { if (hi > 0) { hi--; input.value = hist[hi] || ''; } e.preventDefault(); }
      else if (e.key === 'ArrowDown') { if (hi < hist.length) { hi++; input.value = hist[hi] || ''; } e.preventDefault(); }
      else if (e.key === 'Tab') {
        e.preventDefault();
        var m = Object.keys(CMDS).filter(function (c) { return c.indexOf(input.value) === 0; });
        if (m.length === 1) input.value = m[0] + ' ';
        else if (m.length > 1) print(m.join('  '), 'dim');
      }
      e.stopPropagation();
    });
    print(t('TehZombiJesus terminal. Type <b>help</b> to see what you can do.', 'Terminal de TehZombiJesus. Tape <b>help</b> pour voir ce que tu peux faire.'), 'raw');
  }
  function print(text, cls) {
    var line = el('div', 'tl ' + (cls || ''));
    if (cls && cls.indexOf('raw') > -1) line.innerHTML = text; else line.textContent = text;
    out.appendChild(line); out.scrollTop = out.scrollHeight;
  }
  function go(url) { print(t('Opening ', 'Ouverture de ') + url + '…', 'dim'); setTimeout(function () { location.href = BASE + (FR ? 'fr/' : '') + url; }, 450); }
  function ageNow() {
    var b = new Date(1998, 3, 2), n = new Date(), y = n.getFullYear() - 1998;
    var last = new Date(n.getFullYear(), 3, 2); if (n < last) { y--; last = new Date(n.getFullYear() - 1, 3, 2); }
    return [y, Math.floor((n - last) / 864e5)];
  }
  var CMDS = {
    help: function () {
      print(t('Commands:', 'Commandes :'), 'hl');
      [['whoami', t('who runs this place', 'qui s\'occupe de l\'endroit')], ['neofetch', t('system info, but it\'s me', 'infos système, mais c\'est moi')],
       ['ls', t('list the pages', 'lister les pages')], ['cd <page>', t('go to a page', 'aller à une page')], ['games', t('what I play', 'à quoi je joue')],
       ['setup', t('the next battlestation', 'la prochaine station de jeu')], ['homelab', t('what\'s running', 'ce qui roule')], ['uptime', t('how long I\'ve been online', 'depuis combien de temps je suis en ligne')],
       ['time', t('my local time', 'mon heure locale')], ['discord', t('join the Crypt', 'rejoindre la Crypte')], ['socials', t('where to find me', 'où me trouver')],
       ['email', t('copy my email', 'copier mon courriel')], ['achievements', t('your trophies', 'tes trophées')], ['lang', t('switch to French', 'passer à l\'anglais')],
       ['crypt', t('you\'ll see', 'tu verras')], ['snake', t('the classic', 'le classique')], ['hack', t('totally real hacking', 'du piratage très réel')],
       ['matrix', t('follow the white rabbit', 'suis le lapin blanc')], ['fortune', t('sysadmin wisdom', 'la sagesse d\'un admin système')],
       ['game', t('play Crypt Run', 'jouer à la Course de la Crypte')], ['pet', t('show or hide the pet zombie', 'afficher ou cacher le zombie de compagnie')],
       ['clear', t('clean the screen', 'effacer l\'écran')], ['exit', t('close the terminal', 'fermer le terminal')]
      ].forEach(function (r) { print('  ' + (r[0] + '              ').slice(0, 14) + r[1]); });
    },
    whoami: function () { print(t('Kevin, a.k.a. TehZombiJesus. CTO and sysadmin at Nox Interactive, manager of the Ruenix Minecraft network, homelabber, casual gamer. French Canadian.', 'Kevin, alias TehZombiJesus. CTO et administrateur système chez Nox Interactive, gestionnaire du réseau Minecraft Ruenix, homelabber, joueur occasionnel. Canadien français.')); },
    neofetch: function () {
      var a = ageNow();
      var logo = ['  ▀█▀ ▀▀█   █ ', '   █   █▀   █ ', '   █  ██▄ ▄▄▀ ', '              ', '   ░▒▓ CRYPT ▓▒░'];
      var info = [
        ['', 'kevin@tehzombijesus'], ['', '-------------------'],
        ['OS', t('Human, Canadian edition', 'Humain, édition canadienne')],
        ['Uptime', t(a[0] + ' years, ' + a[1] + ' days', a[0] + ' ans, ' + a[1] + ' jours')],
        [t('Roles', 'Rôles'), t('CTO + sysadmin @ Nox Interactive', 'CTO + admin système @ Nox Interactive')],
        ['Hypervisor', 'Proxmox'], ['Storage', 'ZFS (RAIDZ2)'],
        ['GPU', t('RTX 5090 (planned)', 'RTX 5090 (prévue)')],
        ['Shell', t('coffee', 'café')], ['Theme', t('Crypt Violet [dark]', 'Violet Crypte [sombre]')],
        [t('Games', 'Jeux'), 'Minecraft, GTA V, Ghost Recon, LoL (ARAM)']
      ];
      for (var i = 0; i < info.length; i++) {
        var l = logo[i] || '              ';
        print('<span class="neo-logo">' + esc((l + '                ').slice(0, 17)) + '</span>' + (info[i][0] ? '<span class="hl">' + esc(info[i][0]) + ':</span> ' : '<span class="hl">') + esc(info[i][1]) + (info[i][0] ? '' : '</span>'), 'raw');
      }
      print('<span class="neo-logo">                 </span><span class="sw" style="background:#0e080d"></span><span class="sw" style="background:#472f4a"></span><span class="sw" style="background:#74263e"></span><span class="sw" style="background:#8300fb"></span><span class="sw" style="background:#a855ff"></span><span class="sw" style="background:#fb54f7"></span><span class="sw" style="background:#e8a850"></span><span class="sw" style="background:#f4ecf3"></span>', 'raw');
    },
    ls: function () { print('index.html  homelab.html  setup.html  ruenix.html  now.html  secrets.txt', 'hl'); },
    cat: function (arg) {
      if (/secrets/.test(arg)) { print(t('cat: secrets.txt: Permission denied. Nice try though.', 'cat: secrets.txt : Permission refusée. Bien essayé quand même.'), 'err'); unlock('sudo'); }
      else print(t('cat: try "cd <page>" instead.', 'cat : essaie plutôt « cd <page> ».'), 'dim');
    },
    cd: function (arg) {
      var map = { '': 'index.html', '~': 'index.html', home: 'index.html', index: 'index.html', homelab: 'homelab.html', setup: 'setup.html', ruenix: 'ruenix.html', now: 'now.html' };
      var k = (arg || '').replace(/\.html$/, '').replace(/^\//, '');
      if (map[k]) go(map[k]); else print('cd: ' + arg + t(': no such page', ' : page introuvable'), 'err');
    },
    games: function () { ['Minecraft — ' + t('better with friends', 'mieux entre amis'), 'GTA V — ' + t('whenever chaos is needed', 'quand ça prend du chaos'), 'Ghost Recon Wildlands — ' + t('open-world stealth', 'infiltration en monde ouvert'), 'League of Legends — ' + t('ARAM only', 'ARAM seulement')].forEach(function (g) { print('  ▸ ' + g); }); },
    setup: function () { print(t('57" Odyssey Neo G9 + three 22" above, Ryzen 7 9850X3D, RTX 5090. No RGB. Type "cd setup" for the rest.', '57 po Odyssey Neo G9 + trois 22 po au-dessus, Ryzen 7 9850X3D, RTX 5090. Aucun RGB. Tape « cd setup » pour le reste.')); },
    homelab: function () { ['proxmox', 'truenas', 'coolify', 'immich', 'seafile', 'jellyfin*', 'uptime-kuma*'].forEach(function (s) { print('  ● ' + s + (s.indexOf('*') > -1 ? t('   (trying out)', '   (à l\'essai)') : '   ' + t('running', 'en marche')), s.indexOf('*') > -1 ? 'warn' : 'ok'); }); },
    uptime: function () { var a = ageNow(); print(t('up ' + a[0] + ' years, ' + a[1] + ' days. Load average: coffee, coffee, coffee', 'en marche depuis ' + a[0] + ' ans, ' + a[1] + ' jours. Charge moyenne : café, café, café')); },
    time: function () { var c = document.querySelector('.clock-text'); print(c ? c.textContent : new Intl.DateTimeFormat(FR ? 'fr-CA' : 'en-CA', { timeZone: TZ, hour: 'numeric', minute: '2-digit' }).format(new Date()) + t(' (Eastern time)', ' (heure de l\'Est)')); },
    date: function () { CMDS.time(); },
    discord: function () { print(t('Opening the Crypt invite…', 'Ouverture de l\'invitation de la Crypte…'), 'dim'); window.open('https://discord.gg/' + DISCORD_INVITE, '_blank', 'noopener'); },
    socials: function () { print('<a href="https://discord.gg/' + DISCORD_INVITE + '">Discord</a> · <a href="https://github.com/TehZombiJesus">GitHub</a> · <a href="https://x.com/TehZombiJesus">X</a>', 'raw'); },
    email: function () { copy(EMAIL, function () { print(EMAIL + t(' copied to your clipboard.', ' copié dans ton presse-papiers.'), 'ok'); unlock('email'); }); },
    achievements: function () { closeTerm(); showAchievements(); },
    lang: function () { location.href = BASE + (FR ? '' : 'fr/') + (page === '404' ? 'index' : page) + '.html'; },
    crypt: function () { closeTerm(); var ev = 'crypt'.split(''); ev.forEach(function (k) { dispatchEvent(new KeyboardEvent('keydown', { key: k })); }); },
    clear: function () { out.innerHTML = ''; },
    exit: function () { closeTerm(); },
    sudo: function () { print(t('kevin is not in the sudoers file. This incident will be reported. 👀', 'kevin n\'est pas dans le fichier sudoers. Cet incident sera signalé. 👀'), 'err'); unlock('sudo'); },
    rm: function () { print(t('rm: nice try. This server has backups (well, most of it).', 'rm : bien essayé. Ce serveur a des sauvegardes (enfin, presque tout).'), 'err'); unlock('sudo'); },
    ping: function () { print('PONG 🏓  ' + t('1 ms. The homelab says hi.', '1 ms. Le homelab te salue.'), 'ok'); },
    echo: function (arg) { print(arg || ''); },
    hello: function () { print(t('Hey! 👋', 'Salut! 👋')); },
    salut: function () { CMDS.hello(); },
    coffee: function () { print('☕ ' + t('Brewing… done. Productivity +10.', 'Infusion… terminée. Productivité +10.'), 'ok'); },
    history: function () { hist.forEach(function (h, i) { print('  ' + (i + 1) + '  ' + h, 'dim'); }); }
  };
  CMDS.snake = function () { closeTerm(); snakeGame(); };
  CMDS.matrix = function () { closeTerm(); matrixRain(); };
  CMDS.game = function () { print(t('Loading Crypt Run…', 'Chargement de la Course de la Crypte…'), 'dim'); setTimeout(function () { location.href = BASE + (FR ? 'fr/' : '') + 'this-page-is-lost'; }, 450); };
  CMDS.pet = function () { var off = !store.get('petOff', false); store.set('petOff', off); if (off) { removePet(); print(t('The zombie went back to its grave.', 'Le zombie est retourné dans sa tombe.'), 'dim'); } else { makePet(true); print(t('The zombie is back. Braaains.', 'Le zombie est de retour. Cerveaux…'), 'ok'); } };
  CMDS.fortune = function () {
    var F = FR ? [
      'As-tu essayé de l\'éteindre et de le rallumer?', 'Ce n\'est jamais le DNS. Sauf quand c\'est le DNS. C\'est toujours le DNS.',
      'Une sauvegarde qui n\'a jamais été restaurée n\'est qu\'un espoir.', 'Il n\'y a pas de nuage, seulement l\'ordinateur de quelqu\'un d\'autre.',
      'Ne déploie jamais un vendredi.', 'Le RAID n\'est pas une sauvegarde.', 'La mise en production temporaire la plus permanente est celle de vendredi soir.',
      'Si ça marche, n\'y touche pas. Si tu y touches, documente-le.'
    ] : [
      'Have you tried turning it off and on again?', 'It\'s never DNS. Unless it\'s DNS. It\'s always DNS.',
      'A backup that was never restored is just a hope.', 'There is no cloud, only someone else\'s computer.',
      'Never deploy on a Friday.', 'RAID is not a backup.', 'Nothing is more permanent than a temporary fix.',
      'If it works, don\'t touch it. If you touch it, write it down.'
    ];
    print('🥠 ' + F[Math.floor(Math.random() * F.length)], 'hl');
  };
  CMDS.hack = function () {
    var L = FR ? ['Connexion au mainframe…', 'Contournement du pare-feu… (il était déjà ouvert)', 'Téléchargement de plus de RAM… 64 Go', 'Décryptage du mot de passe : ********',
      'Accès au mot de passe Wi-Fi des voisins…', 'Compilation du noyau en 4K…'] : ['Connecting to the mainframe…', 'Bypassing the firewall… (it was already open)', 'Downloading more RAM… 64 GB',
      'Decrypting password: ********', 'Accessing the neighbours\' Wi-Fi…', 'Compiling the kernel in 4K…'];
    L.forEach(function (l, i) { setTimeout(function () { print('[' + ('█'.repeat(i + 1) + '░'.repeat(L.length - i - 1)) + '] ' + l, 'ok'); }, 380 * (i + 1)); });
    setTimeout(function () { print(t('ACCESS GRANTED. Just kidding. Nice try, hacker. 😎', 'ACCÈS ACCORDÉ. Je blague. Bien essayé, pirate. 😎'), 'warn'); unlock('sudo'); }, 380 * (L.length + 1));
  };
  CMDS.cafe = CMDS.coffee; CMDS['café'] = CMDS.coffee; CMDS.aide = CMDS.help; CMDS.quit = CMDS.exit;
  function run(raw) {
    var v = raw.trim();
    print('<span class="ps1">kevin@crypt:~$</span> ' + esc(v), 'raw');
    if (!v) return;
    hist.push(v); hi = hist.length;
    var parts = v.split(/\s+/), cmd = parts[0].toLowerCase(), arg = parts.slice(1).join(' ');
    if (cmd === 'sudo' || (cmd === 'rm' && /-rf/.test(arg))) return CMDS[cmd]();
    if (CMDS[cmd]) CMDS[cmd](arg);
    else print(cmd + t(': command not found. Type "help".', ' : commande introuvable. Tape « help ».'), 'err');
  }

  // =====================================================================
  // SNAKE, MATRIX RAIN (from the terminal)
  // =====================================================================
  function overlay(cls) {
    var o = el('div', 'fx-overlay ' + cls); document.body.appendChild(o);
    function close() { o.remove(); removeEventListener('keydown', key, true); if (o._stop) o._stop(); }
    function key(e) { if (e.key === 'Escape') { e.preventDefault(); close(); } }
    addEventListener('keydown', key, true);
    o._close = close; return o;
  }
  function snakeGame() {
    var o = overlay('snake');
    var best = store.get('snakeBest', 0);
    o.innerHTML = '<div class="snake-box"><div class="snake-top"><b>Snake</b><span class="snake-score">0</span><span class="muted">' + t('Best ', 'Record ') + '<span class="snake-best">' + best + '</span></span>' +
      '<button type="button" class="fx-close" aria-label="' + t('Close', 'Fermer') + '">×</button></div><canvas width="400" height="400"></canvas>' +
      '<p class="muted">' + t('Arrows or WASD. Swipe on phones. Esc to quit.', 'Flèches ou WASD. Glisse sur téléphone. Échap pour quitter.') + '</p></div>';
    o.querySelector('.fx-close').addEventListener('click', function () { o._close(); });
    var c = o.querySelector('canvas'), x = c.getContext('2d'), N = 20, S = 20;
    var snake, dir, nd, food, score, timer, dead;
    function place() { do { food = [Math.floor(Math.random() * N), Math.floor(Math.random() * N)]; } while (snake.some(function (p) { return p[0] === food[0] && p[1] === food[1]; })); }
    function start() { snake = [[10, 10], [9, 10], [8, 10]]; dir = nd = [1, 0]; score = 0; dead = false; place(); clearInterval(timer); timer = setInterval(tick, 110); }
    function tick() {
      dir = nd; var h = [snake[0][0] + dir[0], snake[0][1] + dir[1]];
      if (h[0] < 0 || h[1] < 0 || h[0] >= N || h[1] >= N || snake.some(function (p) { return p[0] === h[0] && p[1] === h[1]; })) {
        dead = true; clearInterval(timer);
        if (score > best) { best = score; store.set('snakeBest', best); o.querySelector('.snake-best').textContent = best; }
        draw(); return;
      }
      snake.unshift(h);
      if (h[0] === food[0] && h[1] === food[1]) { score++; o.querySelector('.snake-score').textContent = score; place(); } else snake.pop();
      draw();
    }
    function draw() {
      x.fillStyle = '#140c16'; x.fillRect(0, 0, 400, 400);
      x.fillStyle = '#e8a850'; x.beginPath(); x.arc(food[0] * S + 10, food[1] * S + 10, 7, 0, 7); x.fill();
      snake.forEach(function (p, i) { x.fillStyle = i ? '#8300fb' : '#fb54f7'; x.fillRect(p[0] * S + 1, p[1] * S + 1, S - 2, S - 2); });
      if (dead) {
        x.fillStyle = 'rgba(14,8,13,.7)'; x.fillRect(0, 0, 400, 400); x.fillStyle = '#f4ecf3'; x.textAlign = 'center';
        x.font = '700 28px "Chakra Petch", sans-serif'; x.fillText(t('Game over', 'Partie terminée'), 200, 190);
        x.font = '400 15px Inter, sans-serif'; x.fillText(t('Space or tap to play again', 'Espace ou touche pour rejouer'), 200, 220);
      }
    }
    var M = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0] };
    function turn(v) { if (v && !(v[0] === -dir[0] && v[1] === -dir[1])) nd = v; }
    function key(e) {
      if (dead && (e.code === 'Space' || e.key === 'Enter')) { e.preventDefault(); start(); return; }
      var v = M[e.key] || M[(e.key || '').toLowerCase()]; if (v) { e.preventDefault(); e.stopPropagation(); turn(v); }
    }
    addEventListener('keydown', key, true);
    var sx, sy;
    c.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; sy = e.touches[0].clientY; if (dead) start(); }, { passive: true });
    c.addEventListener('touchend', function (e) { var dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy; if (Math.max(Math.abs(dx), Math.abs(dy)) > 24) turn(Math.abs(dx) > Math.abs(dy) ? [dx > 0 ? 1 : -1, 0] : [0, dy > 0 ? 1 : -1]); });
    c.addEventListener('click', function () { if (dead) start(); });
    o._stop = function () { clearInterval(timer); removeEventListener('keydown', key, true); };
    start(); draw();
  }
  function matrixRain() {
    var o = overlay('matrix'), c = el('canvas'); o.appendChild(c);
    var x = c.getContext('2d'), W = c.width = innerWidth, H = c.height = innerHeight, size = 18, cols = Math.ceil(W / size), drops = [];
    for (var i = 0; i < cols; i++) drops.push(Math.random() * -40);
    var chars = 'TZJCRYPT01アカサタナハマヤラワ#$%&<>/'.split(''), run = true;
    (function frame() {
      if (!run) return;
      x.fillStyle = 'rgba(8,4,10,.14)'; x.fillRect(0, 0, W, H);
      x.font = '600 ' + size + 'px "JetBrains Mono", monospace';
      for (var i = 0; i < cols; i++) {
        x.fillStyle = Math.random() < 0.08 ? '#ffffff' : (i % 3 ? '#a855ff' : '#fb54f7');
        x.fillText(chars[(Math.random() * chars.length) | 0], i * size, drops[i] * size);
        if (drops[i] * size > H && Math.random() > 0.975) drops[i] = 0; drops[i] += 1;
      }
      requestAnimationFrame(frame);
    })();
    var msg = el('div', 'matrix-msg', t('Wake up, Neo… the Crypt has you. (Esc or click)', 'Réveille-toi, Neo… la Crypte te tient. (Échap ou clic)'));
    o.appendChild(msg);
    o.addEventListener('click', function () { o._close(); });
    o._stop = function () { run = false; };
    setTimeout(function () { if (document.body.contains(o)) o._close(); }, 9000);
  }

  // =====================================================================
  // PET ZOMBIE — wanders along the bottom of the screen (big screens only)
  // =====================================================================
  var pet = null, petTimer;
  var PET_LINES = FR ? ['Cerveaux… je veux dire, salut!', 'As-tu essayé de le redémarrer?', 'Rejoins la Crypte!', 'Je suis seulement mort à l\'intérieur.', 'Tape « crypt » pour voir…', 'Psst. Essaie la touche `', 'Aucun RGB ici. Juste du vert zombie.'] :
    ['Braaains… I mean, hi!', 'Have you tried restarting it?', 'Join the Crypt!', 'I\'m only dead on the inside.', 'Type "crypt" and see…', 'Psst. Try the ` key.', 'No RGB here. Just zombie green.'];
  function makePet(force) {
    if (pet) return;
    if (!force && store.get('petOff', false)) return;      // the "pet" terminal command turns it off and on
    var small = innerWidth < 700, touch = window.matchMedia && matchMedia('(pointer: coarse)').matches;
    pet = el('button', 'pet' + (small ? ' small' : ''), '<svg viewBox="0 0 16 20" aria-hidden="true" shape-rendering="crispEdges"><rect x="4" y="0" width="8" height="2" fill="#3a2a3a"/><rect x="4" y="2" width="8" height="6" fill="#7fb069"/>' +
      '<rect x="6" y="4" width="1" height="1" fill="#0e080d"/><rect x="9" y="4" width="1" height="1" fill="#0e080d"/><rect x="6" y="6" width="4" height="1" fill="#fb54f7"/>' +
      '<rect x="3" y="8" width="10" height="6" fill="#8300fb"/><rect x="11" y="9" width="5" height="2" fill="#7fb069"/><rect x="4" y="14" width="3" height="6" class="leg1" fill="#2f4a22"/><rect x="9" y="14" width="3" height="6" class="leg2" fill="#2f4a22"/></svg><span class="pet-say" hidden></span>');
    pet.type = 'button'; pet.setAttribute('aria-label', t('Pet zombie', 'Zombie de compagnie'));
    document.body.appendChild(pet);
    var w = small ? 36 : 52, x = small ? 12 : 120, say = pet.querySelector('.pet-say');
    function place() {
      x = Math.max(8, Math.min(x, innerWidth - w - 8));
      pet.style.transform = 'translateX(' + x.toFixed(0) + 'px)';
      pet.classList.toggle('say-left', x > innerWidth / 2);   // keep the speech bubble on screen
    }
    function talk(text, ms) {
      say.textContent = text; say.hidden = false;
      clearTimeout(say._t); say._t = setTimeout(function () { say.hidden = true; }, ms || 3200);
    }
    function walk() {
      if (!pet) return;
      var min = small ? 8 : 60, max = innerWidth - w - (small ? 8 : 90);
      var target = min + Math.random() * Math.max(0, max - min);
      pet.classList.toggle('left', target < x); pet.classList.add('walking');
      var dist = Math.abs(target - x), secs = dist / (small ? 30 : 40);
      pet.style.transitionDuration = secs.toFixed(1) + 's';
      x = target; place();
      clearTimeout(petTimer);
      petTimer = setTimeout(function () { pet && pet.classList.remove('walking'); petTimer = setTimeout(walk, 3000 + Math.random() * 6000); }, secs * 1000);
    }
    place();
    if (!calm) petTimer = setTimeout(walk, 2500);   // with "reduce motion" on, the pet stays put
    addEventListener('resize', place);
    pet.addEventListener('click', function () {
      if (!calm) { pet.classList.remove('hop'); void pet.offsetWidth; pet.classList.add('hop'); }
      talk(PET_LINES[Math.floor(Math.random() * PET_LINES.length)]);
      store.set('petClicks', store.get('petClicks', 0) + 1);
    });
    if (!store.get('petHello', false)) {
      store.set('petHello', true);
      setTimeout(function () { if (pet) talk(touch ? t('Hi! I\'m the Crypt\'s pet zombie. Tap me!', 'Salut! Je suis le zombie de la Crypte. Touche-moi!')
        : t('Hi! I\'m the Crypt\'s pet zombie. Click me!', 'Salut! Je suis le zombie de la Crypte. Clique-moi!'), 5000); }, 1200);
    }
  }
  function removePet() { if (pet) { clearTimeout(petTimer); pet.remove(); pet = null; } }
  setTimeout(function () { makePet(false); }, 1500);

  // =====================================================================
  // RUENIX COUNTDOWN — set data-opening="2026-12-01T19:00:00-05:00" on the element
  // =====================================================================
  var cd = document.querySelector('.countdown[data-opening]');
  if (cd && cd.getAttribute('data-opening')) {
    var when = new Date(cd.getAttribute('data-opening'));
    if (!isNaN(when)) {
      var lbl = FR ? ['jours', 'heures', 'min', 's'] : ['days', 'hours', 'min', 'sec'];
      cd.innerHTML = '<div class="cd-grid">' + lbl.map(function (l) { return '<div><b>00</b><span>' + l + '</span></div>'; }).join('') + '</div>' +
        '<p class="cd-when">' + new Intl.DateTimeFormat(FR ? 'fr-CA' : 'en-CA', { dateStyle: 'full', timeStyle: 'short', timeZone: TZ }).format(when) + '</p>';
      var bs = cd.querySelectorAll('b');
      var tickCd = function () {
        var d = Math.max(0, when - new Date()), v = [Math.floor(d / 864e5), Math.floor(d / 36e5) % 24, Math.floor(d / 6e4) % 60, Math.floor(d / 1e3) % 60];
        bs.forEach(function (b, i) { b.textContent = String(v[i]).padStart(2, '0'); });
        if (d === 0) { cd.classList.add('open'); cd.querySelector('.cd-when').textContent = t('Ruenix is open!', 'Ruenix est ouvert!'); clearInterval(cdTimer); }
      };
      var cdTimer = setInterval(tickCd, 1000); tickCd();
    }
  }

  // =====================================================================
  // HOMELAB MAP + SETUP DRAWING: hover or tap a part to read about it
  // =====================================================================
  function wireInfo(svg, sel, infoEl, after) {
    if (!svg || !infoEl) return;
    var nodes = svg.querySelectorAll(sel);
    function show(n) {
      nodes.forEach(function (x) { x.classList.toggle('active', x === n); });
      infoEl.innerHTML = '<strong>' + esc(n.getAttribute('data-name')) + '</strong> ' + esc(n.getAttribute('data-info'));
      if (after) after();
    }
    nodes.forEach(function (n) {
      n.addEventListener('mouseenter', function () { show(n); });
      n.addEventListener('focus', function () { show(n); });
      n.addEventListener('click', function () { show(n); });
    });
  }
  var map = document.querySelector('.netmap svg');
  if (map) {
    var hint = el('p', 'netmap-hint', t('Swipe sideways to see the whole map →', 'Glisse sur le côté pour voir toute la carte →'));
    var sc = document.querySelector('.netmap-scroll'); sc.parentNode.insertBefore(hint, sc);
    sc.addEventListener('scroll', function () { hint.classList.add('done'); }, { once: true, passive: true });
    var inspected = 0;
    wireInfo(map, '.node', document.querySelector('.map-info'), function () { if (++inspected >= 3) unlock('map'); });
    if (calm && map.pauseAnimations) map.pauseAnimations();
  }
  var fig = document.querySelector('.layout-fig');
  if (fig) {
    var hotG = fig.querySelector('.hot');
    if (hotG) hotG.querySelectorAll('rect').forEach(function (r) { r.setAttribute('tabindex', '0'); });
    wireInfo(hotG, 'rect', fig.querySelector('.hot-info'));
  }

  // =====================================================================
  // BUILD TRACKERS: count data-got="yes" and draw a progress bar
  // =====================================================================
  document.querySelectorAll('[data-track]').forEach(function (box) {
    var items = box.querySelectorAll('[data-got]'), n = 0;
    items.forEach(function (it) {
      if (it.getAttribute('data-got') === 'yes') { n++; it.classList.add('got'); }
    });
    var pct = Math.round(n / items.length * 100);
    var bar = el('div', 'tracker',
      '<div class="tracker-top"><span>' + (n === items.length ? '✅ ' + t('All ' + n + ' bought', 'Les ' + n + ' achetés') :
        t(n + ' of ' + items.length + ' bought', n + ' sur ' + items.length + ' achetés')) + '</span><span>' + pct + '%</span></div>' +
      '<div class="tracker-bar"><i style="--w:' + pct + '%"></i></div>');
    box.parentNode.insertBefore(bar, box);
  });

  // =====================================================================
  // SERVER X-RAY (homelab): parts light up when their build-plan line says data-got="yes"
  // =====================================================================
  var xray = document.querySelector('.xray svg');
  if (xray) {
    var NS = 'http://www.w3.org/2000/svg';
    var bays = xray.querySelector('.bays'), BAYS = 14, MEDIA = 7;   // EDIT: drive slots in the case, and drives planned
    // where the bays are drawn comes from the drawing itself (data-x, data-y, data-w, data-h, data-gap, data-led)
    var bd = function (k, d) { var v = parseFloat(bays.getAttribute('data-' + k)); return isNaN(v) ? d : v; };
    var BX = bd('x', 36), BY = bd('y', 50), BW = bd('w', 108), BH = bd('h', 17), BG = bd('gap', 21), BL = bd('led', 134);
    for (var bi = 0; bi < BAYS; bi++) {
      var r = document.createElementNS(NS, 'rect');
      r.setAttribute('x', BX); r.setAttribute('y', BY + bi * BG); r.setAttribute('width', BW); r.setAttribute('height', BH); r.setAttribute('rx', 3);
      r.setAttribute('class', bi < MEDIA ? 'body drive' : 'spare');
      bays.appendChild(r);
      if (bi < MEDIA) {
        var led = document.createElementNS(NS, 'circle');
        led.setAttribute('cx', BL); led.setAttribute('cy', BY + BH / 2 + bi * BG); led.setAttribute('r', 2.6);
        led.setAttribute('class', 'led act d' + (bi % 4)); bays.appendChild(led);
      }
    }
    var xrGot = 0, xrTotal = 0;
    document.querySelectorAll('.specs [data-key]').forEach(function (dd) {
      var part = xray.querySelector('.xr-part[data-key="' + dd.getAttribute('data-key') + '"]');
      if (!part) return;
      xrTotal++;
      var yes = dd.getAttribute('data-got') === 'yes'; if (yes) xrGot++;
      part.classList.add(yes ? 'got' : 'planned');
      var dt = dd.previousElementSibling, why = dd.querySelector('.why');
      var name = (dd.firstChild && dd.firstChild.nodeValue || '').trim();
      part.setAttribute('data-name', (dt ? dt.textContent + ': ' : '') + name);
      part.setAttribute('data-info', (yes ? t('Bought. ', 'Acheté. ') : t('Planned. ', 'Prévu. ')) + (why ? why.textContent : ''));
    });
    var cnt = document.querySelector('.xray .xr-count');
    if (cnt) cnt.innerHTML = xrGot === xrTotal ? '✅ ' + t('Every part is in the box', 'Toutes les pièces sont dans le boîtier')
      : '<b>' + xrGot + '</b> / ' + xrTotal + ' ' + t('parts in the box so far', 'pièces dans le boîtier pour l\'instant');
    if (xrGot === xrTotal) xray.classList.add('complete');
    wireInfo(xray, '.xr-part', document.querySelector('.xray .xr-info'));
    if (calm) xray.classList.add('calm');
  }

  // =====================================================================
  // LAB CONSOLE (homelab): types out what's on this page, plus live status when it's set up
  // =====================================================================
  var lc = document.querySelector('.lab-console');
  var labLive = null;   // filled by the live status below
  if (lc) {
    lc.hidden = false;
    lc.setAttribute('aria-hidden', 'true');   // decoration: the same facts are on the page in plain text
    lc.innerHTML = '<div class="lc-top"><i></i><i></i><i></i><span>kevin@lab: ~</span></div><pre class="lc-out"></pre>';
    var out = lc.querySelector('.lc-out');
    var svcs = [].map.call(document.querySelectorAll('.services .svc'), function (c) {
      return { name: c.querySelector('h3').textContent, trial: c.classList.contains('trial') };
    });
    var pad = function (x, n) { x = String(x); return x + new Array(Math.max(1, n - x.length)).join(' '); };
    var scripts = function () {
      var list = [];
      list.push(['lab status', svcs.map(function (v) {
        var l = labLive && labLive.byName(v.name);
        var state = l ? (l.status === 'up' ? t('up', 'en marche') : l.status === 'down' ? t('DOWN', 'EN PANNE') : t(l.status, l.status)) + (l.uptime30 != null || l.uptime24 != null ? '  ' + pct(l.uptime30 != null ? l.uptime30 : l.uptime24) : '')
          : v.trial ? t('trying out', 'à l\'essai') : t('in use', 'en service');
        var cls = l ? (l.status === 'up' ? 'ok' : l.status === 'down' ? 'bad' : 'warn') : v.trial ? 'warn' : 'ok';
        return '<span class="' + cls + '">●</span> ' + esc(pad(v.name.toLowerCase().replace(/\s+/g, '-'), 14)) + esc(state);
      })]);
      var specs = document.querySelector('.specs[data-track]');
      if (specs) {
        var all = specs.querySelectorAll('[data-got]').length, have = specs.querySelectorAll('[data-got="yes"]').length;
        list.push(['lab next-server', [
          t('parts planned', 'pièces prévues') + '   ' + all,
          t('parts bought', 'pièces achetées') + '    ' + have + '  (' + Math.round(have / all * 100) + '%)',
          '<span class="dim">' + t('# it fills in as the parts arrive', '# ça se remplit à mesure que les pièces arrivent') + '</span>']]);
      }
      list.push(['zpool plan', [
        'fast    ' + t('2× 4 TB NVMe, mirrored', '2× 4 To NVMe, en miroir'),
        'media   ' + t('7× 20 TB, RAIDZ2', '7× 20 To, RAIDZ2'),
        '<span class="dim">' + t('# any two media drives can fail, nothing is lost', '# deux disques peuvent lâcher sans rien perdre') + '</span>']]);
      if (labLive) list.push(['lab uptime', [labLive.summary]]);
      return list;
    };
    var running = false, visible = false, step = 0;
    var typeLine = function (text, done) {
      var line = el('div', 'lc-line', '<span class="ps">$</span> <span class="cmd"></span>'); out.appendChild(line);
      var cmd = line.querySelector('.cmd'), i = 0;
      (function next() {
        if (i <= text.length) { cmd.textContent = text.slice(0, i++); setTimeout(next, 45 + Math.random() * 50); }
        else setTimeout(done, 350);
      })();
    };
    var showLines = function (lines, done) {
      var i = 0;
      (function next() {
        if (i < lines.length) { out.appendChild(el('div', 'lc-line', lines[i++])); setTimeout(next, 90); }
        else done();
      })();
    };
    var cycle = function () {
      if (!visible || document.hidden) { running = false; return; }
      running = true;
      var list = scripts(), sc = list[step++ % list.length];
      out.innerHTML = '';
      typeLine(sc[0], function () { showLines(sc[1], function () { setTimeout(cycle, 4200); }); });
    };
    if (calm) {
      var once = function () { out.innerHTML = ''; scripts().forEach(function (sc) { out.appendChild(el('div', 'lc-line', '<span class="ps">$</span> ' + esc(sc[0]))); sc[1].forEach(function (x) { out.appendChild(el('div', 'lc-line', x)); }); }); };
      once(); lc._refresh = once;
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (en) { visible = en[0].isIntersecting; if (visible && !running) cycle(); }).observe(lc);
      document.addEventListener('visibilitychange', function () { if (!document.hidden && visible && !running) cycle(); });
    } else { visible = true; cycle(); }
  }
  function pct(x) { return (Math.floor(x * 10000) / 100).toFixed(2).replace(/\.?0+$/, '') + '%'; }

  // =====================================================================
  // LIVE FEATURES — run by Cloudflare functions in /functions. Each one hides itself until it's set up.
  // =====================================================================
  var API = BASE + 'api/';
  function getJSON(path, opts) {
    if (!window.fetch) return Promise.reject();
    return fetch(API + path, opts).then(function (r) { if (!r.ok) throw r.status; return r.json(); });
  }
  var fmt = function (x) { return new Intl.NumberFormat(FR ? 'fr-CA' : 'en-CA').format(x); };

  // ---------- Discord count under "Join the Crypt" ----------
  var live = document.querySelector('.discord-live');
  if (live) getJSON('discord').then(function (j) {
    var txt = j.online != null ? t(fmt(j.online) + ' online', fmt(j.online) + ' en ligne') : '';
    if (j.members) txt += (txt ? ' · ' : '') + t(fmt(j.members) + ' members in the Crypt', fmt(j.members) + ' membres dans la Crypte');
    if (!txt) return;
    live.querySelector('.dl-text').textContent = txt; live.hidden = false;
  }).catch(function () {});

  var config = getJSON('config').catch(function () { return {}; });
  window.TZJ.config = config;

  // ---------- Homelab live status (Uptime Kuma, via /api/status) ----------
  var board = document.querySelector('.lab-live');
  if (board) config.then(function (c) {
    if (!c.status) return;
    var rtf = window.Intl && Intl.RelativeTimeFormat ? new Intl.RelativeTimeFormat(FR ? 'fr-CA' : 'en-CA', { numeric: 'auto' }) : null;
    var ago = function (iso) {
      if (!iso || !rtf) return '';
      var s = (new Date(iso) - new Date()) / 1000, a = Math.abs(s);
      return a < 60 ? rtf.format(Math.round(s), 'second') : a < 3600 ? rtf.format(Math.round(s / 60), 'minute') : a < 86400 ? rtf.format(Math.round(s / 3600), 'hour') : rtf.format(Math.round(s / 86400), 'day');
    };
    var dur = function (iso) {   // "3 days" / "3 jours"
      var s = Math.max(0, (new Date() - new Date(iso)) / 1000), n, u;
      if (s < 3600) { n = Math.max(1, Math.round(s / 60)); u = ['minute', 'minutes', 'minute', 'minutes']; }
      else if (s < 86400) { n = Math.round(s / 3600); u = ['hour', 'hours', 'heure', 'heures']; }
      else { n = Math.round(s / 86400); u = ['day', 'days', 'jour', 'jours']; }
      return n + ' ' + (FR ? (n > 1 ? u[3] : u[2]) : (n > 1 ? u[1] : u[0]));
    };
    var WORD = { up: t('Up', 'En marche'), down: t('Down', 'En panne'), pending: t('Checking', 'Vérification'), maintenance: t('Maintenance', 'Entretien') };
    var match = function (a, b) { a = a.toLowerCase(); b = b.toLowerCase(); return a === b || a.indexOf(b) === 0 || b.indexOf(a) === 0; };
    var render = function (j) {
      var ups = j.services.filter(function (x) { return x.status === 'up'; }).length;
      var u = j.services.map(function (x) { return x.uptime30 != null ? x.uptime30 : x.uptime24; }).filter(function (x) { return x != null; });
      var avg = u.length ? u.reduce(function (a, b) { return a + b; }, 0) / u.length : null;
      var head = { up: t('All systems normal', 'Tout fonctionne normalement'), degraded: t('Some services need attention', 'Certains services ont un pépin'),
        down: t('The lab is down', 'Le labo est en panne'), unknown: t('Waiting for the first check', 'En attente de la première vérification') }[j.overall];
      var html = '<div class="lb-sum ' + j.overall + '"><span class="dot"></span><div><strong>' + head + '</strong><span>' +
        t(ups + ' of ' + j.services.length + ' services up', ups + ' sur ' + j.services.length + ' services en marche') +
        (avg != null ? ' · ' + t('uptime ', 'disponibilité ') + pct(avg) : '') + ' · ' +
        (j.lastOutage ? t('last blip ', 'dernier pépin ') + ago(j.lastOutage) : t('no outage in recent checks', 'aucune panne aux dernières vérifications')) +
        '</span></div><span class="lb-when">' + t('checked ', 'vérifié ') + '<time data-at="' + j.updated + '">' + ago(j.updated) + '</time></span></div>';
      if (j.incident) html += '<p class="lb-incident">📣 ' + esc(j.incident.title) + (j.incident.at ? ' <span>' + ago(j.incident.at) + '</span>' : '') + '</p>';
      if (j.maintenance) html += '<p class="lb-incident">🛠️ ' + t('Planned maintenance in progress', 'Entretien prévu en cours') + '</p>';
      html += '<div class="lb-grid">' + j.services.map(function (x) {
        var up = x.uptime30 != null ? x.uptime30 : x.uptime24;
        return '<div class="lb-svc ' + x.status + '"><div class="lb-name"><span class="dot"></span>' + esc(x.name) + '</div>' +
          '<div class="lb-meta">' + WORD[x.status] + (x.since ? ' ' + t('for', 'depuis') + ' ' + dur(x.since) : '') + '</div>' +
          '<div class="lb-spark" aria-hidden="true">' + x.recent.map(function (b) { return '<i class="b' + b + '"></i>'; }).join('') + '</div>' +
          '<div class="lb-nums"><span>' + (up != null ? pct(up) : '–') + '<small>' + (x.uptime30 != null ? t(' 30 days', ' 30 jours') : t(' 24 h', ' 24 h')) + '</small></span>' +
          (x.ping != null ? '<span>' + x.ping + '<small> ms</small></span>' : '') + '</div></div>';
      }).join('') + '</div>';
      board.querySelector('.live-board').innerHTML = html;
      board.hidden = false;
      // light up the matching service cards and map boxes
      document.querySelectorAll('.services .svc').forEach(function (card) {
        var name = card.querySelector('h3').textContent, l = j.services.filter(function (x) { return match(x.name, name); })[0];
        var b = card.querySelector('.live-dot');
        if (!l) { if (b) b.remove(); return; }
        if (!b) { b = el('span', 'live-dot'); card.querySelector('h3').appendChild(b); }
        b.className = 'live-dot ' + l.status; b.title = WORD[l.status];
      });
      document.querySelectorAll('.netmap .node').forEach(function (n) {
        var name = n.getAttribute('data-name') || '', l = j.services.filter(function (x) { return match(x.name, name.split(' ')[0]) || match(x.name, name); })[0];
        var dot = n.querySelector('.ndot'), rect = n.querySelector('rect');
        if (!l || !rect) { if (dot) dot.remove(); return; }
        if (!dot) {
          dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
          dot.setAttribute('r', 6); dot.setAttribute('cx', +rect.getAttribute('x') + +rect.getAttribute('width') - 12); dot.setAttribute('cy', +rect.getAttribute('y') + 12);
          n.appendChild(dot);
        }
        dot.setAttribute('class', 'ndot ' + l.status);
      });
      labLive = {
        byName: function (name) { return j.services.filter(function (x) { return match(x.name, name); })[0]; },
        summary: '<span class="' + (j.overall === 'up' ? 'ok' : j.overall === 'down' ? 'bad' : 'warn') + '">●</span> ' + esc(head) + (avg != null ? '  ·  ' + pct(avg) : ''),
      };
      if (lc && lc._refresh) lc._refresh();
    };
    var load = function () { if (!document.hidden) getJSON('status').then(render).catch(function () {}); };
    load(); setInterval(load, 60000);
    setInterval(function () { board.querySelectorAll('time[data-at]').forEach(function (x) { x.textContent = ago(x.getAttribute('data-at')); }); }, 15000);
  });

  // ---------- Installable app + offline page (service worker lives at /sw.js) ----------
  if ('serviceWorker' in navigator && location.protocol === 'https:' && /(^|\.)tehzombijesus\.ca$|pages\.dev$/.test(location.hostname)) {
    addEventListener('load', function () { navigator.serviceWorker.register('/sw.js').catch(function () {}); });
  }

  // ---------- Live "here right now" counter in the footer ----------
  config.then(function (c) {
    if (!c.presence || !foot) return;
    var me = (function () { try { var v = sessionStorage.getItem('tzj.pid'); if (v) return v; } catch (e) {}
      var id = Array.from(crypto.getRandomValues(new Uint8Array(12))).map(function (b) { return (b % 36).toString(36); }).join('') + Date.now().toString(36);
      try { sessionStorage.setItem('tzj.pid', id); } catch (e) {} return id; })();
    var chip = el('span', 'here-chip'); chip.hidden = true; foot.insertBefore(chip, foot.querySelector('.season-tag') || termBtn);
    var beat = function () {
      if (document.hidden) return;
      getJSON('presence', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ id: me }) }).then(function (j) {
        chip.innerHTML = '<span class="dot" aria-hidden="true"></span>' + (j.here <= 1 ? t('Just you in the Crypt', 'Seul dans la Crypte')
          : t(fmt(j.here) + ' in the Crypt right now', fmt(j.here) + ' dans la Crypte en ce moment'));
        chip.hidden = false;
      }).catch(function () {});
    };
    beat(); setInterval(beat, 30000);
    document.addEventListener('visibilitychange', function () { if (!document.hidden) beat(); });
  });

  // ---------- Spotify: what I'm listening to ----------
  var np = document.querySelector('.now-playing');
  if (np) config.then(function (c) {
    if (!c.spotify) return;
    var load = function () {
      getJSON('spotify').then(function (j) {
        if (!j.title) return;
        var ago = '';
        if (!j.playing && j.at) {
          var m = Math.round((Date.now() - new Date(j.at)) / 60000);
          ago = m < 60 ? t(m + ' min ago', 'il y a ' + m + ' min') : m < 1440 ? t(Math.round(m / 60) + ' h ago', 'il y a ' + Math.round(m / 60) + ' h') : t('a while ago', 'il y a un moment');
        }
        np.innerHTML = (j.art ? '<img src="' + esc(j.art) + '" alt="" width="64" height="64">' : '') +
          '<div><span class="np-label">' + (j.playing ? '<span class="eq" aria-hidden="true"><i></i><i></i><i></i></span>' + t('Listening now', 'J\'écoute en ce moment') : t('Last played', 'Dernière écoute') + ' · ' + ago) + '</span>' +
          '<a class="np-title" href="' + esc(j.url || '#') + '" rel="noopener" target="_blank">' + esc(j.title) + '</a>' +
          '<span class="np-artist">' + esc(j.artist) + '</span></div>';
        np.classList.toggle('playing', !!j.playing); np.hidden = false;
      }).catch(function () {});
    };
    load(); setInterval(function () { if (!document.hidden) load(); }, 30000);
  });
})();
