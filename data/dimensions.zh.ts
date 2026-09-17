import { DimensionId } from "@/types";

export const dimensionsZh: Record<DimensionId, { label: string; shortLabel: string; phrase: string }> = {
  career: { label: "工作", shortLabel: "工作", phrase: "工作" },
  salary_cost: { label: "钱", shortLabel: "钱", phrase: "钱" },
  immigration: { label: "签证", shortLabel: "签证", phrase: "签证" },
  family_emotion: { label: "家人", shortLabel: "家人", phrase: "家人" },
  lifestyle: { label: "日常生活", shortLabel: "日子", phrase: "日子" },
  long_term: { label: "十年后", shortLabel: "十年", phrase: "十年后的路" }
};
