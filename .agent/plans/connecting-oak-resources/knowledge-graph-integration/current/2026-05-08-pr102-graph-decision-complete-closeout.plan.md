---
name: "PR 102 Graph Decision-Complete Closeout"
overview: "Final pre-merge planning-only session for PR #102: integrate remaining graph findings, apply the latest EEF structural-only evaluation decision, close open questions, and prove the graph MVP plans are decision-complete before merge."
type: planning-closeout
status: completed
source_pr: 102
thread: connecting-oak-resources
landing_target_per_pdr_026: "PR #102 graph MVP planning artefacts are decision-complete before merge, with every remaining finding either absorbed into its owning artefact, explicitly rejected with rationale, or routed to a named follow-on plan."
primary_artefacts:
  - .agent/plans/graph-mvp-arc.plan.md
  - .agent/plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md
  - .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/graph-stack.plan.md
  - .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/oak-kg-threads-surface.plan.md
  - .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/oak-misconceptions-subgraph-mcp-surface.plan.md
  - .agent/plans/connecting-oak-resources/knowledge-graph-integration/current/oak-misconceptions-eef-cross-corpus-surface.plan.md
  - .agent/plans/agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md
  - .agent/plans/agent-tooling/future/agent-graphs-workspace-organisation.plan.md
  - .agent/plans/graph-portfolio-index.md
  - .agent/memory/operational/threads/connecting-oak-resources.next-session.md
  - .agent/memory/operational/threads/eef.next-session.md
  - .agent/memory/operational/repo-continuity.md
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
    status: completed
  - id: phase-1-integrate-topology-findings
    content: "Absorb graph-stack/ADR-173 topology findings: WS4 sequencing and practice-graph workspace tier."
    status: completed
  - id: phase-2-integrate-slice-findings
    content: "Absorb the four remaining Phase 4 slice-plan findings into the owning slice plans."
    status: completed
  - id: phase-3-apply-eef-evaluation-decision
    content: "Apply the latest owner decision for EEF evaluation: structural citation/data/freshness/MCP-shape verification is load-bearing now; LLM/outcome evaluation is a follow-on behind dedicated evaluation infrastructure."
    status: completed
  - id: phase-4-question-sweep
    content: "Sweep the spine, slice plans, graph-stack plan, ADR-173, and thread records for open questions, stale blockers, and ambiguous gates."
    status: completed
  - id: phase-5-decision-complete-verification
    content: "Run deterministic documentation checks plus PR/Sonar/comment/thread verification, branch-scope measurement, and pre-merge divergence analysis; record the decision-complete verdict."
    status: completed
---

# PR 102 Graph Decision-Complete Closeout

## Session Intent

PR #102 is technically close to merge-ready, but owner direction on
2026-05-08 tightened the merge gate: the graph plans must be finalised and
decision-complete before the PR merges. This plan is the final pre-merge
planning session. It does not start graph implementation.

The latest owner clarification supersedes older notes: EEF slice 1 proves the
structural substrate now (citations, caveats, data coverage, freshness, MCP
shape), while LLM/outcome evaluation is sequenced as follow-on evaluation
infrastructure. The session succeeds only when every known topology, slice-plan,
and evaluation-stance finding is either absorbed into the authoritative
artefact or explicitly routed to a named follow-on plan, and the remaining graph
MVP plans have no hidden "ready enough" caveats.

## Known Inputs

- PR #102 latest pushed/refreshed head before this local closeout bundle is
  `d5e32a3c7ba47f3f21de138c7752afb8d6362171`: GitHub checks passed, Sonar
  quality gate is `OK`, open Sonar PR issues are `0`, and zero Sonar hotspots
  are `TO_REVIEW`. This evidence must be refreshed after the closeout bundle is
  committed and pushed; it does not yet cover the local planning-doc edits.
- One live GitHub review thread remains at refresh time: Copilot's
  `emit-index.ts` generated-message whitespace comment. This closeout is
  planning-only, so the thread must be classified explicitly before any merge
  verdict; it is not silently fixed as part of graph-plan closeout.
