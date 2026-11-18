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

import { describeUnreadable, isScannableContent, isScannablePath } from './tracked-file-scan.js';

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

describe('describeUnreadable', () => {
  // The refusal reaches CI logs, so it names the tracked path relative to the
  // repository and the error's code, never the cause's own message (which
  // carries the working copy's absolute path).
  it('names the relative path and the errno code, never the cause message', () => {
    const cause = Object.assign(
      new Error("EACCES: permission denied, open '/checkout/repo/x.md'"),
      {
        code: 'EACCES',
      },
    );
    const text = describeUnreadable({ relativePath: 'x.md', cause });
    expect(text).toContain("cannot read tracked file 'x.md'");
    expect(text).toContain('(EACCES)');
    expect(text).not.toContain('/checkout/repo');
  });

  it.each([
    { label: 'an error without a code', cause: new RangeError('why') },
    {
      label: 'an error whose code is not shaped as one',
      cause: Object.assign(new Error('denied'), { code: "EACCES '/checkout/repo/x.md'" }),
    },
    { label: 'a thrown non-error', cause: 'boom' },
  ])('names $label as unknown, never its message or code text', ({ cause }) => {
    const text = describeUnreadable({ relativePath: 'x.md', cause });
    expect(text).toContain("cannot read tracked file 'x.md'");
    expect(text).toContain('(unknown)');
    expect(text).not.toContain('/checkout/repo');
  });
});
