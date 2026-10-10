# ============================== DEVLOG POSTS ==============================
# Newest first or any order: they are sorted by date. Each post needs:
#   slug   short name used in the address (devlog/<slug>.html), letters, numbers and dashes
#   date   YYYY-MM-DD
#   project  which project it's about: website, discord, minecraft, homelab or setup (see PROJECTS in build.py)
#            Every update gets a post, so the devlog doubles as the changelog for everything, not just this site.
#   tags   a few words
#   en/fr  title, summary (one sentence for the list, the RSS feed and Discord) and body (HTML)
# Then run:  python3 tools/build.py
# Once a new post is live, Crypt Keeper posts it in #devlog on Discord by itself (it reads the RSS feeds).
# =========================================================================

POSTS = [
 {
  'slug': 'site-goes-live',
  'project': 'website',
  'date': '2026-10-05',
  'tags': ['website', 'cloudflare'],
  'en': {
    'title': 'The site goes live',
    'summary': 'tehzombijesus.ca is up: a link hub and portfolio, hosted on Cloudflare Pages.',
    'body': '''
<p>For years "TehZombiJesus" has been a username on a dozen platforms and nothing that tied them together. Now there's a home base: <strong>tehzombijesus.ca</strong>.</p>
<p>It started as a simple link hub and grew into four pages: the homelab, the gaming setup I'm planning, the Ruenix Minecraft network, and the usual about me. It's plain HTML and CSS on Cloudflare Pages. No framework, no build step, nothing to update every week.</p>
<h2>Locked down from day one</h2>
<p>Security headers came before anything fancy. The site scores <strong>A+</strong> on securityheaders.com: a strict content security policy, HSTS, no framing, and only the browser features the site actually needs. Every script runs from this domain, so nothing loads from somewhere I don't control.</p>
<p>The rest of this devlog is where the site, the server and the setup get built in public.</p>
'''},
  'fr': {
    'title': 'Le site est en ligne',
    'summary': 'tehzombijesus.ca est en ligne : une page de liens et un portfolio, hébergés sur Cloudflare Pages.',
    'body': '''
<p>Pendant des années, «&nbsp;TehZombiJesus&nbsp;» était un nom d'utilisateur sur une douzaine de plateformes, sans rien pour les relier. Maintenant, il y a un camp de base&nbsp;: <strong>tehzombijesus.ca</strong>.</p>
<p>Ça a commencé comme une simple page de liens, puis c'est devenu quatre pages&nbsp;: le homelab, le poste de jeu que je planifie, le réseau Minecraft Ruenix et l'habituel à propos. C'est du HTML et du CSS tout simples sur Cloudflare Pages. Pas de framework, pas d'étape de compilation, rien à mettre à jour chaque semaine.</p>
<h2>Verrouillé dès le premier jour</h2>
<p>Les en-têtes de sécurité sont passés avant tout le reste. Le site obtient <strong>A+</strong> sur securityheaders.com&nbsp;: une politique de sécurité du contenu stricte, HSTS, aucun encadrement et seulement les fonctions du navigateur dont le site a vraiment besoin. Chaque script roule à partir de ce domaine, alors rien ne se charge d'un endroit que je ne contrôle pas.</p>
<p>Le reste de ce journal, c'est là où le site, le serveur et le poste de jeu se construisent en public.</p>
'''},
 },
 {
  'slug': 'welcome-to-the-crypt',
  'project': 'discord',
  'date': '2026-10-06',
  'tags': ['discord', 'bot'],
  'en': {
    'title': 'Welcome to The Crypt',
    'summary': 'My Discord server is open, and it has its own custom bot: Crypt Keeper.',
    'body': '''
<p><strong>The Crypt</strong> is my Discord server: a hangout for friends, a place to find people to play with, and a corner for homelab and tech help. It has a full French section too.</p>
<h2>Crypt Keeper</h2>
<p>Instead of stacking five public bots, the server runs one custom bot written for it. Crypt Keeper builds the whole server layout in one command, welcomes new members with a banner, and keeps a message log for the staff.</p>
<ul>
  <li>Levels with six crypt-themed ranks, from Lost Soul to Crypt Legend.</li>
  <li>Temporary voice rooms, game nights and a looking-for-group board.</li>
  <li>Birthdays with their own cards, a question of the day and a weekly recap.</li>
  <li>Free game alerts, trivia and a starboard for the best messages.</li>
  <li>A first answer from AI on tech-help posts, with a daily limit to keep costs sane.</li>
</ul>
<p>The server icon even follows the calendar: Halloween in October, Christmas in December, and a few special days in between. This website now does the same.</p>
<p><a href="https://discord.gg/DRSZb9qqqh">Join the Crypt</a> if any of that sounds like your kind of place.</p>
'''},
  'fr': {
    'title': 'Bienvenue dans la Crypte',
    'summary': 'Mon serveur Discord est ouvert, et il a son propre robot sur mesure : Crypt Keeper.',
    'body': '''
<p><strong>La Crypte</strong>, c'est mon serveur Discord&nbsp;: un lieu de rencontre entre amis, un endroit pour trouver des gens avec qui jouer, et un coin d'entraide sur le homelab et l'informatique. Il a aussi une section complète en français.</p>
<h2>Crypt Keeper</h2>
<p>Au lieu d'empiler cinq robots publics, le serveur utilise un seul robot écrit sur mesure. Crypt Keeper monte toute la structure du serveur en une commande, accueille les nouveaux membres avec une bannière et garde un journal des messages pour l'équipe.</p>
<ul>
  <li>Des niveaux avec six rangs sur le thème de la crypte, d'Âme perdue à Légende de la Crypte.</li>
  <li>Des salons vocaux temporaires, des soirées de jeu et un tableau pour trouver des coéquipiers.</li>
  <li>Les anniversaires avec leurs propres cartes, une question du jour et un résumé de la semaine.</li>
  <li>Des alertes de jeux gratuits, des quiz et un tableau des meilleurs messages.</li>
  <li>Une première réponse de l'IA dans l'entraide informatique, avec une limite quotidienne pour garder les coûts raisonnables.</li>
</ul>
<p>L'icône du serveur suit même le calendrier&nbsp;: Halloween en octobre, Noël en décembre, et quelques jours spéciaux entre les deux. Ce site fait maintenant la même chose.</p>
<p><a href="https://discord.gg/DRSZb9qqqh">Rejoins la Crypte</a> si ça ressemble à ton genre d'endroit.</p>
'''},
 },
 {
  'slug': 'moved-to-github',
  'project': 'website',
  'date': '2026-10-07',
  'tags': ['website', 'github', 'français'],
  'en': {
    'title': 'The site moved to GitHub, and learned French',
    'summary': 'Every change now goes live on its own, the whole site is bilingual, and there are a few secrets to find.',
    'body': '''
<p>Until now, updating this site meant zipping a folder and dragging it into Cloudflare. Not anymore. The site lives on <a href="https://github.com/TehZombiJesus/tehzombijesus.ca">GitHub</a>, and every change pushed there is live about a minute later. Every version is kept, so any mistake is one click from undone.</p>
<h2>En français aussi</h2>
<p>A good part of my friends are French Canadian, so the whole site now exists in standard French. The FR button in the menu switches to the same page in the other language.</p>
<h2>Things to find</h2>
<ul>
  <li>Press the <kbd>`</kbd> key for a terminal. Try <code>neofetch</code>.</li>
  <li>Type the word <em>crypt</em> anywhere on the site.</li>
  <li>There are achievements, tracked by the trophy in the footer.</li>
  <li>The homelab page has a live map of how everything connects.</li>
</ul>
'''},
  'fr': {
    'title': 'Le site a déménagé sur GitHub, et il parle français',
    'summary': 'Chaque changement est maintenant mis en ligne tout seul, le site entier est bilingue, et il y a quelques secrets à trouver.',
    'body': '''
<p>Jusqu'à maintenant, mettre ce site à jour voulait dire compresser un dossier et le glisser dans Cloudflare. C'est fini. Le site vit sur <a href="https://github.com/TehZombiJesus/tehzombijesus.ca">GitHub</a>, et chaque changement envoyé là-bas est en ligne environ une minute plus tard. Chaque version est gardée, alors n'importe quelle erreur s'annule en un clic.</p>
<h2>In English too</h2>
<p>Une bonne partie de mes amis sont Canadiens français, alors le site au complet existe maintenant en français standard. Le bouton EN du menu passe à la même page dans l'autre langue.</p>
<h2>Des choses à trouver</h2>
<ul>
  <li>Appuie sur la touche <kbd>`</kbd> pour ouvrir un terminal. Essaie <code>neofetch</code>.</li>
  <li>Tape le mot <em>crypt</em> n'importe où sur le site.</li>
  <li>Il y a des succès, suivis par le trophée en bas de page.</li>
  <li>La page Homelab a une carte animée de comment tout se connecte.</li>
</ul>
'''},
 },

 {
  'slug': 'crypt-keeper-devlog',
  'date': '2026-10-09',
  'project': 'discord',
  'tags': ['discord', 'bot', 'crypt keeper'],
  'en': {
    'title': 'Crypt Keeper posts the devlog, and gets /update-server',
    'summary': 'Every new devlog post now shows up in the Crypt by itself, in English and French, in a new #devlog channel.',
    'body': """
<p>Crypt Keeper, the Crypt's own bot, learned a new trick. It checks this site's devlog every 30 minutes, and each new post lands in <strong>#devlog</strong> on the Discord server, with its title, a one-line summary in English and French, and links to both versions.</p>
<p>The channel is read-only, so the updates stay easy to follow. Talk about them in the usual channels.</p>
<h2>/update-server</h2>
<p>New features that need something on the server now arrive as small updates. <code>/update-server</code> lists only what's new, explains each change and waits for an Apply click. Each update runs once and touches only its own new thing, so anything changed by hand in Discord stays exactly as it is. No more running the full <code>/build-server</code> again.</p>
<p>The devlog now covers everything: this website, the Discord server and Crypt Keeper, the Minecraft server, the homelab and the setup. So #devlog is the one place to see what changed.</p>
"""},
  'fr': {
    'title': 'Crypt Keeper publie le journal et reçoit /update-server',
    'summary': 'Chaque nouvel article du journal arrive maintenant tout seul dans la Crypte, en anglais et en français, dans un nouveau salon #devlog.',
    'body': """
<p>Crypt Keeper, le bot de la Crypte, a appris un nouveau tour. Il vérifie le journal de ce site toutes les 30&nbsp;minutes, et chaque nouvel article arrive dans <strong>#devlog</strong> sur le serveur Discord, avec son titre, un résumé d'une ligne en anglais et en français, et des liens vers les deux versions.</p>
<p>Le salon est en lecture seule, pour que les mises à jour restent faciles à suivre. On en jase dans les salons habituels.</p>
<h2>/update-server</h2>
<p>Les nouvelles fonctions qui ont besoin de quelque chose sur le serveur arrivent maintenant sous forme de petites mises à jour. <code>/update-server</code> affiche seulement ce qui est nouveau, explique chaque changement et attend un clic sur Appliquer. Chaque mise à jour ne s'applique qu'une fois et ne touche qu'à sa propre nouveauté, alors tout ce qui a été modifié à la main dans Discord reste exactement pareil. Fini de relancer tout le <code>/build-server</code>.</p>
<p>Le journal couvre maintenant tout&nbsp;: ce site web, le serveur Discord et Crypt Keeper, le serveur Minecraft, le homelab et le poste de jeu. Le salon #devlog est donc l'endroit unique pour voir ce qui a changé.</p>
"""},
 },

 {
  'slug': 'stavo-and-one-devlog',
  'date': '2026-10-09',
  'project': 'website',
  'tags': ['website', 'homelab', 'stavo'],
  'en': {
    'title': 'Stavo on the homelab page, and one devlog for everything',
    'summary': "The homelab page now shows Stavo, my friend Ronniie's self-hosted platform, and this devlog now covers every project, with a filter.",
    'body': """
<h2>Stavo, by a friend</h2>
<p>The homelab page has a new section about <a href="https://stavo.nulldaily.com">Stavo</a>, the self-hosted platform my good friend Ronniie builds at <a href="https://nulldaily.com">NullDaily</a>. It runs on your own hardware: files, photos, notes, game servers, hosting and billing, status pages, passwords, mail and more. A lot of my lab might end up running on it, so each app I'm watching has a card that links to it.</p>
<h2>One devlog for everything</h2>
<p>This devlog now covers every project, not just the website: the Discord server and Crypt Keeper, the Minecraft server, the homelab and the setup. Each post says which project it's about, and the buttons above the list show only one project at a time. New posts also land in #devlog on the Discord server by themselves.</p>
<h2>Cleaned up</h2>
<p>The drawing of the next server is gone from the homelab page. The build plan and the reasons behind it are still there.</p>
"""},
  'fr': {
    'title': 'Stavo sur la page du homelab, et un seul journal pour tout',
    'summary': "La page du homelab présente maintenant Stavo, la plateforme auto-hébergée de mon ami Ronniie, et ce journal couvre maintenant chaque projet, avec un filtre.",
    'body': """
<h2>Stavo, par un ami</h2>
<p>La page du homelab a une nouvelle section sur <a href="https://stavo.nulldaily.com">Stavo</a>, la plateforme auto-hébergée que mon bon ami Ronniie bâtit chez <a href="https://nulldaily.com">NullDaily</a>. Elle roule sur ton propre matériel&nbsp;: fichiers, photos, notes, serveurs de jeu, hébergement et facturation, pages de statut, mots de passe, courriel et plus encore. Une bonne partie de mon lab pourrait finir par rouler dessus, alors chaque application que je surveille a sa carte avec un lien.</p>
<h2>Un seul journal pour tout</h2>
<p>Ce journal couvre maintenant chaque projet, pas juste le site web&nbsp;: le serveur Discord et Crypt Keeper, le serveur Minecraft, le homelab et le poste de jeu. Chaque article indique de quel projet il parle, et les boutons au-dessus de la liste n'affichent qu'un projet à la fois. Les nouveaux articles arrivent aussi tout seuls dans #devlog sur le serveur Discord.</p>
<h2>Ménage</h2>
<p>Le dessin du prochain serveur n'est plus sur la page du homelab. Le plan de montage et les raisons derrière chaque choix sont toujours là.</p>
"""},
 },

 {
  'slug': 'times-in-your-time-zone',
  'date': '2026-10-09',
  'project': 'discord',
  'tags': ['discord', 'bot', 'crypt keeper'],
  'en': {
    'title': 'Every time in your own time zone',
    'summary': "Dates and times posted in the Crypt now show in each person's own time zone, and /timestamp makes them for anyone.",
    'body': """
<p>Half the Crypt is in Quebec and the rest is all over the place, so "9 PM" never meant the same thing for everyone. Not anymore.</p>
<ul>
  <li><strong>Everything Crypt Keeper posts with a date</strong> (game nights, big sales, free games, deals) now uses Discord timestamps: Discord shows the time in your own time zone, and can count down to it.</li>
  <li><strong><code>/timestamp</code></strong> turns something like <code>fri 9pm</code> or <code>2026-10-31 19:00</code> into a code you can paste into any message. Everyone reading it sees their own local time.</li>
</ul>
<p>Announcements from me will use them too, so you never have to convert from Eastern time again.</p>
"""},
  'fr': {
    'title': 'Chaque heure dans ton propre fuseau horaire',
    'summary': "Les dates et heures publiées dans la Crypte s'affichent maintenant dans le fuseau horaire de chacun, et /timestamp permet à tout le monde d'en créer.",
    'body': """
<p>La moitié de la Crypte est au Québec et le reste un peu partout, alors «&nbsp;21&nbsp;h&nbsp;» ne voulait jamais dire la même chose pour tout le monde. C'est réglé.</p>
<ul>
  <li><strong>Tout ce que Crypt Keeper publie avec une date</strong> (soirées de jeu, grosses soldes, jeux gratuits, aubaines) utilise maintenant les horodatages de Discord&nbsp;: Discord affiche l'heure dans ton propre fuseau horaire et peut même faire le décompte.</li>
  <li><strong><code>/timestamp</code></strong> transforme quelque chose comme <code>fri 9pm</code> ou <code>2026-10-31 19:00</code> en un code à coller dans n'importe quel message. Chaque personne voit sa propre heure locale.</li>
</ul>
<p>Mes annonces vont les utiliser aussi, alors plus besoin de convertir à partir de l'heure de l'Est.</p>
"""},
 },
]
