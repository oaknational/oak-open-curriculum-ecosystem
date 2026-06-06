---
fitness_line_target: 180
fitness_line_limit: 240
fitness_char_limit: 14000
fitness_line_length: 100
drain_strategy: >-
  Surface owner-decision items during consolidate-docs; move answered or
  withdrawn entries to an archive when the register needs rotation.
merge_class: mostly-append-register
fitness_content_role: drainable-buffer
---

## Q-001 — gate-1a EEF tool: whole-graph selection vs data-supported narrowing

- **Captured**: 2026-05-27 (Galactic Dancing Constellation / `claude` / `7efeec`)
- **Question**: At gate-1a, `eef-explore-evidence-for-context` returns the whole
  connected EEF graph (all 30 strands + 37 edges) and lets the model select
  contextual fit. Is whole-graph the right teacher experience, or should a
  later stage add narrowing — and if so, on what signal?
- **Why it shapes future work**: determines the scope and trigger of the gate-1b
  t5 ranking/scoring engine (relevance selection is explicitly deferred there).
- **Why not answerable cheaply now**: needs real teacher-usage signal; the
  corpus tag vocabulary does not support reliable server-side narrowing today
  (verified: focus-enum→tag mapping mostly empty; only 16/30 strands carry a
  phase tag, so phase-narrowing would suppress ~14 phase-general strands).
- **Owning artefact / discussion home**: PR #121 top section (Starless flagged
  for owner discussion). Does not block the current cycle — PR #121 is
  mergeable as whole-graph.
- **Status**: withdrawn 2026-05-28 (Sylvan Whispering Fern) — framing superseded.
- **Disposition (2026-05-28)**: the gate-1a/1b split and the
  `eef-explore-evidence-for-context` whole-graph tool this question assumes were
  diagnosed as the wrong foundation and discarded; the EEF work was rebuilt from
  foundations. The underlying substance — the selection / scoping strategy for a
  graph-shaped tool — is preserved and was carried into the live EEF plan
  (`plans/sector-engagement/eef/current/eef-graph-tool-completion.plan.md`); the
  2026-05-28 design docs that first explored it were quarantined to `archive/`
  (2026-05-30). No substance lost; this entry is retired to avoid a stale second
  home in dead gate-1a/1b vocabulary.

## Q-002 — which `.agent/rules/*` rules are actually impactful

- **Captured**: 2026-06-01 (Sunlit Gliding Twilight / `claude` / `2a4252`)
- **Question**: Of the ~70 rules injected into context via `CLAUDE.md`, which
  ones measurably change agent behaviour and earn their context cost, and which
  are inert? Prose rules have no "firing" event to count; hook-backed rules
  (e.g. write-time `no-moving-targets`, secrets-scan on Read, PreToolUse gates)
  do execute and could be instrumented.
- **Why it shapes future work**: directly informs the ~80k reliably-loaded
  context budget (`[[project_80k_reliably_loaded_context_budget]]`) — knowing
  which rules are inert is the evidence needed to move them on-demand or retire
  them, rather than carrying all ~70 always-on.
- **Why not answerable cheaply now**: prose rules are not measurable by design
  (continuously in effect, never discretely triggered); the only well-defined
  signal is hook-fire counts, which requires (a) instrumenting hook scripts to
  log invocations and (b) for behaviour-change attribution, auditing transcripts
  for evidence a rule altered a move. No built-in per-rule analytics exist.
- **Owning artefact / discussion home**: none yet; relates to context-budget
  governance. Does not block any current cycle.
- **Status**: owner-gated — needs owner direction to open a rule-impact
  instrumentation / transcript-audit lane, or an owner decision to retire the
  question. Future check: look for a current context-budget or rule-analytics
  plan before asking again; none is recorded here.

## Q-003 — input/output schema strategy for MCP tools (+ the EEF coupling)

