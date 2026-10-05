// app/login/page.tsx

"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { login, fetchMe, type ApiError } from "@/lib/api";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

// Where each role lands after signing in.
// Change "/" to "/dashboard" once customer accounts have their own dashboard.
const ROLE_REDIRECTS: Record<string, string> = {
  admin: "/admin",
  user: "/",
};

const DEFAULT_REDIRECT = "/";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormError("");
    setLoading(true);

    try {
      const data = await login(form);

      // Use the role from the login response; if the API doesn't return
      // the user there, fall back to /me (the session cookie is already set).
      // The redirect is only for UX — /admin must still be protected on the
      // server (middleware / layout) and in the API.
      const role = data?.user?.role ?? (await fetchMe()).user.role;

      // If we were sent here from a protected page (e.g. checkout), go back
      // there. Only same-site paths are allowed, to avoid open redirects.
      const redirectParam = new URLSearchParams(window.location.search).get(
        "redirect",
      );
      const safeRedirect =
        redirectParam &&
        redirectParam.startsWith("/") &&
        !redirectParam.startsWith("//")
          ? redirectParam
          : null;

      const destination =
        safeRedirect ?? ROLE_REDIRECTS[role] ?? DEFAULT_REDIRECT;

      router.push(destination);
      router.refresh();
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.errors) {
        const fieldErrors: Record<string, string> = {};
        for (const key in apiErr.errors) {
          fieldErrors[key] = apiErr.errors[key][0];
        }
        setErrors(fieldErrors);
      } else {
        setFormError(apiErr.message || "Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#0d0d0d] via-[#22293a] to-[#0a0a0a] px-4 py-16">
      {/* headlight-style glows instead of a flat black backdrop */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-[#FFFFFF]/15 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 right-[-120px] h-[380px] w-[380px] rounded-full bg-[#E11D2E]/20 blur-[130px]" />

      {/* faint asphalt / lane-marking texture */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, #fff 0 40px, transparent 40px 90px)",
          maskImage: "linear-gradient(to top, black, transparent)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-2xl font-black text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E11D2E]/15 text-[#E11D2E]">
              <Car size={20} />
            </span>
            Auto<span className="text-[#E11D2E]">Trade</span>
          </Link>
          <p className="mt-2 text-sm text-zinc-400">
            Sign in to find your next ride
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-white/10 bg-[#111111]/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8"
        >
          {/* amber accent bar, echoing a dashboard warning strip */}
          <div className="mb-6 h-1 w-14 rounded-full bg-gradient-to-r from-[#E11D2E] to-[#FF3344]" />

          {formError && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {formError}
            </div>
          )}

          <div className="mb-4">
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400"
            >
              Email
            </label>
            <div className="relative">
              <Mail
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#0a0a0a]/60 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#E11D2E]/60"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          <div className="mb-2">
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#0a0a0a]/60 py-3 pl-10 pr-11 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#E11D2E]/60"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 transition-colors hover:text-zinc-300"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1.5 text-xs text-red-400">{errors.password}</p>
            )}
          </div>

          <div className="mb-6 flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs text-zinc-400">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={handleChange}
                className="h-3.5 w-3.5 rounded border-white/20 bg-[#0a0a0a]/60 accent-[#E11D2E]"
              />
              Remember me
            </label>
            {/* <Link
              href="/forgot-password"
              className="text-xs font-medium text-[#E11D2E] hover:text-[#FF3344]"
            >
              Forgot password?
            </Link> */}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E11D2E] to-[#FF3344] py-3.5 text-sm font-bold text-white transition-all duration-300 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#E11D2E] hover:text-[#FF3344]"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
