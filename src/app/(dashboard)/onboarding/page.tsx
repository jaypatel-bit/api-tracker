"use client";

import Image from "next/image";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, Radar } from "lucide-react";

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
      .then((response) => response.json())
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
    const requests = Array.from(selected).map((providerId) =>
      fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ providerId }),
      })
    );
    await Promise.all(requests);

    startTransition(() => {
      router.push("/board");
      router.refresh();
    });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[var(--accent)] border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl py-4">
      <div className="panel overflow-hidden rounded-[32px]">
        <div className="grid gap-0 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="bg-[linear-gradient(180deg,#10231c,#17382f)] p-8 text-white sm:p-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Radar className="h-5 w-5 text-[#97f2d6]" />
            </div>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#97f2d6]">
              Workspace setup
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-[-0.03em]">
              Choose the APIs you want APIRadar to watch first
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/68">
              Start with the providers that are closest to campaign delivery, attribution, and executive reporting. You can expand coverage later.
            </p>

            <div className="mt-10 space-y-4">
              {[
                "Get provider-specific change feeds",
                "Build a board from actual subscribed platforms",
                "Route critical updates into action faster",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/78">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">
                    <Check className="h-4 w-4 text-[#97f2d6]" />
                  </div>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 sm:p-10">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  Select providers
                </p>
                <p className="mt-2 text-sm text-[var(--muted)]">
                  Recommended: choose the platforms used by your reporting and activation workflows.
                </p>
              </div>
              <div className="rounded-full bg-[var(--accent-soft)] px-4 py-2 text-sm font-semibold text-[var(--accent-strong)]">
                {selected.size} selected
              </div>
            </div>

            <div className="mt-8 grid gap-3">
              {providers.map((provider) => {
                const isSelected = selected.has(provider.id);
                return (
                  <button
                    key={provider.id}
                    onClick={() => toggle(provider.id)}
                    className={`flex items-center gap-4 rounded-[24px] border p-4 text-left ${
                      isSelected
                        ? "border-[var(--accent)]/25 bg-[var(--accent-soft)]"
                        : "border-black/6 bg-white hover:border-black/12"
                    }`}
                  >
                    {provider.logoUrl ? (
                      <Image
                        src={provider.logoUrl}
                        alt={provider.name}
                        width={48}
                        height={48}
                        unoptimized
                        className="h-12 w-12 rounded-2xl border border-black/5 bg-white object-contain p-2"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent)]">
                        {provider.name.slice(0, 1)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[var(--foreground)]">
                        {provider.name}
                      </p>
                      <p className="mt-1 text-sm text-[var(--muted)] line-clamp-2">
                        {provider.description}
                      </p>
                    </div>
                    {isSelected ? (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--foreground)] text-white">
                        <Check className="h-4 w-4" />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => router.push("/board")}
                className="text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)]"
              >
                Skip and explore the board
              </button>
              <button
                onClick={handleSubmit}
                disabled={selected.size === 0 || isPending}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--foreground)] px-6 py-3 text-sm font-semibold text-white disabled:opacity-50"
              >
                {isPending ? "Setting up..." : "Start monitoring"}
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
