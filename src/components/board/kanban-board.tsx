"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { KanbanColumn } from "./kanban-column";
import { ChangeCard, type CardWithDetails } from "./change-card";
import type { Card } from "@/lib/db/schema";

interface Column {
  id: string;
  label: string;
  cards: CardWithDetails[];
}

export function KanbanBoard({ columns: initial }: { columns: Column[] }) {
  const [columns, setColumns] = useState(initial);
  const [activeCard, setActiveCard] = useState<CardWithDetails | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

  function handleDragStart(event: DragStartEvent) {
    const cardId = event.active.id as string;
    for (const col of columns) {
      const found = col.cards.find((c) => c.card.id === cardId);
      if (found) {
        setActiveCard(found);
        break;
      }
    }
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveCard(null);
    const { active, over } = event;
    if (!over) return;

    const cardId = active.id as string;
    const targetColId = over.id as string;
    const nextStatus = targetColId as Card["status"];

    // Find source column
    let sourceColId = "";
    for (const col of columns) {
      if (col.cards.find((c) => c.card.id === cardId)) {
        sourceColId = col.id;
        break;
      }
    }

    if (sourceColId === targetColId) return;

    // Optimistic update
    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === sourceColId) {
          return { ...col, cards: col.cards.filter((c) => c.card.id !== cardId) };
        }
        if (col.id === targetColId) {
          const movedCard = prev
            .find((c) => c.id === sourceColId)
            ?.cards.find((c) => c.card.id === cardId);
          if (movedCard) {
            return {
              ...col,
              cards: [
              ...col.cards,
                {
                  ...movedCard,
                  card: { ...movedCard.card, status: nextStatus },
                },
              ],
            };
          }
        }
        return col;
      })
    );

    // Persist to API
    try {
      await fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: targetColId }),
      });
    } catch (err) {
      console.error("Failed to update card status", err);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <SortableContext
            key={col.id}
            id={col.id}
            items={col.cards.map((c) => c.card.id)}
            strategy={verticalListSortingStrategy}
          >
            <KanbanColumn id={col.id} label={col.label} count={col.cards.length}>
              {col.cards.map((c) => (
                <ChangeCard key={c.card.id} data={c} />
              ))}
            </KanbanColumn>
          </SortableContext>
        ))}
      </div>

      <DragOverlay>
        {activeCard && <ChangeCard data={activeCard} isOverlay />}
      </DragOverlay>
    </DndContext>
  );
}
