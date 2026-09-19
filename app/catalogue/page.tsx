import { Suspense } from "react";
import { getCatalogue, getLocationOptions } from "@/lib/photos";
import { CatalogueFilters } from "@/components/catalogue/CatalogueFilters";
import { PhotoGrid } from "@/components/photo/PhotoGrid";

export const dynamic = "force-dynamic";

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; country?: string; region?: string }>;
}) {
  const params = await searchParams;
  const [photos, { countries, regions }] = await Promise.all([
    getCatalogue({ query: params.q, country: params.country, region: params.region }),
    getLocationOptions(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="mb-2 font-serif text-3xl">Catalogue</h1>
      <p className="mb-8 max-w-xl text-ink-muted">
        Every photograph in the archive, searchable by common or scientific
        name and by location.
      </p>

      <Suspense fallback={null}>
        <CatalogueFilters countries={countries} regions={regions} />
      </Suspense>

      <p className="mb-6 text-sm text-ink-muted">
        {photos.length} photograph{photos.length === 1 ? "" : "s"}
      </p>

      <PhotoGrid photos={photos} />
    </div>
  );
}
