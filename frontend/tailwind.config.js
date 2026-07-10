/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          container: "var(--primary-container)",
          fixed: "var(--primary-fixed)",
          "fixed-dim": "var(--primary-fixed-dim)",
        },
        "surface-tint": "var(--surface-tint)",
        "on-primary": "var(--on-primary)",
        "on-primary-container": "var(--on-primary-container)",
        "on-primary-fixed": "var(--on-primary-fixed)",
        "on-primary-fixed-variant": "var(--on-primary-fixed-variant)",
        "inverse-primary": "var(--inverse-primary)",

        secondary: {
          DEFAULT: "var(--secondary)",
          container: "var(--secondary-container)",
          fixed: "var(--secondary-fixed)",
          "fixed-dim": "var(--secondary-fixed-dim)",
        },
        "on-secondary": "var(--on-secondary)",
        "on-secondary-container": "var(--on-secondary-container)",
        "on-secondary-fixed": "var(--on-secondary-fixed)",
        "on-secondary-fixed-variant": "var(--on-secondary-fixed-variant)",

        tertiary: {
          DEFAULT: "var(--tertiary)",
          container: "var(--tertiary-container)",
          fixed: "var(--tertiary-fixed)",
          "fixed-dim": "var(--tertiary-fixed-dim)",
        },
        "on-tertiary": "var(--on-tertiary)",
        "on-tertiary-container": "var(--on-tertiary-container)",
        "on-tertiary-fixed": "var(--on-tertiary-fixed)",
        "on-tertiary-fixed-variant": "var(--on-tertiary-fixed-variant)",

        surface: {
          DEFAULT: "var(--surface)",
          dim: "var(--surface-dim)",
          bright: "var(--surface-bright)",
          tint: "var(--surface-tint-brand)",
          container: {
            lowest: "var(--surface-container-lowest)",
            low: "var(--surface-container-low)",
            DEFAULT: "var(--surface-container)",
            high: "var(--surface-container-high)",
            highest: "var(--surface-container-highest)",
          },
        },
        "on-surface": "var(--on-surface)",
        "on-surface-variant": "var(--on-surface-variant)",
        "inverse-surface": "var(--inverse-surface)",
        "inverse-on-surface": "var(--inverse-on-surface)",

        background: {
          DEFAULT: "var(--background)",
          page: "var(--bg-page)",
        },
        "on-background": "var(--on-background)",

        outline: {
          DEFAULT: "var(--outline)",
          variant: "var(--outline-variant)",
        },
        "border-slate": "var(--border-slate)",
        "text-secondary": "var(--text-secondary)",

        error: {
          DEFAULT: "var(--error)",
          container: "var(--error-container)",
        },
        "on-error": "var(--on-error)",
        "on-error-container": "var(--on-error-container)",

        success: {
          green: "var(--success-green)",
          light: "var(--success-light)",
        },

        cat: {
          "real-estate": "var(--cat-real-estate)",
          employment: "var(--cat-employment)",
          business: "var(--cat-business)",
          services: "var(--cat-services)",
          family: "var(--cat-family)",
          documents: "var(--cat-documents)",
        },
      },
      borderRadius: {
        DEFAULT: "var(--radius-default)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },
      fontFamily: {
        sans: ["Inter", "Noto Naskh Arabic", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      fontSize: {
        "headline-hero": ["48px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-hero-mobile": ["32px", { lineHeight: "1.2", fontWeight: "700" }],
        "headline-section": ["24px", { lineHeight: "1.3", fontWeight: "600" }],
        subtitle: ["20px", { lineHeight: "1.5", fontWeight: "400" }],
        "card-title": ["18px", { lineHeight: "1.4", fontWeight: "600" }],
        body: ["16px", { lineHeight: "1.6", fontWeight: "400" }],
        small: ["14px", { lineHeight: "1.4", fontWeight: "400" }],
      },
      spacing: {
        "section-gap": "3rem",
        "grid-gap": "1.5rem",
        "margin-page": "2rem",
        "margin-mobile": "1rem",
      },
      maxWidth: {
        "container-max": "1280px",
      },
      boxShadow: {
        "card-hover": "0 0 20px 4px rgba(148,163,184,0.15), 0 4px 80px -8px rgba(30,41,59,0.25)",
        paper: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
