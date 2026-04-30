# Conservation Map (Agent-Judged Semantic Preservation)

**Purpose**: prove that every concept, requirement, credit, todo, and
decision in the predecessor `eef-evidence-mcp-surface.plan.md` has a
home in the restructured plan tree — and where the restructure
**expands** beyond preservation, name what was added and why.

**Captured**: 2026-04-30, by Iridescent Soaring Planet (claude-opus-4-7).

**Recovery path**: the predecessor was preserved byte-identically in a
working-tree `originals/` directory during the restructure-in-progress.
After the conservation review concluded ("nothing of value lost"), the
`originals/` directory was deleted. The truly-pre-session state of all
three predecessor files remains permanently accessible via:

```bash
git show <pre-session-commit>:.agent/plans/sector-engagement/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md
git show <pre-session-commit>:.agent/plans/sector-engagement/external-knowledge-sources/future/evidence-integration-strategy.md
git show <pre-session-commit>:.agent/plans/sector-engagement/external-knowledge-sources/future/oak-eef-technical-comparison.md
```

The pre-session commit on this branch is `e2796757` (`chore(release):
1.7.2 [skip ci]`) — `git show e2796757:<path>` reproduces any of the
three predecessors verbatim.

**Method**: this is an **agent-judged** map. It proves *concept*
preservation by reading every load-bearing element of the predecessor
and naming its home in the new structure (with explanation when the
home is non-obvious or expanded).

**Conservation property**: nothing of value is lost from the previous
plan. **Expansion property**: where the new structure carries more than
the old, this is named explicitly so consolidation review can confirm
the additions are intentional.

---

## A. Original frontmatter and metadata

| Original element | New home | Status |
|---|---|---|
| `parent_plan: open-education-knowledge-surfaces.plan.md` | unchanged in `eef-evidence-corpus.plan.md` | preserved |
| sibling: misconception-graph-mcp-surface | unchanged | preserved |
| specialist_reviewer: mcp-reviewer, code-reviewer, test-reviewer | expanded to also include `type-reviewer, sentry-reviewer` in new plan | preserved + expanded (citation type discipline + telemetry warrant the additions) |
| `isProject: false` | unchanged | preserved |
| Status: QUEUED — all 12 findings resolved | new plan: CURRENT — predecessor superseded; resolutions inlined into todo bodies | preserved (resolutions still bind) |
| Branch field: `planning/kg_eef_integration` | new plan: `feat/eef_exploration` originating session, ACTIVE branch TBD | updated (was already drift; the previous branch may have been merged) |

## B. The 12 pre-implementation findings (F1–F12, all RESOLVED in original)

Every resolution survives in the new plan. The new plan inlines them
into todo bodies and decision sections.

| Finding | Resolution preserved | New home (todo or section) |
|---|---|---|
| **F1** Data placement (SDK `src/mcp/data/`, not codegen) | YES | `eef-evidence-corpus.plan.md` T2; ADR-157 reaffirmed |
| **F2** Type all fields, no `Record<string, unknown>` | YES | T2; full Zod schema preserved by reference to predecessor in originals/ |
| **F3** Meta — all 7 fields typed | YES | T2 |
| **F4** Direct Zod `.parse()` at load, not `as const satisfies` | YES | T2 |
| **F5** Null-impact guard — pre-filter 4 strands before scoring | YES, expanded with explicit IDs in scoring engine docstring | T5 ScoringEngine; 4 strand IDs preserved verbatim |
| **F6** URI scheme: `curriculum://eef-methodology`, `curriculum://eef-strands` | YES | T3, T4 |
| **F7** Zod validation at import time = loud failure on schema drift | YES, expanded with explicit corruption test | T2 + the deliberate corruption test under T2 user-value |
| **F8** Lesson-plan prompt step 3 = extract implementation data from recommendation response (no separate tool) | YES | T10 |
| **F9** KS-to-phase mapping inline in prompt text | YES | T10 |
| **F10** Focus enum uses exact `most_relevant_priorities` values from data (`closing_disadvantage_gap`, no article) | YES | T6 input schema |
| **F11** Methodology + strands resources use graph factory; recommendation tool is custom | YES | T3, T4, T6 |
| **F12** `SCOPES_SUPPORTED` on custom tool def | YES | T6 |

## C. The 12 original todos (T1–T12) and their fate

