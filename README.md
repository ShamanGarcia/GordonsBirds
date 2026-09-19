# Gordon's Birds

A museum-quality bird photography archive: a home gallery, a searchable catalogue, a zoomable D3 taxonomy explorer, a clustered Mapbox map, and an authenticated admin area for uploading and deleting photographs. Catalogue, map, taxonomy, home gallery, and photo detail are all generated live from one Photo/Species database — nothing is hand-wired page by page.

## Requirements

- **Node.js 22.12+ / 24+** (this project was built and its native dependencies compiled against **Node 22**; see `.node-version`). Prisma 7's `better-sqlite3` driver adapter is a native addon, so if you switch Node major versions you must run `npm rebuild better-sqlite3` again.
- A free [Mapbox](https://account.mapbox.com/access-tokens/) access token to enable the Map page, the Photo Detail mini-map, and the admin location picker. Without one, those three spots show a graceful "add your token" placeholder instead of crashing.

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local`:

- `DATABASE_URL` — leave as `file:./prisma/dev.db` for local dev.
- `NEXT_PUBLIC_MAPBOX_TOKEN` — your Mapbox public token.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD_HASH` — the single admin account. Generate the hash with:
  ```bash
  node scripts/hash-password.mjs "your-password"
  ```
  **Important:** bcrypt hashes are full of `$` characters, and Next.js expands `$VAR`-style references in `.env` files. Escape every `$` in the hash as `\$` when you paste it in, or login will silently fail. (The checked-in `.env.local` for this repo already does this, with a default password of `gordonbirds-admin` — change it before deploying anywhere real.)
- `AUTH_SECRET` — a random signing secret:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```

Then set up the database and seed the initial 12-photo collection:

```bash
npx prisma migrate dev
npm run db:seed
```

Run the dev server:

```bash
npm run dev
```

## Deploying to Render

This app needs a live Node.js server (database, admin auth, image uploads), so it can't run on static hosts like GitHub Pages. [Render](https://render.com) works with no code changes beyond what's already in this repo, because a persistent disk keeps the SQLite file and uploaded photos intact across deploys.

1. Push this repo to GitHub (already done for `ShamanGarcia/GordonsBirds`).
2. In the Render dashboard: **New +** → **Blueprint**, and point it at this repo. Render will read `render.yaml` and provision the web service plus a 1 GB persistent disk mounted at `/var/data`. Persistent disks require a paid plan (the blueprint requests `starter`) — Render's free plan doesn't support them, so a fresh disk-less deploy would lose all data (DB + photos) on every restart.
3. In the service's **Environment** tab, set the four secrets `render.yaml` leaves blank:
   - `NEXT_PUBLIC_MAPBOX_TOKEN`
   - `ADMIN_EMAIL`
   - `ADMIN_PASSWORD_HASH` (same `\$`-escaping caveat as above applies here too)
   - `AUTH_SECRET`
4. Deploy. `scripts/render-start.sh` runs on every start: it symlinks `public/photos` to the persistent disk, runs `prisma migrate deploy`, seeds the initial 12 photos once (tracked by a marker file on the disk so it never reseeds), then starts the server.
5. Subsequent admin uploads/deletes persist normally since they write to the same disk-backed path.

## Project structure

- `app/` — routes (Home, Catalogue, Taxonomy, Map, Shop, Photo Detail, Admin) and API routes.
- `components/` — UI, grouped by area (`photo/`, `map/`, `taxonomy/`, `admin/upload/`, `nav/`).
- `lib/` — data access (`photos.ts`, `taxonomy.ts`), image processing (`image.ts`), auth (`auth.ts`), and the static species reference dataset used for admin autocomplete (`taxonomyReference.ts`).
- `prisma/` — schema, migrations, and `seed.ts` (which re-uses the same `lib/image.ts` pipeline a live admin upload uses).
- `scripts/fetch-seed-images.mjs` — the tool used to source the 12 seed photographs from Wikimedia Commons (public-domain-leaning, license/credit recorded per photo in `prisma/seed-data/photos-source.json`).

## Data model

`Species` (scientific name, common name, genus, family, order) and `Photo` (image URLs, coordinates, location, optional photographer/license/source, `speciesId` foreign key) — see `prisma/schema.prisma`. Deleting a species' last photo prunes it from every view (it queries `species: { photos: { some: {} } }`) without deleting the `Species` row itself.

## Notable design decisions

- **Local-first**: SQLite via Prisma's `better-sqlite3` driver adapter, images processed with `sharp` and stored under `public/photos/`, no cloud services required to run it. The schema avoids SQLite-only features so swapping the datasource to Postgres later is small.
- **Auth**: a single admin account, hand-rolled (bcrypt + a signed `jose` JWT in an httpOnly cookie, checked in `proxy.ts`) rather than a full auth library — appropriate for one admin identity and avoids pulling in a library whose App Router support may lag a brand-new Next.js major version.
- **Design**: a Windows 95 look — grey (`#C0C0C0`) backgrounds, black text, blue (`#0000FF`) accents/links, set in **W95FA** (a modern re-creation of the Windows 95 system font by MadeByArne, self-hosted via `next/font/local` from `assets/fonts/`; free for commercial use under the SIL Open Font License, see `assets/fonts/W95FA-OFL.txt`). Buttons and the gallery's column stepper use an authentic raised/pressed 3D bevel (`.bevel-btn` in `app/globals.css`).

## Known limitations (by design, for this prototype scope)

- One species per upload batch; per-photo location assignment is supported, per-photo species is not.
- Photo Detail's prev/next cycles a fixed global order, not the filtered/random set the visitor arrived from.
- The infinite-gallery fetches all photo metadata (not full-resolution images) in one request and paginates client-side — fine at this collection's scale; a true cursor-based API would be the next step for a very large archive.
