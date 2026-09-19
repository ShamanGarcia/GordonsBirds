// One-time helper: find public-domain-leaning bird photos on Wikimedia Commons
// for seeding the local dev database. Run with `node scripts/fetch-seed-images.mjs`.
// Pass --dry to only print candidates without downloading.

const DRY = process.argv.includes("--dry");
const ONLY = process.argv.find((a) => a.startsWith("--only="))?.slice(7)?.split(",");

const SPECIES = [
  { scientificName: "Haliaeetus leucocephalus", commonName: "Bald Eagle", genus: "Haliaeetus", family: "Accipitridae", order: "Accipitriformes", locationName: "Chesapeake Bay, Maryland, USA", country: "United States", region: "Maryland", lat: 38.9, lng: -76.4 },
  { scientificName: "Ardea herodias", commonName: "Great Blue Heron", genus: "Ardea", family: "Ardeidae", order: "Pelecaniformes", locationName: "Everglades National Park, Florida, USA", country: "United States", region: "Florida", lat: 25.286, lng: -80.898 },
  { scientificName: "Cardinalis cardinalis", commonName: "Northern Cardinal", genus: "Cardinalis", family: "Cardinalidae", order: "Passeriformes", locationName: "Shenandoah National Park, Virginia, USA", country: "United States", region: "Virginia", lat: 38.53, lng: -78.35 },
  { scientificName: "Turdus migratorius", commonName: "American Robin", genus: "Turdus", family: "Turdidae", order: "Passeriformes", locationName: "Ann Arbor, Michigan, USA", country: "United States", region: "Michigan", lat: 42.2808, lng: -83.743 },
  { scientificName: "Setophaga petechia", commonName: "Yellow Warbler", genus: "Setophaga", family: "Parulidae", order: "Passeriformes", locationName: "Magee Marsh, Ohio, USA", country: "United States", region: "Ohio", lat: 41.635, lng: -83.19 },
  { scientificName: "Antigone canadensis", commonName: "Sandhill Crane", genus: "Antigone", family: "Gruidae", order: "Gruiformes", locationName: "Bosque del Apache, New Mexico, USA", country: "United States", region: "New Mexico", lat: 33.79, lng: -106.88 },
  { scientificName: "Fratercula arctica", commonName: "Atlantic Puffin", genus: "Fratercula", family: "Alcidae", order: "Charadriiformes", locationName: "Machias Seal Island, Maine, USA", country: "United States", region: "Maine", lat: 44.5, lng: -67.1 },
  { scientificName: "Bubo scandiacus", commonName: "Snowy Owl", genus: "Bubo", family: "Strigidae", order: "Strigiformes", locationName: "Barrow, Alaska, USA", country: "United States", region: "Alaska", lat: 71.29, lng: -156.79 },
  { scientificName: "Platalea ajaja", commonName: "Roseate Spoonbill", genus: "Platalea", family: "Threskiornithidae", order: "Pelecaniformes", locationName: "Merritt Island National Wildlife Refuge, Florida, USA", country: "United States", region: "Florida", lat: 28.62, lng: -80.68 },
  { scientificName: "Calypte anna", commonName: "Anna's Hummingbird", genus: "Calypte", family: "Trochilidae", order: "Apodiformes", locationName: "Golden Gate Park, San Francisco, California, USA", country: "United States", region: "California", lat: 37.7694, lng: -122.4862 },
  { scientificName: "Geococcyx californianus", commonName: "Greater Roadrunner", genus: "Geococcyx", family: "Cuculidae", order: "Cuculiformes", locationName: "Saguaro National Park, Arizona, USA", country: "United States", region: "Arizona", lat: 32.25, lng: -111.17 },
  { scientificName: "Aix sponsa", commonName: "Wood Duck", genus: "Aix", family: "Anatidae", order: "Anseriformes", locationName: "Cuyahoga Valley National Park, Ohio, USA", country: "United States", region: "Ohio", lat: 41.24, lng: -81.57 },
];

const API = "https://commons.wikimedia.org/w/api.php";
const HEADERS = { "User-Agent": "GordonBirdsSeedScript/1.0 (local dev seeding; contact: none)" };

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchJsonWithRetry(url, attempts = 6) {
  for (let i = 0; i < attempts; i++) {
    const res = await fetch(url, { headers: HEADERS });
    if (res.status === 429) {
      const retryAfter = Number(res.headers.get("retry-after")) || 5;
      const wait = (retryAfter + 1) * 1000;
      process.stderr.write(`  (429, waiting ${wait}ms)\n`);
      await sleep(wait);
      continue;
    }
    const text = await res.text();
    try {
      return JSON.parse(text);
    } catch {
      const wait = 2000 * (i + 1);
      process.stderr.write(`  (bad response, retrying in ${wait}ms)\n`);
      await sleep(wait);
    }
  }
  throw new Error(`Failed to fetch JSON from ${url}`);
}

const EXCLUDE_TERMS = "-intitle:plate -intitle:print -intitle:stamp -intitle:specimen -intitle:museum -Audubon -engraving -lithograph -illustration -painting -drawing -taxidermy -skeleton -egg -nest -range -map -distribution";

