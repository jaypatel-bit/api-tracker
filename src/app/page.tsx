import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  ChartNoAxesCombined,
  Radar,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const FOCUSED_APIS = [
  {
    name: "Google Analytics",
    note: "Schema shifts, deprecations, and reporting surface changes.",
  },
  {
    name: "Google Ads",
    note: "Version sunsets, policy updates, and campaign endpoint churn.",
  },
  {
    name: "Meta APIs",
    note: "Marketing API changes, permissions updates, and webhook drift.",
  },
];

const FEATURE_CARDS = [
  {
    icon: Radar,
    title: "Continuously monitor release surfaces",
    body: "Track changelogs, docs, specs, and release notes across the platforms revenue teams depend on most.",
  },
  {
    icon: Sparkles,
    title: "Classify what actually matters",
    body: "Turn noisy release notes into executive summaries, impact labels, and suggested next actions for the right team.",
  },
  {
    icon: ShieldCheck,
    title: "Stay ahead of breakage",
    body: "Surface risky updates before campaigns, pipelines, dashboards, and automations quietly fall out of compliance.",
  },
];

const TIMELINE = [
  "Detect a version sunset in Google Ads documentation",
  "Summarize the impact on active integrations and reporting workflows",
  "Route the change into triage, ownership, and resolution tracking",
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[var(--background)]">
      <section className="relative isolate overflow-hidden bg-[linear-gradient(180deg,var(--hero),var(--hero-2))] text-white">
        <div className="hero-grid absolute inset-0 opacity-40" />
        <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(103,224,188,0.22),transparent_55%)]" />

        <header className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Radar className="h-5 w-5 text-[#8ff0d0]" />
            </div>
            <div>
              <span className="block text-lg font-semibold">APIRadar</span>
              <span className="block text-xs text-white/60">
                Change intelligence for marketing APIs
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/72 hover:text-white">
              Sign in
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[var(--hero)] hover:translate-y-[-1px]"
            >
              Start free
            </Link>
          </div>
        </header>

        <div className="relative z-10 mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-center">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-1.5 text-xs font-medium tracking-[0.16em] text-[#baf4e1] uppercase backdrop-blur">
              <BellRing className="h-3.5 w-3.5" />
              Built for high-change adtech stacks
            </div>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.02] tracking-[-0.04em] sm:text-6xl">
              Track API changes across Google Analytics, Google Ads, and Meta before they hit production.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/70">
              APIRadar gives growth, engineering, and data teams a shared control center for breaking changes, deprecations, version sunsets, and policy updates.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/signup"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#7ef0ca] px-6 py-3 text-sm font-semibold text-[#0a241d] hover:translate-y-[-1px]"
              >
                Launch your workspace
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/providers"
                className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/6 px-6 py-3 text-sm font-semibold text-white/90 backdrop-blur hover:bg-white/10"
              >
                See tracked providers
              </Link>
            </div>

            <div className="mt-12 grid gap-3 sm:grid-cols-3">
              {[
                ["4h", "Default monitoring cadence"],
                ["Critical", "Risk scoring for breaking updates"],
                ["Digest", "Daily executive summaries"],
              ].map(([value, label]) => (
                <div key={label} className="rounded-3xl border border-white/10 bg-white/6 p-4 backdrop-blur">
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="mt-1 text-sm text-white/60">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 rounded-[32px] bg-[radial-gradient(circle,rgba(126,240,202,0.22),transparent_60%)] blur-2xl" />
            <div className="relative rounded-[32px] border border-white/10 bg-white/8 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/8 bg-black/10 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-white/88">Signal board</p>
                  <p className="text-xs text-white/52">
                    August 2, 2026 snapshot
                  </p>
                </div>
                <span className="rounded-full bg-[#7ef0ca]/18 px-3 py-1 text-xs font-semibold text-[#a7f6dd]">
                  3 high-priority updates
                </span>
              </div>

              <div className="grid gap-3">
                {[
                  [
                    "Google Ads API v18 sunset window announced",
                    "Migration notice",
                    "High",
                  ],
                  [
                    "GA4 reporting dimensions adjusted for attribution exports",
                    "Behavior change",
                    "Medium",
                  ],
                  [
                    "Meta Marketing API permissions review copy updated",
                    "Docs change",
                    "Low",
                  ],
                ].map(([title, type, severity]) => (
                  <div
                    key={title}
                    className="rounded-3xl border border-white/8 bg-white/6 p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-white">{title}</p>
                        <p className="mt-1 text-xs text-white/52">{type}</p>
                      </div>
                      <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/76">
                        {severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-3xl border border-white/8 bg-[linear-gradient(135deg,rgba(126,240,202,0.12),rgba(255,255,255,0.04))] p-4">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#a7f6dd]">
                  Recommended next action
                </p>
                <p className="mt-2 text-sm leading-6 text-white/78">
                  Review your Google Ads version adoption plan and notify analytics stakeholders about report validation needs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
              Focused coverage
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-4xl">
              Designed for teams whose dashboards and campaigns depend on moving targets.
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {FOCUSED_APIS.map((api) => (
              <div key={api.name} className="stat-card rounded-[28px] p-5">
                <p className="text-sm font-semibold text-[var(--foreground)]">
                  {api.name}
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  {api.note}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-6 pb-20 lg:grid-cols-3">
        {FEATURE_CARDS.map((feature) => (
          <div key={feature.title} className="stat-card rounded-[30px] p-7">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
              <feature.icon className="h-5 w-5" />
            </div>
            <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
              {feature.title}
            </h3>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
              {feature.body}
            </p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
          <div className="panel rounded-[32px] p-7 sm:p-8">
            <div className="flex items-center gap-3 text-[var(--accent)]">
              <ChartNoAxesCombined className="h-5 w-5" />
              <p className="text-sm font-semibold uppercase tracking-[0.18em]">
                How teams use it
              </p>
            </div>

            <div className="mt-8 grid gap-5">
              {TIMELINE.map((item, index) => (
                <div key={item} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--foreground)] text-sm font-semibold text-white">
                      {index + 1}
                    </div>
                    {index < TIMELINE.length - 1 ? (
                      <div className="mt-3 h-full w-px bg-[linear-gradient(180deg,var(--accent),transparent)]" />
                    ) : null}
                  </div>
                  <p className="pt-1 text-base leading-7 text-[var(--foreground)]/86">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] bg-[linear-gradient(180deg,#0d211b,#14352d)] p-7 text-white shadow-2xl shadow-emerald-950/15">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#98f0d3]">
              Teams in the loop
            </p>
            <ul className="mt-6 space-y-4 text-sm text-white/70">
              <li>Growth engineering</li>
              <li>Paid media operations</li>
              <li>Analytics and BI</li>
              <li>Customer reporting teams</li>
            </ul>
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/6 p-5">
              <p className="text-sm font-medium text-white/88">
                Start with a focused provider set, then scale into broader API coverage as your monitoring workflow matures.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
