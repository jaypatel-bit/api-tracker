"use client";

import Image from "next/image";
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
        "cursor-grab rounded-[24px] border border-black/6 bg-white/90 p-4 shadow-[0_14px_30px_rgba(16,35,28,0.08)] active:cursor-grabbing",
        isDragging && "opacity-50",
        isOverlay && "ring-2 ring-[var(--accent)]/30"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {provider.logoUrl && (
            <Image
              src={provider.logoUrl}
              alt={provider.name}
              width={20}
              height={20}
              unoptimized
              className="h-5 w-5 rounded-full"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          )}
          <span className="text-xs font-medium text-[var(--muted)]">{provider.name}</span>
        </div>
        <span
          className={cn(
            "rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]",
            SEVERITY_COLORS[event.severity]
          )}
        >
          {event.severity}
        </span>
      </div>

      <h4 className="mb-2 line-clamp-2 text-sm font-semibold leading-6 text-[var(--foreground)]">
        {event.title}
      </h4>

      <p className="mb-4 line-clamp-3 text-xs leading-6 text-[var(--muted)]">
        {event.executiveSummary || event.summary}
      </p>

      <div className="flex items-center justify-between">
        <span className="rounded-full bg-black/4 px-2.5 py-1 text-[10px] font-medium text-[var(--muted)]">
          {CHANGE_TYPE_LABELS[event.changeType] || event.changeType}
        </span>
        <span className="text-[10px] text-[var(--muted)]">
          {timeAgo(event.detectedAt)}
        </span>
      </div>
    </div>
  );
}
