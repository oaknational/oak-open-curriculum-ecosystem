/**
 * Pure resolver for a vendor session-transcript path.
 *
 * @remarks
 * Claude Code stores transcripts at
 * `<home>/.claude/projects/<project-key>/<session-id>.jsonl`, where the
 * project-key is the launch directory with `/`, `.`, and `\` replaced by `-`
 * (the backslash normalisation matters on Windows, where cwd is backslash-separated). The
 * path is derived from the supplied `home` and `cwd` at runtime — never a
 * machine-local literal (which the `no-machine-local-paths` hook blocks and
 * which would leak a username). Only `claude` is supported today; other vendors
 * return a typed error rather than guessing.
 *
 * @packageDocumentation
 */

/** Result of resolving a transcript path. */
export type TranscriptPathResult =
  { readonly ok: true; readonly path: string } | { readonly ok: false; readonly error: string };

/**
 * Allowlist for a session id: alphanumerics, underscore, and hyphen only.
 *
 * @remarks
 * The session id is concatenated into a filesystem path, so it is validated at
 * this boundary (strict-validation-at-boundary, fail-fast). The allowlist
 * rejects `.` (so `..` cannot appear), `/`, and `\`, which prevents a crafted
 * session id from traversing outside the intended transcript directory. Real
 * session ids (Claude UUIDs / hex prefixes) match this pattern.
 */
const SAFE_SESSION_ID = /^[A-Za-z0-9_-]+$/;

/**
 * Resolve the transcript path for a vendor session.
 *
 * @param input - `vendor`, `home` (user home dir), `cwd` (launch dir), `sessionId`.
 * @returns The resolved path, or a typed error for an unsupported vendor.
 */
export function resolveTranscriptPath(input: {
  readonly vendor: string;
  readonly home: string;
  readonly cwd: string;
  readonly sessionId: string;
}): TranscriptPathResult {
  if (input.vendor !== 'claude') {
    return { ok: false, error: `unsupported vendor: ${input.vendor} (supported: claude)` };
  }

  if (!SAFE_SESSION_ID.test(input.sessionId)) {
    return {
      ok: false,
      error: 'invalid session id (expected [A-Za-z0-9_-]+; rejected to prevent path traversal)',
    };
  }

  const projectKey = input.cwd.replaceAll(/[/.\\]/g, '-');
  return {
    ok: true,
    path: `${input.home}/.claude/projects/${projectKey}/${input.sessionId}.jsonl`,
  };
}
