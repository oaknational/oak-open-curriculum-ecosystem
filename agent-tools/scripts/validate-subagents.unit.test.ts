import { describe, expect, it } from 'vitest';
import {
  extractCanonicalPaths,
  getCodexAdapterValidation,
  getCodexRegistrationValidation,
  parseCodexRegistrations,
  readCodexDeveloperInstructions,
  readTomlBasicStringValue,
  resolveCodexConfigFilePath,
} from './validate-subagents-helpers.js';

describe('parseCodexRegistrations', () => {
  it('extracts agent names, descriptions, and adapter paths from Codex config text', () => {
    expect(
      parseCodexRegistrations(`[agents."code-expert"]
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

describe('Codex subagent helper coverage', () => {
  it('resolves config_file relative to .codex/config.toml', () => {
    expect(resolveCodexConfigFilePath('agents/code-expert.toml')).toBe(
      '.codex/agents/code-expert.toml',
    );
  });

  it('accepts Codex-native relative adapter paths in registrations', () => {
    const { issues } = getCodexRegistrationValidation({
      registrations: [
        {
          name: 'code-expert',
          description: 'Gateway reviewer.',
          configFile: 'agents/code-expert.toml',
        },
      ],
      fileExists: (filePath) => filePath === '.codex/agents/code-expert.toml',
    });

    expect(issues).toStrictEqual([]);
  });

  it('rejects repo-root adapter paths that repeat .codex inside config_file', () => {
    const { issues } = getCodexRegistrationValidation({
      registrations: [
        {
          name: 'code-expert',
          description: 'Gateway reviewer.',
          configFile: '.codex/agents/code-expert.toml',
        },
      ],
      fileExists: (filePath) => filePath === '.codex/agents/code-expert.toml',
    });

    expect(issues).toContain(
      '.codex/config.toml: agent "code-expert" references missing adapter .codex/.codex/agents/code-expert.toml',
    );
  });

  it('reports missing adapter files from Codex registrations', () => {
    const { issues } = getCodexRegistrationValidation({
      registrations: [
        {
          name: 'code-expert',
          description: 'Gateway reviewer.',
          configFile: 'agents/code-expert.toml',
        },
      ],
      fileExists: () => false,
    });

    expect(issues).toContain(
      '.codex/config.toml: agent "code-expert" references missing adapter .codex/agents/code-expert.toml',
    );
  });

  it('reports missing required settings and missing developer instructions in Codex adapters', () => {
    const { issues } = getCodexAdapterValidation({
      codexAdapterFile: '.codex/agents/code-expert.toml',
      registeredAgent: {
        name: 'code-expert',
        description: 'Gateway reviewer.',
        configFile: 'agents/code-expert.toml',
      },
      content: 'sandbox_mode = "read-only"\napproval_policy = "never"\n',
    });

    expect(issues).toContain('.codex/agents/code-expert.toml: missing required TOML key "name"');
    expect(issues).toContain(
      '.codex/agents/code-expert.toml: missing required TOML key "description"',
    );
    expect(issues).toContain(
      '.codex/agents/code-expert.toml: model_reasoning_effort must be "high" (found: missing)',
    );
    expect(issues).toContain(
      '.codex/agents/code-expert.toml: missing triple-quoted developer_instructions block',
    );
  });

  it('reports adapter metadata drift from the central registry', () => {
    const { issues } = getCodexAdapterValidation({
      codexAdapterFile: '.codex/agents/code-expert.toml',
      registeredAgent: {
        name: 'code-expert',
        description: 'Gateway reviewer.',
        configFile: 'agents/code-expert.toml',
      },
      content: `name = "different-expert"
description = "Different description."
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-expert.md\`.
"""`,
    });

    expect(issues).toContain(
      '.codex/agents/code-expert.toml: name must match filename "code-expert" (found: different-expert)',
    );
    expect(issues).toContain(
      '.codex/agents/code-expert.toml: name "different-expert" must match .codex/config.toml registration "code-expert"',
    );
    expect(issues).toContain(
      '.codex/agents/code-expert.toml: description must match .codex/config.toml registration for "code-expert"',
    );
  });

  it('extracts canonical template paths from developer instructions', () => {
    const developerInstructions = readCodexDeveloperInstructions(`developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-expert.md\`.
Read and apply \`.agent/sub-agents/components/personas/fred.md\`.
"""`);

    expect(readTomlBasicStringValue('approval_policy = "never"', 'approval_policy')).toBe('never');
    expect(extractCanonicalPaths(developerInstructions)).toStrictEqual([
      '.agent/sub-agents/components/personas/fred.md',
      '.agent/sub-agents/templates/code-expert.md',
    ]);
  });
});
