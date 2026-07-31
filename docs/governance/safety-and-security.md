---
last_reviewed: 2026-07-30
---

# Safety and Security

## Overview

The Oak MCP Servers are designed with security and privacy as core principles. This document outlines the security measures, safety controls, and privacy protections implemented throughout the system.

## Core Security Principles

1. **Principle of Least Privilege**: Read-only access by default
2. **Defence in Depth**: Multiple layers of security controls
3. **Privacy by Design**: PII protection at the ADR-160 redaction barrier
4. **Fail Secure**: Safe defaults when errors occur
5. **No Trust Assumptions**: Validate all inputs

## API Key Security

### Storage and Management

- **Environment Variables Only**: API keys must be stored in environment variables or `.env` files
- **Never in Code**: Keys are never hardcoded or committed to version control
- **Validation on Startup**: Keys are validated using Zod schemas before use
- **No Logging**: API keys are never logged, even at debug level
- **Local Env Files**: Use `.env` and `.env.local` for local credentials. Keep these files untracked.

### Agent Tool Choice When Reading Credential-Bearing Files

For any file that may hold credentials (`~/.claude.json`, `.env*`, auth
configs, MCP server settings, service-account files), agents default to the
`Read` tool rather than Bash `grep`/`cat`/`head`. The repo's secrets-scan
`PreToolUse` hook covers `Read` only; the Bash hook is a command-pattern
blocker, not a content scanner — so a Bash read drives through the gap
between the two defences (worked instance 2026-04-24: a `grep -i sonar
~/.claude.json | head` surfaced a real-looking token into the transcript).
When Bash is genuinely required (line counts, directory walks), structure the
command so value-bearing lines never reach stdout — `grep -l` / `grep -c`, or
exclude token-like lines before printing. The same discipline applies to
sub-agent briefs: never ask a sub-agent to "grep the config" when it can
`Read` it under the scanner.

### Line-Specific Exceptions

The repo is scanned with `gitleaks` in CI and pre-push. Broad allowlisting is not
permitted. If a token-like placeholder must remain in tracked docs, use a
line-specific allowlist comment:

```text
OAK_API_KEY=oak_example_token # gitleaks:allow
```

Use path-level allowlisting only for `.agent/reference/**`, which contains
third-party examples.

Escalation path:

- `pnpm secrets:scan` for routine local commit/branch checks
- `pnpm secrets:scan:all` for bootstrap and audit scans across branches/tags
- `pnpm secrets:scan:all-refs` for repository forensics

### Configuration Examples

```bash
# .env file (gitignored)
OAK_API_KEY=your_oak_api_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here
```

### Key Rotation

- Keys can be rotated by updating environment variables
- No application code changes required
- Server restart required for new keys to take effect

## Privacy Protection

### PII Scrubbing

The binding privacy architecture is ADR-160's non-bypassable redaction barrier:
payloads that would otherwise leave the process must pass through the shared
redaction policy before any sink receives them.

Current proven coverage includes sensitive keys, bearer tokens, OAuth fields,
and IP-like headers in the telemetry redaction paths. ADR-160 records
arbitrary email-like value scrubbing as implementation debt unless a data-flow
proof shows those values cannot enter the path under test.

### Implementation Direction

```typescript
// Pattern only: concrete coverage belongs at the ADR-160 redaction barrier.
export function scrubEmailLikeValue(value: string): string {
  // Redact the local part before an email-like value leaves the process.
  return value.replace(/[^@\s]{1,64}@[^@\s]+/g, '[redacted-email]');
}
```

### PII in the Repository Estate

The org policy — never include PII — binds the repository estate itself
(paths, test fixtures, docs, memory files, tool-output dumps), not only
runtime payloads:

- **Delete on sight, never narrate.** On finding PII in any versioned or
  shared artefact, remove it immediately and report the removal as done —
  never present the find as an interesting artefact or keep it visible
  while discussing it.
