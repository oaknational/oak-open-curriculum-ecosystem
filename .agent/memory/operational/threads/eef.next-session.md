# Next-Session Record — `eef` thread

**Last refreshed**: 2026-04-30 (Iridescent Soaring Planet / claude-code /
claude-opus-4-7-1m / session seed `b38261` — created the EEF subthread,
relocated four artefacts from `external-knowledge-sources/`, restructured
the executable plan into evidence-corpus shape on top of a new graph-query
foundation, designed cross-source journeys as Increment 3, embedded a
mandatory user-value template across all new plans, and verified semantic
preservation via an independent re-read pass that caught three real gaps
in the conservation map).

---

## Thread Identity

- **Thread**: `eef`
- **Thread purpose**: Integrate the EEF Teaching and Learning Toolkit
  as an evidence corpus on Oak's MCP server, on top of a polymorphic
  graph-query foundation that also serves the misconception and
  prerequisite graphs. Five-increment delivery, parallel implementation
  across three graphs, user-value template enforced on every plan task.
- **Branch**: `feat/eef_exploration` (originating session); execution
  branch TBD when Increment 1 promotes to ACTIVE.

## Participating Agent Identities

| agent_name | platform | model | session_id_prefix | role | first_session | last_session |
| --- | --- | --- | --- | --- | --- | --- |
| `Iridescent Soaring Planet` | `claude-code` | `claude-opus-4-7-1m` | `b38261` | `architecture-restructure-and-handoff` | 2026-04-30 | 2026-04-30 |

Identity discipline remains additive per
[PDR-027](../../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md):
new sessions add rows; matching platform/model/agent_name updates
`last_session`.

---

## Landing Target (per PDR-026)

Landed: a coherent five-increment plan estate covering graph foundation
(`graph-query-layer.plan.md`, CURRENT), evidence-corpus extension on
EEF (`eef-evidence-corpus.plan.md`, CURRENT, replaces predecessor),
cross-source journey design (`cross-source-journeys.plan.md`, FUTURE),
plus operational concerns (telemetry, freshness, negative-space) folded
into the appropriate increments. All new plans carry a mandatory
three-line user-value template on every task. Conservation property
verified via independent re-read pass; predecessor preserved in git
history at commit `e2796757`.

Evidence:

- [eef/README.md](../../../plans/sector-engagement/eef/README.md) — subthread orientation
- [eef/current/eef-evidence-corpus.plan.md](../../../plans/sector-engagement/eef/current/eef-evidence-corpus.plan.md) — Increment 2 executable plan
- [eef/reference/conservation-map.md](../../../plans/sector-engagement/eef/reference/conservation-map.md) — semantic preservation map with verification log (§N)
- [knowledge-graph-integration/current/graph-query-layer.plan.md](../../../plans/knowledge-graph-integration/current/graph-query-layer.plan.md) — Increment 1 foundation
- [knowledge-graph-integration/future/cross-source-journeys.plan.md](../../../plans/knowledge-graph-integration/future/cross-source-journeys.plan.md) — Increment 3 design
- [napkin § 2026-04-30 EEF graph-and-corpus architecture session](../../active/napkin.md) — full session insight
- [experience/2026-04-30-iridescent-graph-corpus-composition.md](../../../experience/2026-04-30-iridescent-graph-corpus-composition.md) — methodology + reflection

---

## Current State

- All three plan files (graph-query-layer, eef-evidence-corpus,
  cross-source-journeys) are CURRENT or FUTURE; **none is ACTIVE**.
- Predecessor `eef-evidence-mcp-surface.plan.md` deleted from working
  tree; recoverable via `git show e2796757:.agent/plans/sector-engagement/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md`.
- The `originals/` snapshot directory was created during the
  restructure for the verification pass and deleted afterwards (see
  conservation map § Recovery path).
- 25 files in the working tree at session-handoff time; 0 commits
  ahead of main; ready to commit in three sensible chunks (restructure,
  napkin, handoff).
- Sector-engagement umbrella sees the new subthread:
  `sector-engagement/README.md` documents table includes `eef/` row;
  `external-knowledge-sources/README.md` retains education-skills + KG
  meta-strategy plans only.

---

## Promotion Triggers and Sequencing

The five-increment delivery sequence with explicit promotion gates:

1. **Increment 1** (graph-query-layer) → ACTIVE when:
   - Owner has approved architecture session conclusions ✓ (done this session).
   - T1 (tracer use cases — 21 minimum, 7 ops × 3 graphs) signed off.
   - Plan-body first-principles check applied to tracer shapes against
     actual data files.
   - EEF corpus plan (Increment 2) ready for parallel start.
