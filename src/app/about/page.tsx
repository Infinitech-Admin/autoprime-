// Path: app/about/page.tsx
"use client";

import {
  Award,
  BadgeCheck,
  CarFront,
  CreditCard,
  ShieldCheck,
  Users,
} from "lucide-react";

import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";
import CTA from "../../components/home/cta";

// Verified from public sources:
// - Carmudi Philippines named Mikmik's Garahe a Top 2 Dealer of 2023
// - Facebook page: 100% recommend (16 reviews), cash/financing/trade-in accepted,
//   fast approval, "We buy rush cars"
// - Location: 91 Aurora Pijuan St., BF Resort Village, Las Piñas City
const stats = [
  { value: "Top 2", label: "Carmudi dealer of 2023" },
  { value: "100%", label: "Recommended on Facebook" },
  { value: "3 ways", label: "To pay: cash, financing, or trade-in" },
  { value: "Las Piñas", label: "BF Resort Village showroom" },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Honest guidance",
    description:
      "We believe the right purchase starts with clear information and no pressure. Every recommendation is based on your needs, not just the cars on our lot.",
  },
  {
    icon: BadgeCheck,
    title: "Clear details",
    description:
      "We show each car's specifications, photos, and condition up front, so you can decide with confidence whether it's your first car or your next upgrade.",
  },
  {
    icon: CreditCard,
    title: "Flexible payment",
    description:
      "Pay in cash, finance, or trade in your current car. Financing comes with fast approval, and we explain the terms before you commit.",
  },
  {
    icon: Users,
    title: "Friendly service",
    description:
      "From your first message to the final handover, our team is patient, responsive, and easy to talk to. We also buy rush cars if you need to sell fast.",
  },
];

export default function About() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#0B0714] text-white">
        <section className="relative overflow-hidden border-b border-[#E11D2E]/20 bg-[#080b0f]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(225, 29, 46,0.18),transparent_50%)]" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 lg:pt-24">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#E11D2E]" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E11D2E]">
                    Our story
                  </span>
                </div>

                <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Quality used cars,
                  <span className="block text-[#E11D2E]">honest terms.</span>
                </h1>

                <p className="mt-6 max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
                  Mikmik&apos;s Garahe is a car dealership in BF Resort Village,
                  Las Piñas City. We buy, sell, and trade used cars, with
                  flexible payment options and a straightforward path to
                  ownership.
                </p>
              </div>

              <div className="rounded-[30px] border border-white/10 bg-[#120f0d] p-5 shadow-[0_30px_80px_rgba(0,0,0,0.35)] sm:p-7">
                <div className="flex items-center justify-between border-b border-white/10 pb-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-zinc-400">
                      Mikmik&apos;s Garahe
                    </p>
                    <h2 className="mt-2 text-2xl font-black text-white">
                      How we work
                    </h2>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E11D2E]/15 text-[#E11D2E]">
                    <CarFront size={22} />
                  </div>
                </div>

                <div className="mt-6 space-y-5 text-lg leading-7 text-zinc-300">
                  <p>
                    Buying a car should feel clear, confident, and personal. We
                    explain pricing and payment options up front, so you know
                    what to expect before you commit.
                  </p>
                  <p>
                    Whether you want to pay in cash, finance, or trade in your
                    current car, we walk you through each option. Need to sell
                    fast? We also buy rush cars.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[24px] border border-white/10 bg-[#120f0d] p-6 text-center shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                >
                  <div className="text-3xl font-black text-[#E11D2E] sm:text-4xl">
                    {stat.value}
                  </div>
                  <p className="mt-3 text-base text-zinc-300">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
            <div className="rounded-[30px] border border-[#E11D2E]/20 bg-[#120f0d] p-6 sm:p-8">
              <div className="mb-6 flex items-center gap-3 text-[#E11D2E]">
                <Award size={20} />
                <span className="text-xs font-semibold uppercase tracking-[0.28em]">
                  Our promise
                </span>
              </div>

              <h3 className="text-3xl font-black tracking-tight text-white">
                Thoughtful service at every step.
              </h3>

              <ul className="mt-6 space-y-4 text-sm leading-7 text-zinc-300">
                {[
                  "Cash, financing, or trade-in: you choose what works for you.",
                  "Friendly people who listen first and explain clearly.",
                  "Simple, upfront communication from first enquiry to delivery.",
                ].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E11D2E]/15 text-[#E11D2E]">
                      <BadgeCheck size={12} />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(225, 29, 46,0.18),transparent_45%)] p-6 sm:p-8">
              <div className="relative">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E11D2E]">
                  The Mikmik&apos;s Garahe difference
                </p>
                <h3 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">
                  We make buying feel confident, not complicated.
                </h3>
                <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
                  Whether you&apos;re shopping for a family SUV, a city car, or
                  a weekend ride, we help you find something that fits your life
                  and your budget.
                </p>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <div className="mb-5 flex items-center justify-center gap-3">
                <span className="h-px w-10 bg-[#E11D2E]" />
                <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#E11D2E]">
                  Why drivers choose us
                </span>
                <span className="h-px w-10 bg-[#E11D2E]" />
              </div>

              <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
                A car buying experience built around you.
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {values.map((value) => {
                const Icon = value.icon;

                return (
                  <div
                    key={value.title}
                    className="group rounded-[26px] border border-white/10 bg-[#120f0d] p-6 transition-all duration-300 hover:border-[#E11D2E]/50 hover:bg-[#15120f] hover:shadow-[0_15px_50px_rgba(0,0,0,0.25)]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#E11D2E]/30 bg-[#E11D2E]/10 text-[#E11D2E] transition-all duration-300 group-hover:border-[#E11D2E]/60 group-hover:bg-[#E11D2E]/20">
                        <Icon size={22} />
                      </div>

                      <h3 className="text-base font-bold leading-tight text-white sm:text-xl">
                        {value.title}
                      </h3>
                    </div>

                    <p className="mt-5 text-base leading-7 text-zinc-400">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </>
  );
}
