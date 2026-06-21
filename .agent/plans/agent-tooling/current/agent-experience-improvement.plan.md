---
name: "Agent Experience Improvement — umbrella: drive the homed cures, own the drain-fix"
overview: >
  The umbrella plan that sequences and drives the highest-impact agent-experience
  (AX) improvements across the 82-entry friction register. It DRIVES the
  already-ratified cure plans (CLI ergonomics, watcher liveness) rather than
  re-authoring them, and OWNS the genuinely-unhomed net-new work: the structural
  drain-fix (a frictions-register validator + generated routing index), F-41
  path-safety, gate-coverage, and a disposition ledger that routes all 82
  frictions to a home. Operationalises PDR-111 (AX is first-class).
status: current
type: developer-experience
controlling_doctrine:
  - ".agent/practice-core/decision-records/PDR-111-agent-experience-is-first-class.md"
  - ".agent/practice-core/decision-records/PDR-055-cli-affordance-set-discipline.md"
  - ".agent/practice-core/decision-records/PDR-098-doctrine-traction-firing-detection-response.md"
evidence_report: "../../../reports/agent-experience-cause-class-analysis-2026-06-21.md"
driven_plans:
  - "./agent-tools-cli-ergonomics.plan.md"
  - "./comms-watch-hang-hardening.plan.md"
  - "./coordination-watcher-canonicalisation.plan.md"
deferred_plans:
  - "../future/peer-heartbeat-silence-alerting.plan.md"
  - "../future/agent-frustration-corpus-survey.plan.md"
