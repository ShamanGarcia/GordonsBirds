"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function CatalogueFilters({
  countries,
  regions,
}: {
  countries: string[];
  regions: string[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function updateParams(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(next)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ q });
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  return (
    <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      <label className="flex-1">
        <span className="sr-only">Search by common or scientific name</span>
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name — e.g. &ldquo;warbler&rdquo; or &ldquo;Setophaga&rdquo;"
          className="w-full border-b border-hairline bg-white px-1 py-2 text-ink placeholder:text-ink-muted/70 focus:border-accent focus:outline-none"
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-ink-muted">
        Country
        <select
          value={searchParams.get("country") ?? ""}
          onChange={(e) => updateParams({ country: e.target.value })}
          className="border-b border-hairline bg-white px-1 py-2 text-ink focus:border-accent focus:outline-none"
        >
          <option value="">All</option>
          {countries.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm text-ink-muted">
        Region
        <select
          value={searchParams.get("region") ?? ""}
          onChange={(e) => updateParams({ region: e.target.value })}
          className="border-b border-hairline bg-white px-1 py-2 text-ink focus:border-accent focus:outline-none"
        >
          <option value="">All</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
