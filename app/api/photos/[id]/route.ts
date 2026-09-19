import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deletePhotoFiles } from "@/lib/image";
import { getAdminSession } from "@/lib/auth";

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const photo = await prisma.photo.findUnique({ where: { id } });
  if (!photo) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.photo.delete({ where: { id } });
  await deletePhotoFiles([photo.originalUrl, photo.optimizedUrl, photo.thumbnailUrl]);

  const remaining = await prisma.photo.count({ where: { speciesId: photo.speciesId } });

  return NextResponse.json({ ok: true, speciesEmptied: remaining === 0 });
}
