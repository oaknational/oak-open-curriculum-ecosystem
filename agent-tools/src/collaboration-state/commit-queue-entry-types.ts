/**
 * The per-intent commit-queue store's entry shape, split from `types.ts`
 * (which re-exports it, so this module's location is an implementation
 * detail) to keep both files inside the module size budget.
 */
import type { CollaborationAgentIdWrite } from './agent-id.js';

/**
 * One machine-local commit-queue intent, stored as its own file at
 * `.agent/state/collaboration/commit-queue/<intent-id>.json` (owner ruling
 * 2026-08-17, QUEUE-LOCAL — the queue left the claims file at registry
 * schema 1.4.0; `commit-queue-store.ts` owns the file conventions and TTL),
 * before the queue's order key is assigned.
 *
 * The draft half exists because `queued_seq` cannot be known outside the
 * claims-file transaction lock: `createIntent` builds a draft at the CLI
 * boundary and `enqueueCommitIntent` completes it inside the transform.
 */
export interface CollaborationCommitQueueEntryDraft {
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

/** One stored commit-queue intent: the draft plus its queue order key. */
export interface CollaborationCommitQueueEntry extends CollaborationCommitQueueEntryDraft {
  /**
   * Queue order key: the store's SOLE ordering field, carrying the arrival
   * order the pre-1.4.0 flat array expressed as its element position.
   *
   * Assigned under the claims-file transaction lock as
   * max-over-LIVE-entries + 1, so values are REUSED as the queue drains.
   * That is correct for RELATIVE order, and is why this is never a global
   * counter and never an identity — the intent_id is the identity.
   *
   * `queued_at` cannot serve (see `compareQueueOrder`) and stays for TTL
   * and display.
   */
  readonly queued_seq: number;
}
