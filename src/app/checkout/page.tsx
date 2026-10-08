// Path: app/checkout/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Copy, Loader2, Upload, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  btnLine,
  btnRed,
  card,
  display,
  fieldError,
  fieldInput,
  fieldLabel,
  focus,
  PageHero,
  StateBox,
} from "@/components/ui/prime";
import { useAuth } from "@/context/auth-context";
import { useCart } from "@/context/cart-context";
import { placeOrder, type ApiError } from "@/lib/api";

// ---------------------------------------------------------------------------
// ADJUST: payment settings
// ---------------------------------------------------------------------------
const DOWNPAYMENT_RATE = 0.2; // 20%, keep in sync with OrderController.php
const MAX_PROOF_SIZE_MB = 5;

const CHECKOUT_PATH = "/checkout";
const LOGIN_URL = `/login?redirect=${encodeURIComponent(CHECKOUT_PATH)}`;

type PaymentMethodId = "gcash" | "maya" | "bank";

const PAYMENT_METHODS: {
  id: PaymentMethodId;
  label: string;
  bankName?: string;
  accountName: string;
  accountNumber: string;
  copyValue: string;
}[] = [
  {
    id: "gcash",
    label: "GCash",
    accountName: "Justin De Castro",
    accountNumber: "0945 675 4591",
    copyValue: "09456754591",
  },
  {
    id: "maya",
    label: "Maya",
    accountName: "Justin De Castro",
    accountNumber: "0945 675 4591",
    copyValue: "09456754591",
  },
  {
    id: "bank",
    label: "Bank transfer",
    bankName: "YOUR BANK NAME", // ADJUST
    accountName: "Justin De Castro",
    accountNumber: "0000 0000 0000", // ADJUST
    copyValue: "000000000000", // ADJUST
  },
];
// ---------------------------------------------------------------------------

const getPriceValue = (price: string) => Number(price.replace(/[₱,]/g, ""));
const formatPrice = (value: number) =>
  `₱${value.toLocaleString("en-PH", { maximumFractionDigits: 0 })}`;

type FormState = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  notes: string;
  reference: string;
};
type ErrorKey = keyof FormState | "proof";

const initialForm: FormState = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
  reference: "",
};

const serverFieldMap: Record<string, ErrorKey> = {
  full_name: "fullName",
  email: "email",
  phone: "phone",
  address: "address",
  notes: "notes",
  payment_reference: "reference",
  payment_proof: "proof",
};

function Field({
  id,
  label,
  optional,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className={fieldLabel}>
        {label}
        {optional && <span className="ml-1.5 text-white/40">(optional)</span>}
      </label>
      {children}
      {error && <p className={fieldError}>{error}</p>}
    </div>
  );
}

