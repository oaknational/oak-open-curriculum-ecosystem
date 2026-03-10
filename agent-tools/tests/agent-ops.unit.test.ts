import { describe, expect, it } from 'vitest';

import { detectPhaseFromEvents, resolveDiffCwd } from '../src/core/agent-ops';

describe('agent ops', () => {
  it('detects testing phase from recent pnpm commands', () => {
    const phase = detectPhaseFromEvents({
      stopReason: '',
      toolNames: ['Read', 'Bash'],
      bashCommands: ['pnpm test'],
    });
    expect(phase).toBe('testing');
  });

  it('detects done PR phase', () => {
    const phase = detectPhaseFromEvents({
      stopReason: 'end_turn',
      toolNames: ['Bash'],
      bashCommands: ['gh pr create --title x'],
    });
    expect(phase).toBe('done (PR)');
  });

  it('resolves main diff cwd to repo root', () => {
    const cwd = resolveDiffCwd({
      repoRoot: '/repo',
      requestedAgentId: undefined,
      resolvedWorktreePath: null,
    });

    expect(cwd).toBe('/repo');
  });

  it('resolves agent diff cwd to worktree path', () => {
    const cwd = resolveDiffCwd({
      repoRoot: '/repo',
      requestedAgentId: 'abc',
      resolvedWorktreePath: '/repo/.claude/worktrees/agent-abc',
    });

    expect(cwd).toBe('/repo/.claude/worktrees/agent-abc');
  });
});
