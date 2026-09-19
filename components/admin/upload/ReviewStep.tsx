import Image from "next/image";
import type { PhotoDraft, SpeciesDraft } from "@/components/admin/upload/types";

export function ReviewStep({ photos, species }: { photos: PhotoDraft[]; species: SpeciesDraft }) {
  return (
    <div>
      <h2 className="mb-6 font-serif text-lg">Review before saving</h2>

      <div className="mb-8 border border-hairline p-4">
        <h3 className="font-serif text-xl">{species.commonName}</h3>
        <p className="italic text-ink-muted">{species.scientificName}</p>
        <dl className="mt-3 grid grid-cols-3 gap-2 text-sm text-ink-muted">
          <div>
            <dt className="text-xs uppercase">Order</dt>
            <dd>{species.order}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase">Family</dt>
            <dd>{species.family}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase">Genus</dt>
            <dd className="italic">{species.genus}</dd>
          </div>
        </dl>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {photos.map((p) => (
          <div key={p.previewUrl}>
            <div className="relative aspect-square overflow-hidden bg-white">
              <Image src={p.previewUrl} alt="" fill className="object-cover" unoptimized />
            </div>
            <p className="mt-1 text-xs text-ink-muted">
              {p.location?.locationName ?? "No location set"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
