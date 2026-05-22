const ACTIVE_COMMIT_QUEUE_PHASES = ['queued', 'staging', 'pre_commit'] as const;
const COMMIT_QUEUE_PHASES = [...ACTIVE_COMMIT_QUEUE_PHASES, 'abandoned'] as const;
const COMMIT_QUEUE_ENTRY_STATUSES = ['active', 'expired', 'abandoned'] as const;

type ActiveCommitQueuePhase = (typeof ACTIVE_COMMIT_QUEUE_PHASES)[number];
export type CommitQueuePhase = (typeof COMMIT_QUEUE_PHASES)[number];
export type CommitQueueEntryStatus = (typeof COMMIT_QUEUE_ENTRY_STATUSES)[number];
type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonObject | readonly JsonValue[];

/**
 * JSON object shape preserved when the queue helper updates registry state.
 */
export interface JsonObject {
  readonly [key: string]: JsonValue | undefined;
}

/**
 * Agent identity stored on active claims and commit-queue entries.
 */
export interface CommitQueueAgentId extends JsonObject {
  readonly agent_name: string;
  readonly platform: string;
  readonly model: string;
  readonly session_id_prefix: string;
}

/**
 * Active-claims area shape required by pre-stage queue enforcement.
 */
interface CommitQueueClaimArea extends JsonObject {
  readonly kind: string;
  readonly patterns: readonly string[];
}

/**
 * Advisory queue entry describing one intended commit bundle.
 */
export interface CommitIntent extends JsonObject {
  readonly intent_id: string;
  readonly claim_id: string;
  readonly agent_id: CommitQueueAgentId;
  readonly files: readonly string[];
  readonly commit_subject: string;
  readonly queued_at: string;
  readonly updated_at: string;
  readonly expires_at: string;
  readonly phase: CommitQueuePhase;
  readonly staged_bundle_fingerprint?: string;
  readonly staged_name_status?: string;
  readonly notes?: string;
}

/**
 * Active claim shape required by the queue helper.
 */
export interface CommitQueueClaim extends JsonObject {
  readonly claim_id: string;
  readonly agent_id?: CommitQueueAgentId;
  readonly areas?: readonly CommitQueueClaimArea[];
  readonly intent_to_commit?: string;
}

/**
 * Collaboration registry subset required by the queue helper.
 */
export interface CommitQueueRegistry extends JsonObject {
  readonly schema_version: '1.3.0';
  readonly commit_queue: readonly CommitIntent[];
  readonly claims: readonly CommitQueueClaim[];
}

/**
 * Staged bundle captured from git before commit verification.
 */
export interface StagedBundle {
  readonly stagedNameOnly: string;
  readonly stagedNameStatus: string;
  readonly stagedPatch: string;
  readonly worktreeShortStatus: string;
}

/**
 * Parsed command-line options for the commit-queue CLI.
 */
export interface CommitQueueCliOptions {
  readonly file: readonly string[];
  readonly [key: string]: string | readonly string[] | undefined;
}

/**
 * Mutable builder used only while parsing CLI flags.
 */
export interface MutableCommitQueueCliOptions {
  file: string[];
  [key: string]: string | string[] | undefined;
}

/**
 * Outcome of the commit workflow as surfaced to the CLI layer.
 *
 * Mirrors the discriminated union from `commit-workflow.ts` but uses
 * structural types here to avoid an import cycle between types.ts and
 * commit-workflow.ts.
 */
export type CommitWorkflowCliResult =
  | {
      readonly ok: true;
      readonly intentId: string;
      readonly sha: string;
      readonly advisoryExitCode: number;
    }
  | {
      readonly ok: false;
      readonly stage: 'load-intent' | 'verify-staged-before' | 'verify-staged-after' | 'git-commit';
      readonly reason: string;
      readonly intentId?: string;
    };

/**
 * Injected commit-workflow dependency exposed to CLI input so tests can
 * exercise the dispatch wiring without spawning real sub-processes.
 */
export type CommitWorkflowCliRunner = (input: {
  readonly intentId: string;
  readonly messageFilePath: string;
  readonly registryPath: string;
  readonly repoRoot: string;
}) => Promise<CommitWorkflowCliResult>;

/**
 * Parsed command-line input for the commit-queue CLI.
 */
export interface CommitQueueCliInput {
  readonly command: string | undefined;
  readonly options: CommitQueueCliOptions;
  readonly repoRoot: string;
  readonly readRegistry?: (registryPath: string) => Promise<CommitQueueRegistry>;
  readonly commitWorkflow?: CommitWorkflowCliRunner;
  readonly stdout?: {
    write(chunk: string): void;
  };
  readonly stderr?: {
    write(chunk: string): void;
  };
}

export function isActiveCommitQueuePhase(value: unknown): value is ActiveCommitQueuePhase {
  return typeof value === 'string' && activePhaseSet().has(value);
}

export function isCommitQueuePhase(value: unknown): value is CommitQueuePhase {
  return typeof value === 'string' && allPhaseSet().has(value);
}

export function isCommitQueueEntryStatus(value: unknown): value is CommitQueueEntryStatus {
  return typeof value === 'string' && statusSet().has(value);
}

function activePhaseSet(): ReadonlySet<string> {
  return new Set<ActiveCommitQueuePhase>(ACTIVE_COMMIT_QUEUE_PHASES);
}

function allPhaseSet(): ReadonlySet<string> {
  return new Set<CommitQueuePhase>(COMMIT_QUEUE_PHASES);
}

function statusSet(): ReadonlySet<string> {
  return new Set<CommitQueueEntryStatus>(COMMIT_QUEUE_ENTRY_STATUSES);
}
