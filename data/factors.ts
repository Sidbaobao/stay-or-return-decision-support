// The things this decision actually turns on, in the words people use, each
// pointing at the question that asks about it. The home page floats them in
// three rows of type: `weight` 3 is a big serif word in its part's hue,
// 2 a semibold word, 1 a small quiet one. A word leads straight to its
// question. Ids and question ids are canonical here; data/factors.zh.ts
// carries the Chinese words.

export type FactorWeight = 1 | 2 | 3;

export type Factor = {
  id: string;
  questionId: string;
  label: string;
  weight: FactorWeight;
};

export const factorRows: Factor[][] = [
  [
    { id: "h1b", questionId: "immigration_dependency_risk", label: "The H-1B lottery", weight: 3 },
    { id: "rent", questionId: "salary_take_home_outlook", label: "Rent", weight: 2 },
    { id: "parents_age", questionId: "family_proximity_importance", label: "Your parents getting older", weight: 1 },
    { id: "referrals", questionId: "career_network_strength", label: "Referrals", weight: 2 },
    { id: "ten_years", questionId: "long_term_location_alignment", label: "Where you live in ten years", weight: 3 },
    { id: "friends", questionId: "lifestyle_community_outlook", label: "Friends", weight: 1 },
    { id: "green_card", questionId: "immigration_timeline_tolerance", label: "The green card wait", weight: 2 },
    { id: "exchange_rate", questionId: "salary_cost_tradeoff_acceptability", label: "The exchange rate", weight: 1 },
    { id: "996", questionId: "career_work_model_fit", label: "996", weight: 3 },
    { id: "visa_stress", questionId: "immigration_stress_level", label: "Visa stress", weight: 2 }
  ],
  [
    { id: "savings", questionId: "salary_savings_outlook", label: "Savings", weight: 2 },
    { id: "opt", questionId: "immigration_timeline_tolerance", label: "OPT running out", weight: 3 },
    { id: "time_zone", questionId: "family_support_environment", label: "The time difference", weight: 1 },
    { id: "layoffs", questionId: "career_sponsorship_dependency", label: "Layoffs", weight: 2 },
    { id: "family_needs", questionId: "family_responsibility_pull", label: "Family needing you", weight: 3 },
    { id: "no_way_back", questionId: "long_term_reentry_cost", label: "Not being able to come back", weight: 1 },
    { id: "take_home", questionId: "salary_take_home_outlook", label: "Take-home pay", weight: 2 },
    { id: "health_insurance", questionId: "lifestyle_daily_fit", label: "Health insurance", weight: 1 },
    { id: "job_wanted", questionId: "career_job_access", label: "The job you actually want", weight: 3 },
    { id: "starting_over", questionId: "lifestyle_adjustment_cost", label: "Starting over", weight: 2 }
  ],
  [
    { id: "sponsorship", questionId: "career_sponsorship_dependency", label: "Visa sponsorship", weight: 2 },
    { id: "holidays", questionId: "family_proximity_importance", label: "Chinese New Year at home", weight: 3 },
    { id: "cost_of_living", questionId: "salary_cost_tradeoff_acceptability", label: "Cost of living", weight: 1 },
    { id: "options_later", questionId: "long_term_option_preservation", label: "Room to change your mind", weight: 2 },
    { id: "city", questionId: "lifestyle_location_flexibility", label: "A city you like", weight: 1 },
    { id: "visa_rules", questionId: "immigration_constraint_acceptance", label: "Visa rules deciding for you", weight: 3 },
    { id: "bad_days", questionId: "family_support_environment", label: "Who to call on a bad day", weight: 2 },
    { id: "family_expectations", questionId: "family_expectation_constraint", label: "What your family expects", weight: 1 },
    { id: "money_pressure", questionId: "salary_family_pressure", label: "Money pressure at home", weight: 3 },
    { id: "growth", questionId: "long_term_growth_platform", label: "Where you grow fastest", weight: 2 }
  ]
];
