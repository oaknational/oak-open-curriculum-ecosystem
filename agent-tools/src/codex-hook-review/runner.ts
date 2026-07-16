import { Buffer } from 'node:buffer';

import { createCodexProcessRequest, type ReviewModelConfiguration } from './configuration.js';
import {
  CODEX_PROCESS_STREAM_LIMIT_BYTES,
  productionCodexProcessRunner,
  type CodexProcessFailureReason,
  type CodexProcessRunner,
} from './process-runner.js';
import {
  inspectCodexJsonlLine,
  parseCodexJsonl,
  type CodexProtocolError,
  type CodexUsage,
} from './protocol.js';
import { type ReviewRuntimeLayout } from './review-assets.js';
import { type InstructionMechanism } from './tournament-types.js';
import { type ReviewDecision } from './types.js';
import { parseReviewDecision } from './verdict.js';

export type CodexReviewFailureReason =
  | 'invalid-input'
  | CodexProcessFailureReason
  | CodexProtocolError['kind'];

export type CodexReviewOutcome =
  | {
      readonly kind: 'completed';
      readonly decision: ReviewDecision;
      readonly usage: CodexUsage;
      readonly reasoningItemCount: number;
      readonly durationMs: number;
    }
  | {
      readonly kind: 'failed';
      readonly reason: CodexReviewFailureReason;
      readonly durationMs: number;
    };

export interface RunCodexHookReviewInput {
  readonly payload: string;
  readonly changeCount: number;
  readonly modelConfiguration: ReviewModelConfiguration;
  readonly mechanism: InstructionMechanism;
  readonly layout: ReviewRuntimeLayout;
  readonly sourceEnvironment: Readonly<NodeJS.ProcessEnv>;
  readonly codexExecutable: string;
  readonly processRunner?: CodexProcessRunner;
}

/** Run one context-bounded semantic review and fail closed on any protocol drift. */
export async function runCodexHookReview(
  input: RunCodexHookReviewInput,
): Promise<CodexReviewOutcome> {
  if (!isValidChangeCount(input.changeCount)) {
    return invalidInput();
  }
  const request = createCodexProcessRequest(input);
  if (!request.ok) {
    return invalidInput();
  }
  const processOutcome = await runProcess(input.processRunner, {
    ...request.value,
    inspectStdoutLine: inspectCodexJsonlLine,
  });
  if (processOutcome.kind === 'failed') {
    return processOutcome;
  }
  if (Buffer.byteLength(processOutcome.stdout, 'utf8') > CODEX_PROCESS_STREAM_LIMIT_BYTES) {
    return { kind: 'failed', reason: 'stdout-limit', durationMs: processOutcome.durationMs };
  }
  const protocol = parseCodexJsonl(processOutcome.stdout);
  if (!protocol.ok) {
    return { kind: 'failed', reason: protocol.error.kind, durationMs: processOutcome.durationMs };
  }
  const decision = parseReviewDecision(protocol.value.agentMessage, input.changeCount);
  if (!decision.ok) {
    return { kind: 'failed', reason: 'schema-failure', durationMs: processOutcome.durationMs };
  }
  return {
    kind: 'completed',
    decision: decision.value,
    usage: protocol.value.usage,
    reasoningItemCount: protocol.value.reasoningItemCount,
    durationMs: processOutcome.durationMs,
  };
}

async function runProcess(
  runner: CodexProcessRunner | undefined,
  request: Parameters<CodexProcessRunner['run']>[0],
): Promise<Awaited<ReturnType<CodexProcessRunner['run']>>> {
  try {
    return await (runner ?? productionCodexProcessRunner).run(request);
  } catch {
    return { kind: 'failed', reason: 'process-error', durationMs: 0 };
  }
}

function isValidChangeCount(changeCount: number): boolean {
  return Number.isInteger(changeCount) && changeCount >= 1 && changeCount <= 3;
}

function invalidInput(): CodexReviewOutcome {
  return { kind: 'failed', reason: 'invalid-input', durationMs: 0 };
}
