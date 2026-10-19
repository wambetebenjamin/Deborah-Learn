import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { courseLessonIds, getCourse } from "@/lib/data";
import {
  createCertificate,
  getEnrolment,
  recordActivity,
} from "@/lib/store";

export async function POST(request: Request) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ ok: false, error: "Sign in to generate a certificate" }, { status: 401 });
  }

  let body: { courseId?: string };
  try {
    body = (await request.json()) as { courseId?: string };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const course = getCourse(body.courseId ?? "");
  if (!course) {
    return NextResponse.json({ ok: false, error: "Course not found" }, { status: 404 });
  }

  const enrolment = await getEnrolment(email, course.slug);
  const lessonIds = courseLessonIds(course);
  const completed = enrolment?.completedLessons.length ?? 0;
  const progress = lessonIds.length === 0 ? 0 : Math.round((completed / lessonIds.length) * 100);

  if (progress < 100) {
    return NextResponse.json(
      {
        ok: false,
        error: "The course is not complete yet",
        progress,
        remaining: Math.max(0, lessonIds.length - completed),
      },
      { status: 422 },
    );
  }

  const certificate = await createCertificate({
    userEmail: email,
    studentName: session?.user?.name ?? email,
    courseSlug: course.slug,
    courseTitle: course.title,
  });

  await recordActivity({
    userEmail: email,
    type: "certificate",
    message: `Earned a certificate in ${course.title}`,
  });

  return NextResponse.json({ ok: true, certificate });
}
