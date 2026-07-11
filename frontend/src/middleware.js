import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // Already has a lang prefix (/fr/*, /ar/*) or is a static file
  if (pathname.startsWith("/fr") || pathname.startsWith("/ar") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // Redirect root to /fr
  const url = request.nextUrl.clone();
  url.pathname = `/fr${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
