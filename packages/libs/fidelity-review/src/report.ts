/*
 * Pure renderer for the fidelity report: pair results + the disposition
 * register in, one self-contained zero-JS HTML document out. The report is
 * the review surface — side-by-side export | live | diff per pair, the
 * recorded judgments beside them, and a copy-ready register snippet for
 * anything not yet judged. It is itself a rendered UI held to the org
 * accessibility mandate (WCAG 2.2 AA). The jest-axe test proves the
 * fragment-level rules (18 run under div-mounting); page-level rules
 * (lang, title, landmarks, contrast) are outside its reach and were
 * verified by a browser-level axe run at review time — do not read the
 * unit test as the whole proof.
 *
 * File IO stays in the orchestrator: this module never touches disk.
 */
import type { FidelityPair, PairingMap } from './pairing-types';
import { entriesForPair, newEntryTemplate, type FidelityRegister } from './register';
import { escapeHtml, fromReportDir } from './fidelity-html';
import { exemptSection, globalEntriesSection, orphanedEntries } from './fidelity-report-sections';

interface Dimensions {
  readonly width: number;
  readonly height: number;
}

interface PairDiffSummary {
  readonly changedRatio: number;
  /** Filename of the diff PNG, resolved relative to the report directory. */
  readonly diffPngName: string;
  readonly exportDims: Dimensions;
  readonly liveDims: Dimensions;
  readonly croppedTo: Dimensions;
  readonly caveats: readonly string[];
}

export interface PairResult {
  readonly pair: FidelityPair;
  readonly status: 'diffed' | 'reference-only' | 'missing-evidence';
  readonly diff?: PairDiffSummary;
  /** Evidence paths that were not found on disk. */
  readonly missing?: readonly string[];
}

/** How the run reached (or did not reach) the app server. */
export type ServerMode = 'attached' | 'spawned' | 'report-only';

export interface RunMeta {
  readonly base: string;
  readonly widthCssPx: number;
  readonly deviceScaleFactor: number;
  /** `report-only` states honestly that no server was contacted and the
   *  evidence PNGs are whatever the last capture run left on disk. */
  readonly serverMode: ServerMode;
  readonly generatedAt: string;
}

function ratioLabel(result: PairResult): string {
  if (result.status === 'reference-only') {
    return 'n/a — reference only';
  }
  if (result.status === 'missing-evidence' || result.diff === undefined) {
    return 'n/a — missing evidence';
  }
  return `${(result.diff.changedRatio * 100).toFixed(2)}%`;
}

function summaryTable(results: readonly PairResult[]): string {
  const rows = results
    .map(
      (result) => `<tr>
  <td><a href="#pair-${escapeHtml(result.pair.id)}">${escapeHtml(result.pair.id)}</a></td>
  <td>${escapeHtml(result.pair.kind)}</td>
  <td>${escapeHtml(ratioLabel(result))}</td>
</tr>`,
    )
    .join('\n');
  return `<table>
<caption>Pair summary — changed-pixel ratio is a triage signal, never a verdict</caption>
<thead><tr><th scope="col">Pair</th><th scope="col">Kind</th><th scope="col">Changed</th></tr></thead>
<tbody>
${rows}
</tbody>
</table>`;
}

function figure(src: string, alt: string, caption: string): string {
  return `<figure>
  <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" loading="lazy" />
  <figcaption>${escapeHtml(caption)}</figcaption>
</figure>`;
}

function pairFigures(result: PairResult): string {
  const { pair } = result;
  const figures = [
    figure(
      fromReportDir(pair.exportPng),
      `Canonical export evidence for ${pair.id}`,
      'Canonical export',
    ),
    figure(fromReportDir(pair.livePng), `Live demo capture for ${pair.id}`, 'Live demo'),
  ];
  if (result.diff !== undefined) {
    figures.push(
      figure(
        result.diff.diffPngName,
        `Changed pixels between export and live for ${pair.id}`,
        'Perceptual diff (changed pixels highlighted)',
      ),
    );
  }
  return figures.join('\n');
}

function pairMeta(result: PairResult): string {
  const items: string[] = [
    `<li>Live route: <code>${escapeHtml(result.pair.liveRoute)}</code></li>`,
  ];
  if (result.pair.notes !== undefined) {
    items.push(`<li>Notes: ${escapeHtml(result.pair.notes)}</li>`);
  }
  if (result.diff !== undefined) {
    const { exportDims, liveDims, croppedTo, caveats } = result.diff;
    // Number() at each interpolation is the library-boundary sanitiser:
    // identity for the declared number types, a hard coercion for any
    // consumer that lies through the structural type (and the taint
    // barrier CodeQL's html-constructed-from-input model recognises).
    items.push(
      `<li>Export ${Number(exportDims.width)}×${Number(exportDims.height)}px, live ${Number(liveDims.width)}×${Number(liveDims.height)}px, compared over ${Number(croppedTo.width)}×${Number(croppedTo.height)}px</li>`,
    );
    for (const caveat of caveats) {
      items.push(`<li>Caveat: <code>${escapeHtml(caveat)}</code></li>`);
    }
  }
  if (result.status === 'missing-evidence') {
    const missing = (result.missing ?? []).map((path) => escapeHtml(path)).join(', ');
    items.push(`<li><strong>missing evidence:</strong> ${missing}</li>`);
  }
  return `<ul>${items.join('\n')}</ul>`;
}

