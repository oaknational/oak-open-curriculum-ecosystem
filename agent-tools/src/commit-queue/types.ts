const ACTIVE_COMMIT_QUEUE_PHASES = ['queued', 'staging', 'pre_commit'] as const;
const COMMIT_QUEUE_PHASES = [...ACTIVE_COMMIT_QUEUE_PHASES, 'abandoned'] as const;

type ActiveCommitQueuePhase = (typeof ACTIVE_COMMIT_QUEUE_PHASES)[number];
export type CommitQueuePhase = (typeof COMMIT_QUEUE_PHASES)[number];
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
 * Parsed command-line input for the commit-queue CLI.
 */
export interface CommitQueueCliInput {
  readonly command: string | undefined;
  readonly options: CommitQueueCliOptions;
  readonly repoRoot: string;
}

export function isActiveCommitQueuePhase(value: unknown): value is ActiveCommitQueuePhase {
  return typeof value === 'string' && activePhaseSet().has(value);
}

export function isCommitQueuePhase(value: unknown): value is CommitQueuePhase {
  return typeof value === 'string' && allPhaseSet().has(value);
}

function activePhaseSet(): ReadonlySet<string> {
  return new Set<ActiveCommitQueuePhase>(ACTIVE_COMMIT_QUEUE_PHASES);
}

function allPhaseSet(): ReadonlySet<string> {
  return new Set<CommitQueuePhase>(COMMIT_QUEUE_PHASES);
}
