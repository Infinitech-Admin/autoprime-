// Path: app/sell-trade/page.tsx

"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  Phone,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";

import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import {
  btnLine,
  btnRed,
  card,
  CtaBand,
  display,
  fieldInput,
  PageHero,
} from "../../components/ui/prime";

const PHONE_DISPLAY = "0927 377 7182";
const PHONE_TEL = "+639273777182";

const paths = [
  { label: "Cash", note: "Sell your car outright" },
  { label: "Trade-in", note: "Put its value toward your next car" },
  { label: "Upgrade", note: "Move up to a better fit" },
];

// A real sequence, so these stay numbered.
const steps = [
  {
    title: "Tell us about your car",
    copy: "Share the make, model, mileage, condition, and your target timeline. We’ll match you with the best buyer or trade-in option.",
  },
  {
    title: "Get a fair offer",
    copy: "Our valuation experts compare current market demand, vehicle condition, and dealer pricing to price your car competitively.",
  },
  {
    title: "Close with confidence",
    copy: "Choose cash, trade-in, or an upgrade path and finalize the deal with transparent paperwork and no hidden surprises.",
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Honest guidance",
    description:
      "We believe the right purchase starts with transparency, clear information, and no pressure. Every recommendation is grounded in your needs, not just the inventory in front of us.",
  },
  {
    icon: BadgeCheck,
    title: "Quality first",
    description:
      "Every car we present is carefully inspected so you can move forward with confidence, whether you're buying your first car or upgrading for the next chapter.",
  },
  {
    icon: Users,
    title: "Client-focused service",
    description:
      "From showroom visits to financing conversations, our team works with patience and precision to make the process feel simple and personal.",
  },
  {
    icon: Sparkles,
    title: "Premium experience",
    description:
      "We combine standout vehicles with thoughtful service, creating a buying experience that feels polished, relaxed, and genuinely professional.",
  },
];

const conditionFactors: Record<string, number> = {
  Excellent: 1,
  Good: 0.82,
  Fair: 0.66,
};
const vehicleTypeFactors: Record<string, number> = {
  Sedan: 1,
  SUV: 1.15,
  Hatchback: 0.88,
  Truck: 1.2,
  Luxury: 1.2,
};

// Placeholder reference prices (PHP) for a brand-new, excellent-condition sedan.
const DEFAULT_BASE_PRICE = 900000;
const brandBasePrices: Record<string, number> = {
  suzuki: 800000,
  nissan: 900000,
  hyundai: 900000,
  kia: 900000,
  mitsubishi: 950000,
  honda: 1050000,
  toyota: 1100000,
  ford: 1100000,
  mazda: 1100000,
  isuzu: 1300000,
  subaru: 1300000,
  audi: 3000000,
  bmw: 3200000,
  lexus: 3200000,
  mercedes: 3400000,
  porsche: 6500000,
};

const getBasePrice = (brand: string) => {
  const normalized = brand.trim().toLowerCase();
  if (!normalized) return DEFAULT_BASE_PRICE;
  const match = Object.keys(brandBasePrices).find((key) =>
    normalized.includes(key),
  );
  return match ? brandBasePrices[match] : DEFAULT_BASE_PRICE;
};

const labelClass = "mb-2 block text-sm text-white/80";
const inputClass = `${fieldInput} h-12 !py-0`;
const selectClass = `${inputClass} appearance-none pr-10`;

type FormState = {
  brand: string;
  model: string;
  year: string;
  mileage: string;
  type: string;
  condition: string;
  fullName: string;
  phone: string;
  email: string;
};

type SubmitStatus = "idle" | "submitting" | "error" | "success";

const initialForm: FormState = {
  brand: "BMW",
  model: "5 Series",
  year: "2022",
  mileage: "18500",
  type: "Sedan",
  condition: "Excellent",
  fullName: "",
  phone: "",
  email: "",
};

