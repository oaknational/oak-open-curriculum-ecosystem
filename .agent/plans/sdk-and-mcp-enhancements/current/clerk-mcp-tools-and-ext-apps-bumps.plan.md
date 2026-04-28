---
name: "Clerk + MCP Apps Dependency Bumps (Apr 2026)"
overview: "Land four available updates in apps/oak-curriculum-mcp-streamable-http with the minimum risk per change, and capture the AppOptions.strict and MCP SDK 2.0 directions as tracked future-planning candidates."
todos:
  - id: phase-0-preflight
    content: "Phase 0: Pre-flight invariant verification — confirm none of the breaking-change surfaces apply to this codebase."
    status: pending
  - id: phase-1-in-range-trio
    content: "Phase 1: In-range trio bump (@clerk/express 2.1.5→2.1.7, @clerk/backend 3.2.13→3.3.0, @modelcontextprotocol/ext-apps 1.6.0→1.7.0). One commit, low risk."
    status: pending
  - id: phase-2-mcp-tools-bump
    content: "Phase 2: Deliberate @clerk/mcp-tools 0.3.1→0.5.0 bump (manifest spec change ~0.3.1 → ^0.5.0). Run version-bump-reminder conformance test."
    status: pending
  - id: phase-3-forward-notes
    content: "Phase 3: Capture forward-planning candidates — AppOptions.strict adoption, ext-apps 1.7.0 new capabilities, MCP SDK 2.0 evaluation. Notes only, no code change."
    status: pending
  - id: phase-4-consolidation
    content: "Phase 4: Run /jc-consolidate-docs and update collection README index."
    status: pending
isProject: false
---

# Clerk + MCP Apps Dependency Bumps (Apr 2026)

**Last Updated**: 2026-04-23
**Status**: QUEUED
**Scope**: Land the four available Clerk + MCP-related dependency updates in
`apps/oak-curriculum-mcp-streamable-http`, in the safest commit order, and
record three forward-planning candidates surfaced by the changelog analysis.

---

## Context

`pnpm -r outdated` (run 2026-04-23) reports four updates relevant to the
Clerk and Model Context Protocol surface, all scoped to a single workspace:

| Package | Current | Latest | Range | Risk |
|---|---|---|---|---|
| `@clerk/express` | 2.1.5 | 2.1.7 | `^2.1.5` (in-range) | patch dep cascade |
| `@clerk/backend` | 3.2.13 | 3.3.0 | `^3.2.13` (in-range) | minor, no impact on us |
| `@modelcontextprotocol/ext-apps` | 1.6.0 | 1.7.0 | `^1.6.0` (in-range) | minor, opportunity-bearing |
| `@clerk/mcp-tools` | 0.3.1 | 0.5.0 | `~0.3.1` (out of range) | manifest edit + reviewer dispatch |

`@modelcontextprotocol/sdk` is at `1.29.0` and registry latest is `1.29.0` —
already aligned; no upgrade in this plan.

### Changelog Findings (Authoritative for This Plan)

Sources verified:

- `@clerk/express` and `@clerk/backend`:
  `https://raw.githubusercontent.com/clerk/javascript/main/packages/<pkg>/CHANGELOG.md`
- `@clerk/mcp-tools`: `https://github.com/clerk/mcp-tools/releases`
- `@modelcontextprotocol/ext-apps`:
  `https://github.com/modelcontextprotocol/ext-apps/releases`
- `@modelcontextprotocol/sdk`:
  `https://github.com/modelcontextprotocol/typescript-sdk/releases`

#### `@clerk/express` 2.1.5 → 2.1.7

- `2.1.6` and `2.1.7`: dep-cascade patch only (`@clerk/shared` 4.8.3,
  `@clerk/backend` 3.2.14 → 3.3.0). No Express-layer code change.
- `2.1.0` (already shipped, present in our version) deprecated
  `requireAuth()`. Codebase grep confirms we never imported it; we use
  `clerkMiddleware` + `getAuth` (the recommended path) at
  `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts:2` and
  `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-clerk.ts:13`.

#### `@clerk/backend` 3.2.13 → 3.3.0

- `3.2.14`: clock-skew of `0` no longer falls back to default. Grep
  confirms no `clockSkewInMs` usage in this codebase; **no impact**.
