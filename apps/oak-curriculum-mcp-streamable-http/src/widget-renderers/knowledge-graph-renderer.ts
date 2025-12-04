/**
 * Knowledge Graph renderer for the widget.
 * Uses component-based architecture with nested <g> groups.
 * @module widget-renderers/knowledge-graph-renderer
 */

import { createSection, createEdge } from './svg-components.js';
import {
  OVERVIEW_SECTIONS,
  createOverviewEdges,
  FULL_SECTIONS,
  LEGEND_CONFIG,
  FULL_EDGES,
} from './svg-section-data.js';

/** Shared CSS styles for both SVG graphs. */
const SVG_STYLES = `
  .node-core { fill: #287d3c; stroke: #1b3d1c; stroke-width: 2; }
  .node-context { fill: #5da0d9; stroke: #2d5a7b; stroke-width: 2; }
  .node-content { fill: #d97d5d; stroke: #7b3d2d; stroke-width: 2; }
  .node-taxonomy { fill: #9b7dcf; stroke: #5d4a7b; stroke-width: 2; }
  .node-ks4 { fill: #cfab5d; stroke: #7b6a2d; stroke-width: 2; }
  .node-metadata { fill: #7a9e7a; stroke: #3d5a3d; stroke-width: 2; }
  .edge { stroke: #fff; stroke-width: 4; fill: none; }
  .edge-outline { stroke: #1b3d1c; stroke-width: 8; fill: none; }
  .edge-dashed { stroke: #fff; stroke-width: 3; fill: none; stroke-dasharray: 8 5; }
  .edge-dashed-outline { stroke: #1b3d1c; stroke-width: 7; fill: none; stroke-dasharray: 8 5; }
  .label { font-size: 14px; fill: #fff; stroke: #1b3d1c; stroke-width: 3px; paint-order: stroke fill; text-anchor: middle; font-family: inherit; font-weight: 700; }
  .label-sm { font-size: 11px; fill: #fff; stroke: #1b3d1c; stroke-width: 2px; paint-order: stroke fill; text-anchor: middle; font-family: inherit; font-weight: 600; }
  .group-label-bg { fill: #000; }
  .group-label { font-size: 13px; fill: #fff; text-anchor: start; font-family: inherit; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; }
`;

function buildOverviewSvg(): string {
  const edges = createOverviewEdges().map(createEdge).join('');
  const sections = OVERVIEW_SECTIONS.map(createSection).join('');
  return `<svg viewBox="0 0 960 620" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:960px;height:auto;display:block;margin:0 auto"><style>${SVG_STYLES}</style>${edges}${sections}</svg>`;
}

function buildLegend(): string {
  const { position, width, height, items } = LEGEND_CONFIG;
  const x = position.x;
  const y = position.y;
  let l = `<rect x="${String(x)}" y="${String(y)}" width="${String(width)}" height="${String(height)}" rx="8" fill="rgba(0,0,0,0.3)"/>`;
  l += `<rect class="group-label-bg" x="${String(x + 15)}" y="${String(y + 20)}" width="68" height="24" rx="4"/>`;
  l += `<text class="group-label" x="${String(x + 49)}" y="${String(y + 38)}" style="text-anchor:middle">Legend:</text>`;
  for (const item of items) {
    l += `<rect class="${item.cssClass}" x="${String(item.x)}" y="${String(y + 20)}" width="24" height="24" rx="6"/>`;
    l += `<text class="label-sm" style="text-anchor:start" x="${String(item.x + 32)}" y="${String(y + 38)}">${item.label}</text>`;
  }
  l += `<line class="edge" x1="860" y1="${String(y + 32)}" x2="910" y2="${String(y + 32)}"/>`;
  l += `<text class="label-sm" style="text-anchor:start" x="918" y="${String(y + 38)}">Explicit</text>`;
  l += `<line class="edge-dashed" x1="1010" y1="${String(y + 32)}" x2="1060" y2="${String(y + 32)}"/>`;
  l += `<text class="label-sm" style="text-anchor:start" x="1068" y="${String(y + 38)}">Inferred</text>`;
  return l;
}

function buildFullSvg(): string {
  const edges = FULL_EDGES.map(createEdge).join('');
  const sections = FULL_SECTIONS.map(createSection).join('');
  const legend = buildLegend();
  return `<svg viewBox="0 0 1250 950" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:1250px;height:auto;display:block;margin:0 auto"><style>${SVG_STYLES}</style>${edges}${sections}${legend}</svg>`;
}

const KNOWLEDGE_GRAPH_OVERVIEW_SVG = buildOverviewSvg();
const KNOWLEDGE_GRAPH_FULL_SVG = buildFullSvg();

/** Renderer function for knowledge graph widget. */
export const KNOWLEDGE_GRAPH_RENDERER = `
const KNOWLEDGE_GRAPH_OVERVIEW_SVG = \`${KNOWLEDGE_GRAPH_OVERVIEW_SVG}\`;
const KNOWLEDGE_GRAPH_FULL_SVG = \`${KNOWLEDGE_GRAPH_FULL_SVG}\`;

function renderKnowledgeGraph(data) {
  let h = '';
  h += '<div class="sec"><h2 class="sec-ttl">Oak Knowledge Graph</h2>';
  h += '<p style="margin:0 0 12px;font-size:14px">Schema-level graph showing how curriculum concept types relate to each other.</p>';
  h += '</div>';
  h += '<div class="sec">';
  h += '<p style="margin:0 0 12px;font-size:14px;color:var(--accent);font-weight:600">✓ Knowledge graph loaded successfully</p>';
  h += '</div>';
  h += '<div class="sec">';
  h += '<details style="border:1px solid var(--border-color);border-radius:8px;padding:12px">';
  h += '<summary style="cursor:pointer;font-size:13px;font-weight:500;color:var(--fg-secondary)">Graph overview (18 key concepts)</summary>';
  h += '<div style="margin-top:12px;text-align:center">';
  h += KNOWLEDGE_GRAPH_OVERVIEW_SVG;
  h += '<p style="margin:8px 0 0;font-size:11px;color:var(--fg-secondary);font-style:italic">Hover over edges to see relationship names • Solid: explicit • Dashed: inferred</p>';
  h += '</div>';
  h += '</details>';
  h += '</div>';
  h += '<div class="sec">';
  h += '<details style="border:1px solid var(--border-color);border-radius:8px;padding:12px">';
  h += '<summary style="cursor:pointer;font-size:13px;font-weight:500;color:var(--fg-secondary)">Full graph (28 concepts, 45 edges)</summary>';
  h += '<div style="margin-top:12px;text-align:center">';
  h += KNOWLEDGE_GRAPH_FULL_SVG;
  h += '<p style="margin:8px 0 0;font-size:11px;color:var(--fg-secondary);font-style:italic">Hover over edges to see relationship names • All concepts from knowledge-graph-data.ts</p>';
  h += '</div>';
  h += '</details>';
  h += '</div>';
  return h || '<div class="empty">No knowledge graph data available.</div>';
}
`.trim();
