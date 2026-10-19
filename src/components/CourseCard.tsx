"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Users } from "lucide-react";
import type { Course } from "@/lib/types";
import { getInstructor } from "@/lib/data";
import { formatKES, formatStudents } from "@/lib/utils";
import { Rating } from "./ui";

export default function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  const instructor = getInstructor(course.instructor);

  return (
    <motion.article
      className="card course-card"
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.06, 0.3) }}
      whileHover={{ y: -8 }}
    >
      <Link href={`/courses/${course.slug}`} className="course-cover block" aria-label={course.title}>
        <Image
          src={course.cover}
          alt={`${course.title} course cover`}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover"
        />
        <span className="absolute left-3 top-3 badge">{course.level}</span>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center justify-between gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[#8a94a0]">
          <span>{course.category}</span>
          <span className="flex items-center gap-1">
            <Clock size={13} aria-hidden="true" />
            {course.durationHours}h
          </span>
        </div>
        <h3>
          <Link href={`/courses/${course.slug}`} className="hover:text-[#0c6b54]">
            {course.title}
          </Link>
        </h3>
        <p className="text-[0.88rem] text-[#6b7280]">{instructor?.name ?? "Deborah Learn faculty"}</p>

        <div className="mt-auto space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <Rating value={course.rating} count={course.reviewCount} />
            <span className="flex items-center gap-1 text-[0.8rem] text-[#6b7280]">
              <Users size={13} aria-hidden="true" />
              {formatStudents(course.students)} students
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 border-t border-[#edf0f5] pt-3">
            <span className="course-price">{formatKES(course.price)}</span>
            <Link href={`/courses/${course.slug}`} className="btn btn-dark btn-sm">
              Enrol
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
