---
name: "Codex MCP Server Compatibility"
overview: "Strategic follow-up to diagnose and enable Codex compatibility for the Oak HTTP MCP server without regressing Cursor or other working clients."
depends_on:
  - "../active/sentry-otel-integration.execution.plan.md"
todos:
  - id: capture-codex-and-control-client-evidence
    content: "Capture an evidence-backed request/response comparison for Codex, Cursor, and at least one known-good control client against the same preview deployment using the evidence template."
    status: pending
  - id: confirm-or-disprove-hypotheses
    content: "Confirm or disprove H1–H4 using captured evidence and record the outcome against the decision matrix."
    status: pending
  - id: isolate-server-owned-compatibility-surface
    content: "Identify the exact server-owned compatibility surface, if any, across PRM, AS metadata, DCR, authorise redirect, token exchange, and proxy behaviour."
    status: pending
  - id: evaluate-bounded-compatibility-options
    content: "Evaluate bounded options for Codex support, including same-origin proxying, client-specific metadata shaping, Clerk configuration adjustments, or upstream-client escalation."
    status: pending
  - id: define-regression-matrix-and-promotion-slice
    content: "Define the first executable slice plus the multi-client regression matrix required before promotion into current."
    status: pending
  - id: resolve-sdk-doc-drift
    content: "Align SDK MCP docs and policy rationale comment with current scope policy once evidence is captured."
    status: pending
---

# Codex MCP Server Compatibility

**Last Updated**: 2026-04-16
**Status**: Strategic brief — not yet executable
**Lane**: `future/`

## Problem and Intent

The Oak HTTP MCP server is currently in a Sentry-validation closure lane. That
lane remains the active blocker and must not be widened. A separate follow-up
is needed for Codex compatibility because the latest attempted fix proved the
problem is not safely solved by broadening shared auth metadata:

1. Codex still failed to complete the auth flow.
2. Cursor auth regressed.
3. The server's shared `scopes_supported` contract is therefore not a safe
   place for speculative client-specific fixes.

Known live-session evidence as of 2026-04-16:

1. Codex attempted authorisation against the preview deployment and received
   `invalid_scope` from Clerk because the OAuth client was not allowed to
   request `openid`.
2. Dynamic client registration is active and OAuth apps are being created.
3. Other clients are already authenticating successfully.
4. A shared-metadata change that advertised broader scopes did not unblock
   Codex and did break Cursor, so that direction is explicitly demoted from
   candidate fix to cautionary evidence.
5. The server currently exposes a split metadata surface:
   - PRM `scopes_supported` is generated from local policy and excludes
     `openid`.
   - AS metadata `scopes_supported` is passed through from upstream Clerk and
     includes `openid`.
6. The OAuth proxy forwards `/oauth/authorize` query parameters transparently,
   including `scope`, so a client-requested `openid` reaches Clerk unchanged.

The intent of this plan is to isolate whether Codex support requires:

1. a server-owned compatibility layer,
2. a Clerk configuration change,
3. a Codex/client bug report and workaround, or
4. some bounded combination of the above.

This plan is decision-shaping only. It does not authorise implementation while
the Sentry evidence lane is still open.

## Findings Update (2026-04-16)

Current analysis supports a narrower hypothesis than "generic OAuth failure":

1. **Metadata inconsistency is real and observable**:
   PRM and AS metadata do not currently advertise the same `scopes_supported`
   set.
2. **Codex rejection remains consistent with Clerk scope enforcement**:
   if Codex requests `openid` for a DCR-created client, Clerk can reject with
   `invalid_scope`.
3. **Proxy transparency means no server-side scope normalisation today**:
   current behaviour preserves client scope input rather than shaping it.
4. **The existing policy comment is directionally correct but conditional**:
   "compliant clients will not request `openid`" only holds when clients
   actually follow PRM scope guidance.
5. **One documentation surface is stale**:
   SDK MCP docs still describe protected tool scopes as `openid`, `email`,
   which conflicts with current policy intent.

## Domain Boundaries and Non-Goals

### In scope

1. Codex-specific compatibility for the Oak HTTP MCP server.
2. Evidence capture across the full remote auth chain:
   PRM, AS metadata, DCR, authorise redirect, token exchange, and callback.
3. Preservation of existing working-client behaviour as a hard acceptance gate.
4. Option analysis for bounded compatibility strategies that do not reopen the
   whole auth design.

### Explicit non-goals

1. No delay or widening of the active Sentry validation lane.
2. No speculative shared `scopes_supported` or protected-tool scope changes
   without client-differential evidence.
3. No generic "support every client" rewrite in this future brief.
4. No reclassification of broader search-observability or non-MCP work into
   this lane.

## Baseline Evidence and Working Assumptions

