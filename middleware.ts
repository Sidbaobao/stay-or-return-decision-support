import { NextRequest, NextResponse } from "next/server";
import { canonicalizePath } from "@/lib/routes";

// Turns a slightly damaged link (see lib/routes.ts) into the page it meant,
// with a permanent redirect. A share link's #fragment never reaches the
// server, and browsers carry it over to the redirect target, so shared
// results survive the trip. Canonical requests pass straight through.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const canonical = canonicalizePath(pathname);

  if (canonical === null || canonical === pathname) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  url.pathname = canonical;

  return NextResponse.redirect(url, 308);
}

export const config = {
  // Pages only: never the API route, Next's own files, or the videos and
  // posters served from public/.
  matcher: ["/((?!api/|_next/|favicon\\.ico$|.*\\.(?:mp4|webm|jpg|jpeg|png|svg|webp|ico|woff2?|txt|xml|json)$).*)"]
};
