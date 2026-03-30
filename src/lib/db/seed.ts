import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { providers } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const PROVIDERS = [
  {
    name: "Stripe",
    slug: "stripe",
    logoUrl: "https://logo.clearbit.com/stripe.com",
    website: "https://stripe.com",
    description:
      "Payment processing platform. Frequent API changes, versioned releases, and detailed changelogs.",
    changelogUrl: "https://stripe.com/docs/changelog",
    fetchCssSelector: "article, .changelog-entry, main",
    fetchIntervalHours: 4,
  },
  {
    name: "OpenAI",
    slug: "openai",
    logoUrl: "https://logo.clearbit.com/openai.com",
    website: "https://openai.com",
    description:
      "AI model APIs. Fast-moving with frequent model deprecations, rate limit changes, and new capabilities.",
    changelogUrl: "https://platform.openai.com/docs/changelog",
    fetchCssSelector: "main, article",
    fetchIntervalHours: 4,
  },
  {
    name: "Twilio",
    slug: "twilio",
    logoUrl: "https://logo.clearbit.com/twilio.com",
    website: "https://www.twilio.com",
    description:
      "Communication APIs for SMS, voice, and video. Complex API surface with frequent deprecations.",
    changelogUrl: "https://www.twilio.com/en-us/changelog",
    fetchCssSelector: "article, .changelog-item, main",
    fetchIntervalHours: 6,
  },
  {
    name: "Shopify",
    slug: "shopify",
    logoUrl: "https://logo.clearbit.com/shopify.com",
    website: "https://shopify.dev",
    description:
      "E-commerce platform APIs. Versioned REST and GraphQL APIs with scheduled sunset dates.",
    changelogUrl: "https://shopify.dev/changelog",
    fetchCssSelector: "article, .changelog-entry, main",
    fetchIntervalHours: 6,
  },
  {
    name: "GitHub",
    slug: "github",
    logoUrl: "https://logo.clearbit.com/github.com",
    website: "https://github.com",
    description:
      "Developer platform APIs. REST and GraphQL APIs with well-structured changelogs and OpenAPI specs.",
    changelogUrl: "https://github.blog/changelog/",
    fetchCssSelector: "article, .changelog-post, main",
    fetchIntervalHours: 4,
  },
];

async function seed() {
  console.log("Seeding providers...");

  for (const provider of PROVIDERS) {
    await db
      .insert(providers)
      .values(provider)
      .onConflictDoNothing({ target: providers.slug });
    console.log(`  ✓ ${provider.name}`);
  }

  console.log("Done! 5 providers seeded.");
}

seed().catch(console.error);
