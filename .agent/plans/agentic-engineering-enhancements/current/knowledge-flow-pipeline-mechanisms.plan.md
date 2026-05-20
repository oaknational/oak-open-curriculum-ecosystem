---
name: 'Knowledge-Flow Pipeline Mechanisms'
overview: >-
  Six mechanisms that repair the knowledge-flow pipeline's flow-control
  function — producer-side capture-shape contract, consumer-side trigger-scan
  cadence, drain pass for existing buffer backlog, ADR-144 surface-
  classification amendment, workflow-step verification reflex rule, and a
  doctrine-graduation lane for the five PDR candidates this session emitted.
todos:
  - id: ws1-buffer-shape-contract
    content: 'WS1: producer-side buffer-shape contract — amend session-handoff step 6b + consolidate-docs steps 5/7a to require buffer-shape entries (tag header + ≤15 lines of trigger-to-watch-for); add new rule `.agent/rules/buffer-shape-contract.md` operationalising the four-surface-kind classification.'
    status: pending
  - id: ws2-trigger-scan-cadence
    content: 'WS2: consumer-side trigger-scan cadence — add a session-handoff sub-step or new small skill (`jc-graduation-scan`) that re-checks pending-graduation triggers against current session evidence in ≤5 minutes; rule for recurring-signal tripwire (when a signal recurs, the doctrine answer is itself a candidate failure mode).'
    status: pending
  - id: ws3-drain-existing-backlog
    content: 'WS3: drain pass for the existing pending-graduations.md backlog (~25 entries) — audit each into ripe-now / genuinely-trigger-gated / stale-trigger; route ripe to graduation, compress others to buffer-shape, archive stale to dated archive snapshot per the file’s split_strategy.'
    status: pending
  - id: ws4-adr144-surface-classification
    content: 'WS4: amend ADR-144 to add the four-surface-kind classification (memory/state/buffer/doctrine) with response-menu routing per surface kind; makes the Learning Preservation rule’s scope explicit (memory + state surfaces, not buffer surfaces).'
    status: pending
  - id: ws5-declared-steps-evidence-rule
    content: 'WS5: new rule `.agent/rules/declared-workflow-steps-require-evidence.md` — declaring a workflow step done requires evidence of having performed it, not pattern-match on the step description; generalisation of the per-user-memory sweep failure mode that recurred 2026-05-17 → 2026-05-18.'
    status: pending
  - id: ws6-pdr-drafting-lane
    content: 'WS6: PDR-drafting lane for the five PDR candidates currently in pending-graduations from the 2026-05-17/18 sessions (surface-classification, pipeline-back-pressure, cognitive-approach-diversity, metacognition-two-modes, per-user-memory-is-a-buffer). Land when triggers fire; not in scope for first execution.'
    status: pending
---

# Knowledge-Flow Pipeline Mechanisms

**Last Updated**: 2026-05-20 (Shaded Creeping Cloak / claude / opus-4-7-1m / 4ef359)
**Status**: 🟠 PARKED BY OWNER DIRECTION — owner direction 2026-05-20: "park the whole plan, we will revisit after we get back to the graph tooling work". The pending-graduations.md back-pressure signal remains as the validator continues to flash; structural cure deferred until graph tooling resumes. First executable slice when reopened remains WS3 (drain pass). Strategic-routing decisions in the plan stand; this is a scheduling park, not a scope change.
**Scope**: Six mechanisms (WS1–WS6) that repair the knowledge-flow pipeline's flow-control function across producer (capture-shape contract), consumer (trigger-scan cadence + recurring-signal tripwire), backlog (drain pass), doctrine (ADR-144 amendment), enforcement (workflow-step-evidence rule), and ratification (PDR-drafting lane for emitted candidates).

---

## Context

Two 2026-05-17 metacognition passes uncovered that the `capture → distil → graduate → enforce` pipeline (PDR-011) has been operating as a broken accumulator on at least two buffer surfaces simultaneously: `.agent/memory/operational/pending-graduations.md` (in-repo buffer at 3635 lines against ~1500–2150 expected envelope) and `~/.claude/projects/<project>/memory/` (Claude per-user platform-specific buffer treated as a personal accumulator instead of as the drainage source the workflows name).

Owner reframes 2026-05-17:

- *"that is ridiculous, that is an essay, pending graduation is a buffer location until write, not a dumping ground"*
- *"500 soft limit, 750 hard limit, and we revisit the pipeline to figure out why it has become a broken accumulator in the system instead of a flow control mechanism to balance back pressure"*
- *"part of the function of the session handoff and the document consolidation flows is to sweep vendor specific memories and integrate them into our learning loop, so that all agents working on the repo can benefit from the understanding"*

