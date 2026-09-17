import { err, ok, type Result } from '@oaknational/result';

import { EstateReviewError } from './errors.js';
import type { GitContext } from './git-snapshot-model.js';
import type { ProcessInvocation, ProcessResult } from './ports.js';

export function gitEnvironment(environment: NodeJS.ProcessEnv): Readonly<Record<string, string>> {
  const allowed: Record<string, string> = {};
  for (const name in environment) {
    const value = environment[name];
    if (value !== undefined && isAllowedEnvironmentName(name)) {
      allowed[name] = value;
    }
  }
  allowed.GIT_NO_LAZY_FETCH = '1';
  // Determinism by construction, not by git's internal call graph: no system
  // or user gitconfig (filters, pagers, external diff) can touch pinned reads.
  allowed.GIT_CONFIG_NOSYSTEM = '1';
  allowed.GIT_CONFIG_GLOBAL = '/dev/null';
  return allowed;
}

export function runGit(
  context: GitContext,
  args: readonly string[],
  maxStdoutBytes: number,
  code: 'SNAPSHOT_INVALID' | 'SOURCE_READ_FAILED',
  label: string,
): Result<Uint8Array, EstateReviewError> {
  const invocation = buildGitInvocation(context, args, maxStdoutBytes);
  let result: ProcessResult;
  try {
    result = context.process.run(invocation);
  } catch (cause: unknown) {
    return err(new EstateReviewError(code, `${label} failed`, { cause }));
  }
  if (result.stdout.byteLength > maxStdoutBytes || result.stderr.byteLength > context.stderrLimit) {
    return err(new EstateReviewError('RESOURCE_LIMIT', `${label} exceeded its byte limit`));
  }
  return processSucceeded(result)
    ? ok(result.stdout)
    : err(new EstateReviewError(code, `${label} failed`, { cause: processCause(result, label) }));
}

/** Construct the one permitted defensive Git process invocation. */
export function buildGitInvocation(
  context: GitContext,
  args: readonly string[],
  maxStdoutBytes: number,
): ProcessInvocation {
  return {
    executable: context.executable,
    args: ['--no-replace-objects', '--no-lazy-fetch', ...args],
    cwd: context.cwd,
    env: context.env,
    maxStdoutBytes,
    maxStderrBytes: context.stderrLimit,
  };
}

export function decodeSingleLine(
  bytes: Uint8Array,
  label: string,
): Result<string, EstateReviewError> {
  const decoded = decodeUtf8(bytes, label);
  if ('error' in decoded) {
    return decoded;
  }
  const value = decoded.value.endsWith('\n') ? decoded.value.slice(0, -1) : decoded.value;
  return value.length > 0 && !value.includes('\n') && !value.includes('\r')
    ? ok(value)
    : err(new EstateReviewError('SNAPSHOT_INVALID', `${label} did not emit one non-empty line`));
}

export function decodeUtf8(bytes: Uint8Array, label: string): Result<string, EstateReviewError> {
  try {
    const value = new TextDecoder('utf-8', { fatal: true, ignoreBOM: true }).decode(bytes);
    const encoded = new TextEncoder().encode(value);
    return bytesEqual(bytes, encoded)
      ? ok(value)
      : err(new EstateReviewError('SNAPSHOT_INVALID', `${label} failed UTF-8 round trip`));
  } catch (cause: unknown) {
    return err(new EstateReviewError('SNAPSHOT_INVALID', `${label} is not valid UTF-8`, { cause }));
  }
}

function isAllowedEnvironmentName(name: string): boolean {
  return name === 'PATH' || name === 'HOME' || name === 'LANG' || name.startsWith('LC_');
}

function processSucceeded(result: ProcessResult): boolean {
  return result.error === undefined && result.signal === null && result.status === 0;
}

function processCause(result: ProcessResult, label: string): Error {
  if (result.error !== undefined) {
    return result.error;
  }
  const detail = safeDecodeForError(result.stderr);
  return new Error(
    detail.length > 0
      ? detail
      : `${label} exited with status ${String(result.status)} signal ${String(result.signal)}`,
  );
}

function safeDecodeForError(bytes: Uint8Array): string {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes).trim();
  } catch {
    return '<non-UTF-8 stderr>';
  }
}

function bytesEqual(left: Uint8Array, right: Uint8Array): boolean {
  return (
    left.byteLength === right.byteLength && left.every((value, index) => value === right[index])
  );
}
