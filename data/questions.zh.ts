// Chinese copy for data/questions.ts, keyed by question id and option id.
// Ids and scores are not repeated here; the English file owns them.

type QuestionTranslation = {
  prompt: string;
  helpText?: string;
  options: Record<string, string>;
};

export const questionsZh: Record<string, QuestionTranslation> = {
  career_job_access: {
    prompt: "看未来 12 到 24 个月，你觉得哪边有更现实的、适合你目标岗位的机会？",
    helpText: "想想你真正有竞争力的工作，而不是理论上的理想情况。",
    options: {
      career_job_access_us: "主要在美国",
      career_job_access_balanced: "两边似乎都有可行的选择",
      career_job_access_china: "主要在中国"
    }
  },
  career_sponsorship_dependency: {
    prompt: "你理想中的美国职业路径，有多依赖雇主担保签证或在身份问题上的通融？",
    options: {
      career_sponsorship_dependency_low: "不太依赖，我在美国仍有现实的选择",
      career_sponsorship_dependency_medium: "有影响，但只是众多因素之一",
      career_sponsorship_dependency_high: "非常依赖，这是主要瓶颈"
    }
  },
  career_network_strength: {
    prompt: "你现在在哪边有更强的职业人脉，能帮你内推、面试或进入行业？",
    options: {
      career_network_strength_us: "主要在美国",
      career_network_strength_balanced: "两边差不多",
      career_network_strength_china: "主要在中国"
    }
  },
  career_work_model_fit: {
    prompt: "哪一种工作环境更符合你想要的职业发展方式？",
    options: {
      career_work_model_fit_us: "美国的工作环境更合适",
      career_work_model_fit_balanced: "两种环境我都能有效工作",
      career_work_model_fit_china: "中国的工作环境更合适"
    }
  },
  salary_take_home_outlook: {
    prompt: "扣掉税、房租和日常开销之后，你预计近期的财务状况在哪边更好？",
    options: {
      salary_take_home_outlook_us: "很可能在美国更好",
      salary_take_home_outlook_balanced: "总体上大概差不多",
      salary_take_home_outlook_china: "很可能在中国更好"
    }
  },
  salary_family_pressure: {
    prompt: "未来几年，哪条路更可能减轻你或家人的经济压力？",
    options: {
      salary_family_pressure_us: "留在美国更可能有帮助",
      salary_family_pressure_balanced: "差别不太明显",
      salary_family_pressure_china: "回国更可能有帮助"
    }
  },
  salary_savings_outlook: {
    prompt: "如果目标是攒下积蓄或建立财务缓冲，现在在哪边更现实？",
    options: {
      salary_savings_outlook_us: "在美国更现实",
      salary_savings_outlook_balanced: "两边差不多现实",
      salary_savings_outlook_china: "在中国更现实"
    }
  },
  salary_cost_tradeoff_acceptability: {
    prompt: "哪条路上的生活成本取舍，是你现在更能接受的？",
    options: {
      salary_cost_tradeoff_acceptability_us: "美国的取舍更能接受",
      salary_cost_tradeoff_acceptability_balanced: "两边都有不小的取舍",
      salary_cost_tradeoff_acceptability_china: "中国的取舍更能接受"
    }
  },
  immigration_stress_level: {
    prompt: "美国签证或移民身份的不确定性，现在给你带来多大压力？",
    options: {
      immigration_stress_level_low: "对我来说可以应付",
      immigration_stress_level_medium: "有影响，但不是我最大的顾虑",
      immigration_stress_level_high: "这是我最大的顾虑之一"
    }
  },
  immigration_timeline_tolerance: {
    prompt: "在美国安定下来之前可能要经历一段漫长且不确定的时间，你能接受到什么程度？",
    options: {
      immigration_timeline_tolerance_high: "这种不确定我可以承受一阵子",
      immigration_timeline_tolerance_balanced: "能承受一些，但有限度",
      immigration_timeline_tolerance_low: "我强烈希望有一条更可预期的路"
    }
  },
  immigration_dependency_risk: {
    prompt: "留美的计划需要好几件事同时顺利才行，你对这样的计划有多放心？",
    options: {
      immigration_dependency_risk_high_tolerance: "这种程度的依赖我可以接受",
      immigration_dependency_risk_balanced: "我不确定这个风险值不值得",
      immigration_dependency_risk_low_tolerance: "这种程度的不确定让我觉得太不稳"
    }
  },
  immigration_constraint_acceptance: {
    prompt: "你愿意在多大程度上让移民身份的限制来左右你在美国的工作和生活选择？",
    options: {
      immigration_constraint_acceptance_high: "只要整体这条路值得，我可以接受一些限制",
      immigration_constraint_acceptance_balanced: "只能接受到一定程度",
      immigration_constraint_acceptance_low: "我不想让它左右我这么多的生活"
    }
  },
  family_proximity_importance: {
    prompt: "未来 3 到 5 年，离家人更近对你有多重要？",
    options: {
      family_proximity_importance_low: "重要，但不是决定的核心",
      family_proximity_importance_balanced: "比较重要",
      family_proximity_importance_high: "非常重要"
    }
  },
  family_responsibility_pull: {
    prompt: "目前的家庭责任，在多大程度上把你往国内拉，而不是留在海外？",
    options: {
      family_responsibility_pull_low: "目前不太大",
      family_responsibility_pull_balanced: "有一些牵引，但还能应付",
      family_responsibility_pull_high: "这是一个主要考量"
    }
  },
  family_support_environment: {
    prompt: "你现在预计在哪边能得到更强的情感支持和日常的稳定感？",
    options: {
      family_support_environment_us: "主要在美国",
      family_support_environment_balanced: "在哪边我都能感到有支持",
      family_support_environment_china: "主要在中国"
    }
  },
  family_expectation_constraint: {
    prompt: "家人的期望在多大程度上影响了你现实中能做的选择？",
    helpText: "说的是现实约束，不只是情绪。",
    options: {
      family_expectation_constraint_low: "这个选择我基本可以独立做",
      family_expectation_constraint_balanced: "有影响，但不决定结果",
      family_expectation_constraint_high: "它很大程度上决定了我现实中能选什么"
    }
  },
  lifestyle_daily_fit: {
    prompt: "哪个地方更符合你想要的日常生活？",
    options: {
      lifestyle_daily_fit_us: "美国更符合",
      lifestyle_daily_fit_balanced: "两边我都能适应",
      lifestyle_daily_fit_china: "中国更符合"
    }
  },
  lifestyle_community_outlook: {
    prompt: "你觉得在哪边更可能建立起自己想要的社交生活和社群？",
    options: {
      lifestyle_community_outlook_us: "在美国更可能",
      lifestyle_community_outlook_balanced: "在哪边都能建立",
      lifestyle_community_outlook_china: "在中国更可能"
    }
  },
  lifestyle_adjustment_cost: {
    prompt: "现在看来，哪条路需要你在情感和现实上做的调整更少？",
    options: {
      lifestyle_adjustment_cost_us: "留在美国需要的调整更少",
      lifestyle_adjustment_cost_balanced: "两条路都需要不小的调整",
      lifestyle_adjustment_cost_china: "回国需要的调整更少"
    }
  },
  lifestyle_location_flexibility: {
    prompt: "哪条路让你更有余地去选择一个真正喜欢的生活环境？",
    options: {
      lifestyle_location_flexibility_us: "美国的余地可能更大",
      lifestyle_location_flexibility_balanced: "两边差不多",
      lifestyle_location_flexibility_china: "中国的余地可能更大"
    }
  },
  long_term_location_alignment: {
    prompt: "未来 5 到 10 年，现实地说，你想主要在哪里生活？",
    options: {
      long_term_location_alignment_us: "主要在美国",
      long_term_location_alignment_balanced: "两条路都还有可能",
      long_term_location_alignment_china: "主要在中国"
    }
  },
  long_term_option_preservation: {
    prompt: "你现在认为哪个选择能为未来保留更多有意义的可能性？",
    options: {
      long_term_option_preservation_us: "留在美国保留的选择更多",
      long_term_option_preservation_balanced: "两边都保留了有意义的选择",
      long_term_option_preservation_china: "回国保留的选择更多"
    }
  },
  long_term_reentry_cost: {
    prompt: "如果以后改变主意，哪条路现在离开之后更难再回来？",
    options: {
      long_term_reentry_cost_us: "现在离开美国这条路，以后可能更难逆转",
      long_term_reentry_cost_balanced: "两条路的可逆程度差不多",
      long_term_reentry_cost_china: "现在离开中国这条路，以后可能更难逆转"
    }
  },
  long_term_growth_platform: {
    prompt: "现在看来，哪条路是你长期发展更好的平台？",
    helpText: "看现实的成长条件，而不是理想情况下的上限。",
    options: {
      long_term_growth_platform_us: "美国看起来是更好的平台",
      long_term_growth_platform_balanced: "两边都能支持扎实的长期发展",
      long_term_growth_platform_china: "中国看起来是更好的平台"
    }
  }
};
