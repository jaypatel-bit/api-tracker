import { db } from "@/lib/db";
import { providers, changeEvents, subscriptions } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Clock } from "lucide-react";
import Link from "next/link";
import { cn, SEVERITY_COLORS, CHANGE_TYPE_LABELS, timeAgo } from "@/lib/utils";
import { SubscribeButton } from "@/components/providers/subscribe-button";
import { getServerSession } from "@/lib/auth/session";

async function getProvider(slug: string) {
  try {
    const results = await db
      .select()
      .from(providers)
      .where(eq(providers.slug, slug))
      .limit(1);
    return results[0] || null;
  } catch {
    return null;
  }
}

async function getChanges(providerId: string) {
  try {
    return await db
      .select()
      .from(changeEvents)
      .where(eq(changeEvents.providerId, providerId))
      .orderBy(desc(changeEvents.detectedAt))
      .limit(50);
  } catch {
    return [];
  }
}

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const provider = await getProvider(slug);
  if (!provider) return notFound();

  const session = await getServerSession();
  const changes = await getChanges(provider.id);

  const userSub = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.userId, session!.user.id),
        eq(subscriptions.providerId, provider.id)
      )
    )
    .limit(1);
  const isSubscribed = userSub.length > 0;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/providers"
        className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="h-3 w-3" /> Providers
      </Link>

      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        {provider.logoUrl && (
          <img
            src={provider.logoUrl}
            alt={provider.name}
            className="h-14 w-14 rounded-xl border border-gray-200"
          />
        )}
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">{provider.name}</h1>
            <SubscribeButton
              providerId={provider.id}
              isSubscribed={isSubscribed}
            />
          </div>
          <p className="text-sm text-gray-500 mt-1">{provider.description}</p>
          <div className="flex items-center gap-4 mt-2">
            {provider.website && (
              <a
                href={provider.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700"
              >
                <ExternalLink className="h-3 w-3" /> Website
              </a>
            )}
            {provider.lastFetchedAt && (
              <span className="inline-flex items-center gap-1 text-xs text-gray-400">
                <Clock className="h-3 w-3" /> Last synced {timeAgo(provider.lastFetchedAt)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Changes feed */}
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Recent Changes ({changes.length})
      </h2>

      {changes.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-gray-300 rounded-xl">
          <p className="text-sm text-gray-500">No changes detected yet.</p>
          <p className="text-xs text-gray-400 mt-1">
            Changes will appear here once the detection pipeline runs.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {changes.map((event) => (
            <div
              key={event.id}
              className="rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize",
                        SEVERITY_COLORS[event.severity]
                      )}
                    >
                      {event.severity}
                    </span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                      {CHANGE_TYPE_LABELS[event.changeType] || event.changeType}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-900">{event.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{event.summary}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {timeAgo(event.detectedAt)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
