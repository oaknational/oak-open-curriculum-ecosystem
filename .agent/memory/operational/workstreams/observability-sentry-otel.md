# Workstream Brief — Observability (Sentry + OTel)

**Last refreshed**: 2026-04-20 (session close — §L-8 re-plan ready
for execution at WS1 RED; deferral decisions recorded; Phase 3a/3b
split propagated; memory taxonomy + prompt dissolution landed
around this workstream without advancing it)
**Branch**: `feat/otel_sentry_enhancements`

## Owning plan(s)

- [`sentry-observability-maximisation-mcp.plan.md`](../../../plans/observability/active/sentry-observability-maximisation-mcp.plan.md)
  — lane-level execution authority (ACTIVE).
- [`high-level-observability-plan.md`](../../../plans/observability/high-level-observability-plan.md)
  — five-axis MVP framing + wave sequencing.
- [`sentry-otel-integration.execution.plan.md`](../../../plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md)
  — foundation parent plan; credential/evidence authority.

## Current objective

Replace the ~900-line bespoke Sentry release/commits/deploy
orchestrator (L-7 landed 2026-04-19/20) with `@sentry/esbuild-plugin`
under the raw-esbuild MCP-app shape now authored as §L-8 in the active
maximisation plan. WS0 plan-time challenge is complete; the next move
is execution at WS1 RED.

## Current state

- **L-7 bespoke**: LANDED across `7f3b17e9` + `6f5acd17` + `ecee9801`.
  953 lines across 5 files in
  `apps/oak-curriculum-mcp-streamable-http/build-scripts/`, plus
  `build:vercel` script, `vercel.json.buildCommand` override,
  `@sentry/cli` devDependency, and an eslint-config exception. Being
  torn out.
- **L-8 plugin migration**: authored directly in
  `sentry-observability-maximisation-mcp.plan.md` §L-8 after the
  standalone `sentry-esbuild-plugin-migration.plan.md` was deleted.
  WS0 `assumptions-reviewer` returned ACCEPT WITH NOTES; all four
  important findings plus three nits are already applied in-plan.
- **L-12-prereq**: CLOSED 2026-04-19 by observability-primitives
  consolidation (commit `e09918a8`); `@oaknational/observability`
  owns redaction primitives + JsonValue/JsonObject; sentry-node
  composes directly from observability.
- **L-EH initial**: LANDED 2026-04-19 (ESLint `preserve-caught-error`
  rule at `error` severity in 5 Wave-1 workspaces).
- **L-DOC initial**: LANDED 2026-04-19 (commit `9e1a26b2`).
- **Test totals** (from landing gate): observability 58/58,
  sentry-node 61/61, logger 140/140, oak-search-sdk 262/262,
  oak-curriculum-mcp-streamable-http 615/615, search-cli 1006/1006,
  E2E 161/161 in isolation.
- **`pnpm check`** exit 0 at session close.

## Blockers / low-confidence areas

- **No hard blocker** after WS0. The remaining low-confidence area is
  execution risk: preserving MCP-app build behaviour through the
  tsup → raw-esbuild swap and then proving the expected Sentry UI
  state on a preview deployment.

## Next safe step

Begin §L-8 WS1 RED in
`sentry-observability-maximisation-mcp.plan.md`. The corrected
solution-class framing is already in place and the WS0 reviewer notes
have already been applied.

After §L-8 closes, alpha-gate emitters land next per the 2026-04-20
Phase 3 re-sequencing: **Phase 3a (L-1 free-signal + L-2 delegates
extraction + L-3 MCP request context) — all schema-independent, can
land in parallel before the events-workspace**. That completes the
alpha gate. Events-workspace + L-4b metrics + Phase 4 siblings
(security/accessibility) + Phase 5 close-out lanes form the public-
beta gate. See §Alpha vs public-beta gates in the active plan for
the authoritative split.

## Active track links

None. The stale OAC-labelled track card carrying the L-8 handoff note
was resolved and deleted during session handoff.

## Promotion watchlist

- **`sunk-cost-framing-in-parked-rationale`** — the L-8 `dropped`
  rationale (2026-04-17) was itself a sunk-cost framing: "shell-script
  is simpler" was protecting the chosen shape, not measuring cost. This
  is a second-instance observation confirming the sunk-cost-phrase-
  detector guardrail. Watch for a third instance.
- **`feature-workstream-template-guardrails-self-test`** — the
  L-8 section is the first self-test of the Build-vs-Buy Attestation
  + Reviewer Scheduling guardrails inside a live active plan body.
  If execution proceeds cleanly, the template works. If not, the
  template needs amendment.
