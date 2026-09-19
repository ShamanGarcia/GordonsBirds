"use client";

import { useEffect, useState } from "react";
import { TaxonomyTree } from "@/components/taxonomy/TaxonomyTree";
import { TaxonomyList } from "@/components/taxonomy/TaxonomyList";
import { PhotoGrid } from "@/components/photo/PhotoGrid";
import { ScientificName } from "@/components/photo/ScientificName";
import type { TaxonomyNode } from "@/lib/taxonomy";
import type { PhotoCardData } from "@/lib/photos";

export function TaxonomyExplorer({ data }: { data: TaxonomyNode }) {
  const [selected, setSelected] = useState<TaxonomyNode | null>(null);
  const [photos, setPhotos] = useState<PhotoCardData[] | null>(null);

  function handleSelect(node: TaxonomyNode) {
    setPhotos(null);
    setSelected(node);
  }

  useEffect(() => {
    if (!selected) return;
    let cancelled = false;
    const params = new URLSearchParams();
    if (selected.rank === "species" && selected.speciesId) {
      params.set("speciesId", selected.speciesId);
    } else {
      params.set("rank", selected.rank);
      params.set("value", selected.name);
    }
    fetch(`/api/taxonomy/photos?${params.toString()}`)
      .then((r) => r.json())
      .then((d: { photos: PhotoCardData[] }) => {
        if (!cancelled) setPhotos(d.photos);
      });
    return () => {
      cancelled = true;
    };
  }, [selected]);

  return (
    <div>
      <div className="mx-auto aspect-square w-full max-w-2xl">
        <TaxonomyTree data={data} onSelect={handleSelect} size={640} />
      </div>

      <TaxonomyList data={data} />

      {selected && (
        <div className="mt-14 border-t border-hairline pt-10">
          <h2 className="font-serif text-2xl">
            {selected.name}
            {selected.rank === "species" && (
              <span className="ml-2 text-lg text-ink-muted">
                <ScientificName name={selected.scientificName ?? ""} />
              </span>
            )}
          </h2>
          <p className="mb-6 text-sm capitalize text-ink-muted">{selected.rank}</p>
          {photos === null ? (
            <p className="text-sm text-ink-muted">Loading photographs&hellip;</p>
          ) : (
            <PhotoGrid photos={photos} />
          )}
        </div>
      )}
    </div>
  );
}
