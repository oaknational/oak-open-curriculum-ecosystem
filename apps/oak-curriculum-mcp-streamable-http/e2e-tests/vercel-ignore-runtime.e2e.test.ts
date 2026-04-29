/**
 * E2E runtime contract test for the Vercel-ignore script's `gitShowFileAtSha`
 * capability.
 *
 * Per the PR-87 architectural cleanup plan §"Phase 1 — Cluster B" the
 * production module invokes `git` via the absolute `/usr/bin/git` path
 * (`GIT_BINARY`) so `PATH` never participates in the binary lookup, and
 * `scrubbedGitEnv()` returns only `GIT_CONFIG_GLOBAL=/dev/null`,
 * `GIT_CONFIG_SYSTEM=/dev/null`, and `GIT_TERMINAL_PROMPT=0`. This test
 * exercises the production capability against the actual repository to
 * prove that posture does not break `git show` on the runtime that
 * Vercel's `ignoreCommand` executes on. If a future runtime moves `git`
 * away from `/usr/bin/git`, this test fails first; `GIT_BINARY` is
 * updated deliberately with the failure evidence recorded in the
 * production module's TSDoc.
 *
 * Network-fetching capabilities (`gitFetchShallow`) are not exercised
 * here — the unit test asserts argv shape and SHA validation; runtime
 * success of fetch is exercised at deploy-time on Vercel previews,
 * not in the in-repo test suite.
 *
 * E2E classification rationale (per testing-strategy.md): this test
 * spawns `git` subprocesses via the production capability under test.
 * That makes it an out-of-process, IO-permitting test (E2E or smoke),
 * not a unit or integration test. It runs only under `pnpm test:e2e`,
 * keeping the in-process unit/integration suite free of subprocess
 * dependencies.
 */
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

import { gitShowFileAtSha } from '../runtime-only-scripts/vercel-ignore-production-non-release-build.mjs';

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(thisDir, '../../..');

// Mirror the production module's binary-location posture (no PATH lookup)
// so this test helper does not re-introduce the S4036 surface that the
// production capabilities deliberately close.
const GIT_BINARY = '/usr/bin/git';

function resolveHeadSha(): string {
  return execFileSync(GIT_BINARY, ['rev-parse', 'HEAD'], {
    cwd: repositoryRoot,
    encoding: 'utf8',
  }).trim();
}

describe('gitShowFileAtSha — runtime contract under scrubbedGitEnv', () => {
  it('reads package.json at HEAD and returns parseable JSON', () => {
    const headSha = resolveHeadSha();
    const text = gitShowFileAtSha(headSha, 'package.json', repositoryRoot);
    const parsed: unknown = JSON.parse(text);
    expect(typeof parsed).toBe('object');
    expect(parsed).not.toBeNull();
  });
});