specialist_reviewer: "assumptions-expert, architecture-expert-fred, test-expert, docs-adr-expert"
last_updated: 2026-06-21
isProject: false
todos:
  # WS-3 — F-41 path-safety (OWN, safety-critical, independent)
  - id: ws3-b1-shared-resolver
    content: "WS-3 B1: introduce one shared `resolveCoordinationHome(cwd, {exists})` in agent-tools that walks to the `.agent/state/collaboration` sentinel, built on `core/repo-root.ts resolveRepoRoot`. Replace the per-command root-finder in `cli-comms-send.ts` (and any sibling copy found at B1 time). TDD: unit tests cover the worktree / stale-cwd case; a test asserts exactly one root-finder remains."
    status: pending
  - id: ws3-b2-refuse-relative-writes
    content: "WS-3 B2: refuse bare relative paths LOUDLY on write commands (`claims open/close/heartbeat`, `comms inbox/watch`, `commit-queue`), resolving the coordination home via B1's helper. Per-site Red→Green (independent once B1 lands). TDD per site: a write from a nested/worktree cwd with a bare relative path is refused with a specific error; a correct invocation lands in the repo-root-anchored registry regardless of cwd."
    status: pending
    depends_on: [ws3-b1-shared-resolver]
  # WS-4 — structural drain-fix validator (OWN, the spine)
  - id: ws4-a1-parser
    content: "WS-4 A1: pure `parseFrictionEntries(content)` → `{id, status, home, landedRef}[]`, with a closed status enum (`open`/`homed`/`deferred`/`landed`/`superseded`) and adjacent `Home:`/`Landed:` fields. Unit tests cover each token and legacy/freeform lines. Mirror the markdown-links helper convention."
    status: pending
  - id: ws4-a2-violations
    content: "WS-4 A2: pure `findRegisterViolations(entries, {planExists, commitResolves, planArchived})` → the four failure classes: no-home (open + no Home + no deferred), dangling plan path, dangling commit SHA, drain-lag (homed but cited plan archived/COMPLETE while not landed). Filesystem/git probes injected as functions (the `repo-root.ts` exists-seam pattern). Table-tested. This is the recompute-not-record core."
    status: pending
    depends_on: [ws4-a1-parser]
  - id: ws4-a3-index
    content: "WS-4 A3: pure `buildRoutingIndex(entries)` → deterministic friction→home→status table. Unit-tested for ordering/grouping. GENERATED, never hand-maintained."
    status: pending
    depends_on: [ws4-a1-parser]
  - id: ws4-a4-runner
    content: "WS-4 A4: thin `validate-frictions-register.ts` runner using `resolveRepoRoot(import.meta.url)`, wiring real fs/git probes into A2 and emitting A3's index; register the package script and append to `repo-validators:check`. Land REPORT-FIRST (exit 0 + warn) — mirror `validate-reference-direction.ts`; escalate to blocking only after WS-6 burndown. Integration smoke: non-zero on a fixture with a dangling ref, zero on a clean fixture."
    status: pending
    depends_on: [ws4-a2-violations, ws4-a3-index]
  # WS-6 — disposition ledger / status-grammar migration (OWN; greens WS-4)
  - id: ws6-disposition-ledger
    content: "WS-6: one reviewed batch edit migrating all 82 entries to the closed status enum + `Home:`/`Landed:` fields, recording each F-NN's disposition (already-homed: cite plan; homed-here: cite a WS; deferred: cite a future/ brief). Sized to unique substance (~10–12 clusters; duplicate-cause entries share a disposition). Acceptance = WS-4 validator passes clean in BLOCKING mode (self-correcting; PDR-093)."
    status: pending
    depends_on: [ws4-a4-runner]
  - id: ws4-a5-escalate-blocking
    content: "WS-4 A5: after WS-6 greens the register, flip the validator from report-first to blocking in `repo-validators:check`. Acceptance: introducing each failure class independently exits non-zero naming the F-NN + class; a divergent committed index copy fails the gate."
    status: pending
    depends_on: [ws6-disposition-ledger]
  # WS-5 — gate-coverage (OWN, small)
  - id: ws5-gate-coverage
    content: "WS-5 C1: a guard test asserting `portability:check`, `skills:check`, and the generated-adapter drift check are in the BLOCKING path (`repo-validators:check`), not only in full `check`; then wire the three in. Do NOT absorb the F-40 coverage-matrix validator (reference it). TDD: a deliberately drifted adapter fails the blocking gate, not only full check."
    status: pending
  # WS-1 / WS-2 — DRIVE (reference + sequence; cycles live in the driven plans)
  - id: ws1-drive-cli-ergonomics
    content: "WS-1 DRIVE: execute `agent-tools-cli-ergonomics.plan.md` (WS0→WS6, WS6 = the PDR-055 clause-10 conformance guard). This retires Cause-Class A (~19 frictions). The umbrella sequences it; it owns its own cycles. Run on the owner's priority cadence."
    status: pending
  - id: ws2-drive-watchers
    content: "WS-2 DRIVE: execute `comms-watch-hang-hardening.plan.md` and `coordination-watcher-canonicalisation.plan.md` (Cause-Class C). The umbrella sequences; the plans own their cycles."
    status: pending
---

# Agent Experience Improvement (umbrella)

**Status**: 🟢 CURRENT — executable, queued. Authored 2026-06-21 from the
[AX cause-class analysis](../../../reports/agent-experience-cause-class-analysis-2026-06-21.md),
owner-directed as "one umbrella plan driving all moves." Operationalises
[PDR-111](../../../practice-core/decision-records/PDR-111-agent-experience-is-first-class.md).

## Problem

The 82-entry friction register is the AX backlog (PDR-060). Its frictions collapse
into eight cause-classes (see the report). The highest-count cure (a CLI-ergonomics
conformance guard) is **already doctrine** (PDR-055 clauses 7–10) and **already
homed** ([`agent-tools-cli-ergonomics.plan.md`](./agent-tools-cli-ergonomics.plan.md),
WS6); watcher cures are similarly homed. So the leverage is NOT in re-planning those
— it is in (a) **driving** them on cadence, and (b) closing the genuinely-unhomed
gaps: the **invisible, un-mechanised drain** (frictions read `open` while their cure
is mid-flight elsewhere; nothing detects a no-home or stale-disposition entry),
**F-41 path-safety** (a relative path from a stale cwd silently writes to the wrong
registry behind a green proof line), and **gate-coverage** (drift escapes the
blocking commit gate).

## End Goal · Mechanism · Means

