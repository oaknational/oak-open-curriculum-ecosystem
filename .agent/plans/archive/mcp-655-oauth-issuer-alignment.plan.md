---
id: mcp-655-oauth-issuer-alignment
node_type: delivery
name: OAuth issuer alignment for RFC 9207 clients
overview: The Protected Resource Metadata names the upstream authorization server so the issuer a client holds equals the iss in the authorization response; the app-origin proxy metadata stays for origin-discovering clients.
status: archived
ratified_by: Jim Cresswell
ratified_date: 2026-09-01
ratified_where: Linear MCP-655 (the ratification comment of 2026-09-01 records the owner's approval of this plan in the authoring session); scope amended 2026-09-01 at the owner's word in the implementing session (Kiln holds Slag, 1447f4) — see §Amendment 2026-09-01
serves: first-major-release
impact_areas:
  - auth-and-access
  - conformance-and-standards
tickets:
  - MCP-655
depends_on: []
owner_gates: []
last_updated: 2026-09-02
---

# OAuth issuer alignment for RFC 9207 clients

## Outcome (2026-09-02) — delivered, plan archived

PR #946 merged to `main` at 10:42Z as `55f7a457c` (owner merge). The PRM
names the upstream authorisation server's issuer, validated at the fetch
boundary; the proxy-path metadata is unchanged, as amended. Proofs, in the
order the node asked for them: Claude Code's v2 runtime signed in on the
#946 preview (implementing session, 2026-09-02 morning) and on the #945
preview carrying the same commit (09:03Z, the #945 lane's UAT record);
Cursor authenticated and exercised tools on both previews (owner,
~10:30–10:35Z: "Cursor validated both preview servers"). The proof day
exposed a second, pre-existing defect — the preview environment's Clerk
keys were not a pair, refusing every token since 2026-08-05 — cured by the
owner's key correction plus a bootstrap key-pairing guard (`7579d4269`,
`clerk-key-pairing.ts`). Follow-ups ride as pointers on the PR: MCP-656
(the proxy path's served-field projection), the SDK v2 exploration (owner's
word, not yet), truing `.mcp.json.example`. Records: Linear MCP-655 (Done),
PR #946, the open-surface-zero thread record §Lanes.

This node is self-contained: a fresh session implements it from this document and the
linked ticket alone. The ticket carries the incident evidence (dates, client versions,
deployment URLs); this node carries the mechanism, the exact changes, the sequence and the
proofs.

## Amendment 2026-09-01 (owner word, implementing session)

Scope narrowed at the owner's word after the implementing seat's review of this node against
`testing-strategy.md` (prove behaviour, never config; pinning an absence is not proof): the fix
is the PRM change alone. The proxy-path metadata is left exactly as it is — its RFC 9207 claim
(`authorization_response_iss_parameter_supported: true`, spread through from the upstream) is a
promise the proxy path cannot keep, but omitting or falsifying it changes no known client's
behaviour (Claude Code compares a present `iss` unconditionally, and the upstream sends one —
the ticket's recorded error names a `received` value, which the client reports only when the
redirect carried `iss`; the MCP TypeScript SDK 1.30.0 ignores the flag; Cursor signs in through
this path today, so it does not validate the parameter), so the only test it could carry is a
configuration pin. The
served-field projection for that path is decided at the generator on MCP-656. Tests assert the
relation between the injected upstream fixture and the served PRM, never a literal origin.
Cursor — the ADR-115 origin-discovering client — joins the owner-held preview proof, because the
PRM change is the one behaviour whose consequence for that client no in-process test can reach.
The disclaim-only edits left in the worktree at handover are discarded, not reworked.

## Panel absorption 2026-09-01

Seven read-only Opus reviewers were run against this amended node before implementation
(assumptions, mcp, architecture ×2 — ADR compliance and adversarial — security, clerk, test),
with first-hand verification of the code, ADRs, RFCs, the draft and dated MCP authorization
revisions, the published `@modelcontextprotocol/client@2.0.0`, and Claude Code's error
reference. Every finding is absorbed into the sections below or refuted here; the verdict
texts are on the pull request. Dispositions that changed the plan: the fetched `issuer` is
validated at the boundary (security P1, §Changes item 2); Cursor's discovery path is described
truthfully and its preview sign-in is a merge gate (architecture + assumptions P1s,
§Mechanism, §Acceptance); the e2e edit is enumerated site by site with each post-state (test
and mcp P1/P2s); the registry files are the ones that actually hold C706 (all reviewers);
ADR-115 §Context, Positive 1 and 5, Deployment Precondition 1 and the e2e Implementation row
join the amendment list; the MCP-spec claim in the reviewer evidence is corrected to name the
revisions; the owner-held proof is made non-vacuous — client version recorded, no v1-runtime
override, cleared client state, a negative control against unchanged production (adversarial +
clerk); Cursor's specific failure mechanism is named; a rollback and upgrade-in-place section is
added; the Clerk-helper claim is corrected (the helper derives the FAPI URL, which equals
`issuer` on both instances). Refuted at source: the assertion that Claude Code's error reference lists a
different trigger sentence — the page carries exactly the sentence paraphrased below and no
other; the assertion that "the upstream sends `iss`" is unevidenced — the `received` value in
the recorded error is that `iss` (the client's `validateAuthorizationResponseIssuer` reports
it only when present).

## Goal

An MCP client that validates the RFC 9207 `iss` parameter can sign in to the Oak Curriculum
MCP app on preview and production. Today such clients refuse the authorization response,
because the app names itself as the authorization server while the response carries the
upstream identity provider's issuer.

## Mechanism

The app is a transparent OAuth proxy in front of the upstream identity provider (Clerk) — see
[ADR-115](../../../docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md):

- `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts`,
  `registerPublicOAuthMetadataEndpoints` → `servePrm`: the Protected Resource Metadata
  (RFC 9728, `/.well-known/oauth-protected-resource` and the path-qualified `/mcp` variant)
  serves `authorization_servers: [selfOrigin]` — the app names itself as the AS.
- `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.ts`,
  `rewriteAuthServerMetadata`: the AS metadata at the app origin is the upstream document with
  `issuer` and the authorize/token/register endpoints rewritten to the app origin; every other
  field is spread through unchanged — including the upstream's
  `authorization_response_iss_parameter_supported: true`.
- `/oauth/authorize` redirects the browser to the upstream authorize endpoint, and the upstream
  redirects straight back to the client's `redirect_uri`, so the authorization response carries
  the **upstream** `iss`, never the app origin.

RFC 9207 §2.4: a client that supports the parameter "MUST extract the value of the `iss`
parameter from authorization responses they receive if the parameter is present" and compare
it with the issuer identifier it holds; it "SHOULD discard authorization responses with the
`iss` parameter from authorization servers that do not indicate their support for the
parameter". So a validating client holding the app origin as issuer must refuse — and merely
disclaiming support on the proxy metadata does not cure it (the upstream still sends `iss`;
the client still compares it, and now also should discard the response). The only cure that
satisfies the RFC is that the issuer the client holds **equals** the `iss` the upstream sends.

**The change**: the PRM names the upstream authorization server's issuer in
`authorization_servers` (the value is already available — `upstreamMetadata.issuer` is
injected into `registerPublicOAuthMetadataEndpoints`; `issuer` is the value RFC 9207 §2.4
compares against, so it is the RFC-correct source, and on both Oak instances it equals the
FAPI base URL that the Clerk MCP library's own PRM helper derives from the publishable key —
the app-origin rewrite, not the upstream name, is the deviation from Clerk's documented shape;
the `servePrm` TSDoc cites the RFCs, not the helper). A client following the PRM then reads the upstream's own AS
metadata, registers and exchanges tokens there, and receives an `iss` equal to the issuer it
holds. The app-origin AS metadata and the three `/oauth/*` proxy endpoints remain unchanged.
They serve Cursor's post-redirect re-discovery: per ADR-115 §Context, Cursor reads the PRM at
the 401, loses the `resource_metadata` URL across the browser redirect, and re-discovers the AS
from the resource origin. After this change Cursor's initial discovery reaches the upstream
directly (the RS≠AS condition ADR-115 was written to avoid returns for that first leg), and its
post-redirect token exchange still lands on the proxy, which forwards to the same upstream
registry — a mixed path this plan predicts completes. The specific way it could fail: Cursor
re-running registration through the proxy on the fallback leg and exchanging the code under a
second `client_id`, which the upstream refuses (`invalid_grant`). Only the owner-held Cursor
proof can decide it. That proxy path cannot satisfy RFC 9207, and this fix leaves its served metadata
unchanged — including the
upstream's `authorization_response_iss_parameter_supported: true`, which passes through under
our `issuer` as a promise that path cannot keep; the projection of upstream fields on that path
is MCP-656's decision (§Amendment 2026-09-01). Tokens (the upstream's opaque tokens), RFC 8707
audience validation and the `/mcp` endpoint are untouched.

