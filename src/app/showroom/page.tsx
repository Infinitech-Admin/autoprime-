// Path: app/showroom/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ChevronDown,
  Gauge,
  MapPin,
  RotateCcw,
  Search,
  Sparkles,
  X,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import {
  btnLine,
  btnRed,
  card,
  CtaBand,
  display,
  focus,
  PageHero,
  Spinner,
  StateBox,
} from "@/components/ui/prime";
import { useCart } from "@/context/cart-context";
import {
  MEDIA_BASE_URL,
  fetchVehicles,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type Vehicle,
} from "@/lib/api";

const DEFAULT_LOAD_ERROR =
  "We couldn’t load the showroom inventory right now. Please refresh the page or contact our team for assistance.";
const CARS_PER_PAGE = 8;

const fieldClass =
  "h-12 w-full appearance-none border border-white/20 bg-[#161616] px-4 pr-10 text-sm text-white outline-none transition-colors focus:border-[#E31B23]";
const pageBtn = `inline-flex h-10 min-w-10 items-center justify-center border border-white/20 px-4 text-sm transition-colors hover:border-[#E31B23] hover:text-[#E31B23] disabled:cursor-not-allowed disabled:opacity-30 ${focus}`;

const PRICE_RANGES = [
  { value: "all", label: "All prices" },
  { value: "under-50k", label: "Under ₱50k" },
  { value: "50k-70k", label: "₱50k - ₱70k" },
  { value: "70k-plus", label: "₱70k+" },
];

function Select({
  value,
  onChange,
  children,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
  label: string;
}) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={fieldClass}
      >
        {children}
      </select>
      <ChevronDown
        size={18}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#E31B23]"
      />
    </div>
  );
}

