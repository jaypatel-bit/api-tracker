"use client";

import { useState } from "react";
import { Check } from "lucide-react";

interface SettingsFormProps {
  initialPrefs: {
    emailDigestEnabled: boolean;
    digestHourUtc: number;
    criticalInstantEmail: boolean;
  };
}

const HOURS = Array.from({ length: 24 }, (_, i) => {
  const hour = i % 12 || 12;
  const ampm = i < 12 ? "AM" : "PM";
  return { value: i, label: `${hour}:00 ${ampm} UTC` };
});

export function SettingsForm({ initialPrefs }: SettingsFormProps) {
  const [prefs, setPrefs] = useState(initialPrefs);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="panel rounded-[30px] p-6">
        <h2 className="mb-5 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          Notifications
        </h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Daily email digest</p>
              <p className="text-xs text-[var(--muted)]">
                Summary of new changes delivered to your inbox
              </p>
            </div>
            <input
              type="checkbox"
              checked={prefs.emailDigestEnabled}
              onChange={(e) =>
                setPrefs({ ...prefs, emailDigestEnabled: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-[var(--accent)]"
            />
          </label>

          {prefs.emailDigestEnabled && (
            <div className="pl-0">
              <label className="mb-2 block text-xs font-medium text-[var(--muted)]">
                Digest delivery time
              </label>
              <select
                value={prefs.digestHourUtc}
                onChange={(e) =>
                  setPrefs({ ...prefs, digestHourUtc: Number(e.target.value) })
                }
                className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm text-[var(--foreground)] outline-none focus:border-[var(--accent)]"
              >
                {HOURS.map((h) => (
                  <option key={h.value} value={h.value}>
                    {h.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--foreground)]">Critical change alerts</p>
              <p className="text-xs text-[var(--muted)]">
                Instant email for critical severity changes
              </p>
            </div>
            <input
              type="checkbox"
              checked={prefs.criticalInstantEmail}
              onChange={(e) =>
                setPrefs({ ...prefs, criticalInstantEmail: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-[var(--accent)]"
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
      >
        {saved ? (
          <>
            <Check className="h-4 w-4" /> Saved
          </>
        ) : saving ? (
          "Saving..."
        ) : (
          "Save preferences"
        )}
      </button>
    </div>
  );
}
