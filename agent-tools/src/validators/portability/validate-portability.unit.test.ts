import { describe, expect, it } from 'vitest';

import {
  CLAUDE_HOOK_COMMAND,
  CLAUDE_SETTINGS_PATH,
  getClaudeHookPortabilityIssues,
  getReviewerAdapterParityIssues,
  getRulesIndexPortabilityIssues,
  getSkillPermissionIssues,
  getSkillsLockCrossReferenceIssues,
  HOOK_POLICY_PATH,
  isClaudeHookWired,
  isClaudeHookWiredInText,
  SURFACE_MATRIX_PATH,
  surfaceMatrixDescribesClaudeHook,
} from './validate-portability-helpers.js';

const supportedHookPolicy = {
  platform_support: {
    claude_code: {
      status: 'supported',
    },
  },
};

const documentedSurfaceMatrix = `# Cross-Platform Agent Surface Matrix

| Surface | Cursor | Claude Code | Gemini CLI | GitHub Copilot | Codex | \`.agents/\` |
| ------- | ------ | ----------- | ---------- | -------------- | ----- | ---------- |
| **Hooks** | unsupported | \`.claude/settings.json\` (tracked project \`PreToolUse\`) | unsupported | unsupported | unsupported | unsupported |

Claude Code currently has native \`PreToolUse\` activation for Bash
commands via the tracked project \`.claude/settings.json\`,
backed by the canonical policy in \`.agent/hooks/policy.json\` and the
dispatcher artefact \`agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js\`
invoked through the verdict shim \`.claude/hooks/run-pretooluse-guard.mjs\`.

## Policy Spine

override | prune | block
`;

describe('isClaudeHookWired', () => {
  it('matches Bash PreToolUse command hooks', () => {
    expect(
      isClaudeHookWired({
        hooks: {
          PreToolUse: [
            {
              matcher: 'Bash',
              hooks: [
                {
                  type: 'command',
                  command: CLAUDE_HOOK_COMMAND,
                },
              ],
            },
          ],
        },
      }),
    ).toBe(true);
  });
});

describe('isClaudeHookWiredInText', () => {
  it('finds the Bash PreToolUse command in tracked project settings text', () => {
    const claudeSettingsText = `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_HOOK_COMMAND}"
          }
        ]
      }
    ]
  }
}`;

    expect(isClaudeHookWiredInText(claudeSettingsText)).toBe(true);
  });

  it('accepts equivalent hook text when object keys appear in a different order', () => {
    const reorderedClaudeSettingsText = `{
  "hooks": {
    "PreToolUse": [
      {
        "hooks": [
          {
            "command": "${CLAUDE_HOOK_COMMAND}",
            "type": "command"
          }
        ],
        "matcher": "Bash"
      }
    ]
  }
}`;

    expect(isClaudeHookWiredInText(reorderedClaudeSettingsText)).toBe(true);
  });
});

describe('surfaceMatrixDescribesClaudeHook', () => {
  it('requires the tracked project contract to be documented', () => {
    expect(surfaceMatrixDescribesClaudeHook(documentedSurfaceMatrix)).toBe(true);

    expect(
      surfaceMatrixDescribesClaudeHook(
        documentedSurfaceMatrix.replace('(tracked project `PreToolUse`)', '(`PreToolUse`)'),
      ),
    ).toBe(false);
  });

  it('requires Policy Spine semantics to be documented as well', () => {
    expect(
      surfaceMatrixDescribesClaudeHook(
        documentedSurfaceMatrix.replace('override | prune | block', 'override | prune'),
      ),
    ).toBe(false);
  });
});

