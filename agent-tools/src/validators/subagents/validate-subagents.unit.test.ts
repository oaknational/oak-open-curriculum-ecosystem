import { describe, expect, it } from 'vitest';
import { createTopLevelTomlBasicStringReader } from '../../core/toml-top-level-basic-string.js';
import {
  extractCanonicalPaths,
  getCodexAdapterValidation,
  getCodexRegistrationValidation,
  parseCodexRegistrations,
  readCodexDeveloperInstructions,
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
      fileExists: (filePath: string) => filePath === '.codex/agents/code-expert.toml',
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
      fileExists: (filePath: string) => filePath === '.codex/agents/code-expert.toml',
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
      '.codex/agents/code-expert.toml: missing top-level developer_instructions string',
    );
  });

  it('reports malformed Codex adapter TOML as a file-scoped issue', () => {
    const result = getCodexAdapterValidation({
      codexAdapterFile: '.codex/agents/broken-expert.toml',
      content: 'name = "unterminated',
    });

    expect(result).toStrictEqual({
      issues: [
        `.codex/agents/broken-expert.toml: invalid TOML: Invalid TOML document: unfinished string

1:  name = "unterminated
            ^`,
      ],
      templatePaths: [],
      canonicalPaths: [],
    });
  });

  it('rejects a present non-string optional model in an ordinary Codex adapter', () => {
    const { issues } = getCodexAdapterValidation({
      codexAdapterFile: '.codex/agents/code-expert.toml',
      registeredAgent: {
        name: 'code-expert',
        description: 'Gateway reviewer.',
        configFile: 'agents/code-expert.toml',
      },
      content: `name = "code-expert"
description = "Gateway reviewer."
model = 42
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-expert.md\`.
"""`,
    });

    expect(issues).toContain(
      '.codex/agents/code-expert.toml: model must be a TOML string when present (found: non-string)',
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

  it.each([
    {
      agentName: 'cricket-judgement-low',
      model: 'gpt-5.6-sol',
      effort: 'low',
      template: 'cricket-judgement.md',
    },
    {
      agentName: 'cricket-judgement-medium',
      model: 'gpt-5.6-terra',
      effort: 'medium',
      template: 'cricket-judgement.md',
    },
    {
      agentName: 'cricket-procedure-xhigh',
      model: 'gpt-5.6-luna',
      effort: 'xhigh',
      template: 'cricket-procedure.md',
    },
  ])(
    'accepts the $agentName Codex model, effort, and method contract',
    ({ agentName, model, effort, template }) => {
      const description = `Cricket panel role ${agentName}.`;
      const { issues } = getCodexAdapterValidation({
        codexAdapterFile: `.codex/agents/${agentName}.toml`,
        registeredAgent: {
          name: agentName,
          description,
          configFile: `agents/${agentName}.toml`,
        },
        content: `name = "${agentName}"
description = "${description}"
model = "${model}"
model_reasoning_effort = "${effort}"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/${template}\`.
"""`,
      });

      expect(issues).toStrictEqual([]);
    },
  );

  it('rejects a Codex Cricket role whose model and effort do not match its role contract', () => {
    const { issues } = getCodexAdapterValidation({
      codexAdapterFile: '.codex/agents/cricket-procedure-xhigh.toml',
      registeredAgent: {
        name: 'cricket-procedure-xhigh',
        description: 'Compiled Cricket procedure.',
        configFile: 'agents/cricket-procedure-xhigh.toml',
      },
      content: `name = "cricket-procedure-xhigh"
description = "Compiled Cricket procedure."
model = "gpt-5.6-terra"
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/cricket-procedure.md\`.
"""`,
    });

    expect(issues).toContain(
      '.codex/agents/cricket-procedure-xhigh.toml: model must be "gpt-5.6-luna" (found: gpt-5.6-terra)',
    );
    expect(issues).toContain(
      '.codex/agents/cricket-procedure-xhigh.toml: model_reasoning_effort must be "xhigh" (found: high)',
    );
  });

  it('rejects a Codex Cricket role wired to the wrong canonical method template', () => {
    const { issues } = getCodexAdapterValidation({
      codexAdapterFile: '.codex/agents/cricket-procedure-xhigh.toml',
      registeredAgent: {
        name: 'cricket-procedure-xhigh',
        description: 'Compiled Cricket procedure.',
        configFile: 'agents/cricket-procedure-xhigh.toml',
      },
      content: `name = "cricket-procedure-xhigh"
description = "Compiled Cricket procedure."
model = "gpt-5.6-luna"
model_reasoning_effort = "xhigh"
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/cricket-judgement.md\`.
"""`,
    });

    expect(issues).toContain(
      '.codex/agents/cricket-procedure-xhigh.toml: developer_instructions must reference exactly .agent/sub-agents/templates/cricket-procedure.md for its Cricket method contract',
    );
  });

  it('does not accept Cricket model or effort pins written inside developer instructions', () => {
    const { issues } = getCodexAdapterValidation({
      codexAdapterFile: '.codex/agents/cricket-procedure-xhigh.toml',
      registeredAgent: {
        name: 'cricket-procedure-xhigh',
        description: 'Compiled Cricket procedure.',
        configFile: 'agents/cricket-procedure-xhigh.toml',
      },
      content: `name = "cricket-procedure-xhigh"
description = "Compiled Cricket procedure."
sandbox_mode = "read-only"
approval_policy = "never"

developer_instructions = """
Read and follow \`.agent/sub-agents/templates/cricket-procedure.md\`.
model = "gpt-5.6-luna"
model_reasoning_effort = "xhigh"
"""`,
    });

    expect(issues).toContain(
      '.codex/agents/cricket-procedure-xhigh.toml: model must be "gpt-5.6-luna" (found: missing)',
    );
    expect(issues).toContain(
      '.codex/agents/cricket-procedure-xhigh.toml: model_reasoning_effort must be "xhigh" (found: missing)',
    );
  });

  it('does not accept developer instructions nested inside another multiline TOML value', () => {
    const { issues, templatePaths, canonicalPaths } = getCodexAdapterValidation({
      codexAdapterFile: '.codex/agents/code-expert.toml',
      registeredAgent: {
        name: 'code-expert',
        description: 'Gateway reviewer.',
        configFile: 'agents/code-expert.toml',
      },
      content: `name = "code-expert"
description = "Gateway reviewer."
model_reasoning_effort = "high"
sandbox_mode = "read-only"
approval_policy = "never"

notes = '''
developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-expert.md\`.
"""
'''
`,
    });

    expect(issues).toContain(
      '.codex/agents/code-expert.toml: missing top-level developer_instructions string',
    );
    expect(templatePaths).toStrictEqual([]);
    expect(canonicalPaths).toStrictEqual([]);
  });

  it('extracts canonical template paths from developer instructions', () => {
    const developerInstructions = readCodexDeveloperInstructions(
      createTopLevelTomlBasicStringReader(`developer_instructions = """
Read and follow \`.agent/sub-agents/templates/code-expert.md\`.
Read and apply \`.agent/sub-agents/components/personas/fred.md\`.
"""`),
    );

    expect(extractCanonicalPaths(developerInstructions)).toStrictEqual([
      '.agent/sub-agents/components/personas/fred.md',
      '.agent/sub-agents/templates/code-expert.md',
    ]);
  });
});
