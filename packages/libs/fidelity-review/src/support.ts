/*
 * Shared runtime support for the tools/ evidence CLIs: the linear string trims
 * (replacing the backtracking-prone regex-trim idioms, Sonar S8786 — previously
 * duplicated across capture-live-demo.ts and measure-320.ts), thrown-value
 * formatting, and the single process boundary every tool funnels its failure
 * Result through (use-result-pattern / ADR-088 — the tools do not throw).
 */
// Explicit module import, never the ambient global (lib boundary rule):
// runTool IS the process boundary — the one place the package touches
// exit codes and stdout — and the import keeps that visible in the graph
// (the logger package's node.ts sets this shape).
import process from 'node:process';

import type { Result } from '@oaknational/result';

/** Strip every trailing occurrence of `char` — a linear scan. */
export function stripTrailing(value: string, char: string): string {
  let end = value.length;
  while (end > 0 && value.charAt(end - 1) === char) {
    end -= 1;
  }
  return value.slice(0, end);
}

/** Describe a caught value for a failure line: an Error's stack when present,
 *  else its message, else the stringified value. */
export function describeThrown(error: unknown): string {
  if (error instanceof Error) {
    return error.stack ?? error.message;
  }
  return String(error);
}

/**
 * The single process boundary of a tool run: awaits `main`, translates any
 * caught throw (Playwright / node APIs) into a failure line via
 * `formatCaught`, writes a failure line to stderr and exits non-zero. Failure
 * Results carry their final, fully formatted stderr line — the boundary adds
 * nothing to them, so each tool's failure output stays exactly its own.
 *
 * @param main - The tool's orchestrator; an `Err` is the tool's failure line
 * @param formatCaught - Builds the failure line for a thrown (non-Result) value
 */
export async function runTool(
  main: () => Promise<Result<void, string>>,
  formatCaught: (error: unknown) => string,
): Promise<void> {
  let failure: string | undefined;
  try {
    const result = await main();
    failure = result.ok ? undefined : result.error;
  } catch (error: unknown) {
    failure = formatCaught(error);
  }
  if (failure !== undefined) {
    process.stderr.write(`${failure}\n`);
    process.exit(1);
  }
}
