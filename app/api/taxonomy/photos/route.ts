import { NextResponse } from "next/server";
import { getPhotosBySpecies, getPhotosByTaxonRank } from "@/lib/photos";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rank = searchParams.get("rank");
  const value = searchParams.get("value");
  const speciesId = searchParams.get("speciesId");

  if (speciesId) {
    return NextResponse.json({ photos: await getPhotosBySpecies(speciesId) });
  }

  if ((rank === "order" || rank === "family" || rank === "genus") && value) {
    return NextResponse.json({ photos: await getPhotosByTaxonRank(rank, value) });
  }

  return NextResponse.json({ photos: [] });
}
