// Path: app/sold-cars/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, RotateCcw, Search, X } from "lucide-react";
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
import {
  MEDIA_BASE_URL,
  fetchSoldVehicles,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type Vehicle,
} from "@/lib/api";

const DEFAULT_LOAD_ERROR =
  "We couldn’t load our sold vehicles right now. Please refresh the page or contact our team for assistance.";

const SHOW_PRICE = true; // set false to hide prices on sold cars
const CARS_PER_PAGE = 12;

const field = `h-12 w-full border border-white/20 bg-[#161616] px-4 text-sm text-white placeholder:text-white/40 outline-none transition-colors focus:border-[#E31B23]`;
const pageBtn = `inline-flex h-10 min-w-10 items-center justify-center border border-white/20 px-4 text-sm transition-colors hover:border-[#E31B23] hover:text-[#E31B23] disabled:cursor-not-allowed disabled:opacity-30 ${focus}`;

export default function SoldCarsPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [selectedModel, setSelectedModel] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const { data } = await fetchSoldVehicles({ signal });
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

  const modelOptions = useMemo(
    () => ["all", ...Array.from(new Set(vehicles.map((v) => v.name)))],
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
      return (
        matchesSearch && (selectedModel === "all" || car.name === selectedModel)
      );
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
  }, [vehicles, search, selectedModel, sortOrder]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCars.length / CARS_PER_PAGE),
  );

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages));
  }, [totalPages]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedModel, sortOrder]);

  const paginatedCars = useMemo(() => {
    const start = (currentPage - 1) * CARS_PER_PAGE;
    return filteredCars.slice(start, start + CARS_PER_PAGE);
  }, [filteredCars, currentPage]);

  const clearFilters = () => {
    setSearch("");
    setSelectedModel("all");
    setSortOrder("newest");
  };

  const hasActiveFilters =
    search.trim() !== "" || selectedModel !== "all" || sortOrder !== "newest";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#161616] text-white">
        <PageHero tagline="CAR TRADING" title="Cars that found homes">
          Every car here went to a happy driver. Your next ride could be on this
          list.
          {!isLoading && !loadError && (
            <span className="mt-6 flex items-baseline gap-3">
              <span className={`${display} text-5xl font-light text-white`}>
                {vehicles.length}
              </span>
              <span className="text-sm text-white/80">
                vehicle{vehicles.length !== 1 ? "s" : ""} sold
              </span>
            </span>
          )}
        </PageHero>

        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mb-10 grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
            <label className="relative block">
              <Search
                size={16}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#E31B23]"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search model, type, or city"
                aria-label="Search sold cars"
                className={`${field} pl-11`}
              />
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              aria-label="Filter by model"
              className={field}
            >
              {modelOptions.map((model) => (
                <option key={model} value={model}>
                  {model === "all" ? "All models" : model}
                </option>
              ))}
            </select>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              aria-label="Sort order"
              className={field}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              {SHOW_PRICE && (
                <>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </>
              )}
            </select>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className={`${btnLine} h-12 py-0`}
              >
                <X size={15} />
                Clear
              </button>
            )}
          </div>

          {isLoading ? (
            <StateBox>
              <Spinner />
              <p className="mt-6 text-white/60">Loading sold cars...</p>
            </StateBox>
          ) : loadError ? (
            <StateBox>
              <p className={`${display} text-xl uppercase tracking-[0.14em]`}>
                Couldn&apos;t load sold cars
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
              <p className={`${display} text-xl uppercase tracking-[0.14em]`}>
                {vehicles.length === 0
                  ? "No sold cars yet"
                  : "No matching cars found"}
              </p>
              <p className="mt-2 text-sm text-white/50">
                {vehicles.length === 0
                  ? "Sold cars will show up here."
                  : "Try a different model or clear your filters."}
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
                  const imageSrc = resolveMediaUrl(car.image, MEDIA_BASE_URL);
                  return (
                    <Link
                      key={car.id}
                      href={`/showroom/car/${car.id}`}
                      className={`group flex h-full flex-col ${card} transition-colors hover:border-[#E31B23] ${focus}`}
                    >
                      <div className="relative bg-[#161616] p-3">
                        <span className="absolute left-3 top-3 z-10 border border-[#E31B23] px-2.5 py-1 text-xs tracking-[0.2em] text-[#E31B23]">
                          Sold
                        </span>
                        {imageSrc ? (
                          <Image
                            src={imageSrc}
                            alt={car.name}
                            width={800}
                            height={500}
                            unoptimized
                            className="h-52 w-full object-contain opacity-70 transition-all duration-500 group-hover:opacity-100"
                          />
                        ) : (
                          <div className="flex h-52 items-center justify-center text-sm text-white/40">
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
                        {SHOW_PRICE && (
                          <p className="mt-2 text-white/60">
                            <span className="mr-2 text-xs text-white/40">
                              Sold at
                            </span>
                            {car.price}
                          </p>
                        )}

                        <dl className="mt-auto grid grid-cols-2 gap-4 border-t border-white/10 pt-4 text-sm">
                          <div>
                            <dt className="text-xs text-white/40">Mileage</dt>
                            <dd className="mt-1 line-clamp-2 min-h-10">
                              {car.mileage}
                            </dd>
                          </div>
                          <div>
                            <dt className="text-xs text-white/40">Engine</dt>
                            <dd className="mt-1 line-clamp-2 min-h-10">
                              {car.engine}
                            </dd>
                          </div>
                        </dl>

                        <p className="mt-3 flex items-center gap-2 text-sm text-white/80">
                          <MapPin
                            size={14}
                            className="shrink-0 text-[#E31B23]"
                          />
                          <span title={car.location} className="line-clamp-1">
                            {car.location}
                          </span>
                        </p>
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
                        aria-current={currentPage === page ? "page" : undefined}
                        className={`${pageBtn} ${
                          currentPage === page
                            ? "border-[#E31B23] bg-[#E31B23] text-white"
                            : ""
                        }`}
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
        </section>
      </main>
      <Footer />
    </>
  );
}
