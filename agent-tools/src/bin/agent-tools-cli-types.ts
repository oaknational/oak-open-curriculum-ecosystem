import type { AgentIdentityCliEnvironment } from './agent-identity-cli.js';
import type { CollaborationStateEnvironment } from '../collaboration-state/types.js';
import type { CommitQueueRegistry } from '../commit-queue/types.js';

export type AgentToolsEnvironment = AgentIdentityCliEnvironment & CollaborationStateEnvironment;

export interface AgentToolsCliInput {
  readonly argv: readonly string[];
  readonly env: AgentToolsEnvironment;
  readonly cwd: string;
  readonly repoRoot?: string;
  readonly readCommitQueueRegistry?: (registryPath: string) => Promise<CommitQueueRegistry>;
  /**
   * Stdin stream for topics that read from it (e.g. `codex-exec last-message`).
   * Defaults to `process.stdin` when not provided. Tests inject a fake stream.
   */
  readonly stdin?: NodeJS.ReadableStream;
}

export interface AgentToolsCliResult {
  readonly exitCode: number;
  readonly stdout: string;
  readonly stderr: string;
}
