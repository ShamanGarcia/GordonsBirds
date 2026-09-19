"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import MapGL, { Marker } from "react-map-gl/mapbox";
import type { MapRef, MapMouseEvent } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import type { PhotoDraft, LocationDraft } from "@/components/admin/upload/types";

type GeocodeFeature = {
  properties?: {
    full_address?: string;
    name?: string;
    context?: {
      country?: { name?: string };
      region?: { name?: string };
    };
  };
  geometry: { coordinates: [number, number] };
};

export function LocationStep({
  photos,
  onChange,
  token,
}: {
  photos: PhotoDraft[];
  onChange: (next: PhotoDraft[]) => void;
  token: string | null;
}) {
  const [sameForAll, setSameForAll] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ name: string; lng: number; lat: number }[]>([]);
  const mapRef = useRef<MapRef>(null);

  if (!token) {
    return <MapPlaceholder message="Add a Mapbox token to .env.local to place photo locations." />;
  }

  async function handleSearch(q: string) {
    setSearchQuery(q);
    if (q.trim().length < 3) {
      setSearchResults([]);
      return;
    }
    const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(q)}&access_token=${token}&limit=5`;
    const res = await fetch(url);
    const data = await res.json();
    const results = ((data.features ?? []) as GeocodeFeature[]).map((f) => ({
      name: f.properties?.full_address ?? f.properties?.name ?? "Unknown place",
      lng: f.geometry.coordinates[0],
      lat: f.geometry.coordinates[1],
    }));
    setSearchResults(results);
  }

  function flyTo(lng: number, lat: number) {
    mapRef.current?.getMap().flyTo({ center: [lng, lat], zoom: 9 });
  }

  async function reverseGeocode(lng: number, lat: number): Promise<LocationDraft> {
    try {
      const url = `https://api.mapbox.com/search/geocode/v6/reverse?longitude=${lng}&latitude=${lat}&access_token=${token}`;
      const res = await fetch(url);
      const data = await res.json();
      const feature = (data.features?.[0] ?? null) as GeocodeFeature | null;
      return {
        locationName:
          feature?.properties?.full_address ??
          feature?.properties?.name ??
          `${lat.toFixed(3)}, ${lng.toFixed(3)}`,
        country: feature?.properties?.context?.country?.name,
        region: feature?.properties?.context?.region?.name,
        lat,
        lng,
      };
    } catch {
      return { locationName: `${lat.toFixed(3)}, ${lng.toFixed(3)}`, lat, lng };
    }
  }

  async function handleMapClick(e: MapMouseEvent) {
    const { lng, lat } = e.lngLat;
    const location = await reverseGeocode(lng, lat);
    if (sameForAll) {
      onChange(photos.map((p) => ({ ...p, location })));
    } else {
      const next = [...photos];
      next[activeIndex] = { ...next[activeIndex], location };
      onChange(next);
      const nextUnset = next.findIndex((p) => !p.location);
      if (nextUnset !== -1) setActiveIndex(nextUnset);
    }
  }

  const currentLocation = sameForAll ? photos[0]?.location : photos[activeIndex]?.location;

  return (
    <div>
      <h2 className="mb-4 font-serif text-lg">Where were these photographs taken?</h2>

      {photos.length > 1 && (
        <label className="mb-4 flex items-center gap-2 text-sm text-ink-muted">
          <input
            type="checkbox"
            checked={sameForAll}
            onChange={(e) => setSameForAll(e.target.checked)}
          />
          Use the same location for all {photos.length} photographs
        </label>
      )}

      {!sameForAll && (
        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
          {photos.map((p, i) => (
            <button
              key={p.previewUrl}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative h-16 w-16 flex-shrink-0 overflow-hidden border-2 ${
                i === activeIndex ? "border-accent" : p.location ? "border-moss" : "border-transparent"
              }`}
              aria-label={`Set location for photograph ${i + 1}`}
            >
              <Image src={p.previewUrl} alt="" fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}

      <div className="relative mb-3">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search for a place (optional)"
          className="w-full border-b border-hairline bg-white px-1 py-2 focus:border-accent focus:outline-none"
        />
        {searchResults.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full border border-hairline bg-bg shadow">
            {searchResults.map((r) => (
              <li key={r.name}>
                <button
                  type="button"
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-panel"
                  onClick={() => {
                    flyTo(r.lng, r.lat);
                    setSearchResults([]);
                    setSearchQuery(r.name);
                  }}
                >
                  {r.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="h-80 w-full cursor-crosshair">
        <MapGL
          ref={mapRef}
          mapboxAccessToken={token}
          initialViewState={{ longitude: -98, latitude: 40, zoom: 3 }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/light-v11"
          onClick={handleMapClick}
        >
          {currentLocation && (
            <Marker longitude={currentLocation.lng} latitude={currentLocation.lat} anchor="bottom" />
          )}
        </MapGL>
      </div>

      {currentLocation && (
        <p className="mt-3 text-sm text-ink-muted">Selected: {currentLocation.locationName}</p>
      )}
    </div>
  );
}
