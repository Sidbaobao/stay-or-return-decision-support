import type { ConfidenceLevel, ScenarioId } from "@/types";

type StepCopy = { step: string; title: string; description: string };

// Every user-facing string, in English. zh.ts mirrors this shape exactly,
// so a string the Chinese version lacks is a type error, not a silent
// fallback. Sentences that depend on data are functions, because word order
// differs between the two languages.

const pathWord: Record<ScenarioId, string> = {
  stay_us: "staying",
  return_china: "returning"
};

function pastStatement(direction: ScenarioId, confidence: ConfidenceLevel, difference?: number): string {
  if (difference === 0) {
    return "Came out evenly balanced";
  }

  const path = pathWord[direction];

  if (confidence === "high") {
    return `Pointed clearly toward ${path}`;
  }

  if (confidence === "medium") {
    return `Leaned toward ${path}`;
  }

  return `Leaned slightly toward ${path}`;
}

function joinLabels(labels: string[]) {
  if (labels.length <= 1) {
    return labels[0] ?? "";
  }

  return `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}`;
}

export const en = {
  tag: "en-US",
  brand: "Stay or Return",

  languageToggle: { label: "Language", en: "EN", zh: "中文" },

  nav: {
    home: "Home",
    questionnaire: "Questionnaire",
    weights: "Weights",
    results: "Results",
    memo: "Memo",
    primary: "Primary navigation",
    lockedReason: "Complete the questionnaire first.",
    profile: "My profile",
    greeting: (nickname: string) => `Hi, ${nickname}`
  },

  titles: {
    questionnaire: "Questionnaire",
    weights: "Weights",
    results: "Results",
    memo: "Memo",
    profile: "My profile",
    shared: "Shared result",
    snapshot: "Snapshot"
  },

  home: {
    heroTitle: "Think clearly about staying in the US or returning to China.",
    heroSubtitle: "Compare the tradeoffs, set your priorities, and see what is driving the result.",
    howItWorks: "How it works",
    threeSteps: "Three steps. Clear reasoning.",
    steps: [
      { step: "Step 1", title: "Answer questions", description: "Practical questions across six decision dimensions." },
      { step: "Step 2", title: "Set priorities", description: "Decide how much each dimension counts." },
      { step: "Step 3", title: "Review output", description: "See the scores, tradeoffs, uncertainty, and decision memo." }
    ] satisfies [StepCopy, StepCopy, StepCopy],
    twoPaths: "Two paths",
    seeBoth: "See both paths clearly.",
    picture: "Picture each future before you weigh the tradeoffs.",
    stay: "Stay in the US",
    return: "Return to China",
    closing: "A decision this big deserves your clearest thinking.",
    footer: "A reflection tool for clearer tradeoffs, not legal, financial, or immigration advice."
  },

  cta: {
    start: "Start questionnaire",
    continue: "Continue questionnaire",
    startNew: "Start a new questionnaire",
    reviewLast: "Or review your last results",
    startOver: "Or start over",
    revisit: "Or revisit a past decision"
  },

  confirm: {
    keep: "Keep",
    discardPrompt: "Discard your in-progress answers?",
    discard: "Discard"
  },

  reset: "Reset current run",

  questionnaire: {
    eyebrow: "Step 1",
    title: "Questionnaire",
    answered: (count: number, total: number) => `${count} of ${total} answered`,
    stepsHeading: "Questionnaire steps",
    step: (index: number) => `Step ${index}`,
    done: "Done",
    ofCount: (count: number, total: number) => `${count} of ${total}`,
    answeredSuffix: " answered",
    currentDimension: "Current dimension",
    backHome: "Back to home",
    previous: "Previous",
    next: "Next",
    nextStep: (label: string) => `Next: ${label}`,
    questionOf: (index: number, total: number) => `Question ${index} of ${total}`,
    stepOf: (index: number, total: number) => `Step ${index} of ${total}`,
    remaining: (count: number) => (count === 1 ? "1 question still open" : `${count} questions still open`),
    saveContinue: "Save and continue to weights",
    guiding: {
      career: "Where can you realistically build the career you want?",
      salary_cost: "Where does your money actually go further for the life you want?",
      immigration: "How much does visa and status uncertainty weigh on you?",
      family_emotion: "How strong is the pull of the people back home?",
      lifestyle: "Which daily life genuinely feels more like you?",
      long_term: "Which path do you trust more over the next ten years?"
    }
  },

  weights: {
    eyebrow: "Step 2",
    title: "Set your priorities",
    description:
      "Your answers stay as they are. Weights set how much each dimension counts, and making one larger makes the others smaller.",
    priorityMap: "Priority map",
    fineTune: "Fine tune",
    minimum: "Minimum priority",
    maximum: "Maximum possible share",
    cannotGrow: "Other priorities are already at the minimum, so this one cannot grow further.",
    atMinimum: "This priority is already at the minimum.",
    fineTuneAria: (label: string) => `Fine tune ${label} priority`,
    bubbleAria: (label: string, percentage: string) => `${label}, ${percentage}% priority. Open fine tuning.`,
    decreaseAria: (label: string) => `Decrease ${label} priority`,
    increaseAria: (label: string) => `Increase ${label} priority`,
    backQuestionnaire: "Back to questionnaire",
    saveContinue: "Save and continue to results"
  },

  results: {
    eyebrow: "Step 3 / Results",
    headline: (direction: ScenarioId, confidence: ConfidenceLevel, gap: number): string => {
      const isStay = direction === "stay_us";

      if (confidence === "high" && gap > 25) {
        return isStay ? "The US is clearly your path right now." : "Returning to China is clearly your path right now.";
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return isStay
          ? "You're leaning toward staying, with real tradeoffs."
          : "You're leaning toward returning, with real tradeoffs.";
      }

      return isStay ? "It's close. You lean slightly toward staying." : "It's close. You lean slightly toward returning.";
    },
    hook: (dimensionLabel: string, direction: ScenarioId) =>
      `${dimensionLabel} creates the strongest pull, pointing toward ${
        direction === "stay_us" ? "staying in the US" : "returning to China"
      }.`,
    hookNone: "No single dimension creates a strong pull yet.",
    confidence: "Confidence",
    confidenceLevel: { low: "Low", medium: "Medium", high: "High" } satisfies Record<ConfidenceLevel, string>,
    confidenceAria: (level: string) => `${level} confidence`,
    keyDrivers: "Key drivers",
    wherePulls: "Where each dimension pulls",
    balanced: "Balanced",
    leans: (direction: ScenarioId) => `Leans toward ${pathWord[direction]}`,
    topDriver: "Top driver",
    stillClose: "Still close",
    weightedPull: "weighted pull",
    footnote: "Bars show how far your answers lean, on one shared scale. The number is each dimension's weighted pull on the result.",
    srBalanced: ", balanced between the two paths",
    srLean: (direction: ScenarioId, gap: number) => `, leans ${direction === "stay_us" ? "stay" : "return"} by ${gap} points`,
    sensitivityCouldFlip: (gap: string, shift: string) =>
      `Re-weighting could flip this result: the lead is ${gap} points, and changing weights could move it by up to ${shift}.`,
    sensitivityNoShift: (gap: string) =>
      `Re-weighting alone would not flip this result: the lead is ${gap} points, and re-weighting the dimensions that are still close would not move it.`,
    sensitivityCannotFlip: (gap: string, shift: string) =>
      `Re-weighting alone would not flip this result: the lead is ${gap} points, and changing weights could move it by at most ${shift}.`,
    nudgeAria: "Local profile suggestion",
    nudgeTitle: "This result is saved on this device.",
    nudgeBody: "Add a nickname to make it yours. Everything stays in this browser, private to you.",
    addNickname: "Add a nickname",
    notNow: "Not now",
    shareHeading: "Share this result",
    shareBody: "The link itself carries your answers and weights. Nothing is uploaded, and anyone with the link can see this result.",
    readMemo: "Read the full memo",
    adjustWeights: "Adjust weights",
    openMemo: "Open the memo"
  },

  balance: {
    eyebrow: "Decision balance",
    evenly: "Evenly balanced",
    leads: (leader: string) => `${leader} leads`,
    leader: { stay_us: "Stay in the US", return_china: "Return to China" } satisfies Record<ScenarioId, string>,
    stay: "Stay",
    return: "Return",
    balanced: "Balanced",
    evenlyNow: "Evenly balanced right now.",
    leadsBy: "Leads by",
    points: "points",
    ariaTied: "Decision balance: evenly balanced between staying in the US and returning to China.",
    aria: (leader: string, points: string) =>
      `Decision balance: ${leader} leads by ${points} points on one scale running from strong stay on the left to strong return on the right.`,
    footnote: "Each answer moves this one balance, from strong stay to strong return."
  },

  share: {
    copy: "Copy share link",
    copied: "Link copied.",
    manual: "Copy the link manually:"
  },

  memo: {
    title: "Decision Memo",
    recommendation: "Recommendation",
    verdict: { stay_us: "Stay in the US.", return_china: "Return to China." } satisfies Record<ScenarioId, string>,
    balanced: "Evenly balanced.",
    confidence: { low: "Low confidence", medium: "Moderate confidence", high: "High confidence" } satisfies Record<
      ConfidenceLevel,
      string
    >,
    whereLeans: "Where each dimension leans",
    dimension: "Dimension",
    columnStay: "Stay",
    columnBalanced: "Balanced",
    columnReturn: "Return",
    leanBalanced: "Balanced",
    leanStillClose: (direction: ScenarioId) => `Leans toward ${pathWord[direction]}, still close`,
    lean: (direction: ScenarioId) => `Leans toward ${pathWord[direction]}`,
    leanClearly: (direction: ScenarioId) => `Clearly favors ${pathWord[direction]}`,
    srLeansBy: (gap: number) => `, leans by ${gap} points`,
    barsNote: "Bars share one scale.",
    whatWouldChange: "What would change this",
    beforeDeciding: "Before deciding",
    backResults: "Back to results",
    changeAnswers: "Change answers",
    disclaimer: "A structured reflection, not legal, immigration or financial advice.",

    // ---- sentences the generator composes from the run's numbers
    sentenceSeparator: " ",
    leadBalanced: "Your answers come out evenly balanced between the two paths.",
    leadBy: (direction: ScenarioId, gap: string) => `Your answers lean toward ${pathWord[direction]} by ${gap} points.`,
    carries: (leadLabels: string[], strongestAgainst: string | null) => {
      const carries =
        leadLabels.length === 1
          ? `${leadLabels[0]} carries most of that lead`
          : `${joinLabels(leadLabels)} carry most of that lead`;

      return strongestAgainst
        ? `${carries}. ${strongestAgainst} is the strongest pull the other way.`
        : `${carries}. Nothing pulls the other way.`;
    },
    margin: {
      low: "The margin is small: a few different answers would change it.",
      medium: "The margin is clear but not decisive.",
      high: "The margin is wide."
    } satisfies Record<ConfidenceLevel, string>,
    otherPath: { stay_us: "Returning to China", return_china: "Staying in the US" } satisfies Record<ScenarioId, string>,
    otherStrongerOn: (otherPath: string, againstLabels: string[], leadLabels: string[]) =>
      `${otherPath} is stronger on ${joinLabels(againstLabels)}. For it to lead, ${
        againstLabels.length === 1 ? "that" : "those"
      } would have to matter more to you than ${joinLabels(leadLabels)} ${leadLabels.length === 1 ? "does" : "do"} now.`,
    otherNotStronger: (otherPath: string) => `${otherPath} is not stronger on any dimension.`,
    noClose: "No dimension is close. Re-weighting would not flip this result. Only different answers would.",
    closeBalanced: (closeLabels: string[]) =>
      `${joinLabels(closeLabels)} ${closeLabels.length === 1 ? "is" : "are"} balanced, so re-weighting ${
        closeLabels.length === 1 ? "it" : "them"
      } would not move the result. Only different answers would.`,
    closeShift: (closeLabels: string[], shift: string, gap: string, couldFlip: boolean) =>
      `${joinLabels(closeLabels)} ${closeLabels.length === 1 ? "is" : "are"} still close. Re-weighting ${
        closeLabels.length === 1 ? "it" : "them"
      } could move the result by up to ${shift} points against a lead of ${gap}, so weights ${
        couldFlip ? "could flip it" : "alone would not flip it"
      }.`,
    levelPaths: "The two paths are level. Any change to your answers or weights would tip the result.",
    planCompare: (leadLabels: string[]) =>
      `Write down one concrete plan for each path and compare them on ${
        leadLabels.length === 1 ? "the dimension that decided this" : "the two dimensions that decided this"
      }: ${joinLabels(leadLabels)}.`,
    planCompareGeneric: "Write down one concrete plan for each path and compare them side by side.",
    checkAssumption: (label: string) => `Check the assumption behind your strongest pull the other way: ${label}.`,
    revisitWeights: (closeLabels: string[]) =>
      `Revisit your weights once ${joinLabels(closeLabels)} ${closeLabels.length === 1 ? "is" : "are"} clearer.`
  },

  shared: {
    intro: "A read-only result someone chose to share. It lives entirely in the link. Nothing about it is stored on our side.",
    eyebrow: "Shared result",
    headline: (direction: ScenarioId, confidence: ConfidenceLevel, gap: number): string => {
      const path = pathWord[direction];

      if (confidence === "high" && gap > 25) {
        return `This result points clearly toward ${path}.`;
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `This result leans toward ${path}, with real tradeoffs.`;
      }

      return `It's close. This result leans slightly toward ${path}.`;
    },
    footnote: "Bars show how far this person's answers lean, on one shared scale. The number is each dimension's weighted pull on the result.",
    cta: "Facing the same decision?",
    ctaBody:
      "Stay or Return walks you through 24 questions and your own priorities, transparently, with nothing stored anywhere but your own browser.",
    tryIt: "Try it yourself",
    explore: "Explore Stay or Return",
    versionTitle: "This link is from an earlier questionnaire.",
    versionBody:
      "It was created with a previous version of Stay or Return, so it can't be displayed accurately anymore. Whoever sent it can re-share from a fresh run.",
    invalidTitle: "This link doesn't work.",
    invalidBody:
      "It looks incomplete or damaged. Shared links carry the whole result inside the link itself, so a truncated copy loses it. Ask for the link again, or try the questionnaire yourself."
  },

  profile: {
    eyebrow: "Your space",
    titleWithName: (nickname: string) => `Hi, ${nickname}.`,
    title: "Your profile",
    description: "Set a nickname, pick an accent, and look back at past decisions.",
    identity: "Profile identity",
    nickname: "Nickname",
    optional: "(optional)",
    placeholder: "How should we greet you?",
    save: "Save",
    saved: "Saved.",
    accent: "Accent",
    accents: { warm: "Coral", stay: "Blue", return: "Red" } satisfies Record<"warm" | "stay" | "return", string>,
    created: (date: string, count: number) =>
      `Profile created ${date} · ${count === 1 ? "1 decision saved" : `${count} decisions saved`}`,
    privacyTitle: "Private to this device",
    privacyBody:
      "Your nickname and history are saved only in this browser, on this device. Nothing is sent anywhere. No account, no cloud, no sync. We couldn't see it if we wanted to.",
    privacyFlip:
      "The honest flip side: it won't follow you to other devices, and clearing this browser's data erases it. Export a copy if you want to keep one.",
    exportData: "Export my data (JSON)",
    deleteAll: "Delete profile & history",
    erasePrompt: "Erase your profile and all saved decisions from this device?",
    erase: "Erase everything",
    historyEyebrow: "History",
    historyTitle: "Your decisions",
    newestFirst: "Newest first."
  },

  history: {
    emptyTitle: "No decisions saved yet.",
    emptyBody: "Finish the questionnaire and your result will appear here automatically.",
    start: "Start questionnaire",
    view: "View",
    delete: "Delete",
    removePrompt: "Remove from this device?",
    remove: "Remove",
    drivenBy: (label: string) => `Driven by ${label}`,
    earlierVersion: "Earlier questionnaire version",
    restore: "Restore",
    tryAgain: "Try again",
    restoreFailed: "This snapshot can't be restored here.",
    replacePrompt: "Replace your in-progress run?",
    replace: "Replace",
    keepCurrent: "Keep current",
    pastStatement,
    srGap: (points: number) => `, gap ${points} points`
  },

  snapshot: {
    missingTitle: "This snapshot isn't on this device anymore.",
    missingBody: "It may have been deleted, or saved in a different browser.",
    backProfile: "Back to my profile",
    intro: (date: string) => `A snapshot saved on this device on ${date}. Viewing it doesn't change your current run.`,
    eyebrow: (date: string) => `Snapshot · ${date}`,
    pastHeadline: (direction: ScenarioId, confidence: ConfidenceLevel, difference?: number) =>
      `${pastStatement(direction, confidence, difference)}.`,
    confidence: (level: string) => `${level} confidence`,
    gap: (points: number) => `Gap ${points} points`,
    earlierVersionBody:
      "This snapshot was made with an earlier version of the questionnaire, so the full dimension breakdown can't be recomputed. The direction, confidence, and gap above are exactly what it showed at the time.",
    restoreNote: "Restoring makes this snapshot your current run again.",
    keyDrivers: "Key drivers",
    wherePulled: "Where each dimension pulled",
    asOf: (date: string) => `As of ${date}.`
  }
};
