import Image from "next/image";
import { getRandomPhotos } from "@/lib/photos";

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const [featured] = await getRandomPhotos(1);

  return (
    <div className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden">
      {featured && (
        <>
          <Image
            src={featured.optimizedUrl}
            alt=""
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-bg/85" aria-hidden="true" />
        </>
      )}
      <div className="relative mx-auto max-w-lg px-6 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ink-muted">
          Gordon&rsquo;s Birds
        </p>
        <h1 className="font-serif text-4xl sm:text-5xl">
          Print Shop
          <br />
          Coming Soon
        </h1>
        <p className="mt-5 text-ink-muted">
          Fine-art prints of photographs from the collection will be
          available here soon — archival paper, considered framing, shipped
          worldwide.
        </p>
      </div>
    </div>
  );
}
