import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, describe, expect, it } from 'vitest';
import {
  listCodexProjectAgentNames,
  parseCodexAgentRegistrations,
  resolveCodexProjectAgent,
} from '../src/core/codex-project-agents';

const tempRoots: string[] = [];

function createTempRepoRoot(): string {
  const repoRoot = mkdtempSync(join(tmpdir(), 'codex-project-agents-'));
  tempRoots.push(repoRoot);
  return repoRoot;
}

function writeFixtureRepo(repoRoot: string): void {
  mkdirSync(join(repoRoot, '.codex', 'agents'), { recursive: true });
  mkdirSync(join(repoRoot, '.agent', 'sub-agents', 'templates'), { recursive: true });
  mkdirSync(join(repoRoot, '.agent', 'sub-agents', 'components', 'personas'), {
    recursive: true,
  });

  writeFileSync(
    join(repoRoot, '.codex', 'config.toml'),
    `[agents."code-reviewer"]
description = "Gateway reviewer."
config_file = ".codex/agents/code-reviewer.toml"

[agents."architecture-reviewer-fred"]
description = "Principles-first architecture reviewer."
config_file = ".codex/agents/architecture-reviewer-fred.toml"
`,
    'utf8',
  );

  writeFileSync(
    join(repoRoot, '.codex', 'agents', 'code-reviewer.toml'),
    `name = "code-reviewer"
description = "Gateway reviewer."
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-reviewer.md\`.

Mode: Observe, analyse and report. Do not modify code.
"""
`,
    'utf8',
  );

  writeFileSync(
    join(repoRoot, '.codex', 'agents', 'architecture-reviewer-fred.toml'),
    `name = "architecture-reviewer-fred"
description = "Principles-first architecture reviewer."
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and apply \`.agent/sub-agents/components/personas/fred.md\` for your persona identity and review lens.

Your first action MUST be to read and internalise \`.agent/sub-agents/templates/architecture-reviewer.md\`.

Mode: Observe, analyse and report. Do not modify code.
"""
`,
    'utf8',
  );

  writeFileSync(
    join(repoRoot, '.agent', 'sub-agents', 'templates', 'code-reviewer.md'),
    '# code reviewer\n',
    'utf8',
  );
  writeFileSync(
    join(repoRoot, '.agent', 'sub-agents', 'templates', 'architecture-reviewer.md'),
    '# architecture reviewer\n',
    'utf8',
  );
  writeFileSync(
    join(repoRoot, '.agent', 'sub-agents', 'components', 'personas', 'fred.md'),
    '# fred\n',
    'utf8',
  );
}

afterEach(() => {
  for (const repoRoot of tempRoots) {
    rmSync(repoRoot, { recursive: true, force: true });
  }
  tempRoots.length = 0;
});

describe('parseCodexAgentRegistrations', () => {
  it('extracts registered agent names and adapter paths from .codex/config.toml text', () => {
    expect(
      parseCodexAgentRegistrations(`[agents."code-reviewer"]
description = "Gateway reviewer."
config_file = ".codex/agents/code-reviewer.toml"
`),
    ).toStrictEqual([
      {
        name: 'code-reviewer',
        description: 'Gateway reviewer.',
        configFile: '.codex/agents/code-reviewer.toml',
      },
    ]);
  });
});

describe('resolveCodexProjectAgent', () => {
  it('resolves settings and canonical file references from the adapter', () => {
    const repoRoot = createTempRepoRoot();
    writeFixtureRepo(repoRoot);

    const resolvedAgent = resolveCodexProjectAgent(repoRoot, 'architecture-reviewer-fred');

    expect(resolvedAgent.name).toBe('architecture-reviewer-fred');
    expect(resolvedAgent.adapterPath).toBe('.codex/agents/architecture-reviewer-fred.toml');
    expect(resolvedAgent.modelReasoningEffort).toBe('high');
    expect(resolvedAgent.sandboxMode).toBe('read-only');
    expect(resolvedAgent.approvalPolicy).toBe('never');
    expect(resolvedAgent.referencedCanonicalFiles).toStrictEqual([
      '.agent/sub-agents/components/personas/fred.md',
      '.agent/sub-agents/templates/architecture-reviewer.md',
    ]);
  });

  it('fails when adapter metadata drifts from the central registry', () => {
    const repoRoot = createTempRepoRoot();
    writeFixtureRepo(repoRoot);
    writeFileSync(
      join(repoRoot, '.codex', 'agents', 'code-reviewer.toml'),
      `name = "code-reviewer"
description = "Wrong description."
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-reviewer.md\`.
"""`,
      'utf8',
    );

    expect(() => resolveCodexProjectAgent(repoRoot, 'code-reviewer')).toThrow(
      /adapter description does not match the registry description/u,
    );
  });

  it('lists the live repo roster, including clerk-reviewer parity for Codex', () => {
    const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

    expect(listCodexProjectAgentNames(repoRoot)).toContain('clerk-reviewer');
    expect(resolveCodexProjectAgent(repoRoot, 'code-reviewer').referencedCanonicalFiles).toContain(
      '.agent/sub-agents/templates/code-reviewer.md',
    );
  });
});
