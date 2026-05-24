import { getFreshEntriesAhead } from './core.js';
import { formatFileList, normalizeFileList } from './path-list.js';
import {
  isActiveCommitQueuePhase,
  type CommitIntent,
  type CommitQueueAgentId,
  type CommitQueueClaim,
  type CommitQueueRegistry,
} from './types.js';
import { secondsUntilExpiry } from './time.js';

/**
 * Verify that requested stage paths are covered by a fresh queue intent.
 */
export function guardStageFiles(input: {
  readonly registry: CommitQueueRegistry;
  readonly agentId: CommitQueueAgentId;
  readonly files: readonly string[];
  readonly nowIso: string;
}):
  | { readonly ok: true; readonly intent: CommitIntent }
  | { readonly ok: false; readonly reason: string } {
  const files = normalizeFileList(input.files.join('\n'));
  if (files.length === 0) {
    return { ok: false, reason: 'at least one --file entry is required' };
  }

  const intents = input.registry.commit_queue.filter((intent) =>
    intentCoversStageRequest({ intent, agentId: input.agentId, files, nowIso: input.nowIso }),
  );
  if (intents.length === 0) {
    return {
      ok: false,
      reason:
        `no fresh active commit-queue intent for ${formatAgent(input.agentId)} ` +
        `matches requested files: ${formatFileList(files)}. ` +
        'Enqueue the bundle before staging: pnpm agent-tools:commit-queue -- enqueue ...',
    };
  }
  if (intents.length > 1) {
    return {
      ok: false,
      reason: `multiple fresh matching commit-queue intents: ${formatIntentIds(intents)}`,
    };
  }

  return guardIntentClaim({
    registry: input.registry,
    intent: intents[0],
    agentId: input.agentId,
    nowIso: input.nowIso,
  });
}

function guardIntentClaim(input: {
  readonly registry: CommitQueueRegistry;
  readonly intent: CommitIntent;
  readonly agentId: CommitQueueAgentId;
  readonly nowIso: string;
}):
  | { readonly ok: true; readonly intent: CommitIntent }
  | { readonly ok: false; readonly reason: string } {
  const entriesAhead = getFreshEntriesAhead(
    input.registry.commit_queue,
    input.intent.intent_id,
    input.nowIso,
  );
  if (entriesAhead.length > 0) {
    return {
      ok: false,
      reason: `fresh queue entries ahead: ${formatIntentIds(entriesAhead)}`,
    };
  }

  const claim = input.registry.claims.find((entry) => entry.claim_id === input.intent.claim_id);
  if (claim === undefined) {
    return {
      ok: false,
      reason: `queued intent ${input.intent.intent_id} references missing claim ${input.intent.claim_id}`,
    };
  }
  if (!claimBelongsToAgent(claim, input.agentId)) {
    return {
      ok: false,
      reason:
        `queued intent ${input.intent.intent_id} claim ${claim.claim_id} ` +
        `does not belong to ${formatAgent(input.agentId)}`,
    };
  }
  if (!claimCoversGitIndexHead(claim)) {
    return {
      ok: false,
      reason:
        `queued intent ${input.intent.intent_id} claim ${claim.claim_id} ` +
        'is not an active git:index/head claim',
    };
  }

  return { ok: true, intent: input.intent };
}

function intentCoversStageRequest(input: {
  readonly intent: CommitIntent;
  readonly agentId: CommitQueueAgentId;
  readonly files: readonly string[];
  readonly nowIso: string;
}): boolean {
  if (
    !isActiveCommitQueuePhase(input.intent.phase) ||
    secondsUntilExpiry(input.intent.expires_at, input.nowIso) < 0 ||
    !sameAgent(input.intent.agent_id, input.agentId)
  ) {
    return false;
  }

  const intentFiles = normalizeFileList(input.intent.files.join('\n'));
  return input.files.every((file) => intentFiles.includes(file));
}

function claimBelongsToAgent(claim: CommitQueueClaim, agentId: CommitQueueAgentId): boolean {
  return claim.agent_id !== undefined && sameAgent(claim.agent_id, agentId);
}

function claimCoversGitIndexHead(claim: CommitQueueClaim): boolean {
  return (
    claim.areas?.some(
      (area) =>
        area.kind === 'git' && normalizeFileList(area.patterns.join('\n')).includes('index/head'),
    ) ?? false
  );
}

function sameAgent(left: CommitQueueAgentId, right: CommitQueueAgentId): boolean {
  return (
    left.agent_name === right.agent_name &&
    left.platform === right.platform &&
    left.model === right.model &&
    left.session_id_prefix === right.session_id_prefix
  );
}

function formatAgent(agentId: CommitQueueAgentId): string {
  return `${agentId.agent_name} / ${agentId.platform} / ${agentId.model} / ${agentId.session_id_prefix}`;
}

function formatIntentIds(entries: readonly CommitIntent[]): string {
  return entries.map((entry) => entry.intent_id).join(', ');
}
