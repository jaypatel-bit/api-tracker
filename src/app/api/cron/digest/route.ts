import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cards, changeEvents, providers, user, notificationPreferences } from "@/lib/db/schema";
import { eq, and, gte, inArray } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Get users with digest enabled
    const prefs = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.emailDigestEnabled, true));

    const userIds = prefs.map((p) => p.userId);
    if (userIds.length === 0) {
      return NextResponse.json({ message: "No users with digest enabled" });
    }

    // Get recent critical/high cards for these users
    const recentCards = await db
      .select({
        card: cards,
        event: changeEvents,
        provider: providers,
        userName: user.name,
        userEmail: user.email,
      })
      .from(cards)
      .innerJoin(changeEvents, eq(cards.changeEventId, changeEvents.id))
      .innerJoin(providers, eq(changeEvents.providerId, providers.id))
      .innerJoin(user, eq(cards.userId, user.id))
      .where(
        and(
          inArray(cards.userId, userIds),
          eq(cards.status, "new"),
          gte(cards.createdAt, oneDayAgo),
          inArray(changeEvents.severity, ["critical", "high"])
        )
      );

    // Group by user and send emails
    const byUser = new Map<string, typeof recentCards>();
    for (const row of recentCards) {
      const existing = byUser.get(row.userEmail) || [];
      existing.push(row);
      byUser.set(row.userEmail, existing);
    }

    let sent = 0;
    for (const [email, userCards] of byUser) {
      // TODO: Send via Resend when API key is configured
      console.log(`Would send digest to ${email}: ${userCards.length} changes`);
      sent++;
    }

    return NextResponse.json({ success: true, digestsSent: sent });
  } catch (error) {
    console.error("Digest cron error:", error);
    return NextResponse.json({ error: "Digest failed" }, { status: 500 });
  }
}
