import fs from "node:fs";
import path from "node:path";
import Papa from "papaparse";
import { PhotoDetailClient } from "@/components/photo/PhotoDetailClient";

export function generateStaticParams() {
  const csv = fs.readFileSync(path.join(process.cwd(), "public/data/photos.csv"), "utf-8");
  const { data } = Papa.parse<{ id: string }>(csv, { header: true, skipEmptyLines: true });
  return data.map((row) => ({ id: row.id }));
}

export default function PhotoDetailPage() {
  return <PhotoDetailClient />;
}
