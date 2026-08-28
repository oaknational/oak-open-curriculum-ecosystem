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
 * The pattern set started from the vendor's own `redactSensitiveString`
 * (bundled in `@mcpjam/sdk@2.4.0` `dist/index.js`, a `src/redaction.ts`
 * section marker above it), kept local rather than imported: a dozen lines do
 * not justify an `@mcpjam/sdk` edge into agent-tools. It deviates from the
 * vendor's set where review proved the vendor wrong or short — each deviation
 * documented at its pattern. The one key deliberately ABSENT is bare `code`:
 * masking it would hide the vendor error codes and exit/status codes this
 * wrapper exists to display. `cli-validation.ts` keeps a deliberately broader
 * name list for REFUSING a target (it can name `code` and `token` because it
 * rejects rather than masks) — the two differ on purpose.
 *
 * RULE ORDER IS LOAD-BEARING: the key=value rule runs before the scheme rule,
 * so `Bearer access_token=SECRET` is already masked when the scheme rule's
 * token class (which admits `_`) reaches it. The vendor orders these the
 * other way and guards with a negative lookahead — which wrongly exempts a
 * padded base64 token (`Bearer c3VwZXJzZWNyZXQ=` is letters-then-`=`, so the
 * lookahead fires on the token itself and the value leaks). Ordering needs no
 * lookahead and has no such hole.
 */
export function redactCredentials(content: string): string {
  return (
    content
      // URL userinfo (`scheme://user:pass@host`). Not in the vendor's set.
      // Defence in depth behind the validator's refusal of userinfo targets:
      // vendor-echoed text never went through the validator at all.
      .replaceAll(/(\/\/)[^/\s@]+@/gu, '$1[redacted]@')
      // Header lines. `api-key`/`x-api-key`/`x-auth-token` extend the vendor's
      // header set — review found them falling between the header rule and the
      // key=value rule (their values follow `:`, not `=`).
      .replaceAll(
        /\b(authorization|proxy-authorization|cookie|set-cookie|api-key|x-api-key|x-auth-token)\s*:\s*[^\r\n]*/giu,
        '$1: [redacted]',
      )
      // Query-string / key=value token params (`?access_token=…`, an SSE/HTTP
      // auth transport). Runs BEFORE the scheme rule — see the header comment.
      // `api_key`/`apikey` extend the vendor's string set, which strips them
      // only at object-key level; this redactor only ever sees flat strings.
      .replaceAll(
        /\b(access_token|refresh_token|client_secret|id_token|code_verifier|accessToken|refreshToken|clientSecret|idToken|codeVerifier|api_key|apikey)=[^&\s]+/giu,
        '$1=[redacted]',
      )
      // Bare auth-scheme tokens outside any header line. `basic` and `dpop`
      // extend the vendor's Bearer-only rule. The token class is lowercase-only
      // because the `i` flag covers case (an `A-Z` twin would be a duplicate
      // class, a lint finding); `$1` preserves the original scheme spelling.
      .replaceAll(/\b(bearer|basic|dpop)\s+[a-z0-9\-._~+/]+=*/giu, '$1 [redacted]')
      // The same keys as JSON string values (`"access_token":"…"`), which the
      // header rule cannot reach — the quote breaks its `keyword:` shape. The
      // header names join the key set here for the same reason. The value
      // class excludes newlines (the vendor's does not): an unbalanced quote
      // in a truncated or crashed stream would otherwise let one match swallow
      // the following diagnostic lines without a marker. The closing quote is
      // optional for the same case, so the truncated fragment is still masked
      // up to the line end rather than left in clear.
      .replaceAll(
        /(["']?(?:access_token|refresh_token|client_secret|id_token|code_verifier|accessToken|refreshToken|clientSecret|idToken|codeVerifier|api_key|apikey|authorization|cookie|set-cookie)["']?\s*:\s*["'])[^"'\r\n]*(["']?)/giu,
        '$1[redacted]$2',
      )
  );
}
