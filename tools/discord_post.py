"""Announce site updates in the Discord server. Run by GitHub (.github/workflows/discord.yml), not by hand.

Two kinds of message, each to its own Discord webhook (set them as GitHub secrets, see the README):

  DISCORD_DEVLOG_WEBHOOK     every NEW devlog post (any project), in English and French, with a link
  DISCORD_CHANGELOG_WEBHOOK  optional: the list of changes in each push to the live site

If a webhook isn't set, that kind of message is simply skipped.
To post one devlog entry again by hand: GitHub → Actions → "Announce on Discord" → Run workflow → type its slug.
"""
import json, os, subprocess, sys, urllib.request

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
sys.path.insert(0, HERE)
DOMAIN = 'https://tehzombijesus.ca/'
VIOLET = 0x8300FB
PROJECT_ICON = {'website': '🌐', 'discord': '🦇', 'minecraft': '⛏️', 'homelab': '🖥️', 'setup': '🎮'}


def send(webhook, payload):
    req = urllib.request.Request(webhook, data=json.dumps(payload).encode(), method='POST',
                                 headers={'Content-Type': 'application/json', 'User-Agent': 'tehzombijesus.ca devlog (github actions)'})
    with urllib.request.urlopen(req, timeout=20) as r:
        print('Discord answered', r.status)


def posts_at(rev):
    """The devlog posts as they were at a git revision (empty if that revision doesn't exist)."""
    try:
        src = subprocess.run(['git', '-C', ROOT, 'show', '%s:tools/devlog_posts.py' % rev], capture_output=True, text=True, check=True).stdout
    except Exception:
        return None
    ns = {}
    exec(src, ns)
    return ns.get('POSTS', [])


def embed(p):
    from build import PROJECTS  # noqa: E402  (labels for each project)
    en, fr, proj = p['en'], p['fr'], p.get('project', 'website')
    label = PROJECTS.get(proj, (proj, proj))
    url_en, url_fr = DOMAIN + 'devlog/' + p['slug'], DOMAIN + 'fr/devlog/' + p['slug']
    e = {
        'author': {'name': 'TehZombiJesus · Devlog', 'url': DOMAIN + 'devlog'},
        'title': '%s %s' % (PROJECT_ICON.get(proj, '📝'), en['title']),
        'url': url_en,
        'description': '%s\n[Read it](%s)\n\n🇫🇷 **%s**\n%s\n[Lire le billet](%s)' % (en['summary'], url_en, fr['title'], fr['summary'], url_fr),
        'color': VIOLET,
        'footer': {'text': '%s · %s' % (label[0], label[1]) if label[0] != label[1] else label[0]},
        'timestamp': p['date'] + 'T12:00:00Z',
    }
    og = 'assets/og/devlog-%s-en.jpg' % p['slug']
    if os.path.exists(os.path.join(ROOT, 'site', og)):
        e['image'] = {'url': DOMAIN + og}
    return e


def announce_posts(webhook, before, only_slug):
    import devlog_posts
    now = devlog_posts.POSTS
    if only_slug:
        new = [p for p in now if p['slug'] == only_slug]
        if not new: sys.exit('No devlog post with the slug "%s".' % only_slug)
    else:
        old = posts_at(before) if before and set(before) != {'0'} else None
        if old is None:
            print('No earlier version to compare with; not announcing anything.'); return
        seen = {p['slug'] for p in old}
        new = sorted((p for p in now if p['slug'] not in seen), key=lambda p: p['date'])
    if not new:
        print('No new devlog posts.'); return
    for p in new:
        print('Announcing', p['slug'])
        send(webhook, {'username': 'TehZombiJesus', 'avatar_url': DOMAIN + 'assets/apple-touch-icon.png', 'embeds': [embed(p)]})


def announce_changes(webhook, commits):
    lines = []
    for c in commits:
        msg = (c.get('message') or '').split('\n', 1)[0].strip()
        if msg and not msg.lower().startswith('merge'):
            lines.append('• ' + msg)
    if not lines:
        print('No changes to list.'); return
    text = '\n'.join(lines)
    if len(text) > 3800: text = text[:3800].rsplit('\n', 1)[0] + '\n…'
    send(webhook, {'username': 'TehZombiJesus', 'avatar_url': DOMAIN + 'assets/apple-touch-icon.png', 'embeds': [{
        'author': {'name': 'tehzombijesus.ca · Changelog', 'url': DOMAIN + 'changelog'},
        'title': 'The site was updated · Le site a été mis à jour',
        'url': DOMAIN + 'changelog',
        'description': text,
        'color': VIOLET,
    }]})


if __name__ == '__main__':
    devlog_hook = os.environ.get('DISCORD_DEVLOG_WEBHOOK', '').strip()
    change_hook = os.environ.get('DISCORD_CHANGELOG_WEBHOOK', '').strip()
    before, slug = os.environ.get('BEFORE', '').strip(), os.environ.get('SLUG', '').strip()
    if devlog_hook:
        announce_posts(devlog_hook, before, slug)
    else:
        print('DISCORD_DEVLOG_WEBHOOK is not set: skipping devlog posts.')
    if change_hook and not slug:
        announce_changes(change_hook, json.loads(os.environ.get('COMMITS') or '[]'))
