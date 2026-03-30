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
        "flex-shrink-0 w-72 rounded-xl bg-gray-100/80 border border-gray-200 flex flex-col max-h-[calc(100vh-180px)]",
        isOver && "ring-2 ring-blue-400 bg-blue-50/50"
      )}
    >
      <div className="flex items-center justify-between px-3 py-3 border-b border-gray-200/60">
        <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-medium text-gray-600">
          {count}
        </span>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {count === 0 && (
          <p className="text-center text-xs text-gray-400 py-8">No cards</p>
        )}
        {children}
      </div>
    </div>
  );
}
