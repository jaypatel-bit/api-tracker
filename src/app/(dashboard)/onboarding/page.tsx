"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Radar, Check } from "lucide-react";

interface Provider {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  description: string | null;
}

export default function OnboardingPage() {
  const router = useRouter();
  const [providers, setProviders] = useState<Provider[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/providers")
      .then((r) => r.json())
      .then((data) => {
        setProviders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit() {
    const promises = Array.from(selected).map((providerId) =>
      fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId }),
      })
    );
    await Promise.all(promises);

    startTransition(() => {
      router.push("/board");
      router.refresh();
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      <div className="text-center mb-8">
        <Radar className="h-10 w-10 text-blue-600 mx-auto mb-3" />
        <h1 className="text-2xl font-bold text-gray-900">
          Choose APIs to monitor
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Select the API providers you depend on. You&apos;ll get notified when
          they publish breaking changes, deprecations, or updates.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
        {providers.map((p) => {
          const isSelected = selected.has(p.id);
          return (
            <button
              key={p.id}
              onClick={() => toggle(p.id)}
              className={`flex items-center gap-3 rounded-xl border p-4 text-left transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-500"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              {p.logoUrl ? (
                <img
                  src={p.logoUrl}
                  alt={p.name}
                  className="h-10 w-10 rounded-lg border border-gray-100"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                  {p.name[0]}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900">{p.name}</p>
                <p className="text-xs text-gray-500 line-clamp-1">
                  {p.description}
                </p>
              </div>
              {isSelected && (
                <Check className="h-5 w-5 text-blue-600 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/board")}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Skip for now
        </button>
        <button
          onClick={handleSubmit}
          disabled={selected.size === 0 || isPending}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {isPending
            ? "Setting up..."
            : `Start monitoring ${selected.size > 0 ? `(${selected.size})` : ""}`}
        </button>
      </div>
    </div>
  );
}
