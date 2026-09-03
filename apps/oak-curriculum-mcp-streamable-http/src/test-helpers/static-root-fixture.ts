/**
 * Shared scratch static root for suites that construct the app.
 *
 * @remarks
 * Boot refuses a static root without the copied design system and brand
 * assets, so every `createApp` call needs a servable root. Suites inject
 * this fixture's scratch directory (`CreateAppOptions.staticRoot`) instead
 * of falling through to the `process.cwd()` probe — no test ever reads the
 * workspace's live `public/` tree, so no test can race the build's or dev
 * server's copy step, and a clean tree needs no prior build to run vitest.
 *
 * One copy per worker process: the populated root is memoised at module
 * level and shared by every suite the worker runs. The OS temp dir owns
 * cleanup of the long-lived root; per-test scratch dirs are removed by
 * their suites.
 *
 * Real IO lives here deliberately — this is the `test-helpers/` structural
 * allowlist surface of the `no-real-io-in-tests` rule
 * (`packages/core/oak-eslint/src/rules/no-real-io-in-tests.ts`).
 */

import { cp, mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { copyOakDs } from '../../build-scripts/copy-oak-ds.js';
import { OAK_ASSETS_PUBLIC_DIRNAME, OAK_DS_PUBLIC_DIRNAME } from '../app/static-asset-paths.js';

/** The workspace's committed `public/` tree — the source of the root statics. */
const COMMITTED_PUBLIC_ROOT = fileURLToPath(new URL('../../public', import.meta.url));

/**
 * Copy the committed root statics into a scratch root.
 *
 * @remarks
 * MCP-509 follow-up. `copyOakDs` generates `oak-ds/` and `oak-assets/`, which
 * is why those two are gitignored — but `favicons/*` and `landing-page.css`
 * are committed files that no copy step produces. A scratch root holding only
 * the generated trees therefore cannot answer for them, so no test could
 * prove the page's favicon and stylesheet references are actually served.
 * They are exactly the two families that reached production broken.
 *
 * Enumerated rather than listed by name: a newly committed root static is
 * carried automatically, so coverage cannot silently fall behind the tree.
 * The generated directories are skipped because `copyOakDs` owns them and
 * the workspace copy may be absent or stale on a clean checkout.
 */
// observability-emission-exempt: test fixture — scratch-dir IO for suites, not a runtime capability
async function copyCommittedRootStatics(destRoot: string): Promise<void> {
  const generated = new Set([OAK_DS_PUBLIC_DIRNAME, OAK_ASSETS_PUBLIC_DIRNAME]);
  const entries = await readdir(COMMITTED_PUBLIC_ROOT, { withFileTypes: true });

  for (const entry of entries) {
    // Dot-prefixed entries are copy-oak-ds's transient staging/retired dirs
    // (never servable: express.static ignores dotfiles) and can vanish
    // between readdir and cp when a concurrent build publishes — the ENOENT
    // race recorded 2026-08-13 and hit again on PR #20's CI.
    if (generated.has(entry.name) || entry.name.startsWith('.')) {
      continue;
    }
    await cp(
      path.join(COMMITTED_PUBLIC_ROOT, entry.name),
      path.join(destRoot, entry.name),
      entry.isDirectory() ? { recursive: true } : {},
    );
  }
}

let sharedRoot: Promise<string> | undefined;

/**
 * A static root populated the way a deployment is: generated design-system and
 * brand trees, plus the committed root statics.
 */
export function getScratchStaticRoot(): Promise<string> {
  sharedRoot ??= (async () => {
    const root = await mkdtemp(path.join(tmpdir(), 'oak-static-root-'));
    await copyOakDs(root);
    await copyCommittedRootStatics(root);
    return root;
  })();
  return sharedRoot;
}

/** An empty scratch directory, for describing the boot refusal itself. */
// observability-emission-exempt: test fixture — scratch-dir IO for suites, not a runtime capability
export async function createEmptyStaticRoot(): Promise<string> {
  return mkdtemp(path.join(tmpdir(), 'oak-static-empty-'));
}

/** Remove a scratch directory created by {@link createEmptyStaticRoot}. */
// observability-emission-exempt: test fixture — scratch-dir IO for suites, not a runtime capability
export async function removeStaticRoot(root: string): Promise<void> {
  await rm(root, { recursive: true, force: true });
}
