import { NextResponse } from "next/server";
import { getAllPhotosForGallery } from "@/lib/photos";

export async function GET() {
  const photos = await getAllPhotosForGallery();
  return NextResponse.json({ photos });
}
