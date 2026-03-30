"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-56 border-r border-gray-200 bg-white flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-2 px-5 py-5 border-b border-gray-100">
        <Radar className="h-6 w-6 text-blue-600" />
        <span className="text-lg font-bold text-gray-900">APIRadar</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-blue-50 text-blue-700"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t border-gray-100 p-3">
        <button
          onClick={() => signOut().then(() => (window.location.href = "/login"))}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
