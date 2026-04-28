import { describe, expect, it } from 'vitest';

import { HELP_TEXT, parseCliArgs } from '../src/bin/claude-agent-ops-cli';
import { detectPhaseFromEvents, isValidAgentId, resolveDiffCwd } from '../src/core/agent-ops';

describe('agent ops', () => {
  it('detects testing phase from recent pnpm commands', () => {
    const phase = detectPhaseFromEvents({
      stopReason: '',
      toolNames: ['Read', 'Bash'],
      bashCommands: ['pnpm test'],
    });
    expect(phase).toBe('testing');
  });

  it('does not report stale testing phase from old commands', () => {
    const phase = detectPhaseFromEvents({
      stopReason: '',
      toolNames: ['Read', 'Edit'],
      bashCommands: ['pnpm test', 'echo done', 'echo done', 'echo done', 'echo done'],
    });
    expect(phase).toBe('implementing');
  });

  it('detects done PR phase', () => {
    const phase = detectPhaseFromEvents({
      stopReason: 'end_turn',
      toolNames: ['Bash'],
      bashCommands: ['gh pr create --title x'],
    });
    expect(phase).toBe('done (PR)');
  });

  it('detects creating PR phase from recent push', () => {
    const phase = detectPhaseFromEvents({
      stopReason: '',
      toolNames: ['Bash'],
      bashCommands: ['git push origin branch'],
    });
    expect(phase).toBe('creating PR');
  });

  it('keeps creating PR phase when push command is older than recent window', () => {
    const phase = detectPhaseFromEvents({
      stopReason: '',
      toolNames: ['Bash'],
      bashCommands: ['git push origin branch', 'echo 1', 'echo 2', 'echo 3', 'echo 4', 'echo 5'],
    });
    expect(phase).toBe('creating PR');
  });

  it('detects committing phase from recent commit', () => {
    const phase = detectPhaseFromEvents({
      stopReason: '',
      toolNames: ['Bash'],
      bashCommands: ['git commit -m "msg"'],
    });
    expect(phase).toBe('committing');
  });

  it('keeps committing phase when commit command is older than recent window', () => {
    const phase = detectPhaseFromEvents({
      stopReason: '',
      toolNames: ['Bash'],
      bashCommands: ['git commit -m "msg"', 'echo 1', 'echo 2', 'echo 3', 'echo 4', 'echo 5'],
    });
    expect(phase).toBe('committing');
  });

  it('detects done phase without PR create command', () => {
    const phase = detectPhaseFromEvents({
      stopReason: 'end_turn',
      toolNames: ['Read'],
      bashCommands: ['echo done'],
    });
    expect(phase).toBe('done');
  });

  it('defaults to researching when no phase signals are present', () => {
    const phase = detectPhaseFromEvents({
      stopReason: '',
      toolNames: ['Read'],
      bashCommands: ['echo idle'],
    });
    expect(phase).toBe('researching');
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

  it('falls back to repo root when requested agent has no worktree', () => {
    const cwd = resolveDiffCwd({
      repoRoot: '/repo',
      requestedAgentId: 'abc',
      resolvedWorktreePath: null,
    });

    expect(cwd).toBe('/repo');
  });

  it('parses help aliases without invoking the CLI process', () => {
    expect(parseCliArgs(['help']).command).toBe('help');
    expect(parseCliArgs(['--help']).command).toBe('help');
    expect(parseCliArgs(['-h']).command).toBe('help');
    expect(HELP_TEXT).toContain('claude-agent-ops');
  });

  it('validates agent ids without inspecting the filesystem', () => {
    expect(isValidAgentId('abc123')).toBe(true);
    expect(isValidAgentId('../bad')).toBe(false);
  });
});
