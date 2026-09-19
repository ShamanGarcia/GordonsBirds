import { ScientificName } from "@/components/photo/ScientificName";
import type { TaxonomyNode } from "@/lib/taxonomy";

function Branch({ node }: { node: TaxonomyNode }) {
  if (node.rank === "species") {
    return (
      <li>
        {node.name} — <ScientificName name={node.scientificName ?? ""} />
      </li>
    );
  }
  return (
    <li>
      <details>
        <summary className="cursor-pointer py-0.5">{node.name}</summary>
        <ul className="ml-4 border-l border-hairline pl-3">
          {node.children?.map((child) => (
            <Branch key={`${child.rank}-${child.name}`} node={child} />
          ))}
        </ul>
      </details>
    </li>
  );
}

export function TaxonomyList({ data }: { data: TaxonomyNode }) {
  return (
    <details className="mt-10 text-sm text-ink-muted">
      <summary className="cursor-pointer font-serif text-base text-ink">
        Browse the taxonomy as a list
      </summary>
      <ul className="mt-3">
        {data.children?.map((child) => (
          <Branch key={`${child.rank}-${child.name}`} node={child} />
        ))}
      </ul>
    </details>
  );
}
