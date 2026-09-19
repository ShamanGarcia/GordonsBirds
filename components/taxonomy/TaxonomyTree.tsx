"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { TaxonomyNode } from "@/lib/taxonomy";

type PackDatum = TaxonomyNode & { children?: PackDatum[] };

export function TaxonomyTree({
  data,
  onSelect,
  size = 640,
}: {
  data: TaxonomyNode;
  onSelect: (node: TaxonomyNode) => void;
  size?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;
    const width = size;
    const height = size;

    const color = d3
      .scaleLinear<string>()
      .domain([0, 5])
      .range(["#D4D4D4", "#0000FF"])
      .interpolate(d3.interpolateRgb);

    const hierarchyRoot = d3
      .hierarchy<PackDatum>(data as PackDatum)
      .sum((d) => (d.children ? 0 : Math.max(d.value ?? 1, 1)))
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    const pack = d3.pack<PackDatum>().size([width, height]).padding(3);
    const root = pack(hierarchyRoot);

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
      .attr("width", "100%")
      .attr("height", "100%")
      .style("cursor", "pointer")
      .style("font", "12px var(--font-sans, sans-serif)");

    svg.selectAll("*").remove();

    let focus = root;
    let view: [number, number, number];

    const node = svg
      .append("g")
      .selectAll("circle")
      .data(root.descendants().slice(1))
      .join("circle")
      .attr("fill", (d) => (d.children ? color(d.depth) : "#000000"))
      .attr("fill-opacity", (d) => (d.children ? 0.75 : 0.9))
      .attr("stroke", (d) => (d.data.rank === "species" ? "none" : "#C0C0C0"))
      .attr("stroke-width", 0.5)
      .on("mouseover", function () {
        d3.select(this).attr("stroke", "#0000FF").attr("stroke-width", 1.5);
      })
      .on("mouseout", function (_event, d) {
        d3.select(this)
          .attr("stroke", d.data.rank === "species" ? "none" : "#C0C0C0")
          .attr("stroke-width", 0.5);
      })
      .on("click", (event, d) => {
        event.stopPropagation();
        onSelect(d.data);
        if (focus !== d) {
          zoom(event, d);
        }
      });

    node.append("title").text((d) => {
      if (d.data.rank === "species") {
        return `${d.data.name} — ${d.data.scientificName}`;
      }
      return `${d.data.name} (${d.value} photo${d.value === 1 ? "" : "s"})`;
    });

    const labelGroup = svg
      .append("g")
      .attr("pointer-events", "none")
      .attr("text-anchor", "middle")
      .selectAll("g")
      .data(root.descendants().slice(1))
      .join("g")
      .style("fill-opacity", (d) => (d.parent === root ? 1 : 0))
      .style("display", (d) => (d.parent === root ? "inline" : "none"));

    labelGroup
      .append("text")
      .attr("class", "taxonomy-label-name")
      .attr("y", (d) => (d.data.rank === "species" ? -2 : 0))
      .attr("fill", (d) => (d.children ? "#000000" : "#FFFFFF"))
      .style("font-weight", (d) => (d.data.rank === "order" ? 600 : 400))
      .text((d) => d.data.name);

    labelGroup
      .filter((d) => d.data.rank === "species")
      .append("text")
      .attr("y", 10)
      .attr("fill", "#FFFFFF")
      .style("font-style", "italic")
      .style("font-size", "9px")
      .text((d) => d.data.scientificName ?? "");

    svg.on("click", (event) => zoom(event, root));
    zoomTo([root.x, root.y, root.r * 2]);

    function zoomTo(v: [number, number, number]) {
      const k = width / v[2];
      view = v;
      labelGroup.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`,
      );
      node.attr(
        "transform",
        (d) => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`,
      );
      node.attr("r", (d) => d.r * k);
    }

    function zoom(event: unknown, d: d3.HierarchyCircularNode<PackDatum>) {
      focus = d;
      const transition = svg
        .transition()
        .duration(650)
        .tween("zoom", () => {
          const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
          return (t: number) => zoomTo(i(t));
        });

      labelGroup
        .transition(transition as never)
        .style("display", (d2) => (d2.parent === focus || d2 === focus ? "inline" : "none"))
        .style("fill-opacity", (d2) => (d2.parent === focus || d2 === focus ? 1 : 0));
    }
    // onSelect is intentionally excluded: this effect rebuilds the whole D3
    // scene graph, and re-running it on every parent re-render (which
    // happens whenever the caller's onSelect identity changes) would reset
    // the current zoom/focus state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, size]);

  return <svg ref={svgRef} className="mx-auto block max-w-full" role="img" aria-label="Taxonomic explorer of the bird collection, organized by order, family, genus, and species" />;
}
