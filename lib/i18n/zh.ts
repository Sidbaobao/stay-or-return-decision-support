import type { ConfidenceLevel, ScenarioId } from "@/types";
import type { Dictionary } from "@/lib/i18n";

// 简体中文，写给在海外读书的中国人。和 en.ts 同一个结构，各自原生写，不互译。
// 语气：一个把这件事想明白了的朋友在说话。先结论，再原因，最后一个动作。
// 东西按生活里的叫法叫（签证、钱、家人、日子），不用报表里的词。

const pathWord: Record<ScenarioId, string> = {
  stay_us: "留下",
  return_china: "回国"
};

function pastStatement(direction: ScenarioId, confidence: ConfidenceLevel, difference?: number): string {
  if (difference === 0) {
    return "不相上下";
  }

  if (confidence === "high") {
    return `很清楚：${pathWord[direction]}`;
  }

  if (confidence === "medium") {
    return `偏向${pathWord[direction]}`;
  }

  return `稍微偏向${pathWord[direction]}`;
}

function joinPhrases(phrases: string[]) {
  if (phrases.length <= 1) {
    return phrases[0] ?? "";
  }

  return `${phrases.slice(0, -1).join("、")}和${phrases[phrases.length - 1]}`;
}

export const zh: Dictionary = {
  tag: "zh-CN",
  brand: "Stay or Return",

  languageToggle: { label: "语言", en: "EN", zh: "中文" },

  nav: {
    home: "首页",
    questionnaire: "答题",
    weights: "优先级",
    results: "结果",
    memo: "备忘录",
    primary: "主导航",
    lockedReason: "先把题答完。",
    profile: "我的",
    greeting: (nickname) => `你好，${nickname}`
  },

  titles: {
    questionnaire: "答题",
    weights: "优先级",
    results: "结果",
    memo: "备忘录",
    profile: "我的",
    shared: "分享的结果",
    snapshot: "存下来的决定"
  },

  home: {
    heroTitle: "留下，还是回国？想明白选哪个，为什么。",
    heroSubtitle: "认真答二十分钟。然后你会清楚地看到自己偏向哪边，是什么在推动，什么会改变它。",
    howItWorks: "怎么用",
    threeSteps: "三步。",
    steps: [
      {
        step: "第一步",
        title: "答 24 道题",
        description: "关于工作、钱、签证、家人、日子和十年后。问得直接，答得也直接。"
      },
      {
        step: "第二步",
        title: "说说什么最要紧",
        description: "把你在意的事放大，让它在结果里算得更重。"
      },
      {
        step: "第三步",
        title: "看结果",
        description: "你偏向哪边，为什么，什么会改变它，还有一份可以留着的备忘录。"
      }
    ],
    twoPaths: "两条路",
    seeBoth: "先把两种生活都看一眼，再来权衡。",
    picture: "各一分钟。然后开始答题。",
    stay: "留在美国",
    return: "回国",
    closing: "认真答二十分钟，胜过一个月的反复纠结。",
    footer: "不是法律、财务或移民建议。只是把你自己的答案摊开来看。"
  },

  cta: {
    start: "开始答题",
    continue: "接着答",
    startNew: "重新答一遍",
    reviewLast: "或者看上次的结果",
    startOver: "或者从头开始",
    revisit: "或者翻翻以前的决定"
  },

  confirm: {
    keep: "留着",
    discardPrompt: "已经答的这些不要了？",
    discard: "不要了"
  },

  reset: "从头开始",

  notFound: {
    title: "没有这个页面。",
    body: "链接在转发时可能多了或少了几个字符。",
    home: "回首页",
    start: "开始答题"
  },

  appError: {
    title: "这个页面出了点问题。",
    body: "刷新一般就能解决。你的答案存在这台设备上，不受影响。",
    reload: "刷新",
    home: "回首页",
    details: "技术细节"
  },

  questionnaire: {
    eyebrow: "第一步",
    title: "答题",
    answered: (count, total) => `已答 ${count} / ${total}`,
    stepsHeading: "六个部分",
    step: (index) => `第 ${index} 部分`,
    done: "完成",
    ofCount: (count, total) => `${count} / ${total}`,
    answeredSuffix: " 已答",
    currentDimension: "这一部分",
    backHome: "首页",
    previous: "上一步",
    next: "继续",
    nextStep: (label) => `继续：${label}`,
    questionOf: (index, total) => `第 ${index} 题，共 ${total} 题`,
    stepOf: (index, total) => `第 ${index} 部分，共 ${total} 部分`,
    remaining: (count) => `还有 ${count} 题没答`,
    saveContinue: "继续，设定优先级",
    guiding: {
      career: "你想要的工作，在哪边真能拿到？",
      salary_cost: "为了你想过的生活，钱在哪边更够用？",
      immigration: "签证这件事，压在你心上有多重？",
      family_emotion: "你有多需要离家人近一点？",
      lifestyle: "哪边的日子更像你？",
      long_term: "十年后，你更可能在哪边？"
    }
  },

  weights: {
    eyebrow: "第二步",
    title: "现在什么对你最要紧？",
    description: "答案不动。这一步是说清楚六件事里哪些更要紧。一个放大，其他的就缩小。",
    priorityMap: "你的优先级",
    fineTune: "微调",
    minimum: "最低",
    maximum: "最高能到",
    cannotGrow: "其他几项已经最小了，这一项加不上去。",
    atMinimum: "这一项已经是最小了。",
    fineTuneAria: (label) => `微调${label}`,
    bubbleAria: (label, percentage) => `${label}，占 ${percentage}%。打开微调。`,
    decreaseAria: (label) => `调低${label}`,
    increaseAria: (label) => `调高${label}`,
    backQuestionnaire: "回到题目",
    saveContinue: "看结果"
  },

  results: {
    eyebrow: "第三步",
    headline: (direction, confidence, gap) => {
      if (confidence === "high" && gap > 25) {
        return `${pathWord[direction]}。你的答案很清楚。`;
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `你偏向${pathWord[direction]}。不是一边倒，但很清楚。`;
      }

      return `很接近。你稍微偏向${pathWord[direction]}。`;
    },
    hook: (phrase, reason) => (reason ? `主要是${phrase}。你说，${reason}。` : `主要是${phrase}。`),
    hookNone: "目前还没有哪一项特别突出。",
    confidence: "有多确定",
    confidenceLevel: { low: "不太确定", medium: "比较确定", high: "很确定" },
    confidenceAria: (level) => level,
    keyDrivers: "背后是什么",
    wherePulls: "生活的每一部分指向哪边",
    balanced: "持平",
    leans: (direction) => `偏${pathWord[direction]}`,
    topDriver: "最主要",
    stillClose: "接近",
    weightedPull: "算上优先级",
    footnote: "条形图显示你的答案偏向哪边、偏多少，六项共用一把尺。数字是算上优先级之后，这一项占的分量。",
    srBalanced: "，两边持平",
    srLean: (direction, gap) => `，偏${pathWord[direction]} ${Math.round(gap)} 分`,
    sensitivityCouldFlip: (gap, shift) => `改优先级有可能翻盘。现在差 ${gap} 分，光改优先级最多能挪 ${shift} 分。`,
    sensitivityNoShift: (gap) => `改优先级翻不了盘。差 ${gap} 分，那几项接近的加起来也补不上。要变，得是答案变。`,
    sensitivityCannotFlip: (gap, shift) => `改优先级翻不了盘。差 ${gap} 分，光改优先级最多只能挪 ${shift} 分。`,
    nudgeAria: "存在这台设备上",
    nudgeTitle: "这份结果已经存在这台设备上。",
    nudgeBody: "想让它更像你的，起个名字。什么都不会离开这个浏览器。",
    addNickname: "起个名字",
    notNow: "以后再说",
    shareHeading: "分享这份结果",
    shareBody: "链接里装着你的答案和优先级。不会上传任何东西。拿到链接的人都能看。",
    readMemo: "想要一份写下来的？",
    adjustWeights: "改优先级",
    openMemo: "看备忘录"
  },

  balance: {
    eyebrow: "天平",
    evenly: "不相上下",
    leads: (leader) => `${leader}领先`,
    leader: { stay_us: "留下", return_china: "回国" },
    stay: "留下",
    return: "回国",
    balanced: "持平",
    evenlyNow: "现在不相上下。",
    leadsBy: "领先",
    points: "分",
    ariaTied: "天平：留下和回国不相上下。",
    aria: (leader, points) => `天平：${leader}领先 ${points} 分。左端是坚定留下，右端是坚定回国。`,
    footnote: "每一个答案都会拨动这杆天平，从坚定留下，到坚定回国。"
  },

  share: {
    copy: "复制链接",
    copied: "已复制。",
    manual: "复制这个链接："
  },

  memo: {
    title: "决策备忘录",
    recommendation: "你落在哪边",
    verdict: { stay_us: "留下。", return_china: "回国。" },
    balanced: "不相上下。",
    confidence: { low: "不太确定", medium: "比较确定", high: "很确定" },
    whereLeans: "每一部分指向哪边",
    dimension: "部分",
    columnStay: "留下",
    columnBalanced: "持平",
    columnReturn: "回国",
    leanBalanced: "持平",
    leanStillClose: (direction) => `略偏${pathWord[direction]}`,
    lean: (direction) => `偏${pathWord[direction]}`,
    leanClearly: (direction) => `明显偏${pathWord[direction]}`,
    srLeansBy: (gap) => `，偏 ${Math.round(gap)} 分`,
    barsNote: "六项共用一把尺。",
    whatWouldChange: "什么会改变它",
    beforeDeciding: "决定之前",
    backResults: "回到结果",
    changeAnswers: "改答案",
    disclaimer: "这只是把你自己的答案理了一遍。签证和钱的事，请再问一问专业的人。",

    sentenceSeparator: "",
    leadBalanced: "你的答案两边不相上下。",
    leadBy: (direction, gap) => `你偏向${pathWord[direction]}，差 ${gap} 分。`,
    carries: (leadPhrases, reasons, againstPhrase) => {
      const mostly =
        reasons.length > 0
          ? `主要是${joinPhrases(leadPhrases)}：你说，${reasons.join("，")}。`
          : `主要是${joinPhrases(leadPhrases)}。`;

      return againstPhrase ? `${mostly}往另一边拉的主要是${againstPhrase}。` : `${mostly}没有什么往另一边拉。`;
    },
    margin: {
      low: "差得不多。换两个答案，结果就会变。",
      medium: "差距清楚，但不算悬殊。",
      high: "差距很大。"
    },
    otherPath: { stay_us: "回国", return_china: "留下" },
    otherStrongerOn: (otherPath, againstPhrases, leadPhrases) =>
      `${otherPath}在${joinPhrases(againstPhrases)}上占优。哪天${joinPhrases(againstPhrases)}在你心里比${joinPhrases(
        leadPhrases
      )}更重，答案就会翻过来。`,
    otherNotStronger: (otherPath) => `${otherPath}在哪一项上都不占优。`,
    noClose: "没有哪一项接近。改优先级翻不了盘，只有改答案才会。",
    closeBalanced: (closePhrases) => `${joinPhrases(closePhrases)}正好持平，优先级怎么调都动不了结果。只有改答案才会。`,
    closeShift: (closePhrases, shift, gap, couldFlip) =>
      `${joinPhrases(closePhrases)}还很接近。调它${closePhrases.length > 1 ? "们" : ""}的优先级，最多能让结果挪 ${shift} 分，而现在差 ${gap} 分，所以${
        couldFlip ? "改优先级有可能翻盘" : "光改优先级翻不了盘"
      }。`,
    levelPaths: "两边持平。改任何一个答案或优先级，都会让它倒向一边。",
    planCompare: (leadPhrases) =>
      `给两条路各写一个具体的方案，然后在决定了这个结果的地方比一比：${joinPhrases(leadPhrases)}。`,
    planCompareGeneric: "给两条路各写一个具体的方案，并排放在一起看。",
    checkAssumption: (phrase, reason) =>
      reason ? `核实一下往另一边拉的那件事。你说，${reason}。现在还是这样吗？` : `核实一下往另一边拉的那件事：${phrase}。`,
    revisitWeights: (closePhrases) => `等${joinPhrases(closePhrases)}更清楚了，再回来调优先级。`
  },

  shared: {
    intro: "有人把这份结果分享给了你。它就装在链接里，哪里都不存。",
    eyebrow: "分享的结果",
    headline: (direction, confidence, gap) => {
      if (confidence === "high" && gap > 25) {
        return `答案很清楚：${pathWord[direction]}。`;
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `偏向${pathWord[direction]}。不是一边倒，但很清楚。`;
      }

      return `很接近。稍微偏向${pathWord[direction]}。`;
    },
    footnote: "条形图显示分享者的答案偏向哪边、偏多少，六项共用一把尺。数字是算上优先级之后这一项占的分量。",
    cta: "你也在做同一个选择？",
    ctaBody: "24 道题，你自己的优先级，什么都只存在你自己的浏览器里。",
    tryIt: "试试",
    explore: "看看怎么用",
    versionTitle: "这个链接来自旧版本。",
    versionBody: "题目改过了，这份结果没法正常显示。请发链接的人重新分享一份。",
    invalidTitle: "这个链接打不开。",
    invalidBody: "它看起来被截断或改动过。整份结果都装在链接里，复制不全就会丢。重新要一份，或者自己答一遍。"
  },

  profile: {
    eyebrow: "你的",
    titleWithName: (nickname) => `你好，${nickname}。`,
    title: "我的",
    description: "一个名字，一个颜色，还有你存下来的决定。",
    identity: "你",
    nickname: "名字",
    optional: "（可选）",
    placeholder: "怎么称呼你？",
    save: "保存",
    saved: "已保存。",
    accent: "颜色",
    accents: { warm: "珊瑚", stay: "蓝", return: "红" },
    created: (date, count) => `从${date}起 · 存了 ${count} 个决定`,
    privacyTitle: "只在这台设备上",
    privacyBody: "你的名字和记录只存在这台设备的这个浏览器里。不会发到任何地方。没有账号，没有云端，没有同步。我们想看也看不到。",
    privacyFlip: "反过来说：换一台设备它不会跟着你，清了浏览器数据它就没了。想留一份，就导出。",
    exportData: "导出我的数据",
    deleteAll: "全部删掉",
    erasePrompt: "把资料和所有存下来的决定从这台设备上删掉？",
    erase: "全部删掉",
    historyEyebrow: "记录",
    historyTitle: "你的决定",
    newestFirst: "最新的在前。"
  },

  history: {
    emptyTitle: "还没有存下来的。",
    emptyBody: "把题答完一次，结果就会出现在这里。",
    start: "开始答题",
    view: "打开",
    delete: "删除",
    removePrompt: "删掉这一条？",
    remove: "删掉",
    drivenBy: (phrase) => `主要是${phrase}`,
    earlierVersion: "旧版本的题目",
    restore: "重新打开",
    tryAgain: "再试一次",
    restoreFailed: "这一条在这里打不开。",
    replacePrompt: "替换你正在答的这一份？",
    replace: "替换",
    keepCurrent: "留着现在的",
    pastStatement,
    srGap: (points) => `，差 ${Math.round(points)} 分`
  },

  snapshot: {
    missingTitle: "这一条已经不在这台设备上了。",
    missingBody: "可能被删了，或者存在另一个浏览器里。",
    backProfile: "回到我的",
    intro: (date) => `${date}存在这台设备上的一份。看它不会影响你现在正在答的。`,
    eyebrow: (date) => `存于 ${date}`,
    pastHeadline: (direction, confidence, difference) => `${pastStatement(direction, confidence, difference)}。`,
    confidence: (level) => level,
    gap: (points) => `差 ${Math.round(points)} 分`,
    earlierVersionBody: "这一份是用旧版本的题目做的，没法重新算出每一部分。上面的方向、把握和差距，就是它当时显示的。",
    restoreNote: "重新打开后，它就是你现在正在答的这一份。",
    keyDrivers: "背后是什么",
    wherePulled: "每一部分当时指向哪边",
    asOf: (date) => `截至${date}。`
  }
};

// Referenced so an unused-import lint never removes the type-only imports.
export type { ConfidenceLevel, ScenarioId };