describe('getClaudeHookPortabilityIssues', () => {
  it('fails when the tracked Claude settings file is missing', () => {
    expect(
      getClaudeHookPortabilityIssues({
        hookPolicy: supportedHookPolicy,
        claudeSettings: null,
        claudeSettingsExists: false,
        surfaceMatrix: documentedSurfaceMatrix,
      }),
    ).toContain(
      '.agent/hooks/policy.json: Claude Code is marked supported but tracked project .claude/settings.json is missing',
    );
  });

  it('allows a present tracked Claude settings file when the text wiring is correct', () => {
    expect(
      getClaudeHookPortabilityIssues({
        hookPolicy: supportedHookPolicy,
        claudeSettingsText: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_HOOK_COMMAND}"
          }
        ]
      }
    ]
  }
}`,
        claudeSettingsExists: true,
        surfaceMatrix: documentedSurfaceMatrix,
      }),
    ).toStrictEqual([]);
  });

  it('fails when the tracked Claude settings text exists but does not wire the hook', () => {
    expect(
      getClaudeHookPortabilityIssues({
        hookPolicy: supportedHookPolicy,
        claudeSettingsText: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "pnpm agent-tools:some-other-hook"
          }
        ]
      }
    ]
  }
}`,
        claudeSettingsExists: true,
        surfaceMatrix: documentedSurfaceMatrix,
      }),
    ).toContain(
      `.agent/hooks/policy.json: Claude Code is marked supported but .claude/settings.json does not wire Bash PreToolUse to ${CLAUDE_HOOK_COMMAND}`,
    );
  });

  it('fails when the policy does not mark Claude Code supported but the local file wires the hook', () => {
    expect(
      getClaudeHookPortabilityIssues({
        hookPolicy: {
          platform_support: {
            claude_code: {
              status: 'unsupported',
            },
          },
        },
        claudeSettingsText: `{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_HOOK_COMMAND}"
          }
        ]
      }
    ]
  }
}`,
        claudeSettingsExists: true,
        surfaceMatrix: documentedSurfaceMatrix,
      }),
    ).toContain(
      `${CLAUDE_SETTINGS_PATH}: Claude Code wires ${CLAUDE_HOOK_COMMAND} but ${HOOK_POLICY_PATH} does not mark claude_code as supported`,
    );
  });

  it('fails when Claude support is declared but the surface matrix does not describe the native activation', () => {
    expect(
      getClaudeHookPortabilityIssues({
        hookPolicy: supportedHookPolicy,
        claudeSettingsExists: false,
        claudeSettings: null,
        surfaceMatrix: documentedSurfaceMatrix.replace(
          '`agent-tools/dist/src/hook-policy/pre-tool-use-dispatch.js`',
          '`agent-tools/dist/src/hook-policy/other-hook.js`',
        ),
      }),
    ).toContain(
      `${SURFACE_MATRIX_PATH}: Claude Code hook support is marked supported in ${HOOK_POLICY_PATH} but the surface matrix does not describe the native activation`,
    );
  });
});

describe('getReviewerAdapterParityIssues', () => {
  it('reports missing Codex reviewer adapters when another platform defines them', () => {
    expect(
      getReviewerAdapterParityIssues({
        cursorAgentFiles: ['.cursor/agents/code-expert.md'],
        claudeAgentFiles: ['.claude/agents/code-expert.md'],
        codexAgentFiles: [],
      }),
    ).toContain(
      '.codex/agents/code-expert.toml: missing reviewer adapter required for cross-platform parity',
    );
  });

  it('returns no issues when reviewer adapters are present on all supported platforms', () => {
    expect(
      getReviewerAdapterParityIssues({
        cursorAgentFiles: ['.cursor/agents/code-expert.md'],
        claudeAgentFiles: ['.claude/agents/code-expert.md'],
        codexAgentFiles: ['.codex/agents/code-expert.toml'],
      }),
    ).toStrictEqual([]);
  });

  it('supports the Claude and Cursor high-judgement Cricket seat without a fake Codex adapter', () => {
    expect(
      getReviewerAdapterParityIssues({
        cursorAgentFiles: [
          '.cursor/agents/cricket-judgement-low.md',
          '.cursor/agents/cricket-judgement-medium.md',
          '.cursor/agents/cricket-judgement-high.md',
          '.cursor/agents/cricket-procedure-xhigh.md',
        ],
        claudeAgentFiles: [
          '.claude/agents/cricket-judgement-low.md',
          '.claude/agents/cricket-judgement-medium.md',
          '.claude/agents/cricket-judgement-high.md',
          '.claude/agents/cricket-procedure-xhigh.md',
        ],
        codexAgentFiles: [
          '.codex/agents/cricket-judgement-low.toml',
          '.codex/agents/cricket-judgement-medium.toml',
          '.codex/agents/cricket-procedure-xhigh.toml',
        ],
      }),
    ).toStrictEqual([]);
  });

  it('still reports missing Codex adapters for every shared Cricket seat', () => {
    expect(
      getReviewerAdapterParityIssues({
        cursorAgentFiles: ['.cursor/agents/cricket-judgement-medium.md'],
        claudeAgentFiles: ['.claude/agents/cricket-judgement-medium.md'],
        codexAgentFiles: [],
      }),
    ).toContain(
      '.codex/agents/cricket-judgement-medium.toml: missing reviewer adapter required for cross-platform parity',
    );
  });

  it('rejects a fake Codex adapter for the Claude and Cursor only Cricket seat', () => {
    expect(
      getReviewerAdapterParityIssues({
        cursorAgentFiles: ['.cursor/agents/cricket-judgement-high.md'],
        claudeAgentFiles: ['.claude/agents/cricket-judgement-high.md'],
        codexAgentFiles: ['.codex/agents/cricket-judgement-high.toml'],
      }),
    ).toContain(
      '.codex/agents/cricket-judgement-high.toml: reviewer adapter is unsupported on codex by the shared platform contract',
    );
  });
});