- `3.3.0`: adds `createBootstrapSignedOutState` for Next.js keyless
  bootstrap. Not relevant to our Express MCP server.

#### `@clerk/mcp-tools` 0.3.1 → 0.5.0 — two minors, manifest pinned `~0.3.1`

- `0.4.0` (BREAKING): `protectedResourceHandlerClerk` from `/express` must
  now be **called** as a function (`protectedResourceHandlerClerk()`) and
  accepts a `{ scopes_supported }` options bag. Codebase grep confirms we
  do **not** import this; we only use `generateClerkProtectedResourceMetadata`
  (`oauth-proxy/oauth-proxy-upstream.ts:11`) and `verifyClerkToken`
  (`auth/mcp-auth/mcp-auth-clerk.ts:14`), both from the `/server` subpath.
  The 0.4.0 break does not affect us.
- `0.5.0`: bumps internal `@modelcontextprotocol/sdk` to 1.29.0 (we are
  already on 1.29.0) and aligns its `@clerk/*` peers to Core 3 (we are
  already on Core 3 with `@clerk/express` 2.x and `@clerk/backend` 3.x).
  Also "explicit bundling policy keeping framework deps external".
- A targeted conformance test exists at
  `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/verify-clerk-token.unit.test.ts`
  with a comment authored by a prior reviewer:
  > Version bump reminder: When upgrading `@clerk/mcp-tools`, re-run these.
  This is the canary test for this phase.

#### `@modelcontextprotocol/ext-apps` 1.6.0 → 1.7.0 — opportunity-bearing minor

Capability additions (not used yet, captured as Phase 3 candidates):

- `App.registerTool()` and `sendToolListChanged()` — Views can expose
  tools the Host can call (WebMCP-style, bidirectional).
- `App.createSamplingMessage()` — sampling support via stock SDK types.
- **`AppOptions.strict`** — opt-in handshake-ordering guards. When `true`,
  `App` host-bound methods throw if called before `connect()` completes;
  one-shot event handlers (`ontoolinput`, `ontoolresult`) throw if first
  registered after `connect()`; `AppBridge` warns when it receives
  requests before `ui/notifications/initialized`. When `false` (default),
  the same conditions emit `console.warn` instead.
- `AppOptions.allowUnsafeEval` defaults to `false` — `App` constructor
  now sets `z.config({ jitless: true })` so Views run under strict CSP
  without `'unsafe-eval'`. **This is a CSP-strict-by-default security
  improvement we get for free** on adoption.
- `useApp({ autoResize, strict })` propagation in React.

Fixes worth noting:

- React StrictMode `useApp` cleanup now closes the `App`, eliminating a
  zombie `PostMessageTransport` listener under dev double-invoke.
- `csp` and `permissions` typed `?: never` on `McpUiToolMeta` so misplaced
  declarations fail at compile time.

#### `@modelcontextprotocol/sdk` — current = latest, but direction matters

**Current 1.x state**: `1.29.0` is the latest stable. We are aligned.
Recent backports already in our version: `discoverOAuthServerInfo()` and
discovery caching (1.27), `scopes_supported` from PRM by default (1.28),
RFC 8252 loopback port relaxation (1.28), capability extensions
advertisement on the capability object (1.29) — the foundation for hosts
to negotiate `ext-apps` support.

**`2.0.0-alpha` direction** (parallel to `latest`; not coming soon, but
material for a future planning conversation):

- **Standard Schema** for tool/prompt schemas (Zod v4, Valibot, ArkType).
  `RegisteredTool.inputSchema` becomes `StandardSchemaWithJSON`.
  Aligns with our schema-first cardinal rule — generated SDK schemas
  could be expressed as Standard Schema and consumed directly.
- Unknown tool/resource calls now reject with JSON-RPC `-32602` /
  `-32002` instead of returning `CallToolResult{isError:true}`. Code
  branching on `result.isError` for unknown-tool would need to catch
  rejections.
- Deprecated `.tool` / `.resource` / `.prompt` method signatures
  **removed**. Codebase grep confirms we already use the modern
  `registerTool` API (matches in
  `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` and
  `…/app/core-endpoints.ts`); zero migration cost when 2.0 lands.
