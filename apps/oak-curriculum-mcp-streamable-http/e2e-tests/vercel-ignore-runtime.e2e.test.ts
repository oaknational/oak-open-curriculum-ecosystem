/**
 * E2E runtime contract test for the Vercel-ignore script's `gitShowFileAtSha`
 * capability.
 *
 * Per the PR-87 architectural cleanup plan §"Phase 1 — Cluster B" the
 * scrubbed git environment (`scrubbedGitEnv()`) intentionally omits
 * `HOME`, pins `GIT_CONFIG_GLOBAL` and `GIT_CONFIG_SYSTEM` to
 * `/dev/null`, and disables `GIT_TERMINAL_PROMPT`. This test exercises
 * the production capability against the actual repository to prove that
 * the scrubbed env does not break `git show` on the runtime that
 * Vercel's `ignoreCommand` executes on. If a future runtime change
 * makes HOME-absence break git, this test fails first; the env scrub
 * is tightened or HOME is added back deliberately, with the failure
 * evidence documented in the production module's TSDoc.
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

import { gitShowFileAtSha } from '../build-scripts/vercel-ignore-production-non-release-build.mjs';

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(thisDir, '../../..');

function resolveHeadSha(): string {
  return execFileSync('git', ['rev-parse', 'HEAD'], {
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