The substance-level cures landed in commit `a4184f79` (in-repo distilled.md surface-classification + pipeline-back-pressure entries) and `29a8fe16` (per-user memory integration addendum). What remains is the **mechanisms** layer — the structural changes that prevent the failure modes from recurring without owner correction.

This plan is the structural-mechanisms layer; the substance-doctrine layer is already in `.agent/memory/active/distilled.md` §"Recently Distilled — 2026-05-17 Swift Winging Gust pipeline-reframe" and in the five PDR candidates currently in `pending-graduations.md`.

## First-Principles Justification

Each WS exists because a specific failure mode recurred this session. Naming the failure mode and the mechanism that prevents recurrence:

**WS1 (producer-side capture-shape contract)**: failure mode is **doctrine-drafting in the buffer** — per-entry pending-graduation substance has grown to 60–150 lines, with full function-tests and Recommended-shape verdicts. The writer used the buffer as a draft surface for the eventual ADR/PDR substance. Mechanism: a buffer-shape contract enforced at capture time (`session-handoff` step 6b + `consolidate-docs` steps 5/7a) caps entries at tag-header + ≤15 lines. Doctrine drafting happens at the target home, not the buffer.

**WS2 (consumer-side trigger-scan cadence)**: failure mode is **consumer-rate falls behind producer-rate** because graduation only fires at full consolidation passes. Triggers that fire silently in non-consolidation sessions are not detected; entries persist past their natural graduation moment. Mechanism: a lighter-weight `jc-graduation-scan` skill (or session-handoff sub-step) that re-checks pending-graduation triggers in ≤5 minutes against the session's evidence. The recurring-signal-tripwire rule is the doctrine-grade form: when a signal recurs, the doctrine answer is itself a candidate failure mode.

**WS3 (drain pass for existing backlog)**: failure mode is **accumulated backlog from prior pipeline failure**. Cannot be cured by the producer/consumer mechanisms alone — the existing ~25 entries need disposition before steady-state behaviour can hold. Mechanism: audit each entry into three buckets (ripe-now / genuinely-trigger-gated / stale-trigger), route ripe entries to graduation, compress others to buffer-shape, archive stale to dated archive per `pending-graduations.md` §`split_strategy`.

**WS4 (ADR-144 surface classification)**: failure mode is **substance-preservation rule over-applied to buffer surfaces** (the original 2026-05-17 miss). ADR-144's response menu currently treats all fitness signals alike. Mechanism: amend ADR-144 to surface-classify (memory / state / buffer / doctrine) with per-surface response routing. The Learning Preservation rule's scope becomes explicit: it applies to memory and state surfaces, with buffer surfaces routed to pipeline-diagnostic responses instead.

**WS5 (declared-workflow-steps-require-evidence rule)**: failure mode is **pattern-matching the step description instead of performing the step**. Worked instances: 2026-05-17 declared `consolidate-docs` step 3 done without sweeping per-user memory; the next session repeated the same shape until owner correction. Mechanism: doctrine-grade rule that declaring a workflow step done requires evidence of having performed it (artefact, command output, or named negative finding), not pattern-match on memory of what the step says.

**WS6 (PDR-drafting lane)**: failure mode is **PDR candidates accumulate in the buffer without ratification** because PDR drafting is itself heavy work and naturally deferred. Mechanism: a named lane that lands the five 2026-05-17/18 candidates as PDRs when their triggers fire, with explicit acceptance criteria.

## Workstreams

### WS1: Producer-side buffer-shape contract

**Status**: pending — depends on WS4 doctrinal foundation if owner wants the surface-classification rule landed first; otherwise can land independently with self-justifying rationale.

**Files**:

- `.agent/skills/session-handoff/SKILL-CANONICAL.md` — amend step 6b ("Surface ADR/PDR candidates") to add: *"Buffer-shape contract: register entries carry tag header + ≤15 lines of trigger-to-watch-for; doctrine substance drafting happens at the target home (ADR / PDR / rule / distilled.md), not in the buffer entry."*
- `.agent/skills/consolidate-docs/SKILL-CANONICAL.md` — amend steps 5 and 7a similarly.
- `.agent/rules/buffer-shape-contract.md` — new rule citing PDR-046 (Layered Knowledge Processing) and PDR-011 (Continuity Surfaces). Body: enumerates the four surface kinds (memory / state / buffer / doctrine); names the per-surface response to fitness pressure; cites the worked 2026-05-17 instance.
- `RULES_INDEX.md` — add new rule entry.

**Acceptance**:

