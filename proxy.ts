// proxy.ts
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// In v16, we export a named function called 'proxy'
// or use a default export. NextAuth v5's auth() wrapper
// is still the recommended way to handle this.
const { auth } = NextAuth(authConfig);

export const proxy = auth((req) => {});