- `TaskManager` extracted: `taskStore`, `taskMessageQueue`,
  `defaultTaskPollInterval`, and `maxTaskQueueSize` move from
  `ProtocolOptions` to `capabilities.tasks` on `ServerOptions`. Not
  used by us today.
- First-party Express, Hono, Fastify adapters. We currently use Express
  via custom code; could simplify our transport wiring later.
- `zod` dropped from `peerDependencies` (kept as direct dependency).
  Eliminates a peer-version coordination headache.

---

## Foundation Document Commitment

Before each phase:

1. Re-read `.agent/directives/principles.md` (cardinal rule, type
   shortcuts, quality gates).
2. Re-read `.agent/directives/testing-strategy.md` (TDD at all levels;
   the version-bump-reminder conformance test in Phase 2 is a
   pre-existing example of this discipline).
3. Re-read `.agent/directives/schema-first-execution.md` (note the MCP
   SDK 2.0 Standard Schema direction explicitly aligns with this
   directive — surfaced for future planning, not for execution here).
4. Ask: **could it be simpler without compromising quality?**

This plan answers that as YES — split a four-package update into an
in-range trio (lowest possible blast radius) and a single deliberate
out-of-range bump (manifest edit + reviewer + canary test). No widget
code is touched in this plan.

---

## Build-vs-Buy Attestation

Not applicable. This plan ingests upstream version bumps to packages
already adopted via earlier build-vs-buy decisions:

- `@clerk/mcp-tools` adoption rationale recorded in
  `.agent/plans/archive/completed/mcp-oauth-implementation-plan.archive.md`.
- `@modelcontextprotocol/ext-apps` adoption rationale recorded in
  `.agent/plans/sdk-and-mcp-enhancements/active/mcp-app-extension-migration.plan.md`.

---

## Reviewer Scheduling (phase-aligned)

Per the always-applied `invoke-clerk-reviewer`, `invoke-mcp-reviewer`,
and `invoke-code-reviewers` rules:

- **Pre-execution (Phase 0)**: none — invariant grep is the gate.
- **Post-Phase 1**: `clerk-reviewer` (validates `@clerk/backend` 3.3 +
  `@clerk/express` 2.1.7 alignment in our middleware), `mcp-reviewer`
  (reviews ext-apps 1.7.0 surface — particularly `csp`/`permissions`
  type tightening and the new `allowUnsafeEval=false` default).
- **Post-Phase 2**: `clerk-reviewer` (mandatory — Clerk middleware/PRM
  surface bumped two minors), `mcp-reviewer` (server still consumes
  `verifyClerkToken` and `generateClerkProtectedResourceMetadata` which
  sit on the MCP-auth boundary).
- **Post-Phase 3**: `assumptions-reviewer` on the captured forward-
  planning candidates (validates promotion triggers are falsifiable and
  blocking relationships are legitimate).

---

## Non-Goals (YAGNI)

- Adopting `App.registerTool()` or `App.createSamplingMessage()` in our
  widget — captured as a forward-planning candidate, not executed here.
- Adopting `AppOptions.strict: true` on the widget — captured as a
  forward-planning candidate, not executed here.
- Migrating to MCP SDK 2.0 — alpha; not on `latest`; deferred.
- Touching any other workspace's dependencies — out of scope.
- Changing our PRM, OAuth proxy, or token verification logic beyond what
  the bumps demand. The version-bump-reminder canary test is the only
  authorisation surface for behaviour-change discovery.

---

## Resolution Plan

### Phase 0: Pre-flight Invariant Verification (~5 min)

**Foundation Check-In**: Re-read `principles.md` § "Detect problems
early, fail immediately." This phase is a deterministic gate that fails
the plan early if any of the breaking-change surfaces apply.

#### Task 0.1: Confirm No Breaking-Change Surfaces Apply

**Acceptance Criteria**:

1. ✅ No usage of `requireAuth(` anywhere in the workspace (`@clerk/express`
   2.1.0 deprecation does not affect us).
2. ✅ No usage of `clockSkewInMs` anywhere in the workspace
   (`@clerk/backend` 3.2.14 default-fallback change does not affect us).
3. ✅ No import of `protectedResourceHandlerClerk` from
   `@clerk/mcp-tools/express` (`@clerk/mcp-tools` 0.4.0 must-be-called
   change does not affect us).
