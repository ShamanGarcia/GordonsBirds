export type Coordinates = { lat: number; lng: number };

const STORAGE_KEY = "gb_geocode_cache_v1";
const memoryCache = new Map<string, Coordinates>();

function readStorageCache(): Record<string, Coordinates> {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStorageCache(cache: Record<string, Coordinates>) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // sessionStorage unavailable (private browsing, etc.) — safe to skip
  }
}

async function geocodeOne(location: string, token: string): Promise<Coordinates | null> {
  const url = `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(location)}&access_token=${token}&limit=1`;
  const res = await fetch(url);
  if (!res.ok) return null;
  const data = await res.json();
  const feature = data.features?.[0];
  if (!feature) return null;
  const [lng, lat] = feature.geometry.coordinates as [number, number];
  return { lat, lng };
}

/** Resolves each unique location string to coordinates once, caching in memory and sessionStorage. */
export async function resolveLocations(
  locations: string[],
  token: string,
): Promise<Map<string, Coordinates>> {
  const unique = Array.from(new Set(locations));
  const storageCache = readStorageCache();
  const result = new Map<string, Coordinates>();

  for (const location of unique) {
    if (memoryCache.has(location)) {
      result.set(location, memoryCache.get(location)!);
      continue;
    }
    if (storageCache[location]) {
      memoryCache.set(location, storageCache[location]);
      result.set(location, storageCache[location]);
      continue;
    }

    const coords = await geocodeOne(location, token);
    if (coords) {
      memoryCache.set(location, coords);
      storageCache[location] = coords;
      result.set(location, coords);
    }
    // Small delay between live requests only, to stay well under Mapbox's rate limits.
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  writeStorageCache(storageCache);
  return result;
}

export async function resolveLocation(location: string, token: string): Promise<Coordinates | null> {
  const resolved = await resolveLocations([location], token);
  return resolved.get(location) ?? null;
}
