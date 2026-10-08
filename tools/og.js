// Link preview images (1200×630) for each page, in English and French.
//   npm install @napi-rs/canvas   (once, anywhere above this folder)
//   node tools/og.js
// Writes site/assets/og/<name>-en.jpg and -fr.jpg. tools/build.py then points each page's preview at its image.
const path = require('path'), fs = require('fs');
const { createCanvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'site/assets/og');
fs.mkdirSync(OUT, { recursive: true });
GlobalFonts.registerFromPath(path.join(__dirname, 'og-fonts/ChakraPetch-Bold.ttf'), 'ChakraBold');
GlobalFonts.registerFromPath(path.join(__dirname, 'og-fonts/ChakraPetch-SemiBold.ttf'), 'ChakraSemi');

const posts = (() => {   // read titles from the devlog file without needing Python
  const src = fs.readFileSync(path.join(__dirname, 'devlog_posts.py'), 'utf8');
  const out = []; const re = /'slug':\s*'([^']+)'[\s\S]*?'en':\s*\{\s*'title':\s*'([^']+)'[\s\S]*?'fr':\s*\{\s*'title':\s*'([^']+)'/g;
  let m; while ((m = re.exec(src))) out.push(m);
  return out.map(m => ({ name: 'devlog-' + m[1], tag: ['Devlog', 'Journal'], title: [m[2], m[3].replace(/\\'/g, "'")] }));
})();

// EDIT: one entry per page
const PAGES = [
  { name: 'homelab', tag: ['Homelab', 'Homelab'], title: ['The rack that keeps growing', 'La baie qui ne cesse de grandir'] },
  { name: 'setup', tag: ['Setup', 'Poste de jeu'], title: ['The battlestation', 'La station de combat'] },
  { name: 'ruenix', tag: ['Ruenix MC', 'Ruenix MC'], title: ['The network I run', 'Le réseau que je gère'], ruenix: true },
  { name: 'devlog', tag: ['Devlog', 'Journal'], title: ['Built in public', 'Construit en public'] },
  { name: 'now', tag: ['Now', 'En ce moment'], title: ["What I'm up to", 'Ce que je fais'] },
  { name: 'guestbook', tag: ['Guestbook', "Livre d'or"], title: ['Sign the Crypt', 'Signe la Crypte'] },
  { name: 'changelog', tag: ['Changelog', 'Journal des changements'], title: ["What's new", 'Quoi de neuf'] },
  ...posts,
];

function wrap(ctx, text, max) {
  const words = text.split(' '), lines = []; let line = '';
  for (const w of words) { const t = line ? line + ' ' + w : w; if (ctx.measureText(t).width > max && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}

(async () => {
  const A = p => loadImage(path.join(ROOT, 'site/assets', p));
  const toon = await A('avatar-toon.webp');
  const crest = await A('ruenix-crest.webp');
  const word = await loadImage(Buffer.from(fs.readFileSync(path.join(ROOT, 'site/assets/wordmark.svg'), 'utf8')));
  for (const pg of PAGES) for (const [li, lang] of [[0, 'en'], [1, 'fr']]) {
    const W = 1200, H = 630, c = createCanvas(W, H), x = c.getContext('2d');
    const rx = !!pg.ruenix;
    const C = rx ? { bg: '#141c1a', a: '#e8893a', b: '#f2a36d', c: '#4a5753', d: '#2c3833', ink: '#eef1ec', muted: '#a3b0a8' }
                 : { bg: '#0e080d', a: '#8300fb', b: '#fb54f7', c: '#472f4a', d: '#74263e', ink: '#f4ecf3', muted: '#b6a6b5' };
    x.fillStyle = C.bg; x.fillRect(0, 0, W, H);
    // slanted band like the site header
    const band = [[C.c, 640, 860], [C.a, 860, 1020], [C.d, 1020, 1090], [C.b, 1090, 1300]];
    for (const [col, a, b] of band) { x.fillStyle = col; x.beginPath(); x.moveTo(a, 0); x.lineTo(b, 0); x.lineTo(b - 130, H); x.lineTo(a - 130, H); x.closePath(); x.fill(); }
    const g = x.createLinearGradient(560, 0, 900, 0); g.addColorStop(0, C.bg); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(480, 0, 440, H);
    // portrait / crest
    const img = rx ? crest : toon, S = 330, cx = 940, cy = 330;
    x.save(); x.shadowColor = 'rgba(0,0,0,.6)'; x.shadowBlur = 40;
    x.beginPath(); x.arc(cx, cy, S / 2 + 10, 0, 7); x.fillStyle = C.bg; x.fill(); x.restore();
    x.save(); x.beginPath(); x.arc(cx, cy, S / 2, 0, 7); x.clip(); x.drawImage(img, cx - S / 2, cy - S / 2, S, S); x.restore();
    x.lineWidth = 8; x.strokeStyle = C.b; x.beginPath(); x.arc(cx, cy, S / 2 + 6, 0, 7); x.stroke();
    // text
    x.fillStyle = rx ? C.a : '#a855ff'; x.font = '34px ChakraSemi'; x.fillText(pg.tag[li], 72, 150);
    x.fillStyle = C.ink; x.font = '84px ChakraBold';
    let size = 84, lines;
    for (; size >= 54; size -= 4) { x.font = size + 'px ChakraBold'; lines = wrap(x, pg.title[li], 640); if (lines.length <= 3) break; }
    lines.forEach((l, i) => x.fillText(l, 72, 250 + i * size * 1.05));
    const by = 250 + lines.length * size * 1.05 - size * 0.6 + 34;
    const bg2 = x.createLinearGradient(72, 0, 232, 0); bg2.addColorStop(0, C.a); bg2.addColorStop(1, C.b);
    x.fillStyle = bg2; x.beginPath(); x.roundRect(72, by, 160, 12, 6); x.fill();
    // footer: wordmark + address
    const ww = 300, wh = ww * word.height / word.width;
    x.drawImage(word, 72, H - 72 - wh, ww, wh);
    x.fillStyle = C.muted; x.font = '26px ChakraSemi'; x.fillText('tehzombijesus.ca' + (lang === 'fr' ? '/fr' : ''), 72 + ww + 24, H - 76);
    fs.writeFileSync(path.join(OUT, `${pg.name}-${lang}.jpg`), c.toBuffer('image/jpeg', 86));
  }
  console.log('made', PAGES.length * 2, 'preview images in site/assets/og');
})();
