/**
 * Shared collaboration-state types used by the repo-owned state helpers.
 */

import { z } from 'zod';

export interface CollaborationStateEnvironment {
  readonly PRACTICE_AGENT_SESSION_ID_CLAUDE?: string;
  readonly PRACTICE_AGENT_SESSION_ID_CURSOR?: string;
  readonly PRACTICE_AGENT_SESSION_ID_CODEX?: string;
  readonly CODEX_THREAD_ID?: string;
  readonly OAK_AGENT_IDENTITY_OVERRIDE?: string;
}

/**
 * Canonical Zod schema for an agent identity tuple (PDR-027). The type
 * `CollaborationAgentId` is `z.infer<typeof collaborationAgentIdSchema>` per
 * schema-first Commandment 12 — the schema IS the type, statically embedded.
 *
 * Any caller that needs to parse an identity from untrusted input (JSON, env,
 * external source) MUST use this schema rather than hand-crafting a
 * structural-typing equivalent.
 */
export const collaborationAgentIdSchema = z
  .object({
    agent_name: z.string(),
    platform: z.string(),
    model: z.string(),
    session_id_prefix: z.string(),
  })
  .strict();

export type CollaborationAgentId = Readonly<z.infer<typeof collaborationAgentIdSchema>>;

export interface DerivedCollaborationIdentity {
  readonly agentId: CollaborationAgentId;
  readonly seed_source: string;
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
  readonly intent: string;
  readonly notes?: string;
  readonly intent_to_commit?: string;
  readonly archived_at?: string;
  readonly closure?: CollaborationClosure;
}

export interface CollaborationCommitQueueEntry {
  readonly intent_id: string;
  readonly claim_id: string;
  readonly agent_id: CollaborationAgentId;
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

export interface CollaborationRegistry {
  readonly schema_version: '1.3.0';
  readonly commit_queue: readonly CollaborationCommitQueueEntry[];
  readonly claims: readonly CollaborationClaim[];
}

export interface ClosedClaimsArchive {
  readonly schema_version: '1.3.0';
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
 * The drain function does NOT mark events seen — the caller is responsible
 * for marking AFTER the emit step succeeds, so that a crash between drain
 * and emit produces a duplicate notification (safe) rather than a missed
 * notification (unsafe). See FM-2 cure (2026-05-23): Monitor-harness
 * liveness investigation.
 */
export interface DrainResult {
  readonly output: string;
  readonly eventCount: number;
  readonly eventIds: readonly string[];
}
