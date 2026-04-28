import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';

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

    await input.writeText(`${JSON.stringify(nextValue, null, 2)}\n`);
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
}): Promise<void> {
  await writeJsonTextAtomically(input.filePath, `${JSON.stringify(input.value, null, 2)}\n`);
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
        transform: input.transform,
        maxAttempts: input.maxAttempts,
      }),
  });
}

async function acquireFileTransactionLock(input: {
  readonly filePath: string;
  readonly staleMs: number;
  readonly attempts: number;
}): Promise<() => Promise<void>> {
  const lockDir = `${input.filePath}.transaction`;
  for (let attempt = 1; attempt <= input.attempts; attempt += 1) {
    if (await tryCreateLock(lockDir)) {
      return () => rm(lockDir, { recursive: true, force: true });
    }
    await removeStaleLock(lockDir, input.staleMs);
    await delay(Math.min(attempt * 10, 100));
  }

  throw new Error(`could not acquire state transaction for ${input.filePath}`);
}

async function tryCreateLock(lockDir: string): Promise<boolean> {
  try {
    await mkdir(lockDir);
    await writeFile(`${lockDir}/owner.json`, `${JSON.stringify(lockMetadata(), null, 2)}\n`);
    return true;
  } catch (error) {
    if (isFileExistsError(error)) {
      return false;
    }
    throw error;
  }
}

async function removeStaleLock(lockDir: string, staleMs: number): Promise<void> {
  const metadata = await readLockMetadata(lockDir);
  if (metadata === undefined) {
    return;
  }
  if (Date.now() - Date.parse(metadata.created_at) > staleMs) {
    await rm(lockDir, { recursive: true, force: true });
  }
}

async function readLockMetadata(
  lockDir: string,
): Promise<{ readonly created_at: string } | undefined> {
  try {
    const parsed: unknown = JSON.parse(await readFile(`${lockDir}/owner.json`, 'utf8'));
    return isLockMetadata(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function lockMetadata(): { readonly owner_id: string; readonly created_at: string } {
  return {
    owner_id: randomUUID(),
    created_at: new Date().toISOString(),
  };
}

async function releaseLocks(releases: readonly (() => Promise<void>)[]): Promise<void> {
  for (const release of releases.toReversed()) {
    await release();
  }
}

function uniqueSortedPaths(filePaths: readonly string[]): readonly string[] {
  return Array.from(new Set(filePaths)).toSorted();
}

async function writeJsonTextAtomically(filePath: string, text: string): Promise<void> {
  await writeTextAtomically(filePath, text);
}

async function writeTextAtomically(filePath: string, text: string): Promise<void> {
  const tmpPath = `${filePath}.tmp-${randomUUID()}`;
  await writeFile(tmpPath, text);
  await rename(tmpPath, filePath);
}

function delay(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function isLockMetadata(value: unknown): value is { readonly created_at: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'created_at' in value &&
    typeof value.created_at === 'string'
  );
}

function isFileExistsError(error: unknown): error is Error & { readonly code: 'EEXIST' } {
  return error instanceof Error && 'code' in error && error.code === 'EEXIST';
}
