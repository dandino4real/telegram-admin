import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Redirect root path (/) to /login
  if (request.nextUrl.pathname === "/") {
    console.log("Middleware - Redirecting / to /login");
    try {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    } catch (error) {
      console.error("Middleware - Error creating login URL:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    // Match only page routes, not static files
    "/((?!api|_next|static|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico|css|js)).*)",
  ],
};
