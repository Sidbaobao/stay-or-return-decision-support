// Chinese copy for data/questions.ts, keyed by question id and option id.
// Ids and scores are not repeated here; the English file owns them.
// `reasons` are the answers quoted back ("你说……") on the result page and
// in the memo; balanced options have none.

type QuestionTranslation = {
  prompt: string;
  options: Record<string, string>;
  reasons?: Record<string, string>;
};

export const questionsZh: Record<string, QuestionTranslation> = {
  career_job_access: {
    prompt: "未来一两年，你在哪边更可能找到一份自己想要的工作？",
    options: {
      career_job_access_us: "在美国",
      career_job_access_balanced: "两边都有可能",
      career_job_access_china: "在中国"
    },
    reasons: {
      career_job_access_us: "你想要的工作在美国更好找",
      career_job_access_china: "你想要的工作在中国更好找"
    }
  },
  career_sponsorship_dependency: {
    prompt: "如果留下，你的计划有多依赖公司给你办签证？",
    options: {
      career_sponsorship_dependency_low: "不太依赖，我还有别的路",
      career_sponsorship_dependency_medium: "挺依赖的",
      career_sponsorship_dependency_high: "几乎全靠这个"
    },
    reasons: {
      career_sponsorship_dependency_low: "留美的路不全押在公司办签证上",
      career_sponsorship_dependency_high: "留美的计划几乎全押在公司办签证上"
    }
  },
  career_network_strength: {
    prompt: "能帮你内推、引荐、拿到面试的人，主要在哪边？",
    options: {
      career_network_strength_us: "主要在美国",
      career_network_strength_balanced: "两边差不多",
      career_network_strength_china: "主要在中国"
    },
    reasons: {
      career_network_strength_us: "能帮你敲开门的人在美国",
      career_network_strength_china: "能帮你敲开门的人在中国"
    }
  },
  career_work_model_fit: {
    prompt: "哪边的工作方式更适合你？",
    options: {
      career_work_model_fit_us: "美国那套",
      career_work_model_fit_balanced: "哪边我都能干",
      career_work_model_fit_china: "中国那套"
    },
    reasons: {
      career_work_model_fit_us: "美国的工作方式更适合你",
      career_work_model_fit_china: "中国的工作方式更适合你"
    }
  },
  salary_take_home_outlook: {
    prompt: "扣掉房租、税和日常开销，未来几年你在哪边能剩下更多钱？",
    options: {
      salary_take_home_outlook_us: "美国",
      salary_take_home_outlook_balanced: "差不多",
      salary_take_home_outlook_china: "中国"
    },
    reasons: {
      salary_take_home_outlook_us: "在美国每个月能剩下更多钱",
      salary_take_home_outlook_china: "在中国每个月能剩下更多钱"
    }
  },
  salary_family_pressure: {
    prompt: "哪个选择更能减轻你或家里的经济压力？",
    options: {
      salary_family_pressure_us: "留下",
      salary_family_pressure_balanced: "说不好",
      salary_family_pressure_china: "回国"
    },
    reasons: {
      salary_family_pressure_us: "留下更能减轻你和家里的经济压力",
      salary_family_pressure_china: "回国更能减轻你和家里的经济压力"
    }
  },
  salary_savings_outlook: {
    prompt: "在哪边更有可能真正攒下钱？",
    options: {
      salary_savings_outlook_us: "美国",
      salary_savings_outlook_balanced: "两边差不多",
      salary_savings_outlook_china: "中国"
    },
    reasons: {
      salary_savings_outlook_us: "在美国更攒得下钱",
      salary_savings_outlook_china: "在中国更攒得下钱"
    }
  },
  salary_cost_tradeoff_acceptability: {
    prompt: "每个地方都有它的生活成本和将就。哪边的你更受得了？",
    options: {
      salary_cost_tradeoff_acceptability_us: "美国的",
      salary_cost_tradeoff_acceptability_balanced: "两边都有点勉强",
      salary_cost_tradeoff_acceptability_china: "中国的"
    },
    reasons: {
      salary_cost_tradeoff_acceptability_us: "美国的生活成本你更受得了",
      salary_cost_tradeoff_acceptability_china: "中国的生活成本你更受得了"
    }
  },
  immigration_stress_level: {
    prompt: "现在，签证这件事压在你心上有多重？",
    options: {
      immigration_stress_level_low: "我扛得住",
      immigration_stress_level_medium: "有，但不是最主要的",
      immigration_stress_level_high: "是我最挂心的事之一"
    },
    reasons: {
      immigration_stress_level_low: "签证的事你扛得住",
      immigration_stress_level_high: "签证是你现在最挂心的事之一"
    }
  },
  immigration_timeline_tolerance: {
    prompt: "在美国安定下来可能要等好几年，还没有准数。你怎么看？",
    options: {
      immigration_timeline_tolerance_high: "我等得起",
      immigration_timeline_tolerance_balanced: "能等一阵，不能一直等",
      immigration_timeline_tolerance_low: "我需要一个更明确的时间表"
    },
    reasons: {
      immigration_timeline_tolerance_high: "几年不安定你也等得起",
      immigration_timeline_tolerance_low: "你需要一个更明确的时间表，美国给不了"
    }
  },
  immigration_dependency_risk: {
    prompt: "留下通常意味着好几件事得同时顺利：工作、抽签、时间点。你能接受吗？",
    options: {
      immigration_dependency_risk_high_tolerance: "能，这个险我冒得起",
      immigration_dependency_risk_balanced: "我不确定值不值",
      immigration_dependency_risk_low_tolerance: "不行，太悬了"
    },
    reasons: {
      immigration_dependency_risk_high_tolerance: "你愿意赌几件事同时顺利",
      immigration_dependency_risk_low_tolerance: "要好几件事同时顺利的计划，对你来说太悬"
    }
  },
  immigration_constraint_acceptance: {
    prompt: "你愿意让签证规则决定你多少事？做哪份工作，住哪个城市，什么时候能走。",
    options: {
      immigration_constraint_acceptance_high: "挺多的，只要这条路值得",
      immigration_constraint_acceptance_balanced: "一些，但有限度",
      immigration_constraint_acceptance_low: "越少越好"
    },
    reasons: {
      immigration_constraint_acceptance_high: "只要值得，你愿意让签证规则左右不少选择",
      immigration_constraint_acceptance_low: "你不想让签证规则替你决定生活"
    }
  },
  family_proximity_importance: {
    prompt: "未来三五年，离家人近一点对你有多重要？",
    options: {
      family_proximity_importance_low: "重要，但不决定这件事",
      family_proximity_importance_balanced: "比较重要",
      family_proximity_importance_high: "很重要"
    },
    reasons: {
      family_proximity_importance_low: "离家人近对你重要，但不决定这件事",
      family_proximity_importance_high: "这几年离家人近对你很重要"
    }
  },
  family_responsibility_pull: {
    prompt: "现在，家里有多需要你回去？",
    options: {
      family_responsibility_pull_low: "现在不太需要",
      family_responsibility_pull_balanced: "有一些，还应付得来",
      family_responsibility_pull_high: "很需要"
    },
    reasons: {
      family_responsibility_pull_low: "家里现在不太需要你在身边",
      family_responsibility_pull_high: "家里的事在把你往回拉"
    }
  },
  family_support_environment: {
    prompt: "状态很差的那一周，谁会接住你？这些人主要在哪边？",
    options: {
      family_support_environment_us: "主要在美国",
      family_support_environment_balanced: "两边都有",
      family_support_environment_china: "主要在中国"
    },
    reasons: {
      family_support_environment_us: "状态不好时能接住你的人在美国",
      family_support_environment_china: "状态不好时能接住你的人在中国"
    }
  },
  family_expectation_constraint: {
    prompt: "家里人的期望，在多大程度上限制了你实际能选的？",
    options: {
      family_expectation_constraint_low: "这事基本我说了算",
      family_expectation_constraint_balanced: "有压力，但我自己决定",
      family_expectation_constraint_high: "很大。有些选项对我来说其实不存在"
    },
    reasons: {
      family_expectation_constraint_low: "这个选择基本由你自己做主",
      family_expectation_constraint_high: "家里的期望已经替你关掉了一些选项"
    }
  },
  lifestyle_daily_fit: {
    prompt: "哪边的日子更像你想过的日子？",
    options: {
      lifestyle_daily_fit_us: "美国",
      lifestyle_daily_fit_balanced: "哪边我都能过",
      lifestyle_daily_fit_china: "中国"
    },
    reasons: {
      lifestyle_daily_fit_us: "美国的日子更像你想过的",
      lifestyle_daily_fit_china: "中国的日子更像你想过的"
    }
  },
  lifestyle_community_outlook: {
    prompt: "在哪边你更可能交到想要的朋友、有自己的圈子？",
    options: {
      lifestyle_community_outlook_us: "美国",
      lifestyle_community_outlook_balanced: "两边都可以",
      lifestyle_community_outlook_china: "中国"
    },
    reasons: {
      lifestyle_community_outlook_us: "你更可能在美国有自己的圈子",
      lifestyle_community_outlook_china: "你更可能在中国有自己的圈子"
    }
  },
  lifestyle_adjustment_cost: {
    prompt: "现在看，哪个对你来说是更小的改变？",
    options: {
      lifestyle_adjustment_cost_us: "留下",
      lifestyle_adjustment_cost_balanced: "两个都是大改变",
      lifestyle_adjustment_cost_china: "回国"
    },
    reasons: {
      lifestyle_adjustment_cost_us: "留下对你来说是更小的改变",
      lifestyle_adjustment_cost_china: "回国对你来说是更小的改变"
    }
  },
  lifestyle_location_flexibility: {
    prompt: "在哪边你更有余地选一个自己真正喜欢的城市和活法？",
    options: {
      lifestyle_location_flexibility_us: "美国",
      lifestyle_location_flexibility_balanced: "差不多",
      lifestyle_location_flexibility_china: "中国"
    },
    reasons: {
      lifestyle_location_flexibility_us: "美国让你更有余地选在哪、怎么活",
      lifestyle_location_flexibility_china: "中国让你更有余地选在哪、怎么活"
    }
  },
  long_term_location_alignment: {
    prompt: "十年后，你老实说更可能住在哪？",
    options: {
      long_term_location_alignment_us: "美国",
      long_term_location_alignment_balanced: "真的还不知道",
      long_term_location_alignment_china: "中国"
    },
    reasons: {
      long_term_location_alignment_us: "十年后你看到的自己在美国",
      long_term_location_alignment_china: "十年后你看到的自己在中国"
    }
  },
  long_term_option_preservation: {
    prompt: "哪个选择给以后留的门更多？",
    options: {
      long_term_option_preservation_us: "留下",
      long_term_option_preservation_balanced: "两个都留着门",
      long_term_option_preservation_china: "回国"
    },
    reasons: {
      long_term_option_preservation_us: "留下给你以后留的门更多",
      long_term_option_preservation_china: "回国给你以后留的门更多"
    }
  },
  long_term_reentry_cost: {
    prompt: "如果以后改主意，哪边更难回得去？",
    options: {
      long_term_reentry_cost_us: "美国。现在走了很难再回来",
      long_term_reentry_cost_balanced: "两边差不多",
      long_term_reentry_cost_china: "中国。现在走了很难再回来"
    },
    reasons: {
      long_term_reentry_cost_us: "现在离开美国，以后很难回来",
      long_term_reentry_cost_china: "现在离开中国，以后很难回来"
    }
  },
  long_term_growth_platform: {
    prompt: "长远看，哪边是你更好的起点？",
    options: {
      long_term_growth_platform_us: "美国",
      long_term_growth_platform_balanced: "两边都行",
      long_term_growth_platform_china: "中国"
    },
    reasons: {
      long_term_growth_platform_us: "长远看，美国是你更好的起点",
      long_term_growth_platform_china: "长远看，中国是你更好的起点"
    }
  }
};
