/*
  Hero choreography for Figma frame 1.

  Scroll progress (0 → 1 across the pinned section) drives every element from a
  scattered start state into its exact Figma position. Each element has its own
  path (x/y offset, rotation, scale) and its own window of the scroll, so the
  composition assembles in layers: background orbs first, then the glass card,
  then the type. After assembly the card lifts and hands over to the Intro.

  Cursor (fine pointers): orbs drift by depth, rings turn slightly, card tilts ≤4°.
  Touch: drag moves the same parallax; orbs also float gently on their own.
  Reduced motion: final composition, no movement.
*/

type Path = {
  x: number; y: number;          // start offset in design px
  r?: number; s?: number;        // start rotation (deg), start scale
  o?: number;                    // start opacity (only the faint glass card uses this)
  from: number; to: number;      // scroll window within 0..1
  depth?: number;                // cursor parallax in design px
  layer: "bg" | "fg";
};

const PATHS: Record<string, Path> = {
  // background — settles first
  o50: { x: -420, y: -300, s: 1.25, from: 0.0, to: 0.5, depth: 22, layer: "bg" },
  o48: { x: 380, y: 300, s: 1.3, from: 0.0, to: 0.52, depth: 26, layer: "bg" },
  o49: { x: 460, y: -220, s: 0.6, from: 0.04, to: 0.56, depth: 40, layer: "bg" },
  o52: { x: -360, y: 260, s: 0.7, from: 0.06, to: 0.58, depth: 52, layer: "bg" },
  o51: { x: -60, y: 460, s: 0.5, from: 0.08, to: 0.6, depth: 46, layer: "bg" },
  r53: { x: 300, y: -300, r: 50, s: 1.15, from: 0.04, to: 0.6, depth: 12, layer: "bg" },
  r54: { x: -300, y: 300, r: -50, s: 1.15, from: 0.04, to: 0.6, depth: 12, layer: "bg" },
  // foreground — card, then type
  card: { x: 0, y: 240, r: -3, s: 0.86, o: 0, from: 0.22, to: 0.66, layer: "fg" },
  uiux: { x: -340, y: -130, r: -5, from: 0.34, to: 0.74, layer: "fg" },
  portfolio: { x: 0, y: 230, s: 0.92, from: 0.38, to: 0.78, layer: "fg" },
  year: { x: 380, y: -170, r: 9, from: 0.44, to: 0.8, layer: "fg" },
  name: { x: 0, y: 210, from: 0.5, to: 0.84, layer: "fg" },
};

const ASSEMBLED_AT = 0.86; // after this, the card lifts and hands over

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function initHero() {
  const section = document.querySelector<HTMLElement>("[data-hero]");
  if (!section) return;
  const sticky = section.firstElementChild as HTMLElement;
  const fg = section.querySelector<HTMLElement>("[data-fg]")!;
  const tilt = section.querySelector<HTMLElement>("[data-tilt]")!;
  const hint = section.querySelector<HTMLElement>("[data-hint]");
  const els = Object.keys(PATHS)
    .map((k) => ({ key: k, el: section.querySelector<HTMLElement>(`[data-el="${k}"]`), p: PATHS[k] }))
    .filter((e): e is { key: string; el: HTMLElement; p: Path } => !!e.el);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reduced.matches) return; // CSS already renders the final Figma composition

  let target = 0;  // raw scroll progress
  let shown = 0;   // smoothed progress
  let mx = 0, my = 0, tmx = 0, tmy = 0; // pointer, smoothed / target (-1..1)
  let unitB = 1, unitF = 1;
  let visible = true;
  let running = false;
  const t0 = performance.now();

  const measure = () => {
    const vw = window.innerWidth, vh = sticky.clientHeight;
    unitB = Math.max(vw / 1920, vh / 1080);
    unitF = fg.getBoundingClientRect().width / 1353 || Math.min(vw / 1920, vh / 1080);
  };

  const readScroll = () => {
    const r = section.getBoundingClientRect();
    const track = section.offsetHeight - sticky.clientHeight;
    target = clamp(-r.top / Math.max(1, track));
  };

  const frame = (now: number) => {
    running = false;
    readScroll();
    shown = lerp(shown, target, 0.14);
    if (Math.abs(shown - target) < 0.0004) shown = target;
    mx = lerp(mx, tmx, 0.08);
    my = lerp(my, tmy, 0.08);

    const time = (now - t0) / 1000;
    const assembled = clamp(shown / ASSEMBLED_AT);
    const lift = clamp((shown - ASSEMBLED_AT) / (1 - ASSEMBLED_AT));

    for (const { el, p, key } of els) {
      const local = easeInOut(clamp((assembled - p.from) / (p.to - p.from)));
      const inv = 1 - local;
      const u = p.layer === "bg" ? unitB : unitF;
      let x = p.x * inv * u;
      let y = p.y * inv * u;
      let r = (p.r ?? 0) * inv;
      const s = lerp(p.s ?? 1, 1, local);

      if (p.layer === "bg") {
        // cursor parallax + slow idle float (keeps the scene alive on touch screens)
        const d = (p.depth ?? 0) * u;
        const seed = key.charCodeAt(1) + key.charCodeAt(2);
        x += mx * d + Math.sin(time * 0.35 + seed) * 6 * u;
        y += my * d + Math.cos(time * 0.3 + seed) * 6 * u - lift * 90 * u * (d ? d / u / 30 : 1);
        if (key.startsWith("r")) r += mx * 4;
      }
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${r.toFixed(2)}deg) scale(${s.toFixed(4)})`;
      if (p.o !== undefined) el.style.opacity = String(lerp(p.o, 1, clamp(local * 1.8)));
    }

    // card tilt follows the pointer; lift hands the scene to the Intro section
    const tiltAmt = 0.4 + 0.6 * assembled;
    tilt.style.transform =
      `translate3d(0, ${(-lift * 14).toFixed(2)}vh, 0) scale(${(1 - lift * 0.06).toFixed(4)}) ` +
      `rotateY(${(mx * 4 * tiltAmt).toFixed(2)}deg) rotateX(${(-my * 3 * tiltAmt).toFixed(2)}deg)`;
    if (hint) hint.style.opacity = String(1 - clamp(shown * 12));

    if (visible) schedule();
  };

  const schedule = () => { if (!running) { running = true; requestAnimationFrame(frame); } };

  // pointer — mouse hovers, touch drags; both feed the same parallax
  const onMove = (e: PointerEvent) => {
    if (e.pointerType !== "mouse" && e.buttons === 0 && e.pressure === 0) return;
    tmx = clamp((e.clientX / window.innerWidth) * 2 - 1, -1, 1);
    tmy = clamp((e.clientY / window.innerHeight) * 2 - 1, -1, 1);
  };
  const onLeave = () => { tmx = 0; tmy = 0; };
  sticky.addEventListener("pointermove", onMove, { passive: true });
  sticky.addEventListener("pointerleave", onLeave);
  sticky.addEventListener("pointerup", (e) => { if (e.pointerType !== "mouse") onLeave(); });
  sticky.addEventListener("pointercancel", onLeave);

  // only animate while the hero is on screen
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) schedule(); }).observe(section);

  window.addEventListener("resize", measure);
  reduced.addEventListener?.("change", () => location.reload());
  measure();
  readScroll();
  shown = target; // no catch-up animation when the page loads mid-scroll
  schedule();
}
