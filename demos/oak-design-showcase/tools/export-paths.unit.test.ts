import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { exportsSurfaceAdmits, resolveAcrossRoots, type OverlayRoot } from './export-paths';

/* decodeUrlPath and resolveWithinRoot behaviour (decode, traversal,
 * malformed escapes, NULs, canonical roots) is proven in
 * @oaknational/fidelity-review's static-path-guard suite; this file owns
 * only the overlay-shaped decisions built on top of them. */

const STUDIO = path.resolve('/served/studio-source');
const KIT = path.resolve('/served/kit-root');

/** The declared kit surface used by the overlay fixtures below. */
const KIT_ADMITS = exportsSurfaceAdmits([
  '.',
  './styles.css',
  './colors_and_type.css',
  './fonts/*',
]);
const ROOTS: readonly OverlayRoot[] = [{ dir: STUDIO }, { dir: KIT, admits: KIT_ADMITS }];

describe('exportsSurfaceAdmits', () => {
  const admits = exportsSurfaceAdmits(['.', './styles.css', './fonts/*']);

  it('admits an exact declared entry', () => {
    expect(admits('/styles.css')).toBe(true);
  });

  it('admits any path under a declared wildcard prefix', () => {
    expect(admits('/fonts/Lexend-Regular.ttf')).toBe(true);
  });

  it('refuses everything undeclared — package internals stay unreachable', () => {
    expect(admits('/package.json')).toBe(false);
    expect(admits('/DECISIONS.md')).toBe(false);
    expect(admits('/src/index.ts')).toBe(false);
    expect(admits('/')).toBe(false);
  });
});

describe('resolveAcrossRoots (the studio overlay)', () => {
  it('serves from the first root when the file exists there', () => {
    const exists = (candidate: string): boolean => candidate.startsWith(STUDIO);

    expect(resolveAcrossRoots(ROOTS, '/whitelabel/specimen.html', exists)).toBe(
      path.join(STUDIO, 'whitelabel', 'specimen.html'),
    );
  });

  it('falls through to the second root for a DECLARED kit asset', () => {
    const exists = (candidate: string): boolean => candidate.startsWith(KIT);

    expect(resolveAcrossRoots(ROOTS, '/colors_and_type.css', exists)).toBe(
      path.join(KIT, 'colors_and_type.css'),
    );
  });

  it('refuses an undeclared kit path even when the file exists — the fallback is surface-bounded', () => {
    const exists = (candidate: string): boolean => candidate.startsWith(KIT);

    expect(resolveAcrossRoots(ROOTS, '/package.json', exists)).toBeUndefined();
    expect(resolveAcrossRoots(ROOTS, '/DECISIONS.md', exists)).toBeUndefined();
  });

  it('judges the surface on the canonical path — an admitted prefix cannot smuggle a relative hop', () => {
    // '/fonts/../package.json' wears the declared /fonts/ prefix but
    // canonicalises to /package.json, which the surface refuses; resolution
    // would otherwise serve exactly that undeclared file.
    const exists = (candidate: string): boolean => candidate.startsWith(KIT);

    expect(resolveAcrossRoots(ROOTS, '/fonts/../package.json', exists)).toBeUndefined();
    expect(resolveAcrossRoots(ROOTS, '/fonts/%2e%2e/package.json', exists)).toBeUndefined();
  });

  it('prefers the first root when the file exists in both', () => {
    const exists = (): boolean => true;

    expect(resolveAcrossRoots(ROOTS, '/styles.css', exists)).toBe(path.join(STUDIO, 'styles.css'));
  });

  it('returns undefined when the file exists in neither root', () => {
    const exists = (): boolean => false;

    expect(resolveAcrossRoots(ROOTS, '/styles.css', exists)).toBeUndefined();
  });
});

describe('resolveAcrossRoots guards', () => {
  it('never resolves a URL outside the union of roots', () => {
    // The traversal guard applies per root; what must hold is the union
    // invariant: a URL whose canonical resolution lands outside EVERY root
    // resolves nowhere, even when the escaped-to file exists.
    const exists = (): boolean => true;

    expect(resolveAcrossRoots(ROOTS, '/../outside/escape.txt', exists)).toBeUndefined();
    expect(resolveAcrossRoots(ROOTS, '/%2e%2e/%2e%2e/etc/passwd', exists)).toBeUndefined();
    expect(resolveAcrossRoots(ROOTS, '/../kit-root-evil/x.txt', exists)).toBeUndefined();
  });

  it('answers a malformed percent-escape with nothing across the overlay too', () => {
    const exists = (): boolean => true;

    expect(resolveAcrossRoots(ROOTS, '/%zz', exists)).toBeUndefined();
  });

  it('refuses decoded backslashes — POSIX admission must never disagree with host resolution', () => {
    // On Windows, path.resolve treats the decoded backslash as a
    // separator, so `/fonts/..%5Cpackage.json` would pass the declared
    // /fonts/ prefix here yet serve the undeclared package.json there.
    const exists = (): boolean => true;

    expect(resolveAcrossRoots(ROOTS, '/fonts/..%5Cpackage.json', exists)).toBeUndefined();
    expect(resolveAcrossRoots(ROOTS, String.raw`/fonts/..\package.json`, exists)).toBeUndefined();
  });
});
