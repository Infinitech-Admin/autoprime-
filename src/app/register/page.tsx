// app/register/page.tsx

"use client";

import {
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Car,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
  X,
} from "lucide-react";
import { register, type ApiError } from "@/lib/api";

interface RegisterForm {
  name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
}

interface PasswordRules {
  length: boolean;
  lower: boolean;
  upper: boolean;
  number: boolean;
  symbol: boolean;
}

function checkRules(password: string): PasswordRules {
  return {
    length: password.length >= 10,
    lower: /[a-z]/.test(password),
    upper: /[A-Z]/.test(password),
    number: /\d/.test(password),
    symbol: /[^A-Za-z0-9]/.test(password),
  };
}

// Strict, RFC-5322-ish email pattern (no consecutive dots, valid domain, TLD required).
const EMAIL_REGEX =
  /^(?!.*\.\.)[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

// PH mobile format: exactly 11 digits, must start with "09" (e.g. 09171234567).
const PHONE_REGEX = /^09\d{9}$/;

function validateEmail(email: string): string {
  const trimmed = email.trim();
  if (!trimmed) return "Email is required.";
  if (trimmed.length > 254) return "Email is too long.";
  if (!EMAIL_REGEX.test(trimmed)) return "Enter a valid email address.";
  return "";
}

function validatePhone(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return ""; // optional field
  if (!PHONE_REGEX.test(trimmed)) {
    return "Phone must be exactly 11 digits and start with 09 (e.g. 09171234567).";
  }
  return "";
}

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState<RegisterForm>({
    name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const rules = useMemo(() => checkRules(form.password), [form.password]);
  const passwordsMatch =
    form.password_confirmation.length > 0 &&
    form.password === form.password_confirmation;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "phone") {
      // Digits only, capped at 11 — keeps the field impossible to
      // overtype past the valid PH mobile length.
      const digitsOnly = value.replace(/\D/g, "").slice(0, 11);
      setForm((prev) => ({ ...prev, phone: digitsOnly }));
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: validatePhone(digitsOnly) }));
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "email" && errors.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  }

  function handleBlur(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
    if (name === "phone") {
      setErrors((prev) => ({ ...prev, phone: validatePhone(value) }));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");

    const emailError = validateEmail(form.email);
    const phoneError = validatePhone(form.phone);

    if (emailError || phoneError) {
      setErrors((prev) => ({
        ...prev,
        ...(emailError ? { email: emailError } : { email: "" }),
        ...(phoneError ? { phone: phoneError } : { phone: "" }),
      }));
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const data = await register(form);
      router.push(
        `/verify-email?email=${encodeURIComponent(data.verification_email)}`,
      );
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr.errors) {
        const fieldErrors: Record<string, string> = {};
        for (const key in apiErr.errors) {
          fieldErrors[key] = apiErr.errors[key][0];
        }
        setErrors(fieldErrors);
      } else {
        setFormError(
          apiErr.message || "Unable to create your account. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-[#0d0d0d] via-[#22293a] to-[#0a0a0a] px-4 py-16">
      <div className="pointer-events-none absolute -top-24 -left-24 h-[420px] w-[420px] rounded-full bg-[#FFFFFF]/15 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 right-[-120px] h-[380px] w-[380px] rounded-full bg-[#E11D2E]/20 blur-[130px]" />
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
          <p className="mt-2 text-sm text-zinc-400">Create your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="rounded-2xl border border-white/10 bg-[#111111]/70 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-8"
        >
          <div className="mb-6 h-1 w-14 rounded-full bg-gradient-to-r from-[#E11D2E] to-[#FF3344]" />

          {formError && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {formError}
            </div>
          )}

          {/* Name */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400"
            >
              Full name
            </label>
            <div className="relative">
              <User
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#0a0a0a]/60 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#E11D2E]/60"
                placeholder="Juan Dela Cruz"
              />
            </div>
            {errors.name && (
              <p className="mt-1.5 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label
              htmlFor="phone"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400"
            >
              Phone{" "}
              <span className="normal-case text-zinc-600">(optional)</span>
            </label>
            <div className="relative">
              <Phone
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                id="phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={11}
                pattern="09\d{9}"
                value={form.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-xl border border-white/10 bg-[#0a0a0a]/60 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#E11D2E]/60"
                placeholder="09171234567"
              />
            </div>
            {errors.phone && (
              <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>
            )}
          </div>

          {/* Email */}
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
                onBlur={handleBlur}
                className="w-full rounded-xl border border-white/10 bg-[#0a0a0a]/60 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#E11D2E]/60"
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
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
                autoComplete="new-password"
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

            {form.password.length > 0 && (
              <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs">
                <RuleItem met={rules.length}>10+ characters</RuleItem>
                <RuleItem met={rules.upper && rules.lower}>
                  Upper &amp; lowercase
                </RuleItem>
                <RuleItem met={rules.number}>A number</RuleItem>
                <RuleItem met={rules.symbol}>A symbol</RuleItem>
              </ul>
            )}
          </div>

          {/* Confirm password */}
          <div className="mb-6">
            <label
              htmlFor="password_confirmation"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-zinc-400"
            >
              Confirm password
            </label>
            <div className="relative">
              <Lock
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
              />
              <input
                id="password_confirmation"
                name="password_confirmation"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={form.password_confirmation}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#0a0a0a]/60 py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 outline-none transition-colors focus:border-[#E11D2E]/60"
                placeholder="••••••••"
              />
            </div>
            {form.password_confirmation.length > 0 && !passwordsMatch && (
              <p className="mt-1.5 text-xs text-red-400">
                Passwords do not match.
              </p>
            )}
            {errors.password_confirmation && (
              <p className="mt-1.5 text-xs text-red-400">
                {errors.password_confirmation}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#E11D2E] to-[#FF3344] py-3.5 text-sm font-bold text-white transition-all duration-300 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="mt-6 text-center text-sm text-zinc-400">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-[#E11D2E] hover:text-[#FF3344]"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}

function RuleItem({ met, children }: { met: boolean; children: ReactNode }) {
  return (
    <li
      className={`flex items-center gap-1.5 ${met ? "text-red-400" : "text-zinc-500"}`}
    >
      {met ? <Check size={13} /> : <X size={13} />}
      {children}
    </li>
  );
}