| Original todo | New home | Notes |
|---|---|---|
| T1 eef-data-loader | `eef-evidence-corpus.plan.md` T2 | preserved |
| T2 methodology resource | T3 | preserved (renumbered) |
| T3 strands resource | T4 | preserved + **expanded**: default projection (`{id, name, slug, headline, definition.short, tags}`) added — the original would have dumped the full strand records |
| T4 recommendation tool | T6 | preserved (renumbered); now composes GraphView + ScoringEngine instead of bespoke implementation |
| T5 guidance constant | T9 | preserved |
| T6 register definitions | T16 | preserved (renumbered, public-export step) |
| T7 register executor | implicit in T6 (corpus tools) and T17 | preserved |
| T8 public export | T16 | preserved |
| T9 register resources | T17 | preserved |
| T10 register prompt (lesson plan) | T10 | preserved |
| T11 ADR-123 update | T18 | preserved + **expanded**: also documents corpus-vs-graph layering and default-projection convention |
| T12 E2E test | T19 | preserved + **expanded**: now has shape AND outcome conditions; specifically samples for citation-presence rate ≥95% |

## D. Impact-preserving requirements R1–R8 (from strategy doc)

The original plan named these and inlined them in prose. The new plan
*structurally enforces* R1, R7, R8 via the citation type (T12) and
data_coverage field (T6, T15).

| Req | Original treatment | New treatment | Status |
|---|---|---|---|
| **R1** Epistemic honesty | prose prescription | structural via Citation type (T12) | preserved + structurally enforced |
| **R2** Transparent scoring | exposed in tool response | preserved | preserved |
| **R3** Disadvantage-gap priority | first-class focus param + PP weighting | preserved | preserved |
| **R4** Synthesis boundary (no individual studies) | prose | preserved (out by data design — strand-level only) | preserved |
| **R5** Implementation guidance | strand fields in response | preserved + `explain` tool (T7) surfaces full implementation block | preserved + expanded |
| **R6** Workflow orchestration | one prompt only (lesson plan) | TWO prompts (lesson plan T10 + PP review T11) | **expanded** — closes the original R6 gap |
| **R7** Professional-judgement framing | prose in guidance constant | preserved + structurally enforced via Citation type | preserved + structurally enforced |
| **R8** Partial coverage honesty | data_coverage field | preserved + negative-space documentation (T15) | preserved + expanded |

## E. Schemas, scoring, and data references (verbatim preservation)

These are byte-equivalent across the move. Where the new plan does
not reproduce them inline, it points back to the original via path.

| Element | Where it lives now |
|---|---|
| Full Zod schema (EefMetaSchema, EefUkContextSchema, EefImplementationRequirementsSchema, EefSchoolContextRelevanceSchema, EefHeadlineSchema, EefStrandSchema, EefToolkitDataSchema) | code: `oak-curriculum-sdk/src/mcp/eef-toolkit-data.ts` (T2). Verbatim schema lives in the predecessor — recoverable via `git show e2796757:.agent/plans/sector-engagement/external-knowledge-sources/current/eef-evidence-mcp-surface.plan.md` § Phase 1. |
| Composite scoring algorithm (`40/30/20/10` weighting, context_relevance accumulation) | preserved verbatim in `eef-evidence-corpus.plan.md` T5 |
| Null-impact strand IDs (4) | preserved verbatim in T5 docstring; cross-referenced in scoring engine source |
| Focus enum (the 7 most teacher-relevant priorities) | preserved verbatim in T6 |
| Note on `school_context_schema.properties` typing as `z.record(z.string(), z.unknown())` | preserved verbatim by reference to the predecessor (rationale unchanged) |
| Loader pattern (`createRequire(import.meta.url)` + `EefToolkitDataSchema.parse(rawData)`) | preserved in T2 implementation guidance |
| Unit test cases (Zod parses, 30 strands, 4 null-impact, 17/30 with school_context, 9 caveats) | preserved in T19 (with the 8→9 caveat drift fixed in this session) |
| ADR-123 row content (resources + tool entries) | preserved in T18; aggregated tool count update from 11→14 (was 11→12 in original) reflects two new tools (explain, compare) |

## F. Credits and attribution (load-bearing — must NOT be lost)

| Original credit | New home | Status |
|---|---|---|
| EEF Toolkit data — Education Endowment Foundation | `eef-evidence-corpus.plan.md` § Credits and Attribution; `eef/README.md` § Credits | preserved |
| Original EEF research authors (Higgins, Katsipataki, Kokotsaki, Coleman, Major, Coe) | `eef-evidence-corpus.plan.md` § Credits; `evidence-integration-strategy.md` § Credits | preserved |
| **John Roberts (JR) — EEF MCP server prototype** | `eef-evidence-corpus.plan.md` § Credits; T20 (load-bearing release-blocker todo) | preserved + **promoted to a release-blocker todo (T20)** so it cannot drift |
| Standing requirement: "When this plan ships, add JR to the repo's authors list" | T20 + plan body explicit release-blocker note | **structurally enforced** (was prose in original) |

