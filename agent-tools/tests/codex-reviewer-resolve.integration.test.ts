import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { formatResolutionFailure } from '../src/bin/codex-reviewer-resolve';

const tempRoots: string[] = [];

function createTempRepoRoot(): string {
  const repoRoot = mkdtempSync(join(tmpdir(), 'codex-reviewer-resolve-'));
  tempRoots.push(repoRoot);
  return repoRoot;
}

afterEach(() => {
  for (const repoRoot of tempRoots) {
    rmSync(repoRoot, { recursive: true, force: true });
  }
  tempRoots.length = 0;
});

describe('formatResolutionFailure', () => {
  it('adds available agents when the registry can still be enumerated', () => {
    const repoRoot = createTempRepoRoot();
    mkdirSync(join(repoRoot, '.codex'), { recursive: true });
    writeFileSync(
      join(repoRoot, '.codex', 'config.toml'),
      `[agents."code-reviewer"]
description = "Gateway reviewer."
config_file = ".codex/agents/code-reviewer.toml"
`,
      'utf8',
    );

    expect(formatResolutionFailure(repoRoot, 'Broken adapter.')).toContain(
      'Available agents: code-reviewer',
    );
  });

  it('falls back to the original error when the registry itself cannot be parsed', () => {
    const repoRoot = createTempRepoRoot();
    mkdirSync(join(repoRoot, '.codex'), { recursive: true });
    writeFileSync(
      join(repoRoot, '.codex', 'config.toml'),
      `[agents."code-reviewer"]
config_file = ".codex/agents/code-reviewer.toml"
`,
      'utf8',
    );

    expect(formatResolutionFailure(repoRoot, 'Original failure.')).toBe('Original failure.');
  });
});
