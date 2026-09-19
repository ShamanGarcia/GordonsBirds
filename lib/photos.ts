import { prisma } from "@/lib/prisma";
import { caseInsensitiveContains } from "@/lib/search";

const PHOTO_CARD_SELECT = {
  id: true,
  thumbnailUrl: true,
  optimizedUrl: true,
  blurDataUrl: true,
  width: true,
  height: true,
  locationName: true,
  species: {
    select: { commonName: true, scientificName: true },
  },
} as const;

export type PhotoCardData = {
  id: string;
  thumbnailUrl: string;
  optimizedUrl: string;
  blurDataUrl: string | null;
  width: number;
  height: number;
  locationName: string;
  species: { commonName: string; scientificName: string };
};

export async function getRandomPhotos(count: number): Promise<PhotoCardData[]> {
  const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
    `SELECT id FROM "Photo" ORDER BY RANDOM() LIMIT ${count}`,
  );
  const ids = rows.map((r) => r.id);
  if (ids.length === 0) return [];
  const photos = await prisma.photo.findMany({
    where: { id: { in: ids } },
    select: PHOTO_CARD_SELECT,
  });
  const byId = new Map(photos.map((p) => [p.id, p]));
  return ids.map((id) => byId.get(id)).filter((p): p is PhotoCardData => Boolean(p));
}

export async function getAllPhotosForGallery(): Promise<PhotoCardData[]> {
  return prisma.photo.findMany({
    select: PHOTO_CARD_SELECT,
    orderBy: { dateUploaded: "desc" },
  });
}

export async function getCatalogue(params: {
  query?: string;
  country?: string;
  region?: string;
}): Promise<PhotoCardData[]> {
  const { query, country, region } = params;

  const speciesFilter = query
    ? {
        OR: [
          { commonName: caseInsensitiveContains(query) },
          { scientificName: caseInsensitiveContains(query) },
          { genus: caseInsensitiveContains(query) },
        ],
      }
    : undefined;

  return prisma.photo.findMany({
    where: {
      ...(speciesFilter ? { species: speciesFilter } : {}),
      ...(country ? { country } : {}),
      ...(region ? { region } : {}),
    },
    select: PHOTO_CARD_SELECT,
    orderBy: { dateUploaded: "desc" },
  });
}

export async function getLocationOptions() {
  const rows = await prisma.photo.findMany({
    select: { country: true, region: true },
    distinct: ["country", "region"],
  });
  const countries = Array.from(new Set(rows.map((r) => r.country).filter(Boolean))) as string[];
  const regions = Array.from(new Set(rows.map((r) => r.region).filter(Boolean))) as string[];
  return { countries: countries.sort(), regions: regions.sort() };
}

export async function getPhotoDetail(id: string) {
  return prisma.photo.findUnique({
    where: { id },
    include: { species: true },
  });
}

export async function getAdjacentPhotoIds(id: string) {
  const all = await prisma.photo.findMany({
    select: { id: true },
    orderBy: { dateUploaded: "desc" },
  });
  const index = all.findIndex((p) => p.id === id);
  if (index === -1) return { prevId: null, nextId: null };
  const prevId = index > 0 ? all[index - 1].id : null;
  const nextId = index < all.length - 1 ? all[index + 1].id : null;
  return { prevId, nextId };
}

export async function getPhotosBySpecies(speciesId: string): Promise<PhotoCardData[]> {
  return prisma.photo.findMany({
    where: { speciesId },
    select: PHOTO_CARD_SELECT,
    orderBy: { dateUploaded: "desc" },
  });
}

export async function getPhotosByTaxonRank(
  rank: "order" | "family" | "genus",
  value: string,
): Promise<PhotoCardData[]> {
  return prisma.photo.findMany({
    where: { species: { [rank]: value } },
    select: PHOTO_CARD_SELECT,
    orderBy: { dateUploaded: "desc" },
  });
}

export async function getMapPhotos() {
  return prisma.photo.findMany({
    select: {
      id: true,
      latitude: true,
      longitude: true,
      locationName: true,
      thumbnailUrl: true,
      species: { select: { commonName: true, scientificName: true } },
    },
  });
}
