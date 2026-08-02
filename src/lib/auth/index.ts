import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/lib/db";
import * as schema from "@/lib/db/schema";

function getOrigin(value: string | undefined) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function getHost(value: string | undefined) {
  if (!value) return null;

  try {
    return new URL(value).host;
  } catch {
    return null;
  }
}

const fallbackBaseUrl =
  process.env.BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ||
  "http://localhost:3000";

const trustedOrigins = Array.from(
  new Set(
    [
      getOrigin(process.env.BETTER_AUTH_URL),
      getOrigin(process.env.NEXT_PUBLIC_BETTER_AUTH_URL),
      getOrigin(process.env.NEXT_PUBLIC_APP_URL),
      getOrigin(fallbackBaseUrl),
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ].filter((value): value is string => Boolean(value)),
  ),
);

const allowedHosts = Array.from(
  new Set(
    [
      getHost(process.env.BETTER_AUTH_URL),
      getHost(process.env.NEXT_PUBLIC_BETTER_AUTH_URL),
      getHost(process.env.NEXT_PUBLIC_APP_URL),
      getHost(fallbackBaseUrl),
      process.env.VERCEL_URL,
      "localhost:3000",
      "127.0.0.1:3000",
      "*.vercel.app",
    ].filter((value): value is string => Boolean(value)),
  ),
);

export const auth = betterAuth({
  baseURL: {
    protocol: "auto",
    allowedHosts,
    fallback: fallbackBaseUrl,
  },
  trustedOrigins,
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
