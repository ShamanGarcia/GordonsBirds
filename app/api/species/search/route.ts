import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { caseInsensitiveContains } from "@/lib/search";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ species: [] });

  const species = await prisma.species.findMany({
    where: {
      OR: [
        { scientificName: caseInsensitiveContains(q) },
        { commonName: caseInsensitiveContains(q) },
      ],
    },
    take: 8,
    orderBy: { commonName: "asc" },
  });

  return NextResponse.json({ species });
}