async function searchCandidates(scientificName, commonName) {
  const q = `"${scientificName}"`;
  const queries = [
    `${q} photograph haswbstatement:P6216=Q19652 filetype:bitmap ${EXCLUDE_TERMS}`,
    `${q} haswbstatement:P6216=Q19652 filetype:bitmap ${EXCLUDE_TERMS}`,
    `${q} filemime:jpeg ${EXCLUDE_TERMS}`,
    `"${commonName}" photograph filemime:jpeg ${EXCLUDE_TERMS}`,
    `${q} filemime:jpeg`,
  ];
  for (const srsearch of queries) {
    const url = new URL(API);
    url.search = new URLSearchParams({
      action: "query",
      list: "search",
      srsearch,
      srnamespace: "6",
      srlimit: "8",
      format: "json",
      origin: "*",
    }).toString();
    const data = await fetchJsonWithRetry(url);
    const hits = data?.query?.search ?? [];
    if (hits.length) return hits.map((h) => h.title);
    await sleep(500);
  }
  return [];
}

async function getImageInfo(titles) {
  if (!titles.length) return [];
  const url = new URL(API);
  url.search = new URLSearchParams({
    action: "query",
    titles: titles.join("|"),
    prop: "imageinfo",
    iiprop: "url|size|mime|extmetadata|user",
    format: "json",
    origin: "*",
  }).toString();
  const data = await fetchJsonWithRetry(url);
  const pages = data?.query?.pages ?? {};
  return Object.values(pages)
    .map((p) => ({ title: p.title, info: p.imageinfo?.[0] }))
    .filter((p) => p.info);
}

const BAD_KEYWORDS = [
  "audubon", "engraving", "lithograph", "illustration", "painting", "drawing",
  "plate ", "specimen", "museum", "taxidermy", "skeleton", "postage", "stamp",
  "gould", "wilson,", "print,", "hand-colored", "hand coloured", "watercolor",
];

function looksLikeIllustration(c) {
  const title = c.title.toLowerCase();
  const artist = (c.meta.Artist?.value ?? "").replace(/<[^>]*>/g, "").toLowerCase();
  const w = c.info.width ?? 1;
  const h = c.info.height ?? 1;
  const extremeAspect = h / w > 1.8 || w / h > 2.2;
  return BAD_KEYWORDS.some((kw) => title.includes(kw) || artist.includes(kw)) || extremeAspect;
}

function pickBest(candidates) {
  const scored = candidates
    .filter((c) => /image\/(jpeg|png)/.test(c.info.mime))
    .filter((c) => (c.info.width ?? 0) >= 1200)
    .map((c) => {
      const meta = c.info.extmetadata ?? {};
      const license = (meta.LicenseShortName?.value ?? "").toLowerCase();
      const isPD = license.includes("public domain") || license.includes("cc0") || license.includes("pd");
      const isCcBy = license.includes("cc-by") || license.includes("cc by");
      return { ...c, isPD, isCcBy, meta };
    })
    .filter((c) => c.isPD || c.isCcBy)
    .filter((c) => !looksLikeIllustration(c))
    .sort((a, b) => (b.isPD - a.isPD) || (b.info.width - a.info.width));
  return scored[0] ?? null;
}

function stripHtml(s) {
  return (s ?? "").replace(/<[^>]*>/g, "").trim();
}

async function main() {
  const results = [];
  const speciesList = ONLY
    ? SPECIES.filter((sp) => ONLY.some((o) => sp.commonName.toLowerCase().includes(o.toLowerCase())))
    : SPECIES;
  for (const sp of speciesList) {
    process.stderr.write(`Searching: ${sp.commonName} (${sp.scientificName})...\n`);
    const titles = await searchCandidates(sp.scientificName, sp.commonName);
    await sleep(1500);
    const infos = await getImageInfo(titles);
    const best = pickBest(infos);
    if (!best) {
      process.stderr.write(`  NO CANDIDATE FOUND for ${sp.commonName}\n`);
      continue;
    }
    const meta = best.meta;
    const record = {
      ...sp,
      title: best.title,
      imageUrl: best.info.url,
      width: best.info.width,
      height: best.info.height,
      license: stripHtml(meta.LicenseShortName?.value),
      artist: stripHtml(meta.Artist?.value).slice(0, 200),
      credit: stripHtml(meta.Credit?.value).slice(0, 300),
      sourceUrl: `https://commons.wikimedia.org/wiki/${encodeURIComponent(best.title)}`,
    };
    results.push(record);
    process.stderr.write(`  -> ${best.title} (${record.license}) ${best.info.width}x${best.info.height}\n`);
    await sleep(2500);
  }

  console.log(JSON.stringify(results, null, 2));

  if (!DRY) {
    const fs = await import("node:fs/promises");
    const path = await import("node:path");
    const dir = path.join(process.cwd(), "prisma", "seed-data", "images");
    await fs.mkdir(dir, { recursive: true });
    for (const r of results) {
      const ext = r.imageUrl.split(".").pop().split(/[?#]/)[0].toLowerCase();
      const slug = r.scientificName.toLowerCase().replace(/\s+/g, "-");
      const dest = path.join(dir, `${slug}.${ext}`);
      process.stderr.write(`Downloading ${r.commonName} -> ${dest}\n`);
      const res = await fetch(r.imageUrl, { headers: HEADERS });
      const buf = Buffer.from(await res.arrayBuffer());
      await fs.writeFile(dest, buf);
      r.localFile = path.relative(process.cwd(), dest);
    }
    const outPath = path.join(process.cwd(), "prisma", "seed-data", "photos-source.json");
    await fs.writeFile(outPath, JSON.stringify(results, null, 2));
    process.stderr.write(`\nWrote ${outPath}\n`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
