// Path: components/ui/prime.tsx

// Shared design kit, based on the Auto-Prime logo:
// charcoal surfaces, red/maroon hero and call-to-action bands, wide-tracked wordmark type.
import Link from "next/link";
import type { ReactNode } from "react";

export const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#E31B23]";
// Set --font-display in app/layout.tsx (see notes). Falls back to inherited font if unset.
export const display = "font-[family-name:var(--font-display)]";
export const card =
  "border border-white/10 border-t-2 border-t-[#E31B23] bg-[#1E1E1E]";
const btn = `inline-flex items-center justify-center gap-2 px-8 py-3.5 text-sm font-medium tracking-[0.12em] transition-colors ${focus}`;
export const btnRed = `${btn} bg-[#E31B23] text-white hover:bg-white hover:text-black`;
export const btnLine = `${btn} border border-white/30 text-white hover:border-[#E31B23] hover:text-[#E31B23]`;

// The logo's "— CAR TRADING —" device: small red text between two hairlines.
export function Tagline({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-4 text-xs tracking-[0.35em] text-white">
      <span className="h-px w-10 bg-white/60" />
      {children}
      <span className="h-px w-10 bg-white/60" />
    </p>
  );
}

export function PageHero({
  tagline,
  title,
  back,
  children,
}: {
  tagline?: string;
  title: string;
  back?: { href: string; label: string };
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b-2 border-[#E31B23] bg-gradient-to-br from-[#8F1117] via-[#2A0C0E] to-[#161616]">
      <div className="relative mx-auto max-w-7xl px-4 pb-14 pt-28 sm:px-6 lg:px-8 lg:pb-20 lg:pt-36">
        {back && (
          <Link
            href={back.href}
            className={`mb-8 inline-block text-sm tracking-[0.12em] text-white/60 transition-colors hover:text-[#E31B23] ${focus}`}
          >
            ← {back.label}
          </Link>
        )}
        {tagline && <Tagline>{tagline}</Tagline>}
        <h1
          className={`${display} mt-6 max-w-4xl text-4xl font-light uppercase leading-[1.15] tracking-[0.14em] sm:text-5xl lg:text-6xl`}
        >
          {title}
        </h1>
        {children && (
          <div className="mt-6 max-w-2xl text-base leading-7 text-white/85">
            {children}
          </div>
        )}
      </div>
    </section>
  );
}

export function StateBox({ children }: { children: ReactNode }) {
  return (
    <div className={`${card} border-t-[#E31B23] px-6 py-16 text-center`}>
      {children}
    </div>
  );
}

export function Spinner() {
  return (
    <div className="mx-auto h-9 w-9 animate-spin rounded-full border border-white/15 border-t-[#E31B23]" />
  );
}

const ctaBtn = `inline-flex items-center justify-center px-8 py-3.5 text-sm font-medium tracking-[0.12em] transition-colors ${focus}`;

export function CtaBand({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string; primary?: boolean }[];
}) {
  return (
    <section className="bg-gradient-to-r from-[#8F1117] to-[#E31B23]">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <h2
          className={`${display} text-2xl font-light uppercase tracking-[0.14em] sm:text-3xl`}
        >
          {title}
        </h2>
        <div className="flex flex-col gap-3 sm:flex-row">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${ctaBtn} ${l.primary ? "bg-white text-black hover:bg-black hover:text-white" : "border border-white/70 text-white hover:bg-white hover:text-black"}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// Form fields
export const fieldInput =
  "w-full border border-white/20 bg-[#161616] px-4 py-3.5 text-white placeholder:text-white/35 outline-none transition-colors focus:border-[#E31B23] aria-[invalid=true]:border-[#FF4D55]";
export const fieldLabel = "mb-2 block text-sm text-white/80";
export const fieldError = "mt-2 text-sm text-[#FF4D55]";
