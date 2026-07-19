import {
  Briefcase,
  HeartHandshake,
  Scale,
  Sprout,
  Stamp,
  Sun,
  type LucideIcon
} from "lucide-react";
import { DimensionId } from "@/types";

export const dimensionIcons: Record<DimensionId, LucideIcon> = {
  career: Briefcase,
  salary_cost: Scale,
  immigration: Stamp,
  family_emotion: HeartHandshake,
  lifestyle: Sun,
  long_term: Sprout
};
