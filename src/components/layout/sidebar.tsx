"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  KanbanSquare,
  Layers,
  Settings,
  Radar,
  LogOut,
} from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/board", label: "Board", icon: KanbanSquare },
  { href: "/providers", label: "Providers", icon: Layers },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="panel sticky top-4 z-40 flex flex-col overflow-hidden rounded-[28px] border border-[var(--border)] lg:h-[calc(100vh-2rem)] lg:w-72">
      <div className="border-b border-black/5 px-5 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,var(--accent),#6be3bc)] text-white shadow-lg shadow-emerald-950/15">
            <Radar className="h-5 w-5" />
          </div>
          <div>
            <span className="block text-lg font-semibold text-[var(--foreground)]">
              APIRadar
            </span>
            <span className="block text-xs text-[var(--muted)]">
              Marketing API intelligence
            </span>
          </div>
        </div>

        <div className="accent-ring mt-5 rounded-2xl bg-[linear-gradient(135deg,rgba(15,122,95,0.12),rgba(103,224,188,0.08))] p-4">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--accent-strong)]">
            <Activity className="h-3.5 w-3.5" />
            Live signal
          </div>
          <p className="mt-2 text-sm font-medium text-[var(--foreground)]">
            Watch for version shifts, deprecations, and silent policy changes before they reach production.
          </p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="px-3 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
          Workspace
        </p>
        <div className="space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium",
                active
                  ? "bg-[var(--foreground)] text-white shadow-lg shadow-emerald-950/10"
                  : "text-[var(--muted)] hover:bg-white/70 hover:text-[var(--foreground)]"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
        </div>
      </nav>

      <div className="border-t border-black/5 p-3">
        <button
          onClick={() => signOut().then(() => (window.location.href = "/login"))}
          className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium text-[var(--muted)] hover:bg-white/70 hover:text-[var(--foreground)]"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
