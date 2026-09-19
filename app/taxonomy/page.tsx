import { getTaxonomyTree } from "@/lib/taxonomy";
import { TaxonomyExplorer } from "@/components/taxonomy/TaxonomyExplorer";

export const dynamic = "force-dynamic";

export default async function TaxonomyPage() {
  const tree = await getTaxonomyTree();

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-16">
      <h1 className="mb-2 font-serif text-3xl">Taxonomy</h1>
      <p className="mb-10 max-w-xl text-ink-muted">
        Every photographed species, organized by biological classification.
        Click a circle to zoom in and see its photographs; click the
        background to zoom back out.
      </p>

      {!tree.children || tree.children.length === 0 ? (
        <p className="text-ink-muted">No species have been catalogued yet.</p>
      ) : (
        <TaxonomyExplorer data={tree} />
      )}
    </div>
  );
}
