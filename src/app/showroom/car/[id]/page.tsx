// Path: app/showroom/car/[id]/page.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Fuel,
  Gauge,
  Play,
  RotateCcw,
  Settings2,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import TestDriveDialog from "@/components/test-drive-dialog";
import FinancingCalculator from "@/components/financing-calculator";
import {
  btnLine,
  btnRed,
  card,
  display,
  focus,
  PageHero,
  Spinner,
  StateBox,
} from "@/components/ui/prime";
import { useCart } from "@/context/cart-context";
import {
  MEDIA_BASE_URL,
  fetchVehicle,
  isAbortError,
  resolveMediaUrl,
  type ApiError,
  type Vehicle,
} from "@/lib/api";

type Slide = { src: string; alt: string; isCover?: boolean };
type VideoItem = {
  src: string;
  alt: string;
  poster?: string;
  length?: "short" | "long";
  duration?: string;
};

const thumbClass = (active: boolean) =>
  `relative h-14 w-20 shrink-0 overflow-hidden border bg-[#161616] transition-all sm:h-20 sm:w-28 ${
    active ? "border-[#E31B23]" : "border-white/10 opacity-50 hover:opacity-100"
  } ${focus}`;
const strip =
  "mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-3";
const heading = `${display} text-base font-light uppercase tracking-[0.14em]`;

/* ------------------------------ PHOTO GALLERY ------------------------------ */

