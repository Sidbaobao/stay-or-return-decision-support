import { useMemo } from "react";
import { dimensions } from "@/data/dimensions";
import { dimensionsZh } from "@/data/dimensions.zh";
import { questions } from "@/data/questions";
import { questionsZh } from "@/data/questions.zh";
import { Locale } from "@/lib/i18n";
import { useLocale } from "@/lib/i18n/provider";
import { Dimension, DimensionId, Question } from "@/types";

// The English data files stay canonical: ids, scores and order live there
// and the scoring engine reads them directly. A locale only swaps the words.

function localizeQuestions(): Question[] {
  return questions.map((question) => {
    const translation = questionsZh[question.id];

    if (!translation) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(`No Chinese copy for question ${question.id}, showing English.`);
      }

      return question;
    }

    return {
      ...question,
      prompt: translation.prompt,
      options: question.options.map((option) => ({
        ...option,
        label: translation.options[option.id] ?? option.label
      }))
    };
  });
}

const localizedQuestions: Record<Locale, Question[]> = {
  en: questions,
  zh: localizeQuestions()
};

const localizedDimensions: Record<Locale, Dimension[]> = {
  en: dimensions,
  zh: dimensions.map((dimension) => ({ ...dimension, ...dimensionsZh[dimension.id] }))
};

export function getQuestions(locale: Locale) {
  return localizedQuestions[locale];
}

export function getDimensions(locale: Locale) {
  return localizedDimensions[locale];
}

export function getDimensionLabel(locale: Locale, dimensionId: DimensionId | string) {
  return localizedDimensions[locale].find((dimension) => dimension.id === dimensionId)?.label ?? dimensionId;
}

export function useContent() {
  const { locale } = useLocale();

  return useMemo(
    () => ({
      locale,
      questions: getQuestions(locale),
      dimensions: getDimensions(locale),
      dimensionLabel: (dimensionId: DimensionId | string) => getDimensionLabel(locale, dimensionId)
    }),
    [locale]
  );
}
