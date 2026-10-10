"""Draw the site's illustrations as SVG files in site/assets/art/.

    python3 tools/make_art.py

Every scene is drawn here in code, in the brand colours (no outside artwork).
Change a colour or a number, run it again, and the pictures update.
The same seed always gives the same picture; change SEED for a different city skyline or LED pattern.
"""
import os, random

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site', 'assets', 'art')
SEED = 81

# brand colours
VOID, DEEP, NIGHT = '#0e080d', '#0a0610', '#140a22'
VIOLET, VTEXT, MAGENTA, PLUM, WINE, INK = '#8300fb', '#a855ff', '#fb54f7', '#472f4a', '#74263e', '#f4ecf3'
GREEN, BLUE = '#22c55e', '#60a5fa'

# the TZJ monogram from favicon.svg (drawn in a 256 box)
TZJ = ['M62.98 103.56H41.25V91.6H98.86V103.56H77.13V164.4H62.98Z',
       'M101.06 153.17 138.4 103.66V103.46H102.1V91.6H155.35V102.83L118.02 152.34V152.54H155.35V164.4H101.06Z',
       'M158.07 151.82V138.3H171.8V147.03L177.1 152.34H190.94L195.93 147.45V91.6H210.07V152.23L197.9 164.4H170.55Z']


def svg(w, h, body, extra_defs='', style=''):
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" preserveAspectRatio="xMidYMid slice">
<defs>
  <filter id="glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  <filter id="bloom" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter>
  <filter id="soft"><feGaussianBlur stdDeviation="2.5"/></filter>
  <linearGradient id="room" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07040c"/><stop offset=".65" stop-color="{NIGHT}"/><stop offset="1" stop-color="#05030a"/></linearGradient>
  <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06030f"/><stop offset=".6" stop-color="#1b0b38"/><stop offset="1" stop-color="#3a1260"/></linearGradient>
  <linearGradient id="neonH" x1="0" x2="1"><stop offset="0" stop-color="{VIOLET}"/><stop offset="1" stop-color="{MAGENTA}"/></linearGradient>
  <radialGradient id="pool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="{VIOLET}" stop-opacity=".55"/><stop offset="1" stop-color="{VIOLET}" stop-opacity="0"/></radialGradient>
  {extra_defs}
</defs>
<style>
  .blink {{ animation: bl 2.4s steps(1) infinite; }}
  .d1 {{ animation-delay: -.6s; animation-duration: 1.7s; }} .d2 {{ animation-delay: -1.1s; animation-duration: 3.1s; }}
  .d3 {{ animation-delay: -1.9s; animation-duration: 1.3s; }} .d4 {{ animation-delay: -.3s; animation-duration: 4.2s; }}
  @keyframes bl {{ 0%, 60% {{ opacity: 1; }} 61%, 72% {{ opacity: .2; }} 73% {{ opacity: 1; }} }}
  .hum {{ animation: hum 6s ease-in-out infinite; }}
  @keyframes hum {{ 0%, 100% {{ opacity: .85; }} 50% {{ opacity: 1; }} }}
  .flick {{ animation: fl 7s linear infinite; }}
  @keyframes fl {{ 0%, 41%, 43%, 46%, 100% {{ opacity: 1; }} 42%, 45% {{ opacity: .45; }} }}
  @media (prefers-reduced-motion: reduce) {{ * {{ animation: none !important; }} }}
  {style}
