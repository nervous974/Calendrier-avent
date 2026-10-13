import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {
  GoogleAuthProvider,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {
  collection,
  doc,
  getFirestore,
  onSnapshot,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";

// ============================================================================
// LOGIQUE DU CALENDRIER — pas besoin d'y toucher pour changer le contenu,
// modifie plutôt content.js
// ============================================================================

(function () {
  const TOTAL_DAYS = 24;
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const revealedStreamDays = new Set();
  let currentUser = null;

  function createSnow(flakeCount) {
    const container = document.getElementById("snow-container");
    for (let i = 0; i < flakeCount; i++) {
      const flake = document.createElement("span");
      flake.className = "snowflake";
      flake.textContent = "❄";
      flake.style.left = `${Math.random() * 100}%`;
      flake.style.fontSize = `${8 + Math.random() * 16}px`;
      flake.style.opacity = 0.4 + Math.random() * 0.6;
      flake.style.animationDuration = `${5 + Math.random() * 6}s`;
      flake.style.animationDelay = `${Math.random() * 8}s`;
      container.appendChild(flake);
    }
  }

  function createLights(bulbCount) {
    const strip = document.querySelector(".lights-string");
    const colors = ["#ff4d4d", "#ffd54a", "#4dff88", "#4dd2ff", "#ff8ade"];
    for (let i = 0; i < bulbCount; i++) {
      const bulb = document.createElement("span");
      bulb.className = "light-bulb";
      bulb.style.background = colors[i % colors.length];
      bulb.style.animationDelay = `${(i % colors.length) * 0.3}s`;
      strip.appendChild(bulb);
    }
  }

  function isStreamerMode() {
    const params = new URLSearchParams(window.location.search);
    return params.get("streamer") === "1";
  }

  function isAdminMode() {
    const params = new URLSearchParams(window.location.search);
    return isStreamerMode() && params.get("admin") === "1";
  }

  function isTestMode() {
    return new URLSearchParams(window.location.search).has("day");
  }

  function setSyncStatus(message, isError = false) {
    const status = document.getElementById("firebase-sync-status");
    status.textContent = message;
    status.classList.toggle("firebase-error", isError);
  }

  function getUnlockedDay() {
    // Permet de tester le calendrier hors décembre : ajoute ?day=12 dans l'URL
    // (ex: fichier ouvert dans un navigateur, ou URL de la source OBS).
    const params = new URLSearchParams(window.location.search);
    const forcedDay = parseInt(params.get("day"), 10);
    if (!isNaN(forcedDay)) {
      return Math.max(0, Math.min(TOTAL_DAYS, forcedDay));
    }

    const now = new Date();
    const month = now.getMonth(); // 0 = janvier, 11 = décembre
    const year = now.getFullYear();

    if (month === 11) {
      return now.getDate(); // jour du mois en décembre
    }
    if (year > now.getFullYear() || month > 11) {
      return TOTAL_DAYS; // après décembre : tout débloqué
    }
    return 0; // avant décembre : tout verrouillé
  }

  function buildGrid(unlockedDay) {
    const grid = document.getElementById("calendar-grid");
    grid.innerHTML = "";
    const streamerMode = isStreamerMode();

    for (let day = 1; day <= TOTAL_DAYS; day++) {
      const data = window.CALENDAR_CONTENT.find((entry) => entry.day === day) || {};
      const isDateUnlocked = day <= unlockedDay;
      // Sur un jour de stream, la case attend d'être révélée en live (sauf en mode streamer)
      const isWaitingForLive =
        data.isStreamDay && !revealedStreamDays.has(day) && !streamerMode;
      const isUnlocked = isDateUnlocked && !isWaitingForLive;

      const cell = document.createElement("button");
      cell.className = "day-cell" + (isUnlocked ? " unlocked" : " locked");
      cell.type = "button";
      cell.disabled = !isUnlocked;
      cell.setAttribute("aria-label", `Jour ${day}`);

      if (data.isStreamDay) {
        cell.classList.add("stream-day");
      }

      let icon = "🔒";
      if (isUnlocked) {
        icon = "🎁";
      } else if (isDateUnlocked && isWaitingForLive) {
        icon = "⏳"; // date passée, en attente de l'ouverture en direct
      }

      cell.innerHTML = `
        <span class="day-number">${day}</span>
        ${data.isStreamDay ? '<span class="stream-star" title="Jour de stream">✨</span>' : ""}
        <span class="day-icon">${icon}</span>
      `;

      if (isUnlocked) {
        cell.addEventListener("click", () => handleDayClick(day, data));
      }

      grid.appendChild(cell);
    }
  }

  async function handleDayClick(day, data) {
    if (
      data.isStreamDay &&
      isAdminMode() &&
      !isTestMode() &&
      !revealedStreamDays.has(day)
    ) {
      if (!currentUser) {
        document.getElementById("firebase-auth-status").textContent =
          "Connecte-toi avec Google avant de révéler une case.";
        return;
      }

      setSyncStatus(`Publication de la case ${day}…`);
      try {
        await setDoc(doc(db, "reveals", String(day)), { revealed: true });
      } catch (error) {
        console.error("Impossible de publier la case dans Firestore.", error);
        setSyncStatus(
          `Échec de publication : ${error.message}. Vérifie les règles Firestore.`,
          true,
        );
      }
      return;
    }

    openReveal(day, data);
  }

  const GIFT_DROP_DURATION = 700;
  const GIFT_POP_DURATION = 400;
  const CONFETTI_COLORS = [
    "#ffd54a",
    "#ff4d4d",
    "#4dff88",
    "#4dd2ff",
    "#ff8ade",
  ];
  let revealTimers = [];

  function spawnConfetti(isFinale) {
    const burst = document.getElementById("confetti-burst");
    burst.innerHTML = "";
    const pieceCount = isFinale ? 70 : 24;
    for (let i = 0; i < pieceCount; i++) {
      const piece = document.createElement("span");
      piece.className = "confetti-piece";
      const angle = Math.random() * Math.PI * 2;
      const distance = isFinale
        ? 140 + Math.random() * 160
        : 80 + Math.random() * 90;
      piece.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
      piece.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
      piece.style.setProperty("--rot", `${Math.random() * 360}deg`);
      piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
      if (isFinale) {
        piece.style.width = piece.style.height = `${8 + Math.random() * 6}px`;
      }
      burst.appendChild(piece);
    }
    // Force le reflow avant d'ajouter la classe pour bien déclencher l'animation
    void burst.offsetWidth;
    burst
      .querySelectorAll(".confetti-piece")
      .forEach((piece) => piece.classList.add("bursting"));
  }

  function openReveal(day, data) {
    const overlay = document.getElementById("reveal-overlay");
    const giftBox = document.getElementById("reveal-box");
    const giftAnimation = document.getElementById("gift-animation");
    const giftEmoji = document.getElementById("gift-emoji");
    const content = document.getElementById("reveal-content");
    const badge = document.getElementById("reveal-day-badge");
    const title = document.getElementById("reveal-title");
    const body = document.getElementById("reveal-body");
    const isFinale = day === TOTAL_DAYS;

    revealTimers.forEach(clearTimeout);
    revealTimers = [];

    badge.textContent = `Jour ${day}`;
    title.textContent = data.title || `Jour ${day}`;
    body.innerHTML = "";

    if (data.type === "image" && data.mediaUrl) {
      const img = document.createElement("img");
      img.src = data.mediaUrl;
      img.alt = data.title || "";
      body.appendChild(img);
    } else if (data.type === "video" && data.mediaUrl) {
      const video = document.createElement("video");
      video.src = data.mediaUrl;
      video.controls = true;
      video.autoplay = true;
      body.appendChild(video);
    } else if (data.type === "link" && data.linkUrl) {
      const link = document.createElement("a");
      link.href = data.linkUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.className = "reveal-link";
      link.textContent = data.linkLabel || "Ouvrir";
      body.appendChild(link);
    }

    if (data.text) {
      const p = document.createElement("p");
      p.textContent = data.text;
      body.appendChild(p);
    }

    // Réinitialise l'animation du cadeau (pour rejouer même sur clic répété)
    giftEmoji.classList.remove("popping", "finale");
    giftBox.classList.remove("finale-glow");
    giftEmoji.style.animation = "none";
    void giftEmoji.offsetWidth;
    giftEmoji.style.animation = "";

    if (isFinale) {
      giftEmoji.classList.add("finale");
      giftBox.classList.add("finale-glow");
    }

    content.classList.add("hidden");
    giftAnimation.classList.remove("hidden");
    overlay.classList.remove("hidden");

    const dropDuration = isFinale
      ? GIFT_DROP_DURATION + 300
      : GIFT_DROP_DURATION;
    const popDuration = isFinale ? GIFT_POP_DURATION + 300 : GIFT_POP_DURATION;

    revealTimers.push(
      setTimeout(() => {
        giftEmoji.classList.add("popping");
        spawnConfetti(isFinale);
        if (isFinale) {
          setTimeout(() => spawnConfetti(true), 250);
        }
      }, dropDuration),
    );

    revealTimers.push(
      setTimeout(() => {
        giftAnimation.classList.add("hidden");
        content.classList.remove("hidden");
      }, dropDuration + popDuration),
    );
  }

  function closeReveal() {
    revealTimers.forEach(clearTimeout);
    revealTimers = [];
    document.getElementById("reveal-overlay").classList.add("hidden");
  }

  document
    .getElementById("reveal-close")
    .addEventListener("click", closeReveal);
  document
    .getElementById("reveal-overlay")
    .addEventListener("click", (event) => {
      if (event.target.id === "reveal-overlay") closeReveal();
    });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeReveal();
  });

  const controls = document.getElementById("firebase-controls");
  const signInButton = document.getElementById("firebase-sign-in");
  const signOutButton = document.getElementById("firebase-sign-out");
  if (isAdminMode()) {
    controls.hidden = false;
    signInButton.addEventListener("click", async () => {
      try {
        await signInWithPopup(auth, new GoogleAuthProvider());
      } catch (error) {
        console.error("La connexion Google a échoué.", error);
        document.getElementById("firebase-auth-status").textContent =
          `Connexion impossible : ${error.message}`;
      }
    });
    signOutButton.addEventListener("click", async () => {
      try {
        await signOut(auth);
      } catch (error) {
        console.error("La déconnexion Firebase a échoué.", error);
        document.getElementById("firebase-auth-status").textContent =
          `Déconnexion impossible : ${error.message}`;
      }
    });
    onAuthStateChanged(auth, (user) => {
      currentUser = user;
      signInButton.hidden = Boolean(user);
      signOutButton.hidden = !user;
      document.getElementById("firebase-auth-status").textContent = user
        ? `Connecté : ${user.email || "compte Google"}`
        : "Non connecté — connecte-toi pour révéler les cases de stream.";
    });
  }

  let initialSnapshotReceived = false;
  onSnapshot(
    collection(db, "reveals"),
    { includeMetadataChanges: true },
    (snapshot) => {
      const previousReveals = new Set(revealedStreamDays);
      revealedStreamDays.clear();
      snapshot.forEach((entry) => {
        const day = Number(entry.id);
        const data = window.CALENDAR_CONTENT.find(
          (calendarDay) => calendarDay.day === day,
        );
        if (
          !entry.metadata.hasPendingWrites &&
          data?.isStreamDay &&
          entry.data().revealed === true
        ) {
          revealedStreamDays.add(day);
        }
      });

      buildGrid(getUnlockedDay());
      setSyncStatus("Synchronisation Firebase active.");

      if (initialSnapshotReceived && isStreamerMode() && !isTestMode()) {
        for (const day of revealedStreamDays) {
          if (!previousReveals.has(day) && day <= getUnlockedDay()) {
            const data = window.CALENDAR_CONTENT.find(
              (calendarDay) => calendarDay.day === day,
            );
            openReveal(day, data);
          }
        }
      }
      initialSnapshotReceived = true;
    },
    (error) => {
      console.error("La synchronisation Firestore a échoué.", error);
      setSyncStatus(
        `Synchronisation impossible : ${error.message}. Vérifie la configuration et les règles Firestore.`,
        true,
      );
      buildGrid(getUnlockedDay());
    },
  );

  createSnow(45);
  createLights(18);
})();
