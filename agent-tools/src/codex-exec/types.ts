export type OutputFormat = 'text' | 'json';

interface LastMessageResult {
  readonly found: true;
  readonly text: string;
}

interface LastMessageNotFound {
  readonly found: false;
}

export type LastMessageOutcome = LastMessageResult | LastMessageNotFound;

/**
 * One shell run the harness recorded, from a completed `command_execution` item.
 */
export interface CommandExecution {
  readonly command: string;
  readonly output: string;
  readonly exitCode: number | undefined;
}

/**
 * Completed items the verdict knows and does not use. An `error` item inside
 * a turn is non-fatal; only a top-level `turn.failed` or `error` event fails
 * a turn.
 */
export type UnusedItemType = 'reasoning' | 'todo_list' | 'error';

/**
 * A parsed event from `codex exec --json` JSONL output, as a closed union
 * over the documented top-level types. A completed item of any type outside
 * the known set reads as unexpected, because under the envelope a file
 * change, an MCP call or a web search means the envelope has lapsed.
 */
export type CodexExecEvent =
  | { readonly kind: 'thread-started'; readonly threadId: string }
  | { readonly kind: 'turn-started' }
  | { readonly kind: 'turn-completed' }
  | { readonly kind: 'turn-failed'; readonly message: string }
  | { readonly kind: 'stream-error'; readonly message: string }
  | { readonly kind: 'item-progress' }
  | { readonly kind: 'agent-message'; readonly text: string }
  | ({ readonly kind: 'command-execution' } & CommandExecution)
  | { readonly kind: 'unused-item'; readonly itemType: UnusedItemType }
  | { readonly kind: 'unexpected-item'; readonly itemType: string };

/**
 * Everything one turn's JSONL stream says, folded in order.
 */
export interface TurnEvents {
  readonly threadIds: readonly string[];
  readonly agentMessages: readonly string[];
  readonly commandExecutions: readonly CommandExecution[];
  readonly failures: readonly string[];
  /** The types of completed items the envelope should make impossible. */
  readonly unexpectedItems: readonly string[];
  readonly turnStarts: number;
  readonly turnCompletions: number;
  /** Whether the last recognised event was a turn's completion. */
  readonly endsWithCompletion: boolean;
  /** Non-blank lines that are not a recognised event. */
  readonly unrecognisedLines: number;
}

export interface CodexExecCliInput {
  readonly command: string | undefined;
  readonly args: readonly string[];
  readonly stdin: NodeJS.ReadableStream;
  readonly stdout: { write(chunk: string): void };
  readonly stderr: { write(chunk: string): void };
}