## G. Decisions and design notes preserved verbatim or by reference

| Original decision | New treatment |
|---|---|
| Follow patterns of `prior-knowledge-graph-resource.ts`, `aggregated-prior-knowledge-graph.ts`, `misconception-graph-mcp-surface.plan.md` | preserved; methodology + strands resources still use the graph factory (T3, T4) |
| EEF JSON only — independent of ontology, KG audit, Neo4j (Levels 2-3) | preserved in plan body and in `eef/README.md` |
| Cardinal rule (ADR-029) does not apply to EEF data | preserved by reference to ADR-157 § Typing Discipline |
| Resource priority 0.6 (methodology), 0.5 (strands) | preserved in T3, T4 |
| Tool annotations: `readOnlyHint: true, idempotentHint: true` | preserved in T6 |
| Sequencing T1 → (T2-T8 parallel) → T9-T10 → T11 → T12 | superseded by new sequencing in `eef-evidence-corpus.plan.md` § Sequencing; the dependency structure is preserved (loader before resources before tools before prompts before tests) |
| Size estimate ~500 lines new code | replaced with ~2280 lines new code; growth itemised in plan-body § Size Estimate (citation enforcement, two new tools, one new prompt, refresh, telemetry, negative-space) |

## H. Exit criteria evolution

The original had 8 shape conditions. The new plan keeps them and adds
outcome conditions:

| Original condition | New treatment |
|---|---|
| 1. recommend tool in tools/list | preserved as shape condition |
| 2. tool returns ranked recommendations with transparent scoring | preserved as shape condition |
| 3. every recommendation includes caveat and evidence strength | **structurally enforced** via Citation type (was an exit-criterion to *check*; now a type invariant) |
| 4. methodology + strands resources in resources/list | preserved as shape condition |
| 5. resource reads return valid JSON | preserved as shape condition |
| 6. lesson-plan prompt in prompts/list | preserved + extended (PP-review prompt also required) |
| 7. ADR-123 updated | preserved as shape condition |
| 8. `pnpm check` passes | preserved as shape condition |
| **NEW — outcome condition 1**: citation-presence rate ≥95% across N=50 sampled responses | added (closes the prose-prescription gap) |
| **NEW — outcome condition 2**: recommendation latency p95 ≤500ms | added |
| **NEW — outcome condition 3**: lesson-plan output preserves caveats in final text | added (closes the LLM-paraphrase risk) |

## I. Key files (original → new)

| Original key file row | Status |
|---|---|
| `eef-toolkit.json` (NEW copy into SDK) | preserved (T2) |
| `eef-toolkit-data.ts` | preserved (T2) |
| `eef-methodology-resource.ts` | preserved (T3) |
| `eef-strands-resource.ts` | preserved (T4) — default projection added |
| `eef-evidence-guidance.ts` | preserved (T9) |
| `aggregated-eef-recommend.ts` | preserved + **renamed conceptually**: now composes corpus interface (T6) |
| `definitions.ts` (add entry) | preserved (implicit in T16) |
| `executor.ts` (add handler) | preserved (implicit in T6) |
| `public/mcp-tools.ts` (add exports) | preserved (T16) |
| `mcp-prompts.ts` (add prompt) | preserved (T10, T11 — both prompts) |
| `mcp-prompt-messages.ts` (add messages) | preserved (T10, T11) |
| `register-resources.ts` (add resources) | preserved (T17) |
| `e2e-tests/server.e2e.test.ts` (update counts) | preserved (T19) |
| ADR-123 (add rows) | preserved (T18) |
| **NEW**: `evidence-corpus/types.ts` | added (T1 corpus shape) |
| **NEW**: `evidence-corpus/scoring.ts` | added (T5) |
| **NEW**: `aggregated-eef-explain.ts` | added (T7) |
| **NEW**: `aggregated-eef-compare.ts` | added (T8) |
| **NEW**: `scripts/refresh-eef-toolkit.ts` | added (T13) |
| **NEW**: SDK README § Negative Space | added (T15) |

## J. What is new (expansion log — intentional, owner-approved)

These are not in the predecessor and are intentional additions from
the architecture session of 2026-04-30:

1. **Corpus shape** — `EvidenceCorpus = GraphView + ScoringEngine`
   composition. Predecessor had bespoke recommendation; new structure
   makes it a layer on top of the graph foundation.
