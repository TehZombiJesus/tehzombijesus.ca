# ============================== DEVLOG POSTS ==============================
# Newest first or any order: they are sorted by date. Each post needs:
#   slug   short name used in the address (devlog/<slug>.html), letters, numbers and dashes
#   date   YYYY-MM-DD
#   project  which project it's about: website, discord, minecraft, homelab or setup (see PROJECTS in build.py)
#            Every update gets a post, so the devlog doubles as the changelog for everything, not just this site.
#   tags   a few words
#   versions  the releases this post covers, for example ['Website v1.1.0', 'Crypt Keeper v1.2.0'] (see "Versions" in the README).
#             Shown on the post, in the RSS feed and in the Discord announcement. Every update gets a version and a post.
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

 {
  'slug': 'version-numbers',
  'date': '2026-10-09',
  'project': 'website',
  'versions': ['Website v1.0.0', 'Crypt Keeper v1.0.0'],
  'tags': ['website', 'bot', 'versions'],
  'en': {
    'title': 'Version 1.0.0 of everything',
    'summary': 'The website and Crypt Keeper now have real version numbers and builds, starting at v1.0.0, and every update from now on gets one.',
    'body': """
<p>Everything I build now has a version number, starting today at <strong>v1.0.0</strong> for both this website and Crypt Keeper. The Minecraft server will get the same treatment when it's ready.</p>
<h2>How to read a version</h2>
<p>Versions look like <code>v1.2.0 · build b66769c</code>:</p>
<ul>
  <li><strong>The last number</strong> goes up for fixes and small changes.</li>
  <li><strong>The middle number</strong> goes up for new features.</li>
  <li><strong>The first number</strong> goes up when something big changes and you'd want to know before updating.</li>
  <li><strong>The build</strong> is the exact change on GitHub it came from, so two copies of the same version can always be told apart.</li>
</ul>
<h2>Where you'll see it</h2>
<ul>
  <li>At the bottom of every page of this site, linking to the changelog and the exact build on GitHub.</li>
  <li>In Crypt Keeper's <code>/bot version</code>, its update button and its startup message.</li>
  <li>On each devlog post and its announcement in #devlog, which list the versions it covers.</li>
  <li>As releases with notes on GitHub, and in each project's changelog.</li>
</ul>
"""},
  'fr': {
    'title': 'La version 1.0.0 de tout',
    'summary': "Le site web et Crypt Keeper ont maintenant de vrais numéros de version et de build, à partir de la v1.0.0, et chaque mise à jour en aura un.",
    'body': """
<p>Tout ce que je bâtis a maintenant un numéro de version, à partir d'aujourd'hui avec la <strong>v1.0.0</strong> pour ce site web et pour Crypt Keeper. Le serveur Minecraft aura droit au même traitement quand il sera prêt.</p>
<h2>Comment lire une version</h2>
<p>Les versions ressemblent à <code>v1.2.0 · build b66769c</code>&nbsp;:</p>
<ul>
  <li><strong>Le dernier chiffre</strong> augmente pour les corrections et les petits changements.</li>
  <li><strong>Le chiffre du milieu</strong> augmente pour les nouvelles fonctions.</li>
  <li><strong>Le premier chiffre</strong> augmente quand quelque chose de gros change, assez pour vouloir le savoir avant de mettre à jour.</li>
  <li><strong>Le build</strong> est le changement exact sur GitHub d'où vient la version, alors deux copies de la même version peuvent toujours être distinguées.</li>
</ul>
<h2>Où la voir</h2>
<ul>
  <li>Au bas de chaque page de ce site, avec un lien vers le journal des changements et le build exact sur GitHub.</li>
  <li>Dans <code>/bot version</code> de Crypt Keeper, son bouton de mise à jour et son message de démarrage.</li>
  <li>Sur chaque article du journal et son annonce dans #devlog, qui indiquent les versions couvertes.</li>
  <li>Sous forme de versions publiées avec des notes sur GitHub, et dans le journal des changements de chaque projet.</li>
</ul>
"""},
 },

 {
  'slug': 'bilingual-crypt',
  'date': '2026-10-12',
  'project': 'discord',
  'versions': ['Crypt Keeper v1.1.0'],
  'tags': ['discord', 'bot', 'crypt keeper', 'français'],
  'en': {
    'title': 'A fully bilingual Crypt',
    'summary': "The Crypt now speaks English and French everywhere official, with a language question for new members and /announce for bilingual announcements.",
    'body': """
<p>The Crypt has had a French section since day one, but most of the server still spoke English first. With <strong>Crypt Keeper v1.1.0</strong>, the whole Crypt is bilingual.</p>
<h2>English first, French underneath</h2>
<p>Everything official now carries both languages, English on top and French on its own line under it: the rules, the links, the welcome message, birthday posts and announcements. The three official channels got bilingual names too: <strong>#rules-règles</strong>, <strong>#announcements-annonces</strong> and <strong>#links-liens</strong>, and the shared channels have a French line in their description.</p>
<h2>Pick your language</h2>
<p>Onboarding now starts with <strong>Language · Langue</strong>: English, Français or both. It gives the new <strong>Anglophone</strong> role, the <strong>Francophone</strong> role, or both. Members with both get their welcome and birthday messages in both languages.</p>
<h2>Chat in whichever you like</h2>
<p>The main channels are shared, so write in the language you're comfortable with. The ⚜️ Section francophone is still there for people who want a French-only corner.</p>
<h2>/announce</h2>
<p>Announcements from me now go through <code>/announce</code>: a form with English and French fields that posts one message with both, with an optional ping.</p>
<h2>Updating without a rebuild</h2>
<p>For the existing server this arrived as a <code>/update-server</code> step. It only renames and rewords channels that still had their original names and descriptions, edits Crypt Keeper's own rules and links posts in place, and leaves everything changed by hand exactly as it was.</p>
"""},
  'fr': {
    'title': 'Une Crypte entièrement bilingue',
    'summary': "La Crypte parle maintenant anglais et français partout où c'est officiel, avec une question de langue pour les nouveaux membres et /announce pour des annonces bilingues.",
    'body': """
<p>La Crypte a une section francophone depuis le premier jour, mais la plus grande partie du serveur parlait encore anglais d'abord. Avec <strong>Crypt Keeper v1.1.0</strong>, toute la Crypte est bilingue.</p>
<h2>L'anglais d'abord, le français dessous</h2>
<p>Tout ce qui est officiel contient maintenant les deux langues, l'anglais en haut et le français sur sa propre ligne en dessous&nbsp;: les règles, les liens, le message de bienvenue, les anniversaires et les annonces. Les trois salons officiels ont aussi reçu des noms bilingues&nbsp;: <strong>#rules-règles</strong>, <strong>#announcements-annonces</strong> et <strong>#links-liens</strong>, et les salons communs ont une ligne en français dans leur description.</p>
<h2>Choisis ta langue</h2>
<p>L'accueil du serveur commence maintenant par <strong>Language · Langue</strong>&nbsp;: English, Français ou les deux. Ça donne le nouveau rôle <strong>Anglophone</strong>, le rôle <strong>Francophone</strong>, ou les deux. Les membres qui choisissent les deux reçoivent leurs messages de bienvenue et d'anniversaire dans les deux langues.</p>
<h2>Jase dans la langue que tu veux</h2>
<p>Les salons principaux sont communs, alors écris dans la langue qui te convient. La ⚜️ Section francophone est toujours là pour ceux qui veulent un coin uniquement en français.</p>
<h2>/announce</h2>
<p>Mes annonces passent maintenant par <code>/announce</code>&nbsp;: un formulaire avec des champs en anglais et en français qui publie un seul message avec les deux, avec une mention facultative.</p>
<h2>Une mise à jour sans tout reconstruire</h2>
<p>Pour le serveur existant, ça est arrivé sous forme d'une étape de <code>/update-server</code>. Elle renomme et reformule seulement les salons qui avaient encore leur nom et leur description d'origine, modifie sur place les publications des règles et des liens de Crypt Keeper, et laisse tout ce qui a été changé à la main exactement comme c'était.</p>
"""},
 },

 {
  'slug': 'crypt-smp-in-the-crypt',
  'date': '2026-10-12',
  'project': 'minecraft',
  'versions': ['Crypt Keeper v1.1.0'],
  'tags': ['minecraft', 'discord', 'tickets'],
  'en': {
    'title': 'The Crypt SMP gets a home in the Crypt',
    'summary': "The Minecraft server now has its own section in the same Discord, with news, how to join, chat, and support tickets for in-game problems.",
    'body': """
<p>The Crypt SMP is my own Minecraft server, and I didn't want a second Discord just for it. So it now lives inside the Crypt, in its own <strong>⛏️ The Crypt SMP</strong> section. Crypt Keeper v1.1.0 builds and runs it.</p>
<h2>Who sees what</h2>
<ul>
  <li><strong>News and how to join</strong> are open to everyone, read-only, so anybody can see what the server is about and how to connect.</li>
  <li><strong>Chat, suggestions, screenshots and a voice channel</strong> are for members with the new <strong>Crypt SMP</strong> role. Pick it in onboarding or under Channels &amp; Roles.</li>
</ul>
<p>Everything in the section is bilingual, English first and French underneath, like the rest of the Crypt.</p>
<h2>Support tickets, for Minecraft only</h2>
<p>The support channel has four buttons: help, bug report, report a player and ban appeal. Press one, fill in your Minecraft name and what happened, and Crypt Keeper opens a <strong>private ticket</strong> that only you and the moderators can see. Press Close when it's sorted. You can have one open ticket at a time.</p>
<p>Tickets exist only for the Minecraft server. Anything else in the Crypt still goes to a moderator by direct message, and the older posts that mentioned tickets were cleaned up.</p>
<h2>The server address</h2>
<p>The how-to-join post shows the Java and Bedrock addresses and the version, and I update it with a single command whenever something changes.</p>
<p><a href="https://discord.gg/DRSZb9qqqh">Join the Crypt</a> to see it.</p>
"""},
  'fr': {
    'title': 'Le Crypt SMP a maintenant sa place dans la Crypte',
    'summary': "Le serveur Minecraft a maintenant sa propre section dans le même Discord, avec des nouvelles, comment le rejoindre, du clavardage et des tickets de soutien pour les problèmes en jeu.",
    'body': """
<p>Le Crypt SMP est mon propre serveur Minecraft, et je ne voulais pas un deuxième Discord juste pour lui. Il vit donc maintenant dans la Crypte, dans sa propre section <strong>⛏️ The Crypt SMP</strong>. Crypt Keeper v1.1.0 la construit et la fait fonctionner.</p>
<h2>Qui voit quoi</h2>
<ul>
  <li><strong>Les nouvelles et comment rejoindre</strong> sont ouvertes à tout le monde, en lecture seule, pour que chacun puisse voir de quoi il s'agit et comment se connecter.</li>
  <li><strong>Le clavardage, les suggestions, les captures d'écran et un salon vocal</strong> sont réservés aux membres qui ont le nouveau rôle <strong>Crypt SMP</strong>. Choisis-le dans l'accueil du serveur ou sous Salons et rôles.</li>
</ul>
<p>Tout dans la section est bilingue, l'anglais d'abord et le français dessous, comme le reste de la Crypte.</p>
<h2>Des tickets de soutien, seulement pour Minecraft</h2>
<p>Le salon d'aide a quatre boutons&nbsp;: aide, rapport de bogue, signaler un joueur et appel de bannissement. Appuie sur l'un d'eux, indique ton pseudo Minecraft et ce qui s'est passé, et Crypt Keeper ouvre un <strong>ticket privé</strong> que seuls toi et les modérateurs peuvent voir. Appuie sur Fermer quand c'est réglé. Tu peux avoir un seul ticket ouvert à la fois.</p>
<p>Les tickets existent seulement pour le serveur Minecraft. Pour tout le reste de la Crypte, on écrit toujours à un modérateur en message direct, et les anciennes publications qui parlaient de tickets ont été nettoyées.</p>
<h2>L'adresse du serveur</h2>
<p>La publication «&nbsp;Comment rejoindre&nbsp;» affiche les adresses Java et Bedrock ainsi que la version, et je la mets à jour avec une seule commande dès que quelque chose change.</p>
<p><a href="https://discord.gg/DRSZb9qqqh">Rejoins la Crypte</a> pour la voir.</p>
"""},
 },

 {
  'slug': 'steam-deals-open-in-steam',
  'date': '2026-10-12',
  'project': 'discord',
  'versions': ['Crypt Keeper v1.4.1', 'Crypt Keeper v1.4.2'],
  'tags': ['discord', 'bot', 'deals', 'steam'],
  'en': {
    'title': 'Game deals: Steam only, with an Open in Steam button',
    'summary': "Crypt Keeper's game deals now post only Steam games, and every post has a button that opens the game's Steam page.",
    'body': """
<p>Crypt Keeper posts the best PC game deals in the Crypt. Two small changes in <strong>v1.4.1</strong> and <strong>v1.4.2</strong> make those posts easier to use.</p>
<h2>An Open in Steam button</h2>
<p>Every deal post now has an <strong>Open in Steam</strong> button under it. One tap and you're on the game's store page, ready to buy. The same button is on the DM you get when a game on your <code>/wishlist</code> drops to your price.</p>
<h2>Steam only, for now</h2>
<p>Deals used to come from several stores, and not every one could link straight to the game. For now Crypt Keeper only posts <strong>Steam</strong> deals, and only for games that have a Steam ID, so every post opens the real Steam page. Epic, GOG, Humble and the other stores are paused. I can switch them back on later with a single setting.</p>
<h2>What did not change</h2>
<ul>
  <li>The filters are the same: a minimum discount, a maximum price and a minimum Steam rating, set by staff with <code>/deals filters</code>.</li>
  <li><code>/deal</code>, <code>/wishlist</code>, the deal ping roles and the big sales calendar all work as before.</li>
</ul>
<p>Want a ping for deals? Press the 🔔 button under any deal, or use <code>/deal-pings</code>. <a href="https://discord.gg/DRSZb9qqqh">Join the Crypt</a> to see it.</p>
"""},
  'fr': {
    'title': 'Aubaines de jeux : Steam seulement, avec un bouton Open in Steam',
    'summary': "Les aubaines de jeux de Crypt Keeper ne viennent plus que de Steam, et chaque publication a un bouton qui ouvre la page Steam du jeu.",
    'body': """
<p>Crypt Keeper publie les meilleures aubaines de jeux PC dans la Crypte. Deux petits changements, dans les versions <strong>v1.4.1</strong> et <strong>v1.4.2</strong>, rendent ces publications plus pratiques.</p>
<h2>Un bouton « Open in Steam »</h2>
<p>Chaque aubaine a maintenant un bouton <strong>Open in Steam</strong> en dessous. Un clic et tu es sur la page du jeu dans la boutique, prêt à l'acheter. Le même bouton est dans le message privé que tu reçois quand un jeu de ta liste <code>/wishlist</code> atteint ton prix.</p>
<h2>Steam seulement, pour l'instant</h2>
<p>Les aubaines venaient de plusieurs boutiques, et toutes ne pouvaient pas mener directement au jeu. Pour l'instant, Crypt Keeper publie seulement les aubaines de <strong>Steam</strong>, et seulement pour les jeux qui ont un identifiant Steam, de sorte que chaque publication ouvre la vraie page Steam. Epic, GOG, Humble et les autres boutiques sont en pause. Je pourrai les remettre plus tard avec un seul réglage.</p>
<h2>Ce qui n'a pas changé</h2>
<ul>
  <li>Les filtres sont les mêmes&nbsp;: un rabais minimum, un prix maximum et une cote Steam minimale, réglés par l'équipe avec <code>/deals filters</code>.</li>
  <li><code>/deal</code>, <code>/wishlist</code>, les rôles de notification des aubaines et le calendrier des grandes soldes fonctionnent comme avant.</li>
</ul>
<p>Tu veux une notification pour les aubaines&nbsp;? Appuie sur le bouton 🔔 sous une aubaine, ou utilise <code>/deal-pings</code>. <a href="https://discord.gg/DRSZb9qqqh">Rejoins la Crypte</a> pour la voir.</p>
"""},
 },
]
