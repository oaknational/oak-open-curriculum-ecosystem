/**
 * Per-file comparison for skill carriage: bytes first, executable bit
 * second, with seam read failures surfacing as refusals rather than
 * verdicts (a comparison that could not fully observe both sides must
 * say so — review round 3, 2026-08-11).
 */
import { join } from 'node:path';

import type { CarriageReadFs } from './carriage-fs.js';

export type CarriedFileVerdict =
  | { readonly kind: 'clean' }
  | { readonly kind: 'missing'; readonly path: string }
  | { readonly kind: 'drifted'; readonly path: string }
  | { readonly kind: 'refused'; readonly message: string };

export async function compareCarriedFile(
  canonicalDir: string,
  adapterDir: string,
  relativePath: string,
  fs: CarriageReadFs,
): Promise<CarriedFileVerdict> {
  const targetPath = join(adapterDir, relativePath);
  const expected = await fs.readFileBytesOrUndefined(join(canonicalDir, relativePath));
  const actual = await fs.readFileBytesOrUndefined(targetPath);
  if (expected.kind === 'failure') {
    return { kind: 'refused', message: expected.message };
  }
  if (actual.kind === 'failure') {
    return { kind: 'refused', message: actual.message };
  }
  if (actual.value === undefined) {
    return { kind: 'missing', path: targetPath };
  }
  if (expected.value === undefined || !bytesEqual(expected.value, actual.value)) {
    return { kind: 'drifted', path: targetPath };
  }
  return compareExecutableBit(join(canonicalDir, relativePath), targetPath, fs);
}

async function compareExecutableBit(
  canonicalPath: string,
  targetPath: string,
  fs: CarriageReadFs,
): Promise<CarriedFileVerdict> {
  const expected = await fs.isExecutableOrUndefined(canonicalPath);
  const actual = await fs.isExecutableOrUndefined(targetPath);
  if (expected.kind === 'failure') {
    return { kind: 'refused', message: expected.message };
  }
  if (actual.kind === 'failure') {
    return { kind: 'refused', message: actual.message };
  }
  const differs =
    expected.value !== undefined && actual.value !== undefined && expected.value !== actual.value;
  return differs ? { kind: 'drifted', path: targetPath } : { kind: 'clean' };
}

function bytesEqual(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) {
    return false;
  }
  return left.every((byte, index) => byte === right[index]);
}
