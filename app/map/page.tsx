import { getMapPhotos } from "@/lib/photos";
import { getMapboxToken } from "@/lib/mapbox";
import { MapPlaceholder } from "@/components/map/MapPlaceholder";
import { PhotoMap } from "@/components/map/PhotoMap";

export const dynamic = "force-dynamic";

export default async function MapPage() {
  const [photos, token] = await Promise.all([getMapPhotos(), Promise.resolve(getMapboxToken())]);

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
        {token ? <PhotoMap photos={photos} token={token} /> : (
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <MapPlaceholder />
          </div>
        )}
      </div>
    </div>
  );
}
