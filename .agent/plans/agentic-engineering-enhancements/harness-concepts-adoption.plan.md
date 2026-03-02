---
name: Harness Concepts Adoption for the Practice
overview: >
  Evaluate and adopt selected concepts from OpenAI's harness-engineering model
  in a way that strengthens the Practice without weakening blocking quality
  gates, schema-first constraints, or TDD discipline.
todos:
  - id: hc-baseline
    content: "Capture baseline metrics for docs freshness, cleanup velocity, and reviewer cycle time."
    status: pending
  - id: hc-safe-track
    content: "Implement the safest concepts first: doc freshness checks, doc gardening cadence, and small entropy-cleanup PR loops."
    status: pending
  - id: hc-best-track-design
    content: "Design high-upside concepts: task-scoped observability legibility, quality scoring model, and rule-promotion loop."
    status: pending
  - id: hc-best-track-pilot
    content: "Run bounded pilots for high-upside concepts with explicit rollback criteria."
    status: pending
  - id: hc-adoption-decision
    content: "Decide promote/adjust/reject per concept using evidence from pilot metrics."
    status: pending
---

# Harness Concepts Adoption for the Practice

## 1. Intent

Adopt selected concepts from an agent-first harness model to improve delivery
leverage while preserving the existing Practice's core guarantees:

- Blocking quality gates remain blocking
- TDD at unit/integration/E2E remains mandatory
- Schema-first type flow remains mandatory
- Architectural boundaries remain mechanically enforced

## 2. Hard Constraints

1. **No transferability leakage**: do not link to this plan from, or place
   repo-specific strategy content inside, `.agent/practice-core/*` documents.
   Practice-core artefacts must remain transferable to any repository.
2. **No gate relaxation**: do not introduce non-blocking shortcuts for checks
   currently defined as blocking.
3. **No compatibility-layer detours**: fix in place and keep architecture
   coherent.
4. **Evidence-first decisions**: each adoption decision must cite measurable
   impact and operational cost.

## 3. Scope

### In scope

- Adoption design and implementation for the concept set below.
- Bounded pilots with explicit success/failure criteria.
- Documentation updates in repository-specific locations (plans, operational
  docs, ADRs when architectural).

### Out of scope

- Rewriting Practice-core transfer artefacts around this plan.
- Relaxing existing quality-gate and testing rules.

## 4. Comparison Summary (Harness vs Practice)

### Core overlap

- Humans steer while agents execute implementation work.
- Repository-local, versioned artefacts are the system of record.
- Mechanical enforcement via linters and CI is central.
- Progressive disclosure outperforms a monolithic instruction file.
- Learning loops should encode feedback into rules, docs, and tooling.

### Key differences

- This Practice keeps quality gates blocking; the harness approach tolerates
  lighter merge gates with cheap follow-up correction.
- This Practice enforces explicit TDD across unit/integration/E2E; the harness
  approach emphasises autonomous validate/fix loops.
- This Practice uses a stricter governance structure (ADRs, directives, review
  matrix, lineage mechanisms).

## 5. Concept Portfolio

### 5.1 Safest concepts (adopt first)

1. **Automated docs freshness checks**
   - Add mechanical checks for stale links, stale cross-references, and
     required section integrity in high-signal docs.
2. **Doc-gardening cadence**
   - Scheduled agent run to detect drift and open small fix PRs.
3. **Entropy collection micro-PRs**
   - Recurring clean-up PRs for duplication, dead references, and minor
     consistency drift.
4. **Improved agent legibility maps**
   - Better indexing/discovery in repo docs outside transfer-only practice-core
     materials.

### 5.2 Best concepts (highest upside, pilot before broad rollout)

1. **Task-scoped observability legibility**
   - Expose per-task logs/metrics/traces in agent-accessible form to improve
     autonomous diagnosis and verification quality.
2. **Quality scoring by domain/layer**
   - Maintain a versioned quality ledger that tracks confidence, drift, and
     remediation priorities.
3. **Rule-promotion loop**
   - Convert recurring review comments into explicit, enforceable checks or
     structured guidance.
4. **Execution-plan lifecycle automation**
   - Increase automation for plan hygiene and extraction of durable knowledge
     into permanent docs.

## 6. Delivery Phases

### Phase 0 — Baseline

- Define baseline metrics and capture current values:
  - doc drift findings per week
  - average review turnaround for doc-related corrections
  - entropy cleanup volume (open vs resolved)
  - repeated reviewer comments by category

Exit criteria:

- Baseline artefact committed and reproducible metric collection process
  documented.

### Phase 1 — Safe Track Implementation

- Implement safest concepts in small, reversible steps.
- Run for two operational cycles.

Exit criteria:

- Reduction in stale-doc findings
- No increase in gate failures caused by automation noise
- Maintainers report lower manual docs maintenance burden

### Phase 2 — Best Track Design

- Produce implementation designs for best concepts with:
  - architecture boundaries
  - data-flow and ownership
  - failure modes and rollback strategy
  - incremental rollout path

Exit criteria:

- Reviewed design docs accepted for pilot.

### Phase 3 — Best Track Pilot

- Pilot one or two best concepts with bounded scope.
- Measure impact against baseline.

Exit criteria:

- Evidence supports promote/adjust/reject decision.

### Phase 4 — Adoption Decision

- Promote successful pilots to standard workflow.
- Archive or revise unsuccessful concepts with explicit rationale.

Exit criteria:

- Final decision log and follow-on plan(s) created as needed.

## 7. Measurement Definitions

- **Operational cycle**: one calendar week (Monday to Sunday).
- **Baseline window**: 4 operational cycles ending immediately before Phase 1
  starts.
- **Comparison window**: rolling 4 operational cycles after each phase.
- **Doc drift finding**: one actionable stale/incorrect docs issue opened in a
  tracked change request.
- **Repeated review comment**: same rule category repeated on at least two
  distinct PRs inside a 4-cycle window.

Phase 0 is the canonical location for executable collection commands and the
final frozen metric rubric.

## 8. Success Metrics

- At least 30% reduction in documentation drift findings over baseline window.
- At least 20% reduction in repeated review comments for recurring issues.
- No regression in quality-gate pass rate.
- No increase in unresolved operational risk categories.

## 9. Risks and Mitigations

1. **Automation churn noise**
   - Mitigation: constrain bot PR size and cadence; add clear ownership.
2. **Metric gaming**
   - Mitigation: pair quantitative metrics with qualitative review sampling.
3. **Overfitting to one agent workflow**
   - Mitigation: keep interfaces and rules tool-agnostic where practical.
4. **Accidental pressure to relax gates**
   - Mitigation: explicit non-negotiable constraints in all phase plans.

## 10. Evidence Requirements

Any claim that a concept is "safe", "effective", or "ready for rollout" must
include:

- command or run reference
- measurable output summary
- changed artefact references
- observed trade-offs and unresolved risks

## 11. Next Actions

1. Execute Phase 0 baseline work using
   `.agent/plans/agentic-engineering-enhancements/active/phase-0-baseline-metrics.plan.md`.
2. Implement Phase 1 safe-track items in smallest viable increments.
3. Schedule a review checkpoint after two cycles before Phase 2 starts.
