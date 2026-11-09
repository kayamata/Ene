/* ══════════════════════════════════════════════
   Happy Birthday — script
   ══════════════════════════════════════════════ */

/* ── ★ EASY CONFIG ★ ────────────────────────────
   1) SPOTIFY PLAYLIST
      Create your playlist in Spotify → Share →
      "Copy link to playlist". The link looks like:
        https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M
      Copy just the ID at the end (the long string of
      letters/numbers) and paste it below. Leave it as
      "" and a soft placeholder card is shown instead.
   ─────────────────────────────────────────────── */
const SPOTIFY_PLAYLIST_ID = "2iE2i7oEBnr9cdEyh2ok83";

/* The handwritten letter image — put your photo at
   images/letter.jpg (jpg/png both fine). */
const LETTER_IMAGE = "images/letter.jpg";

/* ── ★ BACKGROUND SONG ★ ────────────────────────
   "Hey There Delilah" — Plain White T's.
   The MP3 lives at audio/hey-there-delilah.mp3.
   To use a different song, drop the file in
   public/audio/ and update AUDIO_SRC below.
   ─────────────────────────────────────────────── */
const AUDIO_SRC = "audio/hey-there-delilah.mp3";
/* ─────────────────────────────────────────────── */

(function () {
  "use strict";

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ── Welcome gate ── */
  const welcome = $("#welcome");
  const openBtn = $("#openBtn");
  const nav = $("#nav");

  function openExperience() {
    welcome.classList.add("opened");
    document.body.classList.remove("pre-open");
    nav.classList.add("visible");
    openBtn.disabled = true;
    tryPlay(); // begin the song with her first tap — a valid user gesture
    // gentle scroll to the birthday message
    setTimeout(() => $("#birthday").scrollIntoView({ behavior: "smooth" }), 350);
  }

  openBtn.addEventListener("click", openExperience);

  /* ── Navigation (mobile menu + hide-on-scroll-up) ── */
  const burger = $("#navBurger");
  const navLinks = $("#navLinks");

  burger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    burger.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  });
  $$("a", navLinks).forEach((a) =>
    a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      burger.classList.remove("open");
      burger.setAttribute("aria-expanded", "false");
    })
  );

  let lastY = 0;
  window.addEventListener(
    "scroll",
    () => {
      const y = window.scrollY;
      nav.classList.toggle("nav-hidden", y > 140 && y > lastY);
      lastY = y;
    },
    { passive: true }
  );

  /* ── Scroll reveal ── */
  const revealEls = $$(".reveal");
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));

  // stagger siblings a touch
  $$(".section").forEach((sec) => {
    $$(".reveal", sec).forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 90, 360)}ms`;
    });
  });

  /* ── Spotify playlist ── */
  const musicWrap = $("#musicWrap");
  if (SPOTIFY_PLAYLIST_ID) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://open.spotify.com/embed/playlist/${encodeURIComponent(SPOTIFY_PLAYLIST_ID)}?utm_source=generator&theme=0`;
    iframe.title = "Our playlist";
    iframe.loading = "lazy";
    iframe.allow =
      "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
    iframe.allowFullscreen = true;
    musicWrap.appendChild(iframe);
  } else {
    const ph = document.createElement("div");
    ph.className = "music-placeholder";
    ph.innerHTML = `
      <span class="note-heart">♪</span>
      <p><strong>Our playlist is almost ready.</strong><br />
      Once you create it on Spotify, add the playlist ID in <code>script.js</code> —
      the player will appear right here, exactly where it belongs.</p>`;
    musicWrap.appendChild(ph);
  }

  /* ── Letter image (graceful fallback if file missing) ── */
  const letterImg = $("#letterImg");
  letterImg.addEventListener("error", () => {
    letterImg.replaceWith(
      Object.assign(document.createElement("div"), {
        className: "music-placeholder",
        style: "aspect-ratio: 4 / 5; justify-content: center;",
        innerHTML:
          '<span class="note-heart">💌</span>' +
          "<p><strong>The letter photo isn't here yet.</strong><br />" +
          "Add your photo at <code>images/letter.jpg</code> and it will appear in this frame.</p>",
      })
    );
  });

  /* ── Lightbox ── */
  const lightbox = $("#lightbox");
  const lightboxImg = $("#lightboxImg");
  const lightboxClose = $("#lightboxClose");
  let lastFocus = null;

  function openLightbox(src, alt) {
    lastFocus = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    lightboxImg.src = "";
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  $("#letterBtn").addEventListener("click", () =>
    openLightbox(letterImg.currentSrc || LETTER_IMAGE, letterImg.alt)
  );
  lightboxClose.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) closeLightbox();
  });

  /* ── Background music (Hey There Delilah) ──
     One persistent <audio> element — playback continues
     across all sections and never restarts on scroll.
     Autoplay is attempted only inside the "Open Your
     Surprise" click (a user gesture); if the browser or
     missing file blocks it, the pill stays ready and she
     can press play herself. */
  const pill = $("#musicPill");
  const mpToggle = $("#mpToggle");
  const audio = $("#bgAudio");
  const progress = $("#mpProgress");
  const progressFill = $("#mpProgressFill");
  let audioAvailable = true;

  audio.src = AUDIO_SRC;

  function setPlayingUI(playing) {
    pill.classList.toggle("playing", playing);
    mpToggle.setAttribute("aria-label", playing ? "Pause music" : "Play music");
  }

  function tryPlay() {
    if (!audioAvailable) return;
    const p = audio.play();
    if (p && p.catch) p.catch(() => setPlayingUI(false));
  }

  mpToggle.addEventListener("click", () => {
    if (!audioAvailable) return;
    if (audio.paused) {
      tryPlay();
    } else {
      audio.pause();
    }
  });

  audio.addEventListener("play", () => setPlayingUI(true));
  audio.addEventListener("pause", () => setPlayingUI(false));
  audio.addEventListener("ended", () => setPlayingUI(false));

  audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
      const pct = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${pct}%`;
      progress.setAttribute("aria-valuenow", String(Math.round(pct)));
    }
  });

  progress.addEventListener("click", (e) => {
    if (!audioAvailable || !audio.duration) return;
    const rect = progress.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    audio.currentTime = ratio * audio.duration;
  });

  audio.addEventListener("error", () => {
    audioAvailable = false;
    pill.classList.add("unavailable");
    pill.querySelector(".mp-title").textContent = "Our song";
    pill.querySelector(".mp-artist").textContent = "coming soon";
    mpToggle.disabled = true;
  });

  /* ── Little surprise ── */
  const surpriseBtn = $("#surpriseBtn");
  const surpriseCard = $("#surpriseCard");
  surpriseBtn.addEventListener("click", () => {
    const showing = surpriseCard.classList.toggle("hidden");
    surpriseBtn.setAttribute("aria-expanded", String(!showing));
    surpriseBtn.firstChild.textContent = showing ? "Open it" : "Hide it";
    if (!showing) {
      surpriseCard.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });

  /* ── "Read it again" ── */
  $("#replayBtn").addEventListener("click", () => {
    $("#birthday").scrollIntoView({ behavior: "smooth" });
  });
})();
