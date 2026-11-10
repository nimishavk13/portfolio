import type { CaseStudy } from "../case-types";
const v = (n: string) => `/img/v2/${n}.webp`;
const phone = (n: number, title: string, alt: string, desc?: string) => ({ src: v(`ho-screen-${n}`), w: 622, h: 1386, title, alt, desc });

export const journeys = {
  peri: {
    label: "Perimenopause",
    persona: {
      photo: { src: v("ho-neelam"), alt: "Neelam, smiling at her desk in a purple saree", w: 423, h: 423 },
      name: "Neelam Gupta", facts: [["Age", "40"], ["Location", "Pune"], ["Occupation", "Housewife"]] as [string, string][],
      scenario: "Neelam is in her perimenopause phase and is often unsure whether her symptoms are normal.",
      pains: ["Confused by mixed and unclear health advice.", "Feels embarrassed discussing personal symptoms.", "Lacks easy, non-digital ways to track changes."],
      needs: ["Understand if her symptoms are normal or serious.", "Manage mood swings, cramps and hot flashes.", "Know when and which doctor to consult."],
    },
    stats: [{ v: "73%", l: "are 41–50 years old" }, { v: "80%", l: "use Android devices" }, { v: "67%", l: "perimenopause changes" }, { v: "100%", l: "open to a support app" }],
    screens: [
      phone(1, "Homescreen", "Perimenopause home: Good morning Neelam, cycle tracker, quick log and this week's symptoms", "Cycle day, a quick symptom log and this week’s symptoms at a glance."),
      phone(2, "Period dates", "Edit period dates calendar with flow and symptom details", "Log flow and symptoms for each day."),
      phone(3, "Nutrition guide", "Nutrition plans with today's nutrition and recommended meals", "Meals and nutrients that support hormonal balance."),
      phone(4, "Exercise guide", "Wellness programs with strength training and mindfulness progress", "Personalised programs like strength training for bone health."),
    ],
  },
  post: {
    label: "Postpartum",
    persona: {
      photo: { src: v("ho-ishika"), alt: "Ishika, smiling with a laptop, in a green dress", w: 509, h: 560 },
      name: "Ishika Mehta", facts: [["Age", "31"], ["Location", "Kerala"], ["Occupation", "IT Professional"]] as [string, string][],
      scenario: "Ishika is postpartum, confused by her bleeding patterns and struggling to look after herself.",
      pains: ["Confused about bleeding and period signs.", "Mood swings make her feel alone and overwhelmed.", "Hard to find short, reliable information in her busy routine."],
      needs: ["Understand postpartum bleeding vs. first period.", "Balance baby care and self-care without guilt.", "Healthy postpartum care and balance."],
    },
    stats: [{ v: "83%", l: "use Android devices" }, { v: "100%", l: "postpartum challenges" }, { v: "4/6", l: "battle fatigue & low energy" }, { v: "3/6", l: "feel stress & overwhelm" }],
    screens: [
      phone(5, "Recovery tracker", "Recovery tracker with bleeding, pain, energy and emotional state sliders", "Bleeding, pain, energy and mood, logged in seconds."),
      phone(6, "Baby milestones", "Baby milestones with current stats and week-by-week milestones", "The baby’s growth and milestones, week by week."),
    ],
  },
};

const study: CaseStudy = {
  slug: "hormona",
  fonts: { display: "'Nunito', var(--f-head)", body: "'Nunito', var(--f-body)" },
  theme: { pop: "#804595", deep: "#6a2a4a", tint: "#fbe4ec" },
  facts: [["Role", "Individual project"], ["Duration", "3 months"], ["Domain", "Menstrual health"], ["Format", "Mobile app"]],
  sections: [
    {
      id: "overview", nav: "Overview", title: "Project overview",
      blocks: [{
        t: "overview",
        problem: "Women going through postpartum and perimenopause deal with unpredictable cycles, sudden symptoms and emotional ups and downs, yet most apps give them only basic tracking or generic advice.",
        impact: "Symptoms quietly disrupt sleep, work, mood and relationships. Care is often baby-centric or dismissive, and informal sources lead to misinformation and late medical support. Women carry a heavy mental load while switching between multiple disconnected tools.",
        solution: "Hormona is one trustworthy, stage-aware platform that unites cycle and recovery tracking, breastfeeding logs, wellness programs, nutrition, smart reminders and community support, guiding women simply without overwhelming them.",
      }],
    },
    {
      id: "research", nav: "Research", title: "Research", sub: "Methods followed",
      blocks: [{
        t: "methods",
        items: [
          { title: "Primary research", text: "Microsoft surveys with women in perimenopause and postpartum.", icon: { src: v("ho-ic-survey"), alt: "", w: 203, h: 203 } },
          { title: "Secondary research", text: "Reviewed trusted medical and health sources on perimenopause symptoms and postpartum recovery. Studied popular health apps to find gaps in stage-specific support, lifestyle guidance and emotional care.", icon: { src: v("ho-ic-papers"), alt: "", w: 202, h: 203 } },
        ],
      }],
    },
    {
      id: "journeys", nav: "Two journeys", title: "Two stages, two journeys", sub: "Survey insights & users",
      blocks: [{ t: "journeys" }],
    },
    {
      id: "problem", nav: "Problem", title: "Problem statement",
      blocks: [{
        t: "problem",
        statement: "**Women in postpartum and perimenopause face unpredictable symptoms** and emotions, but **apps offer only basic tracking and generic advice,** leaving them confused and unsupported. They **need one trusted, simple platform that understands their stage and supports daily life.**",
        hmw: "How might we **create a platform that helps women understand, track and manage their perimenopause and postpartum journeys with clarity,** trust and gentle daily guidance?",
        image: { src: v("ho-hmw"), alt: "", w: 555, h: 480 },
      }],
    },
    {
      id: "solution", nav: "Solution", title: "Proposed solution",
      blocks: [{
        t: "features",
        heading: "A women’s health app that **supports perimenopause and postpartum** through **tracking, daily guidance and community support.**",
        text: "Hormona brings cycle and recovery tracking, breastfeeding logs, wellness programs, nutrition plans and smart reminders into one place. It reduces confusion and gives women clear, holistic and reliable support during two major life transitions.",
        items: ["Postpartum recovery tracking", "Breastfeeding log", "Feeding timer", "Baby milestones", "Daily nutrition guidance", "Appointments tracking"],
      }],
    },
    {
      id: "system", nav: "Design system", title: "Design system",
      blocks: [{
        t: "designsys",
        colors: [
          { hex: "#804595", name: "Primary" }, { hex: "#9C539C", name: "Secondary" }, { hex: "#6A398C", name: "Tertiary" }, { hex: "#C967A2", name: "Surface" },
          { hex: "#059669", name: "Success" }, { hex: "#FEBD19", name: "Warning" }, { hex: "#DC2626", name: "Error" },
        ],
        fonts: [{ name: "Nunito", css: "'Nunito', sans-serif" }],
      }],
    },
    {
      id: "screens", nav: "Key screens", title: "Key screens",
      blocks: [{ t: "screens", device: "phone", journey: true, items: [] }],
    },
  ],
};
export default study;
