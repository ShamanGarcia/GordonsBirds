"use client";

import MapGL, { Marker } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";

export function MiniMap({
  latitude,
  longitude,
  label,
  token,
}: {
  latitude: number;
  longitude: number;
  label: string;
  token: string | null;
}) {
  if (!token) return <MapPlaceholder />;

  return (
    <MapGL
      mapboxAccessToken={token}
      initialViewState={{ latitude, longitude, zoom: 8 }}
      style={{ width: "100%", height: "100%", minHeight: 220 }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      attributionControl={false}
      cooperativeGestures
    >
      <Marker latitude={latitude} longitude={longitude} anchor="bottom">
        <div
          role="img"
          aria-label={label}
          className="h-3.5 w-3.5 -translate-y-1 rounded-full border-2 border-bg bg-accent shadow"
        />
      </Marker>
    </MapGL>
  );
}