- **Test fixtures use obviously-fake values via dependency injection**
  (placeholder names, `example.org`) — never a real username, home path,
  or host, even as a positive-control fixture in the very test that
  guards against such values. A behaviour-proving test proves the same
  behaviour with a fake value passed as data; the
  `no-machine-local-paths` validator and write hook mechanically catch
  the user-home and flattened project-id carrier forms.
- **A coarse location tied to a principal (a timezone, a region) is not
  automatically identifying.** Surface borderline references for the
  data-subject's judgement rather than auto-classifying them as
  must-remove — and rather than shipping them silently.
- **Never ship a "PII-clean" verdict from a regex sweep plus a skim.** A
  clean verdict needs a real read of the surfaces at stake; borderline
  finds are surfaced, not adjudicated by the scanner.

## Access Control

### Read-Only Operations (Phase 2)

- All MCP tool operations that call the Oak Curriculum API are read-only
- The system cannot modify upstream curriculum data

All external inputs are validated using strict Zod schemas where appropriate:

- **Request Parameters**: Validated before processing
- **Environment Variables**: Validated on startup
- **API Responses**: Validated before use

### Example Validation

```typescript
const SearchArgsSchema = z.object({
  query: z.string().min(1).max(1000),
  scope: z.enum(['all', 'lessons', 'units', 'threads', 'sequences']).default('all'),
  subject: z.string().optional(),
  keyStage: z.string().optional(),
});
```

## Error Handling Security

### Information Disclosure Prevention

- **Sanitized Error Messages**: Internal details never exposed to users
- **Stack Traces**: Only shown in development mode
- **API Errors**: Mapped to generic user-friendly messages
- **Logging**: Sensitive data scrubbed from logs

### Error Classification

Errors are classified and handled appropriately:

- **Validation Errors**: Return specific field errors without internal details
- **Not Found**: Generic "resource not found" without revealing structure
- **Permission Errors**: No indication of what permissions are needed
- **Rate Limits**: Clear message without exposing limits
- **Internal Errors**: Generic message, details logged internally only

## Multi-Layer Security Architecture

The HTTP MCP server operates behind multiple defence layers. Each layer
catches threats the others miss. No single layer is sufficient alone.
The edge-protection layers (Cloudflare in front of Vercel) are the
authoritative volumetric defence and the only layer that counts traffic;
application-layer controls are authentication, authorisation, and input
validation.

### Layer Stack

| Layer                       | Protection                                                                                                                               | Failure Mode                                                                                               |
| --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| **DNS**                     | DNS rebinding guard rejects requests with unrecognised `Host` headers. Applied selectively (landing page); MCP routes use OAuth instead. | Bypassed if attacker controls DNS for an allowed host                                                      |
| **Cloudflare (outer edge)** | CDN/WAF in front of Vercel: volumetric DDoS, bot management, edge rate-limit rules, TLS termination, geo-restrictions                    | Bypassed by direct-origin access or low-rate attacks below edge thresholds                                 |
| **Vercel (inner edge)**     | Vercel platform DDoS protection, edge functions, regional routing                                                                        | Bypassed by direct-origin access or low-rate attacks below edge thresholds                                 |
| **Application — auth**      | OAuth 2.1 via Clerk (`mcpAuth` middleware), CORS, security headers (CSP, HSTS, X-Frame-Options)                                          | Bypassed if OAuth token compromised or auth disabled                                                       |
| **Upstream API**            | Oak API per-key rate limiting; this service's key is exempt as an internal consumer                                                      | Not a quota ceiling for this service — amplification is bounded by upstream capacity, not by per-key quota |

**Read-only blast radius.** All MCP tools exposed by this server are
read-only — there is no state-mutation surface. A successful bypass at
any layer cannot corrupt data; the worst case is upstream load and Vercel
compute spend. This shapes proportionality across the controls below: the
volumetric controls that bound that load live at the edge, where traffic
can actually be counted (see
[ADR-219](../architecture/architectural-decisions/219-rate-limiting-is-an-edge-concern.md)).

### Trust Boundaries

