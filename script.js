(() => {
  "use strict";

  document.documentElement.classList.add("js");

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const header = document.querySelector("[data-header]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navLinks = document.querySelector("[data-nav-links]");
  const orb = document.querySelector("[data-orb]");

  const closeNavigation = () => {
    navToggle?.setAttribute("aria-expanded", "false");
    navToggle?.setAttribute("aria-label", "Open navigation");
    navLinks?.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  };

  navToggle?.addEventListener("click", () => {
    const opening = navToggle.getAttribute("aria-expanded") !== "true";
    navToggle.setAttribute("aria-expanded", String(opening));
    navToggle.setAttribute("aria-label", opening ? "Close navigation" : "Open navigation");
    navLinks?.classList.toggle("is-open", opening);
    document.body.classList.toggle("nav-open", opening);
  });

  navLinks?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNavigation));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeNavigation();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 880) closeNavigation();
  });

  const reveals = [...document.querySelectorAll(".reveal")];
  if (reducedMotion.matches || !("IntersectionObserver" in window)) {
    reveals.forEach((element) => element.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, currentObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -7%" }
    );
    reveals.forEach((element) => observer.observe(element));
  }

  let scrollFrame = 0;
  const updateScroll = () => {
    const top = window.scrollY;
    header?.classList.toggle("is-scrolled", top > 18);
    if (orb && !reducedMotion.matches) {
      const progress = Math.min(Math.max(top / 620, 0), 1);
      orb.style.setProperty("--orb-shift", `${progress * 28}px`);
      orb.style.setProperty("--orb-scale", String(1 - progress * 0.035));
      orb.style.setProperty("--orb-opacity", String(1 - progress * 0.12));
    }
    scrollFrame = 0;
  };

  window.addEventListener(
    "scroll",
    () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(updateScroll);
    },
    { passive: true }
  );

  updateScroll();

  document.querySelectorAll(".portal-panel").forEach((panel) => {
    panel.addEventListener("animationend", () => {
      panel.hidden = true;
    });
  });

  const year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());
})();
