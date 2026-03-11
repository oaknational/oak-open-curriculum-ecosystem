export interface PhaseDetectionInput {
  stopReason: string;
  toolNames: string[];
  bashCommands: string[];
}

export interface ResolveDiffCwdInput {
  repoRoot: string;
  requestedAgentId: string | undefined;
  resolvedWorktreePath: string | null;
}

const recentBashWindow = 4;
const recentToolWindow = 6;

export function detectPhaseFromEvents(input: PhaseDetectionInput): string {
  const recentBashCommands = input.bashCommands.slice(-recentBashWindow);
  const recentToolNames = input.toolNames.slice(-recentToolWindow);
  if (input.stopReason === 'end_turn') {
    if (input.bashCommands.some((command) => command.includes('gh pr create'))) {
      return 'done (PR)';
    }
    return 'done';
  }
  if (
    input.bashCommands.some(
      (command) => command.includes('gh pr create') || command.includes('git push'),
    )
  ) {
    return 'creating PR';
  }
  if (input.bashCommands.some((command) => command.includes('git commit'))) {
    return 'committing';
  }
  if (
    recentBashCommands.some((command) =>
      /pnpm (test|build|type-check|lint|format|markdownlint)/.test(command),
    )
  ) {
    return 'testing';
  }
  if (recentToolNames.some((toolName) => toolName === 'Write' || toolName === 'Edit')) {
    return 'implementing';
  }
  return 'researching';
}

export function resolveDiffCwd(input: ResolveDiffCwdInput): string {
  if (input.requestedAgentId && input.resolvedWorktreePath) {
    return input.resolvedWorktreePath;
  }
  return input.repoRoot;
}
