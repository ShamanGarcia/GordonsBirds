"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import type { PhotoDraft } from "@/components/admin/upload/types";

export function PhotoDropzone({
  photos,
  onChange,
}: {
  photos: PhotoDraft[];
  onChange: (next: PhotoDraft[]) => void;
}) {
  const onDrop = useCallback(
    (accepted: File[]) => {
      const additions: PhotoDraft[] = accepted.map((file) => ({
        file,
        previewUrl: URL.createObjectURL(file),
        location: null,
      }));
      onChange([...photos, ...additions]);
    },
    [photos, onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [], "image/png": [], "image/webp": [] },
  });

  function removeAt(index: number) {
    onChange(photos.filter((_, i) => i !== index));
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`cursor-pointer border-2 border-dashed p-10 text-center transition-colors ${
          isDragActive ? "border-accent bg-panel" : "border-hairline"
        }`}
      >
        <input {...getInputProps()} />
        <p className="text-ink">
          {isDragActive ? "Drop photographs here" : "Drag and drop photographs here"}
        </p>
        <p className="mt-1 text-sm text-ink-muted">or click to choose files — JPEG, PNG, or WebP</p>
      </div>

      {photos.length > 0 && (
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {photos.map((p, i) => (
            <div key={p.previewUrl} className="group relative aspect-square overflow-hidden bg-white">
              <Image src={p.previewUrl} alt="" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removeAt(i)}
                aria-label="Remove photograph"
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-ink/70 text-xs text-bg opacity-0 transition-opacity group-hover:opacity-100"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
