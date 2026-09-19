"use client";

import { useEffect, useState } from "react";
import { searchTaxonomyReference } from "@/lib/taxonomyReference";
import type { SpeciesDraft } from "@/components/admin/upload/types";

type ExistingSpecies = SpeciesDraft & { id: string };

export function SpeciesStep({
  species,
  onChange,
}: {
  species: SpeciesDraft;
  onChange: (next: SpeciesDraft) => void;
}) {
  const [existingMatches, setExistingMatches] = useState<ExistingSpecies[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const q = species.scientificName.trim();
    if (q.length < 2) return;
    let cancelled = false;
    fetch(`/api/species/search?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((d: { species: ExistingSpecies[] }) => {
        if (!cancelled) setExistingMatches(d.species);
      });
    return () => {
      cancelled = true;
    };
  }, [species.scientificName]);

  const tooShort = species.scientificName.trim().length < 2;
  const visibleExistingMatches = tooShort ? [] : existingMatches;
  const referenceMatches = tooShort ? [] : searchTaxonomyReference(species.scientificName, 5);

  function selectExisting(s: ExistingSpecies) {
    onChange({
      scientificName: s.scientificName,
      commonName: s.commonName,
      genus: s.genus,
      family: s.family,
      order: s.order,
    });
    setShowSuggestions(false);
  }

  function selectReference(r: (typeof referenceMatches)[number]) {
    onChange({ ...r });
    setShowSuggestions(false);
  }

  const hasSuggestions =
    showSuggestions && (visibleExistingMatches.length > 0 || referenceMatches.length > 0);

  return (
    <div>
      <h2 className="mb-1 font-serif text-lg">What species is this?</h2>
      <p className="mb-4 text-sm text-ink-muted">
        Enter the scientific (Latin) name — the authoritative identifier for
        the species.
      </p>

      <div className="relative mb-6">
        <input
          type="text"
          value={species.scientificName}
          onChange={(e) => {
            onChange({ ...species, scientificName: e.target.value });
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          placeholder="e.g. Setophaga petechia"
          className="w-full border-b border-hairline bg-white px-1 py-2 italic focus:border-accent focus:outline-none"
        />
        {hasSuggestions && (
          <ul className="absolute z-10 mt-1 max-h-64 w-full overflow-y-auto border border-hairline bg-bg shadow">
            {visibleExistingMatches.length > 0 && (
              <li className="px-3 pt-2 text-xs uppercase tracking-wide text-ink-muted">
                Already in your collection
              </li>
            )}
            {visibleExistingMatches.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => selectExisting(s)}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-panel"
                >
                  {s.commonName} — <span className="italic">{s.scientificName}</span>
                </button>
              </li>
            ))}
            {referenceMatches.length > 0 && (
              <li className="px-3 pt-2 text-xs uppercase tracking-wide text-ink-muted">
                Reference match
              </li>
            )}
            {referenceMatches.map((r) => (
              <li key={r.scientificName}>
                <button
                  type="button"
                  onClick={() => selectReference(r)}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-panel"
                >
                  {r.commonName} — <span className="italic">{r.scientificName}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="mb-3 text-sm text-ink-muted">
        These fields are filled in automatically when a match is found above
        — edit them if needed, or fill them in by hand.
      </p>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Common name
          <input
            value={species.commonName}
            onChange={(e) => onChange({ ...species, commonName: e.target.value })}
            className="border-b border-hairline bg-white px-1 py-2 focus:border-accent focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Genus
          <input
            value={species.genus}
            onChange={(e) => onChange({ ...species, genus: e.target.value })}
            className="border-b border-hairline bg-white px-1 py-2 italic focus:border-accent focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Family
          <input
            value={species.family}
            onChange={(e) => onChange({ ...species, family: e.target.value })}
            className="border-b border-hairline bg-white px-1 py-2 focus:border-accent focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Order
          <input
            value={species.order}
            onChange={(e) => onChange({ ...species, order: e.target.value })}
            className="border-b border-hairline bg-white px-1 py-2 focus:border-accent focus:outline-none"
          />
        </label>
      </div>
    </div>
  );
}
