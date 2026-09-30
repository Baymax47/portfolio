/**
 * Single source for profile, career, tools, and case studies.
 * Leave unknown values null. Do not invent dates, employers, handles, or results.
 *
 * Demo photographs in /public/images/work were made for this site.
 * They are not Bentox template files and are not licensed from Framer.
 * Reference image URLs reviewed on 28 September 2026, not embedded:
 * https://framerusercontent.com/images/rXqxOzM3UNIAMYLygf1ipImD6Y.webp?scale-down-to=2048
 * https://framerusercontent.com/images/Nk3iUU1HWdPTnkYNlNeELJCRGB8.webp?scale-down-to=2048
 *
 * Replace the portrait at /images/aryan-portrait.jpg
 * Resume file: /resume/Aryan_Jagtap_Senior_Associate_UX_Designer_Resume.pdf
 */

export const demoNotice = "Demo project — replace with Aryan’s work.";

export const profile = {
  name: "Aryan Jagtap",
  displayName: "Aryan",
  headline: "Hi, I’m Aryan —",
  supporting:
    "Senior Associate UX Designer at Digit Insurance, based in Bangalore.",
  positioning: "I turn complex journeys into clear, thoughtful experiences.",
  /** Homepage display only. Do not derive this from dates. */
  yearsOfExperience: 3,
  /** Set a real address. Copy email and mailto both read this field. */
  email: "aryan.jagtap.inc@gmail.com",
  portrait: {
    src: "/images/aryan-portrait.jpg",
    alt: "Portrait of Aryan Jagtap",
    objectPosition: "center 32%",
  },
};

export const about = {
  cardLead: "Product designer",
  cardTitle:
    "with a soft spot for simple ideas, sharp details, and slightly unhealthy curiosity about AI.",
  story:
    "I’m Aryan, a UX designer and web developer based in Bangalore. I enjoy untangling complex journeys and turning them into interfaces that feel clear and considered.",
  currentWork:
    "I currently work as a Senior Associate UX Designer at Digit Insurance. I’m interested in the details that connect user needs, business goals, and thoughtful execution.",
  contactHeading: "Have something in mind?",
};

export type SocialId = "linkedin" | "instagram" | "behance" | "x";

export type SocialLink = {
  id: SocialId;
  label: string;
  /** Stay null until the real profile URL is known. */
  href: string | null;
};

export const socials: SocialLink[] = [
  { id: "linkedin", label: "LinkedIn", href: null },
  { id: "instagram", label: "Instagram", href: null },
  { id: "behance", label: "Behance", href: null },
  { id: "x", label: "X", href: null },
];

export const resume = {
  href: "/resume/Aryan_Jagtap_Senior_Associate_UX_Designer_Resume.pdf",
  downloadName: "Aryan_Jagtap_Senior_Associate_UX_Designer_Resume.pdf",
  label: "Resume",
  title: "The story so far.",
};

export type ExperienceRecord = {
  id: string;
  role: string;
  organization: string;
  /** ISO date, for example 2024-04-01. Null until the date is known. */
  start: string | null;
  /** ISO date, or null when current or unknown. */
  end: string | null;
  current: boolean;
  description: string;
  milestone?: string;
};

export const experience: ExperienceRecord[] = [
  {
    id: "digit-insurance",
    role: "Senior Associate UX Designer",
    organization: "Digit Insurance",
    start: null,
    end: null,
    current: true,
    description:
      "Current role at Digit Insurance. A start date and a fuller description can be added here.",
    milestone: "Now",
  },
];

export const skills = [
  {
    title: "UX & product design",
    body: "Shaping a journey so the next step is obvious, from the first question to a decision someone can trust.",
  },
  {
    title: "Interface design",
    body: "Quiet screens, clear type, and states that stay understandable when a flow gets complicated.",
  },
  {
    title: "Design systems",
    body: "Reusable patterns that keep a product consistent without freezing every screen in place.",
  },
  {
    title: "Web development",
    body: "Building interfaces in the browser so layout, type, and motion can be judged in the real thing.",
  },
];

export const tools = [
  { id: "figma", name: "Figma" },
  { id: "framer", name: "Framer" },
  { id: "cursor", name: "Cursor" },
  { id: "supabase", name: "Supabase" },
  { id: "chatgpt", name: "ChatGPT" },
] as const;

export type ToolId = (typeof tools)[number]["id"];

/** Add files under /public and list them here. The carousel stays hidden while this is empty. */
export const photos: { src: string; alt: string }[] = [];

