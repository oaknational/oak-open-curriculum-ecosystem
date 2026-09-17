// @vitest-environment happy-dom
/// <reference lib="dom" />
/* The package suite runs under the base node environment; this file alone
 * needs a DOM (runtime via the pragma above, types via the lib reference)
 * because the renderer's output carries a WCAG 2.2 AA claim proven with
 * jest-axe against the parsed document. KNOWN SCOPE: a lib reference is
 * program-wide (lib files declare globals), so lint/type-check would not
 * catch a src module reaching for a DOM global — the build program
 * (tsconfig.build.json excludes tests, so no DOM lib) rejects it, and CI
 * runs the build as its own job. */
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, expect, it } from 'vitest';

expect.extend(toHaveNoViolations);

import type { FidelityPair, PairingMap } from './pairing-types';
import type { FidelityRegister } from './register';
import { renderReportHtml, type PairResult, type RunMeta } from './report';

// Wholly literal fixtures: the renderer takes plain data, so nothing here
// derives from the declared pairing map — a reorder or re-declaration of
// the live configuration cannot move these tests. Literal fixtures need no
// live brand slug, so the naming ratchet is untouched.

const META: RunMeta = {
  base: 'http://localhost:3020',
  widthCssPx: 1440,
  deviceScaleFactor: 2,
  serverMode: 'attached',
  generatedAt: '2026-08-09T12:00:00Z',
};

const FOLD_PAIR = {
  id: 'picker-oak-fold',
  kind: 'page-abovefold',
  diffEligible: true,
  exportPng: 'demo-evidence/export-picker-oak-fold.png',
  livePng: 'demo-evidence/live-picker-oak-fold.png',
  liveRoute: '/specimen',
} satisfies FidelityPair;

const FULL_PAIR = {
  id: 'picker-oak-full',
  kind: 'page-fullpage',
  diffEligible: true,
  exportPng: 'demo-evidence/export-picker-oak-full.png',
  livePng: 'demo-evidence/live-picker-oak-full.png',
  liveRoute: '/specimen',
  notes: 'contains <script> unsafe & chars',
} satisfies FidelityPair;

const CHROME_PAIR = {
  id: 'picker-chrome',
  kind: 'reference-only',
  diffEligible: false,
  exportPng: 'demo-evidence/export-picker-chrome.png',
  livePng: 'demo-evidence/live-picker-chrome.png',
  liveRoute: '/switchboard',
} satisfies FidelityPair;

// The boundary type carries only what the renderer reads (exempt
// surfaces); per-pair data reaches it inside each PairResult.
const MAP = {
  exemptSurfaces: [{ route: '/', reason: 'owner-rejected surface; judged elsewhere' }],
} satisfies PairingMap;

const RESULTS: readonly PairResult[] = [
  {
    pair: FOLD_PAIR,
    status: 'diffed',
    diff: {
      changedRatio: 0.0123,
      diffPngName: 'diff-picker-oak-fold.png',
      exportDims: { width: 2880, height: 2000 },
      liveDims: { width: 2880, height: 2000 },
      croppedTo: { width: 2880, height: 2000 },
      caveats: [],
    },
  },
  {
    pair: FULL_PAIR,
    status: 'diffed',
    diff: {
      changedRatio: 0.4,
      diffPngName: 'diff-picker-oak-full.png',
      exportDims: { width: 2880, height: 9000 },
      liveDims: { width: 2880, height: 7000 },
      croppedTo: { width: 2880, height: 7000 },
      caveats: ['height-mismatch:-2000px'],
    },
  },
  { pair: CHROME_PAIR, status: 'missing-evidence', missing: [CHROME_PAIR.livePng] },
];

const REGISTER = {
  version: 1,
  entries: [
    {
      id: 'picker-oak-fold/known-divergence',
      pairId: 'picker-oak-fold',
      kind: 'feature',
      summary: 'A recorded judgment.',
      evidence: ['demo-evidence/live-picker-oak-fold.png'],
      disposition: 'deliberate',
      rationale: 'Ratified.',
      author: 'design-lane',
      date: '2026-08-09',
    },
    {
      id: 'global/token-source-convergence',
      pairId: 'global',
      kind: 'visual',
      summary: 'Token-source convergence shifts values on every pair.',
      evidence: ['demo-evidence/live-picker-oak-fold.png'],
      disposition: 'deliberate',
      rationale: 'Ratified (ADR-213).',
      author: 'design-lane',
      date: '2026-08-09',
    },
    {
      id: 'gone-pair/old-finding',
      pairId: 'gone-pair',
      kind: 'visual',
      summary: 'Entry whose pair no longer exists.',
      evidence: ['demo-evidence/old.png'],
      disposition: 'matched',
      rationale: 'From an earlier export.',
      author: 'design-lane',
      date: '2026-08-01',
    },
  ],
} satisfies FidelityRegister;

describe('renderReportHtml', () => {
  const html = renderReportHtml(RESULTS, REGISTER, META, MAP);

  it('makes the copy-ready template keyboard-operable — a scrollable pre carries a labelled tabstop', () => {
    // The template pre scrolls horizontally at narrow widths; without
    // tabindex a keyboard-only reviewer cannot scroll it (WCAG 2.1.1).
    expect(html).toContain('<pre tabindex="0" role="region"');
    expect(html).toContain('aria-label="Register entry template for picker-oak-full"');
  });

  it('states a report-only run in the meta line, and only then', () => {
    const reportOnlyHtml = renderReportHtml(
      RESULTS,
      REGISTER,
      { ...META, serverMode: 'report-only' },
      MAP,
    );

    expect(reportOnlyHtml).toContain('no capture ran; evidence is from the last capture run');
    expect(html).not.toContain('no capture ran');
  });

  it('renders every pair with its status and any caveats', () => {
    expect(html).toContain('picker-oak-fold');
    expect(html).toContain('height-mismatch:-2000px');
    expect(html).toContain('missing evidence');
  });

  it('escapes data-carried markup instead of injecting it', () => {
    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
  });

  it('renders recorded dispositions and a copy-ready template for unregistered pairs', () => {
    expect(html).toContain('deliberate');
    expect(html).toContain('A recorded judgment.');
    expect(html).toContain('describe-the-finding');
  });

  it('surfaces register entries whose pair no longer exists as superseded candidates', () => {
    expect(html).toContain('gone-pair/old-finding');
    expect(html).toContain('superseded');
  });

  it('lists the exempt surfaces with reasons', () => {
    expect(html).toContain('owner-rejected surface; judged elsewhere');
  });

  it('references live evidence relative to the report directory', () => {
    expect(html).toContain('src="../../demo-evidence/live-picker-oak-fold.png"');
    expect(html).toContain('src="diff-picker-oak-fold.png"');
  });

  it('has no axe violations', async () => {
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.append(container);

    expect(await axe(container)).toHaveNoViolations();

    container.remove();
  });
});

describe('renderReportHtml global scope', () => {
  const html = renderReportHtml(RESULTS, REGISTER, META, MAP);

  it('renders global-scope judgments in their own section, never as orphans', () => {
    expect(html).toContain('Global judgments (apply to every pair)');
    expect(html).toContain('global/token-source-convergence');
    expect(html).not.toContain(
      'global/token-source-convergence</code> — its pair no longer exists',
    );
  });
});
