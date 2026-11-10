// One smooth-scroll engine for the whole site, driven by GSAP's ticker so
// ScrollTrigger and Lenis never fight. Skipped entirely for reduced motion.
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let lenis: Lenis | null = null;

export function getLenis() { return lenis; }

export function initSmooth() {
  if (lenis || matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  gsap.registerPlugin(ScrollTrigger);
  lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true, anchors: { offset: -84 } });
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  document.documentElement.classList.add("lenis-on");
  return lenis;
}
