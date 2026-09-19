"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";

export function DeleteControl({ photoId }: { photoId: string }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setDeleting(true);
    setError(null);
    try {
      const res = await fetch(`/api/photos/${photoId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      setOpen(false);
      router.push("/catalogue");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <div className="mt-10 border-t border-dashed border-clay/50 pt-4">
      <p className="mb-2 text-xs uppercase tracking-wide text-clay">Admin controls</p>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <button
            type="button"
            className="border border-clay px-4 py-2 text-sm text-clay transition-colors hover:bg-clay hover:text-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay"
          >
            Delete Photograph
          </button>
        </Dialog.Trigger>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[90vw] max-w-sm -translate-x-1/2 -translate-y-1/2 bg-bg p-6 shadow-lg">
            <Dialog.Title className="font-serif text-lg text-heading">
              Delete this photograph?
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-ink-muted">
              Are you sure you want to permanently delete this photograph? It
              will be removed from the catalogue, map, taxonomy, and home
              galleries. This cannot be undone.
            </Dialog.Description>
            {error && <p className="mt-2 text-sm text-clay">{error}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 text-sm text-ink-muted hover:text-ink"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="bg-clay px-4 py-2 text-sm text-bg transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {deleting ? "Deleting…" : "Permanently delete"}
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
