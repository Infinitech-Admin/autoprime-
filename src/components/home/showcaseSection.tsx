"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  Gauge,
  RotateCcw,
  Settings2,
} from "lucide-react";

import {
  MEDIA_BASE_URL,
  fetchVehicles,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type Vehicle,
} from "@/lib/api";

const MAX_FEATURED = 6;

const DEFAULT_LOAD_ERROR =
  "We couldn’t load the featured vehicles right now. Please try again.";

/*
  Auto-Prime Car Trading palette
  black #0A0A0A | panel #141414 | white #FFFFFF
  red #E31B23 | deep red #8F1117 (hover #B91C1C)
*/

export default function ShowcaseSection() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isPaused, setIsPaused] = useState(false);

  const load = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const { data } = await fetchVehicles({ signal });
      setVehicles(data ?? []);
      setIsLoading(false);
    } catch (err) {
      if (isAbortError(err)) return;
      setLoadError((err as ApiError).message || DEFAULT_LOAD_ERROR);
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  // Available vehicles first (with an image), capped to MAX_FEATURED.
  const cars = useMemo(() => {
    const withImage = vehicles.filter((v) => !!v.image);
    const available = withImage.filter(
      (v) => v.status === "available" && v.stock > 0,
    );
    const pool = available.length > 0 ? available : withImage;

    return pool.slice(0, MAX_FEATURED).map((v) => ({
      id: v.id,
      name: v.name,
      year: v.year,
      type: v.type,
      mileage: v.mileage,
      engine: v.engine,
      horsepower: v.horsepower,
      transmission: v.transmission,
      image: resolveMediaUrl(v.image, MEDIA_BASE_URL),
    }));
  }, [vehicles]);

  const total = cars.length;
  const safeIndex = total > 0 ? Math.min(activeIndex, total - 1) : 0;
  const activeCar = cars[safeIndex];

  const goNext = () => {
    if (total < 2) return;
    setDirection("next");
    setActiveIndex((current) => (current >= total - 1 ? 0 : current + 1));
  };

  const goPrevious = () => {
    if (total < 2) return;
    setDirection("prev");
    setActiveIndex((current) => (current <= 0 ? total - 1 : current - 1));
  };

  useEffect(() => {
    if (isPaused || total < 2) return;

    const interval = window.setInterval(() => {
      setDirection("next");
      setActiveIndex((current) => (current >= total - 1 ? 0 : current + 1));
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isPaused, total]);

  const getPosition = (index: number) => {
    let difference = index - safeIndex;

    if (difference > total / 2) {
      difference -= total;
    }

    if (difference < -total / 2) {
      difference += total;
    }

    return difference;
  };

  return (
    <section
      className="relative overflow-hidden bg-[#0A0A0A] py-16 text-white lg:py-24"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div className="max-w-2xl border-l-8 border-[#E31B23] pl-5 sm:pl-8">
            <h2 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Drive excellence.
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-white/70 sm:text-base">
              Hand-picked cars from our Las Piñas lot, inspected and ready to see
              today.
            </p>
          </div>

          <Link
            href="/showroom"
            className="chamfer inline-flex items-center justify-center border-2 border-white/40 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            See all cars
          </Link>
        </div>

        {/* Loading */}
        {isLoading && (
          <div
            role="status"
            className="mx-auto mt-16 flex h-[360px] max-w-4xl flex-col items-center justify-center text-center sm:h-[480px] lg:h-[560px]"
          >
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-[#E31B23]" />
            <p className="mt-6 text-lg font-semibold text-white">
              Loading featured cars...
            </p>
          </div>
        )}

        {/* Error */}
        {!isLoading && loadError && (
          <div className="mx-auto mt-16 flex max-w-xl flex-col items-center border-t-4 border-[#E31B23] bg-[#141414] px-6 py-12 text-center">
            <p className="text-xl font-bold text-white">
              We couldn&apos;t load the cars
            </p>
            <p className="mt-3 text-sm leading-6 text-white/70">{loadError}</p>
            <button
              type="button"
              onClick={() => load()}
              className="chamfer mt-6 inline-flex items-center gap-2 bg-[#E31B23] px-6 py-3 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-white hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <RotateCcw size={16} />
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !loadError && total === 0 && (
          <div className="mx-auto mt-16 max-w-xl border border-dashed border-white/25 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-white">
              No featured cars right now
            </p>
            <p className="mt-2 text-sm text-white/70">
              New arrivals are added often. Check the full showroom or message
              us on Facebook.
            </p>
          </div>
        )}

        {/* Car showcase */}
        {!isLoading && !loadError && total > 0 && activeCar && (
          <div className="relative mt-12">
            {/* Stage */}
            <div className="relative mx-auto h-[340px] max-w-[1500px] sm:h-[440px] lg:h-[560px]">
              {/* Floor: one solid red line the cars sit on */}
              <div className="pointer-events-none absolute bottom-[12%] left-0 right-0 z-0 h-0.5 bg-[#E31B23]" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[12%] bg-[#141414]" />

              {cars.map((car, index) => {
                const position = getPosition(index);

                const isCenter = position === 0;
                const isLeft = position === -1;
                const isRight = position === 1;

                let positionClass = "";

                if (isCenter) {
                  positionClass =
                    "left-1/2 w-[96%] translate-x-[-50%] scale-100 opacity-100 blur-0 z-30 sm:w-[80%] lg:w-[68%]";
                } else if (isLeft) {
                  positionClass =
                    "left-[-18%] w-[58%] translate-x-0 scale-[0.72] opacity-25 blur-[2px] z-10 sm:left-[-12%] sm:w-[55%] sm:scale-[0.78] lg:left-[-8%] lg:w-[48%]";
                } else if (isRight) {
                  positionClass =
                    "left-[118%] w-[58%] translate-x-[-100%] scale-[0.72] opacity-25 blur-[2px] z-10 sm:left-[112%] sm:w-[55%] sm:scale-[0.78] lg:left-[108%] lg:w-[48%]";
                } else {
                  positionClass =
                    "left-1/2 w-[50%] translate-x-[-50%] scale-[0.5] opacity-0 blur-[15px] z-0 pointer-events-none";
                }

                return (
                  <div
                    key={car.id}
                    className={`absolute top-1/2 h-full -translate-y-1/2 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${positionClass}`}
                  >
                    <div className="relative h-full w-full">
                      <Image
                        src={car.image}
                        alt={car.name}
                        fill
                        priority={isCenter}
                        unoptimized
                        className={`relative z-10 object-contain transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          isCenter
                            ? "scale-110 drop-shadow-[0_30px_30px_rgba(0,0,0,0.85)]"
                            : "drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)]"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Details bar: name on the left, specs and action on the right */}
            <div
              key={`${activeCar.id}-${direction}`}
              className={`relative z-40 mx-auto max-w-7xl border-t-4 border-[#E31B23] bg-[#141414] px-5 py-6 sm:px-8 sm:py-8 ${
                direction === "next"
                  ? "animate-[showcaseDetailsNext_500ms_ease-out]"
                  : "animate-[showcaseDetailsPrev_500ms_ease-out]"
              }`}
            >
              <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#E31B23] sm:text-base">
                    {activeCar.year} {activeCar.type}, {activeCar.mileage}
                  </p>
                  <h3 className="mt-1 text-3xl font-black uppercase leading-tight tracking-tight text-white sm:text-4xl">
                    {activeCar.name}
                  </h3>
                </div>

                <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
                  <div className="flex items-center divide-x divide-white/15">
                    <div className="flex items-center gap-2 pr-4 sm:pr-6">
                      <Gauge size={18} className="shrink-0 text-[#E31B23]" />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {activeCar.engine}
                        </p>
                        <p className="text-xs text-white/60">Engine</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-4 sm:px-6">
                      <CarFront size={18} className="shrink-0 text-[#E31B23]" />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {activeCar.horsepower}
                        </p>
                        <p className="text-xs text-white/60">Power</p>
                      </div>
                    </div>

                    <div className="hidden items-center gap-2 pl-4 sm:flex sm:pl-6">
                      <Settings2
                        size={18}
                        className="shrink-0 text-[#E31B23]"
                      />
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {activeCar.transmission}
                        </p>
                        <p className="text-xs text-white/60">Transmission</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/showroom/car/${activeCar.id}`}
                    className="chamfer inline-flex items-center justify-center bg-[#E31B23] px-8 py-4 text-sm font-bold uppercase tracking-wider text-white transition-colors duration-300 hover:bg-white hover:text-[#0A0A0A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    View details
                  </Link>
                </div>
              </div>

              {/* Controls: counter, progress segments, prev / next */}
              {total > 1 && (
                <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-6">
                  <p
                    className="shrink-0 text-sm font-semibold tabular-nums text-white/70"
                    aria-live="polite"
                  >
                    {safeIndex + 1} of {total}
                  </p>

                  <div className="flex flex-1 items-center gap-2">
                    {cars.map((car, index) => (
                      <button
                        key={car.id}
                        type="button"
                        onClick={() => {
                          setDirection(index > safeIndex ? "next" : "prev");
                          setActiveIndex(index);
                        }}
                        aria-label={`View ${car.name}`}
                        aria-current={index === safeIndex}
                        className="group flex h-6 flex-1 items-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E31B23]"
                      >
                        <span
                          className={`block h-1 w-full transition-colors duration-300 ${
                            index === safeIndex
                              ? "bg-[#E31B23]"
                              : "bg-white/20 group-hover:bg-white/50"
                          }`}
                        />
                      </button>
                    ))}
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={goPrevious}
                      aria-label="Previous vehicle"
                      className="flex h-11 w-11 items-center justify-center border-2 border-white/30 text-white transition-colors duration-300 hover:border-[#E31B23] hover:bg-[#E31B23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <ArrowLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      aria-label="Next vehicle"
                      className="flex h-11 w-11 items-center justify-center border-2 border-white/30 text-white transition-colors duration-300 hover:border-[#E31B23] hover:bg-[#E31B23] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes showcaseDetailsNext {
          0% {
            opacity: 0;
            transform: translateX(30px);
          }

          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes showcaseDetailsPrev {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }

          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          div {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