- New rule file exists, cites authority PDRs, enumerates the four surface kinds with response-menu routing.
- Both skill files reference the rule at the capture-time step.
- Three existing 2026-05-17 buffer entries already demonstrate the contract by example; rule cites them as canonical exemplars.

**Validation**: `pnpm portability:check` passes (rule has cross-platform adapters); `pnpm subagents:check` passes; `pnpm practice:fitness:strict-hard` passes on the touched files.

### WS2: Consumer-side trigger-scan cadence

**Status**: pending — depends on WS1 buffer-shape contract for trigger-condition clarity.

**Two candidate shapes; owner selects at execution time**:

- **Shape A — new small skill `jc-graduation-scan`**: 5-minute scan that any session can invoke voluntarily; reads pending-graduations.md, surfaces entries whose triggers may have fired in this session's evidence (commits, comms, distilled.md additions); routes findings as a candidate list for the agent to act on.
- **Shape B — new sub-step in session-handoff**: lighter-weight, fires automatically as part of step 7a; same surface scan, no separate skill.

Shape A keeps session-handoff lightweight; Shape B guarantees the scan fires every session. Owner-decision input needed before execution.

**Recurring-signal tripwire rule** (lands regardless of Shape A/B): `.agent/rules/recurring-signal-is-doctrine-candidate-failure.md` — when a fitness signal, correction, or pending-graduation entry recurs (≥2 instances of the same shape), the doctrine answer applied previously is itself a candidate failure mode; the response is upstream-cause diagnosis, not menu-application.

**Acceptance**: new skill or sub-step exists with explicit ≤5-minute scope; recurring-signal tripwire rule exists with cross-platform adapters; both reference the source 2026-05-17 instance as worked example.

**Validation**: `pnpm portability:check` + `pnpm practice:fitness:strict-hard`.

### WS3: Drain pass for existing pending-graduations backlog

**Status**: pending — **first executable slice** for this plan; can land before WS1/WS2/WS4 doctrinal decisions because it operates on the existing backlog at current rules.

**Inputs**: existing `.agent/memory/operational/pending-graduations.md` with ~25 active entries (post-2026-05-17 graduations marked).

**Process**:

1. Enumerate every `###` (h3) candidate entry under §`pending`.
2. For each, classify into one of three buckets:
   - **Ripe-now**: substance is mature, trigger has effectively fired, destination is clear. Action: graduate to permanent home (ADR / PDR / rule / governance doc / distilled.md) in the same pass; mark entry as graduated with evidence.
   - **Genuinely-trigger-gated**: trigger condition is genuinely cross-session and has not fired. Action: compress entry to buffer-shape (tag header + ≤15 lines of trigger-to-watch-for) if currently larger.
   - **Stale-trigger**: trigger condition is unscannable (vague "owner-direction" with no owner contact in 7+ days) OR the substance has been overtaken by other graduations OR the candidate is no longer relevant. Action: archive to `.agent/memory/operational/archive/pending-graduations-drained-2026-05-XX.md` with a brief disposition note.

3. After all entries processed, run `pnpm practice:fitness:strict-hard` and confirm `pending-graduations.md` is within envelope (target 500 lines, limit 750).

**Acceptance**: `pending-graduations.md` ≤ 750 lines; every remaining entry is buffer-shape; archive file carries the dispositions.

**Validation**: fitness validator green on `pending-graduations.md`; spot-check that no graduated substance lives only in the archive (it must also live at its permanent home).

### WS4: ADR-144 surface-classification amendment

**Status**: pending — doctrinal decision; needs owner per-diff review per Practice Core care-and-consult posture for ADR amendments.

**Files**:

- `docs/architecture/architectural-decisions/144-*.md` (ADR-144) — amend §Decision (or add new section) introducing the four-surface-kind classification with per-surface fitness-response routing:
  - Memory (napkin / distilled / patterns) → graduate upward per PDR-046 Move 3
  - State (repo-continuity / threads / claims / conversations / comms log) → archive historical prose per `split_strategy`
  - Buffer (pending-graduations / capture queues) → pipeline diagnostic at producer or consumer; never extend buffer
  - Doctrine (ADRs / PDRs / rules / principles / governance docs) → split along axis when outgrown

- `.agent/directives/principles.md` — verify the Learning Preservation rule's text doesn't conflict with the new buffer-surface routing; if it does, add a one-sentence "applies to memory and state surfaces; buffer surfaces route to pipeline diagnostic" qualifier.

**Acceptance**: ADR-144 amendment landed; principles.md aligned; both cite the 2026-05-17 worked instance.

**Validation**: `pnpm practice:fitness:strict-hard` + `pnpm practice:vocabulary` + cross-reference verification (rule files citing ADR-144 still resolve).

