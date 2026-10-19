import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCourse } from "@/lib/data";
import { createEnrolment, listEnrolments, recordActivity } from "@/lib/store";

export async function POST(request: Request) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ ok: false, error: "Sign in to enrol" }, { status: 401 });
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

  const existing = await listEnrolments(email);
  const already = existing.some((item) => item.courseSlug === course.slug);
  const enrolment = await createEnrolment(email, course.slug);

  if (!already) {
    await recordActivity({
      userEmail: email,
      type: "enrolled",
      message: `Enrolled in ${course.title}`,
    });
  }

  return NextResponse.json({
    ok: true,
    alreadyEnrolled: already,
    enrolment,
    nextLesson: course.modules[0]?.lessons[0]?.slug ?? null,
    courseSlug: course.slug,
  });
}
