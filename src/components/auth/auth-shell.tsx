// Path: components/auth/auth-shell.tsx

import Link from "next/link";
import type { ReactNode } from "react";
import { Wordmark } from "@/components/layout/wordmark";

// Same export names as before, so login/register keep working unchanged.
export const authLabelClass = "mb-2 block text-sm text-white/80";
export const authInputClass =
  "w-full border border-white/20 bg-[#161616] px-4 py-3.5 text-white placeholder:text-white/35 outline-none transition-colors focus:border-[#E31B23] aria-[invalid=true]:border-[#FF4D55]";
export const authErrorClass = "mt-2 text-sm text-[#FF4D55]";
export const authAlertClass =
  "mb-5 border border-[#FF4D55]/50 bg-[#FF4D55]/10 px-4 py-3 text-sm text-[#FFB3B7]";
export const authButtonClass =
  "inline-flex w-full items-center justify-center gap-2 bg-[#E31B23] px-6 py-4 text-sm font-medium tracking-[0.12em] text-white transition-colors hover:bg-white hover:text-black focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#E31B23] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40 disabled:hover:bg-white/10 disabled:hover:text-white/40";
export const authLinkClass =
  "text-[#E31B23] underline underline-offset-4 transition-colors hover:text-white";

const focus =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-[#E31B23]";

export function AuthShell({
  headline,
  blurb,
  children,
}: {
  headline: string;
  blurb: string;
  children: ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col bg-[#161616] text-white">
      <header className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-5 sm:px-10">
        <Link
          href="/"
          aria-label="Auto-Prime Car Trading home"
          className={focus}
        >
          <Wordmark className="text-3xl sm:text-4xl" />
        </Link>
        <Link
          href="/"
          className={`text-sm tracking-[0.12em] text-white/60 transition-colors hover:text-[#E31B23] ${focus}`}
        >
          ← Back to website
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <div className="w-full max-w-md">
          <p className="mb-5 flex items-center justify-center gap-4 text-center text-xs tracking-[0.25em] text-[#E31B23]">
            <span className="h-px w-8 shrink-0 bg-white/30" />
            {headline}
            <span className="h-px w-8 shrink-0 bg-white/30" />
          </p>
          <div className="border border-white/10 border-t-2 border-t-[#E31B23] bg-[#1E1E1E] p-6 sm:p-9">
            {children}
          </div>
          <p className="mt-5 text-center text-sm leading-6 text-white/55">
            {blurb}
          </p>
        </div>
      </div>
    </main>
  );
}
