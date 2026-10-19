"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowRight, Clock, Loader2, Award } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export type DashboardCourse = {
  slug: string;
  title: string;
  cover: string;
  progress: number;
  completed: number;
  total: number;
  nextLessonSlug: string;
  durationHours: number;
  level: string;
};

export function DashboardCourseList({ items }: { items: DashboardCourse[] }) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bars = listRef.current?.querySelectorAll<HTMLElement>("[data-progress]");
    if (!bars || bars.length === 0) return;

    if (reduce) {
      bars.forEach((bar) => {
        bar.style.width = `${bar.dataset.progress ?? 0}%`;
      });
      return;
    }

    let cleanup: (() => void) | undefined;
    import("gsap").then(({ gsap }) => {
      const tween = gsap.fromTo(
        bars,
        { width: "0%" },
        {
          width: (i) => `${bars[i]?.dataset.progress ?? 0}%`,
          duration: 1.2,
          ease: "power2.out",
          stagger: 0.12,
          delay: 0.2,
        },
      );
      cleanup = () => tween.kill();
    });

    return () => cleanup?.();
  }, [items]);

  if (items.length === 0) {
    return (
      <div className="rounded-[10px] border border-dashed border-[#d8dee5] bg-[#fbfcfd] p-8 text-center">
        <h3 className="text-lg">You have not enrolled in a course yet</h3>
        <p className="mt-1.5 text-sm text-[#5b6470]">
          Browse the catalogue, choose a subject, and your first lesson can start today.
        </p>
        <Link href="/courses" className="btn btn-primary btn-sm mt-4">
          Browse courses
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4" ref={listRef}>
      {items.map((item) => (
        <article className="card" key={item.slug}>
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
            <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-[#eef2f0] sm:w-36">
              <Image
                src={item.cover}
                alt={`${item.title} cover`}
                fill
                sizes="144px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#8a94a0]">
                <span className="badge badge-neutral">{item.level}</span>
                <span className="flex items-center gap-1">
                  <Clock size={12} aria-hidden="true" />
                  {item.durationHours} hours
                </span>
              </div>
              <h3 className="mt-1.5 text-base">
                <Link href={`/learn/${item.slug}/${item.nextLessonSlug}`} className="hover:text-[#0c6b54]">
                  {item.title}
                </Link>
              </h3>
              <div className="mt-3">
                <div className="mb-1.5 flex items-center justify-between text-xs font-semibold text-[#4b5563]">
                  <span>
                    {item.completed} of {item.total} lessons
                  </span>
                  <span>{item.progress}%</span>
                </div>
                <div
                  className="progress-track"
                  role="progressbar"
                  aria-valuenow={item.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${item.title} progress`}
                >
                  <div className="progress-fill" data-progress={item.progress} style={{ width: 0 }} />
                </div>
              </div>
            </div>
            <Link
              href={`/learn/${item.slug}/${item.nextLessonSlug}`}
              className="btn btn-dark btn-sm shrink-0"
            >
              {item.progress === 0 ? "Start course" : "Continue"}
              <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
}

export function CertificateActions({
  courseSlug,
  courseTitle,
  existingCertificateId,
  complete,
}: {
  courseSlug: string;
  courseTitle: string;
  existingCertificateId?: string;
  complete: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (existingCertificateId) {
    return (
      <Link href={`/certificates/${existingCertificateId}`} className="btn btn-outline btn-sm">
        <Award size={14} aria-hidden="true" />
        View certificate
      </Link>
    );
  }

  if (!complete) {
    return (
      <span className="text-xs text-[#8a94a0]">
        Certificate unlocks at 100 percent
      </span>
    );
  }

  const generate = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/certificates/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: courseSlug }),
      });
      const data = (await response.json()) as {
        ok?: boolean;
        certificate?: { id: string };
        error?: string;
      };
      if (!response.ok || !data.certificate) {
        setError(data.error ?? "The certificate could not be generated");
        setLoading(false);
        return;
      }
      router.push(`/certificates/${data.certificate.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <button type="button" className="btn btn-primary btn-sm" onClick={generate} disabled={loading}>
        {loading ? (
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          <Award size={14} aria-hidden="true" />
        )}
        {complete ? "Claim certificate" : courseTitle}
      </button>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}
