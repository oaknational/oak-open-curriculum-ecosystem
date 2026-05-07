---
name: "Memory/State Substrate — Portable Contracts"
overview: >
  Adopt PDR-050 across the host bridge and Practice doctrine surfaces so state,
  memory, generated read models, surface contracts, contract-for-contracts, and
  immune layers are expressed portably before repo-local tooling hardens them.
todos:
  - id: phase-0-current-surface-audit
    content: "Phase 0: Audit current state, memory, generated read models, existing contracts, and known artefacts against PDR-050."
    status: completed
  - id: phase-1-host-bridge-adoption
    content: "Phase 1: Update the host bridge index and local doctrine pointers so PDR-050 is discoverable without host leakage in the Core."
    status: completed
  - id: phase-2-contract-template
    content: "Phase 2: Split the transferable surface-contract specification from the host-local substrate instance, then define the local inventory consumed by the doctor plan."
    status: completed
  - id: phase-3-immune-layer-routing
    content: "Phase 3: Route prevention, detection, mitigation, repair, and learning responsibilities across rules, commands, consolidation, and reviewer surfaces."
    status: completed
  - id: phase-4-adoption-review
    content: "Phase 4: Run docs/PDR, assumptions, architecture, code, and test review; record fixed, routed, or rejected follow-ons."
    status: completed
  - id: phase-5-closure
    content: "Phase 5: Current commands pass, known fitness pressure is routed without trimming substance, and the plan is ready for archive."
    status: completed
isProject: false
---

# Memory/State Substrate — Portable Contracts

**Last Updated**: 2026-05-07
**Status**: IN PROGRESS
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

### Phase 2: Transferable Contract and Local Instance

Split the transferable substrate contract from the local instance. The
transferable contract belongs in Practice Core (PDR-050 unless it grows into a
new dedicated Core surface). The local instance belongs in host memory or a
stricter generated data file consumed by the doctor implementation plan.

The local inventory contract must include:

- live roots, archived/historical roots, and explicit exclusions;
- discovery rules for files, schemas, directory READMEs, generated read models,
  and fragment directories;
- owner/reviewer route and portability tier for the inventory itself.

The transferable surface template must include:

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
- The portable fields/vocabulary live in Practice Core while concrete roots,
  commands, schemas, and known gaps remain in the repo-local instance.

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
- `code-reviewer` for the closure gate and specialist coverage;
- `test-reviewer` for doctor Phase 0/1 validation sequencing.

**Acceptance criteria**:

- Findings are either fixed, routed into a named plan, or rejected with
  rationale.
- No future-only dependency is cited as if it were current enforcement.
- PDR-049 uses portable language only; host-local active-claims and policy-file
  paths live in the bridge index and local substrate contract.
- The legacy `comms/events/` terminal condition is accepted as a historical
  path that must be absent on disk, with migration-ledger validation preserving
  provenance.
- Merge-topology blocking policy is routed to the doctor Phase 0 defect ledger
  and Phase 1 topology fixtures.
- The prior `test-reviewer` hold is closed for this plan and becomes a
  mandatory checkpoint after Doctor Phase 0 and before Phase 1 fixture work.

### Phase 5: Closure

Run the consolidation workflow and current closure gates. Fitness is
informational here: known pressure must be explicitly routed, and no memory or
Practice Core substance may be trimmed to make the report greener.

**Validation**:

```bash
pnpm agent-tools:collaboration-state -- check \
  --active .agent/state/collaboration/active-claims.json \
  --closed .agent/state/collaboration/closed-claims.archive.json \
  --events-dir .agent/state/collaboration/comms-events
pnpm test:root-scripts
pnpm portability:check
pnpm practice:vocabulary
pnpm practice:fitness:informational
pnpm markdownlint-check:root
git diff --check
```

**Closure criteria**:

- Strict manifest validation and required-field checks pass for 22 surfaces.
- Migration ledger validation proves 114 entries, no duplicate source/target
  paths, and target byte-count/SHA-256 matches.
- The legacy `.agent/state/collaboration/comms/events/` root is absent on disk;
  the canonical `comms-events` root parses through the explicit
  collaboration-state check.
- Durable doctrine lives in PDR-050 and the host bridge.
- Tooling work is owned by the repo-local doctor plan.
- Known fitness pressure is named as routed health evidence, not closure
  failure and not permission to delete, compress, or weaken knowledge.
