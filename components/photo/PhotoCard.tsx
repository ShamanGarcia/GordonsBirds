import Image from "next/image";
import Link from "next/link";
import { ScientificName } from "@/components/photo/ScientificName";
import type { PhotoCardData } from "@/lib/photos";

export function PhotoCard({
  photo,
  priority = false,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw",
}: {
  photo: PhotoCardData;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <Link
      href={`/photo/${photo.id}`}
      className="group relative block overflow-hidden bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
    >
      <Image
        src={photo.thumbnailUrl}
        alt={`${photo.species.commonName}, ${photo.locationName}`}
        fill
        sizes={sizes}
        priority={priority}
        placeholder={photo.blurDataUrl ? "blur" : "empty"}
        blurDataURL={photo.blurDataUrl ?? undefined}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <div className="p-4 text-bg">
          <p className="font-serif text-base leading-tight">{photo.species.commonName}</p>
          <p className="text-xs text-bg/80">
            <ScientificName name={photo.species.scientificName} /> · {photo.locationName}
          </p>
        </div>
      </div>
    </Link>
  );
}
