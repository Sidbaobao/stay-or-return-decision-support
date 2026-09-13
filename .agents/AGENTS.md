# AGENTS.md — Stay or Return

Read this fully before doing any work in this repo. These rules are
non-negotiable and were learned through hard experience. Follow them
on every task, in every conversation.

## What this project is

"Stay or Return" is a decision-support web app that helps Chinese
international students think through whether to stay in the US or
return to China. It is explicitly NOT a black box: its value is
transparency, value-clarification, and explainable recommendations.
Tone across the product: calm, warm, trustworthy, Qatchup-like.

## Stack & environment

- Next.js 15 (App Router) + TypeScript + Tailwind CSS.
- Package manager: **pnpm only**. Never use npm or yarn.
- User state: **localStorage only** (current run, device-local
  profile + history). No accounts, no login, no server copy of any
  user data.
- The ONE server surface: `app/api/stats` — anonymous aggregate
  counters (direction + confidence tier only) in Upstash Redis via
  its REST API (`lib/server/*`), feature-flagged by env vars listed
  in `.env.example`. Without them it silently no-ops.
- Icons: lucide-react. Circle packing: d3-hierarchy. No chart library
  (the bipolar visuals are plain DOM/CSS).
- Deploy: Vercel, auto-deploys on push to main.
- Verify every change with: `pnpm typecheck` AND `pnpm build`.
  Report both results. You CANNOT skip this.

## Architecture map

- `app/` — pages: `/` (Home), `/questionnaire`, `/weights`,
  `/results`, `/report`, `/profile`, `/profile/run?id=` (read-only
  history snapshot), `/shared#…` (read-only shared result, payload
  lives in the URL fragment). API: `/api/stats` (POST counter,
  Bearer-gated GET).
- `components/` — home/, questionnaire/, weights/, results/,
  report/, profile/, share/, layout/, ui/.
- `data/` — questions.ts, dimensions.ts.
- `lib/` — scoring.ts, storage.ts (all localStorage), guards.ts,
  report.ts, share.ts (link codec), stats-client.ts, utils.ts,
  server/ (Redis REST wrapper — server only).
- `types/` — index.ts.

There are 6 decision dimensions: career, salary_cost, immigration,
family_emotion, lifestyle, long_term. Each has a Lucide icon:
career=Briefcase, salary_cost=Scale, immigration=Stamp,
family_emotion=HeartHandshake, lifestyle=Sun, long_term=Sprout.

## HARD RULES — never violate

1. **Never touch core logic in a UI/styling task.** Do not modify
   `lib/scoring.ts`, `lib/storage.ts`, `lib/guards.ts`, or the
   generation logic in `data/`. If a task seems to require it, STOP
   and ask first.
2. **All localStorage access goes through `lib/storage.ts`.** Never
   call localStorage directly inside a component.
3. **Chart components must use dynamic import + `ssr: false`.**
4. **The condition to proceed from questionnaire to weights stays:
   all questions answered.** Do not invent a new completion check.
5. **No new third-party libraries without explicit approval** in the
   task. (Already approved and present: lucide-react, d3-hierarchy.)
6. **Scoring already normalizes weights by total** (weight /
   totalWeight). Any weight UI must still save the same `Weights`
   shape: a `Record<DimensionId, number>` with 6 numeric values.
7. **Preserve accessibility**: real HTML controls (button, input,
   range), aria labels, keyboard focus, screen-reader text.
8. **Respect `prefers-reduced-motion`** in every animation: provide
   a static, non-animated fallback.
9. **Mobile matters**: everything must work on small screens; no
   cursor-only interactions on touch devices.
10. **Stats stay anonymous**: `app/api/stats` may store COUNTERS
    only — never ids, IPs, answers, weights, nicknames, or
    timestamps finer than the month bucket. The wire payload is
    exactly `{direction, confidence}`. Nothing user-identifying may
    ever leave the device.
11. **Canvas/particle perf**: the hero field must never jank the
    page. The established approach: physics in typed arrays with no
    per-dot allocation, a spatial grid for cursor forces, WebGL point
    sprites for drawing (halo computed per fragment, never a blur
    pass), a loop that runs only while the hero is on screen in a
    visible tab, a static frame under reduced motion, and a Canvas 2D
    still image when WebGL is unavailable. Scale for
    devicePixelRatio; handle context loss; clean up rAF, observers
    and listeners on unmount.

## Design tokens (single source of truth)

Colors, radius, spacing, shadows, and type scale are defined as
tokens in `app/globals.css` and mapped in `tailwind.config.ts`.
**Reference tokens; do not hardcode hex values.** Canonical accents:
- Stay / US path: blue `#3C5CCF`
- Return / China path: red `#D72638`
- Warm accent: coral `#D96C4A`
- Home dark hero exception: `#070D18`. Two files draw colors directly
  because a canvas (2D or WebGL) cannot read CSS custom properties, and
  both are off-limits to styling tasks:
  `components/home/decision-map-canvas.tsx` (the two path colors + hero
  background) and `components/weights/*` (three per-dimension bubble
  hues).
- Hairlines vs borders: `border-hairline` / `divide-hairline` (and
  `-strong`) divide content inside or between blocks; `border-border`
  outlines a surface. Elevation has two levels: `shadow-subtle` on a
  surface, `shadow-soft` on a page's lead block only.
The whole site shares one warm, cohesive palette. Do not reintroduce
retired colors (orange `#F97316`, teal `#0F8B8D`, the old competing
blues).

## Workflow rules

- **High-risk changes: propose first, implement after approval.**
  Anything that touches multiple pages, core logic, weights, scoring
  visualization, or a large architectural rewrite → first output a
  PROPOSAL ONLY (your understanding of current code + plan + exactly
  which files you'll change and which you won't + risks). Do not
  write code until approved.
- **One problem per task.** Don't bundle unrelated changes.
- **Phased rollouts for big migrations**: make changes in small
  phases, run typecheck+build after each, and pause for review.
- **After every task report**: what changed, every file touched,
  typecheck + build results, and explicit confirmation that the
  hard rules above were not violated.
- Do not destructively repurpose a shared component without checking
  its other usages first.

## Content & copy

- Headings use Fraunces (serif); body/UI uses Inter (sans).
- Keep copy concise and human. Avoid AI-tells: repeated
  "heading + paragraph + three symmetric bullets" structures,
  filler phrases ("In conclusion", "It's worth noting", "Overall"),
  uniform information density. Vary rhythm; point out the key
  message; let visuals carry information.
- Bilingual (EN/CN) support is planned for LAST; do not add it
  preemptively.