- **End goal (user impact)**: the AX backlog drains visibly and cannot silently
  lag; a correct-looking collaboration write cannot corrupt the wrong registry;
  drift cannot escape the blocking gate; and the homed cure-classes (CLI ergonomics,
  watchers) are driven to completion.
- **Mechanism**: a `frictions-register` repo-validator that *recomputes* register
  integrity against the filesystem and git (no-home, dangling-ref, drain-lag) and
  *generates* the routing index — the PDR-098 mechanical-fire+surface-detect
  quadrant the drain lacked; a single shared coordination-home resolver that refuses
  ambiguous relative writes; the three missing checks wired into the blocking gate;
  and DRIVE references that sequence the already-ratified plans.
- **Means**: WS-3 (F-41) ∥ WS-4 (drain validator) → WS-6 (ledger greens WS-4) →
  WS-4 A5 (escalate to blocking); WS-5 (gate-coverage); WS-1/WS-2 DRIVE on cadence.

## Workstreams (DRIVE vs OWN)

| WS | Mode | Scope | Frictions | Home |
|----|------|-------|-----------|------|
| WS-1 | DRIVE | CLI ergonomics + discoverability | A (~19) | `agent-tools-cli-ergonomics.plan.md` |
| WS-2 | DRIVE | Watcher liveness + canonicalisation | C | `comms-watch-hang-hardening` + `coordination-watcher-canonicalisation` |
| WS-3 | OWN | F-41 path-safety (safety-critical) | D (F-41) | this plan |
| WS-4 | OWN | Structural drain-fix validator + index | meta/drain | this plan |
| WS-5 | OWN | Gate-coverage | E (F-54/F-57) | this plan |
| WS-6 | OWN | Disposition ledger (all 82 → a decision) | all | this plan |
| WS-7 | DEFER | Peer heartbeat-silence alert | C (F-75) | `../future/peer-heartbeat-silence-alerting.plan.md` |

DRIVE = sequence and reference an already-ratified plan; do NOT re-author its
cycles. OWN = net-new TDD cycles authored here (frontmatter todos).

## The drain-fix design (WS-4) — recompute, not record

A prose `Status:` string-matcher would *record, not recompute*
(`validators-must-recompute-not-just-record`), and the live vocabulary proves it
(61 `open` plus a heterogeneous one-off tail). A generated authoring sidecar is the
opposite over-build — it adds friction to the one surface whose job is frictionless
capture. The chosen shape:

- A small **closed status enum** (`open`/`homed`/`deferred`/`landed`/`superseded`)
  inside each entry, with freeform suffixes moved to adjacent `Home:`/`Landed:`
  fields. The migration to this grammar **is** WS-6.
- The validator **recomputes against the filesystem and git**: no-home, dangling
  plan path, dangling commit SHA, and **drain-lag** (a `homed` entry whose cited
  plan is archived/COMPLETE while the friction is not `landed` — the staleness has a
  filesystem signature, the PDR-098 occupiable quadrant; the sibling of F-69 for
  state and F-40/F-50/F-57 for other validators).
- The **routing index is generated, never maintained**; a divergent committed copy
  fails the gate (the F-57 pattern).
- **Report-first, then blocking** after WS-6 — mirrors `validate-reference-direction.ts`;
  never brick the gate mid-migration.

## Acceptance criteria (outcome-based)

1. **Drain validator**: clean tree exits 0; each of {no-home, dangling plan path,
   dangling SHA, drain-lag} independently exits non-zero naming the F-NN + class; a
   hand-edited divergent routing index fails the gate; present and blocking in
   `repo-validators:check` after WS-6.
2. **F-41**: a write command from a nested/worktree cwd with a bare relative path is
   refused with a specific error; a correct invocation lands in the repo-root-anchored
   registry regardless of cwd; exactly one coordination-home resolver exists.
3. **Gate-coverage**: `portability:check` / `skills:check` / adapter-drift run in the
   blocking path; a deliberately drifted adapter fails pre-commit, not only full `check`.
