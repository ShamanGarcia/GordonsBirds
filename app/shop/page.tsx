"use client";

import { useMemo } from "react";
import { pickRandom } from "@/lib/photos";
import { usePhotos } from "@/lib/usePhotos";
import { basePath } from "@/lib/basePath";

export default function ShopPage() {
  const { photos } = usePhotos();
  const featured = useMemo(() => (photos ? pickRandom(photos, 1)[0] : null), [photos]);

  return (
    <div className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden">
      {featured && (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element -- static export ships one plain image per entry, no next/image optimization to gain */}
          <img
            src={`${basePath}/photos/${featured.image}`}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-bg/85" aria-hidden="true" />
        </>
      )}
      <div className="relative mx-auto max-w-lg px-6 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ink-muted">
          Gordon&rsquo;s Birds
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl">
          Print Shop
          <br />
          Coming Soon
        </h1>
        <p className="mt-5 text-ink-muted">
          Fine-art prints of photographs from the collection will be
          available here soon — archival paper, considered framing, shipped
          worldwide.
        </p>
      </div>
    </div>
  );
}
