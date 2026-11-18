import { join } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  listCodexProjectAgentNames,
  parseCodexAgentRegistrations,
  resolveCodexProjectAgent,
} from '../src/core/codex-project-agents';
import { inMemorySyncFileSystem } from '../src/core/test-helpers/in-memory-sync-file-system';

const ROOT = join('/', 'repo');

/** A path under the fixture repository root. */
const at = (...segments: readonly string[]): string => join(ROOT, ...segments);

const CODE_EXPERT_ADAPTER = `name = "code-expert"
description = "Gateway reviewer."
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-expert.md\`.

Mode: Observe, analyse and report. Do not modify code.
"""
`;

/** A registry of two agents and the adapters and canonical files they name. */
const FIXTURE_FILES: Readonly<Record<string, string>> = {
  [at('.codex', 'config.toml')]: `[agents."code-expert"]
description = "Gateway reviewer."
config_file = "agents/code-expert.toml"

[agents."architecture-expert-fred"]
description = "Principles-first architecture reviewer."
config_file = "agents/architecture-expert-fred.toml"
`,
  [at('.codex', 'agents', 'code-expert.toml')]: CODE_EXPERT_ADAPTER,
  [at('.codex', 'agents', 'architecture-expert-fred.toml')]: `name = "architecture-expert-fred"
description = "Principles-first architecture reviewer."
model = "gpt-5.6-terra"
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and apply \`.agent/sub-agents/components/personas/fred.md\` for your persona identity and review lens.

Your first action MUST be to read and internalise \`.agent/sub-agents/templates/architecture-expert.md\`.

Mode: Observe, analyse and report. Do not modify code.
"""
`,
  [at('.agent', 'sub-agents', 'templates', 'code-expert.md')]: '# code reviewer\n',
  [at('.agent', 'sub-agents', 'templates', 'architecture-expert.md')]: '# architecture reviewer\n',
  [at('.agent', 'sub-agents', 'components', 'personas', 'fred.md')]: '# fred\n',
};

/** The fixture repository, with any files overridden. */
const fixtureRepo = (overrides: Readonly<Record<string, string>> = {}) =>
  inMemorySyncFileSystem({ files: { ...FIXTURE_FILES, ...overrides } });

/** The fixture repository with the code-expert adapter replaced. */
const withCodeExpertAdapter = (adapter: string) =>
  fixtureRepo({ [at('.codex', 'agents', 'code-expert.toml')]: adapter });

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

describe('listCodexProjectAgentNames', () => {
  it('lists the registered agents in name order', () => {
    expect(listCodexProjectAgentNames(ROOT, fixtureRepo())).toStrictEqual([
      'architecture-expert-fred',
      'code-expert',
    ]);
  });

  it('refuses a repository without the registry, naming it', () => {
    expect(() => listCodexProjectAgentNames(ROOT, inMemorySyncFileSystem({}))).toThrow(
      /Missing Codex project-agent registry: \.codex\/config\.toml/u,
    );
  });
});

describe('resolveCodexProjectAgent', () => {
  it('resolves settings and canonical file references from the adapter', () => {
    const resolvedAgent = resolveCodexProjectAgent(ROOT, 'architecture-expert-fred', fixtureRepo());

    expect(resolvedAgent.name).toBe('architecture-expert-fred');
    expect(resolvedAgent.adapterPath).toBe('.codex/agents/architecture-expert-fred.toml');
    expect(resolvedAgent.model).toBe('gpt-5.6-terra');
    expect(resolvedAgent.modelReasoningEffort).toBe('high');
    expect(resolvedAgent.sandboxMode).toBe('read-only');
    expect(resolvedAgent.approvalPolicy).toBe('never');
    expect(resolvedAgent.referencedCanonicalFiles).toStrictEqual([
      '.agent/sub-agents/components/personas/fred.md',
      '.agent/sub-agents/templates/architecture-expert.md',
    ]);
  });

  it('reports an unpinned role without inventing model metadata', () => {
    expect(resolveCodexProjectAgent(ROOT, 'code-expert', fixtureRepo()).model).toBeNull();
  });

  it('does not invent an optional model pin from developer instructions', () => {
    const repo = withCodeExpertAdapter(`name = "code-expert"
description = "Gateway reviewer."
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-expert.md\`.
model = "gpt-5.6-sol"
"""`);

    expect(resolveCodexProjectAgent(ROOT, 'code-expert', repo).model).toBeNull();
  });

  it('does not resolve developer instructions nested inside another multiline TOML value', () => {
    const repo = withCodeExpertAdapter(`name = "code-expert"
description = "Gateway reviewer."
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

notes = '''
developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-expert.md\`.
"""
'''
`);

    expect(() => resolveCodexProjectAgent(ROOT, 'code-expert', repo)).toThrow(
      /\.codex\/agents\/code-expert\.toml is missing a top-level developer_instructions string/u,
    );
  });

  it('does not satisfy a required effort pin from developer instructions', () => {
    const repo = withCodeExpertAdapter(`name = "code-expert"
description = "Gateway reviewer."
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-expert.md\`.
model_reasoning_effort = "high"
"""`);

    expect(() => resolveCodexProjectAgent(ROOT, 'code-expert', repo)).toThrow(
      /missing required TOML key 'model_reasoning_effort'/u,
    );
  });

  it('rejects registry config_file values that repeat the repo-root .codex directory', () => {
    const repo = fixtureRepo({
      [at('.codex', 'config.toml')]: `[agents."code-expert"]
description = "Gateway reviewer."
config_file = ".codex/agents/code-expert.toml"
`,
    });

    expect(() => resolveCodexProjectAgent(ROOT, 'code-expert', repo)).toThrow(
      /missing adapter \.codex\/\.codex\/agents\/code-expert\.toml/u,
    );
  });

  it('fails when adapter metadata drifts from the central registry', () => {
    const repo = withCodeExpertAdapter(`name = "code-expert"
description = "Wrong description."
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-expert.md\`.
"""`);

    expect(() => resolveCodexProjectAgent(ROOT, 'code-expert', repo)).toThrow(
      /adapter description does not match the registry description/u,
    );
  });

  it('fails when a referenced canonical file is absent, naming it', () => {
    const repo = inMemorySyncFileSystem({
      files: Object.fromEntries(
        Object.entries(FIXTURE_FILES).filter(
          ([filePath]) => filePath !== at('.agent', 'sub-agents', 'templates', 'code-expert.md'),
        ),
      ),
    });

    expect(() => resolveCodexProjectAgent(ROOT, 'code-expert', repo)).toThrow(
      /references missing canonical file \.agent\/sub-agents\/templates\/code-expert\.md/u,
    );
  });
});
