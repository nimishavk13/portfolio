// The four projects, in the order they appear in "Selected work" (Figma frame 4).
// Card copy is exactly as written in Figma.
export type Project = {
  slug: string;
  title: string;
  summary: string;   // line shown on the card
  cardImage: string; // /img/home/…
  cardAlt: string;
  no: string;        // project number on its cover slide
  focus: string;     // cover slide: "Project N : <focus>"
  tags: string[];    // cover slide: duration | domain | type
  color: string;
};

export const projects: Project[] = [
  {
    slug: "little-roots",
    title: "Little Roots",
    summary: "AI-integrated gardening kit and app for children aged 5–12.",
    cardImage: "/img/home/work-little-roots.webp",
    cardAlt: "A whale-shaped planter with basil next to a tablet showing the Little Roots app home screen",
    no: "01",
    focus: "Child-Centred Design",
    tags: ["2 months", "Plant care", "Phygital product"],
    color: "var(--lr)",
  },
  {
    slug: "hormona",
    title: "Hormona",
    summary: "Women’s menstrual health app.",
    cardImage: "/img/home/work-hormona.webp",
    cardAlt: "Two phones showing Hormona’s cycle tracker calendar and care screen",
    no: "03",
    focus: "Healthcare",
    tags: ["3 months", "Menstrual health", "Mobile app"],
    color: "var(--ho)",
  },
  {
    slug: "mentora",
    title: "Mentora",
    summary: "Career guidance platform for individuals with CVD.",
    cardImage: "/img/home/work-mentora.webp",
    cardAlt: "A phone showing Mentora’s home screen: “Hello Rohan! Ready to explore your path today?”",
    no: "02",
    focus: "Inclusive Design",
    tags: ["3 months", "EdTech", "Mobile app"],
    color: "var(--me)",
  },
  {
    slug: "yeola-paithani",
    title: "Yeola Paithani",
    summary: "Craft documentation website.",
    cardImage: "/img/home/work-yeola-paithani.webp",
    cardAlt: "A laptop showing the Yeola Paithani website beside a folded Paithani saree",
    no: "04",
    focus: "Craft Documentation",
    tags: ["3 months", "Craft study", "Website"],
    color: "var(--ye)",
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug)!;
export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};
