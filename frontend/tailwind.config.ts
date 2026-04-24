import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f7f9fb",
        surface: "#f7f9fb",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f2f4f6",
        "surface-container": "#eceef0",
        "surface-container-high": "#e6e8ea",
        "surface-container-highest": "#e0e3e5",
        "surface-bright": "#ffffff",
        "surface-dim": "#d8dadc",
        primary: "#0f172a",
        "primary-container": "#131b2e",
        "primary-fixed": "#dae2fd",
        "on-primary": "#ffffff",
        "on-surface": "#191c1e",
        "on-surface-variant": "#45464d",
        "on-surface-muted": "#45464d",
        outline: "#76777d",
        tertiary: "#002114",
        "tertiary-container": "#002114",
        "tertiary-fixed": "#85f8c4",
        "secondary-container": "#d5e3fc",
        "outline-variant": "#c6c6cd",
        "error-container": "#ba1a1a",
      },
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
        heading: ["Manrope", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        "layer": "0 12px 40px rgba(25, 28, 30, 0.06)",
        "floating": "0 12px 40px rgba(25, 28, 30, 0.06)",
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
