import type { Card, ChangeEvent, Provider } from "@/lib/db/schema";

export function isDemoMode() {
  return !process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET;
}

export const demoSession = {
  session: {
    id: "demo-session",
    userId: "demo-user",
    expiresAt: new Date("2026-12-31T23:59:59.000Z"),
    token: "demo-token",
    createdAt: new Date("2026-08-02T00:00:00.000Z"),
    updatedAt: new Date("2026-08-02T00:00:00.000Z"),
  },
  user: {
    id: "demo-user",
    name: "Demo User",
    email: "demo@apiradar.dev",
    emailVerified: true,
    image: null,
    createdAt: new Date("2026-08-02T00:00:00.000Z"),
    updatedAt: new Date("2026-08-02T00:00:00.000Z"),
  },
};

export const demoProviders: Provider[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    name: "Google Analytics",
    slug: "google-analytics",
    logoUrl: "https://logo.clearbit.com/analytics.google.com",
    website: "https://analytics.google.com",
    description:
      "GA4 and Analytics Admin APIs. Monitor reporting schema changes, attribution updates, and export behavior shifts.",
    changelogUrl:
      "https://developers.google.com/analytics/devguides/reporting/data/v1/changelog",
    fetchCssSelector: "main, article, .devsite-article-body",
    fetchIntervalHours: 4,
    lastFetchedAt: new Date("2026-08-02T09:10:00.000Z"),
    isActive: true,
    createdAt: new Date("2026-08-02T00:00:00.000Z"),
    updatedAt: new Date("2026-08-02T00:00:00.000Z"),
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    name: "Google Ads",
    slug: "google-ads",
    logoUrl: "https://logo.clearbit.com/ads.google.com",
    website: "https://developers.google.com/google-ads",
    description:
      "Version sunsets, policy-sensitive changes, and migration notices for paid media workflows.",
    changelogUrl: "https://developers.google.com/google-ads/api/docs/release-notes",
    fetchCssSelector: "main, article, .devsite-article-body",
    fetchIntervalHours: 4,
    lastFetchedAt: new Date("2026-08-02T08:40:00.000Z"),
    isActive: true,
    createdAt: new Date("2026-08-02T00:00:00.000Z"),
    updatedAt: new Date("2026-08-02T00:00:00.000Z"),
  },
  {
    id: "33333333-3333-3333-3333-333333333333",
    name: "Meta Marketing API",
    slug: "meta-marketing-api",
    logoUrl: "https://logo.clearbit.com/meta.com",
    website: "https://developers.facebook.com/docs/marketing-apis",
    description:
      "Track permissions, webhook, and version changes affecting Meta ad operations.",
    changelogUrl: "https://developers.facebook.com/docs/graph-api/changelog/",
    fetchCssSelector: "main, article, ._4cel",
    fetchIntervalHours: 4,
    lastFetchedAt: new Date("2026-08-02T07:55:00.000Z"),
    isActive: true,
    createdAt: new Date("2026-08-02T00:00:00.000Z"),
    updatedAt: new Date("2026-08-02T00:00:00.000Z"),
  },
];