function dispositionBlock(result: PairResult, register: FidelityRegister, date: string): string {
  const entries = entriesForPair(register, result.pair.id);
  if (entries.length === 0) {
    const template = JSON.stringify(newEntryTemplate(result.pair.id, date), null, 2);
    // tabindex="0": the template overflows horizontally at narrow widths
    // and `pre { overflow-x: auto }` makes it a scrollable region — without
    // a tabstop a keyboard-only reviewer cannot scroll it (WCAG 2.1.1; not
    // every browser makes scrollers focusable). The region role + per-pair
    // label keep the tabstop meaningful to a screen reader.
    return `<p>No register entry yet. Judge the pair, then add to <code>fidelity-register.json</code>:</p>
<pre tabindex="0" role="region" aria-label="Register entry template for ${escapeHtml(result.pair.id)}"><code>${escapeHtml(template)}</code></pre>`;
  }
  const rendered = entries
    .map(
      (entry) => `<li>
  <strong>[${escapeHtml(entry.disposition)}]</strong> ${escapeHtml(entry.summary)}
  <br />Rationale: ${escapeHtml(entry.rationale)}
  <br /><small>${escapeHtml(entry.id)} — ${escapeHtml(entry.author)}, ${escapeHtml(entry.date)}</small>
</li>`,
    )
    .join('\n');
  return `<ul>${rendered}</ul>`;
}

function pairSection(result: PairResult, register: FidelityRegister, date: string): string {
  return `<section id="pair-${escapeHtml(result.pair.id)}">
<h2>${escapeHtml(result.pair.id)}</h2>
${pairMeta(result)}
<div class="figures">
${pairFigures(result)}
</div>
<h3>Dispositions</h3>
${dispositionBlock(result, register, date)}
</section>`;
}

const REPORT_CSS = `
  body { font-family: system-ui, sans-serif; margin: 1rem auto; max-width: 90rem; padding: 0 1rem; color: #1a1a1a; background: #ffffff; }
  a { color: #0b4a91; }
  a:focus-visible, summary:focus-visible { outline: 3px solid #0b4a91; outline-offset: 2px; }
  table { border-collapse: collapse; }
  th, td { border: 1px solid #555555; padding: 0.4rem 0.8rem; text-align: left; }
  .figures { display: flex; flex-wrap: wrap; gap: 1rem; }
  figure { margin: 0; max-width: 30%; min-width: 18rem; }
  img { max-width: 100%; height: auto; border: 1px solid #555555; }
  pre { background: #f2f2f2; padding: 1rem; overflow-x: auto; }
  .skip-link { position: absolute; left: -999px; }
  .skip-link:focus { position: static; }
`;

/** Render the whole report document body (wrapped in a minimal page shell).
 *  The pairing map is a required parameter — this module renders plain data
 *  and never imports the declared configuration, so its tests build wholly
 *  literal fixtures. */
export function renderReportHtml(
  results: readonly PairResult[],
  register: FidelityRegister,
  meta: RunMeta,
  map: PairingMap,
): string {
  const date = meta.generatedAt.slice(0, 10);
  const sections = results.map((result) => pairSection(result, register, date)).join('\n');
  const exempt = exemptSection(map);
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Fidelity review — canonical export vs live demo</title>
<style>${REPORT_CSS}</style>
</head>
<body>
<a class="skip-link" href="#summary">Skip to summary</a>
<main>
<h1>Fidelity review — canonical export vs live demo</h1>
<p>Generated ${escapeHtml(meta.generatedAt)} against ${escapeHtml(meta.base)} at ${Number(meta.widthCssPx)} CSS px (scale ${Number(meta.deviceScaleFactor)}, server ${escapeHtml(meta.serverMode)}${meta.serverMode === 'report-only' ? ' — no capture ran; evidence is from the last capture run' : ''}). Ratios triage; judgments live in <code>fidelity-register.json</code>.</p>
<section id="summary">
<h2>Summary</h2>
${summaryTable(results)}
</section>
${sections}
${globalEntriesSection(register)}
${orphanedEntries(new Set(results.map((result) => result.pair.id)), register)}
${exempt}
</main>
</body>
</html>`;
}
