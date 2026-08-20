(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const phone = "5585997684934";
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);
  const header = document.querySelector("[data-header]");
  const progress = document.querySelector(".scroll-progress");
  const nav = document.getElementById("main-nav");
  const navToggle = document.querySelector(".nav-toggle");
  const scrollLayers = Array.from(document.querySelectorAll("[data-scroll-shift]"));
  const heroShiftItems = Array.from(document.querySelectorAll("[data-hero-shift]"));
  const micStory = document.querySelector(".mic-story");

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const floatMessage = encodeURIComponent(
    "Olá! Quero saber mais sobre o Levizim para o nosso casamento."
  );

  document.querySelectorAll("[data-whatsapp]").forEach((link) => {
    link.href = `https://wa.me/${phone}?text=${floatMessage}`;
  });

  let scrollFrame = 0;
  const updateScrollUi = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const scrollMax = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("is-scrolled", scrollTop > 24);
    if (progress) progress.style.width = `${scrollMax > 0 ? (scrollTop / scrollMax) * 100 : 0}%`;

    if (!reducedMotion && !saveData) {
      const viewportHeight = window.innerHeight;

      scrollLayers.forEach((layer) => {
        const rect = layer.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        const range = viewportHeight + rect.height;
        const localProgress = Math.min(1, Math.max(0, (viewportHeight - rect.top) / range));
        const distance = Number(layer.dataset.scrollShift) || 0;
        const shift = (localProgress - 0.5) * distance;
        layer.style.setProperty("--scroll-y", `${shift.toFixed(2)}px`);
      });

      if (window.innerWidth > 820) {
        const heroTravel = Math.min(scrollTop, viewportHeight * 1.15);
        heroShiftItems.forEach((item) => {
          const factor = Number(item.dataset.heroShift) || 0;
          item.style.setProperty("--scroll-x", `${(heroTravel * factor).toFixed(2)}px`);
        });
      } else {
        heroShiftItems.forEach((item) => item.style.setProperty("--scroll-x", "0px"));
      }

      if (micStory) {
        const rect = micStory.getBoundingClientRect();
        const travel = micStory.offsetHeight - viewportHeight;
        const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0.5;
        micStory.style.setProperty("--mic-p", progress.toFixed(3));
      }
    }

    scrollFrame = 0;
  };

  const scheduleScrollUi = () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScrollUi);
  };

  updateScrollUi();
  window.addEventListener("scroll", scheduleScrollUi, { passive: true });
  window.addEventListener("resize", scheduleScrollUi);

  if (nav && navToggle) {
    const closeNav = () => {
      nav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    navToggle.addEventListener("click", () => {
      const open = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!open));
      nav.classList.toggle("is-open", !open);
      document.body.style.overflow = open ? "" : "hidden";
    });

    nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });
  }

  const revealItems = Array.from(document.querySelectorAll(".reveal"));
  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealTargets = new Map();
    revealItems.forEach((item) => {
      const usesClip = ["clip", "clip-reverse"].includes(item.dataset.reveal);
      const target = usesClip ? item.parentElement || item : item;
      const items = revealTargets.get(target) || [];
      items.push(item);
      revealTargets.set(target, items);
    });

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          (revealTargets.get(entry.target) || [entry.target]).forEach((item) => {
            item.classList.add("is-visible");
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -7% 0px" }
    );
    revealTargets.forEach((_, target) => revealObserver.observe(target));
  }

  const sceneButtons = Array.from(document.querySelectorAll("[data-scene-button]"));
  const sceneImages = Array.from(document.querySelectorAll(".scene-image"));
  const sceneCurrent = document.querySelector("[data-scene-current]");

  const setScene = (index, moveFocus = false) => {
    sceneButtons.forEach((button, buttonIndex) => {
      const active = buttonIndex === index;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && moveFocus) button.focus();
    });
    sceneImages.forEach((image, imageIndex) => image.classList.toggle("is-active", imageIndex === index));
    if (sceneCurrent) sceneCurrent.textContent = String(index + 1).padStart(2, "0");
  };

  sceneButtons.forEach((button, index) => {
    button.addEventListener("click", () => setScene(index));
    button.addEventListener("keydown", (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
      const next = (index + direction + sceneButtons.length) % sceneButtons.length;
      setScene(next, true);
    });
  });
  if (sceneButtons.length) setScene(0);

  const videos = Array.from(document.querySelectorAll("video"));
  if (reducedMotion || saveData) {
    videos.forEach((video) => {
      video.pause();
      video.removeAttribute("autoplay");
      if (saveData) video.preload = "none";
    });
  }

  const filmStory = document.querySelector(".film-story");
  const filmSteps = Array.from(document.querySelectorAll("[data-film-step]"));
  const filmVideos = Array.from(document.querySelectorAll("[data-film-video]"));
  const filmCurrent = document.querySelector("[data-film-current]");
  const filmProgress = document.querySelector("[data-film-progress]");
  const filmControl = document.querySelector("[data-film-control]");
  const filmControlLabel = document.querySelector("[data-film-control-label]");

  if (filmStory && filmSteps.length && filmVideos.length) {
    let activeFilm = 0;
    let filmInView = false;
    let filmUserPaused = false;

    const syncFilmControl = () => {
      if (!filmControl) return;
      const activeVideo = filmVideos[activeFilm];
      const paused = filmUserPaused || !activeVideo || activeVideo.paused;
      const label = paused ? "Reproduzir filme" : "Pausar filme";
      filmControl.classList.toggle("is-paused", paused);
      filmControl.setAttribute("aria-label", label);
      if (filmControlLabel) filmControlLabel.textContent = label;
    };

    const playActiveFilm = () => {
      if (reducedMotion || saveData || filmUserPaused || !filmInView) {
        syncFilmControl();
        return;
      }
      filmVideos[activeFilm]?.play().catch(syncFilmControl);
    };

    const activateFilm = (index) => {
      const next = Math.min(filmVideos.length - 1, Math.max(0, Number(index) || 0));
      const changed = next !== activeFilm;
      activeFilm = next;
      filmStory.dataset.filmAct = String(activeFilm);

      filmSteps.forEach((step, stepIndex) => {
        step.classList.toggle("is-active", stepIndex === activeFilm);
      });

      filmVideos.forEach((video, videoIndex) => {
        const active = videoIndex === activeFilm;
        video.classList.toggle("is-active", active);
        if (!active) {
          video.pause();
          return;
        }
        if (changed) {
          try {
            video.currentTime = 0;
          } catch {
            // O poster permanece visível até o navegador liberar o seek.
          }
        }
      });

      if (filmCurrent) filmCurrent.textContent = String(activeFilm + 1).padStart(2, "0");
      if (filmProgress) filmProgress.style.width = `${((activeFilm + 1) / filmSteps.length) * 100}%`;
      playActiveFilm();
      syncFilmControl();
    };

    if ("IntersectionObserver" in window) {
      const filmStepObserver = new IntersectionObserver(
        (entries) => {
          const activeEntry = entries.find((entry) => entry.isIntersecting);
          if (activeEntry) activateFilm(activeEntry.target.dataset.filmStep);
        },
        { threshold: 0, rootMargin: "-43% 0px -43% 0px" }
      );
      filmSteps.forEach((step) => filmStepObserver.observe(step));

      const filmVisibilityObserver = new IntersectionObserver(
        ([entry]) => {
          filmInView = Boolean(entry?.isIntersecting);
          if (filmInView) {
            playActiveFilm();
          } else {
            filmVideos.forEach((video) => video.pause());
          }
          syncFilmControl();
        },
        { threshold: 0.01, rootMargin: "18% 0px" }
      );
      filmVisibilityObserver.observe(filmStory);
    } else {
      filmInView = true;
    }

    filmVideos.forEach((video) => {
      video.addEventListener("play", syncFilmControl);
      video.addEventListener("pause", syncFilmControl);
    });

    if (filmControl) {
      if (reducedMotion || saveData) {
        filmControl.disabled = true;
        filmControl.classList.add("is-paused");
        filmControl.setAttribute("aria-label", "Filme pausado para economizar dados ou reduzir movimento");
        if (filmControlLabel) filmControlLabel.textContent = "Filme pausado";
      } else {
        filmControl.addEventListener("click", () => {
          filmUserPaused = !filmUserPaused;
          if (filmUserPaused) {
            filmVideos[activeFilm]?.pause();
          } else {
            playActiveFilm();
          }
          syncFilmControl();
        });
      }
    }

    activateFilm(0);
  }

  if (micStory) {
    const micSteps = Array.from(micStory.querySelectorAll("[data-mic-step]"));
    const micVideo = micStory.querySelector(".mic-video");
    const micCurrent = micStory.querySelector("[data-mic-current]");
    const micProgress = micStory.querySelector("[data-mic-progress]");

    const activateMic = (index) => {
      const next = Math.min(micSteps.length - 1, Math.max(0, Number(index) || 0));
      micSteps.forEach((step, stepIndex) => step.classList.toggle("is-active", stepIndex === next));
      if (micCurrent) micCurrent.textContent = String(next + 1).padStart(2, "0");
      if (micProgress) micProgress.style.width = `${((next + 1) / micSteps.length) * 100}%`;
    };

    if ("IntersectionObserver" in window && micSteps.length) {
      const micStepObserver = new IntersectionObserver(
        (entries) => {
          const active = entries.find((entry) => entry.isIntersecting);
          if (active) activateMic(active.target.dataset.micStep);
        },
        { threshold: 0, rootMargin: "-45% 0px -45% 0px" }
      );
      micSteps.forEach((step) => micStepObserver.observe(step));

      if (micVideo && !reducedMotion && !saveData) {
        const micVisibility = new IntersectionObserver(
          ([entry]) => {
            if (entry && entry.isIntersecting) {
              micVideo.play().catch(() => {});
            } else {
              micVideo.pause();
            }
          },
          { threshold: 0.01, rootMargin: "18% 0px" }
        );
        micVisibility.observe(micStory);
      }
    }

    activateMic(0);
  }

  const dateInput = document.getElementById("data");
  if (dateInput) {
    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);
    dateInput.min = localDate;
  }

  const form = document.getElementById("booking-form");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const value = (id) => document.getElementById(id)?.value.trim() || "Não informado";
      const rawDate = document.getElementById("data")?.value;
      const formattedDate = rawDate
        ? new Intl.DateTimeFormat("pt-BR", { timeZone: "UTC" }).format(new Date(`${rawDate}T12:00:00Z`))
        : "Não informada";

      const message = [
        "Olá! Quero consultar a disponibilidade do Levizim para o nosso casamento.",
        "",
        `Nome: ${value("nome")}`,
        `WhatsApp: ${value("whatsapp")}`,
        `Data: ${formattedDate}`,
        `Cidade/local: ${value("local")}`,
        `Formato: ${value("formato")}`,
        `Mensagem: ${value("mensagem")}`
      ].join("\n");

      const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      const popup = window.open(url, "_blank", "noopener,noreferrer");
      if (!popup) window.location.assign(url);
    });
  }
})();
