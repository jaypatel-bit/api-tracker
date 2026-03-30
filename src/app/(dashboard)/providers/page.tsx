import { db } from "@/lib/db";
import { providers } from "@/lib/db/schema";
import Link from "next/link";
import { Layers, ExternalLink } from "lucide-react";

async function getProviders() {
  try {
    return await db.select().from(providers).orderBy(providers.name);
  } catch {
    return [];
  }
}

export default async function ProvidersPage() {
  const allProviders = await getProviders();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Providers</h1>
        <p className="text-sm text-gray-500 mt-1">
          API providers being monitored for changes.
        </p>
      </div>

      {allProviders.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-gray-300 rounded-xl">
          <Layers className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-1">No providers yet</p>
          <p className="text-xs text-gray-400">
            Connect your database and run the seed script to add providers.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {allProviders.map((p) => (
            <Link
              key={p.id}
              href={`/providers/${p.slug}`}
              className="block rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md hover:border-gray-300 transition-all"
            >
              <div className="flex items-start gap-3">
                {p.logoUrl && (
                  <img
                    src={p.logoUrl}
                    alt={p.name}
                    className="h-10 w-10 rounded-lg border border-gray-100"
                    onError={(e: any) => (e.target.style.display = "none")}
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{p.name}</h3>
                    {p.isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {p.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-[10px] text-gray-400">
                  Every {p.fetchIntervalHours}h
                </span>
                {p.website && (
                  <ExternalLink className="h-3 w-3 text-gray-400" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
