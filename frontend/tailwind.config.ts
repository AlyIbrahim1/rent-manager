import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        surface: "#f8fafc",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f3ff",
        "surface-container": "#eaedff",
        "surface-container-high": "#e2e7ff",
        "surface-container-highest": "#dae2fd",
        "surface-bright": "#ffffff",
        "surface-dim": "#d8dadc",
        primary: "#0f172a",
        "primary-container": "#131b2e",
        "on-primary": "#ffffff",
        "on-surface": "#131b2e",
        "on-surface-muted": "#7c839b",
        tertiary: "#002114",
        "tertiary-container": "#002114",
        "tertiary-fixed": "#85f8c4",
        "outline-variant": "#c6c6cd",
        "error-container": "#ba1a1a",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        heading: ["Manrope", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        "layer": "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        "floating": "0 20px 25px -5px rgb(0 0 0 / 0.05), 0 8px 10px -6px rgb(0 0 0 / 0.05)",
        "modal": "0 24px 48px -8px rgba(15,23,42,0.28), 0 8px 16px -4px rgba(15,23,42,0.12)",
      },
      letterSpacing: {
        'widest': '.075em',
        'superwide': '.1em',
      }
    },
  },
  plugins: [],
} satisfies Config;
