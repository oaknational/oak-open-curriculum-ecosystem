import { spawn, type ChildProcessByStdio } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createReadStream, constants } from 'node:fs';
import { access, readFile, realpath, stat } from 'node:fs/promises';
import { delimiter, isAbsolute, join } from 'node:path';
import { type Readable } from 'node:stream';

import { err, ok, type Result } from '@oaknational/result';

const MAX_FINGERPRINT_FILE_BYTES = 256 * 1024 * 1024;
const VERSION_TIMEOUT_MS = 1_000;
const VERSION_OUTPUT_LIMIT_BYTES = 4_096;
const MINIMUM_SAFE_CLAUDE_ASYNC_VERSION = [2, 1, 202] as const;

export interface FingerprintExecutables {
  readonly node: string;
  readonly claude: string;
  readonly codex: string;
  readonly gitleaks: string;
}

export type FingerprintIoError =
  | { readonly kind: 'path-unavailable' }
  | { readonly kind: 'executable-unavailable'; readonly executable: string }
  | { readonly kind: 'fingerprint-file-invalid'; readonly path: string }
  | { readonly kind: 'fingerprint-file-read-failed'; readonly path: string }
  | { readonly kind: 'review-asset-invalid'; readonly path: string }
  | { readonly kind: 'review-asset-read-failed'; readonly path: string }
  | { readonly kind: 'version-probe-failed'; readonly executable: string }
  | { readonly kind: 'version-probe-timeout'; readonly executable: string }
  | { readonly kind: 'version-output-too-large'; readonly executable: string }
  | { readonly kind: 'version-output-empty'; readonly executable: string };

/** Whether Claude includes the async-hook JSON validation fix required by this adapter. */
export function supportsSafeClaudeAsyncOutput(versionOutput: string): boolean {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:\s|$)/u.exec(versionOutput.trim());
  if (match === null) {
    return false;
  }
  const version = match.slice(1, 4).map(Number);
  return compareVersion(version, MINIMUM_SAFE_CLAUDE_ASYNC_VERSION) >= 0;
}

export async function resolveFingerprintExecutables(
  environment: Readonly<NodeJS.ProcessEnv>,
): Promise<Result<FingerprintExecutables, FingerprintIoError>> {
  const path = environment.PATH;
  if (path === undefined) {
    return err({ kind: 'path-unavailable' });
  }
  const [node, claude, codex, gitleaks] = await Promise.all([
    resolveAbsoluteExecutable(process.execPath, 'node'),
    resolveExecutable('claude', path),
    resolveExecutable('codex', path),
    resolveExecutable('gitleaks', path),
  ]);
  if (!node.ok) {
    return node;
  }
  if (!claude.ok) {
    return claude;
  }
  if (!codex.ok) {
    return codex;
  }
  if (!gitleaks.ok) {
    return gitleaks;
  }
  return ok({
    node: node.value,
    claude: claude.value,
    codex: codex.value,
    gitleaks: gitleaks.value,
  });
}

export async function sha256File(path: string): Promise<Result<string, FingerprintIoError>> {
  const details = await fingerprintFileDetails(path);
  if (!details.ok) {
    return details;
  }
  if (!details.value.isFile() || details.value.size > MAX_FINGERPRINT_FILE_BYTES) {
    return err({ kind: 'fingerprint-file-invalid', path });
  }
  const hash = createHash('sha256');
  const hashed = await new Promise<Result<void, FingerprintIoError>>((resolve) => {
    const stream = createReadStream(path);
    stream.on('data', (chunk: string | Buffer) => hash.update(chunk));
    stream.on('error', () => resolve(err({ kind: 'fingerprint-file-read-failed', path })));
    stream.on('end', () => resolve(ok(undefined)));
  });
  return hashed.ok ? ok(hash.digest('hex')) : hashed;
}