export type CaseBlock =
  | { type: "text"; heading: string; body: string }
  | { type: "list"; heading: string; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | {
      type: "two-image";
      images: { src: string; alt: string; caption?: string }[];
    }
  | { type: "quote"; text: string; attribution?: string };

export type Project = {
  slug: string;
  name: string;
  category: string;
  /** Keep true until this case study is replaced with Aryan’s own work. */
  demo: boolean;
  tileImage: string;
  tileAlt: string;
  cover: { src: string; alt: string };
  metadata: {
    organization: string;
    role: string;
    tools: string[];
    timeline: string;
  };
  summary: string;
  context: string;
  prototypeUrl: string | null;
  sections: CaseBlock[];
};

export const projects: Project[] = [
  {
    slug: "cashless",
    name: "Cashless",
    category: "Personal finance",
    demo: true,
    tileImage: "/images/work/cashless-cover.png",
    tileAlt:
      "Sample photograph of a phone showing a neutral personal-finance layout. Not a product Aryan shipped.",
    cover: {
      src: "/images/work/cashless-cover.png",
      alt: "Sample photograph of a phone on stone with a quiet finance screen. Hypothetical layout stand-in.",
    },
    metadata: {
      organization: "None. Hypothetical sample",
      role: "Not Aryan’s role",
      tools: ["Figma"],
      timeline: "Not a dated engagement",
    },
    summary:
      "A layout sample about a person checking what is left to spend this week. It is not a record of Aryan’s work.",
    context:
      "The screens imagine one weekly money question, a short transfer list, and a separate way to send money. No research sessions or business results are claimed.",
    prototypeUrl: null,
    sections: [
      {
        type: "text",
        heading: "Challenge",
        body: "Weekly money decisions get scattered across transfers, bills, and whatever is left. This sample asks whether that picture can stay readable on one screen.",
      },
      {
        type: "text",
        heading: "Process",
        body: "The sample sequence has three moves: name the weekly question, put remaining money before history, and keep sending money as its own short path. This is not a record of interviews, a team, or a client.",
      },
      {
        type: "list",
        heading: "Design decisions",
        items: [
          "Show what is left this week before a long balance history.",
          "Keep recent transfers as a short list with a plain purpose line.",
          "Give payment three steps so confirmation is its own screen.",
        ],
      },
      {
        type: "text",
        heading: "Solution",
        body: "The photographs stand in for those screens: a phone with a quiet balance, then a wider sequence for amount, recipient, and confirmation. They illustrate structure only.",
      },
      {
        type: "two-image",
        images: [
          {
            src: "/images/work/cashless-cover.png",
            alt: "Phone on limestone showing a sample balance and transfer list.",
            caption: "Weekly balance, as a layout sample.",
          },
          {
            src: "/images/work/cashless-flow.png",
            alt: "Three phones showing a sample payment sequence on stone.",
            caption: "A three-step send sequence.",
          },
        ],
      },
      {
        type: "text",
        heading: "Outcome",
        body: "No outcome is claimed. There are no participants, conversion figures, or business results to report. Replace this paragraph with verified notes later.",
      },
      {
        type: "quote",
        text: "The weekly question should be readable without opening a chart.",
        attribution: "Hypothetical design note, not a testimonial",
      },
    ],
  },
  {
    slug: "job-portal",
    name: "Job Portal",
    category: "Job search",
    demo: true,
    tileImage: "/images/work/job-portal-cover.png",
    tileAlt:
      "Sample photograph of a phone showing a neutral job-search layout. Not a product Aryan shipped.",
    cover: {
      src: "/images/work/job-portal-cover.png",
      alt: "Sample photograph of a phone on linen with a quiet job-search screen. Hypothetical layout stand-in.",
    },
    metadata: {
      organization: "None. Hypothetical sample",
      role: "Not Aryan’s role",
      tools: ["Figma"],
      timeline: "Not a dated engagement",
    },
    summary:
      "A layout sample about scanning roles before deciding one is worth opening. It is not a record of Aryan’s work.",
    context:
      "The screens imagine a short search, role cards with location and level, and a saved list. No employer, study, or hiring result is claimed.",
    prototypeUrl: null,
    sections: [
      {
        type: "text",
        heading: "Challenge",
        body: "A search spreads across tabs, saved links, and half-remembered requirements. This sample asks what someone needs to see before opening a role.",
      },
      {
        type: "text",
        heading: "Process",
        body: "The sample sequence is: state the search, scan roles with location and level together, and keep a short saved list. It is not a research program and it does not describe Aryan’s employment.",
      },
      {
        type: "list",
        heading: "Design decisions",
        items: [
          "Put location, level, and work mode on the card before a long company description.",
          "Keep filters few and visible.",
          "Show saved roles as an ordinary list, not a match score.",
        ],
      },
      {
        type: "text",
        heading: "Solution",
        body: "A phone and a laptop board stand in for the search and the saved queue. The photographs are original layout samples, not a live product.",
      },
      {
        type: "two-image",
        images: [
          {
            src: "/images/work/job-portal-cover.png",
            alt: "Phone on linen showing a sample list of role cards.",
            caption: "Role cards, as a layout sample.",
          },
          {
            src: "/images/work/job-board.png",
            alt: "Laptop on a desk showing a sample job-search board.",
            caption: "A wider board for scanning roles.",
          },
        ],
      },
      {
        type: "text",
        heading: "Outcome",
        body: "No outcome is claimed. There are no applicants, placement rates, or testimonials to report. Replace this paragraph with verified notes later.",
      },
      {
        type: "quote",
        text: "A role card should answer whether it is worth opening, before it asks someone to apply.",
        attribution: "Hypothetical design note, not a testimonial",
      },
    ],
  },
];

export const comingSoon = {
  title: "Another story is taking shape.",
  status: "Coming soon",
  image: "/images/work/coming-soon.png",
  alt: "Still life of blank boards on a plaster wall, standing in for a project that is not ready to open.",
};

export function getProject(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

export function socialHref(link: SocialLink): string | null {
  return link.href;
}
