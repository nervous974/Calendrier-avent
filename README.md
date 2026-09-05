# Calendrier de l'Avent — Overlay OBS

Un calendrier de l'avent (24 cases) à afficher en Browser Source dans OBS.
Les cases se débloquent automatiquement selon la date réelle en décembre.

## Aperçu rapide

- **Aucune case n'est cliquable avant son jour** (verrou 🔒), elle devient cliquable (🎁) le jour même et reste ouverte ensuite.
- Les jours marqués `isStreamDay: true` dans `content.js` affichent une étoile ✨ et un contour pointillé doré : utilise-les pour les jours où tu streames, avec un contenu plus important.
- Le contenu (texte, image, vidéo, lien) est **entièrement séparé du code** : tu édites uniquement `content.js`.

## Comment éditer le contenu

Ouvre `content.js` et remplis chaque objet correspondant au jour (1 à 24). Champs disponibles :

| Champ                   | Description                                           |
| ----------------------- | ----------------------------------------------------- |
| `isStreamDay`           | `true` si tu streames ce jour-là                      |
| `title`                 | Titre affiché à l'ouverture de la case                |
| `type`                  | `"text"`, `"image"`, `"video"` ou `"link"`            |
| `text`                  | Message affiché (utilisable avec tous les types)      |
| `mediaUrl`              | Chemin vers une image/vidéo (ex: `media/jour5.png`)   |
| `linkUrl` / `linkLabel` | URL et texte du bouton (ex: lien vers un clip Twitch) |

Des exemples pour chaque type sont en bas de `content.js`.

Pour ajouter des images/vidéos, crée un dossier `media/` à côté de `index.html` et places-y tes fichiers.

## Tester dans un navigateur (avant décembre)

Ouvre `index.html` directement dans ton navigateur, en ajoutant `?day=X` à la fin de l'URL pour simuler un jour précis, par exemple :

```
file:///D:/Chaine%20stream/Application%20twitch/Calendrier%20de%20l'avent/index.html?day=12
```

Cela débloque toutes les cases jusqu'au jour 12 inclus, peu importe la vraie date.

## Ajouter l'overlay dans OBS

1. Dans OBS, ajoute une source **"Navigateur" (Browser Source)**.
2. Coche **"Fichier local"** et sélectionne `index.html`.
3. Règle une largeur/hauteur suffisante, par exemple **900x600**.
4. Le fond est transparent : le calendrier s'incrustera proprement sur ton overlay.
5. Pendant le stream, **clic droit sur la source → Interagir** pour pouvoir cliquer sur les cases en direct devant tes viewers.

## Notes

- Le calendrier utilise la date de l'ordinateur qui exécute OBS : vérifie qu'elle est correcte.
- Après le 31 décembre, toutes les cases restent débloquées (pratique pour revoir le calendrier après coup).
- Avant le 1er décembre, toutes les cases sont verrouillées (sauf si tu utilises `?day=X` pour tester).