- **Captured**: 2026-06-02 (Flamebright Charring Ember / `claude` / Opus 4.8 / `30dd5d`)
- **Question**: how are MCP tool **input and output** schemas carried to the SDK
  registration path, and what is the canonical mechanism? (Owner: "additional
  information about input/output schemas is coming soon.")
- **Owning artefact**:
  [`sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md`][q3-general]
  (general) and — the precise owner of the EEF-coupling sub-question —
  [`sdk-and-mcp-enhancements/current/graph-tool-output-schemas.plan.md`][q3-graph]
  ("Graph-tool output schemas via the EEF projection pattern", DESIGN), both
  authored/refreshed 2026-06-02 by the Abyssal Flowing Beacon workstream (audit:
  `.agent/reports/output-schema-mcp-plan-audit-2026-06-02.md`). Owner resolved the
  S0 universal-tools seam there: apply the required `outputSchema` per tool type,
  **graph first**, promoting to root `UniversalToolListEntry` last. This entry does
  **not** duplicate those plans; it records the EEF coupling so it is not lost.
- **EEF coupling (this session's finding to hand to the owning plan)**: the EEF
  MCP tool is a *graph universal tool* (same family as `get-misconception-graph`/
  `get-prior-knowledge-graph`, which return `structuredContent` but carry **no**
  `outputSchema` today). Carrying `outputSchema` through the universal-tools path
  is net-new and touches a specific surface set — `AggregatedToolName`,
  `AGGREGATED_TOOL_DEFS`/`AggregatedToolDefShape`, `UniversalToolListEntry`,
  `listUniversalTools`, and the `handlers.ts` config (all carry `inputSchema`
  only). A four-architecture-reviewer pass flagged a **three-step asymmetric-drop**
  failure mode (a silent `outputSchema` drop leaves graph tools unvalidated while
  existing no-outputSchema tools pass, uncaught by current tests). The EEF plan
  (D3/D6) defers these mechanics to this question's resolution.
- **Update (2026-06-02, Abyssal Flowing Beacon / `762085`)**: the output-schemas
  plan was audited + rewritten decision-complete, and the owner **resolved S0
  ownership** (that plan owns the seam) and the **sourcing doctrine**: schemas are
  a deterministic type-strict **projection** of the static data fed to a **single
  Zod call** (`satisfies`-tied), never hand-constructed — same pattern as EEF,
  emitted at codegen for the graph tools. The graph slice and its five sub-questions
  (the `as const` precondition + scale, the output-only structural simplification,
  where the one shared mechanism lives, 2-vs-3 graph scope, codegen emission shape)
  are owned by the new
  [`graph-tool-output-schemas.plan.md`][q3-graph]
  (status DESIGN; co-design with EEF D4–D6). EEF D5/D6's single-Zod-call mechanism
  is pending, so the two are co-defining ONE mechanism.
- **Update (2026-06-02, Silvered Lurking Mask / `bbb696`)**: the owner ratified
  the **delivery order** (now recorded in the owning plans, committed
  `e8fe16e0`): the EEF tool's `outputSchema` lands **first and alone via EEF
  D6** — the mechanism's first instance; the 3 existing graph tools receive
  theirs **with their substrate migration** (one replacement unit per tool) and
  are untouched before it; remaining types follow; required/root promotion
  last. Of the five sub-questions, **Q2 is resolved** (verified in code: the
  graph tools take no input; the projection is structural) and **Q4 is
  resolved** (thread-progressions excluded — sequence-shaped, not
  graph-forced). Q1/Q3/Q5 (as-const scope, mechanism home, codegen emission
  shape) resolve in the EEF D4–D6 co-design and the unified substrate-migration
  plan.
- **Update (2026-06-02, Galactic Glowing Prism / `cd7389`)**: the unified
  substrate-migration plan is authored —
  [`graph-tools-value-redesign.plan.md`][q3-migration]. The graph
  projection plan's design content is absorbed there (Q1/Q3/Q5 are its
  Decisions A/B/D; the projection doctrine and resolved Q2/Q4 are its
  Ratified decisions 7–9) and the file is archived. Q1/Q3/Q5 now resolve in
  the EEF D4–D6 co-design and at that plan's promotion (trigger: EEF D6
  landed + D7 green).
- **Status**: owner-gated — narrowed to Q1/Q3/Q5, the shared-mechanism design.
  Owner-facing decision point is the EEF D4–D6 co-design and unified
  substrate-migration promotion. Future check: verify whether EEF D6 has landed,
  D7 is green, and the substrate-migration promotion resolved Decisions A/B/D;
  otherwise keep this question live.
