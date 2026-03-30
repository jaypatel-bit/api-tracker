import {
  pgTable,
  pgEnum,
  uuid,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Enums ─────────────────────────────────────────────────────
export const changeTypeEnum = pgEnum("change_type", [
  "breaking_change",
  "deprecation",
  "new_endpoint",
  "removed_endpoint",
  "new_parameter",
  "removed_parameter",
  "enum_change",
  "auth_change",
  "rate_limit_change",
  "webhook_change",
  "sdk_release",
  "migration_notice",
  "sunset_date",
  "pricing_change",
  "docs_change",
  "bug_fix",
  "behavior_change",
  "other",
]);

export const severityEnum = pgEnum("severity", [
  "critical",
  "high",
  "medium",
  "low",
  "informational",
]);

export const cardStatusEnum = pgEnum("card_status", [
  "new",
  "reviewed",
  "needs_action",
  "in_progress",
  "resolved",
  "ignored",
]);

// ── Providers ─────────────────────────────────────────────────
export const providers = pgTable(
  "providers",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    logoUrl: text("logo_url"),
    website: text("website"),
    description: text("description"),
    changelogUrl: text("changelog_url"),
    fetchCssSelector: text("fetch_css_selector"),
    fetchIntervalHours: integer("fetch_interval_hours").default(4).notNull(),
    lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [uniqueIndex("providers_slug_idx").on(table.slug)]
);

// ── Snapshots ─────────────────────────────────────────────────
export const snapshots = pgTable(
  "snapshots",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => providers.id, { onDelete: "cascade" }),
    contentHash: text("content_hash").notNull(),
    rawContent: text("raw_content").notNull(),
    fetchedAt: timestamp("fetched_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("snapshots_provider_id_idx").on(table.providerId),
    index("snapshots_fetched_at_idx").on(table.fetchedAt),
  ]
);

// ── Change Events ─────────────────────────────────────────────
export const changeEvents = pgTable(
  "change_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => providers.id, { onDelete: "cascade" }),
    snapshotId: uuid("snapshot_id").references(() => snapshots.id),
    title: text("title").notNull(),
    summary: text("summary").notNull(),
    executiveSummary: text("executive_summary"),
    changeType: changeTypeEnum("change_type").notNull(),
    severity: severityEnum("severity").notNull(),
    confidence: integer("confidence").notNull().default(80),
    detectedAt: timestamp("detected_at", { withTimezone: true }).defaultNow().notNull(),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    affectedAreas: jsonb("affected_areas").$type<string[]>().default([]),
    suggestedActions: jsonb("suggested_actions").$type<string[]>().default([]),
    rawDiff: text("raw_diff"),
    sourceUrl: text("source_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("change_events_provider_id_idx").on(table.providerId),
    index("change_events_severity_idx").on(table.severity),
    index("change_events_detected_at_idx").on(table.detectedAt),
  ]
);

// ── Users ─────────────────────────────────────────────────────
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// ── Cards ─────────────────────────────────────────────────────
export const cards = pgTable(
  "cards",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    changeEventId: uuid("change_event_id")
      .notNull()
      .references(() => changeEvents.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    status: cardStatusEnum("status").notNull().default("new"),
    position: integer("position").notNull().default(0),
    assigneeName: text("assignee_name"),
    snoozedUntil: timestamp("snoozed_until", { withTimezone: true }),
    isFalsePositive: boolean("is_false_positive").default(false).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("cards_user_status_idx").on(table.userId, table.status),
    index("cards_change_event_idx").on(table.changeEventId),
  ]
);

// ── Subscriptions ─────────────────────────────────────────────
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    providerId: uuid("provider_id")
      .notNull()
      .references(() => providers.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("subscriptions_user_provider_idx").on(table.userId, table.providerId),
  ]
);

// ── Notification Preferences ──────────────────────────────────
export const notificationPreferences = pgTable("notification_preferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  emailDigestEnabled: boolean("email_digest_enabled").default(true).notNull(),
  digestHourUtc: integer("digest_hour_utc").default(13).notNull(),
  criticalInstantEmail: boolean("critical_instant_email").default(true).notNull(),
});

// ── Relations ─────────────────────────────────────────────────
export const providersRelations = relations(providers, ({ many }) => ({
  snapshots: many(snapshots),
  changeEvents: many(changeEvents),
  subscriptions: many(subscriptions),
}));

export const snapshotsRelations = relations(snapshots, ({ one }) => ({
  provider: one(providers, {
    fields: [snapshots.providerId],
    references: [providers.id],
  }),
}));

export const changeEventsRelations = relations(changeEvents, ({ one, many }) => ({
  provider: one(providers, {
    fields: [changeEvents.providerId],
    references: [providers.id],
  }),
  snapshot: one(snapshots, {
    fields: [changeEvents.snapshotId],
    references: [snapshots.id],
  }),
  cards: many(cards),
}));

export const cardsRelations = relations(cards, ({ one }) => ({
  changeEvent: one(changeEvents, {
    fields: [cards.changeEventId],
    references: [changeEvents.id],
  }),
  user: one(user, {
    fields: [cards.userId],
    references: [user.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(user, {
    fields: [subscriptions.userId],
    references: [user.id],
  }),
  provider: one(providers, {
    fields: [subscriptions.providerId],
    references: [providers.id],
  }),
}));

// ── Type exports ──────────────────────────────────────────────
export type Provider = typeof providers.$inferSelect;
export type NewProvider = typeof providers.$inferInsert;
export type Snapshot = typeof snapshots.$inferSelect;
export type ChangeEvent = typeof changeEvents.$inferSelect;
export type Card = typeof cards.$inferSelect;
export type User = typeof user.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
