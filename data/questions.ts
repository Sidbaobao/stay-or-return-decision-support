import { Question } from "@/types";

// Twenty-four questions, four per part. Each asks one thing, in the words a
// friend would use; each option is something you would actually say. Ids
// and scores are the contract with the scoring engine and never change.
// `reason` is the answer quoted back on the result page and in the memo.
export const questions: Question[] = [
  {
    id: "career_job_access",
    dimensionId: "career",
    prompt: "In the next year or two, where could you realistically get a job you'd want?",
    options: [
      {
        id: "career_job_access_us",
        label: "In the US",
        reason: "you could realistically get a job you'd want in the US",
        stay_us_score: 5,
        return_china_score: 1
      },
      {
        id: "career_job_access_balanced",
        label: "Either place",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "career_job_access_china",
        label: "In China",
        reason: "the jobs you'd want are in China",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "career_sponsorship_dependency",
    dimensionId: "career",
    prompt: "If you stay, how much does your plan depend on an employer sponsoring your visa?",
    options: [
      {
        id: "career_sponsorship_dependency_low",
        label: "Not much. I have other routes",
        reason: "you have routes in the US that don't hang on sponsorship",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "career_sponsorship_dependency_medium",
        label: "Quite a bit",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "career_sponsorship_dependency_high",
        label: "Almost entirely",
        reason: "your US plan hangs almost entirely on sponsorship",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "career_network_strength",
    dimensionId: "career",
    prompt: "Where are the people who could refer you, introduce you, or get you an interview?",
    options: [
      {
        id: "career_network_strength_us",
        label: "Mostly in the US",
        reason: "the people who can open doors for you are in the US",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "career_network_strength_balanced",
        label: "About the same in both",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "career_network_strength_china",
        label: "Mostly in China",
        reason: "the people who can open doors for you are in China",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "career_work_model_fit",
    dimensionId: "career",
    prompt: "Which way of working suits you better?",
    options: [
      {
        id: "career_work_model_fit_us",
        label: "How things work in the US",
        reason: "the US way of working suits you better",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "career_work_model_fit_balanced",
        label: "I could work either way",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "career_work_model_fit_china",
        label: "How things work in China",
        reason: "the way things work in China suits you better",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "salary_take_home_outlook",
    dimensionId: "salary_cost",
    prompt: "After rent, tax and daily costs, where would you have more left over in the next few years?",
    options: [
      {
        id: "salary_take_home_outlook_us",
        label: "The US",
        reason: "you'd have more left over each month in the US",
        stay_us_score: 5,
        return_china_score: 1
      },
      {
        id: "salary_take_home_outlook_balanced",
        label: "About the same",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "salary_take_home_outlook_china",
        label: "China",
        reason: "you'd have more left over each month in China",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "salary_family_pressure",
    dimensionId: "salary_cost",
    prompt: "Which choice would take more financial pressure off you or your family?",
    options: [
      {
        id: "salary_family_pressure_us",
        label: "Staying",
        reason: "staying would ease the money pressure on you or your family",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "salary_family_pressure_balanced",
        label: "Hard to say",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "salary_family_pressure_china",
        label: "Going back",
        reason: "going back would ease the money pressure on you or your family",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "salary_savings_outlook",
    dimensionId: "salary_cost",
    prompt: "Where is it more realistic to build up real savings?",
    options: [
      {
        id: "salary_savings_outlook_us",
        label: "The US",
        reason: "saving is more realistic for you in the US",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "salary_savings_outlook_balanced",
        label: "Both, about equally",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "salary_savings_outlook_china",
        label: "China",
        reason: "saving is more realistic for you in China",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "salary_cost_tradeoff_acceptability",
    dimensionId: "salary_cost",
    prompt: "Every place has costs it asks you to live with. Which are easier for you to accept?",
    options: [
      {
        id: "salary_cost_tradeoff_acceptability_us",
        label: "The US ones",
        reason: "the cost of living in the US is the one you can live with",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "salary_cost_tradeoff_acceptability_balanced",
        label: "Both are a stretch",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "salary_cost_tradeoff_acceptability_china",
        label: "The Chinese ones",
        reason: "the cost of living in China is the one you can live with",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "immigration_stress_level",
    dimensionId: "immigration",
    prompt: "Right now, how much does the visa situation weigh on you?",
    options: [
      {
        id: "immigration_stress_level_low",
        label: "I can live with it",
        reason: "the uncertainty is something you can live with",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "immigration_stress_level_medium",
        label: "It's there, but not the main thing",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "immigration_stress_level_high",
        label: "It's one of the biggest things on my mind",
        reason: "the uncertainty is one of the biggest things on your mind",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "immigration_timeline_tolerance",
    dimensionId: "immigration",
    prompt: "It could take years to feel settled in the US, with no clear date. How do you feel about that?",
    options: [
      {
        id: "immigration_timeline_tolerance_high",
        label: "I can wait it out",
        reason: "you can wait out years of not being settled",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "immigration_timeline_tolerance_balanced",
        label: "For a while, not forever",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "immigration_timeline_tolerance_low",
        label: "I need a clearer timeline than that",
        reason: "you need a clearer timeline than that",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "immigration_dependency_risk",
    dimensionId: "immigration",
    prompt: "Staying usually means several things have to go right at once: the job, the lottery, the timing. Are you okay with that?",
    options: [
      {
        id: "immigration_dependency_risk_high_tolerance",
        label: "Yes, I can take that risk",
        reason: "you're willing to bet on several things going right at once",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "immigration_dependency_risk_balanced",
        label: "I'm not sure it's worth it",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "immigration_dependency_risk_low_tolerance",
        label: "No, that's too shaky for me",
        reason: "a plan that needs several things to go right feels too shaky to you",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "immigration_constraint_acceptance",
    dimensionId: "immigration",
    prompt: "How much of your life are you willing to let visa rules decide? Which job, which city, when you can leave.",
    options: [
      {
        id: "immigration_constraint_acceptance_high",
        label: "Quite a lot, if the path is worth it",
        reason: "you'll let the rules shape a lot of your choices if the path is worth it",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "immigration_constraint_acceptance_balanced",
        label: "Some, up to a point",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "immigration_constraint_acceptance_low",
        label: "As little as possible",
        reason: "you don't want the rules deciding your life",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "family_proximity_importance",
    dimensionId: "family_emotion",
    prompt: "In the next three to five years, how much does it matter to be close to your family?",
    options: [
      {
        id: "family_proximity_importance_low",
        label: "It matters, but it won't decide this",
        reason: "being near family matters to you, but won't decide this",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "family_proximity_importance_balanced",
        label: "A fair amount",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "family_proximity_importance_high",
        label: "A lot",
        reason: "being near your family matters a lot in the next few years",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "family_responsibility_pull",
    dimensionId: "family_emotion",
    prompt: "Right now, how much do family responsibilities pull you back to China?",
    options: [
      {
        id: "family_responsibility_pull_low",
        label: "Not much right now",
        reason: "nothing at home needs you there right now",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "family_responsibility_pull_balanced",
        label: "Some, but it's manageable",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "family_responsibility_pull_high",
        label: "A lot",
        reason: "responsibilities at home are pulling you back",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "family_support_environment",
    dimensionId: "family_emotion",
    prompt: "Where do you have people who'd catch you on a bad week?",
    options: [
      {
        id: "family_support_environment_us",
        label: "Mostly in the US",
        reason: "the people who'd catch you on a bad week are in the US",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "family_support_environment_balanced",
        label: "Both places",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "family_support_environment_china",
        label: "Mostly in China",
        reason: "the people who'd catch you on a bad week are in China",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "family_expectation_constraint",
    dimensionId: "family_emotion",
    prompt: "How much do your family's expectations limit what you can actually choose?",
    options: [
      {
        id: "family_expectation_constraint_low",
        label: "This is mostly my call",
        reason: "this choice is mostly yours to make",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "family_expectation_constraint_balanced",
        label: "They weigh on me, but I decide",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "family_expectation_constraint_high",
        label: "A lot. Some options aren't really open to me",
        reason: "your family's expectations close off some options for you",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "lifestyle_daily_fit",
    dimensionId: "lifestyle",
    prompt: "Which place feels more like the everyday life you want?",
    options: [
      {
        id: "lifestyle_daily_fit_us",
        label: "The US",
        reason: "everyday life in the US feels more like you",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "lifestyle_daily_fit_balanced",
        label: "I could settle into either",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "lifestyle_daily_fit_china",
        label: "China",
        reason: "everyday life in China feels more like you",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "lifestyle_community_outlook",
    dimensionId: "lifestyle",
    prompt: "Where are you more likely to build the friendships and community you want?",
    options: [
      {
        id: "lifestyle_community_outlook_us",
        label: "The US",
        reason: "you're more likely to find your people in the US",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "lifestyle_community_outlook_balanced",
        label: "Either place",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "lifestyle_community_outlook_china",
        label: "China",
        reason: "you're more likely to find your people in China",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "lifestyle_adjustment_cost",
    dimensionId: "lifestyle",
    prompt: "Which would be the smaller adjustment for you right now?",
    options: [
      {
        id: "lifestyle_adjustment_cost_us",
        label: "Staying",
        reason: "staying is the smaller adjustment for you right now",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "lifestyle_adjustment_cost_balanced",
        label: "Both would be a big adjustment",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "lifestyle_adjustment_cost_china",
        label: "Going back",
        reason: "going back is the smaller adjustment for you right now",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "lifestyle_location_flexibility",
    dimensionId: "lifestyle",
    prompt: "Where do you have more freedom to choose a city and a way of living you'd actually enjoy?",
    options: [
      {
        id: "lifestyle_location_flexibility_us",
        label: "The US",
        reason: "the US gives you more freedom over where and how you live",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "lifestyle_location_flexibility_balanced",
        label: "About the same",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "lifestyle_location_flexibility_china",
        label: "China",
        reason: "China gives you more freedom over where and how you live",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "long_term_location_alignment",
    dimensionId: "long_term",
    prompt: "Ten years from now, where do you honestly see yourself living?",
    options: [
      {
        id: "long_term_location_alignment_us",
        label: "The US",
        reason: "ten years out, you see yourself in the US",
        stay_us_score: 5,
        return_china_score: 1
      },
      {
        id: "long_term_location_alignment_balanced",
        label: "I really don't know yet",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "long_term_location_alignment_china",
        label: "China",
        reason: "ten years out, you see yourself in China",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "long_term_option_preservation",
    dimensionId: "long_term",
    prompt: "Which choice keeps more doors open for you later?",
    options: [
      {
        id: "long_term_option_preservation_us",
        label: "Staying",
        reason: "staying keeps more doors open for you",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "long_term_option_preservation_balanced",
        label: "Both keep doors open",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "long_term_option_preservation_china",
        label: "Going back",
        reason: "going back keeps more doors open for you",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "long_term_reentry_cost",
    dimensionId: "long_term",
    prompt: "If you change your mind later, which is harder to come back to?",
    options: [
      {
        id: "long_term_reentry_cost_us",
        label: "The US. Leaving now would be hard to undo",
        reason: "leaving the US now would be hard to undo",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "long_term_reentry_cost_balanced",
        label: "About the same either way",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "long_term_reentry_cost_china",
        label: "China. Leaving now would be hard to undo",
        reason: "leaving China now would be hard to undo",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "long_term_growth_platform",
    dimensionId: "long_term",
    prompt: "Which place gives you the better base to grow from over the long run?",
    options: [
      {
        id: "long_term_growth_platform_us",
        label: "The US",
        reason: "the US is the better base for you to grow from",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "long_term_growth_platform_balanced",
        label: "Both could work",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "long_term_growth_platform_china",
        label: "China",
        reason: "China is the better base for you to grow from",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  }
];
