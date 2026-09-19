"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ColumnStepper } from "@/components/photo/ColumnStepper";
import { PhotoCard } from "@/components/photo/PhotoCard";
import type { PhotoCardData } from "@/lib/photos";

const PAGE_SIZE = 9;

function shuffle<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function useMaxColumns() {
  const [max, setMax] = useState(3);
  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      setMax(w < 640 ? 1 : w < 900 ? 2 : 5);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return max;
}

export function InfiniteGallery() {
  const [photos, setPhotos] = useState<PhotoCardData[] | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [columns, setColumns] = useState(3);
  const maxColumns = useMaxColumns();
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/photos")
      .then((r) => r.json())
      .then((data: { photos: PhotoCardData[] }) => {
        if (!cancelled) setPhotos(shuffle(data.photos));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !photos) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((c) => Math.min(c + PAGE_SIZE, photos.length));
        }
      },
      { rootMargin: "800px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [photos]);

  const effectiveColumns = Math.min(columns, maxColumns);
  const visible = useMemo(
    () => (photos ? photos.slice(0, visibleCount) : []),
    [photos, visibleCount],
  );

  return (
    <div>
      <div className="mb-6 flex justify-center sm:justify-end">
        <ColumnStepper columns={columns} onChange={setColumns} />
      </div>

      {!photos ? (
        <p className="py-16 text-center text-sm text-ink-muted">Loading the collection&hellip;</p>
      ) : (
        <>
          <div
            style={{ columnCount: effectiveColumns, columnGap: "1rem" }}
            className="fade-in"
          >
            {visible.map((photo, i) => (
              <motion.div
                key={photo.id}
                layout
                className="mb-4 break-inside-avoid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: (i % PAGE_SIZE) * 0.02 }}
              >
                <PhotoCard photo={photo} />
              </motion.div>
            ))}
          </div>
          <div ref={sentinelRef} className="h-1" aria-hidden="true" />
          {visibleCount >= photos.length && photos.length > 0 && (
            <p className="py-10 text-center text-sm text-ink-muted">
              You&rsquo;ve reached the end of the collection.
            </p>
          )}
        </>
      )}
    </div>
  );
}
