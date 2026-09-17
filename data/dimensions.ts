import { Dimension, DimensionId, Weights } from "@/types";

// The six parts of the decision, named the way a person names them.
// `label` heads a section or a row; `shortLabel` fits a bubble on a phone
// (one word); `phrase` sits inside a sentence.
export const dimensions: Dimension[] = [
  {
    id: "career",
    label: "Work",
    shortLabel: "Work",
    phrase: "work"
  },
  {
    id: "salary_cost",
    label: "Money",
    shortLabel: "Money",
    phrase: "money"
  },
  {
    id: "immigration",
    label: "Visa",
    shortLabel: "Visa",
    phrase: "the visa situation"
  },
  {
    id: "family_emotion",
    label: "Family",
    shortLabel: "Family",
    phrase: "family"
  },
  {
    id: "lifestyle",
    label: "Daily life",
    shortLabel: "Life",
    phrase: "daily life"
  },
  {
    id: "long_term",
    label: "Ten years out",
    shortLabel: "Future",
    phrase: "the next ten years"
  }
];

export const defaultWeights: Weights = dimensions.reduce((accumulator, dimension) => {
  accumulator[dimension.id as DimensionId] = 3;
  return accumulator;
}, {} as Weights);
