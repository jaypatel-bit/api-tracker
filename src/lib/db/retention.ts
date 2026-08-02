import { db } from "@/lib/db";
import { cards, changeEvents, snapshots } from "@/lib/db/schema";
import { and, asc, eq, inArray, isNull, lt } from "drizzle-orm";

const RESOLVED_CARD_RETENTION_DAYS = 90;
const ORPHAN_EVENT_RETENTION_DAYS = 120;
const SNAPSHOT_RETENTION_DAYS = 120;
const SNAPSHOTS_TO_KEEP_PER_PROVIDER = 2;

function daysAgo(days: number) {
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export async function cleanupRetentionData() {
  const now = new Date();
  const resolvedCutoff = daysAgo(RESOLVED_CARD_RETENTION_DAYS);
  const orphanEventCutoff = daysAgo(ORPHAN_EVENT_RETENTION_DAYS);
  const snapshotCutoff = daysAgo(SNAPSHOT_RETENTION_DAYS);

  const staleCards = await db
    .delete(cards)
    .where(
      and(
        inArray(cards.status, ["resolved", "ignored"]),
        lt(cards.updatedAt, resolvedCutoff),
      ),
    )
    .returning({ id: cards.id });

  const orphanEvents = await db
    .select({ id: changeEvents.id })
    .from(changeEvents)
    .leftJoin(cards, eq(cards.changeEventId, changeEvents.id))
    .where(
      and(
        isNull(cards.id),
        lt(changeEvents.createdAt, orphanEventCutoff),
      ),
    );

  let deletedEvents = 0;
  if (orphanEvents.length > 0) {
    const removedEvents = await db
      .delete(changeEvents)
      .where(
        inArray(
          changeEvents.id,
          orphanEvents.map((event) => event.id),
        ),
      )
      .returning({ id: changeEvents.id });
    deletedEvents = removedEvents.length;
  }

  const allSnapshots = await db
    .select({
      id: snapshots.id,
      providerId: snapshots.providerId,
      fetchedAt: snapshots.fetchedAt,
    })
    .from(snapshots)
    .orderBy(asc(snapshots.providerId), asc(snapshots.fetchedAt));

  const snapshotIdsToDelete: string[] = [];
  const providerSnapshotCounts = new Map<string, number>();

  for (const snapshot of allSnapshots) {
    const count = providerSnapshotCounts.get(snapshot.providerId) ?? 0;
    providerSnapshotCounts.set(snapshot.providerId, count + 1);
  }

  const providerSeen = new Map<string, number>();
  for (const snapshot of allSnapshots) {
    const seen = providerSeen.get(snapshot.providerId) ?? 0;
    const total = providerSnapshotCounts.get(snapshot.providerId) ?? 0;
    const snapshotsRemaining = total - seen;
    providerSeen.set(snapshot.providerId, seen + 1);

    const keepRecentSnapshots = snapshotsRemaining <= SNAPSHOTS_TO_KEEP_PER_PROVIDER;
    const isOlderThanRetention = snapshot.fetchedAt < snapshotCutoff;

    if (!keepRecentSnapshots && isOlderThanRetention) {
      snapshotIdsToDelete.push(snapshot.id);
    }
  }

  let deletedSnapshots = 0;
  if (snapshotIdsToDelete.length > 0) {
    const removedSnapshots = await db
      .delete(snapshots)
      .where(inArray(snapshots.id, snapshotIdsToDelete))
      .returning({ id: snapshots.id });
    deletedSnapshots = removedSnapshots.length;
  }

  return {
    deletedCards: staleCards.length,
    deletedEvents,
    deletedSnapshots,
    processedAt: now.toISOString(),
  };
}
