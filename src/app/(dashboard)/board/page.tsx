import { db } from "@/lib/db";
import { cards, changeEvents, providers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { KanbanBoard } from "@/components/board/kanban-board";

const COLUMNS = [
  { id: "new", label: "New" },
  { id: "reviewed", label: "Reviewed" },
  { id: "needs_action", label: "Needs Action" },
  { id: "in_progress", label: "In Progress" },
  { id: "resolved", label: "Resolved" },
  { id: "ignored", label: "Ignored" },
] as const;

async function getCards() {
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
      .orderBy(cards.position);
    return allCards;
  } catch {
    // DB not connected yet — return empty
    return [];
  }
}

export default async function BoardPage() {
  const allCards = await getCards();

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
