import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cards } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updateData: Record<string, unknown> = { updatedAt: new Date() };
    if (body.status) updateData.status = body.status;
    if (body.assigneeName !== undefined) updateData.assigneeName = body.assigneeName;
    if (body.isFalsePositive !== undefined) updateData.isFalsePositive = body.isFalsePositive;
    if (body.position !== undefined) updateData.position = body.position;

    await db.update(cards).set(updateData).where(eq(cards.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update card:", error);
    return NextResponse.json({ error: "Failed to update card" }, { status: 500 });
  }
}
