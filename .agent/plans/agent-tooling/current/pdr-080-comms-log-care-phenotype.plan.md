---
name: "PDR-080 Phenotype — Comms-Log-Care Implementation"
overview: "Land the host-side phenotype of PDR-080 (Coordination-Event Absorption Is Signal-Driven): bin-counter CLI + consolidate-docs SKILL edits + cross-reference sweep + completion broadcast."
todos:
  - id: ws1-cycle-1
    content: "WS1 cycle 1: bin-counter pure function — failing unit test (empty stream / single bin / all bins populated / threshold-boundary edges) + implementation `(events[], now, thresholds) → { fresh, informational, critical }`. One commit. Tree green at end."
    status: pending
  - id: ws1-cycle-2
    content: "WS1 cycle 2: shape-constraint validator — failing unit test (rejects informational ≥ critical / non-positive thresholds / gap < absorption-pass cadence) + validator implementation. One commit. Tree green at end."
    status: pending
    depends_on: [ws1-cycle-1]
  - id: ws1-cycle-3
    content: "WS1 cycle 3: CLI wrapper — failing integration test (CLI invocation against fixture comms dir reports bin counts; flags parsed; exit code 0 default; --exit-on-critical flag honoured) + thin CLI implementation under `agent-tools:collaboration-state`. One commit. Tree green at end."
    status: pending
    depends_on: [ws1-cycle-2]
  - id: ws2-cycle-1
    content: "WS2 cycle 1: consolidate-docs SKILL §3a body rewrite — calendar-cutoff replaced with bin-signal trigger citing landed CLI command; §3 line 212 reframed; §3 lines 45-47 trigger swap. One commit."
    status: pending
    depends_on: [ws1-cycle-3]
  - id: ws2-cycle-2
    content: "WS2 cycle 2: cross-reference sweep — grep `.agent/reference/comms-watch-mechanism.md`, `.agent/skills/session-handoff/SKILL-CANONICAL.md`, `.agent/rules/use-agent-comms-log.md`, `distilled.md`, `napkin.md`, the 2026-05-03 Misty experience file; record disposition for each hit; land update-class edits. One commit."
    status: pending
    # depends_on: []  — parallel-safe with ws1 (different file scope)
  - id: ws2-cycle-3
    content: "WS2 cycle 3: sequential reviewer pass on SKILL edits — `docs-adr-expert` then `assumptions-expert`. Absorb verdicts; revise if needed; second-pass review only if v1 verdict carried conditions."
    status: pending
    depends_on: [ws2-cycle-1, ws2-cycle-2]
  - id: ws3-cycle-1
    content: "WS3 cycle 1: PDR-080 landing-health verify — read landed PDR file; verify Related links resolve (PDR-014, PDR-046, PDR-067, PDR-068); verify README index row; check `practice-index.md` for cross-reference need."
    status: pending
    # depends_on: []  — parallel-safe (verification of already-landed work)
  - id: ws3-cycle-2
    content: "WS3 cycle 2: completion broadcast — comms event announcing CLI + SKILL + cross-refs landed; cites commits + reviewer transcript ids + PDR-080 landing event `1902efbf`. Update threads/agentic-engineering-enhancements.next-session.md."
    status: pending
    depends_on: [ws1-cycle-3, ws2-cycle-3, ws2-cycle-2, ws3-cycle-1]
isProject: false
---

# PDR-080 Phenotype — Comms-Log-Care Implementation

**Last Updated**: 2026-05-24
**Status**: 🟡 PLANNING
**Scope**: Land the host-side phenotype of PDR-080: bin-counter CLI in `agent-tools/`, consolidate-docs SKILL edits applying the absorption-language doctrine, cross-reference sweep across affected reference surfaces, and completion broadcast.

---

## Context

**PDR-080: Coordination-Event Absorption Is Signal-Driven** landed at `.agent/practice-core/decision-records/PDR-080-coordination-event-absorption-is-signal-driven.md` (Accepted, 2026-05-24) earlier this session. The doctrine replaces the calendar-bounded cutoff for comms-event retention with a bin-signal triggered absorption pass.

The doctrine is portable; this plan covers the host-side phenotype.

### Problem statement

