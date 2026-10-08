"""Rebuild everything that is generated, then the French site.

    python3 tools/build.py

1. Devlog: devlog.html, devlog/<slug>.html and their French versions, from tools/devlog_posts.py
2. RSS feeds: feed.xml (English) and fr/feed.xml (French)
3. Changelog: changelog.html from the git history
4. French copies of every page (tools/build_fr.py)
5. sitemap.xml
"""
import os, sys, subprocess, html, datetime, re
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from pagekit import make_page, SITE
from devlog_posts import POSTS
import build_fr

DOMAIN = 'https://tehzombijesus.ca/'
MONTHS_EN = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

def nice_date(d, fr):
    y, m, dd = map(int, d.split('-'))
    return ('%d %s %d' % (dd, MONTHS_FR[m - 1], y)) if fr else ('%s %d, %d' % (MONTHS_EN[m - 1], dd, y))

def write(rel, text):
    path = os.path.join(SITE, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    open(path, 'w', encoding='utf-8').write(text)

RSS_LINK = '<link rel="alternate" type="application/rss+xml" title="TehZombiJesus devlog" href="feed.xml">\n'

def with_rss(page):
    return page.replace('<link rel="stylesheet" href="', RSS_LINK + '<link rel="stylesheet" href="', 1)

# ------------------------------------------------------------------ devlog
posts = sorted(POSTS, key=lambda p: p['date'], reverse=True)

def index_main(fr):
    L = (lambda en, f: f if fr else en)
    items = []
    for p in posts:
        c = p['fr' if fr else 'en']
        tags = ''.join('<li>%s</li>' % html.escape(t) for t in p['tags'])
        items.append('''      <li>
        <time datetime="%s">%s</time>
        <h3><a href="devlog/%s.html">%s</a></h3>
        <p>%s</p>
        <ul class="tags-mini">%s</ul>
      </li>''' % (p['date'], nice_date(p['date'], fr), p['slug'], html.escape(c['title']), html.escape(c['summary']), tags))
    return '''<main class="wrap">
  <header class="page-head">
    <span class="tag">%s</span>
    <h1>%s</h1>
    <div class="bar"></div>
    <p>%s <a class="rss" href="feed.xml">RSS</a></p>
  </header>
  <section>
    <ol class="post-list">
%s
    </ol>
  </section>
</main>''' % (L('Devlog', 'Journal'), L('Built in public', 'Construit en public'),
              L('Notes as the site, the homelab and the battlestation come together. Follow along with the', 'Des notes à mesure que le site, le homelab et le poste de jeu prennent forme. Suis le tout avec le flux'),
              '\n'.join(items))

def post_main(p, i, fr):
    L = (lambda en, f: f if fr else en)
    c = p['fr' if fr else 'en']
    newer = posts[i - 1] if i > 0 else None
    older = posts[i + 1] if i + 1 < len(posts) else None
    nav = []
    if older: nav.append('<a class="older" href="devlog/%s.html">← %s</a>' % (older['slug'], html.escape(older['fr' if fr else 'en']['title'])))
    nav.append('<a class="all" href="devlog.html">%s</a>' % L('All posts', 'Tous les billets'))
    if newer: nav.append('<a class="newer" href="devlog/%s.html">%s →</a>' % (newer['slug'], html.escape(newer['fr' if fr else 'en']['title'])))
    return '''<main class="wrap">
  <header class="page-head">
    <span class="tag">%s · <time datetime="%s">%s</time></span>
    <h1>%s</h1>
    <div class="bar"></div>
    <p>%s</p>
  </header>
  <article class="prose">
%s
  </article>
  <nav class="post-nav" aria-label="%s">%s</nav>
</main>''' % (L('Devlog', 'Journal'), p['date'], nice_date(p['date'], fr), html.escape(c['title']), html.escape(c['summary']), c['body'].strip(),
              L('More posts', 'Autres billets'), ''.join(nav))

def build_devlog():
    pages = []
    en = make_page('devlog.html', 'Devlog | TehZombiJesus', 'Notes as the TehZombiJesus site, homelab and battlestation come together.', index_main(False))
    write('devlog.html', with_rss(en)); pages.append(('devlog.html', index_main(True)))
    for i, p in enumerate(posts):
        rel = 'devlog/%s.html' % p['slug']
        c = p['en']
        page = make_page(rel, '%s | TehZombiJesus' % c['title'], c['summary'], post_main(p, i, False), current='devlog.html', depth=1)
        page = page.replace('<li><a href="../devlog.html">', '<li><a href="../devlog.html" aria-current="page">', 1)
        page = page.replace('<meta property="og:type" content="website">', '<meta property="og:type" content="article">')
        write(rel, with_rss(page).replace('href="feed.xml"', 'href="../feed.xml"'))
        pages.append((rel, post_main(p, i, True)))
    return pages

def fr_head_fix(rel, c):
    """Titles and descriptions of devlog posts are not in the dictionary; set them on the French copy."""
    path = os.path.join(SITE, 'fr', rel)
    s = open(path, encoding='utf-8').read()
    t = '%s | TehZombiJesus' % c['title']
    s = re.sub(r'<title>.*?</title>', '<title>%s</title>' % html.escape(t, quote=False), s)
    s = re.sub(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="%s">' % html.escape(t), s)
    for a in ('name="description"', 'property="og:description"'):
        s = re.sub(r'<meta %s content="[^"]*">' % a, '<meta %s content="%s">' % (a, html.escape(c['summary'])), s)
    open(path, 'w', encoding='utf-8').write(s)

def build_feed(fr):
    items = []
    for p in posts:
        c = p['fr' if fr else 'en']
        url = DOMAIN + ('fr/' if fr else '') + 'devlog/' + p['slug']
        y, m, d = map(int, p['date'].split('-'))
        date = datetime.datetime(y, m, d, 12, 0, tzinfo=datetime.timezone.utc).strftime('%a, %d %b %Y %H:%M:%S +0000')
        items.append('''  <item>
    <title>%s</title>
    <link>%s</link>
    <guid>%s</guid>
    <pubDate>%s</pubDate>
    <description>%s</description>
  </item>''' % (html.escape(c['title']), url, url, date, html.escape(c['summary'] + '\n' + c['body'].strip())))
    return '''<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>%s</title>
  <link>%s</link>
  <description>%s</description>
  <language>%s</language>
%s
</channel>
</rss>
''' % ('TehZombiJesus · Devlog', DOMAIN + ('fr/devlog' if fr else 'devlog'),
       'Construit en public : le site, le homelab et le poste de jeu.' if fr else 'Built in public: the site, the homelab and the battlestation.',
       'fr-CA' if fr else 'en-CA', '\n'.join(items))

# ------------------------------------------------------------------ changelog
def git_log():
    try:
        out = subprocess.run(['git', '-C', os.path.join(HERE, '..'), 'log', '--no-merges', '--date=short', '--pretty=%ad%x09%s'],
                             capture_output=True, text=True, check=True).stdout
    except Exception:
        return []
    return [l.split('\t', 1) for l in out.splitlines() if '\t' in l]

def changelog_main(fr):
    L = (lambda en, f: f if fr else en)
    days = {}
    for d, s in git_log(): days.setdefault(d, []).append(s)
    blocks = []
    for d in sorted(days, reverse=True):
        lis = ''.join('<li>%s</li>' % html.escape(s) for s in days[d])
        blocks.append('    <li><time datetime="%s">%s</time><ul>%s</ul></li>' % (d, nice_date(d, fr), lis))
    return '''<main class="wrap">
  <header class="page-head">
    <span class="tag">%s</span>
    <h1>%s</h1>
    <div class="bar"></div>
    <p>%s</p>
  </header>
  <section>
    <ol class="changes">
%s
    </ol>
  </section>
</main>''' % (L('Changelog', 'Journal des changements'), L("What's new", 'Quoi de neuf'),
              L('Every change to this site, straight from its <a href="https://github.com/TehZombiJesus/tehzombijesus.ca">GitHub history</a>. Bigger stories go in the <a href="devlog.html">devlog</a>.',
                "Chaque changement apporté au site, tiré directement de son <a href=\"https://github.com/TehZombiJesus/tehzombijesus.ca\">historique GitHub</a>. Les messages des changements sont en anglais. Les plus grosses nouvelles vont dans le <a href=\"devlog.html\">journal</a>."),
              '\n'.join(blocks) or '    <li>' + L('No changes yet.', 'Aucun changement pour le moment.') + '</li>')

# ------------------------------------------------------------------ sitemap
def build_sitemap(rels):
    today = datetime.date.today().isoformat()
    out = ['<?xml version="1.0" encoding="UTF-8"?>',
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for rel in rels:
        p = build_fr.pretty(rel)
        for lang in ('en', 'fr'):
            loc = DOMAIN + ('fr/' if lang == 'fr' else '') + p
            out.append('  <url><loc>%s</loc><lastmod>%s</lastmod>' % (loc, today))
            out.append('    <xhtml:link rel="alternate" hreflang="en" href="%s"/><xhtml:link rel="alternate" hreflang="fr" href="%s"/></url>' % (DOMAIN + p, DOMAIN + 'fr/' + p))
    out.append('</urlset>')
    write('sitemap.xml', '\n'.join(out) + '\n')

def apply_og(rels):
    """Point each page's link preview at its own image in assets/og (made by tools/og.js), when one exists."""
    for rel in rels:
        name = rel[:-5].replace('/', '-')
        for lang, path in (('en', os.path.join(SITE, rel)), ('fr', os.path.join(SITE, 'fr', rel))):
            img = 'assets/og/%s-%s.jpg' % (name, lang)
            if not os.path.exists(os.path.join(SITE, img)) or not os.path.exists(path): continue
            s = open(path, encoding='utf-8').read()
            s = re.sub(r'(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*(">)', r'\g<1>' + DOMAIN + img + r'\g<2>', s)
            open(path, 'w', encoding='utf-8').write(s)

if __name__ == '__main__':
    special = build_devlog()
    write('feed.xml', build_feed(False)); write('fr/feed.xml', build_feed(True))
    write('changelog.html', make_page('changelog.html', 'Changelog | TehZombiJesus', 'Every change to tehzombijesus.ca, from its GitHub history.', changelog_main(False)))
    special.append(('changelog.html', changelog_main(True)))
    core = [p for p in build_fr.CORE if os.path.exists(os.path.join(SITE, p))]
    for rel in core: build_fr.build_pair(rel)
    for rel, fr_main in special: build_fr.build_pair(rel, fr_main=fr_main)
    for p in posts: fr_head_fix('devlog/%s.html' % p['slug'], p['fr'])
    apply_og([r for r in core] + [r for r, _ in special])
    build_sitemap([r for r in core if r != '404.html'] + [r for r, _ in special])
    for p in posts: build_fr.KEEP.update({'%s | TehZombiJesus' % p['en']['title'], p['en']['summary']})
    left = build_fr.report()
    print('Built %d devlog posts, 2 feeds, the changelog and the sitemap.' % len(posts))
