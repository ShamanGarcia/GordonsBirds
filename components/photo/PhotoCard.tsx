import Link from "next/link";
import { ScientificName } from "@/components/photo/ScientificName";
import { basePath } from "@/lib/basePath";
import type { Photo } from "@/lib/photos";

export function PhotoCard({
  photo,
  priority = false,
  square = false,
}: {
  photo: Photo;
  priority?: boolean;
  square?: boolean;
}) {
  return (
    <Link
      href={`/photo/${photo.id}`}
      className={`group relative block overflow-hidden bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${square ? "aspect-square" : ""}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- static export ships one plain image per entry, no next/image optimization to gain */}
      <img
        src={`${basePath}/photos/${photo.image}`}
        alt={`${photo.commonName}, ${photo.location}`}
        loading={priority ? "eager" : "lazy"}
        className={`block w-full transition-transform duration-700 ease-out group-hover:scale-[1.03] ${square ? "h-full object-cover" : "h-auto"}`}
      />
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/55 via-black/0 to-black/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
        <div className="p-4 text-bg">
          <p className="font-serif text-base leading-tight">{photo.commonName}</p>
          <p className="text-xs text-bg/80">
            <ScientificName name={photo.scientificName} /> · {photo.location}
          </p>
        </div>
      </div>
    </Link>
  );
}
