"use client";

import { useMemo } from "react";
import { pickRandom } from "@/lib/photos";
import { usePhotos } from "@/lib/usePhotos";
import { HomeExplore } from "@/components/photo/HomeExplore";

export default function HomePage() {
  const { photos, loading } = usePhotos();
  const intro = useMemo(() => (photos ? pickRandom(photos, 9) : []), [photos]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
      <div className="mb-12 max-w-2xl">
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
          Gordon&rsquo;s Birds
        </h1>
        <p className="mt-4 text-ink-muted">
          A photographic field archive — birds of the world, catalogued by
          species, place, and light.
        </p>
      </div>

      {loading ? (
        <p className="text-ink-muted">Loading the collection&hellip;</p>
      ) : intro.length === 0 ? (
        <p className="text-ink-muted">The collection is empty right now.</p>
      ) : (
        <HomeExplore initialPhotos={intro} />
      )}
    </div>
  );
}
