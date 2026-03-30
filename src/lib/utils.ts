import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return d.toLocaleDateString();
}

export const SEVERITY_COLORS: Record<string, string> = {
  critical: "bg-red-500/15 text-red-600 border-red-500/30",
  high: "bg-orange-500/15 text-orange-600 border-orange-500/30",
  medium: "bg-yellow-500/15 text-yellow-700 border-yellow-500/30",
  low: "bg-blue-500/15 text-blue-600 border-blue-500/30",
  informational: "bg-gray-500/15 text-gray-600 border-gray-500/30",
};

export const SEVERITY_DOT_COLORS: Record<string, string> = {
  critical: "bg-red-500",
  high: "bg-orange-500",
  medium: "bg-yellow-500",
  low: "bg-blue-500",
  informational: "bg-gray-400",
};

export const STATUS_LABELS: Record<string, string> = {
  new: "New",
  reviewed: "Reviewed",
  needs_action: "Needs Action",
  in_progress: "In Progress",
  resolved: "Resolved",
  ignored: "Ignored",
};

export const CHANGE_TYPE_LABELS: Record<string, string> = {
  breaking_change: "Breaking Change",
  deprecation: "Deprecation",
  new_endpoint: "New Endpoint",
  removed_endpoint: "Removed Endpoint",
  new_parameter: "New Parameter",
  removed_parameter: "Removed Parameter",
  enum_change: "Enum Change",
  auth_change: "Auth Change",
  rate_limit_change: "Rate Limit Change",
  webhook_change: "Webhook Change",
  sdk_release: "SDK Release",
  migration_notice: "Migration Notice",
  sunset_date: "Sunset Date",
  pricing_change: "Pricing Change",
  docs_change: "Docs Change",
  bug_fix: "Bug Fix",
  behavior_change: "Behavior Change",
  other: "Other",
};
