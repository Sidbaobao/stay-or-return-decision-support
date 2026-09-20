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
- `data/` — questions.ts, dimensions.ts, factors.ts (the home page's
  chips, each pointing at a question), with .zh twins.
- `lib/` — scoring.ts, storage.ts (all localStorage), guards.ts,
  report.ts, share.ts (link codec), stats-client.ts, utils.ts,
  server/ (Redis REST wrapper — server only).
- `middleware.ts` + `lib/routes.ts` — a damaged link (stray full stop
  or 。 from a chat app, a capital letter, an old alias) is redirected to
  the page it meant; anything else lands on `app/not-found.tsx`, which
  speaks the reader's language. The middleware reads and stores nothing.
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
    and listeners on unmount. Touch counts as a cursor: passive
    touch listeners feed the same state, so the page keeps scrolling
    and the field follows the finger. The renderer never throws
    (a context can be lost at creation on phones with many tabs);
    the canvas and the videos sit inside `DecorativeBoundary`, so a
    decorative failure leaves the ground and never the error page.
12. **Error pages**: `app/error.tsx` (inside the shell, localized,
    reload + home, the message under a details fold) and
    `app/global-error.tsx` (own html/body, bilingual). Never leave
    Next's default "Application error" text.

## Design tokens (single source of truth)

Colors, radius, spacing, shadows, and type scale are defined as
tokens in `app/globals.css` and mapped in `tailwind.config.ts`.
**Reference tokens; do not hardcode hex values.** Canonical accents:
- Stay / US path: blue `#3C5CCF`
- Return / China path: red `#D72638`
- Warm accent: coral `#D96C4A`
- The site is graphite: every page shares the home hero's night. Canvas
  `11 15 23`, raised surface `16 21 31`, ink `242 239 232`, the path
  colours lifted for dark ground (stay `108 132 255`, return
  `255 92 106`), a warm coral accent, and six part hues
  (`--color-dim-<id>`) used by the questionnaire rail, the priority
  bubbles and the home page chips. The memo is the one sheet of paper:
  `.decision-memo` re-declares the same token names in paper values, so
  everything inside it reads its usual tokens and prints on white. One
  file still draws hex directly because a WebGL canvas cannot read CSS
  custom properties: `components/home/decision-map-canvas.tsx` (the two
  canonical path colours and the hero background), off-limits to styling
  tasks. Depth on the night comes from a lighter tone or `shadow-soft`
  (darkness below, a hairline of light on top) and from glows in a
  part's hue, never from grey drop shadows. The body carries a faint dot
  grid and two glows (`--pattern-dots`, `--gradient-page-atmosphere`);
  the header is opaque so the grid never shows through it.
- Wide screens get a bigger page, not a wider gutter: the root font size
  steps up at 1536, 1800 and 2200px (17.5, 19, 20.5px) and the column
  (`--width-site`, `max-w-site`) widens to 80rem, so every page grows in
  proportion. Every size stays in rem; never fix a desktop size in px.
- Separation: no rules and no boxes. A page is a stack of full-width
  bands (`components/ui/band.tsx`) in three tones (canvas, white, warm);
  two tones meeting is the only edge. Inside a band, blocks are
  separated by space, or by the offset grid (`OffsetGrid`, heading
  column beside content column). Rows in a list are separated by space.
  `border-hairline` / `divide-hairline` / `border-border` are not used
  for separation any more; borders remain only on controls (options,
  inputs, secondary buttons) and inside `components/weights/*`. The two
  containers left are the result page's verdict block and the memo
  sheet, both by shadow, not border. Elevation: `shadow-subtle` on a
  surface, `shadow-soft` on a page's lead block, `shadow-stuck` under a
  sticky bar.
- Alignment varies with the layout, on purpose: the hero and the home
  page's closing line centred; page headers, questions, rows and prose
  left; a band with one action puts the words left and the control
  right; footers and disclaimers end-aligned. Never centre a whole page.
- Page transitions: the header is fixed across navigations and the new
  page's bands rise into place (`.app-main > *`, staggered, off under
  reduced motion). Pages that wait for stored state render nothing until
  ready, so the rise happens when the content is real.
