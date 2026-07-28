import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { locales, defaultLocale, isLocale } from "@/i18n/config";
import { EN_REDIRECTS, EN_REWRITES } from "@/content/guides";
import {
  LEGACY_SLUGS,
  PRODUCT_BASE,
  productBySlug,
  productHubPath,
  productPath,
} from "@/content/products";

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

  // Producto: cada idioma tiene su propia carpeta (`/es/producto`,
  // `/en/product`) y sus propios slugs, así que la carpeta del otro idioma
  // no existe bajo este locale. En vez de un 404, se redirige 301 a la URL
  // equivalente en el idioma correcto — sin crear contenido duplicado.
  if ((parts.length === 2 || parts.length === 3) && isLocale(parts[0])) {
    const locale = parts[0];

    // Carpeta del otro idioma bajo este locale.
    const foreign = locales.find(
      (l) => l !== locale && PRODUCT_BASE[l] === parts[1]
    );
    if (foreign) {
      const slug = parts[2];
      const area = slug
        ? (productBySlug(slug, foreign) ?? productBySlug(slug, locale))
        : undefined;
      const legacy = slug && !area ? LEGACY_SLUGS[slug] : undefined;
      request.nextUrl.pathname = area
        ? productPath(area.key, locale)
        : legacy
          ? productPath(legacy, locale)
          : productHubPath(locale);
      return NextResponse.redirect(request.nextUrl, 301);
    }

    // Carpeta correcta pero slug de la estructura anterior.
    if (parts[1] === PRODUCT_BASE[locale] && parts[2]) {
      const legacy = LEGACY_SLUGS[parts[2]];
      if (legacy && !productBySlug(parts[2], locale)) {
        request.nextUrl.pathname = productPath(legacy, locale);
        return NextResponse.redirect(request.nextUrl, 301);
      }
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
    "/((?!_next/static|_next/image|favicon.ico|icon|apple-icon|robots.txt|sitemap.xml|manifest.webmanifest|opengraph-image|assets|logos|hollow_logo_name_color.webp|.*\\..*).*)",
  ],
};