- **Client → CDN**: untrusted; CDN applies edge protection
- **CDN → app origin**: semi-trusted. The origin does not derive client
  identity from forwarded-for headers: on this deployment they resolve to
  Cloudflare egress addresses, not to clients, so they are treated as
  diagnostic context only and never as a security or accounting key.
  Client identity at the application layer comes from the OAuth token,
  not from the network address (see
  [ADR-219](../architecture/architectural-decisions/219-rate-limiting-is-an-edge-concern.md)).
- **App → upstream API**: authenticated via `OAK_API_KEY`; our server is
  the trust principal, not the end user
- **Iframe sandbox → host**: MCP Apps SDK widget runs in a sandboxed
  iframe; CSP `csp.connectDomains` and `csp.resourceDomains` control
  outbound requests (declared via `_meta.ui.csp` on resource content items)

### Curriculum content sourcing — TPC filtering is the safety boundary

Oak curriculum **content and assets** (lesson images, charts, datasets,
downloadable files) must be obtained through the **Oak Open Curriculum API /
generated SDK**, never fetched directly from the raw CDN
(`cloudinary-res.thenational.academy` or any image origin). The API applies
**Third-Party-Content (TPC) filtering** — it is the surface that guarantees
content is safe and rights-cleared. The raw CDN is **unfiltered**, so a direct
fetch bypasses the safety boundary **even when the API itself returned the CDN
URL** (as on a lesson-quiz payload's image `url` field): the filtering lives at
the API, not on the asset. An API-returned URL does not make a raw-CDN fetch
safe.

To obtain a curriculum image or asset, use the API/SDK asset path (e.g.
`get-lessons-assets` then `download-asset`, or the documented asset endpoints).
If only a raw CDN URL is available and no API path exists, **stop and ask the
owner** before fetching it. This is the safety rationale behind the standing
data-sourcing invariant — TPC filtering, not merely provenance. The agent-time
form is the always-applied
[`source-curriculum-content-via-api-not-cdn`](../../.agent/rules/source-curriculum-content-via-api-not-cdn.md)
rule.

### Amplification Vectors

One pattern allows a single inbound request to produce upstream load; a
second pattern, once thought to, does not:

1. **OAuth authorise redirect — zero amplification**: `GET /oauth/authorize`
   builds a 302 redirect URL and makes no upstream call. Clerk load is
   created only by a client choosing to follow the redirect, which an
   abuser has no incentive to do.

2. **HMAC-signed asset replay**: Asset download URLs are HMAC-signed with
   a 5-minute TTL but no single-use constraint. Within the window, a
   valid URL can be replayed to re-read one already-authorised asset
   through the server's `OAK_API_KEY`.

The replay vector is bounded at the edge, where request volume per source
can actually be counted; it is not bounded in the application, which
cannot count per client on this deployment (see
[ADR-219](../architecture/architectural-decisions/219-rate-limiting-is-an-edge-concern.md)).
Its upstream cost is bounded by upstream capacity rather than a per-key
quota, because this service's Oak API key is exempt from per-key rate
limiting as an internal consumer.

## Network Security

### HTTPS Only

- All Oak API and Elasticsearch calls use HTTPS
- No option to disable SSL/TLS
- Certificate validation enabled

## Secure Development Practices

### Type Safety

- **No `any` Types**: Strict TypeScript throughout
- **No Type Assertions**: No `as` casting
- **Runtime Validation**: Zod schemas at boundaries

### Testing

- **Security Test Cases**: PII scrubbing tested
- **Error Message Tests**: Verify no information leakage
- **Input Validation Tests**: Edge cases and injection attempts

### Code Review

- All code reviewed before merge
- Security considerations in PR template
- Automated security checks in CI/CD

## Deployment Security

### Package Security

- **Minimal Dependencies**: Only essential packages
- **Regular Updates**: Dependencies kept current
- **Vulnerability Governance**: Dependency vulnerability policy follows
  [ADR-174](../architecture/architectural-decisions/174-dependency-vulnerability-scanning-quality-gate.md).
  Do not claim a dependency-audit CI gate until it is wired into ADR-121.
- **Lock Files**: Exact versions via pnpm-lock.yaml

### Runtime Security

- **Node.js 24.x**: Latest security patches
- **ESM Only**: Modern module system
- **No Eval**: No dynamic code execution
- **Strict Mode**: JavaScript strict mode enabled

## Compliance Considerations

### GDPR/Privacy

The production MCP service processes personal data, and says so plainly.
Three processors receive application-level personal data, each behind a
defined boundary:

- **Clerk** — authentication and user management (OAuth 2.1, see
  [ADR-052](../architecture/architectural-decisions/052-oauth-2.1-for-mcp-http-authentication.md)).
  Account data lives in Clerk, in the fields its configured sign-in
  journey collects; this document does not restate that field list.
  The verified Clerk principal is the service's identity source. The
  raw Clerk identifier does not reach PostHog: analytics attribution
  uses a derived pseudonym (below).
- **PostHog** — product analytics, EU-hosted (`eu.i.posthog.com`), live
  in production. Capture is bounded by
  [ADR-218](../architecture/architectural-decisions/218-posthog-mcp-analytics-identity-session-and-privacy.md)'s
  closed, content-free event allowlist; §3 of that ADR is the ceiling
  and this section does not restate it. In outline: MCP interaction
  facts (an event identifier, capability names, timings, outcome
  categories, protocol/client/environment/release categories),
  attributed to a keyed actor pseudonym derived from the Clerk
  principal. Content never enters — tool arguments and responses, free
  text, names, emails, tokens, headers, cookies, IP addresses and
  GeoIP are excluded by construction, as are browser autocapture,
  session replay and fingerprinting. The pseudonym is pseudonymised
  personal data, not anonymous data: it carries transparency, access,
  retention and erasure duties. ADR-218 §5 commits this processing to
  a maximum 12-month retention period across PostHog and every
  authorised copy, and to a tested person-scoped deletion route. Both
  are commitments whose operational proof is outstanding — ADR-218's
  maturity note states that acceptance does not assert retention,
  access controls, or the deletion route are live — and MCP-173 tracks
  that evidence.
- **Sentry** — error tracking and diagnostics, behind
  [ADR-160](../architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)'s
  non-bypassable redaction barrier (see §Privacy Protection above).
  Diagnostic events carry the opaque Clerk user identifier on the
  per-request scope, so Sentry holds a direct authentication
  identifier where PostHog holds only a destination-scoped pseudonym.
  No stable person identifier is therefore shared between the two.
  Whether that identifier may flow to any further sink remains the
  open redaction-policy question recorded in ADR-160's history.

Infrastructure and upstream recipients sit alongside those three: the
Cloudflare and Vercel layers named in §Multi-Layer Security
Architecture see client network data at the edge, and the Oak
Curriculum API and the Elasticsearch search backend receive request
content in order to answer each call. This section names them so the
recipient list is not read as closed at three; their boundaries are
not restated here.

Request content — tool arguments, including free-text search terms — is
processed to serve each request and is not written to any Oak analytics
or product data store. It reaches the Oak Curriculum API and the search
backend that answer the call, and it never enters the analytics
envelope. Conversations are not observed or stored: ADR-218 keeps
PostHog's conversation mechanism disabled.

PII scrubbing applies at the ADR-160 redaction barrier, with the proven
coverage and the recorded gap both described in §Privacy Protection
above.

## Security Incident Response

### Vulnerability Reporting

Report security issues by following the instructions in the
[SECURITY.md](../../SECURITY.md) file at the repository root, which
points to Oak's canonical security disclosure process at
[www.thenational.academy/.well-known/security.txt](https://www.thenational.academy/.well-known/security.txt).

Do not report security issues via public GitHub issues.

### Update Process

1. Security patches released as soon as possible
2. Users notified via GitHub security advisories
3. Semantic versioning for clear update paths

## Security Checklist for Developers

Before committing code:

- [ ] No hardcoded secrets or API keys
- [ ] All inputs validated with Zod
- [ ] Error messages don't leak internal details
- [ ] PII properly scrubbed in outputs
- [ ] No use of `any` or type assertions
- [ ] Security implications documented
- [ ] Tests cover security edge cases