export async function readBoundedAsset(path: string): Promise<Result<string, FingerprintIoError>> {
  let details: Awaited<ReturnType<typeof stat>>;
  try {
    details = await stat(path);
  } catch {
    return err({ kind: 'review-asset-read-failed', path });
  }
  if (!details.isFile() || details.size > VERSION_OUTPUT_LIMIT_BYTES * 4) {
    return err({ kind: 'review-asset-invalid', path });
  }
  try {
    return ok(await readFile(path, 'utf8'));
  } catch {
    return err({ kind: 'review-asset-read-failed', path });
  }
}

export function probeVersion(
  executable: string,
  args: readonly string[] = ['--version'],
): Promise<Result<string, FingerprintIoError>> {
  try {
    const child = spawn(executable, [...args], {
      env: { HOME: '/', NO_COLOR: '1', RUST_LOG: 'error' },
      shell: false,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    return observeVersionProbe(child, executable);
  } catch {
    return Promise.resolve(err({ kind: 'version-probe-failed', executable }));
  }
}

function observeVersionProbe(
  child: ChildProcessByStdio<null, Readable, Readable>,
  executable: string,
): Promise<Result<string, FingerprintIoError>> {
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let bytes = 0;
    let settled = false;
    const settle = (result: Result<string, FingerprintIoError>): void => {
      if (settled) {
        return;
      }
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };
    const collect = (chunk: Buffer): void => {
      bytes += chunk.byteLength;
      if (bytes > VERSION_OUTPUT_LIMIT_BYTES) {
        child.kill('SIGKILL');
        settle(err({ kind: 'version-output-too-large', executable }));
        return;
      }
      chunks.push(chunk);
    };
    child.stdout.on('data', collect);
    child.stderr.on('data', collect);
    child.on('error', () => settle(err({ kind: 'version-probe-failed', executable })));
    child.on('close', (code) => {
      if (settled) {
        return;
      }
      if (code !== 0) {
        settle(err({ kind: 'version-probe-failed', executable }));
        return;
      }
      settle(resolveVersion(chunks, executable));
    });
    const timer = scheduleVersionTimeout(
      () => child.kill('SIGKILL'),
      () => settle(err({ kind: 'version-probe-timeout', executable })),
    );
  });
}

function resolveVersion(
  chunks: readonly Buffer[],
  executable: string,
): Result<string, FingerprintIoError> {
  const version = Buffer.concat(chunks).toString('utf8').trim();
  if (version.length === 0) {
    return err({ kind: 'version-output-empty', executable });
  }
  return ok(version);
}

async function resolveExecutable(
  name: string,
  searchPath: string,
): Promise<Result<string, FingerprintIoError>> {
  for (const directory of searchPath.split(delimiter)) {
    if (directory.length === 0 || !isAbsolute(directory)) {
      continue;
    }
    const candidate = join(directory, name);
    try {
      await access(candidate, constants.X_OK);
      return ok(await realpath(candidate));
    } catch {
      // Continue across the bounded PATH entry set.
    }
  }
  return err({ kind: 'executable-unavailable', executable: name });
}

async function resolveAbsoluteExecutable(
  path: string,
  executable: string,
): Promise<Result<string, FingerprintIoError>> {
  try {
    return ok(await realpath(path));
  } catch {
    return err({ kind: 'executable-unavailable', executable });
  }
}

async function fingerprintFileDetails(
  path: string,
): Promise<Result<Awaited<ReturnType<typeof stat>>, FingerprintIoError>> {
  try {
    return ok(await stat(path));
  } catch {
    return err({ kind: 'fingerprint-file-read-failed', path });
  }
}

function scheduleVersionTimeout(kill: () => boolean, settleError: () => void): NodeJS.Timeout {
  const timer = setTimeout(() => {
    kill();
    settleError();
  }, VERSION_TIMEOUT_MS);
  timer.unref();
  return timer;
}

function compareVersion(left: readonly number[], right: readonly number[]): number {
  for (let index = 0; index < right.length; index += 1) {
    const difference = (left[index] ?? 0) - (right[index] ?? 0);
    if (difference !== 0) {
      return difference;
    }
  }
  return 0;
}
