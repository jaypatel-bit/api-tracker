"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn, SEVERITY_COLORS, CHANGE_TYPE_LABELS, timeAgo } from "@/lib/utils";
import type { Card, ChangeEvent, Provider } from "@/lib/db/schema";

export interface CardWithDetails {
  card: Card;
  event: ChangeEvent;
  provider: Provider;
}

interface ChangeCardProps {
  data: CardWithDetails;
  isOverlay?: boolean;
}

export function ChangeCard({ data, isOverlay }: ChangeCardProps) {
  const { card, event, provider } = data;

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "rounded-lg bg-white border border-gray-200 p-3 cursor-grab active:cursor-grabbing shadow-sm hover:shadow-md transition-shadow",
        isDragging && "opacity-50",
        isOverlay && "shadow-lg ring-2 ring-blue-400"
      )}
    >
      {/* Header: provider + severity */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          {provider.logoUrl && (
            <img
              src={provider.logoUrl}
              alt={provider.name}
              className="h-4 w-4 rounded-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <span className="text-xs font-medium text-gray-500">{provider.name}</span>
        </div>
        <span
          className={cn(
            "rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize",
            SEVERITY_COLORS[event.severity]
          )}
        >
          {event.severity}
        </span>
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">
        {event.title}
      </h4>

      {/* Summary */}
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">
        {event.summary}
      </p>

      {/* Footer: change type + time */}
      <div className="flex items-center justify-between">
        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
          {CHANGE_TYPE_LABELS[event.changeType] || event.changeType}
        </span>
        <span className="text-[10px] text-gray-400">
          {timeAgo(event.detectedAt)}
        </span>
      </div>
    </div>
  );
}
