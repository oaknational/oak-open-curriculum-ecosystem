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
- **Status**: open.

## Q-003 — input/output schema strategy for MCP tools (+ the EEF coupling)

- **Captured**: 2026-06-02 (Flamebright Charring Ember / `claude` / Opus 4.8 / `30dd5d`)
- **Question**: how are MCP tool **input and output** schemas carried to the SDK
  registration path, and what is the canonical mechanism? (Owner: "additional
  information about input/output schemas is coming soon.")
- **Owning artefact**:
  [`sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md`](../../plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md)
  (general) and — the precise owner of the EEF-coupling sub-question —
  [`sdk-and-mcp-enhancements/current/graph-tool-output-schemas.plan.md`](../../plans/sdk-and-mcp-enhancements/current/graph-tool-output-schemas.plan.md)
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
  [`graph-tool-output-schemas.plan.md`](../../plans/sdk-and-mcp-enhancements/current/graph-tool-output-schemas.plan.md)
  (status DESIGN; co-design with EEF D4–D6). EEF D5/D6's single-Zod-call mechanism
  is pending, so the two are co-defining ONE mechanism.
- **Status**: open; owned by the output-schemas plan + the graph projection plan.
