import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cards } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { isDemoMode } from "@/lib/demo";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (isDemoMode()) {
    return NextResponse.json({ success: true, demo: true });
  }

  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (body.status) updateData.status = body.status;
    if (body.assigneeName !== undefined) updateData.assigneeName = body.assigneeName;
    if (body.isFalsePositive !== undefined) updateData.isFalsePositive = body.isFalsePositive;
    if (body.position !== undefined) updateData.position = body.position;

    const result = await db
      .update(cards)
      .set(updateData)
      .where(and(eq(cards.id, id), eq(cards.userId, session.user.id)))
      .returning({ id: cards.id });

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update card:", error);
    return NextResponse.json({ error: "Failed to update card" }, { status: 500 });
  }
}
