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

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });

  const floatMessage = encodeURIComponent(
    "Olá! Quero saber mais sobre o show do Levizim para o meu pré-wedding."
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

      const heroTravel = Math.min(scrollTop, viewportHeight * 1.15);
      heroShiftItems.forEach((item) => {
        const factor = Number(item.dataset.heroShift) || 0;
        item.style.setProperty("--scroll-x", `${(heroTravel * factor).toFixed(2)}px`);
      });
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
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7% 0px" }
    );
    revealItems.forEach((item) => revealObserver.observe(item));
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

  const showreel = document.querySelector(".showreel-video");
  const videoControl = document.querySelector("[data-video-control]");
  if (showreel && videoControl) {
    const updateVideoControl = () => {
      const paused = showreel.paused;
      videoControl.textContent = paused ? "Reproduzir filme" : "Pausar filme";
      videoControl.setAttribute("aria-label", paused ? "Reproduzir vídeo" : "Pausar vídeo");
    };

    updateVideoControl();
    showreel.addEventListener("play", updateVideoControl);
    showreel.addEventListener("pause", updateVideoControl);
    videoControl.addEventListener("click", () => {
      if (showreel.paused) {
        showreel.play().catch(() => {});
      } else {
        showreel.pause();
      }
    });
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
        "Olá! Quero consultar a disponibilidade do Levizim para o meu pré-wedding.",
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
