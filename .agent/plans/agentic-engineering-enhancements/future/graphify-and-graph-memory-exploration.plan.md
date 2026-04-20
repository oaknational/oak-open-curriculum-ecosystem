# Graphify and Graph Memory Exploration — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements
**Related research**:
[graphify-oak-practice-analysis.md](../../../research/graphify-oak-practice-analysis.md)

## Problem and Intent

The repo already has canonical memory surfaces such as
[`napkin.md`](../../../memory/active/napkin.md),
[`distilled.md`](../../../memory/active/distilled.md), patterns, plans, ADRs, and
implementation code. It also already has graph-shaped SDK and MCP work.

What it does not yet have is a derived graph layer for path/query/explain
navigation across that memory estate.

The related research report found that
[Graphify](https://github.com/safishamsi/graphify) could inform that layer in
several ways, especially if the existing memory artefacts themselves are
included in the graph so the result becomes an orthogonal memory plane over
canonical memory, not a rival source of truth.

This plan is exploratory only:

- no tool-adoption decision has been made
- no code-adoption decision has been made
- no Practice change has been approved
- the goal is to clarify option space, pilots, constraints, and promotion
  criteria

## Attribution Baseline

Any future Oak artefact inspired by Graphify must treat attribution as
non-negotiable.

Minimum baseline:

- name **Graphify** explicitly
- name **Safi Shamsi** explicitly
- link to the upstream repository and the specific upstream artefact(s) that
  inspired the Oak adaptation
- describe Oak work as **inspired by** or **adapted from** Graphify
- keep derived graph outputs advisory and navigational, never canonical

Minimum upstream references for future evaluation:

- Repository: <https://github.com/safishamsi/graphify>
- README:
  <https://github.com/safishamsi/graphify/blob/v4/README.md>
- Architecture notes:
  <https://github.com/safishamsi/graphify/blob/v4/ARCHITECTURE.md>
- MCP server implementation:
  <https://github.com/safishamsi/graphify/blob/v4/graphify/serve.py>
- Cache implementation:
  <https://github.com/safishamsi/graphify/blob/v4/graphify/cache.py>

If direct code adoption is ever proposed, a separate licensing/terms review is
required before promotion.

## Domain Boundaries and Non-Goals

### In Scope

- evaluating multiple forward paths without choosing one yet
- clarifying how a derived graph layer could relate to
  [`practice.md`](../../../practice-core/practice.md),
  `napkin.md`, `distilled.md`, plans, ADRs, and code
- identifying pilot corpora and evaluation questions
- defining attribution, ownership, activation, and boundary constraints
- identifying explicit prerequisites for each path, including Python 3 if the
  external-tool lane is pursued

### Out of Scope

- adopting Graphify now
- treating derived graph outputs as canonical truth
- using Graphify's repo-mutating installer model unchanged in this repo
- mixing internal Practice/repo graph surfaces into the public curriculum MCP
  server
- defaulting to a whole-repo semantic extraction as the first move

## Possible Exploration Tracks

### 1. External Dependency / Binary Lane

- Run Graphify explicitly, much like `depcruise` or `knip`
- Keep activation deliberate and scoped rather than always-on
- Accept Python 3 as an explicit repo requirement for users of this lane
- Learn from actual outputs before deciding whether any Oak-native adaptation
  is worthwhile

### 2. Selective Code Adoption Lane

- Evaluate whether selected Graphify mechanisms should be adapted into
  Oak-native tooling
- Candidate areas include cache behaviour, report generation, query/path/explain
  interactions, and derived graph MCP serving for local engineering use
- Keep attribution explicit at artefact level if any code or code-shaped design
  is adapted

### 3. Concept Adoption Lane

- Adopt concepts without adopting the tool or copying code
- Candidate concepts include orthogonal graph memory, evidence-labelled
  relationships, "map before grep", path-based traversal, and topology reports
- Use this lane if conceptual uplift is useful before tooling choices are made

### 4. Hybrid Lane

- Trial Graphify on a pilot corpus
- Observe which capabilities matter in Oak's context
- Then decide whether to keep using the tool, adapt selected code, absorb
  selected concepts, or combine those approaches

### 5. Exploration-Only Outcome

- A valid outcome is to decide nothing yet
- Exploration is still successful if it sharpens boundaries, pilot criteria,
  and attribution standards for future work

## Pilot Candidates

The report suggests starting with scoped corpora rather than the whole repo.

- ADR corpus:
  [`docs/architecture/architectural-decisions/`](../../../../docs/architecture/architectural-decisions/)
- Practice-support corpus: selected
  [`.agent/research/`](../../../research/) bundles plus related active plans
- Graph/MCP lane: graph-related ADRs, plans, and
  [`packages/sdks/oak-curriculum-sdk/src/mcp/`](../../../../packages/sdks/oak-curriculum-sdk/src/mcp/)
- Memory-layer corpus: `napkin.md`, `distilled.md`, patterns, plans, ADRs, and
  adjacent code, if the goal is specifically to test orthogonal memory

## Dependencies and Sequencing Assumptions

- Start with a scoped pilot corpus, not a repo-wide semantic pass
- Keep canonical memory artefacts authoritative in their existing roles
- If graph queries become useful in-session for engineering work, expose them
  via a separate internal MCP server or local CLI, not the public curriculum
  MCP server
- If the external-tool lane is chosen, Python 3 must become a deliberate,
  documented requirement
- If the code-adoption lane is chosen, ownership, maintenance, and
  licensing/terms review must be explicit before implementation work starts
- Durable concept adoption into repo doctrine likely requires an ADR and
  permanent documentation updates only after a pilot proves useful
- Cross-collection coordination may be needed with semantic-search,
  architecture-and-infrastructure, and SDK/MCP work if the exploration moves
  beyond local agent-memory tooling

## Success Signals

- an option matrix exists for external-tool, code-adoption, concept-adoption,
  hybrid, and no-action paths
- at least one pilot corpus and one pilot question are defined
- explicit success criteria exist for the chosen pilot
- the attribution pattern and acknowledgement wording are settled
- the boundary between canonical memory and derived graph memory is written
  clearly enough to support later implementation work
- the likely home of the next execution slice is identified
  (`agent-tools/`, `.agent/`, internal MCP server, or no action)

## Risks and Unknowns

- repo mutation or activation-precedence conflicts if the tool is integrated
  carelessly
- confusion between canonical memory and derived graph memory
- performance or cost issues on large corpora
- maintenance burden if Oak adopts code rather than just concepts
- over-engineering small corpora where reading is cheaper than graphing
- licensing/terms questions for any direct code adoption
- unclear ownership if the work spans Practice, tooling, and MCP surfaces

## Promotion Trigger

Promote this plan to `current/` only when:

1. a concrete next question has been chosen
2. a first pilot corpus has been selected
3. success signals and a validation approach are explicit
4. dependencies for the chosen lane are accepted
5. the next execution surface is known

## Implementation Detail Note

Any implementation detail captured here is reference context only. Final
execution choices belong to the later `current/` or `active/` plan.

Reference-only candidate command shapes:

- `pnpm agent-tools:practice-graph report`
- `pnpm agent-tools:practice-graph query`
- `pnpm agent-tools:practice-graph path`