4. ✅ No use of deprecated `.tool(`, `.prompt(`, or `.resource(` MCP
   server method signatures (MCP SDK 2.0 removal would not affect us).

**Deterministic Validation**:

```bash
cd apps/oak-curriculum-mcp-streamable-http

# Each grep must return zero matches.
rg -n 'requireAuth\(' src e2e-tests
# Expected: no output, exit 1

rg -n 'clockSkewInMs' src e2e-tests
# Expected: no output, exit 1

rg -n 'protectedResourceHandlerClerk' src e2e-tests
# Expected: no output, exit 1

rg -n '\bserver\.(tool|prompt|resource)\(' src
# Expected: no output, exit 1
```

**If any grep returns matches**: STOP. Re-scope this plan to handle the
breaking-change surface before proceeding.

**Task Complete When**: All four greps return exit 1 (no matches).

---

### Phase 1: In-Range Trio Bump (~15 min including reviews)

**Foundation Check-In**: Re-read `principles.md` § "Quality Gates" and
§ "No Compatibility Layers". Three in-range patch/minor bumps; manifest
spec strings unchanged; no source edits expected.

#### Task 1.1: Update the Three In-Range Packages

**Changes**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http update \
  @clerk/express @clerk/backend @modelcontextprotocol/ext-apps
```

**Acceptance Criteria**:

1. ✅ `pnpm-lock.yaml` shows `@clerk/express@2.1.7`,
   `@clerk/backend@3.3.0`, `@modelcontextprotocol/ext-apps@1.7.0`.
2. ✅ `apps/oak-curriculum-mcp-streamable-http/package.json` spec
   strings unchanged (still `^2.1.5`, `^3.2.13`, `^1.6.0` — caret
   ranges absorb the new versions).
3. ✅ No source edits required.

**Deterministic Validation**:

```bash
# 1. Lockfile shows new versions
rg -n '@clerk/express@2\.1\.7|@clerk/backend@3\.3\.0|@modelcontextprotocol/ext-apps@1\.7\.0' pnpm-lock.yaml
# Expected: three matches

# 2. Repo-wide quality gates
pnpm build       # Expected: exit 0
pnpm type-check  # Expected: exit 0
pnpm lint        # Expected: exit 0
pnpm test        # Expected: exit 0
pnpm test:widget # Expected: exit 0
pnpm test:e2e    # Expected: exit 0
pnpm test:widget:ui    # Expected: exit 0
pnpm test:widget:a11y  # Expected: exit 0
```

**Reviewer Dispatch**: `clerk-reviewer` and `mcp-reviewer` (parallel,
read-only).

**Commit**:
`build(deps): update @clerk/express, @clerk/backend, @modelcontextprotocol/ext-apps`.

**Task Complete When**: lockfile assertion passes, all quality gates
exit 0, both reviewers return clean (or findings dispositioned).

---

### Phase 2: Deliberate `@clerk/mcp-tools` 0.3.1 → 0.5.0 (~25 min including reviews)

**Foundation Check-In**: Re-read `testing-strategy.md` § "Behaviour-
focused tests". The version-bump-reminder conformance test is the
canonical example: it pins behaviour at the auth boundary, runs in <1s,
and is authored to fire on exactly this kind of upgrade.

#### Task 2.1: Edit Manifest Spec

**Current Implementation**
(`apps/oak-curriculum-mcp-streamable-http/package.json:47`):

```json
"@clerk/mcp-tools": "~0.3.1",
```

**Target Implementation**:

```json
"@clerk/mcp-tools": "^0.5.0",
```

**Rationale for caret**: matches the surrounding Clerk dependency
specifiers (`@clerk/backend` and `@clerk/express` both use caret) so
future patch and minor releases flow in via `pnpm update` without a
manifest edit. The package is at `0.x` so caret allows minor + patch
within the `0.5.x` line only — Clerk's release cadence shows a clear
breaking-change discipline at the `0.minor` boundary, so caret here is
deliberate, not lax.

**Acceptance Criteria**:

1. ✅ `package.json` line 47 reads `"@clerk/mcp-tools": "^0.5.0"`.
2. ✅ `pnpm install` resolves cleanly with `@clerk/mcp-tools@0.5.0`.

**Deterministic Validation**:

```bash
rg -n '"@clerk/mcp-tools":' apps/oak-curriculum-mcp-streamable-http/package.json
# Expected: ^0.5.0

