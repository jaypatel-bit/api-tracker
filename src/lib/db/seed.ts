import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { providers } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const PROVIDERS = [
  {
    name: "Google Analytics",
    slug: "google-analytics",
    logoUrl: "https://logo.clearbit.com/analytics.google.com",
    website: "https://analytics.google.com",
    description:
      "GA4 and Analytics Admin APIs. Monitor reporting schema changes, attribution updates, and export behavior shifts that affect dashboards and client reporting.",
    changelogUrl: "https://developers.google.com/analytics/devguides/reporting/data/v1/changelog",
    fetchCssSelector: "main, article, .devsite-article-body",
    fetchIntervalHours: 4,
  },
  {
    name: "Google Ads",
    slug: "google-ads",
    logoUrl: "https://logo.clearbit.com/ads.google.com",
    website: "https://developers.google.com/google-ads",
    description:
      "Google Ads API versions, deprecations, and policy-sensitive changes. Built for campaign automation, reporting pipelines, and bid-management tooling.",
    changelogUrl: "https://developers.google.com/google-ads/api/docs/release-notes",
    fetchCssSelector: "main, article, .devsite-article-body",
    fetchIntervalHours: 4,
  },
  {
    name: "Meta Marketing API",
    slug: "meta-marketing-api",
    logoUrl: "https://logo.clearbit.com/meta.com",
    website: "https://developers.facebook.com/docs/marketing-apis",
    description:
      "Monitor Meta Ads and marketing endpoints for version launches, permission changes, webhook adjustments, and business verification requirements.",
    changelogUrl: "https://developers.facebook.com/docs/graph-api/changelog/",
    fetchCssSelector: "main, article, ._4cel",
    fetchIntervalHours: 4,
  },
  {
    name: "Looker Studio",
    slug: "looker-studio",
    logoUrl: "https://logo.clearbit.com/lookerstudio.google.com",
    website: "https://developers.google.com/looker-studio",
    description:
      "Watch connector and reporting ecosystem changes that can affect downstream marketing dashboards and stakeholder-facing data products.",
    changelogUrl: "https://developers.google.com/looker-studio/whats-new",
    fetchCssSelector: "main, article, .devsite-article-body",
    fetchIntervalHours: 6,
  },
  {
    name: "LinkedIn Marketing Developer Platform",
    slug: "linkedin-marketing",
    logoUrl: "https://logo.clearbit.com/linkedin.com",
    website: "https://learn.microsoft.com/linkedin/marketing/",
    description:
      "Cover adjacent paid-media surfaces with versioning, schema, and permissions changes that ripple into campaign management workflows.",
    changelogUrl: "https://learn.microsoft.com/linkedin/marketing/integrations/recent-changes",
    fetchCssSelector: "main, article",
    fetchIntervalHours: 8,
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

  console.log("Done! 5 marketing API providers seeded.");
}

seed().catch(console.error);
