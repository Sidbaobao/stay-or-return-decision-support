import { dimensions } from "@/data/dimensions";
import { questions } from "@/data/questions";
import { QUESTIONS_VERSION } from "@/lib/questionnaire-version";
import { Answers, Weights } from "@/types";

// Share links encode the run entirely inside the URL *fragment* (#…), which
// browsers never send in HTTP requests — so a shared result reaches the
// recipient without our server (or its logs) ever seeing it. Nothing is
// stored anywhere.
//
// Layout, derived from the question and dimension sets (18 bytes today,
// base64url, ~24 chars + version prefix):
//   answer bytes    one answer per 2 bits, in canonical question order
//   weight bytes    one weight per 16 bits big-endian, in canonical dimension
//                   order, stored as per-ten-thousand shares of the total —
//                   scoring normalizes by total, so proportions carry the
//                   exact same information at ~0.005% precision.
// The questionnaire version prefixes the payload; a mismatched link renders
// an honest "made with an earlier version" state instead of misdecoding.

const BITS_PER_ANSWER = 2;
const ANSWERS_PER_BYTE = 8 / BITS_PER_ANSWER;
const OPTION_MASK = (1 << BITS_PER_ANSWER) - 1;
const MAX_OPTION_INDEX = OPTION_MASK;
const ANSWER_BYTES = Math.ceil(questions.length / ANSWERS_PER_BYTE);
const WEIGHT_BYTES = dimensions.length * 2;
const TOTAL_BYTES = ANSWER_BYTES + WEIGHT_BYTES;
const WEIGHT_SHARE_SCALE = 10_000;

function toBase64Url(bytes: Uint8Array) {
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(encoded: string): Uint8Array | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    return bytes;
  } catch {
    return null;
  }
}

// Returns the fragment payload ("v2.…") or null if the run is incomplete.
export function encodeSharePayload(answers: Answers, weights: Weights): string | null {
  const bytes = new Uint8Array(TOTAL_BYTES);

  for (let questionIndex = 0; questionIndex < questions.length; questionIndex += 1) {
    const question = questions[questionIndex];
    const optionIndex = question.options.findIndex((option) => option.id === answers[question.id]);

    // Two bits per answer: a question with more than four options would need a
    // wider layout and a new version prefix.
    if (optionIndex < 0 || optionIndex > MAX_OPTION_INDEX) {
      return null;
    }

    bytes[Math.floor(questionIndex / ANSWERS_PER_BYTE)] |=
      optionIndex << ((questionIndex % ANSWERS_PER_BYTE) * BITS_PER_ANSWER);
  }

  const totalWeight = dimensions.reduce((sum, dimension) => sum + (weights[dimension.id] ?? 0), 0);

  if (!Number.isFinite(totalWeight) || totalWeight <= 0) {
    return null;
  }

  dimensions.forEach((dimension, dimensionIndex) => {
    const share = Math.round(((weights[dimension.id] ?? 0) / totalWeight) * WEIGHT_SHARE_SCALE);
    const clamped = Math.min(Math.max(share, 0), 65_535);
    const offset = ANSWER_BYTES + dimensionIndex * 2;
    bytes[offset] = clamped >> 8;
    bytes[offset + 1] = clamped & 0xff;
  });

  return `${QUESTIONS_VERSION}.${toBase64Url(bytes)}`;
}

export type DecodedShare =
  | { status: "ok"; answers: Answers; weights: Weights }
  | { status: "version-mismatch"; linkVersion: string }
  | { status: "invalid" };

export function decodeSharePayload(payload: string): DecodedShare {
  const separatorIndex = payload.indexOf(".");

  if (separatorIndex <= 0) {
    return { status: "invalid" };
  }

  const linkVersion = payload.slice(0, separatorIndex);
  const encoded = payload.slice(separatorIndex + 1);

  if (linkVersion !== QUESTIONS_VERSION) {
    return { status: "version-mismatch", linkVersion };
  }

  const bytes = fromBase64Url(encoded);

  if (!bytes || bytes.length !== TOTAL_BYTES) {
    return { status: "invalid" };
  }

  const answers: Answers = {};

  for (let questionIndex = 0; questionIndex < questions.length; questionIndex += 1) {
    const question = questions[questionIndex];
    const optionIndex =
      (bytes[Math.floor(questionIndex / ANSWERS_PER_BYTE)] >>
        ((questionIndex % ANSWERS_PER_BYTE) * BITS_PER_ANSWER)) &
      OPTION_MASK;
    const option = question.options[optionIndex];

    if (!option) {
      return { status: "invalid" };
    }

    answers[question.id] = option.id;
  }

  const weights = {} as Weights;
  let totalShare = 0;

  dimensions.forEach((dimension, dimensionIndex) => {
    const offset = ANSWER_BYTES + dimensionIndex * 2;
    const share = (bytes[offset] << 8) | bytes[offset + 1];
    weights[dimension.id] = share;
    totalShare += share;
  });

  if (totalShare <= 0) {
    return { status: "invalid" };
  }

  return { status: "ok", answers, weights };
}

export function buildShareUrl(answers: Answers, weights: Weights): string | null {
  const payload = encodeSharePayload(answers, weights);

  if (!payload || typeof window === "undefined") {
    return null;
  }

  return `${window.location.origin}/shared#${payload}`;
}
