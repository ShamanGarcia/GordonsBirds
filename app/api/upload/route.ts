import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { processUpload } from "@/lib/image";
import { getAdminSession } from "@/lib/auth";

type LocationInput = {
  locationName: string;
  country?: string;
  region?: string;
  lat: number;
  lng: number;
};

export async function POST(request: Request) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const files = formData.getAll("photos").filter((f): f is File => f instanceof File);
  const scientificName = String(formData.get("scientificName") ?? "").trim();
  const commonName = String(formData.get("commonName") ?? "").trim();
  const genus = String(formData.get("genus") ?? "").trim();
  const family = String(formData.get("family") ?? "").trim();
  const order = String(formData.get("order") ?? "").trim();

  let locations: LocationInput[] = [];
  try {
    locations = JSON.parse(String(formData.get("locations") ?? "[]"));
  } catch {
    return NextResponse.json({ error: "Invalid locations payload" }, { status: 400 });
  }

  if (!scientificName || !commonName || !genus || !family || !order) {
    return NextResponse.json({ error: "Species classification is incomplete." }, { status: 400 });
  }
  if (files.length === 0) {
    return NextResponse.json({ error: "No photographs were provided." }, { status: 400 });
  }
  if (locations.length === 0 || locations.some((l) => typeof l.lat !== "number" || typeof l.lng !== "number")) {
    return NextResponse.json({ error: "A location is required for each photograph." }, { status: 400 });
  }

  const species = await prisma.species.upsert({
    where: { scientificName },
    update: { commonName, genus, family, order },
    create: { scientificName, commonName, genus, family, order },
  });

  const createdIds: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const loc = locations[i] ?? locations[0];
    const buffer = Buffer.from(await file.arrayBuffer());
    const slug = randomUUID();
    const processed = await processUpload(buffer, slug);

    const photo = await prisma.photo.create({
      data: {
        originalUrl: processed.originalUrl,
        optimizedUrl: processed.optimizedUrl,
        thumbnailUrl: processed.thumbnailUrl,
        blurDataUrl: processed.blurDataUrl,
        width: processed.width,
        height: processed.height,
        latitude: loc.lat,
        longitude: loc.lng,
        locationName: loc.locationName,
        country: loc.country || null,
        region: loc.region || null,
        speciesId: species.id,
      },
    });
    createdIds.push(photo.id);
  }

  return NextResponse.json({ ok: true, speciesId: species.id, photoIds: createdIds });
}
