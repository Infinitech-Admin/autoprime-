"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CarFront,
  Gauge,
  Settings2,
} from "lucide-react";

const cars = [
  {
    id: 1,
    name: "BMW 5 Series",
    year: "2022",
    type: "Sedan",
    mileage: "18,500 km",
    engine: "3.0L",
    horsepower: "382 hp",
    transmission: "Automatic",
    image: "/bmw-series-5.png",
  },
  {
    id: 2,
    name: "Mercedes-Benz C-Class",
    year: "2023",
    type: "Sedan",
    mileage: "12,800 km",
    engine: "2.0L",
    horsepower: "255 hp",
    transmission: "Automatic",
    image: "/mercedes-c-class.png",
  },
  {
    id: 3,
    name: "Porsche Cayenne",
    year: "2023",
    type: "SUV",
    mileage: "9,600 km",
    engine: "3.0L",
    horsepower: "348 hp",
    transmission: "Automatic",
    image: "/porsche-cayenne.png",
  },
  {
    id: 4,
    name: "Range Rover Sport",
    year: "2022",
    type: "SUV",
    mileage: "21,300 km",
    engine: "3.0L",
    horsepower: "355 hp",
    transmission: "Automatic",
    image: "/range-rover-sport.png",
  },
];

export default function ShowcaseSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [isPaused, setIsPaused] = useState(false);

  const goNext = () => {
    setDirection("next");

    setActiveIndex((current) =>
      current === cars.length - 1 ? 0 : current + 1,
    );
  };

  const goPrevious = () => {
    setDirection("prev");

    setActiveIndex((current) =>
      current === 0 ? cars.length - 1 : current - 1,
    );
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = window.setInterval(() => {
      setDirection("next");

      setActiveIndex((current) =>
        current === cars.length - 1 ? 0 : current + 1,
      );
    }, 5000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isPaused]);

  const activeCar = cars[activeIndex];

  const getPosition = (index: number) => {
    let difference = index - activeIndex;

    if (difference > cars.length / 2) {
      difference -= cars.length;
    }

    if (difference < -cars.length / 2) {
      difference += cars.length;
    }

    return difference;
  };

  return (
    <section
      className="relative overflow-hidden bg-[var(--page-bg)] pb-10 text-[var(--foreground)] py-10"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Cinematic background glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E11D2E]/5 blur-[140px]" />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="flex max-w-7xl mx-auto justify-between items-center gap-10 lg:gap-20">
          <div className="max-w-3xl mx-0 py-10">
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-10 bg-[#E11D2E]" />
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[#E11D2E]">
                Featured Vehicles
              </span>
              <span className="h-px w-10 bg-[#E11D2E]" />
            </div>

            <h2 className="text-4xl font-black tracking-tight text-[var(--foreground)] sm:text-5xl lg:text-6xl">
              Drive <span className="text-[#E11D2E]">Excellence.</span>
            </h2>

            <p className="mt-5 text-sm leading-7 text-[var(--muted)] sm:text-base">
              Discover a refined collection of premium vehicles selected for
              exceptional performance, sophisticated design, and lasting value.
            </p>
          </div>
          <div className="group mt-6 inline-block">
            <Link
              href="/showroom"
              className="flex items-center gap-2 text-lg font-semibold text-[#E11D2E] underline decoration-transparent decoration-2 underline-offset-4 transition-all duration-300 hover:decoration-[#E11D2E]"
            >
              Visit Showroom
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>

        {/* Car Showcase */}
        <div className="relative mt-16">
          <button
            type="button"
            onClick={goPrevious}
            aria-label="Previous vehicle"
            className="absolute left-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#E11D2E] hover:bg-[#E11D2E] hover:text-black sm:left-5 sm:h-12 sm:w-12 lg:left-10"
          >
            <ArrowLeft size={19} />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next vehicle"
            className="absolute right-1 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white backdrop-blur-xl transition-all duration-300 hover:scale-110 hover:border-[#E11D2E] hover:bg-[#E11D2E] hover:text-black sm:right-5 sm:h-12 sm:w-12 lg:right-10"
          >
            <ArrowRight size={19} />
          </button>

          <div className="relative mx-auto h-[330px] max-w-[1500px] sm:h-[430px] lg:h-[520px]">
            {cars.map((car, index) => {
              const position = getPosition(index);

              const isCenter = position === 0;
              const isLeft = position === -1;
              const isRight = position === 1;

              let positionClass = "";

              if (isCenter) {
                positionClass =
                  "left-1/2 w-[92%] translate-x-[-50%] scale-100 opacity-100 blur-0 z-30 sm:w-[72%] lg:w-[65%]";
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
                  className={`
                                        absolute top-1/2
                                        -translate-y-1/2
                                        transition-all
                                        duration-700
                                        ease-[cubic-bezier(0.22,1,0.36,1)]
                                        ${positionClass}
                                    `}
                >
                  <div className="relative">
                    {/* Floor reflection/glow */}
                    {isCenter && (
                      <div className="absolute bottom-[4%] left-1/2 h-16 w-[65%] -translate-x-1/2 rounded-full bg-[#E11D2E]/20 blur-3xl transition-opacity duration-700" />
                    )}

                    <Image
                      src={car.image}
                      alt={car.name}
                      width={1200}
                      height={700}
                      priority={isCenter}
                      className={`
                                                relative z-10 h-auto w-full
                                                object-contain
                                                transition-all
                                                duration-700
                                                ease-[cubic-bezier(0.22,1,0.36,1)]
                                                ${
                                                  isCenter
                                                    ? "drop-shadow-[0_40px_40px_rgba(0,0,0,0.85)]"
                                                    : "drop-shadow-[0_20px_25px_rgba(0,0,0,0.5)]"
                                                }
                                            `}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Car Details */}
          <div
            key={`${activeCar.id}-${direction}`}
            className={`relative z-40 mx-auto mt-2 max-w-4xl text-center sm:-mt-4
                            ${
                              direction === "next"
                                ? "animate-[showcaseDetailsNext_500ms_ease-out]"
                                : "animate-[showcaseDetailsPrev_500ms_ease-out]"
                            }
                        `}
          >
            <div className="flex items-center justify-center gap-2 text-md text-[var(--muted-soft)]">
              <span>{activeCar.year}</span>
              <span>•</span>
              <span>{activeCar.type}</span>
              <span>•</span>
              <span>{activeCar.mileage}</span>
            </div>

            <h3 className="mt-2 text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
              {activeCar.name}
            </h3>

            {/* Specs */}
            <div className="mt-6 flex items-center justify-center divide-x divide-[var(--border)]">
              <div className="flex items-center gap-2 px-4 sm:px-7">
                <Gauge size={17} className="text-[#E11D2E]" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {activeCar.engine}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--muted-soft)]">
                    Engine
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-4 sm:px-7">
                <CarFront size={17} className="text-[#E11D2E]" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {activeCar.horsepower}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--muted-soft)]">
                    Power
                  </p>
                </div>
              </div>

              <div className="hidden items-center gap-2 px-4 sm:flex sm:px-7">
                <Settings2 size={17} className="text-[#E11D2E]" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    {activeCar.transmission}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-[var(--muted-soft)]">
                    Transmission
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-7">
              <Link
                href={`/showroom/car/${activeCar.id}`}
                className="group inline-flex items-center gap-3 rounded-full border border-[#E11D2E] px-6 py-3 text-sm font-semibold text-[#E11D2E] transition-all duration-300 hover:scale-105 hover:bg-[#E11D2E] hover:text-black"
              >
                View Details
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            {/* Dots */}
            <div className="mt-7 flex items-center justify-center gap-2">
              {cars.map((car, index) => (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => {
                    setDirection(index > activeIndex ? "next" : "prev");

                    setActiveIndex(index);
                  }}
                  aria-label={`View ${car.name}`}
                  className={`
                                        h-1.5
                                        rounded-full
                                        transition-all
                                        duration-500
                                        ${
                                          index === activeIndex
                                            ? "w-7 bg-[#E11D2E]"
                                            : "w-1.5 bg-zinc-700 hover:bg-zinc-500"
                                        }
                                    `}
                />
              ))}
            </div>
          </div>
        </div>
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
      `}</style>
    </section>
  );
}
