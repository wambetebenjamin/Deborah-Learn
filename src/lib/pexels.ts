/**
 * Thin Pexels client used when PEXELS_API_KEY is configured.
 * The build ships with generated photography, and next.config.ts already allows
 * images.pexels.com, so swapping in Pexels photos needs only the key and new file names.
 */
export type PexelsPhoto = {
  id: number;
  photographer: string;
  alt: string;
  src: { medium: string; large: string; portrait: string };
  url: string;
};

export async function searchPexelsPhotos(query: string, perPage = 12): Promise<PexelsPhoto[]> {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return [];

  const endpoint = new URL("https://api.pexels.com/v1/search");
  endpoint.searchParams.set("query", query);
  endpoint.searchParams.set("per_page", String(Math.min(30, Math.max(1, perPage))));
  endpoint.searchParams.set("orientation", "landscape");

  try {
    const response = await fetch(endpoint, {
      headers: { Authorization: key },
      cache: "no-store",
    });
    if (!response.ok) return [];
    const data = (await response.json()) as { photos?: PexelsPhoto[] };
    return data.photos ?? [];
  } catch {
    return [];
  }
}
