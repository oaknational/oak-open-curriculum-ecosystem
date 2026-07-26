import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import {
  copyOakDs,
  OAK_DS_MANIFEST,
  OAK_DS_PUBLIC_DIRNAME,
  resolveOakDsPackageRoot,
} from './copy-oak-ds.js';
import {
  createScratchDirectory,
  directoryOf,
  isFile,
  joinPath,
  listDirectory,
  readPackageText,
  removeScratchDirectory,
  resolveRelative,
} from './test-helpers/oak-ds-fixtures.js';

/**
 * The design system's served file set is a contract, not a glob.
 *
 * These tests recompute the stylesheet's real dependency closure from the
 * installed package and hold the manifest to it. A design-system change that
 * adds an `@import`, or points a `url()` at a file the app does not copy,
 * fails here — at build time — instead of shipping a page with a missing
 * font face or a blank icon.
 */

/** Collects `@import './x.css'` targets, following them transitively. */
async function collectImportClosure(packageRoot: string, entry: string): Promise<Set<string>> {
  const seen = new Set<string>();
  const queue = [entry];

  while (queue.length > 0) {
    const current = queue.pop();
    if (current === undefined || seen.has(current)) {
      continue;
    }
    seen.add(current);

    const source = await readPackageText(packageRoot, current);
    // Quotes are optional in CSS, and both `@import url('x')` and the bare
    // `@import 'x'` are valid. A quote-only pattern silently walks a smaller
    // graph than the real one, so the manifest would be held to less than it
    // claims — and the suite would stay green while an unlisted sheet shipped.
    for (const match of source.matchAll(/@import\s+(?:url\(\s*)?['"]?([^'")\s;]+)['"]?\s*\)?/g)) {
      const target = match[1];
      if (target !== undefined) {
        queue.push(resolveRelative(current, target));
      }
    }
  }

  return seen;
}

/** Collects `url('x')` targets from a stylesheet, resolved package-relative. */
function collectUrlReferences(stylesheetRelativePath: string, source: string): string[] {
  const references: string[] = [];
  // Quote-optional for the same reason as the @import walk: `url(x.svg)` is
  // valid CSS, and a pattern that only matches `url('x.svg')` asks the manifest
  // about fewer assets than the stylesheet actually loads.
  for (const match of source.matchAll(/url\(\s*['"]?([^'")]+?)['"]?\s*\)/g)) {
    const target = match[1];
    if (target === undefined || target.startsWith('data:') || /^https?:/.test(target)) {
      continue;
    }
    references.push(resolveRelative(stylesheetRelativePath, target));
  }
  return references;
}

function isCoveredByManifest(relativePath: string): boolean {
  const files: readonly string[] = OAK_DS_MANIFEST.files;
  if (files.includes(relativePath)) {
    return true;
  }
  const directories: readonly string[] = OAK_DS_MANIFEST.directories;
  return directories.some(
    (directory) => relativePath === directory || relativePath.startsWith(`${directory}/`),
  );
}

describe('Oak design-system copy manifest', () => {
  const packageRoot = resolveOakDsPackageRoot();

  it('declares every stylesheet in the styles.css @import closure', async () => {
    const closure = await collectImportClosure(packageRoot, 'styles.css');

    for (const stylesheet of closure) {
      expect(
        isCoveredByManifest(stylesheet),
        `${stylesheet} is in the styles.css import closure but not in OAK_DS_MANIFEST`,
      ).toBe(true);
    }
  });

  it('declares every asset reachable through a url() reference', async () => {
    const closure = await collectImportClosure(packageRoot, 'styles.css');

    for (const stylesheet of closure) {
      const source = await readPackageText(packageRoot, stylesheet);
      for (const reference of collectUrlReferences(stylesheet, source)) {
        expect(
          isCoveredByManifest(reference),
          `${reference} is referenced by ${stylesheet} but not in OAK_DS_MANIFEST`,
        ).toBe(true);
      }
    }
  });

  it('ships a licence notice beside every font binary', () => {
    const fontBinaries = OAK_DS_MANIFEST.files.filter((file) => file.endsWith('.ttf'));
    expect(fontBinaries.length).toBeGreaterThan(0);

    const declared: readonly string[] = OAK_DS_MANIFEST.files;
    for (const binary of fontBinaries) {
      const family = binary.split('/').at(-1)?.split('-')[0] ?? '';
      const hasNotice = declared.some(
        (file) => file.startsWith(`${directoryOf(binary)}/${family}`) && file.endsWith('OFL.txt'),
      );
      expect(hasNotice, `${binary} ships without a sibling OFL notice`).toBe(true);
    }
  });
});

describe('copyOakDs', () => {
  let destRoot: string;
  let copiedRoot: string;

  beforeAll(async () => {
    destRoot = await createScratchDirectory();
    copiedRoot = joinPath(destRoot, OAK_DS_PUBLIC_DIRNAME);
    await copyOakDs(destRoot);
  });

  afterAll(async () => {
    await removeScratchDirectory(destRoot);
  });

  it('places every declared file at its package-relative path', async () => {
    for (const relativePath of OAK_DS_MANIFEST.files) {
      expect(await isFile(copiedRoot, relativePath), `${relativePath} was not copied`).toBe(true);
    }
  });

  it('places every declared directory with its contents', async () => {
    for (const relativeDir of OAK_DS_MANIFEST.directories) {
      const entries = await listDirectory(copiedRoot, relativeDir);
      expect(entries.length, `${relativeDir} was copied empty`).toBeGreaterThan(0);
    }
  });

  it('copies nothing beyond the declared top-level entries', async () => {
    const declaredTopLevel = new Set(
      [...OAK_DS_MANIFEST.files, ...OAK_DS_MANIFEST.directories].map(
        (relativePath) => relativePath.split('/')[0],
      ),
    );

    const actualTopLevel = await listDirectory(copiedRoot);

    expect(new Set(actualTopLevel)).toEqual(declaredTopLevel);
  });

  it('is idempotent — a second copy leaves the same tree', async () => {
    const before = await listDirectory(copiedRoot);
    await copyOakDs(destRoot);
    const after = await listDirectory(copiedRoot);

    expect(after).toEqual(before);
  });
});
