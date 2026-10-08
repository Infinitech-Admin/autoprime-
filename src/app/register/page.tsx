// Path: app/register/page.tsx

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
import { Check, Eye, EyeOff, Loader2, X } from "lucide-react";
import { register, type ApiError } from "@/lib/api";
import {
  AuthShell,
  authAlertClass,
  authButtonClass,
  authErrorClass,
  authInputClass,
  authLabelClass,
  authLinkClass,
} from "@/components/auth/auth-shell";

interface RegisterForm {
  name: string;
  phone: string;
  email: string;
  password: string;
  password_confirmation: string;
}

function checkRules(password: string) {
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

// PH mobile format: exactly 11 digits, must start with "09".
const PHONE_REGEX = /^09\d{9}$/;

function validateEmail(email: string): string {
  const t = email.trim();
  if (!t) return "Email is required.";
  if (t.length > 254) return "Email is too long.";
  if (!EMAIL_REGEX.test(t)) return "Enter a valid email address.";
  return "";
}

function validatePhone(phone: string): string {
  const t = phone.trim();
  if (!t) return ""; // optional field
  if (!PHONE_REGEX.test(t)) {
    return "Phone must be 11 digits and start with 09 (e.g. 09171234567).";
  }
  return "";
}

const STRENGTH = [
  { label: "Too weak", bar: "bg-[#8F1117]" },
  { label: "Weak", bar: "bg-[#8F1117]" },
  { label: "Fair", bar: "bg-[#E31B23]" },
  { label: "Good", bar: "bg-[#E31B23]" },
  { label: "Strong", bar: "bg-[#FFFFFF]" },
];

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
  const score = Object.values(rules).filter(Boolean).length;
  const passwordsMatch =
    form.password_confirmation.length > 0 &&
    form.password === form.password_confirmation;

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    if (name === "phone") {
      // Digits only, capped at 11.
      const digits = value.replace(/\D/g, "").slice(0, 11);
      setForm((prev) => ({ ...prev, phone: digits }));
      if (errors.phone) {
        setErrors((prev) => ({ ...prev, phone: validatePhone(digits) }));
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "email" && errors.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    } else if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
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
      setErrors({ email: emailError, phone: phoneError });
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
        for (const key in apiErr.errors)
          fieldErrors[key] = apiErr.errors[key][0];
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
    <AuthShell
      headline="Start your engine."
      blurb="Create an account to save cars, reserve a vehicle and sell or trade in your own."
    >
      <form onSubmit={handleSubmit} noValidate>
        <h1 className="text-3xl font-black uppercase leading-none text-white">
          Create your account
        </h1>
        <p className="mb-7 mt-3 text-sm text-white/60">
          It takes about a minute. We&apos;ll email you a code to verify.
        </p>

        {formError && (
          <div role="alert" className={authAlertClass}>
            {formError}
          </div>
        )}

        <div className="mb-5">
          <label htmlFor="name" className={authLabelClass}>
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            required
            value={form.name}
            onChange={handleChange}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className={authInputClass}
            placeholder="Juan Dela Cruz"
          />
          {errors.name && (
            <p id="name-error" className={authErrorClass}>
              {errors.name}
            </p>
          )}
        </div>

        <div className="mb-5 grid gap-5 sm:grid-cols-2">
          <div>
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
              onBlur={handleBlur}
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

          <div>
            <label htmlFor="phone" className={authLabelClass}>
              Phone{" "}
              <span className="font-normal text-white/45">(optional)</span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              maxLength={11}
              value={form.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={!!errors.phone}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={authInputClass}
              placeholder="09171234567"
            />
            {errors.phone && (
              <p id="phone-error" className={authErrorClass}>
                {errors.phone}
              </p>
            )}
          </div>
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
              autoComplete="new-password"
              required
              value={form.password}
              onChange={handleChange}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              className={`${authInputClass} pr-12`}
              placeholder="Create a password"
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

          {form.password.length > 0 && (
            <div className="mt-3 bg-[#0A0A0A] p-3 text-sm">
              <div className="flex items-center gap-3">
                <div className="flex flex-1 gap-1" aria-hidden>
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className={`h-1.5 flex-1 ${i < score ? STRENGTH[score - 1].bar : "bg-white/10"}`}
                    />
                  ))}
                </div>
                <span className="w-16 text-right text-xs font-bold text-white/80">
                  {score === 0 ? STRENGTH[0].label : STRENGTH[score - 1].label}
                </span>
              </div>
              <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5">
                <RuleItem met={rules.length}>10+ characters</RuleItem>
                <RuleItem met={rules.upper && rules.lower}>
                  Upper &amp; lowercase
                </RuleItem>
                <RuleItem met={rules.number}>A number</RuleItem>
                <RuleItem met={rules.symbol}>A symbol</RuleItem>
              </ul>
            </div>
          )}
        </div>

        <div className="mb-7">
          <label htmlFor="password_confirmation" className={authLabelClass}>
            Confirm password
          </label>
          <input
            id="password_confirmation"
            name="password_confirmation"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            value={form.password_confirmation}
            onChange={handleChange}
            aria-invalid={
              (form.password_confirmation.length > 0 && !passwordsMatch) ||
              !!errors.password_confirmation
            }
            className={authInputClass}
            placeholder="Re-enter your password"
          />
          {form.password_confirmation.length > 0 && !passwordsMatch && (
            <p className={authErrorClass}>Passwords do not match.</p>
          )}
          {errors.password_confirmation && (
            <p className={authErrorClass}>{errors.password_confirmation}</p>
          )}
        </div>

        <button type="submit" disabled={loading} className={authButtonClass}>
          {loading && <Loader2 size={16} className="animate-spin" />}
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-7 border-t border-white/10 pt-6 text-center text-sm text-white/65">
          Already have an account?{" "}
          <Link href="/login" className={authLinkClass}>
            Sign in
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}

function RuleItem({ met, children }: { met: boolean; children: ReactNode }) {
  return (
    <li
      className={`flex items-center gap-1.5 ${met ? "font-semibold text-white" : "text-white/50"}`}
    >
      {met ? (
        <Check size={14} aria-hidden className="text-[#E31B23]" />
      ) : (
        <X size={14} aria-hidden />
      )}
      {children}
      <span className="sr-only">{met ? " (met)" : " (not met)"}</span>
    </li>
  );
}
