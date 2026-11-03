/**
 * Optional statusline payload logging, enabled by `PRACTICE_STATUSLINE_LOG_FILE`.
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
 *   sanctioned exception to the Result-pattern rule: the append returns a
 *   Result, and this fire-and-forget adapter boundary discards it, because
 *   there is no caller to hand it to.
 *
 * Destinations are `*.log` only — an environment variable that drives a file
 * append deserves a small blast radius. The append itself is the shared
 * owner-only append (`core/owner-only-append.ts`). The log directory and file
 * are created private to the user (0o700 / 0o600), and the destination is
 * treated as a boundary: symlinks refuse to open, non-regular files
 * (FIFOs, devices) never receive a write, a file another user owns or with a
 * second hard link refuses rather than leaks (so a root-run statusline will
 * not append to another user's log), and a pre-existing file of the user's
 * own is retightened to owner-only before each append. On a platform without
 * POSIX ownership (native Windows) nothing is written: modes cannot make a
 * file owner-only there, so the append refuses. A directory the path
 * names that already exists keeps its permissions (mkdir's mode applies at
 * creation only; the statusline never re-modes a directory a user names, so
 * a log under `/tmp` works), and the payload carries session ids and project
 * paths — prefer a private directory and delete the log after diagnosis.
 *
 * @packageDocumentation
 */

import { appendOwnerOnly } from '../core/owner-only-append.js';
import { nodeOwnerOnlyAppendFs, type OwnerOnlyAppendFs } from '../core/owner-only-append-fs.js';

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
  const value = env.PRACTICE_STATUSLINE_LOG_FILE?.trim();
  if (value === undefined || value.length === 0) {
    return { kind: 'disabled' };
  }
  if (!value.endsWith('.log')) {
    return {
      kind: 'invalid',
      warning: 'PRACTICE_STATUSLINE_LOG_FILE must name a *.log path — logging disabled',
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
 * The debug-log line for one payload: the timestamp, a space, the payload,
 * a newline.
 *
 * @remarks
 * Terminal line breaks are stripped (the harness newline-terminates its
 * payloads) and interior line breaks are collapsed to single spaces so each
 * invocation lands as exactly one line; all other bytes, including leading
 * and trailing spaces or tabs, are preserved so the logged payload stays
 * faithful to what arrived.
 *
 * @param rawPayload - The stdin payload as received, pre-parse.
 * @param nowIso - The invocation timestamp.
 * @returns The newline-terminated line.
 */
export function debugLogLine(rawPayload: string, nowIso: string): string {
  let payloadEnd = rawPayload.length;
  while (payloadEnd > 0 && '\r\n'.includes(rawPayload.charAt(payloadEnd - 1))) {
    payloadEnd -= 1;
  }
  return `${nowIso} ${rawPayload.slice(0, payloadEnd).replaceAll(/[\r\n]+/gu, ' ')}\n`;
}

/**
 * Append one timestamped payload line to the debug log, soft-failing.
 *
 * @remarks
 * The line is {@link debugLogLine}'s. It goes through {@link appendOwnerOnly},
 * which creates an absent directory at 0o700, leaves an existing one as it
 * was, holds the file at 0o600, and refuses a symlink at the destination, a
 * non-regular file, a file another user owns, a file with a second hard
 * link, and any write on a platform without POSIX ownership. Its outcome is
 * discarded — see the module remarks for the split failure posture.
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
  fs: OwnerOnlyAppendFs = nodeOwnerOnlyAppendFs,
): void {
  // Soft surface: the statusline never breaks for its own logging.
  appendOwnerOnly(logPath, debugLogLine(rawPayload, nowIso), fs);
}
