import { NextResponse } from "next/server";
import { videoSource } from "@/lib/blob";
import { getCourse, getInstructor } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const course = getCourse(slug);

  if (!course) {
    return NextResponse.json({ ok: false, error: "Course not found" }, { status: 404 });
  }

  return NextResponse.json({
    ok: true,
    videoSource: videoSource(),
    course: {
      ...course,
      instructorProfile: getInstructor(course.instructor) ?? null,
    },
  });
}
