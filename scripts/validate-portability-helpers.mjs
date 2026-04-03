export const HOOK_POLICY_PATH = '.agent/hooks/policy.json';
export const CLAUDE_SETTINGS_PATH = '.claude/settings.json';
export const SURFACE_MATRIX_PATH = '.agent/reference/cross-platform-agent-surface-matrix.md';
export const CLAUDE_HOOK_COMMAND = 'node scripts/check-blocked-patterns.mjs';

function isObject(value) {
  return value !== null && typeof value === 'object';
}

export function getClaudeHookStatus(hookPolicy) {
  return isObject(hookPolicy) &&
    isObject(hookPolicy.platform_support) &&
    isObject(hookPolicy.platform_support.claude_code) &&
    typeof hookPolicy.platform_support.claude_code.status === 'string'
    ? hookPolicy.platform_support.claude_code.status
    : null;
}

export function isClaudeHookWired(claudeSettings, hookCommand = CLAUDE_HOOK_COMMAND) {
  const preToolUseGroups =
    isObject(claudeSettings) &&
    isObject(claudeSettings.hooks) &&
    Array.isArray(claudeSettings.hooks.PreToolUse)
      ? claudeSettings.hooks.PreToolUse
      : [];

  return preToolUseGroups.some((group) => {
    if (!isObject(group) || group.matcher !== 'Bash' || !Array.isArray(group.hooks)) {
      return false;
    }

    return group.hooks.some(
      (hook) =>
        isObject(hook) &&
        hook.type === 'command' &&
        typeof hook.command === 'string' &&
        hook.command.trim() === hookCommand,
    );
  });
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function isClaudeHookWiredInText(claudeSettingsText, hookCommand = CLAUDE_HOOK_COMMAND) {
  if (typeof claudeSettingsText !== 'string') {
    return false;
  }

  const escapedCommand = escapeRegExp(hookCommand);
  const commandPattern = new RegExp(`"command"\\s*:\\s*"${escapedCommand}"`, 'u');

  return (
    claudeSettingsText.includes('"PreToolUse"') &&
    /"matcher"\s*:\s*"Bash"/u.test(claudeSettingsText) &&
    /"type"\s*:\s*"command"/u.test(claudeSettingsText) &&
    commandPattern.test(claudeSettingsText)
  );
}

export function surfaceMatrixDescribesClaudeHook(surfaceMatrix) {
  const hookRowMatches =
    /\|\s*\*\*Hooks\*\*\s*\|[^\n]*unsupported[^\n]*\.claude\/settings\.json[^\n]*tracked[^\n]*PreToolUse/iu.test(
      surfaceMatrix,
    );
  const policySpineSemanticsMatch = /\boverride\b[\s\S]*\bprune\b[\s\S]*\bblock\b/u.test(
    surfaceMatrix,
  );

  return (
    hookRowMatches &&
    surfaceMatrix.includes('.agent/hooks/policy.json') &&
    surfaceMatrix.includes('scripts/check-blocked-patterns.mjs') &&
    surfaceMatrix.includes('Policy Spine') &&
    policySpineSemanticsMatch
  );
}

export function getClaudeHookPortabilityIssues({
  hookPolicy,
  claudeSettings,
  claudeSettingsText = null,
  claudeSettingsExists = true,
  surfaceMatrix,
  hookPolicyPath = HOOK_POLICY_PATH,
  claudeSettingsPath = CLAUDE_SETTINGS_PATH,
  surfaceMatrixPath = SURFACE_MATRIX_PATH,
  hookCommand = CLAUDE_HOOK_COMMAND,
}) {
  const issues = [];
  const claudeHookStatus = getClaudeHookStatus(hookPolicy);
  const claudeHookIsWired =
    claudeSettingsExists &&
    (typeof claudeSettingsText === 'string'
      ? isClaudeHookWiredInText(claudeSettingsText, hookCommand)
      : isClaudeHookWired(claudeSettings, hookCommand));

  if (claudeHookStatus === 'supported' && !claudeSettingsExists) {
    issues.push(
      `${hookPolicyPath}: Claude Code is marked supported but tracked project ${claudeSettingsPath} is missing`,
    );
  }

  if (claudeHookStatus === 'supported' && claudeSettingsExists && !claudeHookIsWired) {
    issues.push(
      `${hookPolicyPath}: Claude Code is marked supported but ${claudeSettingsPath} does not wire Bash PreToolUse to ${hookCommand}`,
    );
  }

  if (claudeHookStatus !== 'supported' && claudeSettingsExists && claudeHookIsWired) {
    issues.push(
      `${claudeSettingsPath}: Claude Code wires ${hookCommand} but ${hookPolicyPath} does not mark claude_code as supported`,
    );
  }

  if (claudeHookStatus === 'supported' && !surfaceMatrixDescribesClaudeHook(surfaceMatrix)) {
    issues.push(
      `${surfaceMatrixPath}: Claude Code hook support is marked supported in ${hookPolicyPath} but the surface matrix does not describe the native activation`,
    );
  }

  return issues;
}

export function getSkillPermissionIssues({
  claudeCommandFiles,
  claudeSettingsPermissions,
  claudeSettingsPath = CLAUDE_SETTINGS_PATH,
}) {
  const issues = [];

  const permittedSkills = new Set(
    claudeSettingsPermissions
      .filter((entry) => /^Skill\([^)]+\)$/u.test(entry))
      .map((entry) => entry.replace(/^Skill\(([^):]+)\)$/u, '$1'))
      .filter((name) => name.length > 0),
  );

  for (const file of claudeCommandFiles) {
    const commandName = file.replace(/^.*\/|\.md$/gu, '');
    if (!permittedSkills.has(commandName)) {
      issues.push(
        `${claudeSettingsPath}: Claude command adapter "${commandName}" has no Skill(${commandName}) entry in permissions.allow`,
      );
    }
  }

  return issues;
}

export function getReviewerAdapterParityIssues({
  cursorAgentFiles,
  claudeAgentFiles,
  codexAgentFiles,
}) {
  const issues = [];
  const cursorAgentNames = new Set(
    cursorAgentFiles.map((file) => file.replace(/^.*\/|\.md$/gu, '')),
  );
  const claudeAgentNames = new Set(
    claudeAgentFiles.map((file) => file.replace(/^.*\/|\.md$/gu, '')),
  );
  const codexAgentNames = new Set(
    codexAgentFiles.map((file) => file.replace(/^.*\/|\.toml$/gu, '')),
  );

  const canonicalAgentNames = [
    ...new Set([...cursorAgentNames, ...claudeAgentNames, ...codexAgentNames]),
  ].sort();

  for (const agentName of canonicalAgentNames) {
    if (!cursorAgentNames.has(agentName)) {
      issues.push(
        `.cursor/agents/${agentName}.md: missing reviewer adapter required for cross-platform parity`,
      );
    }
    if (!claudeAgentNames.has(agentName)) {
      issues.push(
        `.claude/agents/${agentName}.md: missing reviewer adapter required for cross-platform parity`,
      );
    }
    if (!codexAgentNames.has(agentName)) {
      issues.push(
        `.codex/agents/${agentName}.toml: missing reviewer adapter required for cross-platform parity`,
      );
    }
  }

  return issues;
}
