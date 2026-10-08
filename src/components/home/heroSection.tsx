import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeftRight,
  ArrowRight,
  CarFront,
  CircleDollarSign,
} from "lucide-react";

const actions = [
  {
    icon: CarFront,
    title: "Buy a car",
    description: "Inspected cars, ready to see and drive.",
    href: "/showroom",
    featured: false,
  },
  {
    icon: CircleDollarSign,
    title: "Sell your car",
    description: "Tell us about it and get a fair offer.",
    href: "/sell-trade",
    featured: false,
  },
  {
    icon: ArrowLeftRight,
    title: "Trade in",
    description: "Put your current car toward your next one.",
    href: "/sell-trade",
    featured: true,
  },
];

/*
  Auto-Prime Car Trading palette
  black #0A0A0A | panel #141414 | white #FFFFFF | red #E31B23

  The hero is about trading: the headline says it, and Buy / Sell / Trade in
  sit right under it as the three things people come here to do.
  Only motion: the two headline lines rise in. Off for reduced motion.
*/
const heroAnimations = `
  @keyframes pad-rise { from { transform: translateY(18px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  .pad-rise { animation: pad-rise 0.75s cubic-bezier(0.22, 1, 0.36, 1) both; }
  @media (prefers-reduced-motion: reduce) {
    .pad-rise { animation: none !important; }
  }
`;

export default function HeroSection() {
  return (
    <section className="bg-[#0A0A0A]">
      <style>{heroAnimations}</style>

      <div className="relative flex min-h-[640px] items-end overflow-hidden lg:min-h-[88vh]">
        <Image
          src="/showroom-collection.jpg"
          alt="Auto-Prime Car Trading showroom"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[65%_center]"
        />

        {/* Dark on the left for the text, heavier at the bottom for the tiles */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A]/90 via-[#0A0A0A]/55 via-50% to-[#0A0A0A]/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/40 via-30% to-transparent to-60%" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-0 pt-40 sm:px-6 lg:px-8">
          <div className="max-w-4xl border-l-8 border-[#E31B23] pl-5 sm:pl-8">
            <h1 className="text-5xl font-black uppercase leading-[0.92] tracking-tight text-white [text-shadow:0_2px_30px_rgba(0,0,0,0.55)] sm:text-6xl lg:text-7xl xl:text-8xl">
              <span
                className="pad-rise block"
                style={{ animationDelay: "0.1s" }}
              >
                Trade your car.
              </span>
              <span
                className="pad-rise block"
                style={{ animationDelay: "0.3s" }}
              >
                Drive your next.
              </span>
            </h1>

            <p
              className="pad-rise mt-6 max-w-xl text-base leading-7 text-white/85 lg:text-lg"
              style={{ animationDelay: "0.5s" }}
            >
              Auto-Prime Car Trading in Las Piñas buys, sells, and trades
              inspected cars. Bring yours in, or start with a few details and
              we&apos;ll take it from there.
            </p>

            <div
              className="pad-rise mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4"
              style={{ animationDelay: "0.65s" }}
            >
              <Link
                href="/sell-trade"
                className="chamfer inline-flex items-center justify-center bg-[#E31B23] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-white hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Get my car valued
              </Link>

              <Link
                href="/showroom"
                className="chamfer inline-flex items-center justify-center border-2 border-white/50 px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Browse cars
              </Link>
            </div>
          </div>

          {/* Buy / Sell / Trade in: the three things people come here to do */}
          <ul
            className="pad-rise mt-12 grid gap-px bg-white/10 md:grid-cols-3"
            style={{ animationDelay: "0.8s" }}
          >
            {actions.map(
              ({ icon: Icon, title, description, href, featured }) => (
                <li key={title} className="bg-[#0A0A0A]">
                  <Link
                    href={href}
                    className={`group flex h-full items-center gap-4 border-t-4 px-5 py-6 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white sm:px-6 ${
                      featured
                        ? "border-[#E31B23] bg-[#E31B23] text-white hover:bg-[#B91C1C] hover:border-[#B91C1C]"
                        : "border-white/20 bg-[#141414] text-white hover:border-[#E31B23] hover:bg-[#1A1A1A]"
                    }`}
                  >
                    <span
                      className={`chamfer flex size-12 shrink-0 items-center justify-center ${
                        featured ? "bg-[#0A0A0A]" : "bg-[#0A0A0A]"
                      }`}
                    >
                      <Icon size={22} className="text-[#E31B23]" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-lg font-black uppercase leading-tight">
                        {title}
                      </span>
                      <span
                        className={`mt-0.5 block text-sm leading-5 ${
                          featured ? "text-white/90" : "text-white/65"
                        }`}
                      >
                        {description}
                      </span>
                    </span>
                    <ArrowRight
                      size={20}
                      className={`shrink-0 transition-transform duration-300 group-hover:translate-x-1 ${
                        featured ? "text-white" : "text-[#E31B23]"
                      }`}
                    />
                  </Link>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>

      {/* Tire-tread divider */}
      <div aria-hidden="true" className="tread" />
    </section>
  );
}
