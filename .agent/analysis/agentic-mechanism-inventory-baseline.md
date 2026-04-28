# Agentic Mechanism Inventory Baseline

**Captured**: 2026-04-19
**Purpose**: Baseline inventory of the operating-model, signal, and control
mechanisms that shape agentic engineering in this repository but are not yet
consistently named as abstract mechanism types in Practice or the PDR set.

## Metacognitive Framing

- **Thought**: The workbench topology note first appears to be a compact local
  operating note for editor-resident agents.
- **Reflection**: On closer inspection it is the clearest concise description
  of the repo's turn-level operating system, especially the parts that the
  continuity, knowledge-flow, and reviewer documents currently assume rather
  than name.
- **Insight**: When a mechanism family lacks a named home, utility pushes it
  into the nearest working surface. The continuation prompt absorbed a work
  ledger; the reviewer gateway is absorbing posture selection and signal
  routing; evidence discipline is split across claim-quality and formatting
  surfaces. The problem is not conceptual absence but abstraction debt.
- **Bridge from action to impact**: Give the mechanism families names, route
  each family to the correct lane, and only then decide which deserve a
  repo-local pilot, a future plan, or a Practice-level promotion.

## Core Finding

The repo already has strong doctrine for:

- knowledge flow and consolidation convergence
- continuity surfaces and the surprise pipeline
- vital integration surfaces
- reviewer and specialist infrastructure
- quality gates and fitness governors

What remains mostly implicit is the broader **turn-level mechanism layer**
around:

- interaction planes and disclosure boundaries
- posture selection and control-loop stages
- temporary operational ledgers
- authority and precedence
- sensors, signals, alerts, and special feeds
- evidence rendering as a mechanism family
- artefact-economy rules
- renewal triggers for model freshness

## Mechanism Families

### 1. Interaction planes and disclosure boundaries

- **Workbench anchor**:
  `visible exchange`, `execution channel`, `private feed`,
  `evidence surfaces`, `local doctrine`
- **Current examples**:
  commentary/final updates, tool execution, environment context and live
  console mirrors, markdown file-reference discipline, and repo-local doctrine
  in `AGENT.md` plus directives
- **Already named in**:
  ADR-125, PDR-024, and
  [`agentic-engineering-system.md`](../../docs/foundation/agentic-engineering-system.md)
- **Gap**:
  no single abstraction explains which information belongs on which plane or
  how disclosure boundaries are maintained
- **Route**:
  future
  [operating-model-mechanism-taxonomy.plan.md](../plans/agentic-engineering-enhancements/future/operating-model-mechanism-taxonomy.plan.md)

### 2. Turn-level control loop and non-linear re-entry

- **Workbench anchor**:
  `intent intake -> posture choice -> grounding pass -> change phase ->
  assurance sweep -> return pass`
- **Current examples**:
  `start-right-*`, the plan design gate, direct execution, quality-gate and
  reviewer loops, and closeout reporting after checks
- **Already named in**:
  continuity split-loop docs, the knowledge flow, and plan workflows
- **Gap**:
  no compact general control-loop model exists for ordinary turn execution and
  failed-check re-entry
- **Route**:
  future
  [operating-model-mechanism-taxonomy.plan.md](../plans/agentic-engineering-enhancements/future/operating-model-mechanism-taxonomy.plan.md)

### 3. Posture selection

- **Workbench anchor**: `posture selector`
- **Current examples**:
  direct vs exploratory vs plan-led handling, review-depth choice, gateway
  triage, and explicit planning mode requests
- **Already named in**:
  `.agent/commands/plan.md` design gate and the reviewer gateway source plan
- **Gap**:
  it is not yet described as a reusable mechanism across repo workflows
- **Route**:
  enhance
  [reviewer-gateway-upgrade.plan.md](../plans/agentic-engineering-enhancements/current/reviewer-gateway-upgrade.plan.md)
  and keep the broader abstraction in the future taxonomy plan

### 4. Temporary operational ledgers

- **Workbench anchor**: `work ledger`
- **Current examples**:
  the continuation prompt's live state blocks, active workstream TODO sections,
  and the proposed workstream briefs plus tactical track cards
- **Already named in**:
  continuity doctrine only indirectly via the continuity contract
- **Gap**:
  there is no clean dedicated home for thread-aware short-horizon operational
  awareness
- **Route**:
  enhance
  [operational-awareness-and-continuity-surface-separation.plan.md](../plans/agentic-engineering-enhancements/archive/completed/operational-awareness-and-continuity-surface-separation.plan.md)
  and treat it as a high-impact next-step candidate

### 5. Authority and precedence

- **Workbench anchor**: `authority order`
- **Current examples**:
  user instruction over repo doctrine, repo doctrine over platform defaults,
  and the proposed `plan -> repo continuity -> workstream brief -> track card`
  precedence stack
