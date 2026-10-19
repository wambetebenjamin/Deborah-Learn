import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Award, BookOpenCheck, Clock, Target } from "lucide-react";
import { auth } from "@/auth";
import { CertificateActions, DashboardCourseList, type DashboardCourse } from "@/components/DashboardProgress";
import CourseCard from "@/components/CourseCard";
import { courses, courseLessonCount, flatLessons, getCourse } from "@/lib/data";
import { listActivity, listCertificates, listEnrolments } from "@/lib/store";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Student dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    redirect("/auth/signin?callbackUrl=/dashboard");
  }

  const enrolments = await listEnrolments(email);
  const certificates = await listCertificates(email);
  const activity = await listActivity(email);

  const dashboardCourses: DashboardCourse[] = enrolments.flatMap((enrolment) => {
    const course = getCourse(enrolment.courseSlug);
    if (!course) return [];
    const lessons = flatLessons(course);
    const total = courseLessonCount(course);
    const completed = enrolment.completedLessons.length;
    const nextLesson =
      lessons.find((lesson) => !enrolment.completedLessons.includes(lesson.id)) ?? lessons[0];
    const entry: DashboardCourse = {
      slug: course.slug,
      title: course.title,
      cover: course.cover,
      progress: total === 0 ? 0 : Math.round((completed / total) * 100),
      completed,
      total,
      nextLessonSlug: nextLesson?.slug ?? "introduction",
      durationHours: course.durationHours,
      level: course.level,
    };
    return [entry];
  });

  const completedCourses = dashboardCourses.filter((item) => item.progress === 100);
  const enrolledSlugs = new Set(enrolments.map((item) => item.courseSlug));
  const recommended = courses
    .filter((course) => !enrolledSlugs.has(course.slug))
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  const totalLessons = dashboardCourses.reduce((total, item) => total + item.total, 0);
  const completedLessons = dashboardCourses.reduce((total, item) => total + item.completed, 0);
  const firstName = session?.user?.name?.split(" ")[0] ?? "learner";

  return (
    <>
      <section className="page-header">
        <div className="container-page">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Dashboard</span>
          </nav>
          <span className="eyebrow">Student dashboard</span>
          <h1 className="mt-2 text-3xl md:text-4xl">Karibu, {firstName}</h1>
          <p className="section-lede">
            Your courses, progress, and certificates in one place. Keep going, you are{" "}
            {totalLessons === 0
              ? "just getting started"
              : `${Math.round((completedLessons / totalLessons) * 100)} percent through your learning plan`}
            .
          </p>
          <div className="mt-7 grid gap-4 sm:grid-cols-3">
            <div className="card">
              <div className="card-body flex items-center gap-3 py-4">
                <span className="category-icon h-11 w-11">
                  <BookOpenCheck size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-2xl font-extrabold text-[#111315]">
                    {enrolments.length}
                  </p>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#8a94a0]">
                    Active courses
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body flex items-center gap-3 py-4">
                <span className="category-icon h-11 w-11">
                  <Clock size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-2xl font-extrabold text-[#111315]">
                    {completedLessons}
                  </p>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#8a94a0]">
                    Lessons completed
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="card-body flex items-center gap-3 py-4">
                <span className="category-icon h-11 w-11">
                  <Award size={20} aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-2xl font-extrabold text-[#111315]">
                    {certificates.length}
                  </p>
                  <p className="text-xs uppercase tracking-[0.1em] text-[#8a94a0]">
                    Certificates earned
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="site-section pt-10">
        <div className="container-page grid gap-10 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <div className="space-y-10">
            <div>
              <div className="flex items-end justify-between">
                <h2 className="text-2xl">Continue learning</h2>
                <Link href="/courses" className="text-sm font-semibold text-[#0c6b54]">
                  Add a course
                </Link>
              </div>
              <div className="mt-4">
                <DashboardCourseList items={dashboardCourses} />
              </div>
            </div>

            <div>
              <h2 className="text-2xl">Certificates earned</h2>
              <div className="mt-4 space-y-3">
                {certificates.length === 0 ? (
                  <p className="rounded-[10px] border border-dashed border-[#d8dee5] bg-[#fbfcfd] p-6 text-sm text-[#5b6470]">
                    No certificates yet. Finish every lesson in a course and the claim button
                    appears here.
                  </p>
                ) : (
                  certificates.map((certificate) => (
                    <div className="card" key={certificate.id}>
                      <div className="card-body flex flex-wrap items-center justify-between gap-3 py-4">
                        <div className="flex items-center gap-3">
                          <span className="certificate-seal h-12 w-12">
                            <Award size={22} aria-hidden="true" />
                          </span>
                          <div>
                            <p className="font-display text-sm font-bold text-[#111315]">
                              {certificate.courseTitle}
                            </p>
                            <p className="text-xs text-[#8a94a0]">
                              Issued {formatDate(certificate.issuedAt)}. ID {certificate.id}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/certificates/${certificate.id}`}
                          className="btn btn-outline btn-sm"
                        >
                          View and download
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {completedCourses.length > 0 && (
              <div>
                <h2 className="text-2xl">Course completion</h2>
                <div className="mt-4 grid gap-3">
                  {completedCourses.map((item) => {
                    const existing = certificates.find(
                      (certificate) => certificate.courseSlug === item.slug,
                    );
                    return (
                      <div
                        className="flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-[#edf0f5] bg-white p-4"
                        key={item.slug}
                      >
                        <div className="flex items-center gap-3">
                          <Image
                            src={item.cover}
                            alt=""
                            width={56}
                            height={56}
                            className="h-14 w-14 rounded-md object-cover"
                          />
                          <div>
                            <p className="font-display text-sm font-bold text-[#111315]">
                              {item.title}
                            </p>
                            <p className="text-xs text-[#8a94a0]">
                              All {item.total} lessons complete
                            </p>
                          </div>
                        </div>
                        <CertificateActions
                          courseSlug={item.slug}
                          courseTitle={item.title}
                          existingCertificateId={existing?.id}
                          complete
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-2xl">Recommended next courses</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {recommended.map((course, index) => (
                  <CourseCard key={course.slug} course={course} index={index} />
                ))}
              </div>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="card">
              <div className="card-body">
                <h2 className="flex items-center gap-2 text-lg">
                  <Clock size={17} className="text-[#16866b]" aria-hidden="true" />
                  Recent activity
                </h2>
                <div className="mt-4">
                  {activity.length === 0 ? (
                    <p className="text-sm text-[#5b6470]">
                      Activity appears here after your first lesson.
                    </p>
                  ) : (
                    <ol className="space-y-0">
                      {activity.slice(0, 8).map((item) => (
                        <li className="activity-item" key={item.id}>
                          <p className="text-sm text-[#3f4854]">{item.message}</p>
                          <p className="text-xs text-[#8a94a0]">{formatDate(item.createdAt)}</p>
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            </div>

            <div className="rounded-[10px] bg-[#f2fbf8] p-5">
              <p className="flex items-center gap-2 font-display text-sm font-bold text-[#111315]">
                <Target size={16} className="text-[#16866b]" aria-hidden="true" />
                Keep your streak
              </p>
              <p className="mt-2 text-sm text-[#4b5563]">
                A short lesson each day is enough. Learners who study three times a week are
                far more likely to finish.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
