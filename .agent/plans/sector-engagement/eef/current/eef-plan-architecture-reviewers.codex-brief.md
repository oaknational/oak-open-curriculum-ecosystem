# Next-session brief (Codex) - EEF architecture reviewer pass

**For**: a Codex session. Self-contained; read this in full before starting.
**Authored**: 2026-05-31 by Hearthlit Roasting Caldera (codex/GPT-5), after the
EEF reviewer-findings repair. **Scope owner**: the `eef` thread.

## Why this session exists

The live EEF plan has now folded in the docs/type reviewer findings from
`eef-plan-reviewers.codex-brief.md`. The critical repaired position is:

- raw `EEF_TOOLKIT_DATA` is definitively **not** the EEF graph contract;
- the graph is absolutely derived from that raw data;
- exact `as const` typing is preserved through the graph-native view, graph
  operations, MCP schemas, `structuredContent`, and teacher-facing proof;
- no implementation path may throw away type information and later recover it by
  broad `string`, generic JSON-like payloads, `unknown`, Zod corpus parsing, or
  hand-authored parallel shapes.

Before implementation resumes, run all four architecture reviewers over the live
plan. This is not another authoring pass. The goal is architecture scrutiny:
boundaries, cohesion, ADR alignment, resilience, change cost, and hidden coupling.

## Required Reviewer Invocations

Resolve the Codex reviewer adapters before invoking them:

```bash
pnpm agent-tools:codex-reviewer-resolve architecture-expert-barney
pnpm agent-tools:codex-reviewer-resolve architecture-expert-betty
pnpm agent-tools:codex-reviewer-resolve architecture-expert-fred
pnpm agent-tools:codex-reviewer-resolve architecture-expert-wilma
```

Expected resolved agents:

- `architecture-expert-barney` - simplification-first boundary and dependency
  mapping; adapter `.codex/agents/architecture-expert-barney.toml`.
- `architecture-expert-betty` - systems cohesion, coupling, and change-cost
  trade-offs; adapter `.codex/agents/architecture-expert-betty.toml`.
- `architecture-expert-fred` - principles and ADR boundary discipline; adapter
  `.codex/agents/architecture-expert-fred.toml`.
- `architecture-expert-wilma` - adversarial resilience, failure modes, and hidden
  coupling; adapter `.codex/agents/architecture-expert-wilma.toml`.

All four use canonical template `.agent/sub-agents/templates/architecture-expert.md`
plus their persona file under `.agent/sub-agents/components/personas/`.

Run four read-only architecture reviews. If the Codex project-agent invocation
surface is unavailable, fall back to manually applying the resolved reviewer
templates and clearly label that fallback in the output. Do not silently
substitute a generic review.

## Read First

- `.agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md`
  - the plan under review.
- `.agent/plans/sector-engagement/eef/README.md`
  - live EEF lane framing and current status.
- `.agent/plans/sector-engagement/eef/current/eef-plan-reviewers.codex-brief.md`
  - the prior docs/type reviewer brief whose findings are now folded in.
- `.agent/plans/sector-engagement/eef/current/eef-d0-decontamination-ledger.md`
  - D0 dispositions and expected later-D-step code residue.
- `.agent/memory/operational/threads/eef.next-session.md`
  - current EEF thread banner and continuity notes.
- `.agent/sub-agents/templates/architecture-expert.md`
  - required reviewer template.
- `.agent/sub-agents/components/personas/barney.md`
- `.agent/sub-agents/components/personas/betty.md`
- `.agent/sub-agents/components/personas/fred.md`
- `.agent/sub-agents/components/personas/wilma.md`

Optional but useful if a reviewer needs doctrine context:

- `.agent/directives/principles.md`
- `.agent/directives/schema-first-execution.md`
- `docs/architecture/architectural-decisions/038-compilation-time-revolution.md`
- `docs/architecture/architectural-decisions/041-graph-core-boundary.md`
- `docs/architecture/architectural-decisions/179-transport-agnostic-mcp-substrate.md`
- `.agent/practice-core/decision-records/PDR-058-premature-generality.md`
- `.agent/practice-core/decision-records/PDR-089-conservation-reflex-external-check.md`

## Review Boundaries

This is a review session. Do not repair the plan unless the owner explicitly
widens the session after reviewing the findings.

Do not review archive history as current guidance. Preserve `archive/`,
historical thread sections, and the historical conservation map as history unless
the live plan links to them as current authority.

Do not re-open settled owner decisions:

- No Zod over the corpus.
- No runtime corpus parse.
- No `unknown` at the fixed-data boundary.
- No freshness gate / ADR-175 code obligation.
- No response cap or rank-and-cut over graph results.
- Raw EEF data is not the graph contract.
- The EEF graph is derived from the raw data and preserves exact raw-derived
  typing.
- A graph-native construction/adaptation boundary is mandatory and explicit.
- MCP input/output schemas are SDK declarations derived by a single Zod call over
  named graph-native view subsets, with compile-time payload ties and owner
  conversation if impossible.

