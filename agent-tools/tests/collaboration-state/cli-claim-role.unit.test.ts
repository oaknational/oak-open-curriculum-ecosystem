/**
 * Covers the optional `--role` flag on `claims open` (session-role marker,
 * owner-directed 2026-06-12): the parsed argv carries the flag through
 * `createClaimFromOptions` onto the claim, and a roleless invocation omits
 * the field entirely (additive-extension discipline — absent, not null).
 *
 * Built through `parseOptions` rather than a hand-assembled Options value so
 * the test also proves `role` is registered in the value-taking flag
 * whitelist. The dispatch-time allowlist is a second, separate gate —
 * covered by `cli-claim-role.integration.test.ts`.
 */
import { describe, expect, it } from 'vitest';

import { createClaimFromOptions } from '../../src/collaboration-state/cli-claim-commands';
import { parseOptions } from '../../src/collaboration-state/cli-options';
import { type CollaborationAgentId } from '../../src/collaboration-state/types';

const woodland: CollaborationAgentId = {
  agent_name: 'Woodland Creeping Petal',
  platform: 'codex',
  model: 'GPT-5',
  session_id_prefix: '019dd3',
};

function openClaimArgv(extra: readonly string[]): readonly string[] {
  return [
    '--',
    'claims',
    'open',
    '--active',
    'active.json',
    '--thread',
    'agentic-engineering-enhancements',
    '--area-kind',
    'files',
    '--file',
    'agent-tools/src/collaboration-state/cli-claim-commands.ts',
    '--intent',
    'Exercise role-bearing claim construction.',
    '--now',
    '2026-06-12T15:00:00Z',
    '--claim-id',
    '44444444-4444-4444-8444-444444444444',
    ...extra,
  ];
}

describe('claims open --role', () => {
  it('carries the session role onto the claim when --role is passed', () => {
    const opened = createClaimFromOptions(
      parseOptions(openClaimArgv(['--role', 'director'])),
      woodland,
    );

    expect(opened).toMatchObject({
      claim_id: '44444444-4444-4444-8444-444444444444',
      role: 'director',
    });
  });

  it('omits the role field entirely when --role is not passed', () => {
    const opened = createClaimFromOptions(parseOptions(openClaimArgv([])), woodland);

    expect('role' in opened).toBe(false);
  });
});
