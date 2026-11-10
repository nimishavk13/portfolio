// Case-study content model. Text supports **bold** and ==highlight== (project colour).
export type Img = { src: string; alt: string; w: number; h: number };
export type Col = { title: string; icon?: "pain" | "needs" | "goals"; items: string[] };

export type Block =
  | { t: "overview"; problem: string; impact: string; solution: string; problemList?: string[]; solutionList?: string[] }
  | { t: "split"; heading: string; text?: string; image?: Img; items: { title: string; desc: string }[]; note?: string; reverse?: boolean }
  | { t: "quotes"; label: string; items: { q: string; who: string; avatar?: Img }[] }
  | { t: "insights"; label: string; image: Img; items: string[] }
  | { t: "methods"; items: { title: string; text: string; tag?: string; list?: string[]; icon?: Img; facts?: { k: string; v: string }[] }[] }
  | { t: "stats"; label: string; groups: { name: string; items: { v: string; l: string }[] }[] }
  | { t: "persona"; tag: string; photo: Img; name: string; facts: [string, string][]; scenario: string; cols: Col[]; switchKey?: string }
  | { t: "problem"; statement: string; extra?: string; hmw: string; image: Img }
  | { t: "features"; heading: string; text?: string; items: string[] }
  | { t: "cards"; items: { n?: string; title: string; desc: string }[]; tone?: "soft" | "pop"; cols?: 2 | 3 }
  | { t: "figure"; image: Img; caption?: string; tall?: boolean }
  | { t: "ecosystem" }
  | { t: "visual" }
  | { t: "designsys"; colors: { hex: string; name: string }[]; fonts: { name: string; css: string }[] }
  | { t: "screens"; device: "phone" | "tablet"; intro?: string; items: (Img & { title: string; desc?: string })[]; cvd?: boolean; journey?: boolean }
  | { t: "kit" }
  | { t: "how" }
  | { t: "sus" }
  | { t: "journeys" }
  | { t: "lead"; text: string };

export type Section = { id: string; nav: string; title: string; sub?: string; tag?: string; blocks: Block[] };

export type CaseStudy = {
  slug: string;
  fonts: { display: string; body: string };
  theme: { pop: string; deep: string; tint: string };
  facts: [string, string][];
  sections: Section[];
};
