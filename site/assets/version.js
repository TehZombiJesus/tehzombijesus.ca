/* Footer: adds the build (the GitHub commit the site was published from) next to the version number.
   "v1.2.0" becomes "v1.2.0 · build b66769c". If /api/version doesn't answer, the version stays on its own. */
(function () {
  var ver = document.querySelector('footer .ver');
  if (!ver || !window.fetch) return;
  fetch('/api/version').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) {
    if (!j || !j.build) return;
    var b = document.createElement('a');
    b.className = 'build'; b.href = j.url; b.rel = 'noopener';
    b.textContent = 'build ' + j.build.slice(0, 7);
    b.title = document.documentElement.lang === 'fr' ? 'Voir ce changement sur GitHub' : 'See this change on GitHub';
    ver.insertAdjacentText('afterend', ' · ');
    ver.parentNode.insertBefore(b, ver.nextSibling.nextSibling);
  }).catch(function () {});
})();