describe('getRulesIndexPortabilityIssues', () => {
  const canonicalRuleFiles = [
    '.agent/rules/apply-architectural-principles.md',
    '.agent/rules/lint-after-edit.md',
  ];

  it('returns no issues when the index lists every canonical rule and stays within budget', () => {
    expect(
      getRulesIndexPortabilityIssues({
        canonicalRuleFiles,
        rulesIndexContent: `# Rules Index

- \`.agent/rules/apply-architectural-principles.md\`
- \`.agent/rules/lint-after-edit.md\`
`,
        maxBytes: 200,
      }),
    ).toStrictEqual([]);
  });

  it('reports missing, extra, missing-file, and byte-budget issues', () => {
    expect(
      getRulesIndexPortabilityIssues({
        canonicalRuleFiles,
        rulesIndexContent: `# Rules Index

- \`.agent/rules/lint-after-edit.md\`
- \`.agent/rules/not-canonical.md\`
`,
        maxBytes: 20,
      }),
    ).toStrictEqual([
      'RULES_INDEX.md: missing canonical rule entry .agent/rules/apply-architectural-principles.md',
      'RULES_INDEX.md: references non-canonical rule .agent/rules/not-canonical.md',
      'RULES_INDEX.md: 85 bytes exceeds Codex project-doc budget 20',
    ]);

    expect(
      getRulesIndexPortabilityIssues({
        canonicalRuleFiles,
        rulesIndexContent: '',
        rulesIndexExists: false,
      }),
    ).toStrictEqual(['RULES_INDEX.md: missing Codex fallback rules index']);
  });
});

describe('getSkillPermissionIssues', () => {
  it('reports a missing Skill() permission when a Claude command adapter exists without a settings entry', () => {
    expect(
      getSkillPermissionIssues({
        claudeCommandFiles: ['.claude/commands/oak-start-right-quick.md'],
        claudeSettingsPermissions: ['Skill(oak-plan)', 'Skill(oak-plan:*)'],
      }),
    ).toContainEqual(expect.stringContaining('oak-start-right-quick'));
  });

  it('returns no issues when every Claude command adapter has a matching Skill() permission', () => {
    expect(
      getSkillPermissionIssues({
        claudeCommandFiles: ['.claude/commands/oak-start-right-quick.md'],
        claudeSettingsPermissions: [
          'Skill(oak-start-right-quick)',
          'Skill(oak-start-right-quick:*)',
        ],
      }),
    ).toStrictEqual([]);
  });

  it('does not require the wildcard variant — only the base Skill() entry', () => {
    expect(
      getSkillPermissionIssues({
        claudeCommandFiles: ['.claude/commands/oak-gates.md'],
        claudeSettingsPermissions: ['Skill(oak-gates)'],
      }),
    ).toStrictEqual([]);
  });

  it('ignores non-Skill permissions in the allow list', () => {
    expect(
      getSkillPermissionIssues({
        claudeCommandFiles: ['.claude/commands/oak-gates.md'],
        claudeSettingsPermissions: ['WebSearch', 'Bash(git status:*)'],
      }),
    ).toContainEqual(expect.stringContaining('oak-gates'));
  });
});

describe('getSkillsLockCrossReferenceIssues', () => {
  const completeEntry = {
    source: 'clerk/skills',
    sourceType: 'github',
    computedHash: 'abc123',
  };

  it('returns no issues for a fully-provenanced external skill with a distinct name', () => {
    expect(
      getSkillsLockCrossReferenceIssues(
        [['clerk-setup', completeEntry]],
        ['oak-plan'],
        'skills-lock.json',
      ),
    ).toStrictEqual([]);
  });

  it('reports an external skill whose name collides with a canonical skill', () => {
    expect(
      getSkillsLockCrossReferenceIssues(
        [['oak-plan', completeEntry]],
        ['oak-plan'],
        'skills-lock.json',
      ),
    ).toContain(
      'skills-lock.json: external skill "oak-plan" collides with canonical .agent/skills/oak-plan/ — external skills must never shadow canonical practice skills (rename or remove one)',
    );
  });

  it('reports each absent or empty provenance field while accepting present ones', () => {
    expect(
      getSkillsLockCrossReferenceIssues(
        [['clerk-setup', { source: '', sourceType: 'github' }]],
        ['oak-plan'],
        'skills-lock.json',
      ),
    ).toStrictEqual([
      'skills-lock.json: locked skill "clerk-setup" missing source',
      'skills-lock.json: locked skill "clerk-setup" missing computedHash',
    ]);
  });
});
