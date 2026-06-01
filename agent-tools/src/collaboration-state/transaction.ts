import { readFile } from 'node:fs/promises';

import { writeTextAtomically } from './atomic-file.js';
import { acquireFileTransactionLock } from './transaction-lock.js';

const DEFAULT_LOCK_STALE_MS = 30000;
const DEFAULT_LOCK_ATTEMPTS = 100;

/**
 * Optimistically update JSON text, retrying when another writer changes the
 * state between the initial read and the verification read.
 */
export async function updateJsonStateWithRetry<T>(input: {
  readonly readText: () => string | Promise<string>;
  readonly writeText: (text: string) => void | Promise<void>;
  readonly parseText: (text: string) => T;
  readonly validateText: (text: string) => void | Promise<void>;
  readonly transform: (value: T) => T;
  readonly maxAttempts: number;
}): Promise<{ readonly attempts: number }> {
  for (let attempt = 1; attempt <= input.maxAttempts; attempt += 1) {
    const originalText = await input.readText();
    const nextValue = input.transform(input.parseText(originalText));
    const verificationText = await input.readText();

    if (verificationText !== originalText) {
      continue;
    }

    await input.writeText(
      await serializeJson(nextValue, async (text) => {
        input.parseText(text);
        await input.validateText(text);
      }),
    );
    return { attempts: attempt };
  }

  throw new Error(`state changed during ${input.maxAttempts} write attempts`);
}

/**
 * Run a JSON state transaction behind short-lived file transaction directories.
 */
export async function runJsonStateTransaction<T>(input: {
  readonly filePaths: readonly string[];
  readonly operation: () => Promise<T>;
  readonly lockStaleMs?: number;
  readonly lockAttempts?: number;
}): Promise<T> {
  const releases: (() => Promise<void>)[] = [];
  try {
    for (const filePath of uniqueSortedPaths(input.filePaths)) {
      releases.push(
        await acquireFileTransactionLock({
          filePath,
          staleMs: input.lockStaleMs ?? DEFAULT_LOCK_STALE_MS,
          attempts: input.lockAttempts ?? DEFAULT_LOCK_ATTEMPTS,
        }),
      );
    }

    return await input.operation();
  } finally {
    await releaseLocks(releases);
  }
}

/**
 * Write JSON through a temp file and rename while holding the file transaction.
 */
export async function writeJsonFileAtomically(input: {
  readonly filePath: string;
  readonly value: unknown;
  readonly validateText: (text: string) => void | Promise<void>;
}): Promise<void> {
  await runJsonStateTransaction({
    filePaths: [input.filePath],
    operation: () => writeJsonFileWithinTransaction(input),
  });
}

/**
 * Write JSON through a temp file and rename inside an existing transaction.
 */
export async function writeJsonFileWithinTransaction(input: {
  readonly filePath: string;
  readonly value: unknown;
  readonly validateText: (text: string) => void | Promise<void>;
}): Promise<void> {
  await writeJsonTextAtomically(
    input.filePath,
    await serializeJson(input.value, input.validateText),
  );
}

/**
 * Exclusively create a JSON file through validated serialization and an atomic
 * same-directory temp-file publish. The target path is never overwritten.
 */
export async function createJsonFileAtomically(input: {
  readonly filePath: string;
  readonly value: unknown;
  readonly validateText: (text: string) => void | Promise<void>;
}): Promise<void> {
  await writeJsonTextAtomically(
    input.filePath,
    await serializeJson(input.value, input.validateText),
    {
      exclusiveCreate: true,
    },
  );
}

/**
 * Write text through a temp file and rename so readers never see partial text.
 */
export async function writeTextFileAtomically(input: {
  readonly filePath: string;
  readonly text: string;
}): Promise<void> {
  await writeTextAtomically(input.filePath, input.text);
}

/**
 * Update a JSON file on disk with transaction-guarded temp-file rename writes.
 */
export async function updateJsonFileWithRetry<T>(input: {
  readonly filePath: string;
  readonly parseText: (text: string) => T;
  readonly validateText: (text: string) => void | Promise<void>;
  readonly transform: (value: T) => T;
  readonly maxAttempts: number;
}): Promise<{ readonly attempts: number }> {
  return runJsonStateTransaction({
    filePaths: [input.filePath],
    operation: () =>
      updateJsonStateWithRetry({
        readText: () => readFile(input.filePath, 'utf8'),
        writeText: (text) => writeJsonTextAtomically(input.filePath, text),
        parseText: input.parseText,
        validateText: input.validateText,
        transform: input.transform,
        maxAttempts: input.maxAttempts,
      }),
  });
}

async function releaseLocks(releases: readonly (() => Promise<void>)[]): Promise<void> {
  for (const release of releases.toReversed()) {
    await release();
  }
}

function uniqueSortedPaths(filePaths: readonly string[]): readonly string[] {
  return Array.from(new Set(filePaths)).toSorted((a, b) => a.localeCompare(b));
}

async function writeJsonTextAtomically(
  filePath: string,
  text: string,
  options: { readonly exclusiveCreate?: boolean } = {},
): Promise<void> {
  JSON.parse(text);
  await writeTextAtomically(filePath, text, options);
}

async function serializeJson(
  value: unknown,
  validateText: (text: string) => void | Promise<void>,
): Promise<string> {
  const text = `${JSON.stringify(value, null, 2)}\n`;
  JSON.parse(text);
  await validateText(text);
  return text;
}
