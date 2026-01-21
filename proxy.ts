// proxy.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// In v16, we export a named function called 'proxy'
// or use a default export. NextAuth v5's auth() wrapper
// is still the recommended way to handle this.
const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {
  // Your logic remains largely the same, but 'proxy' is now
  // the expected execution context.
  const isLoggedIn = !!req.auth;
  const { nextUrl } = req;

  // Example: Redirect logic can live here
  if (!isLoggedIn && nextUrl.pathname.startsWith("/")) {
    return Response.redirect(new URL("/sign-in", nextUrl));
  }
});

export const config = {
  // Matcher syntax remains identical to middleware
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
