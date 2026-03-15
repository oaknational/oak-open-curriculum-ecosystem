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

- Primary execution authority:
  [semantic-search-recovery-and-guardrails.execution.plan.md](../../plans/semantic-search/active/semantic-search-recovery-and-guardrails.execution.plan.md)
- Operator stop/go authority:
  [semantic-search-ingest-runbook.md](../../plans/semantic-search/active/semantic-search-ingest-runbook.md)
- Session bootstrap and lane-order authority: this prompt

Supporting evidence only (not execution authority):

- [search-cli-sdk-boundary-migration.execution.plan.md](../../plans/semantic-search/archive/completed/search-cli-sdk-boundary-migration.execution.plan.md)
- [cli-robustness.plan.md](../../plans/semantic-search/archive/completed/cli-robustness.plan.md)

Findings register:

- Source: recovery plan, **Reviewer Findings Register (round 1, 2026-03-14)**
- Policy: findings are actionable by default; reject only with explicit rationale/evidence
- Active IDs: `R1` to `R9`

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

### Step 3: Start with full review/fix cycle

Follow `semantic-search-recovery-and-guardrails.execution.plan.md` section
`Cross-Phase Mandatory Review Loop` exactly before new implementation work.

### Step 4: Execute recovery phases in order

Continue using the recovery plan phase-entry criteria as the sequencing source
of truth; keep evidence additive; do not replay completed phases without new
regression evidence. For current lane state, respect the explicit
`Phase 2 -> Phase 3` entry rule rather than closeout-gate completeness alone.

**Hard sequencing rule**: never promote, retry, or release lock after a
post-mutation failure until immediate readback triage (`validate-aliases`,
`meta get`, `count`) is complete.

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

Record outcome in the recovery plan evidence trail as each phase closes; keep
`semantic-search-ingest-runbook.md` aligned with any sequencing or stop/go
updates.

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
- [Archive](../../plans/semantic-search/archive/completed/)
