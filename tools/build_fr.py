"""Build the French copy of every English page into site/fr/.

    python3 tools/build_fr.py

Text and attributes are swapped using tools/fr_dict.py. Anything without a translation is listed at the end.
Pages whose main content is written in both languages (devlog posts, changelog) pass their French
<main> directly with build_pair(..., fr_main=...), and only the menu and footer go through the dictionary.
"""
import re, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fr_dict import FR
from i18n import chunks, SITE, SKIP_TEXT

DOMAIN = 'https://tehzombijesus.ca/'
CORE = ['index.html', 'homelab.html', 'setup.html', 'ruenix.html', 'builds.html', 'now.html', 'guestbook.html', '404.html']
missing = set()
# names that stay the same in French; not reported as missing
KEEP = {'TehZombiJesus', 'Homelab', 'Ruenix', 'GitHub', '@TehZombiJesus', 'X / Twitter', 'Ruenix MC', 'Canada', 'Nox Interactive', 'Proxmox', 'TrueNAS', 'ZFS',
        'Docker', 'Coolify', 'Cloudflare', 'UniFi', 'Linux', 'Minecraft', 'GTA V', 'Ghost Recon Wildlands', 'League of Legends', 'Secretlab MAGNUS Pro XL',
        'RTX 5090 Founders Edition', 'Ryzen 7 9850X3D', 'hello@tehzombijesus.ca', 'Immich', 'Seafile', 'Jellyfin', 'Uptime Kuma', 'NVMe', 'RAIDZ2',
        'Intel Core Ultra 7 265K', 'ASUS Pro WS W880-ACE SE', 'Noctua NH-U12A', 'Corsair RM1000x', 'Fractal Design Define 7', 'CyberPower 1500 VA',
        'Cloud Gateway Fiber', '7680 × 2160, 240 Hz', 'PC', 'MAGNUS Pro XL', 'Gigabyte X870E AORUS Master', 'Windows', 'Arctic Liquid Freezer III Pro',
        'Fractal North XL Mesh', 'Premium PC Mount', 'Logitech G502 X Lightspeed', 'Logitech G Pro X 2 Lightspeed', 'Logitech Brio 4K', 'RTX 3070 Ti',
        'Gigabyte Z790 AORUS Elite AX', 'Windows 11 Pro', 'SMP', 'SkyPvP', 'Ruenix crest', 'Fibre', 'DNS · protection', 'Forums', 'Webcam', 'Photos',
        'Immich · photos', 'FR', 'Français', 'RSS', '.litematic', '.nbt', '@@FRMAIN@@'}

def tr_text(t):
    core = ' '.join(t.split())
    if not core or SKIP_TEXT.match(core): return t
    if core in FR:
        lead = t[:len(t) - len(t.lstrip())]; trail = t[len(t.rstrip()):]
        return lead + FR[core] + trail
    missing.add(core); return t

def tr_attr_val(v):
    if v in FR: return FR[v].replace('"', '&quot;')
    if v and not SKIP_TEXT.match(v) and not v.startswith(('http', '#', 'width=')): missing.add(v)
    return v

def tr_tag(tag):
    if tag.startswith('<meta') and not re.search(r'(name="description"|property="og:(title|description)")', tag): return tag
    def rep(m): return ' %s="%s"' % (m.group(1), tr_attr_val(m.group(2)))
    tag = re.sub(r'\s(alt|title|aria-label|data-name|data-info|data-words|content|placeholder)="([^"]*)"', rep, tag)
    tag = re.sub(r"\sdata-name='([^']*)'", lambda m: ' data-name="%s"' % tr_attr_val(m.group(1)), tag)
    return tag

def translate(html):
    out = []
    for c in chunks(html):
        if not c: continue
        if c.startswith(('<!--', '<script', '<style')): out.append(c)
        elif c.startswith('<'): out.append(tr_tag(c))
        else: out.append(tr_text(c))
    return ''.join(out)

def pretty(rel):
    """URL path Cloudflare serves for a file: index.html -> '', devlog/x.html -> devlog/x"""
    if rel.endswith('index.html'): return rel[:-len('index.html')]
    return rel[:-5] if rel.endswith('.html') else rel

