import { existsSync } from 'node:fs';
import { join } from 'node:path';

import {
  CLAUDE_HOOK_COMMAND,
  CLAUDE_SETTINGS_PATH,
  HOOK_POLICY_PATH,
  PRACTICE_BOX_DIR,
  readJson,
  readNestedString,
  readOptionalText,
  SURFACE_MATRIX_PATH,
} from './health-probe-shared';
import type { HealthCheckResult } from './health-probe-types';

export function evaluateHookPolicySpineCoherence(repoRoot: string): HealthCheckResult {
  if (!existsSync(join(repoRoot, HOOK_POLICY_PATH))) {
    return {
      key: 'hook-policy-spine',
      label: 'Hook Policy Spine coherence',
      status: 'fail',
      summary: `${HOOK_POLICY_PATH} is missing.`,
      details: [`The canonical hook policy must exist at ${HOOK_POLICY_PATH}.`],
    };
  }

  const hookInputs = readHookPolicyInputs(repoRoot);
  const failureDetails = collectHookPolicyFailureDetails(hookInputs);
  if (failureDetails.length > 0) {
    return {
      key: 'hook-policy-spine',
      label: 'Hook Policy Spine coherence',
      status: 'fail',
      summary:
        'The canonical hook policy, local activation, and surface matrix are not fully aligned.',
      details: failureDetails,
    };
  }

  const warningDetails = collectHookPolicyWarningDetails(hookInputs);
  if (warningDetails.length > 0) {
    return {
      key: 'hook-policy-spine',
      label: 'Hook Policy Spine coherence',
      status: 'warn',
      summary:
        'Canonical hook policy is supported, but the local Claude activation file is absent.',
      details: warningDetails,
    };
  }

  return {
    key: 'hook-policy-spine',
    label: 'Hook Policy Spine coherence',
    status: 'pass',
    summary:
      'Canonical policy, local activation, and the support matrix agree on hook authority and activation order.',
    details: [],
  };
}

export function evaluatePracticeBoxState(practiceBoxFileCount: number): HealthCheckResult {
  if (practiceBoxFileCount === 0) {
    return {
      key: 'practice-box-state',
      label: 'Practice box state',
      status: 'pass',
      summary: 'No incoming Practice artefacts are waiting for integration.',
      details: [],
    };
  }

  return {
    key: 'practice-box-state',
    label: 'Practice box state',
    status: 'warn',
    summary: `${practiceBoxFileCount} incoming Practice artefact${practiceBoxFileCount === 1 ? ' is' : 's are'} waiting for integration.`,
    details: [
      'Use jc-consolidate-docs or a dedicated integration session before the incoming box drifts from local doctrine.',
      `Incoming Practice artefacts live in ${PRACTICE_BOX_DIR}.`,
    ],
  };
}

function readHookPolicyInputs(repoRoot: string) {
  const hookPolicy = readJson(repoRoot, HOOK_POLICY_PATH);
  const claudeSupportStatus = readNestedString(hookPolicy, [
    'platform_support',
    'claude_code',
    'status',
  ]);
  const surfaceMatrixText = readOptionalText(repoRoot, SURFACE_MATRIX_PATH);
  const claudeSettingsText = readOptionalText(repoRoot, CLAUDE_SETTINGS_PATH);

  return {
    claudeSupportStatus,
    surfaceMatrixText,
    claudeSettingsExists: claudeSettingsText !== null,
    claudeHookIsWired: isClaudeHookWired(claudeSettingsText),
  };
}

function isClaudeHookWired(claudeSettingsText: string | null): boolean {
  return (
    claudeSettingsText !== null &&
    claudeSettingsText.includes('"PreToolUse"') &&
    claudeSettingsText.includes('"matcher": "Bash"') &&
    claudeSettingsText.includes(`"command": "${CLAUDE_HOOK_COMMAND}"`)
  );
}

function collectHookPolicyFailureDetails(inputs: {
  readonly claudeSupportStatus: string | null;
  readonly surfaceMatrixText: string | null;
  readonly claudeSettingsExists: boolean;
  readonly claudeHookIsWired: boolean;
}): string[] {
  const details: string[] = [];

  if (
    inputs.claudeSupportStatus === 'supported' &&
    inputs.claudeSettingsExists &&
    !inputs.claudeHookIsWired
  ) {
    details.push(
      `${HOOK_POLICY_PATH} marks Claude Code as supported, but ${CLAUDE_SETTINGS_PATH} does not wire Bash PreToolUse to ${CLAUDE_HOOK_COMMAND}.`,
    );
  }

  if (inputs.claudeSupportStatus !== 'supported' && inputs.claudeHookIsWired) {
    details.push(
      `${CLAUDE_SETTINGS_PATH} wires ${CLAUDE_HOOK_COMMAND}, but ${HOOK_POLICY_PATH} does not mark claude_code as supported.`,
    );
  }

  return [...details, ...collectSurfaceMatrixDetails(inputs.surfaceMatrixText)];
}

function collectHookPolicyWarningDetails(inputs: {
  readonly claudeSupportStatus: string | null;
  readonly claudeSettingsExists: boolean;
}): string[] {
  if (inputs.claudeSupportStatus !== 'supported' || inputs.claudeSettingsExists) {
    return [];
  }

  return [
    `${HOOK_POLICY_PATH} marks Claude Code as supported.`,
    `${CLAUDE_SETTINGS_PATH} is not present in this working copy, so no machine-local activation can run here.`,
  ];
}

function collectSurfaceMatrixDetails(surfaceMatrixText: string | null): string[] {
  if (surfaceMatrixText === null) {
    return [`${SURFACE_MATRIX_PATH} is missing.`];
  }

  const details: string[] = [];
  pushIfMissing(
    details,
    surfaceMatrixText,
    '.agent/hooks/policy.json',
    `${SURFACE_MATRIX_PATH} does not mention ${HOOK_POLICY_PATH}.`,
  );
  pushIfMissing(
    details,
    surfaceMatrixText,
    'scripts/check-blocked-patterns.mjs',
    `${SURFACE_MATRIX_PATH} does not describe the repo-local hook runtime script.`,
  );
  pushIfMissing(
    details,
    surfaceMatrixText,
    'Policy Spine',
    `${SURFACE_MATRIX_PATH} does not expose the Policy Spine precedence section.`,
  );

  for (const keyword of ['override', 'prune', 'block']) {
    pushIfMissing(
      details,
      surfaceMatrixText,
      keyword,
      `${SURFACE_MATRIX_PATH} does not explain override/prune/block semantics.`,
    );
  }

  return [...new Set(details)];
}

function pushIfMissing(
  details: string[],
  content: string,
  requiredText: string,
  message: string,
): void {
  if (!content.includes(requiredText)) {
    details.push(message);
  }
}
