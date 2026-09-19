export function MapPlaceholder({ message }: { message?: string }) {
  return (
    <div className="flex h-full min-h-[200px] flex-col items-center justify-center gap-2 border border-dashed border-hairline bg-panel p-6 text-center text-sm text-ink-muted">
      <p>
        {message ?? "Map unavailable — a Mapbox access token has not been configured."}
      </p>
      <p className="text-xs">
        Add <code className="rounded bg-bg px-1 py-0.5">NEXT_PUBLIC_MAPBOX_TOKEN</code> to{" "}
        <code className="rounded bg-bg px-1 py-0.5">.env.local</code> to enable maps.
      </p>
    </div>
  );
}
