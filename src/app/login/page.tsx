// Path: app/login/page.tsx

"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { login, fetchMe, type ApiError } from "@/lib/api";
import {
  AuthShell,
  authAlertClass,
  authButtonClass,
  authErrorClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
} from "@/components/auth/auth-shell";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

// Where each role lands after signing in.
const ROLE_REDIRECTS: Record<string, string> = {
  admin: "/admin",
  user: "/",
};
const DEFAULT_REDIRECT = "/";

// Only same-site paths are allowed, to avoid open redirects.
function getSafeRedirect(): string | null {
  if (typeof window === "undefined") return null;
  const param = new URLSearchParams(window.location.search).get("redirect");
  return param && param.startsWith("/") && !param.startsWith("//")
    ? param
    : null;
}

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
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});
    setFormError("");
    setLoading(true);

    try {
      const data = await login(form);

      // Use the role from the login response; fall back to /me if missing.
      // The redirect is UX only: /admin must still be protected on the server.
      const role = data?.user?.role ?? (await fetchMe()).user.role;
      const destination =
        getSafeRedirect() ?? ROLE_REDIRECTS[role] ?? DEFAULT_REDIRECT;

      router.push(destination);
      router.refresh();
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.errors) {
        const fieldErrors: Record<string, string> = {};
        for (const key in apiErr.errors)
          fieldErrors[key] = apiErr.errors[key][0];
        setErrors(fieldErrors);
      } else {
        setFormError(apiErr.message || "Unable to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      headline="Your next car is waiting."
      blurb="Sign in to save cars, track your reservations and pick up where you left off."
    >
      <form onSubmit={handleSubmit} noValidate>
        <h1 className="text-3xl font-black uppercase leading-none text-white">
          Welcome back
        </h1>
        <p className="mb-7 mt-3 text-sm text-white/60">
          Sign in to your Auto-Prime Car Trading account.
        </p>

        {formError && (
          <div role="alert" className={authAlertClass}>
            {formError}
          </div>
        )}

        <div className="mb-5">
          <label htmlFor="email" className={authLabelClass}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={handleChange}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className={authInputClass}
            placeholder="you@example.com"
          />
          {errors.email && (
            <p id="email-error" className={authErrorClass}>
              {errors.email}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label htmlFor="password" className={authLabelClass}>
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`${authInputClass} pr-12`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-white/60 transition-colors hover:text-[#E31B23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#E31B23]"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p id="password-error" className={authErrorClass}>
              {errors.password}
            </p>
          )}
        </div>

        <div className="mb-7 flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-white/75">
            <input
              type="checkbox"
              name="remember"
              checked={form.remember}
              onChange={handleChange}
              className="h-4 w-4 accent-[#E31B23]"
            />
            Keep me signed in
          </label>
          {/* <Link href="/forgot-password" className={`text-sm ${authLinkClass}`}>
            Forgot password?
          </Link> */}
        </div>

        <button type="submit" disabled={loading} className={authButtonClass}>
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="mt-7 border-t border-white/10 pt-6 text-center text-sm text-white/65">
          New to Auto-Prime Car Trading?{" "}
          <Link href="/register" className={authLinkClass}>
            Create an account
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
