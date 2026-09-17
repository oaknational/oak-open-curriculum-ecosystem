import type { CollaborationAgentId, CollaborationAgentIdWrite } from './agent-id.js';

export {
  collaborationAgentIdSchema,
  collaborationAgentIdWriteSchema,
  namingSchemaVersionOf,
  uuidV5Schema,
  type CollaborationAgentId,
  type CollaborationAgentIdWrite,
  type DerivedCollaborationIdentity,
  type UuidV5,
} from './agent-id.js';

export interface CollaborationStateEnvironment {
  readonly PRACTICE_AGENT_SESSION_ID_CLAUDE?: string;
  /** Cloud-seat platform session id (`cse_`-tagged); the untagged payload is the PDR-027 seed there. */
  readonly CLAUDE_CODE_REMOTE_SESSION_ID?: string;
  readonly PRACTICE_AGENT_SESSION_ID_CURSOR?: string;
  readonly PRACTICE_AGENT_SESSION_ID_GEMINI?: string;
  readonly PRACTICE_AGENT_SESSION_ID_CODEX?: string;
  readonly CODEX_THREAD_ID?: string;
  readonly conversationId?: string;
  readonly ANTIGRAVITY_SOURCE_METADATA?: string;
  readonly OAK_AGENT_IDENTITY_OVERRIDE?: string;
}

export interface CollaborationArea {
  readonly kind: 'files' | 'workspace' | 'plan' | 'adr' | 'git';
  readonly patterns: readonly string[];
}

interface CollaborationEvidence {
  readonly kind:
    | 'log_entry'
    | 'decision_thread'
    | 'claim'
    | 'plan'
    | 'adr'
    | 'napkin'
    | 'thread_record'
    | 'commit'
    | 'command_output'
    | 'rule'
    | 'pdr'
    | 'pattern'
    | 'memory_archive'
    | 'workspace'
    | 'gate'
    | 'smoke'
    | 'reflog'
    | 'json_parse'
    | 'git_status'
    | 'git_index'
    | 'script'
    | 'external_api'
    | 'continuity'
    | 'comms_event'
    | 'commit_queue';
  readonly ref: string;
  readonly summary: string;
}

interface CollaborationClosure {
  readonly kind: 'explicit' | 'stale' | 'owner_forced';
  readonly closed_at: string;
  readonly closed_by: CollaborationAgentId;
  readonly summary: string;
  readonly evidence: readonly CollaborationEvidence[];
}

export interface CollaborationClaim {
  readonly claim_id: string;
  readonly agent_id: CollaborationAgentId;
  readonly thread: string;
  readonly areas: readonly CollaborationArea[];
  readonly claimed_at: string;
  readonly freshness_seconds?: number;
  readonly heartbeat_at?: string;
  readonly sidebar_open?: boolean;
  readonly role?: string;
  readonly intent: string;
  readonly notes?: string;
  readonly intent_to_commit?: string;
  /**
   * Optional repo-root-relative pointer to a mid-cycle handoff record under
   * `.agent/state/collaboration/handoffs/` (PDR-063 step 3 + ADR-182). Presence
   * signals the claim is mid-cycle and carries a handoff record; absence is
   * normal active-claim semantics. Set via `claims set-handoff`; preserved
   * across `claims adopt` (the successor clears it only when the cycle resumes
   * on a natural footing — PDR-063 pickup item 4).
   */
  readonly handoff_record_path?: string;
  readonly archived_at?: string;
  readonly closure?: CollaborationClosure;
}

export interface CollaborationCommitQueueEntry {
  readonly intent_id: string;
  readonly claim_id: string;
  /**
   * Intent identity is the PDR-076a WRITE shape: `id` is required at parse
   * in both registry read paths (see `parseIntentAgentId` in agent-id.ts).
   * Claims keep the read shape — legacy id-less rows are preserved there.
   */
  readonly agent_id: CollaborationAgentIdWrite;
  readonly files: readonly string[];
  readonly commit_subject: string;
  readonly queued_at: string;
  readonly updated_at: string;
  readonly expires_at: string;
  readonly phase: 'queued' | 'staging' | 'pre_commit' | 'abandoned';
  readonly staged_bundle_fingerprint?: string;
  readonly staged_name_status?: string;
  readonly notes?: string;
}

