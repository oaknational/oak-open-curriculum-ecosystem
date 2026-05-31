# Next-session brief (Codex) - EEF D1 reviewer pass

**For**: a Codex session. Self-contained; read this in full before starting.
**Authored**: 2026-05-31 after the D1-parallel graph pre-decision research brief
was handed to Claude session Pelagic Mooring Reef. **Scope owner**: the `eef`
thread.

## Why This Session Exists

Claude session Pelagic Mooring Reef is running the graph pre-decision research
brief. Separately, a later Claude session will implement D1: the teacher value and
impact contract.

Before that D1 implementation session, run a D1-only reviewer pass using all four
architecture reviewers plus the documentation and type reviewers. The aim is to
stress-test the D1 section as a value-contract brief: whether it is clear enough,
bounded enough, and testable enough for a Claude session to write the D1 artefact
without accidentally deciding D3/D4 graph or MCP shape.

This reviewer pass is not a whole-plan review. It is not graph design. It is not
D1 implementation.

## Required Reviewer Invocations

Resolve the Codex reviewer adapters before invoking them:

```bash
pnpm agent-tools:codex-reviewer-resolve architecture-expert-barney
pnpm agent-tools:codex-reviewer-resolve architecture-expert-betty
pnpm agent-tools:codex-reviewer-resolve architecture-expert-fred
pnpm agent-tools:codex-reviewer-resolve architecture-expert-wilma
pnpm agent-tools:codex-reviewer-resolve docs-adr-expert
pnpm agent-tools:codex-reviewer-resolve type-expert
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
- `docs-adr-expert` - documentation and decision-record discipline; adapter
  `.codex/agents/docs-adr-expert.toml`.
- `type-expert` - type-system and type-flow scrutiny; adapter
  `.codex/agents/type-expert.toml`.

Run six read-only reviews. If the Codex project-agent invocation surface is
unavailable, fall back to manually applying the resolved reviewer templates and
clearly label that fallback in the output. Do not silently substitute a generic
review.

## Read First

- `.agent/plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md`
  - read the whole plan for context, but review only D1 and the direct references
  needed to understand D1 boundaries.
- `.agent/plans/sector-engagement/eef/current/eef-graph-predecision-research.codex-brief.md`
  - parallel research boundary; D1 must not be made irrelevant by pre-deciding
  graph functionality.
- `.agent/plans/sector-engagement/eef/README.md`
  - live EEF lane framing.
- `.agent/memory/operational/threads/eef.next-session.md`
  - current EEF continuity.
- `.agent/directives/principles.md`
  - correctness over expediency; replace wrong shapes rather than preserving
  them.

Reviewer templates/personas:

- `.agent/sub-agents/templates/architecture-expert.md`
- `.agent/sub-agents/templates/docs-adr-expert.md`
- `.agent/sub-agents/templates/type-expert.md`
- `.agent/sub-agents/components/personas/barney.md`
- `.agent/sub-agents/components/personas/betty.md`
- `.agent/sub-agents/components/personas/fred.md`
- `.agent/sub-agents/components/personas/wilma.md`

If Pelagic Mooring Reef has already produced a graph pre-decision research report,
read it only to identify graph questions that D1 must leave open or value
questions that graph research says D1 must answer. Do not treat that report as a
ratified graph design.

## Review Boundary

Review only this plan section:

```markdown
### D1 - Teacher value & impact contract (exploration; owner-ratified)
```

The immediate object of review is whether D1 is ready for a Claude session to
implement the value-contract artefact. D1 implementation means writing the
teacher value statement, scenario, assistant-role constraints, evidence
obligations, non-claims, and success criteria back into the plan or a cited
artefact.

Do not review D2-D7 except to check whether D1 gives them the right upstream
constraints and leaves their decisions open.

Do not repair the plan or implement D1 unless the owner explicitly widens the
session after seeing the reviewer findings.

## Settled Boundaries

Reviewer suggestions that violate these boundaries should be classified as
`incorrect reviewer suggestion`, not promoted into findings:

- D1 is value and impact, not MCP tool design.
- D1 must not ratify graph-native structure, graph-core operations, resource
  shape, or MCP schema shape.
- D1 may name value-driven questions D3/D4 must later answer.
- D1 must not optimise toward the old list-tool behaviour or output.
- The old list implementation is evidence only for what to delete.
- Raw `EEF_TOOLKIT_DATA` is the fixed corpus and type source; it is not the graph
  contract.
- No Zod over the corpus, no runtime corpus parse, no `unknown` at the fixed-data
  boundary, no freshness gate, no response cap, no rank-and-cut.
- D1 proof is `non-code`: owner-ratified value statement and success criteria.

## Shared D1 Review Questions

Every reviewer should answer:

- Is D1 clear enough for a Claude session to implement without inventing the
  teacher value?
- Does D1 specify the Sunday-night cover-lesson scenario at the right level of
  detail?
- Does D1 distinguish teacher-facing value from internal graph/MCP mechanics?
- Does D1 say what EEF evidence adds to Oak material?
- Does D1 preserve caveats, attribution, evidence strength, cost, impact, and
  uncertainty without turning EEF into teacher-replacing prescriptions or claims it cannot make?
- Does D1 define explicit non-claims and assistant limits?
- Does D1 define the smallest successful round trip in a way D7 can later test?
- Does D1 leave D3 MCP and D4 graph decisions open while still giving them useful
  constraints?

## Barney Brief - Simplicity And Boundary Discipline

Ask `architecture-expert-barney` to focus on:

- whether D1 is simple enough to implement as a value contract;
- whether D1 avoids smuggling in graph/MCP implementation detail;
- whether the teacher job, assistant role, and evidence obligations have clear
  owners;
- whether any vague wording would let a later agent preserve the old list shape
  because it seems easier.

Expected output:

- Findings first, ordered by severity.
- For each finding: file/line reference, boundary concern, and concrete D1
  correction strategy.
- Classify as `must-fix`, `optional`, or `incorrect`.
- Explicit statement if no findings.

## Betty Brief - Cohesion And Downstream Readiness

Ask `architecture-expert-betty` to focus on:

- whether D1 gives D3/D4/D7 enough value constraints without deciding their
  contracts;
- whether the D1 acceptance criteria are testable by a later D7 round trip;
- whether the assistant-facing value story is coherent across Oak material, EEF
  evidence, caveats, and non-claims;
- whether missing D1 detail would force D3/D4 implementers to guess.

Expected output:

- Findings first, ordered by severity.
- For each finding: file/line reference, downstream risk, affected later
  deliverable, and proposed D1 correction.
- Classify as `must-fix`, `optional`, or `incorrect`.
- Explicit statement if no findings.

## Fred Brief - Principles And Decision Discipline

Ask `architecture-expert-fred` to focus on:

- whether D1 keeps value decisions separate from implementation decisions;
- whether D1 respects the plan principle that value drives MCP and graph shape;
- whether D1 avoids ADR-level claims that belong elsewhere;
- whether D1 avoids treating existing code or committed old shapes as evidence of
  correctness.

Expected output:

- Findings first, ordered by severity.
- For each finding: file/line reference, governing principle or decision boundary,
  and proposed D1 correction.
- Classify as `must-fix`, `optional`, or `incorrect`.
- Explicit statement if no findings.

## Wilma Brief - Adversarial Failure Modes

Ask `architecture-expert-wilma` to look for ways D1 implementation can go wrong:

- a Claude session writes a pleasant scenario but not a testable success
  criterion;
- D1 accidentally ratifies graph or MCP structure;
- D1 leaves "when not to use EEF" too vague;
- D1 omits non-claims, caveats, or uncertainty obligations;
- D1 phrases value in a way that later agents can satisfy with old list/rank
  behaviour.

Expected output:

- Findings first, ordered by severity.
- For each finding: file/line reference, adversarial path, likely failure mode,
  and D1 wording or acceptance proof that would close it.
- Classify as `must-fix`, `optional`, or `incorrect`.
- Explicit statement if no findings.

## Documentation Reviewer Brief

Ask `docs-adr-expert` to review D1 as a documentation target for the next Claude
implementation session:

- Is D1's expected artefact clear: in-plan update vs cited artefact?
- Are the scenario, value claim, non-claims, and success criteria easy to find and
  maintain?
- Should D1 remain plan detail, or does any part require a durable ADR/decision
  record?
- Are terms like evidence, caveat, attribution, impact, cost, and uncertainty
  sufficiently defined for a future implementer?
- Is D1 concise enough to be usable without losing the nuance the owner needs?

Expected output:

- Findings first, ordered by severity.
- For each finding: file/line reference, documentation risk, and proposed D1
  correction.
- Classify as `must-fix`, `optional`, or `incorrect`.
- Explicit statement if no findings.

## Type Reviewer Brief

Ask `type-expert` to review only the type implications D1 must preserve:

- Does D1 avoid implying that teacher value can be proven without preserving exact
  raw-derived values through the later graph/MCP chain?
- Does D1 name which corpus values must survive verbatim for the D7 value proof
  without deciding the graph representation?
- Does D1 leave room for D3/D4/D5 to preserve literal ids and payload
  relationships rather than broad strings or generic payloads?
- Does D1 avoid introducing any `unknown`, Zod-over-corpus, or hand-authored
  parallel-shape expectation?

Expected output:

- Findings first, ordered by severity.
- For each finding: file/line reference, type-flow/value-proof risk, and proposed
  D1 correction.
- Classify as `must-fix`, `optional`, or `incorrect`.
- Explicit statement if no findings.

## Host Synthesis Task

After all six reviewer passes:

1. Merge duplicate findings.
2. Keep disagreements visible; do not flatten them away.
3. Classify each finding as:
   - `must-fix before Claude implements D1`
   - `optional polish before Claude implements D1`
   - `incorrect / violates settled boundary`
   - `belongs to D3/D4/D5, not D1`
4. Produce a compact D1 readiness verdict:
   - `ready for Claude D1 implementation`
   - `ready with optional polish`
   - `not ready; repair D1 brief first`
5. Do not edit the plan unless the owner explicitly asks for repair after seeing
   the findings.

## Expected Final Output

Return:

- reviewer invocation summary;
- consolidated findings with file/line references;
- D1 readiness verdict;
- specific instructions for the later Claude D1 implementation session;
- any D1 questions that still require owner input.

Keep the final answer focused on D1. Do not include a general architecture review
of D2-D7.
