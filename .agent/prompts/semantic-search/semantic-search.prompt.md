---
prompt_id: semantic-search
title: "Semantic Search Session Entry Point"
type: handover
status: active
last_updated: 2026-03-15
---

# Semantic Search — Session Entry Point

**Last Updated**: 2026-03-15

This is a working handover document. Keep it concise and operational.

---

## Active Scope and Authority

- Active execution authority:
  [search-tool-prod-validation-findings-2026-03-15.md](../../plans/semantic-search/active/search-tool-prod-validation-findings-2026-03-15.md)
- Active execution plan:
  [comprehensive-field-integrity-integration-tests.execution.plan.md](../../plans/semantic-search/active/comprehensive-field-integrity-integration-tests.execution.plan.md)
- Session bootstrap and lane-order authority: this prompt

Completed migration-recovery authority (archived evidence):

- [semantic-search-recovery-and-guardrails.execution.plan.md](../../plans/semantic-search/archive/completed/semantic-search-recovery-and-guardrails.execution.plan.md)
- [semantic-search-ingest-runbook.md](../../plans/semantic-search/archive/completed/semantic-search-ingest-runbook.md)

Supporting evidence only:

- [search-cli-sdk-boundary-migration.execution.plan.md](../../plans/semantic-search/archive/completed/search-cli-sdk-boundary-migration.execution.plan.md)
- [cli-robustness.plan.md](../../plans/semantic-search/archive/completed/cli-robustness.plan.md)

Current lane execution focus (post-archive, 2026-03-15):

- Keep execution anchored in the active production findings register (`F1`/`F2`)
  until each finding is closed with evidence or explicitly owner-triaged with
  rationale.
- Fresh reingest completed successfully (`v2026-03-15-134856`) and required
  readbacks have been captured (`validate-aliases`, `meta get`, `count`,
  `verify`, and live `oak_meta` mapping contract check).
- Production retest evidence confirms both `F1` and `F2` still reproduce after
  reingest, so keep both findings open and prioritised for data/query-semantics
  remediation.
- Treat production validation of `F1`/`F2` as mandatory closeout evidence for
  this lane; code-only fixes are not sufficient for migration completion.
- Keep recovery evidence additive; do not overwrite prior evidence packs.
- **Next session objective**: refine and harden
  `comprehensive-field-integrity-integration-tests.execution.plan.md` before
  starting implementation; do not begin plan execution until refinement
  criteria are explicitly closed.

Findings register:

- Source: `search-tool-prod-validation-findings-2026-03-15.md`
- Policy: findings are actionable by default; reject only with explicit rationale/evidence.
- Active IDs: `F1` to `F2`

Migration completion gate:

- Migration is complete only after a successful blue/green deploy evidence pack
  is linked in the recovery plan (environment, commit SHA, cutover success,
  post-deploy health/smoke checks).

Deferred lane note:

- Incremental/scheduled-refresh work is deferred and excluded from migration
  completion scope in this lane.

---

## Session Start Sequence

### Step 1: Ground

- [start-right-thorough.md](../../skills/start-right-thorough/shared/start-right-thorough.md)
- [AGENT.md](../../directives/AGENT.md)
- [principles.md](../../directives/principles.md)
- [testing-strategy.md](../../directives/testing-strategy.md)
- [schema-first-execution.md](../../directives/schema-first-execution.md)

### Step 2: Verify live state

Run `validate-aliases`, `meta get`, `count`, and `oak_meta` mapping check before
any mutation. Do not proceed unless alias health and metadata coherence are
confirmed.

If a lifecycle command is already running from the prior session, monitor it to
completion first, then capture readbacks (`validate-aliases`, `meta get`,
`count`) before continuing with findings validation.

### Step 3: Plan refinement (next session priority)

Refine and de-risk
`comprehensive-field-integrity-integration-tests.execution.plan.md`:

1. verify all-field inventory strategy and stage-contract matrix coverage;
2. verify deterministic validation commands and quality-gate sequencing;
3. resolve reviewer feedback on plan clarity/scope.

Do not start implementation in this step.

### Step 4: Run review/fix cycle for active findings

After plan refinement is accepted, run the specialist review/fix loop against
code and docs touched while closing `F1`/`F2`. Keep findings/status updates in
the active findings register.

### Step 5: Deep-update discipline for prompt/findings register

When execution state changes materially (new findings, status flips, reviewer
closure rounds, evidence additions), update both:

1. `semantic-search.prompt.md` (lane-ordering and current focus), and
2. `search-tool-prod-validation-findings-2026-03-15.md` (finding status,
   evidence links, disposition rationale)

in the same session before declaring completion.

---

## Operator-Run Ingest Protocol

When the flow reaches `admin versioned-ingest`:

1. The agent prepares the exact command and pre-check context.
2. The operator starts ingest independently.
3. The agent monitors output, diagnoses failures, and continues remediation.

The agent must not independently start ingest commands unless explicitly
requested in the current session.

Before any ingest/promote execution, run a read-only mapping gate and confirm
live `oak_meta` mapping matches the full generated metadata contract (with
`previous_version` as a sentinel, not the only check). If drift exists, stop
and remediate mapping contract drift first.

Record outcome in the active findings register, and treat the archived recovery
plan/runbook as historical evidence references.

---

## Goals and Inputs

- Recover lifecycle integrity and close migration with deterministic evidence.
- Keep boundaries and no-compat-layer doctrine strict.
- Keep deferred incremental work out of this migration lane.

---

## Evidence and Exit Criteria

- **Incident**: no strict mapping exception for `previous_version`, successful
  lifecycle ingest, post-ingest alias targets healthy.
- **CLI promote command surface**: use `admin promote --target-version <v>`.
- **Boundary**: non-admin CLI cannot import `@oaknational/oak-search-sdk/admin`.
- **Governance**: reviewer findings resolved or explicitly owner-triaged; all
  quality gates pass without bypasses.
- **Search validation**: open findings in
  `search-tool-prod-validation-findings-2026-03-15.md` are resolved or
  explicitly owner-triaged with evidence.
- **Migration completion gate**: migration is complete only when a successful
  blue/green deploy is evidenced in the recovery plan, including deploy target,
  commit SHA, cutover success, and post-deploy health/smoke checks.

---

## Scope Controls (Non-goals)

- No compatibility layers.
- No fallback dynamic-mapping workarounds.
- No reopening completed historical phases without new regression evidence.
- No expansion into unrelated roadmap items outside the active recovery lane.

---

## Lane Indexes

- [Active Plans](../../plans/semantic-search/active/README.md)
- [Current Queue](../../plans/semantic-search/current/README.md)
- [Roadmap](../../plans/semantic-search/roadmap.md)
- [Archive](../../plans/semantic-search/archive/completed/README.md)
