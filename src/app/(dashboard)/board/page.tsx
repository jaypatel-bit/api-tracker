import { db } from "@/lib/db";
import { cards, changeEvents, providers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { KanbanBoard } from "@/components/board/kanban-board";
import { getServerSession } from "@/lib/auth/session";

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
  const allCards = await getCards(session!.user.id);

  const grouped = COLUMNS.map((col) => ({
    ...col,
    cards: allCards.filter((c) => c.card.status === col.id),
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Board</h1>
        <p className="text-sm text-gray-500 mt-1">
          Drag cards between columns to track API changes through your workflow.
        </p>
      </div>
      <KanbanBoard columns={grouped} />
    </div>
  );
}
