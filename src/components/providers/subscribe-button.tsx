"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Bell, BellOff } from "lucide-react";

export function SubscribeButton({
  providerId,
  isSubscribed,
}: {
  providerId: string;
  isSubscribed: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    const method = isSubscribed ? "DELETE" : "POST";
    await fetch("/api/subscriptions", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ providerId }),
    });

    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold disabled:opacity-50 ${
        isSubscribed
          ? "border border-black/8 bg-white text-[var(--muted)] hover:text-[var(--foreground)]"
          : "bg-[var(--foreground)] text-white hover:bg-[var(--accent-strong)]"
      }`}
    >
      {isPending ? (
        <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : isSubscribed ? (
        <BellOff className="h-3 w-3" />
      ) : (
        <Bell className="h-3 w-3" />
      )}
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </button>
  );
}
