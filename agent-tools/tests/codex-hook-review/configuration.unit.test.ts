import { assert, describe, expect, it } from 'vitest';

import { createCodexProcessRequest } from '../../src/codex-hook-review/configuration.js';
import { type ReviewRuntimeLayout } from '../../src/codex-hook-review/review-assets.js';
import { MODEL_CONFIGURATIONS } from '../../src/codex-hook-review/tournament-types.js';

const LAYOUT: ReviewRuntimeLayout = {
  baseDirectory: '/private/reviewer',
  codexHome: '/private/reviewer/codex-home',
  homeDirectory: '/private/reviewer/homes/inline',
  workingDirectory: '/private/reviewer/work/inline',
  outputSchemaPath: '/private/reviewer/assets/output.json',
  instructionsPath: '/private/reviewer/assets/instructions.md',
  skillPath: undefined,
};

describe('createCodexProcessRequest', () => {
  it('keeps the bounded dynamic payload exclusively on stdin', () => {
    const payload = '{"version":1,"changes":[{"operation":"write"}]}';
    const result = createCodexProcessRequest({
      payload,
      modelConfiguration: MODEL_CONFIGURATIONS[0],
      mechanism: 'inline',
      layout: LAYOUT,
      sourceEnvironment: { PATH: '/bin', OPENAI_API_KEY: 'must-not-pass' },
      codexExecutable: '/opt/codex',
    });

    assert(result.ok);
    expect([result.value.command, ...result.value.args].slice(0, 4)).toEqual([
      '/opt/codex',
      '-a',
      'never',
      'exec',
    ]);
    expect(result.value.stdin).toBe(payload);
    expect(result.value.args).not.toContain(payload);
    expect(result.value.cwd).toBe(LAYOUT.workingDirectory);
    expect(result.value.env).toStrictEqual({
      HOME: LAYOUT.homeDirectory,
      CODEX_HOME: LAYOUT.codexHome,
      NO_COLOR: '1',
      TERM: 'dumb',
      RUST_LOG: 'error',
    });
  });

  it('applies the context controls and instructions-file mechanism', () => {
    const result = createCodexProcessRequest({
      payload: '{}',
      modelConfiguration: MODEL_CONFIGURATIONS[1],
      mechanism: 'instructions',
      layout: LAYOUT,
      sourceEnvironment: {},
      codexExecutable: '/opt/codex',
    });

    assert(result.ok);
    expect(result.value.args).toStrictEqual([
      '-a',
      'never',
      'exec',
      '--ephemeral',
      '--json',
      '--output-schema',
      '/private/reviewer/assets/output.json',
      '--ignore-user-config',
      '--ignore-rules',
      '--strict-config',
      '--skip-git-repo-check',
      '--sandbox',
      'read-only',
      '--model',
      'gpt-5.6-luna',
      '-c',
      'model_reasoning_effort="low"',
      '-c',
      'model_reasoning_summary="none"',
      '-c',
      'model_verbosity="low"',
      '-c',
      'model_provider="openai"',
      '-c',
      'personality="none"',
      '-c',
      'include_apps_instructions=false',
      '-c',
      'include_collaboration_mode_instructions=false',
      '-c',
      'include_environment_context=false',
      '-c',
      'include_permissions_instructions=false',
      '-c',
      'project_doc_max_bytes=0',
      '-c',
      'project_doc_fallback_filenames=[]',
      '-c',
      'skills.bundled.enabled=false',
      '-c',
      'web_search="disabled"',
      '-c',
      'mcp_servers={}',
      '-c',
      'check_for_update_on_startup=false',
      '-c',
      'cli_auth_credentials_store="file"',
      '-c',
      'analytics.enabled=false',
      '-c',
      'feedback.enabled=false',
      '-c',
      'features.apps=false',
      '-c',
      'features.auth_elicitation=false',
      '-c',
      'features.browser_use=false',
      '-c',
      'features.browser_use_external=false',
      '-c',
      'features.browser_use_full_cdp_access=false',
      '-c',
      'features.code_mode=false',
      '-c',
      'features.code_mode_host=false',
      '-c',
      'features.computer_use=false',
      '-c',
      'features.current_time_reminder=false',
      '-c',
      'features.default_mode_request_user_input=false',
      '-c',
      'features.enable_mcp_apps=false',
      '-c',
      'features.goals=false',
      '-c',
      'features.guardian_approval=false',
      '-c',
      'features.hooks=false',
      '-c',
      'features.image_generation=false',
      '-c',
      'features.in_app_browser=false',
      '-c',
      'features.memories=false',
      '-c',
      'features.mentions_v2=false',
      '-c',
      'features.multi_agent=false',
      '-c',
      'features.personality=false',
      '-c',
      'features.plugin_sharing=false',
      '-c',
      'features.plugins=false',
      '-c',
      'features.remote_plugin=false',
      '-c',
      'features.remote_compaction_v2=false',
      '-c',
      'features.request_permissions_tool=false',
      '-c',
      'features.shell_snapshot=false',
      '-c',
      'features.shell_tool=false',
      '-c',
      'features.unified_exec=false',
      '-c',
      'features.skill_mcp_dependency_install=false',
      '-c',
      'features.tool_call_mcp_elicitation=false',
      '-c',
      'features.tool_suggest=false',
      '-c',
      'features.terminal_visualization_instructions=false',
      '-c',
      'features.use_agent_identity=false',
      '-c',
      'features.workspace_dependencies=false',
      '-c',
      'skills.include_instructions=false',
      '-c',
      'model_instructions_file="/private/reviewer/assets/instructions.md"',
      '-c',
      'features.fast_mode=false',
      'Classify the attached JSON change batch and return the required decision object.',
    ]);
  });

  it('uses both Codex fast controls only for the Luna fast lane', () => {
    const fast = createCodexProcessRequest({
      payload: '{}',
      modelConfiguration: MODEL_CONFIGURATIONS[2],
      mechanism: 'skill',
      layout: {
        ...LAYOUT,
        homeDirectory: '/private/reviewer/homes/skill',
        skillPath: '/private/reviewer/homes/skill/.agents/skills/codex-hook-review/SKILL.md',
      },
      sourceEnvironment: {},
      codexExecutable: '/opt/codex',
    });
    const standard = createCodexProcessRequest({
      payload: '{}',
      modelConfiguration: MODEL_CONFIGURATIONS[1],
      mechanism: 'skill',
      layout: {
        ...LAYOUT,
        homeDirectory: '/private/reviewer/homes/skill',
        skillPath: '/private/reviewer/homes/skill/.agents/skills/codex-hook-review/SKILL.md',
      },
      sourceEnvironment: {},
      codexExecutable: '/opt/codex',
    });

    assert(fast.ok);
    assert(standard.ok);
    expect(fast.value.args).toEqual(
      expect.arrayContaining(['features.fast_mode=true', 'service_tier="fast"']),
    );
    expect(standard.value.args).not.toContain('features.fast_mode=true');
    expect(standard.value.args).toContain('features.fast_mode=false');
    expect(standard.value.args).not.toContain('service_tier="fast"');
    expect(fast.value.args).toContain(
      'skills.config=[{path="/private/reviewer/homes/skill/.agents/skills/codex-hook-review",enabled=true}]',
    );
  });

  it.each([
    {
      mechanism: 'inline' as const,
      layout: LAYOUT,
      includeInstructions: 'skills.include_instructions=false',
      expectedSkillConfig: undefined,
    },
    {
      mechanism: 'instructions' as const,
      layout: LAYOUT,
      includeInstructions: 'skills.include_instructions=false',
      expectedSkillConfig: undefined,
    },
    {
      mechanism: 'skill' as const,
      layout: {
        ...LAYOUT,
        homeDirectory: '/private/reviewer/homes/skill',
        skillPath: '/private/reviewer/homes/skill/.agents/skills/codex-hook-review/SKILL.md',
      },
      includeInstructions: 'skills.include_instructions=true',
      expectedSkillConfig:
        'skills.config=[{path="/private/reviewer/homes/skill/.agents/skills/codex-hook-review",enabled=true}]',
    },
  ])(
    'disables bundled skills and controls automatic skill instructions for $mechanism',
    ({ mechanism, layout, includeInstructions, expectedSkillConfig }) => {
      const result = createCodexProcessRequest({
        payload: '{}',
        modelConfiguration: MODEL_CONFIGURATIONS[0],
        mechanism,
        layout,
        sourceEnvironment: {},
        codexExecutable: '/opt/codex',
      });

      assert(result.ok);
      expect(result.value.args).toContain('skills.bundled.enabled=false');
      expect(result.value.args).toContain(includeInstructions);
      const skillConfig = result.value.args.find((argument) =>
        argument.startsWith('skills.config='),
      );
      expect(skillConfig).toBe(expectedSkillConfig);
    },
  );

  it('rejects empty and over-limit dynamic payloads before process launch', () => {
    const common = {
      modelConfiguration: MODEL_CONFIGURATIONS[0],
      mechanism: 'inline' as const,
      layout: LAYOUT,
      sourceEnvironment: {},
      codexExecutable: '/opt/codex',
    };

    expect(createCodexProcessRequest({ ...common, payload: '' })).toStrictEqual({
      ok: false,
      error: { kind: 'invalid-payload-size' },
    });
    expect(createCodexProcessRequest({ ...common, payload: 'x'.repeat(4_097) })).toStrictEqual({
      ok: false,
      error: { kind: 'invalid-payload-size' },
    });
  });
});
