# Stay or Return

**An explainable decision tool for Chinese international students choosing between staying in
the U.S. and returning to China.**

[![Live](https://img.shields.io/badge/live-stayorreturn.com-2f5fd8)](https://stayorreturn.com)
![Next.js](https://img.shields.io/badge/Next.js-15-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Deployed on Vercel](https://img.shields.io/badge/deployed-Vercel-000)

Choosing where to build a life is too personal for a black box.  Stay or Return breaks the
decision into **24 questions across six dimensions** — career, salary and cost of living,
immigration and policy uncertainty, family, lifestyle, long-term development — lets users decide
how much each dimension matters, and shows what is pulling them in each direction and how
confident that result really is.  Users leave with a decision memo, not a verdict.

<p align="center">
  <img src="docs/screenshots/home.png" width="49%" alt="Home">
  <img src="docs/screenshots/questionnaire.png" width="49%" alt="Questionnaire">
</p>

## How it works

1. **Questionnaire** — six steps of four questions each, answered for the user's current
   situation; any step can be revisited.
2. **Weights** — an interactive bubble layout (d3-hierarchy) where the user sets how much each
   dimension matters, with fine-grained controls.
3. **Results** — a single **weighted-gap score** on a bipolar stay ↔ return scale with a
   confidence range, the key drivers, the dimensions the user is uncertain about, and a
   sensitivity analysis of how the result moves when priorities change.
4. **Memo** — a print-friendly decision memo with a side-by-side comparison.

### Why one score instead of two

The first version showed "stay" and "return" as separate scores.  Because the two values were
mathematically complementary, that presentation exaggerated the amount of information in the
result.  The model was rebuilt around one weighted gap,

```
gap = Σ_d  w_d · (score_d(stay) − score_d(return))        w_d ≥ 0,  Σ_d w_d = 1
```

reported together with a confidence range (how far the answers sit from neutral), the
dimensions that dominate the gap, and how much each weight would have to change to flip the
sign.

## Privacy by design

| | |
|---|---|
| No accounts | Profiles and a ten-result history live in the browser only (`lib/storage.ts`) |
| Private sharing | Shared results are encoded in the URL **fragment**, which browsers never send to the server (`lib/share.ts`) |
| Minimal analytics | The backend keeps coarse anonymous counts by direction and confidence — nothing per user (`lib/server`, Vercel KV) |
| Export / delete | Users can export their data as JSON or delete profile and history at any time |

<p align="center">
  <img src="docs/screenshots/profile.png" width="62%" alt="Profile page: private to this device">
</p>

## Project structure

```
app/            Next.js App Router pages: /, /questionnaire, /weights, /results, /report, /shared, /profile, /api
components/     UI by page (home, questionnaire, weights, results, report, share, profile) + shared ui/
data/           dimensions.ts, questions.ts (24 items), report-templates.ts
lib/            scoring.ts (weighted-gap model), report.ts, share.ts, storage.ts, guards.ts, stats-client.ts, server/
public/         hero videos (compressed from 56.4 MB to 2.6 MB, lazy-loaded) and posters
types/          shared TypeScript types
docs/           screenshots used in this README
```

## Run locally

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck
pnpm build && pnpm start
```

The questionnaire, weights, results and memo run entirely in the browser.  The aggregate
statistics endpoint expects a Vercel KV connection (`KV_REST_API_URL`, `KV_REST_API_TOKEN`) and
is skipped when none is configured.

## Built with

Next.js 15 · React · TypeScript · Tailwind CSS · d3-hierarchy · lucide-react · Vercel KV · Vercel

Designed and developed independently from product definition through deployment, with team
collaboration on promotion.
