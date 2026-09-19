import { prisma } from "@/lib/prisma";

export type TaxonomyNode = {
  name: string;
  rank: "root" | "order" | "family" | "genus" | "species";
  scientificName?: string;
  speciesId?: string;
  value?: number;
  children?: TaxonomyNode[];
};

export async function getTaxonomyTree(): Promise<TaxonomyNode> {
  const species = await prisma.species.findMany({
    where: { photos: { some: {} } },
    select: {
      id: true,
      scientificName: true,
      commonName: true,
      genus: true,
      family: true,
      order: true,
      _count: { select: { photos: true } },
    },
  });

  const orders = new Map<string, Map<string, Map<string, TaxonomyNode[]>>>();

  for (const sp of species) {
    if (!orders.has(sp.order)) orders.set(sp.order, new Map());
    const families = orders.get(sp.order)!;
    if (!families.has(sp.family)) families.set(sp.family, new Map());
    const genera = families.get(sp.family)!;
    if (!genera.has(sp.genus)) genera.set(sp.genus, []);
    genera.get(sp.genus)!.push({
      name: sp.commonName,
      rank: "species",
      scientificName: sp.scientificName,
      speciesId: sp.id,
      value: sp._count.photos,
    });
  }

  const tree: TaxonomyNode = {
    name: "Birds",
    rank: "root",
    children: Array.from(orders.entries()).map(([order, families]) => ({
      name: order,
      rank: "order" as const,
      children: Array.from(families.entries()).map(([family, genera]) => ({
        name: family,
        rank: "family" as const,
        children: Array.from(genera.entries()).map(([genus, speciesNodes]) => ({
          name: genus,
          rank: "genus" as const,
          children: speciesNodes,
        })),
      })),
    })),
  };

  return tree;
}
