import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { providers } from "./schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const PROVIDERS = [
  {
    name: "GA4 Data API",
    slug: "google-analytics",
    logoUrl: "https://logo.clearbit.com/analytics.google.com",
    website: "https://analytics.google.com",
    description:
      "Official Google Analytics 4 Data API changelog monitoring for reporting schema changes, attribution updates, and export behavior shifts.",
    changelogUrl: "https://developers.google.com/analytics/devguides/reporting/data/v1/changelog",
    fetchCssSelector: "main, article, .devsite-article-body",
    fetchIntervalHours: 24 * 30,
  },
  {
    name: "GA4 Measurement Protocol",
    slug: "ga4-measurement-protocol",
    logoUrl: "https://logo.clearbit.com/analytics.google.com",
    website: "https://developers.google.com/analytics/devguides/collection/protocol/ga4",
    description:
      "Official GA4 Measurement Protocol changelog monitoring for event collection, payload, and validation changes that affect server-side tracking.",
    changelogUrl: "https://developers.google.com/analytics/devguides/collection/protocol/ga4/changelog",
    fetchCssSelector: "main, article, .devsite-article-body",
    fetchIntervalHours: 24 * 30,
  },
  {
    name: "Google Ads",
    slug: "google-ads",
    logoUrl: "https://logo.clearbit.com/ads.google.com",
    website: "https://developers.google.com/google-ads",
    description:
      "Official Google Ads API release-note monitoring for versions, deprecations, migration notices, and policy-sensitive changes.",
    changelogUrl: "https://developers.google.com/google-ads/api/docs/release-notes",
    fetchCssSelector: "main, article, .devsite-article-body",
    fetchIntervalHours: 24 * 30,
  },
  {
    name: "Meta Marketing API",
    slug: "meta-marketing-api",
    logoUrl: "https://logo.clearbit.com/meta.com",
    website: "https://developers.facebook.com/docs/marketing-apis",
    description:
      "Official Meta Graph and Marketing API changelog monitoring for version launches, permission changes, and breaking updates.",
    changelogUrl: "https://developers.facebook.com/docs/graph-api/changelog/",
    fetchCssSelector: "main, article, ._4cel",
    fetchIntervalHours: 24 * 30,
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
      .onConflictDoUpdate({
        target: providers.slug,
        set: {
          name: provider.name,
          logoUrl: provider.logoUrl,
          website: provider.website,
          description: provider.description,
          changelogUrl: provider.changelogUrl,
          fetchCssSelector: provider.fetchCssSelector,
          fetchIntervalHours: provider.fetchIntervalHours,
          isActive: true,
          updatedAt: new Date(),
        },
      });
    console.log(`  ✓ ${provider.name}`);
  }

  console.log(`Done! ${PROVIDERS.length} marketing API providers seeded.`);
}

seed().catch(console.error);
