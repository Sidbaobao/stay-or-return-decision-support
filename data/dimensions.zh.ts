import { DimensionId } from "@/types";

export const dimensionsZh: Record<DimensionId, { label: string; shortLabel: string }> = {
  career: { label: "职业机会", shortLabel: "职业" },
  salary_cost: { label: "收入与生活成本", shortLabel: "收入" },
  immigration: { label: "身份与政策不确定性", shortLabel: "政策" },
  family_emotion: { label: "家庭与情感", shortLabel: "家庭" },
  lifestyle: { label: "生活方式偏好", shortLabel: "生活" },
  long_term: { label: "长期发展", shortLabel: "长期" }
};
