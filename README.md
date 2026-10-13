# Calendrier de l'Avent — Overlay OBS

Un calendrier de l'avent (24 cases) à afficher en Browser Source dans OBS.
Les cases se débloquent automatiquement selon la date réelle en décembre.

Pour le guide détaillé de préparation, de test, d’utilisation dans OBS et de publication des cases, consulte [NOTE-UTILISATION.md](NOTE-UTILISATION.md).

## Aperçu rapide

- **Aucune case n'est cliquable avant son jour** (verrou 🔒), elle devient cliquable (🎁) le jour même et reste ouverte ensuite.
- Les jours marqués `isStreamDay: true` dans `content.js` affichent une étoile ✨ et un contour pointillé doré : utilise-les pour les jours où tu streames, avec un contenu plus important.
- Pour ces jours de stream, la case reste en attente (⏳) sur le **site public** tant qu'elle n'a pas été révélée dans Firebase.
- Le contenu (texte, image, vidéo, lien) est **entièrement séparé du code** : tu édites uniquement `content.js`.
- Les cases révélées sont synchronisées en temps réel avec Firebase Firestore; aucun `git push` n'est nécessaire pour les révéler.
- Après son propre clic, un viewer voit le cadeau ouvert dans son navigateur. Le clic de l'admin synchronise également l'icône ouverte dans OBS, sans afficher cet état chez les autres viewers.

## Configuration Firebase requise

Firebase Auth doit avoir le fournisseur Google activé. Dans **Authentication → Settings → Authorized domains**, ajoute le domaine du site GitHub Pages (par exemple `nervous974.github.io`).

Pour autoriser uniquement ton compte à révéler les cases :

1. Publie une première fois les changements du calendrier sur GitHub Pages. C’est nécessaire pour mettre la nouvelle intégration en ligne; les révélations suivantes ne demanderont pas de publication Git.
2. Charge le calendrier publié dans un navigateur avec `?streamer=1&admin=1`, puis connecte-toi avec Google.
3. Dans **Authentication → Users** de Firebase, copie l'UID associé à ton compte.
4. Dans `firestore.rules`, remplace `REPLACE_WITH_ADMIN_UID` par cet UID.
5. Dans **Firestore Database → Rules**, colle le contenu modifié de `firestore.rules`, puis clique sur **Publier**.

Les règles autorisent la lecture publique des états, mais les écritures sont réservées à cet UID et aux jours de stream listés dans les règles. Si tu modifies ces jours dans `content.js`, ajuste aussi l'expression régulière dans `firestore.rules`. Les règles autorisent `revealed: true` et, après le clic de l'admin, `streamerOpened: true`. Ne publie jamais de mot de passe ni de clé privée. La configuration web Firebase de `firebase-config.js` est publique; la sécurité dépend des règles Firestore.

## Comment éditer le contenu

Ouvre `content.js` et remplis chaque objet correspondant au jour (1 à 24). Champs disponibles :

| Champ                   | Description                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| `isStreamDay`           | `true` si tu streames ce jour-là                                                                   |
| `title`                 | Titre affiché à l'ouverture de la case                                                             |
| `type`                  | `"text"`, `"image"`, `"video"` ou `"link"`                                                         |
| `text`                  | Message affiché (utilisable avec tous les types)                                                   |
| `mediaUrl`              | Chemin vers une image/vidéo (ex: `media/jour5.png`)                                                |
| `linkUrl` / `linkLabel` | URL et texte du bouton (ex: lien vers un clip Twitch)                                              |

Des exemples pour chaque type sont en bas de `content.js`.

Pour ajouter des images/vidéos, crée un dossier `media/` à côté de `index.html` et places-y tes fichiers.

## Tester dans un navigateur (avant décembre)

Ouvre `index.html` directement dans ton navigateur, en ajoutant `?day=X` à la fin de l'URL pour simuler un jour précis, par exemple :

```
file:///D:/Chaine%20stream/Application%20twitch/Calendrier%20de%20l'avent/index.html?day=12
```

Cela débloque toutes les cases jusqu'au jour 12 inclus, peu importe la vraie date.
Pour tester la synchronisation en octobre, utilise temporairement `?day=12&streamer=1` dans OBS et crée le document temporaire `reveals/3` dans Firestore (voir [la procédure détaillée](NOTE-UTILISATION.md#tester-la-synchronisation-avant-decembre)). Supprime-le après le test.

## Ajouter l'overlay dans OBS

1. Dans OBS, ajoute une source **"Navigateur" (Browser Source)**.
2. Utilise l'adresse HTTPS du calendrier publié sur GitHub Pages et ajoute **`?streamer=1`** à la fin. Une adresse HTTPS est nécessaire pour la connexion Firebase.
3. Règle une largeur/hauteur suffisante, par exemple **900x600**.
4. Le fond est transparent : le calendrier s'incrustera proprement sur ton overlay.
5. Pour révéler une case, ouvre aussi l'adresse du calendrier dans un navigateur normal avec **`?streamer=1&admin=1`**, connecte-toi avec Google, puis clique sur la case. La source OBS reçoit la mise à jour en direct et affiche l'animation automatiquement.

## Site public

Partage l'adresse GitHub Pages sans paramètres. Les jours ordinaires se débloquent automatiquement à la date; les cases de stream s'ouvrent pour tous dès qu'elles sont révélées depuis la page d'administration. Les viewers n'ont pas besoin de se connecter.

## Notes

- Le calendrier utilise la date de l'ordinateur qui exécute OBS : vérifie qu'elle est correcte.
- Après le 31 décembre, le calendrier se reverrouille en janvier; voir la note détaillée pour cette limite.
- Avant le 1er décembre, toutes les cases sont verrouillées (sauf si tu utilises `?day=X` pour tester).
