import sharp from "sharp";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const PHOTOS_ROOT = path.join(process.cwd(), "public", "photos");

export type ProcessedImage = {
  originalUrl: string;
  optimizedUrl: string;
  thumbnailUrl: string;
  blurDataUrl: string;
  width: number;
  height: number;
};

/**
 * Normalizes EXIF orientation, then writes an original-quality copy plus a
 * display-sized "optimized" copy and a small grid thumbnail. next/image
 * handles further responsive srcset/format negotiation (AVIF/WebP) on top
 * of these local files, so we only need one good source per tier.
 */
export async function processUpload(
  buffer: Buffer,
  slug: string,
): Promise<ProcessedImage> {
  for (const dir of ["original", "optimized", "thumbs"]) {
    await mkdir(path.join(PHOTOS_ROOT, dir), { recursive: true });
  }

  const rotated = sharp(buffer).rotate();
  const { width = 0, height = 0 } = await rotated.metadata();

  const originalBuffer = await rotated.clone().jpeg({ quality: 94 }).toBuffer();
  await writeFile(path.join(PHOTOS_ROOT, "original", `${slug}.jpg`), originalBuffer);

  const optimizedBuffer = await rotated
    .clone()
    .resize({ width: 2200, withoutEnlargement: true })
    .jpeg({ quality: 84, mozjpeg: true })
    .toBuffer();
  await writeFile(path.join(PHOTOS_ROOT, "optimized", `${slug}.jpg`), optimizedBuffer);

  const thumbBuffer = await rotated
    .clone()
    .resize({ width: 640, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toBuffer();
  await writeFile(path.join(PHOTOS_ROOT, "thumbs", `${slug}.jpg`), thumbBuffer);

  const blurBuffer = await rotated
    .clone()
    .resize({ width: 16 })
    .jpeg({ quality: 40 })
    .toBuffer();
  const blurDataUrl = `data:image/jpeg;base64,${blurBuffer.toString("base64")}`;

  return {
    originalUrl: `/photos/original/${slug}.jpg`,
    optimizedUrl: `/photos/optimized/${slug}.jpg`,
    thumbnailUrl: `/photos/thumbs/${slug}.jpg`,
    blurDataUrl,
    width,
    height,
  };
}

/**
 * Deletes the local files backing a photo. Takes the public URLs stored on
 * the Photo row directly (rather than assuming a slug/naming convention)
 * so it works regardless of how the file was originally named.
 */
export async function deletePhotoFiles(urls: (string | null | undefined)[]) {
  const { unlink } = await import("node:fs/promises");
  const publicRoot = path.join(process.cwd(), "public");
  await Promise.all(
    urls
      .filter((u): u is string => Boolean(u && u.startsWith("/photos/")))
      .map((u) => unlink(path.join(publicRoot, u)).catch(() => undefined)),
  );
}
