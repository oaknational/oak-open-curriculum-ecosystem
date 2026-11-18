import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  formatHumanReadableAgent,
  formatResolutionFailure,
} from '../src/bin/codex-reviewer-resolve';
import type { CodexProjectAgent } from '../src/core/codex-project-agents';
import { inMemorySyncFileSystem } from '../src/core/test-helpers/in-memory-sync-file-system';

const ROOT = join('/', 'repo');

/** A repository whose Codex registry holds the given text. */
const repoWithRegistry = (registry: string) =>
  inMemorySyncFileSystem({ files: { [join(ROOT, '.codex', 'config.toml')]: registry } });

describe('formatResolutionFailure', () => {
  it('adds available agents when the registry can still be enumerated', () => {
    const repo = repoWithRegistry(`[agents."code-expert"]
description = "Gateway reviewer."
config_file = "agents/code-expert.toml"
`);

    expect(formatResolutionFailure(ROOT, 'Broken adapter.', repo)).toContain(
      'Available agents: code-expert',
    );
  });

  it('falls back to the original error when the registry itself cannot be parsed', () => {
    const repo = repoWithRegistry(`[agents."code-expert"]
config_file = "agents/code-expert.toml"
`);

    expect(formatResolutionFailure(ROOT, 'Original failure.', repo)).toBe('Original failure.');
  });

  it('falls back to the original error when there is no registry at all', () => {
    expect(formatResolutionFailure(ROOT, 'Original failure.', inMemorySyncFileSystem({}))).toBe(
      'Original failure.',
    );
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
