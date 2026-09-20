import type { ConfidenceLevel, ScenarioId } from "@/types";
import type { Dictionary } from "@/lib/i18n";

// 简体中文，写给在国外读书的中国人。和 en.ts 同一个结构，各自原生写，不互译。
// 写法：短句，一句一行，像发消息那样说，句尾不加句号。需要说两句的地方，
// 值是一个句子列表，页面一行显示一句。页面上已经看得出来的事，不再解释。

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
    lockedReason: "先答完题目",
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
    heroFacts: ["24 道题", "大概 20 分钟", "所有内容只在你的浏览器里"],
    flowAria: "这个决定会牵扯到的事",
    factorQuestion: (index) => `第 ${index} 题`,
    howItWorks: "怎么用",
    steps: [
      {
        step: "第一步",
        title: "回答 24 道题",
        description: "题目涉及工作、钱、签证、家人、日常生活和长远发展"
      },
      {
        step: "第二步",
        title: "说说什么对你最重要",
        description: "把你最在意的部分调高"
      },
      {
        step: "第三步",
        title: "看结果",
        description: "你会看到自己倾向哪边、主要原因，还有一份可以保存的备忘录"
      }
    ],
    twoPaths: "两个选择",
    stay: "留在美国",
    return: "回国",
    footer: "这不是法律、财务或移民建议"
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
    title: "找不到这个页面",
    body: "链接可能少了几个字符",
    home: "回到首页",
    start: "开始答题"
  },

  appError: {
    title: "出了点问题",
    body: ["刷新页面一般就能解决", "你的答案保存在这台设备上，不会丢"],
    reload: "刷新页面",
    home: "回到首页",
    details: "技术细节"
  },

  questionnaire: {
    eyebrow: "第一步",
    title: "题目",
    answered: (count, total) => `已答 ${count} / ${total}`,
    stepsHeading: "六个部分",
    keysHint: "按 1、2 或 3 可以回答当前这道题",
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
    description: "调得越大，它在结果里占的分量越重",
    priorityMap: "你的优先级",
    fineTune: "调整",
    minimum: "最低",
    maximum: "最高",
    cannotGrow: "其他部分已经是最低了",
    atMinimum: "这一项已经是最低了",
    fineTuneAria: (label) => `调整${label}`,
    bubbleAria: (label, percentage) => `${label}，占 ${percentage}%，打开调整`,
    decreaseAria: (label) => `调低${label}`,
    increaseAria: (label) => `调高${label}`,
    backQuestionnaire: "回到题目",
    saveContinue: "看结果"
  },

  results: {
    eyebrow: "第三步",
    headline: (direction, confidence, gap) => {
      if (confidence === "high" && gap > 25) {
        return `你的答案很明确地指向${pathWord[direction]}`;
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `你的答案倾向${pathWord[direction]}`;
      }

      return `你的答案稍微倾向${pathWord[direction]}`;
    },
    hook: (phrase, reason) => (reason ? [`最主要的原因是${phrase}`, `你说过，${reason}`] : [`最主要的原因是${phrase}`]),
    hookNone: ["目前没有哪个部分特别突出"],
    youSaid: (reason) => `你说过，${reason}`,
    confidence: "有多明确",
    confidenceLevel: { low: "不太明确", medium: "比较明确", high: "很明确" },
    confidenceAria: (level) => level,
    keyDrivers: "原因",
    wherePulls: "每个部分各偏向哪边",
    splitHeading: "加起来是这样",
    partsHeading: "一部分一部分看",
    percentToward: (percent, direction) => `${percent}% 偏向${pathWord[direction]}`,
    percentEven: "持平",
    balanced: "持平",
    leans: (direction) => `偏向${pathWord[direction]}`,
    topDriver: "最主要",
    stillClose: "接近",
    weightedPull: "算上优先级",
    srBalanced: "，两边持平",
    srLean: (direction, gap) => `，偏向${pathWord[direction]} ${Math.round(gap)} 分`,
    sensitivityCouldFlip: (gap, shift) => [
      "调整优先级有可能让结果反过来",
      `现在差 ${gap} 分，只改优先级最多能变动 ${shift} 分`
    ],
    sensitivityNoShift: (gap) => ["只调整优先级不会让结果反过来", `现在差 ${gap} 分，接近的部分加起来也不够`],
    sensitivityCannotFlip: (gap, shift) => [
      "只调整优先级不会让结果反过来",
      `现在差 ${gap} 分，只改优先级最多只能变动 ${shift} 分`
    ],
    nudgeAria: "保存在这台设备上",
    nudgeTitle: "这个结果已经保存在这台设备上了",
    nudgeBody: "加一个名字，你的结果就会记在这个名字下面",
    addNickname: "加个名字",
    notNow: "暂时不用",
    shareHeading: "分享这个结果",
    shareBody: "你的答案就在链接里，拿到链接的人都能打开",
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
    evenlyNow: "目前两边持平",
    leadsBy: "领先",
    points: "分",
    ariaTied: "总体：留下和回国持平",
    aria: (leader, points) => `总体：${leader}领先 ${points} 分，左端是明确留下，右端是明确回国`
  },

  share: {
    copy: "复制链接",
    copied: "已复制",
    manual: "复制这个链接："
  },

  memo: {
    title: "决策备忘录",
    recommendation: "总体",
    verdict: { stay_us: "留在美国", return_china: "回国" },
    balanced: "两边持平",
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
    whatWouldChange: "什么会改变这个结果",
    beforeDeciding: "决定之前",
    backResults: "回到结果",
    changeAnswers: "修改答案",
    print: "打印",
    disclaimer: ["这份备忘录只是整理了你自己的答案", "不是法律、财务或移民建议"],

    leadBalanced: "总体来看，你的答案在留下和回国之间持平",
    leadBy: (direction, gap) => `总体来看，你的答案指向${pathWord[direction]}，差大约 ${gap} 分`,
    carries: (leadPhrases, reasons, againstPhrase) => {
      const lines = [`最主要的原因是${joinPhrases(leadPhrases)}`];

      if (reasons.length > 0) {
        lines.push(`你说过，${reasons.join("，")}`);
      }

      lines.push(againstPhrase ? `另一边最主要的原因是${againstPhrase}` : "另一边没有什么特别的原因");

      return lines;
    },
    margin: {
      low: "差距不大，换两个答案结果就会变",
      medium: "差距明显，但不算大",
      high: "差距很大"
    },
    otherPath: { stay_us: "回国", return_china: "留下" },
    otherStrongerOn: (otherPath, againstPhrases, leadPhrases) => [
      `${otherPath}在${joinPhrases(againstPhrases)}上更有优势`,
      `如果哪天${joinPhrases(againstPhrases)}对你比${joinPhrases(leadPhrases)}更重要，结果就会反过来`
    ],
    otherNotStronger: (otherPath) => [`${otherPath}在任何一个部分都不占优势`],
    noClose: ["没有哪个部分是接近的，所以只调整优先级不会让结果反过来", "只有改答案才会变"],
    closeBalanced: (closePhrases) => [`${joinPhrases(closePhrases)}是持平的，调它的优先级没有影响`, "只有改答案才会变"],
    closeShift: (closePhrases, shift, gap, couldFlip) => [
      `${joinPhrases(closePhrases)}还比较接近`,
      `调整它的优先级最多能让结果变动 ${shift} 分，而现在差 ${gap} 分`,
      couldFlip ? "所以调整优先级有可能让结果反过来" : "所以只调整优先级不会让结果反过来"
    ],
    levelPaths: ["两个选择目前持平", "改任何一个答案或优先级，结果都会偏向一边"],
    planCompare: (leadPhrases) => [`给两个选择各写一个具体的计划，然后在${joinPhrases(leadPhrases)}上比较一下`],
    planCompareGeneric: ["给两个选择各写一个具体的计划，放在一起比较"],
    checkAssumption: (phrase, reason) =>
      reason ? ["再确认一下另一边最主要的原因", `你说过，${reason}`, "现在还是这样吗？"] : [`再确认一下另一边最主要的原因：${phrase}`],
    revisitWeights: (closePhrases) => [`等你对${joinPhrases(closePhrases)}更清楚之后，再回来调整优先级`]
  },

  shared: {
    intro: "有人把这个结果分享给了你",
    eyebrow: "分享的结果",
    headline: (direction, confidence, gap) => {
      if (confidence === "high" && gap > 25) {
        return `这份答案很明确地指向${pathWord[direction]}`;
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `这份答案倾向${pathWord[direction]}`;
      }

      return `这份答案稍微倾向${pathWord[direction]}`;
    },
    cta: "你也在做同样的决定？",
    ctaBody: "一共 24 道题，大概 20 分钟",
    tryIt: "自己试试",
    explore: "看看怎么用",
    versionTitle: "这个链接来自旧版本",
    versionBody: ["题目在这个链接生成之后改过了", "请让发给你的人重新分享一个"],
    invalidTitle: "这个链接打不开",
    invalidBody: ["链接看起来被截断或者改动过", "你可以重新要一个，或者自己答一遍"]
  },

  profile: {
    eyebrow: "我的资料",
    titleWithName: (nickname) => `你好，${nickname}`,
    title: "我的资料",
    identity: "关于你",
    nickname: "名字",
    optional: "（可选）",
    placeholder: "我们怎么称呼你？",
    save: "保存",
    saved: "已保存",
    accent: "颜色",
    accents: { warm: "珊瑚色", stay: "蓝色", return: "红色" },
    sinceDate: (date) => `${date}起使用`,
    decisionsLabel: () => "已保存的决定",
    privacyTitle: "所有内容都只在这台设备上",
    privacyBody: ["你的名字和记录只保存在这台设备的这个浏览器里", "没有账号，没有云端，也没有同步"],
    privacyFlip: "想保留一份的话，可以导出",
    exportData: "导出我的数据",
    deleteAll: "全部删除",
    erasePrompt: "要从这台设备上删除你的资料和所有保存的决定吗？",
    erase: "全部删除",
    historyEyebrow: "记录",
    historyTitle: "你的决定"
  },

  history: {
    emptyTitle: "你还没有保存过决定",
    emptyBody: "答完题目之后，结果会显示在这里",
    start: "开始答题",
    view: "打开",
    delete: "删除",
    removePrompt: "要删除这一条吗？",
    remove: "删除",
    drivenBy: (phrase) => `主要是${phrase}`,
    earlierVersion: "旧版本的题目",
    restore: "重新打开",
    tryAgain: "再试一次",
    restoreFailed: "这一条在这里打不开",
    replacePrompt: "要替换你现在正在答的这份吗？",
    replace: "替换",
    keepCurrent: "保留现在的",
    pastStatement,
    srGap: (points) => `，差 ${Math.round(points)} 分`
  },

  snapshot: {
    missingTitle: "这个决定已经不在这台设备上了",
    missingBody: "可能已经被删除，或者是保存在另一个浏览器里",
    backProfile: "回到我的资料",
    eyebrow: (date) => `保存于 ${date}`,
    pastHeadline: (direction, confidence, difference) => pastStatement(direction, confidence, difference),
    confidence: (level) => level,
    gap: (points) => `差 ${Math.round(points)} 分`,
    earlierVersionBody: "这一份是用旧版本的题目保存的，所以没法显示每个部分的情况",
    restoreNote: "重新打开后，它会变成你现在的答案",
    keyDrivers: "原因",
    wherePulled: "当时每个部分各偏向哪边",
    asOf: (date) => `截至${date}`
  }
};

// Referenced so an unused-import lint never removes the type-only imports.
export type { ConfidenceLevel, ScenarioId };
