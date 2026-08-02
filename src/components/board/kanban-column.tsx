"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface KanbanColumnProps {
  id: string;
  label: string;
  count: number;
  children: React.ReactNode;
}

export function KanbanColumn({ id, label, count, children }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-[20rem] flex-shrink-0 flex-col rounded-[28px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(244,247,242,0.95))] max-h-[calc(100vh-220px)] shadow-[0_20px_45px_rgba(16,35,28,0.06)]",
        isOver && "ring-2 ring-[var(--accent)]/35 bg-[linear-gradient(180deg,rgba(229,250,243,0.92),rgba(247,252,249,0.96))]"
      )}
    >
      <div className="flex items-center justify-between border-b border-black/5 px-4 py-4">
        <h3 className="text-sm font-semibold text-[var(--foreground)]">{label}</h3>
        <span className="rounded-full bg-[var(--foreground)] px-2.5 py-1 text-xs font-medium text-white">
          {count}
        </span>
      </div>
      <div className="flex-1 space-y-3 overflow-y-auto p-3">
        {count === 0 && (
          <p className="py-10 text-center text-xs text-[var(--muted)]">No cards</p>
        )}
        {children}
      </div>
    </div>
  );
}