export default function SellTradePage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const estimate = useMemo(() => {
    const currentYear = new Date().getFullYear();
    const yearValue = Number(form.year) || currentYear;
    const mileageValue = Number(form.mileage) || 0;
    const basePrice = getBasePrice(form.brand);
    const age = Math.max(currentYear - yearValue, 0);
    const ageFactor = Math.max(0.45, 1 - age * 0.06);
    const mileageFactor = Math.max(0.5, 1 - mileageValue / 220000);
    const typeFactor = vehicleTypeFactors[form.type] ?? 1;
    const conditionFactor = conditionFactors[form.condition] ?? 1;

    return Math.round(
      basePrice * typeFactor * conditionFactor * ageFactor * mileageFactor,
    );
  }, [form.brand, form.year, form.mileage, form.type, form.condition]);

  const rangeLow = Math.round(estimate * 0.9);
  const rangeHigh = Math.round(estimate * 1.12);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (status !== "submitting") setStatus("idle");
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "submitting") return;

    if (
      !form.brand.trim() ||
      !form.model.trim() ||
      !form.year ||
      form.mileage.trim() === "" ||
      !form.fullName.trim()
    ) {
      setErrorMessage("Please complete all required fields.");
      setStatus("error");
      return;
    }

    if (!form.phone.trim() && !form.email.trim()) {
      setErrorMessage("Please provide a phone number or an email address.");
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/sell-trade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: form.fullName.trim(),
          phone: form.phone.trim() || null,
          email: form.email.trim() || null,
          brand: form.brand.trim(),
          model: form.model.trim(),
          year: Number(form.year),
          mileage: Number(form.mileage),
          type: form.type,
          condition: form.condition,
          estimate,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        const firstError = data?.errors
          ? (Object.values(data.errors)[0] as string[])?.[0]
          : null;
        setErrorMessage(
          firstError ||
            data?.message ||
            "Something went wrong. Please try again.",
        );
        setStatus("error");
        return;
      }

      setStatus("success");
      setForm(initialForm);
    } catch {
      setErrorMessage("Unable to reach the server. Please try again.");
      setStatus("error");
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#161616] text-white">
        <PageHero
          tagline="CAR TRADING"
          title="Turn your car into your next upgrade"
        >
          Get a competitive offer for your vehicle, trade it in for a better
          fit, and move forward without the usual dealership pressure.
          <span className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <a href="#valuation" className={btnRed}>
              Get my estimate
            </a>
            <a
              href={`tel:${PHONE_TEL}`}
              className="flex items-center gap-3 text-sm text-white/60 transition-colors hover:text-white"
            >
              <Phone size={16} className="text-[#E31B23]" />
              Prefer to talk?{" "}
              <span className="text-white">{PHONE_DISPLAY}</span>
            </a>
          </span>
        </PageHero>

        {/* PATHS + HOW IT WORKS */}
        <section className="border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid divide-y divide-white/10 border border-white/10 md:grid-cols-3 md:divide-x md:divide-y-0">
              {paths.map((p) => (
                <div key={p.label} className="p-6">
                  <p
                    className={`${display} text-lg font-light uppercase tracking-[0.14em] text-[#E31B23]`}
                  >
                    {p.label}
                  </p>
                  <p className="mt-1 text-sm text-white/60">{p.note}</p>
                </div>
              ))}
            </div>

            <h2
              className={`${display} mt-16 text-2xl font-light uppercase tracking-[0.14em] sm:text-3xl`}
            >
              How it works
            </h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title} className={`${card} p-6`}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E31B23] text-sm text-[#E31B23]">
                    {index + 1}
                  </span>
                  <h3 className="mt-5 text-lg">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    {step.copy}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* VEHICLE DETAILS + ESTIMATE */}
        <section id="valuation" className="scroll-mt-24">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <form
              onSubmit={handleSubmit}
              className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start"
            >
              <div className={card}>
                <div className="border-b border-white/10 px-5 py-6 sm:px-7">
                  <h2
                    className={`${display} text-xl font-light uppercase tracking-[0.14em]`}
                  >
                    Tell us about your car
                  </h2>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                    Enter your vehicle details to receive an estimated market
                    value.
                  </p>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block">
                      <span className={labelClass}>Brand *</span>
                      <input
                        type="text"
                        name="brand"
                        value={form.brand}
                        onChange={handleChange}
                        placeholder="e.g. BMW"
                        required
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Model *</span>
                      <input
                        type="text"
                        name="model"
                        value={form.model}
                        onChange={handleChange}
                        placeholder="e.g. 5 Series"
                        required
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Year *</span>
                      <input
                        type="number"
                        name="year"
                        min="2000"
                        max="2035"
                        value={form.year}
                        onChange={handleChange}
                        placeholder="2023"
                        required
                        className={inputClass}
                      />
                    </label>
                    <label className="block">
                      <span className={labelClass}>Vehicle type *</span>
                      <div className="relative">
                        <select
                          name="type"
                          value={form.type}
                          onChange={handleChange}
                          className={selectClass}
                        >
                          <option>Sedan</option>
                          <option>SUV</option>
                          <option>Hatchback</option>
                          <option>Truck</option>
                          <option>Luxury</option>
                        </select>
                        <ChevronDown
                          size={18}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#E31B23]"
                        />
                      </div>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Mileage *</span>
                      <div className="relative">
                        <input
                          type="number"
                          name="mileage"
                          min="0"
                          value={form.mileage}
                          onChange={handleChange}
                          placeholder="18,500"
                          required
                          className={`${inputClass} pr-14`}
                        />
                        <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-white/50">
                          KM
                        </span>
                      </div>
                    </label>
                    <label className="block">
                      <span className={labelClass}>Condition *</span>
                      <div className="relative">
                        <select
                          name="condition"
                          value={form.condition}
                          onChange={handleChange}
                          className={selectClass}
                        >
                          <option>Excellent</option>
                          <option>Good</option>
                          <option>Fair</option>
                        </select>
                        <ChevronDown
                          size={18}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#E31B23]"
                        />
                      </div>
                    </label>
                  </div>

                  <div className="mt-8 border-t border-white/10 pt-7">
                    <h3
                      className={`${display} text-base font-light uppercase tracking-[0.14em]`}
                    >
                      Contact details
                    </h3>
                    <p className="mt-2 text-sm text-white/50">
                      So our team can reach you. Phone or email is required.
                    </p>

                    <div className="mt-5 grid gap-5 sm:grid-cols-2">
                      <label className="block sm:col-span-2">
                        <span className={labelClass}>Full name *</span>
                        <input
                          type="text"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="Juan Dela Cruz"
                          autoComplete="name"
                          required
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className={labelClass}>Phone</span>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="09XX XXX XXXX"
                          autoComplete="tel"
                          className={inputClass}
                        />
                      </label>
                      <label className="block">
                        <span className={labelClass}>Email</span>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className={inputClass}
                        />
                      </label>
                    </div>
                  </div>

                  <p className="mt-7 border-l border-white/25 pl-4 text-xs leading-5 text-white/55">
                    Your final offer may vary depending on inspection results,
                    vehicle history, documentation, and current market
                    conditions.
                  </p>
                </div>
              </div>

              <div className={`${card} lg:sticky lg:top-28`}>
                <div className="p-5 sm:p-7">
                  <h2
                    className={`${display} text-xl font-light uppercase tracking-[0.14em]`}
                  >
                    Your car value
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-white/55">
                    A preliminary estimate based on your vehicle information.
                  </p>

                  <div className="mt-6 border-y border-[#E31B23] py-6">
                    <p className="text-sm text-white/55">
                      Estimated market value
                    </p>
                    <p className="mt-3 break-words text-4xl font-light sm:text-5xl">
                      ₱{estimate.toLocaleString()}
                    </p>
                    <p className="mt-2 text-xs text-white/45">
                      Updates as you type. Subject to inspection.
                    </p>
                  </div>

                  <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <dt className="text-xs text-white/45">Market range</dt>
                      <dd className="mt-1">
                        ₱{rangeLow.toLocaleString()} to ₱
                        {rangeHigh.toLocaleString()}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-white/45">
                        Vehicle condition
                      </dt>
                      <dd className="mt-1">{form.condition}</dd>
                    </div>
                  </dl>

                  <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6">
                    <button
                      type="submit"
                      disabled={status === "submitting"}
                      className={`${btnRed} disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40 disabled:hover:bg-white/10 disabled:hover:text-white/40`}
                    >
                      {status === "submitting"
                        ? "Submitting..."
                        : "Submit for review"}
                    </button>
                    <Link href="/showroom" className={btnLine}>
                      View showroom
                    </Link>
                  </div>

                  {status === "error" && (
                    <p
                      role="alert"
                      className="mt-4 border border-[#FF4D55]/50 bg-[#FF4D55]/10 px-4 py-3 text-sm text-[#FFB3B7]"
                    >
                      {errorMessage}
                    </p>
                  )}
                  {status === "success" && (
                    <p
                      role="status"
                      className="mt-4 border border-white/30 px-4 py-3 text-sm"
                    >
                      Thanks! Your vehicle details were submitted. Our team will
                      contact you soon.
                    </p>
                  )}
                  {(status === "idle" || status === "submitting") && (
                    <p className="mt-4 text-xs leading-5 text-white/45">
                      Submit your vehicle details for our team to review your
                      estimate.
                    </p>
                  )}
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* WHY US */}
        <section className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <h2
              className={`${display} max-w-3xl text-2xl font-light uppercase leading-snug tracking-[0.14em] sm:text-3xl`}
            >
              A car buying experience built around you
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {values.map(({ icon: Icon, title, description }) => (
                <div
                  key={title}
                  className={`${card} p-6 transition-colors hover:border-[#E31B23]`}
                >
                  <Icon
                    size={24}
                    strokeWidth={1.5}
                    className="text-[#E31B23]"
                  />
                  <h3 className="mt-5 text-lg">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
