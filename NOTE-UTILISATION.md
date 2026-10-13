# Note pratique — calendrier de l’Avent

Cette note explique comment préparer le calendrier, le tester, l’utiliser dans OBS et synchroniser les ouvertures pour les viewers. Le projet est un calendrier web statique de 24 cases. Le contenu est défini dans `content.js`; l’état des jours de stream est synchronisé avec Firebase Firestore.

## En bref : ce que tu dois faire

1. Remplir les 24 cases dans `content.js` avec les surprises que tu veux proposer.
2. Indiquer les jours où tu streams avec `isStreamDay: true`.
3. Tester l’affichage dans un navigateur, idéalement avec `?day=X&streamer=1`.
4. Ajouter le calendrier comme source Navigateur dans OBS, avec `?streamer=1`.
5. Le jour d’un stream, cliquer sur la case correspondante pendant le direct.
6. La case est enregistrée dans Firestore et le site public se met à jour automatiquement, sans modifier `content.js` ni faire de `git push`.

## Comment fonctionne le calendrier

- Il y a 24 cases, une pour chaque jour du 1er au 24 décembre.
- En décembre, les cases jusqu’au jour courant sont accessibles. Les jours à venir restent verrouillés.
- Une case accessible affiche un cadeau 🎁. Cliquer dessus affiche une animation, puis le contenu de la surprise.
- Une case future affiche un cadenas 🔒.
- Une case de stream porte une étoile ✨ et un contour pointillé doré.
- Sur le site public, un jour de stream déjà arrivé mais pas encore publié comme révélé affiche un sablier ⏳ et reste inaccessible.
- Dans OBS, le paramètre `?streamer=1` affiche les jours de stream et reçoit leur état en direct depuis Firestore.
- Pour révéler une case, utilise la page d’administration avec `?streamer=1&admin=1`, connectée avec ton compte Google Firebase.
- Le clic admin enregistre `revealed: true` et `streamerOpened: true`. Cette dernière valeur fait afficher le cadeau ouvert et jouer l’animation dans OBS, mais l’icône « ouvert » est réservée à l’overlay et n’est pas affichée chez les viewers.
- Chaque viewer voit le cadeau ouvert uniquement après son propre clic. Cet état est gardé localement dans son navigateur; il n’est ni partagé avec les autres visiteurs ni synchronisé entre ses appareils.
- Le site public reçoit les mises à jour de disponibilité directement de Firestore; aucun clic dans le code ni publication Git n’est nécessaire pour révéler une case.

L’état est recalculé au chargement de la page. Si une modification n’apparaît pas, actualise la page ou recharge la source Navigateur d’OBS.

## Préparer les 24 surprises

Modifie uniquement `content.js` pour changer les cases. Chaque objet correspond à un jour. Garde les numéros `day` de 1 à 24 et l’ordre existant; change les textes et options de contenu selon tes besoins.

| Champ | À quoi il sert |
| --- | --- |
| `day` | Numéro de la case, de 1 à 24. Ne pas le changer. |
| `isStreamDay` | `true` si tu prévois un stream ce jour-là; sinon `false`. |
| `title` | Titre affiché dans la fenêtre de la case. |
| `type` | Type de surprise : `"text"`, `"image"`, `"video"` ou `"link"`. |
| `text` | Message affiché sous le titre; utilisable avec tous les types. |
| `mediaUrl` | Chemin ou URL d’une image/vidéo. |
| `linkUrl` | Adresse web de la surprise, pour le type `"link"`. |
| `linkLabel` | Texte du bouton qui ouvre le lien. |

### Types de surprise

- **Texte** : renseigne `type: "text"` et `text`.
- **Image** : renseigne `type: "image"` et `mediaUrl`, avec `text` facultatif.
- **Vidéo** : renseigne `type: "video"` et `mediaUrl`, avec `text` facultatif. La vidéo s’affiche avec ses contrôles et démarre automatiquement.
- **Lien** : renseigne `type: "link"`, `linkUrl` et éventuellement `linkLabel`, avec `text` facultatif. Le lien s’ouvre dans un nouvel onglet.