### WS5: Declared-workflow-steps-require-evidence rule

**Status**: pending — small, owner-direction-gated rule landing.

**Files**:

- `.agent/rules/declared-workflow-steps-require-evidence.md` — new rule. Body: declaring a workflow step done (session-handoff step N, consolidate-docs step M) requires evidence of having performed it — an artefact pointer, a command-output reference, or an explicit negative finding ("scanned X, no cross-cutting substance found"). Pattern-match on memory of the step description is not evidence.
- `RULES_INDEX.md` — add entry.

**Worked instances** (cited in rule body):

- 2026-05-17 Swift Winging Gust declared `consolidate-docs` step 3 done while only processing in-repo surfaces; owner correction next session.
- 2026-05-17 Swift Winging Gust declared `session-handoff` step 6 done (per-user memory sweep) without opening the per-user memory directory.

**Acceptance**: rule exists with cross-platform adapters; references at least the two named worked instances; cites PDR-029 (perturbation mechanism bundle — the passive-guidance-loses-to-artefact-gravity pattern).

**Validation**: `pnpm portability:check` + `pnpm subagents:check`.

### WS6: PDR-drafting lane for emitted candidates

**Status**: pending — not in scope for first execution. Land each candidate when its trigger fires.

**Candidates currently in `pending-graduations.md`** (all 2026-05-17 captured):

1. `pdr:surface-classification-for-fitness-response`
2. `pdr:pipeline-back-pressure-is-structural-cure-signal`
3. `pdr:cognitive-approach-diversity-in-agent-owner-pairs`
4. `pdr:metacognition-two-modes`
5. `pdr:per-user-memory-is-a-buffer`

**Trigger conditions**: owner-direction OR second-instance evidence in a future session. PDR drafting itself is heavy work and naturally deferred; the lane exists so the candidates don't accumulate indefinitely in the buffer.

**Acceptance per candidate**: PDR exists in `.agent/practice-core/decision-records/PDR-NNN-<slug>.md`; pending-graduation entry marked graduated with cross-reference; in-repo distilled.md entry refined to back-cite the PDR.

**Validation**: `pnpm practice:fitness:strict-hard` per landing.

## Sequencing

Owner-direction selects. Suggested order:

1. **WS3 (drain pass)** — establishes the steady-state baseline; can run before doctrinal decisions because it operates on the current backlog with current rules.
2. **WS4 (ADR-144 amendment)** — codifies the surface-classification foundation that WS1/WS2 build on.
3. **WS1 (buffer-shape contract)** — depends on WS4 for the doctrinal source.
4. **WS2 (trigger-scan cadence)** — depends on WS1 for trigger-condition clarity.
5. **WS5 (declared-steps-evidence rule)** — independent; can land any time.
6. **WS6 (PDR drafting)** — opportunistic per trigger firing.

## Non-goals

- Not in scope: re-architecting `pending-graduations.md` into a database or any non-markdown format. The buffer remains a markdown file with frontmatter and structured entries.
- Not in scope: automated trigger-firing detection (e.g. a CI job that scans for fired triggers). Trigger-scan is an agent-time activity, not infrastructure.
- Not in scope: retroactive cleanup of other vendor-specific memory surfaces. Cursor and Codex per-user memory drainage is owned by agents on those platforms during their own `consolidate-docs` step 3 passes.

## Cross-references

- Source distilled entries: `.agent/memory/active/distilled.md` §"Recently Distilled — 2026-05-17 Swift Winging Gust pipeline-reframe" (four sub-entries: surface classification, pipeline back-pressure, cognitive-approach diversity, metacognition two modes, per-user memory is a buffer).
- Source PDR candidates: `.agent/memory/operational/pending-graduations.md` (five entries 2026-05-17).
- Source workflows: `.agent/skills/session-handoff/SKILL-CANONICAL.md` step 6; `.agent/skills/consolidate-docs/SKILL-CANONICAL.md` step 3.
- Authority PDRs: PDR-011 (capture → distil → graduate → enforce pipeline), PDR-029 (perturbation mechanism bundle / passive-guidance-loses-to-artefact-gravity), PDR-046 (Layered Knowledge Processing — Preserve First, Restructure Second), PDR-057 (apply-don't-ask / empirical-answerability), PDR-058 (stop-inventing-optionality).
- Companion ADR: ADR-144 (fitness three-zone model + Loop Health) — amended by WS4.
- Prior closed plan: `.agent/plans/agentic-engineering-enhancements/current/doctrine-enforcement-quick-wins.plan.md` (COMPLETE) — established the doctrine-enforcement pattern WS1/WS2/WS5 build on.
