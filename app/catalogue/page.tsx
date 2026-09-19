"use client";

import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { searchPhotos } from "@/lib/photos";
import { usePhotos } from "@/lib/usePhotos";
import { CatalogueFilters } from "@/components/catalogue/CatalogueFilters";
import { PhotoGrid } from "@/components/photo/PhotoGrid";

function CatalogueResults() {
  const { photos, loading } = usePhotos();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") ?? "";

  const results = useMemo(
    () => (photos ? searchPhotos(photos, query) : []),
    [photos, query],
  );

  return (
    <>
      <Suspense fallback={null}>
        <CatalogueFilters />
      </Suspense>

      <p className="mb-6 text-sm text-ink-muted">
        {loading
          ? "Loading…"
          : `${results.length} photograph${results.length === 1 ? "" : "s"}`}
      </p>

      <PhotoGrid photos={results} />
    </>
  );
}

export default function CataloguePage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="mb-2 font-serif text-3xl">Catalogue</h1>
      <p className="mb-8 max-w-xl text-ink-muted">
        Every photograph in the archive, searchable by common or scientific
        name and by location.
      </p>

      <Suspense fallback={null}>
        <CatalogueResults />
      </Suspense>
    </div>
  );
}
