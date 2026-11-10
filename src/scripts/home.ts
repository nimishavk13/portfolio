// Homepage choreography (GSAP + ScrollTrigger).
// Wide screens: the hero pins and the cover slide hands over to the introduction.
// Everywhere: work cards stack like a deck, the process line draws itself,
// about panels deal in, and the closing words fill in as you read them.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initHome() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const words = gsap.utils.toArray<HTMLElement>(".contact__say .sw");
  const fill = (w: HTMLElement) => (w.closest(".say--b") ? "#1d59bb" : "#0b0b0f");
  if (reduce) { words.forEach((w) => (w.style.color = fill(w))); return; }

  gsap.registerPlugin(ScrollTrigger);
  const q = (s: string) => document.querySelector(s);

  /* ---------- load: cover assembles ---------- */
  const load = gsap.timeline({ defaults: { ease: "expo.out" } });
  load
    .from("[data-glow-a], [data-glow-b]", { scale: 0.5, opacity: 0, duration: 1.8, ease: "power2.out" }, 0)
    .fromTo(".ring circle", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.2, ease: "power2.inOut" }, 0.1)
    .from(".cover__word .ch", { yPercent: 115, rotate: 10, duration: 1.2, stagger: 0.05 }, 0.15)
    .from("[data-cover-eyebrow]", { y: 24, opacity: 0, duration: 1 }, 0.3)
    .from("[data-cover-year]", { y: 30, opacity: 0, rotate: -12, duration: 1, ease: "back.out(2)" }, 0.8)
    .from("[data-cover-by] > *", { y: 16, opacity: 0, duration: 0.8, stagger: 0.06 }, 0.75)
    .from("[data-tile]", {
      y: 140, opacity: 0, scale: 0.6, rotation: (i: number) => [-24, 22, 16, -18][i],
      duration: 1.4, ease: "back.out(1.3)", stagger: 0.1,
    }, 0.55)
    .from("[data-cue]", { opacity: 0, y: -10, duration: 0.8 }, 1.4);

  /* ---------- pointer parallax on the cover (fine pointers only) ---------- */
  if (matchMedia("(pointer: fine)").matches) {
    const hero = q("[data-hero]") as HTMLElement;
    const layers = [
      ...gsap.utils.toArray<HTMLElement>("[data-tile] a").map((el, i) => ({ el, d: [26, 18, 22, 30][i] })),
      { el: q("[data-ring-a]") as HTMLElement, d: -14 },
      { el: q("[data-ring-b]") as HTMLElement, d: -20 },
    ].map((l) => ({ x: gsap.quickTo(l.el, "x", { duration: 1, ease: "power3" }), y: gsap.quickTo(l.el, "y", { duration: 1, ease: "power3" }), d: l.d }));
    hero.addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      layers.forEach((l) => { l.x(nx * l.d); l.y(ny * l.d); });
    });
  }

  const mm = gsap.matchMedia();

  /* ---------- hero hand-over (wide screens) ---------- */
  mm.add("(min-width: 901px) and (min-height: 600px)", () => {
    document.documentElement.classList.add("hero-pinned");
    const intro = q("[data-intro]") as HTMLElement;
    const cover = q("[data-cover]") as HTMLElement;
    gsap.set(intro, { pointerEvents: "none" });
    gsap.set("[data-intro-title] .iw > span, [data-intro-lede] .iw > span", { yPercent: 110 });
    gsap.set("[data-intro-pill], [data-intro-sign], [data-intro-ctas]", { opacity: 0, y: 24 });
    gsap.set("[data-intro-photo]", { y: "70vh", rotation: 12, opacity: 0 });
    gsap.set("[data-intro-badge]", { scale: 0, rotation: -90 });
    gsap.set("[data-intro-loc]", { x: -50, opacity: 0 });

    const vw = innerWidth, vh = innerHeight;
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: "[data-hero]", start: "top top", end: "bottom bottom", scrub: 0.9,
        onUpdate: (st) => {
          const shown = st.progress > 0.42;
          intro.style.pointerEvents = shown ? "" : "none";
          cover.style.pointerEvents = shown ? "none" : "";
        },
      },
    });
    tl.to("[data-cover-word] .ch", { x: (i: number) => (i - 4) * 34, yPercent: -40, opacity: 0, duration: 1, ease: "power2.in", stagger: { each: 0.03, from: "center" } }, 0)
      .to("[data-cover-word]", { scale: 0.7, duration: 1, ease: "power1.in" }, 0)
      .to("[data-cover-eyebrow], [data-cover-year], [data-cover-by], [data-cue]", { opacity: 0, y: -40, duration: 0.5 }, 0)
      .to("[data-tile]", {
        x: (i: number) => [-1, 1, -1, 1][i] * vw * 0.45,
        y: (i: number) => [-1, -1, 1, 1][i] * vh * 0.55,
        rotation: (i: number) => [-30, 28, 24, -26][i], scale: 0.7, opacity: 0, duration: 1, ease: "power2.in",
      }, 0)
      .to("[data-ring-a]", { rotation: 120, scale: 1.25, xPercent: -40, yPercent: 30, duration: 2.2 }, 0)
      .to("[data-ring-b]", { rotation: -90, xPercent: 160, yPercent: -40, scale: 0.8, duration: 2.2 }, 0)
      .to("[data-glow-a]", { xPercent: 30, yPercent: 20, duration: 2.2 }, 0)
      .to("[data-glow-b]", { xPercent: -10, yPercent: -30, scale: 1.2, duration: 2.2 }, 0)
      .to("[data-intro-photo]", { y: 0, rotation: 2.5, opacity: 1, duration: 1, ease: "power3.out" }, 0.75)
      .to("[data-intro-pill]", { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.85)
      .to("[data-intro-title] .iw > span", { yPercent: 0, duration: 0.6, stagger: 0.09, ease: "power3.out" }, 0.9)
      .to("[data-intro-lede] .iw > span", { yPercent: 0, duration: 0.45, stagger: 0.012, ease: "power3.out" }, 1.15)
      .to("[data-intro-badge]", { scale: 1, rotation: -14, duration: 0.5, ease: "back.out(2.2)" }, 1.35)
      .to("[data-intro-loc]", { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 1.45)
      .to("[data-intro-sign], [data-intro-ctas]", { opacity: 1, y: 0, duration: 0.45, stagger: 0.1, ease: "power2.out" }, 1.6)
      .to({}, { duration: 0.5 });

    return () => document.documentElement.classList.remove("hero-pinned");
  });

  /* ---------- intro on narrow screens: words rise as it enters ---------- */
  mm.add("(max-width: 900px), (max-height: 599px)", () => {
    gsap.from("[data-intro-title] .iw > span", { yPercent: 110, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: "[data-intro]", start: "top 75%" } });
    gsap.from("[data-intro-photo]", { y: 80, rotation: 8, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: "[data-intro-photo]", start: "top 85%" } });
    gsap.from("[data-intro-badge]", { scale: 0, rotation: -90, duration: 0.8, ease: "back.out(2)", scrollTrigger: { trigger: "[data-intro-photo]", start: "top 70%" } });
  });

  /* ---------- work deck ---------- */
  const cards = gsap.utils.toArray<HTMLElement>("[data-card]");
  mm.add("(min-width: 861px)", () => {
    cards.forEach((card, i) => {
      const inner = card.querySelector("[data-card-in]")!;
      const img = card.querySelector("[data-card-img]")!;
      gsap.fromTo(img, { scale: 1.2 }, { scale: 1.02, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "top 20%", scrub: true } });
      gsap.from(card.querySelectorAll(".card__kicker, .card__meta, .card__title, .card__text, .card__cta"), {
        y: 40, opacity: 0, duration: 0.9, stagger: 0.07, ease: "power3.out",
        scrollTrigger: { trigger: card, start: "top 65%" },
      });
      const next = cards[i + 1];
      if (next) {
        gsap.fromTo(inner, { scale: 1, filter: "brightness(1)" }, {
          scale: 0.9, filter: "brightness(0.86)", ease: "none",
          scrollTrigger: { trigger: next, start: "top bottom", end: "top 20%", scrub: true },
        });
      }
    });
  });
  mm.add("(max-width: 860px)", () => {
    cards.forEach((card) => gsap.from(card, { y: 60, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: card, start: "top 88%" } }));
  });

  /* ---------- process ---------- */
  gsap.fromTo("[data-flow-path]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: "[data-flow]", start: "top 80%", end: "bottom 60%", scrub: 0.6 } });
  gsap.from("[data-step]", { y: 70, opacity: 0, scale: 0.92, duration: 0.9, stagger: 0.14, ease: "back.out(1.4)", scrollTrigger: { trigger: "[data-flow]", start: "top 78%" } });

  /* ---------- about ---------- */
  gsap.from("[data-panel]", { y: 90, rotation: (i: number) => [-3, 2, 3][i], opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: ".trio", start: "top 80%" } });
  gsap.from("[data-chip]", { scale: 0.5, opacity: 0, duration: 0.5, stagger: 0.035, ease: "back.out(2)", scrollTrigger: { trigger: ".panel--skills", start: "top 70%" } });
  gsap.from("[data-tool]", { y: 30, rotation: 8, opacity: 0, duration: 0.6, stagger: 0.07, ease: "back.out(1.8)", scrollTrigger: { trigger: ".panel--tools", start: "top 70%" } });

  /* ---------- contact: words fill in as you read ---------- */
  const say = gsap.timeline({ scrollTrigger: { trigger: "[data-say]", start: "top 82%", end: "bottom 45%", scrub: 0.5 } });
  words.forEach((w, i) => say.to(w, { color: fill(w), duration: 0.3, ease: "none" }, i * 0.1));
  gsap.fromTo("[data-cglow]", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "center center", scrub: true } });

  addEventListener("load", () => ScrollTrigger.refresh());
}