Pour des images ou vidéos locales, crée un dossier `media` à côté de `index.html`, place les fichiers dedans, puis utilise par exemple `media/jour5.png` ou `media/jour12.mp4`. Vérifie que le nom et l’extension correspondent exactement au fichier.

Le fichier contient des textes de démonstration (« À compléter »). Remplace-les avant publication par les surprises prévues; les exemples de contenus média en commentaire sont des modèles à copier dans la liste, pas des cases supplémentaires.

### Jours de stream déjà configurés

Le contenu fourni marque actuellement les jours **3, 6, 10, 13, 17, 20 et 24** comme jours de stream. Ces choix ne sont que des exemples : adapte `isStreamDay` à ton vrai programme. Les cases ordinaires n’ont pas besoin de `revealed`.

## Tester avant décembre

Ouvre `index.html` dans un navigateur. Ajoute un paramètre `day` pour simuler la date et débloquer les cases jusqu’à ce jour inclus :

- `?day=12` simule le jour 12.
- `?day=12&streamer=1` simule le jour 12 en mode streamer et permet aussi de tester les jours de stream non encore révélés.

Exemple de forme d’adresse locale :

```text
file:///.../index.html?day=12&streamer=1
```

La valeur simulée est limitée entre 0 et 24. Sans `streamer=1`, les jours de stream restent en attente tant qu’ils n’ont pas été révélés dans Firestore. Pour tester le comportement du site public, ouvre plutôt avec `?day=12` seul.

## Utiliser le calendrier dans OBS

1. Dans OBS, ajoute une source **Navigateur**.
2. Indique l’adresse HTTPS du calendrier publié sur GitHub Pages, avec `?streamer=1` à la fin. Firebase Auth requiert le site publié en HTTPS; n’utilise pas le chemin local `file://` pour l’utilisation en direct.
3. Choisis une largeur et une hauteur suffisantes; la documentation existante suggère **900 × 600** comme point de départ. Ajuste selon ton overlay.
4. Le fond de la page est transparent pour s’intégrer à la scène.
5. Dans un navigateur normal, ouvre aussi la page publiée avec `?streamer=1&admin=1` et connecte-toi avec Google.
6. Clique sur la case voulue depuis cette page d’administration. OBS et le site public reçoivent l’ouverture en temps réel; l’overlay OBS joue l’animation.

Le paramètre `?streamer=1` ne débloque pas les jours futurs : il contourne uniquement l’attente de révélation pour les jours de stream. Pour faire un essai avant la date prévue, combine-le avec `?day=X`; ce mode de test n’écrit pas dans Firestore.

## Tester la synchronisation avant décembre

Ce test utilise temporairement le jour de stream 3, sans changer son contenu. Garde la session admin connectée, utilise les adresses de test ci-dessous et supprime le document temporaire à la fin.

1. Dans OBS, configure provisoirement la source Navigateur avec `https://nervous974.github.io/Calendrier-avent/?day=12&streamer=1`.
2. Ouvre la page de test viewer `https://nervous974.github.io/Calendrier-avent/?day=12` dans une autre fenêtre ou demande à un ami de l’ouvrir. Le viewer ne doit pas se connecter.
3. Dans Firebase Console → Firestore Database → **Data / Données**, ouvre la collection `reveals`. Si elle n’existe pas, crée-la avec un premier document.
4. Crée un document dont l’identifiant est `3`, avec les champs `revealed` et `streamerOpened`, tous deux de type booléen et de valeur `true`.
5. Vérifie que la case 3 devient un cadeau cliquable chez le viewer et que l’animation d’ouverture se déclenche dans OBS. OBS doit afficher le cadeau ouvert; le viewer garde son cadeau fermé jusqu’à son propre clic. Les pages OBS et viewer doivent être rechargées après le déploiement de la version permettant ce test.
6. Supprime le document `3` de `reveals` après le test. Le viewer verra alors la case repasser en attente. Remets ensuite l’URL OBS normale, sans `day=12`.

