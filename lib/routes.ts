// Every page the site serves, and how to recover one from a damaged link.
//
// A link pasted into a chat often arrives with something stuck to it: a
// full stop or a full-width 。 from the sentence around it, a capital
// letter from a phone keyboard, an old path someone remembered. Rather
// than a 404, the middleware sends such a request to the page the sender
// meant. Nothing here reads or stores anything.

export const KNOWN_ROUTES = [
  "/",
  "/questionnaire",
  "/weights",
  "/results",
  "/report",
  "/shared",
  "/profile",
  "/profile/run"
] as const;

const ALIASES: Record<string, string> = {
  "/home": "/",
  "/index": "/",
  "/index.html": "/",
  "/index.htm": "/",
  "/zh": "/",
  "/zh-cn": "/",
  "/cn": "/",
  "/en": "/",
  "/question": "/questionnaire",
  "/questions": "/questionnaire",
  "/quiz": "/questionnaire",
  "/survey": "/questionnaire",
  "/start": "/questionnaire",
  "/weight": "/weights",
  "/priorities": "/weights",
  "/result": "/results",
  "/memo": "/report",
  "/reports": "/report",
  "/share": "/shared",
  "/me": "/profile",
  "/history": "/profile"
};

// Punctuation and spacing that chat apps and keyboards tack onto the end of
// a link: ASCII and full-width stops, commas, brackets, quotes, an ellipsis.
const TRAILING_JUNK =
  /[\s/.,;:!?'"`)\]}>。，、；：！？）】》」』”’…·・]+$/u;

// The page a request path most plausibly meant, or null when it is not one
// of ours. Returns the path unchanged when it is already canonical.
export function canonicalizePath(pathname: string): string | null {
  let path = pathname;

  try {
    path = decodeURIComponent(path);
  } catch {
    // Malformed escapes: judge the raw path instead.
  }

  path = path.replace(/\/{2,}/g, "/").replace(TRAILING_JUNK, "").toLowerCase();

  if (path === "") {
    path = "/";
  }

  path = ALIASES[path] ?? path;

  return (KNOWN_ROUTES as readonly string[]).includes(path) ? path : null;
}
