// Path: components/animated-splash.tsx  (keep your existing file name)

"use client";

import { useEffect, useState } from "react";

/**
 * AnimatedSplash: tachometer version
 * ----------------------------------
 * The Auto-Prime Car Trading logo starts dark. Under it, a tachometer sweeps
 * from 0 to redline: the red arc fills, the needle climbs and the % counter
 * runs. As the needle passes, AUTO-PRIME ignites and the CAR TRADING bar is
 * revealed. At redline the logo flares, then
 * everything fades into the homepage.
 *
 * - Shows only when running as an installed PWA (standalone).
 * - Once per session.
 * - Test in a normal browser tab: /?splash
 * - Respects prefers-reduced-motion.
 *
 * Place as the FIRST child inside <body> in app/layout.tsx.
 *
 * Palette: black #0A0A0A | deep red #8F1117 | red #E31B23 | white #FFFFFF
 */

type Props = {
  /** How long the splash stays before it starts fading out (ms). */
  duration?: number;
  /** Fade-out length (ms). */
  fadeMs?: number;
};

type Phase = "pending" | "show" | "exit" | "done";

const SESSION_KEY = "pad-splash-seen";

/* ---------- Gauge geometry (viewBox 200 x 150, 240 degree sweep) ---------- */
const CX = 100;
const CY = 92;
const rad = (deg: number) => (deg * Math.PI) / 180;

// 33 ticks: every 7.5 deg, a major tick (and number) every 4th, redline from 6
const TICKS = Array.from({ length: 33 }, (_, i) => ({
  i,
  angle: -120 + 7.5 * i,
  major: i % 4 === 0,
  red: i >= 24,
}));

