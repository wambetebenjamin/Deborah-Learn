import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin, Users } from "lucide-react";
import type { Instructor } from "@/lib/types";
import { formatStudents } from "@/lib/utils";
import { Rating } from "./ui";

export default function InstructorCard({
  instructor,
  detailed = false,
}: {
  instructor: Instructor;
  detailed?: boolean;
}) {
  return (
    <article className="instructor-flip" tabIndex={0} aria-label={`${instructor.name}, ${instructor.subject}`}>
      <div className="instructor-flip-inner">
        <div className="instructor-face">
          <div className="relative h-[240px] w-full shrink-0 overflow-hidden bg-[#eef2f0]">
            <Image
              src={instructor.photo}
              alt={`Portrait of ${instructor.name}`}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover object-[center_22%]"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 p-5">
            <span className="eyebrow">{instructor.subject}</span>
            <h3 className="text-lg">{instructor.name}</h3>
            <p className="flex items-center gap-1.5 text-sm text-[#6b7280]">
              <MapPin size={14} aria-hidden="true" />
              {instructor.location}
            </p>
            <div className="mt-auto flex items-center justify-between gap-2 pt-3 text-sm">
              <Rating value={instructor.rating} showValue />
              <span className="flex items-center gap-1 text-[#6b7280]">
                <Users size={14} aria-hidden="true" />
                {formatStudents(instructor.students)}
              </span>
            </div>
            <Link
              href={`/instructors/${instructor.slug}`}
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#0c6b54]"
            >
              View profile
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="instructor-face instructor-back">
          <span className="eyebrow">{instructor.role}</span>
          <h3 className="mt-2 text-lg">{instructor.name}</h3>
          <p className="mt-2 text-sm text-[#4b5563]">{instructor.bio}</p>
          {detailed && (
            <p className="mt-2 text-sm text-[#6b7280]">{instructor.longBio}</p>
          )}
          <Link
            href={`/instructors/${instructor.slug}`}
            className="btn btn-dark btn-sm mt-4 self-start"
          >
            Courses and profile
          </Link>
        </div>
      </div>
    </article>
  );
}
