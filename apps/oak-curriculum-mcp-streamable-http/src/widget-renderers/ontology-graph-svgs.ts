/**
 * Property graph SVG constants for ontology renderer output.
 *
 * These SVG strings are composed from section and edge configuration modules
 * so the renderer does not duplicate large inline SVG blobs.
 *
 * @see svg-overview-sections.ts - Overview graph section and edge geometry
 * @see svg-full-sections.ts - Full graph section geometry and legend config
 * @see svg-full-edges.ts - Full graph edge geometry
 * @see svg-components.ts - Low-level SVG composition helpers
 */

import {
  createEdge,
  createSection,
  type EdgeConfig,
  type SectionConfig,
} from './svg-components.js';
import { FULL_EDGES } from './svg-full-edges.js';
import { FULL_SECTIONS, LEGEND_CONFIG } from './svg-full-sections.js';
import { createOverviewEdges, OVERVIEW_SECTIONS } from './svg-overview-sections.js';

const PROPERTY_GRAPH_SVG_STYLE = `<style>
  .node-core { fill: #287d3c; stroke: #1b3d1c; stroke-width: 2; transition: stroke-width 0.15s, filter 0.15s; }
  .node-context { fill: #5da0d9; stroke: #2d5a7b; stroke-width: 2; transition: stroke-width 0.15s, filter 0.15s; }
  .node-content { fill: #d97d5d; stroke: #7b3d2d; stroke-width: 2; transition: stroke-width 0.15s, filter 0.15s; }
  .node-taxonomy { fill: #9b7dcf; stroke: #5d4a7b; stroke-width: 2; transition: stroke-width 0.15s, filter 0.15s; }
  .node-ks4 { fill: #cfab5d; stroke: #7b6a2d; stroke-width: 2; transition: stroke-width 0.15s, filter 0.15s; }
  .node-metadata { fill: #7a9e7a; stroke: #3d5a3d; stroke-width: 2; transition: stroke-width 0.15s, filter 0.15s; }
  g[id^="node-"]:hover rect { stroke: #fff; stroke-width: 4; filter: drop-shadow(0 0 8px rgba(255,255,255,0.7)); cursor: pointer; }
  .edge { stroke: #fff; stroke-width: 4; fill: none; }
  .edge-outline { stroke: #1b3d1c; stroke-width: 8; fill: none; }
  .edge-dashed { stroke: #fff; stroke-width: 3; fill: none; stroke-dasharray: 8 5; }
  .edge-dashed-outline { stroke: #1b3d1c; stroke-width: 7; fill: none; stroke-dasharray: 8 5; }
  .label { font-size: 14px; fill: #fff; stroke: #1b3d1c; stroke-width: 3px; paint-order: stroke fill; text-anchor: middle; font-family: inherit; font-weight: 700; }
  .label-sm { font-size: 11px; fill: #fff; stroke: #1b3d1c; stroke-width: 2px; paint-order: stroke fill; text-anchor: middle; font-family: inherit; font-weight: 600; }
  .group-label-bg { fill: #000; }
  .group-label { font-size: 13px; fill: #fff; text-anchor: start; font-family: inherit; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
</style>`;

function createLegendItem(cssClass: string, label: string, x: number): string {
  const nodeY = 820;
  const textX = x + 32;
  const textY = 838;
  return `<rect class="${cssClass}" x="${String(x)}" y="${String(nodeY)}" width="24" height="24" rx="6"/><text class="label-sm" style="text-anchor:start" x="${String(textX)}" y="${String(textY)}">${label}</text>`;
}

function createLegendSvg(): string {
  const legendItemsSvg = LEGEND_CONFIG.items
    .map((item) => createLegendItem(item.cssClass, item.label, item.x))
    .join('');
  return `<rect x="${String(LEGEND_CONFIG.position.x)}" y="${String(LEGEND_CONFIG.position.y)}" width="${String(LEGEND_CONFIG.width)}" height="${String(LEGEND_CONFIG.height)}" rx="8" fill="rgba(0,0,0,0.3)"/><rect class="group-label-bg" x="35" y="820" width="68" height="24" rx="4"/><text class="group-label" x="69" y="838" style="text-anchor:middle">Legend:</text>${legendItemsSvg}<line class="edge" x1="860" y1="832" x2="910" y2="832"/><text class="label-sm" style="text-anchor:start" x="918" y="838">Explicit</text><line class="edge-dashed" x1="1010" y1="832" x2="1060" y2="832"/><text class="label-sm" style="text-anchor:start" x="1068" y="838">Inferred</text>`;
}

function createGraphSvg(
  viewBox: string,
  maxWidth: number,
  sections: readonly SectionConfig[],
  edges: readonly EdgeConfig[],
  extraSvg: string,
): string {
  const edgesSvg = edges.map(createEdge).join('');
  const sectionsSvg = sections.map(createSection).join('');
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:${String(maxWidth)}px;height:auto;display:block;margin:0 auto">${PROPERTY_GRAPH_SVG_STYLE}${edgesSvg}${sectionsSvg}${extraSvg}</svg>`;
}

const OVERVIEW_EDGES = createOverviewEdges();
const FULL_LEGEND_SVG = createLegendSvg();

/**
 * Overview property graph visualisation (18 concept nodes).
 */
export const ONTOLOGY_GRAPH_OVERVIEW_SVG = createGraphSvg(
  '0 0 960 620',
  960,
  OVERVIEW_SECTIONS,
  OVERVIEW_EDGES,
  '',
);

/**
 * Full property graph visualisation (28 concept nodes, includes legend).
 */
export const ONTOLOGY_GRAPH_FULL_SVG = createGraphSvg(
  '0 0 1250 950',
  1250,
  FULL_SECTIONS,
  FULL_EDGES,
  FULL_LEGEND_SVG,
);
