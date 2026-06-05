import { describe, expect, it } from 'vitest';

import {
  decideMissingGuardArtifact,
  GUARD_REBUILD_HINT,
  resolveGuardExitCode,
} from './guard-runner-decisions.js';

describe('resolveGuardExitCode', () => {
  it('passes a clean allow (exit 0, no signal) through unchanged', () => {
    expect(resolveGuardExitCode(0, null)).toBe(0);
  });

  it('passes the guard fail-closed verdict (exit 2) through unchanged', () => {
    expect(resolveGuardExitCode(2, null)).toBe(2);
  });

  it('blocks (2) when the guard is killed by a signal — never coerces a null status to 0', () => {
    expect(resolveGuardExitCode(null, 'SIGKILL')).toBe(2);
  });

  it('blocks (2) on exit 1 — a broken/partial build (failed module load) must not fail open', () => {
    expect(resolveGuardExitCode(1, null)).toBe(2);
  });

  it.each([137, 3, -1])('blocks (2) on any other non-{0,2} exit code: %i', (code) => {
    expect(resolveGuardExitCode(code, null)).toBe(2);
  });

  it('blocks (2) when neither a code nor a signal is available', () => {
    expect(resolveGuardExitCode(null, null)).toBe(2);
  });
});

describe('decideMissingGuardArtifact', () => {
  const guardRelative = 'agent-tools/dist/src/hook-policy/check-blocked-patterns.js';

  it('fails OPEN (exit 0) so an unbuilt worktree can run the build instead of being bricked', () => {
    expect(decideMissingGuardArtifact(guardRelative).exitCode).toBe(0);
  });

  it('warns loudly: the call is marked UNGUARDED', () => {
    expect(decideMissingGuardArtifact(guardRelative).warning).toContain('UNGUARDED');
  });

  // Two distinct paths prove the artefact name is interpolated, not hardcoded.
  it.each([
    'agent-tools/dist/src/hook-policy/check-blocked-patterns.js',
    'agent-tools/dist/src/hook-policy/check-blocked-content.js',
  ])('warns loudly: names which guard artefact is missing (%s)', (path) => {
    expect(decideMissingGuardArtifact(path).warning).toContain(path);
  });

  it('warns loudly: embeds the rebuild hint so recovery is actionable', () => {
    expect(decideMissingGuardArtifact(guardRelative).warning).toContain(GUARD_REBUILD_HINT);
  });

  it('keeps the rebuild hint actionable: it names the build command', () => {
    expect(GUARD_REBUILD_HINT).toContain('pnpm agent-tools:build');
  });
});
