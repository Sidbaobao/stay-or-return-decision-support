// Bumped whenever the question set changes in a way that invalidates stored
// answers. Lives on its own so the share codec and the storage modules can
// both read it without importing each other.
export const QUESTIONS_VERSION = "v3";