function CarGallery({ carName, slides }: { carName: string; slides: Slide[] }) {
  const [index, setIndex] = useState(0);
  const [dragX, setDragX] = useState(0);
  const startX = useRef<number | null>(null);
  const thumbs = useRef<Array<HTMLButtonElement | null>>([]);

  const last = slides.length - 1;
  const i = Math.min(index, last);
  const next = () => setIndex((c) => (c >= last ? 0 : c + 1));
  const prev = () => setIndex((c) => (c <= 0 ? last : c - 1));

  const endDrag = (x?: number) => {
    if (startX.current === null) return;
    const delta = x === undefined ? dragX : x - startX.current;
    if (Math.abs(delta) >= 60) (delta < 0 ? next : prev)();
    startX.current = null;
    setDragX(0);
  };

  useEffect(() => {
    thumbs.current[i]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [i]);

  const arrow = `absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center border border-white/20 bg-black/70 text-white transition-colors hover:border-[#E31B23] hover:text-[#E31B23] ${focus}`;

  return (
    <div className={`${card} p-3 sm:p-5`}>
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label={`${carName} photos`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            next();
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            prev();
          }
        }}
        className={`relative overflow-hidden bg-[#161616] ${focus}`}
      >
        <div
          onPointerDown={(e) => {
            startX.current = e.clientX;
          }}
          onPointerMove={(e) => {
            if (startX.current !== null) setDragX(e.clientX - startX.current);
          }}
          onPointerUp={(e) => endDrag(e.clientX)}
          onPointerCancel={() => endDrag(0)}
          className="touch-pan-y select-none"
        >
          <div
            className="flex will-change-transform"
            style={{
              transform: `translate3d(calc(${-i * 100}% + ${dragX}px), 0, 0)`,
              transition:
                startX.current !== null
                  ? "none"
                  : "transform 500ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            {slides.map((s, n) => (
              <div
                key={`${n}-${s.src}`}
                aria-hidden={n !== i}
                className="relative h-[280px] w-full shrink-0 sm:h-[420px] lg:h-[540px]"
              >
                <Image
                  src={s.src}
                  alt={s.alt}
                  fill
                  priority={n === 0}
                  unoptimized
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  draggable={false}
                  className={
                    s.isCover ? "object-contain p-4 sm:p-6" : "object-cover"
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous photo"
              className={`${arrow} left-2 sm:left-4`}
            >
              <ArrowLeft size={18} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next photo"
              className={`${arrow} right-2 sm:right-4`}
            >
              <ArrowRight size={18} />
            </button>
          </>
        )}
        <div className="pointer-events-none absolute bottom-3 right-3 z-20 border border-white/20 bg-black/70 px-3 py-1 text-xs">
          {i + 1} / {slides.length}
        </div>
      </div>

      {slides.length > 1 && (
        <div className={strip}>
          {slides.map((s, n) => (
            <button
              key={`${n}-${s.src}`}
              ref={(el) => {
                thumbs.current[n] = el;
              }}
              type="button"
              onClick={() => setIndex(n)}
              aria-label={`Show photo ${n + 1}`}
              aria-current={n === i}
              className={thumbClass(n === i)}
            >
              <Image
                src={s.src}
                alt=""
                fill
                unoptimized
                sizes="112px"
                className={s.isCover ? "object-contain p-1" : "object-cover"}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* --------------------------------- VIDEOS ---------------------------------- */

function VideoSection({
  carName,
  videos,
}: {
  carName: string;
  videos: VideoItem[];
}) {
  const [index, setIndex] = useState(0);
  const i = Math.min(index, videos.length - 1);
  const active = videos[i];
  const isLong = active.length === "long";

  return (
    <section aria-label={`${carName} videos`} className={`${card} p-3 sm:p-5`}>
      <div className="mb-4 flex items-center justify-between gap-3 px-1">
        <h2 className={heading}>Videos</h2>
        <span className="text-xs text-white/50">
          {videos.length} {videos.length === 1 ? "video" : "videos"}
        </span>
      </div>

      <div className="relative aspect-video w-full overflow-hidden bg-[#161616]">
        <video
          key={active.src}
          src={active.src}
          poster={active.poster}
          muted
          autoPlay={!isLong}
          loop={!isLong}
          controls={isLong}
          playsInline
          preload="metadata"
          aria-label={active.alt}
          className="h-full w-full object-cover"
        />
        {active.duration && (
          <span className="pointer-events-none absolute left-3 top-3 border border-white/20 bg-black/70 px-3 py-1 text-xs">
            {isLong ? "Full walkthrough" : "Clip"}, {active.duration}
          </span>
        )}
      </div>

      {videos.length > 1 && (
        <div className={strip}>
          {videos.map((v, n) => (
            <button
              key={`${n}-${v.src}`}
              type="button"
              onClick={() => setIndex(n)}
              aria-label={`Play video ${n + 1}`}
              aria-current={n === i}
              className={thumbClass(n === i)}
            >
              {v.poster ? (
                <Image
                  src={v.poster}
                  alt=""
                  fill
                  unoptimized
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <video
                  src={`${v.src}#t=0.5`}
                  muted
                  playsInline
                  preload="metadata"
                  tabIndex={-1}
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 h-full w-full object-cover"
                />
              )}
              <span className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Play size={16} className="fill-[#E31B23] text-[#E31B23]" />
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}

/* ---------------------------------- PAGE ----------------------------------- */

function Message({
  title,
  text,
  children,
}: {
  title: string;
  text: string;
  children?: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex min-h-screen items-center justify-center bg-[#161616] px-4 text-white">
        <div className="w-full max-w-lg">
          <StateBox>
            <h1
              className={`${display} text-xl font-light uppercase leading-snug tracking-[0.14em]`}
            >
              {title}
            </h1>
            <p className="mt-4 text-sm leading-7 text-white/60">{text}</p>
            {children}
          </StateBox>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function CarDetailsPage() {
  const id = useParams<{ id: string }>()?.id;

  const [car, setCar] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [justAdded, setJustAdded] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [testDriveOpen, setTestDriveOpen] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      setLoadError("Vehicle ID is missing.");
      return;
    }
    const controller = new AbortController();
    setIsLoading(true);
    setLoadError(null);

    fetchVehicle(id, { signal: controller.signal })
      .then(({ data }) => {
        setCar(data);
        setIsLoading(false);
      })
      .catch((err: unknown) => {
        if (isAbortError(err)) return;
        const apiErr = err as ApiError;
        setCar(null);
        setLoadError(
          apiErr.status === 404
            ? "This car may have been sold or moved. Browse the showroom to see what's available now."
            : apiErr.message ||
                "We couldn’t load this car right now. Please try again or browse the showroom.",
        );
        setIsLoading(false);
      });

    return () => controller.abort();
  }, [id, reloadKey]);

  const carImage = car ? resolveMediaUrl(car.image, MEDIA_BASE_URL) : "";

  const slides = useMemo<Slide[]>(() => {
    if (!car) return [];
    const gallery: Slide[] = (car.galleryMedia ?? [])
      .filter((m) => m.type === "image")
      .map((m) => ({
        src: resolveMediaUrl(m.src, MEDIA_BASE_URL),
        alt: m.alt || `${car.name} photo`,
      }));
    return carImage
      ? [
          { src: carImage, alt: `${car.name} main view`, isCover: true },
          ...gallery,
        ]
      : gallery;
  }, [car, carImage]);

  const videos = useMemo<VideoItem[]>(() => {
    if (!car) return [];
    return (car.galleryMedia ?? [])
      .filter((m) => m.type === "video")
      .map((m) => ({
        src: resolveMediaUrl(m.src, MEDIA_BASE_URL),
        poster: m.poster
          ? resolveMediaUrl(m.poster, MEDIA_BASE_URL)
          : undefined,
        alt: m.alt || `${car.name} video`,
        length: m.length ?? undefined,
        duration: m.duration ?? undefined,
      }));
  }, [car]);

  const unavailable = !car || car.status !== "available" || car.stock <= 0;

  const handleAddToCart = () => {
    if (!car || unavailable) return;
    addToCart({
      id: car.id,
      name: car.name,
      price: car.price,
      image: carImage,
      year: car.year,
      type: car.type,
      stock: car.stock,
    });
    setJustAdded(true);
    window.setTimeout(() => setJustAdded(false), 1500);
  };

  if (isLoading) {
    return (
      <Message title="Loading car" text="Getting the latest details.">
        <div className="mt-6">
          <Spinner />
        </div>
      </Message>
    );
  }

  if (loadError || !car) {
    return (
      <Message
        title="We couldn’t find this car"
        text={loadError || "This car may have been sold or moved."}
      >
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/showroom" className={btnRed}>
            Browse showroom
          </Link>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className={btnLine}
          >
            <RotateCcw size={15} />
            Try again
          </button>
        </div>
      </Message>
    );
  }

  const statusLabel =
    car.status === "sold"
      ? "Sold"
      : car.status === "reserved"
        ? "Reserved"
        : car.stock <= 0
          ? "Out of stock"
          : "Not available";
  const cartLabel = unavailable
    ? statusLabel
    : justAdded
      ? "Added to cart ✓"
      : "Add to cart";

  const quickFacts = [
    { icon: Calendar, label: "Year", value: car.year },
    { icon: Gauge, label: "Mileage", value: car.mileage },
    { icon: Settings2, label: "Transmission", value: car.transmission },
    { icon: Fuel, label: "Fuel", value: car.fuel },
  ];

  const specs = [
    { label: "Engine", value: car.engine },
    { label: "Power", value: car.horsepower },
    { label: "Location", value: car.location },
    {
      label: "Availability",
      value: unavailable ? statusLabel : `${car.stock} in stock`,
    },
  ];

  const cartBtn = `${btnRed} w-full disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40 disabled:hover:bg-white/10 disabled:hover:text-white/40`;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#161616] pb-24 text-white lg:pb-0">
        <PageHero
          back={{ href: "/showroom", label: "Back to showroom" }}
          tagline={`${car.year}, ${car.type}`}
          title={car.name}
        >
          {(car.badge || unavailable) && (
            <span className="flex flex-wrap gap-3">
              {car.badge && (
                <span className="border border-[#E31B23] px-3 py-1 text-xs tracking-[0.15em] text-[#E31B23]">
                  {car.badge}
                </span>
              )}
              {unavailable && (
                <span className="border border-white px-3 py-1 text-xs tracking-[0.15em] text-white">
                  {statusLabel}
                </span>
              )}
            </span>
          )}
        </PageHero>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-start lg:gap-8">
            <div className="min-w-0 space-y-6 lg:space-y-8">
              {slides.length > 0 ? (
                <CarGallery key={car.id} carName={car.name} slides={slides} />
              ) : (
                <div
                  className={`${card} flex h-[280px] items-center justify-center text-sm text-white/50 sm:h-[420px]`}
                >
                  No photos available yet
                </div>
              )}

              {videos.length > 0 && (
                <VideoSection
                  key={`videos-${car.id}`}
                  carName={car.name}
                  videos={videos}
                />
              )}

              <dl className="grid grid-cols-2 gap-px border border-white/10 bg-white/10 sm:grid-cols-4">
                {quickFacts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="min-w-0 bg-[#1E1E1E] p-4">
                    <Icon
                      size={18}
                      strokeWidth={1.5}
                      className="text-[#E31B23]"
                      aria-hidden="true"
                    />
                    <dt className="mt-3 text-xs text-white/50">{label}</dt>
                    <dd className="mt-1 break-words">{value}</dd>
                  </div>
                ))}
              </dl>

              {car.description && (
                <section className={`${card} p-5 sm:p-8`}>
                  <h2 className={heading}>About this car</h2>
                  <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-white/75 sm:text-base">
                    {car.description}
                  </p>
                </section>
              )}
            </div>

            <div className="min-w-0 space-y-6 lg:sticky lg:top-24 lg:space-y-8">
              <aside className={`${card} p-5 sm:p-6`}>
                <p className="text-sm text-white/50">Starting price</p>
                <p className="mt-1 text-4xl font-light text-[#E31B23] sm:text-5xl">
                  {car.price}
                </p>

                <dl className="mt-6 space-y-3 border-y border-white/10 py-5 text-sm sm:text-base">
                  {specs.map((s) => (
                    <div
                      key={s.label}
                      className="flex items-start justify-between gap-4"
                    >
                      <dt className="shrink-0 text-white/50">{s.label}</dt>
                      <dd className="text-right">{s.value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-4 text-xs leading-5 text-white/50">
                  Reserve this car with a 20% downpayment at checkout.
                </p>

                <button
                  type="button"
                  disabled={unavailable}
                  onClick={handleAddToCart}
                  className={`${cartBtn} mt-5`}
                >
                  {cartLabel}
                </button>

                <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <button
                    type="button"
                    disabled={car.status === "sold"}
                    onClick={() => setTestDriveOpen(true)}
                    className={`${btnLine} disabled:cursor-not-allowed disabled:opacity-40`}
                  >
                    Book a test drive
                  </button>
                  <Link href="/contact" className={btnLine}>
                    Ask a question
                  </Link>
                </div>
              </aside>

              <FinancingCalculator
                key={`financing-${car.id}`}
                carName={car.name}
                price={car.price}
                year={car.year}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky bar: price and cart always in reach */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 border-t border-[#E31B23] bg-[#161616] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
        <div className="min-w-0">
          <p className="text-xs text-white/50">Price</p>
          <p className="truncate text-xl text-[#E31B23]">{car.price}</p>
        </div>
        <button
          type="button"
          disabled={unavailable}
          onClick={handleAddToCart}
          className={`${cartBtn} !w-auto flex-1 !py-3`}
        >
          {cartLabel}
        </button>
      </div>

      <TestDriveDialog
        open={testDriveOpen}
        onClose={() => setTestDriveOpen(false)}
        vehicle={{ id: car.id, name: car.name }}
      />

      <Footer />
    </>
  );
}
