import { diffWords } from "diff";
import { db } from "@/lib/db";
import { snapshots } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export interface DiffResult {
  addedText: string;
  removedText: string;
  rawDiff: string;
  hasChanges: boolean;
}

export async function computeDiff(
  providerId: string,
  newContent: string
): Promise<DiffResult> {
  // Get the second-to-last snapshot (the one before the new one)
  const previousSnapshots = await db
    .select()
    .from(snapshots)
    .where(eq(snapshots.providerId, providerId))
    .orderBy(desc(snapshots.fetchedAt))
    .limit(2);

  // If there's only one snapshot (the new one), treat all content as "added"
  if (previousSnapshots.length < 2) {
    return {
      addedText: newContent.substring(0, 5000),
      removedText: "",
      rawDiff: newContent.substring(0, 5000),
      hasChanges: true,
    };
  }

  const oldContent = previousSnapshots[1].rawContent;
  const changes = diffWords(oldContent, newContent);

  let addedText = "";
  let removedText = "";
  let rawDiff = "";

  for (const part of changes) {
    if (part.added) {
      addedText += part.value + " ";
      rawDiff += `[+] ${part.value}\n`;
    } else if (part.removed) {
      removedText += part.value + " ";
      rawDiff += `[-] ${part.value}\n`;
    }
  }

  addedText = addedText.trim().substring(0, 5000);
  removedText = removedText.trim().substring(0, 5000);
  rawDiff = rawDiff.trim().substring(0, 10000);

  return {
    addedText,
    removedText,
    rawDiff,
    hasChanges: addedText.length > 20 || removedText.length > 20,
  };
}
