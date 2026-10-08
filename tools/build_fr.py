import re, os, sys
sys.path.insert(0, os.path.dirname(__file__))
from fr_dict import FR
from i18n import chunks, PAGES, SITE, SKIP_TEXT

PRETTY = {'index.html': '', 'homelab.html': 'homelab', 'setup.html': 'setup', 'ruenix.html': 'ruenix', 'now.html': 'now', '404.html': None}
DOMAIN = 'https://tehzombijesus.ca/'
missing = set()

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
    tag = re.sub(r'\s(alt|title|aria-label|data-name|data-info|data-words|content)="([^"]*)"', rep, tag)
    tag = re.sub(r"\sdata-name='([^']*)'", lambda m: ' data-name="%s"' % tr_attr_val(m.group(1)), tag)
    return tag

def lang_links(page, fr):
    if PRETTY[page] is None: return ''
    en_url = DOMAIN + PRETTY[page]; fr_url = DOMAIN + 'fr/' + PRETTY[page]
    return ('<link rel="alternate" hreflang="en" href="%s">\n<link rel="alternate" hreflang="fr" href="%s">\n'
            '<link rel="alternate" hreflang="x-default" href="%s">\n') % (en_url, fr_url, en_url)

def add_switch(s, page, fr):
    if 'class="lang"' in s: return s
    if page == '404.html':
        href = '/index.html' if fr else '/fr/index.html'
    else:
        href = ('../' + page) if fr else ('fr/' + page)
    li = '<li><a class="lang" href="%s" hreflang="%s" lang="%s" title="%s">%s</a></li>' % (
        href, 'en' if fr else 'fr', 'en' if fr else 'fr', 'English' if fr else 'Français', 'EN' if fr else 'FR')
    # after the last item of the main menu
    i = s.index('</ul>', s.index('<nav class="nav"'))
    return s[:i] + '  ' + li + '\n    ' + s[i:]

def add_alternates(s, page, fr):
    if 'hreflang="x-default"' in s: return s
    return s.replace('<link rel="stylesheet" href="', lang_links(page, fr) + '<link rel="stylesheet" href="', 1)

os.makedirs(os.path.join(SITE, 'fr'), exist_ok=True)
for page in PAGES:
    path = os.path.join(SITE, page)
    en = open(path, encoding='utf-8').read()
    # English page: language switch + alternates (only added once)
    en2 = add_alternates(add_switch(en, page, False), page, False)
    if en2 != en: open(path, 'w', encoding='utf-8').write(en2)
    # French page: start from the English page without its "FR" switch
    src = re.sub(r'\n\s*<li><a class="lang"[^\n]*</li>', '', en2)
    out = []
    for c in chunks(src):
        if not c: continue
        if c.startswith(('<!--', '<script', '<style')): out.append(c)
        elif c.startswith('<'): out.append(tr_tag(c))
        else: out.append(tr_text(c))
    s = ''.join(out)
    s = s.replace('<html lang="en">', '<html lang="fr">')
    s = s.replace('<meta property="og:type"', '<meta property="og:locale" content="fr_CA">\n<meta property="og:type"', 1)
    s = s.replace('<dt>Poste de jeu</dt>', '<dt>Configuration</dt>')  # the "Setup" row in the storage panel
    if page == '404.html':
        s = re.sub(r'href="/(index|homelab|setup|ruenix|now)\.html"', r'href="/fr/\1.html"', s)
    else:
        s = re.sub(r'(["\'])assets/', r'\1../assets/', s)
        s = s.replace('href="styles.css"', 'href="../styles.css"').replace('src="site.js"', 'src="../site.js"').replace('src="extras.js"', 'src="../extras.js"')
    s = add_alternates(add_switch(s, page, True), page, True)
    open(os.path.join(SITE, 'fr', page), 'w', encoding='utf-8').write(s)

KEEP = {'TehZombiJesus', 'Homelab', 'Ruenix', 'GitHub', '@TehZombiJesus', 'X / Twitter', 'Ruenix MC', 'Canada', 'Nox Interactive', 'Proxmox', 'TrueNAS', 'ZFS',
        'Docker', 'Coolify', 'Cloudflare', 'UniFi', 'Linux', 'Minecraft', 'GTA V', 'Ghost Recon Wildlands', 'League of Legends', 'Secretlab MAGNUS Pro XL',
        'RTX 5090 Founders Edition', 'Ryzen 7 9850X3D', 'hello@tehzombijesus.ca', 'Immich', 'Seafile', 'Jellyfin', 'Uptime Kuma', 'NVMe', 'RAIDZ2',
        'Intel Core Ultra 7 265K', 'ASUS Pro WS W880-ACE SE', 'Noctua NH-U12A', 'Corsair RM1000x', 'Fractal Design Define 7', 'CyberPower 1500 VA',
        'Cloud Gateway Fiber', '7680 × 2160, 240 Hz', 'PC', 'MAGNUS Pro XL', 'Gigabyte X870E AORUS Master', 'Windows', 'Arctic Liquid Freezer III Pro',
        'Fractal North XL Mesh', 'Premium PC Mount', 'Logitech G502 X Lightspeed', 'Logitech G Pro X 2 Lightspeed', 'Logitech Brio 4K', 'RTX 3070 Ti',
        'Gigabyte Z790 AORUS Elite AX', 'Windows 11 Pro', 'SMP', 'SkyPvP', 'Ruenix crest', 'Fibre', 'DNS · protection', 'Forums', 'Webcam', 'Photos', 'Immich · photos'}
left = sorted(m for m in missing if m not in KEEP)
print('fr pages built; untranslated strings:', len(left))
for m in left: print('  -', m)
