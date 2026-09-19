# Gordon's Birds

A bird photography archive: a home gallery, a searchable catalogue, a clustered Mapbox map, and a photo detail view — all generated in the browser from one spreadsheet. There is no server, database, or admin login: this is a static site, and the spreadsheet **is** the content-management system.

## Requirements

- **Node.js 22.12+** to build the site locally.
- A free [Mapbox](https://account.mapbox.com/access-tokens/) access token to enable the Map page and the Photo Detail mini-map. Without one, those two spots show a graceful "add your token" placeholder instead of crashing. The Map page also uses this token to geocode each photo's location text into coordinates live in the browser (see "How it works" below).

## Setup

```bash
npm install
cp .env.local.example .env.local
```

Fill in `.env.local` with your Mapbox token, then run the dev server:

```bash
npm run dev
```

The dev server (and the production build) serve the site under `/GordonsBirds` — matching the path GitHub Pages will use — so visit `http://localhost:3000/GordonsBirds/`.

## Editing the collection

The entire collection lives in [`public/data/photos.csv`](public/data/photos.csv), with one row per photograph:

| column | meaning |
| --- | --- |
| `id` | Unique ID; also sets display order and Photo Detail's prev/next sequence. |
| `image` | Filename of the photo, which must exist in `public/photos/`. |
| `location` | Free-text place name (e.g. `"Hill Country, Texas, USA"`). Geocoded live via Mapbox on the Map page and Photo Detail — no coordinates need to be stored. |
| `species` | `"Common Name (Scientific name)"` — parsed into both parts for display. |

**To add a photograph**: drop the image file into `public/photos/`, add a row to `photos.csv`, and commit. **To remove one**: delete its row and image file, and commit. There's no login or upload form — git push access to this repo is the only "admin" permission there is.

## How it works

- The CSV is fetched and parsed (with [`papaparse`](https://www.papaparse.com/)) directly in the browser when a page loads — see `lib/photos.ts` and the `usePhotos()` hook in `lib/usePhotos.ts`. Home, Catalogue, Map, and Photo Detail are all client components built on top of that.
- The Map page and Photo Detail's mini-map resolve each `location` string into coordinates via Mapbox's Geocoding API, called directly from the browser (`lib/geocode.ts`). Results are cached in memory and `sessionStorage`, so each unique location is only geocoded once per browser session — not once per photograph.
- Because there's no server, `next.config.ts` sets `output: "export"`, producing plain static HTML/CSS/JS in `out/`. Photo Detail's dynamic `/photo/[id]` route uses `generateStaticParams` (reading the CSV at *build* time, via Node's filesystem, just to know which IDs exist) — the actual page content is still populated by the same client-side CSV fetch as everywhere else.

## Deploying to GitHub Pages

[`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and deploys automatically on every push to `main`. Two one-time manual steps are required (repo/account settings, so they have to be done in GitHub's own UI):

1. **Settings → Pages** → set the source to **GitHub Actions**.
2. **Settings → Secrets and variables → Actions** → add a repository secret named `NEXT_PUBLIC_MAPBOX_TOKEN` with your Mapbox token. (`NEXT_PUBLIC_` variables are baked into the build at compile time, so the workflow needs it as a secret to pass through to `npm run build`.)

Once those are set, any push to `main` — including just editing `photos.csv` — triggers a rebuild and redeploy, live at `https://<your-username>.github.io/GordonsBirds/`.

`next.config.ts` sets `basePath: "/GordonsBirds"` since GitHub Pages serves a project site like this one under `/<repo-name>/` by default. If you later attach a custom domain, remove that `basePath` and add a `CNAME` file to `public/`.

## Project structure

- `app/` — routes (Home, Catalogue, Map, Shop, Photo Detail). No API routes — everything is static.
- `components/` — UI, grouped by area (`photo/`, `map/`, `catalogue/`, `nav/`).
- `lib/photos.ts` — loads and parses the CSV; `lib/usePhotos.ts` — the shared client hook; `lib/geocode.ts` — Mapbox geocoding with caching; `lib/basePath.ts` — the shared `/GordonsBirds` prefix used by raw `<img>`/`fetch()` calls (see note below).
- `public/data/photos.csv` — the collection. `public/photos/` — the image files it references.

**A basePath gotcha worth knowing**: `next/link` and `next/image` apply `basePath` automatically, but plain `<img src="...">` tags and `fetch()` calls to `public/` assets do not — Next.js doesn't rewrite raw string paths. That's why `lib/photos.ts`'s CSV fetch and the plain `<img>` tags in `PhotoCard`/`PhotoDetailClient`/the Shop page all explicitly prepend `basePath` from `lib/basePath.ts`.

## Notable design decisions

- **Static, spreadsheet-driven**: no database, no server, no build-time secrets beyond the Mapbox token. The tradeoff is a much simpler "admin" story (edit a CSV + commit) in exchange for genuinely running on GitHub Pages alone.
- **Live client-side geocoding**: rather than storing latitude/longitude in the sheet, the Map page and Photo Detail resolve `location` text to coordinates on the fly via Mapbox, adapted from the same forward-geocoding pattern this project used for its now-removed admin location picker.
- **One plain image per photo**: no thumbnail/optimized/blur-placeholder variants (that required a server-side `sharp` pipeline, which doesn't exist anymore).
- **Design**: a Windows 95 look — grey (`#C0C0C0`) backgrounds, black text, blue (`#0000FF`) accents/links, set in **W95FA** (a modern re-creation of the Windows 95 system font by MadeByArne, self-hosted via `next/font/local` from `assets/fonts/`; free for commercial use under the SIL Open Font License, see `assets/fonts/W95FA-OFL.txt`). Buttons and the gallery's column stepper use an authentic raised/pressed 3D bevel (`.bevel-btn` in `app/globals.css`).

## Known limitations (by design, for this scope)

- Catalogue search is a single free-text field matching common name, scientific name, or location — there's no structured country/region filter, since the sheet doesn't carry those as separate columns.
- Photo Detail's prev/next cycles the CSV's row order (by `id`), not the filtered/random set the visitor arrived from.
- Adding or removing a photo requires a commit + a redeploy (roughly a minute via GitHub Actions) — there's no instant, live editing.
