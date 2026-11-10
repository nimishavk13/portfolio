import type { CaseStudy } from "../case-types";
const v = (n: string) => `/img/v2/${n}.webp`;

const study: CaseStudy = {
  slug: "little-roots",
  fonts: { display: "'Baloo 2', var(--f-head)", body: "'Mali', var(--f-body)" },
  theme: { pop: "#ea8a70", deep: "#1f3d26", tint: "#fbe9e4" },
  facts: [["Role", "Individual project"], ["Duration", "2 months"], ["Domain", "Plant care"], ["Format", "Phygital product · kit + app"]],
  sections: [
    {
      id: "overview", nav: "Overview", title: "Project overview",
      blocks: [{
        t: "overview",
        problem: "Children often learn about plants through books and screens, with limited hands-on gardening experience. Without timely guidance, they struggle to understand plant needs, maintain care routines, and stay engaged in the process of growing and nurturing plants.",
        impact: "Limited hands-on experience can make it harder for children to understand plant growth, recognise plant needs, and develop consistent care habits. Without engaging guidance, their curiosity about nature and motivation to nurture plants may gradually decline.",
        solution: "Little Roots combines a physical gardening kit with an AI-integrated mobile app, helping children identify plants, monitor plant health, track growth, and learn plant care through interactive activities and hands-on experiences.",
      }],
    },
    {
      id: "research", nav: "Research", title: "Research", sub: "Secondary research",
      blocks: [
        {
          t: "split",
          heading: "Gardening connects children to the process ==of growth==",
          text: "Gardening gives children an opportunity to **observe natural processes**, understand **plant needs**, and experience the relationship between **care and growth**.",
          image: { src: v("lr-plant"), alt: "Illustration of a seedling in a pot", w: 859, h: 899 },
          items: [
            { title: "Hands-on experience", desc: "Makes concepts like germination and growth easier to understand." },
            { title: "Digital tools", desc: "Enhance learning with visual guidance and interactive feedback." },
            { title: "A connected experience", desc: "Combines physical care with digital support for better learning." },
          ],
          note: "**Opportunity:** Combine hands-on gardening with age-appropriate digital guidance for consistent, engaging plant care.",
        },
      ],
    },
    {
      id: "primary", nav: "Little gardeners", title: "Insights from little gardeners", sub: "Primary research",
      blocks: [{
        t: "quotes", label: "Insights from little gardeners",
        items: [
          { q: "Can my plant be my friend? I want to water it every day!", who: "Anaya, 5 years", avatar: { src: v("lr-av-anaya"), alt: "", w: 173, h: 156 } },
          { q: "Gardening in science is boring. But a watermelon I grew myself? Awesome.", who: "Kabir, 9 years", avatar: { src: v("lr-av-kabir"), alt: "", w: 173, h: 156 } },
          { q: "I know plants need water and sunlight, but sometimes I forget to take care of them.", who: "Aryan, 8 years", avatar: { src: v("lr-av-aryan"), alt: "", w: 173, h: 156 } },
          { q: "I know photosynthesis. I just don’t know why aaji’s methi grows and mine doesn’t.", who: "Meher, 11 years", avatar: { src: v("lr-av-meher"), alt: "", w: 173, h: 156 } },
        ],
      }],
    },
    {
      id: "users", nav: "Users", title: "Understanding the user",
      blocks: [
        {
          t: "persona", tag: "Persona · Child, 9 years old",
          photo: { src: v("lr-kabir"), alt: "Kabir, a smiling boy in a yellow T-shirt", w: 459, h: 470 },
          name: "Kabir Shah", facts: [["Age", "9"], ["Location", "Pune"], ["Occupation", "Student"]],
          scenario: "Kabir is excited about growing his own watermelon but struggles to maintain daily plant-care routines and loses interest when growth is too slow.",
          cols: [
            { title: "Pain points", icon: "pain", items: ["Forgets daily plant care on busy days.", "Finds slow plant growth discouraging.", "Doesn’t know how much water is enough.", "Mum’s reminders feel like nagging."] },
            { title: "Needs", icon: "needs", items: ["Simple, visual plant-care instructions.", "Timely reminders for daily care.", "Clear feedback on when his plant needs water.", "Visible growth progress and rewards."] },
            { title: "Goals", icon: "goals", items: ["Grow a watermelon he can eat.", "Maintain his own plant-care streak.", "Show his class what he has grown."] },
          ],
        },
        {
          t: "persona", tag: "Persona · Parent",
          photo: { src: v("lr-ritu"), alt: "Ritu, a smiling woman in a denim shirt", w: 477, h: 470 },
          name: "Ritu Shah", facts: [["Age", "38"], ["Location", "Pune"], ["Occupation", "IT Professional"]],
          scenario: "Ritu wants Kabir to become responsible for his plant, but limited time and her own lack of gardening knowledge often lead her to take over the care herself.",
          cols: [
            { title: "Pain points", icon: "pain", items: ["Build Kabir’s sense of responsibility.", "Encourage less passive screen time.", "Help him develop an interest in gardening.", "Create meaningful gardening experiences together."] },
            { title: "Needs", icon: "needs", items: ["A quick overview of plant health and status.", "Simple, reliable plant-care instructions.", "Timely and useful notifications.", "Guidance that supports Kabir’s independence without taking over."] },
            { title: "Goals", icon: "goals", items: ["Ends up becoming the actual caretaker of the plants.", "Doesn’t always know how to answer Kabir’s gardening questions.", "Gets overwhelmed by excessive notifications.", "Has limited time during rushed weekday mornings."] },
          ],
        },
      ],
    },
    {
      id: "problem", nav: "Problem", title: "Problem statement",
      blocks: [{
        t: "problem",
        statement: "Children aged 5–12 need a **simple and engaging way to understand and practise everyday plant care** because current experiences teach them about plants but provide **limited opportunities for consistent, hands-on care and independent decision-making.**",
        hmw: "How might we **help children aged 5–12 develop consistent plant-care habits** through playful, hands-on learning and simple digital guidance?",
        image: { src: v("lr-hmw"), alt: "", w: 555, h: 480 },
      }],
    },
    {
      id: "ia", nav: "IA", title: "Information architecture",
      blocks: [
        { t: "lead", text: "Two connected experiences: a **Kids app** for the child (My Plant, Care, Grow & Track, Help & Discover, Rewards, Grow & Eat) and a **Guide view** for the parent (Guide Home, Together, Settings), each with its own onboarding." },
        { t: "figure", image: { src: v("lr-ia"), alt: "Information architecture of Little Roots: pre-onboarding, the kids app sections and the parent guide view", w: 1600, h: 4517 }, tall: true },
      ],
    },
    {
      id: "ecosystem", nav: "Ecosystem", title: "Product ecosystem",
      blocks: [{ t: "ecosystem" }],
    },
    {
      id: "visual", nav: "Visual direction", title: "Visual direction & interface development",
      blocks: [{ t: "visual" }],
    },
    {
      id: "system", nav: "Design system", title: "Design system",
      blocks: [{
        t: "designsys",
        colors: [
          { hex: "#1E6CDB", name: "Primary" }, { hex: "#B9DFFA", name: "Secondary" }, { hex: "#FF7A5C", name: "Tertiary" }, { hex: "#FFF8EC", name: "Surface" },
          { hex: "#059669", name: "Success" }, { hex: "#FEBD19", name: "Warning" }, { hex: "#DC2626", name: "Error" },
        ],
        fonts: [{ name: "Baloo 2", css: "'Baloo 2', sans-serif" }, { name: "Mali", css: "'Mali', sans-serif" }],
      }],
    },
    {
      id: "screens", nav: "Key screens", title: "Key screens", sub: "A guided journey from planting to harvesting",
      blocks: [{
        t: "screens", device: "tablet",
        intro: "A look at the key screens that bring Little Roots to life, helping children learn, care and grow with their plants through a playful and intuitive experience. The journey runs **Set up → Grow → Learn → Harvest.**",
        items: [
          { src: v("lr-step-1"), alt: "Profile setup screen: Every captain needs a name", w: 405, h: 318, title: "Profile setup", desc: "A simple onboarding flow for parents and children to personalise their experience." },
          { src: v("lr-step-2"), alt: "Choose plant screen: What would you love to grow?", w: 405, h: 318, title: "Choose plant", desc: "Kids pick from a variety of easy-to-grow plants based on their interest." },
          { src: v("lr-step-3"), alt: "Plant identification screen with a leaf photo", w: 405, h: 318, title: "Plant identification", desc: "Use the camera to identify plants and get instant insights." },
          { src: v("lr-step-4"), alt: "My Basil care screen with soil moisture, light and temperature", w: 405, h: 318, title: "Plant care", desc: "Daily care tasks based on the plant’s needs, from watering to sunlight." },
          { src: v("lr-step-5"), alt: "Your plant's story growth timeline", w: 405, h: 318, title: "Growth journey", desc: "Track the plant’s progress through photos and milestones." },
          { src: v("lr-step-6"), alt: "Collect your harvest screen", w: 405, h: 318, title: "Harvest & celebrate", desc: "Celebrate the little victories and the growth they nurtured." },
        ],
      }],
    },
    {
      id: "features", nav: "Features", title: "Feature in focus",
      blocks: [{
        t: "cards", cols: 3, tone: "soft",
        items: [
          { n: "01", title: "Plant identification", desc: "Identify a plant with the camera and get instant details like its name, care needs and fun facts." },
          { n: "02", title: "Leaf disease detection", desc: "Scan a leaf to check for diseases, understand the cause and get simple steps to treat it." },
          { n: "03", title: "Plant monitoring", desc: "Track the plant’s environment with a smart sensor in real time." },
          { n: "04", title: "Learn & explore", desc: "Discover fun plant facts and complete learning activities." },
          { n: "05", title: "Growth journey", desc: "See the plant’s progress through photos and key milestones." },
          { n: "06", title: "Harvest & celebrate", desc: "Harvest the plant and celebrate progress with rewards." },
        ],
      }],
    },
    {
      id: "kit", nav: "Physical kit", title: "The physical kit",
      blocks: [{ t: "kit" }],
    },
    {
      id: "how", nav: "How it works", title: "How it works",
      blocks: [{ t: "how" }],
    },
    {
      id: "testing", nav: "Usability testing", title: "Usability testing",
      blocks: [{ t: "sus" }],
    },
  ],
};
export default study;
