---
name: Agentic Corpus Discoverability and Deep-Dive Hub
overview: >
  Add an index-only agentic-engineering hub, named research/report lanes, and
  seed deep dives without relocating canon or disturbing experience records.
todos:
  - id: phase-0-authority-model
    content: "Phase 0: Lock the authority model, target structure, and non-goals."
    status: completed
  - id: phase-1-local-mesh
    content: "Phase 1: Create the local .agent mesh (hub, deep dives, lanes, reciprocal links)."
    status: completed
  - id: phase-2-docs-surfaces
    content: "Phase 2: Update human-facing docs discovery surfaces."
    status: completed
  - id: phase-3-review-validation
    content: "Phase 3: Run reviewer checkpoints, documentation sync, and validation."
    status: completed
---

# Agentic Corpus Discoverability and Deep-Dive Hub

**Last Updated**: 2026-04-19  
**Status**: ✅ COMPLETE  
**Scope**: Make the high-level agentic-engineering corpus easier to discover,
route, and synthesise without moving canon or rewriting reflective archives.

## Context

High-level agentic-engineering material currently spans:

- canonical doctrine in ADRs, Practice Core, and `/docs/**`
- long-lived reference notes in `.agent/reference/`
- research and adjacent developer-experience material in `.agent/research/`
- investigation and evidence artefacts in `.agent/analysis/`
- strategic and executable plans in
  `.agent/plans/agentic-engineering-enhancements/`
- reflective and staged concept sources in `.agent/experience/` and
  `.agent/practice-context/outgoing/`

That corpus is rich, but concept discovery is weaker than document-type
discovery. In particular:

1. `.agent/reference/agentic-engineering/` had no local hub README.
2. `.agent/reference/README.md` omitted
   `agentic-engineering/workbench-agent-operating-topology.md`.
3. Research, evidence, and future-plan material was discoverable mainly by
   folder literacy rather than by theme.
4. Human-facing `/docs/**` surfaces explained the practice well, but there was
   no reciprocal bridge back to the wider source corpus for deep dives.

## Authority Model

### Canonical truth stays where it already lives

- `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
- `docs/architecture/architectural-decisions/124-practice-propagation-model.md`
- `docs/architecture/architectural-decisions/125-agent-artefact-portability.md`
- `docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md`
- `docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md`
- `.agent/practice-core/practice.md`
- `docs/foundation/agentic-engineering-system.md`

### Indexing and synthesis rules

- The new hub in `.agent/reference/agentic-engineering/README.md` is
  **index-only**. It must not become a second canon.
- `.agent/analysis/` remains the authoritative lane for investigations and
  evidence.
- `.agent/reports/` is activated as a **formal report lane** only: audit-style
  outputs and formal synthesis artefacts belong there once promoted.
- `.agent/experience/**` is a protected reflective archive. Concepts may be
  extracted into new docs elsewhere, but the experience files themselves are
  not reorganised.
- `.agent/practice-context/outgoing/` remains staged/source material rather
  than canon. The new hub may route to it, but must not promote it implicitly.

## Target Structure

```text
.agent/plans/agentic-engineering-enhancements/
├── README.md
├── current/
│   └── agentic-corpus-discoverability-and-deep-dive-hub.plan.md
└── active/
    └── agentic-corpus-discoverability-and-deep-dive-hub.execution.plan.md

.agent/reference/agentic-engineering/
├── README.md
├── workbench-agent-operating-topology.md
└── deep-dives/
    ├── README.md
    ├── operating-model-and-topology.md
    ├── continuity-and-knowledge-flow.md
    ├── reviewer-system-and-review-operations.md
    ├── portability-and-platform-surfaces.md
    └── derived-memory-and-graph-navigation.md

.agent/research/agentic-engineering/
├── README.md
├── operating-model-and-platforms/README.md
├── reviewer-systems-and-discoverability/README.md
├── safety-evidence-and-enforcement/README.md
├── continuity-memory-and-knowledge-flow/README.md
└── derived-memory-and-graph-navigation/README.md

.agent/reports/
├── README.md
└── agentic-engineering/
    ├── README.md
    ├── discoverability-audits/README.md
    └── deep-dive-syntheses/README.md
```

## Workstreams

### Phase 1: Local `.agent` mesh

Create the new index surfaces first:

- source plan in `current/`
- active execution plan in `active/`
- agentic-engineering hub and seed deep dives
- research lane root + named lane READMEs
- reports lane root + named lane READMEs
- reciprocal links from collection README, reference README, analysis README,
  research README, and practice index

**Execution checkpoint**:
run `docs-adr-reviewer` after this mesh exists, before broader `/docs/**`
changes.

### Phase 2: Human-facing docs discovery surfaces

Update the selected docs entry points so human readers can discover the wider
corpus without going through `AGENT.md`:

- `docs/README.md`
- `docs/foundation/README.md`
- `docs/foundation/agentic-engineering-system.md`

Update `docs/governance/README.md` and
`docs/architecture/architectural-decisions/README.md` only if they materially
improve discoverability. Otherwise record no-change rationale in the
documentation sync log.

### Phase 3: Review, sync, and validation

- `docs-adr-reviewer` execution checkpoint (local mesh)
- `docs-adr-reviewer` mid-execution checkpoint (`/docs/**` surfaces)
- `onboarding-reviewer` paired mid-execution review because root/foundation
  docs are updated
- final `docs-adr-reviewer` pass on the full diff plus the documentation sync
  entry
- documentation sync log update with explicit ADR-119/practice.md/no-change
  rationale where appropriate

## Non-Goals

- Do not link the new hub from `.agent/directives/AGENT.md`.
- Do not move canon out of ADRs, Practice Core, or `/docs/**`.
- Do not reorganise `.agent/experience/**`.
- Do not turn `.agent/analysis/` and `.agent/reports/` into duplicate report
  lanes with competing authority.
- Do not move large numbers of existing research documents unless the move is
  obviously unambiguous and low-risk.

## Risks and Mitigations

1. **Second-canon drift**
   - Mitigation: keep the hub index-only and route back to canonical docs for
     decisions and doctrine.
2. **Lane ambiguity between analysis and reports**
   - Mitigation: analysis owns investigation/evidence, reports owns formal
     audit/synthesis promotion only.
3. **Reflective-source disruption**
   - Mitigation: use deep dives to extract concepts while leaving experience
     files untouched.
4. **Discoverability gained at the cost of duplication**
   - Mitigation: prefer short index notes and link-outs over restating large
     bodies of text.

## Reviewer Matrix

- **Planning checkpoint**: completed with `docs-adr-reviewer`
- **Execution checkpoint**: `docs-adr-reviewer`
- **Mid-execution checkpoint**: `docs-adr-reviewer` + `onboarding-reviewer`
- **Final checkpoint**: `docs-adr-reviewer`

## Deterministic Validation

```bash
pnpm markdownlint:root
pnpm practice:fitness:informational
rg -n "agentic-engineering/README.md|workbench-agent-operating-topology" .agent/reference/README.md .agent/plans/agentic-engineering-enhancements/README.md .agent/practice-index.md
find .agent/research/agentic-engineering -type f -name README.md | sort
find .agent/reports/agentic-engineering -type f -name README.md | sort
pnpm check
```

## Promotion and Execution Link

Execution authority lives in:
[active/agentic-corpus-discoverability-and-deep-dive-hub.execution.plan.md](../active/agentic-corpus-discoverability-and-deep-dive-hub.execution.plan.md)
