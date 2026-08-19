/**
 * Bounded, labelled excerpts of child-process streams for embedding in
 * failure reasons (MCP-189), and the credential redactor every emit path
 * reaches for. A LEAF module by design: it depends on nothing, so the
 * evidence gates, the spawn seam, and the CLI orchestrators can all import
 * it without any edge back into outcome composition.
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
 * Failure reasons ride onto STDOUT and into CI job logs, where the retention
 * layer's owner-only 0600 discipline does not reach — so credential shapes
 * are stripped before any of that text is composed.
 *
 * EXPORTED because excerpts are not the only path. A parsed vendor error
 * envelope reaches a failure reason without passing through `boundedExcerpt`,
 * and went unredacted until review caught it: every caller that puts vendor
 * text into a reason redacts it here. Treating this as "the single choke
 * point" was the mistake — it is the single redactor, and callers must reach
 * for it.
 *
 * The pattern set mirrors the vendor's own `redactSensitiveString` (bundled
 * in `@mcpjam/sdk@2.4.0` `dist/index.js`, a `src/redaction.ts` section
 * marker above it — evidence the shapes are the right ones),
 * kept local rather than imported: a dozen lines do not justify an
 * `@mcpjam/sdk` edge into agent-tools. Four deliberate deviations from the
 * vendor's string set, each documented at its pattern below — the vendor's
 * bare `code` key is dropped, `api_key`/`apikey` are added, the JSON value
 * class is bounded to one line, and URL userinfo is masked. The credential-key list is the
 * REDACTOR's set; `cli-validation.ts` keeps a deliberately broader one for
 * REFUSING a target (it can name `code` and `token` because it rejects
 * rather than masks) — the two differ on purpose.
 */
export function redactCredentials(content: string): string {
  return (
    content
      // URL userinfo (`scheme://user:pass@host`). Not in the vendor's set. It
      // is here because the target validator REFUSES userinfo only on a target
      // it can parse; the one that does not parse is exactly the one that
      // reaches the emit sites, and this is the belt behind that brace.
      .replaceAll(/(\/\/)[^/\s@]+@/gu, '$1[redacted]@')
      .replaceAll(
        /\b(authorization|proxy-authorization|cookie|set-cookie)\s*:\s*[^\r\n]*/giu,
        '$1: [redacted]',
      )
      // Deliberately NOT case-insensitive: the `i` flag makes `a-z` redundant
      // against `A-Z` in the token class — a genuine duplicate, and a lint
      // finding. The scheme keyword carries its own case alternation instead,
      // because HTTP auth schemes are case-insensitive. The negative lookahead
      // is the vendor's: without it the token class (which admits `_`) swallows
      // a following `key=` so the key=value rule below never fires, and the
      // value leaks — `Bearer access_token=SECRET` → `Bearer [redacted]SECRET`.
      .replaceAll(
        /\b(?:bearer|Bearer|BEARER)\s+(?![A-Za-z_][A-Za-z0-9_-]*=)[A-Za-z0-9\-._~+/]+=*/gu,
        'Bearer [redacted]',
      )
      // Query-string / key=value token params (`?access_token=…`, an SSE/HTTP
      // auth transport). Bare `code` is intentionally absent — it would redact
      // the `code=` in exit/status diagnostics this wrapper exists to show;
      // `code_verifier` stays, having no such collision. `api_key`/`apikey`
      // extend the vendor's string set, which strips them only at key level.
      .replaceAll(
        /\b(access_token|refresh_token|client_secret|id_token|code_verifier|accessToken|refreshToken|clientSecret|idToken|codeVerifier|api_key|apikey)=[^&\s]+/giu,
        '$1=[redacted]',
      )
      // The same keys as JSON string values (`"access_token":"…"`), which the
      // header rule above cannot reach — the quote breaks its `keyword:` shape.
      // The value class excludes newlines (the vendor's does not): an
      // unbalanced quote in a truncated or crashed stream would otherwise let
      // one match swallow the following diagnostic lines without a marker.
      // The closing quote is optional for the same case, so the truncated
      // fragment is still masked up to the line end rather than left in clear.
      .replaceAll(
        /(["']?(?:access_token|refresh_token|client_secret|id_token|code_verifier|accessToken|refreshToken|clientSecret|idToken|codeVerifier|api_key|apikey)["']?\s*:\s*["'])[^"'\r\n]*(["']?)/giu,
        '$1[redacted]$2',
      )
  );
}