Reviewer recommendations that violate those decisions should be classified as
`incorrect reviewer recommendation`, not promoted into findings.

## Shared Architecture Questions

Each reviewer should answer these against the live plan:

- Does the plan preserve the intended layer split: raw-corpus foundation,
  graph-native EEF view, graph-core query substrate, Oak lesson-context mapping,
  and MCP consumer factory?
- Does any step leak MCP concerns into substrate packages or EEF-specific concerns
  into shared graph-core?
- Does the graph-core reshape stay proportional to the ratified MCP surface, or
  does it reintroduce speculative generality?
- Are D1-D7 sequenced so that value drives contracts while the fixed-data
  doctrine and raw-corpus foundation can safely land first?
- Are consumer-impact, co-land, and deletion-ordering constraints strong enough
  to avoid red-tree or broken-import windows?
- Are architecture/ADR references placed at durable WHAT/WHY decision points,
  not used as runbook storage for execution detail?
- Does the plan leave any ambiguous boundary where an executor could preserve an
  inherited wrong shape because it already exists?

## Barney Brief - Simplification And Boundary Mapping

Ask `architecture-expert-barney` to focus on:

- whether the target architecture is simpler than the inherited list/ranking/Zod
  loader shape without hiding complexity in vague adapters;
- whether each boundary has one clear owner and one clear reason to exist;
- whether D3/D4/D5 split planning from implementation cleanly;
- whether any abstraction exists before a real consumer proves need;
- whether graph-core's query reshape removes premature generality without
  creating a new over-general contract.

Expected output:

- Findings first, ordered by severity.
- For each finding: file/line reference, boundary or dependency concern, and a
  concrete correction strategy.
- Classify as `must-fix`, `optional`, or `incorrect`.
- Explicit statement if no findings.

## Betty Brief - Systems Cohesion And Change Cost

Ask `architecture-expert-betty` to focus on:

- system cohesion across D1 value, D3 MCP contract, D4 operations, D5 graph view,
  D6 factory, and D7 proof;
- change-cost trade-offs and whether dependencies point in the right direction;
- whether test/gate sequencing catches integration failures at the right time;
- whether co-landing D5/D6 is specified clearly enough if `SubgraphResult`
  compatibility cannot be preserved;
- whether flag co-gating of tool, resource, and prompt is sufficient for a
  partially implemented feature.

Expected output:

- Findings first, ordered by severity.
- For each finding: file/line reference, system-level risk, affected deliverables,
  and proposed plan correction.
- Classify as `must-fix`, `optional`, or `incorrect`.
- Explicit statement if no findings.

## Fred Brief - Principles And ADR Discipline

Ask `architecture-expert-fred` to focus on:

- alignment with ADR-038, ADR-041, ADR-153, ADR-179, PDR-058, PDR-089, and the
  repo's known-vs-unknown doctrine;
- whether ADR-175 withdrawal and freshness deletion are treated as settled;
- whether ADR-level decisions and execution-plan details are separated cleanly;
- whether graph-core remains transport-agnostic and substrate-safe;
- whether the plan avoids using existing committed shapes as evidence of
  correctness.

Expected output:

- Findings first, ordered by severity.
- For each finding: file/line reference, governing principle/ADR, why the plan is
  aligned or misaligned, and proposed correction.
- Classify as `must-fix`, `optional`, or `incorrect`.
- Explicit statement if no findings.

## Wilma Brief - Adversarial Failure Modes

Ask `architecture-expert-wilma` to look for ways implementation can still go
wrong even if it appears to follow the plan:

- hidden coupling between raw corpus shape, graph-native projection, graph-core,
  and MCP output contracts;
- a future executor satisfying words while bypassing intent, especially around
  single-Zod-call schemas and graph-native type preservation;
- red-tree windows from deletion order, barrel exports, feature flags, or
  co-landing assumptions;
- stale code or docs that could pull implementation back toward list/rank/Zod
  loader/freshness behaviour;
- runtime failure modes for unknown request envelopes, invalid keys, disabled
  flags, and output-schema validation.

Expected output:

- Findings first, ordered by severity.
- For each finding: file/line reference, adversarial path, likely failure mode,
  and plan wording or acceptance proof that would close it.
- Classify as `must-fix`, `optional`, or `incorrect`.
- Explicit statement if no findings.

## Host Synthesis Task

After the four reviewer passes:

1. Merge duplicate findings.
2. Keep disagreements visible; do not flatten them away.
3. Mark findings as:
   - `must-fix before implementation`
   - `optional plan polish`
   - `incorrect reviewer recommendation`
   - `owner judgment call`
4. For any `owner judgment call`, state the decision needed in one sentence.
5. Do not implement fixes unless the owner explicitly widens the session.

## Acceptance

- All four architecture reviewer adapters resolved or fallback clearly labelled.
- All four architecture passes run.
- Host synthesis names consolidated findings and disagreements.
- Readiness verdict states whether implementation can continue, needs plan
  repair, or needs owner judgment first.
- No code gates are required unless the owner widens scope into edits.
