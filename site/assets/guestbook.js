/* Guestbook page: lists messages and handles signing, with Cloudflare Turnstile against bots. */
(function () {
  'use strict';
  var FR = document.documentElement.lang === 'fr';
  function t(en, fr) { return FR ? fr : en; }
  var box = document.querySelector('.gb');
  if (!box) return;
  var list = box.querySelector('.gb-list'), form = box.querySelector('.gb-form'), status = box.querySelector('.gb-status');
  var off = box.querySelector('.gb-off'), widget = box.querySelector('.gb-turnstile');
  var BASE = ((document.querySelector('script[src$="guestbook.js"]') || {}).src || '').replace(/assets\/guestbook\.js.*$/, '');
  var token = '', tsId = null;

  function ago(ms) {
    var d = new Date(ms);
    return new Intl.DateTimeFormat(FR ? 'fr-CA' : 'en-CA', { dateStyle: 'medium' }).format(d);
  }
  function card(e, fresh) {
    var li = document.createElement('li'); if (fresh) li.className = 'fresh';
    var top = document.createElement('div'); top.className = 'gb-top';
    var n = document.createElement('strong'); n.textContent = e.name;
    var d = document.createElement('time'); d.dateTime = new Date(e.created).toISOString(); d.textContent = ago(e.created);
    top.appendChild(n); top.appendChild(d);
    var m = document.createElement('p'); m.textContent = e.message;   // always text, never HTML
    li.appendChild(top); li.appendChild(m);
    return li;
  }
  function load() {
    fetch(BASE + 'api/guestbook').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (j) {
      list.innerHTML = '';
      if (!j.entries.length) { var p = document.createElement('li'); p.className = 'gb-empty'; p.textContent = t('No signatures yet. Be the first!', 'Aucune signature pour l\'instant. Sois le premier!'); list.appendChild(p); }
      j.entries.forEach(function (e) { list.appendChild(card(e)); });
    }).catch(function () {});
  }
  function enable(siteKey) {
    off.hidden = true; form.hidden = false;
    var s = document.createElement('script');
    s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    s.async = true;
    s.onload = function () {
      tsId = window.turnstile.render(widget, {
        sitekey: siteKey, theme: 'dark', language: FR ? 'fr' : 'en',
        callback: function (tk) { token = tk; }, 'expired-callback': function () { token = ''; }
      });
    };
    document.head.appendChild(s);
  }
  fetch(BASE + 'api/config').then(function (r) { if (!r.ok) throw 0; return r.json(); }).then(function (c) {
    if (c.guestbook && c.turnstileSiteKey) { enable(c.turnstileSiteKey); load(); }
  }).catch(function () {});

  var counter = form.querySelector('.gb-count'), msg = form.querySelector('textarea');
  msg.addEventListener('input', function () { counter.textContent = msg.value.length + ' / 280'; });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.querySelector('input[name=name]').value.trim(), message = msg.value.trim();
    if (!name || !message) return;
    if (!token) { status.textContent = t('Please finish the check below the message first.', 'Termine d\'abord la vérification sous le message.'); return; }
    var btn = form.querySelector('button'); btn.disabled = true; status.textContent = t('Signing…', 'Signature en cours…');
    fetch(BASE + 'api/guestbook', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ name: name, message: message, lang: FR ? 'fr' : 'en', token: token }) })
      .then(function (r) { return r.json().then(function (j) { return [r.status, j]; }); })
      .then(function (res) {
        var code = res[0], j = res[1];
        if (code === 201) {
          var empty = list.querySelector('.gb-empty'); if (empty) empty.remove();
          list.insertBefore(card(j.entry, true), list.firstChild);
          form.reset(); counter.textContent = '0 / 280';
          status.textContent = t('Thanks for signing! 🕯️', 'Merci d\'avoir signé! 🕯️');
          if (window.TZJ) window.TZJ.unlock('guest');
        } else {
          var why = { name: t('Your name needs 1 to 32 characters.', 'Ton nom doit avoir de 1 à 32 caractères.'),
            message: t('Your message needs 1 to 280 characters.', 'Ton message doit avoir de 1 à 280 caractères.'),
            links: t('Links aren\'t allowed, to keep spam out.', 'Les liens ne sont pas permis, pour éloigner le pourriel.'),
            captcha: t('The bot check failed. Please try again.', 'La vérification anti-robot a échoué. Réessaie.'),
            'slow down': t('You already signed recently. Try again in a few minutes.', 'Tu as déjà signé récemment. Réessaie dans quelques minutes.') }[j.error];
          status.textContent = why || t('Something went wrong. Please try again later.', 'Quelque chose a mal tourné. Réessaie plus tard.');
        }
      })
      .catch(function () { status.textContent = t('Something went wrong. Please try again later.', 'Quelque chose a mal tourné. Réessaie plus tard.'); })
      .then(function () { btn.disabled = false; token = ''; if (window.turnstile && tsId !== null) window.turnstile.reset(tsId); });
  });
})();
