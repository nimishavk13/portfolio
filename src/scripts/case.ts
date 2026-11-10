// Case-study page behaviour: interactions always; scroll animation only when motion is allowed.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => Array.from(r.querySelectorAll<T>(s)) as unknown as T[];

function interactions() {
  // section nav: active chip + reading progress
  const links = $$<HTMLAnchorElement>("[data-snav-link]");
  const bar = document.querySelector<HTMLElement>("[data-snav-progress]");
  const secs = $$<HTMLElement>("[data-cs]");
  const so = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    const id = (e.target as HTMLElement).id;
    links.forEach((l) => {
      const on = l.dataset.snavLink === id;
      l.setAttribute("aria-current", String(on));
      if (on) l.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
    });
  }), { rootMargin: "-40% 0px -55% 0px" });
  secs.forEach((s) => so.observe(s));
  const first = secs[0], last = secs[secs.length - 1];
  const prog = () => {
    if (!bar || !first || !last) return;
    const a = first.offsetTop - innerHeight * 0.5, b = last.offsetTop + last.offsetHeight - innerHeight;
    bar.style.transform = `scaleX(${Math.min(1, Math.max(0, (scrollY - a) / (b - a)))})`;
  };
  addEventListener("scroll", prog, { passive: true }); prog();

  // sketch / final compare
  $$("[data-cmp]").forEach((f) => {
    const r = f.querySelector<HTMLInputElement>("[data-cmp-range]")!;
    const set = () => f.style.setProperty("--x", `${r.value}%`);
    r.addEventListener("input", set); set();
  });

  // kit hotspots (tap to open on touch)
  const spots = $$("[data-spot]");
  spots.forEach((s) => {
    const b = s.querySelector("button")!;
    b.addEventListener("click", () => {
      const open = !s.classList.contains("is-open");
      spots.forEach((o) => { o.classList.remove("is-open"); o.querySelector("button")!.setAttribute("aria-expanded", "false"); });
      s.classList.toggle("is-open", open); b.setAttribute("aria-expanded", String(open));
    });
  });
  document.addEventListener("click", (e) => { if (!(e.target as HTMLElement).closest("[data-spot]")) spots.forEach((o) => o.classList.remove("is-open")); });

  // CVD simulation toggle (Mentora)
  $$<HTMLButtonElement>("[data-cvd]").forEach((b) => {
    const scr = b.closest("[data-scr]")!;
    b.addEventListener("click", () => {
      const on = b.getAttribute("aria-checked") !== "true";
      b.setAttribute("aria-checked", String(on)); scr.classList.toggle("is-cvd", on);
    });
  });

  // Hormona journey tabs
  $$("[data-jr]").forEach((jr) => {
    const tabs = $$<HTMLButtonElement>("[data-jr-tab]", jr);
    const show = (k: string, focus = false) => {
      jr.setAttribute("data-active", k);
      tabs.forEach((t) => { const on = t.dataset.jrTab === k; t.setAttribute("aria-selected", String(on)); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
      $$<HTMLElement>("[data-jr-panel]", jr).forEach((p) => {
        const on = p.dataset.jrPanel === k; p.hidden = !on;
        if (on && !matchMedia("(prefers-reduced-motion: reduce)").matches) gsap.from(p.querySelectorAll(".jr__stats li, .persona__id, .persona__col"), { y: 26, opacity: 0, duration: 0.6, stagger: 0.05, ease: "power3.out" });
      });
      ScrollTrigger.refresh();
    };
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => show(t.dataset.jrTab!));
      t.addEventListener("keydown", (e) => {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        e.preventDefault(); show(tabs[(i + (e.key === "ArrowRight" ? 1 : tabs.length - 1)) % tabs.length].dataset.jrTab!, true);
      });
    });
  });
}