4. **Disposition ledger**: every one of the 82 frictions carries a recorded
   disposition; the validator passes clean in blocking mode (the ledger's proof).
5. **DRIVE**: WS-1/WS-2 reference their plans; no cycle is duplicated here.

## Proof contract

| Acceptance id | Proof level | Proof |
|---|---|---|
| 1 drain validator | unit + integration | helper unit tests (A1–A3); runner integration smoke (A4); blocking in gate (A5) |
| 2 F-41 | unit + integration | per-site refusal tests; cwd-independent write-path test; single-resolver assertion |
| 3 gate-coverage | integration | guard test + drifted-adapter-fails-blocking-gate |
| 4 ledger | non-code + integration | every F-NN has a disposition; validator green blocking |
| 5 DRIVE | non-code | references resolve; no duplicated cycles |

## Prerequisites

- **Blocking**: none — every seam exists (`core/repo-root.ts`, the validators tier,
  the gate scripts).
- **Beneficial**: WS-1/WS-2 driven plans landing improves the register's `homed`
  population, but WS-4/WS-6 do not depend on them.

## Non-Goals

- Re-authoring the cli-ergonomics or watcher plan cycles (WS-1/WS-2 DRIVE only).
- Building the F-40 coverage-matrix validator (reference, not absorb).
- The deeper corpus survey (deferred: `../future/agent-frustration-corpus-survey.plan.md`).
- F-75 peer heartbeat-silence (deferred: `../future/peer-heartbeat-silence-alerting.plan.md`).
- Harness/platform fixes outside repo control (compaction bug, Cursor MCP
  visibility) — recorded in the report as constraints, not build targets.

## Risks

- **Status-grammar migration churn** (WS-6 touches all 82 entries): batch it as one
  reviewed edit sized to unique substance, gated by the validator going green — not
  82 cycles.
- **Validator false-positives on legacy lines**: A1 must tolerate the freeform tail
  during report-first; only WS-6 + A5 make it strict.
- **F-41 over-refusal**: refusing relative paths must not break legitimate
  explicit-override invocations; keep the override path honoured (PDR-055 clause 7).

## Plan-Body First-Principles Check

Per [`plan-body-first-principles-check`](../../../rules/plan-body-first-principles-check.md):

- **Shape**: WS-4 grounds the validator against the live register vocabulary and the
  filesystem/git (recompute), not against prose status strings (record).
- **Landing-path**: every OWN cycle is a test+product pair landing together, gates
  green per commit; the validator lands report-first and goes blocking only after
  WS-6 greens it (no bricked gate).
- **Vendor-literal**: the `exists`-seam and `resolveRepoRoot` contracts are verified
  first-hand in WS-3/WS-4, not assumed.

## Foundation Alignment

- `principles.md` — AX is now a named standing concern (PDR-111); replace-don't-bridge
  (consolidate the two root-finders, don't add a second).
- `testing-strategy.md` / `tdd-as-design.md` — every OWN cycle is a test+product pair;
  tests describe behaviour (a relative write is refused; a dangling ref fails), not
  implementation.
- `schema-first-execution.md` — the validator analyses the generator (the register
  grammar), and the routing index is generated, not authored.

## Readiness Reviewers

Before marking execution-complete: `assumptions-expert` (proportionality of the
umbrella + the DRIVE/OWN split; is the drain validator the right structural cure),
`architecture-expert-fred` (validator dependency direction; the shared resolver
boundary), `test-expert` (atomic-landing of each cycle; no audit-shaped tests),
`docs-adr-expert` (PDR-111 + report + register cross-refs intact).

## Learning Loop

On completion: close F-41, F-54, F-57 with landing SHAs in
[`frictions-register.md`](../frictions-register.md); the disposition ledger (WS-6)
records every other friction's home; archive per ADR-117; mine the drain-validator
shape into a reusable register-integrity pattern if a second register wants it
(consolidate-at-third-consumer).

## Lifecycle Triggers

Per [`lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md):
claim registration on execution start (the agent-tools validators dir + the
collaboration-state CLI write sites + the register + the gate scripts); reviewer
dispatch before completion; consolidation on completion (frictions-register status
reconciliation is itself the drain the validator now enforces).
