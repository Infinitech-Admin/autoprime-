// components/layout/wordmark.tsx
//
// Shared Auto-Prime Car Trading logo. Used by the navbar, footer, login and register.
// Place it inside an element with the `group` class for the hover effects.
// Size it with a text-size class: everything inside scales with em.
//
// Palette: black #0A0A0A | white #FFFFFF | red #E31B23

type WordmarkProps = {
  className?: string;
  /** Show the small car outline before the name. Off in the navbar. */
  showMark?: boolean;
};

// Car silhouette echoing the logo: white outline, red window and tail light.
export function CarMark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 40"
      fill="none"
      className="h-[0.62em] w-[1.85em] shrink-0 transition-transform duration-300 group-hover:translate-x-0.5"
    >
      {/* body */}
      <path
        d="M3 29 L22 25 C32 17 44 11 60 10 C76 9.5 88 15 96 22 L112 26 C115 27 117 28 117 30 L100 31 A10 10 0 0 0 80 31 L38 31 A10 10 0 0 0 18 31 L3 30 Z"
        stroke="#FFFFFF"
        strokeWidth="2.6"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* window line */}
      <path
        d="M36 22 C46 15 58 13 70 13.5 L84 20"
        stroke="#E31B23"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      {/* tail light */}
      <path
        d="M110 26.5 L115 28"
        stroke="#E31B23"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Kept so any file still importing { ShieldMark } or { WheelO } keeps building.
export const ShieldMark = CarMark;
export const WheelO = CarMark;

export function Wordmark({ className = "", showMark = true }: WordmarkProps) {
  return (
    <span
      role="img"
      aria-label="Auto-Prime Car Trading"
      className={`inline-flex items-center gap-[0.4em] whitespace-nowrap ${className}`}
    >
      {showMark ? <CarMark /> : null}

      <span aria-hidden="true" className="flex flex-col leading-none">
        <span
          className={`${showMark ? "text-[0.78em]" : "text-[1em]"} font-black uppercase italic tracking-tight text-[#FFFFFF] transition-colors duration-300 group-hover:text-[#E31B23]`}
        >
          Auto-Prime
        </span>
        <span className="mt-[0.22em] text-[0.26em] font-bold uppercase italic tracking-[0.34em] text-[#E31B23] transition-colors duration-300 group-hover:text-[#FFFFFF]">
          Car Trading
        </span>
      </span>
    </span>
  );
}

export default Wordmark;
