import { NextResponse } from "next/server";

const LANG_PREFIX = /^\/(?:fr|ar)(?:\/|$)/;

export function middleware(request) {
  const pathname = request.nextUrl.pathname.replace(/\/{2,}/g, "/");

  if (pathname === "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/fr";
    return NextResponse.redirect(url);
  }

  if (LANG_PREFIX.test(pathname) || pathname.includes(".")) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/fr${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
