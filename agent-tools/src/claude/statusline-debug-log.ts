/**
 * Optional statusline payload logging, enabled by `OAK_STATUSLINE_LOG_FILE`.
 *
 * @remarks
 * Diagnostic instrument for the statusline's one blind spot: the adapter can
 * prove what it renders from a payload, but not what payload the harness
 * actually sent (e.g. whether `rate_limits` ever arrives — the MCP-529
 * founding case). When the environment variable names a `*.log` path, every
 * invocation appends one timestamped line carrying the payload as received —
 * only line breaks are collapsed (one invocation, one greppable line); all
 * other bytes, including internal whitespace, are preserved. When unset,
 * behaviour is byte-identical to before this module existed.
 *
 * Failure posture is split the same way as the adapter's own segments:
 *
 * - **A set-but-invalid value is a misconfiguration and fails LOUD.** An
 *   operator who explicitly set the variable must never read silence as "the
 *   harness sent nothing" — the resolver returns an `invalid` config whose
 *   warning the adapter renders as a visible token.
 * - **Write failures are swallowed.** The statusline is a soft surface — its
 *   own diagnostics must never blank or break it. This is the same documented
 *   posture as the frame store (`statusline-frame-store.ts`), and the narrow
 *   sanctioned exception to the Result-pattern rule: fire-and-forget I/O at
 *   the adapter boundary, where there is no caller to hand a Result to.
 *
 * Destinations are `*.log` only — an environment variable that drives a file
 * append deserves a small blast radius. The log directory and file are
 * created private to the user (0o700 / 0o600), and the destination is
 * treated as a boundary: symlinks refuse to open, non-regular files
 * (FIFOs, devices) never receive a write, and a pre-existing file is
 * retightened to owner-only before each append — a file the invoking user
 * cannot own refuses rather than leaks. A pre-existing PARENT DIRECTORY's
 * permissions are still not retightened (mkdir's mode applies at creation
 * only), and the payload carries session ids and project paths — prefer a
 * private directory and delete the log after diagnosis.
 *
 * @packageDocumentation
 */

import {
  closeSync,
  constants,
  fchmodSync,
  fstatSync,
  mkdirSync,
  openSync,
  writeSync,
} from 'node:fs';
import { dirname } from 'node:path';

/**
 * The narrow descriptor-level filesystem surface {@link appendDebugLogEntry}
 * needs, injectable for tests (ADR-078). `fstatSync` is typed to the one
 * question asked of it so fakes need no `Stats` construction.
 */
export interface DebugLogFs {
  mkdirSync(path: string, options: { recursive: true; mode: number }): void;
  openSync(path: string, flags: number, mode: number): number;
  fstatSync(fd: number): { isFile(): boolean };
  fchmodSync(fd: number, mode: number): void;
  writeSync(fd: number, data: Buffer, offset: number, length: number): number;
  closeSync(fd: number): void;
}

const realFs: DebugLogFs = { mkdirSync, openSync, fstatSync, fchmodSync, writeSync, closeSync };

/**
 * The destination-boundary contract, as flags: write-only append,
 * create-if-absent at 0o600, `O_NOFOLLOW` so a pre-placed symlink at the
 * destination refuses to open (ELOOP), and `O_NONBLOCK` so a reader-less
 * FIFO named `*.log` fails fast (ENXIO) instead of hanging the adapter
 * before the soft-failure catch can run. Regular-file writes are
 * unaffected by the nonblocking flag.
 */
export const DEBUG_LOG_OPEN_FLAGS: number =
  constants.O_WRONLY |
  constants.O_APPEND |
  constants.O_CREAT |
  constants.O_NOFOLLOW |
  constants.O_NONBLOCK;

/**
 * The resolved logging configuration: `disabled` (unset or blank — silent),
 * `enabled` with the destination path, or `invalid` with the warning the
 * adapter must render loud (set-but-wrong is a misconfiguration, never
 * silence).
 */
export type DebugLogConfig =
  | { readonly kind: 'disabled' }
  | { readonly kind: 'enabled'; readonly path: string }
  | { readonly kind: 'invalid'; readonly warning: string };

/**
 * Resolve the debug-log configuration from the environment.
 *
 * @param env - The environment map (pass `process.env`).
 * @returns `disabled` when the variable is unset or blank; `enabled` with the
 * trimmed path when it ends `.log`; `invalid` with a renderable warning for
 * any other set value.
 */
