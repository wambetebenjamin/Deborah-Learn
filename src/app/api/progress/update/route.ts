import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { courseLessonIds, getCourse } from "@/lib/data";
import { recordActivity, updateProgress } from "@/lib/store";

export async function POST(request: Request) {
  const session = await auth();
  const email = session?.user?.email;

  if (!email) {
    return NextResponse.json({ ok: false, error: "Sign in to save progress" }, { status: 401 });
  }

  let body: { courseId?: string; lessonId?: string; completed?: boolean };
  try {
    body = (await request.json()) as {
      courseId?: string;
      lessonId?: string;
      completed?: boolean;
    };
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const course = getCourse(body.courseId ?? "");
  if (!course) {
    return NextResponse.json({ ok: false, error: "Course not found" }, { status: 404 });
  }

  const ids = courseLessonIds(course);
  if (!body.lessonId || !ids.includes(body.lessonId)) {
    return NextResponse.json(
      { ok: false, error: "Lesson does not belong to this course" },
      { status: 400 },
    );
  }

  const completed = Boolean(body.completed);
  const enrolment = await updateProgress(email, course.slug, body.lessonId, completed);

  const lesson = course.modules
    .flatMap((module) => module.lessons)
    .find((item) => item.id === body.lessonId);

  if (completed && lesson) {
    await recordActivity({
      userEmail: email,
      type: "completed",
      message: `Completed the lesson ${lesson.title}`,
    });
  }

  const progress = Math.round((enrolment.completedLessons.length / ids.length) * 100);

  return NextResponse.json({
    ok: true,
    progress,
    completedLessons: enrolment.completedLessons,
    courseComplete: progress >= 100,
  });
}
