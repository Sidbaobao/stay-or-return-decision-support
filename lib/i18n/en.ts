import type { ConfidenceLevel, ScenarioId } from "@/types";

type StepCopy = { step: string; title: string; description: string };

// Every user-facing string, in English. zh.ts mirrors this shape exactly,
// so a string the Chinese version lacks is a type error, not a silent
// fallback. Sentences that depend on data are functions, because word order
// differs between the two languages.
//
// The voice: a friend who has thought about this properly. Conclusion
// first, then the reason, then what to do. Things are called what a person
// calls them (the visa, money, family), never what a spreadsheet calls
// them. Doubt goes into a specific number or a specific answer, not a
// disclaimer.

const pathWord: Record<ScenarioId, string> = {
  stay_us: "staying",
  return_china: "going back"
};

const verdictWord: Record<ScenarioId, string> = {
  stay_us: "stay",
  return_china: "go back"
};

function pastStatement(direction: ScenarioId, confidence: ConfidenceLevel, difference?: number): string {
  if (difference === 0) {
    return "Dead even";
  }

  if (confidence === "high") {
    return `Clear: ${verdictWord[direction]}`;
  }

  if (confidence === "medium") {
    return `Leaned toward ${pathWord[direction]}`;
  }

  return `Leaned a little toward ${pathWord[direction]}`;
}

function joinPhrases(phrases: string[]) {
  if (phrases.length <= 1) {
    return phrases[0] ?? "";
  }

  return `${phrases.slice(0, -1).join(", ")} and ${phrases[phrases.length - 1]}`;
}

function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Quoted answers read as one report: "you said X, and that Y".
function joinReasons(reasons: string[]) {
  if (reasons.length <= 1) {
    return reasons[0] ?? "";
  }

  return `${reasons.slice(0, -1).join(", ")}, and that ${reasons[reasons.length - 1]}`;
}

