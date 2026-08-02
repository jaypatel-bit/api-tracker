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
    <div className="space-y-6">
      <section className="panel rounded-[32px] p-6 sm:p-7">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Notifications
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
          Settings
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
          Configure how APIRadar briefs your team on critical changes, daily digests, and review timing.
        </p>
      </section>

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
