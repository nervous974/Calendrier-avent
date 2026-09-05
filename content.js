// ============================================================================
// CONTENU DU CALENDRIER DE L'AVENT — à éditer toi-même, jour par jour.
// ============================================================================
// Pour chaque jour (1 à 24), remplis un objet avec :
//   day          : numéro du jour (1-24), ne pas changer
//   isStreamDay  : true si tu streames ce jour-là (affiche une étoile ✨ sur la case)
//   revealed     : uniquement pour les jours de stream (isStreamDay: true).
//                  Reste sur "false" tant que tu n'as pas ouvert la case en live.
//                  Une fois ouverte pendant le stream, passe-la à "true" et fais un
//                  git push pour que la case s'ouvre aussi sur le site public.
//                  (Sur ton propre overlay OBS, utilise l'URL avec "?streamer=1"
//                  pour pouvoir l'ouvrir en live sans attendre ce flag.)
//   title        : titre affiché quand on ouvre la case
//   type         : "text" | "image" | "video" | "link"
//   text         : texte/message (utilisé pour type "text", ou en complément des autres)
//   mediaUrl     : chemin ou URL d'une image/vidéo (pour type "image" ou "video")
//   linkUrl      : URL cliquable (pour type "link", ex: lien clip Twitch, sondage...)
//   linkLabel    : texte du bouton du lien
//
// Astuce : les fichiers images/vidéos peuvent être mis dans un dossier "media/"
// à côté de ce fichier, puis référencés ici en "media/nom-du-fichier.png".
// ============================================================================

const CALENDAR_CONTENT = [
  {
    day: 1,
    isStreamDay: false,
    title: "Bienvenue !",
    type: "text",
    text: "Le calendrier de l'avent commence aujourd'hui ! Reviens chaque jour 🎄",
  },
  {
    day: 2,
    isStreamDay: false,
    title: "Jour 2",
    type: "text",
    text: "À toi de remplir cette case avec une petite surprise !",
  },
  {
    day: 3,
    isStreamDay: true,
    revealed: false,
    title: "Soir de stream !",
    type: "text",
    text: "Gros stream ce soir, viens nombreux 🎉",
  },
  {
    day: 4,
    isStreamDay: false,
    title: "Jour 4",
    type: "text",
    text: "Un fait amusant, un mème, une anecdote...",
  },
  {
    day: 5,
    isStreamDay: false,
    title: "Jour 5",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 6,
    isStreamDay: true,
    revealed: false,
    title: "Soir de stream !",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 7,
    isStreamDay: false,
    title: "Jour 7",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 8,
    isStreamDay: false,
    title: "Jour 8",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 9,
    isStreamDay: false,
    title: "Jour 9",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 10,
    isStreamDay: true,
    revealed: false,
    title: "Soir de stream !",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 11,
    isStreamDay: false,
    title: "Jour 11",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 12,
    isStreamDay: false,
    title: "Jour 12",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 13,
    isStreamDay: true,
    revealed: false,
    title: "Soir de stream !",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 14,
    isStreamDay: false,
    title: "Jour 14",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 15,
    isStreamDay: false,
    title: "Jour 15",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 16,
    isStreamDay: false,
    title: "Jour 16",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 17,
    isStreamDay: true,
    revealed: false,
    title: "Soir de stream !",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 18,
    isStreamDay: false,
    title: "Jour 18",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 19,
    isStreamDay: false,
    title: "Jour 19",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 20,
    isStreamDay: true,
    revealed: false,
    title: "Soir de stream !",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 21,
    isStreamDay: false,
    title: "Jour 21",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 22,
    isStreamDay: false,
    title: "Jour 22",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 23,
    isStreamDay: false,
    title: "Jour 23",
    type: "text",
    text: "À compléter.",
  },
  {
    day: 24,
    isStreamDay: true,
    revealed: false,
    title: "Joyeux Noël !",
    type: "text",
    text: "Merci d'avoir suivi ce calendrier de l'avent, joyeuses fêtes ! 🎅",
  },
];

// Exemples d'utilisation des autres types (à copier-coller dans une case ci-dessus) :
//
// { day: 5, isStreamDay: false, title: "Une image surprise", type: "image",
//   mediaUrl: "media/jour5.png", text: "Petit dessin du jour !" },
//
// { day: 8, isStreamDay: false, title: "Un clip à revoir", type: "link",
//   linkUrl: "https://clips.twitch.tv/xxxxx", linkLabel: "Voir le clip",
//   text: "Petit rappel de ce moment culte du dernier stream." },
//
// { day: 12, isStreamDay: false, title: "Vidéo du jour", type: "video",
//   mediaUrl: "media/jour12.mp4", text: "Une petite vidéo surprise." },
