import { RecommendationTemplate } from "@/types";

export const reportTemplates: RecommendationTemplate[] = [
  {
    id: "stay_low",
    scenario: "stay_us",
    minDifference: 0,
    summary: "Your answers slightly lean toward staying in the US, but the result is still close. This suggests you may need a bit more reflection before treating one path as clearly better.",
    strengths: [
      "Some of your current answers point to stronger US-based opportunity or fit.",
      "Your profile suggests there may be enough upside in staying to keep exploring it seriously."
    ],
    risks: [
      "The overall margin is small, so a few changed assumptions could alter the recommendation.",
      "A close result usually means emotional or practical tradeoffs still need clarification."
    ],
    nextSteps: [
      "Review the dimensions with the smallest score gaps.",
      "Talk with 2 to 3 people who know your field in both the US and China.",
      "Update your answers after gathering more concrete information."
    ]
  },
  {
    id: "stay_medium",
    scenario: "stay_us",
    minDifference: 10,
    summary: "Your current answers and weights point to staying in the US as the stronger near-term direction. The recommendation is meaningful, though still worth pressure-testing.",
    strengths: [
      "The US appears to fit more of your current priorities.",
      "Your weighted results suggest the advantages are not limited to only one dimension."
    ],
    risks: [
      "Immigration and long-term uncertainty may still deserve extra attention.",
      "A strong short-term fit does not automatically guarantee the best long-term fit."
    ],
    nextSteps: [
      "Identify the top 2 practical risks to staying in the US.",
      "Build a concrete 6 to 12 month action plan for the stay option.",
      "Keep a return-to-China backup plan so your choice stays flexible."
    ]
  },
  {
    id: "stay_high",
    scenario: "stay_us",
    minDifference: 26,
    summary: "Your current answers strongly favor staying in the US. Based on this reflection, that path appears much more aligned with your priorities right now.",
    strengths: [
      "The US path is outperforming across several areas that matter to you.",
      "Your answers suggest you can accept the tradeoffs of staying more comfortably than the tradeoffs of returning."
    ],
    risks: [
      "Even a strong result should still be checked against changing job and immigration realities.",
      "Emotional or family needs may still become more important later."
    ],
    nextSteps: [
      "Focus on execution rather than endless re-deciding.",
      "List the 3 milestones that would make staying feel sustainable.",
      "Schedule a future review point in case your circumstances change."
    ]
  },
  {
    id: "return_low",
    scenario: "return_china",
    minDifference: 0,
    summary: "Your answers slightly lean toward returning to China, but the result is still close. That usually means the decision is still open and worth exploring carefully.",
    strengths: [
      "Several of your current priorities may be easier to satisfy by returning.",
      "You may feel that practical or emotional stability is stronger in China."
    ],
    risks: [
      "The margin is narrow, so the recommendation should not be treated as final.",
      "A few changes in assumptions about career or lifestyle could change the outcome."
    ],
    nextSteps: [
      "Recheck the dimensions that produced the smallest differences.",
      "Gather more realistic information about your return path.",
      "Compare one concrete US plan against one concrete China plan."
    ]
  },
  {
    id: "return_medium",
    scenario: "return_china",
    minDifference: 10,
    summary: "Your current answers and weights point to returning to China as the stronger direction. The result suggests that option may better match your priorities at this stage.",
    strengths: [
      "Returning appears to fit several of your most important needs.",
      "Your answers suggest the tradeoffs of going back may be more acceptable than the tradeoffs of staying."
    ],
    risks: [
      "A stronger emotional fit should still be checked against long-term professional goals.",
      "You may want to confirm that your return plan is based on real options rather than only pressure relief."
    ],
    nextSteps: [
      "Clarify what a strong return plan would actually look like.",
      "Test your assumptions with people already working in China.",
      "Write down what you would be giving up by leaving the US."
    ]
  },
  {
    id: "return_high",
    scenario: "return_china",
    minDifference: 26,
    summary: "Your current answers strongly favor returning to China. Based on this reflection, that path appears much more aligned with your priorities right now.",
    strengths: [
      "Returning is winning clearly across multiple areas that matter to you.",
      "Your answers suggest the stability or fit of returning is more compelling than the benefits of staying."
    ],
    risks: [
      "A strong result is still not a guarantee that every part of the return path will feel easy.",
      "You should still confirm job-market and lifestyle assumptions with current information."
    ],
    nextSteps: [
      "Turn the return option into a concrete action plan.",
      "List your top priorities for the first year after returning.",
      "Keep a record of the reasons behind this choice so you can revisit it calmly later."
    ]
  }
];

export const reportDisclaimer =
  "This is a decision-support tool, not legal, immigration, or financial advice. Treat your results as structured reflection, not a final verdict.";
