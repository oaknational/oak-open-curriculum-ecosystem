import { unwrapOrThrow } from '@oaknational/result';

import { isExpired } from './timestamps.js';
import { auditCommsEvents } from './identity-audit-comms.js';
import {
  isAnonymousCodexAgent,
  type CodexIdentityAuditClassification,
  type CodexIdentityAuditFinding,
} from './identity-audit-findings.js';
import { findThreadRecordIdentityRows } from './identity-audit-markdown.js';
import { parseClosedClaimsArchive, parseCollaborationRegistry } from './state-parsers.js';
import {
  type CollaborationClaim,
  type CollaborationCommitQueueEntry,
  type CommsEvent,
} from './types.js';

/**
 * Summary counts for a Codex identity audit.
 */
interface CodexIdentityAuditSummary {
  readonly total: number;
  readonly by_classification: {
    readonly 'historical-no-repair': number;
    readonly 'live-risk': number;
    readonly 'needs-evidence': number;
  };
}

/**
 * Report-only audit output for existing anonymous Codex identity records.
 */
interface CodexIdentityAuditReport {
  readonly now: string;
  readonly summary: CodexIdentityAuditSummary;
  readonly findings: readonly CodexIdentityAuditFinding[];
}

/**
 * Pure audit input; contents and events are injected by the CLI boundary.
 * Comms history reads the event stream, never the rendered-log read model.
 */
interface CodexIdentityAuditInput {
  readonly nowIso: string;
  readonly activeText: string;
  readonly closedText: string;
  readonly threadRecordText: string;
  readonly commsEvents: readonly CommsEvent[];
  /**
   * Live entries from the machine-local per-intent commit-queue store —
   * injected like the comms events, since the queue left the claims file
   * at registry schema 1.4.0.
   */
  readonly commitQueue: readonly CollaborationCommitQueueEntry[];
}

/**
 * Audit explicit collaboration-state texts and comms events for existing
 * anonymous Codex identity records without repairing or mutating them.
 *
 * @param input - Current UTC timestamp, source texts, and comms events.
 * @returns JSON-serialisable report grouping anonymous Codex records by risk.
 */
export function auditCodexIdentityRecords(
  input: CodexIdentityAuditInput,
): CodexIdentityAuditReport {
  const findings = [
    ...auditActiveText(input.activeText, input.nowIso),
    ...input.commitQueue.flatMap((entry) => auditCommitQueueEntry(entry, input.nowIso)),
    ...auditClosedText(input.closedText),
    ...auditThreadRecord(input.threadRecordText),
    ...auditCommsEvents(input.commsEvents),
  ];

  return {
    now: input.nowIso,
    summary: summarise(findings),
    findings,
  };
}

function auditActiveText(text: string, nowIso: string): readonly CodexIdentityAuditFinding[] {
  // Rethrows the parser's ORIGINAL error: the audit surface's loud thrown
  // contract is anchored-pinned (an identity-losing wrap reddens it).
  const registry = unwrapOrThrow(parseCollaborationRegistry(text));

  return registry.claims.flatMap((claim) => auditActiveClaim(claim, nowIso));
}

function auditActiveClaim(
  claim: CollaborationClaim,
  nowIso: string,
): readonly CodexIdentityAuditFinding[] {
  if (!isAnonymousCodexAgent(claim.agent_id)) {
    return [];
  }

  const expired = isExpired({
    startedAtIso: claim.heartbeat_at ?? claim.claimed_at,
    freshnessSeconds: claim.freshness_seconds ?? 14400,
    nowIso,
  });

  return [
    {
      source: 'active',
      record_ref: `claim:${claim.claim_id}`,
      classification: expired ? 'needs-evidence' : 'live-risk',
      agent_id: claim.agent_id,
      reason: expired
        ? 'Anonymous Codex active claim has exceeded its freshness TTL; inspect before archival or repair.'
        : 'Anonymous Codex active claim is still fresh and can confuse live ownership.',
    },
  ];
}

function auditCommitQueueEntry(
  entry: CollaborationCommitQueueEntry,
  nowIso: string,
): readonly CodexIdentityAuditFinding[] {
  if (!isAnonymousCodexAgent(entry.agent_id)) {
    return [];
  }

  if (entry.phase === 'abandoned') {
    return [
      {
        source: 'active',
        record_ref: `commit_queue:${entry.intent_id}`,
        classification: 'historical-no-repair',
        agent_id: entry.agent_id,
        reason: 'Anonymous Codex commit-queue entry is abandoned; preserve as historical evidence.',
      },
    ];
  }

  const expired = Date.parse(entry.expires_at) < Date.parse(nowIso);

  return [
    {
      source: 'active',
      record_ref: `commit_queue:${entry.intent_id}`,
      classification: expired ? 'needs-evidence' : 'live-risk',
      agent_id: entry.agent_id,
      reason: expired
        ? 'Anonymous Codex commit-queue entry is expired but not abandoned; inspect before cleanup.'
        : 'Anonymous Codex commit-queue entry is still live and can confuse commit ordering.',
    },
  ];
}

function auditClosedText(text: string): readonly CodexIdentityAuditFinding[] {
  const archive = unwrapOrThrow(parseClosedClaimsArchive(text));

  return archive.claims.flatMap((claim) => {
    if (!isAnonymousCodexAgent(claim.agent_id)) {
      return [];
    }

    return [
      {
        source: 'closed',
        record_ref: `claim:${claim.claim_id}`,
        classification: 'historical-no-repair',
        agent_id: claim.agent_id,
        reason:
          'Anonymous Codex closed claim is historical evidence; do not rewrite without stronger evidence.',
      },
    ];
  });
}

function auditThreadRecord(text: string): readonly CodexIdentityAuditFinding[] {
  return findThreadRecordIdentityRows(text).flatMap((row) => {
    if (!isAnonymousCodexAgent(row.agentId)) {
      return [];
    }

    const isCurrentRow = row.label === 'Last refreshed';

    return [
      {
        source: 'thread-record',
        record_ref: row.label,
        classification: isCurrentRow ? 'needs-evidence' : 'historical-no-repair',
        agent_id: row.agentId,
        reason: isCurrentRow
          ? 'Current thread identity row is anonymous; confirm the owning session before editing.'
          : 'Prior thread identity row is historical evidence; do not rewrite blindly.',
      },
    ];
  });
}

function summarise(findings: readonly CodexIdentityAuditFinding[]): CodexIdentityAuditSummary {
  return {
    total: findings.length,
    by_classification: {
      'historical-no-repair': countByClassification(findings, 'historical-no-repair'),
      'live-risk': countByClassification(findings, 'live-risk'),
      'needs-evidence': countByClassification(findings, 'needs-evidence'),
    },
  };
}

function countByClassification(
  findings: readonly CodexIdentityAuditFinding[],
  classification: CodexIdentityAuditClassification,
): number {
  return findings.filter((finding) => finding.classification === classification).length;
}
