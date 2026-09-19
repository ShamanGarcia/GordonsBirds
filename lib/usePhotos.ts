"use client";

import { useEffect, useState } from "react";
import { loadPhotos, type Photo } from "@/lib/photos";

export function usePhotos() {
  const [photos, setPhotos] = useState<Photo[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadPhotos()
      .then((data) => {
        if (!cancelled) setPhotos(data);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load the collection.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return { photos, loading: !photos && !error, error };
}
