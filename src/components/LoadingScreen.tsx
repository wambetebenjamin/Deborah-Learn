"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "deborah_learn_loader_seen";

export default function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);
  const [canSkip, setCanSkip] = useState(false);
  const [reduced, setReduced] = useState(false);
  const finished = useRef(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    if (sessionStorage.getItem(STORAGE_KEY) === "true") {
      setVisible(false);
      setProgress(100);
      finished.current = true;
      return;
    }

    const skipTimer = window.setTimeout(() => setCanSkip(true), 1000);
    const started = performance.now();
    const duration = 1800;
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = now - started;
      const value = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(value);
      if (value < 100) {
        frame = requestAnimationFrame(tick);
        return;
      }
      window.setTimeout(() => {
        if (finished.current) return;
        finished.current = true;
        setVisible(false);
        sessionStorage.setItem(STORAGE_KEY, "true");
      }, 180);
    };

    frame = requestAnimationFrame(tick);

    const hardStop = window.setTimeout(() => {
      if (finished.current) return;
      finished.current = true;
      setVisible(false);
      sessionStorage.setItem(STORAGE_KEY, "true");
    }, 3000);

    return () => {
      window.clearTimeout(skipTimer);
      window.clearTimeout(hardStop);
      cancelAnimationFrame(frame);
    };
  }, []);

  const skip = () => {
    if (finished.current) return;
    finished.current = true;
    setVisible(false);
    sessionStorage.setItem(STORAGE_KEY, "true");
  };

  return (
    <div
      className="loading-screen"
      data-hidden={!visible}
      role="status"
      aria-live="polite"
      aria-label={`Loading Deborah Learn, ${progress} percent`}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      <div className="flex w-full max-w-xs flex-col items-center px-6 text-center">
        {reduced ? (
          <p className="font-display text-lg font-bold text-[#111315]">
            Loading Deborah Learn
          </p>
        ) : (
          <svg
            width="132"
            height="96"
            viewBox="0 0 132 96"
            fill="none"
            aria-hidden="true"
            className="text-[#111315]"
          >
            <path
              d="M66 20C54 10 36 8 22 12v54c14-4 32-2 44 8 12-10 30-12 44-8V12c-14-4-32-2-44 8Z"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <path d="M66 20v54" stroke="currentColor" strokeWidth="2.5" />
            <g fill="#46ddb0" stroke="#46ddb0" strokeWidth="1">
              <path d="M28 24c10-2 20 0 30 6v12c-10-6-20-8-30-6V24Z">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 66 42; -7 66 42; 0 66 42"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </path>
              <path d="M104 24c-10-2-20 0-30 6v12c10-6 20-8 30-6V24Z">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="0 66 42; 7 66 42; 0 66 42"
                  dur="1.6s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
            <path
              d="M40 46c8-1.5 16 0 22 4M40 54c8-1.5 16 0 22 4M70 50c6-4 14-5.5 22-4M70 58c6-4 14-5.5 22-4"
              stroke="#cdd4dc"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        )}

        <p className="mt-4 font-display text-3xl font-extrabold tracking-tight text-[#111315]">
          {progress}%
        </p>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#8a94a0]">
          Knowledge that travels with you
        </p>

        <div className="mt-5 h-1 w-full overflow-hidden rounded-full bg-[#e9edf2]">
          <div
            className="h-full rounded-full bg-[#46ddb0]"
            style={{ width: `${progress}%`, transition: "width 120ms linear" }}
          />
        </div>

        <div className="mt-6 h-9">
          {canSkip && visible && (
            <button type="button" className="btn btn-outline btn-sm" onClick={skip}>
              Skip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
