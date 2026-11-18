import { parseCodexExecEvent } from './parse-events.js';
import type { CodexExecEvent, CommandExecution, LastMessageOutcome, TurnEvents } from './types.js';

/**
 * Fold one turn's JSONL lines, in order, into what the turn said.
 */
export function readTurnEvents(lines: readonly string[]): TurnEvents {
  const fold: TurnFold = {
    threadIds: [],
    agentMessages: [],
    commandExecutions: [],
    failures: [],
    unexpectedItems: [],
    turnStarts: 0,
    turnCompletions: 0,
    endsWithCompletion: false,
    unrecognisedLines: 0,
  };
  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    const event = parseCodexExecEvent(line);
    if (event === undefined) {
      fold.unrecognisedLines += 1;
      continue;
    }
    foldEvent(fold, event);
    fold.endsWithCompletion = event.kind === 'turn-completed';
  }
  return fold;
}

interface TurnFold {
  readonly threadIds: string[];
  readonly agentMessages: string[];
  readonly commandExecutions: CommandExecution[];
  readonly failures: string[];
  readonly unexpectedItems: string[];
  turnStarts: number;
  turnCompletions: number;
  endsWithCompletion: boolean;
  unrecognisedLines: number;
}

type ItemEvent = Extract<
  CodexExecEvent,
  {
    readonly kind:
      'item-progress' | 'agent-message' | 'command-execution' | 'unused-item' | 'unexpected-item';
  }
>;

function foldEvent(fold: TurnFold, event: CodexExecEvent): void {
  switch (event.kind) {
    case 'thread-started':
      fold.threadIds.push(event.threadId);
      return;
    case 'turn-started':
      fold.turnStarts += 1;
      return;
    case 'turn-completed':
      fold.turnCompletions += 1;
      return;
    case 'turn-failed':
    case 'stream-error':
      fold.failures.push(event.message);
      return;
    default:
      foldItemEvent(fold, event);
  }
}

function foldItemEvent(fold: TurnFold, event: ItemEvent): void {
  switch (event.kind) {
    case 'agent-message':
      fold.agentMessages.push(event.text);
      return;
    case 'command-execution':
      fold.commandExecutions.push({
        command: event.command,
        output: event.output,
        exitCode: event.exitCode,
      });
      return;
    case 'unexpected-item':
      if (!fold.unexpectedItems.includes(event.itemType)) {
        fold.unexpectedItems.push(event.itemType);
      }
      return;
    case 'item-progress':
    case 'unused-item':
      return;
    default: {
      const unhandled: never = event;
      return unhandled;
    }
  }
}

/**
 * Extract the last agent message from a sequence of JSONL lines.
 *
 * The final assistant text is on `type === "item.completed"` events
 * where `item.type === "agent_message"`, at `item.text`.
 */
export function extractLastAgentMessage(lines: readonly string[]): LastMessageOutcome {
  const lastText = readTurnEvents(lines).agentMessages.at(-1);
  if (lastText === undefined) {
    return { found: false };
  }
  return { found: true, text: lastText };
}
