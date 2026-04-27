import { randomUUID } from 'node:crypto';

import {
  completeCommitIntent,
  enqueueCommitIntent,
  getFreshEntriesAhead,
  normalizeRepoPath,
  recordStagedBundle,
  updateCommitIntentPhase,
  verifyStagedBundle,
} from './core.js';
import {
  nowIso,
  optionString,
  requireOption,
  requirePhase,
  resolveRegistryPath,
  usage,
} from './args.js';
import { getStagedBundle } from './git.js';
import { readRegistry, writeRegistry } from './registry.js';
import {
  type CommitIntent,
  type CommitQueueCliInput,
  type CommitQueueCliOptions,
  type CommitQueuePhase,
  type CommitQueueRegistry,
  type StagedBundle,
} from './types.js';

const DEFAULT_TTL_SECONDS = 900;

/**
 * Run a commit-queue CLI command against the current repository.
 */
export async function runCommitQueueCli(input: CommitQueueCliInput): Promise<number> {
  const registryPath = resolveRegistryPath(input.repoRoot, input.options);
  const registry = await readRegistry(registryPath);
  const now = nowIso(input.options);

  if (input.command === 'enqueue') {
    return runEnqueueCommand({ registryPath, registry, options: input.options });
  }
  if (input.command === 'phase') {
    return runPhaseCommand({ registryPath, registry, options: input.options, now });
  }
  if (input.command === 'record-staged') {
    return runRecordStagedCommand({ registryPath, registry, options: input.options, now, input });
  }
  if (input.command === 'verify-staged') {
    return runVerifyStagedCommand({
      registry,
      options: input.options,
      now,
      repoRoot: input.repoRoot,
    });
  }
  if (input.command === 'complete') {
    return runCompleteCommand({ registryPath, registry, options: input.options });
  }

  throw new Error(usage());
}

function createIntent(options: CommitQueueCliOptions): CommitIntent {
  const now = nowIso(options);
  if (options.file.length === 0) {
    throw new Error('at least one --file entry is required');
  }

  return {
    intent_id: optionOrRandomId(options),
    claim_id: requireOption(options, 'claim-id'),
    agent_id: {
      agent_name: requireOption(options, 'agent-name'),
      platform: requireOption(options, 'platform'),
      model: requireOption(options, 'model'),
      session_id_prefix: requireOption(options, 'session-id-prefix'),
    },
    files: options.file.map(normalizeRepoPath),
    commit_subject: requireOption(options, 'commit-subject'),
    queued_at: now,
    updated_at: now,
    expires_at: expiresAtIso(now, Number(options['ttl-seconds'] ?? DEFAULT_TTL_SECONDS)),
    phase: 'queued',
  };
}

function optionOrRandomId(options: CommitQueueCliOptions): string {
  const intentId = options['intent-id'];
  return typeof intentId === 'string' ? intentId : randomUUID();
}

function expiresAtIso(startIso: string, ttlSeconds: number): string {
  return new Date(Date.parse(startIso) + ttlSeconds * 1000).toISOString();
}

async function runEnqueueCommand(input: CommandInput): Promise<number> {
  const intent = createIntent(input.options);
  if (!input.registry.claims.some((claim) => claim.claim_id === intent.claim_id)) {
    throw new Error(`unknown claim_id: ${intent.claim_id}`);
  }

  await writeRegistry(
    input.registryPath,
    enqueueCommitIntent({ registry: input.registry, intent }),
  );
  process.stdout.write(`${intent.intent_id}\n`);
  return 0;
}

async function runPhaseCommand(input: CommandInputWithNow): Promise<number> {
  const phase = requirePhase(input.options);
  const intentId = requireOption(input.options, 'intent-id');
  requireIntent(input.registry, intentId);
  await writeRegistry(input.registryPath, phaseRegistry(input, phase, intentId));
  return 0;
}

async function runRecordStagedCommand(input: CommandInputWithCli): Promise<number> {
  const intentId = requireOption(input.options, 'intent-id');
  requireIntent(input.registry, intentId);
  const staged = getStagedBundle(input.input.repoRoot);
  await writeRegistry(input.registryPath, stagedRegistry(input, intentId, staged));
  return 0;
}

function runVerifyStagedCommand(input: VerifyInput): number {
  const intentId = requireOption(input.options, 'intent-id');
  const intent = requireIntent(input.registry, intentId);
  const entriesAhead = getFreshEntriesAhead(input.registry.commit_queue, intentId, input.now);
  if (entriesAhead.length > 0) {
    process.stderr.write(`fresh queue entries ahead: ${formatIntentIds(entriesAhead)}\n`);
    return 1;
  }

  return writeVerificationResult({
    intent,
    staged: getStagedBundle(input.repoRoot),
    commitSubject: requireOption(input.options, 'commit-subject'),
  });
}

async function runCompleteCommand(input: CommandInput): Promise<number> {
  const intentId = requireOption(input.options, 'intent-id');
  requireIntent(input.registry, intentId);
  await writeRegistry(
    input.registryPath,
    completeCommitIntent({ registry: input.registry, intentId }),
  );
  return 0;
}

function phaseRegistry(
  input: CommandInputWithNow,
  phase: CommitQueuePhase,
  intentId: string,
): CommitQueueRegistry {
  return updateCommitIntentPhase({
    registry: input.registry,
    intentId,
    phase,
    nowIso: input.now,
    notes: optionString(input.options, 'notes'),
  });
}

function stagedRegistry(
  input: CommandInputWithNow,
  intentId: string,
  staged: StagedBundle,
): CommitQueueRegistry {
  return recordStagedBundle({
    registry: input.registry,
    intentId,
    nowIso: input.now,
    stagedNameStatus: staged.stagedNameStatus,
    stagedPatch: staged.stagedPatch,
  });
}

function formatIntentIds(entries: readonly CommitIntent[]): string {
  return entries.map((entry) => entry.intent_id).join(', ');
}

function writeVerificationResult(input: {
  readonly intent: CommitIntent;
  readonly staged: StagedBundle;
  readonly commitSubject: string;
}): number {
  const result = verifyStagedBundle({
    intent: input.intent,
    stagedNameOnly: input.staged.stagedNameOnly,
    stagedNameStatus: input.staged.stagedNameStatus,
    stagedPatch: input.staged.stagedPatch,
    commitSubject: input.commitSubject,
  });

  if (!result.ok) {
    process.stderr.write(`${result.reason}\n`);
    return 1;
  }

  process.stdout.write(`${result.fingerprint}\n`);
  return 0;
}

function requireIntent(registry: CommitQueueRegistry, intentId: string): CommitIntent {
  const intent = registry.commit_queue.find((entry) => entry.intent_id === intentId);
  if (intent === undefined) {
    throw new Error(`unknown intent_id: ${intentId}`);
  }

  return intent;
}

interface CommandInput {
  readonly registryPath: string;
  readonly registry: CommitQueueRegistry;
  readonly options: CommitQueueCliOptions;
}

interface CommandInputWithNow extends CommandInput {
  readonly now: string;
}

interface CommandInputWithCli extends CommandInputWithNow {
  readonly input: CommitQueueCliInput;
}

interface VerifyInput {
  readonly registry: CommitQueueRegistry;
  readonly options: CommitQueueCliOptions;
  readonly now: string;
  readonly repoRoot: string;
}
