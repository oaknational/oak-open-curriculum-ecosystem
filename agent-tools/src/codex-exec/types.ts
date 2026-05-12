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
 * A parsed event from `codex exec --json` JSONL output.
 */
export interface CodexExecEvent {
  readonly type: string;
  readonly item?: CodexExecEventItem;
}

export interface CodexExecEventItem {
  readonly id?: string;
  readonly type?: string;
  readonly text?: string;
  readonly message?: string;
}

export interface CodexExecCliInput {
  readonly command: string | undefined;
  readonly args: readonly string[];
  readonly stdin: NodeJS.ReadableStream;
  readonly stdout: { write(chunk: string): void };
  readonly stderr: { write(chunk: string): void };
}
