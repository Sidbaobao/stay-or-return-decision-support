import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-fraunces)", "serif"]
      },
      colors: {
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-selected": "rgb(var(--color-surface-selected) / <alpha-value>)",
        "surface-raised": "rgb(var(--color-surface-raised) / <alpha-value>)",
        "surface-warm": "rgb(var(--color-surface-warm) / <alpha-value>)",
        "surface-strong": "rgb(var(--color-surface-strong) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        "text-muted": "rgb(var(--color-text-muted) / <alpha-value>)",
        border: "rgb(var(--color-border) / <alpha-value>)",
        hairline: "rgb(var(--color-hairline) / <alpha-value>)",
        "hairline-strong": "rgb(var(--color-hairline-strong) / <alpha-value>)",
        "progress-track": "rgb(var(--color-progress-track) / <alpha-value>)",
        "result-confidence-track": "rgb(var(--color-result-confidence-track) / <alpha-value>)",
        "result-driver-track": "rgb(var(--color-result-driver-track) / <alpha-value>)",
        "action-primary": "rgb(var(--color-action-primary) / <alpha-value>)",
        "action-primary-hover": "rgb(var(--color-action-primary-hover) / <alpha-value>)",
        "path-stay": "rgb(var(--color-path-stay) / <alpha-value>)",
        "path-return": "rgb(var(--color-path-return) / <alpha-value>)",
        "accent-warm": "rgb(var(--color-accent-warm) / <alpha-value>)",
        "ink-accent": "rgb(var(--color-ink-accent) / <alpha-value>)",
        hero: "rgb(var(--color-hero) / <alpha-value>)"
      },
      borderRadius: {
        control: "var(--radius-control)",
        tile: "var(--radius-tile)",
        option: "var(--radius-option)",
        card: "var(--radius-card)",
        panel: "var(--radius-panel)",
        feature: "var(--radius-feature)",
        pill: "var(--radius-pill)"
      },
      spacing: {
        "page-gutter": "var(--space-page-gutter)",
        section: "var(--space-section)",
        feature: "var(--space-feature)",
        "memo-x": "1.25rem",
        "memo-x-sm": "2rem",
        "memo-x-lg": "3rem",
        "memo-header-y": "1.25rem",
        "memo-header-y-sm": "1.5rem",
        "memo-section-y": "1.5rem",
        "memo-section-y-sm": "1.75rem",
        "memo-section-y-lg": "2rem",
        "memo-comparison-y": "1.75rem",
        "memo-comparison-y-sm": "2rem",
        "memo-comparison-y-lg": "2.25rem",
        "memo-row-x": "1rem",
        "memo-row-x-sm": "1.25rem",
        "memo-row-y": "0.625rem",
        "memo-header-cell-y": "0.6875rem",
        "memo-footer-y": "1.5rem"
      },
      boxShadow: {
        subtle: "var(--shadow-subtle)",
        soft: "var(--shadow-soft)",
        // Only components/weights/* still uses this; it resolves to `subtle`.
        "legacy-sm": "var(--shadow-legacy-sm)"
      },
      transitionDuration: {
        "motion-fast": "var(--motion-duration-fast)",
        "motion-standard": "var(--motion-duration-standard)",
        "motion-emphasis": "var(--motion-duration-emphasis)",
        "motion-reveal": "var(--motion-duration-reveal)",
        "motion-reveal-long": "var(--motion-duration-reveal-long)"
      },
      transitionTimingFunction: {
        interaction: "var(--motion-ease-interaction)",
        reveal: "var(--motion-ease-reveal)"
      },
      fontSize: {
        display: [
          "var(--text-display)",
          { lineHeight: "var(--leading-display)", letterSpacing: "var(--tracking-display)", fontWeight: "600" }
        ],
        "page-title": [
          "var(--text-page-title)",
          { lineHeight: "var(--leading-page-title)", letterSpacing: "var(--tracking-page-title)", fontWeight: "600" }
        ],
        "section-title": [
          "var(--text-section-title)",
          { lineHeight: "var(--leading-section-title)", letterSpacing: "var(--tracking-section-title)", fontWeight: "600" }
        ],
        "card-title": ["var(--text-card-title)", { lineHeight: "var(--leading-card-title)", fontWeight: "600" }],
        "body-lg": ["var(--text-body-lg)", { lineHeight: "var(--leading-body-lg)" }],
        body: ["var(--text-body)", { lineHeight: "var(--leading-body)" }],
        "body-sm": ["var(--text-body-sm)", { lineHeight: "var(--leading-body-sm)" }],
        label: ["var(--text-label)", { lineHeight: "var(--leading-label)" }]
      },
      letterSpacing: {
        eyebrow: "var(--tracking-eyebrow)"
      },
      maxWidth: {
        measure: "var(--measure-text)"
      }
    }
  },
  plugins: []
};

export default config;
