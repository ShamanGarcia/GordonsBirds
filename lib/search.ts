/**
 * SQLite's default `contains` filter is already ASCII case-insensitive, so
 * this is a no-op today. Postgres's `contains` is case-sensitive, so this
 * is the one place to touch when migrating the datasource later.
 */
export function caseInsensitiveContains(value: string) {
  const isPostgres = process.env.DATABASE_URL?.startsWith("postgres");
  return isPostgres
    ? { contains: value, mode: "insensitive" as const }
    : { contains: value };
}
