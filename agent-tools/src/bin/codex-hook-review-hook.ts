#!/usr/bin/env node
/**
 * Fail-soft process adapter for the Claude PostToolBatch Codex review hook.
 *
 * @packageDocumentation
 */

import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { type CodexReviewHookOutput } from '../codex-hook-review/hook-runtime.js';
import { runProductionCodexReviewHook } from '../codex-hook-review/production.js';
import { CODEX_HOOK_MARKER } from '../codex-hook-review/settings.js';

/** Injected bin surfaces used to verify output without process-global mocks. */
export interface CodexHookReviewBinDependencies {
  readonly runProduction: () => Promise<CodexReviewHookOutput>;
  readonly write: (text: string) => unknown;
}

/** Run production composition and write exactly one JSON line, or `{}` on failure. */
export async function runCodexHookReviewBin(
  dependencies: CodexHookReviewBinDependencies,
): Promise<void> {
  const output = await runOrEmpty(dependencies.runProduction);
  dependencies.write(`${JSON.stringify(output)}\n`);
}

async function runOrEmpty(
  runProduction: () => Promise<CodexReviewHookOutput>,
): Promise<CodexReviewHookOutput> {
  try {
    return await runProduction();
  } catch {
    return {};
  }
}

function isDirectExecution(): boolean {
  const entryPath = process.argv[1];
  return (
    entryPath !== undefined &&
    fileURLToPath(import.meta.url) === resolve(entryPath) &&
    process.argv[2] === CODEX_HOOK_MARKER
  );
}

if (isDirectExecution()) {
  await runCodexHookReviewBin({
    runProduction: runProductionCodexReviewHook,
    write: (text) => process.stdout.write(text),
  });
}