Reviewer evidence (three read-only reviews, verdicts on the ticket): Claude Code's own error
reference states that a redirect carrying no `iss` passes unless the metadata sets the claim,
and that a present `iss` is always compared — the flag governs only the absent-`iss` branch;
the current dated MCP authorization revision (2026-07-28) makes the RFC 9207 §2.4 client
validation normative (the prior dated revision, 2025-11-25, did not mention RFC 9207) — a four-row table: a present
`iss` is compared regardless of the metadata flag, an absent `iss` is rejected only when the
flag is `true` — and asks authorization servers to include `iss` (SHOULD, expected to become
MUST); the published `@modelcontextprotocol/client@2.0.0` (`validateAuthorizationResponseIssuer`)
implements exactly that table, so for spec-conformant clients the proxy path's gap is
normative, and MCP-656 defers a normative gap, not a stylistic one; the
disclaim-only shape adds no security exposure but cures nothing; the redirect-target broker
would add a state store, an open-redirect surface and code transit through our logs for
negligible marginal value. Those same verdicts are why no change to the proxy-path claim is in
this fix: they establish that the flag governs only the absent-`iss` branch, which the upstream
never produces.

Rejected shapes, so they are not re-proposed: disclaim-only (insufficient per the RFC text
above); the proxy as redirect target re-issuing responses with its own `iss` (a stateful
broker with new open-redirect and code-interception surface, to preserve a uniform path whose
only justification is one client's discovery bug); `issuer` = upstream on the app-origin
metadata (violates RFC 8414 §3.3); omitting or falsifying the RFC 9207 claim on the proxy-path
metadata as part of this fix (no client behaviour turns on it, so only a configuration pin could
test it — the generator-level home is MCP-656).

Known consequence, recorded on ADR-115: clients following the PRM register at the upstream's
DCR directly, so the proxy's advertised-AS refusal of plain-`http` non-loopback redirect URIs
(ADR-115, MCP-188) no longer covers them; ADR-115 Negative 4 already rules that refusal a
conformance control, not a security boundary. The mcpjam `oauth_dcr_http_redirect_uri`
conformance check now grades the upstream's DCR on that path.

## Acceptance criteria (each with a proof — required)

- The served PRM names the upstream authorization server — the issuer a PRM-following client
  holds is the injected upstream's issuer — `repo-safe`: route integration tests in
  `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.integration.test.ts` and
  `canonical-origin.integration.test.ts` asserting that relation against the injected fixture,
  the e2e discovery suite in
  `apps/oak-curriculum-mcp-streamable-http/e2e-tests/auth-enforcement.e2e.test.ts`, and the
  content-registry validator (`validate-mcp-content-current-source`) green.
- The value the PRM publishes is validated at the boundary it crosses: the fetched upstream
  metadata's `issuer` must equal the upstream base URL the document was fetched from
  (RFC 8414 §3.3), or bootstrap fails — `repo-safe`:
  `src/app/oauth-and-caching-setup.unit.test.ts` proves a foreign `issuer` yields
  `issuer_mismatch`.
- A validating client completes sign-in against a preview of the change — `owner-held`, and
  made non-vacuous by three conditions: the Claude Code version is recorded and no
  `MCP_SDK_GENERATION` override is set (the v1 runtime does not run the check, so its pass
  proves nothing); the server is removed and re-added before each run so no cached registration
  or AS metadata from an earlier attempt masks the exercised path; and a negative control runs
  first — the same client against unchanged production must still emit the issuer-mismatch
  error. Then the owner signs in from Claude Code against the pull request's Vercel preview
  (add it as an `http` MCP server, `/mcp` → Authenticate); success is the tools list loading —
  and signs in from Cursor against the same preview (the ADR-115 origin-discovering client: the PRM it reads
  now names the upstream, so its discovery path changes even though the proxy endpoints do
  not); both results are recorded on the pull request. The Claude Code result is the decision's
  falsifier: if sign-in still fails after this change, the residual cause is client-side and
  the evidence goes to the client vendor — do not build the broker on a guess. A Cursor failure
  on the preview BLOCKS merge unless the owner rules otherwise: ADR-115 Positive 1 ("Cursor
  works") would otherwise be withdrawn silently. To attribute it, run Cursor against production
  first, while production is still pre-fix — no observed-good date for Cursor on the proxy path
  is on file — then against the preview: a failure on both is pre-existing; a failure only on
  the preview is this change's.
- The proxy path is unchanged in code — `repo-safe`: the `/oauth/*` proxy endpoint tests and
  the app-origin AS-metadata tests are unchanged and green. This proves no code moved on that
  path, not that any client is unaffected; client behaviour is the owner-held proof above.
- The architecture record says what is true — `repo-safe`: ADR-115 amended (§Context,
  §Metadata Rewriting, §Always-On, §Critical Assumption, Deployment Precondition 1,
  Positive 1 and 5, the Implementation e2e row, a dated Negative consequence), the ADR-053
  proxy-AS amendment item 4, the UAT runbook rows; markdownlint and Prettier green.

## Changes (exact)

Product code:

1. `src/auth-routes.ts`, `servePrm`: `authorization_servers: [selfOrigin]` →
   `authorization_servers: [upstreamMetadata.issuer]`; TSDoc states why (RFC 9207 §2.4) and
   that the app-origin AS metadata remains for origin-discovering clients.
2. `src/app/upstream-metadata-fetch.ts`: the fetch compares the validated document's `issuer`
   with the upstream base URL it was fetched from and fails when they differ — RFC 8414 §3.3
   makes them identical by definition (the issuer is the URL the well-known path was inserted
   into), and both Clerk instances satisfy it byte-for-byte (verified 2026-09-01:
   `https://clerk.thenational.academy`, `https://native-hippo-15.clerk.accounts.dev`). The
   mismatch is its own error class, and `src/app/metadata-fetch-error.ts` gains the
   `issuer_mismatch` discriminant, classified by the error's `name` (the module's
   existing discriminant idiom), never by message substring. Why here:
   the fetched `issuer` was inert while the rewrite overwrote it; item 1 makes it the value
   every PRM-following client trusts for registration, authorization and token exchange, so
   it is validated at the boundary it now crosses (`strict-validation-at-boundary`). The
   injected-metadata path (`resolveUpstreamMetadata`) already sets the base URL to the
   injected issuer, so tests need no change there. Without the check, an upstream that later
   declared its issuer with a trailing slash or on another host would break every
   PRM-following client while every fixture-fed test stayed green; with it, bootstrap fails
   loudly and names both values.
3. `src/app/clerk-key-pairing.ts` (added 2026-09-02 at the owner's word, after the preview
   proof): at bootstrap the secret key must belong to the instance the publishable key
   names — a `kid` shared between the publishable key's public JWKS and the secret key's
   Backend API JWKS (each instance's `kid` is its instance id), or bootstrap fails naming
   both instance ids and never the secret. Why: the publishable key decides which instance
   issues every token and the secret key which instance verifies them; a mispaired pair
   lets every sign-in complete and refuses every token as "OAuth token not found" — the
   state the preview environment sat in for four weeks, invisible to every metadata probe,
   and the state this fix would have shipped into had production been mispaired.
   `src/app/oauth-and-caching-setup.ts` runs it as the `verifyClerkKeyPairing` bootstrap
   phase after the metadata fetch; `bootstrap-helpers.ts` names the phase. Proven by
   `clerk-key-pairing.unit.test.ts` (paired, unpaired, key rejected, malformed JWKS,
   network failure; the secret appears only as the Backend API bearer credential) and
   live: a wrong secret key fails startup with the JWKS 401.
4. Nothing else in product code. `src/oauth-proxy/oauth-proxy-upstream.ts` is untouched
   (§Amendment 2026-09-01).

Tests (test first — red for the right reason, then green; each test names a system state):

- `src/auth-routes.integration.test.ts`: the `authorization_servers` assertions in the
  `authorization_servers field` describe block and the path-qualified PRM test expect
  `[TEST_UPSTREAM_METADATA.issuer]` (the fixture's issuer) for both hosts — the relation to the
  injected input, never a literal origin. Titles say what each test now proves: the describe
  `authorization_servers field (self-origin proxy)` becomes `authorization_servers field (names
  the upstream authorization server)`; `points to self-origin, not upstream Clerk` becomes
  `names the upstream authorization server from the injected metadata`; `uses https for
  non-loopback hosts` loses its subject (the value no longer derives from the Host) and becomes
  `names the upstream authorization server whatever Host is presented` — the fixture differs
  from every self-origin in scheme and host, so it discriminates; the path-qualified test's
  `with self-origin AS` becomes `with the upstream AS`. `resource` stays on self-origin (the
  scheme derivation still lives there); the AS-metadata tests are unchanged.
- `src/canonical-origin.integration.test.ts`: the PRM `authorization_servers` assertion expects
  the fixture's issuer; `resource` stays on the canonical origin; the title becomes `names the
  canonical resource and the upstream authorization server`.
- `src/app/oauth-and-caching-setup.unit.test.ts`: a new case beside the `invalid_shape` one —
  the fake fetch returns a document whose `issuer` is a foreign origin → `err` with
  `type: 'issuer_mismatch'` and a message naming both values.
- `e2e-tests/auth-enforcement.e2e.test.ts` — four sites go red, each with a named post-state;
  none is greened by deleting an assertion (the suite never contacts the upstream; the injected
  fixture issuer is `https://test-instance.clerk.accounts.dev`):
  - the helper `validatePrmSelfOrigin` (≈:105) becomes `validatePrmNamesUpstream` and asserts
    `asUrl` **equals** `TEST_UPSTREAM_METADATA.issuer` byte-for-byte (RFC 9207 §2.4 and the
    2026-07-28 MCP revision forbid normalisation before comparison);
  - the flow test `PRM authorization_servers points to self-origin, not Clerk` (≈:257) becomes
    `PRM authorization_servers names the upstream authorization server`, its
    `not.toContain('clerk')` and loopback-regex pair replaced by the same equality;
  - the two metadata tests at ≈:336 and ≈:359 replace their loopback-regex +
    `not.toContain('clerk')` pairs with the same equality;
  - the describe `OAuth Discovery Flow (Proxy — Self-Origin)` (≈:256) and the file docblock's
    "PRM and AS metadata endpoints return self-origin URLs" (≈:28–34) are trued: the PRM names
    the upstream; the AS metadata at the origin and the proxy routes are unchanged.
  The app-origin AS-metadata and `/oauth/*` tests are unchanged. (The file is an integration
  test by shape — it imports `createApp` — a pre-existing classification matter outside this
  story.)
- Mutation check (testing-strategy §Prove the guard bites): revert the `servePrm` line and
  confirm the red set is exactly the PRM assertions enumerated above (three in
  `auth-routes.integration.test.ts`, one in `canonical-origin.integration.test.ts`, the
  helper-backed flow test and the two metadata tests in the e2e suite); revert the issuer
  check and confirm exactly the new `issuer_mismatch` case reddens; restore both.

Content registry (the pre-commit validator `validate-mcp-content-current-source` pins immutable
source fragments; every changed governed file is re-attested — machinery in
`agent-tools/src/mcp-content-current-source/`):

- C706 (`servePrm` body) lives in `current-aggregated-item-anchor-overrides.ts` (≈:235 at
  HEAD; its literal contains `authorization_servers: [selfOrigin],`): edit that row in place to
  the new literal. Its revision is already `'modified'` in
  `current-aggregated-item-revision-overrides.ts` (≈:56). Do NOT add a C706 row to
  `current-registration-item-anchor-overrides.ts` — `current-item-anchor-overrides.ts` spreads
  the registration overrides after the aggregated ones, so a duplicate row would shadow the
  stale aggregated anchor silently, with no validator error.
- Reviewed delta (semantic-hash pinned, with an MCP-655 comment):
  `current-source-delta-reviews-app-auth.ts` — `auth-routes.ts` (`reviewed`, citing
  C705–C708). If the validator names `src/app/upstream-metadata-fetch.ts` or
  `src/app/metadata-fetch-error.ts` as governed, each takes an `excluded`
  `IMPLEMENTATION_ONLY` entry (boot-time boundary validation; no agent-facing content). Hashes
  come from the validator's own failure output or `semantic-source-sha256.ts`. The C408 rows
  and the test-helpers delta entry from the disclaim-only draft are discarded with it.
- `pnpm --filter @oaknational/agent-tools refresh-mcp-content-current-source-anchors`, then
  `pnpm --filter @oaknational/agent-tools validate-mcp-content-current-source` → OK; review the
  regenerated artefacts under `.agent/reports/mcp-agent-facing-content-audit/` — only the C706
  row and the delta inventory move.

Documentation:

- ADR-115, each as a dated 2026-09-01 amendment (the staged Negative 8 draft in the worktree
  is discarded wholesale — it claims the disclaim cures Claude Code):
  - §Context: the RS≠AS condition returns for Cursor's initial discovery; the proxy now serves
    its post-redirect re-discovery (the Cursor bug's second leg), and Positive 1 is re-proved
    on the preview rather than assumed.
  - §Metadata Rewriting: the PRM names the upstream AS; the "all capability fields pass
    through unchanged" sentence stays true and stays as it is.
  - §Always-On: two standard discovery mechanisms, no client detection.
  - §Critical Assumption (Opaque Tokens): its issuer-mismatch note is trued — the mismatch
    arrived through RFC 9207 on the authorization response, not through a token `iss` claim.
  - Deployment Precondition 1: `authorization_servers` is no longer Host-derived (a reduction
    of the Host-manipulation surface; `resource`, `issuer` and the endpoints still are).
  - Positive 5 and the MCP-188 clause: the proxy's plain-`http` redirect-URI refusal now covers
    origin-discovering registrations only; PRM-following clients register at the upstream's
    DCR directly (Negative 4 already rules the refusal a conformance control).
  - The Implementation table's e2e row: the suite asserts the PRM names the upstream and the
    origin's AS metadata and proxy routes are unchanged.
  - Positive consequence 4 cross-referenced to the new Negative consequence, and that
    consequence: the proxy path cannot satisfy RFC 9207 (normative for clients in the
    2026-07-28 MCP authorization revision; absent from the prior dated 2025-11-25) — the passed-through
    `authorization_response_iss_parameter_supported: true` is a promise that path cannot keep,
    with the served projection decided at MCP-656; one upstream AS is now presented under two
    issuer identifiers (RFC 9207 §4 forbids the converse, not this; a client consulting both
    documents holds conflicting issuers, and the Cursor proof is the empirical check);
    PRM-following clients hold the upstream's issuer; their registration and token legs no
    longer transit Oak's logs and spans (less code transit through our infrastructure, and
    less observability of those legs).
- The refresh step rewrites `current-source-anchors.json` and
  `current-source-delta-inventory.json` under
  `.agent/reports/mcp-agent-facing-content-audit/`, never by hand. `registry.md`
  and `registry.json` in that directory are the immutable phase-(a) baseline,
  pinned by `BASELINE_REGISTRY_SHA256`
  (`agent-tools/src/mcp-content-current-source/current-source-config.ts`), so
  they keep rendering C706's baseline body; editing them fails the validator
  with "phase-(a) is immutable".
- ADR-053 "Amendment: Proxy OAuth AS Role" item 4: the PRM names the upstream while the
  app-origin AS metadata remains the proxy's.
- `apps/oak-curriculum-mcp-streamable-http/docs/manual-uat-guide.md` row 1.2 gains the expected
  `authorization_servers` value (the upstream issuer — an addition, the row states no origin
  today); new row 1.5 "RFC 9207 issuer alignment" (owner-held: Claude Code, then Cursor).

Reviews before push (rules `invoke-code-experts`, `invoke-mcp-expert`; security surface):
`code-expert` (gateway), `mcp-expert` (MCP authorization spec, RFC 9207/8414/9728) and
`security-expert` (mix-up exposure on both discovery paths; DCR at the upstream without the
MCP-188 refusal) on the final diff, verdicts posted on the pull request before merge.

## Rollback and upgrade-in-place

- Rollback is one revert of the merge commit: the PRM names the app origin again, production
  returns to the pre-fix state (validating clients refused as today; the proxy path as today).
- No server-side migration exists or is needed. A client holding a cached app-origin
  registration or AS metadata keeps using the retained proxy path — working as today for
  non-validating clients, failing as today for validating ones — until it re-reads the PRM.
  RFC 9207 §2.4 obliges clients to retain per-AS state, so a validating client that cached
  the app origin may keep failing after the release until the server is removed and re-added;
  that instruction goes on the pull request and the ticket at merge, and the owner-held proofs
  run with cleared client state so a cached path can never be mistaken for the exercised one.

## Sequence

1. Implement test-first; package gates (`type-check`, ESLint, Prettier, markdownlint, the
   changed Vitest files); the registry ceremony until the validator is green.
2. One commit by explicit pathspec; message pre-checked with
   `pnpm agent-tools:check-commit-message -F <file>` (never start a body line with a
   `word:` shape — commitlint reads it as a footer); footer `Fixes MCP-655.`
3. Reviews; cure any P1 in one batched commit.
4. Push as the bot: `pnpm agent-tools merge-bot push --branch fix/mcp-oauth-metadata-iss-claim`
   (hooks run; no hook skipping).
5. The draft pull request already exists — #946, opened under the bot at handover with the
   plan node, title
   `MCP-655: fix(mcp-http): name the upstream authorization server in the PRM so RFC 9207 clients can sign in`,
   label `jimbot`, assignee `mantagen` (owner word 2026-09-01). Its body describes the issue
   plainly (what is wrong, why, the fix, what is not changing, how it is proven) and carries
   `Fixes MCP-655`, the review focus (both discovery paths, the retained proxy, the MCP-188
   consequence), the validation evidence and the PDR-140 intake contract; edits go through a
   `pull-request-work` token passed via `GH_TOKEN` (never the prefix-substitution form —
   `docs/engineering/merge-bot.md`). When the implementation lands: mark ready, request Copilot
   via the GitHub MCP, watch with
   `pnpm agent-tools:pr-watch 946 --repo oaknational/oak-open-curriculum-ecosystem --watch`.
6. Live proof on the preview: `curl <preview>/.well-known/oauth-protected-resource/mcp` names
   the upstream issuer — compared byte-for-byte with the `received` string in the ticket's
   recorded Claude Code error, since neither RFC 9207 §2.4 nor the 2026-07-28 MCP revision permits
   normalisation — and `curl <preview>/.well-known/oauth-authorization-server` still names the
   app origin as `issuer` with the proxy endpoints (unchanged by this fix); then the owner-held
   sign-ins, each with the server removed and re-added first and the client version recorded:
   Claude Code (no `MCP_SDK_GENERATION` override) against unchanged production — must still
   fail with the issuer-mismatch error — then against the preview; Cursor against production
   (pre-fix baseline) and then the preview.
7. Merge under the standing doctrine (required checks green, threads resolved, the Copilot
   round settled by triage, the owner's code-owner approval), via
   `pnpm agent-tools merge-bot merge --pr <n> --expect copilot-pull-request-reviewer`. The
   release cut on merge restores production sign-in; rollback is one revert of the merge
   commit (§Rollback and upgrade-in-place), and the remove-and-re-add note for clients holding
   cached discovery state goes on the pull request and the ticket. Post-merge harvest; MCP-655 → Done; this
   node → `archive/`, `status: archived`.
8. Then the paused innovation-kit landing pull request resumes: merge `main` in, run the UAT
   runbook's smoke subset and Section 0 inventory reconciliation against its preview through an
   authenticated Claude Code session, post the run record, then its own merge.

## Todos

1. Route change + tests + registry re-attestation + ADR and runbook amendments — one
   single-story pull request, default round budget (PDR-132: ≤2 review rounds).
2. Preview proof (owner-held), merge, release, production sign-in confirmed.

## Out of scope

- Retiring the proxy authorization-server path — its removal precondition (the
  origin-discovery client fixing its metadata persistence) is unmet.
- Making the proxy a redirect target that re-issues authorization responses — a broker with
  new state and redirect surface, not needed once clients hold the real issuer.
- Any change to the upstream identity provider's configuration.
- The paused innovation-kit landing pull request's own diff; it resumes after this lands.
- The passthrough generator — the metadata fetch returns raw JSON and the schema only narrows
  the type, so any undeclared upstream field is served under our issuer; strict parse versus
  passthrough is an ADR-115 decision on its own ticket (MCP-656).
- The RFC 9207 claim on the proxy-path metadata (omit or `false`): no client behaviour turns
  on it, and MCP-656 decides the served projection for that path.
- The 401 `WWW-Authenticate` challenge's missing `scope` parameter (a spec SHOULD) and the e2e
  suite's classification — both pre-existing and unrelated to this story.
