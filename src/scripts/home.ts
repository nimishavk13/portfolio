// Homepage choreography (GSAP + ScrollTrigger, smoothed by Lenis).
// Wide screens: the glass cover pins, and scrolling flies through it into the introduction.
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function initHome() {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const words = gsap.utils.toArray<HTMLElement>(".contact__say .sw");
  const fill = (w: HTMLElement) => (w.closest(".say--b") ? "#1d59bb" : "#0b0b0f");
  if (reduce) { words.forEach((w) => (w.style.color = fill(w))); return; }

  gsap.registerPlugin(ScrollTrigger);
  gsap.config({ nullTargetWarn: false });
  const q = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s)!;
  const all = (s: string) => gsap.utils.toArray<HTMLElement>(s);

  /* ---------- load: the cover comes alive ---------- */
  gsap.timeline({ defaults: { ease: "expo.out" } })
    .from("[data-blob]", { scale: 0, opacity: 0, duration: 2, stagger: 0.12 }, 0)
    .fromTo("[data-ring] circle", { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 2.4, ease: "power3.inOut", stagger: 0.2 }, 0.1)
    .from("[data-glass]", { y: 120, rotationX: 24, scale: 0.86, opacity: 0, filter: "blur(18px)", duration: 1.6, clearProps: "filter" }, 0.25)
    .from("[data-cover-k]", { y: 30, opacity: 0, duration: 1 }, 0.6)
    .from(".glass__word .ch > span", { yPercent: 115, rotate: 12, duration: 1.2, stagger: 0.05 }, 0.65)
    .from("[data-cover-year]", { scale: 0, rotate: -30, opacity: 0, duration: 1.1, ease: "back.out(2.4)" }, 1.15)
    .from("[data-cover-by]", { y: 20, opacity: 0, duration: 0.9 }, 1.2)
    .from("[data-cue]", { opacity: 0, y: -14, duration: 0.8 }, 1.6);

  /* ---------- pointer: card tilts, sheen follows, shapes drift ---------- */
  if (matchMedia("(pointer: fine)").matches) {
    const glass = q("[data-glass]");
    const rx = gsap.quickTo(glass, "rotationX", { duration: 0.9, ease: "power3" });
    const ry = gsap.quickTo(glass, "rotationY", { duration: 0.9, ease: "power3" });
    const bx = gsap.quickTo("[data-blobs]", "x", { duration: 1.6, ease: "power3" });
    const by = gsap.quickTo("[data-blobs]", "y", { duration: 1.6, ease: "power3" });
    q("[data-cover]").addEventListener("pointermove", (e) => {
      const nx = e.clientX / innerWidth - 0.5, ny = e.clientY / innerHeight - 0.5;
      rx(-ny * 9); ry(nx * 11); bx(-nx * 60); by(-ny * 50);
      const r = glass.getBoundingClientRect();
      glass.style.setProperty("--sx", `${((e.clientX - r.left) / r.width) * 100}%`);
      glass.style.setProperty("--sy", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
    q("[data-cover]").addEventListener("pointerleave", () => { rx(0); ry(0); bx(0); by(0); });
  }

  const mm = gsap.matchMedia();

  /* ---------- fly through the card into the introduction ---------- */
  mm.add("(min-width: 901px) and (min-height: 600px)", () => {
    document.documentElement.classList.add("hero-pinned");
    const intro = q("[data-intro]"), cover = q("[data-cover]");
    gsap.set("[data-intro-title] .iw > span, [data-intro-lede] .iw > span", { yPercent: 110 });
    gsap.set("[data-intro-pill], [data-intro-sign], [data-intro-ctas]", { opacity: 0, y: 24 });
    gsap.set("[data-intro-photo]", { y: 160, rotation: 10, scale: 0.85, opacity: 0 });
    gsap.set("[data-intro-badge]", { scale: 0, rotation: -120 });
    gsap.set("[data-intro-loc]", { x: -60, opacity: 0 });
    const dirs = [[-1, -1], [1, -0.6], [1, 1], [-1, 1], [0.2, -1]];

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: "[data-hero]", start: "top top", end: "bottom bottom", scrub: 1,
        onUpdate: (st) => { cover.style.pointerEvents = st.progress > 0.35 ? "none" : ""; },
      },
    });
    tl.to("[data-cue]", { opacity: 0, duration: 0.15 }, 0)
      .to("[data-glass-wrap]", { scale: 2.8, duration: 1, ease: "power2.in" }, 0)
      .to("[data-glass-wrap]", { opacity: 0, duration: 0.35, ease: "power1.in" }, 0.62)
      .to(".glass__word .ch > span", { yPercent: (i: number) => (i % 2 ? -30 : 30), duration: 1, ease: "power1.in" }, 0)
      .to("[data-blob]", { x: (i: number) => dirs[i][0] * innerWidth * 0.5, y: (i: number) => dirs[i][1] * innerHeight * 0.55, scale: 1.7, opacity: 0, duration: 1.1, ease: "power2.in" }, 0.05)
      .to("[data-ring]", { rotation: (i: number) => (i ? -100 : 100), scale: 1.8, opacity: 0, duration: 1, ease: "power2.in" }, 0)
      .to(cover, { autoAlpha: 0, duration: 0.25 }, 0.95)
      .from(".intro__wash", { opacity: 0, scale: 1.4, duration: 0.8, ease: "power2.out" }, 0.9)
      .to("[data-intro-photo]", { y: 0, rotation: 2.5, scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }, 1.0)
      .to("[data-intro-pill]", { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 1.05)
      .to("[data-intro-title] .iw > span", { yPercent: 0, duration: 0.55, stagger: 0.09, ease: "power3.out" }, 1.1)
      .to("[data-intro-lede] .iw > span", { yPercent: 0, duration: 0.4, stagger: 0.01, ease: "power3.out" }, 1.3)
      .to("[data-intro-badge]", { scale: 1, rotation: 0, duration: 0.5, ease: "back.out(2.4)" }, 1.45)
      .to("[data-intro-loc]", { x: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 1.55)
      .to("[data-intro-sign], [data-intro-ctas]", { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: "power2.out" }, 1.65)
      .to({}, { duration: 0.45 });
    gsap.set(intro, { zIndex: 1 });
    return () => document.documentElement.classList.remove("hero-pinned");
  });

  mm.add("(max-width: 900px), (max-height: 599px)", () => {
    gsap.from("[data-intro-title] .iw > span", { yPercent: 110, duration: 0.9, stagger: 0.1, ease: "power3.out", scrollTrigger: { trigger: "[data-intro]", start: "top 75%" } });
    gsap.from("[data-intro-photo]", { y: 80, rotation: 8, opacity: 0, duration: 1.1, ease: "power3.out", scrollTrigger: { trigger: "[data-intro-photo]", start: "top 88%" } });
    gsap.from("[data-intro-badge]", { scale: 0, rotation: -90, duration: 0.8, ease: "back.out(2)", scrollTrigger: { trigger: "[data-intro-photo]", start: "top 70%" } });
  });

  /* ---------- about ---------- */
  gsap.from("[data-about-title] span", { yPercent: 60, opacity: 0, duration: 1, stagger: 0.12, ease: "power3.out", scrollTrigger: { trigger: "[data-about-title]", start: "top 85%" } });
  gsap.from("[data-panel]", { y: 100, rotation: (i: number) => [-4, 2, 4][i], opacity: 0, duration: 1.1, stagger: 0.14, ease: "power3.out", scrollTrigger: { trigger: ".trio", start: "top 82%" } });
  gsap.from("[data-chip]", { scale: 0.4, opacity: 0, duration: 0.5, stagger: 0.03, ease: "back.out(2.2)", scrollTrigger: { trigger: ".skills", start: "top 72%" } });
  gsap.from("[data-cursor]", { x: -120, y: -160, rotation: -40, opacity: 0, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".skills", start: "top 60%" } });
  gsap.from("[data-tool]", { y: 40, scale: 0.7, opacity: 0, duration: 0.7, stagger: 0.07, ease: "back.out(1.8)", scrollTrigger: { trigger: ".tools", start: "top 72%" } });

  /* ---------- process ---------- */
  gsap.fromTo("[data-flow-path]", { strokeDashoffset: 1 }, { strokeDashoffset: 0, ease: "none", scrollTrigger: { trigger: "[data-flow]", start: "top 80%", end: "bottom 60%", scrub: 0.8 } });
  gsap.from("[data-step]", { y: 80, opacity: 0, scale: 0.9, duration: 1, stagger: 0.14, ease: "back.out(1.4)", scrollTrigger: { trigger: "[data-flow]", start: "top 78%" } });

  /* ---------- selected work ---------- */
  all("[data-row]").forEach((row, i) => {
    const frame = row.querySelector("[data-row-frame]")!;
    const img = row.querySelector("[data-row-img]")!;
    gsap.fromTo(frame, { clipPath: "inset(14% 10% 14% 10% round 40px)" }, { clipPath: "inset(0% 0% 0% 0% round 40px)", ease: "none", scrollTrigger: { trigger: row, start: "top 92%", end: "top 35%", scrub: 0.8 } });
    gsap.fromTo(img, { yPercent: -6, scale: 1.15 }, { yPercent: 6, scale: 1, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.fromTo(row.querySelector("[data-row-lens]"), { y: 80 }, { y: -80, ease: "none", scrollTrigger: { trigger: row, start: "top bottom", end: "bottom top", scrub: true } });
    gsap.from(row.querySelector("[data-row-lens]"), { scale: 0, duration: 1.2, ease: "back.out(1.6)", scrollTrigger: { trigger: row, start: "top 70%" } });
    gsap.from(row.querySelector("[data-row-dot]"), { scale: 0, duration: 0.9, delay: 0.3, ease: "back.out(2.6)", scrollTrigger: { trigger: row, start: "top 70%" } });
    gsap.from(row.querySelectorAll(".row__copy > *"), { x: i % 2 ? -50 : 50, opacity: 0, duration: 1, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: row, start: "top 70%" } });
  });

  /* ---------- contact: words fill in as you read ---------- */
  const say = gsap.timeline({ scrollTrigger: { trigger: "[data-say]", start: "top 85%", end: "bottom 50%", scrub: 0.6 } });
  words.forEach((w, i) => say.to(w, { color: fill(w), duration: 0.3, ease: "none" }, i * 0.1));
  gsap.fromTo("[data-cglow]", { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, ease: "none", scrollTrigger: { trigger: ".contact", start: "top bottom", end: "center center", scrub: true } });

  addEventListener("load", () => ScrollTrigger.refresh());
}
