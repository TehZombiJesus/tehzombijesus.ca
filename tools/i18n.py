import re, json, sys, os
SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site')
PAGES = ['index.html', 'homelab.html', 'setup.html', 'ruenix.html', 'now.html', '404.html']
ATTRS = ['alt', 'title', 'aria-label', 'data-name', 'data-info', 'data-words', 'content']
SKIP_TEXT = re.compile(r'^[\s\d\W]*$')
def chunks(html):
    # comments and script/style blocks are left alone
    return re.split(r'(<!--.*?-->|<script\b.*?</script>|<style\b.*?</style>|<[^>]+>)', html, flags=re.S)
def extract():
    seen = []
    for p in PAGES:
        for c in chunks(open(os.path.join(SITE, p), encoding='utf-8').read()):
            if not c: continue
            if c.startswith('<!--') or c.startswith('<script') or c.startswith('<style'): continue
            if c.startswith('<'):
                if c.startswith('<meta') and not re.search(r'(name="description"|property="og:(title|description)"|name="twitter:title")', c): continue
                for a in ATTRS:
                    for m in re.finditer(r'\s%s="([^"]*)"' % a, c):
                        v = m.group(1)
                        if v and not SKIP_TEXT.match(v) and v not in seen and not v.startswith(('http', '#', 'width=')): seen.append(v)
                for m in re.finditer(r"\sdata-name='([^']*)'", c):
                    if m.group(1) not in seen: seen.append(m.group(1))
            else:
                t = ' '.join(c.split())
                if t and not SKIP_TEXT.match(t) and t not in seen: seen.append(t)
    return seen
if __name__ == '__main__':
    for s in extract(): print(s)