- Motion, one idea per page, all off under reduced motion: the header's
  underline slides between pages (`.nav-indicator`); the questionnaire's
  answer highlight slides to the chosen answer (`.seg-thumb`), the open
  question carries a pulsing dot, the keys 1, 2, 3 answer it, and a fresh
  answer scrolls the next question into view; the priority bubbles repack
  and glow, and the result's scale follows them live (`DecisionBalance`
  in `live` mode); the result's number counts up (`CountUp`), its bars
  grow in order, and a row under the pointer unfolds the reader's own
  answer; the memo's lines arrive one after another (`.memo-lines`); the
  home page's words drift in three rows (`.flow-row`) and pause under the
  pointer, each opening its question (`/questionnaire#question-<id>`).
- The home page's words are type, never chips: three weights
  (`data/factors.ts`), a big serif word in its part's hue, a semibold word
  and a small quiet one, on one baseline, a hue dot on the bigger two, four
  copies per row so the loop has no seam on a wide screen. The hero's
  question is the one heading set at `.text-hero-title`.
Do not reintroduce the cream page background, retired colors (orange
`#F97316`, teal `#0F8B8D`, the old competing blues) or grey shadows.

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

- Type: English headings and the memo's prose in Newsreader (a text
  serif, weight 500, optical sizes on), everything else in Source Sans 3.
  Chinese runs in the system faces (PingFang / Hiragino / YaHei) for
  headings and body alike, weight 600 for headings, taller lines; only
  the memo's prose (`.memo-prose`) takes the self-hosted Noto Serif SC
  500. Numbers, indexes and counters (question numbers, part numbers,
  scores, dates in lists) are set in JetBrains Mono through `.num`, with
  tabular figures. Display runs 40 to 68px with the tracking pulled in
  (-0.025em); one poster number per page (`.text-hero-number`, up to
  128px) is the only thing bigger. Small labels (`.text-eyebrow`) are
  sentence case; never set text in capitals or add wide tracking. Do not
  reintroduce Fraunces, Inter or a CJK sans web font.
- Voice: complete, ordinary sentences, the way a person would put it
  in a message to a friend. Model the sentence shapes on GOV.UK, NHS
  and flomo's help pages: 10 to 20 words (15 to 30 characters in
  Chinese), one idea each, no full stop at the end, "may", "probably"
  and "usually" where they are true. Never a fragment for effect ("Not by a mile, but
  clearly."), never a slogan, never a metaphor, never a clever
  heading. Headings are plain labels ("Your result", "What matters
  most to you"). Everyday words: job, rent, visa, parents; 找工作、
  房租、签证、爸妈. Conclusion first, then the reason, then what to
  do. Questions ask one thing; options are plain answers. English
  and Chinese are written natively, never translated from each
  other. Before shipping, read every string aloud; if it sounds like
  a website talking rather than a person, rewrite it.
- Dimensions have a `label` for headings and rows and a `phrase` for
  the inside of a sentence ("the visa situation"). Each option that
  pushes one way carries a `reason` (a clause after "you said");
  the result page and the memo quote the reader's own answers
  through `lib/reasons.ts` instead of naming dimensions. Prose
  rounds scores to whole points; tables keep one decimal.
- The site is bilingual (EN/中文). Every user-facing string lives in
  `lib/i18n/en.ts` with its Chinese twin in `lib/i18n/zh.ts` (same
  shape, enforced by the type); question and dimension copy lives in
  `data/questions.zh.ts` and `data/dimensions.zh.ts`, keyed by id, with
  the English data files staying canonical for ids and scores. Components
  read text through `useLocale()` / `useContent()`; never hardcode a
  user-facing string. The preference is a localStorage key like the rest
  of the app's state (`stay-or-return-locale-v1`); the switch lives on the
  home page.
- Punctuation in user-facing text: no full stops (`.` or `。`), no
  semicolons, no ellipses, no dashes (en or zh). Commas, colons and
  question marks are fine. One sentence per line: a value that needs
  two sentences is a list of lines (`string[]`) and the page shows each
  on its own line. The memo generator returns lines the same way.
- Say only what the page does not already show. No line explaining a
  control the reader can see (how a bar works, what a slider does, that
  a list is newest first), no closing line, no motto. If a reader would
  know what to do without the sentence, delete the sentence.
- A question is a prompt plus its options. No helper line under the
  prompt, no per-option notes.
- Body text runs the full width of its column. There is no reading
  measure token; do not cap paragraphs with a character width. A line
  breaks where the layout ends, never earlier.
