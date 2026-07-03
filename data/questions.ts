import { Question } from "@/types";

export const questions: Question[] = [
  {
    id: "career_job_access",
    dimensionId: "career",
    prompt: "Looking at the next 12 to 24 months, where do you currently see more realistic job openings for your target role?",
    helpText: "Think about jobs you could actually compete for, not ideal outcomes in theory.",
    options: [
      {
        id: "career_job_access_us",
        label: "Mostly in the US",
        stay_us_score: 5,
        return_china_score: 1,
        note: "A clearly stronger US job market fit is a solid practical case for staying."
      },
      {
        id: "career_job_access_balanced",
        label: "There seem to be workable options in both places",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "career_job_access_china",
        label: "Mostly in China",
        stay_us_score: 1,
        return_china_score: 5,
        note: "A clearly stronger China job market fit is a solid practical case for returning."
      }
    ]
  },
  {
    id: "career_sponsorship_dependency",
    dimensionId: "career",
    prompt: "How much does your preferred US career path depend on employer sponsorship or immigration accommodation?",
    options: [
      {
        id: "career_sponsorship_dependency_low",
        label: "Not much; I still have realistic US options",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "career_sponsorship_dependency_medium",
        label: "It matters, but it is only one factor",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "career_sponsorship_dependency_high",
        label: "A lot; it is a major bottleneck",
        stay_us_score: 1,
        return_china_score: 5,
        note: "A sponsorship bottleneck makes returning much more practical."
      }
    ]
  },
  {
    id: "career_network_strength",
    dimensionId: "career",
    prompt: "Where do you currently have the stronger professional network for referrals, interviews, or industry entry?",
    options: [
      {
        id: "career_network_strength_us",
        label: "Mostly in the US",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "career_network_strength_balanced",
        label: "Fairly balanced across both places",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "career_network_strength_china",
        label: "Mostly in China",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "career_work_model_fit",
    dimensionId: "career",
    prompt: "Which work environment currently feels more compatible with how you want to build your career?",
    helpText: "For example: pace, specialization, management style, promotion expectations, or autonomy.",
    options: [
      {
        id: "career_work_model_fit_us",
        label: "The US work environment fits better",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "career_work_model_fit_balanced",
        label: "I could work effectively in either environment",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "career_work_model_fit_china",
        label: "The China work environment fits better",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "salary_take_home_outlook",
    dimensionId: "salary_cost",
    prompt: "After taxes, rent, and daily expenses, where do you expect your near-term financial position to be stronger?",
    options: [
      {
        id: "salary_take_home_outlook_us",
        label: "Likely stronger in the US",
        stay_us_score: 5,
        return_china_score: 1,
        note: "A clearly better near-term financial outcome deserves real weight."
      },
      {
        id: "salary_take_home_outlook_balanced",
        label: "Probably similar overall",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "salary_take_home_outlook_china",
        label: "Likely stronger in China",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "salary_family_pressure",
    dimensionId: "salary_cost",
    prompt: "Which path seems more likely to reduce financial pressure on you or your family in the next few years?",
    options: [
      {
        id: "salary_family_pressure_us",
        label: "Staying in the US would likely help more",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "salary_family_pressure_balanced",
        label: "The difference is not very clear",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "salary_family_pressure_china",
        label: "Returning to China would likely help more",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "salary_savings_outlook",
    dimensionId: "salary_cost",
    prompt: "If your goal is to build savings or financial cushion, where does that currently seem more realistic?",
    options: [
      {
        id: "salary_savings_outlook_us",
        label: "More realistic in the US",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "salary_savings_outlook_balanced",
        label: "About equally realistic in both places",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "salary_savings_outlook_china",
        label: "More realistic in China",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "salary_cost_tradeoff_acceptability",
    dimensionId: "salary_cost",
    prompt: "Which path has a cost-of-living tradeoff that feels more acceptable to you right now?",
    helpText: "For example: housing cost, commute burden, dependence on family support, or city choice.",
    options: [
      {
        id: "salary_cost_tradeoff_acceptability_us",
        label: "The US tradeoff feels more acceptable",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "salary_cost_tradeoff_acceptability_balanced",
        label: "Both involve meaningful tradeoffs",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "salary_cost_tradeoff_acceptability_china",
        label: "The China tradeoff feels more acceptable",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "immigration_stress_level",
    dimensionId: "immigration",
    prompt: "How much stress does US visa or immigration uncertainty create for you right now?",
    options: [
      {
        id: "immigration_stress_level_low",
        label: "It is manageable for me",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "immigration_stress_level_medium",
        label: "It matters, but it is not my biggest concern",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "immigration_stress_level_high",
        label: "It is one of my biggest concerns",
        stay_us_score: 1,
        return_china_score: 5,
        note: "High immigration stress materially strengthens the case for returning."
      }
    ]
  },
  {
    id: "immigration_timeline_tolerance",
    dimensionId: "immigration",
    prompt: "How comfortable are you with a long and uncertain timeline before feeling settled in the US?",
    options: [
      {
        id: "immigration_timeline_tolerance_high",
        label: "I can tolerate that uncertainty for a while",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "immigration_timeline_tolerance_balanced",
        label: "I can tolerate some uncertainty, but only to a point",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "immigration_timeline_tolerance_low",
        label: "I would strongly prefer a more predictable path",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "immigration_dependency_risk",
    dimensionId: "immigration",
    prompt: "How comfortable are you with a stay-in-the-US plan that depends on several things going right at once?",
    helpText: "For example: job offer timing, employer support, lottery outcomes, or policy stability.",
    options: [
      {
        id: "immigration_dependency_risk_high_tolerance",
        label: "I can accept that level of dependency",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "immigration_dependency_risk_balanced",
        label: "I am unsure whether that risk is worth it",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "immigration_dependency_risk_low_tolerance",
        label: "That level of uncertainty feels too unstable",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "immigration_constraint_acceptance",
    dimensionId: "immigration",
    prompt: "How willing are you to let immigration constraints shape your job or life choices in the US?",
    options: [
      {
        id: "immigration_constraint_acceptance_high",
        label: "I can accept some constraint if the overall path is worth it",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "immigration_constraint_acceptance_balanced",
        label: "I can accept it only up to a point",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "immigration_constraint_acceptance_low",
        label: "I do not want that much of my life shaped by it",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "family_proximity_importance",
    dimensionId: "family_emotion",
    prompt: "Over the next 3 to 5 years, how important is it for you to be physically closer to family?",
    options: [
      {
        id: "family_proximity_importance_low",
        label: "Important, but not central to my decision",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "family_proximity_importance_balanced",
        label: "Moderately important",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "family_proximity_importance_high",
        label: "Very important",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "family_responsibility_pull",
    dimensionId: "family_emotion",
    prompt: "How much do current family responsibilities pull you toward being in China rather than abroad?",
    options: [
      {
        id: "family_responsibility_pull_low",
        label: "Not much right now",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "family_responsibility_pull_balanced",
        label: "There is some pull, but it is manageable",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "family_responsibility_pull_high",
        label: "It is a major consideration",
        stay_us_score: 1,
        return_china_score: 5,
        note: "Strong family obligations pull hard toward returning."
      }
    ]
  },
  {
    id: "family_support_environment",
    dimensionId: "family_emotion",
    prompt: "Where do you currently expect stronger emotional support and day-to-day stability?",
    options: [
      {
        id: "family_support_environment_us",
        label: "Mostly in the US",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "family_support_environment_balanced",
        label: "I could feel supported in either place",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "family_support_environment_china",
        label: "Mostly in China",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "family_expectation_constraint",
    dimensionId: "family_emotion",
    prompt: "How much do family expectations affect what feels realistically available to you?",
    helpText: "This is about practical constraint, not just emotion.",
    options: [
      {
        id: "family_expectation_constraint_low",
        label: "I can make this choice fairly independently",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "family_expectation_constraint_balanced",
        label: "It influences me, but does not determine the decision",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "family_expectation_constraint_high",
        label: "It strongly affects what I can realistically choose",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "lifestyle_daily_fit",
    dimensionId: "lifestyle",
    prompt: "Which place currently feels more compatible with the kind of daily life you want?",
    helpText: "Think about pace, convenience, social norms, independence, and routine.",
    options: [
      {
        id: "lifestyle_daily_fit_us",
        label: "The US feels more compatible",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "lifestyle_daily_fit_balanced",
        label: "I could adapt to both",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "lifestyle_daily_fit_china",
        label: "China feels more compatible",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "lifestyle_community_outlook",
    dimensionId: "lifestyle",
    prompt: "Where do you think you are more likely to build the kind of social life and community you want?",
    options: [
      {
        id: "lifestyle_community_outlook_us",
        label: "More likely in the US",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "lifestyle_community_outlook_balanced",
        label: "I could build that in either place",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "lifestyle_community_outlook_china",
        label: "More likely in China",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "lifestyle_adjustment_cost",
    dimensionId: "lifestyle",
    prompt: "Which path feels like it would require less emotional and practical adjustment from you right now?",
    options: [
      {
        id: "lifestyle_adjustment_cost_us",
        label: "Staying in the US would require less adjustment",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "lifestyle_adjustment_cost_balanced",
        label: "Both would require meaningful adjustment",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "lifestyle_adjustment_cost_china",
        label: "Returning to China would require less adjustment",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "lifestyle_location_flexibility",
    dimensionId: "lifestyle",
    prompt: "Which path gives you more flexibility to choose a living environment you could actually enjoy?",
    helpText: "For example: city choice, distance from family, pace of life, or daily convenience.",
    options: [
      {
        id: "lifestyle_location_flexibility_us",
        label: "Likely more flexibility in the US",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "lifestyle_location_flexibility_balanced",
        label: "About the same in both places",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "lifestyle_location_flexibility_china",
        label: "Likely more flexibility in China",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "long_term_location_alignment",
    dimensionId: "long_term",
    prompt: "Where do you realistically want to be based over the next 5 to 10 years?",
    options: [
      {
        id: "long_term_location_alignment_us",
        label: "Mostly in the US",
        stay_us_score: 5,
        return_china_score: 1
      },
      {
        id: "long_term_location_alignment_balanced",
        label: "Either path still feels plausible",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "long_term_location_alignment_china",
        label: "Mostly in China",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "long_term_option_preservation",
    dimensionId: "long_term",
    prompt: "Which option do you currently believe preserves more meaningful future options for you?",
    options: [
      {
        id: "long_term_option_preservation_us",
        label: "Staying in the US preserves more options",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "long_term_option_preservation_balanced",
        label: "Both preserve meaningful options",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "long_term_option_preservation_china",
        label: "Returning to China preserves more options",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "long_term_reentry_cost",
    dimensionId: "long_term",
    prompt: "Which path feels harder to leave now and re-enter later if you change your mind?",
    helpText: "This is about reversibility and strategic timing.",
    options: [
      {
        id: "long_term_reentry_cost_us",
        label: "Leaving the US path now may be harder to reverse later",
        stay_us_score: 4,
        return_china_score: 2,
        note: "If the US path feels less reversible, staying has stronger strategic value."
      },
      {
        id: "long_term_reentry_cost_balanced",
        label: "Both paths seem similarly reversible or irreversible",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "long_term_reentry_cost_china",
        label: "Leaving the China path now may be harder to reverse later",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "long_term_growth_platform",
    dimensionId: "long_term",
    prompt: "Which path currently looks like the stronger platform for your long-term development?",
    helpText: "Focus on realistic growth conditions, not ideal-case upside.",
    options: [
      {
        id: "long_term_growth_platform_us",
        label: "The US looks like the stronger platform",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "long_term_growth_platform_balanced",
        label: "Both could support solid long-term development",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "long_term_growth_platform_china",
        label: "China looks like the stronger platform",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  }
];
