"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Clock, PlayCircle } from "lucide-react";
import type { Course } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function CourseCurriculum({ course }: { course: Course }) {
  const [open, setOpen] = useState<string[]>([course.modules[0]?.id ?? ""]);
  const [preview, setPreview] = useState<string | null>(null);

  const toggle = (id: string) => {
    setOpen((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <div className="space-y-3">
      {course.modules.map((module, index) => {
        const isOpen = open.includes(module.id);
        const minutes = module.lessons.reduce((total, lesson) => total + lesson.minutes, 0);

        return (
          <div className="accordion-item" key={module.id}>
            <button
              type="button"
              className="accordion-trigger"
              aria-expanded={isOpen}
              aria-controls={`module-panel-${module.id}`}
              onClick={() => toggle(module.id)}
            >
              <span className="flex items-center gap-3">
                <span className="grid h-7 w-7 place-items-center rounded-md bg-[#e7fbf4] text-xs font-bold text-[#0c6b54]">
                  {index + 1}
                </span>
                {module.title}
              </span>
              <span className="flex items-center gap-3 text-xs font-normal text-[#8a94a0]">
                <span className="hidden sm:inline">
                  {module.lessons.length} lessons, {minutes} min
                </span>
                <ChevronDown
                  size={17}
                  className={cn("transition-transform", isOpen && "rotate-180")}
                  aria-hidden="true"
                />
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={`module-panel-${module.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="accordion-panel">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id}>
                        <div className="lesson-line">
                          <span className="flex items-center gap-2.5">
                            <PlayCircle size={16} className="text-[#16866b]" aria-hidden="true" />
                            {lesson.title}
                          </span>
                          <span className="flex shrink-0 items-center gap-3 text-xs text-[#8a94a0]">
                            <span className="flex items-center gap-1">
                              <Clock size={12} aria-hidden="true" />
                              {lesson.minutes} min
                            </span>
                            {lesson.freePreview && (
                              <button
                                type="button"
                                className="rounded-full border border-[#cdeee3] bg-[#e7fbf4] px-2 py-0.5 text-[0.68rem] font-bold uppercase tracking-wide text-[#0c6b54]"
                                onClick={() =>
                                  setPreview(preview === lesson.id ? null : lesson.id)
                                }
                                aria-expanded={preview === lesson.id}
                              >
                                {preview === lesson.id ? "Hide preview" : "Free preview"}
                              </button>
                            )}
                          </span>
                        </div>
                        {preview === lesson.id && (
                          <div className="mb-3 overflow-hidden rounded-lg bg-black">
                            <video
                              className="player-video"
                              controls
                              preload="metadata"
                              src={lesson.videoUrl}
                            >
                              Your browser does not support the video element.
                            </video>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
