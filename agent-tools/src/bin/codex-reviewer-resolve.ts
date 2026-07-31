#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import type { CodexProjectAgent } from '../core/codex-project-agents.js';
import {
  listCodexProjectAgentNames,
  resolveCodexProjectAgent,
} from '../core/codex-project-agents.js';
import { repoRoot } from '../core/runtime.js';
import { writeErrorLine, writeLine } from '../core/terminal-output.js';

const HELP_TEXT = `Usage: codex-reviewer-resolve <agent-name> [--json]

Resolve a repo-local Codex project-agent definition and print the exact
.codex adapter and canonical .agent files that should ground the review.

Examples:
  pnpm agent-tools:codex-reviewer-resolve code-expert
  pnpm agent-tools:codex-reviewer-resolve architecture-expert-fred --json`;

interface CommandLineOptions {
  readonly helpRequested: boolean;
  readonly jsonOutput: boolean;
  readonly agentName?: string;
}

function run(): void {
  const options = parseCommandLineOptions(process.argv.slice(2));
  if (options.helpRequested) {
    writeHelp();
    return;
  }

  if (!options.agentName) {
    exitWithError('Missing agent name. Run with --help for usage.');
  }

  resolveAndPrintAgent(repoRoot(), options.agentName, options.jsonOutput);
}

function parseCommandLineOptions(args: readonly string[]): CommandLineOptions {
  return {
    helpRequested: args.length === 0 || args.includes('--help') || args.includes('-h'),
    jsonOutput: args.includes('--json'),
    agentName: args.find((argument) => !argument.startsWith('-')),
  };
}

function writeHelp(): void {
  writeLine(HELP_TEXT);
}

function resolveAndPrintAgent(root: string, agentName: string, jsonOutput: boolean): void {
  try {
    const resolvedAgent = resolveCodexProjectAgent(root, agentName);
    printResolvedAgent(resolvedAgent, jsonOutput);
  } catch (error: unknown) {
    exitWithError(formatResolutionFailure(root, toErrorMessage(error)));
  }
}

export function formatResolutionFailure(root: string, message: string): string {
  try {
    const availableAgents = listCodexProjectAgentNames(root);
    if (availableAgents.length === 0) {
      return message;
    }
    return `${message}\nAvailable agents: ${availableAgents.join(', ')}`;
  } catch {
    return message;
  }
}

function printResolvedAgent(resolvedAgent: CodexProjectAgent, jsonOutput: boolean): void {
  if (jsonOutput) {
    writeJsonOutput(resolvedAgent);
    return;
  }

  writeHumanReadableOutput(resolvedAgent);
}

function writeJsonOutput(resolvedAgent: CodexProjectAgent): void {
  writeLine(JSON.stringify(resolvedAgent, null, 2));
}

function writeHumanReadableOutput(resolvedAgent: CodexProjectAgent): void {
  for (const line of formatHumanReadableAgent(resolvedAgent)) {
    writeLine(line);
  }
}

/**
 * Format the resolved project-agent contract for the default terminal output.
 *
 * `inherited` distinguishes an intentionally unpinned model from a missing
 * field, while keeping the human-readable output aligned with `--json`.
 *
 * @param resolvedAgent - The fully resolved project-agent definition.
 * @returns One terminal-ready line per item in the resolved contract.
 */
export function formatHumanReadableAgent(resolvedAgent: CodexProjectAgent): readonly string[] {
  return [
    `agent: ${resolvedAgent.name}`,
    `description: ${resolvedAgent.description}`,
    `registry: ${resolvedAgent.configPath}`,
    `adapter: ${resolvedAgent.adapterPath}`,
    `mode: model=${resolvedAgent.model ?? 'inherited'}, reasoning=${resolvedAgent.modelReasoningEffort}, sandbox=${resolvedAgent.sandboxMode}, approval=${resolvedAgent.approvalPolicy}`,
    'canonical files:',
    ...resolvedAgent.referencedCanonicalFiles.map((canonicalFile) => `- ${canonicalFile}`),
  ];
}

function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function exitWithError(message: string): never {
  writeErrorLine(`Error: ${message}`);
  process.exit(1);
}

const isDirectExecution =
  process.argv[1] !== undefined && fileURLToPath(import.meta.url) === process.argv[1];

if (isDirectExecution) {
  run();
}
