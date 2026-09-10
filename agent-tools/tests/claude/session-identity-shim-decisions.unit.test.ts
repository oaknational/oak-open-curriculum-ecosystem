import { describe, expect, it } from 'vitest';

import { stripSessionIdTagIfPresent } from '../../src/core/agent-identity/session-seed';

import {
  isShellSafeSeed,
  planShimFailOpen,
  readShimSessionId,
} from '../../src/claude/session-identity-shim-decisions';

/**
 * The identity shim's fail-open decision states (ADR-167 §Limitations 6):
 * what gets persisted to the hook-scoped env file, and what the diagnostic
 * says in each persistence outcome. Pure parameters-in/result-out per
 * ADR-078 — the shim performs the IO these plans describe.
 */

const VALID_SEED = '0f3c2a1b-4d5e-4f60-8172-93a4b5c6d7e8';

describe('readShimSessionId', () => {
  it('returns the trimmed seed from valid stdin JSON', () => {
    expect(readShimSessionId(JSON.stringify({ session_id: `  ${VALID_SEED}  ` }))).toBe(VALID_SEED);
  });

  it('returns undefined for non-JSON, missing, non-string, or empty session_id', () => {
    expect(readShimSessionId('not json')).toBeUndefined();
    expect(readShimSessionId(JSON.stringify({ source: 'startup' }))).toBeUndefined();
    expect(readShimSessionId(JSON.stringify({ session_id: 7 }))).toBeUndefined();
    expect(readShimSessionId(JSON.stringify({ session_id: '   ' }))).toBeUndefined();
  });
});

describe('isShellSafeSeed', () => {
  it('accepts UUID-shaped seeds and rejects shell metacharacters', () => {
    expect(isShellSafeSeed(VALID_SEED)).toBe(true);
    expect(isShellSafeSeed("evil'; rm -rf $HOME'")).toBe(false);
    expect(isShellSafeSeed('`whoami`')).toBe(false);
    expect(isShellSafeSeed('')).toBe(false);
  });
});

describe('planShimFailOpen', () => {
  it('plans the env-file export and a persisted-outcome message for a safe seed with an env file', () => {
    const plan = planShimFailOpen({
      cause: 'built adapter missing',
      stdinText: JSON.stringify({ session_id: VALID_SEED }),
      envFile: '/hook-scoped/env',
    });

    expect(plan.envFileWrite).toStrictEqual({
      absolutePath: '/hook-scoped/env',
      appendLine: `export PRACTICE_AGENT_SESSION_ID_CLAUDE='${VALID_SEED}'\n`,
    });
    expect(plan.messageWhenPersisted).toContain('Identity hook could not run');
    expect(plan.messageWhenPersisted).toContain('built adapter missing');
    expect(plan.messageWhenPersisted).toContain('seed WAS persisted');
    expect(plan.messageWhenPersisted).not.toContain('<session_id>');
  });

  it('plans no write and an inline per-command seed prefix when no env file is available', () => {
    const plan = planShimFailOpen({
      cause: 'built adapter missing',
      stdinText: JSON.stringify({ session_id: VALID_SEED }),
      envFile: undefined,
    });

    expect(plan.envFileWrite).toBeUndefined();
    expect(plan.messageWhenNotPersisted).toContain('could NOT be persisted');
    expect(plan.messageWhenNotPersisted).toContain(
      `PRACTICE_AGENT_SESSION_ID_CLAUDE='${VALID_SEED}' pnpm agent-tools:agent-identity`,
    );
  });

  it('treats a blank env file path as unavailable', () => {
    const plan = planShimFailOpen({
      cause: 'adapter exited with code 1',
      stdinText: JSON.stringify({ session_id: VALID_SEED }),
      envFile: '   ',
    });

    expect(plan.envFileWrite).toBeUndefined();
  });

  it('neither embeds nor persists a shell-unsafe seed', () => {
    const plan = planShimFailOpen({
      cause: 'built adapter missing',
      stdinText: JSON.stringify({ session_id: "evil'; rm -rf $HOME'" }),
      envFile: '/hook-scoped/env',
    });

    expect(plan.envFileWrite).toBeUndefined();
    expect(plan.messageWhenNotPersisted).toContain('<session_id>');
    expect(plan.messageWhenNotPersisted).toContain('no usable session_id');
    expect(plan.messageWhenNotPersisted).not.toContain('rm -rf');
  });

  it('falls back to the placeholder when stdin carries no seed at all', () => {
    const plan = planShimFailOpen({
      cause: 'built adapter missing',
      stdinText: '',
      envFile: '/hook-scoped/env',
    });

    expect(plan.envFileWrite).toBeUndefined();
    expect(plan.messageWhenNotPersisted).toContain('<session_id>');
  });
});

describe('cloud-seat seed in the fail-open path', () => {
  it('prefers the stripped platform session id over the stdin session_id', () => {
    const plan = planShimFailOpen({
      cause: 'missing build artefact',
      stdinText: JSON.stringify({ session_id: 'harness-uuid' }),
      envFile: '/tmp/env',
      remoteSessionId: 'cse_01FV6rZz5BjSkApAUL6FAj72',
    });

    expect(plan.envFileWrite?.appendLine).toBe(
      "export PRACTICE_AGENT_SESSION_ID_CLAUDE='01FV6rZz5BjSkApAUL6FAj72'\n",
    );
  });
});

describe('local tag strip stays in lockstep with the canonical', () => {
  it.each([
    ['cse_01FV6rZz5BjSkApAUL6FAj72', '01FV6rZz5BjSkApAUL6FAj72'],
    ['session_abc', 'abc'],
    ['untagged-id', 'untagged-id'],
    ['session_', 'session_'],
  ])('strips %s to the canonical payload', (raw, expected) => {
    expect(stripSessionIdTagIfPresent(raw)).toBe(expected);
    const plan = planShimFailOpen({
      cause: 'missing build artefact',
      stdinText: '',
      envFile: '/tmp/env',
      remoteSessionId: raw,
    });
    expect(
      plan.envFileWrite?.appendLine ?? `export PRACTICE_AGENT_SESSION_ID_CLAUDE='${expected}'\n`,
    ).toBe(`export PRACTICE_AGENT_SESSION_ID_CLAUDE='${expected}'\n`);
  });
});

describe('explicit Practice seed precedence in the fail-open path', () => {
  it('an explicit seed outranks the ambient platform id', () => {
    const plan = planShimFailOpen({
      cause: 'missing build artefact',
      stdinText: '',
      envFile: '/tmp/env',
      explicitSeed: 'explicit-operator-seed',
      remoteSessionId: 'cse_01FV6rZz5BjSkApAUL6FAj72',
    });

    expect(plan.envFileWrite?.appendLine).toBe(
      "export PRACTICE_AGENT_SESSION_ID_CLAUDE='explicit-operator-seed'\n",
    );
  });
});
