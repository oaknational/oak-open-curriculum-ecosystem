---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-17
---

# Session Continuation

## Ground First

1. Read and internalise:
   - `.agent/directives/AGENT.md`
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Scan the [Start Here: 5 ADRs in 15 Minutes](../../docs/architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes)
   block in the ADR index, and open any ADR whose slug matches your current
   workstream from the [full ADR index](../../docs/architecture/architectural-decisions/README.md).
3. Read `.agent/memory/distilled.md` and `.agent/memory/napkin.md`
4. Read the active plan for your workstream (see below)
5. Re-establish live branch state:

```bash
git status --short
git log --oneline --decorate -10
```

## This Prompt's Role

- Operational entry point only.
- Active plans are authoritative for scope, sequencing, acceptance criteria,
  and validation.
- If prompt text conflicts with active plans, active plans win.

## Future Strategic Watchlist

- Strategic only, not active for the current workstream:
  [cross-vendor-session-sidecars.plan.md](../plans/agentic-engineering-enhancements/future/cross-vendor-session-sidecars.plan.md)
  tracks a local-first, cross-vendor sidecar model for durable session
  metadata beyond vendor-native session titles.
- Strategic only, not active for the current workstream:
  [graphify-and-graph-memory-exploration.plan.md](../plans/agentic-engineering-enhancements/future/graphify-and-graph-memory-exploration.plan.md)
  tracks a pure-exploration lane for Graphify-inspired graph memory. No
  implementation path is chosen; explicit attribution with direct upstream
  links is required for any future adoption.

## Live Continuity Contract

- **Workstream**: Sentry validation closure for the HTTP MCP server, with a
  separate future follow-up for Codex compatibility.
- **Active plans**:
  - `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
    (authoritative parent; active closure lane)
  - `.agent/plans/architecture-and-infrastructure/active/sentry-observability-expansion.plan.md`
    (next MCP-server-confined lane after parent closure; still blocked)
  - `.agent/plans/architecture-and-infrastructure/future/codex-mcp-server-compatibility.plan.md`
    (strategic follow-up only; not executable yet)
  - `.agent/plans/architecture-and-infrastructure/future/clerk-cli-adoption.plan.md`
    (strategic follow-up: extend the Sentry CLI-as-infrastructure
    pattern to Clerk's CLI once the Sentry hygiene lane lands)
- **Current state**: Validation closure pass complete on this branch.
  Sentry CLI hygiene follow-up lane also complete on the same branch
  on 2026-04-17, including a finishing-pass re-review. Fresh
  `oak-preview` deployment confirmed (`scopes_supported: ["email"]`,
  release `1.5.0` live in Sentry with `mcp.server`, `http.client`, and
  `bootstrap` spans). Source-map upload operational via
  `pnpm sourcemaps:upload`, now backed by `pnpm exec sentry-cli
  sourcemaps inject && pnpm exec sentry-cli sourcemaps upload` (two-step
  Debug ID flow) with a `//# debugId=` post-condition check, per-workspace
  `@sentry/cli` devDependency + committed `.sentryclirc` in each of
  the three Sentry-touching workspaces, and `@sentry/cli` declared in
  `onlyBuiltDependencies` / `knip.config.ts` `ignoreDependencies` for
  each owning workspace. The pattern is now formalised as
  [ADR-159: Per-Workspace Vendor CLI Ownership with Repo-Tracked
  Configuration](../../docs/architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md),
  cross-linked from ADR-010, ADR-143, ADR-154 (Related), the
  deployment runbook, the Sentry CLI usage doc, the execution plan,
  and the Clerk CLI adoption plan. Finishing-pass reviewers
  (sentry-reviewer, docs-adr-reviewer, code-reviewer) re-invoked in
  parallel on the updated diff — all 10 new findings (pnpm-local vs
  user-global preflight shape in ADR-159 point 6, runbook Step 3
  verification surface, README sentry-bullet example split,
  ADR-143 ↔ ADR-159 back-link, runbook/plan citing ADR-159, ADR-159
  top-matter including ADR-154, ADR-159 dropping `~/.clerk/`
  speculation, `require_command` stderr routing) resolved on branch.
  Local-trigger lane produced handled, rejected-promise, and unhandled
  events under session release tag
  `evidence-2026-04-16-http-mcp-sentry-validation`, with frames
  resolved to TypeScript source. Kill-switch rehearsal
  (`SENTRY_MODE=off`) under
  `evidence-2026-04-16-http-mcp-sentry-validation-KILLSWITCH` returned
  zero events. Temporary `__test_generate_errors` tool removed before
  commit boundary. Date-stamped bundle at
  `.agent/plans/architecture-and-infrastructure/evidence/2026-04-16-http-mcp-sentry-validation/README.md`
  with two 2026-04-17 sibling notes:
  `sentry-cli-reverify-note.md` (rewritten upload script re-verified
  end-to-end) and `alerting-baseline-enumeration-note.md` (CLI
  confirms zero alert rules on `oak-open-curriculum-mcp`; advisory
  baseline uses structured `LevelFilter` / top-level `environment`
  syntax, not query-string filters). `pnpm check` from repo root
  green: 19/19 + 88/88 turbo tasks, exit 0. Separately, the attempted
  Codex auth fix was rolled back after it failed to unblock Codex and
  regressed Cursor; that investigation stays isolated in its own
  future plan.
