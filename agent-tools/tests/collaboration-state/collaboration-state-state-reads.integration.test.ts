/**
 * Integration coverage for the state-reading CLI commands (`identity preflight`
 * with `--active`, and `check`). Both read collaboration state through the
 * injected `io` seam, so these exercise the real CLI wiring against an
 * in-memory fake runtime with NO filesystem IO. The `--active` / `--closed` /
 * `--comms-dir` values are virtual keys the fake ignores.
 */
import { describe, expect, it } from 'vitest';

import {
  deriveCollaborationIdentity,
  runCollaborationStateCli,
} from '../../src/collaboration-state';
import {
  type CollaborationClaim,
  type CollaborationRegistry,
} from '../../src/collaboration-state/types';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

const codexThreadId = '019dd34d-cb6a-74e0-a29d-6cb8a65ea14b';
const nowIso = '2026-04-28T09:37:11Z';

describe('identity preflight collision detection', () => {
  it('fails when a live claim shares the routing id under a different model', async () => {
    // PDR-076a: same (name, id) with a different model is a live identity-route
    // collision. The colliding claim lives in the fake registry; preflight reads
    // it through the injected io seam — no temp files.
    const envDerived = deriveCollaborationIdentity({
      platform: 'codex',
      model: 'GPT-5',
      env: { CODEX_THREAD_ID: codexThreadId },
    }).agentId;
    const collidingClaim: CollaborationClaim = {
      claim_id: '11111111-1111-4111-8111-111111111111',
      agent_id: { ...envDerived, model: 'GPT-5.1' },
      thread: 'agentic-engineering-enhancements',
      areas: [{ kind: 'files', patterns: ['.agent/state/collaboration/shared-comms-log.md'] }],
      claimed_at: '2026-04-28T08:00:00Z',
      freshness_seconds: 14400,
      intent: 'Test collaboration-state write safety.',
    };
    const activeClaims: CollaborationRegistry = {
      schema_version: '1.3.0',
      commit_queue: [],
      claims: [collidingClaim],
    };
    const fake = createFakeCollaborationRuntime({ activeClaims });

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'identity',
        'preflight',
        '--platform',
        'codex',
        '--model',
        'GPT-5',
        '--active',
        'virtual/active.json',
        '--now',
        nowIso,
      ],
      env: { CODEX_THREAD_ID: codexThreadId },
      io: fake.runtime.io,
    });

    expect(result.exitCode).toBe(2);
    expect(result.stderr).toContain('collides with live identity');
    expect(result.stderr).toContain('GPT-5.1');
  });
});

describe('check command', () => {
  it('accepts the topic-less check command and returns ok for valid state', async () => {
    const fake = createFakeCollaborationRuntime();

    const result = await runCollaborationStateCli({
      argv: [
        '--',
        'check',
        '--active',
        'virtual/active.json',
        '--closed',
        'virtual/closed.json',
        '--comms-dir',
        'virtual/comms',
      ],
      env: {},
      io: fake.runtime.io,
    });

    expect(result).toStrictEqual({ exitCode: 0, stdout: 'ok\n', stderr: '' });
  });
});
