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
      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50 ${
        isSubscribed
          ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
          : "bg-blue-600 text-white hover:bg-blue-700"
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
