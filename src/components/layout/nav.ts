/** Primary navigation, in the order fixed by SPEC.md section 8. */
export interface NavItem {
  href: string;
  label: string;
  /** Shown in the mobile drawer under the label. */
  blurb: string;
}

export const primaryNav: NavItem[] = [
  { href: "/", label: "Home", blurb: "Where the course starts" },
  {
    href: "/learn/what-is-a-cnc-machine",
    label: "Start Learning",
    blurb: "Lesson one, from zero",
  },
  { href: "/learn", label: "Learning Path", blurb: "All twenty levels" },
  { href: "/explorer", label: "Machine Explorer", blurb: "Inspect every component" },
  { href: "/calculators", label: "Calculators", blurb: "Machining and axis sizing" },
  { href: "/simulator", label: "G-code Simulator", blurb: "In development" },
  { href: "/project", label: "Design Your CNC", blurb: "The twenty-stage project" },
  { href: "/glossary", label: "Glossary", blurb: "Every term, in plain words" },
  { href: "/progress", label: "Progress", blurb: "What you have completed" },
  { href: "/resources", label: "Resources", blurb: "Standards and further reading" },
];