The existing host-side spec (`consolidate-docs/SKILL-CANONICAL.md` §3a) operationalises comms-event retention as a 7-day calendar cutoff: events older than seven days are processed then deleted at the next consolidation pass. PDR-080 supersedes this with a bin-signal trigger; absorption fires when the informational or critical age-bin is non-empty, not when a calendar threshold is crossed.

Without the phenotype, the doctrine is undeployed: agents have no way to observe the bin-signal, and the SKILL still carries the calendar-cutoff prescription.

### Existing capabilities

- `agent-tools/` workspace under `agent-tools:collaboration-state` already carries comms-related CLIs (`comms send`, `comms watch`, `comms direct`); the bin-counter is a peer subcommand
- `consolidate-docs/SKILL-CANONICAL.md` §3a already enumerates the absorption-sweep steps; the phenotype edit reframes the trigger, not the sweep
- The comms event stream at `.agent/state/collaboration/comms/` carries `created_at` timestamps on every event file; the bin-counter is a pure read over that surface

---

## Design Principles

1. **Doctrine before phenotype** — PDR-080 is landed; this plan implements its host-side surface. No new doctrine emerges here; if any does, escalate to a PDR amendment cycle.
2. **CLI is a pure function under a thin wrapper** — the bin-counter is `(events[], now, thresholds) → bin_counts`; the CLI parses flags and prints. Pure tests cover the function; integration tests cover the CLI surface.
3. **Tunables flow from PDR-080 Invariant 4 shape constraints** — informational < critical; both > 0; gap ≥ one absorption-pass cadence. The validator enforces these; downstream callers can rely on them.
4. **Practice-Core surfaces follow sequential reviewer cadence** — the SKILL edits (Practice Core) get one reviewer at a time per `feedback_practice_docs_sacred`. The CLI (tooling code) gets parallel review.
5. **Cross-reference sweep is mechanical** — grep + disposition log + bounded update set. Anything that turns out non-mechanical surfaces as a separate cycle, not as scope creep here.

**Non-Goals** (YAGNI):

- README PDR-shape contract update to authorise `Created` + `Last updated` metadata (flagged in PDR-080 §Notes; separate cycle)
- PDR-067 amendment to incorporate raw-event-stream vs rendered-log distinction directly into the taxonomy table (flagged in PDR-080 §Notes; separate cycle)
- Comms-event emission-shape contract changes (PDR-080 §"Composition with PDR-068" bottleneck 3 names this; separate cure-direction; not in this phase)
- Lighter-weight session-open absorption scan (PDR-080 §"Composition with PDR-068" bottleneck 1 cure-direction; separate cure cycle)
- Per-event audit marker for absorption decisions (intentionally rejected in PDR-080 §Falsifiability)

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md)

- **Session entry**: `oak-start-right-team` (this work is multi-agent-visible; coordination-substrate surfaces touched)
- **Active claim registration**: at WS1 start, register source claim covering `agent-tools/src/collaboration-state/` subtree + `consolidate-docs/SKILL-CANONICAL.md` (after WS2 unblocks)
- **Decision threads**: none expected; PDR-080 already carries the doctrine
- **Session handoff**: `oak-session-handoff` at end of any session that lands a workstream
- **Consolidation**: `oak-consolidate-docs` after all workstreams complete; surfaces PDR-080 follow-on capture items

---

## Cycle Dependencies and Parallelisation

> See [TDD Cycles component](../../templates/components/tdd-phases.md) §"Atomic, independent cycles for parallel dispatch"

Cycle graph:

```text
ws1-cycle-1 ──> ws1-cycle-2 ──> ws1-cycle-3 ─┐
                                              ├──> ws2-cycle-1 ─┐
ws2-cycle-2 ─────────────────────────────────┘                  ├──> ws2-cycle-3 ─┐
                                                                 │                 ├──> ws3-cycle-2
ws3-cycle-1 ───────────────────────────────────────────────────────────────────────┘
```

Parallelisable at start: `ws1-cycle-1`, `ws2-cycle-2`, `ws3-cycle-1`. Three independent dispatch surfaces; separate file scopes.

