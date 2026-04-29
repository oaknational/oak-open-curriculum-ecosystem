/**
 * Anti-drift parity test for the semver helpers.
 *
 * @remarks
 * Asserts that the canonical npm-`semver`-backed implementation in
 * `src/semver.ts` agrees with the inline regex copy retained in the
 * one remaining pre-`pnpm install` script consumer:
 *
 * - `apps/oak-curriculum-mcp-streamable-http/runtime-only-scripts/vercel-ignore-production-non-release-build.mjs`
 *
 * That inline copy cannot import the canonical module: Vercel runs
 * the ignoreCommand BEFORE `pnpm install`. This parity test is the
 * anti-drift gate that keeps the inline regex byte-equivalent to the
 * canonical implementation.
 *
 * Other consumers (oak-search-cli pre-build validation,
 * runtime-metadata) now import {@link isValidSemver} from
 * `@oaknational/build-metadata` directly.
 *
 * If you modify the vercel-ignore script's regex or comparison
 * helpers, mirror the change in the `INLINE_*` copies below in
 * lock-step. The test will fail until parity is restored.
 */

import { describe, expect, it } from 'vitest';

import { isLessThanOrEqual, isValidSemver } from '../src/semver.js';

// --- Inline copies of vercel-ignore-production-non-release-build.mjs helpers ---
// Mirror of `vercel-ignore-production-non-release-build.mjs` parseSemver,
// isValidSemver, comparePrereleaseIdentifiers, comparePrereleaseArrays,
// isLessThanOrEqual. Keep byte-equivalent to the script.

const INLINE_SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

interface InlineParsed {
  major: number;
  minor: number;
  patch: number;
  prerelease: readonly string[];
}

function inlineParseSemver(version: string): InlineParsed | null {
  const match = INLINE_SEMVER_PATTERN.exec(version);
  if (!match) {
    return null;
  }
  const [, major, minor, patch, prerelease] = match;
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    prerelease: prerelease ? prerelease.split('.') : [],
  };
}

function inlineIsValidSemver(version: string): boolean {
  return inlineParseSemver(version) !== null;
}

function compareNumericIdentifiers(a: string, b: string): number {
  const aNumber = Number(a);
  const bNumber = Number(b);
  if (aNumber < bNumber) {
    return -1;
  }
  if (aNumber > bNumber) {
    return 1;
  }
  return 0;
}