/**
 * The exact schema version this code reads and writes for the active-claims
 * registry, under the latest-only support contract stated in
 * active-claims.schema.json's $comment_compatibility note. Every parse
 * guard and write reconstruction moves in lockstep through this constant —
 * the exact-version pin is what keeps the field-by-field intent
 * reconstruction non-destructive (registry-entry-parser.ts carries the
 * full contract). The composed write gates redden a constant the schema's
 * enum does not list; the reverse drift (the enum gaining a version this
 * constant has not adopted) has no mechanical guard yet. Test fixtures and
 * assertions deliberately keep the raw literal so a version bump reddens
 * the contract pins; validity-constructing helpers ride the constant.
 */
export const ACTIVE_CLAIMS_SCHEMA_VERSION = '1.3.0';

/**
 * The exact schema version for the closed-claims archive — a separate
 * surface pinned separately, currently versioned in lockstep with the
 * active-claims registry.
 */
export const CLOSED_CLAIMS_SCHEMA_VERSION = '1.3.0';

export interface CollaborationRegistry {
  readonly schema_version: typeof ACTIVE_CLAIMS_SCHEMA_VERSION;
  readonly commit_queue: readonly CollaborationCommitQueueEntry[];
  readonly claims: readonly CollaborationClaim[];
}

export interface ClosedClaimsArchive {
  readonly schema_version: typeof CLOSED_CLAIMS_SCHEMA_VERSION;
  readonly claims: readonly CollaborationClaim[];
}

interface BaseCommsEvent {
  readonly schema_version: '2.0.0';
  readonly event_id: string;
  readonly created_at: string;
}

/**
 * Narrative communication event — an authored, titled, bodied communication
 * addressed to the team or a narrower audience. Lives in the canonical
 * `.agent/state/collaboration/comms/` directory.
 */
export interface NarrativeCommsEvent extends BaseCommsEvent {
  readonly kind: 'narrative';
  readonly author: CollaborationAgentId;
  readonly title: string;
  readonly body: string;
  readonly audience?: readonly CollaborationAgentId[];
  readonly addressed_to?: CollaborationAgentId;
  readonly in_response_to?: string;
  readonly in_reply_to?: string;
  readonly tags?: readonly string[];
}

/**
 * Lifecycle communication event — a structured record of a session, claim, or
 * consolidation lifecycle moment. `claim_id` may be empty when the event is
 * not claim-scoped.
 */
export interface LifecycleCommsEvent extends BaseCommsEvent {
  readonly kind: 'lifecycle';
  readonly event_type: string;
  readonly occurred_at: string;
  readonly author: CollaborationAgentId;
  readonly agent_id: CollaborationAgentId;
  readonly thread: string;
  readonly claim_id: string;
  readonly title: string;
  readonly subject: string;
  readonly body: string;
  readonly tags?: readonly string[];
}

/**
 * Directed communication message — a point-to-point message from one agent to
 * another. `kind` is the top-level comms discriminator; `message_kind` carries
 * the directed-message sub-kind.
 */
export interface DirectedCommsMessage extends BaseCommsEvent {
  readonly kind: 'directed';
  readonly message_kind: string;
  readonly from: CollaborationAgentId;
  readonly to: CollaborationAgentId;
  readonly subject: string;
  readonly body: string;
  readonly in_response_to?: string;
  readonly tags?: readonly string[];
}

export type CommsEvent = NarrativeCommsEvent | LifecycleCommsEvent | DirectedCommsMessage;

/**
 * Result of draining the canonical comms stream for an agent. `output` is
 * the formatted text the caller emits to its destination (stdout, file,
 * log); `eventCount` is the number of events drained (zero means nothing
 * new was emitted); `eventIds` is the IDs of those drained events for the
 * caller to mark seen AFTER successful emit.
 *
 * The drain function does NOT mark events seen — for events OWED EMISSION
 * the caller is responsible for marking AFTER the emit step succeeds, so
 * that a crash between drain and emit produces a duplicate notification
 * (safe) rather than a missed notification (unsafe). See FM-2 cure
 * (2026-05-23): Monitor-harness liveness investigation.
 *
 * `excludedEventIds` carries events suppressed by the sanctioned F-146
 * `--exclude-tag` mechanism: never rendered into `output`, never counted
 * in `eventCount`, and carrying NO emission debt — the caller marks them
 * seen unconditionally after a successful drain (before emit), so a
 * heartbeats-only drain still marks and the backlog never replays when the
 * filter lifts. Includes every excluded unseen id, including those beyond
 * any `batchLimit` slice horizon — safe because the seen store is an
 * id set, not a cursor; a cursor-shaped seen-store migration must
 * re-examine this.
 */
export interface DrainResult {
  readonly output: string;
  readonly eventCount: number;
  readonly eventIds: readonly string[];
  readonly excludedEventIds?: readonly string[];
}
