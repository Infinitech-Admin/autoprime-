// Path: app/about/page.tsx
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  CalendarCheck,
  CarFront,
  Images,
  MapPin,
  MessageCircle,
  Phone,
  Repeat,
  ShieldCheck,
  Users,
} from "lucide-react";

import Navbar from "../../components/layout/navbar";
import Footer from "../../components/layout/footer";

/*
  Auto-Prime Car Trading palette
  black #0A0A0A | panel #141414 | page #F5F5F5 | white #FFFFFF
  red #E31B23 | deep red #8F1117 (hover #B91C1C)
*/

const BUSINESS = {
  name: "Auto-Prime Car Trading",
  address: "Leo Alejandrino St, BF Resort, Las Piñas City, Philippines 1747",
  phoneDisplay: "0927 377 7182",
  phoneHref: "tel:+639273777182",
  facebook: "https://www.facebook.com/autoprimecartrading/",
};

const MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS.name}, ${BUSINESS.address}`,
)}`;

const facts = [
  { icon: MapPin, title: "Las Piñas City", text: "Visit us at the showroom" },
  { icon: Repeat, title: "Buy, sell, trade", text: "All in one place" },
  { icon: Images, title: "Photos and videos", text: "On every listing" },
  { icon: CalendarCheck, title: "Test drives", text: "Book online" },
];

const services = [
  {
    icon: CarFront,
    title: "Buy a car",
    description:
      "Browse the showroom with specs, mileage, photos, and videos shown up front, then pick the one that fits your life and budget.",
    href: "/showroom",
    cta: "Browse the showroom",
    featured: false,
  },
  {
    icon: Banknote,
    title: "Sell your car",
    description:
      "Get a quick value estimate online and send your car in for review. Our team will get back to you.",
    href: "/sell-trade",
    cta: "Get a value estimate",
    featured: false,
  },
  {
    icon: Repeat,
    title: "Trade it in",
    description:
      "Moving up or switching? Trade in your current car and put it toward your next one.",
    href: "/sell-trade",
    cta: "Start a trade-in",
    featured: true,
  },
];

const journeys = [
  {
    title: "Buying with us",
    steps: [
      "Browse listings with full specs, mileage, photos, and videos.",
      "Message us or book a test drive online.",
      "Visit the showroom and drive it in person.",
    ],
  },
  {
    title: "Selling or trading in",
    steps: [
      "Enter your car's details and get a quick value estimate.",
      "Send it in for review.",
      "Our team gets back to you with the next steps.",
    ],
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Honest guidance",
    description:
      "The right purchase starts with clear information and no pressure. Every recommendation is based on your needs, not just the cars on our lot.",
  },
  {
    icon: BadgeCheck,
    title: "Clear details",
    description:
      "Specs, mileage, photos, and videos are on every listing, so you can decide with confidence whether it's your first car or your next upgrade.",
  },
  {
    icon: Users,
    title: "Friendly service",
    description:
      "From your first message to the final handover, our team is patient, responsive, and easy to talk to.",
  },
];

const ringLight =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A0A0A]";
const ringDark =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E31B23]";
const ringWhite =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

