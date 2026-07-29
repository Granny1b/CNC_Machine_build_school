import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F1F3F2", // surface-plate grey, the page ground
          raised: "#FFFFFF", // cards and panels
          sunk: "#E7EAE8", // wells, inactive tracks
        },
        ink: { DEFAULT: "#0F141A", soft: "#54626E", faint: "#8B979F" },
        rule: { DEFAULT: "#D2D8D5", strong: "#B4BDB8" },
        blue: {
          DEFAULT: "#17395B", // Prussian / engineer's blue — primary
          deep: "#0E2439",
          mid: "#2E6C99",
          bright: "#2E90C4", // measurement cyan: live values, active states
          wash: "#E4EDF3",
        },
        amber: { DEFAULT: "#B8801A", wash: "#FBF2DE" }, // SAFETY ONLY
        moss: { DEFAULT: "#3F6B4A", wash: "#E4EDE6" }, // pass / complete
      },
      fontFamily: {
        display: ["Archivo", "Helvetica Neue", "Arial", "sans-serif"],
        sans: ["IBM Plex Sans", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      letterSpacing: { tightest: "-0.035em", eyebrow: "0.14em" },
      // The 480px breakpoint of SPEC 5.3, below which the axis scale degrades
      // to a labelled bar. Tailwind's smallest default stop is 640px.
      screens: { xs: "480px" },
      backgroundImage: {
        grid: `linear-gradient(to right, rgba(23,57,91,0.055) 1px, transparent 1px),
               linear-gradient(to bottom, rgba(23,57,91,0.055) 1px, transparent 1px)`,
      },
      backgroundSize: { grid: "32px 32px" },
      boxShadow: {
        panel:
          "0 1px 2px rgba(15,20,26,0.04), 0 8px 24px -16px rgba(15,20,26,0.18)",
        lift: "0 2px 4px rgba(15,20,26,0.05), 0 18px 40px -22px rgba(15,20,26,0.28)",
      },
    },
  },
  plugins: [],
};

export default config;
