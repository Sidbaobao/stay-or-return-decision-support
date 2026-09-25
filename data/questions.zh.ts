// Chinese copy for data/questions.ts, keyed by question id and option id.
// Ids and scores are not repeated here; the English file owns them.
// `reasons` are the answers quoted back ("你说过，……") on the result page
// and in the memo. Balanced options have none.

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
    prompt: "美国和中国的职场，哪边更适合你？",
    options: {
      career_work_model_fit_us: "美国",
      career_work_model_fit_balanced: "两边都可以",
      career_work_model_fit_china: "中国"
    },
    reasons: {
      career_work_model_fit_us: "美国的职场更适合你",
      career_work_model_fit_china: "中国的职场更适合你"
    }
  },
  career_fresh_grad_hiring: {
    prompt: "你在国内想做的那类工作，是不是主要招应届生？",
    options: {
      career_fresh_grad_hiring_any_stage: "不是，什么时候进都行",
      career_fresh_grad_hiring_mixed: "看具体岗位",
      career_fresh_grad_hiring_fresh_only: "是，基本只招应届生"
    },
    reasons: {
      career_fresh_grad_hiring_any_stage: "你在国内想做的工作什么时候进都行",
      career_fresh_grad_hiring_fresh_only: "你在国内想做的工作基本只招应届生"
    }
  },
  career_field_frontier: {
    prompt: "现在你这个行业最前沿的工作，主要在美国还是中国？",
    options: {
      career_field_frontier_us: "美国",
      career_field_frontier_balanced: "两边都有，看方向",
      career_field_frontier_china: "中国"
    },
    reasons: {
      career_field_frontier_us: "你这个行业最前沿的工作主要在美国",
      career_field_frontier_china: "你这个行业最前沿的工作主要在中国"
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
    prompt: "未来五年，你觉得在哪边工资涨得更快？",
    options: {
      salary_savings_outlook_us: "美国",
      salary_savings_outlook_balanced: "差不多",
      salary_savings_outlook_china: "中国"
    },
    reasons: {
      salary_savings_outlook_us: "你觉得在美国工资涨得更快",
      salary_savings_outlook_china: "你觉得在中国工资涨得更快"
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
  salary_job_gap_runway: {
    prompt: "如果在美国一时没了工作，房租和开销你能撑多久？",
    options: {
      salary_job_gap_runway_long: "半年以上没问题",
      salary_job_gap_runway_months: "几个月吧",
      salary_job_gap_runway_short: "最多撑一两个月"
    },
    reasons: {
      salary_job_gap_runway_long: "在美国就算一时没了工作，房租和开销也能撑半年以上",
      salary_job_gap_runway_short: "在美国要是没了工作，房租和开销最多撑一两个月"
    }
  },
  salary_timing_money: {
    prompt: "哪边有你晚了就拿不到的东西，比如没到期的股票或者留学生落户？",
    options: {
      salary_timing_money_us: "美国",
      salary_timing_money_balanced: "两边都没什么",
      salary_timing_money_china: "中国"
    },
    reasons: {
      salary_timing_money_us: "现在离开美国会损失没到期的股票这类东西",
      salary_timing_money_china: "再拖着不回国，留学生落户这类好处就拿不到了"
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
    prompt: "在美国可能要等好几年才能安定下来，还没个准日子，你能接受吗？",
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
    prompt: "留下来通常要工作、抽签、时机都对上才行，你能接受吗？",
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
    prompt: "你愿意让签证决定多少事，比如工作、住哪儿、什么时候能回家？",
    options: {
      immigration_constraint_acceptance_high: "可以接受很多，只要这条路值得",
      immigration_constraint_acceptance_balanced: "能接受一些，但有限度",
      immigration_constraint_acceptance_low: "越少越好"
    },
    reasons: {
      immigration_constraint_acceptance_high: "只要这条路值得，你愿意让签证决定不少事",
      immigration_constraint_acceptance_low: "你不想让签证决定你太多事"
    }
  },
  immigration_lottery_runway: {
    prompt: "OPT 到期前，你还有几次抽签的机会？",
    options: {
      immigration_lottery_runway_more: "不止一次，或者我不用抽签",
      immigration_lottery_runway_one: "就剩一次了",
      immigration_lottery_runway_none: "没有了，OPT 马上就到期"
    },
    reasons: {
      immigration_lottery_runway_more: "你还有不止一次抽签的机会，或者根本不用抽",
      immigration_lottery_runway_none: "OPT 马上就到期，你已经没机会再抽签"
    }
  },
  immigration_green_card_path: {
    prompt: "留下的话，你拿绿卡有没有不用等很多年的路？",
    options: {
      immigration_green_card_path_fast: "有，我能走更快的路",
      immigration_green_card_path_unsure: "还不知道",
      immigration_green_card_path_queue: "没有，只能等很多年"
    },
    reasons: {
      immigration_green_card_path_fast: "你拿绿卡能走更快的路",
      immigration_green_card_path_queue: "你拿绿卡只能等很多年"
    }
  },
  family_proximity_importance: {
    prompt: "未来三到五年，离家人近对你有多重要？",
    options: {
      family_proximity_importance_low: "重要，但不会因为这个决定去留",
      family_proximity_importance_balanced: "挺重要，肯定要考虑进去",
      family_proximity_importance_high: "非常重要，可能就看这个了"
    },
    reasons: {
      family_proximity_importance_low: "离家人近对你重要，但不会因为这个决定去留",
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
  family_partner_plans: {
    prompt: "如果你有另一半，对方希望你们以后在哪边生活？",
    options: {
      family_partner_plans_us: "在美国",
      family_partner_plans_balanced: "单身，或者对方没有明确想法",
      family_partner_plans_china: "在中国"
    },
    reasons: {
      family_partner_plans_us: "你的另一半希望你们以后在美国生活",
      family_partner_plans_china: "你的另一半希望你们以后在中国生活"
    }
  },
  family_parent_care: {
    prompt: "你觉得爸妈多久之后会需要你在身边？",
    options: {
      family_parent_care_later: "还有很多年",
      family_parent_care_few_years: "几年之内",
      family_parent_care_soon: "很快，或者已经需要了"
    },
    reasons: {
      family_parent_care_later: "爸妈还有很多年才需要你在身边",
      family_parent_care_soon: "爸妈很快就需要你在身边"
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
    prompt: "留下还是回国，现在哪个对你来说变化更小？",
    options: {
      lifestyle_adjustment_cost_us: "留下",
      lifestyle_adjustment_cost_balanced: "两边变化都很大",
      lifestyle_adjustment_cost_china: "回国"
    },
    reasons: {
      lifestyle_adjustment_cost_us: "现在留下对你来说变化更小",
      lifestyle_adjustment_cost_china: "现在回国对你来说变化更小"
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
  lifestyle_belonging: {
    prompt: "在美国和中国，你在哪边更有归属感？",
    options: {
      lifestyle_belonging_us: "美国",
      lifestyle_belonging_balanced: "说不好",
      lifestyle_belonging_china: "中国"
    },
    reasons: {
      lifestyle_belonging_us: "你在美国更有归属感",
      lifestyle_belonging_china: "你在中国更有归属感"
    }
  },
  lifestyle_healthcare: {
    prompt: "要是生了大病，你更愿意在哪边看病、处理保险？",
    options: {
      lifestyle_healthcare_us: "美国",
      lifestyle_healthcare_balanced: "差不多",
      lifestyle_healthcare_china: "中国"
    },
    reasons: {
      lifestyle_healthcare_us: "生了大病你更愿意在美国看",
      lifestyle_healthcare_china: "生了大病你更愿意在中国看"
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
    prompt: "如果以后想去第三个国家，现在哪个选择更方便？",
    options: {
      long_term_option_preservation_us: "留下",
      long_term_option_preservation_balanced: "两个都行",
      long_term_option_preservation_china: "回国"
    },
    reasons: {
      long_term_option_preservation_us: "留下以后更方便去第三个国家",
      long_term_option_preservation_china: "回国以后更方便去第三个国家"
    }
  },
  long_term_reentry_cost: {
    prompt: "如果以后改变主意，哪边更难再回去？",
    options: {
      long_term_reentry_cost_us: "美国，现在走了以后很难再回来",
      long_term_reentry_cost_balanced: "差不多",
      long_term_reentry_cost_china: "中国，现在走了以后很难再回来"
    },
    reasons: {
      long_term_reentry_cost_us: "现在离开美国，以后很难再回来",
      long_term_reentry_cost_china: "现在离开中国，以后很难再回来"
    }
  },
  long_term_growth_platform: {
    prompt: "长远来看，在哪边打基础对你更好？",
    options: {
      long_term_growth_platform_us: "美国",
      long_term_growth_platform_balanced: "两边都可以",
      long_term_growth_platform_china: "中国"
    },
    reasons: {
      long_term_growth_platform_us: "长远来看，在美国打基础对你更好",
      long_term_growth_platform_china: "长远来看，在中国打基础对你更好"
    }
  },
  long_term_retirement_place: {
    prompt: "等你老了，你想在哪边生活？",
    options: {
      long_term_retirement_place_us: "美国",
      long_term_retirement_place_balanced: "还没想那么远",
      long_term_retirement_place_china: "中国"
    },
    reasons: {
      long_term_retirement_place_us: "你老了想在美国生活",
      long_term_retirement_place_china: "你老了想在中国生活"
    }
  },
  long_term_children_schooling: {
    prompt: "如果以后有孩子，你希望孩子在哪边长大、上学？",
    options: {
      long_term_children_schooling_us: "美国",
      long_term_children_schooling_balanced: "不打算要孩子，或者还没想过",
      long_term_children_schooling_china: "中国"
    },
    reasons: {
      long_term_children_schooling_us: "你希望孩子在美国长大、上学",
      long_term_children_schooling_china: "你希望孩子在中国长大、上学"
    }
  }
};
