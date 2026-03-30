export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-1">Settings</h1>
      <p className="text-sm text-gray-500 mb-8">Manage your account and notification preferences.</p>

      <div className="max-w-xl space-y-6">
        {/* Notifications */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Notifications</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Daily email digest</p>
                <p className="text-xs text-gray-400">Summary of new changes every morning</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600" />
            </label>
            <label className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700">Critical change alerts</p>
                <p className="text-xs text-gray-400">Instant email for critical severity changes</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-600" />
            </label>
          </div>
        </div>

        {/* Account */}
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Account</h2>
          <p className="text-xs text-gray-400">
            Account management will be available in a future update.
          </p>
        </div>
      </div>
    </div>
  );
}
