import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { providers } from "@/lib/db/schema";
import { demoProviders, isDemoMode } from "@/lib/demo";

export async function GET() {
  if (isDemoMode()) {
    return NextResponse.json(demoProviders);
  }

  try {
    const allProviders = await db.select().from(providers).orderBy(providers.name);
    return NextResponse.json(allProviders);
  } catch (error) {
    console.error("Failed to fetch providers:", error);
    return NextResponse.json([], { status: 500 });
  }
}
