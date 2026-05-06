---
name: "Principles Entrypoint Content Homing + Operationalisation Contract"
status: NOT STARTED — strategic brief
created: 2026-05-06
authored_by: "Hidden Slipping Moth (claude-code, claude-opus-4-7-1m, 4be7b5)"
thread: agentic-engineering-enhancements
overview: >
  Slim .agent/directives/principles.md into a focused entrypoint + index
  by homing operational detail to durable per-mechanism files. Make the
  principle → operationalisation flow an explicit contract so progressive
  disclosure is honoured at every level.
todos:
  - id: phase-0-mental-model-and-contract
    content: "Phase 0: Author the mental model and operationalisation contract; align with owner."
    status: pending
  - id: phase-1-mechanism-catalogue
    content: "Phase 1: Catalogue the operationalisation mechanisms (rules, hooks, sub-agents, ESLint plugins, quality gates, skills, ADRs/PDRs, governance docs, patterns, worked examples)."
    status: pending
  - id: phase-2-source-to-target-ledger
    content: "Phase 2: Build the principles.md source-to-target content ledger (each section/bullet → home)."
    status: pending
  - id: phase-3-confirm-targets
    content: "Phase 3: Confirm durable homes exist and meet the file-size + index discipline; create where missing."
    status: pending
  - id: phase-4-extractions
    content: "Phase 4: Execute extractions in priority order; each one is a separate atomic commit with bidirectional links."
    status: pending
  - id: phase-5-slim-entrypoint
    content: "Phase 5: Slim principles.md into a focused entrypoint + operationalisation index."
    status: pending
  - id: phase-6-validate
    content: "Phase 6: Validate discovery parity, link integrity, fitness; consolidate."
    status: pending
isProject: false
---

# Principles Entrypoint Content Homing + Operationalisation Contract

**Status**: NOT STARTED — strategic brief
**Lifecycle**: `future/` — promote to `current/` after Phase 0 alignment with owner
**Prior art**: [`agent-entrypoint-content-homing.plan.md`](../current/agent-entrypoint-content-homing.plan.md) (COMPLETED 2026-04-24) — same shape applied to `AGENT.md`
**Related efforts**:

- [`knowledge-role-documentation-restructure.plan.md`](../current/knowledge-role-documentation-restructure.plan.md) — broader knowledge-role restructure under PDR-014
- [`operating-model-mechanism-taxonomy.plan.md`](operating-model-mechanism-taxonomy.plan.md) — mechanism-taxonomy discovery
- [`memetic-immune-system-and-progressive-disclosure.plan.md`](memetic-immune-system-and-progressive-disclosure.plan.md) — progressive disclosure as enforcement-layer concept

---

## Problem and Intent

`.agent/directives/principles.md` currently mixes three kinds of content:

1. **Generative principles** — short, load-bearing claims that generate
   downstream rules and operational discipline (First Question; Strict
   and Complete; Architectural Excellence Over Expediency; Owner
   Direction Beats Plan; Separate Framework from Consumer; etc.).
2. **Operational guidance** — concrete rules with magic numbers
   (250-line `max-lines`, 50-line `max-lines-per-function`, ESLint
   counting `??` as a branch).
3. **Tooling inventory and type-system rules** — Turborepo / pnpm /
   Vitest / Playwright / TypeScript / ESLint / Prettier configuration
   discipline; the 10-bullet `Compiler Time Types and Runtime
   Validation` block.

The mix has three concrete costs:

- **File hits HARD fitness** (24238 chars / 24000) — already over the
  hard limit at the time of authoring this plan; every new principle
  candidate worsens the fitness pressure even when the substance
  belongs in a separate home.
- **Context-budget consumption at every session** — every agent reads
  this file at session open; large operational sections crowd out
  other directives' load-bearing claims.
- **Concept-finding latency** — type-system rules and refactoring
  numerics live mid-file; readers searching for "how big can a
  function be?" land in the middle of a principles document instead
  of at a focused governance home.

