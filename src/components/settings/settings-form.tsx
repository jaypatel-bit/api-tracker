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
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-4">
          Notifications
        </h2>
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">Daily email digest</p>
              <p className="text-xs text-gray-400">
                Summary of new changes delivered to your inbox
              </p>
            </div>
            <input
              type="checkbox"
              checked={prefs.emailDigestEnabled}
              onChange={(e) =>
                setPrefs({ ...prefs, emailDigestEnabled: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
          </label>

          {prefs.emailDigestEnabled && (
            <div className="pl-0">
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Digest delivery time
              </label>
              <select
                value={prefs.digestHourUtc}
                onChange={(e) =>
                  setPrefs({ ...prefs, digestHourUtc: Number(e.target.value) })
                }
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <p className="text-sm text-gray-700">Critical change alerts</p>
              <p className="text-xs text-gray-400">
                Instant email for critical severity changes
              </p>
            </div>
            <input
              type="checkbox"
              checked={prefs.criticalInstantEmail}
              onChange={(e) =>
                setPrefs({ ...prefs, criticalInstantEmail: e.target.checked })
              }
              className="h-4 w-4 rounded border-gray-300 text-blue-600"
            />
          </label>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
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
