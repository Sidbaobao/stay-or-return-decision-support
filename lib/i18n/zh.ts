import type { ConfidenceLevel, ScenarioId } from "@/types";
import type { Dictionary } from "@/lib/i18n";

// Simplified Chinese, for Chinese students abroad. Same shape as en.ts.

const pathWord: Record<ScenarioId, string> = {
  stay_us: "留下",
  return_china: "回国"
};

const pathLong: Record<ScenarioId, string> = {
  stay_us: "留在美国",
  return_china: "回国"
};

function pastStatement(direction: ScenarioId, confidence: ConfidenceLevel, difference?: number): string {
  if (difference === 0) {
    return "结果势均力敌";
  }

  const path = pathWord[direction];

  if (confidence === "high") {
    return `明显指向${path}`;
  }

  if (confidence === "medium") {
    return `倾向${path}`;
  }

  return `略微倾向${path}`;
}

function joinLabels(labels: string[]) {
  if (labels.length <= 1) {
    return labels[0] ?? "";
  }

  return `${labels.slice(0, -1).join("、")}和${labels[labels.length - 1]}`;
}

export const zh: Dictionary = {
  tag: "zh-CN",
  brand: "Stay or Return",

  languageToggle: { label: "语言", en: "EN", zh: "中文" },

  nav: {
    home: "首页",
    questionnaire: "问卷",
    weights: "权重",
    results: "结果",
    memo: "备忘录",
    primary: "主导航",
    lockedReason: "请先完成问卷。",
    profile: "我的资料",
    greeting: (nickname) => `你好，${nickname}`
  },

  titles: {
    questionnaire: "问卷",
    weights: "权重",
    results: "结果",
    memo: "备忘录",
    profile: "我的资料",
    shared: "分享的结果",
    snapshot: "快照"
  },

  home: {
    heroTitle: "留在美国，还是回国？把这件事想清楚。",
    heroSubtitle: "比较取舍，设定你的优先级，看清是什么在左右结果。",
    howItWorks: "使用方式",
    threeSteps: "三步，把思路理清楚。",
    steps: [
      { step: "第 1 步", title: "回答问题", description: "六个决策维度下的实际问题。" },
      { step: "第 2 步", title: "设定优先级", description: "决定每个维度占多大分量。" },
      { step: "第 3 步", title: "查看结果", description: "查看得分、取舍、不确定性，以及一份决策备忘录。" }
    ],
    twoPaths: "两条路",
    seeBoth: "把两条路都看清楚。",
    picture: "先想象一下每一种未来，再来权衡取舍。",
    stay: "留在美国",
    return: "回到中国",
    closing: "这么重大的决定，值得你最清醒的思考。",
    footer: "一个帮你理清取舍的反思工具，不是法律、财务或移民建议。"
  },

  cta: {
    start: "开始问卷",
    continue: "继续作答",
    startNew: "开始新的一轮作答",
    reviewLast: "或查看上次结果",
    startOver: "或重新开始",
    revisit: "或回顾过去的决定"
  },

  confirm: {
    keep: "保留",
    discardPrompt: "放弃进行中的作答？",
    discard: "放弃"
  },

  reset: "重置当前作答",

  questionnaire: {
    eyebrow: "第 1 步",
    title: "问卷",
    answered: (count, total) => `已回答 ${count} / ${total}`,
    stepsHeading: "问卷步骤",
    step: (index) => `第 ${index} 步`,
    done: "已完成",
    ofCount: (count, total) => `${count} / ${total}`,
    answeredSuffix: " 已回答",
    currentDimension: "当前维度",
    backHome: "返回首页",
    previous: "上一步",
    next: "下一步",
    saveContinue: "保存并前往设定权重",
    guiding: {
      career: "你想要的职业，在哪里更有可能实现？",
      salary_cost: "为了你想要的生活，你的钱在哪里更够用？",
      immigration: "签证和身份的不确定性给你多大压力？",
      family_emotion: "家里人把你往回拉的力量有多强？",
      lifestyle: "哪一种日常生活更像你自己？",
      long_term: "未来十年，你更信任哪条路？"
    }
  },

  weights: {
    eyebrow: "第 2 步",
    title: "设定你的优先级",
    description: "你的答案不会改变。权重决定每个维度占多大分量，一个变大，其他就会变小。",
    priorityMap: "优先级图",
    fineTune: "微调",
    minimum: "最低优先级",
    maximum: "可达到的最大占比",
    cannotGrow: "其他优先级已经到了最低，这一项不能再增加。",
    atMinimum: "这一项已经是最低优先级。",
    fineTuneAria: (label) => `微调${label}的优先级`,
    bubbleAria: (label, percentage) => `${label}，优先级 ${percentage}%。打开微调。`,
    decreaseAria: (label) => `降低${label}的优先级`,
    increaseAria: (label) => `提高${label}的优先级`,
    backQuestionnaire: "返回问卷",
    saveContinue: "保存并查看结果"
  },

  results: {
    eyebrow: "第 3 步 / 结果",
    headline: (direction, confidence, gap) => {
      const isStay = direction === "stay_us";

      if (confidence === "high" && gap > 25) {
        return isStay ? "现在，留在美国显然是你的路。" : "现在，回国显然是你的路。";
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return isStay ? "你倾向于留下，但也有真实的取舍。" : "你倾向于回国，但也有真实的取舍。";
      }

      return isStay ? "很接近。你略微倾向于留下。" : "很接近。你略微倾向于回国。";
    },
    hook: (dimensionLabel, direction) => `${dimensionLabel}的牵引最强，指向${pathLong[direction]}。`,
    hookNone: "目前还没有哪个维度形成明显的牵引。",
    confidence: "置信度",
    confidenceLevel: { low: "低", medium: "中", high: "高" },
    confidenceAria: (level) => `置信度${level}`,
    keyDrivers: "关键驱动",
    wherePulls: "每个维度的牵引方向",
    balanced: "持平",
    leans: (direction) => `倾向${pathWord[direction]}`,
    topDriver: "最强驱动",
    stillClose: "差距不大",
    weightedPull: "加权牵引",
    footnote: "条形图显示你的答案偏向哪边、偏多少，共用一把尺。数字是该维度对结果的加权牵引。",
    srBalanced: "，两条路持平",
    srLean: (direction, gap) => `，偏向${pathWord[direction]} ${gap} 分`,
    sensitivityCouldFlip: (gap, shift) =>
      `调整权重有可能翻转结果：目前领先 ${gap} 分，而改变权重最多能让它移动 ${shift} 分。`,
    sensitivityNoShift: (gap) =>
      `仅靠调整权重不会翻转结果：目前领先 ${gap} 分，那几个差距不大的维度就算重新加权，也动不了它。`,
    sensitivityCannotFlip: (gap, shift) =>
      `仅靠调整权重不会翻转结果：目前领先 ${gap} 分，改变权重最多只能让它移动 ${shift} 分。`,
    nudgeAria: "本地资料建议",
    nudgeTitle: "这份结果已保存在这台设备上。",
    nudgeBody: "起个昵称，让它属于你。一切都留在这个浏览器里，只有你能看到。",
    addNickname: "起个昵称",
    notNow: "以后再说",
    shareHeading: "分享这份结果",
    shareBody: "链接本身就带着你的答案和权重。不会上传任何内容，拿到链接的人都能看到这份结果。",
    readMemo: "阅读完整备忘录",
    adjustWeights: "调整权重",
    openMemo: "打开备忘录"
  },

  balance: {
    eyebrow: "决策天平",
    evenly: "势均力敌",
    leads: (leader) => `${leader}领先`,
    leader: { stay_us: "留下", return_china: "回国" },
    stay: "留下",
    return: "回国",
    balanced: "持平",
    evenlyNow: "目前势均力敌。",
    leadsBy: "领先",
    points: "分",
    ariaTied: "决策天平：留在美国与回国势均力敌。",
    aria: (leader, points) => `决策天平：${leader}领先 ${points} 分。刻度左端是坚定留下，右端是坚定回国。`,
    footnote: "每一个答案都会拨动这杆天平：从坚定留下，到坚定回国。"
  },

  share: {
    copy: "复制分享链接",
    copied: "链接已复制。",
    manual: "请手动复制链接："
  },

  memo: {
    title: "决策备忘录",
    recommendation: "建议",
    verdict: { stay_us: "留在美国。", return_china: "回国。" },
    balanced: "势均力敌。",
    confidence: { low: "低置信度", medium: "中等置信度", high: "高置信度" },
    whereLeans: "每个维度的倾向",
    dimension: "维度",
    columnStay: "留下",
    columnBalanced: "持平",
    columnReturn: "回国",
    leanBalanced: "持平",
    leanStillClose: (direction) => `倾向${pathWord[direction]}，但差距不大`,
    lean: (direction) => `倾向${pathWord[direction]}`,
    leanClearly: (direction) => `明显偏向${pathWord[direction]}`,
    srLeansBy: (gap) => `，偏向 ${gap} 分`,
    barsNote: "条形图共用一把尺。",
    whatWouldChange: "什么会改变这个结果",
    beforeDeciding: "决定之前",
    backResults: "返回结果",
    changeAnswers: "修改答案",
    disclaimer: "这是一份结构化的反思，不是法律、移民或财务建议。",

    sentenceSeparator: "",
    leadBalanced: "你的答案在两条路之间势均力敌。",
    leadBy: (direction, gap) => `你的答案倾向${pathWord[direction]}，领先 ${gap} 分。`,
    carries: (leadLabels, strongestAgainst) =>
      strongestAgainst
        ? `这份领先主要来自${joinLabels(leadLabels)}；往另一边拉得最强的是${strongestAgainst}。`
        : `这份领先主要来自${joinLabels(leadLabels)}；没有维度往另一边拉。`,
    margin: {
      low: "差距很小：几个答案不同，结果就会改变。",
      medium: "差距明显，但还不算决定性。",
      high: "差距很大。"
    },
    otherPath: { stay_us: "回国", return_china: "留在美国" },
    otherStrongerOn: (otherPath, againstLabels, leadLabels) =>
      `${otherPath}在${joinLabels(againstLabels)}上更强。要让它领先，${
        againstLabels.length === 1 ? "这个维度" : "这些维度"
      }在你心里的分量，得超过${joinLabels(leadLabels)}现在的分量。`,
    otherNotStronger: (otherPath) => `${otherPath}在任何维度上都不占优。`,
    noClose: "没有哪个维度是接近持平的。调整权重不会翻转这个结果，只有改变答案才会。",
    closeBalanced: (closeLabels) => `${joinLabels(closeLabels)}正好持平，重新分配权重也动不了结果，只有改变答案才会。`,
    closeShift: (closeLabels, shift, gap, couldFlip) =>
      `${joinLabels(closeLabels)}差距不大。重新分配权重最多能让结果移动 ${shift} 分，而目前领先 ${gap} 分，所以${
        couldFlip ? "调整权重有可能翻转结果" : "仅靠调整权重翻不了盘"
      }。`,
    levelPaths: "两条路势均力敌。答案或权重的任何变化都会让结果倒向一边。",
    planCompare: (leadLabels) =>
      `为两条路各写一个具体方案，然后在决定了这个结果的${
        leadLabels.length === 1 ? "维度" : "两个维度"
      }上比一比：${joinLabels(leadLabels)}。`,
    planCompareGeneric: "为两条路各写下一个具体方案，并排比较。",
    checkAssumption: (label) => `检查反方向最强牵引背后的假设：${label}。`,
    revisitWeights: (closeLabels) => `等${joinLabels(closeLabels)}更明朗之后，再回头调整权重。`
  },

  shared: {
    intro: "这是别人选择分享的只读结果。它完全存在于链接里，我们这边不保存任何内容。",
    eyebrow: "分享的结果",
    headline: (direction, confidence, gap) => {
      const path = pathWord[direction];

      if (confidence === "high" && gap > 25) {
        return `这份结果明显指向${path}。`;
      }

      if (confidence === "medium" && gap >= 10 && gap <= 25) {
        return `这份结果倾向${path}，但也有真实的取舍。`;
      }

      return `很接近。这份结果略微倾向${path}。`;
    },
    footnote: "条形图显示分享者的答案偏向哪边、偏多少，共用一把尺。数字是该维度对结果的加权牵引。",
    cta: "你也在面对同样的决定？",
    ctaBody: "Stay or Return 会带你回答 24 个问题、设定你自己的优先级，过程透明，一切只保存在你自己的浏览器里。",
    tryIt: "自己试一试",
    explore: "了解 Stay or Return",
    versionTitle: "这个链接来自早期版本的问卷。",
    versionBody: "它是用旧版本的 Stay or Return 生成的，已经无法准确显示。请分享者重新做一遍，再分享新的链接。",
    invalidTitle: "这个链接无法打开。",
    invalidBody: "它看起来不完整或已损坏。分享链接把整个结果都装在链接本身里，复制不全就会丢失。请重新索要链接，或者自己做一遍问卷。"
  },

  profile: {
    eyebrow: "你的空间",
    titleWithName: (nickname) => `你好，${nickname}。`,
    title: "你的资料",
    description: "设一个昵称，选一个主题色，回顾过去的决定。",
    identity: "个人资料",
    nickname: "昵称",
    optional: "（可选）",
    placeholder: "我们该怎么称呼你？",
    save: "保存",
    saved: "已保存。",
    accent: "主题色",
    accents: { warm: "珊瑚色", stay: "蓝色", return: "红色" },
    created: (date, count) => `资料创建于${date} · 已保存 ${count} 个决定`,
    privacyTitle: "只存在这台设备上",
    privacyBody: "你的昵称和历史只保存在这台设备的这个浏览器里。不会发送到任何地方：没有账号、没有云端、没有同步。就算我们想看也看不到。",
    privacyFlip: "另一面也要说清楚：它不会跟着你到其他设备，清除浏览器数据也会把它抹掉。想留一份的话可以导出。",
    exportData: "导出我的数据（JSON）",
    deleteAll: "删除资料和历史",
    erasePrompt: "从这台设备上抹掉你的资料和所有已保存的决定？",
    erase: "全部抹掉",
    historyEyebrow: "历史",
    historyTitle: "你的决定",
    newestFirst: "最新在前。"
  },

  history: {
    emptyTitle: "还没有保存的决定。",
    emptyBody: "完成问卷后，结果会自动出现在这里。",
    start: "开始问卷",
    view: "查看",
    delete: "删除",
    removePrompt: "从这台设备上移除？",
    remove: "移除",
    drivenBy: (label) => `由${label}驱动`,
    earlierVersion: "早期版本的问卷",
    restore: "恢复",
    tryAgain: "重试",
    restoreFailed: "这份快照无法在这里恢复。",
    replacePrompt: "替换你进行中的作答？",
    replace: "替换",
    keepCurrent: "保留当前",
    pastStatement,
    srGap: (points) => `，差距 ${points} 分`
  },

  snapshot: {
    missingTitle: "这份快照已经不在这台设备上了。",
    missingBody: "它可能已被删除，或者保存在另一个浏览器里。",
    backProfile: "返回我的资料",
    intro: (date) => `这是${date}保存在这台设备上的快照，查看它不会改变你当前的作答。`,
    eyebrow: (date) => `快照 · ${date}`,
    pastHeadline: (direction, confidence, difference) => `${pastStatement(direction, confidence, difference)}。`,
    confidence: (level) => `${level}置信度`,
    gap: (points) => `差距 ${points} 分`,
    earlierVersionBody: "这份快照来自早期版本的问卷，无法重新计算完整的维度拆解。上面的方向、置信度和差距就是它当时显示的内容。",
    restoreNote: "恢复会让这份快照重新成为你当前的作答。",
    keyDrivers: "关键驱动",
    wherePulled: "每个维度当时的牵引方向",
    asOf: (date) => `截至${date}。`
  }
};

// Referenced so an unused-import lint never removes the type-only imports.
export type { ConfidenceLevel, ScenarioId };
