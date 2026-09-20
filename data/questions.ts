import { Question } from "@/types";

// Twenty-four questions, four per part. Each asks one thing in an ordinary
// sentence; each option is a plain answer. Ids and scores are the contract
// with the scoring engine and never change. `reason` is the answer quoted
// back on the result page and in the memo, as a clause after "you said".
export const questions: Question[] = [
  {
    id: "career_job_access",
    dimensionId: "career",
    prompt: "In the next year or two, where are you more likely to get the kind of job you want?",
    options: [
      {
        id: "career_job_access_us",
        label: "In the US",
        reason: "you're more likely to get the job you want in the US",
        stay_us_score: 5,
        return_china_score: 1
      },
      {
        id: "career_job_access_balanced",
        label: "It could be either",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "career_job_access_china",
        label: "In China",
        reason: "you're more likely to get the job you want in China",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "career_sponsorship_dependency",
    dimensionId: "career",
    prompt: "If you stay in the US, how much does your plan depend on a company sponsoring your visa?",
    options: [
      {
        id: "career_sponsorship_dependency_low",
        label: "Not much, I have other options",
        reason: "you have options in the US that don't depend on sponsorship",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "career_sponsorship_dependency_medium",
        label: "Quite a lot",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "career_sponsorship_dependency_high",
        label: "Almost completely",
        reason: "your plan in the US depends almost completely on sponsorship",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "career_network_strength",
    dimensionId: "career",
    prompt: "Where do you have more people who could refer you or help you get an interview?",
    options: [
      {
        id: "career_network_strength_us",
        label: "Mostly in the US",
        reason: "most of the people who could help you find work are in the US",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "career_network_strength_balanced",
        label: "About the same",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "career_network_strength_china",
        label: "Mostly in China",
        reason: "most of the people who could help you find work are in China",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "career_work_model_fit",
    dimensionId: "career",
    prompt: "Which work culture suits you better?",
    options: [
      {
        id: "career_work_model_fit_us",
        label: "The US",
        reason: "the way people work in the US suits you better",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "career_work_model_fit_balanced",
        label: "I'd be fine with either",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "career_work_model_fit_china",
        label: "China",
        reason: "the way people work in China suits you better",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "salary_take_home_outlook",
    dimensionId: "salary_cost",
    prompt: "After rent, tax and everyday costs, where would you have more money left over?",
    options: [
      {
        id: "salary_take_home_outlook_us",
        label: "The US",
        reason: "you'd have more money left over each month in the US",
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
        reason: "you'd have more money left over each month in China",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "salary_family_pressure",
    dimensionId: "salary_cost",
    prompt: "Which option would do more to ease money pressure on you or your family?",
    options: [
      {
        id: "salary_family_pressure_us",
        label: "Staying",
        reason: "staying would do more to ease the money pressure on you or your family",
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
        reason: "going back would do more to ease the money pressure on you or your family",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "salary_savings_outlook",
    dimensionId: "salary_cost",
    prompt: "Where is it more realistic for you to save money?",
    options: [
      {
        id: "salary_savings_outlook_us",
        label: "The US",
        reason: "it's more realistic for you to save money in the US",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "salary_savings_outlook_balanced",
        label: "About the same",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "salary_savings_outlook_china",
        label: "China",
        reason: "it's more realistic for you to save money in China",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "salary_cost_tradeoff_acceptability",
    dimensionId: "salary_cost",
    prompt: "Which cost of living is easier for you to accept?",
    options: [
      {
        id: "salary_cost_tradeoff_acceptability_us",
        label: "The US",
        reason: "the cost of living in the US is easier for you to accept",
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
        label: "China",
        reason: "the cost of living in China is easier for you to accept",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "immigration_stress_level",
    dimensionId: "immigration",
    prompt: "Right now, how much does your visa situation weigh on you?",
    options: [
      {
        id: "immigration_stress_level_low",
        label: "It's manageable",
        reason: "your visa situation is manageable for you",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "immigration_stress_level_medium",
        label: "It's there, but it's not the main thing",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "immigration_stress_level_high",
        label: "It's one of the biggest things on my mind",
        reason: "your visa situation is one of the biggest things on your mind",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "immigration_timeline_tolerance",
    dimensionId: "immigration",
    prompt: "How do you feel about waiting years to feel settled in the US, with no fixed date?",
    options: [
      {
        id: "immigration_timeline_tolerance_high",
        label: "I can wait",
        reason: "you can wait years to feel settled",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "immigration_timeline_tolerance_balanced",
        label: "For a while, but not forever",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "immigration_timeline_tolerance_low",
        label: "I need something more predictable",
        reason: "you need something more predictable than that",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "immigration_dependency_risk",
    dimensionId: "immigration",
    prompt: "Are you okay with staying depending on several things working out at once, like the job, the lottery and the timing?",
    options: [
      {
        id: "immigration_dependency_risk_high_tolerance",
        label: "Yes, I can take that risk",
        reason: "you're okay with several things having to work out at once",
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
        label: "No, that's too uncertain for me",
        reason: "a plan where several things have to work out at once feels too uncertain to you",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "immigration_constraint_acceptance",
    dimensionId: "immigration",
    prompt: "How much of your life are you willing to let visa rules decide, like which job you take, which city you live in, and when you can travel?",
    options: [
      {
        id: "immigration_constraint_acceptance_high",
        label: "Quite a lot, if the path is worth it",
        reason: "you're willing to let visa rules shape a lot of your choices if the path is worth it",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "immigration_constraint_acceptance_balanced",
        label: "Some, but there's a limit",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "immigration_constraint_acceptance_low",
        label: "As little as possible",
        reason: "you don't want visa rules deciding much of your life",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "family_proximity_importance",
    dimensionId: "family_emotion",
    prompt: "Over the next three to five years, how important is it for you to be close to your family?",
    options: [
      {
        id: "family_proximity_importance_low",
        label: "Important, but it won't decide this",
        reason: "being close to family matters to you but won't decide this",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "family_proximity_importance_balanced",
        label: "Fairly important",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "family_proximity_importance_high",
        label: "Very important",
        reason: "being close to your family is very important to you over the next few years",
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
        label: "Not much",
        reason: "family responsibilities aren't pulling you back right now",
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
        reason: "family responsibilities are pulling you back to China",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "family_support_environment",
    dimensionId: "family_emotion",
    prompt: "Where are the people you'd turn to when you're having a hard time?",
    options: [
      {
        id: "family_support_environment_us",
        label: "Mostly in the US",
        reason: "the people you'd turn to in a hard time are mostly in the US",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "family_support_environment_balanced",
        label: "In both places",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "family_support_environment_china",
        label: "Mostly in China",
        reason: "the people you'd turn to in a hard time are mostly in China",
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
        label: "Not much, this is mostly my decision",
        reason: "this is mostly your own decision",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "family_expectation_constraint_balanced",
        label: "Somewhat, but I decide in the end",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "family_expectation_constraint_high",
        label: "A lot, some options aren't really open to me",
        reason: "your family's expectations rule out some options for you",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "lifestyle_daily_fit",
    dimensionId: "lifestyle",
    prompt: "Which place is closer to the everyday life you want?",
    options: [
      {
        id: "lifestyle_daily_fit_us",
        label: "The US",
        reason: "everyday life in the US is closer to what you want",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "lifestyle_daily_fit_balanced",
        label: "I could get used to either",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "lifestyle_daily_fit_china",
        label: "China",
        reason: "everyday life in China is closer to what you want",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "lifestyle_community_outlook",
    dimensionId: "lifestyle",
    prompt: "Where are you more likely to build the friendships and social life you want?",
    options: [
      {
        id: "lifestyle_community_outlook_us",
        label: "The US",
        reason: "you're more likely to build the friendships you want in the US",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "lifestyle_community_outlook_balanced",
        label: "Either",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "lifestyle_community_outlook_china",
        label: "China",
        reason: "you're more likely to build the friendships you want in China",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "lifestyle_adjustment_cost",
    dimensionId: "lifestyle",
    prompt: "Which would be the smaller change for you right now?",
    options: [
      {
        id: "lifestyle_adjustment_cost_us",
        label: "Staying",
        reason: "staying would be the smaller change for you right now",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "lifestyle_adjustment_cost_balanced",
        label: "Both would be a big change",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "lifestyle_adjustment_cost_china",
        label: "Going back",
        reason: "going back would be the smaller change for you right now",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "lifestyle_location_flexibility",
    dimensionId: "lifestyle",
    prompt: "Where do you have more freedom to choose a city and a way of living that you'd enjoy?",
    options: [
      {
        id: "lifestyle_location_flexibility_us",
        label: "The US",
        reason: "you have more freedom to choose where and how you live in the US",
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
        reason: "you have more freedom to choose where and how you live in China",
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
        reason: "you see yourself living in the US ten years from now",
        stay_us_score: 5,
        return_china_score: 1
      },
      {
        id: "long_term_location_alignment_balanced",
        label: "I don't know yet",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "long_term_location_alignment_china",
        label: "China",
        reason: "you see yourself living in China ten years from now",
        stay_us_score: 1,
        return_china_score: 5
      }
    ]
  },
  {
    id: "long_term_option_preservation",
    dimensionId: "long_term",
    prompt: "Which option keeps more doors open for you later on?",
    options: [
      {
        id: "long_term_option_preservation_us",
        label: "Staying",
        reason: "staying keeps more doors open for you later on",
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
        reason: "going back keeps more doors open for you later on",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "long_term_reentry_cost",
    dimensionId: "long_term",
    prompt: "If you change your mind later, which place would be harder to come back to?",
    options: [
      {
        id: "long_term_reentry_cost_us",
        label: "The US, if I leave now it's hard to come back",
        reason: "leaving the US now would be hard to reverse",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "long_term_reentry_cost_balanced",
        label: "About the same",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "long_term_reentry_cost_china",
        label: "China, if I leave now it's hard to come back",
        reason: "leaving China now would be hard to reverse",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  },
  {
    id: "long_term_growth_platform",
    dimensionId: "long_term",
    prompt: "In the long run, which place gives you the better base to build from?",
    options: [
      {
        id: "long_term_growth_platform_us",
        label: "The US",
        reason: "the US is the better base for you in the long run",
        stay_us_score: 4,
        return_china_score: 2
      },
      {
        id: "long_term_growth_platform_balanced",
        label: "Either could work",
        stay_us_score: 3,
        return_china_score: 3
      },
      {
        id: "long_term_growth_platform_china",
        label: "China",
        reason: "China is the better base for you in the long run",
        stay_us_score: 2,
        return_china_score: 4
      }
    ]
  }
];
