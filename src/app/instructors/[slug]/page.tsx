import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, Globe, Linkedin, MapPin, Star, Users } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import { Rating } from "@/components/ui";
import { getInstructor, instructorCourses, instructors } from "@/lib/data";
import { formatStudents } from "@/lib/utils";

export function generateStaticParams() {
  return instructors.map((instructor) => ({ slug: instructor.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const instructor = getInstructor(slug);
  if (!instructor) return { title: "Instructor not found" };
  return {
    title: instructor.name,
    description: instructor.bio,
    openGraph: { title: instructor.name, description: instructor.bio, images: [{ url: instructor.photo }] },
  };
}

export default async function InstructorProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const instructor = getInstructor(slug);
  if (!instructor) notFound();

  const taught = instructorCourses(instructor.slug);
  const totalStudents = taught.reduce((total, course) => total + course.students, 0) + instructor.students;

  return (
    <>
      <section className="page-header">
        <div className="container-page">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/instructors">Instructors</Link>
            <span aria-hidden="true">/</span>
            <span>{instructor.name}</span>
          </nav>
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            <Image
              src={instructor.photo}
              alt={`Portrait of ${instructor.name}`}
              width={168}
              height={168}
              priority
              className="h-40 w-40 rounded-[10px] object-cover object-[center_20%]"
            />
            <div>
              <span className="eyebrow">{instructor.subject}</span>
              <h1 className="mt-2 text-3xl md:text-4xl">{instructor.name}</h1>
              <p className="mt-1 text-sm font-semibold text-[#4b5563]">{instructor.role}</p>
              <p className="mt-3 max-w-2xl text-[#4b5563]">{instructor.longBio}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#4b5563]">
                <span className="flex items-center gap-1.5">
                  <MapPin size={15} aria-hidden="true" />
                  {instructor.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={15} aria-hidden="true" />
                  {formatStudents(totalStudents)} students
                </span>
                <span className="flex items-center gap-1.5">
                  <Award size={15} aria-hidden="true" />
                  {taught.length} courses
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={15} aria-hidden="true" />
                  {instructor.rating.toFixed(1)} average rating
                </span>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                {instructor.socials.linkedin && (
                  <a
                    href={instructor.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Linkedin size={14} aria-hidden="true" />
                    LinkedIn
                  </a>
                )}
                {instructor.socials.x && (
                  <a
                    href={instructor.socials.x}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    X profile
                  </a>
                )}
                {instructor.socials.website && (
                  <a
                    href={instructor.socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <Globe size={14} aria-hidden="true" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section pt-10">
        <div className="container-page">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <span className="eyebrow">Courses taught</span>
              <h2 className="section-title">Learn with {instructor.name.split(" ")[0]}</h2>
            </div>
            <div className="flex items-center gap-3 rounded-full border border-[#edf0f5] bg-white px-4 py-2">
              <Rating value={instructor.rating} />
              <span className="text-xs text-[#8a94a0]">
                from {taught.reduce((total, course) => total + course.reviewCount, 0)} reviews
              </span>
            </div>
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {taught.map((course, index) => (
              <CourseCard key={course.slug} course={course} index={index} />
            ))}
          </div>

          <div className="mt-10 rounded-[10px] border border-[#edf0f5] bg-[#f8f9fa] p-6">
            <h2 className="text-xl">Teaching approach</h2>
            <p className="mt-2 max-w-3xl text-sm text-[#4b5563]">
              {instructor.bio} Lessons are recorded in short segments, with written notes and
              a practical task at the end of every module. Students can ask questions in the
              lesson notes and get a reply within two working days.
            </p>
            <Link href="/courses" className="btn btn-dark btn-sm mt-4">
              Browse all courses
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
