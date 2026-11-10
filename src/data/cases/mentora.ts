import type { CaseStudy } from "../case-types";
const v = (n: string) => `/img/v2/${n}.webp`;
const phone = (n: number, title: string, alt: string, desc?: string) => ({ src: v(`me-screen-${n}`), w: 622, h: 1386, title, alt, desc });

const study: CaseStudy = {
  slug: "mentora",
  fonts: { display: "'Outfit', var(--f-head)", body: "'Nunito', var(--f-body)" },
  theme: { pop: "#fff6d9", deep: "#092c4c", tint: "#fff6d9" },
  facts: [["Role", "Individual project"], ["Duration", "3 months"], ["Domain", "EdTech · Accessibility"], ["Format", "Mobile app"]],
  sections: [
    {
      id: "overview", nav: "Overview", title: "Project overview",
      blocks: [{
        t: "overview",
        problem: "People with Colour Vision Deficiency (CVD) discover career restrictions only after years of education and preparation. There is no platform that maps careers by colour dependency or provides CVD-specific guidance at the right time.",
        impact: "CVD is typically discovered when a job fitness test rejects someone after years of effort. It results in irreversible career loss, emotional distress, anxiety and forced compromise, not because of ability, but because of a systemic design error.",
        solution: "Mentora is a CVD-aware career guidance app that helps individuals identify colour-dependent career risks, explore ability-matched alternatives, and access expert support, so career decisions are informed.",
      }],
    },
    {
      id: "cvd", nav: "CVD research", title: "Research", sub: "Secondary research",
      blocks: [
        {
          t: "cards", cols: 3, tone: "pop",
          items: [
            { title: "What is CVD?", desc: "Colour Vision Deficiency, commonly known as colour blindness, occurs when light-sensitive cone cells in the retina fail to respond properly to colour variations. It most commonly affects perception of red and green shades." },
            { title: "Who is affected?", desc: "1 in 12 men · 1 in 200 women. Mostly congenital (X-linked), it can also be acquired through disease, medication or ageing. Red-green deficiency is the most common worldwide." },
            { title: "Beliefs vs reality", desc: "No current solution corrects congenital CVD. Filters and “colour-correcting” lenses are assistive at best, not cures. Focus must shift from “fixing the individual” to designing inclusive systems." },
          ],
        },
        {
          t: "split", heading: "How CVD affects ==an individual’s life==",
          items: [
            { title: "Everyday", desc: "Difficulty judging food ripeness, matching clothing, noticing bruises or rashes, reading traffic signals in poor lighting." },
            { title: "Digital", desc: "Charts, dashboards, error messages and status indicators that use colour-only cues cause confusion." },
            { title: "Emotional", desc: "Low confidence, anxiety, embarrassment, avoidance of colour-based tasks, social discomfort." },
            { title: "Career", desc: "Certain professions are inaccessible due to colour vision requirements; late discovery comes after years of preparation." },
          ],
        },
      ],
    },
    {
      id: "primary", nav: "Ophthalmologist", title: "Insights from an ophthalmologist", sub: "Primary research",
      blocks: [{
        t: "insights", label: "Insights from an ophthalmologist",
        image: { src: v("me-doctor"), alt: "Illustration of a doctor with a stethoscope", w: 684, h: 561 },
        items: [
          "CVD is usually discovered accidentally, not proactively.",
          "Late diagnosis leads to career rejection after years of preparation.",
          "There is no medical cure; focus must shift to adaptation and inclusive system design.",
          "Most patients are unaware of their condition until a job requirement flags it.",
        ],
      }],
    },
    {
      id: "users", nav: "User", title: "Understanding the user",
      blocks: [{
        t: "persona", tag: "Persona · Person with CVD",
        photo: { src: v("me-rohan"), alt: "Rohan, a smiling young man in a red T-shirt", w: 402, h: 440 },
        name: "Rohan Mehra", facts: [["Age", "23"], ["Location", "Mumbai"], ["Occupation", "Student"]],
        scenario: "Rohan hesitates to apply for roles due to unclear colour-based requirements, despite being capable.",
        cols: [
          { title: "Pain points", icon: "pain", items: ["Job platforms ignore colour vision needs.", "Career advice is generic or discouraging.", "Fear of rejection in colour-based tests.", "Hesitation due to unclear role requirements."] },
          { title: "Needs", icon: "needs", items: ["Find suitable career paths.", "Know realistic role options.", "Feel confident before interviews.", "Avoid late-stage rejection."] },
          { title: "Goals", icon: "goals", items: ["Clear guidance on CVD-friendly careers.", "Practical ways to adapt to colour-based tasks.", "Safe, judgement-free career exploration.", "Validation that the problem is systemic, not personal."] },
        ],
      }],
    },
    {
      id: "problem", nav: "Problem", title: "Problem statement",
      blocks: [{
        t: "problem",
        statement: "**People with colour vision deficiency discover career restrictions only after years of education and preparation** because no platform maps careers by colour dependency or provides CVD-specific guidance at the right time.",
        hmw: "How might we **help individuals with CVD explore safe career options** and access guidance that leads to a proper, informed career path?",
        image: { src: v("me-hmw"), alt: "", w: 555, h: 480 },
      }],
    },
    {
      id: "solution", nav: "Solution", title: "Proposed solution",
      blocks: [{
        t: "features",
        heading: "Design a **CVD-aware career guidance platform** that **helps individuals** with colour vision **deficiency identify colour-dependent career risks,** explore ability-matched alternatives, and access expert support, **so career decisions are informed.**",
        items: ["CVD-aware career matching", "E-Library", "Colour-dependence score for careers", "Career discovery test", "Career guide session", "Ability-based career alternatives"],
      }],
    },
    {
      id: "ia", nav: "IA", title: "Information architecture",
      blocks: [
        { t: "lead", text: "Sign-up asks **which describes you: CVD or normal vision**, and the type of CVD. Everything after that branches from three tabs: **Home** (recommended careers, tests, shortlist, E-Library), **Explore career** (search, categories, career cards with colour dependence and alternatives) and **Account** (including vision and accessibility settings like contrast mode and text size)." },
        { t: "figure", image: { src: v("me-ia"), alt: "Information architecture of Mentora: onboarding, Home, Explore career and Account branches", w: 1600, h: 2368 }, tall: true },
      ],
    },
    {
      id: "system", nav: "Design system", title: "Design system",
      blocks: [{
        t: "designsys",
        colors: [
          { hex: "#092C4C", name: "Primary" }, { hex: "#B6C4F2", name: "Secondary" }, { hex: "#F498AD", name: "Tertiary" }, { hex: "#FFF6D9", name: "Surface" },
          { hex: "#059669", name: "Success" }, { hex: "#FEBD19", name: "Warning" }, { hex: "#DC2626", name: "Error" },
        ],
        fonts: [{ name: "Outfit", css: "'Outfit', sans-serif" }, { name: "Nunito", css: "'Nunito', sans-serif" }],
      }],
    },
    {
      id: "screens", nav: "Key screens", title: "Key screens",
      blocks: [{
        t: "screens", device: "phone", cvd: true,
        intro: "Career discovery and colour dependency sit at the centre of the app: every career card carries a **colour-dependent tasks** rating, and every test result points to roles where colour discrimination isn’t required.",
        items: [
          phone(1, "Homescreen", "Mentora home: Hello Rohan, a daily tip and recommended careers with colour-dependency tags", "Daily tip, quick access to the test, experts and E-Library, and careers recommended for you."),
          phone(2, "Career test", "Take Test screen listing skill, personality, interest and aptitude tests", "Four assessment types to find paths that match strengths and vision profile."),
          phone(3, "Test screen", "Skill based question with four answer options", "One question at a time, with clear progress."),
          phone(4, "Test score", "Skill based score of 85% with skill breakdown and suitable careers", "What the score means, a skill breakdown and careers suitable for you."),
          phone(5, "Career recommendation", "UX Design category with careers tagged by colour-dependent tasks", "Careers in a category, each with its colour-dependency rate."),
          phone(6, "Career coaches", "Available guides list with CVD-aware coaches", "Book a session with a coach, filtered to CVD-aware guides."),
        ],
      }],
    },
  ],
};
export default study;
