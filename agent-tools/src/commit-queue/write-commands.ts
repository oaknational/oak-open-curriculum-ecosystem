/**
 * The registry-writing commit-queue CLI commands (enqueue, phase,
 * record-staged, verify-staged, complete), split from `cli.ts` so the
 * top-level command router stays inside its file-size budget. Every
 * registry write flows through `updateRegistry`, which decomposes onto the
 * claims file and the per-intent store and owes the lazy expiry sweep.
 */
import { unwrapOrThrow, type Result } from '@oaknational/result';

import {
  completeCommitIntent,
  getFreshEntriesAhead,
  recordStagedBundle,
  updateCommitIntentPhase,
} from './core.js';
import { enqueueCommitIntent } from './enqueue.js';
import { optionString, requireOption, requirePhase } from './args.js';
import { getStagedBundle } from './git.js';
import { narrowIntentPathspec } from './pathspec.js';
import { createIntent } from './intent.js';
import { readRegistry, updateRegistry } from './registry.js';
import {
  type CommitIntent,
  type CommitQueueCliInput,
  type CommitQueueCliOptions,
  type CommitQueueRegistry,
} from './types.js';
import { writeVerificationResult } from './verify-output.js';

export function readRegistryForCli(
  input: CommitQueueCliInput,
  registryPath: string,
  nowIso: string,
): Promise<Result<CommitQueueRegistry, Error>> {
  return (input.readRegistry ?? ((path: string) => readRegistry(path, { nowIso })))(registryPath);
}

export async function runEnqueueCommand(input: CommandInputWithCli): Promise<number> {
  // A DRAFT: the order key is assigned inside the transform below, under
  // the claims-file lock, where the live queue it derives from is stable.
  const draft = createIntent(input.options);
  await updateRegistry(
    input.registryPath,
    (registry) => {
      if (!registry.claims.some((claim) => claim.claim_id === draft.claim_id)) {
        throw new Error(`unknown claim_id: ${draft.claim_id}`);
      }

      return enqueueCommitIntent({ registry, draft });
    },
    input.now,
  );
  (input.input.stdout ?? process.stdout).write(`${draft.intent_id}\n`);
  return 0;
}

export async function runPhaseCommand(input: CommandInputWithNow): Promise<number> {
  const phase = requirePhase(input.options);
  const intentId = requireOption(input.options, 'intent-id');
  await updateRegistry(
    input.registryPath,
    (registry) => {
      requireIntent(registry, intentId);
      return updateCommitIntentPhase({
        registry,
        intentId,
        phase,
        nowIso: input.now,
        notes: optionString(input.options, 'notes'),
      });
    },
    input.now,
  );
  return 0;
}

export async function runRecordStagedCommand(input: CommandInputWithCli): Promise<number> {
  const intentId = requireOption(input.options, 'intent-id');
  const registryBefore = unwrapOrThrow(
    await readRegistryForCli(input.input, input.registryPath, input.now),
  );
  const intent = requireIntent(registryBefore, intentId);
  const narrowed = narrowIntentPathspec(intent);
  if (!narrowed.ok) {
    process.stderr.write(`intent ${intent.intent_id}: ${narrowed.reason}\n`);
    return 1;
  }
  const staged = getStagedBundle({
    gitRoot: input.input.resolveGitRoot(),
    pathspec: narrowed.pathspec,
  });
  await updateRegistry(
    input.registryPath,
    (registry) => {
      requireIntent(registry, intentId);
      return recordStagedBundle({
        registry,
        intentId,
        nowIso: input.now,
        stagedNameStatus: staged.stagedNameStatus,
        stagedPatch: staged.stagedPatch,
      });
    },
    input.now,
  );
  return 0;
}

export function runVerifyStagedCommand(input: VerifyInput): number {
  const intentId = requireOption(input.options, 'intent-id');
  const intent = requireIntent(input.registry, intentId);
  const entriesAhead = getFreshEntriesAhead(input.registry.commit_queue, intentId, input.now);
  if (entriesAhead.length > 0) {
    process.stderr.write(`fresh queue entries ahead: ${formatIntentIds(entriesAhead)}\n`);
    return 1;
  }

  const narrowed = narrowIntentPathspec(intent);
  if (!narrowed.ok) {
    process.stderr.write(`intent ${intent.intent_id}: ${narrowed.reason}\n`);
    return 1;
  }

  return writeVerificationResult({
    intent,
    staged: getStagedBundle({
      gitRoot: input.gitRoot,
      pathspec: narrowed.pathspec,
    }),
    commitSubject: requireOption(input.options, 'commit-subject'),
  });
}

export async function runCompleteCommand(input: CommandInputWithNow): Promise<number> {
  const intentId = requireOption(input.options, 'intent-id');
  await updateRegistry(
    input.registryPath,
    (registry) => {
      requireIntent(registry, intentId);
      return completeCommitIntent({ registry, intentId });
    },
    input.now,
  );
  return 0;
}

function formatIntentIds(entries: readonly CommitIntent[]): string {
  return entries.map((entry) => entry.intent_id).join(', ');
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
  readonly options: CommitQueueCliOptions;
}

export interface CommandInputWithNow extends CommandInput {
  readonly now: string;
}

export interface CommandInputWithCli extends CommandInputWithNow {
  readonly input: CommitQueueCliInput;
}

export interface VerifyInput {
  readonly registry: CommitQueueRegistry;
  readonly options: CommitQueueCliOptions;
  readonly now: string;
  /** Root of the INVOKING git worktree — never the coordination home (F-138). */
  readonly gitRoot: string;
}
