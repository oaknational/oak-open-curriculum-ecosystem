import { describe, expect, it } from 'vitest';
import {
  extractCanonicalPaths,
  getCodexAdapterValidation,
  getCodexRegistrationValidation,
  parseCodexRegistrations,
  readCodexDeveloperInstructions,
  readTomlBasicStringValue,
} from './validate-subagents-helpers.mjs';

describe('parseCodexRegistrations', () => {
  it('extracts agent names, descriptions, and adapter paths from Codex config text', () => {
    expect(
      parseCodexRegistrations(`[agents."code-reviewer"]
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

describe('Codex subagent helper coverage', () => {
  it('reports missing adapter files from Codex registrations', () => {
    const { issues } = getCodexRegistrationValidation({
      registrations: [
        {
          name: 'code-reviewer',
          description: 'Gateway reviewer.',
          configFile: '.codex/agents/code-reviewer.toml',
        },
      ],
      fileExists: () => false,
    });

    expect(issues).toContain(
      '.codex/config.toml: agent "code-reviewer" references missing adapter .codex/agents/code-reviewer.toml',
    );
  });

  it('reports missing required settings and missing developer instructions in Codex adapters', () => {
    const { issues } = getCodexAdapterValidation({
      codexAdapterFile: '.codex/agents/code-reviewer.toml',
      registeredAgent: {
        name: 'code-reviewer',
        description: 'Gateway reviewer.',
        configFile: '.codex/agents/code-reviewer.toml',
      },
      content: 'sandbox_mode = "read-only"\napproval_policy = "never"\n',
    });

    expect(issues).toContain('.codex/agents/code-reviewer.toml: missing required TOML key "name"');
    expect(issues).toContain(
      '.codex/agents/code-reviewer.toml: missing required TOML key "description"',
    );
    expect(issues).toContain(
      '.codex/agents/code-reviewer.toml: model_reasoning_effort must be "high" (found: missing)',
    );
    expect(issues).toContain(
      '.codex/agents/code-reviewer.toml: missing triple-quoted developer_instructions block',
    );
  });

  it('reports adapter metadata drift from the central registry', () => {
    const { issues } = getCodexAdapterValidation({
      codexAdapterFile: '.codex/agents/code-reviewer.toml',
      registeredAgent: {
        name: 'code-reviewer',
        description: 'Gateway reviewer.',
        configFile: '.codex/agents/code-reviewer.toml',
      },
      content: `name = "different-reviewer"
description = "Different description."
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-reviewer.md\`.
"""`,
    });

    expect(issues).toContain(
      '.codex/agents/code-reviewer.toml: name must match filename "code-reviewer" (found: different-reviewer)',
    );
    expect(issues).toContain(
      '.codex/agents/code-reviewer.toml: name "different-reviewer" must match .codex/config.toml registration "code-reviewer"',
    );
    expect(issues).toContain(
      '.codex/agents/code-reviewer.toml: description must match .codex/config.toml registration for "code-reviewer"',
    );
  });

  it('extracts canonical template paths from developer instructions', () => {
    const developerInstructions = readCodexDeveloperInstructions(`developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-reviewer.md\`.
Read and apply \`.agent/sub-agents/components/personas/fred.md\`.
"""`);

    expect(readTomlBasicStringValue('approval_policy = "never"', 'approval_policy')).toBe('never');
    expect(extractCanonicalPaths(developerInstructions)).toStrictEqual([
      '.agent/sub-agents/components/personas/fred.md',
      '.agent/sub-agents/templates/code-reviewer.md',
    ]);
  });
});