La console Firebase effectue cette création manuelle avec les droits de propriétaire du projet. L’application publique, elle, n’autorise que ton utilisateur authentifié à écrire les révélations via ses règles Firestore. N’utilise pas ce test pour publier une vraie révélation.

## Préparer l’accès Firebase (une seule fois)

La base Firestore doit être créée en édition Standard, région Paris (`europe-west9`) si choisie, sans sauvegardes planifiées. L’authentification Google doit être activée dans Firebase Authentication.

1. Dans Firebase Authentication → **Settings / Paramètres** → **Authorized domains / Domaines autorisés**, ajoute le domaine GitHub Pages (par exemple `nervous974.github.io`).
2. Publie le calendrier sur GitHub Pages, puis ouvre `?streamer=1&admin=1` dans un navigateur normal. La connexion fonctionne uniquement en HTTPS sur un domaine autorisé.
3. Clique **Connexion avec Google** et connecte-toi avec le compte Google que tu veux autoriser.
4. Dans Firebase Authentication → **Users / Utilisateurs**, récupère l’UID de ce compte.
5. Dans le fichier `firestore.rules` du projet, remplace `REPLACE_WITH_ADMIN_UID` par cet UID.
6. Dans Firebase Firestore Database → **Rules / Règles**, colle le contenu mis à jour de `firestore.rules` et clique **Publier**. Tant que les règles de production ne sont pas publiées, l’erreur « Missing or insufficient permissions » est normale.
7. Recharge la page d’administration. Elle doit indiquer que la synchronisation Firebase est active.

Les règles fournies laissent la lecture des états publique, mais limitent les écritures à ton UID et aux jours de stream `3, 6, 10, 13, 17, 20, 24`. Les écritures autorisées contiennent `revealed: true` et peuvent aussi contenir `streamerOpened: true`. Si tu changes les jours de stream dans `content.js`, adapte aussi la liste autorisée dans `firestore.rules`. Garde le mode production et ne publie jamais de mot de passe ou de clé privée. La configuration web de `firebase-config.js` est publique par conception; les règles Firestore font le contrôle d’accès.

## Révéler une case pendant le live

Ouvre la page de contrôle dans un navigateur de bureau avec `?streamer=1&admin=1`, connecte-toi avec Google si nécessaire et clique la case du jour. Une fois l’écriture acceptée par Firestore, l’overlay OBS (`?streamer=1`) joue l’animation et les viewers peuvent ouvrir la case sur le site public. Si une erreur de permission apparaît, vérifie que l’UID dans `firestore.rules` est le bon et que les règles ont été publiées.

## Adresse à partager aux viewers

Partage l’adresse du calendrier publié en ligne (par exemple sur ta bio Twitch ou Discord), **sans** les paramètres `streamer` et `admin`. Les jours ordinaires s’ouvrent selon la date locale du navigateur du viewer. Les jours de stream restent en attente jusqu’à leur révélation depuis la page d’administration; Firestore met à jour tous les visiteurs en temps réel.

Le dépôt indique que le site est publié avec GitHub Pages. L’adresse exacte dépend de la configuration de publication du dépôt; utilise l’URL GitHub Pages configurée pour ce projet.

## Points d’attention

- La date est calculée dans le navigateur qui affiche le calendrier. Pour OBS, vérifie l’horloge et le fuseau horaire de l’ordinateur qui exécute OBS. Pour le site public, c’est la date locale de chaque viewer qui est utilisée.
- Avant décembre, les cases sont verrouillées, sauf en simulation avec `?day=X`.
- **Limite actuelle après le 31 décembre :** le code ne distingue pas janvier de la période précédant décembre. Il reverrouille donc les cases en janvier, même si la documentation précédente indiquait qu’elles resteraient toutes ouvertes après décembre. Ne compte pas sur cette consultation rétrospective sans adaptation du code.
- Les paramètres peuvent être combinés. `?streamer=1` sert à l’utilisation en direct; `?day=X` sert à simuler une date.
- Ne modifie pas `script.js` pour changer les surprises : les textes, médias, liens et jours de stream sont configurés dans `content.js`.
