/* Loads the 3D viewer (three.js is about 600 KB) only when the viewer is about to scroll into view. */
(function () {
  var zone = document.querySelector('.viewer'), base = (document.currentScript.src || '').replace(/builds\/loader\.js.*$/, '');
  if (!zone) return;
  var files = [base + 'vendor/three.min.js', base + 'vendor/OrbitControls.js', base + 'builds/viewer.js'], started = false;
  function next(i) {
    if (i >= files.length) { zone.classList.add('ready'); return; }
    var s = document.createElement('script'); s.src = files[i]; s.onload = function () { next(i + 1); };
    s.onerror = function () { zone.classList.add('failed'); };
    document.body.appendChild(s);
  }
  function go() {
    if (started) return; started = true;
    var start = function () { (window.requestIdleCallback || function (f) { setTimeout(f, 200); })(function () { next(0); }); };
    if (document.readyState === 'complete') start(); else addEventListener('load', start);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { io.disconnect(); go(); } }, { rootMargin: '300px 0px' });
    io.observe(zone);
  } else go();
})();
