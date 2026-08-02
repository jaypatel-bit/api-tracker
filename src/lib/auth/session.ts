import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { demoSession, isDemoMode } from "@/lib/demo";

export async function getServerSession() {
  if (isDemoMode()) {
    return demoSession;
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}