The first executable plan must start from these working assumptions and either
confirm or overturn them with evidence:

1. The server already has a known-good multi-client baseline that must be
   protected, especially Cursor and standards-compliant control clients.
2. Codex may be requesting a broader OAuth scope set than the server actually
   needs to protect MCP tools.
3. The failure could sit in any of four layers: Codex request behaviour,
   Clerk DCR scope policy, server metadata/proxy behaviour, or redirect/callback
   handling across origins.
4. Local tests alone are insufficient; preview-deployment evidence is required
   because the observed failure is client/live-flow specific.

## Candidate Investigation Surface

The comparison and diagnosis work must inspect each compatibility surface
separately instead of collapsing them into one "OAuth problem":

1. **Codex request shape**
   - Requested scopes
   - DCR payload
   - Redirect URI and callback handling
2. **Server-advertised metadata**
   - PRM `authorization_servers`
   - PRM `scopes_supported`
   - AS metadata issuer and endpoint rewriting
3. **OAuth server behaviour**
   - Clerk DCR scope policy
   - Authorise endpoint acceptance/rejection rules
   - Token exchange expectations
4. **Compatibility architecture**
   - Same-origin proxy OAuth path
   - Client-specific endpoint or metadata shaping
   - Documentation-only workaround or upstream escalation

## Immediate Next Steps (Evidence-First)

Before evaluating fixes, capture a scrubbed, side-by-side evidence pack for
Codex, Cursor, and one known-good control client against the same deployment.

1. **PRM capture**
   - Full JSON from `/.well-known/oauth-protected-resource`
   - Confirm observed `scopes_supported`
2. **AS metadata capture**
   - Full JSON from `/.well-known/oauth-authorization-server`
   - Confirm observed `scopes_supported`
3. **DCR capture**
   - Request/response payload shape (client metadata, allowed scopes if present)
4. **Authorise request capture**
   - Exact `/oauth/authorize` query sent by each client
   - Required: `scope`, `client_id`, `redirect_uri`, `state`, PKCE params
5. **Clerk rejection capture (if failing)**
   - Redirect `Location` query containing `error` and `error_description`
   - Confirm whether rejection cites disallowed `openid`
6. **Token exchange capture**
   - Whether `/oauth/token` is attempted after authorise step
7. **Attribution conclusion**
   - Classify primary failure owner as one of:
     - client request behaviour,
     - Clerk DCR/scope policy,
     - server metadata/proxy behaviour,
     - redirect/callback handling.

## Evidence Capture Template

For each client (Codex, Cursor, control) capture the following against the
same preview deployment. Store scrubbed artefacts under the eventual
`current/` plan directory when promoted; do not commit raw tokens.

| Field | PRM | AS metadata | DCR request | DCR response | /oauth/authorize | Clerk redirect | /oauth/token |
|---|---|---|---|---|---|---|---|
| HTTP status | | | | | | | |
| `scopes_supported` | | | n/a | n/a | n/a | n/a | n/a |
| `scope` requested | n/a | n/a | n/a | n/a | | n/a | n/a |
| `client_id` | n/a | n/a | n/a | | | | |
| `redirect_uri` | n/a | n/a | | | | | n/a |
| PKCE params | n/a | n/a | n/a | n/a | | n/a | |
| Error code | | | | | n/a | | |
| Error description | | | | | n/a | | |

Minimum acceptance: all three clients captured against the same deployment
revision and correlation id.

## Working Hypotheses

Rank-ordered by current evidence weight. The executable plan must confirm or
disprove each with the evidence template above.

1. **H1 — Codex sends `openid` in authorise scope**
   - Evidence direction: Clerk redirect `Location` contains
     `error=invalid_scope` and references `openid`.
   - If true, primary fault line is the client request shape combined with
     AS metadata advertising `openid`.
2. **H2 — Codex reads AS metadata `scopes_supported`, not PRM**
   - Evidence direction: authorise scope set matches AS metadata set more
     closely than PRM set.
   - If true, the server's split metadata surface is a real contributor.
3. **H3 — Clerk DCR client policy disallows `openid` regardless of advertising**
   - Evidence direction: authorise fails with `openid` even when PRM only
     advertises safer scopes.
   - If true, no amount of server metadata shaping fixes this without a
     Clerk configuration or client-side scope change.
4. **H4 — Callback/redirect handling differs for Codex**
   - Evidence direction: `/oauth/token` never called even when Clerk returns
     success-shaped state.
   - If true, failure is downstream of scope handling.

## Decision Matrix

