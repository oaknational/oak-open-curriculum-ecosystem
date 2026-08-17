/**
 * Bounded, labelled excerpts of child-process streams for embedding in
 * failure reasons (MCP-189). A LEAF module by design: both the
 * orchestration (`report.ts`) and the Node IO adapter (`node-io.ts`)
 * consume it, and it depends on nothing — keeping the IO adapter free of
 * any edge into outcome composition.
 */
const EXCERPT_MAX_CHARS = 2000;

/**
 * A labelled, bounded excerpt of a child-process stream. Empty content
 * yields an empty string; truncation is always EXPLICIT — the marker
 * names the trimmed length, "truncated from N trimmed chars" — because a
 * silently-shortened diagnostic would be the lossy twin of the evidence
 * destruction the verbatim-retention contract exists to prevent. These
 * excerpts are DIAGNOSTICS riding a failure reason, never a substitute
 * for retained evidence artefacts.
 */
export function boundedExcerpt(label: string, content: string): string {
  const trimmed = redactCredentials(content.trim());
  if (trimmed === '') {
    return '';
  }
  const body =
    trimmed.length <= EXCERPT_MAX_CHARS
      ? trimmed
      : `${trimmed.slice(0, EXCERPT_MAX_CHARS)} … (truncated from ${String(trimmed.length)} trimmed chars)`;
  return ` — ${label}: ${body}`;
}

/**
 * Excerpts ride failure reasons onto STDOUT (and into CI job logs), where
 * the retention layer's owner-only 0600 discipline does not reach — so any
 * credential shape in a child stream is redacted BEFORE the excerpt is
 * composed, at this single choke point every stream excerpt passes through.
 * The pattern set mirrors the vendor's own `redactSensitiveValue` (evidence
 * the shapes are the right ones), kept local rather than imported — ten
 * lines do not justify an `@mcpjam/sdk` edge into agent-tools.
 */
function redactCredentials(content: string): string {
  return content
    .replaceAll(
      /\b(authorization|proxy-authorization|cookie|set-cookie)\s*:\s*[^\r\n]*/giu,
      '$1: [redacted]',
    )
    .replaceAll(/\bBearer\s+[A-Za-z0-9\-._~+/]+=*/giu, 'Bearer [redacted]');
}
