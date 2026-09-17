/**
 * Pure helpers for the kit-asset parity validator: the repo's declared
 * manifest of kit files served as tracked copies (the validator runs in the
 * root repo-validators:check chain, so the manifest is repo-scoped — copy
 * paths resolve from THIS workspace's root and may traverse into a sibling
 * demo), the local-CSS dependency walker, and the closure check the
 * validator uses to PROVE the manifest complete (validators must recompute,
 * not just record — a copy whose sheet pulls in a sibling outside the
 * manifest is an incomplete copy even when every listed pair is
 * byte-identical). Zero IO here: validate-kit-assets.ts owns the
 * filesystem.
 *
 * Accepted reference forms (each tested): `url(x)` with optional quotes
 * and interior whitespace, bare-quoted import targets, and import preludes
 * carrying layer/layer(...)/supports(...). Remote (http/https/protocol-
 * relative) and data: references are deliberate externals and skipped;
 * app-absolute references (leading /) are outside the sibling-closure
 * contract and fail loudly rather than resolving to a wrong path.
 */
import { parse } from 'postcss';
import { posix } from 'node:path';

export interface KitAssetPair {
  /** Path relative to the design-system package root. */
  readonly source: string;
  /**
   * Path resolved from the showcase workspace root (the manifest's
   * resolution anchor, not a containment boundary — a `../` traversal into
   * a sibling demo is a supported, deliberate shape).
   */
  readonly copy: string;
}

/** The served copies and their kit sources. brand-full.css is served under
 *  the brand contract's own name (brand.css); its internal import of
 *  brand-a.css resolves against the served URL, so the sibling geometry is
 *  preserved by the copy layout. */
export const KIT_ASSET_COPIES: readonly KitAssetPair[] = [
  { source: 'oak-theme.js', copy: 'public/oak-theme.js' },
  // The hub's serving copy of the same runtime — a deliberate cross-demo
  // row (owner disposition 2026-08-02): the copy-set has ONE guard home
  // instead of a per-demo test-time fs read.
  { source: 'oak-theme.js', copy: '../oak-curriculum-hub/public/oak-theme.js' },
  {
    source: 'studio-source/whitelabel/pds/brand-full.css',
    copy: 'public/brands/pds/brand.css',
  },
  {
    source: 'studio-source/whitelabel/pds/brand-a.css',
    copy: 'public/brands/pds/brand-a.css',
  },
  {
    source: 'studio-source/whitelabel/creature/brand-full.css',
    copy: 'public/brands/creature/brand.css',
  },
  {
    source: 'studio-source/whitelabel/creature/brand-a.css',
    copy: 'public/brands/creature/brand-a.css',
  },
];

// One linear class for the call body (url() cannot nest, and a `)` inside a
// target has never been accepted by any revision of this matcher); quote and
// whitespace handling is plain string work on the captured body. A regex
// grammar here kept trading one Sonar backtracking/complexity finding for
// another — the string parse ends the class.
const URL_CALL_ONE = /url\(([^)]*)\)/i;
const URL_CALL_ALL = /url\(([^)]*)\)/gi;

function urlReferenceTarget(body: string): string {
  const trimmed = body.trim();
  const quote = trimmed[0];
  if ((quote === '"' || quote === "'") && trimmed.length >= 2 && trimmed.endsWith(quote)) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function classifyReference(raw: string): string | null {
  const cleaned = raw.trim();
  if (cleaned === '' || /^(?:https?:|data:|\/\/)/.test(cleaned)) {
    return null;
  }
  return cleaned;
}

function importTarget(params: string): string | null {
  const withoutPrelude = params
    .replaceAll(/\b(?:layer|supports)\([^)]*\)/g, ' ')
    .replaceAll(/\blayer\b/g, ' ')
    .trim();
  const urlForm = URL_CALL_ONE.exec(withoutPrelude);
  if (urlForm !== null) {
    return classifyReference(urlReferenceTarget(urlForm[1] ?? ''));
  }
  const quotedForm = /^(?:"([^"]*)"|'([^']*)')/.exec(withoutPrelude);
  if (quotedForm !== null) {
    return classifyReference(quotedForm[1] ?? quotedForm[2] ?? '');
  }
  return null;
}

/** Every same-directory file a stylesheet pulls in: local import targets
 *  and relative url() references. */
export function findLocalCssDependencies(css: string): readonly string[] {
  const dependencies = new Set<string>();
  const root = parse(css);
  root.walkAtRules('import', (atRule) => {
    const reference = importTarget(atRule.params);
    if (reference !== null) {
      dependencies.add(reference);
    }
  });
  root.walkDecls((decl) => {
    for (const match of decl.value.matchAll(URL_CALL_ALL)) {
      const reference = classifyReference(urlReferenceTarget(match[1] ?? ''));
      if (reference !== null) {
        dependencies.add(reference);
      }
    }
  });
  return [...dependencies];
}

/** The completeness proof: every local dependency of a copied stylesheet
 *  must itself be a manifest copy in the same served directory. */
export function closureFailures(
  copyPath: string,
  copyContent: string,
  copyPaths: ReadonlySet<string>,
): readonly string[] {
  if (!copyPath.endsWith('.css')) {
    return [];
  }
  const servedDir = posix.dirname(copyPath);
  const failures: string[] = [];
  for (const dependency of findLocalCssDependencies(copyContent)) {
    if (dependency.startsWith('/')) {
      failures.push(
        `${copyPath}: references app-absolute '${dependency}' — outside the sibling-closure contract this manifest can verify`,
      );
      continue;
    }
    const served = posix.join(servedDir, dependency);
    if (!copyPaths.has(served)) {
      failures.push(
        `${copyPath}: references local '${dependency}' but ${served} is not in the manifest — the copy set is incomplete`,
      );
    }
  }
  return failures;
}
