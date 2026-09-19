"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import MapGL, { Layer, Popup, Source } from "react-map-gl/mapbox";
import type { MapMouseEvent, MapRef } from "react-map-gl/mapbox";
import type { GeoJSONSource } from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { ScientificName } from "@/components/photo/ScientificName";

export type MapPhoto = {
  id: string;
  latitude: number;
  longitude: number;
  locationName: string;
  thumbnailUrl: string;
  species: { commonName: string; scientificName: string };
};

export function PhotoMap({ photos, token }: { photos: MapPhoto[]; token: string }) {
  const mapRef = useRef<MapRef>(null);
  const [popup, setPopup] = useState<{
    longitude: number;
    latitude: number;
    photos: MapPhoto[];
  } | null>(null);

  const byId = useMemo(() => new Map(photos.map((p) => [p.id, p])), [photos]);

  const geojson = useMemo(
    () => ({
      type: "FeatureCollection" as const,
      features: photos.map((p) => ({
        type: "Feature" as const,
        properties: { photoId: p.id },
        geometry: { type: "Point" as const, coordinates: [p.longitude, p.latitude] },
      })),
    }),
    [photos],
  );

  const onClick = useCallback(
    (e: MapMouseEvent) => {
      const feature = e.features?.[0];
      const map = mapRef.current?.getMap();
      if (!feature || !map) return;

      if (feature.layer?.id === "clusters") {
        const clusterId = feature.properties?.cluster_id as number;
        const source = map.getSource("photos") as GeoJSONSource;
        const coordinates = (feature.geometry as GeoJSON.Point).coordinates as [number, number];

        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return;
          if (zoom >= map.getMaxZoom() - 0.5) {
            source.getClusterLeaves(clusterId, Infinity, 0, (leavesErr, leaves) => {
              if (leavesErr || !leaves) return;
              const matched = leaves
                .map((l) => byId.get(l.properties?.photoId as string))
                .filter((p): p is MapPhoto => Boolean(p));
              if (matched.length) {
                setPopup({ longitude: coordinates[0], latitude: coordinates[1], photos: matched });
              }
            });
            return;
          }
          map.easeTo({ center: coordinates, zoom });
        });
        return;
      }

      if (feature.layer?.id === "unclustered-point") {
        const id = feature.properties?.photoId as string;
        const p = byId.get(id);
        if (p) setPopup({ longitude: p.longitude, latitude: p.latitude, photos: [p] });
      }
    },
    [byId],
  );

  return (
    <MapGL
      ref={mapRef}
      mapboxAccessToken={token}
      initialViewState={{ longitude: -98, latitude: 40, zoom: 3 }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      interactiveLayerIds={["clusters", "unclustered-point"]}
      onClick={onClick}
      cooperativeGestures
    >
      <Source id="photos" type="geojson" data={geojson} cluster clusterMaxZoom={14} clusterRadius={50}>
        <Layer
          id="clusters"
          type="circle"
          filter={["has", "point_count"]}
          paint={{
            "circle-color": "#0000FF",
            "circle-opacity": 0.85,
            "circle-radius": ["step", ["get", "point_count"], 16, 10, 22, 30, 28],
          }}
        />
        <Layer
          id="cluster-count"
          type="symbol"
          filter={["has", "point_count"]}
          layout={{ "text-field": ["get", "point_count_abbreviated"], "text-size": 12 }}
          paint={{ "text-color": "#FFFFFF" }}
        />
        <Layer
          id="unclustered-point"
          type="circle"
          filter={["!", ["has", "point_count"]]}
          paint={{
            "circle-color": "#000000",
            "circle-radius": 6,
            "circle-stroke-width": 2,
            "circle-stroke-color": "#FFFFFF",
          }}
        />
      </Source>

      {popup && (
        <Popup
          longitude={popup.longitude}
          latitude={popup.latitude}
          onClose={() => setPopup(null)}
          closeButton
          anchor="bottom"
          maxWidth="280px"
        >
          <div className="flex max-h-64 flex-col gap-3 overflow-y-auto p-1">
            {popup.photos.map((p) => (
              <Link
                key={p.id}
                href={`/photo/${p.id}`}
                className="flex items-center gap-3 hover:opacity-80"
              >
                <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden bg-white">
                  <Image src={p.thumbnailUrl} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="text-xs">
                  <p className="font-serif text-sm text-heading">{p.species.commonName}</p>
                  <p className="text-ink-muted">
                    <ScientificName name={p.species.scientificName} />
                  </p>
                  <p className="text-ink-muted">{p.locationName}</p>
                </div>
              </Link>
            ))}
          </div>
        </Popup>
      )}
    </MapGL>
  );
}
