/* Guestbook admin: hide, show or delete messages. The token is kept in sessionStorage for this tab only. */
(function () {
  'use strict';
  var login = document.querySelector('.gba-login'), list = document.querySelector('.gba-list'), status = document.querySelector('.gba-status');
  var token = ''; try { token = sessionStorage.getItem('tzj.admin') || ''; } catch (e) {}
  function api(method, body) {
    return fetch('/api/guestbook/admin', { method: method, headers: { authorization: 'Bearer ' + token, 'content-type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })
      .then(function (r) { if (r.status === 401) throw 'auth'; if (!r.ok) throw 'err'; return r.json(); });
  }
  function render(entries) {
    list.innerHTML = '';
    entries.forEach(function (e) {
      var li = document.createElement('li'); if (e.hidden) li.className = 'is-hidden';
      var h = document.createElement('div'); h.className = 'gba-top';
      var n = document.createElement('strong'); n.textContent = e.name + (e.hidden ? ' (hidden)' : '');
      var d = document.createElement('time'); d.textContent = new Date(e.created).toLocaleString() + ' · ' + e.lang;
      h.appendChild(n); h.appendChild(d);
      var m = document.createElement('p'); m.textContent = e.message;
      var acts = document.createElement('div'); acts.className = 'gba-acts';
      var tog = document.createElement('button'); tog.type = 'button'; tog.className = 'btn ghost'; tog.textContent = e.hidden ? 'Show' : 'Hide';
      tog.onclick = function () { api('POST', { id: e.id, hidden: !e.hidden }).then(load); };
      var del = document.createElement('button'); del.type = 'button'; del.className = 'btn ghost'; del.textContent = 'Delete';
      del.onclick = function () {
        if (del.dataset.sure) api('POST', { id: e.id, delete: true }).then(load);
        else { del.dataset.sure = '1'; del.textContent = 'Click again to delete forever'; setTimeout(function () { delete del.dataset.sure; del.textContent = 'Delete'; }, 4000); }
      };
      acts.appendChild(tog); acts.appendChild(del);
      li.appendChild(h); li.appendChild(m); li.appendChild(acts); list.appendChild(li);
    });
    if (!entries.length) list.innerHTML = '<li>No messages yet.</li>';
  }
  function load() {
    api('GET').then(function (j) { login.hidden = true; render(j.entries); })
      .catch(function (e) { login.hidden = false; status.textContent = e === 'auth' ? 'That token was not accepted.' : 'Could not reach the guestbook.'; });
  }
  login.addEventListener('submit', function (e) {
    e.preventDefault(); token = login.querySelector('input').value.trim();
    try { sessionStorage.setItem('tzj.admin', token); } catch (x) {}
    load();
  });
  if (token) load();
})();
