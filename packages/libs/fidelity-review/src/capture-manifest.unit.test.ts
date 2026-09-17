import { describe, expect, it } from 'vitest';

import {
  CaptureManifestSchema,
  contentHashOf,
  isPromotableTarget,
  reconcileCohort,
  sideProvenance,
  type CaptureManifest,
  type ExpectedPair,
} from './capture-manifest';

const HASH = contentHashOf(Buffer.from('evidence-bytes'));

const PAIRS: readonly ExpectedPair[] = [
  {
    id: 'picker-oak-fold',
    exportPng: 'demo-evidence/export-picker-oak-fold.png',
    livePng: 'demo-evidence/live-picker-oak-fold.png',
  },
];

function entryOf(relativePath: string, widthCssPx = 1440): CaptureManifest['entries'][number] {
  return { relativePath, widthCssPx, deviceScaleFactor: 2, contentHash: HASH };
}

const COMPLETE: CaptureManifest = {
  version: 1,
  base: 'http://localhost:3020',
  startedAt: '2026-08-09T17:00:00Z',
  promotedAt: '2026-08-09T17:03:00Z',
  entries: [
    entryOf('demo-evidence/export-picker-oak-fold.png'),
    entryOf('demo-evidence/live-picker-oak-fold.png'),
  ],
};

describe('provenance derivation', () => {
  it('derives captured-vs-vendor from the declared path — the path IS the declaration', () => {
    expect(sideProvenance('demo-evidence/live-x.png')).toBe('captured');
    expect(sideProvenance('claude-design-canonical-export/screenshots/coursemap.png')).toBe(
      'vendor',
    );
  });

  it('bounds promotion to demo-evidence/ so the vendor tree is untouchable by construction', () => {
    expect(isPromotableTarget('demo-evidence/export-x.png')).toBe(true);
    expect(isPromotableTarget('claude-design-canonical-export/screenshots/x.png')).toBe(false);
    expect(isPromotableTarget('src/anything.png')).toBe(false);
  });
});

describe('CaptureManifestSchema', () => {
  it('parses a complete manifest and rejects an unknown key', () => {
    expect(CaptureManifestSchema.safeParse(COMPLETE).success).toBe(true);
    expect(CaptureManifestSchema.safeParse({ ...COMPLETE, extra: true }).success).toBe(false);
  });

  it('rejects duplicate entries for one path — one capture, one record', () => {
    const outcome = CaptureManifestSchema.safeParse({
      ...COMPLETE,
      entries: [entryOf('demo-evidence/a.png'), entryOf('demo-evidence/a.png')],
    });

    expect(outcome.success).toBe(false);
  });

  it('rejects a malformed content hash', () => {
    const outcome = CaptureManifestSchema.safeParse({
      ...COMPLETE,
      entries: [{ ...entryOf('demo-evidence/a.png'), contentHash: 'not-a-hash' }],
    });

    expect(outcome.success).toBe(false);
  });
});

describe('reconcileCohort', () => {
  it('accepts a complete matching cohort and derives the report meta from the MANIFEST', () => {
    const outcome = reconcileCohort(COMPLETE, PAIRS);

    expect(outcome.ok ? outcome.value : outcome.error).toEqual({
      base: 'http://localhost:3020',
      widthCssPx: 1440,
      deviceScaleFactor: 2,
      promotedAt: '2026-08-09T17:03:00Z',
    });
  });

  it('refuses an incomplete cohort — a declared captured side with no manifest entry', () => {
    const outcome = reconcileCohort(
      { ...COMPLETE, entries: [entryOf('demo-evidence/export-picker-oak-fold.png')] },
      PAIRS,
    );

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('incomplete');
  });

  it('accepts a vendor-supplied side ABSENT from the manifest (reference-only pairs)', () => {
    const vendorPairs: readonly ExpectedPair[] = [
      {
        id: 'ref-coursemap',
        exportPng: 'claude-design-canonical-export/screenshots/coursemap.png',
        livePng: 'demo-evidence/live-picker-oak-fold.png',
      },
    ];

    const outcome = reconcileCohort(
      { ...COMPLETE, entries: [entryOf('demo-evidence/live-picker-oak-fold.png')] },
      vendorPairs,
    );

    expect(outcome.ok).toBe(true);
  });

  it('refuses a manifest that CLAIMS a capture at a vendor path', () => {
    const vendorPairs: readonly ExpectedPair[] = [
      {
        id: 'ref-coursemap',
        exportPng: 'claude-design-canonical-export/screenshots/coursemap.png',
        livePng: 'demo-evidence/live-picker-oak-fold.png',
      },
    ];

    const outcome = reconcileCohort(
      {
        ...COMPLETE,
        entries: [
          entryOf('demo-evidence/live-picker-oak-fold.png'),
          entryOf('claude-design-canonical-export/screenshots/coursemap.png'),
        ],
      },
      vendorPairs,
    );

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('vendor');
  });

  it('refuses a manifest naming a path no declared pair uses — map drift', () => {
    const outcome = reconcileCohort(
      { ...COMPLETE, entries: [...COMPLETE.entries, entryOf('demo-evidence/stale-old-pair.png')] },
      PAIRS,
    );

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('no declared pair');
  });

  it('refuses mixed geometry — evidence at two widths is not comparable', () => {
    const outcome = reconcileCohort(
      {
        ...COMPLETE,
        entries: [
          entryOf('demo-evidence/export-picker-oak-fold.png', 1440),
          entryOf('demo-evidence/live-picker-oak-fold.png', 1280),
        ],
      },
      PAIRS,
    );

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('mixed geometry');
  });

  it('refuses a hand-built manifest with no entries at the type boundary', () => {
    const outcome = reconcileCohort({ ...COMPLETE, entries: [] }, []);

    expect(outcome.ok).toBe(false);
  });
});

describe('contentHashOf', () => {
  it('is a pure function of the bytes — same bytes, same hash; different bytes, different hash', () => {
    expect(contentHashOf(Buffer.from('a'))).toBe(contentHashOf(Buffer.from('a')));
    expect(contentHashOf(Buffer.from('a'))).not.toBe(contentHashOf(Buffer.from('b')));
    expect(contentHashOf(Buffer.from('a'))).toMatch(/^[0-9a-f]{64}$/);
  });
});
