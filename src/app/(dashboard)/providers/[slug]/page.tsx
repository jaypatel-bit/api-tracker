import Image from "next/image";
import Link from "next/link";
import { and, desc, eq } from "drizzle-orm";
import { ArrowLeft, Clock3, ExternalLink, ShieldAlert } from "lucide-react";
import { notFound } from "next/navigation";
import { SubscribeButton } from "@/components/providers/subscribe-button";
import { getServerSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { changeEvents, providers, subscriptions } from "@/lib/db/schema";
import { CHANGE_TYPE_LABELS, SEVERITY_COLORS, cn, timeAgo } from "@/lib/utils";

async function getProvider(slug: string) {
  try {
    const results = await db
      .select()
      .from(providers)
      .where(eq(providers.slug, slug))
      .limit(1);
    return results[0] || null;
  } catch {
    return null;
  }
}

async function getChanges(providerId: string) {
  try {
    return await db
      .select()
      .from(changeEvents)
      .where(eq(changeEvents.providerId, providerId))
      .orderBy(desc(changeEvents.detectedAt))
      .limit(50);
  } catch {
    return [];
  }
}

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await getProvider(slug);
  if (!provider) return notFound();

  const session = await getServerSession();
  const changes = await getChanges(provider.id);
  const userSub = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, session!.user.id),
        eq(subscriptions.providerId, provider.id)
      )
    )
    .limit(1);
  const isSubscribed = userSub.length > 0;
  const criticalCount = changes.filter((change) => change.severity === "critical").length;
  const highRiskCount = changes.filter((change) =>
    ["critical", "high"].includes(change.severity)
  ).length;

  return (
    <div className="space-y-6">
      <Link
        href="/providers"
        className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to providers
      </Link>

      <section className="panel rounded-[32px] p-6 sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {provider.logoUrl ? (
              <Image
                src={provider.logoUrl}
                alt={provider.name}
                width={64}
                height={64}
                unoptimized
                className="h-16 w-16 rounded-[24px] border border-black/5 bg-white object-contain p-3"
              />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-[24px] bg-[var(--accent-soft)] text-xl font-semibold text-[var(--accent)]">
                {provider.name.slice(0, 1)}
              </div>
            )}

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {provider.name}
                </h1>
                <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--accent-strong)]">
                  {provider.isActive ? "Monitoring live" : "Paused"}
                </span>
              </div>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                {provider.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-[var(--muted)]">
                <span className="rounded-full border border-black/7 px-3 py-1.5">
                  Poll every {provider.fetchIntervalHours} hours
                </span>
                {provider.lastFetchedAt ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-black/7 px-3 py-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    Last synced {timeAgo(provider.lastFetchedAt)}
                  </span>
                ) : null}
                {provider.website ? (
                  <a
                    href={provider.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full border border-black/7 px-3 py-1.5 hover:text-[var(--foreground)]"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Visit provider
                  </a>
                ) : null}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:min-w-[220px]">
            <SubscribeButton providerId={provider.id} isSubscribed={isSubscribed} />
            <div className="stat-card rounded-[24px] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                Recent risk snapshot
              </p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-2xl font-semibold text-[var(--foreground)]">
                    {criticalCount}
                  </p>
                  <p className="text-xs text-[var(--muted)]">Critical</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold text-[var(--foreground)]">
                    {highRiskCount}
                  </p>
                  <p className="text-xs text-[var(--muted)]">High risk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Change feed
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              Recent provider updates
            </h2>
          </div>
          <p className="text-sm text-[var(--muted)]">{changes.length} changes detected</p>
        </div>

        {changes.length === 0 ? (
          <div className="panel rounded-[30px] border-dashed p-12 text-center">
            <ShieldAlert className="mx-auto h-10 w-10 text-[var(--muted)]" />
            <p className="mt-4 text-lg font-semibold text-[var(--foreground)]">
              No changes detected yet
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Updates will appear here after the fetch and diff pipeline records new provider activity.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {changes.map((event) => (
              <article key={event.id} className="panel rounded-[28px] p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          "rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize",
                          SEVERITY_COLORS[event.severity]
                        )}
                      >
                        {event.severity}
                      </span>
                      <span className="rounded-full bg-black/4 px-2.5 py-1 text-[11px] font-medium text-[var(--muted)]">
                        {CHANGE_TYPE_LABELS[event.changeType] || event.changeType}
                      </span>
                    </div>

                    <h3 className="mt-3 text-lg font-semibold text-[var(--foreground)]">
                      {event.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                      {event.executiveSummary || event.summary}
                    </p>

                    {event.suggestedActions?.length ? (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {event.suggestedActions.slice(0, 3).map((action) => (
                          <span
                            key={action}
                            className="rounded-full border border-black/7 px-3 py-1.5 text-xs text-[var(--foreground)]/78"
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--muted)] lg:flex-col lg:items-end">
                    <span>{timeAgo(event.detectedAt)}</span>
                    {event.sourceUrl ? (
                      <a
                        href={event.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 hover:text-[var(--foreground)]"
                      >
                        Source
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
