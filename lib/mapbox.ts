export function getMapboxToken(): string | null {
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  return token && token.trim().length > 0 ? token : null;
}