`ws2-cycle-1` blocks on `ws1-cycle-3` because the SKILL edits cite the CLI command name; the command name finalises only when the CLI lands.

`ws2-cycle-3` blocks on both `ws2-cycle-1` and `ws2-cycle-2` — the reviewer pass needs both edits in place.

`ws3-cycle-2` is the gate to completion; blocks on all substantive workstreams landing.

---

## Reviewer Scheduling

### Plan-phase (PRE-execution) — solution-class

- `assumptions-expert` — proportionality of the bin-counter scope; whether the three-bin abstraction is the simplest workable shape
- (Optional) `architecture-expert-barney` — boundary placement of the CLI within `agent-tools/`

### Mid-cycle (DURING execution) — solution-execution

- **CLI cycles (WS1)** — parallel review legitimate (tooling code, NOT Practice Core):
  - `test-expert` + `type-expert` after each TDD cycle's RED phase
  - `code-expert` gateway after GREEN; routes to specialists
- **SKILL cycles (WS2)** — sequential review (Practice Core surface; `feedback_practice_docs_sacred`):
  - `docs-adr-expert` first
  - `assumptions-expert` second

### Close (POST-execution) — coherence verification

- `docs-adr-expert` for any documentation drift introduced
- `onboarding-expert` if the cross-reference sweep surfaces an onboarding-path edit

---

## WS1 — Bin-Counter CLI

WS1 is a TDD sequence delivering a pure function plus a thin CLI wrapper. Each cycle is one commit ending tree-green.

### Cycle 1.1: Bin-counter pure function

**Parallel-safety**: parallel-safe (no prior cycles)

**Starting state**: branch HEAD at dispatch

**File scope**:

- `agent-tools/tests/collaboration-state/comms-age-bins.unit.test.ts` (NEW)
- `agent-tools/src/collaboration-state/comms-age-bins.ts` (NEW)

**File scope NOT to touch**: `comms-watch.ts`, `comms-send.ts` (orthogonal CLIs); `consolidate-docs/SKILL-CANONICAL.md` (gated by WS2)

**Test** (Red):

- Function `binCounts(events, now, thresholds)` returns `{ fresh, informational, critical }` counts
- Edge cases: empty array → all zeros; all events fresh → only `fresh` populated; all events past critical → only `critical` populated; threshold-boundary events partition correctly (events at exactly `info_threshold` go into `informational` not `fresh`; events at exactly `critical_threshold` go into `critical` not `informational`)

**Product code** (Green):

- Pure function in `comms-age-bins.ts` partitioning by `(now - event.created_at)` against the two thresholds

**Acceptance**:

1. Unit tests pass
2. `pnpm test --filter @oaknational/agent-tools` exits 0
3. Whole tree green

**Reviewer dispatch**: `test-expert` (post-RED); `type-expert` (post-GREEN)

### Cycle 1.2: Shape-constraint validator

**Parallel-safety**: sequenced after `ws1-cycle-1` (shares same file family)

**File scope**:

- `agent-tools/tests/collaboration-state/comms-age-bins.unit.test.ts` (MODIFIED — add validator tests)
- `agent-tools/src/collaboration-state/comms-age-bins.ts` (MODIFIED — add `validateThresholds`)

**Test** (Red):

- `validateThresholds({ info, critical, absorptionPassCadence })` returns success on valid configs; returns structured error when:
  - `info >= critical`
  - `info <= 0` or `critical <= 0`
  - `critical - info < absorptionPassCadence`

**Product code** (Green):

- `validateThresholds` enforcing PDR-080 Invariant 4 shape constraints

**Acceptance**: as cycle 1.1, plus validator covers each named failure case

### Cycle 1.3: CLI wrapper

**Parallel-safety**: sequenced after `ws1-cycle-2`

**File scope**:

- `agent-tools/tests/collaboration-state/comms-age-bins.integration.test.ts` (NEW)
- `agent-tools/src/collaboration-state/cli/comms-age-bins.ts` (NEW)
- `agent-tools/src/bin/agent-tools.ts` (MODIFIED — register subcommand if dispatch is centralised; locate in WS1.3 execution)

**Test** (Red):