- The retired YAML seed is preserved as dated evidence outside the live
  executive contract.
- The plan can be archived without losing methodology.

## Non-Goals

- Implementing the doctor tool. That belongs to the repo-local tooling plan.
- Moving state out of git.
- Rewriting the full memory taxonomy.
- Deleting historical event fragments or archived references.

## Phase 3 Routing

The local immune-layer responsibilities are routed as follows:

| Responsibility | Current home | Doctor-facing route |
| --- | --- | --- |
| Prevention | Entry-point docs, PDR-050, the human contract, state/memory READMEs, and existing write APIs such as `agent-tools:collaboration-state` | Future scripts must invoke built `agent-tools` output only; authors should not write new event fragments to retired roots |
| Detection | Strict manifest/schema validation plus explicit collaboration-state checks | Future `practice:substrate:check` consumes the strict manifest before broadening into repo-local doctor checks |
| Mitigation | Manifest `severity`, `repair_path`, and `owner_reviewer_route` fields | Findings must distinguish blocking structural defects from semantic judgement and name the reviewer route |
| Repair | Deterministic write APIs and future dry-run/apply doctor flows | Repairs may re-render or rehome only when source evidence, stable identity, and ledger provenance make the edit deterministic |
| Learning | Napkin, pending graduations, consolidation, reviewer feedback, and future PDR/rule amendments | Repeated findings route through consolidation instead of trimming memory/state content to satisfy fitness |

## Implementation Notes

- 2026-05-07: Phase 0/2 seeded the host-local inventory and contract template
  at
  [`memory-state-substrate-contracts.md`](../../../memory/executive/memory-state-substrate-contracts.md).
  The template includes discovery roots, archive/fixture exclusions, the
  seeded surface manifest, severity vocabulary, repair classes, and the
  built-output-only command boundary for the future doctor.
- 2026-05-07: Phase 0/2 completed the parseability decision by promoting the
  local instance into
  [`memory-state-substrate-contracts.manifest.json`](../../../memory/executive/memory-state-substrate-contracts.manifest.json)
  and
  [`memory-state-substrate-contracts.schema.json`](../../../memory/executive/memory-state-substrate-contracts.schema.json).
  The strict manifest carries 22 surface rows with the required contract fields
  and validates against the schema. The Markdown contract remains the
  human-facing local instance; the earlier fenced YAML is a retired seed
  snapshot preserved as dated evidence, not the machine-consumed source.
- 2026-05-07: Phase 0/2 completed the legacy event transition. The 114 tracked
  legacy fragments under `.agent/state/collaboration/comms/events/` were
  collision-checked, JSON-parse-checked, ledgered with original path, target
  path, SHA-256, byte count, source evidence, and rationale, then moved to the
  canonical `.agent/state/collaboration/comms-events/` root. The legacy path is
  historical evidence only and must not remain on disk.
- 2026-05-07: Phase 3 routing is now explicit: prevention through entry-point
  docs, rules, and write APIs; detection through the future
  `practice:substrate:check`; mitigation through structured severity and
  reviewer routing; repair through dry-run/apply deterministic paths only; and
  learning through consolidation and reviewer feedback.
- 2026-05-07: owner clarified the better architecture: the seed template's
  portable contract substance belongs in Practice Core as a transferable
  specification, while definite filled inventories live repo-locally. PDR-050
  now captures that split; this plan keeps Phase 0/2 open until the local
  instance is complete enough for the doctor.
- 2026-05-07: owner clarified the broader frame: the Practice is a philosophy
  and commitment, not only a specification repository. Specification is a
  powerful portability tool for fully specified, implementation-agnostic
  processes, flows, contracts, approaches, structures, and support systems.
  The memory/state substrate is one instance of a pattern that may apply to
  other agentic engineering processes later.
- 2026-05-07: owner clarified that fitness signals need active interaction
  design, not only passive doctrine. Non-healthy fitness output should remind
  agents to preserve substance first and route pressure structurally; agents
  must not reactively trim memory or Practice Core content to make a report
  greener.
- 2026-05-07: Phase 4 review closure fixed the PDR-049 Core-portability leak
  by moving host-state and host-policy-path guidance into the host bridge. It
  also recorded dispositions for the legacy event terminal state and merge
  topology policy, and moved the doctor test-reviewer hold to the post-Phase-0,
  pre-Phase-1 checkpoint.
