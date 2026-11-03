import type { Result } from '@oaknational/result';

import {
  type CollaborationAgentIdWrite,
  type NamingSchemaVersion,
  type UuidV5,
} from '../collaboration-state/agent-id.js';
import { type ACTIVE_CLAIMS_SCHEMA_VERSION } from '../collaboration-state/types.js';

const ACTIVE_COMMIT_QUEUE_PHASES = ['queued', 'staging', 'pre_commit'] as const;
const COMMIT_QUEUE_PHASES = [...ACTIVE_COMMIT_QUEUE_PHASES, 'abandoned'] as const;
// No `expired` status: the per-intent store reads a TTL-expired file as
// absent (QUEUE-LOCAL, 2026-08-17), so no read view can ever classify one.
const COMMIT_QUEUE_ENTRY_STATUSES = ['active', 'abandoned'] as const;

type ActiveCommitQueuePhase = (typeof ACTIVE_COMMIT_QUEUE_PHASES)[number];
export type CommitQueuePhase = (typeof COMMIT_QUEUE_PHASES)[number];
export type CommitQueueEntryStatus = (typeof COMMIT_QUEUE_ENTRY_STATUSES)[number];
import { type JsonObject } from '../core/json.js';

export type { JsonObject };

/**
 * Agent identity on active CLAIMS — the PDR-076a read shape. `id` is
 * optional: legacy id-less rows are legal, preserved on write-back, and
 * never match a live agent in the ownership comparison.
 */
export interface CommitQueueClaimAgentId extends JsonObject {
  readonly agent_name: string;
  readonly platform: string;
  readonly model: string;
  readonly session_id_prefix: string;
  readonly id?: UuidV5;
  readonly naming_schema_version?: NamingSchemaVersion;
}

/**
 * Active-claims area shape required by pre-stage queue enforcement.
 */
interface CommitQueueClaimArea extends JsonObject {
  readonly kind: string;
  readonly patterns: readonly string[];
}

/**
 * An advisory queue entry before the queue's order key is assigned.
 *
 * `queued_seq` cannot be known outside the claims-file transaction lock —
 * it is derived from the live queue — so `createIntent` builds this draft
 * at the CLI boundary and `enqueueCommitIntent` completes it inside the
 * transform. Mutually assignable with
 * `CollaborationCommitQueueEntryDraft`, the store's half of the same split.
 */
export interface CommitIntentDraft extends JsonObject {
  readonly intent_id: string;
  readonly claim_id: string;
  /**
   * Agent identity on commit-queue INTENTS — the schema-derived PDR-076a
   * write shape (Commandment 12: the schema IS the type; the mapped type's
   * implicit index signature keeps it JsonObject-compatible for registry
   * round-tripping, so no hand-built shadow interface is needed).
   *
   * `id` is the canonical PDR-076a UUID v5 routing disambiguator and is
   * required: write paths cannot omit it at compile time (`createIntent`
   * parses through `collaborationAgentIdWriteSchema`), and `parseIntent`
   * enforces the same canonical schema at the read boundary, so an id-less
   * intent row fails loudly naming the offending intent. Claims use
   * {@link CommitQueueClaimAgentId} instead: `id` stays optional there
   * because a pre-sunset legacy claim row is legal registry content that
   * must be preserved byte-identical on write-back — it is simply never
   * the same live agent (PDR-076a §Sunset; the guard narrows through the
   * canonical `sameAgentRoutingKey`).
   */
  readonly agent_id: CollaborationAgentIdWrite;
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
 * Advisory queue entry describing one intended commit bundle, order key
 * included. See `CollaborationCommitQueueEntry.queued_seq` for what that
 * key means and why the queue cannot order on `queued_at`; the two types
 * must stay mutually assignable (`registry.ts` spreads store entries here).
 */
export interface CommitIntent extends CommitIntentDraft {
  readonly queued_seq: number;
}

/**
 * Active claim shape required by the queue helper.
 */
export interface CommitQueueClaim extends JsonObject {
  readonly claim_id: string;
  readonly agent_id?: CommitQueueClaimAgentId;
  readonly areas?: readonly CommitQueueClaimArea[];
}

/**
 * The claims FILE's shape as the queue helper reads it (claims only since
 * registry schema 1.4.0). The version field is pinned to the same constant
 * as the full registry type.
 */
export interface CommitQueueClaimsFile extends JsonObject {
  readonly schema_version: typeof ACTIVE_CLAIMS_SCHEMA_VERSION;
  readonly claims: readonly CommitQueueClaim[];
}

/**
 * The composed in-memory registry the queue commands operate on: the claims
 * file plus the live entries of the machine-local per-intent store
 * (`.agent/state/collaboration/commit-queue/<intent-id>.json`). Only
 * `registry.ts` composes and decomposes this shape; `commit_queue` never
 * serialises back into the claims file.
 */
export interface CommitQueueRegistry extends CommitQueueClaimsFile {
  readonly commit_queue: readonly CommitIntent[];
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
  readonly gitRoot: string;
}) => Promise<CommitWorkflowCliResult>;

/**
 * Parsed command-line input for the commit-queue CLI.
 *
 * The commit-queue spans TWO distinct roots (F-138) and this input keeps
 * them separate by construction:
 *
 * - `repoRoot` anchors the REGISTRY: the coordination home (the primary
 *   checkout shared by every linked worktree), where enqueue/phase/
 *   record-staged registry writes and all reads land.
 * - `resolveGitRoot` names the INVOKING git worktree: the root every staged
 *   read, verification, and the inner `git commit` operate against. It is a
 *   thunk so read-only registry commands never touch git, and it MUST fail
 *   loudly when no git root is derivable — falling back to `repoRoot` is
 *   exactly the two-root collapse that abandoned valid worktree intents.
 */
export interface CommitQueueCliInput {
  readonly command: string | undefined;
  readonly options: CommitQueueCliOptions;
  readonly repoRoot: string;
  readonly resolveGitRoot: () => string;
  readonly readRegistry?: (registryPath: string) => Promise<Result<CommitQueueRegistry, Error>>;
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