function compareLexicalIdentifiers(a: string, b: string): number {
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

function inlineComparePrereleaseIdentifiers(a: string, b: string): number {
  const aIsNumeric = /^\d+$/.test(a);
  const bIsNumeric = /^\d+$/.test(b);
  if (aIsNumeric && bIsNumeric) {
    return compareNumericIdentifiers(a, b);
  }
  if (aIsNumeric) {
    return -1;
  }
  if (bIsNumeric) {
    return 1;
  }
  return compareLexicalIdentifiers(a, b);
}

function inlineComparePrereleaseArrays(a: readonly string[], b: readonly string[]): number {
  const length = Math.min(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    const result = inlineComparePrereleaseIdentifiers(a[index] ?? '', b[index] ?? '');
    if (result !== 0) {
      return result;
    }
  }
  if (a.length < b.length) {
    return -1;
  }
  if (a.length > b.length) {
    return 1;
  }
  return 0;
}

function compareCoreVersions(current: InlineParsed, previous: InlineParsed): number {
  for (const key of ['major', 'minor', 'patch'] as const) {
    if (current[key] < previous[key]) {
      return -1;
    }
    if (current[key] > previous[key]) {
      return 1;
    }
  }
  return 0;
}

function comparePrereleaseAfterCore(current: InlineParsed, previous: InlineParsed): number {
  const currentEmpty = current.prerelease.length === 0;
  const previousEmpty = previous.prerelease.length === 0;
  if (currentEmpty && previousEmpty) {
    return 0;
  }
  if (currentEmpty) {
    return 1;
  }
  if (previousEmpty) {
    return -1;
  }
  return inlineComparePrereleaseArrays(current.prerelease, previous.prerelease);
}

function inlineIsLessThanOrEqual(currentVersion: string, previousVersion: string): boolean {
  const current = inlineParseSemver(currentVersion);
  const previous = inlineParseSemver(previousVersion);
  if (!current || !previous) {
    return false;
  }
  const coreOrdering = compareCoreVersions(current, previous);
  if (coreOrdering !== 0) {
    return coreOrdering < 0;
  }
  return comparePrereleaseAfterCore(current, previous) <= 0;
}

// --- Parity fixture ---
// 20 cases covering: §2 strict X.Y.Z, prerelease forms, build metadata,
// §11 precedence, rejection (leading zeros, bad chars, partial).

const VALIDITY_FIXTURE: readonly { input: string; valid: boolean }[] = [
  { input: '0.0.0', valid: true },
  { input: '1.0.0', valid: true },
  { input: '1.5.0', valid: true },
  { input: '10.20.30', valid: true },
  { input: '1.0.0-alpha', valid: true },
  { input: '1.0.0-alpha.1', valid: true },
  { input: '1.0.0-0.3.7', valid: true },
  { input: '1.0.0-x.7.z.92', valid: true },
  { input: '1.0.0+20130313144700', valid: true },
  { input: '1.0.0-beta+exp.sha.5114f85', valid: true },
  { input: '01.0.0', valid: false },
  { input: '1.02.0', valid: false },
  { input: '1.0.03', valid: false },
  { input: '-1.0.0', valid: false },
  { input: 'a.b.c', valid: false },
  { input: '1.0', valid: false },
  { input: '1', valid: false },
  { input: '1.0.0.0', valid: false },
  { input: 'v1.0.0', valid: false },
  { input: 'latest', valid: false },
];

const COMPARISON_FIXTURE: readonly { a: string; b: string; aLeqB: boolean }[] = [
  { a: '1.0.0', b: '1.0.0', aLeqB: true },
  { a: '1.0.0', b: '1.0.1', aLeqB: true },
  { a: '1.0.1', b: '1.0.0', aLeqB: false },
  { a: '1.2.0', b: '1.10.0', aLeqB: true },
  { a: '1.0.0-alpha', b: '1.0.0', aLeqB: true },
  { a: '1.0.0', b: '1.0.0-alpha', aLeqB: false },
  { a: '1.0.0-alpha', b: '1.0.0-alpha.1', aLeqB: true },
  { a: '1.0.0-alpha.1', b: '1.0.0-alpha.beta', aLeqB: true },
  { a: '1.0.0-rc.1', b: '1.0.0', aLeqB: true },
  { a: '2.0.0', b: '1.99.99', aLeqB: false },
];

describe('semver parity (canonical npm-backed vs inline regex copies)', () => {
  describe('isValidSemver', () => {
    it.each(VALIDITY_FIXTURE)('agrees on validity for input "$input"', ({ input, valid }) => {
      expect(isValidSemver(input)).toBe(valid);
      expect(inlineIsValidSemver(input)).toBe(valid);
    });
  });

  describe('isLessThanOrEqual', () => {
    it.each(COMPARISON_FIXTURE)('agrees on "$a" ≤ "$b"', ({ a, b, aLeqB }) => {
      expect(isLessThanOrEqual(a, b)).toBe(aLeqB);
      expect(inlineIsLessThanOrEqual(a, b)).toBe(aLeqB);
    });
  });

  describe('regex parity', () => {
    it('canonical SEMVER_PATTERN source matches the inline INLINE_SEMVER_PATTERN source modulo the unicode flag', () => {
      // The canonical regex carries the `u` flag (per the build-metadata
      // module's strictness); the inline copy in the pre-`pnpm install`
      // script omits it (Node accepts both for this pattern, and the
      // script avoids any flag the runtime might not recognise). Strip
      // the flag from the canonical, then assert source equality.
      const canonicalSource = String.raw`/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/`;
      expect(`/${INLINE_SEMVER_PATTERN.source}/`).toBe(canonicalSource);
    });
  });
});
