import type { ConfidenceLevel, ScenarioId } from "@/types";
import type { Dictionary } from "@/lib/i18n";

// 简体中文，写给在国外读书的中国人。和 en.ts 同一个结构，各自原生写，不互译。
// 写法：完整的、平常的句子，像给朋友发消息那样说。不用断句制造节奏，不喊
// 口号，不打比方，标题就是标题。用日常的词：找工作、房租、签证、爸妈。
// 该说"可能""一般"的地方就说。

const pathWord: Record<ScenarioId, string> = {
  stay_us: "留下",
  return_china: "回国"
};

function pastStatement(direction: ScenarioId, confidence: ConfidenceLevel, difference?: number): string {
  if (difference === 0) {
    return "持平";
  }

  if (confidence === "high") {
    return `明确${pathWord[direction]}`;
  }

  if (confidence === "medium") {
    return `倾向${pathWord[direction]}`;
  }

  return `稍微倾向${pathWord[direction]}`;
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
    lockedReason: "先答完题目。",
    profile: "我的资料",
    greeting: (nickname) => `你好，${nickname}`
  },

  titles: {
    questionnaire: "答题",
    weights: "优先级",
    results: "结果",
    memo: "备忘录",
    profile: "我的资料",
    shared: "分享的结果",
    snapshot: "保存的决定"
  },

  home: {
    heroTitle: "留在美国，还是回国？",
    heroSubtitle: "回答 24 道关于你现在情况的问题。你会看到自己更倾向哪边、主要原因是什么、什么会改变这个结果。大概需要 20 分钟。",
    howItWorks: "怎么用",
    threeSteps: "一共三步。",
    steps: [
      {
        step: "第一步",
        title: "回答 24 道题",
        description: "题目涉及工作、钱、签证、家人、日常生活，还有你十年后想在哪里。"
      },
      {
        step: "第二步",
        title: "说说什么对你最重要",
        description: "把你最在意的部分调高，结果会跟着变。"
      },
      {
        step: "第三步",
        title: "看结果",
        description: "你会看到自己倾向哪边、主要原因，还有一份可以保存或打印的备忘录。"
      }
    ],
    twoPaths: "两个选择",
    seeBoth: "先花一分钟想象一下每种生活。",
    picture: "每段一分钟。看完就可以开始答题了。",
    stay: "留在美国",
    return: "回国",
    closing: "很多人只是把自己的理由写下来看一遍，就已经清楚很多了。",
    footer: "这不是法律、财务或移民建议，只是把你自己的答案整理了一下。"
  },

  cta: {
    start: "开始答题",
    continue: "接着上次答",
    startNew: "重新答一遍",
    reviewLast: "或者看看上次的结果",
    startOver: "或者重新开始",
    revisit: "或者看看以前的决定"
  },

  confirm: {
    keep: "保留",
    discardPrompt: "要删掉已经答的这些吗？",
    discard: "删掉"
  },

  reset: "重新开始",

  notFound: {
    title: "找不到这个页面。",
    body: "链接可能少了几个字符。你可以回到首页，或者直接开始答题。",
    home: "回到首页",
    start: "开始答题"
  },

  appError: {
    title: "出了点问题。",
    body: "刷新页面一般就能解决。你的答案保存在这台设备上，不会丢。",
    reload: "刷新页面",
    home: "回到首页",
    details: "技术细节"
  },

  questionnaire: {
    eyebrow: "第一步",
    title: "题目",
    answered: (count, total) => `已答 ${count} / ${total}`,
    stepsHeading: "六个部分",
    step: (index) => `第 ${index} 部分`,
    done: "已完成",
    ofCount: (count, total) => `${count} / ${total}`,
    answeredSuffix: " 已答",
    currentDimension: "当前部分",
    backHome: "首页",
    previous: "上一步",
    next: "继续",
    nextStep: (label) => `继续：${label}`,
    questionOf: (index, total) => `第 ${index} 题，共 ${total} 题`,
    stepOf: (index, total) => `第 ${index} 部分，共 ${total} 部分`,
    remaining: (count) => `还有 ${count} 题没答`,
    saveContinue: "继续，去设置优先级",
    guiding: {
      career: "你想要的那种工作，在哪边更容易找到？",
      salary_cost: "你的钱在哪边更经花？",
      immigration: "签证这件事对你影响有多大？",
      family_emotion: "离家人近对你有多重要？",
      lifestyle: "平时过日子，你更想在哪边？",
      long_term: "十年后你觉得自己会在哪边？"
    }
  },

  weights: {
    eyebrow: "第二步",
    title: "什么对你最重要？",
    description: "这一步不改答案，只是说明六个部分里哪些在结果中应该占更大的比重。把一个调大，其他的就会变小。",
    priorityMap: "你的优先级",
    fineTune: "调整",
    minimum: "最低",
    maximum: "最高",
    cannotGrow: "其他部分已经是最低了，这一项不能再调高。",
    atMinimum: "这一项已经是最低了。",
    fineTuneAria: (label) => `调整${label}`,
    bubbleAria: (label, percentage) => `${label}，占 ${percentage}%。打开调整。`,
    decreaseAria: (label) => `调低${label}`,
    increaseAria: (label) => `调高${label}`,
    backQuestionnaire: "回到题目",
    saveContinue: "看结果"
  },

  results: {
    eyebrow: "第三步",
    headline: (direction, confidence, gap) => {
      if (confidence === "high" && gap > 25) {
        return `你的答案很明确地指向${pathWord[direction]}。`;
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `你的答案倾向${pathWord[direction]}，差距明显，但不算大。`;
      }

      return `很接近。你的答案稍微倾向${pathWord[direction]}。`;
    },
    hook: (phrase, reason) => (reason ? `最主要的原因是${phrase}。你说过，${reason}。` : `最主要的原因是${phrase}。`),
    hookNone: "目前没有哪个部分特别突出。",
    confidence: "有多明确",
    confidenceLevel: { low: "不太明确", medium: "比较明确", high: "很明确" },
    confidenceAria: (level) => level,
    keyDrivers: "原因",
    wherePulls: "你生活的每个部分各偏向哪边",
    balanced: "持平",
    leans: (direction) => `偏向${pathWord[direction]}`,
    topDriver: "最主要",
    stillClose: "接近",
    weightedPull: "算上优先级",
    footnote: "每根条形表示你的答案在这个部分偏向哪边、偏多少。右边的数字是算上优先级之后，它在结果里占的分量。",
    srBalanced: "，两边持平",
    srLean: (direction, gap) => `，偏向${pathWord[direction]} ${Math.round(gap)} 分`,
    sensitivityCouldFlip: (gap, shift) =>
      `如果调整优先级，结果有可能反过来。现在差 ${gap} 分，只改优先级最多能让它变动 ${shift} 分。`,
    sensitivityNoShift: (gap) => `只调整优先级不会让结果反过来。现在差 ${gap} 分，那几个接近的部分加起来也不够。只有改答案才会变。`,
    sensitivityCannotFlip: (gap, shift) => `只调整优先级不会让结果反过来。现在差 ${gap} 分，只改优先级最多只能变动 ${shift} 分。`,
    nudgeAria: "保存在这台设备上",
    nudgeTitle: "这个结果已经保存在这台设备上了。",
    nudgeBody: "如果你加一个名字，你的结果会记在这个名字下面。什么都不会发送到别处。",
    addNickname: "加个名字",
    notNow: "暂时不用",
    shareHeading: "分享这个结果",
    shareBody: "链接里包含你的答案和优先级。不会上传任何东西，拿到链接的人都能打开。",
    readMemo: "想要一份文字总结吗？",
    adjustWeights: "调整优先级",
    openMemo: "看备忘录"
  },

  balance: {
    eyebrow: "总体",
    evenly: "持平",
    leads: (leader) => `${leader}领先`,
    leader: { stay_us: "留下", return_china: "回国" },
    stay: "留下",
    return: "回国",
    balanced: "持平",
    evenlyNow: "目前两边持平。",
    leadsBy: "领先",
    points: "分",
    ariaTied: "总体：留下和回国持平。",
    aria: (leader, points) => `总体：${leader}领先 ${points} 分。左端是明确留下，右端是明确回国。`,
    footnote: "每一个答案都会让这个刻度往一边移动一点。"
  },

  share: {
    copy: "复制链接",
    copied: "已复制。",
    manual: "复制这个链接："
  },

  memo: {
    title: "决策备忘录",
    recommendation: "总体",
    verdict: { stay_us: "留在美国。", return_china: "回国。" },
    balanced: "两边持平。",
    confidence: { low: "不太明确", medium: "比较明确", high: "很明确" },
    whereLeans: "每个部分各偏向哪边",
    dimension: "部分",
    columnStay: "留下",
    columnBalanced: "持平",
    columnReturn: "回国",
    leanBalanced: "持平",
    leanStillClose: (direction) => `稍微偏向${pathWord[direction]}`,
    lean: (direction) => `偏向${pathWord[direction]}`,
    leanClearly: (direction) => `明显偏向${pathWord[direction]}`,
    srLeansBy: (gap) => `，偏 ${Math.round(gap)} 分`,
    barsNote: "六根条形用的是同一个刻度。",
    whatWouldChange: "什么会改变这个结果",
    beforeDeciding: "决定之前",
    backResults: "回到结果",
    changeAnswers: "修改答案",
    disclaimer: "这份备忘录只是整理了你自己的答案，不是法律、财务或移民建议。签证和钱的问题，请再咨询专业人士。",

    sentenceSeparator: "",
    leadBalanced: "总体来看，你的答案在留下和回国之间持平。",
    leadBy: (direction, gap) => `总体来看，你的答案指向${pathWord[direction]}，差大约 ${gap} 分。`,
    carries: (leadPhrases, reasons, againstPhrase) => {
      const mostly =
        reasons.length > 0
          ? `最主要的原因是${joinPhrases(leadPhrases)}。你说过，${reasons.join("，")}。`
          : `最主要的原因是${joinPhrases(leadPhrases)}。`;

      return againstPhrase ? `${mostly}另一边最主要的原因是${againstPhrase}。` : `${mostly}另一边没有什么特别的原因。`;
    },
    margin: {
      low: "差距不大，换两个答案结果就会变。",
      medium: "差距明显，但不算大。",
      high: "差距很大。"
    },
    otherPath: { stay_us: "回国", return_china: "留下" },
    otherStrongerOn: (otherPath, againstPhrases, leadPhrases) =>
      `${otherPath}在${joinPhrases(againstPhrases)}上更有优势。如果哪天${joinPhrases(againstPhrases)}对你比${joinPhrases(
        leadPhrases
      )}更重要，结果就会反过来。`,
    otherNotStronger: (otherPath) => `${otherPath}在任何一个部分都不占优势。`,
    noClose: "没有哪个部分是接近的，所以只调整优先级不会让结果反过来。只有改答案才会变。",
    closeBalanced: (closePhrases) => `${joinPhrases(closePhrases)}是持平的，调它的优先级没有影响。只有改答案才会变。`,
    closeShift: (closePhrases, shift, gap, couldFlip) =>
      `${joinPhrases(closePhrases)}还比较接近。调整它的优先级最多能让结果变动 ${shift} 分，而现在差 ${gap} 分，所以${
        couldFlip ? "调整优先级有可能让结果反过来" : "只调整优先级不会让结果反过来"
      }。`,
    levelPaths: "两个选择目前持平。改任何一个答案或优先级，结果都会偏向一边。",
    planCompare: (leadPhrases) =>
      `给两个选择各写一个具体的计划，然后在决定了这个结果的部分上比较一下：${joinPhrases(leadPhrases)}。`,
    planCompareGeneric: "给两个选择各写一个具体的计划，放在一起比较。",
    checkAssumption: (phrase, reason) =>
      reason ? `再确认一下另一边最主要的原因。你说过，${reason}。现在还是这样吗？` : `再确认一下另一边最主要的原因：${phrase}。`,
    revisitWeights: (closePhrases) => `等你对${joinPhrases(closePhrases)}更清楚之后，再回来调整优先级。`
  },

  shared: {
    intro: "有人把这个结果分享给了你。所有内容都在链接里，没有保存在任何地方。",
    eyebrow: "分享的结果",
    headline: (direction, confidence, gap) => {
      if (confidence === "high" && gap > 25) {
        return `这份答案很明确地指向${pathWord[direction]}。`;
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `这份答案倾向${pathWord[direction]}，差距明显，但不算大。`;
      }

      return `很接近。这份答案稍微倾向${pathWord[direction]}。`;
    },
    footnote: "每根条形表示这个人的答案在这个部分偏向哪边、偏多少。右边的数字是算上优先级之后它占的分量。",
    cta: "你也在做同样的决定？",
    ctaBody: "一共 24 道题，加上你自己的优先级。所有内容只保存在你自己的浏览器里。",
    tryIt: "自己试试",
    explore: "看看怎么用",
    versionTitle: "这个链接来自旧版本。",
    versionBody: "题目在这个链接生成之后改过了，所以没法正确显示。请让发给你的人重新分享一个。",
    invalidTitle: "这个链接打不开。",
    invalidBody: "链接看起来被截断或者改动过。整个结果都在链接里，复制不完整就打不开。你可以重新要一个，或者自己答一遍。"
  },

  profile: {
    eyebrow: "我的资料",
    titleWithName: (nickname) => `你好，${nickname}。`,
    title: "我的资料",
    description: "你的名字、颜色，还有你保存的决定。",
    identity: "关于你",
    nickname: "名字",
    optional: "（可选）",
    placeholder: "我们怎么称呼你？",
    save: "保存",
    saved: "已保存。",
    accent: "颜色",
    accents: { warm: "珊瑚色", stay: "蓝色", return: "红色" },
    created: (date, count) => `${date}起使用 · 已保存 ${count} 个决定`,
    privacyTitle: "所有内容都只在这台设备上",
    privacyBody: "你的名字和记录只保存在这台设备的这个浏览器里，不会发送给我们或任何人。没有账号，没有云端，也没有同步。",
    privacyFlip: "这也意味着换一台设备就看不到了，清除浏览器数据也会把它删掉。想保留一份的话，可以导出。",
    exportData: "导出我的数据",
    deleteAll: "全部删除",
    erasePrompt: "要从这台设备上删除你的资料和所有保存的决定吗？",
    erase: "全部删除",
    historyEyebrow: "记录",
    historyTitle: "你的决定",
    newestFirst: "最新的在前面。"
  },

  history: {
    emptyTitle: "你还没有保存过决定。",
    emptyBody: "答完题目之后，结果会显示在这里。",
    start: "开始答题",
    view: "打开",
    delete: "删除",
    removePrompt: "要删除这一条吗？",
    remove: "删除",
    drivenBy: (phrase) => `主要是${phrase}`,
    earlierVersion: "旧版本的题目",
    restore: "重新打开",
    tryAgain: "再试一次",
    restoreFailed: "这一条在这里打不开。",
    replacePrompt: "要替换你现在正在答的这份吗？",
    replace: "替换",
    keepCurrent: "保留现在的",
    pastStatement,
    srGap: (points) => `，差 ${Math.round(points)} 分`
  },

  snapshot: {
    missingTitle: "这个决定已经不在这台设备上了。",
    missingBody: "可能已经被删除，或者是保存在另一个浏览器里。",
    backProfile: "回到我的资料",
    intro: (date) => `这是你在${date}保存的。查看它不会影响你现在的答案。`,
    eyebrow: (date) => `保存于 ${date}`,
    pastHeadline: (direction, confidence, difference) => `${pastStatement(direction, confidence, difference)}。`,
    confidence: (level) => level,
    gap: (points) => `差 ${Math.round(points)} 分`,
    earlierVersionBody: "这一份是用旧版本的题目保存的，所以没法显示每个部分的情况。方向、明确程度和分差是当时显示的结果。",
    restoreNote: "重新打开后，它会变成你现在的答案。",
    keyDrivers: "原因",
    wherePulled: "当时每个部分各偏向哪边",
    asOf: (date) => `截至${date}。`
  }
};

// Referenced so an unused-import lint never removes the type-only imports.
export type { ConfidenceLevel, ScenarioId };
