import { isErr } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { deriveRunData } from './derive-stage-run-data.js';

// Literal containment fixtures: the repo root and canonicaliser are injected
// (the ADR-078 seam), so both refusals describe deterministically on every
// host with no IO — the identity canonicaliser keeps the containment verdict
// purely lexical, and no host topology (drive layout, temp-root location)
// can change what the fixtures mean.
const REPO_ROOT = '/repo';
const identityRealpath = (value: string): string => value;

describe('deriveRunData path containment', () => {
  it('refuses an absolute checkpoint path outside the repository — the CLI must never read or inline external JSON', async () => {
    const result = await deriveRunData(
      {
        stage: 'reduce',
        mapResult: '/outside-repo/checkpoint.json',
        validateResults: [],
      },
      { repoRoot: REPO_ROOT, realpath: identityRealpath },
    );
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
    const escape = '../outside-repo/checkpoint.json';
    const viaPartition = await deriveRunData(
      {
        stage: 'map',
        partition: escape,
        gazetteer: escape,
        validateResults: [],
      },
      { repoRoot: REPO_ROOT, realpath: identityRealpath },
    );
    expect(isErr(viaPartition)).toBe(true);
    expect(String(!viaPartition.ok && viaPartition.error)).toContain(
      'Refusing path outside the permitted base',
    );
    const viaValidateResult = await deriveRunData(
      {
        stage: 'meta',
        mapResult: escape,
        reduceResult: escape,
        validateResults: [escape],
      },
      { repoRoot: REPO_ROOT, realpath: identityRealpath },
    );
    expect(isErr(viaValidateResult)).toBe(true);
    expect(String(!viaValidateResult.ok && viaValidateResult.error)).toContain(
      'Refusing path outside the permitted base',
    );
  });
});
