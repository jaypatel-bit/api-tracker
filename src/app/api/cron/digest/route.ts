import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  cards,
  changeEvents,
  providers,
  user,
  notificationPreferences,
} from "@/lib/db/schema";
import { eq, and, gte, inArray } from "drizzle-orm";
import { sendDigestEmail } from "@/lib/email/send";
import { getCronSecret } from "@/lib/cron";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = getCronSecret();

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const currentHourUtc = new Date().getUTCHours();
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Get users with digest enabled whose preferred hour matches now
    const prefs = await db
      .select()
      .from(notificationPreferences)
      .where(
        and(
          eq(notificationPreferences.emailDigestEnabled, true),
          eq(notificationPreferences.digestHourUtc, currentHourUtc)
        )
      );

    const userIds = prefs.map((p) => p.userId);
    if (userIds.length === 0) {
      return NextResponse.json({
        message: "No users with digest enabled for this hour",
      });
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

    // Group by user email
    const byUser = new Map<
      string,
      { name: string; cards: typeof recentCards }
    >();
    for (const row of recentCards) {
      const existing = byUser.get(row.userEmail) || {
        name: row.userName,
        cards: [],
      };
      existing.cards.push(row);
      byUser.set(row.userEmail, existing);
    }

    let sent = 0;
    const errors: string[] = [];

    for (const [email, { name, cards: userCards }] of byUser) {
      try {
        await sendDigestEmail(
          email,
          name,
          userCards.map((c) => ({
            providerName: c.provider.name,
            title: c.event.title,
            summary: c.event.summary,
            severity: c.event.severity,
            changeType: c.event.changeType,
          }))
        );
        sent++;
      } catch (err) {
        console.error(`Failed to send digest to ${email}:`, err);
        errors.push(email);
      }
    }

    return NextResponse.json({
      success: true,
      digestsSent: sent,
      ...(errors.length > 0 && { errors }),
    });
  } catch (error) {
    console.error("Digest cron error:", error);
    return NextResponse.json({ error: "Digest failed" }, { status: 500 });
  }
}
