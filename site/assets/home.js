/* Home page: fills "Latest activity" from the devlog feed (feed.xml, or fr/feed.xml on French pages).
   Nothing to edit here: new devlog posts show up on their own after tools/build.py.
   If the feed can't be read, the static link in the HTML stays. */
(function () {
  var list = document.querySelector('.activity');
  if (!list || !window.fetch || !window.DOMParser) return;
  var FR = document.documentElement.lang === 'fr';
  var MAX = 5;

  function ago(date) {
    var s = (Date.now() - date.getTime()) / 1000;
    var steps = [[60, 's', 's'], [3600, 'min', 'min'], [86400, 'h', 'h'], [604800, 'd', 'j'], [2629800, 'w', 'sem.'], [31557600, 'mo', 'mois'], [Infinity, 'y', 'an']];
    var div = [1, 60, 3600, 86400, 604800, 2629800, 31557600];
    for (var i = 0; i < steps.length; i++) {
      if (s < steps[i][0]) {
        var n = Math.max(1, Math.floor(s / div[i]));
        return FR ? 'il y a ' + n + ' ' + steps[i][2] : n + steps[i][1] + ' ago';
      }
    }
    return '';
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  fetch('feed.xml', { cache: 'no-cache' }).then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.text();
  }).then(function (xml) {
    var doc = new DOMParser().parseFromString(xml, 'application/xml');
    var items = Array.prototype.slice.call(doc.querySelectorAll('item'), 0, MAX);
    if (!items.length) return;
    list.textContent = '';
    items.forEach(function (it) {
      var get = function (n) { var x = it.querySelector(n); return x ? x.textContent.trim() : ''; };
      var link = get('link'), when = new Date(get('pubDate'));
      // keep visitors on the same site (handy on preview addresses): use just the path
      try { link = new URL(link).pathname; } catch (e) { /* keep as is */ }
      var li = el('li'), a = el('a');
      a.href = link;
      a.appendChild(el('span', 'a-ico'));
      var txt = el('span', 'a-txt');
      txt.appendChild(el('b', '', get('title')));
      var d = get('description').split('\n')[0];  // first line is the post's summary
      if (d.charAt(0) === '<') d = '';
      if (d) txt.appendChild(el('span', '', d));
      a.appendChild(txt);
      if (!isNaN(when)) {
        var t = el('time', 'a-when', ago(when));
        t.setAttribute('datetime', when.toISOString());
        a.appendChild(t);
      }
      li.appendChild(a);
      list.appendChild(li);
    });
  }).catch(function () { /* keep the static fallback */ });
})();
