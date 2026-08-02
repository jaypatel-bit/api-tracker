"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Radar } from "lucide-react";
import { signUp } from "@/lib/auth/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signUp.email({ name, email, password });
      if (result.error) {
        setError(result.error.message || "Could not create account");
      } else {
        router.push("/onboarding");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0b1f19,#17392f)] px-4 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[36px] border border-white/10 bg-white/8 backdrop-blur xl:grid-cols-[0.85fr_0.95fr]">
          <div className="bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.0))] p-8 text-white sm:p-10">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                <Radar className="h-5 w-5 text-[#97f2d6]" />
              </div>
              <div>
                <p className="text-xl font-semibold">APIRadar</p>
                <p className="text-sm text-white/58">
                  Change intelligence for marketing APIs
                </p>
              </div>
            </div>

            <h1 className="mt-12 max-w-lg text-4xl font-semibold tracking-[-0.04em]">
              Stand up a shared control center for API changes across your growth stack.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/68">
              Create a workspace, subscribe to the providers you rely on, and give analytics, engineering, and operations teams one place to triage risk.
            </p>

            <div className="mt-10 space-y-3">
              {[
                "Track deprecations and version sunsets",
                "Keep campaign and reporting systems aligned",
                "Deliver cleaner executive communication",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/10 bg-white/6 px-4 py-4 text-sm text-white/78"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[var(--surface)] p-8 sm:p-10">
            <div className="mx-auto max-w-md">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Create account
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                Start monitoring
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Set up your team workspace and begin with Google Analytics, Google Ads, Meta, or any providers you seed into the platform.
              </p>

              {error ? (
                <div className="mt-6 rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full rounded-[20px] border border-black/8 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-[20px] border border-black/8 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-[20px] border border-black/8 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    placeholder="Minimum 8 characters"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[var(--foreground)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? "Creating account..." : "Create workspace"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-[var(--muted)]">
                Already have an account?{" "}
                <Link href="/login" className="font-semibold text-[var(--accent-strong)]">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
