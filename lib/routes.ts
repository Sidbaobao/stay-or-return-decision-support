// Every page the site serves, and how to recover one from a damaged link.
//
// A link pasted into a chat often arrives with something stuck to it: a
// full stop or a full-width 。 from the sentence around it, an emoji, an
// invisible zero-width character from a keyboard or a copy, a capital
// letter, a share link's # folded into the path by an app, an old path
// someone remembered, or the whole address pasted twice so that our own
// domain turns up inside the path. Rather than a 404, the middleware
// sends such a request to the page the sender meant. Nothing here reads
// or stores anything.

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

// Invisible characters: zero-width spaces and joiners, direction marks,
// the byte-order mark. They ride along inside copied text.
const FORMAT_CHARACTERS = /\p{Cf}/gu;

// Our paths are letters and slashes. Anything else at either end (any
// punctuation, symbol, emoji, space or slash, in any script) is not part
// of the address the sender meant.
const LEADING_JUNK = /^[^\p{L}\p{N}]+/u;
const TRAILING_JUNK = /[^\p{L}\p{N}]+$/u;

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// "stayorreturn.com/https://stayorreturn.com/questionnaire": the address
// was pasted twice, or typed after a bare domain. Whatever follows the
// last mention of our own host is the path that was meant. Other hosts
// are left alone; we cannot know what they meant.
function stripEmbeddedSelf(path: string, hostname: string) {
  if (!hostname) {
    return path;
  }

  const ownHost = new RegExp(
    `(?:^|[/:@])(?:www\\.)?${escapeRegExp(hostname)}(?::\\d+)?\\.?(?=[/?#]|$)`,
    "giu"
  );
  let lastEnd = -1;

  for (const match of path.matchAll(ownHost)) {
    lastEnd = match.index + match[0].length;
  }

  return lastEnd === -1 ? path : path.slice(lastEnd);
}

export type RecoveredRoute = {
  pathname: string;
  // A share link's payload, when an app encoded the # into the path.
  hash: string;
  // A query that was encoded into the path, kept for /profile/run?id=.
  search: string;
};

// The page a request path most plausibly meant, or null when it is not one
// of ours. Returns the canonical path unchanged when it already is one.
// `hostname` is the site's own host, for links that contain the site's
// address a second time.
export function recoverRoute(rawPathname: string, hostname = ""): RecoveredRoute | null {
  let path = rawPathname;

  try {
    path = decodeURIComponent(path);
  } catch {
    // Malformed escapes: judge the raw path instead.
  }

  path = stripEmbeddedSelf(path.replace(FORMAT_CHARACTERS, ""), hostname);

  // "#" and "?" cannot reach the server inside a real path, so their
  // presence here means an app percent-encoded them. Peel them back off.
  let hash = "";
  let search = "";
  const hashIndex = path.indexOf("#");

  if (hashIndex !== -1) {
    hash = path.slice(hashIndex);
    path = path.slice(0, hashIndex);
  }

  const queryIndex = path.indexOf("?");

  if (queryIndex !== -1) {
    search = path.slice(queryIndex);
    path = path.slice(0, queryIndex);
  }

  path = `/${path.replace(LEADING_JUNK, "").replace(TRAILING_JUNK, "")}`
    .replace(/\/{2,}/g, "/")
    .toLowerCase();

  path = ALIASES[path] ?? path;

  if (!(KNOWN_ROUTES as readonly string[]).includes(path)) {
    return null;
  }

  return { pathname: path, hash, search };
}