2. **`explain-evidence-strand` tool (T7)** — full strand context with
   citations, caveats, provenance, update_history.
3. **`compare-evidence-strands` tool (T8)** — side-by-side comparison
   for PP-review workflow.
4. **`pupil-premium-strategy-review` prompt (T11)** — Workflow B from
   strategy doc, now executable.
5. **Citation type as structural invariant (T12)** — converts R1, R7
   from prescription to type-system enforcement.
6. **Freshness gate + refresh script (T13)** — closes the freshness
   debt the predecessor handwaved.
7. **Telemetry seams (T14)** — Sentry spans + named metrics.
8. **Negative-space documentation (T15)** — what is not exposed and why.
9. **Outcome exit conditions (in T19)** — citation-presence ≥95%,
   latency p95, caveats-in-final-text.
10. **Default projection convention** — applied to strands resource
    (T4) and to `enumerate_nodes` everywhere (graph layer plan).
11. **Three-line user-value template** — applied to every task.
12. **JR credit promotion to release-blocker (T20)** — was prose in
    predecessor.

## K. What lives outside this plan now

These concerns moved or were lifted to sibling plans during the
restructure:

- **Graph operations (manifest, summary, get_node, enumerate_nodes,
  neighbours, subgraph, find_by_tag)** — now in
  [`../../../knowledge-graph-integration/current/graph-query-layer.plan.md`](../../../knowledge-graph-integration/current/graph-query-layer.plan.md).
  EEF strands becomes a `GraphView` adapter (T5 of that plan).
- **Cross-source journeys** (search × misconception × EEF) — now in
  [`../../../knowledge-graph-integration/future/cross-source-journeys.plan.md`](../../../knowledge-graph-integration/future/cross-source-journeys.plan.md).
  Out of scope for the EEF corpus plan; the journey primitive is
  generic.
- **R1/R7 structural enforcement** — the *citation type* is in this
  plan (T12), but the propagation discipline through journeys is in
  the journeys plan (T4 of that plan).

## L. How to use this map

- **For owners**: read top-to-bottom; flag any row where the "new home"
  feels insufficient. Conservation succeeds only if you agree.
- **For implementers**: when touching a concept from the predecessor,
  this map tells you which new plan owns it. Follow the link.
- **For reviewers**: at PR time, sample 5 rows from sections B, F, G,
  H. If any concept is in the predecessor but not findable in the
  new plans, conservation has failed.
- **For consolidation**: this map is the audit trail for the architecture
  session. It will be referenced by any future restructure of the same
  cluster as evidence of preservation discipline.

## M. Cross-references

- **Predecessor recovery**: `git show e2796757:<path>` (paths in the
  Recovery path section above). The pre-session state is permanently
  in git history.
- [`../current/eef-evidence-corpus.plan.md`](../current/eef-evidence-corpus.plan.md) — successor
- [`../../../knowledge-graph-integration/current/graph-query-layer.plan.md`](../../../knowledge-graph-integration/current/graph-query-layer.plan.md) — Increment 1 (foundation)
- [`../../../knowledge-graph-integration/future/cross-source-journeys.plan.md`](../../../knowledge-graph-integration/future/cross-source-journeys.plan.md) — Increment 3 (journeys)
- [`../../../../memory/active/napkin.md` § 2026-04-30 EEF graph-and-corpus architecture session](../../../../memory/active/napkin.md) — full session insight

## N. Verification log (the "double check" the owner asked for)

After authoring this map, the predecessor was independently re-read on
2026-04-30 against the new plan. Two real preservation gaps were found
and patched in the new plan before deletion of `originals/`:

1. **"EEF JSON only — KG-independent / Levels 2-3 independent"** — the
   predecessor had this as an explicit "Data Source" section. The new
   plan now has a "Data Source — KG-Independent (preserved from
   predecessor)" section that names the property explicitly.
2. **Data-shape unit-test contract** — the predecessor specified the
   exact counts that must be asserted at module load (30 strands,
   4 null-impact with named IDs, 17 with school_context, 9 caveats,
   4 with implementation, 6 with behind_the_average). The new plan
   T2 now lists these as a verbatim test contract.
3. **Specific file paths** for `definitions.ts`, `executor.ts`,
   `server.e2e.test.ts` — the predecessor had a "Key Files" table.
   The new plan now has a "Key Files (preserved checklist from
   predecessor + corpus additions)" table that supersedes it and adds
   the corpus-extension files.

After these three patches, the verification recorded **no further
gaps**. The conservation property holds.
