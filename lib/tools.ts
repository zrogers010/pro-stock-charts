export type ResearchTool = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  category: string;
  href: string;
};

export const researchTools: ResearchTool[] = [
  {
    slug: "position-size-calculator",
    title: "Position Size Calculator",
    shortTitle: "Position Size",
    description:
      "Estimate shares, units, and capital at risk from account size, risk percentage, entry price, and stop price.",
    category: "Risk planning",
    href: "/tools/position-size-calculator",
  },
];
