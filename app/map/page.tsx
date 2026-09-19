"use client";

import { useEffect, useState } from "react";
import { usePhotos } from "@/lib/usePhotos";
import { getMapboxToken } from "@/lib/mapbox";
import { resolveLocations } from "@/lib/geocode";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import { PhotoMap, type MapPhoto } from "@/components/map/PhotoMap";

export default function MapPage() {
  const { photos } = usePhotos();
  const [mapPhotos, setMapPhotos] = useState<MapPhoto[] | null>(null);
  const token = getMapboxToken();

  useEffect(() => {
    if (!photos || !token) return;
    let cancelled = false;

    resolveLocations(
      photos.map((p) => p.location),
      token,
    ).then((coordinates) => {
      if (cancelled) return;
      setMapPhotos(
        photos.flatMap((photo) => {
          const coords = coordinates.get(photo.location);
          if (!coords) return [];
          return [
            {
              id: photo.id,
              latitude: coords.lat,
              longitude: coords.lng,
              locationName: photo.location,
              thumbnailUrl: `/photos/${photo.image}`,
              species: { commonName: photo.commonName, scientificName: photo.scientificName },
            },
          ];
        }),
      );
    });

    return () => {
      cancelled = true;
    };
  }, [photos, token]);

  return (
    <div className="mx-auto flex h-[calc(100vh-64px)] max-w-none flex-col px-0">
      <div className="mx-auto w-full max-w-6xl px-5 pt-8 sm:px-8">
        <h1 className="font-serif text-3xl">Map</h1>
        <p className="mt-2 max-w-xl text-ink-muted">
          Every photograph, plotted where it was taken. Zoom in to expand
          clusters.
        </p>
      </div>
      <div className="mt-6 flex-1">
        {!token ? (
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <MapPlaceholder />
          </div>
        ) : !mapPhotos ? (
          <p className="py-16 text-center text-sm text-ink-muted">Placing photographs&hellip;</p>
        ) : (
          <PhotoMap photos={mapPhotos} token={token} />
        )}
      </div>
    </div>
  );
}