- **Current objective (next session)**: merge / push boundary. Commit
  `40b212d4` ("feat(practice,sentry): three-zone fitness + Sentry CLI
  hygiene + enforce-edge tightening") has landed on
  `feat/otel_sentry_enhancements` — 92 files changed, 4,112 insertions,
  635 deletions. Pre-commit hooks (prettier, markdownlint, knip,
  depcruise, 74 turbo tasks) all passed. Consolidation side-effects
  (napkin rotation, distilled update, 2 pattern extractions, ADR-159
  graduation) also landed on branch but are in a follow-up uncommitted
  state pending a tidy consolidation commit. The one remaining
  owner-only action is unchanged: create the first production alert
  rule on `oak-national-academy/oak-open-curriculum-mcp` (CLI
  enumeration confirms zero rules exist). After push + merge, the
  next implementation lane is
  `sentry-observability-expansion.plan.md`.
- **Hard invariants / non-goals**:
  - Parent-plan authority stays with
    `sentry-otel-integration.execution.plan.md` for credential and evidence
    closure.
  - No broader search-observability work unless it is explicitly confined to
    the MCP server.
  - Codex compatibility is a separate follow-up lane; do not reopen shared auth
    configuration speculatively inside the Sentry validation pass.
  - Preserve working-client compatibility while investigating Codex.
  - **Vendor CLI adoption discipline**: pnpm-first install, repo-tracked
    config (no user-global state), per-workspace ownership for pipeline
    CLIs, shared libraries never pin `project`. See
    [ADR-159](../../docs/architecture/architectural-decisions/159-per-workspace-vendor-cli-ownership.md)
    for the full eight-point decision and
    [docs/operations/sentry-cli-usage.md](../../docs/operations/sentry-cli-usage.md)
    for the worked Sentry example.
- **Recent surprises / corrections**:
  - Broader `scopes_supported` advertising did not fix Codex and did regress
    Cursor, so shared auth metadata is not a safe speculative fix surface.
  - Alert-rule enumeration via `sentry api` is reachable with the existing
    org auth token and directly answers item 8 of the evidence bundle: the
    project currently has **zero** configured alert rules (all three
    surfaces — `/rules/`, `/alert-rules/`, org-level `/combined-rules/`
    filtered to this project — return empty). The open question therefore
    becomes an owner rule-creation action, not a research question. See
    `evidence/2026-04-16-http-mcp-sentry-validation/alerting-baseline-enumeration-note.md`.
  - `sentry-cli` and `sentry` both read ancestor `.sentryclirc` with
    nearest-wins composition, so workspace-local pinning of
    `org/project/url` via a committed `.sentryclirc` is a clean
    replacement for user-global `~/.sentry/cli.db` state. Documented in
    `docs/operations/sentry-cli-usage.md`.
  - `practice:fitness` uses the four-zone scale (ADR-144):
    `healthy` → `soft` → `hard` → `critical`. Routine commits are
    not blocked by `soft` or `hard`; consolidation closure runs
    `pnpm practice:fitness --strict-hard` which blocks on `hard`
    and `critical`; `critical` always blocks and triggers the
    loop-health post-mortem. At commit boundaries: read the
    output, act only on genuinely new issues the branch
    introduced, and schedule larger fitness-driven work as its
    own session unless a file has reached `critical`.
  - `@sentry/cli` emits a pnpm "Ignored build scripts" warning on first
    install; listing it in `pnpm-workspace.yaml`'s
    `onlyBuiltDependencies` silences it and allows its postinstall
    binary-download to run on subsequent installs.
  - The current `SENTRY_AUTH_TOKEN` embeds `sentry.io` as its region,
    which overrides the `.sentryclirc`-configured `de.sentry.io`. Both
    points resolve to the same `oak-national-academy` org and upload
    artefacts are visible end-to-end; token rotation to a de.sentry.io
    scope is a low-priority follow-up.
- **Open questions / low-confidence areas**:
  - Whether Codex ultimately needs a server-owned compatibility layer, a Clerk
    configuration change, or an upstream-client escalation.
- **Next safe step**: commit the consolidation follow-up (napkin
  rotation + distilled update + 2 new patterns), then push
  `feat/otel_sentry_enhancements` and open the PR. Do not expand
  scope into Clerk CLI work — that has its own strategic brief at
  `.agent/plans/architecture-and-infrastructure/future/clerk-cli-adoption.plan.md`.
  Do not edit `.agent/directives/principles.md` or
  `.agent/directives/testing-strategy.md` to chase their pre-existing
  hard-zone violations — those require owner-scoped work per the
  "Never delegate foundational Practice doc edits" rule.
- **Deep consolidation status**: completed this handoff —
  napkin rotated (679 → ~54 lines; archived to
  `archive/napkin-2026-04-17.md`); 6 new high-signal entries merged
  into `distilled.md` and redundant entries pruned against permanent
  homes (distilled.md 278 → 265 lines, under hard limit 275);
  3 new patterns extracted (`patterns/adr-by-reusability-not-diff-size.md`,
  `patterns/route-reviewers-by-abstraction-layer.md`,
  `patterns/governance-claim-needs-a-scanner.md`); ADR-shaped doctrine
  graduated to ADR-159. Practice-core incoming empty; outgoing pair
  refreshed for the three-zone model. `pnpm practice:fitness --strict-hard`
  exits 1 on **pre-existing** foundational-doc hard-zone violations:
  `.agent/directives/principles.md` characters 25628 > 24000, and
  `.agent/directives/testing-strategy.md` lines 564 > 550 + two prose
  lines above 100 chars. Neither was introduced by this branch. Per
  the "Never delegate foundational Practice doc edits" rule,
  remediation requires owner-scoped work (compress/restructure within
  limits, follow each file's `split_strategy` frontmatter, or a
  user-approved limit raise with rationale). These are surfaced as the
  only remaining blocker for a `strict-hard` clean closure; routine
  strict mode (critical-only) exits 0.

## Active Workstreams (2026-04-17)

### 1. Sentry + OTel Alignment — CLOSURE + HYGIENE COMPLETE (same branch/PR)

**Plans**:

- `.agent/plans/architecture-and-infrastructure/active/sentry-canonical-alignment.plan.md`
  (16 todos done, 7 dropped — child plan complete)
- `.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
  (parent authority — "Road to Provably Working Sentry" table now shows
  steps 1-5 **DONE (pending alerting wiring)**; validation evidence bundle
  landed at `evidence/2026-04-16-http-mcp-sentry-validation/` with two
  2026-04-17 sibling notes)

**Closure pass and Sentry CLI hygiene lane both complete on this
branch.** Remaining before merge: quality-gate pass + owner rule
creation on `oak-national-academy/oak-open-curriculum-mcp` (CLI
enumeration 2026-04-17 confirms zero rules exist). After the
commit/merge, the next implementation lane for this branch/PR is
`sentry-observability-expansion.plan.md`. EXP-E (source-map upload)
was brought forward into this branch during the closure pass and is
already shipped; the hygiene lane only changed *how* we invoke the
uploader (now `pnpm exec sentry-cli` inside each workspace with
committed `.sentryclirc`), not whether uploads happen. Broader
`search-observability.plan.md` work is deferred to a later session/PR
unless it is explicitly confined to the MCP server.

### 2. User-Facing Search UI — NEXT

Interactive search MCP App widget. Queued after Sentry completes.

### 3. Compliance — READY / PARKED

**Plan**: `.agent/plans/compliance/current/claude-and-chatgpt-app-submission-compliance.plan.md`
**Companion**: `.agent/plans/compliance/current/upstream-api-requests.md`

Plan reviewed by 7 specialists, all findings addressed. Codegen
fixes committed (56e92b0d): silent fallback removed, full-content
cache comparison, dotenv removed, CI drift check added. Upstream
API requests drafted (limit/offset swap + asset pagination).
Ready for promotion to `active/` once Sentry work is no longer the
current branch priority.

### 4. Schema Resilience — PENDING (owner decision)

Blocked on OQ1 (`.strip()` vs `.passthrough()`).

### 5. Other workstreams — PARKED

- Interactive User Search MCP App (WS3 Phase 5)
- `_meta` Namespace Cleanup
- Quality Gate Hardening (knip/depcruise done, ESLint remaining)
- Upstream API Reference Metadata (design complete, 7 todos)

## Core Invariants

- Widget HTML is generated metadata — same codegen constant pattern
  as `WIDGET_URI`, tool descriptions, documentation content
- DI is always used — enables testing with trivial fakes (ADR-078)
- `principles.md` is the source of truth; rules operationalise it
- Separate framework from consumer in all new work
- Decompose at tensions rather than classifying around compromises
- Apps are thin interfaces over SDK/codegen capabilities

## Durable Guidance

- Run the required gates one at a time while iterating.
- Run `pnpm fix` to apply auto-fixes.
- Run `pnpm check` as the canonical aggregate readiness gate before
  push/merge. It includes `pnpm knip` and `pnpm depcruise`.
- Keep this prompt concise and operational; do not duplicate plan
  authority.
