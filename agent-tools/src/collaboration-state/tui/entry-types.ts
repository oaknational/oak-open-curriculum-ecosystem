import { type CollaborationCommitQueueEntry } from '../types.js';

export interface TuiMainEntry {
  readonly id: string;
  readonly created_at: string;
  readonly kind: 'narrative' | 'lifecycle';
  readonly title: string;
  readonly body: string;
  readonly author: string;
}

export interface TuiDirectedEntry {
  readonly id: string;
  readonly created_at: string;
  readonly kind: string;
  readonly subject: string;
  readonly body: string;
  readonly from: string;
  readonly to: string;
}

export interface TuiAgentEntry {
  readonly routing_key: string;
  readonly visibility_status: 'active' | 'stale' | 'inactive' | 'uncertain';
  readonly collision_status: 'clear' | 'collision';
  readonly claim_count: number;
  readonly queue_count: number;
  readonly closed_claim_count: number;
  readonly latest_intent?: string;
}

export interface TuiQueueEntry {
  readonly intent_id: string;
  readonly agent: string;
  readonly phase: CollaborationCommitQueueEntry['phase'];
  readonly status: 'active' | 'expired' | 'abandoned';
  readonly commit_subject: string;
  readonly expires_at: string;
}
