// Path: app/contact/page.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  X,
} from "lucide-react";

import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";

/*
  Auto-Prime Car Trading palette
  dark #0A0A0A | page #000000 | panel #141414 | input #1A1A1A (focus #262626)
  maroon #8F1117 | gold #E31B23 | cream #FFFFFF | card #F5F5F5
*/

// ---------------------------------------------------------------------------
// Business details
// Anything left empty is hidden automatically instead of showing placeholders.
// TODO: fill in HOURS when you have the schedule.
// TODO: confirm the address is still correct for Auto-Prime Car Trading.
// ---------------------------------------------------------------------------
const BUSINESS_NAME = "Auto-Prime Car Trading";
const FACEBOOK_URL = "https://www.facebook.com/autoprimecartrading/";
const ADDRESS_LINE_1 = "Leo Alejandrino St, BF Resort,";
const ADDRESS_LINE_2 = "Las Piñas City, Philippines 1747";
const PHONE_DISPLAY = "0927 377 7182";
const PHONE_TEL = "+639273777182";
const EMAIL = "shirleyprimesdisplay@yahoo.com";
const HOURS: { day: string; time: string }[] = [
  // { day: "Monday - Saturday", time: "9:00 AM - 6:00 PM" },
];

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS_NAME}, ${ADDRESS_LINE_1}, ${ADDRESS_LINE_2}`,
)}`;

const contactOptions = [
  {
    icon: MessageCircle,
    title: "Message us on Facebook",
    value: BUSINESS_NAME,
    href: FACEBOOK_URL,
  },
  {
    icon: MapPin,
    title: "Visit us",
    value: `${ADDRESS_LINE_1} ${ADDRESS_LINE_2}`,
    href: MAPS_URL,
  },
  ...(PHONE_DISPLAY && PHONE_TEL
    ? [
        {
          icon: Phone,
          title: "Call us",
          value: PHONE_DISPLAY,
          href: `tel:${PHONE_TEL}`,
        },
      ]
    : []),
  ...(EMAIL
    ? [
        {
          icon: Mail,
          title: "Email",
          value: EMAIL,
          href: `mailto:${EMAIL}`,
        },
      ]
    : []),
];

const privacyCopy = {
  title: "Privacy Policy",
  body: [
    `At ${BUSINESS_NAME}, we value your trust and are committed to protecting your personal information. We collect details you provide when contacting us, requesting a valuation, or browsing our inventory.`,
    "This information may be used to respond to enquiries, process vehicle transactions, improve our services, and communicate relevant updates. We do not sell your personal data to third parties for marketing purposes.",
    "We may use secure third-party tools to help operate our website, manage customer interactions, and improve the user experience. These partners are expected to handle your information with appropriate safeguards.",
    "You have the right to request access to, correction of, or deletion of your personal data, subject to legal and operational requirements. If you have any concerns, please contact our team directly.",
  ],
};

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  lookingFor: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormData | "privacy", string>>;

const emptyForm: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  lookingFor: "",
  message: "",
};

// Laravel snake_case field -> form field
const serverFieldMap: Record<string, keyof FormData> = {
  first_name: "firstName",
  last_name: "lastName",
  email: "email",
  phone: "phone",
  looking_for: "lookingFor",
  message: "message",
};

// Mirrors the Laravel rules. The server is the source of truth; this is just for fast feedback.
const NAME_PATTERN = new RegExp("^[\\p{L}\\p{M}\\s.'’-]+$", "u");
// PH mobile number: exactly 11 digits, starts with 09
const PHONE_PATTERN = /^09\d{9}$/;

const ringDark =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E31B23]";
const ringLight =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A0A0A]";

// Dark inputs on a dark card. Gold border on focus, red on error.
const inputClass =
  "w-full border-2 border-[#FFFFFF]/15 bg-[#1A1A1A] px-4 py-3.5 text-[#FFFFFF] placeholder:text-[#FFFFFF]/35 transition-colors focus:border-[#E31B23] focus:bg-[#262626] focus:outline-none aria-[invalid=true]:border-[#FF4D55]";