- Integration test runs CLI against a fixture comms directory; asserts bin counts in output
- Flag parsing: `--info-days N --critical-days M`; defaults; `--exit-on-critical` exit code behaviour
- Validator failures produce a structured error (non-zero exit) with the failing constraint named

**Product code** (Green):

- Thin CLI wrapper that reads comms directory, computes bins via `binCounts`, prints results, honours flags

**Acceptance**:

1. Integration test passes
2. Manual invocation against live `.agent/state/collaboration/comms/` returns sensible counts
3. `--help` output names the flags and the shape constraints
4. Whole tree green

**Deterministic validation**:

```bash
pnpm --filter @oaknational/agent-tools test
pnpm agent-tools:collaboration-state -- comms age-bins --help
# Expected: usage prints; exit 0
```

**Reviewer dispatch**: `code-expert` (post-GREEN); `type-expert` (cross-check inferred types from CLI parsing)

---

## WS2 — Doctrine Phenotype Propagation

Documentation-shaped workstream. Practice Core surface (`consolidate-docs/SKILL-CANONICAL.md`) edits + cross-reference sweep across reference docs.

### Cycle 2.1: SKILL §3a + §3 edits

**Parallel-safety**: sequenced after `ws1-cycle-3` (needs final CLI command name to cite)

**File scope**:

- `.agent/skills/consolidate-docs/SKILL-CANONICAL.md` (MODIFIED)

**Edits**:

- §3a body: rewrite "older than 7d → process+delete" to signal-triggered protocol citing the landed CLI command name (`pnpm agent-tools:collaboration-state -- comms age-bins` or final form)
- §3 line 212: reframe "events older than seven days are retention-processing inputs" → bin-signal language
- §3 lines 45-47: consolidation-trigger bullet swap from calendar-bounded to signal-driven
- Vocabulary swap "retention processing" → absorption-language throughout the touched sections
- Add reference to PDR-080 at first mention of the doctrine

**Acceptance**:

1. No calendar-cutoff language remains in the touched sections (`rg -n "older than seven days|7-day|7d cutoff" .agent/skills/consolidate-docs/SKILL-CANONICAL.md` returns zero hits in updated sections)
2. SKILL §3a cites the landed CLI command by exact name
3. PDR-080 referenced in §3 or §3a

**Code Sketch** (illustrative; final edits depend on cycle 1.3 command name):

```markdown
3a. **Run an absorption sweep when the comms accumulation signal fires.**
    At each consolidation pass, run `pnpm agent-tools:collaboration-state -- comms age-bins`
    to observe per-bin occupancy. When the informational bin or the
    critical bin is non-empty (per PDR-080 Invariant 2), treat the
    events in those bins as the absorption sweep's inputs:
    1. Read the event body and decide whether ...
    [steps 2-5 of existing sweep retained, vocabulary swap "retention processing" → "absorption"]
```

### Cycle 2.2: Cross-reference sweep + disposition log

**Parallel-safety**: parallel-safe with WS1 (different file scope)

**File scope** (target audit list):

- `.agent/reference/comms-watch-mechanism.md`
- `.agent/skills/session-handoff/SKILL-CANONICAL.md`
- `.agent/rules/use-agent-comms-log.md`
- `.agent/memory/active/distilled.md`
- `.agent/memory/active/napkin.md`
- `.agent/experience/2026-05-03-misty-two-agent-comms-reflection.md`
- Anywhere `rg -n "older than seven days|7-day cutoff|7d cutoff|retention processing" .agent/` surfaces hits

**Disposition log shape** (recorded in commit body or inline disposition file):

```text
file: <path>
hits: <line numbers + brief context>
disposition: update-in-this-cycle | historical-keep-as-is | flag-for-separate-cycle
rationale: <one line>
```

**Acceptance**:

1. Every grep hit has a recorded disposition
2. `update-in-this-cycle` hits land in this cycle's commit
3. `historical-keep-as-is` hits explicitly justified (e.g., experience-file artefacts that record what was true at the time)
4. `flag-for-separate-cycle` hits captured in pending-graduations.md with PDR-080 cross-reference

### Cycle 2.3: Sequential reviewer pass on SKILL edits

**Parallel-safety**: sequenced after `ws2-cycle-1` AND `ws2-cycle-2`

