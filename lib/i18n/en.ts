import type { ConfidenceLevel, ScenarioId } from "@/types";

type StepCopy = { step: string; title: string; description: string };

// Every user-facing string, in English. zh.ts mirrors this shape exactly,
// so a string the Chinese version lacks is a type error, not a silent
// fallback. Sentences that depend on data are functions, because word order
// differs between the two languages.
//
// How this is written: short, ordinary sentences, one idea each, the way a
// person would put it in a message. No full stop at the end of a line. A
// value that needs two sentences is a list of lines, and the page shows
// each on its own line. Nothing that explains what the page already shows.

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
    lockedReason: "Finish the questions first",
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
    heroFacts: ["24 questions", "About 20 minutes", "Nothing leaves your browser"],
    flowAria: "The things this decision turns on",
    factorQuestion: (index: number) => `Question ${index}`,
    howItWorks: "How it works",
    steps: [
      {
        step: "Step 1",
        title: "Answer 24 questions",
        description: "They cover work, money, your visa, your family, daily life and the long term"
      },
      {
        step: "Step 2",
        title: "Say what matters most to you",
        description: "Give more weight to the parts you care about most"
      },
      {
        step: "Step 3",
        title: "Read your result",
        description: "You'll see which way you lean, the main reasons, and a memo you can save"
      }
    ] satisfies [StepCopy, StepCopy, StepCopy],
    twoPaths: "The two options",
    stay: "Staying in the US",
    return: "Going back to China",
    footer: "This is not legal, financial or immigration advice"
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
    title: "We couldn't find that page",
    body: "The link may be missing a few characters",
    home: "Go to the home page",
    start: "Start the questions"
  },

  appError: {
    title: "Something went wrong",
    body: ["Reloading the page usually fixes this", "Your answers are saved on this device"],
    reload: "Reload the page",
    home: "Go to the home page",
    details: "Technical details"
  },

  questionnaire: {
    eyebrow: "Step 1",
    title: "The questions",
    answered: (count: number, total: number) => `${count} of ${total} answered`,
    stepsHeading: "The six parts",
    keysHint: "Press 1, 2 or 3 to answer the open question",
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
    description: "The bigger a part, the more it counts in your result",
    priorityMap: "Your priorities",
    fineTune: "Adjust",
    minimum: "Lowest",
    maximum: "Highest possible",
    cannotGrow: "The other parts are already at their lowest",
    atMinimum: "This one is already at its lowest",
    fineTuneAria: (label: string) => `Adjust ${label}`,
    bubbleAria: (label: string, percentage: string) => `${label}, ${percentage}% of your priorities, open to adjust`,
    decreaseAria: (label: string) => `Give ${label} less priority`,
    increaseAria: (label: string) => `Give ${label} more priority`,
    backQuestionnaire: "Back to the questions",
    saveContinue: "See your result"
  },

  results: {
    eyebrow: "Step 3",
    headline: (direction: ScenarioId, confidence: ConfidenceLevel, gap: number): string => {
      if (confidence === "high" && gap > 25) {
        return `Your answers point clearly to ${pathWord[direction]}`;
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `Your answers lean toward ${pathWord[direction]}`;
      }

      return `Your answers lean slightly toward ${pathWord[direction]}`;
    },
    hook: (phrase: string, reason: string | null): string[] =>
      reason ? [`The biggest reason is ${phrase}`, `You said ${reason}`] : [`The biggest reason is ${phrase}`],
    hookNone: ["No single part stands out yet"],
    youSaid: (reason: string) => `You said ${reason}`,
    confidence: "How clear it is",
    confidenceLevel: { low: "Not very", medium: "Fairly", high: "Very" } satisfies Record<ConfidenceLevel, string>,
    confidenceAria: (level: string) => `${level} clear`,
    keyDrivers: "The reasons",
    wherePulls: "How each part comes out",
    splitHeading: "How it adds up",
    partsHeading: "Part by part",
    percentToward: (percent: number, direction: ScenarioId) => `${percent}% toward ${pathWord[direction]}`,
    percentEven: "Even",
    balanced: "Even",
    leans: (direction: ScenarioId) => `Toward ${pathWord[direction]}`,
    topDriver: "Biggest",
    stillClose: "Close",
    weightedPull: "after your priorities",
    srBalanced: ", even between the two",
    srLean: (direction: ScenarioId, gap: number) => `, toward ${pathWord[direction]} by ${Math.round(gap)} points`,
    sensitivityCouldFlip: (gap: string, shift: string): string[] => [
      "Changing your priorities could flip this result",
      `The gap is ${gap} points and your priorities alone could move it by up to ${shift}`
    ],
    sensitivityNoShift: (gap: string): string[] => [
      "Changing your priorities won't flip this result",
      `The gap is ${gap} points and the close parts aren't big enough to close it`
    ],
    sensitivityCannotFlip: (gap: string, shift: string): string[] => [
      "Changing your priorities won't flip this result",
      `The gap is ${gap} points and your priorities could move it by ${shift} at most`
    ],
    nudgeAria: "Save this on your device",
    nudgeTitle: "This result is saved on this device",
    nudgeBody: "Add a name and your results will be listed under it",
    addNickname: "Add a name",
    notNow: "Not now",
    shareHeading: "Share this result",
    shareBody: "Your answers are inside the link, so anyone who has it can open it",
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
    evenlyNow: "It's even right now",
    leadsBy: "Ahead by",
    points: "points",
    ariaTied: "Overall: even between staying and going back",
    aria: (leader: string, points: string) =>
      `Overall: ${leader} is ahead by ${points} points, on a scale from strongly staying on the left to strongly going back on the right`
  },

  share: {
    copy: "Copy link",
    copied: "Copied",
    manual: "Copy this link:"
  },

  memo: {
    title: "Decision memo",
    recommendation: "Overall",
    verdict: { stay_us: "Stay in the US", return_china: "Go back to China" } satisfies Record<ScenarioId, string>,
    balanced: "It's even",
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
    whatWouldChange: "What would change this",
    beforeDeciding: "Before you decide",
    backResults: "Back to the result",
    changeAnswers: "Change an answer",
    print: "Print",
    disclaimer: ["This memo only organises your own answers", "It is not legal, financial or immigration advice"],

    // ---- lines the generator composes from the run's numbers, one sentence each
    leadBalanced: "Overall, your answers come out even between staying and going back",
    leadBy: (direction: ScenarioId, gap: string) =>
      `Overall, your answers point to ${pathWord[direction]} by about ${gap} points`,
    carries: (leadPhrases: string[], reasons: string[], againstPhrase: string | null): string[] => {
      const reasonWord = leadPhrases.length === 1 ? "The biggest reason is" : "The biggest reasons are";
      const lines = [`${reasonWord} ${joinPhrases(leadPhrases)}`];

      if (reasons.length > 0) {
        lines.push(`You said ${joinReasons(reasons)}`);
      }

      lines.push(
        againstPhrase ? `${capitalize(againstPhrase)} is the main thing on the other side` : "Nothing much points the other way"
      );

      return lines;
    },
    margin: {
      low: "The gap is small enough that a couple of different answers would change the result",
      medium: "The gap is clear but not huge",
      high: "The gap is big"
    } satisfies Record<ConfidenceLevel, string>,
    otherPath: { stay_us: "Going back", return_china: "Staying" } satisfies Record<ScenarioId, string>,
    otherStrongerOn: (otherPath: string, againstPhrases: string[], leadPhrases: string[]): string[] => [
      `${otherPath} comes out ahead on ${joinPhrases(againstPhrases)}`,
      `If ${joinPhrases(againstPhrases)} ever ${againstPhrases.length === 1 ? "matters" : "matter"} more to you than ${joinPhrases(
        leadPhrases
      )}, the result would flip`
    ],
    otherNotStronger: (otherPath: string): string[] => [`${otherPath} doesn't come out ahead on anything`],
    noClose: ["None of the parts are close, so changing your priorities won't flip this result", "Only different answers would"],
    closeBalanced: (closePhrases: string[]): string[] => [
      `${capitalize(joinPhrases(closePhrases))} ${closePhrases.length === 1 ? "is" : "are"} even, so changing ${
        closePhrases.length === 1 ? "its" : "their"
      } priority makes no difference`,
      "Only different answers would"
    ],
    closeShift: (closePhrases: string[], shift: string, gap: string, couldFlip: boolean): string[] => [
      `${capitalize(joinPhrases(closePhrases))} ${closePhrases.length === 1 ? "is" : "are"} still close`,
      `Changing ${closePhrases.length === 1 ? "its" : "their"} priority could move the result by up to ${shift} points, against a gap of ${gap}`,
      couldFlip ? "So your priorities could flip the result" : "So your priorities alone can't flip it"
    ],
    levelPaths: ["The two options are even", "Changing any answer or priority would tip the result one way"],
    planCompare: (leadPhrases: string[]): string[] => [
      `Write down a concrete plan for each option, then compare the two on ${joinPhrases(leadPhrases)}`
    ],
    planCompareGeneric: ["Write down a concrete plan for each option and compare them side by side"],
    checkAssumption: (phrase: string, reason: string | null): string[] =>
      reason
        ? ["Check the main thing on the other side", `You said ${reason}`, "Is that still true?"]
        : [`Check the main thing on the other side: ${phrase}`],
    revisitWeights: (closePhrases: string[]): string[] => [
      `Once you're clearer about ${joinPhrases(closePhrases)}, come back and adjust your priorities`
    ]
  },

  shared: {
    intro: "Someone shared this result with you",
    eyebrow: "Shared result",
    headline: (direction: ScenarioId, confidence: ConfidenceLevel, gap: number): string => {
      if (confidence === "high" && gap > 25) {
        return `Their answers point clearly to ${pathWord[direction]}`;
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `Their answers lean toward ${pathWord[direction]}`;
      }

      return `Their answers lean slightly toward ${pathWord[direction]}`;
    },
    cta: "Facing the same decision?",
    ctaBody: "It's 24 questions and about 20 minutes",
    tryIt: "Try it yourself",
    explore: "See how it works",
    versionTitle: "This link is from an older version",
    versionBody: ["The questions have changed since it was made", "Ask the person who sent it to share a new one"],
    invalidTitle: "This link doesn't work",
    invalidBody: ["It looks like the link was cut off or changed", "Ask for it again, or try the questions yourself"]
  },

  profile: {
    eyebrow: "Your profile",
    titleWithName: (nickname: string) => `Hi, ${nickname}`,
    title: "Your profile",
    identity: "About you",
    nickname: "Name",
    optional: "(optional)",
    placeholder: "What should we call you?",
    save: "Save",
    saved: "Saved",
    accent: "Colour",
    accents: { warm: "Coral", stay: "Blue", return: "Red" } satisfies Record<"warm" | "stay" | "return", string>,
    sinceDate: (date: string) => `Since ${date}`,
    decisionsLabel: (count: number): string => (count === 1 ? "decision saved" : "decisions saved"),
    privacyTitle: "Everything stays on this device",
    privacyBody: [
      "Your name and your history are only saved in this browser on this device",
      "There's no account, no cloud and no sync"
    ],
    privacyFlip: "If you want to keep a copy, export it",
    exportData: "Export my data",
    deleteAll: "Delete everything",
    erasePrompt: "Delete your profile and all saved decisions from this device?",
    erase: "Delete everything",
    historyEyebrow: "History",
    historyTitle: "Your decisions"
  },

  history: {
    emptyTitle: "You haven't saved any decisions yet",
    emptyBody: "Once you finish the questions, your result will show up here",
    start: "Start the questions",
    view: "Open",
    delete: "Delete",
    removePrompt: "Remove this one?",
    remove: "Remove",
    drivenBy: (phrase: string) => `Mainly ${phrase}`,
    earlierVersion: "Older version of the questions",
    restore: "Reopen",
    tryAgain: "Try again",
    restoreFailed: "This one can't be reopened here",
    replacePrompt: "Replace the answers you're working on now?",
    replace: "Replace",
    keepCurrent: "Keep them",
    pastStatement,
    srGap: (points: number) => `, ${Math.round(points)} points apart`
  },

  snapshot: {
    missingTitle: "This decision isn't on this device anymore",
    missingBody: "It may have been deleted, or saved in a different browser",
    backProfile: "Back to your profile",
    eyebrow: (date: string) => `Saved on ${date}`,
    pastHeadline: (direction: ScenarioId, confidence: ConfidenceLevel, difference?: number) =>
      pastStatement(direction, confidence, difference),
    confidence: (level: string) => `${level} clear`,
    gap: (points: number) => `${Math.round(points)} points apart`,
    earlierVersionBody: "This was saved with an older set of questions, so the breakdown by part can't be shown",
    restoreNote: "Reopening makes this your current set of answers again",
    keyDrivers: "The reasons",
    wherePulled: "How each part came out",
    asOf: (date: string) => `As of ${date}`
  }
};
