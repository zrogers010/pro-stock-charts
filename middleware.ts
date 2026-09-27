import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") || "";

  // Redirect www to apex domain
  if (host.startsWith("www.")) {
    const apexDomain = host.replace(/^www\./, "");
    const redirectUrl = new URL(request.url);
    redirectUrl.host = apexDomain;
    
    return NextResponse.redirect(redirectUrl, {
      status: 308, // Permanent redirect that preserves HTTP method
      headers: {
        "Strict-Transport-Security": "max-age=63072000; includeSubDomains; preload",
      },
    });
  }

  // Add HSTS header to all HTTPS responses
  const response = NextResponse.next();
  
  // Only add HSTS on HTTPS (check x-forwarded-proto for proxied requests)
  const protocol = request.headers.get("x-forwarded-proto") || "";
  const isHttps = protocol === "https" || request.url.startsWith("https://");
  
  if (isHttps) {
    response.headers.set(
      "Strict-Transport-Security",
      "max-age=63072000; includeSubDomains; preload"
    );
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
