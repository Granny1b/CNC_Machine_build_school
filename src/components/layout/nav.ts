/** Primary navigation, in the order fixed by SPEC.md section 8. */
export interface NavItem {
  href: string;
  label: string;
  /**
   * Label for the desktop bar. Ten full labels need about 1100px of a 1216px
   * content box, which leaves no room for the wordmark, so the bar uses a
   * concise form. The full `label` still appears in the drawer, the footer and
   * the page's own title, so nothing is only ever known by its short name.
   */
  short?: string;
  /** Shown in the mobile drawer under the label. */
  blurb: string;
}

export const primaryNav: NavItem[] = [
  { href: "/", label: "Home", blurb: "Where the course starts" },
  {
    href: "/learn/what-is-a-cnc-machine",
    label: "Start Learning",
    short: "Start",
    blurb: "Lesson one, from zero",
  },
  { href: "/learn", label: "Learning Path", short: "Curriculum", blurb: "All twenty levels" },
  {
    href: "/explorer",
    label: "Machine Explorer",
    short: "Explorer",
    blurb: "Inspect every component",
  },
  { href: "/calculators", label: "Calculators", blurb: "Machining and axis sizing" },
  // SPEC section 8's route map lists no home for the troubleshooting scenario
  // player of section 11, so it gains a route of its own here.
  {
    href: "/troubleshooting",
    label: "Troubleshooting",
    short: "Troubleshoot",
    blurb: "Diagnose a real fault",
  },
  { href: "/simulator", label: "G-code Simulator", short: "Simulator", blurb: "In development" },
  { href: "/project", label: "Design Your CNC", short: "Project", blurb: "The twenty-stage project" },
  { href: "/glossary", label: "Glossary", blurb: "Every term, in plain words" },
  { href: "/progress", label: "Progress", blurb: "What you have completed" },
  { href: "/resources", label: "Resources", blurb: "Standards and further reading" },
];