Prior art for the cure is the **AGENT entrypoint content homing** plan
(`agent-entrypoint-content-homing.plan.md`, completed 2026-04-24): the
same problem applied to `AGENT.md`. The result was a slim entrypoint
that reads in <200 lines while every concept landed in a durable home
discoverable through the entrypoint's index. That pattern is the model
for this plan.

## The Mental Model: Principles → Operationalisation → Worked Examples

There is a flow from principles to operation. The flow has three
levels of progressive disclosure:

```text
┌────────────────────────────────────────────────────────┐
│  Level 1: Principles (.agent/directives/)              │
│  WHY a thing must be true; the generative claim.       │
│  Small. Generative. Read at every session open.        │
└────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────┐
│  Level 2: Operationalisation Mechanisms                │
│  HOW the principle is enforced or expressed.           │
│  Multiple mechanisms per principle is the norm.        │
│  Rules are ONE mechanism — not the only one.           │
└────────────────────────────────────────────────────────┘
                         ↓
┌────────────────────────────────────────────────────────┐
│  Level 3: Worked Examples + Recipe Detail              │
│  The detailed instances, post-mortems, recipes.        │
│  Small focused files indexed at the level above.       │
│  Read on-demand, not at session open.                  │
└────────────────────────────────────────────────────────┘
```

A principle may be operationalised by **zero or more mechanisms**.
Layered defences — a principle enforced by both a hook AND a rule AND
a sub-agent — are intentional, not redundant: they target different
firing moments (write-time vs commit-time vs review-time) and that
layering is the substance of PDR-029 (perturbation-mechanism bundle)
and PDR-044 (memetic immune system).

The contract must NOT force one-mechanism-per-principle.

## The Contract: What Belongs at Which Level

### Level 1: Principles (.agent/directives/principles.md, etc.)

**Belongs here**:

- The generative claim (the WHY).
- One short paragraph (3–10 lines) per principle that gives the load-
  bearing reasoning a fresh reader needs.
- A pointer block listing the operationalisation mechanisms for that
  principle.

**Does NOT belong here**:

- Magic numbers from operational rules (line counts, function
  complexity caps).
