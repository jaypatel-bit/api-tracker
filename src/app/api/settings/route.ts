import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { notificationPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { z } from "zod";
import { demoNotificationPrefs, isDemoMode } from "@/lib/demo";

const updateSchema = z.object({
  emailDigestEnabled: z.boolean(),
  digestHourUtc: z.number().int().min(0).max(23),
  criticalInstantEmail: z.boolean(),
});

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json(demoNotificationPrefs);
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const results = await db
      .select()
      .from(notificationPreferences)
      .where(eq(notificationPreferences.userId, session.user.id))
      .limit(1);

    const prefs = results[0] || {
      emailDigestEnabled: true,
      digestHourUtc: 13,
      criticalInstantEmail: true,
    };

    return NextResponse.json(prefs);
  } catch (error) {
    console.error("Failed to fetch settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  if (isDemoMode()) {
    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, demo: true });
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    await db
      .insert(notificationPreferences)
      .values({
        userId: session.user.id,
        ...parsed.data,
      })
      .onConflictDoUpdate({
        target: notificationPreferences.userId,
        set: parsed.data,
      });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
