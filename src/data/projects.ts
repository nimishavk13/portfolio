// The four projects, in the order of her PDF. Wording comes from each cover slide.
export type Project = {
  slug: string;
  n: number;
  title: string;
  kicker: string;      // "Project 1 : Child-Centred Design"
  meta: string[];      // duration | domain | format
  type: string;        // UX Case study / UX Research
  summary: string;     // one-liner from Selected work
  intro: string;       // cover paragraph
  image: string;
  hero: string;        // portrait image for the case-study cover
  imageAlt: string;
  color: string;       // main project colour
  soft: string;        // soft panel colour
  ink: string;         // text on soft colour
};

export const projects: Project[] = [
  {
    slug: "little-roots",
    n: 1,
    title: "Little Roots",
    kicker: "Child-Centred Design",
    meta: ["2 months", "Plant care", "Phygital product"],
    type: "UX Case study",
    summary: "AI-integrated gardening kit and app for children aged 5–12.",
    intro:
      "An AI-integrated gardening kit and mobile app that helps children aged 5–12 learn plant care through hands-on gardening, plant identification, health monitoring and interactive growth tracking.",
    image: "/img/home/work-little-roots.webp",
    hero: "/img/v2/lr-hero.webp",
    imageAlt: "The whale-shaped planter with basil next to a tablet showing the Little Roots app home screen",
    color: "#315e3b",
    soft: "#e1e9d6",
    ink: "#1f3d26",
  },
  {
    slug: "mentora",
    n: 2,
    title: "Mentora",
    kicker: "Inclusive Design",
    meta: ["3 months", "EdTech", "Mobile app"],
    type: "UX Case study",
    summary: "Career guidance platform for individuals with Colour Vision Deficiency.",
    intro:
      "A career guidance app for people with Colour Vision Deficiency. It maps careers by colour dependency, surfaces CVD-safe alternatives and delivers personalised guidance, so career decisions are informed, not accidental.",
    image: "/img/home/work-mentora.webp",
    hero: "/img/v2/me-hero.webp",
    imageAlt: "A phone showing Mentora’s home screen: “Hello Rohan! Ready to explore your path today?”",
    color: "#1e5bbb",
    soft: "#dfe7f6",
    ink: "#0f3576",
  },
  {
    slug: "hormona",
    n: 3,
    title: "Hormona",
    kicker: "Healthcare",
    meta: ["3 months", "Menstrual health", "Mobile app"],
    type: "UX Case study",
    summary: "Women’s health app for perimenopause and postpartum recovery.",
    intro:
      "A women’s health app that supports perimenopause and postpartum recovery. Cycle tracking, symptom logging, breastfeeding tools, wellness programs and community support live in one simple platform, so women feel guided, not overwhelmed.",
    image: "/img/home/work-hormona.webp",
    hero: "/img/v2/ho-hero.webp",
    imageAlt: "Two phones showing Hormona’s cycle tracker calendar and care screen",
    color: "#a24a6f",
    soft: "#fbe4ec",
    ink: "#7a2d50",
  },
  {
    slug: "yeola-paithani",
    n: 4,
    title: "Yeola Paithani",
    kicker: "Craft Documentation",
    meta: ["3 months", "Craft study", "Website"],
    type: "UX Research",
    summary: "Craft documentation website for the Paithani weavers of Yeola.",
    intro:
      "A study of the Paithani craft, its makers and the cultural ecosystem around it through the lens of UX research, uncovering insights that bridge heritage craftsmanship with contemporary design thinking.",
    image: "/img/home/work-yeola-paithani.webp",
    hero: "/img/v2/ye-cover.webp",
    imageAlt: "A laptop showing the Yeola Paithani website beside a folded Paithani saree",
    color: "#6a2645",
    soft: "#f3e6ea",
    ink: "#4f1a33",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)!;
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
