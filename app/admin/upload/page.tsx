import { getMapboxToken } from "@/lib/mapbox";
import { UploadWizard } from "@/components/admin/upload/UploadWizard";

export default function AdminUploadPage() {
  const token = getMapboxToken();

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-0">
      <h1 className="mb-8 font-serif text-2xl">Upload Photographs</h1>
      <UploadWizard mapboxToken={token} />
    </div>
  );
}