- The branch diff is intentionally broad and above the pre-merge divergence
  threshold: branch-touched-files reports `107` touched files against
  `origin/main`. A divergence analysis is required before merge.
- The superseded specialist-review opener has already served its purpose. Do
  not rerun it; use the captured findings below as the source of truth.
- Unrelated local surfaces remain protected: `.agent/plans/notes/` and
  `.agent/research/agentic-engineering/standardising-skills.md` are not part of
  this closeout.

## Findings To Integrate

### Topology Findings

1. **WS4 sequencing blocker**: `graph-stack.plan.md` sequences the
   Oak-specific `ws4-skos-extractor` before
   `ws4-graph-corpus-sdk-scaffold`, which leaks consumer/domain work into the
   substrate. Reorder so the consumer SDK scaffold lands first and the SKOS
   extractor lives in the consumer SDK.
2. **`practice-graph` workspace tier finding**: ADR-173/graph-stack topology
   places `practice-graph` under `packages/libs/`, but the package is a
   practice-facing agent/tooling consumer rather than pure substrate. Owner
   decision: plan it under the new top-level `agent-graphs/practice-graph/`
   area and add a future plan for creating the `agent-graphs/` organisation
   and workspace wiring.

### Slice-Plan Findings

1. **Slice 2 adapter timing**:
   `oak-kg-threads-surface.plan.md` says the ontology adapter lands in
   "Inc.2 or early Inc.3", while `graph-stack.plan.md` names it only in
   Inc.3. Make the gate single-valued.
2. **Slice 3a topic-context ambiguity**:
   `oak-misconceptions-subgraph-mcp-surface.plan.md` acceptance text mentions
   "topic context" while the non-goals cut topic-string sub-graph. Tighten to
   Thread IRI context, with Unit IRI context only if the optional unit variant
   is explicitly authorised.
3. **Slice 3a budget and fixture concreteness**:
   Replace "standard context windows" and "N representative responses" with a
   numeric token budget (`maxResponseTokens = 16000`) and a deterministic
   `20`-context fixture-selection rule based on reachable-misconception counts.
4. **Slice 3b implementation-audit test shape**:
   Move file-scope/import/complexity assertions to lint or architecture gates,
   and keep TDD cycles focused on behavioural state.

### EEF Evaluation Decision To Apply

`eef-evidence-corpus.plan.md` t19 says LLM/outcome verification is out of
scope until evaluation infrastructure exists, while older promotion-trigger and
closing acceptance language treated outcome conditions as load-bearing. The
latest owner clarification resolves the contradiction:

- **Load-bearing now**: structural source fidelity, citation discipline,
  caveat/data-coverage preservation as response fields, response-shape checks,
  freshness gates, and deterministic integration tests.
- **Not load-bearing in slice 1**: LLM-graded outcome verification, teacher
  trust measurement, SENCO workflow-time measurement, and final lesson-plan
  paraphrase scoring.
- **Follow-on required**:
  [`eef-outcome-evaluation-infrastructure.plan.md`](../../../sector-engagement/eef/future/eef-outcome-evaluation-infrastructure.plan.md)
  may later introduce a rubric-owned LLM/outcome evaluation harness outside
  Vitest, with fixture sampling, attribution failure classes, pass thresholds,
  and cadence.

## Specialist Review Dispositions

