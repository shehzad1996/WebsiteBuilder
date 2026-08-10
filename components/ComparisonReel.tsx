"use client";

import { useEffect, useState } from "react";

const PAIN_ATTEMPTS = [
  { prompt: "“Make it look more professional”", cost: 0.4 },
  { prompt: "“The layout broke on mobile”", cost: 0.65 },
  { prompt: "“Now the contact form doesn’t work”", cost: 0.55 },
  { prompt: "“Try again, from scratch”", cost: 1.85 },
];

const SOLUTION_STEPS = [
  "Describe your website once",
  "A real developer builds it",
  "You review the actual working site",
];

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function ComparisonReel() {
  const [phase, setPhase] = useState<"pain" | "solution">("pain");
  const [visiblePain, setVisiblePain] = useState(0);
  const [visibleSolution, setVisibleSolution] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      setVisiblePain(PAIN_ATTEMPTS.length);
      setVisibleSolution(SOLUTION_STEPS.length);
      return;
    }

    let cancelled = false;

    async function run() {
      while (!cancelled) {
        setPhase("pain");
        setVisiblePain(0);
        setVisibleSolution(0);
        for (let i = 1; i <= PAIN_ATTEMPTS.length; i++) {
          await sleep(700);
          if (cancelled) return;
          setVisiblePain(i);
        }
        await sleep(1800);
        if (cancelled) return;

        setPhase("solution");
        for (let i = 1; i <= SOLUTION_STEPS.length; i++) {
          await sleep(650);
          if (cancelled) return;
          setVisibleSolution(i);
        }
        await sleep(2400);
        if (cancelled) return;
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  const PAIN_TOTAL_DISPLAY = "$14.85+"; // shown attempts + the ones that happened off-screen
  const painDone = visiblePain === PAIN_ATTEMPTS.length;
  const solutionDone = visibleSolution === SOLUTION_STEPS.length;

  return (
    <div className="grid items-start gap-6 lg:grid-cols-2">
      {/* Pain */}
      <div
        className={`rounded-2xl border p-6 transition-all duration-700 ${
          phase === "pain"
            ? "border-red-500/30 bg-night-soft/50 opacity-100"
            : "border-red-500/10 bg-night-soft/20 opacity-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">AI alone, no architecture plan</h3>
          <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[11px] font-medium text-red-300">
            Still not done
          </span>
        </div>

        <div className="mt-4 min-h-[132px] space-y-2.5">
          {PAIN_ATTEMPTS.map((attempt, i) => (
            <div
              key={attempt.prompt}
              className={`flex items-center justify-between gap-3 text-sm transition-all duration-500 ${
                i < visiblePain ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              }`}
            >
              <span className="flex items-center gap-2 text-white/50">
                <svg className="h-3.5 w-3.5 shrink-0 animate-spin text-red-400/70" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeOpacity="0.25" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                {attempt.prompt}
              </span>
              <span className="shrink-0 text-red-300/80">${attempt.cost.toFixed(2)}</span>
            </div>
          ))}
          <div
            className={`pl-6 text-sm text-white/30 transition-opacity duration-500 ${
              painDone ? "opacity-100" : "opacity-0"
            }`}
          >
            &hellip; and it keeps going
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm text-white/40">Total spent</span>
          <span className="font-bold text-red-300">{painDone ? PAIN_TOTAL_DISPLAY : "$0.00"}</span>
        </div>
        <p className={`mt-2 text-sm text-red-300/80 transition-opacity duration-500 ${painDone ? "opacity-100" : "opacity-0"}`}>
          Result: still broken, or still not right.
        </p>
      </div>

      {/* Solution */}
      <div
        className={`rounded-2xl border p-6 transition-all duration-700 ${
          phase === "solution"
            ? "border-brand/50 bg-night-soft/70 opacity-100"
            : "border-brand/15 bg-night-soft/30 opacity-50"
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Building it with us</h3>
          <span className="rounded-full border border-brand/40 bg-brand/15 px-2.5 py-1 text-[11px] font-medium text-brand-light">
            Free to build
          </span>
        </div>

        <div className="mt-4 min-h-[132px] space-y-2.5">
          {SOLUTION_STEPS.map((step, i) => (
            <div
              key={step}
              className={`flex items-center justify-between gap-3 text-sm transition-all duration-500 ${
                i < visibleSolution ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
              }`}
            >
              <span className="flex items-center gap-2 text-white/70">
                <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-brand/20 text-[9px] text-brand-light">
                  &#10003;
                </span>
                {step}
              </span>
              <span className="shrink-0 text-brand-light">$0</span>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm text-white/40">Total spent</span>
          <span className="font-bold text-brand-light">
            {solutionDone ? "$0 until you like it" : "$0"}
          </span>
        </div>
        <p className={`mt-2 text-sm text-white/60 transition-opacity duration-500 ${solutionDone ? "opacity-100" : "opacity-0"}`}>
          Result: a real, working website.
        </p>
      </div>
    </div>
  );
}
