"use client";

import { useEffect, useRef, useState } from "react";
import { stats } from "@/lib/site";

function formatValue(value: number) {
  if (value >= 1000) {
    const thousands = value / 1000;
    return `${Number.isInteger(thousands) ? thousands.toFixed(0) : thousands.toFixed(1)}k`;
  }
  return String(value);
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState(stats.map(() => 0));
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setValues(stats.map((stat) => stat.value));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;
        const duration = 1400;
        const start = performance.now();

        const step = (now: number) => {
          const progress = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - progress, 3);
          setValues(stats.map((stat) => Math.round(stat.value * eased)));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="stats-band" aria-label="Deborah Learn in numbers">
      <div className="container-page py-12" ref={ref}>
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div key={stat.label}>
              <p className="stat-value">
                {formatValue(values[index])}
                {stat.suffix}
              </p>
              <p className="stat-label mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
