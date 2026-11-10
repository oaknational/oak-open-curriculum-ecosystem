/**
 * E2E runtime contract test for the Vercel-ignore script's `gitShowFileAtSha`
 * capability.
 *
 * The production module runs `git` by name, with the inherited `PATH` as
 * the trust root, and `scrubbedGitEnv(process.env)` passes `PATH` alone of
 * the inherited environment, beside `GIT_CONFIG_GLOBAL=/dev/null`,
 * `GIT_CONFIG_SYSTEM=/dev/null`, `GIT_CONFIG_NOSYSTEM=1`, and
 * `GIT_TERMINAL_PROMPT=0`. This test
 * exercises the production capability against the actual repository to
 * prove that posture does not break `git show` on the runtime that
 * Vercel's `ignoreCommand` executes on.
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
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';

import { gitShowFileAtSha } from '../runtime-only-scripts/vercel-ignore-production-non-release-build.mjs';

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(thisDir, '../../..');
const gateModuleUrl = pathToFileURL(
  path.resolve(thisDir, '../runtime-only-scripts/vercel-ignore-production-non-release-build.mjs'),
).href;

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

  it('reaches the spawn with the scrub applied: a hostile inherited GIT_DIR does not redirect git', () => {
    // A fresh Node process sets the hostile variable in its OWN environment,
    // which the capability then inherits; this test process's environment is
    // never touched. A leaked GIT_DIR makes `git show` exit 128, so the read
    // succeeds only if the capability passes the scrubbed env to the spawn.
    const headSha = resolveHeadSha();
    const read = [
      "process.env.GIT_DIR = '/nonexistent';",
      `const gate = await import(${JSON.stringify(gateModuleUrl)});`,
      `process.stdout.write(gate.gitShowFileAtSha(${JSON.stringify(headSha)}, 'package.json', ${JSON.stringify(repositoryRoot)}));`,
    ].join('\n');
    const text = execFileSync(process.execPath, ['--input-type=module', '--eval', read], {
      encoding: 'utf8',
    });
    const parsed: unknown = JSON.parse(text);
    expect(typeof parsed).toBe('object');
    expect(parsed).not.toBeNull();
  });
});
