// Chinese copy for data/questions.ts, keyed by question id and option id.
// Ids and scores are not repeated here; the English file owns them.
// `reasons` are the answers quoted back ("你说过，……") on the result page
// and in the memo; balanced options have none.

type QuestionTranslation = {
  prompt: string;
  options: Record<string, string>;
  reasons?: Record<string, string>;
};

export const questionsZh: Record<string, QuestionTranslation> = {
  career_job_access: {
    prompt: "未来一两年，你想要的那种工作在哪边更容易找到？",
    options: {
      career_job_access_us: "在美国",
      career_job_access_balanced: "两边都有可能",
      career_job_access_china: "在中国"
    },
    reasons: {
      career_job_access_us: "你想要的那种工作在美国更容易找到",
      career_job_access_china: "你想要的那种工作在中国更容易找到"
    }
  },
  career_sponsorship_dependency: {
    prompt: "如果留在美国，你的计划有多依赖公司给你办签证？",
    options: {
      career_sponsorship_dependency_low: "不太依赖，我还有别的办法",
      career_sponsorship_dependency_medium: "挺依赖的",
      career_sponsorship_dependency_high: "基本全靠这个"
    },
    reasons: {
      career_sponsorship_dependency_low: "你在美国还有不靠公司办签证的路",
      career_sponsorship_dependency_high: "你留在美国的计划基本全靠公司办签证"
    }
  },
  career_network_strength: {
    prompt: "能帮你内推、介绍工作或者拿到面试的人，主要在哪边？",
    options: {
      career_network_strength_us: "主要在美国",
      career_network_strength_balanced: "两边差不多",
      career_network_strength_china: "主要在中国"
    },
    reasons: {
      career_network_strength_us: "能帮你找工作的人主要在美国",
      career_network_strength_china: "能帮你找工作的人主要在中国"
    }
  },
  career_work_model_fit: {
    prompt: "哪边的工作方式更适合你？",
    options: {
      career_work_model_fit_us: "美国",
      career_work_model_fit_balanced: "两边都可以",
      career_work_model_fit_china: "中国"
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
      salary_take_home_outlook_us: "在美国每个月能剩下的钱更多",
      salary_take_home_outlook_china: "在中国每个月能剩下的钱更多"
    }
  },
  salary_family_pressure: {
    prompt: "哪个选择更能减轻你或者家里的经济压力？",
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
    prompt: "在哪边攒钱更现实？",
    options: {
      salary_savings_outlook_us: "美国",
      salary_savings_outlook_balanced: "差不多",
      salary_savings_outlook_china: "中国"
    },
    reasons: {
      salary_savings_outlook_us: "在美国攒钱对你来说更现实",
      salary_savings_outlook_china: "在中国攒钱对你来说更现实"
    }
  },
  salary_cost_tradeoff_acceptability: {
    prompt: "哪边的生活成本你更能接受？",
    options: {
      salary_cost_tradeoff_acceptability_us: "美国",
      salary_cost_tradeoff_acceptability_balanced: "两边都有点吃力",
      salary_cost_tradeoff_acceptability_china: "中国"
    },
    reasons: {
      salary_cost_tradeoff_acceptability_us: "美国的生活成本你更能接受",
      salary_cost_tradeoff_acceptability_china: "中国的生活成本你更能接受"
    }
  },
  immigration_stress_level: {
    prompt: "现在签证这件事给你的压力有多大？",
    options: {
      immigration_stress_level_low: "还好，能应付",
      immigration_stress_level_medium: "有压力，但不是最主要的",
      immigration_stress_level_high: "是我最担心的事之一"
    },
    reasons: {
      immigration_stress_level_low: "签证的事你还能应付",
      immigration_stress_level_high: "签证是你现在最担心的事之一"
    }
  },
  immigration_timeline_tolerance: {
    prompt: "在美国安定下来可能要等好几年，而且没有确定的时间。你能接受吗？",
    options: {
      immigration_timeline_tolerance_high: "能，我可以等",
      immigration_timeline_tolerance_balanced: "能等一段时间，但不能一直等",
      immigration_timeline_tolerance_low: "不行，我需要更确定的安排"
    },
    reasons: {
      immigration_timeline_tolerance_high: "等几年才能安定下来你也可以接受",
      immigration_timeline_tolerance_low: "你需要比这更确定的安排"
    }
  },
  immigration_dependency_risk: {
    prompt: "留在美国通常要好几件事同时顺利才行，比如工作、抽签和时间点。你能接受吗？",
    options: {
      immigration_dependency_risk_high_tolerance: "能，这个风险我愿意承担",
      immigration_dependency_risk_balanced: "不确定值不值得",
      immigration_dependency_risk_low_tolerance: "不能，太不确定了"
    },
    reasons: {
      immigration_dependency_risk_high_tolerance: "你愿意承担几件事必须同时顺利的风险",
      immigration_dependency_risk_low_tolerance: "几件事必须同时顺利的计划对你来说太不确定"
    }
  },
  immigration_constraint_acceptance: {
    prompt: "你愿意让签证规则决定你多少事？比如做什么工作、住哪个城市、什么时候能回家。",
    options: {
      immigration_constraint_acceptance_high: "可以接受很多，只要这条路值得",
      immigration_constraint_acceptance_balanced: "一部分，但有限度",
      immigration_constraint_acceptance_low: "越少越好"
    },
    reasons: {
      immigration_constraint_acceptance_high: "只要这条路值得，你愿意让签证规则决定不少事",
      immigration_constraint_acceptance_low: "你不想让签证规则决定你太多事"
    }
  },
  family_proximity_importance: {
    prompt: "未来三到五年，离家人近对你有多重要？",
    options: {
      family_proximity_importance_low: "重要，但不是决定因素",
      family_proximity_importance_balanced: "比较重要",
      family_proximity_importance_high: "非常重要"
    },
    reasons: {
      family_proximity_importance_low: "离家人近对你重要，但不是决定因素",
      family_proximity_importance_high: "未来几年离家人近对你非常重要"
    }
  },
  family_responsibility_pull: {
    prompt: "现在家里有多需要你回去？",
    options: {
      family_responsibility_pull_low: "目前不太需要",
      family_responsibility_pull_balanced: "有一些，还能应付",
      family_responsibility_pull_high: "很需要"
    },
    reasons: {
      family_responsibility_pull_low: "家里目前不太需要你回去",
      family_responsibility_pull_high: "家里很需要你回去"
    }
  },
  family_support_environment: {
    prompt: "你过得不好的时候，能找的人主要在哪边？",
    options: {
      family_support_environment_us: "主要在美国",
      family_support_environment_balanced: "两边都有",
      family_support_environment_china: "主要在中国"
    },
    reasons: {
      family_support_environment_us: "你过得不好的时候能找的人主要在美国",
      family_support_environment_china: "你过得不好的时候能找的人主要在中国"
    }
  },
  family_expectation_constraint: {
    prompt: "家里人的期望，对你实际能做的选择限制有多大？",
    options: {
      family_expectation_constraint_low: "不大，这基本是我自己的决定",
      family_expectation_constraint_balanced: "有一些，但最后我自己定",
      family_expectation_constraint_high: "很大，有些选择我其实做不了"
    },
    reasons: {
      family_expectation_constraint_low: "这基本是你自己的决定",
      family_expectation_constraint_high: "家里人的期望让你有些选择其实做不了"
    }
  },
  lifestyle_daily_fit: {
    prompt: "哪边的日常生活更接近你想要的？",
    options: {
      lifestyle_daily_fit_us: "美国",
      lifestyle_daily_fit_balanced: "两边都能习惯",
      lifestyle_daily_fit_china: "中国"
    },
    reasons: {
      lifestyle_daily_fit_us: "美国的日常生活更接近你想要的",
      lifestyle_daily_fit_china: "中国的日常生活更接近你想要的"
    }
  },
  lifestyle_community_outlook: {
    prompt: "在哪边你更容易交到朋友、有自己的圈子？",
    options: {
      lifestyle_community_outlook_us: "美国",
      lifestyle_community_outlook_balanced: "两边都可以",
      lifestyle_community_outlook_china: "中国"
    },
    reasons: {
      lifestyle_community_outlook_us: "你在美国更容易有自己的朋友圈",
      lifestyle_community_outlook_china: "你在中国更容易有自己的朋友圈"
    }
  },
  lifestyle_adjustment_cost: {
    prompt: "对你来说，现在哪个改变更小？",
    options: {
      lifestyle_adjustment_cost_us: "留下",
      lifestyle_adjustment_cost_balanced: "两个改变都很大",
      lifestyle_adjustment_cost_china: "回国"
    },
    reasons: {
      lifestyle_adjustment_cost_us: "留下对你来说是更小的改变",
      lifestyle_adjustment_cost_china: "回国对你来说是更小的改变"
    }
  },
  lifestyle_location_flexibility: {
    prompt: "在哪边你更有可能选一个自己喜欢的城市和生活方式？",
    options: {
      lifestyle_location_flexibility_us: "美国",
      lifestyle_location_flexibility_balanced: "差不多",
      lifestyle_location_flexibility_china: "中国"
    },
    reasons: {
      lifestyle_location_flexibility_us: "在美国你更有可能选到自己喜欢的城市和生活方式",
      lifestyle_location_flexibility_china: "在中国你更有可能选到自己喜欢的城市和生活方式"
    }
  },
  long_term_location_alignment: {
    prompt: "十年后，你觉得自己更可能住在哪边？",
    options: {
      long_term_location_alignment_us: "美国",
      long_term_location_alignment_balanced: "还不知道",
      long_term_location_alignment_china: "中国"
    },
    reasons: {
      long_term_location_alignment_us: "你觉得十年后自己更可能住在美国",
      long_term_location_alignment_china: "你觉得十年后自己更可能住在中国"
    }
  },
  long_term_option_preservation: {
    prompt: "哪个选择以后的余地更大？",
    options: {
      long_term_option_preservation_us: "留下",
      long_term_option_preservation_balanced: "两个都有余地",
      long_term_option_preservation_china: "回国"
    },
    reasons: {
      long_term_option_preservation_us: "留下以后的余地更大",
      long_term_option_preservation_china: "回国以后的余地更大"
    }
  },
  long_term_reentry_cost: {
    prompt: "如果以后改变主意，哪边更难再回去？",
    options: {
      long_term_reentry_cost_us: "美国。现在走了，以后很难再回来",
      long_term_reentry_cost_balanced: "差不多",
      long_term_reentry_cost_china: "中国。现在走了，以后很难再回来"
    },
    reasons: {
      long_term_reentry_cost_us: "现在离开美国，以后很难再回来",
      long_term_reentry_cost_china: "现在离开中国，以后很难再回来"
    }
  },
  long_term_growth_platform: {
    prompt: "长远来看，哪边更适合作为你发展的起点？",
    options: {
      long_term_growth_platform_us: "美国",
      long_term_growth_platform_balanced: "两边都可以",
      long_term_growth_platform_china: "中国"
    },
    reasons: {
      long_term_growth_platform_us: "长远来看，美国更适合作为你发展的起点",
      long_term_growth_platform_china: "长远来看，中国更适合作为你发展的起点"
    }
  }
};
