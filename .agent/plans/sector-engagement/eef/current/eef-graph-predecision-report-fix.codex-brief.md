# Next-session brief - fix EEF graph pre-decision research report

Summary: Apply the reviewer findings to the pre-decision research report so it is safe for D1/D3/D4/D5 handoff.

**For**: a separate Codex session. Self-contained; read this in full before
starting.
**Authored**: 2026-05-31 after code, architecture, and documentation reviewers
looked over
[`eef-graph-predecision-research.report.md`](eef-graph-predecision-research.report.md)
against
[`eef-graph-predecision-research.codex-brief.md`](eef-graph-predecision-research.codex-brief.md).
**Scope owner**: the `eef` thread.

## Why This Session Exists

The report is broadly valuable and structurally aligned with the original brief,
but the reviewer synthesis found several wording and evidence defects that should
be fixed before the report is used as handoff material for D1/D3/D4/D5.

The central safety requirement remains absolute:

- the old list implementation is evidence only for what to delete;
- do not preserve, repair, wrap, consult, target, or use old list logic as a
  behaviour source;
- any future overlap with old output is acceptable only as an incidental result
  independently derived from ratified D1 value, D3 MCP surface, and D4/D5 graph
  structure.

## Allowed Scope

Edit only:

- `.agent/plans/sector-engagement/eef/current/eef-graph-predecision-research.report.md`

Do not edit implementation code, the live plan, the original research brief,
README files, memory, or collaboration state unless the owner explicitly widens
scope.

## Read First

- `.agent/plans/sector-engagement/eef/current/eef-graph-predecision-research.codex-brief.md`
  - original brief and required report shape.
- `.agent/plans/sector-engagement/eef/current/eef-graph-predecision-research.report.md`
  - report to fix.
- `.agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md`
  - controlling D1-D7 plan and old-list deletion boundaries.
- `.agent/plans/sector-engagement/eef/current/eef-d0-decontamination-ledger.md`
  - residue classes and historical/current-truth distinction.
- `.agent/directives/principles.md`
  - especially correctness over expediency and replace-don't-bridge.
- `.agent/directives/schema-first-execution.md`
  - known-vs-unknown and generated/schema-first boundary discipline.

Then inspect the specific code surfaces cited below before changing the report:

- `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-graph-model.ts`
- `packages/sdks/graph-corpus-sdk/src/eef-strands/strand-lookup.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/projection.ts`
- `packages/sdks/oak-curriculum-sdk/src/mcp/evidence-corpus/tools/eef-explore-evidence-for-context/tool-definition.ts`
- `packages/core/graph-core/src/graph-view/types.ts`

## Reviewer Findings To Apply

### 1. Fix traversal reuse wording

Problem: the report currently says D5 is "principally a re-pointing" and that
the inherited BFS traversal is "sound and reusable" / "reusable as-is".

Why this is unsafe: current traversal has broad `string` ids, no frontier refs,
no provenance envelope, and no D4-ratified graph-native contract. That wording
can pull implementation toward preserving inherited mechanics under a graph
label.

Required repair:

- Reframe the current traversal as diagnostic evidence only.
- Say a breadth-first traversal may be independently re-derived if D4/D5 ratify
  those traversal semantics from the graph contract.
- Say explicitly that the existing implementation is not a preservation target.
- Apply this wherever the report currently makes reuse/repointing claims:
  executive summary, option observations, and decision agenda.

### 2. Distinguish plan target from current code for MCP results

Problem: the report says tool results are `structuredContent`-only with
`content: []` as a known constraint, but current shared formatting still emits a
two-item `content` array plus `structuredContent`.

Required repair:

- Do not claim the structuredContent-only shape is verified by current code.
- State it as a plan-settled D6 target.
- State that current dual-content formatting in `universal-tool-shared.ts` is a
  current implementation surface D6 must replace, bypass, or delete for the EEF
  graph surface.
- Keep D3/D6 ownership clear: the report may surface the issue and criterion,
  not ratify the final MCP surface itself.

### 3. Soften construction-integrity proof claims

Problem: the report says duplicate-id and dangling-related-strand errors are
unreachable through the typed API.

Why this is too strong: `StrandByStrandId` is a keyed lookup type, but by itself
it does not prove duplicate raw IDs impossible or prove every `related_strands`
target is a real ID in the current D0 state.

Required repair:

- Say D2/D5 should derive and prove the relevant facts.
- It is acceptable to say the eventual EEF binding may become infallible once
  those derived facts and proofs land.
- Do not say the current D0 typed API already proves the construction errors
  away.

### 4. Tighten file/line provenance

Problem: the report uses shorthand refs such as `:55`, `types.ts:67-202`,
`interface.ts:77-111`, and `index.ts:50-79`.

Required repair:

- Expand concrete evidence references to repo-relative paths plus line ranges.
- Prioritise executive summary, known constraints, open questions, risk register,
  and decision agenda.
- Avoid bare `:line` continuations unless the filename/path is immediately
  adjacent in the same sentence and unambiguous.

### 5. Remove or neutralise process self-certification

Problem: the "Standards repair" paragraph reads like process self-certification
rather than research output.

Required repair:

- Either remove it or collapse it into a neutral method/provenance note.
- Keep useful grounding facts if needed, but do not present "brought to
  standard" as evidence.

### 6. Correct small shape inaccuracies

Problem: the report says the old projection "widens every field to `string`";
that is directionally about type erosion but technically inaccurate because
`impact_months` remains `number | null` and `most_relevant_priorities` remains
`EefPriority[]`.

Required repair:

- Replace with a precise claim, for example: the projection drops major fields
  and widens key identifiers/prose fields into a hand-authored parallel shape.
- Refresh any stale line references to `tool-definition.ts` and `projection.ts`
  against the current working tree.

## Acceptance Criteria

- The report remains explicitly labelled `pre-decision research`.
- The report does not ratify D1, D3, D4, D5, D6, or any MCP/graph operation
  surface.
- The old list implementation appears only as deletion evidence or historical
  hazard, never as a target, baseline, compatibility shape, or source of
  expected behaviour.
- The candidate graph-native view section still compares materialised, lazy, and
  hybrid/indexed forms and preserves node-id, node-kind, edge-type,
  payload/reference, frontier, and provenance axes.
- Concrete code observations have repo-relative file/line references.
- No implementation files are edited.

## Validation

Run at minimum:

```bash
pnpm exec prettier --check .agent/plans/sector-engagement/eef/current/eef-graph-predecision-research.report.md
git diff --check -- .agent/plans/sector-engagement/eef/current/eef-graph-predecision-research.report.md
pnpm markdownlint-check:root .agent/plans/sector-engagement/eef/current/eef-graph-predecision-research.report.md
rg -n 'preserv|reusable as-is|principally a re-pointing|D1 confirms|verified against code|widens every field|gate-1a|gate-1b|recommendation|ranking|ranked|best approach|best bets' .agent/plans/sector-engagement/eef/current/eef-graph-predecision-research.report.md
```

For the `rg` check, deletion-target terms such as `rank` / `explain` /
`compare`, `response-budget`, `capForBudget`, and `citation-shape` may remain
only where the report is explicitly naming stale list-era surfaces to delete.

## Report Back

Finish with:

- changed sections;
- reviewer findings applied;
- any reviewer finding deliberately not applied, with rationale;
- validation commands and results;
- remaining risks, if any.
