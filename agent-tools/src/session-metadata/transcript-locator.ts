/**
 * Pure resolver for a vendor session-transcript path.
 *
 * @remarks
 * Claude Code stores transcripts at
 * `<home>/.claude/projects/<project-key>/<session-id>.jsonl`, where the
 * project-key is the launch directory with `/`, `.`, and `\` replaced by `-`
 * (the backslash normalisation matters on Windows, where cwd is backslash-separated). The
 * path is derived from the supplied `home` and `cwd` at runtime — never a
 * machine-local literal (which the `machine-local-path` write hook blocks and
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

  return {
    ok: true,
    path: `${projectDirectoryFor({ home: input.home, cwd: input.cwd })}/${input.sessionId}.jsonl`,
  };
}

/**
 * Resolve the directory holding a working directory's session transcripts.
 *
 * @param input - `home` (user home dir) and `cwd` (the working directory whose
 *   transcripts are wanted).
 * @returns The absolute project directory path.
 *
 * @remarks
 * Claude Code keys transcript storage by working directory, so an arc whose
 * sessions ran in more than one working directory — a worktree, for instance —
 * has transcripts under more than one of these directories. Callers that
 * measure an arc therefore resolve one directory per working directory the arc
 * used, rather than assuming the arc stayed in one.
 */
export function projectDirectoryFor(input: {
  readonly home: string;
  readonly cwd: string;
}): string {
  const projectKey = input.cwd.replaceAll(/[/.\\]/g, '-');
  return `${input.home}/.claude/projects/${projectKey}`;
}
