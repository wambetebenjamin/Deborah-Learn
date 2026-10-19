"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Award,
  Check,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Loader2,
  NotebookPen,
  PlayCircle,
} from "lucide-react";
import type { Course, Lesson } from "@/lib/types";
import { flatLessons } from "@/lib/data";
import { cn, overallProgress } from "@/lib/utils";

type FlatLesson = Lesson & { moduleTitle: string };

export default function LessonPlayer({
  course,
  lesson,
  initialCompleted,
}: {
  course: Course;
  lesson: FlatLesson;
  initialCompleted: string[];
}) {
  const router = useRouter();
  const lessons = useMemo(() => flatLessons(course), [course]);
  const index = lessons.findIndex((item) => item.id === lesson.id);
  const previous = index > 0 ? lessons[index - 1] : null;
  const next = index < lessons.length - 1 ? lessons[index + 1] : null;

  const [completed, setCompleted] = useState<string[]>(initialCompleted);
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string>("");
  const [notes, setNotes] = useState("");
  const notesTimer = useRef<number | null>(null);

  const progress = overallProgress(completed.length, lessons.length);
  const isComplete = completed.includes(lesson.id);

  useEffect(() => {
    const stored = window.localStorage.getItem(`deborah_notes_${lesson.id}`);
    setNotes(stored ?? "");
    setSavedAt(stored ? "Saved notes loaded" : "");
  }, [lesson.id]);

  const onNotesChange = (value: string) => {
    setNotes(value);
    if (notesTimer.current) window.clearTimeout(notesTimer.current);
    notesTimer.current = window.setTimeout(() => {
      window.localStorage.setItem(`deborah_notes_${lesson.id}`, value);
      setSavedAt("Saved in this browser");
    }, 500);
  };

  const toggleComplete = async (target: { id: string }, value: boolean) => {
    setSaving(true);
    const optimistic = value
      ? Array.from(new Set([...completed, target.id]))
      : completed.filter((id) => id !== target.id);
    setCompleted(optimistic);

    try {
      const response = await fetch("/api/progress/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.slug,
          lessonId: target.id,
          completed: value,
        }),
      });
      const data = (await response.json()) as { completedLessons?: string[] };
      if (response.ok && data.completedLessons) {
        setCompleted(data.completedLessons);
        router.refresh();
      }
    } catch {
      setCompleted(completed);
    } finally {
      setSaving(false);
    }
  };

  const go = (target: FlatLesson | null) => {
    if (!target) return;
    router.push(`/learn/${course.slug}/${target.slug}`);
  };

  return (
    <div className="player-shell">
      <div className="player-progress" aria-hidden="true">
        <div className="player-progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <header className="border-b border-white/10">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-sm text-[#b9c6c1] hover:text-white"
            >
              <LayoutDashboard size={16} aria-hidden="true" />
              Dashboard
            </Link>
            <span className="text-white/25" aria-hidden="true">/</span>
            <Link href={`/courses/${course.slug}`} className="text-sm text-[#b9c6c1] hover:text-white">
              {course.title}
            </Link>
          </div>
          <p className="text-xs text-[#b9c6c1]">
            {completed.length} of {lessons.length} lessons complete, {progress}%
          </p>
        </div>
      </header>

      <div className="container-page grid gap-6 py-6 lg:grid-cols-[1.9fr_1fr] lg:items-start">
        <main>
          <div className="overflow-hidden rounded-[10px] bg-black">
            <video
              key={lesson.id}
              className="player-video"
              controls
              playsInline
              preload="metadata"
              poster={course.cover}
              src={lesson.videoUrl}
            >
              <source src={lesson.videoUrl} type="video/mp4" />
              Your browser does not support the video element. You can still read the lesson
              notes below.
            </video>
          </div>

          <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[#8fb4a7]">
                {lesson.moduleTitle}
              </p>
              <h1 className="mt-1 text-2xl text-white">{lesson.title}</h1>
              <p className="mt-1 text-sm text-[#a8b7b1]">{lesson.minutes} minute lesson</p>
            </div>
            <button
              type="button"
              className={cn(
                "btn btn-sm",
                isComplete ? "btn-primary" : "btn-ghost-light",
              )}
              onClick={() => toggleComplete(lesson, !isComplete)}
              disabled={saving}
              aria-pressed={isComplete}
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" aria-hidden="true" />
              ) : (
                <Check size={15} aria-hidden="true" />
              )}
              {isComplete ? "Completed" : "Mark complete"}
            </button>
          </div>

          <section className="mt-6 rounded-[10px] border border-white/10 bg-white/5 p-5">
            <h2 className="flex items-center gap-2 font-display text-base font-bold text-white">
              <NotebookPen size={17} aria-hidden="true" />
              Lesson notes
            </h2>
            <p className="mt-2 text-sm text-[#b9c6c1]">{lesson.notes}</p>
            <label htmlFor="lesson-notes" className="sr-only">
              Your notes for this lesson
            </label>
            <textarea
              id="lesson-notes"
              className="mt-4 min-h-[120px] w-full rounded-lg border border-white/15 bg-[#111c18] p-3 text-sm text-[#e8eeeb] placeholder:text-[#6d7c76] focus:border-[#46ddb0] focus:outline-none"
              placeholder="Write your own notes for this lesson. They are saved in this browser."
              value={notes}
              onChange={(event) => onNotesChange(event.target.value)}
            />
            <p className="mt-1 text-xs text-[#8fb4a7]" role="status">
              {savedAt}
            </p>
          </section>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              className="btn btn-ghost-light btn-sm"
              onClick={() => go(previous)}
              disabled={!previous}
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Previous lesson
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => go(next)}
              disabled={!next}
            >
              Next lesson
              <ChevronRight size={16} aria-hidden="true" />
            </button>
          </div>

          {progress === 100 && (
            <div className="mt-6 rounded-[10px] border border-[#46ddb0]/40 bg-[#0f2a23] p-5">
              <h2 className="flex items-center gap-2 font-display text-base font-bold text-white">
                <Award size={18} className="text-[#46ddb0]" aria-hidden="true" />
                Course complete
              </h2>
              <p className="mt-1 text-sm text-[#b9c6c1]">
                Every lesson is marked complete. Generate your certificate from the dashboard.
              </p>
              <Link href="/dashboard" className="btn btn-primary btn-sm mt-3">
                Get my certificate
              </Link>
            </div>
          )}
        </main>

        <aside className="rounded-[10px] border border-white/10 bg-white/5">
          <div className="border-b border-white/10 p-4">
            <h2 className="font-display text-base font-bold text-white">Course curriculum</h2>
            <p className="mt-1 text-xs text-[#a8b7b1]">
              Tick a lesson to mark it complete.
            </p>
          </div>
          <div className="max-h-[70vh] space-y-4 overflow-y-auto p-4">
            {course.modules.map((module) => (
              <div key={module.id}>
                <p className="mb-1.5 px-1 text-[0.7rem] font-bold uppercase tracking-[0.1em] text-[#8fb4a7]">
                  {module.title}
                </p>
                <ul className="space-y-0.5">
                  {module.lessons.map((item) => {
                    const checked = completed.includes(item.id);
                    return (
                      <li key={item.id}>
                        <div
                          className="lesson-row"
                          data-active={item.id === lesson.id}
                        >
                          <button
                            type="button"
                            className="lesson-check"
                            data-checked={checked}
                            aria-label={`${checked ? "Mark incomplete" : "Mark complete"}: ${item.title}`}
                            aria-pressed={checked}
                            onClick={() => toggleComplete(item, !checked)}
                          >
                            {checked && <Check size={13} strokeWidth={3} aria-hidden="true" />}
                          </button>
                          <Link
                            href={`/learn/${course.slug}/${item.slug}`}
                            className="flex flex-1 items-center gap-2"
                          >
                            <PlayCircle size={14} className="shrink-0 text-[#8fb4a7]" aria-hidden="true" />
                            <span className="leading-snug">{item.title}</span>
                          </Link>
                          <span className="shrink-0 text-[0.7rem] text-[#8fb4a7]">
                            {item.minutes}m
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