**Process**:

1. Dispatch `docs-adr-expert` on the SKILL edit diff; absorb verdict
2. If RATIFY-WITH-CONDITIONS, apply cures
3. Dispatch `assumptions-expert` on the post-cure version; absorb verdict
4. If RATIFY-WITH-CONDITIONS, apply cures and second-pass

**Acceptance**:

1. Both reviewers return RATIFY (or RATIFY-WITH-CONDITIONS where conditions are resolved within this cycle)
2. Reviewer transcript ids recorded in the commit body
3. No regressions surface in PDR-080 doctrine

---

## WS3 — Verification and Completion Broadcast

### Cycle 3.1: PDR-080 landing-health verification

**Parallel-safety**: parallel-safe (verification of already-landed work; no file scope conflicts)

**Checks**:

- Read `.agent/practice-core/decision-records/PDR-080-coordination-event-absorption-is-signal-driven.md`; verify content matches expected v3
- Verify all `Related` cross-references resolve to existing files (PDR-014, PDR-046, PDR-067, PDR-068, `practice-index.md`)
- Verify README index row (`grep PDR-080 .agent/practice-core/decision-records/README.md`)
- Check `practice-index.md` for any cross-reference need (substrate-implementation ADR pointer)

**Acceptance**:

1. Every cited file exists
2. README index row renders correctly
3. Any `practice-index.md` gap surfaced and routed (either fixed in this cycle or captured for separate cycle)

### Cycle 3.2: Completion broadcast + thread record update

**Parallel-safety**: gate-cycle; blocks on all WS1+WS2+WS3.1 cycles

**Actions**:

- Compose comms event announcing comms-log-care work complete
- Cite: PDR-080 landing event `1902efbf`, CLI commit (from WS1.3), SKILL edit commit (from WS2.1), cross-reference disposition commit (from WS2.2), reviewer transcript ids (from WS2.3)
- Send via `pnpm agent-tools:collaboration-state -- comms send`
- Update `.agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md` with the comms-log-care session-outcome summary

**Acceptance**:

1. Comms event lands (event id captured)
2. Thread record updated
3. Pending-graduations entries for PDR-080 follow-ons recorded

---

## Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

Per cycle:

```bash
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools lint
pnpm --filter @oaknational/agent-tools test
```

Final integrated gate (post-WS2):

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test
```

Skill / doctrine surface gates:

```bash
pnpm practice:fitness:informational
# Expected: PDR-080 landing reflected; no new alarms introduced by the SKILL edits
```

---

## Adversarial Review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

**Pre-WS1**: optional `assumptions-expert` pass on this plan body (proportionality check on the three-bin abstraction).

**Per-cycle**: as named in each cycle's "Reviewer dispatch" line.

**Post-WS3**: `release-readiness-expert` GO / GO-WITH-CONDITIONS / NO-GO if any cycle surfaces blocker-class findings; skipped if all cycles return clean.

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Mitigation |
|---|---|
| CLI command-name churn forces SKILL edit rework | Settle command name in `ws1-cycle-3` before starting `ws2-cycle-1`; reviewer dispatch on `ws1-cycle-3` includes naming review |
| Cross-reference sweep surfaces calendar-cutoff reference requiring broader doctrine change | Record in disposition log as `flag-for-separate-cycle`; do not expand scope here |
| `practice-index.md` cross-reference needed but not yet identified | `ws3-cycle-1` explicitly surfaces this; land in same cycle as `ws2-cycle-1` if small, else separate tranche |
| Sub-agent review on SKILL edits surfaces a regression in PDR-080 doctrine | Treat as a v4 PDR cure cycle; revise PDR-080 before SKILL edit lands; rare given v2/v3 review depth already completed |
| `agent-tools:collaboration-state` command tree refactor mid-plan changes the CLI registration surface | Locate the registration mechanism early in `ws1-cycle-3` execution; if refactor in flight elsewhere, sequence behind it |
| Plan-mode file vs repo plan conflation re-surfaces | This plan IS the durable contract; session-local plan-mode file in `~/.claude/plans/breezy-imagining-kettle.md` is the approval pointer to this file (one-way reference) |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- **principles.md** — long-term architectural excellence over short-term expediency; bin-signal is the simplest correct shape per PDR-080 design rationale
- **testing-strategy.md** — TDD cycle pairs for all WS1 product code; documentation cycles (WS2) explicitly non-TDD per template guidance; integration test at CLI surface covers WS1 end-to-end
- **schema-first-execution.md** — bin-counter input is the comms-event schema (already established by `comms-event.schema.json`); thresholds are config-shaped; no new schemas needed

---

## Plan-Body First-Principles Check

> See [`.agent/rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md)

