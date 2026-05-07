---
name: "Memory/State Substrate — Portable Contracts"
overview: >
  Adopt PDR-050 across the host bridge and Practice doctrine surfaces so state,
  memory, generated read models, surface contracts, contract-for-contracts, and
  immune layers are expressed portably before repo-local tooling hardens them.
todos:
  - id: phase-0-current-surface-audit
    content: "Phase 0: Audit current state, memory, generated read models, existing contracts, and known artefacts against PDR-050."
    status: pending
  - id: phase-1-host-bridge-adoption
    content: "Phase 1: Update the host bridge index and local doctrine pointers so PDR-050 is discoverable without host leakage in the Core."
    status: pending
  - id: phase-2-contract-template
    content: "Phase 2: Define the host-local surface-inventory contract, surface-contract template, and severity vocabulary consumed by the doctor plan."
    status: pending
  - id: phase-3-immune-layer-routing
    content: "Phase 3: Route prevention, detection, mitigation, repair, and learning responsibilities across rules, commands, consolidation, and reviewer surfaces."
    status: pending
  - id: phase-4-adoption-review
    content: "Phase 4: Run docs/PDR review and assumptions review; record accepted or rejected follow-ons."
    status: pending
  - id: phase-5-closure
    content: "Phase 5: Quality gates green; consolidation pass complete; plan ready for archive."
    status: pending
isProject: false
---

# Memory/State Substrate — Portable Contracts

**Last Updated**: 2026-05-07
**Status**: QUEUED
**Scope**: Host adoption of
[PDR-050](../../../practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md)
and related portable doctrine for state, memory, generated read models, surface
contracts, and immune layers.

---

## Context

PDR-049 settled merge-time semantics for memory and state files after the first
parallel-checkout merge incident. The next lesson is broader: doctrine without
an executable immune layer becomes operational debt. A check can pass while
stale paths, duplicate surfaces, generated-output drift, or ambiguous repair
paths continue to accumulate.

PDR-050 now names the portable doctrine. This plan adopts that doctrine into
the host bridge and the local process surfaces without moving host-local paths
or implementation commands into the Practice Core.

State is not a kind of memory. State is truth-of-now; memory is
truth-across-time. They are sibling planes in one Practice substrate, connected
by consolidation.

## Metacognition

The impact of this work is not another document saying "be careful". The
impact is a reusable pattern that can be applied to any subsystem:

```text
contract -> checker -> repair path -> consolidation feedback -> portable doctrine
```

The reflective question at each phase is: which part of the loop would still
depend on a future agent remembering the lesson unaided? That dependency is the
next enforcement gap.

## Workstreams

### Phase 0: Current Surface Audit

Catalogue the current Practice substrate:

- live state surfaces and their freshness/lifecycle semantics;
- durable memory surfaces and their graduation semantics;
- generated read models and their source fragments;
- the substrate inventory source: live roots, archived/historical roots,
  exclusions, discovery rules, owners, and portability tiers;
- existing schemas, frontmatter, `merge_class` declarations, and READMEs;
- known artefacts, including stale canonical paths and old/new duplicate
  surfaces.

**Acceptance criteria**:

- The substrate inventory has a proposed owner, discovery rule, archive/live
  classification, and portability tier.
- Every in-scope surface has a proposed contract owner and portability tier.
- Existing PDR-049 merge classes are reconciled with PDR-050's broader surface
  contract fields.
- The audit explicitly records whether state is being treated as memory
  anywhere in live docs.

### Phase 1: Host Bridge Adoption

Update host-local bridge and index surfaces so PDR-050 is discoverable from the
repo without adding host-local detail to the Core.

**Acceptance criteria**:

- `.agent/practice-index.md` maps PDR-050 to the host adoption plans.
- Local state/memory entry points point readers to the substrate contract.
- No Practice Core file gains host-specific paths, ADR numbers, or commit
  references.

### Phase 2: Surface-Inventory and Surface-Contract Template

Define the local inventory and template consumed by the doctor implementation
plan. The inventory contract must include:

- live roots, archived/historical roots, and explicit exclusions;
- discovery rules for files, schemas, directory READMEs, generated read models,
  and fragment directories;
- owner/reviewer route and portability tier for the inventory itself.

The surface template must include:

- purpose, authority, lifecycle, and write API;
- merge class, schema/parser, generated outputs, and validator;
- repair path, severity, portability tier, and owner/reviewer route.

**Acceptance criteria**:

- The template is concrete enough for another agent to fill in without asking
  for hidden policy.
- The inventory contract is concrete enough for the doctor to prove it has found
  the full substrate, not only known files.
- The template distinguishes deterministic repairs from semantic judgement.
- Stored derived values are allowed only with recomputation.

### Phase 3: Immune-Layer Routing

Map each responsibility to the right layer:

- prevention through authoring rules and write APIs;
- detection through deterministic checks;
- mitigation through structured diagnostics and reviewer routing;
- repair through dry-run/apply tooling;
- learning through consolidation.

**Acceptance criteria**:

- Structural failures are blocking where they are unambiguous.
- Semantic ambiguities produce named remediation items, not silent repairs.
- Consolidation has an explicit role in refining contracts after repeated
  defects.

### Phase 4: Review

Run reviewers against the doctrine and adoption plan:

- `docs-adr-reviewer` for PDR/bridge quality;
- `assumptions-reviewer` for proportionality and hidden deferrals;
- `architecture-reviewer-fred` for boundary discipline.

**Acceptance criteria**:

- Findings are either fixed, routed into a named plan, or rejected with
  rationale.
- No future-only dependency is cited as if it were current enforcement.

### Phase 5: Closure

Run the consolidation workflow and quality gates.

**Validation**:

```bash
pnpm portability:check
pnpm practice:vocabulary
pnpm practice:fitness:informational
pnpm markdownlint:root
```

**Closure criteria**:

- Durable doctrine lives in PDR-050 and the host bridge.
- Tooling work is owned by the repo-local doctor plan.
- The plan can be archived without losing methodology.

## Non-Goals

- Implementing the doctor tool. That belongs to the repo-local tooling plan.
- Moving state out of git.
- Rewriting the full memory taxonomy.
- Deleting historical event fragments or archived references.
