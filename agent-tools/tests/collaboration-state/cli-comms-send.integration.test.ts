import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import { runCollaborationStateCli } from '../../src/collaboration-state';
import { createCapturingCoordinationHomeResolver } from './fake-collaboration-runtime-fixtures';
import { createFakeCollaborationRuntime } from './fake-collaboration-runtime';

const LINKED = '/workspace/oak-worktrees/lane-b';
const PRIMARY = '/workspace/oak';
const EXPLICIT_COMMS_DIR = '/explicit/comms';
// Derived defaults are host-joined onto the home, so these expectations are
// built in host form (identical to the POSIX literals on POSIX).
const CANONICAL_ACTIVE = join(PRIMARY, '.agent/state/collaboration/active-claims.json');
const CANONICAL_LOG = join(PRIMARY, '.agent/state/collaboration/shared-comms-log.md');

const senderEnv = {
  OAK_AGENT_IDENTITY_OVERRIDE: 'Juniper crosses Vale',
  PRACTICE_AGENT_SESSION_ID_CLAUDE: '7c3f11',
} as const;

const sendArgs = [
  '--',
  'comms',
  'send',
  '--now',
  '2026-07-29T12:00:00Z',
  '--title',
  'Resolver boundary regression',
  '--body',
  'Exercise comms send path resolution.',
  '--event-id',
  'resolver-boundary-regression',
  '--platform',
  'claude-code',
  '--model',
  'claude-fable-5',
] as const;

describe('comms send path defaults', () => {
  it('does not resolve git when comms-dir, output, and active are all explicit', async () => {
    const resolver = createCapturingCoordinationHomeResolver('/unexpected-coordination-home');
    const fake = createFakeCollaborationRuntime({
      cwd: LINKED,
      resolveCoordinationHome: resolver.resolve,
    });

    const result = await runCollaborationStateCli({
      argv: [
        ...sendArgs,
        '--comms-dir',
        EXPLICIT_COMMS_DIR,
        '--output',
        '/explicit/shared-comms-log.md',
        '--active',
        '/explicit/active-claims.json',
      ],
      env: senderEnv,
      io: fake.runtime.io,
      cwd: fake.runtime.cwd,
      resolveCoordinationHome: fake.runtime.resolveCoordinationHome,
    });

    expect(result.exitCode).toBe(0);
    expect(resolver.calls).toStrictEqual([]);
    expect(fake.readActiveClaimsPaths()).toStrictEqual(['/explicit/active-claims.json']);
    expect(fake.readCommsEvents(EXPLICIT_COMMS_DIR)).toHaveLength(1);
    expect(JSON.parse(result.stdout)).toMatchObject({
      // The event path is host-joined from the comms dir; the shared log path
      // is echoed verbatim and stays a literal.
      event_path: join(EXPLICIT_COMMS_DIR, 'resolver-boundary-regression.json'),
      shared_log_path: '/explicit/shared-comms-log.md',
    });
  });

  it('derives missing output and active defaults from the canonical home', async () => {
    const resolver = createCapturingCoordinationHomeResolver(PRIMARY);
    const fake = createFakeCollaborationRuntime({
      cwd: LINKED,
      resolveCoordinationHome: resolver.resolve,
    });

    const result = await runCollaborationStateCli({
      argv: [...sendArgs, '--comms-dir', EXPLICIT_COMMS_DIR],
      env: senderEnv,
      io: fake.runtime.io,
      cwd: fake.runtime.cwd,
      resolveCoordinationHome: fake.runtime.resolveCoordinationHome,
    });

    expect(result.exitCode).toBe(0);
    expect(resolver.calls).toStrictEqual([LINKED]);
    expect(fake.readActiveClaimsPaths()).toStrictEqual([CANONICAL_ACTIVE]);
    expect(fake.readCommsEvents(EXPLICIT_COMMS_DIR)).toHaveLength(1);
    expect(fake.readTextFile(CANONICAL_LOG)).toBeDefined();
    expect(JSON.parse(result.stdout)).toMatchObject({
      event_path: join(EXPLICIT_COMMS_DIR, 'resolver-boundary-regression.json'),
      shared_log_path: CANONICAL_LOG,
    });
  });
});
