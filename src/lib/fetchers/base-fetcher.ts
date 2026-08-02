import * as cheerio from "cheerio";
import { createHash } from "crypto";
import { db } from "@/lib/db";
import { providers, snapshots } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import type { Provider } from "@/lib/db/schema";

export interface FetchResult {
  content: string;
  contentHash: string;
  isNew: boolean;
  snapshotId: string | null;
}

export async function fetchAndSnapshot(provider: Provider): Promise<FetchResult> {
  if (!provider.changelogUrl) {
    throw new Error(`No changelog URL for ${provider.name}`);
  }

  // 1. Fetch the page
  const response = await fetch(provider.changelogUrl, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; APIRadar/1.0; +https://apiradar.dev)",
    },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed for ${provider.name}: ${response.status}`);
  }

  const html = await response.text();

  // 2. Extract content using CSS selector
  const $ = cheerio.load(html);

  // Remove scripts, styles, navs, footers
  $("script, style, nav, footer, header, noscript, iframe").remove();

  const selector = provider.fetchCssSelector || "main, article, body";
  let content = "";

  $(selector).each((_, el) => {
    content += $(el).text().trim() + "\n";
  });

  // Clean whitespace
  content = content.replace(/\s+/g, " ").trim();

  if (!content || content.length < 50) {
    throw new Error(`Insufficient content extracted for ${provider.name}`);
  }

  // 3. Compute hash
  const contentHash = createHash("md5").update(content).digest("hex");

  // 4. Check last snapshot
  const lastSnapshot = await db
    .select()
    .from(snapshots)
    .where(eq(snapshots.providerId, provider.id))
    .orderBy(desc(snapshots.fetchedAt))
    .limit(1);

  if (lastSnapshot.length > 0 && lastSnapshot[0].contentHash === contentHash) {
    await db
      .update(providers)
      .set({ lastFetchedAt: new Date(), updatedAt: new Date() })
      .where(eq(providers.id, provider.id));

    // No change
    return { content, contentHash, isNew: false, snapshotId: null };
  }

  // 5. Save new snapshot
  const [newSnapshot] = await db
    .insert(snapshots)
    .values({
      providerId: provider.id,
      contentHash,
      rawContent: content.substring(0, 100_000), // Cap at 100k chars
    })
    .returning({ id: snapshots.id });

  // Update provider last fetched
  await db
    .update(providers)
    .set({ lastFetchedAt: new Date(), updatedAt: new Date() })
    .where(eq(providers.id, provider.id));

  return {
    content,
    contentHash,
    isNew: true,
    snapshotId: newSnapshot.id,
  };
}