| Hypothesis confirmed | Likely remediation class | Reversibility |
|---|---|---|
| H1 only | Client bug report / Codex config; optionally normalise scope in proxy | High |
| H1 + H2 | Align AS metadata `scopes_supported` with PRM | Medium |
| H3 | Clerk configuration or client-side scope change | Low (external) |
| H4 | Scope this out; separate callback-handling follow-up | n/a |

Choose the thinnest remediation compatible with preserving working-client
behaviour. Do not combine fixes across multiple hypotheses in one slice.

## First Executable Slice (Draft)

Once promoted, the first slice should be bounded to a single compatibility
surface. A likely candidate — subject to evidence — is normalising AS
metadata `scopes_supported` to match PRM at the proxy boundary so discovery
is internally consistent. This is only valid if H1 or H2 is confirmed and H3
is explicitly disproven.

The slice MUST ship with:

1. A client-differential test fixture (Codex / Cursor / control) encoding the
   observed behaviours.
2. An integration assertion that PRM `scopes_supported` and served AS
   metadata `scopes_supported` are either deliberately identical or
   deliberately scoped-differently with documented rationale.
3. A scrubbed evidence bundle stored with the promoted plan.

## Multi-Client Regression Checklist

Before promotion and before any merge of a candidate fix:

1. Codex: full flow PRM → AS → DCR → authorise → callback → token.
2. Cursor: same full flow.
3. Control client (MCP Inspector or equivalent): same full flow.
4. Protected tool call: verify token accepted for a representative tool.
5. Public tool call: verify no-auth path still unaffected.
6. Negative case: intentionally bad scope request still returns expected
   error without destabilising session state.

## Known Follow-On Hygiene Items

Tracked here so they do not silently absorb into this lane:

1. SDK MCP doc drift: `packages/sdks/oak-curriculum-sdk/docs/mcp/README.md`
   still lists `openid, email` as required scopes and needs aligning with
   current policy regardless of the Codex decision.
2. Comment drift risk: the rationale block in `mcp-security-policy.ts`
   should eventually be revisited after evidence capture so it accurately
   reflects whether `openid` exclusion is a sufficiency claim or a
   conditional compatibility claim.

## Dependencies and Sequencing Assumptions

1. Finish `active/sentry-otel-integration.execution.plan.md` closure first:
   Vercel credential confirmation, redeploy evidence, and the date-stamped
   Sentry evidence bundle remain the active branch objective.
2. Preserve the established authority split:
   - parent Sentry plan owns current deployment/evidence work,
   - Sentry expansion remains the next MCP-server-confined observability lane,
   - this Codex plan is a separate follow-up and must not silently absorb
     active-plan scope.
3. The first Codex investigation pass should use the same preview deployment
   and one control client matrix so behavioural differences are attributable.
4. Any candidate fix must prove it does not regress Cursor, MCP Inspector, or
   other currently working clients.

## Success Signals (Promotion Readiness)

Promotion from `future/` to `current/` is justified only when:

1. There is a scrubbed evidence pack showing Codex and control-client behaviour
   against the same deployment.
2. The likely failure layer is narrowed to one primary compatibility hypothesis
   with explicit contrary evidence ruled out.
3. The first implementation slice is thin and bounded to one compatibility
   surface.
4. A regression matrix exists for Codex, Cursor, and at least one additional
   known-good client.
5. The proposed change avoids reopening shared auth assumptions unless the
   evidence proves that shared behaviour is the true root cause.

## Risks and Unknowns

| Risk / Unknown | Impact | Mitigation direction |
|---|---|---|
| Misclassifying a Codex-specific issue as a generic auth-metadata issue | Breaks working clients | Require differential evidence across Codex and control clients before code changes |
| Clerk DCR scope policy differs from assumptions for dynamic clients | False server-side fixes | Capture actual DCR/authorise payloads and rejection points before changing server logic |
| A compatibility workaround creates a new long-term maintenance burden | Architecture drag | Prefer the thinnest reversible slice and document removal conditions up front |
| Preview-only behaviour differs from local assumptions | Debugging churn | Treat preview deployment evidence as authoritative for promotion |

## Promotion Trigger Into `current/`

Create a `current/` executable Codex-compatibility plan only when all are true:

1. The Sentry validation lane is closed in the parent plan.
2. A specific Codex compatibility hypothesis is backed by live evidence.
3. The first delivery slice is bounded, reversible, and paired with a
   multi-client regression checklist.
4. The owner agrees whether the resolution path is server implementation,
   platform configuration, or upstream-client escalation.

## Foundation Alignment

This strategic plan and any promoted child plans must align with:

- `@.agent/directives/principles.md`
- `@.agent/directives/testing-strategy.md`
- `@.agent/directives/schema-first-execution.md`

## Reference-Context Rule

Any implementation notes in this strategic brief are reference context only.
Execution commitments become binding only after promotion into `current/` or
`active/`.
