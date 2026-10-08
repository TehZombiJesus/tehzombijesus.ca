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
    b.addEventListener('click', function () {
      copy(b.getAttribute('data-email') || EMAIL, function () {
        toast('📋 ' + t('Email copied', 'Courriel copié'));
        var old = b.textContent; b.textContent = t('Copied!', 'Copié!');
        setTimeout(function () { b.textContent = old; }, 1800);
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
       ['crypt', t('you\'ll see', 'tu verras')], ['clear', t('clean the screen', 'effacer l\'écran')], ['exit', t('close the terminal', 'fermer le terminal')]
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
  // LIVE DISCORD COUNT — hides itself if Discord doesn't answer
  // =====================================================================
  var live = document.querySelector('.discord-live');
  if (live && window.fetch) {
    var fmt = function (x) { return new Intl.NumberFormat(FR ? 'fr-CA' : 'en-CA').format(x); };
    var showCount = function (online, total) {
      var txt = online != null ? t(fmt(online) + ' online', fmt(online) + ' en ligne') : '';
      if (total) txt += (txt ? ' · ' : '') + t(fmt(total) + ' members in the Crypt', fmt(total) + ' membres dans la Crypte');
      if (!txt) return;
      live.querySelector('.dl-text').textContent = txt; live.hidden = false;
    };
    fetch('https://discord.com/api/v10/invites/' + DISCORD_INVITE + '?with_counts=true')
      .then(function (r) { if (!r.ok) throw 0; return r.json(); })
      .then(function (j) { showCount(j.approximate_presence_count, j.approximate_member_count); })
      .catch(function () {
        // backup: the server widget (turn on in Server Settings → Widget)
        fetch('https://discord.com/api/guilds/' + DISCORD_GUILD + '/widget.json')
          .then(function (r) { if (!r.ok) throw 0; return r.json(); })
          .then(function (j) { showCount(j.presence_count, null); })
          .catch(function () {});
      });
  }
})();
