import Link from "next/link";
import { Radar, Shield, Zap, LayoutDashboard } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radar className="h-6 w-6 text-blue-600" />
            <span className="text-lg font-bold text-gray-900">APIRadar</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-3xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 mb-6">
          API Change Intelligence
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight mb-4">
          Never get blindsided by an API change again
        </h1>
        <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
          APIRadar monitors the APIs you depend on and tells you what changed,
          how serious it is, and what to do about it. Your command center for
          every API your product relies on.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link
            href="/signup"
            className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
          >
            Start monitoring for free
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-xl border border-gray-200 p-6">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Monitor</h3>
            <p className="text-sm text-gray-500">
              Track changelogs, docs, OpenAPI specs, and release notes from
              every API you depend on. Automatic detection every 4 hours.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <Zap className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Classify</h3>
            <p className="text-sm text-gray-500">
              AI classifies every change by type and severity. Breaking changes,
              deprecations, rate limit updates — all labeled and scored instantly.
            </p>
          </div>
          <div className="rounded-xl border border-gray-200 p-6">
            <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
              <LayoutDashboard className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Act</h3>
            <p className="text-sm text-gray-500">
              Drag cards through your workflow on a Kanban board. Assign to
              teammates, track progress, and never miss a critical change.
            </p>
          </div>
        </div>
      </section>

      {/* Providers */}
      <section className="border-t border-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-6">
            Monitoring changes from
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {["Stripe", "OpenAI", "Twilio", "Shopify", "GitHub"].map((name) => (
              <span key={name} className="text-lg font-semibold text-gray-300">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs text-gray-400">
            APIRadar — API Change Intelligence Platform
          </p>
        </div>
      </footer>
    </div>
  );
}
