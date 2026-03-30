import { db } from "@/lib/db";
import { notificationPreferences } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/auth/session";
import { SettingsForm } from "@/components/settings/settings-form";

async function getPrefs(userId: string) {
  const results = await db
    .select()
    .from(notificationPreferences)
    .where(eq(notificationPreferences.userId, userId))
    .limit(1);

  return (
    results[0] || {
      emailDigestEnabled: true,
      digestHourUtc: 13,
      criticalInstantEmail: true,
    }
  );
}

export default async function SettingsPage() {
  const session = await getServerSession();
  const prefs = await getPrefs(session!.user.id);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
      <p className="text-sm text-gray-500 mb-8">
        Manage your notification preferences.
      </p>

      <SettingsForm
        initialPrefs={{
          emailDigestEnabled: prefs.emailDigestEnabled,
          digestHourUtc: prefs.digestHourUtc,
          criticalInstantEmail: prefs.criticalInstantEmail,
        }}
      />
    </div>
  );
}
