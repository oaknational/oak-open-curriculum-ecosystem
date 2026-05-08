---
name: "PR 102 Graph Decision-Complete Closeout"
overview: "Final pre-merge planning session for PR #102: integrate remaining graph findings, resolve the EEF contradiction, close open questions, and prove the graph MVP plans are decision-complete before merge."
type: planning-closeout
status: current
source_pr: 102
thread: connecting-oak-resources
landing_target_per_pdr_026: "PR #102 graph MVP planning artefacts are decision-complete before merge, with every remaining finding either absorbed into its owning artefact or explicitly owner-resolved."
primary_artefacts:
  - .agent/plans/graph-mvp-arc.plan.md
  - .agent/plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md
  - .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md
  - .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/oak-kg-threads-surface.plan.md
  - .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/oak-misconceptions-subgraph-mcp-surface.plan.md
  - .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/oak-misconceptions-eef-cross-corpus-surface.plan.md
  - docs/architecture/architectural-decisions/173-graph-stack-topology.md
out_of_scope:
  - Slice implementation.
  - Production code changes.
  - graph-stack CURRENT to ACTIVE promotion.
  - ADR-173 ratification.
  - Re-running the superseded 2026-05-08 specialist-review opener.
todos:
  - id: phase-0-refresh-and-guard
    content: "Refresh PR #102 branch/check/comment/Sonar state and confirm the closeout is still planning-only before editing."
    status: pending
  - id: phase-1-integrate-topology-findings
    content: "Absorb graph-stack/ADR-173 topology findings: WS4 sequencing and practice-graph workspace tier."
    status: pending
  - id: phase-2-integrate-slice-findings
    content: "Absorb the four remaining Phase 4 slice-plan findings into the owning slice plans."
    status: pending
  - id: phase-3-resolve-eef-contradiction
    content: "Present the EEF t19 vs promotion-trigger contradiction as an owner decision, apply the chosen resolution to slice 1, and propagate downstream references."
    status: pending
  - id: phase-4-question-sweep
    content: "Sweep the spine, slice plans, graph-stack plan, ADR-173, and thread records for open questions, stale blockers, and ambiguous gates."
    status: pending
  - id: phase-5-decision-complete-verification
    content: "Run deterministic documentation checks plus PR/Sonar/comment verification and record the decision-complete verdict."
    status: pending
---

# PR 102 Graph Decision-Complete Closeout

## Session Intent

PR #102 is technically merge-ready, but owner direction on 2026-05-08 tightened
the merge gate: the graph plans must be finalised and decision-complete before
the PR merges. This plan is the final pre-merge planning session. It does not
start graph implementation.

The session succeeds only when every known topology, slice-plan, and EEF
contradiction finding is either absorbed into the authoritative artefact or
explicitly owner-resolved, and the remaining graph MVP plans have no hidden
"ready enough" caveats.

## Known Inputs

- PR #102 closeout is green on
  `a8ef3ad1be343d2b786416ce12dcfeca270fb56e`: GitHub checks passed, Sonar
  quality gate is `OK`, open Sonar issues are `0`, and unresolved review
  threads are `0`.
- The branch diff is intentionally broad: graph MVP/ADR/planning surfaces,
  branch-touched-files tooling, Oak ESLint hardening, search/codegen cleanup,
  and collaboration-state continuity.
- The superseded specialist-review opener has already served its purpose. Do
  not rerun it; use the captured findings below as the source of truth.

## Findings To Integrate

### Topology Findings

1. **WS4 sequencing blocker**: `graph-stack.plan.md` sequences the
   Oak-specific `ws4-skos-extractor` before
   `ws4-graph-corpus-sdk-scaffold`, which leaks consumer/domain work into the
   substrate. Reorder so the consumer SDK scaffold lands first and the SKOS
   extractor lives in the consumer SDK.
2. **`practice-graph` workspace tier finding**: ADR-173/graph-stack topology
   places `practice-graph` under `packages/libs/`, but the package is a
   domain consumer rather than pure substrate. Decide and record whether it
   belongs under `packages/sdks/` or `packages/apps/`.

### Slice-Plan Findings

1. **Slice 2 adapter timing**:
   `oak-kg-threads-surface.plan.md` says the ontology adapter lands in
   "Inc.2 or early Inc.3", while `graph-stack.plan.md` names it only in
   Inc.3. Make the gate single-valued.
2. **Slice 3a topic-context ambiguity**:
   `oak-misconceptions-subgraph-mcp-surface.plan.md` acceptance text mentions
   "topic context" while the non-goals cut topic-string sub-graph. Tighten to
   thread/unit context.
3. **Slice 3a budget and fixture concreteness**:
   Replace "standard context windows" and "N representative responses" with a
   numeric token budget and fixture-selection rule.
4. **Slice 3b implementation-audit test shape**:
   Move file-scope/import/complexity assertions to lint or architecture gates,
   and keep TDD cycles focused on behavioural state.

### Owner-Owned Contradiction

