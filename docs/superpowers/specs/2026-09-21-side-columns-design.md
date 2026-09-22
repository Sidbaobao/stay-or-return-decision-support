# Side columns as navigation and actions

Date: 2026-09-21. Status: approved in conversation, implemented on `design/side-columns`.

## Problem

On wide screens several pages keep a heading column beside their content (the offset grid). After the graphite redesign those columns hold only a heading, so the questionnaire's rail, the result pages' left columns and the memo's right column read as empty. The owner asked for the empty space to carry something useful and interactive, with a compact version on phones.

## Decision

Each side column becomes that page's navigation and action bar. Nothing decorative, no new copy: every element either moves the reader somewhere on the page or does something with the result.

## Questionnaire rail

- Each rail item: the part's number, its name, and four dots, one per question. An answered question's dot is filled in the part's hue with a small glow; an open one is an outline; the open question the reader is on carries a pulsing ring in the part's hue. A finished part shows four filled dots (the check icon goes).
- Every dot is a button named "Question 7 of 24". Clicking a dot in another part switches to that part first, then scrolls the question to the centre and focuses its first answer; in the current part it scrolls at once.
- Under the rail on wide screens: three key caps (1, 2, 3) with the existing `keysHint` sentence. Hidden where there is no pointer (`hover: none`).
- Phone: the rail strip keeps the dots at 6px; the key hint does not appear. The strip scrolls inside its own box.
- The dots derive from the current answers; no new state. Jumping reuses `pendingQuestionRef`, which already scrolls to a question once its part is on screen.

## Result, shared result, saved decision

- Under "How it adds up": the balance scale (`DecisionBalance`, reveal mode), which shows the close zone the split bar cannot. On a phone the scale renders under the split bar instead of above it.
- Under "Part by part": the sensitivity lines, then the page's actions stacked: result page copies the link (primary), opens the memo, changes priorities; shared result carries "Facing the same decision?", its line and "Try it yourself"; saved decision carries "As of <date>", "Reopen" and "Back to your profile".
- The share band and the footer band on the result page go, as does the shared page's footer band; the saved decision's header loses its Reopen and back link (they live in the column). The "add a name" card stays.
- Phone: the actions render once more as a row under the tiles (`lg:hidden`); the column's copy is `hidden lg:block`.

## Memo

- Right column: a four-item outline (Overall, How each part comes out, What would change this, Before you decide) reusing the sheet's own headings, numbered. Clicking scrolls smoothly to the section; the section under the reading line (35% down the viewport) is current and shows a short 2px mark in action blue. The date and the Print, Back to the result and Change an answer controls follow.
- Phone: a sticky glass strip above the sheet with the four items as horizontal tabs. Print hides the outline and the controls (`memo-screen-actions`).
- The four sections get ids (`memo-overall`, `memo-parts`, `memo-change`, `memo-before`) and a scroll margin.

## Rules

- No new dictionary keys; all labels exist.
- Tokens only; the dots' hue is `--color-dim-<id>`.
- Reduced motion: no pulse, instant scrolls, no highlight transition.
- Touch targets: dot hit area 24px, outline tabs 44px tall.

## Verification

`pnpm typecheck`, `pnpm build`; screenshots of every page at 1440px (EN) and on a phone (中文); interaction checks: a dot jumps to its question and focuses it, an outline item scrolls to its section and becomes current, the result column's copy button reports "Copied"; the existing five checks still pass.
