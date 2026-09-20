// The things this decision actually turns on, in the words people use, each
// pointing at the question that asks about it. The home page floats them in
// three rows; a chip leads straight to its question. Ids and question ids
// are canonical here; data/factors.zh.ts carries the Chinese words.

export type Factor = {
  id: string;
  questionId: string;
  label: string;
};

export const factorRows: Factor[][] = [
  [
    { id: "h1b", questionId: "immigration_dependency_risk", label: "The H-1B lottery" },
    { id: "rent", questionId: "salary_take_home_outlook", label: "Rent" },
    { id: "parents_age", questionId: "family_proximity_importance", label: "Your parents getting older" },
    { id: "referrals", questionId: "career_network_strength", label: "Referrals" },
    { id: "ten_years", questionId: "long_term_location_alignment", label: "Where you live in ten years" },
    { id: "friends", questionId: "lifestyle_community_outlook", label: "Friends" },
    { id: "green_card", questionId: "immigration_timeline_tolerance", label: "The green card wait" },
    { id: "exchange_rate", questionId: "salary_cost_tradeoff_acceptability", label: "The exchange rate" },
    { id: "996", questionId: "career_work_model_fit", label: "996" },
    { id: "visa_stress", questionId: "immigration_stress_level", label: "Visa stress" }
  ],
  [
    { id: "savings", questionId: "salary_savings_outlook", label: "Savings" },
    { id: "opt", questionId: "immigration_timeline_tolerance", label: "OPT running out" },
    { id: "time_zone", questionId: "family_support_environment", label: "The time difference" },
    { id: "layoffs", questionId: "career_sponsorship_dependency", label: "Layoffs" },
    { id: "family_needs", questionId: "family_responsibility_pull", label: "Family needing you" },
    { id: "no_way_back", questionId: "long_term_reentry_cost", label: "Not being able to come back" },
    { id: "take_home", questionId: "salary_take_home_outlook", label: "Take-home pay" },
    { id: "health_insurance", questionId: "lifestyle_daily_fit", label: "Health insurance" },
    { id: "job_wanted", questionId: "career_job_access", label: "The job you actually want" },
    { id: "starting_over", questionId: "lifestyle_adjustment_cost", label: "Starting over" }
  ],
  [
    { id: "sponsorship", questionId: "career_sponsorship_dependency", label: "Visa sponsorship" },
    { id: "holidays", questionId: "family_proximity_importance", label: "Chinese New Year at home" },
    { id: "cost_of_living", questionId: "salary_cost_tradeoff_acceptability", label: "Cost of living" },
    { id: "options_later", questionId: "long_term_option_preservation", label: "Room to change your mind" },
    { id: "city", questionId: "lifestyle_location_flexibility", label: "A city you like" },
    { id: "visa_rules", questionId: "immigration_constraint_acceptance", label: "Visa rules deciding for you" },
    { id: "bad_days", questionId: "family_support_environment", label: "Who to call on a bad day" },
    { id: "family_expectations", questionId: "family_expectation_constraint", label: "What your family expects" },
    { id: "money_pressure", questionId: "salary_family_pressure", label: "Money pressure at home" },
    { id: "growth", questionId: "long_term_growth_platform", label: "Where you grow fastest" }
  ]
];