</style>
{body}
</svg>
'''


def monogram(x, y, size, color=MAGENTA, cls='flick'):
    s = size / 256
    paths = ''.join(f'<path d="{d}"/>' for d in TZJ)
    return (f'<g class="{cls}" transform="translate({x} {y}) scale({s:.4f})">'
            f'<rect x="12" y="12" width="232" height="232" rx="44" fill="none" stroke="{VIOLET}" stroke-width="9" filter="url(#glow)"/>'
            f'<g fill="{color}" filter="url(#glow)">{paths}</g>'
            f'<rect x="43.7" y="180.4" width="168.6" height="8" rx="4" fill="{MAGENTA}" filter="url(#glow)"/></g>')


def skyline(r, x0, x1, base, top, n_win=0.35, far=False):
    """Night city: buildings with lit windows, drawn between x0 and x1 down to `base`."""
    out, x = [], x0
    fill = '#170b2c' if far else '#0d0618'
    while x < x1:
        w = r.randint(28, 70); h = r.randint(int((base - top) * .3), base - top)
        out.append(f'<rect x="{x}" y="{base - h}" width="{w}" height="{h}" fill="{fill}"/>')
        if r.random() < .25:  # antenna
            out.append(f'<rect x="{x + w // 2}" y="{base - h - 18}" width="2" height="18" fill="{fill}"/><circle cx="{x + w // 2 + 1}" cy="{base - h - 19}" r="2.5" fill="{MAGENTA}" class="blink d{r.randint(1, 4)}"/>')
        for wy in range(base - h + 10, base - 6, 12):
            for wx in range(x + 6, x + w - 6, 10):
                if r.random() < n_win:
                    c = r.choice([VTEXT, '#c9a6ff', MAGENTA, '#ffd6a8']) if not far else '#5b2a9a'
                    out.append(f'<rect x="{wx}" y="{wy}" width="4" height="6" fill="{c}" opacity="{r.uniform(.35, .95):.2f}"/>')
        x += w + r.randint(2, 10)
    return ''.join(out)


def stars(r, x0, x1, y0, y1, n):
    return ''.join(f'<circle cx="{r.uniform(x0, x1):.0f}" cy="{r.uniform(y0, y1):.0f}" r="{r.uniform(.6, 1.6):.1f}" fill="{INK}" opacity="{r.uniform(.3, .9):.2f}"/>' for _ in range(n))


def floor(y, w, h):
    lines = ''.join(f'<line x1="{w / 2}" y1="{y}" x2="{w / 2 + (i - 10) * 160}" y2="{h}" />' for i in range(21))
    rows = ''.join(f'<line x1="0" y1="{y + d}" x2="{w}" y2="{y + d}"/>' for d in (12, 30, 56, 92, 140))
    return (f'<rect x="0" y="{y}" width="{w}" height="{h - y}" fill="#07040d"/>'
            f'<g stroke="{VIOLET}" stroke-opacity=".18" stroke-width="1">{lines}{rows}</g>'
            f'<rect x="0" y="{y - 1}" width="{w}" height="2" fill="url(#neonH)" opacity=".7" filter="url(#glow)"/>')


def ceiling_strips(w, xs):
    return ''.join(f'<rect x="{x}" y="22" width="{ln}" height="5" rx="2.5" fill="{c}" filter="url(#glow)" class="hum"/>'
                   f'<ellipse cx="{x + ln / 2}" cy="40" rx="{ln * .7}" ry="40" fill="url(#pool)" opacity=".5"/>' for x, ln, c in xs)


def plant(x, y, s=1.0, flip=False):
    leaves = ''.join(
        f'<path d="M0 0 Q {dx * .5 - 16:.0f} {-dy * .55:.0f} {dx} {-dy} Q {dx * .5 + 16:.0f} {-dy * .45:.0f} 0 0Z"/>'
        for dx, dy in [(-46, 70), (-28, 104), (-6, 122), (18, 110), (40, 84), (54, 50), (-58, 40)])
    sx = -s if flip else s
    return (f'<g transform="translate({x} {y}) scale({sx} {s})"><g fill="#120a1c" stroke="{VIOLET}" stroke-opacity=".45" stroke-width="1.2">{leaves}</g>'
            f'<path d="M-22 0h44l-6 40h-32z" fill="#150c20" stroke="{VIOLET}" stroke-opacity=".5"/></g>')


# ---------------------------------------------------------------- the homelab rack room
def scene_lab(r):
    W, H = 1400, 700
    b = [f'<rect width="{W}" height="{H}" fill="url(#room)"/>']
    # back wall panels
    b.append(''.join(f'<rect x="{x}" y="0" width="1" height="560" fill="{VIOLET}" opacity=".08"/>' for x in range(0, W, 70)))
    b.append(ceiling_strips(W, [(180, 260, VIOLET), (560, 280, MAGENTA), (960, 240, VIOLET)]))
    # window with the city on the far right
    b.append(f'<rect x="1080" y="90" width="260" height="330" fill="url(#sky)"/>{stars(r, 1080, 1340, 90, 260, 40)}'
             f'<g>{skyline(r, 1080, 1340, 420, 230, far=True)}</g>'
             f'<rect x="1080" y="90" width="260" height="330" fill="none" stroke="#1d1229" stroke-width="10"/><rect x="1205" y="90" width="8" height="330" fill="#1d1229"/>')
    # TZJ neon on the wall
    b.append(monogram(870, 150, 160))
    # three racks
    for i, rx in enumerate((170, 400, 630)):
        rw, top, bot = 190, 70, 600
        b.append(f'<rect x="{rx - 14}" y="{top - 14}" width="{rw + 28}" height="{bot - top + 28}" rx="6" fill="#0b0712" stroke="#2a1d36" stroke-width="2"/>')
        b.append(f'<rect x="{rx - 10}" y="{top}" width="3" height="{bot - top}" fill="{VIOLET}" filter="url(#glow)" class="hum"/>'
                 f'<rect x="{rx + rw + 7}" y="{top}" width="3" height="{bot - top}" fill="{MAGENTA}" filter="url(#glow)" class="hum"/>')
        y = top + 6
        while y < bot - 20:
            u = r.choice([18, 18, 18, 36, 36, 54]) if not (i == 1 and y < 180) else 54
            u = min(u, bot - y - 6)
            b.append(f'<rect x="{rx}" y="{y}" width="{rw}" height="{u - 3}" rx="2" fill="#160f20" stroke="#2c2038" stroke-width="1"/>')
            if u >= 54 and i == 1 and y < 200:  # the storage server: a wall of drive bays
                for k in range(11):
                    for row in range(2):
                        bx, by = rx + 8 + k * 16, y + 6 + row * 22
                        b.append(f'<rect x="{bx}" y="{by}" width="13" height="18" rx="1.5" fill="#21172c" stroke="#3a2a48" stroke-width=".8"/>'
                                 f'<circle cx="{bx + 6.5}" cy="{by + 14}" r="1.6" fill="{r.choice([GREEN, BLUE, GREEN])}" class="blink d{r.randint(1, 4)}"/>')
            else:
                for vx in range(rx + 60, rx + rw - 14, 6):
                    b.append(f'<rect x="{vx}" y="{y + 4}" width="2" height="{u - 11}" fill="#0c0812"/>')
                for k in range(r.randint(2, 5)):
                    c = r.choice([GREEN, GREEN, BLUE, VTEXT, MAGENTA])
                    b.append(f'<circle cx="{rx + 10 + k * 9}" cy="{y + u / 2 - 1:.0f}" r="2.2" fill="{c}" class="blink d{r.randint(1, 4)}"/>')
                if r.random() < .5:
                    b.append(f'<rect x="{rx + 10}" y="{y + u / 2 + 3:.0f}" width="{r.randint(20, 40)}" height="2" fill="{VIOLET}" opacity=".6"/>')
            y += u
        # cable bundle
        b.append(f'<path d="M{rx + rw / 2} {bot + 14} C {rx + rw / 2} {bot + 50}, {rx + rw / 2 + 40} {bot + 40}, {rx + rw / 2 + 60} {bot + 70}" stroke="{PLUM}" stroke-width="6" fill="none"/>')
    b.append(floor(612, W, H))
    b.append(f'<ellipse cx="500" cy="640" rx="420" ry="40" fill="url(#pool)"/>')
    b.append(plant(1010, 612, 1.0))
    return svg(W, H, ''.join(b))


# ---------------------------------------------------------------- the battlestation (his real layout)
def scene_station(r):
    W, H = 1400, 700
    b = [f'<rect width="{W}" height="{H}" fill="url(#room)"/>']
    # big window behind the desk
    b.append(f'<rect x="160" y="40" width="1080" height="420" fill="url(#sky)"/>{stars(r, 160, 1240, 40, 260, 120)}'
             f'<circle cx="1080" cy="120" r="34" fill="#f1e6ff" opacity=".9"/><circle cx="1080" cy="120" r="70" fill="{VTEXT}" opacity=".15" filter="url(#bloom)"/>'
             f'{skyline(r, 160, 1240, 460, 260, far=True)}{skyline(r, 160, 1240, 460, 330)}'
             + ''.join(f'<rect x="{x}" y="40" width="10" height="420" fill="#120a1b"/>' for x in (160, 520, 880, 1230))
             + f'<rect x="160" y="40" width="1080" height="10" fill="#120a1b"/>')
    b.append(ceiling_strips(W, [(260, 300, VIOLET), (840, 300, MAGENTA)]))
    # desk
    b.append(f'<rect x="140" y="520" width="1120" height="22" rx="4" fill="#120b1a" stroke="#2c1f38"/>'
             f'<rect x="150" y="542" width="1100" height="4" fill="url(#neonH)" filter="url(#glow)" class="hum"/>'
             f'<ellipse cx="700" cy="560" rx="560" ry="40" fill="url(#pool)" opacity=".8"/>')
    # monitor poles
    b.append(f'<rect x="452" y="190" width="10" height="330" fill="#1a1224"/><rect x="938" y="190" width="10" height="330" fill="#1a1224"/>')
    # the 57" curved ultrawide
    x0, x1, yt, yb = 380, 1020, 338, 484
    curve = f'M{x0} {yt} Q 700 {yt + 22} {x1} {yt} L {x1} {yb} Q 700 {yb + 22} {x0} {yb} Z'
    b.append(f'<path d="{curve}" fill="#05030a" stroke="#2b1f3a" stroke-width="8"/>')
    b.append(f'<clipPath id="uw"><path d="{curve}"/></clipPath>')
    mtn = ''.join(f'<path d="M{x0} {yb} L {x0 + 60 + k * 120} {yb - 50 - (k % 3) * 22} L {x0 + 180 + k * 120} {yb} Z" fill="{c}"/>'
                  for k, c in enumerate([PLUM, '#2b1647', PLUM, '#2b1647', PLUM]))
    grid = ''.join(f'<line x1="700" y1="{yb - 30}" x2="{700 + (k - 8) * 70}" y2="{yb + 20}" stroke="{MAGENTA}" stroke-opacity=".4"/>' for k in range(17))
    b.append(f'<g clip-path="url(#uw)"><rect x="{x0}" y="{yt}" width="{x1 - x0}" height="{yb - yt + 30}" fill="url(#sky)"/>'
             f'<circle cx="700" cy="{yb - 34}" r="44" fill="{MAGENTA}" opacity=".85"/>'
             f'<g fill="#0a0610">' + ''.join(f'<rect x="650" y="{yb - 46 + k * 7}" width="100" height="{2 + k}"/>' for k in range(5)) + '</g>'
             f'{mtn}{grid}</g>')
    b.append(f'<path d="{curve}" fill="none" stroke="{VTEXT}" stroke-opacity=".35" stroke-width="1.5"/>')
    # three 22" screens above: outer ones turn in
    def screen(pts, content):
        p = ' '.join(f'{a},{c}' for a, c in pts)
        return f'<polygon points="{p}" fill="#05030a" stroke="#2b1f3a" stroke-width="6"/>{content}'
    def bars(x, y, w, n, color):
        return ''.join(f'<rect x="{x}" y="{y + k * 13}" width="{w * r.uniform(.35, 1):.0f}" height="5" rx="2.5" fill="{color}" opacity="{r.uniform(.45, .9):.2f}"/>' for k in range(n))
    b.append(screen([(380, 214), (586, 200), (586, 316), (380, 304)], bars(398, 228, 150, 6, VTEXT)))
    b.append(screen([(598, 200), (802, 200), (802, 316), (598, 316)],
                    ''.join(f'<rect x="{614 + k * 22}" y="{300 - hh}" width="14" height="{hh}" fill="url(#neonH)" opacity=".85"/>' for k, hh in enumerate([30, 52, 40, 70, 58, 84, 64, 92]))))
    b.append(screen([(814, 200), (1020, 214), (1020, 304), (814, 316)], bars(832, 226, 150, 6, MAGENTA)))
    # PC hanging under the desk (fans glowing)
    b.append(f'<rect x="1080" y="552" width="120" height="118" rx="6" fill="#0f0916" stroke="#2c1f38"/>'
             + ''.join(f'<circle cx="1140" cy="{580 + k * 34}" r="13" fill="none" stroke="{c}" stroke-width="3" filter="url(#glow)" class="hum"/>' for k, c in enumerate([VIOLET, MAGENTA, VIOLET])))
    # chair from behind
    b.append(f'<path d="M612 700 L 620 540 Q 622 480 700 476 Q 778 480 780 540 L 788 700 Z" fill="#0a0610" stroke="{VIOLET}" stroke-opacity=".55" stroke-width="2"/>'
             f'<path d="M656 498 Q 700 486 744 498 L 740 536 Q 700 528 660 536 Z" fill="#150c20"/>'
             f'<path d="M640 590 Q 700 578 760 590" stroke="{MAGENTA}" stroke-width="3" fill="none" opacity=".7"/>')
    # keyboard, mouse, lamp, plant
    b.append(f'<rect x="560" y="508" width="220" height="10" rx="3" fill="#1c1228" stroke="{VIOLET}" stroke-opacity=".6"/>'
             f'<rect x="800" y="508" width="20" height="10" rx="5" fill="#1c1228" stroke="{MAGENTA}" stroke-opacity=".7"/>')
    b.append(plant(250, 520, .9))
    b.append(f'<path d="M1180 520 l -6 -70 l 30 -30" stroke="#2a1d36" stroke-width="5" fill="none"/><path d="M1196 412 l 34 6 l -10 22 z" fill="#2a1d36"/>'
             f'<ellipse cx="1218" cy="460" rx="40" ry="60" fill="#ffd6a8" opacity=".12" filter="url(#bloom)"/>')
    b.append(f'<rect x="0" y="600" width="{W}" height="100" fill="#06030b" opacity=".6"/>')
    return svg(W, H, ''.join(b))


# ---------------------------------------------------------------- the Crypt (join banner)
def scene_crypt(r):
    W, H = 1400, 700
    b = [f'<rect width="{W}" height="{H}" fill="url(#room)"/>']
    b.append(f'<rect x="520" y="60" width="820" height="460" fill="url(#sky)"/>{stars(r, 520, 1340, 60, 300, 140)}'
             f'<mask id="moon"><rect x="1100" y="80" width="160" height="160" fill="#fff"/><circle cx="1198" cy="138" r="42" fill="#000"/></mask>'
             f'<circle cx="1180" cy="150" r="46" fill="#f1e6ff" mask="url(#moon)"/><circle cx="1170" cy="155" r="80" fill="{VTEXT}" opacity=".12" filter="url(#bloom)"/>'
             f'{skyline(r, 520, 1340, 520, 280, far=True)}{skyline(r, 520, 1340, 520, 360)}'
             + ''.join(f'<rect x="{x}" y="60" width="12" height="460" fill="#100919"/>' for x in (520, 790, 1060, 1330))
             + '<rect x="520" y="56" width="822" height="12" fill="#100919"/>')
    # bats over the city
    for bx, by, s in [(900, 210, 1), (960, 180, .7), (1010, 230, .55)]:
        b.append(f'<path transform="translate({bx} {by}) scale({s})" d="M0 0 q 12 -14 26 -4 q 6 -10 12 -2 q 6 -8 12 2 q 14 -10 26 4 q -16 -2 -22 10 q -6 -6 -10 2 q -4 -8 -10 -2 q -6 -12 -22 -10 z" fill="#07040c"/>')
    # neon sign: the Crypt's monogram
    b.append(monogram(150, 110, 200))
    b.append(f'<ellipse cx="250" cy="210" rx="190" ry="160" fill="url(#pool)" opacity=".6"/>')
    # desk + gamer silhouette facing the window
    b.append(f'<rect x="420" y="540" width="980" height="18" fill="#110a19" stroke="#2c1f38"/>'
             f'<rect x="430" y="558" width="960" height="3" fill="url(#neonH)" filter="url(#glow)" class="hum"/>')
    b.append(f'<path d="M780 380 h 260 v 140 h -260 z" fill="#05030a" stroke="#2b1f3a" stroke-width="6"/>'
             f'<rect x="790" y="390" width="240" height="120" fill="url(#neonH)" opacity=".35"/>'
             f'<g fill="{INK}" opacity=".85">' + ''.join(f'<rect x="806" y="{404 + k * 14}" width="{r.randint(60, 190)}" height="5" rx="2.5"/>' for k in range(7)) + '</g>'
             f'<rect x="900" y="520" width="14" height="22" fill="#1a1224"/>')
    b.append(f'<path d="M820 700 L 828 520 Q 832 456 900 452 Q 968 456 972 520 L 980 700 Z" fill="#07040c" stroke="{VIOLET}" stroke-opacity=".6" stroke-width="2"/>'
             f'<circle cx="900" cy="440" r="34" fill="#07040c" stroke="{MAGENTA}" stroke-opacity=".5" stroke-width="2"/>'
             f'<path d="M866 432 q 34 -40 68 0" stroke="{VIOLET}" stroke-width="7" fill="none"/>')  # headset
    # candle lamp and plants
    b.append(f'<rect x="1240" y="500" width="26" height="40" rx="3" fill="#1a1224"/><ellipse cx="1253" cy="496" rx="5" ry="9" fill="#ffd6a8"/>'
             f'<circle cx="1253" cy="496" r="40" fill="#ffd6a8" opacity=".18" filter="url(#bloom)"/>')
    b.append(plant(470, 540, 1.1) + plant(1330, 540, .8, True))
    b.append(floor(640, W, H))
    return svg(W, H, ''.join(b))


# ---------------------------------------------------------------- terminal (quote banner)
def scene_terminal(r):
    W, H = 1400, 600
    b = [f'<rect width="{W}" height="{H}" fill="#0b0613"/>']
    b.append(f'<rect x="40" y="40" width="1320" height="520" rx="16" fill="#0f0919" stroke="#2c1f38"/>'
             f'<rect x="40" y="40" width="1320" height="44" rx="16" fill="#160e22"/>'
             + ''.join(f'<circle cx="{74 + k * 24}" cy="62" r="7" fill="{c}"/>' for k, c in enumerate(['#e8a850', '#22c55e', VTEXT])))
    y = 120
    while y < 530:
        indent = r.choice([0, 0, 1, 2, 2, 3])
        b.append(f'<text x="70" y="{y + 9}" fill="{PLUM}" font-family="monospace" font-size="14">{(y - 120) // 26 + 1:>2}</text>')
        x = 120 + indent * 40
        for _ in range(r.randint(1, 4)):
            w = r.randint(40, 220)
            c = r.choice([VTEXT, MAGENTA, INK, '#7c5aa8', VIOLET])
            b.append(f'<rect x="{x}" y="{y}" width="{w}" height="10" rx="5" fill="{c}" opacity="{r.uniform(.45, .9):.2f}"/>')
            x += w + 14
            if x > 1300: break
        y += 26
    b.append(f'<rect x="120" y="{y - 26}" width="12" height="16" fill="{MAGENTA}" class="blink"/>')
    return svg(W, H, ''.join(b))


# ---------------------------------------------------------------- hero backdrop behind the portrait
def scene_backdrop(r):
    W = H = 900
    c = W / 2
    ticks = ''.join(f'<rect x="{c - 1.5}" y="70" width="3" height="{14 if k % 5 else 26}" fill="{VTEXT}" opacity="{.35 if k % 5 else .8}" transform="rotate({k * 6} {c} {c})"/>' for k in range(60))
    shards = (f'<g opacity=".9">'
              f'<polygon points="70,820 300,120 380,120 150,820" fill="{PLUM}" opacity=".7"/>'
              f'<polygon points="420,860 640,90 700,90 480,860" fill="{VIOLET}" opacity=".35"/>'
              f'<polygon points="640,820 820,220 870,220 690,820" fill="{WINE}" opacity=".7"/>'
              f'<polygon points="720,860 880,330 900,330 740,860" fill="{MAGENTA}" opacity=".55"/></g>')
    sparks = ''.join(f'<circle cx="{r.uniform(60, 840):.0f}" cy="{r.uniform(60, 840):.0f}" r="{r.uniform(1, 2.6):.1f}" fill="{r.choice([MAGENTA, VTEXT, INK])}" opacity="{r.uniform(.3, .9):.2f}" class="blink d{r.randint(1, 4)}"/>' for _ in range(40))
    body = (f'<circle cx="{c}" cy="{c}" r="420" fill="url(#pool)"/>'
            f'{shards}'
            f'<g class="spin">{ticks}</g>'
            f'<circle cx="{c}" cy="{c}" r="350" fill="none" stroke="url(#neonH)" stroke-width="6" filter="url(#glow)"/>'
            f'<circle cx="{c}" cy="{c}" r="300" fill="none" stroke="{VTEXT}" stroke-opacity=".25" stroke-width="1.5" stroke-dasharray="4 10" class="spin rev"/>'
            f'{sparks}')
    style = (f'.spin {{ transform-origin: {c}px {c}px; animation: spin 80s linear infinite; }} .rev {{ animation-direction: reverse; animation-duration: 120s; }}'
             '@keyframes spin { to { transform: rotate(360deg); } }')
    return svg(W, H, body, style=style).replace('preserveAspectRatio="xMidYMid slice"', 'preserveAspectRatio="xMidYMid meet"')


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    for name, fn in [('lab', scene_lab), ('station', scene_station), ('crypt', scene_crypt), ('terminal', scene_terminal), ('backdrop', scene_backdrop)]:
        data = fn(random.Random(SEED))
        open(os.path.join(OUT, name + '.svg'), 'w', encoding='utf-8').write(data)
        print('art/%s.svg  %d KB' % (name, len(data) // 1024))
