"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { PhotoCard } from "@/components/photo/PhotoCard";
import { InfiniteGallery } from "@/components/photo/InfiniteGallery";
import type { PhotoCardData } from "@/lib/photos";

export function HomeExplore({ initialPhotos }: { initialPhotos: PhotoCardData[] }) {
  const [exploring, setExploring] = useState(false);

  return (
    <div>
      <AnimatePresence mode="wait">
        {!exploring ? (
          <motion.div
            key="intro"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
              {initialPhotos.map((photo, i) => (
                <PhotoCard key={photo.id} photo={photo} priority={i < 3} />
              ))}
            </div>
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setExploring(true)}
                className="border border-ink px-8 py-3 font-serif text-base tracking-wide text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              >
                Explore the Collection
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <InfiniteGallery />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
