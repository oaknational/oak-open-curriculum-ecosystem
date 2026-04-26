---
name: Sentry Immediate Next Steps (L-IMM execution wrapper)
overview: >
  Execution-sequence wrapper around the L-IMM lane in
  `sentry-observability-maximisation-mcp.plan.md`. The lane bodies
  define WHAT each item does; this plan defines the ORDER and the
  parallel-execution context (runs alongside
  `pr-87-quality-finding-resolution.plan.md`). Closes the
  high-impact-or-low-effort Sentry items identified by the
  2026-04-26 doc-driven gap analysis. Each sub-item commits
  independently as it lands.
todos:
  - id: tier-1-flush-timeout
    content: "Tier 1 — DEFAULT_SENTRY_FLUSH_TIMEOUT_MS 2_000 → 5_000 in packages/libs/sentry-node/src/runtime-sdk.ts. ~10 min including test + TSDoc. High impact (reduces Lambda drop risk under bursty errors)."
    status: pending
  - id: tier-3a-max-breadcrumbs-verify
    content: "Tier 3a — verify maxBreadcrumbs (Sentry default 100) is sufficient for long-running MCP sessions; raise + document if cap is hitting. Read existing config + sample captured issues for breadcrumb counts."
    status: pending
  - id: tier-3b-send-client-reports-verify
    content: "Tier 3b — verify sendClientReports is enabled (Sentry default true). 5-minute audit of runtime-sdk.ts + ADR rationale if explicitly false."
    status: pending
  - id: tier-3c-ignore-errors-scaffold
    content: "Tier 3c — wire ignoreErrors / denyUrls allow-list scaffolding into SentryLiveConfig + createSentryInitOptions. Seed empty list (no known noise yet); document the pattern for future additions."
    status: pending
  - id: tier-3d-vercel-marketplace-verify
    content: "Tier 3d — confirm Vercel ↔ Sentry Marketplace integration state (connected vs hand-rolled) and document in observability.md or sentry-node README. Owner-touch: requires Vercel project-settings access."
    status: pending
  - id: tier-2-fingerprinting
    content: "Tier 2 — custom error fingerprinting. Add applyFingerprint(event) step to createSentryHooks that assigns event.fingerprint for known error families (JsonRpcError_*, McpToolError, TestError*). ~1-2 hours including RED unit tests. High impact for issue grouping."
    status: pending
isProject: false
---

# Sentry Immediate Next Steps (L-IMM execution wrapper)

**Status**: 🟡 IMMEDIATE — runs in parallel with
[`pr-87-quality-finding-resolution.plan.md`](pr-87-quality-finding-resolution.plan.md).

**Authored**: 2026-04-26 by `Sharded Stroustrup` after the
post-Sentry-validation owner check confirmed the Sentry work is "good
enough for now" once these immediate items land.

---

## Why this plan exists, not just an L-IMM checklist

The lane bodies live in
[`sentry-observability-maximisation-mcp.plan.md`](../active/sentry-observability-maximisation-mcp.plan.md)
§ L-IMM. That plan is 3499 lines (post-2026-04-26 augmentation) and
its primary purpose is the umbrella maximisation strategy. **Pulling
the L-IMM execution sequence into its own focused plan**:

- gives a one-page surface for an agent to execute against, instead of
  navigating a 3499-line umbrella;
- makes the **parallel-execution relationship** with
  `pr-87-quality-finding-resolution.plan.md` visible (both can run
  concurrently on the same branch with the right claim discipline);
- lets the maximisation plan stay focused on its substantive lanes
  (L-1, L-3, L-4b, etc.) without the immediate-hardening detail
  bloating its narrative;
- closes a fitness-pressure feedback loop the maximisation plan was
  starting to hit.

This is **not** a duplicate of the lane bodies. The lane bodies are
the source of truth for WHAT each sub-item does. This plan is the
source of truth for the execution ORDER and parallel context.

---

## Execution sequence (commit per sub-item)

### Tier 1 — high-impact AND low-effort (do first)

