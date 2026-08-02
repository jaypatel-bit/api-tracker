"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Radar } from "lucide-react";
import { signIn } from "@/lib/auth/client";
import { getAuthErrorMessage } from "@/lib/auth/error-message";
import { isPublicDemoMode } from "@/lib/demo";

export default function LoginPage() {
  const router = useRouter();
  const demoMode = isPublicDemoMode();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (demoMode) {
      router.push("/board");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const result = await signIn.email({ email, password });
      if (result.error) {
        setError(getAuthErrorMessage(result.error, "login"));
      } else {
        router.push("/board");
      }
    } catch (error) {
      setError(getAuthErrorMessage(error, "login"));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    if (demoMode) {
      router.push("/board");
      return;
    }

    try {
      await signIn.social({ provider: "google", callbackURL: "/board" });
    } catch (error) {
      setError(getAuthErrorMessage(error, "social"));
    }
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#0b1f19,#17392f)] px-4 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[36px] border border-white/10 bg-white/8 backdrop-blur xl:grid-cols-[0.95fr_0.8fr]">
          <div className="hidden xl:block">
            <div className="flex h-full flex-col justify-between bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.0))] p-10 text-white">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <Radar className="h-5 w-5 text-[#97f2d6]" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold">APIRadar</p>
                    <p className="text-sm text-white/58">
                      Change intelligence for growth infrastructure
                    </p>
                  </div>
                </div>

                <h1 className="mt-12 max-w-lg text-4xl font-semibold tracking-[-0.04em]">
                  Sign in to the workspace that watches your revenue-critical APIs.
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-white/68">
                  Keep Google Analytics, Google Ads, Meta, and the rest of your measurement stack under continuous review with one shared command center.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/6 p-6">
                <p className="text-sm font-medium text-white/84">
                  Teams use APIRadar to catch version sunsets, attribution changes, rate-limit updates, and docs shifts before stakeholders ask why dashboards changed.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-[var(--surface)] p-8 sm:p-10">
            <div className="mx-auto max-w-md">
              <div className="xl:hidden">
                <div className="mb-8 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--foreground)] text-white">
                    <Radar className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[var(--foreground)]">APIRadar</p>
                    <p className="text-xs text-[var(--muted)]">Change intelligence</p>
                  </div>
                </div>
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                Welcome back
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                Sign in
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
                Access your monitoring board, provider subscriptions, and notification settings.
              </p>

              {demoMode ? (
                <div className="mt-6 rounded-[22px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
                  Demo mode is on. You can use the buttons below to enter the sample workspace without creating an account.
                </div>
              ) : null}

              {error ? (
                <div className="mt-6 rounded-[22px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              ) : null}

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-[var(--foreground)]">
                    Email
                  </label>
                  <input
                    type="email"
                    required={!demoMode}
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
                    required={!demoMode}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-[20px] border border-black/8 bg-white px-4 py-3 text-sm outline-none focus:border-[var(--accent)]"
                    placeholder="Your password"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-full bg-[var(--foreground)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign in to APIRadar"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-black/8" />
                <span className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                  Or continue with
                </span>
                <div className="h-px flex-1 bg-black/8" />
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-[var(--foreground)]"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </button>

              <p className="mt-8 text-center text-sm text-[var(--muted)]">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="font-semibold text-[var(--accent-strong)]">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
