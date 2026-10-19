import { NextResponse } from "next/server";
import { searchPexelsPhotos } from "@/lib/pexels";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query")?.trim();

  if (!query) {
    return NextResponse.json({ ok: false, error: "A query is required" }, { status: 400 });
  }

  if (!process.env.PEXELS_API_KEY) {
    return NextResponse.json(
      {
        ok: false,
        error: "Pexels is not configured",
        note: "Set PEXELS_API_KEY to search Pexels. The site currently uses bundled images.",
      },
      { status: 501 },
    );
  }

  const photos = await searchPexelsPhotos(query, Number(searchParams.get("perPage") ?? 12));
  return NextResponse.json({ ok: true, query, count: photos.length, photos });
}
