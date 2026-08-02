import { db } from "@/lib/db";
import {
  providers,
  changeEvents,
  cards,
  subscriptions,
  user,
  notificationPreferences,
} from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { fetchAndSnapshot } from "@/lib/fetchers/base-fetcher";
import { computeDiff } from "@/lib/diff/compute";
import { classifyChange } from "@/lib/ai/classify";
import type { Provider } from "@/lib/db/schema";
import { sendCriticalAlertEmail } from "@/lib/email/send";

export async function processProvider(provider: Provider): Promise<{
  status: "no_change" | "new_change" | "error";
  message: string;
}> {
  try {
    const fetchResult = await fetchAndSnapshot(provider);

    if (!fetchResult.isNew) {
      return { status: "no_change", message: `${provider.name}: No changes detected` };
    }

    const diff = await computeDiff(provider.id, fetchResult.content);

    if (!diff.hasChanges) {
      return { status: "no_change", message: `${provider.name}: Diff too small to classify` };
    }

    const classification = await classifyChange(diff.addedText || diff.rawDiff, provider.name);

    const [event] = await db
      .insert(changeEvents)
      .values({
        providerId: provider.id,
        snapshotId: fetchResult.snapshotId,
        title: classification.title,
        summary: classification.summary,
        changeType: classification.changeType,
        severity: classification.severity,
        confidence: classification.confidence,
        affectedAreas: classification.affectedAreas,
        suggestedActions: classification.suggestedActions,
        rawDiff: diff.rawDiff,
        sourceUrl: provider.changelogUrl,
      })
      .returning({ id: changeEvents.id });

    const subs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.providerId, provider.id));

    if (subs.length > 0) {
      await db.insert(cards).values(
        subs.map((sub) => ({
          changeEventId: event.id,
          userId: sub.userId,
          status: "new" as const,
          position: 0,
        }))
      );

      if (classification.severity === "critical" || classification.severity === "high") {
        const subscribedUserIds = subs.map((sub) => sub.userId);
        const recipients = await db
          .select({
            userId: user.id,
            name: user.name,
            email: user.email,
          })
          .from(user)
          .where(inArray(user.id, subscribedUserIds));

        const prefs = await db
          .select({
            userId: notificationPreferences.userId,
            criticalInstantEmail: notificationPreferences.criticalInstantEmail,
          })
          .from(notificationPreferences)
          .where(inArray(notificationPreferences.userId, subscribedUserIds));

        const prefMap = new Map(prefs.map((pref) => [pref.userId, pref.criticalInstantEmail]));

        for (const recipient of recipients) {
          if (prefMap.get(recipient.userId) === false) {
            continue;
          }

          try {
            await sendCriticalAlertEmail(recipient.email, recipient.name, {
              providerName: provider.name,
              title: classification.title,
              summary: classification.summary,
              severity: classification.severity,
              changeType: classification.changeType,
            });
          } catch (error) {
            console.error(`Failed to send critical alert to ${recipient.email}:`, error);
          }
        }
      }
    }

    return {
      status: "new_change",
      message: `${provider.name}: ${classification.title} [${classification.severity}]`,
    };
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error(`Pipeline error for ${provider.name}:`, msg);
    return { status: "error", message: `${provider.name}: ${msg}` };
  }
}

export async function processAllProviders() {
  const allProviders = await db
    .select()
    .from(providers)
    .where(eq(providers.isActive, true));

  const results = [];
  for (const provider of allProviders) {
    const result = await processProvider(provider);
    results.push(result);
    console.log(result.message);
  }

  return results;
}
