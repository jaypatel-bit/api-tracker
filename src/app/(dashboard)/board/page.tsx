import { KanbanBoard } from "@/components/board/kanban-board";
import { getServerSession } from "@/lib/auth/session";
import { cards, changeEvents, providers } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { cn } from "@/lib/utils";
import { AlertTriangle, BellRing, CircleCheckBig, Layers3 } from "lucide-react";
import { eq } from "drizzle-orm";
import { demoCardDetails, isDemoMode } from "@/lib/demo";

const COLUMNS = [
  { id: "new", label: "New" },
  { id: "reviewed", label: "Reviewed" },
  { id: "needs_action", label: "Needs Action" },
  { id: "in_progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
  { id: "ignored", label: "Ignored" },
] as const;

async function getCards(userId: string) {
  try {
    const allCards = await db
      .select({
        card: cards,
        event: changeEvents,
        provider: providers,
      })
      .from(cards)
      .innerJoin(changeEvents, eq(cards.changeEventId, changeEvents.id))
      .innerJoin(providers, eq(changeEvents.providerId, providers.id))
      .where(eq(cards.userId, userId))
      .orderBy(cards.position);
    return allCards;
  } catch {
    return [];
  }
}

export default async function BoardPage() {
  const session = await getServerSession();
  const allCards = isDemoMode() ? demoCardDetails : await getCards(session!.user.id);

  const grouped = COLUMNS.map((col) => ({
    ...col,
    cards: allCards.filter((c) => c.card.status === col.id),
  }));

  const criticalCount = allCards.filter((item) => item.event.severity === "critical").length;
  const actionCount = allCards.filter((item) =>
    ["new", "needs_action", "in_progress"].includes(item.card.status)
  ).length;
  const providerCount = new Set(allCards.map((item) => item.provider.id)).size;
  const resolvedCount = allCards.filter((item) => item.card.status === "resolved").length;
  const latestSignal = allCards[0];

  return (
    <div className="space-y-6">
      <section className="panel rounded-[32px] p-6 sm:p-7">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Signal board
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              Stay ahead of marketing API drift
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Triage changelog noise, push real issues into action, and keep analytics and campaign systems stable across Google Analytics, Google Ads, and Meta.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:min-w-[480px]">
            {[
              {
                label: "Critical alerts",
                value: criticalCount,
                icon: AlertTriangle,
                tone: "text-red-600 bg-red-500/10",
              },
              {
                label: "Changes in motion",
                value: actionCount,
                icon: BellRing,
                tone: "text-[var(--accent)] bg-[var(--accent-soft)]",
              },
              {
                label: "Tracked providers",
                value: providerCount,
                icon: Layers3,
                tone: "text-sky-700 bg-sky-500/10",
              },
              {
                label: "Resolved items",
                value: resolvedCount,
                icon: CircleCheckBig,
                tone: "text-emerald-700 bg-emerald-500/10",
              },
            ].map((stat) => (
              <div key={stat.label} className="stat-card rounded-[26px] p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-[var(--foreground)]">
                      {stat.value}
                    </p>
                  </div>
                  <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", stat.tone)}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {latestSignal ? (
          <div className="mt-6 rounded-[28px] bg-[linear-gradient(135deg,#10231c,#17382f)] p-5 text-white">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#92f0d3]">
                  Latest signal
                </p>
                <p className="mt-2 text-lg font-semibold">{latestSignal.event.title}</p>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-white/68">
                  {latestSignal.event.executiveSummary || latestSignal.event.summary}
                </p>
              </div>
              <div className="flex gap-2 self-start lg:self-auto">
                <span className="rounded-full border border-white/12 px-3 py-1 text-xs text-white/80">
                  {latestSignal.provider.name}
                </span>
                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/80 capitalize">
                  {latestSignal.event.severity}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-[28px] border border-dashed border-[var(--border)] bg-white/50 p-8 text-center">
            <p className="text-lg font-semibold text-[var(--foreground)]">
              No change cards yet
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Subscribe to providers and run the detection pipeline to start turning API updates into actionable work.
            </p>
          </div>
        )}
      </section>

      <section className="rounded-[32px] border border-black/5 bg-white/35 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
        <KanbanBoard columns={grouped} />
      </section>
    </div>
  );
}
