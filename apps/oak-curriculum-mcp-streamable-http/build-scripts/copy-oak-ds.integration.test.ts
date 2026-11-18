import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { OAK_ASSETS_PUBLIC_DIRNAME, OAK_DS_PUBLIC_DIRNAME } from '../src/app/static-asset-paths.js';
import {
  copyOakDs,
  OAK_ASSETS_MANIFEST,
  OAK_DS_MANIFEST,
  resolveOakDsPackageRoot,
} from './copy-oak-ds.js';
import {
  createScratchDirectory,
  directoryOf,
  isFile,
  joinPath,
  listDirectory,
  listFilesRecursive,
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

/**
 * Reads the argument of each `url(...)` in a stylesheet: quoted or bare, with
 * any whitespace inside the parentheses dropped. A quoted argument runs to its
 * closing quote, so a data URI carrying parentheses reads whole; a bare one
 * runs to the closing parenthesis. A character walk rather than one pattern
 * with optional quotes at both ends, which backtracks (sonarjs/super-linear-regex).
 */
function urlArguments(source: string): string[] {
  const found: string[] = [];
  let from = source.indexOf('url(');
  while (from !== -1) {
    let cursor = from + 'url('.length;
    while (source.charAt(cursor) === ' ') {
      cursor += 1;
    }
    const quote = source.charAt(cursor);
    const quoted = quote === '"' || quote === "'";
    const end = source.indexOf(quoted ? quote : ')', quoted ? cursor + 1 : cursor);
    if (end === -1) {
      break;
    }
    found.push(source.slice(quoted ? cursor + 1 : cursor, end).trim());
    from = source.indexOf('url(', end);
  }
  return found;
}

/** Collects `url('x')` targets from a stylesheet, resolved package-relative. */
function collectUrlReferences(stylesheetRelativePath: string, source: string): string[] {
  const references: string[] = [];
  // Quote-optional for the same reason as the @import walk: `url(x.svg)` is
  // valid CSS, and a pattern that only matches `url('x.svg')` asks the manifest
  // about fewer assets than the stylesheet actually loads.
  for (const target of urlArguments(source)) {
    if (target.length === 0 || target.startsWith('data:') || /^https?:/.test(target)) {
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

  it('ships a licence notice on disk beside every copied font binary', async () => {
    // The copied tree, not the manifest literal, is the subject: a manifest
    // entry whose file does not exist would leave a redistributed font
    // licence-bare (OFL condition 2) with a self-consistent manifest.
    const shipped = await listFilesRecursive(copiedRoot);
    const fontBinaries = shipped.filter((file) => file.endsWith('.ttf'));
    expect(fontBinaries.length).toBeGreaterThan(0);

    for (const binary of fontBinaries) {
      const family = binary.split('/').at(-1)?.split('-')[0] ?? '';
      const notice = `${directoryOf(binary)}/${family}-OFL.txt`;
      expect(await isFile(copiedRoot, notice), `${binary} shipped without ${notice}`).toBe(true);
    }
  });

  it('copies every brand asset the assets manifest declares', async () => {
    for (const relativePath of OAK_ASSETS_MANIFEST.files) {
      expect(
        await isFile(destRoot, OAK_ASSETS_PUBLIC_DIRNAME, relativePath),
        `${relativePath} was not copied into ${OAK_ASSETS_PUBLIC_DIRNAME}`,
      ).toBe(true);
    }
  });

  it('copies no file the manifest does not cover, and strands no staging dirs', async () => {
    const shipped = await listFilesRecursive(copiedRoot);
    for (const relativePath of shipped) {
      expect(
        isCoveredByManifest(relativePath),
        `${relativePath} was copied but no manifest entry covers it`,
      ).toBe(true);
    }

    // The atomic publish stages under dot-prefixed siblings; a clean run
    // leaves exactly the two published trees at the destination root.
    expect(await listDirectory(destRoot)).toEqual(
      [OAK_ASSETS_PUBLIC_DIRNAME, OAK_DS_PUBLIC_DIRNAME].sort((a, b) => a.localeCompare(b)),
    );
  });

  it('is idempotent — a second copy leaves the same tree, recursively', async () => {
    const before = await listFilesRecursive(destRoot);
    await copyOakDs(destRoot);
    const after = await listFilesRecursive(destRoot);

    expect(after).toEqual(before);
  });
});
