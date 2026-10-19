import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Award,
  BookOpen,
  Check,
  Clock,
  Download,
  FileText,
  Globe,
  MessageCircle,
  PlayCircle,
  Users,
} from "lucide-react";
import { auth } from "@/auth";
import CourseCurriculum from "@/components/CourseCurriculum";
import EnrolButton from "@/components/EnrolButton";
import { Rating } from "@/components/ui";
import { courses, courseLessonCount, flatLessons, getCourse, getInstructor } from "@/lib/data";
import { getEnrolment } from "@/lib/store";
import { site, whatsappLink } from "@/lib/site";
import { formatKES, formatStudents } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return { title: "Course not found" };
  return {
    title: course.title,
    description: course.summary,
    openGraph: {
      title: course.title,
      description: course.summary,
      images: [{ url: course.cover }],
    },
  };
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const instructor = getInstructor(course.instructor);
  const session = await auth();
  const email = session?.user?.email;
  const enrolment = email ? await getEnrolment(email, course.slug) : null;
  const enrolled = Boolean(enrolment);
  const firstLesson = flatLessons(course)[0];
  const lessonCount = courseLessonCount(course);

  const related = courses
    .filter((item) => item.categorySlug === course.categorySlug && item.slug !== course.slug)
    .slice(0, 2);

  return (
    <>
      <section className="page-header">
        <div className="container-page">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/courses">Courses</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/courses?category=${course.categorySlug}`}>{course.category}</Link>
          </nav>
          <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge">{course.level}</span>
                <span className="badge badge-neutral">{course.category}</span>
                {course.price === 0 && <span className="badge badge-free">Free course</span>}
              </div>
              <h1 className="mt-4 text-3xl leading-tight md:text-[2.7rem]">{course.title}</h1>
              <p className="section-lede">{course.summary}</p>
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[#4b5563]">
                <Rating value={course.rating} count={course.reviewCount} />
                <span className="flex items-center gap-1.5">
                  <Users size={15} aria-hidden="true" />
                  {formatStudents(course.students)} students
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={15} aria-hidden="true" />
                  {course.durationHours} hours
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe size={15} aria-hidden="true" />
                  English, self paced
                </span>
              </div>
              {instructor && (
                <p className="mt-4 text-sm text-[#4b5563]">
                  Taught by{" "}
                  <Link
                    href={`/instructors/${instructor.slug}`}
                    className="font-semibold text-[#0c6b54]"
                  >
                    {instructor.name}
                  </Link>
                  , {instructor.role.toLowerCase()} in {instructor.location}
                </p>
              )}
            </div>

            <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] border border-[#dfe6e2] bg-white">
              <Image
                src={course.cover}
                alt={`${course.title} course cover`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="site-section pt-10">
        <div className="container-page grid gap-10 lg:grid-cols-[1.65fr_1fr] lg:items-start">
          <div className="space-y-10">
            <div>
              <h2 className="text-2xl">Course overview</h2>
              <p className="mt-3 text-[#4b5563]">{course.description}</p>
            </div>

            <div>
              <h2 className="text-2xl">What you will learn</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {course.outcomes.map((outcome) => (
                  <li key={outcome} className="flex items-start gap-2.5 text-sm text-[#3f4854]">
                    <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[#e7fbf4] text-[#0c6b54]">
                      <Check size={12} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h2 className="text-2xl">Curriculum</h2>
                <p className="text-sm text-[#8a94a0]">
                  {course.modules.length} modules, {lessonCount} lessons
                </p>
              </div>
              <p className="mt-2 text-sm text-[#5b6470]">
                The first lesson of each module is free to preview. Open a module to see the
                lessons inside.
              </p>
              <div className="mt-4">
                <CourseCurriculum course={course} />
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h2 className="text-xl">Requirements</h2>
                <ul className="prose-block mt-3 list-disc pl-5 text-sm text-[#4b5563]">
                  {course.requirements.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl">Who this course is for</h2>
                <ul className="prose-block mt-3 list-disc pl-5 text-sm text-[#4b5563]">
                  {course.audience.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-2xl">Student reviews</h2>
              <div className="mt-4 grid gap-4">
                {course.reviews.map((review) => (
                  <figure
                    key={review.name}
                    className="rounded-[10px] border border-[#edf0f5] bg-white p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-display text-sm font-bold text-[#111315]">
                          {review.name}
                        </p>
                        <p className="text-xs text-[#8a94a0]">{review.location}</p>
                      </div>
                      <Rating value={review.rating} showValue={false} />
                    </div>
                    <blockquote className="mt-3 text-sm text-[#4b5563]">
                      {review.quote}
                    </blockquote>
                  </figure>
                ))}
              </div>
            </div>

            {instructor && (
              <div className="card">
                <div className="card-body flex flex-col gap-4 sm:flex-row">
                  <Image
                    src={instructor.photo}
                    alt={`Portrait of ${instructor.name}`}
                    width={96}
                    height={96}
                    className="h-24 w-24 rounded-[10px] object-cover"
                  />
                  <div>
                    <span className="eyebrow">Your instructor</span>
                    <h2 className="mt-1 text-xl">{instructor.name}</h2>
                    <p className="mt-1 text-sm text-[#5b6470]">{instructor.longBio}</p>
                    <Link
                      href={`/instructors/${instructor.slug}`}
                      className="mt-2 inline-block text-sm font-semibold text-[#0c6b54]"
                    >
                      Full profile
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="card">
              <div className="card-body space-y-4">
                <div className="flex items-end justify-between">
                  <span className="course-price text-2xl">{formatKES(course.price)}</span>
                  <span className="text-xs text-[#8a94a0]">one payment</span>
                </div>

                <EnrolButton
                  courseSlug={course.slug}
                  price={course.price}
                  firstLessonSlug={firstLesson?.slug ?? "introduction"}
                  enrolled={enrolled}
                />

                <div className="border-t border-[#edf0f5] pt-4">
                  <p className="font-display text-sm font-bold text-[#111315]">
                    This course includes
                  </p>
                  <ul className="mt-3 space-y-2.5 text-sm text-[#4b5563]">
                    <li className="flex items-center gap-2.5">
                      <PlayCircle size={16} className="text-[#16866b]" aria-hidden="true" />
                      {course.includes.videoHours} hours of video
                    </li>
                    <li className="flex items-center gap-2.5">
                      <FileText size={16} className="text-[#16866b]" aria-hidden="true" />
                      {course.includes.articles} articles and notes
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Download size={16} className="text-[#16866b]" aria-hidden="true" />
                      {course.includes.downloadable} downloadable resources
                    </li>
                    <li className="flex items-center gap-2.5">
                      <Award size={16} className="text-[#16866b]" aria-hidden="true" />
                      Verifiable certificate
                    </li>
                    <li className="flex items-center gap-2.5">
                      <BookOpen size={16} className="text-[#16866b]" aria-hidden="true" />
                      Access on phone and laptop
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg bg-[#f8f9fa] p-3 text-xs text-[#5b6470]">
                  Questions about this course? Message us on WhatsApp at {site.whatsappDisplay}.
                  <a
                    href={whatsappLink(`Hello Deborah Learn, I have a question about ${course.title}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-1.5 font-semibold text-[#0c6b54]"
                  >
                    <MessageCircle size={14} aria-hidden="true" />
                    Ask about this course
                  </a>
                </div>
              </div>
            </div>

            {related.length > 0 && (
              <div className="mt-6 card">
                <div className="card-body">
                  <p className="font-display text-sm font-bold text-[#111315]">
                    More in {course.category}
                  </p>
                  <ul className="mt-3 space-y-3">
                    {related.map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/courses/${item.slug}`}
                          className="text-sm font-semibold text-[#3f4854] hover:text-[#0c6b54]"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-[#8a94a0]">
                          {item.level}, {formatKES(item.price)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