def add_switch(s, rel, fr):
    s = re.sub(r'\n\s*<li><a class="lang"[^\n]*</li>', '', s)
    depth = rel.count('/')
    if rel == '404.html':
        href = '/index.html' if fr else '/fr/index.html'
    else:
        href = ('../' * (depth + 1) + rel) if fr else ('../' * depth + 'fr/' + rel)
    li = '<li><a class="lang" href="%s" hreflang="%s" lang="%s" title="%s">%s</a></li>' % (
        href, 'en' if fr else 'fr', 'en' if fr else 'fr', 'English' if fr else 'Français', 'EN' if fr else 'FR')
    i = s.index('</ul>', s.index('<nav class="nav"'))
    return s[:i] + '  ' + li + '\n    ' + s[i:]

def add_alternates(s, rel):
    s = re.sub(r'<link rel="alternate" hreflang="[^"]*" href="[^"]*">\n', '', s)
    if rel == '404.html': return s
    en_url = DOMAIN + pretty(rel); fr_url = DOMAIN + 'fr/' + pretty(rel)
    links = ('<link rel="alternate" hreflang="en" href="%s">\n<link rel="alternate" hreflang="fr" href="%s">\n'
             '<link rel="alternate" hreflang="x-default" href="%s">\n') % (en_url, fr_url, en_url)
    return s.replace('<link rel="stylesheet" href="', links + '<link rel="stylesheet" href="', 1)

SHARED = r'(assets/|styles\.css|site\.js|extras\.js|manifest\.webmanifest|sw-register\.js)'

def build_pair(rel, fr_main=None):
    """Read site/<rel> (English), make sure it has its FR switch, and write site/fr/<rel>."""
    path = os.path.join(SITE, rel)
    en = open(path, encoding='utf-8').read()
    en2 = add_alternates(add_switch(en, rel, False), rel)
    if en2 != en: open(path, 'w', encoding='utf-8').write(en2)
    src = re.sub(r'\n\s*<li><a class="lang"[^\n]*</li>', '', en2)
    if fr_main is not None:
        a = src.index('<main class="wrap">'); b = src.index('</main>') + len('</main>')
        src = src[:a] + '@@FRMAIN@@' + src[b:]
    s = translate(src)
    if fr_main is not None:
        depth = rel.count('/')
        if depth:  # links inside French text are written from the site root, like the English ones
            fr_main = re.sub(r'((?:href|src)=")(?!https?:|/|#|mailto:|\.\./)', r'\1' + '../' * depth, fr_main)
        s = s.replace('@@FRMAIN@@', fr_main.strip())
    s = s.replace('<html lang="en">', '<html lang="fr">')
    if 'og:locale' not in s:
        s = s.replace('<meta property="og:type"', '<meta property="og:locale" content="fr_CA">\n<meta property="og:type"', 1)
    s = s.replace('<dt>Poste de jeu</dt>', '<dt>Configuration</dt>')  # the "Setup" row in the storage panel
    s = s.replace('href="feed.xml"', 'href="feed.xml"')  # French pages use fr/feed.xml (same relative name)
    if rel == '404.html':
        s = re.sub(r'href="/(index|homelab|setup|ruenix|builds|devlog|now|guestbook|changelog)\.html"', r'href="/fr/\1.html"', s)
    else:
        s = re.sub(r'(["\'])((?:\.\./)*)' + SHARED, r'\1../\2\3', s)
    s = add_alternates(add_switch(s, rel, True), rel)
    out = os.path.join(SITE, 'fr', rel)
    os.makedirs(os.path.dirname(out), exist_ok=True)
    open(out, 'w', encoding='utf-8').write(s)

def report():
    left = sorted(m for m in missing if m not in KEEP)
    print('French pages built; untranslated strings:', len(left))
    for m in left: print('  -', m)
    return left

if __name__ == '__main__':
    for p in CORE:
        if os.path.exists(os.path.join(SITE, p)): build_pair(p)
    report()
