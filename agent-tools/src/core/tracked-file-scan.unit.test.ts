/**
 * Unit tests for the tracked-file scan's PURE admission decisions.
 *
 * @remarks
 * The skip policy is the security-critical half of two whole-tree gates: a
 * path or content wrongly skipped is a hole in both. The policy is pure, so it
 * is proved here over literal inputs (no real IO in unit tests — ADR-078).
 * The thin fs wrappers around it (`readScanFiles`'s unreadable-file refusal,
 * `readLinkTextOrFile`'s readlink-first symlink handling) are exercised by the
 * two validators' end-to-end runs in `repo-validators:check` over the real
 * tracked tree — which includes a tracked symlink — per the EX44 split:
 * pure classifier unit-tested, walker proven by its standing runs.
 */

import { describe, expect, it } from 'vitest';

import { isScannableContent, isScannablePath } from './tracked-file-scan.js';

describe('isScannablePath', () => {
  it('admits ordinary text paths', () => {
    expect(isScannablePath('docs/notes.md')).toBe(true);
    expect(isScannablePath('agent-tools/src/index.ts')).toBe(true);
  });

  it('skips binary extensions — a binary-named path carries no scannable text', () => {
    expect(isScannablePath('assets/logo.png')).toBe(false);
    expect(isScannablePath('fonts/lexend.woff2')).toBe(false);
  });

  it('skips the generated-file list by basename wherever it sits', () => {
    expect(isScannablePath('pnpm-lock.yaml')).toBe(false);
    expect(isScannablePath('nested/dir/pnpm-lock.yaml')).toBe(false);
  });

  it('admits SVG — it is plain text and can carry a forbidden string', () => {
    expect(isScannablePath('icon.svg')).toBe(true);
  });
});

describe('isScannableContent', () => {
  it('admits ordinary text', () => {
    expect(isScannableContent('scannable prose')).toBe(true);
  });

  it('rejects NUL-bearing content — binary that slipped past the extension policy', () => {
    expect(isScannableContent('binary\u0000payload')).toBe(false);
  });
});
