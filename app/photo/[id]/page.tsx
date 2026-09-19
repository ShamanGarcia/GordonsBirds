import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPhotoDetail, getAdjacentPhotoIds } from "@/lib/photos";
import { getAdminSession } from "@/lib/auth";
import { getMapboxToken } from "@/lib/mapbox";
import { ScientificName } from "@/components/photo/ScientificName";
import { MiniMap } from "@/components/map/MiniMap";
import { DeleteControl } from "@/components/photo/DeleteControl";

export default async function PhotoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [photo, { prevId, nextId }, isAdmin] = await Promise.all([
    getPhotoDetail(id),
    getAdjacentPhotoIds(id),
    getAdminSession(),
  ]);

  if (!photo) notFound();

  const token = getMapboxToken();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-6 flex items-center justify-between text-sm text-ink-muted">
        <Link href="/catalogue" className="hover:text-accent">
          &larr; Back to Catalogue
        </Link>
        <div className="flex gap-4">
          <Link
            href={prevId ? `/photo/${prevId}` : "#"}
            aria-disabled={!prevId}
            className={prevId ? "hover:text-accent" : "pointer-events-none opacity-30"}
          >
            &larr; Previous
          </Link>
          <Link
            href={nextId ? `/photo/${nextId}` : "#"}
            aria-disabled={!nextId}
            className={nextId ? "hover:text-accent" : "pointer-events-none opacity-30"}
          >
            Next &rarr;
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-10 lg:flex-row">
        <div className="lg:w-3/5">
          <Image
            src={photo.optimizedUrl}
            alt={`${photo.species.commonName}, ${photo.locationName}`}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 1024px) 60vw, 100vw"
            quality={90}
            priority
            placeholder={photo.blurDataUrl ? "blur" : "empty"}
            blurDataURL={photo.blurDataUrl ?? undefined}
            className="h-auto w-full bg-white"
          />
        </div>

        <aside className="lg:w-2/5">
          <h1 className="font-serif text-3xl">{photo.species.commonName}</h1>
          <p className="mt-1 text-lg text-ink-muted">
            <ScientificName name={photo.species.scientificName} />
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-ink-muted">Order</dt>
            <dd>{photo.species.order}</dd>
            <dt className="text-ink-muted">Family</dt>
            <dd>{photo.species.family}</dd>
            <dt className="text-ink-muted">Genus</dt>
            <dd className="italic">{photo.species.genus}</dd>
            <dt className="text-ink-muted">Location</dt>
            <dd>{photo.locationName}</dd>
            {photo.photographer && (
              <>
                <dt className="text-ink-muted">Photographer</dt>
                <dd>{photo.photographer}</dd>
              </>
            )}
          </dl>

          <div className="mt-6 h-56 w-full overflow-hidden">
            <MiniMap
              latitude={photo.latitude}
              longitude={photo.longitude}
              label={photo.locationName}
              token={token}
            />
          </div>

          {isAdmin && <DeleteControl photoId={photo.id} />}
        </aside>
      </div>
    </div>
  );
}