// Label + input + error message
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-sm font-semibold text-[#FFFFFF]">
        {label}
        {required ? (
          <span className="text-[#E31B23]" aria-label="required">
            *
          </span>
        ) : null}
      </span>
      {children}
      {error ? (
        <span className="mt-2 block text-sm font-medium text-[#FF4D55]">
          {error}
        </span>
      ) : null}
    </label>
  );
}

export default function Contact() {
  const [acceptedPrivacy, setAcceptedPrivacy] = useState(false);
  const [privacyError, setPrivacyError] = useState("");
  const [activeModal, setActiveModal] = useState<"privacy" | null>(null);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleFieldChange = (field: keyof FormData, value: string) => {
    // Phone: digits only, max 11
    const nextValue =
      field === "phone" ? value.replace(/\D/g, "").slice(0, 11) : value;

    setFormData((current) => ({ ...current, [field]: nextValue }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const validateForm = () => {
    const nextErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      nextErrors.firstName = "First name is required.";
    } else if (!NAME_PATTERN.test(formData.firstName.trim())) {
      nextErrors.firstName = "First name contains invalid characters.";
    }

    if (!formData.lastName.trim()) {
      nextErrors.lastName = "Last name is required.";
    } else if (!NAME_PATTERN.test(formData.lastName.trim())) {
      nextErrors.lastName = "Last name contains invalid characters.";
    }

    if (!formData.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!formData.phone.trim()) {
      nextErrors.phone = "Phone number is required.";
    } else if (!PHONE_PATTERN.test(formData.phone.trim())) {
      nextErrors.phone = "Enter an 11-digit mobile number starting with 09.";
    }

    if (!formData.message.trim()) {
      nextErrors.message = "Please include a brief message.";
    } else if (formData.message.trim().length < 10) {
      nextErrors.message =
        "Please include a brief message (at least 10 characters).";
    }

    if (!acceptedPrivacy) {
      nextErrors.privacy =
        "Please agree to the privacy policy before submitting your enquiry.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus(null);

    if (!validateForm()) {
      return;
    }

    setPrivacyError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: formData.firstName.trim(),
          last_name: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          looking_for: formData.lookingFor.trim() || null,
          message: formData.message.trim(),
          privacy_accepted: acceptedPrivacy,
          website: honeypot,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok) {
        setFormData(emptyForm);
        setHoneypot("");
        setAcceptedPrivacy(false);
        setErrors({});
        setStatus({
          type: "success",
          message: data.message ?? "Thank you! Your enquiry has been received.",
        });
        return;
      }

      if (res.status === 422 && data.errors) {
        const serverErrors: FormErrors = {};
        Object.entries(data.errors as Record<string, string[]>).forEach(
          ([key, messages]) => {
            if (key === "privacy_accepted") {
              serverErrors.privacy = messages[0];
              return;
            }

            const field = serverFieldMap[key];
            if (field) {
              serverErrors[field] = messages[0];
            }
          },
        );
        setErrors(serverErrors);
        setStatus({
          type: "error",
          message: "Please fix the highlighted fields and try again.",
        });
        return;
      }

      setStatus({
        type: "error",
        message:
          res.status === 429
            ? "Too many attempts. Please wait a minute and try again."
            : (data.message ?? "Something went wrong. Please try again."),
      });
    } catch {
      setStatus({
        type: "error",
        message: "Unable to send your enquiry. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0A0A0A] text-[#FFFFFF]">
        {/* HEADER */}
        <section className="relative overflow-hidden bg-[#0A0A0A]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 top-0 hidden h-full w-72 -skew-x-12 bg-[#8F1117] lg:block"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 top-0 hidden h-full w-6 -skew-x-12 bg-[#E31B23] lg:block"
          />

          <div className="relative mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-8 lg:py-24 xl:pr-40 2xl:pr-8">
            <div className="lg:min-w-0 lg:flex-1">
              <div className="max-w-4xl border-l-8 border-[#E31B23] pl-5 sm:pl-8">
                <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tight sm:text-6xl lg:text-8xl">
                  Let&apos;s talk cars.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-7 text-[#FFFFFF]/70 sm:text-lg">
                  Tell us what you&apos;re looking for, and our team will guide
                  you toward a vehicle that fits your life, your budget, and
                  your driving style. Buying, selling, or trading in, we&apos;re
                  happy to help.
                </p>
              </div>
            </div>

            {/* Right side: what you can do + direct line */}
            <div className="w-full border-t-4 border-[#E31B23] bg-[#141414] lg:w-[400px] lg:shrink-0">
              <div className="p-6 sm:p-7">
                <h2 className="text-2xl font-bold uppercase">
                  How can we help?
                </h2>

                <ul className="mt-5 divide-y divide-[#FFFFFF]/10 border-y border-[#FFFFFF]/10">
                  {[
                    {
                      label: "Buy a car",
                      note: "Browse the showroom",
                      href: "/showroom",
                    },
                    {
                      label: "Sell your car",
                      note: "Get your car valued",
                      href: "/sell-trade",
                    },
                    {
                      label: "Trade in",
                      note: "Swap up to your next ride",
                      href: "/sell-trade",
                    },
                  ].map((item) => (
                    <li key={item.label}>
                      <Link
                        href={item.href}
                        className={`group flex items-center justify-between gap-4 py-4 transition-colors hover:text-[#E31B23] ${ringDark}`}
                      >
                        <span>
                          <span className="block text-lg font-bold uppercase leading-tight">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-sm text-[#FFFFFF]/55">
                            {item.note}
                          </span>
                        </span>
                        <ArrowRight
                          size={20}
                          className="shrink-0 text-[#E31B23] transition-transform group-hover:translate-x-1"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>

                {PHONE_DISPLAY && PHONE_TEL ? (
                  <a
                    href={`tel:${PHONE_TEL}`}
                    className={`mt-6 flex items-center gap-4 bg-[#E31B23] px-5 py-4 text-[#0A0A0A] transition-colors hover:bg-[#FFFFFF] ${ringDark}`}
                  >
                    <Phone size={22} className="shrink-0" />
                    <span>
                      <span className="block text-xs font-semibold opacity-80">
                        Call or text us
                      </span>
                      <span className="block text-2xl font-black leading-none">
                        {PHONE_DISPLAY}
                      </span>
                    </span>
                  </a>
                ) : null}

                <a
                  href={MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex items-start gap-3 text-sm text-[#FFFFFF]/70 transition-colors hover:text-[#FFFFFF]"
                >
                  <MapPin
                    size={18}
                    className="mt-0.5 shrink-0 text-[#E31B23]"
                  />
                  <span>
                    {ADDRESS_LINE_1} {ADDRESS_LINE_2}
                  </span>
                </a>
              </div>
            </div>
          </div>
          <div aria-hidden="true" className="tread" />
        </section>

        {/* QUICK CONTACT: cream strip, dark icon blocks */}
        <section className="bg-[#FFFFFF] text-[#0A0A0A]">
          <ul className="mx-auto grid max-w-7xl divide-[#0A0A0A]/10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x">
            {contactOptions.map(({ icon: Icon, title, value, href }) => (
              <li key={title}>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    href.startsWith("http") ? "noopener noreferrer" : undefined
                  }
                  className={`group flex h-full items-start gap-4 border-t-4 border-transparent px-5 py-6 transition-colors hover:border-[#8F1117] hover:bg-[#F5F5F5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#0A0A0A] sm:px-6`}
                >
                  <span className="chamfer flex h-11 w-11 shrink-0 items-center justify-center bg-[#0A0A0A] text-[#E31B23] transition-colors group-hover:bg-[#8F1117]">
                    <Icon size={20} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-[#0A0A0A]/65">
                      {title}
                    </span>
                    <span className="mt-1 block break-words text-base font-bold text-[#0A0A0A]">
                      {value}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </section>

        {/* FORM + SIDE PANEL */}
        <section className="bg-[#000000]">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-14">
              <div className="border-t-4 border-[#E31B23] bg-[#141414] p-6 sm:p-10">
                <h2 className="flex items-center gap-3 text-3xl font-black uppercase sm:text-4xl">
                  <Send size={26} className="text-[#E31B23]" />
                  Send an enquiry
                </h2>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="First name" required error={errors.firstName}>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(event) =>
                          handleFieldChange("firstName", event.target.value)
                        }
                        maxLength={100}
                        autoComplete="given-name"
                        placeholder="John"
                        aria-invalid={Boolean(errors.firstName)}
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Last name" required error={errors.lastName}>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(event) =>
                          handleFieldChange("lastName", event.target.value)
                        }
                        maxLength={100}
                        autoComplete="family-name"
                        placeholder="Smith"
                        aria-invalid={Boolean(errors.lastName)}
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Email" required error={errors.email}>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(event) =>
                          handleFieldChange("email", event.target.value)
                        }
                        maxLength={255}
                        autoComplete="email"
                        placeholder="john@email.com"
                        aria-invalid={Boolean(errors.email)}
                        className={inputClass}
                      />
                    </Field>

                    <Field label="Phone" required error={errors.phone}>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(event) =>
                          handleFieldChange("phone", event.target.value)
                        }
                        maxLength={11}
                        minLength={11}
                        pattern="09[0-9]{9}"
                        autoComplete="tel"
                        inputMode="numeric"
                        placeholder="09123456789"
                        title="11-digit mobile number starting with 09"
                        aria-invalid={Boolean(errors.phone)}
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field label="Looking for" error={errors.lookingFor}>
                    <input
                      type="text"
                      value={formData.lookingFor}
                      onChange={(event) =>
                        handleFieldChange("lookingFor", event.target.value)
                      }
                      maxLength={255}
                      placeholder="SUV, sedan, MPV, pickup..."
                      className={inputClass}
                    />
                  </Field>

                  <Field label="Message" required error={errors.message}>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(event) =>
                        handleFieldChange("message", event.target.value)
                      }
                      maxLength={5000}
                      placeholder="Tell us about your ideal vehicle, budget, and timeline..."
                      aria-invalid={Boolean(errors.message)}
                      className={`${inputClass} resize-none`}
                    />
                  </Field>

                  {/* Honeypot: hidden from people, bots tend to fill it in. */}
                  <div
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
                  >
                    <label>
                      Website
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(event) => setHoneypot(event.target.value)}
                      />
                    </label>
                  </div>

                  <label className="flex items-start gap-3 text-sm text-[#FFFFFF]/80">
                    <input
                      type="checkbox"
                      required
                      checked={acceptedPrivacy}
                      onChange={(event) => {
                        setAcceptedPrivacy(event.target.checked);
                        if (event.target.checked) {
                          setPrivacyError("");
                          setErrors((current) => ({ ...current, privacy: "" }));
                        }
                      }}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[#E31B23]"
                    />
                    <span>
                      I agree to the{" "}
                      <button
                        type="button"
                        onClick={() => setActiveModal("privacy")}
                        className="font-semibold text-[#E31B23] underline underline-offset-2 transition-colors hover:text-[#FFFFFF]"
                      >
                        Privacy Policy
                      </button>{" "}
                      and consent to being contacted about my vehicle enquiry.
                    </span>
                  </label>

                  {errors.privacy || privacyError ? (
                    <p className="text-sm font-medium text-[#FF4D55]">
                      {errors.privacy || privacyError}
                    </p>
                  ) : null}

                  {status ? (
                    <p
                      role="status"
                      className={`border-l-4 px-4 py-3 text-sm font-medium ${
                        status.type === "success"
                          ? "border-[#E31B23] bg-[#E31B23]/10 text-[#FFFFFF]"
                          : "border-[#FF4D55] bg-[#8F1117]/25 text-[#FFB3B7]"
                      }`}
                    >
                      {status.message}
                    </p>
                  ) : null}

                  <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-[#FFFFFF]/55">
                      We&apos;ll get back to you as soon as we can.
                    </p>

                    <button
                      type="submit"
                      disabled={!acceptedPrivacy || submitting}
                      className={`chamfer inline-flex items-center justify-center gap-2 bg-[#E31B23] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#0A0A0A] transition-colors hover:bg-[#FFFFFF] disabled:cursor-not-allowed disabled:bg-[#FFFFFF]/10 disabled:text-[#FFFFFF]/40 ${ringDark}`}
                    >
                      {submitting ? "Sending..." : "Send inquiry"}
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </form>
              </div>

              {/* Side panel: hours, showroom and socials */}
              <aside className="lg:sticky lg:top-28 lg:self-start">
                <div className="border-t-4 border-[#E31B23] bg-[#141414] p-6 sm:p-7">
                  <h3 className="flex items-center gap-3 text-2xl font-bold uppercase">
                    <Clock3 size={22} className="text-[#E31B23]" />
                    Opening hours
                  </h3>

                  {HOURS.length > 0 ? (
                    <div className="mt-5 space-y-3">
                      {HOURS.map((item) => (
                        <div
                          key={item.day}
                          className="flex items-center justify-between gap-4 border-t border-[#FFFFFF]/10 pt-3 text-sm first:border-t-0 first:pt-0"
                        >
                          <span className="text-[#FFFFFF]/65">{item.day}</span>
                          <span className="font-semibold">{item.time}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-5 text-sm leading-6 text-[#FFFFFF]/70">
                      Message us on Facebook to confirm our hours before you
                      visit.
                    </p>
                  )}

                  <a
                    href={MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex items-start gap-3 border-t border-[#FFFFFF]/10 pt-5 text-sm font-medium text-[#FFFFFF] transition-colors hover:text-[#E31B23]"
                  >
                    <MapPin
                      size={18}
                      className="mt-0.5 shrink-0 text-[#E31B23]"
                    />
                    <span>
                      {ADDRESS_LINE_1}
                      <br />
                      {ADDRESS_LINE_2}
                    </span>
                  </a>

                  <div className="mt-6 flex flex-wrap gap-3 border-t border-[#FFFFFF]/10 pt-5">
                    <a
                      href={FACEBOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`border-2 border-[#FFFFFF]/25 px-4 py-2.5 text-sm font-bold text-[#FFFFFF] transition-colors hover:border-[#E31B23] hover:text-[#E31B23] ${ringDark}`}
                    >
                      Facebook
                    </a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* BOTTOM BAND: cream, the light contrast before the footer */}
        {/* <section className="bg-[#FFFFFF] text-[#0A0A0A]">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div className="border-l-8 border-[#8F1117] pl-5">
              <h2 className="text-4xl font-black uppercase leading-none sm:text-5xl">
                Book your next journey
              </h2>
              <p className="mt-3 max-w-xl text-base leading-7 text-[#0A0A0A]/75">
                Explore our inventory, compare models side by side, and speak
                with an expert about the right fit for your next move.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/showroom"
                className={`chamfer inline-flex items-center justify-center bg-[#8F1117] px-7 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#0A0A0A] ${ringLight}`}
              >
                Visit Showroom
              </Link>

              <Link
                href="/sell-trade"
                className={`chamfer inline-flex items-center justify-center bg-[#0A0A0A] px-7 py-4 text-sm font-bold uppercase tracking-wider text-[#FFFFFF] transition-colors hover:bg-[#8F1117] ${ringLight}`}
              >
                Sell / Trade Car
              </Link>
            </div>
          </div>
        </section> */}
      </main>

      <Footer />

      {activeModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label={privacyCopy.title}
            className="max-h-[85vh] w-full max-w-2xl overflow-hidden border-t-4 border-[#E31B23] bg-[#141414] text-[#FFFFFF] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#FFFFFF]/10 px-5 py-4 sm:px-6">
              <h3 className="text-2xl font-bold uppercase">
                {privacyCopy.title}
              </h3>
              <button
                type="button"
                aria-label="Close privacy policy"
                onClick={() => setActiveModal(null)}
                className={`flex h-10 w-10 items-center justify-center border border-[#FFFFFF]/25 text-[#FFFFFF] transition-colors hover:border-[#E31B23] hover:bg-[#8F1117] ${ringDark}`}
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[70vh] overflow-y-auto px-5 py-5 text-sm leading-7 text-[#FFFFFF]/80 sm:px-6">
              {privacyCopy.body.map((paragraph) => (
                <p key={paragraph} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
