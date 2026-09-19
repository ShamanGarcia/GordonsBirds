import { PhotoCard } from "@/components/photo/PhotoCard";
import type { PhotoCardData } from "@/lib/photos";

export function PhotoGrid({ photos }: { photos: PhotoCardData[] }) {
  if (photos.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-ink-muted">
        No photographs match yet.
      </p>
    );
  }

  return (
    <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
      {photos.map((photo) => (
        <div key={photo.id} className="mb-4 break-inside-avoid">
          <PhotoCard photo={photo} />
        </div>
      ))}
    </div>
  );
}
