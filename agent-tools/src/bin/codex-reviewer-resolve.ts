#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import type { CodexProjectAgent } from '../core/codex-project-agents';
import { listCodexProjectAgentNames, resolveCodexProjectAgent } from '../core/codex-project-agents';
import { repoRoot } from '../core/runtime';
import { writeErrorLine, writeLine } from '../core/terminal-output';

const HELP_TEXT = `Usage: codex-reviewer-resolve <agent-name> [--json]

Resolve a repo-local Codex project-agent definition and print the exact
.codex adapter and canonical .agent files that should ground the review.

Examples:
  pnpm agent-tools:codex-reviewer-resolve code-reviewer
  pnpm agent-tools:codex-reviewer-resolve architecture-reviewer-fred --json`;

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
  writeLine(`agent: ${resolvedAgent.name}`);
  writeLine(`description: ${resolvedAgent.description}`);
  writeLine(`registry: ${resolvedAgent.configPath}`);
  writeLine(`adapter: ${resolvedAgent.adapterPath}`);
  writeLine(
    `mode: reasoning=${resolvedAgent.modelReasoningEffort}, sandbox=${resolvedAgent.sandboxMode}, approval=${resolvedAgent.approvalPolicy}`,
  );
  writeLine('canonical files:');
  writeCanonicalFiles(resolvedAgent.referencedCanonicalFiles);
}

function writeCanonicalFiles(canonicalFiles: readonly string[]): void {
  for (const canonicalFile of canonicalFiles) {
    writeLine(`- ${canonicalFile}`);
  }
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
