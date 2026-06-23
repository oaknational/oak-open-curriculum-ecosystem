# EEF Value-Path Re-validation Report — 2026-06-11

**Author**: Blustery Buffeting Gale / claude / fable-5 / 9819b2 (claim
`f74cdf73-ec20-4caf-bea8-ffb4bc3f919f`)
**Routing**: Director event `dccb1d09` + correction `dd536088` (owner-approved ~10:52Z)
**Plan**: [`eef-revalidate-on-new-graph-tools.plan.md`](../plans/sector-engagement/eef/current/eef-revalidate-on-new-graph-tools.plan.md)
**Baseline**: `origin/main` at `5310d1e4e` (post Track-G completion `c868bb52e` + #175), corpus
v1.3.0 (`generatedAt 2026-06-11T07:47:55Z`), built worktree `oak-wt-umbral-g4`, server
`dev:observe:noauth` on port 3333, stateless JSON-RPC over streamable HTTP.

## Verdict

**The EEF value path is INTACT on the new anchored graph tools.** The D7-style cover-lesson
round trip closes on three signal types (misconception, prior knowledge, thread progression)
with the known strands' exact corpus values reaching the assistant-facing payload verbatim,
caveats and non-claims intact, honest insufficiency preserved, and provenance (including
`original_authors`) unfiltered. The substrate migration did not break the Oak/EEF workflow seam.

Two riding decisions are recorded below: **prerequisiteFor multiplicity → dedup at emission**
(consumer impact measured and decisive) and **G4b is NOT on the EEF value path** (no signal to
raise).

## 1. Re-proof rounds (all green)

Replacement set proven against (re-grounded first-hand at execution start, signals verified on
the comms stream: `334b8a99`, `42e5cf0c`, `db953071`, `08abb32a`):

| Replacement tool | Landed | Round-trip role |
| --- | --- | --- |
| `get-prior-knowledge-graph` (anchored+bounded) | PR #161 | Signal type 2 |
| `get-misconception-graph` (anchored+bounded) | PR #163 | Signal type 1 |
| `get-thread-progressions` (year-ordered) | PR #164 + #165 | Signal type 3 |
| `get-keyword-graph` (anchored, owner-named) | PR #173 | §3 determination |

**Round 1 — misconception signal → EEF evidence.** `get-misconception-graph`
`{lessonSlugs: ["1066-and-claims-to-the-throne"]}` returns the real pedagogical signal (the
eyewitness-reliability misconception with its response). `get-eef-evidence`
`{function: "inspect-strand", strandId: "eef-tl-feedback"}` then passes **10/10 verbatim
ground-truth checks** against the corpus source (`eef-toolkit.external-data.ts`):
`impact_months: 6`, cost `Very Low`, evidence `Extensive`, headline summary *"High impact for
very low cost based on extensive evidence"*, `definition.short` verbatim, `eef_url`,
provenance with `original_authors`, caveats present, `answerType: strand-lookup` envelope.

**Round 2 — prior-knowledge signal → EEF axis query.** `get-prior-knowledge-graph`
`{unitSlugs: ["foundation-workshops-an-introduction-to-the-areas-of-study-4821"]}` returns the
bounded predecessor subgraph (4 units, depth 2). `get-eef-evidence`
`{function: "evidence-for-move", phase: "primary", priority: "metacognition_and_self_regulation"}`
returns `answerType: context-subset` with 2 members (Collaborative learning, Metacognition and
self-regulation), provenance and caveats intact. An invalid `priority` value is rejected at the
boundary with the finite-domain vocabulary enumerated — strict validation working as designed.

**Round 3 — honest insufficiency.** `inspect-strand` on `eef-tl-learning-styles` preserves
`impact_months: null`, `Insufficient` evidence label, the honest headline *"Unclear impact for
very low cost based on insufficient evidence"*, and the corpus sentence that the evidence
*does not support tailoring teaching to individual learning styles* — all verbatim.

**Thread signal.** `get-thread-progressions` `{threadSlug: "empire-persecution-and-resistance"}`
returns 16 unit placements **ordered by teaching year** (verified monotonic: years 2→11) — the
year-axis re-chain semantics live at the MCP surface. Unknown anchors return well-formed empty
with the unknown reported, not errored.

**Non-claims.** The tool layer emits data envelopes with caveats and an `oakContextHint` aimed
at the consuming agent; no envelope carries teacher-replacing or directive pedagogical language
(ADR-194 boundary intact at the tool layer).

## 2. prerequisiteFor multiplicity — DECISION: dedup at emission

**Recomputed first-hand from corpus v1.3.0** (`validators-must-recompute`): 3,452 emitted
`prerequisiteFor` edges; 2,605 unique `(source, target)` pairs; **570 duplicated pairs, max
multiplicity ×8**; 33 self-loop instances (30 unique — the known year-axis finding, out of
scope here). The duplicate edges are **byte-identical `{source, type, target}` triples** — no
payload distinguishes them, so the emitted form carries no decodable signal.

**Consumer impact, measured at the MCP surface** (the routed decision criterion): the live
`get-prior-knowledge-graph` envelope for the anchor above returns **22 edges of which only 4
are distinct** (×8/×6/×6/×2), and the envelope's own agent-facing summary reads *"4 units, 22
prerequisiteFor edges"* — the summary **misstates the graph** the agent is about to reason
over, and the duplicated edge objects inflate the bounded tool's token cost ~5.5× on this
anchor. Both halves of the bounded-anchored design goal (token economy, deterministic data the
agent can trust) are directly harmed.

**Decision**: **dedup at vocab-gen emission**, surfacing the dropped count through the corpus's
existing `droppedEdges`/count-guard provenance pattern (the G2 mint-rule and G4b count-guard
precedents). Multiplicity-as-signal is REFUTED on the evidence: the duplicates are
indistinguishable in the emitted shape (no consumer can decode a signal from identical objects),
and the source multiplicity is an emission accident of per-(unit, year) placement, not a curated
weight. If placement multiplicity is ever wanted as a signal, the honest shape is an explicit
`placementCount` property on ONE edge, not N identical edges — that is design agency for the
implementing cycle, not a reason to keep the duplication.

**Implementation routing**: one small source-touching cycle (vocab-gen dedup + drop-count
surfacing + test asserting unique pairs at emission), readiness-reviewed per
`invoke-code-experts` before execution-ready. Routed to the Director queue with this report;
not implemented in this analysis lane.

## 3. G4b on-EEF-path determination — NOT on the path; no signal raised

- **Code level** (re-verified first-hand this session, matching the G4b c3 commit-body
  determination): no module under `graph-corpus-sdk/src/eef-strands/` nor any EEF tool/resource
  module under `oak-curriculum-sdk/src/mcp/` consumes the keyword surface.
- **Workflow level**: the D1 value contract's signal sources are pedagogical signals the EEF
  evidence attaches to (misconception, prerequisite, sequence). `get-keyword-graph` surfaces
  vocabulary enrichment for lesson assembly (verified live: top-ranked decorated keywords for
  history/ks3); it neither feeds an EEF tool input nor carries a step the cover-lesson round
  trip requires. An agent MAY route keyword vocabulary toward oral-language strands as free
  enrichment, but the EEF seam neither depends on nor is altered by it.

**Determination**: `get-keyword-graph` is **adjacent enrichment, not an EEF value-path
dependency**. No `eef-revalidation` signal is raised for G4b; the graph plan's
`signal-eef-revalidation` todo closes on this recorded determination (its condition — "if the
EEF path consumes it" — is determined false).

## 4. Estate effects

- The seed plan's both todos complete with this report; the plan moves to completed (see the
  plan file's updated frontmatter and execution record).
- The eef thread record's "next value move" (the re-proof after G4b) is DISCHARGED.
- Director queue addition: the multiplicity dedup cycle (§2 implementation routing).
- No change to ADRs: ADR-191/193/194 boundaries verified intact at the tool layer; no new
  decision of ADR class was taken (the dedup decision is recorded here and lands with its
  implementing cycle's tests).