- **Progress (2026-06-04, Arboreal curation drain)**: EEF D4 is now
  owner-ratified and the migration plan is the renamed value-redesign; the D6/D7
  gate (and that plan's promotion) remains unfired, so this question stays live.
- **Progress (2026-06-05, Lanternlit curation pass)**: EEF D5 landed green
  (`2e9021ff`) — the graph-native view + single-Zod-call mechanism's substrate;
  D6 (the EEF MCP composition surface, where the `outputSchema` mechanism's first
  instance lands) is the next safe step but is **not yet built**. The D6/D7 gate
  and the substrate-migration promotion remain unfired; this question stays live.
- **Progress (2026-06-06, Starlit Scattering Twilight curation pass)**: the D6
  execution plan is authored + dual-reviewed (`eef-d6-execution.plan.md`, Dusky
  Dimming Candle), with D6 re-grounding refinements folded (`93ee593f`); D6 **code
  is still not written** (next safe step = EXECUTE D6). The `outputSchema`
  mechanism's first instance therefore still has not landed; the gate stays unfired
  and this question stays live.

[q3-general]: ../../plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md
[q3-graph]: ../../plans/sdk-and-mcp-enhancements/archive/completed/graph-tool-output-schemas.plan.md
[q3-migration]: ../../plans/connecting-oak-resources/knowledge-graph-integration/future/graph-tools-value-redesign.plan.md

## Q-004 — does the capability taxonomy need a rights/licensing axis?

- **Captured**: 2026-06-03 (Blustery Lifting Gale / claude / Opus 4.8 / `9b33b0`).
- **Question**: ADR-189 ratifies two axes (audience, distribution locus) with
  packaging as mechanism. The first-party skills library's licensing split —
  MIT scaffolding, © Oak brand assets, curriculum content shared in a
  pedagogical spirit — maps onto neither axis. When Oak distributes
  capabilities externally, what may be copied, what must be attributed, and
  what stays Oak's are questions the current taxonomy cannot record. Is
  rights/licensing a third axis, a per-capability metadata field, or out of
  taxonomy scope (owned by LICENSE surfaces)?
- **Why not now**: one observation only; the repo's own discipline says one
  instance is an observation, not a category. Becomes decidable when a
  capability pack or skills-index publication forces a licensing declaration
  per artefact.
- **Owning artefact when it fires**: ADR-189 amendment +
  [`skills-classification-taxonomy.plan.md`][q4-taxonomy] inventory columns.
- **Status**: open — trigger is the first external capability publication or
  the oak-skills integration decision.

[q4-taxonomy]: ../../plans/discovery/future/skills-classification-taxonomy.plan.md

## Q-005 — can the repo professionalism assessment be cut into practical plans?

- **Captured**: 2026-06-03 (Airy Whirling Wing / codex / GPT-5 / `019e8e`).
- **Question**: The
  [`Oak Repository Professionalism and Engineering Quality Report — 2026-06-03`][q5-report]
  gives a blunt assessment and a friction-reduction roadmap. Can that roadmap
  become practical plan work, and if yes should it be one cross-cutting plan or
  separate plans under architecture/quality gates, developer experience,
  agentic-engineering, and agent-tooling?
- **Why it shapes future work**: the report names high-leverage improvements
  (repo-check failure classification, Playwright preflight, contributor fast
  path, generated authority map, collaboration CLI UX, active-surface reduction)
  but those recommendations should not become another passive doctrine layer.
  A planability pass decides whether the next move is executable work, routing
  into existing plans, or no new plan.
- **Why not answerable cheaply now**: requires cross-checking existing current
  and future plans across at least four collections to avoid duplicate plans or
  wrong ownership. The report was authored and indexed in this session; the
  owner explicitly asked that it receive assessment for practical planning.
- **Owning artefact / discussion home**: the
  [assessment thread record](threads/repo-professionalism-assessment.next-session.md).
- **Status**: open — trigger is the next owner-directed planning/triage
  session, or a dedicated follow-up asking whether to turn the assessment into
  plan work.

[q5-report]: ../../reports/oak-repo-professionalism-engineering-quality-report-2026-06-03.md