| Reviewer | Finding | Disposition |
|---|---|---|
| `architecture-reviewer-betty` | WS4 query proof could run before NC adapter | **ACTIONED** — `ws4-query-proof` now depends on `ws4-skos-extractor`. |
| `architecture-reviewer-betty` / `docs-adr-reviewer` | Practice plan still treated `graph-core` as conditional | **ACTIONED** — Practice plan now consumes graph-stack `packages/core/graph-core/` and lists graph-stack as blocking dependency. |
| `architecture-reviewer-betty` / `docs-adr-reviewer` | Graph-stack still implied ADR-123 amendment | **ACTIONED** — WS6 now states ADR-123 is not amended by this MCP-free increment. |
| `docs-adr-reviewer` | ADR-173 proposed status used binding/ratification wording | **ACTIONED** — ADR language and portfolio index now say proposed/intended until owner approval. |
| `docs-adr-reviewer` | ADR-173 embedded increment routing | **ACTIONED** — durable ADR wording now points routing back to the executable graph-stack plan. |
| `docs-adr-reviewer` | Portfolio index omitted `agent-tooling/` and stale status date | **ACTIONED / FOLLOW-ON** — index metadata includes `agent-tooling/`; broader status refresh is explicitly routed to consolidation follow-on. |
| `test-reviewer` | Integration behaviour was labelled `unit.test.ts` | **ACTIONED** — substrate/adapter cycles now use `integration.test.ts`. |
| `test-reviewer` | Slice 3b still widened to Unit IRI | **ACTIONED** — slice 3b is Thread IRI only; Unit IRI is follow-on/optional outside this slice. |
| `test-reviewer` | Slice 3a fixture manifest lacked deterministic path/schema/tie-break | **ACTIONED** — slice 3a names manifest path, schema, bucket allocation, ordering, and tie-break rule. |
| `mcp-reviewer` | Residual slice-3b runtime dependency wording | **ACTIONED** — slice 3b consumes `graph-corpus-sdk` only at runtime; slice 1/3a are naming/shape prerequisites. |
| `mcp-reviewer` | EEF dangling `get-eef-strand` name | **ACTIONED** — replaced with `eef-explain-evidence-strand`. |
| `mcp-reviewer` | MCP response envelope underspecified | **ACTIONED** — tool plans now require `content`, serialized JSON, `structuredContent`, `outputSchema`, and `isError` behaviour. |
| `mcp-reviewer` | Token budget measurement ambiguous | **ACTIONED** — budget is measured against serialized model-visible `content` text payload. |
| `assumptions-reviewer` | EEF outcome follow-on was unnamed | **ACTIONED** — created `eef-outcome-evaluation-infrastructure.plan.md` and linked it. |
| `assumptions-reviewer` | `agent-graphs/` path convention still open for ADR promotion | **ROUTED** — blocker for ADR-173 ratification / graph-stack ACTIVE promotion, not this planning-doc closeout. |
| `assumptions-reviewer` / `code-reviewer` | Branch divergence and live PR review thread still block merge | **ROUTED** — named as merge blockers outside planning-doc updates; do not claim merge-ready until fixed or rejected by owner. |
| `code-reviewer` | Historical next-session records reopened closed findings | **ACTIONED** — thread record now marks topology/slice findings as closed dispositions. |
| `code-reviewer` | Evidence covered last pushed head, not local closeout edits | **ACTIONED** — evidence is labelled as last pushed/refreshed head pending commit/push/re-check. |
| `code-reviewer` | Continuity claimed no active claims remained | **ACTIONED** — continuity now states live closeout claims remain until final handoff. |
| Final `code-reviewer` gateway | Graph-stack still used ratification/binding language while ADR-173 remains Proposed | **ACTIONED** — graph-stack now says proposed/intended and reserves ratification for the owner gate. |
| Final `code-reviewer` gateway | Follow-on routes were bare future filenames | **ACTIONED** — created and indexed named future plan stubs for slice-2 cuts, slice-3a substrate/topic cuts, and slice-3b extended contexts. |
| Final `code-reviewer` gateway / `assumptions-reviewer` | Thread handoff still asked the next session to redo closed topology/slice absorption | **ACTIONED** — immediate next task now names final verification/merge blockers only; historical findings stay in closed-disposition sections. |
| Final `code-reviewer` gateway | EEF top-line provability duplicated telemetry text | **ACTIONED** — duplicate sentence removed. |
| Final `assumptions-reviewer` | EEF snapshot age was date-fragile | **ACTIONED** — replaced fixed age with promotion-time recalculation from `last_updated`. |
| Final `assumptions-reviewer` | Outcome follow-on was narrower than teacher-trust/SENCO routed outcomes | **ACTIONED / ROUTED** — follow-on now owns the pre-ACTIVE split decision for teacher-trust and SENCO workflow-time measurement. |
| `release-readiness-reviewer` | PR body stale against local structural-only EEF stance | **ACTIONED** — PR body refreshed 2026-05-08 to describe structural-only EEF evaluation and named follow-ons. |
| `release-readiness-reviewer` | Local closeout bundle not covered by remote PR checks/Sonar; live Copilot thread and 107-file divergence remain | **ROUTED** — merge-readiness blockers below; do not claim merge-ready until pushed, rechecked, thread disposed, and merge workflow completed. |
| `code-reviewer` | Live closeout claim count mismatched continuity | **ACTIONED** — both Opalescent Shimmering Orbit closeout claims were closed; active claim count is now zero. |

