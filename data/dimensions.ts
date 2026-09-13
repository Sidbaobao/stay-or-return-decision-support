import { Dimension, DimensionId, Weights } from "@/types";

export const dimensions: Dimension[] = [
  {
    id: "career",
    label: "Career Opportunity",
    shortLabel: "Career"
  },
  {
    id: "salary_cost",
    label: "Salary and Cost of Living",
    shortLabel: "Money"
  },
  {
    id: "immigration",
    label: "Immigration and Policy Uncertainty",
    shortLabel: "Policy"
  },
  {
    id: "family_emotion",
    label: "Family and Emotional Factors",
    shortLabel: "Family"
  },
  {
    id: "lifestyle",
    label: "Lifestyle Preference",
    shortLabel: "Lifestyle"
  },
  {
    id: "long_term",
    label: "Long-Term Development",
    shortLabel: "Long-Term"
  }
];

export const defaultWeights: Weights = dimensions.reduce((accumulator, dimension) => {
  accumulator[dimension.id as DimensionId] = 3;
  return accumulator;
}, {} as Weights);
