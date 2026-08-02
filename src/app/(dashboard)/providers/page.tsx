import Link from "next/link";
import { Layers, Radar, ShieldAlert, TimerReset } from "lucide-react";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { providers, subscriptions } from "@/lib/db/schema";
import { ProviderLogo } from "@/components/providers/provider-logo";
import { SubscribeButton } from "@/components/providers/subscribe-button";
import { getServerSession } from "@/lib/auth/session";
import { demoProviders, isDemoMode } from "@/lib/demo";

async function getProviders() {
  try {
    return await db.select().from(providers).orderBy(providers.name);
  } catch {
    return [];
  }
}

async function getUserSubscriptions(userId: string) {
  try {
    const subs = await db
      .select({ providerId: subscriptions.providerId })
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    return new Set(subs.map((s) => s.providerId));
  } catch {
    return new Set<string>();
  }
}

export default async function ProvidersPage() {
  const session = await getServerSession();
  const allProviders = isDemoMode() ? demoProviders : await getProviders();
  const subscribedIds = isDemoMode()
    ? new Set(demoProviders.map((provider) => provider.id))
    : await getUserSubscriptions(session!.user.id);
  const activeProviders = allProviders.filter((provider) => provider.isActive).length;
  const fastestInterval = allProviders.length
    ? Math.min(...allProviders.map((provider) => provider.fetchIntervalHours))
    : 0;

  return (
    <div className="space-y-6">
      <section className="panel rounded-[32px] p-6 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Provider coverage
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              Monitor the platforms your reporting stack depends on
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Build a focused watchlist across Google Analytics, Google Ads, Meta, and adjacent data partners. Subscribe your team to the providers that matter most.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Providers available",
                value: allProviders.length,
                icon: Layers,
              },
              {
                label: "Active monitors",
                value: activeProviders,
                icon: Radar,
              },
              {
                label: "Fastest cadence",
                value: fastestInterval ? `${fastestInterval}h` : "0h",
                icon: TimerReset,
              },
            ].map((stat) => (
              <div key={stat.label} className="stat-card rounded-[26px] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
                      {stat.value}
                    </p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {allProviders.length === 0 ? (
        <div className="panel rounded-[32px] border-dashed p-12 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-[var(--muted)]" />
          <p className="mt-4 text-lg font-semibold text-[var(--foreground)]">
            No providers seeded yet
          </p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Connect your database and run the seed script to load the initial monitoring set.
          </p>
        </div>
      ) : (
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {allProviders.map((provider) => (
            <Link
              key={provider.id}
              href={`/providers/${provider.slug}`}
              className="panel group rounded-[30px] p-5 hover:-translate-y-0.5"
            >
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
                <div className="flex items-center gap-4">
                  {provider.logoUrl ? (
                    <ProviderLogo
                      src={provider.logoUrl}
                      alt={provider.name}
                      className="h-14 w-14 rounded-2xl border border-black/5 bg-white object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-lg font-semibold text-[var(--accent)]">
                      {provider.name.slice(0, 1)}
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                      {provider.name}
                    </h3>
                    <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-strong)]">
                      {provider.isActive ? "Active" : "Paused"}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                    {provider.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                    <span className="rounded-full border border-black/7 px-3 py-1.5">
                      Poll every {provider.fetchIntervalHours} hours
                    </span>
                    {provider.changelogUrl ? (
                      <span className="rounded-full border border-black/7 px-3 py-1.5">
                        Changelog source connected
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-black/5 pt-4">
                <p className="text-xs font-medium text-[var(--muted)]">
                  Open provider intelligence
                </p>
                <SubscribeButton
                  providerId={provider.id}
                  isSubscribed={subscribedIds.has(provider.id)}
                />
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
