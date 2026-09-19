import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { logoutAction } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [photoCount, speciesCount] = await Promise.all([
    prisma.photo.count(),
    prisma.species.count({ where: { photos: { some: {} } } }),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-5 py-16 sm:px-0">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="font-serif text-2xl">Admin Controls</h1>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-ink-muted underline hover:text-accent">
            Sign out
          </button>
        </form>
      </div>

      <dl className="mb-10 grid grid-cols-2 gap-4 border border-hairline p-6 text-sm">
        <div>
          <dt className="text-ink-muted">Photographs</dt>
          <dd className="font-serif text-2xl text-ink">{photoCount}</dd>
        </div>
        <div>
          <dt className="text-ink-muted">Species</dt>
          <dd className="font-serif text-2xl text-ink">{speciesCount}</dd>
        </div>
      </dl>

      <Link
        href="/admin/upload"
        className="inline-block border border-ink px-6 py-3 text-sm text-ink transition-colors hover:border-accent hover:text-accent"
      >
        Upload Photographs
      </Link>

      <p className="mt-8 text-sm text-ink-muted">
        To delete a photograph, open it from the{" "}
        <Link href="/catalogue" className="underline hover:text-accent">
          catalogue
        </Link>{" "}
        while signed in — a delete control appears on its detail page.
      </p>
    </div>
  );
}