**Sub-item: flush/shutdownTimeout review** —
[full lane body](../active/sentry-observability-maximisation-mcp.plan.md#sub-item-3--flush--shutdown-timeout-review).

- **Files**: `packages/libs/sentry-node/src/runtime-sdk.ts`
- **Change**: `DEFAULT_SENTRY_FLUSH_TIMEOUT_MS` from `2_000` to
  `5_000`; TSDoc note on the Lambda freeze-and-resume trade-off.
- **Tests**: existing flush-timing tests in
  `packages/libs/sentry-node/src/runtime-sinks.unit.test.ts` cover
  the contract; verify they still pass.
- **Effort estimate**: ~10 min
- **Commit message**: `feat(sentry-node): raise flush timeout to 5s
  to reduce Lambda burst-error drop risk`
- **Acceptance**: constant updated; existing tests pass; TSDoc
  documents the trade-off; commit pushed.

### Tier 3 — low-effort verifications and config scaffolding

These are independently committable in any order. Recommend
bundling 3a + 3b into one commit (both are read-and-document
verifications) and 3c into its own commit (introduces an env-
schema field).

**Sub-item: maxBreadcrumbs verify** — see
[full lane body](../active/sentry-observability-maximisation-mcp.plan.md#sub-item-4--maxbreadcrumbs-tuning-verification).

- Read `packages/libs/sentry-node/src/runtime-sdk.ts` —
  is `maxBreadcrumbs` set explicitly?
- Inspect 3-5 captured production issues — are breadcrumb arrays
  truncated to 100 entries (the default cap)?
- If hitting cap: raise to 200-500 in `createSentryInitOptions`
  with a TSDoc note. If not hitting: document the no-action
  decision in sentry-node README.
- **Effort estimate**: ~10 min

**Sub-item: sendClientReports verify** — see
[full lane body](../active/sentry-observability-maximisation-mcp.plan.md#sub-item-5--sendclientreports-verification).

- Read `runtime-sdk.ts` — is `sendClientReports` set explicitly?
- Sentry default is `true`. If we explicitly set `false`, that
  needs an ADR rationale.
- **Effort estimate**: ~5 min

**Bundle commit 1 (3a + 3b)**: `docs(sentry-node): document
maxBreadcrumbs + sendClientReports state per L-IMM verification`

**Sub-item: ignoreErrors / denyUrls scaffolding** — see
[full lane body](../active/sentry-observability-maximisation-mcp.plan.md#sub-item-2--ignoreerrors--denyurls-allow-list).

- Add `ignoreErrors?: readonly (string | RegExp)[]` and
  `denyUrls?: readonly (string | RegExp)[]` to `SentryLiveConfig`.
- Pass through in `createSentryInitOptions`.
- Seed list is empty in alpha (no known noise yet).
- Document the addition pattern in sentry-node README.
- RED unit test asserts the option flows through to NodeOptions.
- **Effort estimate**: ~30 min
- **Commit message**: `feat(sentry-node): scaffold ignoreErrors /
  denyUrls SDK-side allow-lists (empty in alpha)`

**Sub-item: Vercel ↔ Sentry Marketplace verify** — see
[full lane body](../active/sentry-observability-maximisation-mcp.plan.md#sub-item-6--vercel--sentry-marketplace-integration-verification).

- **Owner-touch**: requires Vercel project-settings access. Agents
  cannot complete this from code alone.
- Output: a paragraph in `apps/oak-curriculum-mcp-streamable-http/docs/observability.md`
  or `packages/libs/sentry-node/README.md` naming the current state
  (Marketplace-connected vs hand-rolled `SENTRY_*` env vars) with
  rationale.
- **Effort estimate**: ~30 min once owner has confirmed Vercel
  state; agent-side is just the documentation write.
- **Commit message**: `docs(observability): document Vercel-Sentry
  Marketplace integration state`
- **If owner is async**: skip this sub-item; mark as PENDING and
  proceed to Tier 2.

### Tier 2 — high-impact, modest effort (do third)

**Sub-item: custom error fingerprinting** — see
[full lane body](../active/sentry-observability-maximisation-mcp.plan.md#sub-item-1--custom-error-fingerprinting-eventfingerprint).

- **Files**:
  - new `packages/libs/sentry-node/src/runtime-fingerprint.ts`
  - new `packages/libs/sentry-node/src/runtime-fingerprint.unit.test.ts`
  - `packages/libs/sentry-node/src/runtime-sdk.ts` (compose into
    `createSentryHooks`)
- **RED first** (per `testing-strategy.md`): write the unit test
  asserting fingerprint values for known error classes BEFORE
  implementation.
- **GREEN**: implement `applyFingerprint(event)` and compose into
  the existing `beforeSend` chain (after redaction).
- **REFACTOR**: TSDoc on the fingerprint table; sentry-node README
  § Fingerprinting.
- **Effort estimate**: ~1-2 hours
- **Commit message**: `feat(sentry-node): custom error
  fingerprinting for known error families (post-redaction)`

---

## Commit cadence

**Each sub-item commits independently**. The L-IMM lane is
deliberately structured as six sub-items that are independently
deployable; this plan preserves that structure at the commit level.

Rationale:

- Easier review (each commit has one substantive change).
- Easier rollback (any single sub-item can be reverted without
  affecting the others).
- **Parallel-execution friendly** — the agent running this plan
  and the agent running `pr-87-quality-finding-resolution.plan.md`
  can interleave commits on the same branch without coordination
  beyond the embryo-log claim discipline.

After each sub-item lands:

1. Run scoped gates (`pnpm --filter '@oaknational/sentry-node' lint
   type-check test`).
2. Commit with the message shape above.
3. Push (full pre-push gate runs).
4. Update this plan's todos to `completed` status.
5. Move to next sub-item.

If a gate fails on push (e.g. parallel-track gate-coupling per the
ongoing parallel-track lesson): surface, don't bypass. The other
parallel agent's work may be the cause; coordinate via the embryo
log.

---

## Parallel-execution context

This plan and
[`pr-87-quality-finding-resolution.plan.md`](pr-87-quality-finding-resolution.plan.md)
run **in parallel on the same branch** (`feat/otel_sentry_enhancements`).

**Why parallel works here**:

- Sentry next-steps changes touch
  `packages/libs/sentry-node/src/**` plus small SDK config
  documentation. The PR-87 quality plan touches
  `packages/core/build-metadata/`, `apps/oak-curriculum-mcp-streamable-http/src/`
  (auth-routes for rate-limiting + sdk-codegen), `scripts/` (semver
  validation), and quality-rule configuration. The two scopes do
  not structurally overlap.
- Both plans commit per-sub-item with no batching; merge conflicts
  would be lexical, not semantic.
- Both plans share the same continuity surfaces
  (`repo-continuity.md`, the next-session record, the embryo log)
  but each agent's claim should declare its specific area set.

**Coordination requirements**:

- Each agent **opens a claim** in `active-claims.json` covering
  its specific files **before any non-trivial edit**.
- **Embryo-log entries** at session-open and session-close per
  `register-active-areas-at-session-open.md`.
- **Pre-commit gate failures from the parallel agent's WIP**:
  surface (don't bypass), check the parallel claim, ping if
  unresolved per
  `parallel-track-pre-commit-gate-coupling` pattern.

**If running solo** (one agent does both plans serially): the
parallel framing still applies — finish each sub-item with a clean
commit before starting the next, in either plan.

---

## Closure criterion

This plan closes when all six L-IMM sub-items have status
`completed` in their todos. After closure:

- L-IMM in
  [`sentry-observability-maximisation-mcp.plan.md`](../active/sentry-observability-maximisation-mcp.plan.md)
  flips its lane status to `✅ closed`.
- This plan rotates to `archive/completed/`.
- The Sentry observability stack is "good enough for now" per the
  2026-04-26 owner declaration; further Sentry work is in L-1, L-3,
  L-4b, L-OPS, etc., all of which are no longer immediate-priority.

---

## References

- [`active/sentry-observability-maximisation-mcp.plan.md`](../active/sentry-observability-maximisation-mcp.plan.md)
  § L-IMM — substantive lane body for each sub-item.
- [`pr-87-quality-finding-resolution.plan.md`](pr-87-quality-finding-resolution.plan.md)
  — parallel-track quality plan.
- [`sentry-preview-validation-and-quality-triage.plan.md`](sentry-preview-validation-and-quality-triage.plan.md)
  — closed substrate; Phase 2 evidence is the empirical baseline
  this plan builds on.
- 2026-04-26 napkin entry on
  `vendor-doc-review-for-unknown-unknowns` — the gap-finding session
  that surfaced the L-IMM items.
