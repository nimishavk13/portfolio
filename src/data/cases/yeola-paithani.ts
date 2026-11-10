import type { CaseStudy } from "../case-types";
const v = (n: string) => `/img/v2/${n}.webp`;

const study: CaseStudy = {
  slug: "yeola-paithani",
  fonts: { display: "var(--f-head)", body: "var(--f-body)" },
  theme: { pop: "#fcefd4", deep: "#4f1a33", tint: "#fcefd4" },
  facts: [["Role", "Individual project"], ["Duration", "3 months"], ["Domain", "Craft study"], ["Format", "Website"]],
  sections: [
    {
      id: "overview", nav: "Overview", title: "Project overview",
      blocks: [{
        t: "overview",
        problem: "Power-loom imitations, low buyer awareness and the absence of a trusted digital platform make it hard for authentic Paithani weavers to showcase their work, and for buyers to verify what they purchase.",
        problemList: ["Market dilution by power-loom copies", "No reliable authenticity signal", "Limited learner access to training"],
        impact: "Weaving is the primary income for most families in Yeola. Falling demand and rising raw-material costs erode artisan income, threaten the continuity of a 2,000-year-old craft, and dilute its cultural value.",
        solution: "A digital platform that lets weavers tell their story, lets buyers verify authenticity through transparent product education, and opens skill development to learners outside the local cluster.",
        solutionList: ["Artisan-led storytelling", "Verified authenticity layer", "Open digital workshops"],
      }],
    },
    {
      id: "research", nav: "Research", title: "Research", sub: "Methods followed",
      blocks: [{
        t: "methods",
        items: [
          {
            title: "Primary research",
            text: "On-ground field documentation at **Nagde, Yeola (Maharashtra)** with award-winning master weaver **Mr. Rameshsingh R. Pardeshi** (32+ years, National Award 2014) at his workshop, Darshan Handlooms.",
            facts: [{ k: "Interviews", v: "1 master · in-depth, 2 supporting" }, { k: "Process observation", v: "Fibre → fabric, all 18 steps" }, { k: "Workshop visits", v: "9 looms across 2 weaving units" }, { k: "Tools & materials audit", v: "Silk, zari, kakda, charkha, loom" }],
          },
          {
            title: "Secondary research",
            text: "Cross-referenced with publications from the **Central Silk Board, Ministry of Textiles**, the GI Tag registry (Yeola Paithani · 03 Sept 2010), Silk Mark / Handloom Mark frameworks, and historical literature.",
            facts: [{ k: "Historical sources", v: "Satavahana → Mughal → Peshwa eras" }, { k: "Govt. records", v: "GI Tag · Silk Mark · RCMC · MCG" }, { k: "Brand studies", v: "Kanakavalli · Tilfi · Taneira · VMI" }, { k: "Cultural context", v: "Weddings · festivals · heirloom use" }],
          },
        ],
      }],
    },
    {
      id: "effects", nav: "Who it affects", title: "Effects on individuals’ lives",
      blocks: [{
        t: "cards", cols: 3, tone: "pop",
        items: [
          { title: "Artisans", desc: "Unstable income, market competition from power-looms, language barriers at exhibitions, and physical strain: the master weaver was diagnosed with spondylitis from long static posture." },
          { title: "Learners", desc: "Skill-development workshops are limited to local villagers who can physically reach the units; outsiders cannot access training or formal apprenticeship." },
          { title: "Buyers", desc: "Cannot tell handwoven from power-loom Paithani, fear being overcharged or scammed, and lack a trusted place to buy." },
        ],
      }],
    },
    {
      id: "users", nav: "Users", title: "Understanding the user",
      blocks: [
        {
          t: "persona", tag: "Persona · Artisan",
          photo: { src: v("ye-artisan"), alt: "Rameshsingh weaving at a handloom", w: 359, h: 440 },
          name: "Rameshsingh", facts: [["Age", "49"], ["Location", "Yeola"], ["Occupation", "Master weaver"]],
          scenario: "Rameshsingh struggles with unstable income due to machine-made competition and lacks a platform to communicate the authenticity of his craft.",
          cols: [
            { title: "Pain points", icon: "pain", items: ["Unstable income due to low demand and machine-made competition.", "Cannot communicate authenticity.", "High raw-material cost, unreliable sourcing."] },
            { title: "Needs", icon: "needs", items: ["A trusted space to tell his personal craft story.", "Access to affordable raw materials.", "Training support (design tools / digital literacy)."] },
          ],
        },
        {
          t: "persona", tag: "Persona · Buyer",
          photo: { src: v("ye-buyer"), alt: "Shalini, smiling, in a blue saree", w: 423, h: 423 },
          name: "Shalini Kadam", facts: [["Age", "30"], ["Location", "Mumbai"], ["Occupation", "Housewife"]],
          scenario: "Shalini struggles to trust and choose authentic handloom products due to a lack of clear information and reliable verification.",
          cols: [
            { title: "Pain points", icon: "pain", items: ["Cannot tell an original from a power-loom copy.", "Confused about pricing and quality.", "Lack of a trusted digital presence.", "Fear of being overcharged or scammed."] },
            { title: "Needs", icon: "needs", items: ["A reliable source to verify authenticity.", "Transparent product info: process, price, value.", "A platform to discover trusted weavers.", "Easy browsing of designs, motifs and colours."] },
          ],
        },
      ],
    },
    {
      id: "problem", nav: "Problem", title: "Problem statement",
      blocks: [{
        t: "problem",
        statement: "Paithani **weavers and buyers struggle to showcase and verify authentic handwoven sarees** due to the absence of a trusted digital platform, **leading to low awareness, reduced trust and fewer sales.**",
        extra: "Additionally, learners and artisans lack accessible training and affordable raw-material sourcing, causing restricted knowledge transfer and higher production costs.",
        hmw: "How might we **create a trusted digital home for Paithani**, one **that verifies authenticity, amplifies artisan stories**, and opens the craft to buyers everywhere?",
        image: { src: v("ye-hmw"), alt: "", w: 555, h: 480 },
      }],
    },
    {
      id: "platform", nav: "The platform", title: "What does the platform do?",
      blocks: [{
        t: "cards", cols: 3, tone: "pop",
        items: [
          { n: "01", title: "Authenticity layer", desc: "GI Tag + Silk Mark verification on every saree, with weaver attribution." },
          { n: "02", title: "Artisan storytelling", desc: "Profiles, video introductions and behind-the-loom documentation." },
          { n: "03", title: "Motif archive", desc: "Searchable library of traditional motifs (Bangdi Mor, Asawali, Kamal…)." },
          { n: "04", title: "Open workshops", desc: "Online craft education modules for learners outside the cluster." },
          { n: "05", title: "Buyer catalogue", desc: "Browse by weave, motif and colour, with a transparent pricing breakdown." },
          { n: "06", title: "Material co-op", desc: "Cooperative bulk-sourcing for affordable, certified raw materials." },
        ],
      }],
    },
    {
      id: "website", nav: "Website", title: "The website",
      blocks: [
        { t: "lead", text: "The website opens on the loom itself: **“Experience the timeless art of Paithani sarees through interactive storytelling, connect with master artisans, and create your own masterpiece.”** From there, visitors learn the craft, meet the artisans, follow the weaving process from raw cocoon to silk thread, and check authenticity." },
        { t: "figure", image: { src: v("ye-website"), alt: "Yeola Paithani website home: a weaver at the loom with the headline Yeola Paithani", w: 1600, h: 882 }, caption: "Home: Learn the craft · Meet artisans · Weaving process · Authenticity check" },
        { t: "figure", image: { src: v("ye-cover"), alt: "Website pages: natural lustre authenticity check, the home page, and the cocoon sorting and degumming steps of the weaving process", w: 1200, h: 1510 }, caption: "Authenticity check and the weaving process, from cocoon sorting to degumming" },
      ],
    },
  ],
};
export default study;