export const en = {
  tag: "en-US",
  brand: "Stay or Return",

  languageToggle: { label: "Language", en: "EN", zh: "中文" },

  nav: {
    home: "Home",
    questionnaire: "Questions",
    weights: "Priorities",
    results: "Result",
    memo: "Memo",
    primary: "Main navigation",
    lockedReason: "Answer the questions first.",
    profile: "Your profile",
    greeting: (nickname: string) => `Hi, ${nickname}`
  },

  titles: {
    questionnaire: "Questions",
    weights: "Priorities",
    results: "Result",
    memo: "Memo",
    profile: "Your profile",
    shared: "Shared result",
    snapshot: "Saved decision"
  },

  home: {
    heroTitle: "Stay, or go home? Work out which, and why.",
    heroSubtitle:
      "Twenty minutes of honest answers. Then a clear read on which way you lean, what is driving it, and what would change it.",
    howItWorks: "How it works",
    threeSteps: "Three short steps.",
    steps: [
      {
        step: "Step 1",
        title: "Answer 24 questions",
        description: "About work, money, the visa, family, daily life and the next ten years. Plain questions, plain answers."
      },
      {
        step: "Step 2",
        title: "Say what matters most",
        description: "Make the things you care about count for more."
      },
      {
        step: "Step 3",
        title: "Read the result",
        description: "Which way you lean, why, what would change it, and a memo you can keep."
      }
    ] satisfies [StepCopy, StepCopy, StepCopy],
    twoPaths: "Two paths",
    seeBoth: "Picture both before you weigh them.",
    picture: "A minute each. Then the questions.",
    stay: "Stay in the US",
    return: "Go back to China",
    closing: "Twenty minutes of honest answers beats a month of going round in circles.",
    footer: "Not legal, financial or immigration advice. Just your own answers, laid out."
  },

  cta: {
    start: "Start the questions",
    continue: "Pick up where you left off",
    startNew: "Start again",
    reviewLast: "Or see your last result",
    startOver: "Or start over",
    revisit: "Or look back at an earlier decision"
  },

  confirm: {
    keep: "Keep them",
    discardPrompt: "Throw away the answers you've given so far?",
    discard: "Throw them away"
  },

  reset: "Start over",

  notFound: {
    title: "That page isn't here.",
    body: "The link may have picked up or lost a character on its way.",
    home: "Go to the home page",
    start: "Start the questions"
  },

  appError: {
    title: "Something went wrong on this page.",
    body: "Reloading usually fixes it. Your answers are saved on this device and are not affected.",
    reload: "Reload the page",
    home: "Go to the home page",
    details: "Technical details"
  },

  questionnaire: {
    eyebrow: "Step 1",
    title: "The questions",
    answered: (count: number, total: number) => `${count} of ${total} answered`,
    stepsHeading: "Six parts",
    step: (index: number) => `Part ${index}`,
    done: "Done",
    ofCount: (count: number, total: number) => `${count} of ${total}`,
    answeredSuffix: " answered",
    currentDimension: "This part",
    backHome: "Home",
    previous: "Back",
    next: "Continue",
    nextStep: (label: string) => `Continue to ${label.toLowerCase()}`,
    questionOf: (index: number, total: number) => `Question ${index} of ${total}`,
    stepOf: (index: number, total: number) => `Part ${index} of ${total}`,
    remaining: (count: number) => (count === 1 ? "1 question left" : `${count} questions left`),
    saveContinue: "Continue to priorities",
    guiding: {
      career: "Where can you actually get the work you want?",
      salary_cost: "Where does your money go further for the life you want?",
      immigration: "How much does the visa situation weigh on you?",
      family_emotion: "How much do you need to be near your family?",
      lifestyle: "Which everyday life feels more like you?",
      long_term: "Ten years from now, where do you see yourself?"
    }
  },

  weights: {
    eyebrow: "Step 2",
    title: "What matters most right now?",
    description:
      "Your answers stay as they are. This is where you say which of the six counts for more. Make one bigger and the others shrink.",
    priorityMap: "Your priorities",
    fineTune: "Fine tune",
    minimum: "Lowest",
    maximum: "Highest it can go",
    cannotGrow: "The others are as small as they can be, so this one can't grow.",
    atMinimum: "This one is as small as it can be.",
    fineTuneAria: (label: string) => `Fine tune ${label}`,
    bubbleAria: (label: string, percentage: string) => `${label}, ${percentage}% of your priorities. Open fine tuning.`,
    decreaseAria: (label: string) => `Give ${label} less priority`,
    increaseAria: (label: string) => `Give ${label} more priority`,
    backQuestionnaire: "Back to the questions",
    saveContinue: "See the result"
  },

  results: {
    eyebrow: "Step 3",
    headline: (direction: ScenarioId, confidence: ConfidenceLevel, gap: number): string => {
      if (confidence === "high" && gap > 25) {
        return direction === "stay_us" ? "Stay. Your answers are clear about it." : "Go back. Your answers are clear about it.";
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `You lean toward ${pathWord[direction]}. Not by a mile, but clearly.`;
      }

      return `It's close. You lean a little toward ${pathWord[direction]}.`;
    },
    hook: (phrase: string, reason: string | null) =>
      reason ? `Mostly ${phrase}. You said ${reason}.` : `Mostly ${phrase}.`,
    hookNone: "Nothing stands out yet.",
    confidence: "How sure",
    confidenceLevel: { low: "Not very", medium: "Fairly", high: "Very" } satisfies Record<ConfidenceLevel, string>,
    confidenceAria: (level: string) => `${level} sure`,
    keyDrivers: "What's behind it",
    wherePulls: "Where each part of your life points",
    balanced: "Even",
    leans: (direction: ScenarioId) => `Toward ${pathWord[direction]}`,
    topDriver: "Biggest",
    stillClose: "Close",
    weightedPull: "after priorities",
    footnote:
      "The bars show how far your answers lean, all on one scale. The number is how much each part counts once your priorities are applied.",
    srBalanced: ", even between the two",
    srLean: (direction: ScenarioId, gap: number) => `, toward ${pathWord[direction]} by ${Math.round(gap)} points`,
    sensitivityCouldFlip: (gap: string, shift: string) =>
      `Changing your priorities could flip this. The lead is ${gap} points, and priorities alone could move it by up to ${shift}.`,
    sensitivityNoShift: (gap: string) =>
      `Changing your priorities won't flip this. The lead is ${gap} points, and the parts that are close don't add up to enough. Only different answers would.`,
    sensitivityCannotFlip: (gap: string, shift: string) =>
      `Changing your priorities won't flip this. The lead is ${gap} points, and priorities could move it by ${shift} at most.`,
    nudgeAria: "Keep this on your device",
    nudgeTitle: "This result is saved on this device.",
    nudgeBody: "Add a name if you want it to feel like yours. Nothing leaves this browser.",
    addNickname: "Add a name",
    notNow: "Not now",
    shareHeading: "Share this result",
    shareBody: "The link holds your answers and priorities. Nothing is uploaded. Anyone with the link can see it.",
    readMemo: "Want it written down?",
    adjustWeights: "Change priorities",
    openMemo: "Read the memo"
  },

  balance: {
    eyebrow: "The balance",
    evenly: "Dead even",
    leads: (leader: string) => `${leader} leads`,
    leader: { stay_us: "Staying", return_china: "Going back" } satisfies Record<ScenarioId, string>,
    stay: "Stay",
    return: "Go back",
    balanced: "Even",
    evenlyNow: "Dead even right now.",
    leadsBy: "Leads by",
    points: "points",
    ariaTied: "Balance: dead even between staying and going back.",
    aria: (leader: string, points: string) =>
      `Balance: ${leader} leads by ${points} points, on a scale from firmly staying on the left to firmly going back on the right.`,
    footnote: "Every answer moves this one balance, from firmly staying to firmly going back."
  },

  share: {
    copy: "Copy link",
    copied: "Copied.",
    manual: "Copy this link:"
  },

  memo: {
    title: "Decision memo",
    recommendation: "Where you land",
    verdict: { stay_us: "Stay.", return_china: "Go back." } satisfies Record<ScenarioId, string>,
    balanced: "Dead even.",
    confidence: { low: "Not very sure", medium: "Fairly sure", high: "Very sure" } satisfies Record<
      ConfidenceLevel,
      string
    >,
    whereLeans: "Where each part points",
    dimension: "Part",
    columnStay: "Stay",
    columnBalanced: "Even",
    columnReturn: "Go back",
    leanBalanced: "Even",
    leanStillClose: (direction: ScenarioId) => `Toward ${pathWord[direction]}, just`,
    lean: (direction: ScenarioId) => `Toward ${pathWord[direction]}`,
    leanClearly: (direction: ScenarioId) => `Firmly ${pathWord[direction]}`,
    srLeansBy: (gap: number) => `, by ${Math.round(gap)} points`,
    barsNote: "One scale for all six.",
    whatWouldChange: "What would change this",
    beforeDeciding: "Before you decide",
    backResults: "Back to the result",
    changeAnswers: "Change an answer",
    disclaimer: "This is your own answers, laid out. For the visa and the money, talk to someone who does this for a living.",

    // ---- sentences the generator composes from the run's numbers
    sentenceSeparator: " ",
    leadBalanced: "Your answers come out dead even.",
    leadBy: (direction: ScenarioId, gap: string) => `You lean toward ${pathWord[direction]}, by ${gap} points.`,
    carries: (leadPhrases: string[], reasons: string[], againstPhrase: string | null) => {
      const mostly =
        reasons.length > 0
          ? `Most of that is ${joinPhrases(leadPhrases)}: you said ${joinReasons(reasons)}.`
          : `Most of that is ${joinPhrases(leadPhrases)}.`;

      return againstPhrase
        ? `${mostly} ${capitalize(againstPhrase)} is the main thing pulling the other way.`
        : `${mostly} Nothing pulls the other way.`;
    },
    margin: {
      low: "It's a small lead. A couple of different answers would change it.",
      medium: "A clear lead, not a landslide.",
      high: "A wide lead."
    } satisfies Record<ConfidenceLevel, string>,
    otherPath: { stay_us: "Going back", return_china: "Staying" } satisfies Record<ScenarioId, string>,
    otherStrongerOn: (otherPath: string, againstPhrases: string[], leadPhrases: string[]) =>
      `${otherPath} wins on ${joinPhrases(againstPhrases)}. The day ${
        againstPhrases.length === 1 ? "that matters" : "those matter"
      } more to you than ${joinPhrases(leadPhrases)}, the answer flips.`,
    otherNotStronger: (otherPath: string) => `${otherPath} doesn't win on anything.`,
    noClose: "Nothing is close. Changing your priorities won't flip this. Only different answers would.",
    closeBalanced: (closePhrases: string[]) =>
      `${capitalize(joinPhrases(closePhrases))} ${closePhrases.length === 1 ? "is" : "are"} dead even, so ${
        closePhrases.length === 1 ? "its" : "their"
      } priority changes nothing. Only different answers would.`,
    closeShift: (closePhrases: string[], shift: string, gap: string, couldFlip: boolean) =>
      `${capitalize(joinPhrases(closePhrases))} ${closePhrases.length === 1 ? "is" : "are"} still close. Giving ${
        closePhrases.length === 1 ? "it" : "them"
      } more or less priority could move the result by up to ${shift} points against a lead of ${gap}, so priorities ${
        couldFlip ? "could flip it" : "alone won't flip it"
      }.`,
    levelPaths: "The two are level. Any change to an answer or a priority tips it.",
    planCompare: (leadPhrases: string[]) =>
      `Write one concrete plan for each path, then compare them on what decided this: ${joinPhrases(leadPhrases)}.`,
    planCompareGeneric: "Write one concrete plan for each path and put them side by side.",
    checkAssumption: (phrase: string, reason: string | null) =>
      reason
        ? `Check the one thing pulling the other way. You said ${reason}. Is that still true?`
        : `Check the one thing pulling the other way: ${phrase}.`,
    revisitWeights: (closePhrases: string[]) =>
      `Come back to your priorities once ${joinPhrases(closePhrases)} ${closePhrases.length === 1 ? "is" : "are"} clearer.`
  },

  shared: {
    intro: "Someone shared this result with you. It lives in the link itself. Nothing is stored anywhere.",
    eyebrow: "Shared result",
    headline: (direction: ScenarioId, confidence: ConfidenceLevel, gap: number): string => {
      if (confidence === "high" && gap > 25) {
        return `Their answers are clear: ${verdictWord[direction]}.`;
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `They lean toward ${pathWord[direction]}. Not by a mile, but clearly.`;
      }

      return `It's close. They lean a little toward ${pathWord[direction]}.`;
    },
    footnote:
      "The bars show how far their answers lean, all on one scale. The number is how much each part counts with their priorities.",
    cta: "Facing the same choice?",
    ctaBody: "Twenty-four questions, your own priorities, and nothing stored anywhere but your own browser.",
    tryIt: "Try it",
    explore: "See how it works",
    versionTitle: "This link is from an older version.",
    versionBody: "The questions have changed since it was made, so it can't be shown properly. Ask whoever sent it to share a fresh one.",
    invalidTitle: "This link doesn't work.",
    invalidBody:
      "It looks cut off or changed. The whole result lives inside the link, so a partial copy loses it. Ask for it again, or answer the questions yourself."
  },

  profile: {
    eyebrow: "Yours",
    titleWithName: (nickname: string) => `Hi, ${nickname}.`,
    title: "Your profile",
    description: "A name, a colour, and the decisions you've saved.",
    identity: "You",
    nickname: "Name",
    optional: "(optional)",
    placeholder: "What should we call you?",
    save: "Save",
    saved: "Saved.",
    accent: "Colour",
    accents: { warm: "Coral", stay: "Blue", return: "Red" } satisfies Record<"warm" | "stay" | "return", string>,
    created: (date: string, count: number) =>
      `Since ${date} · ${count === 1 ? "1 decision saved" : `${count} decisions saved`}`,
    privacyTitle: "Only on this device",
    privacyBody:
      "Your name and history live in this browser, on this device. Nothing is sent anywhere. No account, no cloud, no sync. We couldn't read it if we tried.",
    privacyFlip:
      "The other side of that: it won't follow you to another device, and clearing this browser's data erases it. Export a copy if you want to keep one.",
    exportData: "Export my data",
    deleteAll: "Delete everything",
    erasePrompt: "Delete your profile and every saved decision from this device?",
    erase: "Delete everything",
    historyEyebrow: "History",
    historyTitle: "Your decisions",
    newestFirst: "Newest first."
  },

  history: {
    emptyTitle: "Nothing saved yet.",
    emptyBody: "Finish the questions once and the result shows up here.",
    start: "Start the questions",
    view: "Open",
    delete: "Delete",
    removePrompt: "Remove this one?",
    remove: "Remove",
    drivenBy: (phrase: string) => `Mostly ${phrase}`,
    earlierVersion: "Older version of the questions",
    restore: "Reopen",
    tryAgain: "Try again",
    restoreFailed: "This one can't be reopened here.",
    replacePrompt: "Replace the answers you're working on?",
    replace: "Replace",
    keepCurrent: "Keep them",
    pastStatement,
    srGap: (points: number) => `, ${Math.round(points)} points apart`
  },

  snapshot: {
    missingTitle: "This one isn't on this device anymore.",
    missingBody: "It may have been deleted, or saved in another browser.",
    backProfile: "Back to your profile",
    intro: (date: string) => `Saved on this device on ${date}. Looking at it doesn't change what you're working on now.`,
    eyebrow: (date: string) => `Saved · ${date}`,
    pastHeadline: (direction: ScenarioId, confidence: ConfidenceLevel, difference?: number) =>
      `${pastStatement(direction, confidence, difference)}.`,
    confidence: (level: string) => `${level} sure`,
    gap: (points: number) => `${Math.round(points)} points apart`,
    earlierVersionBody:
      "This was made with an older set of questions, so the breakdown by part can't be rebuilt. The direction, the confidence and the gap are exactly what it showed at the time.",
    restoreNote: "Reopening makes this your current set of answers again.",
    keyDrivers: "What was behind it",
    wherePulled: "Where each part pointed",
    asOf: (date: string) => `As of ${date}.`
  }
};