pnpm install
# Expected: exit 0

rg -n '@clerk/mcp-tools@0\.5\.0' pnpm-lock.yaml
# Expected: at least one match
```

#### Task 2.2: Run the Version-Bump-Reminder Canary Test First

**Acceptance Criteria**:

1. ✅ Targeted conformance test passes against `@clerk/mcp-tools@0.5.0`.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test \
  src/auth/mcp-auth/verify-clerk-token.unit.test.ts
# Expected: exit 0, all assertions pass
```

**If the canary fails**: STOP. The test is documenting the previously
observed behaviour ("0.3.1 `verifyClerkToken` never sets `resource`"
per the comment at
`apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/auth-info-schema.ts:34`).
A failure means 0.5.0 changed that behaviour and we need to update the
schema and the comment in lockstep, then re-run.

#### Task 2.3: Update the Version-Pinned Comment

**Current Comment**
(`apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/auth-info-schema.ts:34`):

> `@clerk/mcp-tools@0.3.1` `verifyClerkToken` never sets `resource`

**Target Comment**: update version pin to `0.5.0` if the canary in
Task 2.2 confirms the behaviour is unchanged. If behaviour changed,
rewrite the comment to reflect the new behaviour and update the
schema accordingly (handled in Task 2.2's failure branch).

**Acceptance Criteria**:

1. ✅ Comment cites `@clerk/mcp-tools@0.5.0` and accurately describes
   the observed behaviour against that version.

**Deterministic Validation**:

```bash
rg -n '@clerk/mcp-tools@0\.[0-9]+\.[0-9]+' \
  apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/auth-info-schema.ts
# Expected: 0.5.0
```

#### Task 2.4: Full Quality Gates

**Deterministic Validation**:

```bash
pnpm build       # Expected: exit 0
pnpm type-check  # Expected: exit 0
pnpm lint        # Expected: exit 0
pnpm test        # Expected: exit 0
pnpm test:e2e    # Expected: exit 0
```

**Reviewer Dispatch**: `clerk-reviewer` (mandatory — Clerk
middleware/PRM surface; specifically asked to validate that the Core 3
re-pinning in 0.5.0 is consistent with our `@clerk/express` 2.1.7 +
`@clerk/backend` 3.3.0 from Phase 1) and `mcp-reviewer` (validates the
auth boundary still satisfies the `Authorization` and `WWW-Authenticate`
discipline of the MCP spec).

**Commit**:
`build(deps): bump @clerk/mcp-tools 0.3.1 → 0.5.0 (Core 3 + sdk 1.29 aligned)`.

**Task Complete When**: all quality gates exit 0, both reviewers return
clean (or findings dispositioned).

---

### Phase 3: Capture Forward-Planning Candidates (~10 min)

**Foundation Check-In**: Re-read `schema-first-execution.md` —
specifically note the MCP SDK 2.0 Standard Schema direction is *aligned*
with the directive (Standard Schema accepts Zod v4 as a Standard Schema
provider, so generated SDK schemas remain the source of truth). Capture
this alignment so a future planner does not re-litigate the question.

#### Task 3.1: Capture AppOptions.strict Adoption Candidate

**Why This Is Worth Tracking**: `AppOptions.strict` turns the new
ext-apps 1.7.0 handshake-ordering guards from `console.warn` into
hard throws. The class of bugs it catches — host-bound methods called
before `connect()`, one-shot handlers registered after `connect()`,
`AppBridge` receiving requests before `ui/notifications/initialized` —
are exactly the kind of dev-time-asymmetric failures that disappear in
production and waste session time when they reappear. Adopting `strict`
in the widget development build (and possibly all builds) trades a
small amount of fragility-on-purpose for a faster feedback loop.

**Promotion Trigger** (the falsifiable condition that moves this from
notes-only into an executable plan): the next time the widget surface
sees a non-trivial change (`ext-apps` consumer code edits in
`apps/oak-curriculum-mcp-streamable-http/widgets/`), or the next time a
widget handshake-ordering bug is observed in development.

**Capture Surface**: append a tracked-decision note to the existing
active plan
[`active/mcp-app-extension-migration.plan.md`](../active/mcp-app-extension-migration.plan.md)
under a new "Forward Candidates" subsection (or wherever the plan owner
prefers — surface to the owner before writing).

**Acceptance Criteria**:

1. ✅ One paragraph captured naming `AppOptions.strict`, the bug class
   it catches, the promotion trigger, and a link back to ext-apps
   release notes for 1.7.0.

#### Task 3.2: Capture ext-apps 1.7.0 Capability Candidate

**Capabilities to track**:

- `App.registerTool()` and `sendToolListChanged()` — Views can expose
  Host-callable tools (WebMCP-style bidirectional registration). Could
  let a widget surface curriculum-tool subactions without server
  round-trips.
- `App.createSamplingMessage()` — sampling support via stock SDK types.
- `allowUnsafeEval: false` default — verify our widget builds under
  strict CSP without `'unsafe-eval'` (this should already be the case,
  but the bump makes it the framework default and worth verifying).

**Promotion Trigger**: same as 3.1 — next non-trivial widget change.

**Capture Surface**: same surface as 3.1.

**Acceptance Criteria**:

1. ✅ Three bulleted entries captured with short descriptions and the
   shared promotion trigger.

#### Task 3.3: Capture MCP SDK 2.0 Evaluation Candidate

**What to track**:

- Standard Schema adoption (`StandardSchemaWithJSON`) — directly
  relevant to schema-first cardinal rule; assess whether our generated
  Zod schemas can flow through unchanged (likely yes, since Zod v4
  implements Standard Schema natively).
- Unknown-tool-call rejection contract change (audit `result.isError`
  call sites for any code that branches on unknown-tool-specifically;
  the codebase grep should catch this when we promote).
- First-party Express adapter — possible simplification of our
  transport wiring.
- `zod` dropped from peer deps — coordination simplification.

**Promotion Trigger**: when MCP SDK 2.0 leaves `alpha` for `beta` (per
the GitHub release stream, currently `2.0.0-alpha.2` as of 2026-04-01).
Track via the existing reviewer-grounding loop; no additional
monitoring needed.

**Capture Surface**: add as a new entry in
[`future/mcp-protocol-adoption-roadmap.plan.md`](../future/mcp-protocol-adoption-roadmap.plan.md)
under a new "MCP SDK 2.0 Migration Evaluation" subsection.

**Acceptance Criteria**:

1. ✅ Subsection added with the four evaluation axes, the promotion
   trigger (alpha → beta), and a link to the MCP SDK 2.0 changelog
   findings in this plan's Context section.

**Reviewer Dispatch**: `assumptions-reviewer` against the three captured
candidates' promotion triggers — checks that each trigger is falsifiable
and the blocking relationships (or absence thereof) are honest.

**Task Complete When**: three captures landed, `assumptions-reviewer`
returns clean.

---

### Phase 4: Consolidation (~5 min)

#### Task 4.1: Update Collection README Index

Add this plan to
[`current/README.md`](../current/README.md) and the parent
[`README.md`](../README.md) using the existing table format.

**Acceptance Criteria**:

1. ✅ Both READMEs reference this plan with a one-line scope summary.

#### Task 4.2: Run Consolidation Workflow

```bash
# Per the plan template requirement
/jc-consolidate-docs
```

**Acceptance Criteria**:

1. ✅ Consolidation walk returns clean for the scope of this plan
   (the in-scope diffs are package.json, pnpm-lock.yaml, the
   auth-info-schema.ts comment, the README index updates, and the
   forward-candidate captures).

**Task Complete When**: both READMEs updated, consolidation walk clean.

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| `@clerk/backend` 3.3.0 introduces a behaviour change in the auth path despite changelog reading | Low | Medium | Phase 1 quality gates include `pnpm test:e2e` which exercises the full Clerk-protected MCP boundary. `clerk-reviewer` post-Phase-1 catches anything the test did not. |
| `@clerk/mcp-tools` 0.5.0 changes `verifyClerkToken` `resource`-set behaviour | Low | Medium | Phase 2 Task 2.2 runs the version-bump-reminder canary test against the new version *before* full gates. Failure stops the plan and we update the schema in lockstep (Task 2.3 fallback branch). |
| `@modelcontextprotocol/ext-apps` 1.7.0 type-tightening on `csp`/`permissions` (`?: never`) breaks our widget metadata declarations | Low | Low | Phase 1 `pnpm type-check` catches this immediately. If it fires, the fix is removing the misplaced declaration (the type tightening exists *because* the misplacement was a bug). |
| Caret on `^0.5.0` for `@clerk/mcp-tools` allows future minor that breaks us | Low | Low | Caret on `0.x` allows only `0.5.x`. The next minor (`0.6.0`) would require an explicit manifest edit, re-grounding the canary test. The `pnpm outdated` audit cadence catches it. |
| Phase 3 forward-candidate capture drifts into actually doing the work | Medium | Low | Non-Goals section is explicit. Phase 3 Acceptance Criteria gate on capture surface (one paragraph / three bullets / one subsection), not on implementation. |

---

## Success Criteria

### Phase 0 (Pre-flight)

- ✅ All four invariant greps return exit 1 (no matches).

### Phase 1 (In-range trio)

- ✅ Three packages updated; lockfile shows new versions; manifest
  unchanged.
- ✅ All quality gates exit 0.
- ✅ `clerk-reviewer` and `mcp-reviewer` clean or dispositioned.
- ✅ One commit landed.

### Phase 2 (Deliberate `@clerk/mcp-tools` bump)

- ✅ Manifest spec changed `~0.3.1` → `^0.5.0`; lockfile shows 0.5.0.
- ✅ Version-bump-reminder canary test passes (or behaviour change
  documented and schema updated in lockstep).
- ✅ Pinned comment updated to cite `@clerk/mcp-tools@0.5.0`.
- ✅ All quality gates exit 0.
- ✅ `clerk-reviewer` and `mcp-reviewer` clean or dispositioned.
- ✅ One commit landed.

### Phase 3 (Forward candidates)

- ✅ `AppOptions.strict` candidate captured with promotion trigger.
- ✅ ext-apps 1.7.0 capability candidates captured.
- ✅ MCP SDK 2.0 evaluation candidate captured in
  `future/mcp-protocol-adoption-roadmap.plan.md`.
- ✅ `assumptions-reviewer` returns clean on promotion triggers.

### Phase 4 (Consolidation)

- ✅ Collection READMEs updated.
- ✅ `/jc-consolidate-docs` walk clean for plan scope.

### Overall

- ✅ Four packages updated to latest in two reviewable commits.
- ✅ Auth-boundary behaviour conformance preserved via canary test.
- ✅ Three forward-planning candidates captured for future promotion.
- ✅ No widget code edited; no functional behaviour changed beyond
  what the bumps require.

---

## Dependencies

**Blocking**: None. This plan is self-contained.

**Related Plans**:

- [`active/mcp-app-extension-migration.plan.md`](../active/mcp-app-extension-migration.plan.md)
  — receives Phase 3 forward-candidate captures (3.1 and 3.2).
- [`future/mcp-protocol-adoption-roadmap.plan.md`](../future/mcp-protocol-adoption-roadmap.plan.md)
  — receives Phase 3 candidate 3.3 (MCP SDK 2.0 evaluation).
- [`archive/completed/mcp-oauth-implementation-plan.archive.md`](../../archive/completed/mcp-oauth-implementation-plan.archive.md)
  — original `@clerk/mcp-tools` adoption rationale; provenance only.

**Prerequisites**:

- ✅ Phase 0 invariant greps pass (asserted at execution time, not
  assumed).
- ✅ Working tree clean before starting Phase 1.

---

## Notes

### Why This Matters (System-Level Thinking)

**Immediate Value**:

- **Security drift**: `@clerk/backend` 3.2.13 → 3.3.0 includes path
  traversal protections in `joinPaths` (3.2.13) and JWT-claim-after-
  signature verification (3.2.12). Both are in-range and already
  benefit us today; this bump consolidates the line.
- **CSP-strict by default**: ext-apps 1.7.0's `allowUnsafeEval: false`
  default narrows our widget threat surface for free.
- **Reviewer cadence calibration**: this plan exercises the
  Clerk + MCP reviewer pair on a low-risk change. That's a useful
  warm-up before any larger Clerk- or MCP-touching plan.

**System-Level Impact**:

- **Reviewer-pair maintenance**: cheap dependency-bump plans like this
  one are how the `clerk-reviewer` + `mcp-reviewer` invocation
  discipline stays calibrated. Skipping reviewer dispatch on "small"
  changes is how reviewer skill atrophies.
- **Forward-candidate hygiene**: capturing `AppOptions.strict`, ext-
  apps 1.7.0 capabilities, and MCP SDK 2.0 direction *now*, while the
  changelog reading is fresh, prevents re-paying that research cost
  later.
- **Auth-boundary canary discipline**: the version-bump-reminder
  conformance test is a pre-existing example of testing-strategy.md in
  action. Honouring it here reinforces the pattern for future bumps.

**Risk of Not Doing**:

- **Compounding upgrade debt**: skipping in-range bumps until they
  become out-of-range is how every upgrade becomes a risky upgrade.
- **Lost opportunity surface**: ext-apps 1.7.0 capabilities decay in
  the agent's working memory if not captured against a falsifiable
  promotion trigger.
- **Stale Core-3 drift**: `@clerk/mcp-tools` 0.3.1 was authored
  against Core 2 internals; staying there indefinitely invites a
  surprise break when a future Clerk patch removes a Core-2
  compatibility shim.

### Alignment with Foundation Documents

**From `principles.md`** (Cardinal Rule):

> ALL static data structures, types, type guards, Zod schemas, … MUST
> flow from the Open Curriculum OpenAPI schema in the SDK, and be
> generated at build/compile time.

This plan does not touch generated artefacts. Phase 3 captures the MCP
SDK 2.0 Standard Schema direction *because* Standard Schema preserves
the cardinal rule (Zod v4 implements Standard Schema natively, so
generated schemas flow through unchanged).

**From `testing-strategy.md`**:

> Test behaviour, not implementation. Pin the boundary, not the
> internals.

The version-bump-reminder canary test in Phase 2 is exactly this: it
pins observable behaviour at the auth boundary (`verifyClerkToken`
output shape) so an upgrade can either confirm or change-and-document
the contract.

**From `schema-first-execution.md`**:

> Generators are the source of truth.

Forward candidate 3.3 (MCP SDK 2.0 evaluation) tracks alignment with
this directive explicitly so a future planner does not re-litigate
the Standard Schema direction.

---

## References

- Codebase usage:
  - `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts:2`
  - `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/mcp-auth-clerk.ts:13-14`
  - `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/auth-info-schema.ts:34`
  - `apps/oak-curriculum-mcp-streamable-http/src/auth/mcp-auth/verify-clerk-token.unit.test.ts`
  - `apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-upstream.ts:11`
  - `apps/oak-curriculum-mcp-streamable-http/package.json` lines 45–50
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/directives/schema-first-execution.md`
- External changelogs (verified 2026-04-23):
  - `https://raw.githubusercontent.com/clerk/javascript/main/packages/express/CHANGELOG.md`
  - `https://raw.githubusercontent.com/clerk/javascript/main/packages/backend/CHANGELOG.md`
  - `https://github.com/clerk/mcp-tools/releases`
  - `https://github.com/modelcontextprotocol/ext-apps/releases`
  - `https://github.com/modelcontextprotocol/typescript-sdk/releases`
- Always-applied invocation rules:
  - `.cursor/rules/invoke-clerk-reviewer.mdc`
  - `.cursor/rules/invoke-mcp-reviewer.mdc`
  - `.cursor/rules/invoke-code-reviewers.mdc`

---

## Consolidation

After all four phases complete and quality gates pass, run
`/jc-consolidate-docs` (Phase 4 Task 4.2 already includes this) to
ensure the forward-candidate captures are properly graduated and the
plan is ready for archive.

---

## Future Enhancements (Out of Scope)

- **AppOptions.strict adoption** — promoted from Phase 3 capture when
  the next non-trivial widget change lands.
- **ext-apps 1.7.0 capability adoption** (`App.registerTool`,
  `App.createSamplingMessage`) — promoted from Phase 3 capture when a
  use case justifies bidirectional widget tool registration or
  in-widget LLM sampling.
- **MCP SDK 2.0 migration** — promoted from Phase 3 capture when the
  SDK leaves `alpha` for `beta`.
- **`@clerk/mcp-tools` post-0.5.0 minors** — caret in this plan absorbs
  patches; next minor (0.6.0) would re-trigger a deliberate-bump
  micro-plan with the canary test as the gate.
