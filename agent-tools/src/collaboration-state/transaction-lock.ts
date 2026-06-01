import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';

export async function acquireFileTransactionLock(input: {
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
