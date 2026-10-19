import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import LessonPlayer from "@/components/LessonPlayer";
import EnrolButton from "@/components/EnrolButton";
import { findLesson, flatLessons, getCourse } from "@/lib/data";
import { getEnrolment } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Lesson player",
  robots: { index: false, follow: false },
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ courseSlug: string; lessonSlug: string }>;
}) {
  const { courseSlug, lessonSlug } = await params;
  const course = getCourse(courseSlug);
  if (!course) notFound();

  const found = findLesson(course, lessonSlug);
  if (!found) notFound();

  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/auth/signin?callbackUrl=/learn/${courseSlug}/${lessonSlug}`);
  }

  const enrolment = await getEnrolment(session.user.email, course.slug);
  const lessons = flatLessons(course);

  if (!enrolment) {
    return (
      <section className="site-section">
        <div className="container-page max-w-xl">
          <div className="card">
            <div className="card-body">
              <span className="eyebrow">Enrolment required</span>
              <h1 className="mt-2 text-2xl">Enrol to open this lesson</h1>
              <p className="mt-2 text-sm text-[#5b6470]">
                {course.title} is not yet part of your learning plan. Enrol and the first
                lesson will open straight away.
              </p>
              <div className="mt-5">
                <EnrolButton
                  courseSlug={course.slug}
                  price={course.price}
                  firstLessonSlug={lessons[0]?.slug ?? lessonSlug}
                />
              </div>
              <Link href={`/courses/${course.slug}`} className="mt-4 inline-block text-sm font-semibold text-[#0c6b54]">
                Back to course details
              </Link>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <LessonPlayer
      course={course}
      lesson={{ ...found.lesson, moduleTitle: found.module.title }}
      initialCompleted={enrolment.completedLessons}
    />
  );
}