## Execution Plan

### Phase 0: Refresh And Guard

Refresh current evidence before editing:

```bash
git fetch origin main
git diff --stat origin/main...HEAD
gh pr view 102 --json headRefOid,mergeStateStatus,statusCheckRollup,title,body,comments,reviews,url
gh pr checks 102
pnpm agent-tools:branch-touched-files -- --base origin/main --head HEAD
```

Also re-check Sonar quality gate, open PR issues, PR hotspots, top-level PR
comments, review summaries, and unresolved review threads.

Acceptance:

- PR remains green or any new non-green state is named before plan edits.
- Session scope is still planning-only; no production code changes are made.
- Existing unrelated working-tree changes are identified and left alone.
- Branch scope is recorded; if touched-file count remains above `100`, the
  pre-merge divergence workflow is required before merge.

### Phase 1: Integrate Topology Findings

Edit `graph-stack.plan.md` and ADR-173 together:

- Reorder WS4 so `ws4-graph-corpus-sdk-scaffold` precedes the SKOS extractor.
- Locate the SKOS extractor in the Oak consumer SDK, not a substrate workspace.
- Resolve `practice-graph` tier semantics in graph-stack, ADR-173, and the
  Practice graph pilot plan: use `agent-graphs/practice-graph/`.
- Add a future plan for creating the top-level `agent-graphs/` area and
  workspace wiring; do not physically scaffold it in this closeout.
- Standardise topology to seven active graph workspaces plus one deferred
  `graph-future` workspace.
- Put generic Turtle/SKOS parsing in `graph-ingest`; put NC/Oak corpus mapping
  inside `graph-corpus-sdk`.
- Update any owner-decision log or risk table entries that still describe the
  findings as deferred.

Acceptance:

- No topology finding remains described as future execution-prep work.
- ADR-173, `graph-stack.plan.md`, and the Practice pilot agree on workspace
  tier and sequencing.

### Phase 2: Integrate Slice-Plan Findings

Edit the three slice plans at their owning point:

- Slice 2: adapter timing matches the topology plan.
- Slice 3a: topic context is replaced with Thread IRI context, with Unit IRI
  only if the optional unit variant is explicitly authorised.
- Slice 3a: numeric budget and representative-fixture rule are explicit.
- Slice 3b: behavioural tests carry behaviour; structural constraints move to
  lint/architecture gate text.

Acceptance:

- Each finding is visibly absorbed where a future implementer would look first.
- No slice plan retains an unresolved reviewer finding from Phase 4.

### Phase 3: Apply The EEF Evaluation Decision

Edit `eef-evidence-corpus.plan.md`, the graph spine, downstream slice
references, `eef.next-session.md`, `connecting-oak-resources.next-session.md`,
repo continuity, graph portfolio index, and the PR body so they all carry the
latest structural-only evaluation stance.

Acceptance:

- t19, the promotion trigger, closing acceptance language, and slice 3b's risk
  row no longer contradict each other.
- Outcome verification is explicitly sequenced behind evaluation infrastructure
  and is not a slice-1 execution gate.
