import Papa from "papaparse";
import { basePath } from "@/lib/basePath";

export type Photo = {
  id: string;
  image: string;
  location: string;
  commonName: string;
  scientificName: string;
};

type PhotoRow = {
  id: string;
  image: string;
  location: string;
  species: string;
};

const SPECIES_PATTERN = /^(.*?)\s*\(([^)]+)\)\s*$/;

function parseSpecies(species: string): { commonName: string; scientificName: string } {
  const match = species.match(SPECIES_PATTERN);
  if (!match) return { commonName: species, scientificName: "" };
  return { commonName: match[1], scientificName: match[2] };
}

let cache: Promise<Photo[]> | null = null;

export function loadPhotos(): Promise<Photo[]> {
  if (!cache) {
    cache = fetch(`${basePath}/data/photos.csv`)
      .then((res) => res.text())
      .then((csv) => {
        const { data } = Papa.parse<PhotoRow>(csv, { header: true, skipEmptyLines: true });
        return data.map((row) => ({
          id: row.id,
          image: row.image,
          location: row.location,
          ...parseSpecies(row.species),
        }));
      });
  }
  return cache;
}

export function pickRandom(photos: Photo[], count: number): Photo[] {
  const arr = [...photos];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, count);
}

export function searchPhotos(photos: Photo[], query: string): Photo[] {
  const q = query.trim().toLowerCase();
  if (!q) return photos;
  return photos.filter(
    (p) =>
      p.commonName.toLowerCase().includes(q) ||
      p.scientificName.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q),
  );
}

export function getAdjacentPhotoIds(photos: Photo[], id: string): { prevId: string | null; nextId: string | null } {
  const index = photos.findIndex((p) => p.id === id);
  if (index === -1) return { prevId: null, nextId: null };
  return {
    prevId: index > 0 ? photos[index - 1].id : null,
    nextId: index < photos.length - 1 ? photos[index + 1].id : null,
  };
}