2. **Increment 2** (eef-evidence-corpus) → ACTIVE when:
   - Increment 1 reached ACTIVE.
   - Fresh upstream EEF data check performed (snapshot is 28 days old
     at handoff; living systematic review updates twice yearly).
   - Conservation map signed off by owner.
   - Plan-body first-principles check applied to citation type, corpus
     operations, test shapes.
3. **Increment 3** (cross-source-journeys) → CURRENT when:
   - Increments 1 and 2 both reached ACTIVE.
   - GraphView adapters exist for misconception and prerequisite (T3,
     T4 of graph-query-layer plan).
   - Real teacher question identifies that prompt-only orchestration
     is insufficient (the load-bearing observation the journeys plan
     waits on).
4. **Increment 4** (telemetry/freshness/provenance) — does not have a
   separate plan. EEF-specific work lives in Increment 2 (T13–T15);
   graph-layer telemetry lives in Increment 1 (T8).
5. **Increment 5** (school-context overlay) — deferred. Gated on
   multi-tenant identity work outside this thread.

**Escape hatch**: if Increment 1 slips, the EEF corpus plan can
prototype against an in-line `GraphView` stub and refactor onto the
real interface when it lands. See Increment 2 § Risks.

---

## Open Owner Decisions

1. **Whether to graduate the user-value template to a rule now**, or
   wait for it to be applied in a third plan first. Currently embedded
   in three plans (graph-query-layer, eef-evidence-corpus,
   cross-source-journeys). Graduation trigger named in napkin
   doctrine candidates.

2. **Whether the substantial-restructure five-artefact-families
   pattern** (executable plans + conservation map + originals snapshot
   - napkin entry + inbound ref updates) graduates to a doctrine
   immediately or waits for a second instance.

3. **Refresh ownership for `eef-toolkit.json`** — Increment 2's T13
   names a CI gate at >180 days. The 180-day threshold is arbitrary;
   owner direction may set a different value or name a specific role
   to own refresh PRs.

4. **Whether the journey primitive is a new MCP "playbook" type** or a
   richer prompt class — the cross-source-journeys plan T1 prototypes
   both shapes and recommends one. Decision deferred until prototyping.

---

## Doctrine Candidates Pending Graduation

See napkin § "Doctrine candidates surfaced — explicit graduation queue"
for the full list with triggers and candidate homes. Items 1–9 cover:

1. User-value template
2. Outcome-criteria gap (repo-wide)
3. Progressive disclosure
4. Parallel-tracer-implementations
5. Conservation-requires-a-mind
6. Five artefact families per substantial restructure
7. Conservation-map verification pass mandatory before originals deletion
8. Two orders of plan architecture (data-tool-resource-prompt vs graph-corpus-journey)
9. Bias-toward-action in option presentation (second instance — could
   graduate now)

---

## Risks Worth Flagging to Next Session

1. **Snapshot staleness creep**: `eef-toolkit.json` is 28 days old at
   handoff. EEF Toolkit updates ~2x/year. Refresh check is a
   precondition for promoting Increment 2 to ACTIVE.
2. **Three-graph protection erosion**: if Increment 1's tracer use
   cases turn out to have only 1-of-3 coverage for some operations,
   those operations should be dropped, not added speculatively. T1 is
   gating for a reason.
3. **Polymorphism through router tool**: the urge to ship one
   `query-graph` tool with a discriminator instead of 7 specific
   tools per graph (21 total). Resisted in plan body; surface in code
   review if it returns.
4. **Citation enforcement misfire on prompt outputs**: structural
   citation discipline is on tool calls, not LLM prose. Mitigation
   already in plan body (T19 outcome condition samples final
   lesson-plan text).
5. **User-value template becoming rote**: at consolidation, sample 5
   lines and ask "is this falsifiable? does it name a teacher action?"
   If not, push back. Without that discipline the template is
   decorative.

---

## Cross-Plan and Cross-Thread Links

- **Parent (sector-engagement)**: [`sector-engagement.next-session.md`](sector-engagement.next-session.md)
- **Parent (KG-integration coordinator)**: [`open-education-knowledge-surfaces.plan.md`](../../../plans/knowledge-graph-integration/active/open-education-knowledge-surfaces.plan.md) — this subthread owns its WS-3 (now restructured into Increments 1+2+3).
- **Authoritative ADR**: [ADR-157](../../../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
- **Strategic brief**: [`evidence-integration-strategy.md`](../../../plans/sector-engagement/eef/future/evidence-integration-strategy.md) — R1–R8 source.
