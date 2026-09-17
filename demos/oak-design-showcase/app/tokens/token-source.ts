import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import component from '@oaknational/oak-design-system/dtcg/component.json';
import palette from '@oaknational/oak-design-system/dtcg/palette.json';
import primitives from '@oaknational/oak-design-system/dtcg/primitives.json';
import semanticColourSafe from '@oaknational/oak-design-system/dtcg/semantic.colour-safe.json';
import semanticDark from '@oaknational/oak-design-system/dtcg/semantic.dark.json';
import semanticHighContrast from '@oaknational/oak-design-system/dtcg/semantic.high-contrast.json';
import semanticLight from '@oaknational/oak-design-system/dtcg/semantic.light.json';

import { BASE_IDENTITY, IDENTITIES, type IdentitySlug } from '../../components/useIdentity';

import {
  declaredCustomProperties,
  importedStylesheets,
  isRemoteStylesheet,
} from './identity-deltas';
import { buildCatalogue, type Catalogue, type DtcgTree } from './token-catalogue';

/**
 * The catalogue's edge to the world: the kit's published token trees and the
 * served identity sheets. Everything downstream of here is pure.
 *
 * The trees arrive through the kit's `"./dtcg/*"` package export — the
 * published surface, not a path into the package's insides — so they are
 * inlined at build time and the page is a static catalogue with no runtime
 * read. `dtcg/README.md` is their contract: the CSS is canonical and these
 * are generated from it, which is exactly why the page binds specimens to
 * the CSS property and shows the tree's value only as the pre-hydration
 * text.
 *
 * The identity sheets are read from `public/` rather than imported: they are
 * SERVED assets (the same files the identity binder loads over the network
 * at a switch), and reading the served copy is what makes the delta a fact
 * about what the browser will actually apply. The relative path matches the
 * layout's own `oak-theme.js` read — cwd is the workspace root under
 * `next dev`, `next build` and `next start` alike.
 */

/** The seven token trees, tiered and theme-labelled per `dtcg/README.md`.
 *  Order is load-bearing: the first tree to declare a token owns its row,
 *  so the light face leads the semantic tier and the later faces record
 *  themselves as themes on the same row. */
const TREES: readonly DtcgTree[] = [
  { file: 'palette.json', tier: 1, theme: null, data: palette },
  { file: 'primitives.json', tier: 1, theme: null, data: primitives },
  { file: 'semantic.light.json', tier: 2, theme: 'light', data: semanticLight },
  { file: 'semantic.dark.json', tier: 2, theme: 'dark', data: semanticDark },
  {
    file: 'semantic.high-contrast.json',
    tier: 2,
    theme: 'high contrast',
    data: semanticHighContrast,
  },
  { file: 'semantic.colour-safe.json', tier: 2, theme: 'colour safe', data: semanticColourSafe },
  { file: 'component.json', tier: 3, theme: null, data: component },
];

export const TREE_COUNT = TREES.length;

/** The catalogue, built once per process from the inlined trees. */
export function loadCatalogue(): Catalogue {
  return buildCatalogue(TREES);
}

export interface IdentityDelta {
  readonly identity: IdentitySlug;
  /** Every custom property the identity's sheets re-declare. */
  readonly properties: readonly string[];
}

/** Where the served assets live — the same tree the browser fetches the
 *  sheets from, so a root-relative import resolves the way a browser would
 *  resolve it. */
const SERVED_ROOT = 'public';

/** The served sheet for an identity, as the binder requests it. */
function brandSheetPath(identity: IdentitySlug): string {
  return join(SERVED_ROOT, 'brands', identity, 'brand.css');
}

/** An import target as a path on disk, resolved as the browser would: a
 *  root-relative URL against the served root, everything else against the
 *  importing sheet. */
function importedSheetPath(importingSheet: string, target: string): string {
  return target.startsWith('/') ? join(SERVED_ROOT, target) : join(dirname(importingSheet), target);
}

/**
 * Every custom property a sheet and its `@import`ed parts declare. Imports
 * are followed rather than listed, so a sheet that splits differently
 * tomorrow still reports its whole delta; remote imports are skipped by rule
 * (`isRemoteStylesheet`), and the visited set makes a cyclic import
 * terminate instead of recursing forever.
 */
function declaredAcrossImports(path: string, visited: Set<string>): readonly string[] {
  if (visited.has(path)) {
    return [];
  }
  visited.add(path);
  const css = readFileSync(path, 'utf8');
  const names = [...declaredCustomProperties(css)];
  for (const target of importedStylesheets(css)) {
    if (!isRemoteStylesheet(target)) {
      names.push(...declaredAcrossImports(importedSheetPath(path, target), visited));
    }
  }
  return [...new Set(names)];
}

/**
 * The per-identity deltas. The base identity carries no override sheet —
 * it IS the kit's own tokens — so it contributes no row and the page says
 * so rather than showing an empty column.
 */
export function loadIdentityDeltas(): readonly IdentityDelta[] {
  return IDENTITIES.filter((identity) => identity !== BASE_IDENTITY).map((identity) => ({
    identity,
    properties: declaredAcrossImports(brandSheetPath(identity), new Set()),
  }));
}
