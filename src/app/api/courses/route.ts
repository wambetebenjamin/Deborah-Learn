import { NextResponse } from "next/server";
import { courses, getInstructor } from "@/lib/data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category")?.toLowerCase() ?? "";
  const level = searchParams.get("level")?.toLowerCase() ?? "";
  const price = searchParams.get("price")?.toLowerCase() ?? "";
  const search = searchParams.get("search")?.trim().toLowerCase() ?? "";
  const page = Math.max(1, Number(searchParams.get("page") ?? 1) || 1);
  const limit = Math.min(48, Math.max(1, Number(searchParams.get("limit") ?? 12) || 12));

  const filtered = courses.filter((course) => {
    if (category && course.categorySlug !== category) return false;
    if (level && course.level.toLowerCase() !== level) return false;
    if (price === "free" && course.price !== 0) return false;
    if (price === "paid" && course.price === 0) return false;
    if (search) {
      const instructor = getInstructor(course.instructor);
      const haystack = [
        course.title,
        course.summary,
        course.description,
        course.category,
        course.level,
        instructor?.name ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  const start = (page - 1) * limit;
  const items = filtered.slice(start, start + limit);

  return NextResponse.json({
    ok: true,
    total: filtered.length,
    page,
    limit,
    pages: Math.max(1, Math.ceil(filtered.length / limit)),
    courses: items.map((course) => ({
      ...course,
      instructorName: getInstructor(course.instructor)?.name ?? "Deborah Learn faculty",
      lessonCount: course.modules.reduce((total, module) => total + module.lessons.length, 0),
    })),
  });
}
