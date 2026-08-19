import { describe, expect, it } from 'vitest';

import { composeDriveRunReport } from '../../src/mcp-conformance/drive-cli.js';
import {
  PLACEHOLDER_PREAMBLE,
  renderReviewerPack,
  reviewerPackPreambleSchema,
} from '../../src/mcp-conformance/render-reviewer-pack.js';
import { type DriveOutcome } from '../../src/mcp-conformance/drive.js';

const TARGET = 'https://curriculum-mcp-alpha.oaknational.dev/mcp';

// The pack's outward-facing sentences are OWNER-GATED copy: the renderer
// takes them as inputs and never authors them.
const PREAMBLE = {
  connectionNote: 'CONNECTION-NOTE-PLACEHOLDER',
  credentialsNote: 'CREDENTIALS-NOTE-PLACEHOLDER',
  sameDataNote: 'SAME-DATA-NOTE-PLACEHOLDER',
};

const PROVENANCE = {
  generatedAt: '2026-07-28T15:37:00.000Z',
  vendorCliVersion: '3.15.2',
  reportDir: 'tmp/mcp-conformance/live-drive-20260728T1537Z',
};

const OUTCOME: DriveOutcome = {
  witnesses: [
    {
      toolName: 'get-curriculum-model',
      args: {},
      outcome: 'called-ok',
      detail: '',
    },
    {
      toolName: 'download-asset',
      args: { lesson: 'adding-fractions-with-the-same-denominator', type: 'slideDeck' },
      outcome: 'called-ok',
      detail: '',
    },
    {
      toolName: 'get-keyword-graph',
      args: undefined,
      outcome: 'no-example',
      detail: 'required property "subject" advertises no example',
    },
  ],
};

describe('renderReviewerPack — the walkthrough is a traceable projection of one drive run', () => {
  it('carries the target, every preamble input verbatim, and one section per witness', () => {
    const pack = renderReviewerPack({
      target: TARGET,
      preamble: PREAMBLE,
      outcome: OUTCOME,
      provenance: PROVENANCE,
    });
    expect(pack).toContain(TARGET);
    expect(pack).toContain('CONNECTION-NOTE-PLACEHOLDER');
    expect(pack).toContain('CREDENTIALS-NOTE-PLACEHOLDER');
    expect(pack).toContain('SAME-DATA-NOTE-PLACEHOLDER');
    expect(pack).toContain('### get-curriculum-model');
    expect(pack).toContain('### download-asset');
    expect(pack).toContain('### get-keyword-graph');
  });

  it('redacts a credential carried in the target — the pack is a shareable document', () => {
    // The validator refuses credential-bearing targets it can parse; this is
    // the belt for one it could not, which still reaches the pack header.
    const pack = renderReviewerPack({
      target: 'ht!tp://user:s3cret@mcp.example.test/mcp',
      preamble: PREAMBLE,
      outcome: OUTCOME,
      provenance: PROVENANCE,
    });
    expect(pack).not.toContain('s3cret');
    expect(pack).toContain('//[redacted]@mcp.example.test/mcp');
  });

  it('names its own provenance: when it ran, with what instrument, and where the evidence lives', () => {
    const pack = renderReviewerPack({
      target: TARGET,
      preamble: PREAMBLE,
      outcome: OUTCOME,
      provenance: PROVENANCE,
    });
    expect(pack).toContain('2026-07-28T15:37:00.000Z');
    expect(pack).toContain('3.15.2');
    expect(pack).toContain('tmp/mcp-conformance/live-drive-20260728T1537Z');
  });

  it('shows the exact invocation arguments a reviewer should send', () => {
    const pack = renderReviewerPack({
      target: TARGET,
      preamble: PREAMBLE,
      outcome: OUTCOME,
      provenance: PROVENANCE,
    });
    expect(pack).toContain('"lesson": "adding-fractions-with-the-same-denominator"');
    expect(pack).toContain('"type": "slideDeck"');
  });

  it('counts honestly and keeps failures loud — an unexercised tool is named, never hidden', () => {
    const pack = renderReviewerPack({
      target: TARGET,
      preamble: PREAMBLE,
      outcome: OUTCOME,
      provenance: PROVENANCE,
    });
    expect(pack).toContain('2 of 3 tools exercised');
    expect(pack).toContain('NOT exercised');
    expect(pack).toContain('required property "subject" advertises no example');
  });

  it('a list failure renders as the pack-level failure, with no tool sections', () => {
    const pack = renderReviewerPack({
      target: TARGET,
      preamble: PREAMBLE,
      outcome: { listFailure: 'tools/list could not be obtained: HTTP 401', witnesses: [] },
      provenance: PROVENANCE,
    });
    expect(pack).toContain('HTTP 401');
    expect(pack).not.toContain('### ');
  });

  it('a pack rendered with the shipped placeholders is unmistakably a draft', () => {
    // The owner gate itself: if PLACEHOLDER_PREAMBLE ever softens into
    // plausible prose, a preamble-less run reads as finished copy and could
    // ship. Each shipped placeholder must stay loudly bracketed.
    const pack = renderReviewerPack({
      target: TARGET,
      preamble: PLACEHOLDER_PREAMBLE,
      outcome: OUTCOME,
      provenance: PROVENANCE,
    });
    const placeholderMarkers = pack.match(/\[[^\]]*owner-approved copy pending\]/gu) ?? [];
    expect(placeholderMarkers.length).toBe(3);
  });
});

describe('reviewerPackPreambleSchema — the preamble file boundary refuses quiet mistakes', () => {
  it('accepts exactly the three named notes', () => {
    expect(reviewerPackPreambleSchema.safeParse(PREAMBLE).success).toBe(true);
  });

  it('refuses an unknown key — a mistyped note name must never silently leave a placeholder in', () => {
    const result = reviewerPackPreambleSchema.safeParse({
      ...PREAMBLE,
      credentialNote: 'typo: singular',
    });
    expect(result.success).toBe(false);
  });

  it('refuses an empty note — a blank owner sentence must never validate as supplied copy', () => {
    const result = reviewerPackPreambleSchema.safeParse({ ...PREAMBLE, sameDataNote: '' });
    expect(result.success).toBe(false);
  });

  it('refuses a whitespace-only note — visually blank copy is blank copy', () => {
    const result = reviewerPackPreambleSchema.safeParse({ ...PREAMBLE, connectionNote: '   ' });
    expect(result.success).toBe(false);
  });
});

describe('composeDriveRunReport — the drive JSON report redacts its target', () => {
  it('carries a clean target verbatim', () => {
    expect(composeDriveRunReport(TARGET, OUTCOME).target).toBe(TARGET);
  });

  it('masks a credential in the target — the report rides to stdout and summary.json', () => {
    const report = composeDriveRunReport('https://h/mcp?access_token=ya29.SECRET', OUTCOME);

    expect(report.target).not.toContain('ya29.SECRET');
    expect(report.target).toBe('https://h/mcp?access_token=[redacted]');
    expect(report.operation).toBe('drive');
  });
});