export function resolveDebugLogConfig(
  env: Readonly<Record<string, string | undefined>>,
): DebugLogConfig {
  const value = env.OAK_STATUSLINE_LOG_FILE?.trim();
  if (value === undefined || value.length === 0) {
    return { kind: 'disabled' };
  }
  if (!value.endsWith('.log')) {
    return {
      kind: 'invalid',
      warning: 'OAK_STATUSLINE_LOG_FILE must name a *.log path — logging disabled',
    };
  }
  return { kind: 'enabled', path: value };
}

/**
 * The loud one-line warning for an `invalid` config, empty otherwise.
 *
 * @remarks
 * Kept beside the resolver so the two halves of the fail-loud contract are
 * one tested unit: the adapter writes this line before ANY other outcome —
 * including a noop payload — because an operator who set the variable must
 * never read silence as "the harness sent nothing".
 *
 * @param config - The resolved configuration.
 * @param ansi - The escape sequences the adapter renders with (injected so
 * the formatter stays pure and the test asserts placement, not codes).
 * @returns The newline-terminated warning line, or `''` when there is
 * nothing to warn about.
 */
export function invalidConfigWarningLine(
  config: DebugLogConfig,
  ansi: { readonly red: string; readonly bold: string; readonly reset: string },
): string {
  if (config.kind !== 'invalid') {
    return '';
  }
  return `${ansi.red}${ansi.bold}⚠ statusline: ${config.warning}${ansi.reset}\n`;
}

/**
 * Write the whole buffer through possibly-short writes, resuming from the
 * reported offset (the writeAll shape, `atomic-publication-node.ts`); a
 * zero-byte result abandons the entry rather than spinning.
 */
function writeAllBytes(fs: DebugLogFs, fd: number, bytes: Buffer): void {
  let written = 0;
  while (written < bytes.length) {
    const consumed = fs.writeSync(fd, bytes, written, bytes.length - written);
    if (consumed <= 0) {
      return;
    }
    written += consumed;
  }
}

/**
 * Append one timestamped payload line to the debug log, soft-failing.
 *
 * @remarks
 * Terminal line breaks are stripped (the harness newline-terminates its
 * payloads) and interior line breaks are collapsed to single spaces so each
 * invocation lands as exactly one line; all other bytes, including leading
 * and trailing spaces or tabs, are preserved so the logged payload stays
 * faithful to what arrived.
 *
 * The destination is opened through {@link DEBUG_LOG_OPEN_FLAGS} (no
 * symlink following, no FIFO hang) and the write happens only when the
 * opened descriptor is a regular file that could be retightened to
 * owner-only — a destination the invoking user does not own refuses
 * rather than leaks. Any filesystem refusal is swallowed — see the module
 * remarks for the split failure posture.
 *
 * @param logPath - The `*.log` destination from {@link resolveDebugLogConfig}.
 * @param rawPayload - The stdin payload as received, pre-parse.
 * @param nowIso - The invocation timestamp (injected so the entry is pure of
 * clock reads; callers pass `new Date().toISOString()`).
 * @param fs - The filesystem surface; defaults to the real one.
 */
export function appendDebugLogEntry(
  logPath: string,
  rawPayload: string,
  nowIso: string,
  fs: DebugLogFs = realFs,
): void {
  let payloadEnd = rawPayload.length;
  while (payloadEnd > 0 && '\r\n'.includes(rawPayload.charAt(payloadEnd - 1))) {
    payloadEnd -= 1;
  }
  const line = `${nowIso} ${rawPayload.slice(0, payloadEnd).replaceAll(/[\r\n]+/gu, ' ')}\n`;
  try {
    fs.mkdirSync(dirname(logPath), { recursive: true, mode: 0o700 });
    const fd = fs.openSync(logPath, DEBUG_LOG_OPEN_FLAGS, 0o600);
    try {
      if (!fs.fstatSync(fd).isFile()) {
        return;
      }
      fs.fchmodSync(fd, 0o600);
      writeAllBytes(fs, fd, Buffer.from(line, 'utf8'));
    } finally {
      fs.closeSync(fd);
    }
  } catch {
    // Soft surface: the statusline never breaks for its own logging.
  }
}