- Tooling inventory or configuration discipline.
- Type-system rule lists.
- Worked failure-mode examples.
- Historical context ("Six instances occurred…", "Owner stated
  2026-05-01…").

### Level 2: Operationalisation Mechanisms

A non-exhaustive catalogue (Phase 1 produces the canonical list):

| Mechanism | Surface | Firing Moment |
|---|---|---|
| Rules | `.agent/rules/*.md` (always-loaded) | Passive, every interaction |
| Hooks | `.agent/hooks/policy.json` | Write-time (innate immunity) |
| Sub-agents / specialist reviewers | `.claude/agents/`, `.cursor/`, `.agents/` | Review-time (adaptive immunity) |
| ESLint custom plugins | `packages/core/oak-eslint/` | Lint-time |
| Quality gates | `pnpm check`, `pnpm test`, etc. | Pre-commit + CI |
| Skills | `.agent/skills/*` | Workflow-time (always-active or invoked) |
| ADRs | `docs/architecture/architectural-decisions/` | Decision record (architecture) |
| PDRs | `.agent/practice-core/decision-records/` | Decision record (Practice) |
| Governance docs | `docs/governance/*.md` | Detailed elaboration of practice |
| Patterns library | `.agent/memory/active/patterns/*.md` | Recurring solutions / failures |
| Distilled / pending-graduations | `.agent/memory/active/`, `operational/` | Learning-loop staging |
| ADR/PDR amendments | inline | Doctrine evolution |

A given principle may use several of these; each operationalisation
file links **upward** to the principle it serves and **across** to
peer mechanisms that target the same principle.

### Level 3: Worked Examples and Recipes

**Belongs here**:

- Per-instance worked examples (one file per scenario or pattern).
- Historical post-mortems and failure-mode case studies.
- Detailed recipes (e.g. "how to extend an ESLint rule").

**Discipline**:

- One concept per file. Title states the concept. Body is small.
- Indexed at the parent mechanism's index file.
- Linked from the principle (via the mechanism index, not directly)
  so progressive disclosure is preserved.

**Prior art**: `.agent/memory/active/patterns/` already does this
correctly — per-pattern files indexed at `patterns/README.md`.

### File-Size Discipline Per Level

| Level | Target | Hard | Rationale |
|---|---|---|---|
| Level 1 (entrypoint principles) | <200 lines | 275 | Read at every session open |
| Level 2 (mechanism / governance doc) | <150 lines | 220 | Concept-focused; one mechanism |
| Level 3 (worked example) | <80 lines | 120 | One scenario per file |

The hard limits are advisory targets for the contract, not yet
codified into fitness frontmatter; Phase 6 codifies them into
per-file fitness frontmatter.

### Index Discipline

Every level needs a small index file:

- Top: `principles.md` itself (after extraction) is the principles
  index.
- Mid: each governance doc has its own table of contents and links
  out to per-recipe files.
- Low: each mechanism category has a README (`patterns/README.md`,
  `rules/` already has `RULES_INDEX.md`, decision records have a
  README, etc.).

Indexes are pointer + 1-line "what is here" descriptions; never
content of their own.

## Aspects the Owner Named

1. The flow from principles to operation.
2. Rules are ONE mechanism; there are others.
3. Detailed examples need to be small and focused.
4. Index files must be clear.
5. Large files cost context; small discoverable files enable
   progressive disclosure.

## Aspects the Owner Did Not Name (Surfaced Here)

These are the "important aspects I have not mentioned" the owner
asked to be surfaced. Each is a candidate for inclusion in the
final contract; flag any that should not.

1. **Bidirectional traceability is non-negotiable**. Every
   operationalisation file links upward to its principle. Without the
   upward link, drift accumulates silently — a rule's meaning shifts
   without the principle moving, or vice versa. Mitigation: a
   consolidate-docs pass audits the principle ↔ mechanism alignment.
2. **Layered defences are intentional**. A single principle may be
   operationalised by hook + rule + sub-agent simultaneously. The
   contract MUST allow this; any structure that forces
   one-mechanism-per-principle is wrong (PDR-029, PDR-044 prior art).
3. **Cross-mechanism index lives at the principle**. The principle
   entry lists ALL mechanisms operationalising it. This makes the
   layering visible and discoverable in one place.
4. **The recursion test**. The same contract applies at every level:
   if Level 2 (a governance doc) bloats, extract its detail to Level
   3 worked examples and reduce Level 2 to an index. The same
   reasoning that justifies extracting from Level 1 justifies
   extracting from Level 2.
5. **Granularity test for "deserves its own file"**. A worked example
   gets its own file when (a) it has been instanced ≥2 times, OR (b)
   it would add ≥30 lines to its candidate parent. Below either
   threshold, inline is fine.
6. **Drift risk after split**. Once principle and mechanism are in
   different files, they can rot independently. Mitigations: (a)
   mandatory bidirectional link; (b) consolidate-docs alignment
   audit; (c) optional automated link-integrity check at fitness time.
7. **Over-extraction is also a failure mode**. If reading a single
   principle requires opening 5 files to get full context, the
   extraction has fragmented too far. The test: the entrypoint plus
   one mechanism file should be enough for 80% of read paths.
8. **Discovery surface is AGENT.md**. The entrypoint is already
   slimmed; principles.md is the next layer down. After this plan,
   AGENT.md → principles.md → operationalisation mechanism is the
   read path; each step should be obviously sized for its role.
9. **Some principles do not need extraction**. The First Question,
   Architectural Excellence Over Expediency, Owner Direction Beats
   Plan are short, generative, irreducible. They stay inline.
   Extraction is targeted at the bloated sections, not a uniform
   pass.
10. **Schema-First-Execution.md is prior art**. It is already a
    focused directive that elaborates one principle (the Cardinal
    Rule). The Cardinal Rule's full text in principles.md largely
    duplicates schema-first-execution.md; this plan deduplicates.
11. **The pattern library is prior art for Level 3**. Per-pattern
    files at `.agent/memory/active/patterns/` indexed at the
    `README.md` is exactly the model Level 3 should follow.
12. **Lifecycle of extracted content**. When a worked example is
    archived (the failure stops happening), where does it go?
    Archive convention from `napkin/archive/` applies — moved to a
    parallel `archive/` subdirectory, history preserved.
13. **Cross-level renames**. If we rename a principle, the mechanism
    files' upward links break. Stage-by-explicit-pathspec discipline
    - the mandatory bidirectional link convention catches this at
    review time.
14. **Author-guidance for new principles**. After this plan lands,
    when a new principle graduates (from distilled → directives), the
    author follows the same contract: short principle entry +
    pointer block + zero-or-more operationalisation mechanism files.
    This needs to be documented in PDR-046 or a new PDR.
15. **No moving targets in the entrypoint**. After extraction, the
    principles.md index lists mechanism *types* and *count categories*
    (e.g. "see `.agent/rules/` for behavioural rules"), not specific
    rule counts or rule names. Any specific link uses the rule's path
    only; rule names go in `RULES_INDEX.md`.
16. **The contract itself needs a home**. The mental model and
    contract authored in Phase 0 should land at a stable directive
    location — likely `.agent/directives/operationalisation-
    contract.md` or a new section in `orientation.md`. Phase 0
    decides the location.

## Domain Boundaries and Non-Goals

**In scope**:

- Re-homing content from `.agent/directives/principles.md` into
  durable mechanism / governance / worked-example files.
- Slimming principles.md into an entrypoint + operationalisation
  index.
- Authoring the operationalisation contract as a stable directive.
- Establishing bidirectional-link discipline.

**Not in scope**:

- Restructuring `.agent/rules/` itself (rules are already small and
  focused; the index `RULES_INDEX.md` exists).
- Restructuring ADRs / PDRs.
- Refactoring `docs/governance/*.md` beyond receiving the principles.
  md extractions (those docs may have their own bloat, addressed by
  knowledge-role-documentation-restructure plan).
- Creating new principles (this is a re-homing pass; new principle
  candidates remain queued at `pending-graduations.md`).
- Refactoring AGENT.md (already done by prior plan).

## Dependencies and Sequencing Assumptions

1. The Phase 0 contract MUST be aligned with owner before any
   extraction begins. Misaligned contract produces extraction shape
   that has to be redone.
2. Phase 1 (mechanism catalogue) is largely a documentation pass —
   the mechanisms exist already; this captures the canonical list.
3. Phases 2–4 (ledger → confirm → execute) follow the
   AGENT-entrypoint-homing precedent step-by-step.
4. Each Phase 4 extraction is one atomic commit; failures are
   isolated.
5. The knowledge-role-documentation-restructure plan and this plan
   share governance-doc landing surfaces. If both run concurrently,
   coordinate at the typescript-practice.md / development-practice.md
   touch points.

## Success Signals

- `principles.md` ≤ 200 lines, ≤ 14000 chars, 0 hard fitness
  violations.
- Every retained principle has zero or more named operationalisation
  mechanisms with bidirectional links to the operationalisation
  files.
- The mental model and contract directive is published at a stable
  location and linked from `AGENT.md`.
- A reader landing at `principles.md` can find any operational rule
  via the index in ≤ 2 clicks.
- No content loss: every load-bearing claim previously in
  principles.md is now resolvable from a single search starting at
  `principles.md`.
- Fitness on touched governance docs (typescript-practice.md,
  development-practice.md) within hard limits after absorption (the
  contract's recursion test is satisfied at the next level).

## Risks and Unknowns

| Risk | Mitigation |
|---|---|
| Over-extraction: principles.md becomes a meaningless TOC | Retain the generative WHY in 3-10 lines per principle; only operational HOW moves out |
| Drift between principle and mechanism after split | Bidirectional link + consolidate-docs audit + per-fitness link-integrity check |
| Knowledge-role plan and this plan collide on governance-doc landings | Coordinate at typescript-practice / development-practice touch points; sequence extractions so each plan owns distinct sections |
| New rule wave (severity, citation directionality) just landed in two rules — extending those during this plan creates churn | Defer to Phase 4 ordering; touch the just-landed rules last |
| Contract authored without owner alignment, then revised mid-execution | Phase 0 is gated on explicit owner alignment; do not enter Phase 1 until then |
| Mechanism catalogue (Phase 1) duplicates operating-model-mechanism-taxonomy plan | Reference, do not duplicate; the catalogue here is operationalisation-focused, not full mechanism taxonomy |
| Bidirectional link convention not yet codified | Phase 0 includes specifying the link convention; Phase 4 onwards applies it; Phase 6 verifies |

## Promotion Trigger into `current/`

Two conditions, both required:

1. Owner alignment on the Phase 0 contract — explicit acknowledgement
   that the mental model, the file-size discipline, the bidirectional
   linking, the surfaced unstated aspects, and the proposed extraction
   ordering are correct (or amended to be).
2. No active conflict with the knowledge-role-documentation-
   restructure execution — confirm the touched governance docs are
   not in concurrent flight under that plan.

## Implementation Detail Note

The strong-candidate extraction list captured during the analysis
(2026-05-06) is reference context, not commitment:

| Strong candidate | Source range | Target home |
|---|---|---|
| §Compiler Time Types and Runtime Validation | principles.md L361–409 | `docs/governance/typescript-practice.md` (extend; already cross-referenced) |
| §Tooling | principles.md L277–304 | `docs/engineering/build-system.md` |
| §Refactoring numerics | principles.md L240–275 | `docs/governance/development-practice.md` § Refactoring |
| Cardinal Rule full text | principles.md L90–105 | `.agent/directives/schema-first-execution.md` |
| §Layer Role Topology | principles.md L460–485 | `docs/architecture/README.md` |
| Selective Code Quality / Code Design / Developer Experience bullets | scattered | development-practice.md / typescript-practice.md |

The exact phasing and per-extraction acceptance criteria are
finalised when this plan promotes to `current/`.

## Foundation Alignment

- [`principles.md`](../../../directives/principles.md) — itself the
  source of this work; the First Question (could it be simpler?)
  and Architectural Excellence Over Expediency are the generators.
- [`testing-strategy.md`](../../../directives/testing-strategy.md) —
  the recursion test (Level 2 doc must hold within its own fitness)
  applies to testing-strategy too.
- [`schema-first-execution.md`](../../../directives/schema-first-execution.md)
  — receiving home for the Cardinal Rule extraction; also prior
  art for what a focused per-principle directive looks like.
- [PDR-014](../../../practice-core/decision-records/PDR-014-consolidation-and-knowledge-flow-discipline.md)
  — knowledge-flow discipline that the knowledge-role plan operationalises.
- [PDR-029](../../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md)
  — layered-defence shape; informs the contract's "multiple
  mechanisms per principle" allowance.
- [PDR-044](../../../practice-core/decision-records/PDR-044-memetic-immune-system.md)
  — innate vs adaptive immunity; informs Level 2 mechanism
  catalogue.
- [PDR-046](../../../practice-core/decision-records/PDR-046-layered-knowledge-processing.md)
  — Move 3 (graduate upward) is the engine driving extraction.
- [`agent-entrypoint-content-homing.plan.md`](../current/agent-entrypoint-content-homing.plan.md)
  — completed prior art; same shape applied to AGENT.md.

## Learning Loop

After completion, run `/jc-consolidate-docs`:

1. Audit principle ↔ mechanism alignment for any drift introduced
   during the extraction.
2. Surface any worked example that should graduate from inline-in-
   rule to its own Level-3 file.
3. Capture any contract refinements (granularity, fitness limits,
   link convention) that emerged during execution; queue for
   PDR amendment.

## Lifecycle Triggers

This plan touches: `.agent/directives/`, `docs/governance/`,
`docs/engineering/`, `docs/architecture/`. All are doc surfaces;
no code changes; no test changes. Lifecycle triggers reduce to
fitness validation, link-integrity validation, and the consolidation
pass.
