import { describe, expect, it } from 'vitest';

import {
  GUARD_ROUTING_SHIM,
  GUARD_COMMAND_MARKER,
  findUnroutedGuardCommands,
} from './validate-pretooluse-guard-routing-helpers.js';

const routedBash = `node "\${CLAUDE_PROJECT_DIR}/${GUARD_ROUTING_SHIM}" agent-tools/dist/src/hook-policy/check-blocked-patterns.js`;
const routedContent = `node "\${CLAUDE_PROJECT_DIR}/${GUARD_ROUTING_SHIM}" agent-tools/dist/src/hook-policy/check-blocked-content.js`;
const directBash =
  'node "${CLAUDE_PROJECT_DIR}/agent-tools/dist/src/hook-policy/check-blocked-patterns.js"';

describe('findUnroutedGuardCommands', () => {
  it('returns nothing when every dist guard command routes through the shim', () => {
    expect(findUnroutedGuardCommands([routedBash, routedContent])).toStrictEqual([]);
  });

  it('flags a dist guard command that invokes node directly (no shim)', () => {
    expect(findUnroutedGuardCommands([directBash])).toStrictEqual([directBash]);
  });

  it('ignores commands that do not invoke a hook-policy guard', () => {
    const commands = [
      '.claude/hooks/_lib/log-hook-errors.sh .claude/hooks/sonar-secrets/build-scripts/pretool-secrets.sh',
      routedBash,
    ];

    expect(findUnroutedGuardCommands(commands)).toStrictEqual([]);
  });

  it('flags only the unrouted guard among a mixed set', () => {
    expect(findUnroutedGuardCommands([routedBash, directBash, 'echo hi'])).toStrictEqual([
      directBash,
    ]);
  });

  it('exposes the marker and shim substrings it keys on', () => {
    expect(GUARD_COMMAND_MARKER).toBe('hook-policy/check-blocked');
    expect(GUARD_ROUTING_SHIM).toBe('.claude/hooks/run-pretooluse-guard.mjs');
  });
});