export default function About() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F5F5F5] text-[#0A0A0A]">
        {/* HERO */}
        <section className="relative flex min-h-[60vh] items-end overflow-hidden bg-[#0A0A0A]">
          <Image
            src="/showroom-collection.jpg"
            alt="Auto-Prime Car Trading showroom"
            fill
            priority
            sizes="100vw"
            className="object-cover object-[65%_center]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/55 via-55% to-[#0A0A0A]/10" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

          <div className="relative mx-auto w-full max-w-7xl px-4 pb-14 pt-40 sm:px-6 lg:px-8 lg:pb-20">
            <div className="max-w-3xl border-l-8 border-[#E31B23] pl-5 sm:pl-8">
              <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-7xl">
                Buy, sell, and trade cars in Las Piñas.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-white/85 sm:text-lg">
                {BUSINESS.name} is a car dealership with clear details, honest
                guidance, and a straightforward path to your next car.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/showroom"
                  className={`chamfer inline-flex items-center justify-center bg-[#E31B23] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-[#0A0A0A] ${ringWhite}`}
                >
                  Browse the showroom
                </Link>
                <Link
                  href="/sell-trade"
                  className={`chamfer inline-flex items-center justify-center border-2 border-white/50 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-white hover:text-[#0A0A0A] ${ringWhite}`}
                >
                  Sell or trade your car
                </Link>
              </div>
            </div>
          </div>
        </section>

        <div aria-hidden="true" className="tread" />

        {/* FACTS */}
        <section className="bg-white">
          <ul className="mx-auto grid max-w-7xl divide-y divide-[#0A0A0A]/10 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4 lg:divide-x">
            {facts.map(({ icon: Icon, title, text }) => (
              <li
                key={title}
                className="flex items-center gap-4 px-5 py-6 sm:px-6"
              >
                <span className="chamfer flex size-11 shrink-0 items-center justify-center bg-[#0A0A0A] text-[#E31B23]">
                  <Icon size={20} />
                </span>
                <span>
                  <span className="block text-base font-bold">{title}</span>
                  <span className="block text-sm text-[#0A0A0A]/65">
                    {text}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* WHAT WE DO */}
        <section className="bg-[#0A0A0A] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <h2 className="max-w-2xl border-l-8 border-[#E31B23] pl-5 text-4xl font-black uppercase leading-none sm:pl-7 sm:text-5xl">
              Three ways to move.
            </h2>

            <ul className="mt-12 grid gap-px bg-white/10 md:grid-cols-3">
              {services.map(
                ({ icon: Icon, title, description, href, cta, featured }) => (
                  <li
                    key={title}
                    className={`flex flex-col p-7 sm:p-8 ${
                      featured ? "bg-[#E31B23]" : "bg-[#141414]"
                    }`}
                  >
                    <span className="chamfer flex size-12 items-center justify-center bg-[#0A0A0A] text-[#E31B23]">
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-6 text-2xl font-black uppercase">
                      {title}
                    </h3>
                    <p
                      className={`mt-3 flex-1 text-base leading-7 ${
                        featured ? "text-white/90" : "text-white/70"
                      }`}
                    >
                      {description}
                    </p>
                    <Link
                      href={href}
                      className={`mt-8 inline-flex w-fit items-center gap-2 border-b-2 pb-1 text-sm font-bold uppercase tracking-wider transition-colors ${ringWhite} ${
                        featured
                          ? "border-white text-white hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
                          : "border-[#E31B23] text-[#E31B23] hover:border-white hover:text-white"
                      }`}
                    >
                      {cta}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </section>

        {/* VALUES */}
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
            <h2 className="border-l-8 border-[#E31B23] pl-5 text-4xl font-black uppercase leading-none sm:pl-7 sm:text-5xl lg:text-6xl">
              Confident buying, not complicated buying.
            </h2>
            <p className="max-w-xl text-base leading-7 text-[#0A0A0A]/70 sm:text-lg">
              Whether you&apos;re shopping for a family SUV, a city car, or a
              pickup for work, we help you find something that fits your life
              and your budget.
            </p>
          </div>

          <ul className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {values.map(({ icon: Icon, title, description }) => (
              <li key={title} className="border-t-4 border-[#0A0A0A] pt-6">
                <Icon size={30} className="text-[#E31B23]" strokeWidth={1.8} />
                <h3 className="mt-4 text-2xl font-bold">{title}</h3>
                <p className="mt-3 text-base leading-7 text-[#0A0A0A]/70">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* HOW IT WORKS: both paths side by side */}
        <section className="bg-[#0A0A0A] text-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <h2 className="border-l-8 border-[#E31B23] pl-5 text-4xl font-black uppercase leading-none sm:pl-7 sm:text-5xl">
              How it works
            </h2>

            <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-16">
              {journeys.map((journey) => (
                <div key={journey.title}>
                  <h3 className="text-2xl font-bold uppercase">
                    {journey.title}
                  </h3>
                  <ol className="mt-6 border-b border-white/15">
                    {journey.steps.map((step, index) => (
                      <li
                        key={step}
                        className="flex gap-5 border-t border-white/15 py-5"
                      >
                        <span className="w-8 shrink-0 text-3xl font-black leading-none text-[#E31B23] tabular-nums">
                          {index + 1}
                        </span>
                        <p className="text-base leading-7 text-white/85">
                          {step}
                        </p>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FIND US */}
        {/* <section className="bg-white">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:px-8 lg:py-20">
            <div>
              <h2 className="text-4xl font-black uppercase leading-none sm:text-5xl">
                Visit the showroom.
              </h2>
              <p className="mt-5 flex items-start gap-3 text-base leading-7 text-[#0A0A0A]/75">
                <MapPin
                  size={20}
                  className="mt-1 shrink-0 text-[#E31B23]"
                  aria-hidden="true"
                />
                {BUSINESS.address}
              </p>
              <p className="mt-3 max-w-md text-sm leading-6 text-[#0A0A0A]/60">
                Message us on Facebook first so we can confirm our hours and
                have the car ready for you.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={`chamfer inline-flex items-center justify-center gap-2 bg-[#0A0A0A] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#E31B23] ${ringLight}`}
              >
                Get directions
                <ArrowUpRight size={16} />
              </a>
              <a
                href={BUSINESS.phoneHref}
                className={`chamfer inline-flex items-center justify-center gap-2 bg-[#E31B23] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#0A0A0A] ${ringLight}`}
              >
                <Phone size={16} />
                {BUSINESS.phoneDisplay}
              </a>
              <a
                href={BUSINESS.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className={`chamfer inline-flex items-center justify-center gap-2 border-2 border-[#0A0A0A] px-6 py-4 text-sm font-bold uppercase tracking-wider text-[#0A0A0A] transition-colors hover:bg-[#0A0A0A] hover:text-white ${ringLight}`}
              >
                <MessageCircle size={16} />
                Message us
              </a>
            </div>
          </div>
        </section> */}
      </main>
      <Footer />
    </>
  );
}
