# Calendrier de l'Avent — Overlay OBS

Un calendrier de l'avent (24 cases) à afficher en Browser Source dans OBS.
Les cases se débloquent automatiquement selon la date réelle en décembre.

## Aperçu rapide

- **Aucune case n'est cliquable avant son jour** (verrou 🔒), elle devient cliquable (🎁) le jour même et reste ouverte ensuite.
- Les jours marqués `isStreamDay: true` dans `content.js` affichent une étoile ✨ et un contour pointillé doré : utilise-les pour les jours où tu streames, avec un contenu plus important.
- Pour ces jours de stream, la case reste en attente (⏳) sur le **site public** tant que tu ne l'as pas ouverte en live (voir section "Site public" plus bas).
- Le contenu (texte, image, vidéo, lien) est **entièrement séparé du code** : tu édites uniquement `content.js`.

## Comment éditer le contenu

Ouvre `content.js` et remplis chaque objet correspondant au jour (1 à 24). Champs disponibles :

| Champ                   | Description                                                                                        |
| ----------------------- | -------------------------------------------------------------------------------------------------- |
| `isStreamDay`           | `true` si tu streames ce jour-là                                                                   |
| `revealed`              | Uniquement pour les jours de stream : passe à `true` après l'avoir ouverte en live (voir plus bas) |
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

## Ajouter l'overlay dans OBS

1. Dans OBS, ajoute une source **"Navigateur" (Browser Source)**.
2. Dans le champ URL, utilise **`?streamer=1`** à la fin (ex: `file:///.../index.html?streamer=1`), ou coche "Fichier local" puis ajoute `?streamer=1` dans le champ URL prévu à cet effet.
   Ce paramètre te permet d'ouvrir les cases de stream dès que leur date arrive, sans attendre le flag `revealed`.
3. Règle une largeur/hauteur suffisante, par exemple **900x600**.
4. Le fond est transparent : le calendrier s'incrustera proprement sur ton overlay.
5. Pendant le stream, **clic droit sur la source → Interagir** pour pouvoir cliquer sur les cases en direct devant tes viewers.

## Site public (pour que les viewers ouvrent leur case même sans stream)

Le même site est aussi publié en ligne (via GitHub Pages) à une adresse que tu peux partager (bio Twitch, Discord...).
Sur cette version publique (sans `?streamer=1`), les jours normaux se débloquent automatiquement à la date, mais les **jours de stream restent en attente (⏳)** tant que tu ne les as pas ouverts en live.

Après avoir ouvert une case de stream pendant le direct :

1. Ouvre `content.js`, trouve le jour concerné, et passe `revealed: false` en `revealed: true`.
2. Envoie la mise à jour sur GitHub (dans un terminal, à la racine du projet) :
   ```powershell
   git add .
   git commit -m "Reveal jour X"
   git push
   ```
3. En quelques minutes, la case apparaît débloquée pour tout le monde sur le site public.

## Notes

- Le calendrier utilise la date de l'ordinateur qui exécute OBS : vérifie qu'elle est correcte.
- Après le 31 décembre, toutes les cases restent débloquées (pratique pour revoir le calendrier après coup).
- Avant le 1er décembre, toutes les cases sont verrouillées (sauf si tu utilises `?day=X` pour tester).
