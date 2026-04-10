import { describe, expect, it } from 'vitest';

import {
  CLAUDE_HOOK_COMMAND,
  CLAUDE_SETTINGS_PATH,
  getClaudeHookPortabilityIssues,
  getReviewerAdapterParityIssues,
  getSkillPermissionIssues,
  HOOK_POLICY_PATH,
  isClaudeHookWired,
  isClaudeHookWiredInText,
  SURFACE_MATRIX_PATH,
  surfaceMatrixDescribesClaudeHook,
} from './validate-portability-helpers.mjs';

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
repo-local runtime script \`scripts/check-blocked-patterns.mjs\`.

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
                  command: 'node scripts/check-blocked-patterns.mjs',
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
            "command": "node scripts/check-blocked-patterns.mjs"
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
            "command": "node scripts/check-blocked-patterns.mjs",
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
            "command": "node scripts/check-blocked-patterns.mjs"
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
            "command": "node scripts/some-other-hook.mjs"
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
      '.agent/hooks/policy.json: Claude Code is marked supported but .claude/settings.json does not wire Bash PreToolUse to node scripts/check-blocked-patterns.mjs',
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
          '`scripts/check-blocked-patterns.mjs`',
          '`scripts/other-hook.mjs`',
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
        cursorAgentFiles: ['.cursor/agents/code-reviewer.md'],
        claudeAgentFiles: ['.claude/agents/code-reviewer.md'],
        codexAgentFiles: [],
      }),
    ).toContain(
      '.codex/agents/code-reviewer.toml: missing reviewer adapter required for cross-platform parity',
    );
  });

  it('returns no issues when reviewer adapters are present on all supported platforms', () => {
    expect(
      getReviewerAdapterParityIssues({
        cursorAgentFiles: ['.cursor/agents/code-reviewer.md'],
        claudeAgentFiles: ['.claude/agents/code-reviewer.md'],
        codexAgentFiles: ['.codex/agents/code-reviewer.toml'],
      }),
    ).toStrictEqual([]);
  });
});

describe('getSkillPermissionIssues', () => {
  it('reports a missing Skill() permission when a Claude command adapter exists without a settings entry', () => {
    expect(
      getSkillPermissionIssues({
        claudeCommandFiles: ['.claude/commands/jc-start-right-quick.md'],
        claudeSettingsPermissions: ['Skill(jc-plan)', 'Skill(jc-plan:*)'],
      }),
    ).toContainEqual(expect.stringContaining('jc-start-right-quick'));
  });

  it('returns no issues when every Claude command adapter has a matching Skill() permission', () => {
    expect(
      getSkillPermissionIssues({
        claudeCommandFiles: ['.claude/commands/jc-start-right-quick.md'],
        claudeSettingsPermissions: ['Skill(jc-start-right-quick)', 'Skill(jc-start-right-quick:*)'],
      }),
    ).toStrictEqual([]);
  });

  it('does not require the wildcard variant — only the base Skill() entry', () => {
    expect(
      getSkillPermissionIssues({
        claudeCommandFiles: ['.claude/commands/jc-gates.md'],
        claudeSettingsPermissions: ['Skill(jc-gates)'],
      }),
    ).toStrictEqual([]);
  });

  it('ignores non-Skill permissions in the allow list', () => {
    expect(
      getSkillPermissionIssues({
        claudeCommandFiles: ['.claude/commands/jc-commit.md'],
        claudeSettingsPermissions: ['WebSearch', 'Bash(git status:*)'],
      }),
    ).toContainEqual(expect.stringContaining('jc-commit'));
  });
});
