import { tmpdir } from 'node:os';
import { relative } from 'node:path';

import { isErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { resolveRepoRoot } from '../../../core/repo-root.js';
import { deriveRunData } from './derive-stage-run-data.js';

// The escaping fixture must EXIST on every host (the containment guard
// canonicalises with realpath, and a missing path would refuse as ENOENT for
// the wrong reason): the OS temp root is a real directory outside the
// repository on every platform, unlike a hard-coded '/etc/...'.
const OUTSIDE_REPO = tmpdir();

describe('deriveRunData path containment', () => {
  it('refuses an absolute checkpoint path outside the repository — the CLI must never read or inline external JSON', async () => {
    const result = await deriveRunData({
      stage: 'reduce',
      mapResult: OUTSIDE_REPO,
      validateResults: [],
    });
    expect(isErr(result)).toBe(true);
    expect(String(!result.ok && result.error)).toContain(
      'Refusing path outside the permitted base',
    );
  });

  it('resolves a relative checkpoint flag against the REPOSITORY ROOT, not the process cwd — committed .agent/reports/... paths work identically from any invocation directory', async () => {
    // 'agent-tools/package.json' exists ONLY repo-root-relative: under the vitest/pnpm
    // process cwd (the agent-tools workspace) a cwd-based resolution would look for
    // agent-tools/agent-tools/package.json and fail the READ. A read that succeeds and
    // then fails the checkpoint RE-PARSE proves the repo-root base.
    const result = await deriveRunData({
      stage: 'reduce',
      mapResult: 'agent-tools/package.json',
      validateResults: [],
    });
    expect(isErr(result)).toBe(true);
    expect(String(!result.ok && result.error)).toContain('map result failed validation');
    expect(String(!result.ok && result.error)).not.toContain('Cannot read checkpoint');
  });

  // Every stage flag funnels through the same contained readJson, so containment is
  // demonstrated on each stage's FIRST-read flag; later flags share the identical path.
  it('refuses a ".."-escaping relative checkpoint path at each stage entry flag', async () => {
    // Derived, not hard-coded: the `..` walk from the repo root to the OS
    // temp root exists on every host, so the refusal is the containment
    // guard's, never a missing-path ENOENT.
    const escape = relative(
      resolveRepoRoot(import.meta.url, { projectDir: undefined }),
      OUTSIDE_REPO,
    );
    const viaPartition = await deriveRunData({
      stage: 'map',
      partition: escape,
      gazetteer: escape,
      validateResults: [],
    });
    expect(isErr(viaPartition)).toBe(true);
    expect(String(!viaPartition.ok && viaPartition.error)).toContain(
      'Refusing path outside the permitted base',
    );
    const viaValidateResult = await deriveRunData({
      stage: 'meta',
      mapResult: escape,
      reduceResult: escape,
      validateResults: [escape],
    });
    expect(isErr(viaValidateResult)).toBe(true);
    expect(String(!viaValidateResult.ok && viaValidateResult.error)).toContain(
      'Refusing path outside the permitted base',
    );
  });
});
