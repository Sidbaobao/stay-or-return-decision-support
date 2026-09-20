import type { ConfidenceLevel, ScenarioId } from "@/types";

type StepCopy = { step: string; title: string; description: string };

// Every user-facing string, in English. zh.ts mirrors this shape exactly,
// so a string the Chinese version lacks is a type error, not a silent
// fallback. Sentences that depend on data are functions, because word order
// differs between the two languages.
//
// How this is written: complete, ordinary sentences, the way a person
// would put it in a message to a friend. No fragments for effect, no
// slogans, no metaphors, no clever headings. Everyday words: job, rent,
// visa, parents. "May", "probably" and "usually" are fine where they are
// true. Headings are plain labels.

const pathWord: Record<ScenarioId, string> = {
  stay_us: "staying",
  return_china: "going back"
};

function pastStatement(direction: ScenarioId, confidence: ConfidenceLevel, difference?: number): string {
  if (difference === 0) {
    return "Even";
  }

  if (confidence === "high") {
    return `Clearly ${pathWord[direction]}`;
  }

  if (confidence === "medium") {
    return `Leaned toward ${pathWord[direction]}`;
  }

  return `Leaned slightly toward ${pathWord[direction]}`;
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

// Quoted answers read as one sentence: "you said X, and that Y".
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
    lockedReason: "Finish the questions first.",
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
    heroTitle: "Should you stay in the US or go back to China?",
    heroSubtitle:
      "Answer 24 questions about your situation. You'll get a clear picture of which way you lean, what the main reasons are, and what would change the answer. It takes about 20 minutes.",
    howItWorks: "How it works",
    threeSteps: "It works in three steps.",
    steps: [
      {
        step: "Step 1",
        title: "Answer 24 questions",
        description: "They cover work, money, your visa, your family, daily life, and where you see yourself in ten years."
      },
      {
        step: "Step 2",
        title: "Say what matters most to you",
        description: "Give more weight to the parts you care about most. The result changes with it."
      },
      {
        step: "Step 3",
        title: "Read your result",
        description: "You'll see which way you lean, the main reasons, and a short memo you can save or print."
      }
    ] satisfies [StepCopy, StepCopy, StepCopy],
    twoPaths: "The two options",
    seeBoth: "Take a moment to picture each one.",
    picture: "One minute each. Then start the questions.",
    stay: "Staying in the US",
    return: "Going back to China",
    closing: "Most people find it helps just to see their own reasons written down.",
    footer: "This is not legal, financial or immigration advice. It only organises your own answers."
  },

  cta: {
    start: "Start the questions",
    continue: "Continue where you left off",
    startNew: "Start again",
    reviewLast: "Or look at your last result",
    startOver: "Or start over",
    revisit: "Or look at an earlier decision"
  },

  confirm: {
    keep: "Keep them",
    discardPrompt: "Do you want to delete the answers you've given so far?",
    discard: "Delete them"
  },

  reset: "Start over",

  notFound: {
    title: "We couldn't find that page.",
    body: "The link may be missing a few characters. You can go to the home page or start the questions.",
    home: "Go to the home page",
    start: "Start the questions"
  },

  appError: {
    title: "Something went wrong.",
    body: "Reloading the page usually fixes this. Your answers are saved on this device, so you won't lose them.",
    reload: "Reload the page",
    home: "Go to the home page",
    details: "Technical details"
  },

  questionnaire: {
    eyebrow: "Step 1",
    title: "The questions",
    answered: (count: number, total: number) => `${count} of ${total} answered`,
    stepsHeading: "The six parts",
    step: (index: number) => `Part ${index}`,
    done: "Done",
    ofCount: (count: number, total: number) => `${count} of ${total}`,
    answeredSuffix: " answered",
    currentDimension: "Current part",
    backHome: "Home",
    previous: "Back",
    next: "Continue",
    nextStep: (label: string) => `Continue to ${label.toLowerCase()}`,
    questionOf: (index: number, total: number) => `Question ${index} of ${total}`,
    stepOf: (index: number, total: number) => `Part ${index} of ${total}`,
    remaining: (count: number) => (count === 1 ? "1 question left" : `${count} questions left`),
    saveContinue: "Continue to priorities",
    guiding: {
      career: "Where are you more likely to get the kind of job you want?",
      salary_cost: "Where will your money go further?",
      immigration: "How much does your visa situation affect you?",
      family_emotion: "How important is it to be near your family?",
      lifestyle: "Where would you rather live day to day?",
      long_term: "Where do you see yourself in ten years?"
    }
  },

  weights: {
    eyebrow: "Step 2",
    title: "What matters most to you?",
    description:
      "Your answers don't change here. You're only saying which of the six parts should count for more in the result. If you make one bigger, the others get smaller.",
    priorityMap: "Your priorities",
    fineTune: "Adjust",
    minimum: "Lowest",
    maximum: "Highest possible",
    cannotGrow: "The other parts are already at their lowest, so this one can't go any higher.",
    atMinimum: "This one is already at its lowest.",
    fineTuneAria: (label: string) => `Adjust ${label}`,
    bubbleAria: (label: string, percentage: string) => `${label}, ${percentage}% of your priorities. Open adjustment.`,
    decreaseAria: (label: string) => `Give ${label} less priority`,
    increaseAria: (label: string) => `Give ${label} more priority`,
    backQuestionnaire: "Back to the questions",
    saveContinue: "See your result"
  },

  results: {
    eyebrow: "Step 3",
    headline: (direction: ScenarioId, confidence: ConfidenceLevel, gap: number): string => {
      if (confidence === "high" && gap > 25) {
        return `Your answers point clearly to ${pathWord[direction]}.`;
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `Your answers lean toward ${pathWord[direction]}. The gap is clear but not huge.`;
      }

      return `It's close. Your answers lean slightly toward ${pathWord[direction]}.`;
    },
    hook: (phrase: string, reason: string | null) =>
      reason ? `The biggest reason is ${phrase}. You said ${reason}.` : `The biggest reason is ${phrase}.`,
    hookNone: "No single part stands out yet.",
    confidence: "How clear it is",
    confidenceLevel: { low: "Not very", medium: "Fairly", high: "Very" } satisfies Record<ConfidenceLevel, string>,
    confidenceAria: (level: string) => `${level} clear`,
    keyDrivers: "The reasons",
    wherePulls: "How each part of your life comes out",
    balanced: "Even",
    leans: (direction: ScenarioId) => `Toward ${pathWord[direction]}`,
    topDriver: "Biggest",
    stillClose: "Close",
    weightedPull: "after your priorities",
    footnote:
      "Each bar shows how far your answers lean in that part. The number on the right is how much it counts in the result after your priorities.",
    srBalanced: ", even between the two",
    srLean: (direction: ScenarioId, gap: number) => `, toward ${pathWord[direction]} by ${Math.round(gap)} points`,
    sensitivityCouldFlip: (gap: string, shift: string) =>
      `If you change your priorities, the result could flip. The gap is ${gap} points, and your priorities alone could move it by up to ${shift}.`,
    sensitivityNoShift: (gap: string) =>
      `Changing your priorities won't flip this result. The gap is ${gap} points, and the parts that are close aren't big enough to close it. Only different answers would.`,
    sensitivityCannotFlip: (gap: string, shift: string) =>
      `Changing your priorities won't flip this result. The gap is ${gap} points, and your priorities could move it by ${shift} at most.`,
    nudgeAria: "Save this on your device",
    nudgeTitle: "This result is saved on this device.",
    nudgeBody: "If you add a name, your results will be listed under it. Nothing is sent anywhere.",
    addNickname: "Add a name",
    notNow: "Not now",
    shareHeading: "Share this result",
    shareBody: "The link contains your answers and priorities. Nothing is uploaded, and anyone who has the link can open it.",
    readMemo: "Want a written summary?",
    adjustWeights: "Change priorities",
    openMemo: "Read the memo"
  },

  balance: {
    eyebrow: "Overall",
    evenly: "Even",
    leads: (leader: string) => `${leader} is ahead`,
    leader: { stay_us: "Staying", return_china: "Going back" } satisfies Record<ScenarioId, string>,
    stay: "Stay",
    return: "Go back",
    balanced: "Even",
    evenlyNow: "It's even right now.",
    leadsBy: "Ahead by",
    points: "points",
    ariaTied: "Overall: even between staying and going back.",
    aria: (leader: string, points: string) =>
      `Overall: ${leader} is ahead by ${points} points, on a scale from strongly staying on the left to strongly going back on the right.`,
    footnote: "Every answer moves this scale a little, one way or the other."
  },

  share: {
    copy: "Copy link",
    copied: "Copied.",
    manual: "Copy this link:"
  },

  memo: {
    title: "Decision memo",
    recommendation: "Overall",
    verdict: { stay_us: "Stay in the US.", return_china: "Go back to China." } satisfies Record<ScenarioId, string>,
    balanced: "It's even.",
    confidence: { low: "Not very clear", medium: "Fairly clear", high: "Very clear" } satisfies Record<
      ConfidenceLevel,
      string
    >,
    whereLeans: "How each part comes out",
    dimension: "Part",
    columnStay: "Stay",
    columnBalanced: "Even",
    columnReturn: "Go back",
    leanBalanced: "Even",
    leanStillClose: (direction: ScenarioId) => `Slightly toward ${pathWord[direction]}`,
    lean: (direction: ScenarioId) => `Toward ${pathWord[direction]}`,
    leanClearly: (direction: ScenarioId) => `Clearly toward ${pathWord[direction]}`,
    srLeansBy: (gap: number) => `, by ${Math.round(gap)} points`,
    barsNote: "All six bars use the same scale.",
    whatWouldChange: "What would change this",
    beforeDeciding: "Before you decide",
    backResults: "Back to the result",
    changeAnswers: "Change an answer",
    disclaimer:
      "This memo only organises your own answers. It isn't legal, financial or immigration advice. For questions about your visa or your finances, please ask a professional.",

    // ---- sentences the generator composes from the run's numbers
    sentenceSeparator: " ",
    leadBalanced: "Overall, your answers come out even between staying and going back.",
    leadBy: (direction: ScenarioId, gap: string) =>
      `Overall, your answers point to ${pathWord[direction]}, by about ${gap} points.`,
    carries: (leadPhrases: string[], reasons: string[], againstPhrase: string | null) => {
      const reasonWord = leadPhrases.length === 1 ? "The biggest reason is" : "The biggest reasons are";
      const mostly =
        reasons.length > 0
          ? `${reasonWord} ${joinPhrases(leadPhrases)}. You said ${joinReasons(reasons)}.`
          : `${reasonWord} ${joinPhrases(leadPhrases)}.`;

      return againstPhrase
        ? `${mostly} ${capitalize(againstPhrase)} is the main thing on the other side.`
        : `${mostly} Nothing much points the other way.`;
    },
    margin: {
      low: "The gap is small. A couple of different answers would change the result.",
      medium: "The gap is clear but not huge.",
      high: "The gap is big."
    } satisfies Record<ConfidenceLevel, string>,
    otherPath: { stay_us: "Going back", return_china: "Staying" } satisfies Record<ScenarioId, string>,
    otherStrongerOn: (otherPath: string, againstPhrases: string[], leadPhrases: string[]) =>
      `${otherPath} comes out ahead on ${joinPhrases(againstPhrases)}. If ${joinPhrases(againstPhrases)} ever ${
        againstPhrases.length === 1 ? "matters" : "matter"
      } more to you than ${joinPhrases(leadPhrases)}, the result would flip.`,
    otherNotStronger: (otherPath: string) => `${otherPath} doesn't come out ahead on anything.`,
    noClose: "None of the parts are close, so changing your priorities won't flip this result. Only different answers would.",
    closeBalanced: (closePhrases: string[]) =>
      `${capitalize(joinPhrases(closePhrases))} ${closePhrases.length === 1 ? "is" : "are"} even, so changing ${
        closePhrases.length === 1 ? "its" : "their"
      } priority makes no difference. Only different answers would.`,
    closeShift: (closePhrases: string[], shift: string, gap: string, couldFlip: boolean) =>
      `${capitalize(joinPhrases(closePhrases))} ${closePhrases.length === 1 ? "is" : "are"} still close. Changing ${
        closePhrases.length === 1 ? "its" : "their"
      } priority could move the result by up to ${shift} points, against a gap of ${gap}. So your priorities ${
        couldFlip ? "could flip the result" : "alone can't flip it"
      }.`,
    levelPaths: "The two options are even. Changing any answer or priority would tip the result one way.",
    planCompare: (leadPhrases: string[]) =>
      `Write down a concrete plan for each option, then compare the two on what decided this: ${joinPhrases(leadPhrases)}.`,
    planCompareGeneric: "Write down a concrete plan for each option and compare them side by side.",
    checkAssumption: (phrase: string, reason: string | null) =>
      reason
        ? `Check the main thing on the other side. You said ${reason}. Is that still true?`
        : `Check the main thing on the other side: ${phrase}.`,
    revisitWeights: (closePhrases: string[]) =>
      `Once you're clearer about ${joinPhrases(closePhrases)}, come back and adjust your priorities.`
  },

  shared: {
    intro: "Someone shared this result with you. Everything is inside the link itself, and nothing is stored anywhere.",
    eyebrow: "Shared result",
    headline: (direction: ScenarioId, confidence: ConfidenceLevel, gap: number): string => {
      if (confidence === "high" && gap > 25) {
        return `Their answers point clearly to ${pathWord[direction]}.`;
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `Their answers lean toward ${pathWord[direction]}. The gap is clear but not huge.`;
      }

      return `It's close. Their answers lean slightly toward ${pathWord[direction]}.`;
    },
    footnote:
      "Each bar shows how far their answers lean in that part. The number on the right is how much it counts after their priorities.",
    cta: "Facing the same decision?",
    ctaBody: "It's 24 questions and your own priorities. Nothing is stored anywhere except in your own browser.",
    tryIt: "Try it yourself",
    explore: "See how it works",
    versionTitle: "This link is from an older version.",
    versionBody:
      "The questions have changed since this link was made, so it can't be shown correctly. Ask the person who sent it to share a new one.",
    invalidTitle: "This link doesn't work.",
    invalidBody:
      "It looks like the link was cut off or changed. The whole result is inside the link, so a partial copy won't open. Ask for it again, or try the questions yourself."
  },

  profile: {
    eyebrow: "Your profile",
    titleWithName: (nickname: string) => `Hi, ${nickname}.`,
    title: "Your profile",
    description: "Your name, your colour, and the decisions you've saved.",
    identity: "About you",
    nickname: "Name",
    optional: "(optional)",
    placeholder: "What should we call you?",
    save: "Save",
    saved: "Saved.",
    accent: "Colour",
    accents: { warm: "Coral", stay: "Blue", return: "Red" } satisfies Record<"warm" | "stay" | "return", string>,
    created: (date: string, count: number) =>
      `Since ${date} · ${count === 1 ? "1 decision saved" : `${count} decisions saved`}`,
    privacyTitle: "Everything stays on this device",
    privacyBody:
      "Your name and your history are only saved in this browser on this device. Nothing is sent to us or to anyone else. There's no account, no cloud and no sync.",
    privacyFlip:
      "That also means it won't show up on another device, and clearing your browser data will delete it. If you want to keep a copy, export it.",
    exportData: "Export my data",
    deleteAll: "Delete everything",
    erasePrompt: "Delete your profile and all saved decisions from this device?",
    erase: "Delete everything",
    historyEyebrow: "History",
    historyTitle: "Your decisions",
    newestFirst: "Newest first."
  },

  history: {
    emptyTitle: "You haven't saved any decisions yet.",
    emptyBody: "Once you finish the questions, your result will show up here.",
    start: "Start the questions",
    view: "Open",
    delete: "Delete",
    removePrompt: "Remove this one?",
    remove: "Remove",
    drivenBy: (phrase: string) => `Mainly ${phrase}`,
    earlierVersion: "Older version of the questions",
    restore: "Reopen",
    tryAgain: "Try again",
    restoreFailed: "This one can't be reopened here.",
    replacePrompt: "Replace the answers you're working on now?",
    replace: "Replace",
    keepCurrent: "Keep them",
    pastStatement,
    srGap: (points: number) => `, ${Math.round(points)} points apart`
  },

  snapshot: {
    missingTitle: "This decision isn't on this device anymore.",
    missingBody: "It may have been deleted, or it was saved in a different browser.",
    backProfile: "Back to your profile",
    intro: (date: string) => `You saved this on ${date}. Looking at it doesn't change your current answers.`,
    eyebrow: (date: string) => `Saved on ${date}`,
    pastHeadline: (direction: ScenarioId, confidence: ConfidenceLevel, difference?: number) =>
      `${pastStatement(direction, confidence, difference)}.`,
    confidence: (level: string) => `${level} clear`,
    gap: (points: number) => `${Math.round(points)} points apart`,
    earlierVersionBody:
      "This was saved with an older set of questions, so the breakdown by part can't be shown. The direction, how clear it was and the gap are what it showed at the time.",
    restoreNote: "Reopening makes this your current set of answers again.",
    keyDrivers: "The reasons",
    wherePulled: "How each part came out",
    asOf: (date: string) => `As of ${date}.`
  }
};