`eef-evidence-corpus.plan.md` t19 says LLM/outcome verification is out of
scope until evaluation infrastructure exists, while the promotion trigger and
closing acceptance language treat outcome conditions as load-bearing. Slice 1
is the EEF plan, so the MVP cannot be decision-complete until this is resolved.

The final session should present two explicit resolution shapes:

- **Recommended unless owner says otherwise**: keep t19's out-of-scope position
  and remove outcome-condition language from the promotion trigger/closing
  acceptance lines. The slice can still require source fidelity, citation
  discipline, response-shape checks, freshness gates, and deterministic
  integration tests.
- **Alternative**: make outcome verification load-bearing now, revise t19, and
  add concrete evaluation infrastructure/scope before slice 1 can execute.

If the owner is unavailable, the session cannot honestly declare
decision-complete. It must stop with the contradiction still named as the
single blocker.

## Execution Plan

### Phase 0: Refresh And Guard

Refresh current evidence before editing:

```bash
git fetch origin main
git diff --stat origin/main...HEAD
gh pr view 102 --json headRefOid,mergeStateStatus,statusCheckRollup,title,body
gh pr checks 102
```

Also re-check Sonar quality gate and open PR issues through Sonar MCP.

Acceptance:

- PR remains green or any new non-green state is named before plan edits.
- Session scope is still planning-only; no production code changes are made.
- Existing unrelated working-tree changes are identified and left alone.

### Phase 1: Integrate Topology Findings

Edit `graph-stack.plan.md` and ADR-173 together:

- Reorder WS4 so `ws4-graph-corpus-sdk-scaffold` precedes the SKOS extractor.
- Locate the SKOS extractor in the Oak consumer SDK, not a substrate workspace.
- Resolve `practice-graph` tier semantics in both plan and ADR.
- Update any owner-decision log or risk table entries that still describe the
  findings as deferred.

Acceptance:

- No topology finding remains described as future execution-prep work.
- ADR-173 and `graph-stack.plan.md` agree on workspace tier and sequencing.

### Phase 2: Integrate Slice-Plan Findings

Edit the three slice plans at their owning point:

- Slice 2: adapter timing matches the topology plan.
- Slice 3a: topic context is replaced with thread/unit context.
- Slice 3a: numeric budget and representative-fixture rule are explicit.
- Slice 3b: behavioural tests carry behaviour; structural constraints move to
  lint/architecture gate text.

Acceptance:

- Each finding is visibly absorbed where a future implementer would look first.
- No slice plan retains an unresolved reviewer finding from Phase 4.

### Phase 3: Resolve The EEF Contradiction

Ask for the owner decision using the two resolution shapes above. Then edit
`eef-evidence-corpus.plan.md`, the graph spine, and downstream slice references
so they all carry the chosen answer.

Acceptance:

- t19, the promotion trigger, closing acceptance language, and slice 3b's risk
  row no longer contradict each other.
- If the recommended resolution lands, outcome verification is explicitly
  deferred behind evaluation infrastructure and is not a slice-1 execution
  gate.
- If the alternative lands, evaluation infrastructure is concretely scoped and
  the implementation session is not authorised until that scope is satisfied.

### Phase 4: Question Sweep

Search the authoritative artefacts for unresolved language:

```bash
rg -n "BLOCKER|FINDING|contradiction|owner-resolve|open question|TBD|TODO|ready enough|deferred|future execution-prep" \
  .agent/plans/graph-mvp-arc.plan.md \
  .agent/plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md \
  .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md \
  .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/oak-kg-threads-surface.plan.md \
  .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/oak-misconceptions-subgraph-mcp-surface.plan.md \
  .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/oak-misconceptions-eef-cross-corpus-surface.plan.md \
  docs/architecture/architectural-decisions/173-graph-stack-topology.md
```

Classify each hit as one of:

- resolved historical note;
- intentional future scope with a concrete gate;
- live blocker that prevents decision-complete.

Acceptance:

- No live blocker remains unnamed.
- Intentional future scope is gate-relative or tripwire-relative, never bare
  "deferred".

### Phase 5: Decision-Complete Verification

Run deterministic checks appropriate for a planning-only closeout:

```bash
pnpm markdownlint-check:root
pnpm format-check:root
git diff --check
gh pr checks 102
```

Also re-check:

- unresolved PR review threads = `0`;
- Sonar quality gate = `OK`;
- open Sonar PR issues = `0`;
- PR merge state is clean or any non-clean state is unrelated to graph plan
  decision-completeness and explicitly named.

Acceptance:

- Update this plan to `status: completed`.
- Update the `connecting-oak-resources` thread record with the exact
  decision-complete verdict.
- Update PR #102 body if the validation/intent text changes.
- Commit and push the planning closeout before merge.

## Final Verdict Format

Use this exact shape in the thread record and final reply:

```text
Decision-complete: YES/NO
Merge-ready with respect to graph planning: YES/NO
Remaining blockers: <none | named list>
Owner decisions resolved: <list>
Validation: <commands/checks>
Next safe step after merge: <implementation-prep or named blocked action>
```
