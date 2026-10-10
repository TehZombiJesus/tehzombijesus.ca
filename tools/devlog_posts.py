# ============================== DEVLOG POSTS ==============================
# Newest first or any order: they are sorted by date. Each post needs:
#   slug   short name used in the address (devlog/<slug>.html), letters, numbers and dashes
#   date   YYYY-MM-DD
#   project  which project it's about: website, discord, minecraft, homelab or setup (see PROJECTS in build.py)
#            Every update gets a post, so the devlog doubles as the changelog for everything, not just this site.
#   tags   a few words
#   en/fr  title, summary (one sentence for the list, the RSS feed and Discord) and body (HTML)
# Then run:  python3 tools/build.py
# When a new post reaches the live site (main branch), GitHub posts it to Discord on its own
# (.github/workflows/discord.yml, see the README).
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
  'slug': 'a-new-look',
  'date': '2026-10-09',
  'project': 'website',
  'tags': ['website', 'design', 'homelab'],
  'en': {
    'title': 'A new look, drawn from scratch',
    'summary': 'The whole site goes dark and neon, with art made for it, a reworked portrait, Stavo on the homelab page, and a devlog that now covers everything.',
    'body': """
<p>The site has a new look. It started with a few mockups I asked another AI to imagine, and ended up as something built and drawn properly for this site.</p>
<h2>What changed</h2>
<ul>
  <li><strong>Darker and glowier, but calm.</strong> Glass cards with violet edges, a faint grid behind everything, and glow saved for the big moments. The slanted stripes from the brand kit are back as a signature under every title.</li>
  <li><strong>A reworked portrait.</strong> The home page opens with my portrait, cut out and relit in violet and magenta, floating in front of a neon ring.</li>
  <li><strong>Art made for the site.</strong> The rack room, the battlestation (the real layout: a 57" with three 22" screens above it), the Crypt window and the terminal banner are all drawn in code, in the brand colours. No stock images, nothing borrowed.</li>
  <li><strong>A tighter home page.</strong> Three picture cards for the homelab, the setup and Ruenix, quick stats, and a "latest activity" list that fills itself from this devlog.</li>
  <li><strong>The next server, redrawn.</strong> Solid shapes instead of blueprint lines. Planned parts stay dim and light up as they're bought.</li>
  <li><strong>Stavo, by a friend.</strong> The homelab page now has the apps from Stavo, the self-hosted platform my good friend Ronniie builds at NullDaily. A lot of my lab might end up running on it.</li>
</ul>
<h2>One devlog for everything</h2>
<p>From now on, every update gets a post here: the website, the Discord server and its bot, the Minecraft server, the homelab and the setup. The devlog list can be filtered by project, and each new post is also announced in the Discord server.</p>
"""},
  'fr': {
    'title': 'Un nouveau look, dessiné de A à Z',
    'summary': "Tout le site passe au sombre et au néon, avec des illustrations faites pour lui, un portrait retravaillé, Stavo sur la page du homelab et un journal qui couvre maintenant tout.",
    'body': """
<p>Le site a un nouveau look. Tout est parti de quelques maquettes que j'ai demandé à une autre IA d'imaginer, et c'est devenu quelque chose de bâti et dessiné comme il faut pour ce site.</p>
<h2>Ce qui a changé</h2>
<ul>
  <li><strong>Plus sombre, plus lumineux, mais calme.</strong> Des cartes vitrées aux bordures violettes, une fine grille derrière tout et des effets lumineux gardés pour les grands moments. Les bandes obliques de la trousse de marque sont de retour sous chaque titre.</li>
  <li><strong>Un portrait retravaillé.</strong> La page d'accueil s'ouvre sur mon portrait, détouré et rééclairé en violet et magenta, qui flotte devant un anneau néon.</li>
  <li><strong>Des illustrations faites pour le site.</strong> La salle des serveurs, le poste de jeu (la vraie disposition&nbsp;: un 57&nbsp;po avec trois écrans de 22&nbsp;po au-dessus), la fenêtre de la Crypte et la bannière du terminal sont toutes dessinées en code, aux couleurs de la marque. Aucune image de banque, rien d'emprunté.</li>
  <li><strong>Une page d'accueil plus serrée.</strong> Trois cartes illustrées pour le homelab, le poste de jeu et Ruenix, des statistiques en bref et une liste «&nbsp;activité récente&nbsp;» qui se remplit toute seule à partir de ce journal.</li>
  <li><strong>Le prochain serveur, redessiné.</strong> Des formes pleines au lieu de lignes de plan. Les pièces prévues restent sombres et s'allument à mesure qu'elles sont achetées.</li>
  <li><strong>Stavo, par un ami.</strong> La page du homelab présente maintenant les applications de Stavo, la plateforme auto-hébergée que mon bon ami Ronniie bâtit chez NullDaily. Une bonne partie de mon lab pourrait finir par rouler dessus.</li>
</ul>
<h2>Un seul journal pour tout</h2>
<p>À partir de maintenant, chaque mise à jour a son billet ici&nbsp;: le site web, le serveur Discord et son bot, le serveur Minecraft, le homelab et le poste de jeu. La liste du journal se filtre par projet, et chaque nouveau billet est aussi annoncé sur le serveur Discord.</p>
"""},
 },
]