export function initCase() {
  interactions();
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.registerPlugin(ScrollTrigger);
  const st = (trigger: Element | string, start = "top 78%") => ({ trigger, start });

  // hero entrance
  gsap.timeline({ defaults: { ease: "expo.out" } })
    .from("[data-ch-img]", { scale: 1.25, duration: 1.8 }, 0)
    .from("[data-ch-title] .w span", { yPercent: 110, opacity: 0, rotate: 8, duration: 1.1, stagger: 0.035 }, 0.15)
    .from("[data-ch-in]", { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.25)
    .from("[data-ch-lens]", { scale: 0, duration: 1.4, ease: "back.out(1.4)" }, 0.5)
    .from("[data-ch-dot]", { scale: 0, duration: 1, ease: "back.out(2)" }, 0.8);
  gsap.to("[data-ch-img]", { yPercent: 10, ease: "none", scrollTrigger: { trigger: "[data-ch]", start: "top top", end: "bottom top", scrub: true } });

  // section heading tabs slide in
  $$(".cs__title .tab").forEach((t) => gsap.from(t, { xPercent: -100, duration: 0.9, ease: "power3.out", scrollTrigger: st(t, "top 85%") }));

  // overview: cards deal in, arcs draw
  $$("[data-ov]").forEach((ov) => {
    gsap.from($$("[data-ov-card]", ov), { y: 70, rotate: (i: number) => [-2, 1.5, 2][i], opacity: 0, duration: 1, stagger: 0.14, ease: "power3.out", scrollTrigger: st(ov) });
    gsap.from($$(".ov__card .ov__n", ov), { scale: 0.6, opacity: 0, duration: 0.8, stagger: 0.14, delay: 0.25, ease: "back.out(2)", scrollTrigger: st(ov) });
    gsap.fromTo($$(".ov__arc path:first-child", ov), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.2, stagger: 0.3, delay: 0.5, ease: "power2.inOut", scrollTrigger: st(ov) });
  });

  // quotes & insight bubbles pop from their speaker
  $$("[data-quote]").forEach((q, i) => gsap.from(q, { y: 40, scale: 0.86, opacity: 0, duration: 0.8, delay: (i % 4) * 0.08, ease: "back.out(1.6)", transformOrigin: i % 2 ? "100% 50%" : "0% 50%", scrollTrigger: st(q, "top 88%") }));

  // floating illustration
  $$("[data-float]").forEach((f) => gsap.to(f, { y: -14, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut" }));

  // persona cards
  $$(".persona__grid").forEach((g) => gsap.from(g.querySelectorAll("[data-persona-card]"), { y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: "power3.out", scrollTrigger: st(g) }));
  $$(".persona__ic").forEach((ic) => gsap.from(ic, { scale: 0, rotate: -60, duration: 0.7, ease: "back.out(2.4)", scrollTrigger: st(ic, "top 85%") }));

  // feature list
  $$(".feat__r ul").forEach((u) => gsap.from(u.children, { x: 60, opacity: 0, duration: 0.7, stagger: 0.07, ease: "power3.out", scrollTrigger: st(u) }));

  // swatches
  $$(".ds__colors").forEach((d) => gsap.from(d.children, { y: 40, scale: 0.8, opacity: 0, duration: 0.7, stagger: 0.06, ease: "back.out(1.8)", scrollTrigger: st(d) }));

  // screens: stagger + gentle depth
  $$("[data-scr-row]").forEach((row) => {
    const items = $$("[data-scr-item]", row);
    gsap.from(items, { y: 90, opacity: 0, rotate: (i: number) => (i % 2 ? 3 : -3), duration: 1, stagger: 0.1, ease: "power3.out", scrollTrigger: st(row, "top 82%") });
  });

  // Little Roots ecosystem
  $$("[data-chain]").forEach((c) => {
    gsap.fromTo(c.querySelector("[data-wire]"), { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: c, start: "top 75%", end: "bottom 60%", scrub: 0.6 } });
    gsap.from($$("[data-node]", c), { x: (i: number) => (i % 2 ? 60 : -60), opacity: 0, duration: 0.9, stagger: 0.18, ease: "power3.out", scrollTrigger: st(c) });
  });
  gsap.from("[data-journey]", { scale: 0.6, opacity: 0, duration: 0.5, stagger: 0.07, ease: "back.out(2)", scrollTrigger: st(".eco__journey") });
  gsap.from("[data-spot]", { scale: 0, duration: 0.6, stagger: 0.08, ease: "back.out(2.4)", scrollTrigger: st(".kit__photo", "top 60%") });

  // how it works
  $$("[data-how]").forEach((h) => {
    gsap.fromTo(h.querySelector("[data-how-path]"), { opacity: 0 }, { opacity: 1, duration: 1, scrollTrigger: st(h) });
    gsap.from($$("[data-how-step]", h), { y: 60, opacity: 0, duration: 0.9, stagger: 0.12, ease: "power3.out", scrollTrigger: st(h) });
    gsap.from($$("[data-how-step] img", h), { scale: 0.7, rotate: -8, duration: 1.1, stagger: 0.12, ease: "back.out(1.6)", scrollTrigger: st(h) });
  });

  // SUS bars + count
  $$("[data-sus]").forEach((s) => {
    gsap.from($$("[data-sus-fill]", s), { scaleX: 0, duration: 1.4, stagger: 0.12, ease: "power3.out", scrollTrigger: st(s) });
    const n = s.querySelector<HTMLElement>("[data-count]");
    if (n) { const o = { v: 0 }; gsap.to(o, { v: parseFloat(n.dataset.count!), duration: 1.8, ease: "power2.out", scrollTrigger: st(s), onUpdate: () => (n.textContent = o.v.toFixed(1)) }); }
  });

  // methods / stats / cards fall back on data-reveal (site.ts)
  addEventListener("load", () => ScrollTrigger.refresh());
}
