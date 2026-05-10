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
    `[agents."code-expert"]
description = "Gateway reviewer."
config_file = "agents/code-expert.toml"

[agents."architecture-expert-fred"]
description = "Principles-first architecture reviewer."
config_file = "agents/architecture-expert-fred.toml"
`,
    'utf8',
  );

  writeFileSync(
    join(repoRoot, '.codex', 'agents', 'code-expert.toml'),
    `name = "code-expert"
description = "Gateway reviewer."
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-expert.md\`.

Mode: Observe, analyse and report. Do not modify code.
"""
`,
    'utf8',
  );

  writeFileSync(
    join(repoRoot, '.codex', 'agents', 'architecture-expert-fred.toml'),
    `name = "architecture-expert-fred"
description = "Principles-first architecture reviewer."
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and apply \`.agent/sub-agents/components/personas/fred.md\` for your persona identity and review lens.

Your first action MUST be to read and internalise \`.agent/sub-agents/templates/architecture-expert.md\`.

Mode: Observe, analyse and report. Do not modify code.
"""
`,
    'utf8',
  );

  writeFileSync(
    join(repoRoot, '.agent', 'sub-agents', 'templates', 'code-expert.md'),
    '# code reviewer\n',
    'utf8',
  );
  writeFileSync(
    join(repoRoot, '.agent', 'sub-agents', 'templates', 'architecture-expert.md'),
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
      parseCodexAgentRegistrations(`[agents."code-expert"]
description = "Gateway reviewer."
config_file = "agents/code-expert.toml"
`),
    ).toStrictEqual([
      {
        name: 'code-expert',
        description: 'Gateway reviewer.',
        configFile: 'agents/code-expert.toml',
      },
    ]);
  });
});

describe('resolveCodexProjectAgent', () => {
  it('resolves settings and canonical file references from the adapter', () => {
    const repoRoot = createTempRepoRoot();
    writeFixtureRepo(repoRoot);

    const resolvedAgent = resolveCodexProjectAgent(repoRoot, 'architecture-expert-fred');

    expect(resolvedAgent.name).toBe('architecture-expert-fred');
    expect(resolvedAgent.adapterPath).toBe('.codex/agents/architecture-expert-fred.toml');
    expect(resolvedAgent.modelReasoningEffort).toBe('high');
    expect(resolvedAgent.sandboxMode).toBe('read-only');
    expect(resolvedAgent.approvalPolicy).toBe('never');
    expect(resolvedAgent.referencedCanonicalFiles).toStrictEqual([
      '.agent/sub-agents/components/personas/fred.md',
      '.agent/sub-agents/templates/architecture-expert.md',
    ]);
  });

  it('rejects registry config_file values that repeat the repo-root .codex directory', () => {
    const repoRoot = createTempRepoRoot();
    writeFixtureRepo(repoRoot);
    writeFileSync(
      join(repoRoot, '.codex', 'config.toml'),
      `[agents."code-expert"]
description = "Gateway reviewer."
config_file = ".codex/agents/code-expert.toml"
`,
      'utf8',
    );

    expect(() => resolveCodexProjectAgent(repoRoot, 'code-expert')).toThrow(
      /missing adapter \.codex\/\.codex\/agents\/code-expert\.toml/u,
    );
  });

  it('fails when adapter metadata drifts from the central registry', () => {
    const repoRoot = createTempRepoRoot();
    writeFixtureRepo(repoRoot);
    writeFileSync(
      join(repoRoot, '.codex', 'agents', 'code-expert.toml'),
      `name = "code-expert"
description = "Wrong description."
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-expert.md\`.
"""`,
      'utf8',
    );

    expect(() => resolveCodexProjectAgent(repoRoot, 'code-expert')).toThrow(
      /adapter description does not match the registry description/u,
    );
  });

  it('lists the live repo roster, including clerk-expert parity for Codex', () => {
    const repoRoot = fileURLToPath(new URL('../..', import.meta.url));

    expect(listCodexProjectAgentNames(repoRoot)).toContain('clerk-expert');
    expect(resolveCodexProjectAgent(repoRoot, 'code-expert').referencedCanonicalFiles).toContain(
      '.agent/sub-agents/templates/code-expert.md',
    );
  });
});
