import { NextRequest, NextResponse } from "next/server";
import { recoverRoute } from "@/lib/routes";

// Turns a damaged link (see lib/routes.ts) into the page it meant, with a
// permanent redirect. A share link's #fragment never reaches the server
// and browsers carry it over to the redirect target, so shared results
// survive the trip; one an app folded into the path is put back in the
// Location header. Canonical requests pass straight through.
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const recovered = recoverRoute(pathname);

  if (recovered === null || (recovered.pathname === pathname && !recovered.hash && !recovered.search)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  url.pathname = recovered.pathname;

  if (recovered.search) {
    url.search = recovered.search;
  }

  if (recovered.hash) {
    url.hash = recovered.hash;
  }

  return NextResponse.redirect(url, 308);
}

export const config = {
  // Pages only: never the API route, Next's own files, or the videos and
  // posters served from public/.
  matcher: ["/((?!api/|_next/|favicon\\.ico$|.*\\.(?:mp4|webm|jpg|jpeg|png|svg|webp|ico|woff2?|txt|xml|json)$).*)"]
};
