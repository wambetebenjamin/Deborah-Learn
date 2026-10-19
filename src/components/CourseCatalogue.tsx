"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Course } from "@/lib/types";
import { categories } from "@/lib/data";
import { cn } from "@/lib/utils";
import CourseCard from "./CourseCard";

const levels = ["Beginner", "Intermediate", "Advanced"];
const prices = [
  { value: "all", label: "All prices" },
  { value: "free", label: "Free" },
  { value: "paid", label: "Paid" },
];
const durations = [
  { value: "all", label: "Any duration" },
  { value: "short", label: "Under 10 hours" },
  { value: "medium", label: "10 to 12 hours" },
  { value: "long", label: "12 hours and above" },
];

const PAGE_SIZE = 9;

export default function CourseCatalogue({
  courses,
  initialCategory = "all",
  initialLevel = "all",
  initialPrice = "all",
  initialDuration = "all",
  initialSearch = "",
}: {
  courses: Course[];
  initialCategory?: string;
  initialLevel?: string;
  initialPrice?: string;
  initialDuration?: string;
  initialSearch?: string;
}) {
  const [category, setCategory] = useState(initialCategory);
  const [level, setLevel] = useState(initialLevel);
  const [price, setPrice] = useState(initialPrice);
  const [duration, setDuration] = useState(initialDuration);
  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      if (category !== "all" && course.categorySlug !== category) return false;
      if (level !== "all" && course.level !== level) return false;
      if (price === "free" && course.price !== 0) return false;
      if (price === "paid" && course.price === 0) return false;
      if (duration === "short" && course.durationHours >= 10) return false;
      if (duration === "medium" && (course.durationHours < 10 || course.durationHours > 12)) return false;
      if (duration === "long" && course.durationHours <= 12) return false;
      if (search.trim()) {
        const haystack = `${course.title} ${course.summary} ${course.category} ${course.level}`.toLowerCase();
        if (!haystack.includes(search.trim().toLowerCase())) return false;
      }
      return true;
    });
  }, [category, level, price, duration, search, courses]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const reset = () => {
    setCategory("all");
    setLevel("all");
    setPrice("all");
    setDuration("all");
    setSearch("");
    setPage(1);
  };

  const update = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  return (
    <div>
      <div className="filter-bar">
        <div>
          <label className="field-label" htmlFor="filter-search">
            Search
          </label>
          <div className="relative">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a94a0]"
              aria-hidden="true"
            />
            <input
              id="filter-search"
              className="field-input pl-9"
              placeholder="Course or subject"
              value={search}
              onChange={(event) => update(setSearch)(event.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="filter-category">
            Category
          </label>
          <select
            id="filter-category"
            className="field-input"
            value={category}
            onChange={(event) => update(setCategory)(event.target.value)}
          >
            <option value="all">All categories</option>
            {categories.map((item) => (
              <option value={item.slug} key={item.slug}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="filter-level">
            Level
          </label>
          <select
            id="filter-level"
            className="field-input"
            value={level}
            onChange={(event) => update(setLevel)(event.target.value)}
          >
            <option value="all">All levels</option>
            {levels.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="filter-price">
            Price
          </label>
          <select
            id="filter-price"
            className="field-input"
            value={price}
            onChange={(event) => update(setPrice)(event.target.value)}
          >
            {prices.map((item) => (
              <option value={item.value} key={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="field-label" htmlFor="filter-duration">
            Duration
          </label>
          <select
            id="filter-duration"
            className="field-input"
            value={duration}
            onChange={(event) => update(setDuration)(event.target.value)}
          >
            {durations.map((item) => (
              <option value={item.value} key={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-sm text-[#5b6470]">
          <SlidersHorizontal size={15} aria-hidden="true" />
          Showing <strong className="text-[#111315]">{visible.length}</strong> of{" "}
          <strong className="text-[#111315]">{filtered.length}</strong> courses
        </p>
        <button type="button" className="text-sm font-semibold text-[#0c6b54]" onClick={reset}>
          Reset filters
        </button>
      </div>

      {visible.length === 0 ? (
        <div className="mt-10 rounded-[10px] border border-[#edf0f5] bg-white p-10 text-center">
          <h3 className="text-xl">No courses match those filters</h3>
          <p className="mt-2 text-sm text-[#5b6470]">
            Try a different level or price, or reset the filters to see the full catalogue.
          </p>
          <button type="button" className="btn btn-dark btn-sm mt-5" onClick={reset}>
            Reset filters
          </button>
        </div>
      ) : (
        <motion.div layout className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((course, index) => (
            <CourseCard key={course.slug} course={course} index={index} />
          ))}
        </motion.div>
      )}

      {pageCount > 1 && (
        <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Course pages">
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={currentPage === 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            Previous
          </button>
          {Array.from({ length: pageCount }).map((_, index) => {
            const number = index + 1;
            return (
              <button
                key={number}
                type="button"
                aria-current={number === currentPage ? "page" : undefined}
                className={cn(
                  "h-10 w-10 rounded-full border text-sm font-semibold",
                  number === currentPage
                    ? "border-[#111315] bg-[#111315] text-white"
                    : "border-[#d8dee5] text-[#4b5563] hover:border-[#111315]",
                )}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            );
          })}
          <button
            type="button"
            className="btn btn-outline btn-sm"
            disabled={currentPage === pageCount}
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
          >
            Next
          </button>
        </nav>
      )}
    </div>
  );
}
