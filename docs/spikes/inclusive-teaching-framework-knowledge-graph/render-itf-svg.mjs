#!/usr/bin/env node
/**
 * render-itf-svg.mjs — proof of concept: render the ITF knowledge graph
 * (itf-graph/data.json) as a standalone accessible SVG with a deterministic
 * layered layout. No dependencies, no randomness: same input → same SVG.
 *
 * Layout: five columns — framework/principles/organisations | areas |
 * underpinning ideas + key insights | concepts | references. Concepts and
 * references are ordered by the barycentre of their neighbours' positions to
 * reduce edge crossings. Reference pills are SVG links to their external
 * source (the availableAt terminal link nodes); concept-to-concept relations
 * are drawn as arcs beside the concept column, distinguished by dash pattern
 * (not colour alone).
 *
 * PRESERVATION COPY — this hand-authored JavaScript is sanctioned for this
 * spike only (owner direction 2026-07-07, knowledge preservation). All
 * official repository code must be TypeScript; the proper integration pass
 * will promote this to a typed, tested workspace module. See README.md and
 * NOTES.md alongside this file.
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Reads data.json and writes graph.svg alongside this script.
const DIR = dirname(fileURLToPath(import.meta.url));
const corpus = JSON.parse(readFileSync(join(DIR, 'data.json'), 'utf8'));

const byId = new Map(corpus.nodes.map((n) => [n.id, n]));
const edges = corpus.edges;

// Okabe-Ito colour-blind-safe palette, one colour per area (nodes also carry
// their area by position/grouping, so colour is reinforcement, not the only cue).
const AREA_COLOURS = {
  'speech-and-language': '#0072B2',
  sensory: '#009E73',
  motor: '#D55E00',
  'executive-function': '#CC79A7',
  'social-and-emotional-development': '#E69F00',
};
const NEUTRAL = '#4d4d4d';

// --- geometry -------------------------------------------------------------

const MARGIN_TOP = 96;
const MARGIN_BOTTOM = 150;
const CONTENT_H = 1500;
const HEIGHT = MARGIN_TOP + CONTENT_H + MARGIN_BOTTOM;
const WIDTH = 1560;
const PILL_H = 20;
const FONT = 11;
const CHAR_W = 6.05; // approx glyph advance at 11px sans-serif

const COLS = {
  meta: { x: 16, w: 210, title: 'Framework' },
  area: { x: 274, w: 200, title: 'Areas of need' },
  item: { x: 540, w: 330, title: 'Underpinning ideas & key insights' },
  concept: { x: 936, w: 232, title: 'Concepts' },
  reference: { x: 1256, w: 288, title: 'References (click to open source)' },
};

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const truncate = (s, w) => {
  const max = Math.floor((w - 14) / CHAR_W);
  return s.length <= max ? s : `${s.slice(0, max - 1)}…`;
};

// --- node ordering --------------------------------------------------------

const areas = corpus.nodes.filter((n) => n.kind === 'area').sort((a, b) => a.order - b.order);
const areaIndex = new Map(areas.map((a, i) => [a.areaSlug, i]));

// Column 2: per area, ideas then insights, in document order.
const items = [];
for (const a of areas) {
  items.push(
    ...corpus.nodes.filter((n) => n.kind === 'idea' && n.areaSlug === a.areaSlug),
    ...corpus.nodes
      .filter((n) => n.kind === 'insight' && n.areaSlug === a.areaSlug)
      .sort((x, y) => x.order - y.order),
  );
}

const spread = (list, col) => {
  const pitch = CONTENT_H / list.length;
  return new Map(
    list.map((n, i) => [n.id, { x: COLS[col].x, y: MARGIN_TOP + pitch * (i + 0.5), col }]),
  );
};

const pos = new Map();
for (const [id, p] of spread(items, 'item')) pos.set(id, p);

// Areas: centred on the mean y of their items.
areas.forEach((a) => {
  const ys = items.filter((n) => n.areaSlug === a.areaSlug).map((n) => pos.get(n.id).y);
  pos.set(a.id, { x: COLS.area.x, y: ys.reduce((s, v) => s + v, 0) / ys.length, col: 'area' });
});

// Concepts: barycentre of connected item ys (fallback: bottom).
const conceptNeighbours = new Map();
for (const e of edges.filter((e) => e.type === 'involvesConcept')) {
  if (!pos.has(e.source)) continue; // framework-level involvesConcept handled below
  if (!conceptNeighbours.has(e.target)) conceptNeighbours.set(e.target, []);
  conceptNeighbours.get(e.target).push(pos.get(e.source).y);
}
const concepts = corpus.nodes
  .filter((n) => n.kind === 'concept')
  .map((n) => {
    const ys = conceptNeighbours.get(n.id) ?? [];
    return {
      n,
      key: ys.length > 0 ? ys.reduce((s, v) => s + v, 0) / ys.length : MARGIN_TOP + CONTENT_H,
    };
  })
  .sort((a, b) => a.key - b.key)
  .map((x) => x.n);
for (const [id, p] of spread(concepts, 'concept')) pos.set(id, p);

// References: barycentre of citing areas, then year, then id.
const refAreas = new Map();
for (const e of edges.filter((e) => e.type === 'citesReference')) {
  if (!refAreas.has(e.target)) refAreas.set(e.target, []);
  refAreas.get(e.target).push(pos.get(e.source).y);
}
const references = corpus.nodes
  .filter((n) => n.kind === 'reference')
  .sort((a, b) => {
    const ya = refAreas.get(a.id).reduce((s, v) => s + v, 0) / refAreas.get(a.id).length;
    const yb = refAreas.get(b.id).reduce((s, v) => s + v, 0) / refAreas.get(b.id).length;
    return ya - yb || a.year - b.year || a.id.localeCompare(b.id);
  });
for (const [id, p] of spread(references, 'reference')) pos.set(id, p);

// Column 0: framework, principles, organisations as a labelled stack.
const framework = corpus.nodes.find((n) => n.kind === 'framework');
const principles = corpus.nodes
  .filter((n) => n.kind === 'principle')
  .sort((a, b) => a.order - b.order);
const organisations = corpus.nodes.filter((n) => n.kind === 'organisation');
const metaStack = [framework, ...principles, ...organisations];
metaStack.forEach((n, i) =>
  pos.set(n.id, { x: COLS.meta.x, y: MARGIN_TOP + 40 + i * 44, col: 'meta' }),
);

// External source lookup: reference id -> url/label.
const refLink = new Map();
for (const e of edges.filter((e) => e.type === 'availableAt')) {
  const src = byId.get(e.target);
  refLink.set(e.source, src);
}

// Area colour for a node, where it has one.
const colourOf = (n) => {
  if (n.kind === 'area') return AREA_COLOURS[n.areaSlug];
  if (n.kind === 'idea' || n.kind === 'insight') return AREA_COLOURS[n.areaSlug];
  if (n.kind === 'reference') {
    const slugs = edges
      .filter((e) => e.type === 'citesReference' && e.target === n.id)
      .map((e) => byId.get(e.source).areaSlug);
    return slugs.length === 1 ? AREA_COLOURS[slugs[0]] : NEUTRAL; // shared refs neutral
  }
  return NEUTRAL;
};

// --- SVG fragments ----------------------------------------------------------

const svg = [];
svg.push(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="itf-title itf-desc" lang="en">`,
);
svg.push(`<title id="itf-title">Inclusive Teaching Framework knowledge graph</title>`);
svg.push(
  `<desc id="itf-desc">Layered graph of the Inclusive Teaching Framework (Ambition Institute, March 2026): the framework, its methodology principles and partner organisations; five areas of pupil need; their underpinning ideas and key insights; the concepts those involve, with concept-to-concept relations; and the cited references, each linking out to its external source. ${corpus.stats.totalNodes} nodes and ${corpus.stats.totalEdges} edges.</desc>`,
);
svg.push(
  `<style>text{font-family:system-ui,-apple-system,'Segoe UI',sans-serif;fill:#111}.lbl{font-size:${FONT}px}.hdr{font-size:15px;font-weight:700}.sub{font-size:11px;fill:#444}a:hover .pill{stroke-width:2.5}a:focus .pill{stroke:#000;stroke-width:3}</style>`,
);
svg.push(`<rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff"/>`);
svg.push(
  `<text x="16" y="34" class="hdr" style="font-size:20px">Inclusive Teaching Framework — knowledge graph</text>`,
);
svg.push(
  `<text x="16" y="56" class="sub">Source: Gilbride, N., &amp; Jackson, J. (2026), Ambition Institute · ${corpus.stats.totalNodes} nodes, ${corpus.stats.totalEdges} edges · generated deterministically from data.json</text>`,
);

for (const [, c] of Object.entries(COLS)) {
  svg.push(`<text x="${c.x}" y="${MARGIN_TOP - 14}" class="hdr">${esc(c.title)}</text>`);
}

const rightOf = (id) => {
  const p = pos.get(id);
  const n = byId.get(id);
  return [p.x + pillW(n), p.y];
};
const leftOf = (id) => {
  const p = pos.get(id);
  return [p.x, p.y];
};
function pillW(n) {
  return COLS[pos.get(n.id).col].w;
}

const bez = (x1, y1, x2, y2, stroke, width, opacity, dash = '', label = '') => {
  const mx = (x1 + x2) / 2;
  const t = label ? `<title>${esc(label)}</title>` : '';
  return `<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} C ${mx.toFixed(1)} ${y1.toFixed(1)}, ${mx.toFixed(1)} ${y2.toFixed(1)}, ${x2.toFixed(1)} ${y2.toFixed(1)}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-opacity="${opacity}"${dash ? ` stroke-dasharray="${dash}"` : ''}>${t}</path>`;
};

// Edge layers (drawn before nodes).
svg.push('<g aria-hidden="true">');
for (const e of edges) {
  const sN = byId.get(e.source);
  const tN = byId.get(e.target);
  if (e.type === 'containsArea') {
    const [x1, y1] = rightOf(e.source);
    const [x2, y2] = leftOf(e.target);
    svg.push(bez(x1, y1, x2, y2, NEUTRAL, 1.4, 0.5));
  } else if (e.type === 'containsIdea' || e.type === 'containsInsight') {
    const [x1, y1] = rightOf(e.source);
    const [x2, y2] = leftOf(e.target);
    svg.push(bez(x1, y1, x2, y2, AREA_COLOURS[sN.areaSlug], 1.2, 0.45));
  } else if (e.type === 'involvesConcept' && sN.kind !== 'framework') {
    const [x1, y1] = rightOf(e.source);
    const [x2, y2] = leftOf(e.target);
    svg.push(bez(x1, y1, x2, y2, AREA_COLOURS[sN.areaSlug] ?? '#888', 0.9, 0.28));
  } else if (e.type === 'citesReference') {
    // area -> reference: route over the concept column, faint.
    const [x1, y1] = rightOf(e.source);
    const [x2, y2] = leftOf(e.target);
    svg.push(bez(x1, y1, x2, y2, AREA_COLOURS[sN.areaSlug], 0.7, 0.16));
  } else if (
    ['reliesOn', 'partOf', 'precedes', 'supports', 'relatedTo'].includes(e.type) &&
    sN.kind === 'concept' &&
    tN.kind === 'concept'
  ) {
    // Arc to the right of the concept column.
    const [x1, y1] = rightOf(e.source);
    const [, y2] = rightOf(e.target);
    const x = COLS.concept.x + COLS.concept.w;
    const bulge = 26 + Math.abs(y2 - y1) / 18;
    const dash = {
      reliesOn: '',
      partOf: '6 3',
      precedes: '2 3',
      supports: '10 4',
      relatedTo: '8 3 2 3',
    }[e.type];
    svg.push(
      `<path d="M ${x} ${y1.toFixed(1)} C ${(x + bulge).toFixed(1)} ${y1.toFixed(1)}, ${(x + bulge).toFixed(1)} ${y2.toFixed(1)}, ${x} ${y2.toFixed(1)}" fill="none" stroke="#333" stroke-width="1.3" stroke-opacity="0.75"${dash ? ` stroke-dasharray="${dash}"` : ''}><title>${esc(`${byId.get(e.source).term} ${e.type} ${tN.term}`)}</title></path>`,
    );
    svg.push(`<circle cx="${x}" cy="${y2.toFixed(1)}" r="2.4" fill="#333"/>`); // arrowhead-substitute at target
  } else if (e.type === 'overlapsWith') {
    const x = COLS.area.x;
    const [, y1] = leftOf(e.source);
    const [, y2] = leftOf(e.target);
    svg.push(
      `<path d="M ${x} ${y1.toFixed(1)} C ${x - 34} ${y1.toFixed(1)}, ${x - 34} ${y2.toFixed(1)}, ${x} ${y2.toFixed(1)}" fill="none" stroke="#555" stroke-width="1.2" stroke-opacity="0.6" stroke-dasharray="4 3"><title>${esc(`${sN.title} overlaps with ${tN.title}`)}</title></path>`,
    );
  }
}
svg.push('</g>');

// Nodes.
const pill = (n, { bold = false } = {}) => {
  const p = pos.get(n.id);
  const w = pillW(n);
  const colour = colourOf(n);
  const label = n.title ?? n.term ?? n.name ?? n.citation ?? n.id;
  const short = truncate(label, w);
  const full =
    n.kind === 'reference'
      ? n.citation
      : `${label}${n.description ? ` — ${n.description}` : n.explanation ? ` — ${n.explanation}` : ''}`;
  const shape = n.kind === 'idea' ? 3 : 10; // ideas squarer, insights/others rounded (shape + colour + position)
  return (
    `<g><rect class="pill" x="${p.x}" y="${(p.y - PILL_H / 2).toFixed(1)}" width="${w}" height="${PILL_H}" rx="${shape}" fill="#ffffff" stroke="${colour}" stroke-width="1.6"/>` +
    `<text class="lbl" x="${p.x + 7}" y="${(p.y + 3.8).toFixed(1)}"${bold ? ' font-weight="700"' : ''}>${esc(short)}</text>` +
    `<title>${esc(full)}</title></g>`
  );
};

for (const a of areas) svg.push(pill(a, { bold: true }));
for (const n of items) svg.push(pill(n));
for (const n of concepts) svg.push(pill(n));
for (const n of metaStack) svg.push(pill(n, { bold: n.kind === 'framework' }));
for (const n of references) {
  const link = refLink.get(n.id);
  const p = pos.get(n.id);
  const body = pill(n).replace('</title></g>', ` — opens ${esc(link.url)}</title></g>`);
  svg.push(
    `<a href="${esc(link.url)}" target="_blank" rel="noopener">${body}<text class="lbl" x="${p.x + pillW(n) - 13}" y="${(p.y + 3.8).toFixed(1)}" aria-hidden="true">↗</text></a>`,
  );
}

// Legend.
const LY = HEIGHT - MARGIN_BOTTOM + 34;
svg.push(`<text x="16" y="${LY - 12}" class="hdr">Legend</text>`);
Object.entries(AREA_COLOURS).forEach(([slug, colour], i) => {
  const x = 16 + i * 250;
  svg.push(
    `<rect x="${x}" y="${LY}" width="16" height="14" rx="4" fill="#fff" stroke="${colour}" stroke-width="1.6"/><text class="lbl" x="${x + 22}" y="${LY + 11}">${esc(areas[i].title)}</text>`,
  );
});
const dashes = [
  ['reliesOn', ''],
  ['partOf', '6 3'],
  ['precedes', '2 3'],
  ['supports', '10 4'],
  ['relatedTo', '8 3 2 3'],
];
dashes.forEach(([name, dash], i) => {
  const x = 16 + i * 250;
  svg.push(
    `<line x1="${x}" y1="${LY + 34}" x2="${x + 40}" y2="${LY + 34}" stroke="#333" stroke-width="1.6"${dash ? ` stroke-dasharray="${dash}"` : ''}/><text class="lbl" x="${x + 48}" y="${LY + 38}">${name} (concept → concept)</text>`,
  );
});
svg.push(
  `<text class="sub" x="16" y="${LY + 62}">Ideas have square corners; insights and other nodes are rounded. Reference pills link to their external source (↗): DOI resolver, verified publisher page, or a search link. Area→reference fans are faint by design; hover any element for its full text.</text>`,
);

svg.push('</svg>');

writeFileSync(join(DIR, 'graph.svg'), `${svg.join('\n')}\n`);
console.log(`Wrote ${join(DIR, 'graph.svg')} (${WIDTH}x${HEIGHT})`);