- **Already named in**:
  the operational-awareness source plan locally, plus scattered directive
  behaviour
- **Gap**:
  no repo-wide reusable precedence and disagreement-resolution pattern is
  explicitly named
- **Route**:
  enhance the operational-awareness plan, keep the broader abstraction in the
  future taxonomy plan, and treat precedence as a high-impact next-step
  candidate

### 6. Signals, sensors, alerts, and special feeds

- **Workbench anchor**:
  `live console mirrors`, `path mentions`, `ordinal markers`,
  `capability inventories`
- **Current examples**:
  quality gates, reviewer findings, fitness thresholds, health probes, user
  feedback, change-profile signals, escalation recommendations, and stale-link
  or continuity-drift checks
- **Already named in**:
  ADR-131, PDR-016, PDR-017, PDR-024, and the reviewer gateway's
  signal-routed cluster model
- **Gap**:
  signal families are described piecemeal, not as a coherent mechanism type
  with named examples
- **Route**:
  enhance the reviewer gateway plan for review-signal routing and use the
  future taxonomy plan for the broader signal/sensor model

### 7. Evidence surfaces and rendering discipline

- **Workbench anchor**: `evidence surfaces`
- **Current examples**:
  evidence bundles, quoted project material vs drafted examples, file-reference
  discipline, docs-ADR review, claim->cite->verify expectations, and report
  normalisation
- **Already named in**:
  the hallucination/evidence source plan, PDR-016, and repo formatting rules
- **Gap**:
  this is still treated as scattered document hygiene rather than as an
  explicit cross-cutting mechanism family
- **Route**:
  keep execution in
  [hallucination-and-evidence-guard-adoption.plan.md](../plans/agentic-engineering-enhancements/current/hallucination-and-evidence-guard-adoption.plan.md)
  and register the family in the future taxonomy plan

### 8. Artefact economy and conservative proliferation

- **Workbench anchor**:
  `alter an existing surface before proliferating new artefacts`
- **Current examples**:
  the index-only hub design, collapsing duplicate authoritative frames,
  preferring canonical docs over platform wrappers, and existing-surface-first
  updates
- **Already named in**:
  recent patterns and planning decisions, but not as a general mechanism family
- **Gap**:
  there is no abstract mechanism type for surface economy, duplication
  pressure, or proliferation discipline
- **Route**:
  future
  [operating-model-mechanism-taxonomy.plan.md](../plans/agentic-engineering-enhancements/future/operating-model-mechanism-taxonomy.plan.md)

### 9. Renewal triggers and freshness probes

- **Workbench anchor**:
  `platform generation shift`, `behaviour mismatch`, `fossil risk`
- **Current examples**:
  reviewer-led docs refreshes, portability validation, continuity health probes,
  and re-grounding when workflows drift
- **Already named in**:
  consolidation practice, `last_reviewed` surfaces, and health-probe style
  checks
- **Gap**:
  no named renewal-trigger model explains when an operating note or mechanism
  spec should be revisited
- **Route**:
  future
  [operating-model-mechanism-taxonomy.plan.md](../plans/agentic-engineering-enhancements/future/operating-model-mechanism-taxonomy.plan.md)

## Plan Routing Summary

### Existing plans to enhance now

- [operational-awareness-and-continuity-surface-separation.plan.md](../plans/agentic-engineering-enhancements/archive/completed/operational-awareness-and-continuity-surface-separation.plan.md)
  should explicitly absorb the work-ledger, precedence, and bounded
  signal-routing implications from the topology note.
- [reviewer-gateway-upgrade.plan.md](../plans/agentic-engineering-enhancements/current/reviewer-gateway-upgrade.plan.md)
  should explicitly treat the gateway as a posture-selector and
  signal-router, not only as a larger specialist roster manager.

### Existing plan home that already owns delivery

- [hallucination-and-evidence-guard-adoption.plan.md](../plans/agentic-engineering-enhancements/current/hallucination-and-evidence-guard-adoption.plan.md)
  remains the execution home for claim/evidence discipline. The missing work is
  the higher-level mechanism taxonomy, not a second evidence rollout plan.

### New future plan

- [operating-model-mechanism-taxonomy.plan.md](../plans/agentic-engineering-enhancements/future/operating-model-mechanism-taxonomy.plan.md)
  should own the broader abstraction work across planes, loops, signals,
  precedence, artefact economy, and renewal triggers.

## High-Impact Next-Step Candidates

1. Pilot the work-ledger split with explicit precedence and thread ownership.
2. Extend review orchestration from specialist roster management to explicit
   signal routing and escalation semantics.
3. Once the bounded pilots produce evidence, promote a small first slice of the
   future taxonomy plan rather than trying to codify the whole mechanism estate
   in one pass.
