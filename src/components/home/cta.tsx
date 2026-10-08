"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Same tapered speed lines as the hero, so the page opens and closes on one motif.
function SpeedLines({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 60"
      className={`h-auto w-40 text-[#E31B23] lg:w-72 ${flip ? "-scale-x-100" : ""}`}
    >
      <polygon points="0,6 200,24 0,14" fill="currentColor" />
      <polygon points="30,24 200,30 30,34" fill="currentColor" opacity="0.7" />
      <polygon points="0,46 200,36 0,54" fill="currentColor" />
    </svg>
  );
}

export default function CTA() {
  return (
    <section className="relative overflow-hidden border-t-4 border-[#E31B23] bg-gradient-to-b from-[#8F1117] to-[#6E0B0B] py-20 text-center">
      {/* Speed lines on both sides (hidden on small screens so text stays clear) */}
      <div className="pointer-events-none absolute left-0 top-1/2 hidden -translate-y-1/2 opacity-60 md:block">
        <SpeedLines />
      </div>
      <div className="pointer-events-none absolute right-0 top-1/2 hidden -translate-y-1/2 opacity-60 md:block">
        <SpeedLines flip />
      </div>

      <div className="relative mx-auto max-w-4xl px-5 sm:px-6">
        <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-[#FFFFFF] sm:text-5xl lg:text-7xl">
          Ready to find
          <span className="block">your next car?</span>
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-[#FFFFFF]/85 sm:text-base">
          Browse the showroom, or talk to our team about finding the right
          vehicle for you.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <Link
            href="/showroom"
            className="chamfer group inline-flex items-center justify-center gap-3 bg-[#E31B23] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#0A0A0A] transition-colors duration-300 hover:bg-[#FFFFFF] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Visit showroom
            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          <Link
            href="/contact"
            className="chamfer inline-flex items-center justify-center bg-[#0A0A0A] px-8 py-4 text-sm font-bold uppercase tracking-wider text-[#FFFFFF] transition-colors duration-300 hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Contact us
          </Link>
        </div>
      </div>
    </section>
  );
}