export default function AnimatedSplash({
  duration = 3700,
  fadeMs = 600,
}: Props) {
  const [phase, setPhase] = useState<Phase>("pending");

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.matchMedia("(display-mode: window-controls-overlay)").matches ||
      window.matchMedia("(display-mode: fullscreen)").matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone ===
        true;

    const forced = new URLSearchParams(window.location.search).has("splash");

    let seen = false;
    try {
      seen = sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      /* storage unavailable: just show */
    }

    if ((!standalone && !forced) || (seen && !forced)) {
      setPhase("done");
      return;
    }

    try {
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const total = reduced ? 1000 : duration;

    setPhase("show");
    const exitTimer = window.setTimeout(() => setPhase("exit"), total);
    const doneTimer = window.setTimeout(() => setPhase("done"), total + fadeMs);

    return () => {
      window.clearTimeout(exitTimer);
      window.clearTimeout(doneTimer);
    };
  }, [duration, fadeMs]);

  if (phase === "done") return null;

  return (
    <div
      className="pad-splash"
      data-active={phase === "show" || phase === "exit"}
      data-exit={phase === "exit"}
      role="status"
      aria-live="polite"
      aria-label="Loading Auto-Prime Car Trading"
      style={{ ["--pad-fade" as string]: `${fadeMs}ms` }}
    >
      <div className="pad-stage">
        {/* AUTO-PRIME: dark until the needle reaches it */}
        <h1 className="pad-word" aria-label="Auto-Prime Car Trading">
          <span className="pad-l" aria-hidden="true">
            Auto-Prime
          </span>
        </h1>

        {/* CAR TRADING: revealed in step with the needle */}
        <div className="pad-tag">
          <span>Car Trading</span>
        </div>

        {/* Tachometer = the loading bar */}
        <div className="pad-gauge" aria-hidden="true">
          <svg viewBox="0 0 200 150" overflow="visible">
            <defs>
              <linearGradient id="padNeedle" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0" stopColor="#E31B23" />
                <stop offset="1" stopColor="#FFFFFF" />
              </linearGradient>
              <radialGradient id="padGlow">
                <stop offset="0" stopColor="#8F1117" stopOpacity="0.55" />
                <stop offset="1" stopColor="#8F1117" stopOpacity="0" />
              </radialGradient>
            </defs>

            <circle
              className="pad-gglow"
              cx={CX}
              cy={CY}
              r="78"
              fill="url(#padGlow)"
            />

            {/* track */}
            <path
              d="M30.72 132 A80 80 0 1 1 169.28 132"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="6"
              strokeLinecap="round"
            />
            {/* redline zone */}
            <path
              d="M174.48 49 A86 86 0 0 1 174.48 135"
              fill="none"
              stroke="#B91C1C"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* progress arc */}
            <path
              className="pad-arc"
              d="M30.72 132 A80 80 0 1 1 169.28 132"
              pathLength={100}
              fill="none"
              stroke="#E31B23"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray="100"
            />

            {/* ticks */}
            <g strokeLinecap="round">
              {TICKS.map((t) => (
                <line
                  key={t.i}
                  x1={CX}
                  y1={CY - 74}
                  x2={CX}
                  y2={CY - (t.major ? 62 : 68)}
                  transform={`rotate(${t.angle} ${CX} ${CY})`}
                  stroke={t.red ? "#B91C1C" : "#FFFFFF"}
                  strokeOpacity={t.major ? 0.9 : 0.4}
                  strokeWidth={t.major ? 2 : 1}
                />
              ))}
            </g>

            {/* numbers 0-8 */}
            <g textAnchor="middle" fontSize="9">
              {TICKS.filter((t) => t.major).map((t) => (
                <text
                  key={t.i}
                  x={(CX + 50 * Math.sin(rad(t.angle))).toFixed(2)}
                  y={(CY - 50 * Math.cos(rad(t.angle)) + 3.2).toFixed(2)}
                  fill={t.red ? "#B91C1C" : "#FFFFFF"}
                  fillOpacity={t.red ? 1 : 0.75}
                >
                  {t.i / 4}
                </text>
              ))}
              <text
                x={CX}
                y="66"
                fontSize="5"
                fill="#FFFFFF"
                fillOpacity="0.45"
                letterSpacing="1"
              >
                x1000 r/min
              </text>
            </g>

            {/* needle */}
            <g className="pad-needle">
              <polygon
                points="98.6,102 98,92 100,24 102,92 101.4,102"
                fill="url(#padNeedle)"
              />
            </g>
            <circle
              cx={CX}
              cy={CY}
              r="7"
              fill="#0A0A0A"
              stroke="#FFFFFF"
              strokeWidth="2"
            />
            <circle cx={CX} cy={CY} r="2.6" fill="#E31B23" />
          </svg>

          {/* % readout */}
          <div className="pad-readout" />
        </div>
      </div>

      <style>{`
        @property --pad-n {
          syntax: "<integer>";
          inherits: true;
          initial-value: 0;
        }

        .pad-splash {
          --deep: #8F1117;
          --red: #E31B23;
          --white: #FFFFFF;
          --dark: #0A0A0A;
          --head: var(--font-rajdhani), "Arial Black", Arial, system-ui, sans-serif;
          --t0: 300ms;      /* sweep start */
          --drive: 2600ms;  /* sweep duration (gauge = loading bar) */
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: none;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          background:
            radial-gradient(55% 40% at 50% 55%, rgba(143,17,23,0.28), transparent 70%),
            var(--dark);
          opacity: 1;
          transition: opacity var(--pad-fade, 600ms) ease, transform var(--pad-fade, 600ms) ease;
          padding: env(safe-area-inset-top) env(safe-area-inset-right)
                   env(safe-area-inset-bottom) env(safe-area-inset-left);
        }
        @media (display-mode: standalone),
               (display-mode: window-controls-overlay),
               (display-mode: fullscreen) {
          .pad-splash { display: flex; }
        }
        .pad-splash[data-active="true"] { display: flex; }
        .pad-splash[data-exit="true"] {
          opacity: 0;
          transform: scale(1.04);
          pointer-events: none;
        }

        .pad-stage {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: fit-content;
          font-size: clamp(34px, 10vw, 76px); /* logo size drives everything */
        }

        /* ---------- Logo ---------- */
        .pad-word {
          margin: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 0.14em;
          font-family: var(--head);
          font-weight: 700;
          font-style: italic;
          font-size: 1em;
          line-height: 1;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          white-space: nowrap;
          animation: pad-flare 700ms ease-out 2900ms;
        }
        .pad-l {
          display: inline-block;
          opacity: 0.12; /* unlit */
          color: var(--white);
          text-shadow: 0 0 0.35em rgba(227,27,35,0.45);
          animation: pad-ignite 520ms ease-out 700ms forwards;
        }
        /* ---------- CAR TRADING ---------- */
        .pad-tag {
          margin-top: 0.14em;
          display: flex;
          justify-content: center;
          background: var(--deep);
          color: var(--white);
          font-family: var(--head);
          font-weight: 700;
          font-style: italic;
          font-size: 0.26em;
          letter-spacing: 0.5em;
          text-transform: uppercase;
          padding: 0.4em 0.9em 0.4em 1.4em;
          box-shadow: 0 0 1.4em rgba(143,17,23,0.55);
          clip-path: inset(0 100% 0 0);
          animation: pad-reveal var(--drive) linear var(--t0) forwards;
        }

        /* ---------- Gauge ---------- */
        .pad-gauge {
          position: relative;
          width: 4em;
          margin: 0.45em auto 0;
          animation: pad-flare 700ms ease-out 2900ms;
        }
        .pad-gauge svg { display: block; width: 100%; height: auto; overflow: visible; }
        .pad-gauge text { font-family: var(--head); font-weight: 700; }

        .pad-arc {
          stroke-dashoffset: 100;
          filter: drop-shadow(0 0 3px rgba(227,27,35,0.8));
          animation: pad-arc var(--drive) linear var(--t0) both;
        }
        .pad-needle {
          transform-box: view-box;
          transform-origin: 100px 92px;
          transform: rotate(-120deg);
          filter: drop-shadow(0 0 3px rgba(227,27,35,0.8));
          animation: pad-needle var(--drive) linear var(--t0) both;
        }
        .pad-gglow {
          opacity: 0.1;
          animation: pad-gglow var(--drive) linear var(--t0) both;
        }

        .pad-readout {
          position: absolute;
          left: 50%;
          top: 74%;
          transform: translateX(-50%);
          font-family: var(--head);
          font-weight: 700;
          font-size: 0.26em;
          line-height: 1;
          color: var(--white);
          text-shadow: 0 0 0.4em rgba(227,27,35,0.5);
          font-variant-numeric: tabular-nums;
          counter-reset: pad-n var(--pad-n);
          animation: pad-count var(--drive) linear var(--t0) both;
        }
        .pad-readout::before { content: counter(pad-n) "%"; }

        /* ---------- Keyframes ---------- */
        /* needle, arc, counter and tag reveal share one speed curve */
        @keyframes pad-needle {
          0%   { transform: rotate(-120deg); animation-timing-function: linear; }
          85%  { transform: rotate(84deg);   animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
          100% { transform: rotate(120deg); }
        }
        @keyframes pad-arc {
          0%   { stroke-dashoffset: 100; animation-timing-function: linear; }
          85%  { stroke-dashoffset: 15;  animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes pad-count {
          0%   { --pad-n: 0;   animation-timing-function: linear; }
          85%  { --pad-n: 85;  animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
          100% { --pad-n: 100; }
        }
        @keyframes pad-gglow {
          0%   { opacity: 0.1; }
          100% { opacity: 0.9; }
        }
        @keyframes pad-reveal {
          0%   { clip-path: inset(0 100% 0 0); animation-timing-function: linear; }
          85%  { clip-path: inset(0 15% 0 0);  animation-timing-function: cubic-bezier(0.2, 0.7, 0.3, 1); }
          100% { clip-path: inset(0 0 0 0); }
        }
        @keyframes pad-ignite {
          0%   { opacity: 0.12; }
          20%  { opacity: 1; }
          32%  { opacity: 0.35; }
          50%  { opacity: 1; }
          62%  { opacity: 0.7; }
          100% { opacity: 1; }
        }
        @keyframes pad-lift {
          0%   { transform: translateY(0.12em) scale(0.92); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes pad-flare {
          0%   { filter: brightness(1) drop-shadow(0 0 0 rgba(227,27,35,0)); }
          35%  { filter: brightness(1.3) drop-shadow(0 0 0.22em rgba(227,27,35,0.8)); }
          100% { filter: brightness(1) drop-shadow(0 0 0 rgba(227,27,35,0)); }
        }

        @media (prefers-reduced-motion: reduce) {
          .pad-splash *, .pad-splash *::before {
            animation-duration: 1ms !important;
            animation-delay: 0ms !important;
            animation-iteration-count: 1 !important;
            transition: none !important;
          }
          .pad-splash[data-exit="true"] { transform: none; }
        }
      `}</style>
    </div>
  );
}