// The three sections really are a sequence, so they stay numbered.
function Step({
  n,
  title,
  hint,
  children,
}: {
  n: number;
  title: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <section className={`${card} p-5 sm:p-8`}>
      <div className="flex items-center gap-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#E31B23] text-sm text-[#E31B23]">
          {n}
        </span>
        <div>
          <h2
            className={`${display} text-base font-light uppercase tracking-[0.14em]`}
          >
            {title}
          </h2>
          {hint && <p className="mt-1 text-sm text-white/55">{hint}</p>}
        </div>
      </div>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Shell({
  children,
  center,
}: {
  children: ReactNode;
  center?: boolean;
}) {
  return (
    <>
      <Navbar />
      <main
        className={`min-h-screen bg-[#161616] text-white ${center ? "flex items-center justify-center px-4 py-16" : ""}`}
      >
        {children}
      </main>
      <Footer />
    </>
  );
}

export default function CheckoutPage() {
  const { user } = useAuth();
  const { items, clearCart, isHydrated } = useCart();

  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<ErrorKey, string>>>({});
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paidAmount, setPaidAmount] = useState(0);
  const [submittedAsGuest, setSubmittedAsGuest] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>("gcash");
  const [proof, setProof] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState("");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    setForm((c) => ({
      ...c,
      fullName: c.fullName || user.name || "",
      email: c.email || user.email || "",
      phone: c.phone || user.phone || "",
    }));
  }, [user]);

  useEffect(() => {
    if (!proof) {
      setProofPreview("");
      return;
    }
    const url = URL.createObjectURL(proof);
    setProofPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [proof]);

  const total = useMemo(
    () => items.reduce((s, i) => s + getPriceValue(i.price) * i.quantity, 0),
    [items],
  );
  const downpayment = Math.round(total * DOWNPAYMENT_RATE);
  const balance = total - downpayment;
  const pct = Math.round(DOWNPAYMENT_RATE * 100);

  const selectedMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod)!;

  const handleChange =
    (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((c) => ({ ...c, [field]: e.target.value }));
      setErrors((c) => ({ ...c, [field]: undefined }));
    };

  const handleProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((c) => ({ ...c, proof: "Please upload an image file." }));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_PROOF_SIZE_MB * 1024 * 1024) {
      setErrors((c) => ({
        ...c,
        proof: `Image must be ${MAX_PROOF_SIZE_MB}MB or smaller.`,
      }));
      e.target.value = "";
      return;
    }
    setProof(file);
    setErrors((c) => ({ ...c, proof: undefined }));
  };

  const removeProof = () => {
    setProof(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(selectedMethod.copyValue);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard unavailable, ignore
    }
  };

  const validate = (): boolean => {
    const next: Partial<Record<ErrorKey, string>> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      next.email = "Enter a valid email address.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    if (!form.address.trim())
      next.address = "Delivery / pickup address is required.";
    if (!proof) next.proof = "Upload your payment screenshot.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (items.length === 0 || !validate() || !proof) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const data = new FormData();
      data.append("full_name", form.fullName.trim());
      data.append("email", form.email.trim());
      data.append("phone", form.phone.trim());
      data.append("address", form.address.trim());
      if (form.notes.trim()) data.append("notes", form.notes.trim());

      // Only ids + quantities. The server calculates prices and the 20%.
      items.forEach((item, i) => {
        data.append(`items[${i}][vehicle_id]`, String(item.id));
        data.append(`items[${i}][quantity]`, String(item.quantity));
      });

      data.append("payment_method", paymentMethod);
      if (form.reference.trim())
        data.append("payment_reference", form.reference.trim());
      data.append("payment_proof", proof);

      const result = await placeOrder(data);

      setSubmittedAsGuest(!user);
      setOrderNumber(result?.data?.order_number ?? "");
      setPaidAmount(Number(result?.data?.downpayment ?? downpayment));
      setIsSubmitted(true);
      clearCart();
    } catch (err) {
      const apiErr = err as ApiError;
      if (apiErr?.errors) {
        const fieldErrors: Partial<Record<ErrorKey, string>> = {};
        for (const [key, messages] of Object.entries(apiErr.errors)) {
          const field = serverFieldMap[key];
          if (field) fieldErrors[field] = messages[0];
        }
        setErrors(fieldErrors);
      }
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <Shell center>
        <div
          className={`${card} w-full max-w-lg border-t-[#E31B23] px-6 py-12 text-center sm:px-10`}
        >
          <h1
            className={`${display} text-2xl font-light uppercase tracking-[0.14em]`}
          >
            Order submitted
          </h1>

          {orderNumber && (
            <p className="mx-auto mt-6 w-fit border border-white/10 px-6 py-3 text-left">
              <span className="block text-xs text-white/50">Order number</span>
              <span className="block text-2xl text-[#E31B23]">
                {orderNumber}
              </span>
            </p>
          )}

          <p className="mt-6 text-sm leading-7 text-white/70">
            We&apos;ll verify your {formatPrice(paidAmount)} downpayment, then a
            sales advisor will contact you to confirm the next steps.
          </p>

          {submittedAsGuest && (
            <p className="mt-4 border border-white/10 px-4 py-3 text-xs leading-5 text-white/60">
              Save your order number. You&apos;ll need it, with the email you
              used, when you contact us about this order.
            </p>
          )}

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/showroom" className={btnRed}>
              Continue browsing
            </Link>
            <Link href="/" className={btnLine}>
              Back to home
            </Link>
          </div>
        </div>
      </Shell>
    );
  }

  if (!isHydrated) {
    return (
      <Shell>
        <div className="min-h-screen" />
      </Shell>
    );
  }

  if (items.length === 0) {
    return (
      <Shell center>
        <div className="w-full max-w-md">
          <StateBox>
            <h1
              className={`${display} text-xl font-light uppercase tracking-[0.14em]`}
            >
              Your cart is empty
            </h1>
            <p className="mt-2 text-sm text-white/55">
              Add a car to your cart before checking out.
            </p>
            <Link href="/showroom" className={`${btnRed} mt-6`}>
              Browse showroom
            </Link>
          </StateBox>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <PageHero
        back={{ href: "/cart", label: "Back to cart" }}
        title="Checkout"
      >
        {user ? (
          `Reserve your car with a ${pct}% downpayment.`
        ) : (
          <>
            Checking out as a guest, no account needed.{" "}
            <Link
              href={LOGIN_URL}
              className="text-[#E31B23] underline underline-offset-4 transition-colors hover:text-white"
            >
              Have an account? Log in
            </Link>
          </>
        )}
      </PageHero>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <Step
              n={1}
              title="Your details"
              hint="We use these to confirm your order."
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  id="fullName"
                  label="Full name"
                  error={errors.fullName}
                  className="sm:col-span-2"
                >
                  <input
                    id="fullName"
                    type="text"
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleChange("fullName")}
                    placeholder="Juan Dela Cruz"
                    aria-invalid={Boolean(errors.fullName)}
                    className={fieldInput}
                  />
                </Field>
                <Field id="email" label="Email" error={errors.email}>
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    onChange={handleChange("email")}
                    placeholder="you@email.com"
                    aria-invalid={Boolean(errors.email)}
                    className={fieldInput}
                  />
                </Field>
                <Field id="phone" label="Phone number" error={errors.phone}>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={handleChange("phone")}
                    placeholder="09XX XXX XXXX"
                    aria-invalid={Boolean(errors.phone)}
                    className={fieldInput}
                  />
                </Field>
                <Field
                  id="address"
                  label="Delivery / pickup address"
                  error={errors.address}
                  className="sm:col-span-2"
                >
                  <input
                    id="address"
                    type="text"
                    autoComplete="street-address"
                    value={form.address}
                    onChange={handleChange("address")}
                    placeholder="Street, City, Province"
                    aria-invalid={Boolean(errors.address)}
                    className={fieldInput}
                  />
                </Field>
                <Field
                  id="notes"
                  label="Notes"
                  optional
                  error={errors.notes}
                  className="sm:col-span-2"
                >
                  <textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={handleChange("notes")}
                    placeholder="Preferred schedule, financing questions, trade-in details..."
                    className={`${fieldInput} resize-none`}
                  />
                </Field>
              </div>
            </Step>

            <Step
              n={2}
              title={`Send the ${pct}% downpayment`}
              hint="Use any method below."
            >
              <div
                role="radiogroup"
                aria-label="Payment method"
                className="grid grid-cols-3 gap-2 sm:gap-3"
              >
                {PAYMENT_METHODS.map((m) => {
                  const active = m.id === paymentMethod;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => setPaymentMethod(m.id)}
                      className={`border px-3 py-3.5 text-sm tracking-[0.08em] transition-colors ${focus} ${
                        active
                          ? "border-[#E31B23] bg-[#E31B23] text-white"
                          : "border-white/20 hover:border-[#E31B23] hover:text-[#E31B23]"
                      }`}
                    >
                      {m.label}
                    </button>
                  );
                })}
              </div>

              <dl className="mt-5 space-y-3 border border-white/10 bg-[#161616] p-5 text-sm">
                {selectedMethod.bankName && (
                  <div className="flex items-center justify-between gap-4">
                    <dt className="text-white/55">Bank</dt>
                    <dd>{selectedMethod.bankName}</dd>
                  </div>
                )}
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-white/55">Account name</dt>
                  <dd>{selectedMethod.accountName}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-white/55">
                    {selectedMethod.id === "bank" ? "Account number" : "Number"}
                  </dt>
                  <dd className="flex items-center gap-2 text-lg">
                    {selectedMethod.accountNumber}
                    <button
                      type="button"
                      onClick={copyNumber}
                      aria-label="Copy account number"
                      className={`flex h-9 w-9 items-center justify-center border border-white/25 transition-colors hover:border-[#E31B23] hover:text-[#E31B23] ${focus}`}
                    >
                      {copied ? <Check size={15} /> : <Copy size={15} />}
                    </button>
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-t border-[#E31B23] pt-3">
                  <dt className="text-white/55">Amount to send</dt>
                  <dd className="text-2xl text-[#E31B23]">
                    {formatPrice(downpayment)}
                  </dd>
                </div>
              </dl>
            </Step>

            <Step
              n={3}
              title="Upload your receipt"
              hint="A screenshot of the payment confirmation."
            >
              <input
                ref={fileInputRef}
                id="proof"
                type="file"
                accept="image/*"
                onChange={handleProofChange}
                className="sr-only"
              />

              {proof ? (
                <div className="flex items-center gap-4 border border-white/10 bg-[#161616] p-3">
                  {proofPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={proofPreview}
                      alt="Payment screenshot preview"
                      className="h-20 w-20 shrink-0 object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 shrink-0 bg-[#1E1E1E]" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm">{proof.name}</p>
                    <p className="mt-1 text-xs text-white/50">
                      {(proof.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={removeProof}
                    aria-label="Remove screenshot"
                    className={`flex h-10 w-10 items-center justify-center border border-white/25 transition-colors hover:border-[#E31B23] hover:text-[#E31B23] ${focus}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className={`flex w-full flex-col items-center justify-center gap-2 border border-dashed px-4 py-10 text-sm transition-colors hover:border-[#E31B23] ${focus} ${
                    errors.proof
                      ? "border-[#FF4D55] text-[#FF4D55]"
                      : "border-white/25 text-white/70"
                  }`}
                >
                  <Upload size={22} className="text-[#E31B23]" />
                  Tap to upload screenshot
                  <span className="text-xs text-white/45">
                    JPG, PNG or WEBP, up to {MAX_PROOF_SIZE_MB}MB
                  </span>
                </button>
              )}
              {errors.proof && <p className={fieldError}>{errors.proof}</p>}

              <Field
                id="reference"
                label="Reference number"
                optional
                error={errors.reference}
                className="mt-5"
              >
                <input
                  id="reference"
                  type="text"
                  value={form.reference}
                  onChange={handleChange("reference")}
                  placeholder="e.g. GCash ref. no."
                  className={fieldInput}
                />
              </Field>
            </Step>

            <p className="border-l border-[#E31B23] pl-4 text-sm leading-6 text-white/65">
              Your order is confirmed once we verify your screenshot. We&apos;ll
              arrange the remaining {formatPrice(balance)} with your sales
              advisor.
            </p>

            {submitError && (
              <p
                role="alert"
                className="border border-[#FF4D55]/50 bg-[#FF4D55]/10 px-4 py-3 text-sm text-[#FFB3B7]"
              >
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`${btnRed} w-full disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40 disabled:hover:bg-white/10 disabled:hover:text-white/40`}
            >
              {isSubmitting && <Loader2 size={16} className="animate-spin" />}
              {isSubmitting
                ? "Submitting..."
                : `Submit order, ${formatPrice(downpayment)} downpayment`}
            </button>
          </form>

          <aside className={`${card} p-5 sm:p-7 lg:sticky lg:top-28`}>
            <h2
              className={`${display} text-lg font-light uppercase tracking-[0.14em]`}
            >
              Your order
            </h2>

            <ul className="mt-5 space-y-4 border-b border-white/10 pb-5">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <div className="relative h-14 w-20 shrink-0 overflow-hidden bg-[#161616]">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        unoptimized
                        className="object-contain p-1"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm uppercase tracking-[0.06em]">
                      {item.name}
                    </p>
                    <p className="text-xs text-white/50">Qty {item.quantity}</p>
                  </div>
                  <span className="shrink-0 text-sm">
                    {formatPrice(getPriceValue(item.price) * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/60">Total price</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/60">Balance ({100 - pct}%)</dt>
                <dd>{formatPrice(balance)}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-[#E31B23] pt-4">
                <dt>Due today ({pct}%)</dt>
                <dd className="text-2xl text-[#E31B23]">
                  {formatPrice(downpayment)}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </Shell>
  );
}
