"""Make a new page that shares the head, menu and footer of the existing English pages.

    from pagekit import make_page
    html = make_page('now.html', title='Now | TehZombiJesus', description='...', main='<main>...</main>')

The template is site/now.html: everything outside <main> is copied, then the title,
descriptions, current menu item and scripts are swapped.
"""
import os, re

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site')


def make_page(filename, title, description, main, current=None, scripts=(), og_image=None, depth=0):
    """filename: the page's own name (for the menu highlight). current: menu href to highlight (default filename).
    scripts: extra script paths loaded after extras.js. depth: 1 for pages inside a folder (devlog/x.html)."""
    s = open(os.path.join(SITE, 'now.html'), encoding='utf-8').read()
    # drop French-switch and alternates: build_fr.py adds the right ones
    s = re.sub(r'\n\s*<li><a class="lang"[^\n]*</li>', '', s)
    s = re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n', '', s)
    s = re.sub(r'<title>.*?</title>', '<title>%s</title>' % title, s)
    for attr in ('name="description"', 'property="og:description"'):
        s = re.sub(r'<meta %s content="[^"]*">' % attr, '<meta %s content="%s">' % (attr, description.replace('"', '&quot;')), s)
    s = re.sub(r'<meta property="og:title" content="[^"]*">', '<meta property="og:title" content="%s">' % title, s)
    if og_image:
        s = re.sub(r'(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*(">)', r'\g<1>%s\g<2>' % og_image, s)
    s = s.replace(' aria-current="page"', '')
    cur = current or filename
    s = s.replace('<li><a href="%s">' % cur, '<li><a href="%s" aria-current="page">' % cur, 1)
    a = s.index('<main class="wrap">'); b = s.index('</main>') + len('</main>')
    s = s[:a] + main.strip() + s[b:]
    extra = ''.join('\n<script src="%s"></script>' % p for p in scripts)
    s = s.replace('<script src="extras.js"></script>', '<script src="extras.js"></script>' + extra)
    if depth:
        up = '../' * depth
        s = re.sub(r'((?:href|src)=")(?!https?:|/|#|mailto:|\.\./)', r'\1' + up, s)
        s = re.sub(r"(data-flip=')(?!https?:|/)", r'\1' + up, s)
    return s