Fires at:

- **Pre-execution**: before WS1 starts — verify the three-bin abstraction is still the shape PDR-080 names; verify CLI placement in `agent-tools/src/collaboration-state/` matches existing comms-CLI siblings
- **Mid-WS2**: before SKILL edit cycle 2.1 — verify CLI command name as cited in SKILL matches what `ws1-cycle-3` landed
- **Pre-WS3**: before completion broadcast — verify no scope creep accumulated; non-goals still respected

Vendor-literal clause: no vendor integration in scope.

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

- **PDR-080** already landed; no further PDR work in scope
- **SKILL** edits land in WS2 (the SKILL IS the canonical documentation home)
- **Reference docs** updated in WS2 cross-reference sweep where applicable
- **Thread record** updated in WS3 cycle 2

---

## Consolidation

After WS3 cycle 2 lands, run `oak-consolidate-docs` to:

- Graduate any settled patterns from this plan into `distilled.md`
- Capture PDR-080 follow-on flags in pending-graduations:
  - README PDR-shape contract update (Created / Last updated metadata)
  - PDR-067 amendment cycle (raw-event-stream vs rendered-log distinction)
- Capture the plan-mode-vs-repo-plan distinction as a graduation candidate (origin: this plan's metacognition pass at 2026-05-24)
- Archive this plan to `.agent/plans/agentic-engineering-enhancements/archive/completed/` once all WS complete

---

## Dependencies

**Blocking**: none (PDR-080 doctrine already landed; CLI workspace exists; SKILL exists)

**Related plans**:

- `.agent/plans/agentic-engineering-enhancements/roadmap.md` — this plan delivers a slice of the agentic-engineering-enhancements thread
- (None other in-flight that gate this work)

**Related doctrine**:

- `.agent/practice-core/decision-records/PDR-080-coordination-event-absorption-is-signal-driven.md`
- `.agent/practice-core/decision-records/PDR-067-surface-classification-for-fitness-response.md`
- `.agent/practice-core/decision-records/PDR-068-pipeline-back-pressure-as-structural-cure-signal.md`
- `.agent/practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md`

**Session-local approval artefact**: `~/.claude/plans/breezy-imagining-kettle.md` (plan-mode file from this session — pointer only; this plan is the durable contract)

---

## Readiness Reviewers

Before marking this plan READY FOR EXECUTION:

- `assumptions-expert` — plan-readiness, proportionality, build-vs-buy attestation (none applicable here — internal work)
- (Optional) `docs-adr-expert` — substrate-implementation pointer in `practice-index.md` if PDR-067/068 precedent suggests one is needed

---

## Proof Contract

| Acceptance id | Proof level | Command or observation |
|---|---|---|
| ws1-cycle-1 done | unit | `pnpm --filter @oaknational/agent-tools test` exits 0 with `binCounts` tests passing |
| ws1-cycle-2 done | unit | `validateThresholds` test cases pass |
| ws1-cycle-3 done | integration | CLI invocation against fixture dir reports correct counts; `--help` lists flags |
| ws2-cycle-1 done | non-code | `rg "PDR-080" .agent/skills/consolidate-docs/SKILL-CANONICAL.md` returns hits; calendar-cutoff hits zero in touched sections |
| ws2-cycle-2 done | non-code | Disposition log committed; every grep hit has a recorded disposition |
| ws2-cycle-3 done | non-code | Reviewer transcript ids in commit body; both reviewers RATIFY |
| ws3-cycle-1 done | non-code | All cited PDRs exist; README row renders |
| ws3-cycle-2 done | non-code | Comms event id captured; thread record updated; pending-graduations entries recorded |
