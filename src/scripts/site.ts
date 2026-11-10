// Shared behaviour for every page: reveal-on-scroll, nav hide/show, mobile menu,
// active section in the nav, copy-email button.
import { initSmooth, getLenis } from "./smooth";

export function initSite() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  initSmooth();

  // reveal
  const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
  if (reduce || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-in"));
  } else {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 },
    );
    els.forEach((el) => io.observe(el));
  }

  // nav: hide when scrolling down, show when scrolling up
  const nav = document.querySelector<HTMLElement>("[data-nav]");
  let lastY = scrollY, ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => {
      const y = scrollY;
      if (nav && !document.body.classList.contains("menu-open")) nav.classList.toggle("is-hidden", y > 240 && y > lastY + 4);
      if (y < lastY - 4 || y < 240) nav?.classList.remove("is-hidden");
      lastY = y; ticking = false;
    });
  }, { passive: true });
  nav?.addEventListener("focusin", () => nav.classList.remove("is-hidden"));

  // mobile menu
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const menu = document.querySelector<HTMLElement>("[data-menu]");
  const setMenu = (open: boolean) => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    const l = getLenis(); if (l) (open ? l.stop() : l.start());
  };
  toggle?.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
  menu?.addEventListener("click", (e) => { if ((e.target as HTMLElement).closest("a")) setMenu(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && toggle?.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); } });
  matchMedia("(min-width: 761px)").addEventListener("change", (m) => { if (m.matches) setMenu(false); });

  // active section in nav
  const links = document.querySelectorAll<HTMLAnchorElement>("[data-nav-link]");
  const sections = document.querySelectorAll<HTMLElement>("[data-section]");
  if (links.length && sections.length && "IntersectionObserver" in window) {
    const so = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const id = (e.target as HTMLElement).dataset.section;
        links.forEach((l) => l.setAttribute("aria-current", String(l.dataset.navLink === id)));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => so.observe(s));
  }

  // copy email
  document.querySelectorAll<HTMLButtonElement>("[data-copy]").forEach((b) => {
    const label = b.querySelector("[data-copy-label]") ?? b;
    b.addEventListener("click", async () => {
      try { await navigator.clipboard.writeText(b.dataset.copy!); label.textContent = "Copied ✓"; }
      catch { label.textContent = "Select & copy"; }
      setTimeout(() => (label.textContent = "Copy"), 2200);
    });
  });
}
