import { put } from "@vercel/blob";

/**
 * Vercel Blob helpers.
 *
 * Lesson videos are served from a public Blob store. Set BLOB_READ_WRITE_TOKEN for uploads
 * and NEXT_PUBLIC_BLOB_BASE_URL to the public store URL used by the lesson player. When either
 * is missing the app falls back to the bundled preview clips in public/videos.
 */
export function blobStorageConfigured() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function videoSource() {
  return blobStorageConfigured() && process.env.NEXT_PUBLIC_BLOB_BASE_URL ? "blob" : "bundled";
}

export async function uploadLessonAsset(
  pathname: string,
  file: Blob,
  contentType: string,
) {
  if (!blobStorageConfigured()) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured");
  }
  const result = await put(pathname, file, {
    access: "public",
    contentType,
    addRandomSuffix: false,
  });
  return result;
}
