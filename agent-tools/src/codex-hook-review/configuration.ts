import { Buffer } from 'node:buffer';
import { dirname, isAbsolute } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';

import { createReviewChildEnvironment } from './child-environment.js';
import { type CodexProcessRequest } from './process-runner.js';
import { fixedReviewPrompt } from './review-assets.js';
import type { ReviewRuntimeLayout } from './review-assets.js';
import type { MODEL_CONFIGURATIONS, InstructionMechanism } from './tournament-types.js';

const MAX_CODEX_PAYLOAD_BYTES = 4_096;

const CONTEXT_CONTROL_OVERRIDES = [
  'model_reasoning_summary="none"',
  'model_verbosity="low"',
  'model_provider="openai"',
  'personality="none"',
  'include_apps_instructions=false',
  'include_collaboration_mode_instructions=false',
  'include_environment_context=false',
  'include_permissions_instructions=false',
  'project_doc_max_bytes=0',
  'project_doc_fallback_filenames=[]',
  'skills.bundled.enabled=false',
  'web_search="disabled"',
  'mcp_servers={}',
  'check_for_update_on_startup=false',
  'cli_auth_credentials_store="file"',
  'analytics.enabled=false',
  'feedback.enabled=false',
  'features.apps=false',
  'features.auth_elicitation=false',
  'features.browser_use=false',
  'features.browser_use_external=false',
  'features.browser_use_full_cdp_access=false',
  'features.code_mode=false',
  'features.code_mode_host=false',
  'features.computer_use=false',
  'features.current_time_reminder=false',
  'features.default_mode_request_user_input=false',
  'features.enable_mcp_apps=false',
  'features.goals=false',
  'features.guardian_approval=false',
  'features.hooks=false',
  'features.image_generation=false',
  'features.in_app_browser=false',
  'features.memories=false',
  'features.mentions_v2=false',
  'features.multi_agent=false',
  'features.personality=false',
  'features.plugin_sharing=false',
  'features.plugins=false',
  'features.remote_plugin=false',
  'features.remote_compaction_v2=false',
  'features.request_permissions_tool=false',
  'features.shell_snapshot=false',
  'features.shell_tool=false',
  'features.unified_exec=false',
  'features.skill_mcp_dependency_install=false',
  'features.tool_call_mcp_elicitation=false',
  'features.tool_suggest=false',
  'features.terminal_visualization_instructions=false',
  'features.use_agent_identity=false',
  'features.workspace_dependencies=false',
] as const;

export type ReviewModelConfiguration = (typeof MODEL_CONFIGURATIONS)[number];

export interface CreateCodexProcessRequestInput {
  readonly payload: string;
  readonly modelConfiguration: ReviewModelConfiguration;
  readonly mechanism: InstructionMechanism;
  readonly layout: ReviewRuntimeLayout;
  readonly sourceEnvironment: Readonly<NodeJS.ProcessEnv>;
  readonly codexExecutable: string;
}

export interface CodexConfigurationError {
  readonly kind: 'invalid-payload-size' | 'missing-skill-path' | 'invalid-codex-executable';
}

/** Construct the isolated Codex invocation while keeping change data off argv. */
export function createCodexProcessRequest(
  input: CreateCodexProcessRequestInput,
): Result<CodexProcessRequest, CodexConfigurationError> {
  const payloadBytes = Buffer.byteLength(input.payload, 'utf8');
  if (payloadBytes === 0 || payloadBytes > MAX_CODEX_PAYLOAD_BYTES) {
    return err({ kind: 'invalid-payload-size' });
  }
  if (input.mechanism === 'skill' && input.layout.skillPath === undefined) {
    return err({ kind: 'missing-skill-path' });
  }
  if (!isAbsolute(input.codexExecutable)) {
    return err({ kind: 'invalid-codex-executable' });
  }
  return ok({
    command: input.codexExecutable,
    args: createCodexArguments(input),
    cwd: input.layout.workingDirectory,
    env: createReviewChildEnvironment(input.sourceEnvironment, input.layout),
    stdin: input.payload,
  });
}

function createCodexArguments(input: CreateCodexProcessRequestInput): readonly string[] {
  const overrides = createConfigurationOverrides(input);
  return [
    '-a',
    'never',
    'exec',
    '--ephemeral',
    '--json',
    '--output-schema',
    input.layout.outputSchemaPath,
    '--ignore-user-config',
    '--ignore-rules',
    '--strict-config',
    '--skip-git-repo-check',
    '--sandbox',
    'read-only',
    '--model',
    input.modelConfiguration.model,
    ...overrides.flatMap((override) => ['-c', override]),
    fixedReviewPrompt(input.mechanism),
  ];
}

function createConfigurationOverrides(input: CreateCodexProcessRequestInput): readonly string[] {
  const skillInstructionOverrides = [
    `skills.include_instructions=${input.mechanism === 'skill' ? 'true' : 'false'}`,
  ];
  const mechanismOverrides =
    input.mechanism === 'instructions'
      ? [`model_instructions_file=${JSON.stringify(input.layout.instructionsPath)}`]
      : [];
  const skillOverrides =
    input.mechanism === 'skill' && input.layout.skillPath !== undefined
      ? [`skills.config=[{path=${JSON.stringify(dirname(input.layout.skillPath))},enabled=true}]`]
      : [];
  const speedOverrides =
    input.modelConfiguration.speed === 'fast'
      ? ['features.fast_mode=true', 'service_tier="fast"']
      : ['features.fast_mode=false'];
  return [
    `model_reasoning_effort="${input.modelConfiguration.reasoningEffort}"`,
    ...CONTEXT_CONTROL_OVERRIDES,
    ...skillInstructionOverrides,
    ...mechanismOverrides,
    ...skillOverrides,
    ...speedOverrides,
  ];
}
