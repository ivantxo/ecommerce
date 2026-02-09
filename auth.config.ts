import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
  providers: [],
  callbacks: {
    authorized({ request, auth }) {
      // Array of reg exp patterns of paths we want to protect
      const protectedPaths = [
        /\/shipping-address/,
        /\/payment-method/,
        /\/place-order/,
        /\/profile/,
        /\/user\/(.*)/,
        /\/order\/(.*)/,
        /\/admin/,
      ];

      // Get pathname from request URL object
      const { pathname } = request.nextUrl;

      // Check if user is not authenticated and accessing a protected path
      if (!auth && protectedPaths.some((p) => p.test(pathname))) {
        // Redirect to sign-in with callback URL
        return NextResponse.redirect(
          new URL(`/sign-in?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
        );
      }

      // Check for session cart cookie
      if (!request.cookies.get("sessionCartId")) {
        // Generate new session cart id cookie
        const sessionCartId = crypto.randomUUID();

        // Create new response and add the new headers
        const response = NextResponse.next({
          request: {
            headers: new Headers(request.headers),
          },
        });

        // Set newly generation sessionCartId in the response cookies
        response.cookies.set("sessionCartId", sessionCartId);

        return response;
      } else {
        return true;
      }
    },
  },
} satisfies NextAuthConfig;