- Structural verification remains load-bearing and concrete enough for slice 1
  execution.

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
  .agent/plans/agentic-engineering-enhancements/current/practice-graph-payoff-peak-pilot.plan.md \
  .agent/memory/operational/threads/connecting-oak-resources.next-session.md \
  .agent/memory/operational/threads/eef.next-session.md \
  .agent/memory/operational/repo-continuity.md \
  .agent/plans/graph-portfolio-index.md \
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
pnpm agent-tools:branch-touched-files -- --base origin/main --head HEAD
gh pr checks 102
```

Also re-check:

- top-level PR comments, reviews, review summaries, and unresolved review
  threads;
- Sonar quality gate = `OK`;
- open Sonar PR issues = `0`;
- Sonar `TO_REVIEW` hotspots = `0`;
- PR merge state is clean or any non-clean state is unrelated to graph plan
  decision-completeness and explicitly named.
- Pre-merge divergence workflow because touched-file count is above `100`:
  measure divergence, dry-run merge then abort if the working tree is clean,
  identify changed-both/deleted/add-add collisions, check ADR/plan numbering
  collisions, and record the result. If the working tree is dirty, record the
  unrun dry-run step as a pre-merge blocker rather than forcing it.

Acceptance:

- Update this plan to `status: completed`.
- Update the `connecting-oak-resources` thread record with the exact
  decision-complete verdict.
- Update `eef.next-session.md`, repo continuity, and graph portfolio index with
  the final eval/topology stance.
- Update PR #102 body if the validation/intent text changes.
- Commit and push the planning closeout before merge.

## Final Verdict — 2026-05-08

```text
Decision-complete: YES
Merge-ready with respect to graph planning: NO
Remaining blockers:
- Local closeout bundle is not committed/pushed; GitHub checks and Sonar cover pushed head d5e32a3c7ba47f3f21de138c7752afb8d6362171, not these local docs.
- One live Copilot review thread remains on packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts:177.
- Branch touched-file count is 107. Non-mutating divergence probe found origin/main has 0 changed files since merge-base 91e73d3c95066c9670b000648c547592d1334bd0, no changed-both files, no ADR/plan numbering add/add collisions, and no merge-tree conflict signal; the actual dry-run merge/abort step remains unrun because the working tree is dirty.
Owner decisions resolved:
- EEF slice 1 evaluation is structural-only now: citation, caveat, data coverage, freshness, and MCP response-shape preservation at the tool boundary.
- LLM/outcome evaluation is a named follow-on; teacher-trust and SENCO workflow-time measurement are routed to the outcome-evaluation split decision before EEF ACTIVE promotion.
- Practice-facing graph tooling is planned under agent-graphs/practice-graph/, with agent-tooling/future/agent-graphs-workspace-organisation.plan.md owning future physical organisation/wiring.
- Slice 3a budget is maxResponseTokens = 16000 with a deterministic 20-context fixture manifest.
- Slice 3b is Thread IRI only and substrate-only at runtime through graph-corpus-sdk Inc.3 adapters/join primitive.
- ADR-173 remains Proposed; graph-stack ACTIVE promotion and ADR-173 ratification are out of scope.
Validation:
- pnpm markdownlint-check:root PASS
- pnpm format-check:root PASS
- git diff --check PASS
- pnpm agent-tools:branch-touched-files -- --base origin/main --head HEAD PASS with hard warning: 107 touched files
- gh pr checks 102 PASS on pushed head d5e32a3c7ba47f3f21de138c7752afb8d6362171
- Sonar quality gate OK, 0 open PR issues, 0 TO_REVIEW hotspots on PR #102 pushed head
- PR review threads: one unresolved Copilot thread remains on emit-index.ts whitespace
- PR body refreshed 2026-05-08
- Collaboration claims status: 0 active claims after closeout closure
Next safe step after merge: implementation-prep for the graph MVP slices only after the remaining merge blockers are cleared and PR #102 merges.
```