export const demoChangeEvents: ChangeEvent[] = [
  {
    id: "aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaa1",
    providerId: demoProviders[1].id,
    snapshotId: null,
    title: "Google Ads API v18 sunset timeline updated",
    summary:
      "Google Ads published an updated sunset schedule for v18 with revised migration timing.",
    executiveSummary:
      "Your campaign automation and reporting clients should confirm they are not pinned to v18 before the sunset window closes.",
    changeType: "migration_notice",
    severity: "high",
    confidence: 92,
    detectedAt: new Date("2026-08-02T09:05:00.000Z"),
    publishedAt: new Date("2026-08-02T08:30:00.000Z"),
    affectedAreas: ["Google Ads API versions", "reporting clients"],
    suggestedActions: [
      "Audit version usage across integrations",
      "Schedule migration validation",
      "Notify paid media engineering",
    ],
    rawDiff: null,
    sourceUrl: demoProviders[1].changelogUrl,
    createdAt: new Date("2026-08-02T09:05:00.000Z"),
  },
  {
    id: "aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaa2",
    providerId: demoProviders[0].id,
    snapshotId: null,
    title: "GA4 reporting export behavior changed for attribution fields",
    summary:
      "A reporting behavior change may alter expected values in downstream attribution dashboards.",
    executiveSummary:
      "Analytics stakeholders should validate dashboards and client-facing exports that depend on attribution dimensions.",
    changeType: "behavior_change",
    severity: "medium",
    confidence: 87,
    detectedAt: new Date("2026-08-02T08:12:00.000Z"),
    publishedAt: new Date("2026-08-02T07:50:00.000Z"),
    affectedAreas: ["GA4 exports", "attribution reports"],
    suggestedActions: [
      "Validate key dashboards",
      "Check attribution logic in ETL jobs",
    ],
    rawDiff: null,
    sourceUrl: demoProviders[0].changelogUrl,
    createdAt: new Date("2026-08-02T08:12:00.000Z"),
  },
  {
    id: "aaaaaaa3-aaaa-aaaa-aaaa-aaaaaaaaaaa3",
    providerId: demoProviders[2].id,
    snapshotId: null,
    title: "Meta Marketing API permissions review guidance refreshed",
    summary:
      "Meta updated the review guidance used for apps requesting sensitive marketing permissions.",
    executiveSummary:
      "This is low-risk but worth reviewing if your app regularly renews or expands permission scopes.",
    changeType: "docs_change",
    severity: "low",
    confidence: 79,
    detectedAt: new Date("2026-08-02T07:20:00.000Z"),
    publishedAt: new Date("2026-08-02T06:55:00.000Z"),
    affectedAreas: ["app review", "permissions"],
    suggestedActions: ["Review your current app review checklist"],
    rawDiff: null,
    sourceUrl: demoProviders[2].changelogUrl,
    createdAt: new Date("2026-08-02T07:20:00.000Z"),
  },
];

export const demoCards: Card[] = [
  {
    id: "bbbbbbb1-bbbb-bbbb-bbbb-bbbbbbbbbbb1",
    changeEventId: demoChangeEvents[0].id,
    userId: demoSession.user.id,
    status: "needs_action",
    position: 0,
    assigneeName: "Growth Engineering",
    snoozedUntil: null,
    isFalsePositive: false,
    createdAt: new Date("2026-08-02T09:05:00.000Z"),
    updatedAt: new Date("2026-08-02T09:05:00.000Z"),
  },
  {
    id: "bbbbbbb2-bbbb-bbbb-bbbb-bbbbbbbbbbb2",
    changeEventId: demoChangeEvents[1].id,
    userId: demoSession.user.id,
    status: "reviewed",
    position: 1,
    assigneeName: "Analytics",
    snoozedUntil: null,
    isFalsePositive: false,
    createdAt: new Date("2026-08-02T08:12:00.000Z"),
    updatedAt: new Date("2026-08-02T08:12:00.000Z"),
  },
  {
    id: "bbbbbbb3-bbbb-bbbb-bbbb-bbbbbbbbbbb3",
    changeEventId: demoChangeEvents[2].id,
    userId: demoSession.user.id,
    status: "new",
    position: 2,
    assigneeName: null,
    snoozedUntil: null,
    isFalsePositive: false,
    createdAt: new Date("2026-08-02T07:20:00.000Z"),
    updatedAt: new Date("2026-08-02T07:20:00.000Z"),
  },
];

export const demoCardDetails = demoCards.map((card) => {
  const event = demoChangeEvents.find((item) => item.id === card.changeEventId)!;
  const provider = demoProviders.find((item) => item.id === event.providerId)!;
  return { card, event, provider };
});

export const demoNotificationPrefs = {
  emailDigestEnabled: true,
  digestHourUtc: 13,
  criticalInstantEmail: true,
};
