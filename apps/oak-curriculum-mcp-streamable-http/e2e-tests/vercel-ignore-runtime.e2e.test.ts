/**
 * E2E runtime contract test for the Vercel-ignore script's `gitShowFileAtSha`
 * capability.
 *
 * Per the PR-87 architectural cleanup plan §"Phase 1 — Cluster B" the
 * production module invokes `git` via an absolute path from a fixed,
 * platform-partitioned allowlist (`resolveTrustedGitBinary`) so `PATH` never
 * participates in the binary lookup, and `scrubbedGitEnv()` returns only
 * `GIT_CONFIG_GLOBAL=/dev/null`, `GIT_CONFIG_SYSTEM=/dev/null`, and
 * `GIT_TERMINAL_PROMPT=0`. This test exercises the production capability
 * against the actual repository to prove that posture does not break
 * `git show` on the runtime that Vercel's `ignoreCommand` executes on. If a
 * future runtime moves `git` off the POSIX pin, this test fails first; the
 * allowlist is updated deliberately with the failure evidence recorded in the
 * production module's TSDoc.
 *
 * The binary comes from the production resolver rather than a constant
 * duplicated here: a second copy of the path is a second thing to update, and
 * the copy this test used to hold pinned `/usr/bin/git`, which does not exist
 * on a Windows contributor's machine — so the suite could not run there at
 * all.
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

import {
  gitShowFileAtSha,
  resolveTrustedGitBinary,
} from '../runtime-only-scripts/vercel-ignore-production-non-release-build.mjs';

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(thisDir, '../../..');

function resolveHeadSha(): string {
  return execFileSync(resolveTrustedGitBinary(), ['rev-parse', 'HEAD'], {
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

describe('resolveTrustedGitBinary — both platform families, provable from any host', () => {
  const presentEverywhere = (): boolean => true;

  it('resolves the Vercel runtime pin on a POSIX host', () => {
    expect(resolveTrustedGitBinary(presentEverywhere, 'linux')).toBe('/usr/bin/git');
  });

  it('resolves the system-wide Git for Windows install on win32', () => {
    expect(resolveTrustedGitBinary(presentEverywhere, 'win32')).toBe(
      String.raw`C:\Program Files\Git\cmd\git.exe`,
    );
  });

  it('never offers a POSIX path on win32 — a rooted POSIX path there is drive-relative, and so plantable', () => {
    const probed: string[] = [];
    expect(() =>
      resolveTrustedGitBinary((candidate: string) => {
        probed.push(candidate);
        return false;
      }, 'win32'),
    ).toThrow(/No trusted git binary found/u);
    expect(probed.every((candidate) => /^[A-Z]:\\/u.test(candidate))).toBe(true);
  });

  it('never offers a Windows path on POSIX — execvp would PATH-search that literal filename', () => {
    const probed: string[] = [];
    expect(() =>
      resolveTrustedGitBinary((candidate: string) => {
        probed.push(candidate);
        return false;
      }, 'linux'),
    ).toThrow(/No trusted git binary found/u);
    expect(probed.every((candidate) => candidate.startsWith('/'))).toBe(true);
  });

  it('names what it searched when nothing is found, so the refusal is actionable', () => {
    expect(() => resolveTrustedGitBinary(() => false, 'linux')).toThrow(/\/usr\/bin\/git/u);
  });
});
