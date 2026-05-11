/**
 * Shared collaboration-state types used by the repo-owned state helpers.
 */

export interface CollaborationStateEnvironment {
  readonly PRACTICE_AGENT_SESSION_ID_CLAUDE?: string;
  readonly PRACTICE_AGENT_SESSION_ID_CURSOR?: string;
  readonly PRACTICE_AGENT_SESSION_ID_CODEX?: string;
  readonly CODEX_THREAD_ID?: string;
  readonly OAK_AGENT_IDENTITY_OVERRIDE?: string;
}

export interface CollaborationAgentId {
  readonly agent_name: string;
  readonly platform: string;
  readonly model: string;
  readonly session_id_prefix: string;
}

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

/**
 * Narrative communication event — the canonical and dominant event kind.
 * An authored, titled, bodied communication addressed to the team (or to a
 * specific agent or audience via the optional routing affordances). Lives in
 * `.agent/state/collaboration/comms-events/`. Projects `$defs.narrative` in
 * `comms-event.schema.json`.
 */
export interface NarrativeCommsEvent {
  readonly event_id: string;
  readonly created_at: string;
  readonly author: CollaborationAgentId;
  readonly title: string;
  readonly body: string;
  readonly audience?: readonly string[];
  readonly addressed_to?: string;
  readonly in_response_to?: string;
  readonly in_reply_to?: string;
}

/**
 * Lifecycle communication event — a structured record of a session, claim,
 * or consolidation lifecycle moment, carrying explicit thread and claim_id
 * context. Lives in `.agent/state/collaboration/comms-lifecycle/`. Projects
 * `$defs.lifecycle` in `comms-event.schema.json`. `claim_id` may be an empty
 * string when the event is not claim-scoped.
 */
export interface LifecycleCommsEvent {
  readonly schema_version: string;
  readonly event_id: string;
  readonly created_at: string;
  readonly event_type: string;
  readonly occurred_at: string;
  readonly author: CollaborationAgentId;
  readonly agent_id: CollaborationAgentId;
  readonly thread: string;
  readonly claim_id: string;
  readonly title: string;
  readonly subject: string;
  readonly body: string;
}

/**
 * Directed communication message — a point-to-point message from one agent
 * to another, carrying explicit from/to identities and a `kind` discriminator.
 * Lives in `.agent/state/collaboration/comms-messages/`. Projects
 * `$defs.directed` in `comms-event.schema.json`. The post-migration shape
 * uses `created_at`; the legacy `timestamp` field is renamed on migration.
 */
export interface DirectedCommsMessage {
  readonly schema_version: string;
  readonly event_id: string;
  readonly created_at: string;
  readonly kind: string;
  readonly from: CollaborationAgentId;
  readonly to: CollaborationAgentId;
  readonly subject: string;
  readonly body: string;
}
