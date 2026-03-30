import { NextRequest, NextResponse } from "next/server";
import { processAllProviders } from "@/lib/pipeline/process";

export const maxDuration = 60; // Vercel function timeout

export async function GET(request: NextRequest) {
  // Verify cron secret (Vercel sends this automatically for cron jobs)
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const results = await processAllProviders();
    return NextResponse.json({
      success: true,
      results,
      processedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Cron fetch error:", error);
    return NextResponse.json(
      { error: "Pipeline failed", details: String(error) },
      { status: 500 }
    );
  }
}
