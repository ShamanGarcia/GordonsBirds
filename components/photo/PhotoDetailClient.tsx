"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getAdjacentPhotoIds } from "@/lib/photos";
import { usePhotos } from "@/lib/usePhotos";
import { getMapboxToken } from "@/lib/mapbox";
import { resolveLocation, type Coordinates } from "@/lib/geocode";
import { basePath } from "@/lib/basePath";
import { ScientificName } from "@/components/photo/ScientificName";
import { MiniMap } from "@/components/map/MiniMap";

export function PhotoDetailClient() {
  const { id } = useParams<{ id: string }>();
  const { photos, loading } = usePhotos();
  const [coords, setCoords] = useState<Coordinates | null>(null);
  const token = getMapboxToken();

  const photo = photos?.find((p) => p.id === id) ?? null;
  const { prevId, nextId } = photos ? getAdjacentPhotoIds(photos, id) : { prevId: null, nextId: null };

  useEffect(() => {
    if (!photo || !token) return;
    let cancelled = false;
    resolveLocation(photo.location, token).then((result) => {
      if (!cancelled) setCoords(result);
    });
    return () => {
      cancelled = true;
    };
  }, [photo, token]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-ink-muted">Loading&hellip;</p>
      </div>
    );
  }

  if (!photo) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <p className="text-ink-muted">
          Photograph not found.{" "}
          <Link href="/catalogue" className="underline hover:text-accent">
            Back to Catalogue
          </Link>
        </p>
      </div>
    );
  }

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
          {/* eslint-disable-next-line @next/next/no-img-element -- static export ships one plain image per entry, no next/image optimization to gain */}
          <img
            src={`${basePath}/photos/${photo.image}`}
            alt={`${photo.commonName}, ${photo.location}`}
            className="h-auto w-full bg-white"
          />
        </div>

        <aside className="lg:w-2/5">
          <h1 className="font-serif text-3xl">{photo.commonName}</h1>
          <p className="mt-1 text-lg text-ink-muted">
            <ScientificName name={photo.scientificName} />
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <dt className="text-ink-muted">Location</dt>
            <dd>{photo.location}</dd>
          </dl>

          <div className="mt-6 h-56 w-full overflow-hidden">
            {!token ? (
              <MiniMap latitude={0} longitude={0} label={photo.location} token={null} />
            ) : coords ? (
              <MiniMap latitude={coords.lat} longitude={coords.lng} label={photo.location} token={token} />
            ) : (
              <div className="flex h-full items-center justify-center border border-dashed border-hairline bg-panel text-sm text-ink-muted">
                Locating&hellip;
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
