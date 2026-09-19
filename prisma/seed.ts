import { config } from "dotenv";
config({ path: ".env.local" });

import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { processUpload } from "../lib/image";

const adapter = new PrismaBetterSqlite3({ url: process.env.DATABASE_URL ?? "file:./prisma/dev.db" });
const prisma = new PrismaClient({ adapter });

type SourcePhoto = {
  scientificName: string;
  commonName: string;
  genus: string;
  family: string;
  order: string;
  locationName: string;
  country: string;
  region: string;
  lat: number;
  lng: number;
  license: string;
  artist: string;
  sourceUrl: string;
};

async function main() {
  const sourcePath = path.join(process.cwd(), "prisma", "seed-data", "photos-source.json");
  const entries: SourcePhoto[] = JSON.parse(await readFile(sourcePath, "utf8"));

  for (const entry of entries) {
    const slug = entry.scientificName.toLowerCase().replace(/\s+/g, "-");
    const imagePath = path.join(process.cwd(), "prisma", "seed-data", "images", `${slug}.jpg`);
    const buffer = await readFile(imagePath);
    const processed = await processUpload(buffer, slug);

    const species = await prisma.species.upsert({
      where: { scientificName: entry.scientificName },
      update: {
        commonName: entry.commonName,
        genus: entry.genus,
        family: entry.family,
        order: entry.order,
      },
      create: {
        scientificName: entry.scientificName,
        commonName: entry.commonName,
        genus: entry.genus,
        family: entry.family,
        order: entry.order,
      },
    });

    await prisma.photo.create({
      data: {
        originalUrl: processed.originalUrl,
        optimizedUrl: processed.optimizedUrl,
        thumbnailUrl: processed.thumbnailUrl,
        blurDataUrl: processed.blurDataUrl,
        width: processed.width,
        height: processed.height,
        latitude: entry.lat,
        longitude: entry.lng,
        locationName: entry.locationName,
        country: entry.country,
        region: entry.region,
        photographer: entry.artist,
        sourceUrl: entry.sourceUrl,
        license: entry.license,
        speciesId: species.id,
      },
    });

    console.log(`Seeded ${entry.commonName} (${entry.scientificName})`);
  }
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
