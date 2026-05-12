import {
  completeCommitIntent,
  enqueueCommitIntent,
  getFreshEntriesAhead,
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
import { createIntent } from './intent.js';
import { validateCommandOptions } from './options.js';
import { isCommitQueueReadCommand, runCommitQueueReadCommand } from './read-commands.js';
import { readRegistry, updateRegistry } from './registry.js';
import {
  type CommitIntent,
  type CommitQueueCliInput,
  type CommitQueueCliOptions,
  type CommitQueuePhase,
  type CommitQueueRegistry,
  type StagedBundle,
} from './types.js';

/**
 * Run a commit-queue CLI command against the current repository.
 */
export async function runCommitQueueCli(input: CommitQueueCliInput): Promise<number> {
  if (isHelpCommand(input.command, input.options)) {
    writeStdout(input, `${usage()}\n`);
    return 0;
  }

  validateCommandOptions(input.command, input.options);
  const registryPath = resolveRegistryPath(input.repoRoot, input.options);
  const now = nowIso(input.options);

  if (input.command === 'enqueue') {
    return runEnqueueCommand({ registryPath, options: input.options });
  }
  if (input.command === 'phase') {
    return runPhaseCommand({ registryPath, options: input.options, now });
  }
  if (input.command === 'record-staged') {
    return runRecordStagedCommand({ registryPath, options: input.options, now, input });
  }
  if (input.command === 'verify-staged') {
    return runVerifyStagedCommand({
      registry: await readRegistry(registryPath),
      options: input.options,
      now,
      repoRoot: input.repoRoot,
    });
  }
  if (input.command === 'complete') {
    return runCompleteCommand({ registryPath, options: input.options });
  }
  if (isCommitQueueReadCommand(input.command)) {
    return runCommitQueueReadCommand({
      command: input.command,
      registry: await readRegistryForCli(input, registryPath),
      options: input.options,
      now,
      stdout: input.stdout,
    });
  }

  throw new Error(usage());
}

function readRegistryForCli(
  input: CommitQueueCliInput,
  registryPath: string,
): Promise<CommitQueueRegistry> {
  return (input.readRegistry ?? readRegistry)(registryPath);
}

async function runEnqueueCommand(input: CommandInput): Promise<number> {
  const intent = createIntent(input.options);
  await updateRegistry(input.registryPath, (registry) => {
    if (!registry.claims.some((claim) => claim.claim_id === intent.claim_id)) {
      throw new Error(`unknown claim_id: ${intent.claim_id}`);
    }

    return enqueueCommitIntent({ registry, intent });
  });
  process.stdout.write(`${intent.intent_id}\n`);
  return 0;
}

async function runPhaseCommand(input: CommandInputWithNow): Promise<number> {
  const phase = requirePhase(input.options);
  const intentId = requireOption(input.options, 'intent-id');
  await updateRegistry(input.registryPath, (registry) => {
    requireIntent(registry, intentId);
    return phaseRegistry(input, registry, phase, intentId);
  });
  return 0;
}

async function runRecordStagedCommand(input: CommandInputWithCli): Promise<number> {
  const intentId = requireOption(input.options, 'intent-id');
  const staged = getStagedBundle(input.input.repoRoot);
  await updateRegistry(input.registryPath, (registry) => {
    requireIntent(registry, intentId);
    return stagedRegistry(input, registry, intentId, staged);
  });
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
  await updateRegistry(input.registryPath, (registry) => {
    requireIntent(registry, intentId);
    return completeCommitIntent({ registry, intentId });
  });
  return 0;
}

function phaseRegistry(
  input: CommandInputWithNow,
  registry: CommitQueueRegistry,
  phase: CommitQueuePhase,
  intentId: string,
): CommitQueueRegistry {
  return updateCommitIntentPhase({
    registry,
    intentId,
    phase,
    nowIso: input.now,
    notes: optionString(input.options, 'notes'),
  });
}

function stagedRegistry(
  input: CommandInputWithNow,
  registry: CommitQueueRegistry,
  intentId: string,
  staged: StagedBundle,
): CommitQueueRegistry {
  return recordStagedBundle({
    registry,
    intentId,
    nowIso: input.now,
    stagedNameStatus: staged.stagedNameStatus,
    stagedPatch: staged.stagedPatch,
  });
}

function formatIntentIds(entries: readonly CommitIntent[]): string {
  return entries.map((entry) => entry.intent_id).join(', ');
}

function isHelpCommand(command: string | undefined, options: CommitQueueCliOptions): boolean {
  return (
    command === undefined ||
    command === 'help' ||
    command === '--help' ||
    command === '-h' ||
    optionString(options, 'help') === 'true'
  );
}

function writeStdout(input: CommitQueueCliInput, chunk: string): void {
  (input.stdout ?? process.stdout).write(chunk);
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
    worktreeShortStatus: input.staged.worktreeShortStatus,
    commitSubject: input.commitSubject,
  });

  if (!result.ok) {
    process.stderr.write(`${result.reason}\n`);
    return 1;
  }

  if (result.warning !== undefined) {
    process.stderr.write(`${result.warning}\n`);
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
