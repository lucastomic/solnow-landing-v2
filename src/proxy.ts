import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale } from "@/i18n/config";
import { EN_REDIRECTS, EN_REWRITES } from "@/content/guides";

function pickLocale(request: NextRequest): string {
  const header = request.headers.get("accept-language")?.toLowerCase() ?? "";
  // Lightweight negotiation: first matching supported locale wins, else default.
  for (const tag of header.split(",")) {
    const code = tag.trim().slice(0, 2);
    if ((locales as readonly string[]).includes(code)) return code;
  }
  return defaultLocale;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // English slug canonicalization (SEO). Only guide roots directly under /en/
  // are affected: `/en/<segment>` with no deeper path.
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 2 && parts[0] === "en") {
    const seg = parts[1];
    // Old Spanish-slug URL (or a consolidated page) → 301 to the English slug.
    const redirectTo = EN_REDIRECTS[seg];
    if (redirectTo) {
      request.nextUrl.pathname = `/en/${redirectTo}`;
      return NextResponse.redirect(request.nextUrl, 301);
    }
    // Pretty English slug → internally rewrite to the physical folder route.
    const rewriteTo = EN_REWRITES[seg];
    if (rewriteTo) {
      request.nextUrl.pathname = `/en/${rewriteTo}`;
      return NextResponse.rewrite(request.nextUrl);
    }
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return;

  const locale = pickLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|robots.txt|sitemap.xml|manifest.webmanifest|opengraph-image|assets|logos|hollow_logo_name_color.png|.*\\..*).*)",
  ],
};
