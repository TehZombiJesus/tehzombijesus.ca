/* Devlog list: the project buttons above the posts show only the posts about that project. */
(function () {
  var bar = document.querySelector('.proj-filter');
  if (!bar) return;
  var posts = document.querySelectorAll('.post-list > li');
  bar.addEventListener('click', function (e) {
    var btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    var f = btn.getAttribute('data-filter');
    bar.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
    posts.forEach(function (li) { li.hidden = f !== 'all' && li.getAttribute('data-project') !== f; });
  });
})();
