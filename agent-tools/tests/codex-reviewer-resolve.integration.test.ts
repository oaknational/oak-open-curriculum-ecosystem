import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import {
  formatHumanReadableAgent,
  formatResolutionFailure,
} from '../src/bin/codex-reviewer-resolve';
import type { CodexProjectAgent } from '../src/core/codex-project-agents';

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
      `[agents."code-expert"]
description = "Gateway reviewer."
config_file = "agents/code-expert.toml"
`,
      'utf8',
    );

    expect(formatResolutionFailure(repoRoot, 'Broken adapter.')).toContain(
      'Available agents: code-expert',
    );
  });

  it('falls back to the original error when the registry itself cannot be parsed', () => {
    const repoRoot = createTempRepoRoot();
    mkdirSync(join(repoRoot, '.codex'), { recursive: true });
    writeFileSync(
      join(repoRoot, '.codex', 'config.toml'),
      `[agents."code-expert"]
config_file = "agents/code-expert.toml"
`,
      'utf8',
    );

    expect(formatResolutionFailure(repoRoot, 'Original failure.')).toBe('Original failure.');
  });
});

describe('formatHumanReadableAgent', () => {
  const resolvedAgent: CodexProjectAgent = {
    name: 'cricket-judgement-low',
    description: 'Contextual judgement at low effort.',
    configPath: '.codex/config.toml',
    adapterPath: '.codex/agents/cricket-judgement-low.toml',
    model: 'gpt-5.6-sol',
    modelReasoningEffort: 'low',
    sandboxMode: 'read-only',
    approvalPolicy: 'never',
    developerInstructions: 'Read `.agent/sub-agents/cricket-judgement.md`.',
    referencedCanonicalFiles: ['.agent/sub-agents/cricket-judgement.md'],
  };

  it('includes the explicitly pinned model in the human-readable mode line', () => {
    expect(formatHumanReadableAgent(resolvedAgent)).toContain(
      'mode: model=gpt-5.6-sol, reasoning=low, sandbox=read-only, approval=never',
    );
  });

  it('labels an omitted model as inherited', () => {
    expect(formatHumanReadableAgent({ ...resolvedAgent, model: null })).toContain(
      'mode: model=inherited, reasoning=low, sandbox=read-only, approval=never',
    );
  });
});
