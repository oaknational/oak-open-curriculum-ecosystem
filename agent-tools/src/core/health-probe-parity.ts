import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { CODEX_CONFIG_PATH, readCodexAgentRegistrations } from './codex-project-agent-registry';
import {
  CLAUDE_AGENTS_DIR,
  CODEX_AGENTS_DIR,
  CURSOR_AGENTS_DIR,
  listBasenames,
} from './health-probe-shared';
import type { HealthCheckResult } from './health-probe-types';

export function evaluateParityChecks(repoRoot: string): readonly HealthCheckResult[] {
  return [evaluateReviewerAdapterParity(repoRoot), evaluateReviewerRegistrationParity(repoRoot)];
}

function evaluateReviewerAdapterParity(repoRoot: string): HealthCheckResult {
  const cursorAgents = listBasenames(repoRoot, CURSOR_AGENTS_DIR, '.md');
  const claudeAgents = listBasenames(repoRoot, CLAUDE_AGENTS_DIR, '.md');
  const codexAgents = listBasenames(repoRoot, CODEX_AGENTS_DIR, '.toml');
  const allAgentNames = [...new Set([...cursorAgents, ...claudeAgents, ...codexAgents])].sort(
    (a, b) => a.localeCompare(b),
  );
  const details = collectReviewerAdapterParityDetails(allAgentNames, {
    cursorAgents,
    claudeAgents,
    codexAgents,
  });

  if (details.length > 0) {
    return {
      key: 'reviewer-adapter-parity',
      label: 'Reviewer adapter parity',
      status: 'fail',
      summary: 'Reviewer adapters are not present on every supported platform surface.',
      details,
    };
  }

  return {
    key: 'reviewer-adapter-parity',
    label: 'Reviewer adapter parity',
    status: 'pass',
    summary: `${allAgentNames.length} reviewer adapters are aligned across Cursor, Claude Code, and Codex.`,
    details: [],
  };
}

function collectReviewerAdapterParityDetails(
  allAgentNames: readonly string[],
  platformAgents: {
    readonly cursorAgents: readonly string[];
    readonly claudeAgents: readonly string[];
    readonly codexAgents: readonly string[];
  },
): string[] {
  const details: string[] = [];

  for (const agentName of allAgentNames) {
    if (!platformAgents.cursorAgents.includes(agentName)) {
      details.push(`Cursor is missing reviewer adapter ${agentName}.`);
    }
    if (!platformAgents.claudeAgents.includes(agentName)) {
      details.push(`Claude Code is missing reviewer adapter ${agentName}.`);
    }
    if (!platformAgents.codexAgents.includes(agentName)) {
      details.push(`Codex is missing reviewer adapter ${agentName}.`);
    }
  }

  return details;
}

function evaluateReviewerRegistrationParity(repoRoot: string): HealthCheckResult {
  const codexAdapterNames = listBasenames(repoRoot, CODEX_AGENTS_DIR, '.toml');

  try {
    const registrations = readCodexAgentRegistrations(repoRoot);
    const details = collectReviewerRegistrationDetails(repoRoot, codexAdapterNames, registrations);

    if (details.length > 0) {
      return {
        key: 'reviewer-registration-parity',
        label: 'Reviewer registration parity',
        status: 'fail',
        summary: 'Codex reviewer registrations and adapter files are out of sync.',
        details,
      };
    }

    return {
      key: 'reviewer-registration-parity',
      label: 'Reviewer registration parity',
      status: 'pass',
      summary: `${registrations.length} Codex reviewer registrations resolve cleanly to live adapters.`,
      details: [],
    };
  } catch (error) {
    return {
      key: 'reviewer-registration-parity',
      label: 'Reviewer registration parity',
      status: 'fail',
      summary: 'Codex reviewer registration could not be resolved cleanly.',
      details: [error instanceof Error ? error.message : String(error)],
    };
  }
}

function collectReviewerRegistrationDetails(
  repoRoot: string,
  codexAdapterNames: readonly string[],
  registrations: readonly { name: string; configFile: string }[],
): string[] {
  const registrationNames = registrations.map((registration) => registration.name);
  const details: string[] = [];

  for (const adapterName of codexAdapterNames) {
    if (!registrationNames.includes(adapterName)) {
      details.push(
        `Codex adapter ${adapterName} is missing a registry entry in ${CODEX_CONFIG_PATH}.`,
      );
    }
  }

  for (const registration of registrations) {
    if (!existsSync(join(repoRoot, registration.configFile))) {
      details.push(`${CODEX_CONFIG_PATH} points at missing adapter ${registration.configFile}.`);
    }
  }

  return details;
}
