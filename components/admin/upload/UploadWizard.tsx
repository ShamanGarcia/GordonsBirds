"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PhotoDropzone } from "@/components/admin/upload/PhotoDropzone";
import { LocationStep } from "@/components/admin/upload/LocationStep";
import { SpeciesStep } from "@/components/admin/upload/SpeciesStep";
import { ReviewStep } from "@/components/admin/upload/ReviewStep";
import type { PhotoDraft, SpeciesDraft } from "@/components/admin/upload/types";

const STEPS = ["Select photographs", "Choose location", "Enter species", "Review", "Submit"];

const emptySpecies: SpeciesDraft = {
  scientificName: "",
  commonName: "",
  genus: "",
  family: "",
  order: "",
};

export function UploadWizard({ mapboxToken }: { mapboxToken: string | null }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [species, setSpecies] = useState<SpeciesDraft>(emptySpecies);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const canProceed =
    (step === 1 && photos.length > 0) ||
    (step === 2 && photos.every((p) => p.location)) ||
    (step === 3 &&
      species.scientificName.trim() &&
      species.commonName.trim() &&
      species.genus.trim() &&
      species.family.trim() &&
      species.order.trim()) ||
    step === 4;

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const formData = new FormData();
      photos.forEach((p) => formData.append("photos", p.file));
      formData.append("scientificName", species.scientificName.trim());
      formData.append("commonName", species.commonName.trim());
      formData.append("genus", species.genus.trim());
      formData.append("family", species.family.trim());
      formData.append("order", species.order.trim());
      formData.append("locations", JSON.stringify(photos.map((p) => p.location)));

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Upload failed");
      }
      setDone(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="border border-moss p-8 text-center">
        <h2 className="font-serif text-xl">Uploaded successfully</h2>
        <p className="mt-2 text-sm text-ink-muted">
          {photos.length} photograph{photos.length === 1 ? "" : "s"} of {species.commonName} added
          to the collection.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <a href="/admin/upload" className="text-sm underline hover:text-accent">
            Upload more
          </a>
          <a href="/catalogue" className="text-sm underline hover:text-accent">
            View catalogue
          </a>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ol className="mb-10 flex flex-wrap gap-x-6 gap-y-2 text-xs uppercase tracking-wide text-ink-muted">
        {STEPS.map((label, i) => (
          <li key={label} className={i + 1 === step ? "font-semibold text-accent" : ""}>
            {i + 1}. {label}
          </li>
        ))}
      </ol>

      {step === 1 && <PhotoDropzone photos={photos} onChange={setPhotos} />}
      {step === 2 && <LocationStep photos={photos} onChange={setPhotos} token={mapboxToken} />}
      {step === 3 && <SpeciesStep species={species} onChange={setSpecies} />}
      {step === 4 && <ReviewStep photos={photos} species={species} />}

      {error && <p className="mt-4 text-sm text-clay">{error}</p>}

      <div className="mt-10 flex justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(1, s - 1))}
          disabled={step === 1}
          className="text-sm text-ink-muted underline disabled:opacity-30"
        >
          Back
        </button>
        {step < 4 ? (
          <button
            type="button"
            onClick={() => setStep((s) => Math.min(4, s + 1))}
            disabled={!canProceed}
            className="border border-ink px-6 py-2.5 text-sm text-ink transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="border border-ink bg-ink px-6 py-2.5 text-sm text-bg transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Saving…" : "Save to collection"}
          </button>
        )}
      </div>
    </div>
  );
}