export default function ShowroomPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [recentlyAdded, setRecentlyAdded] = useState<number[]>([]);

  const { addToCart } = useCart();

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

  const typeOptions = useMemo(
    () => [
      "all",
      ...Array.from(new Set(vehicles.map((v) => v.type).filter(Boolean))),
    ],
    [vehicles],
  );

  const availableCount = useMemo(
    () =>
      vehicles.filter((v) => v.status === "available" && v.stock > 0).length,
    [vehicles],
  );

  const filteredCars = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = vehicles.filter((car) => {
      const matchesSearch =
        q.length === 0 ||
        [car.name, car.type, car.location].some((v) =>
          (v ?? "").toLowerCase().includes(q),
        );
      const matchesType = typeFilter === "all" || car.type === typeFilter;
      const p = car.price_value;
      const matchesPrice =
        priceRange === "all" ||
        (priceRange === "under-50k" && p < 50000) ||
        (priceRange === "50k-70k" && p >= 50000 && p <= 70000) ||
        (priceRange === "70k-plus" && p > 70000);
      return matchesSearch && matchesType && matchesPrice;
    });

    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case "newest":
          return Number(b.year) - Number(a.year);
        case "oldest":
          return Number(a.year) - Number(b.year);
        case "price-low":
          return a.price_value - b.price_value;
        case "price-high":
          return b.price_value - a.price_value;
        default:
          return 0;
      }
    });
  }, [vehicles, search, typeFilter, sortOrder, priceRange]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCars.length / CARS_PER_PAGE),
  );

  useEffect(() => {
    setCurrentPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter, sortOrder, priceRange]);

  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * CARS_PER_PAGE;
    return filteredCars.slice(start, start + CARS_PER_PAGE);
  }, [filteredCars, currentPage]);

  const clearFilters = () => {
    setSearch("");
    setTypeFilter("all");
    setSortOrder("newest");
    setPriceRange("all");
  };

  const hasActiveFilters =
    search.trim() !== "" ||
    typeFilter !== "all" ||
    priceRange !== "all" ||
    sortOrder !== "newest";

  const handleAddToCart = (event: React.MouseEvent, car: Vehicle) => {
    event.preventDefault();
    event.stopPropagation();
    addToCart({
      id: car.id,
      name: car.name,
      price: car.price,
      image: resolveMediaUrl(car.image, MEDIA_BASE_URL),
      year: car.year,
      type: car.type,
      stock: car.stock,
    });
    setRecentlyAdded((c) => [...c, car.id]);
    window.setTimeout(
      () => setRecentlyAdded((c) => c.filter((id) => id !== car.id)),
      1500,
    );
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#161616] text-white">
        <PageHero tagline="CAR TRADING" title="Find your next car">
          Pick a body type, set your budget and reserve with a 20% downpayment.
          Every car is on the lot and ready to see.
          <span className="mt-6 flex items-baseline gap-3">
            <span className={`${display} text-5xl font-light text-white`}>
              {isLoading || loadError ? "--" : availableCount}
            </span>
            <span className="text-sm text-white/80">
              car{availableCount !== 1 ? "s" : ""} ready to drive
            </span>
          </span>
        </PageHero>

        <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          {typeOptions.length > 2 && (
            <div
              role="group"
              aria-label="Body type"
              className="mb-5 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {typeOptions.map((t) => (
                <button
                  key={t}
                  type="button"
                  aria-pressed={typeFilter === t}
                  onClick={() => setTypeFilter(t)}
                  className={`shrink-0 border px-5 py-2.5 text-sm tracking-[0.08em] transition-colors ${focus} ${
                    typeFilter === t
                      ? "border-[#E31B23] bg-[#E31B23] text-white"
                      : "border-white/20 hover:border-[#E31B23] hover:text-[#E31B23]"
                  }`}
                >
                  {t === "all" ? "All cars" : t}
                </button>
              ))}
            </div>
          )}

          <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_auto]">
            <label className="relative block">
              <span className="sr-only">Search</span>
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#E31B23]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search model, type, or city"
                className={`${fieldClass} pl-11 placeholder:text-white/40`}
              />
            </label>
            <Select
              label="Price range"
              value={priceRange}
              onChange={setPriceRange}
            >
              {PRICE_RANGES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </Select>
            <Select label="Sort" value={sortOrder} onChange={setSortOrder}>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="price-low">Price: low to high</option>
              <option value="price-high">Price: high to low</option>
            </Select>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className={`${btnLine} h-12 !py-0`}
              >
                <X size={15} />
                Clear
              </button>
            )}
          </div>

          {!isLoading && !loadError && vehicles.length > 0 && (
            <p className="mb-6 mt-4 text-sm text-white/55" aria-live="polite">
              Showing {filteredCars.length} of {vehicles.length} car
              {vehicles.length !== 1 ? "s" : ""}
            </p>
          )}

          <div className="mt-6">
            {isLoading ? (
              <StateBox>
                <Spinner />
                <p className="mt-6 text-white/60">Loading cars...</p>
              </StateBox>
            ) : loadError ? (
              <StateBox>
                <p
                  className={`${display} text-xl font-light uppercase tracking-[0.14em]`}
                >
                  Couldn&apos;t load the showroom
                </p>
                <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/60">
                  {loadError}
                </p>
                <button
                  type="button"
                  onClick={() => load()}
                  className={`${btnRed} mt-6`}
                >
                  <RotateCcw size={15} />
                  Try again
                </button>
              </StateBox>
            ) : filteredCars.length === 0 ? (
              <StateBox>
                <p
                  className={`${display} text-xl font-light uppercase tracking-[0.14em]`}
                >
                  {vehicles.length === 0
                    ? "No cars in the showroom yet"
                    : "No matching cars found"}
                </p>
                <p className="mt-2 text-sm text-white/55">
                  {vehicles.length === 0
                    ? "Check back soon for new arrivals."
                    : "Try a different body type or price range."}
                </p>
                {vehicles.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className={`${btnRed} mt-6`}
                  >
                    Clear filters
                  </button>
                )}
              </StateBox>
            ) : (
              <>
                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                  {paginatedCars.map((car) => {
                    const unavailable =
                      car.status !== "available" || car.stock <= 0;
                    const imageSrc = resolveMediaUrl(car.image, MEDIA_BASE_URL);
                    const label = unavailable
                      ? car.status === "sold"
                        ? "Sold"
                        : car.status === "reserved"
                          ? "Reserved"
                          : "Out of stock"
                      : recentlyAdded.includes(car.id)
                        ? "Added ✓"
                        : "Add to cart";
                    const badgeText =
                      unavailable && car.status !== "available"
                        ? car.status
                        : car.badge;

                    return (
                      <Link
                        key={car.id}
                        href={`/showroom/car/${car.id}`}
                        className={`group flex h-full flex-col overflow-hidden ${card} transition-colors hover:border-[#E31B23] ${focus}`}
                      >
                        <div className="relative overflow-hidden bg-[#161616] p-3">
                          {(car.badge || unavailable) && (
                            <span
                              title={badgeText ?? undefined}
                              className="absolute left-3 top-3 z-10 max-w-[70%] truncate border border-[#E31B23] bg-black/70 px-2.5 py-1 text-xs tracking-[0.15em] text-[#E31B23]"
                            >
                              {badgeText}
                            </span>
                          )}
                          {imageSrc ? (
                            <Image
                              src={imageSrc}
                              alt={car.name}
                              width={800}
                              height={500}
                              unoptimized
                              className={`h-48 w-full object-contain transition-transform duration-700 group-hover:scale-105 ${unavailable ? "opacity-50" : ""}`}
                            />
                          ) : (
                            <div className="flex h-48 items-center justify-center text-sm text-white/40">
                              No image available
                            </div>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-5">
                          <p className="text-sm text-white/50">
                            {car.year}, {car.type}
                          </p>
                          <h3
                            className={`${display} mt-1 text-lg font-light uppercase leading-snug tracking-[0.1em]`}
                          >
                            {car.name}
                          </h3>
                          <p className="mt-2 text-xl text-[#E31B23]">
                            {car.price}
                          </p>

                          <dl className="mt-4 grid grid-cols-2 divide-x divide-white/10 border-y border-white/10 text-sm">
                            <div className="min-w-0 py-3 pr-3">
                              <dt className="text-xs text-white/45">Mileage</dt>
                              <dd
                                className="mt-1 line-clamp-1"
                                title={car.mileage}
                              >
                                {car.mileage}
                              </dd>
                            </div>
                            <div className="min-w-0 py-3 pl-3">
                              <dt className="text-xs text-white/45">Engine</dt>
                              <dd
                                className="mt-1 line-clamp-1"
                                title={car.engine}
                              >
                                {car.engine}
                              </dd>
                            </div>
                          </dl>

                          <p className="mt-3 flex min-w-0 items-center gap-2 text-sm text-white/80">
                            <MapPin
                              size={14}
                              className="shrink-0 text-[#E31B23]"
                            />
                            <span className="line-clamp-1" title={car.location}>
                              {car.location}
                            </span>
                          </p>

                          <div className="mt-auto flex items-center gap-4 pt-5">
                            <button
                              type="button"
                              disabled={unavailable}
                              onClick={(e) => handleAddToCart(e, car)}
                              className="flex-1 border border-[#E31B23] px-4 py-3 text-sm tracking-[0.1em] text-[#E31B23] transition-colors hover:bg-[#E31B23] hover:text-white disabled:cursor-not-allowed disabled:border-white/15 disabled:text-white/40 disabled:hover:bg-transparent"
                            >
                              {label}
                            </button>
                            <span className="shrink-0 text-sm text-white/70 transition-colors group-hover:text-[#E31B23]">
                              Details
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {filteredCars.length > CARS_PER_PAGE && (
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className={pageBtn}
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          aria-current={
                            currentPage === page ? "page" : undefined
                          }
                          className={`${pageBtn} ${currentPage === page ? "!border-[#E31B23] bg-[#E31B23] text-white" : ""}`}
                        >
                          {page}
                        </button>
                      ),
                    )}
                    <button
                      type="button"
                      onClick={() =>
                        setCurrentPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={currentPage === totalPages}
                      className={pageBtn}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
            <h2
              className={`${display} max-w-3xl text-2xl font-light uppercase leading-snug tracking-[0.14em] sm:text-3xl`}
            >
              Why drivers choose Auto-Prime
            </h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: Gauge,
                  title: "Inspected quality",
                  copy: "Every car is checked for condition, safety and performance before it reaches the showroom.",
                },
                {
                  icon: Sparkles,
                  title: "Clear pricing",
                  copy: "The price you see is the price we discuss. No hidden surprises.",
                },
                {
                  icon: MapPin,
                  title: "Local experts",
                  copy: "Our team helps you compare cars and find the right fit for your budget.",
                },
              ].map(({ icon: Icon, title, copy }) => (
                <div key={title} className={`${card} p-6`}>
                  <Icon
                    size={24}
                    strokeWidth={1.5}
                    className="text-[#E31B23]"
                  />
                  <h3 className="mt-5 text-lg">{title}</h3>
                  <p className="mt-3 text-sm leading-7 text-white/60">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <CtaBand
          title="Have a car to sell?"
          links={[
            { href: "/sell-trade", label: "Sell or trade", primary: true },
            { href: "/contact", label: "Contact us" },
          ]}
        />
      </main>
      <Footer />
    </>
  );
}
