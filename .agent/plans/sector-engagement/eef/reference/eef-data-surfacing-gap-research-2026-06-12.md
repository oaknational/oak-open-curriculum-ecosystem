# EEF Data Surfacing-Gap Research — 2026-06-12

**Author**: Forge turns Basalt / claude-code / Fable 5 / c4b882
**Date**: 2026-06-12
**Status**: point-in-time research record. It names decisions and their
considerations; it makes none. Statuses below are as observed on 2026-06-12.
**Question answered**: what is there in the EEF data that we are not yet
surfacing, or not yet surfacing usefully?

**Method**: first-hand read of the entire surfacing stack (all ten corpus and
MCP modules, the D2 source-path table, the D3 contract, the live plan's V1
field set and Non-Goals, four future plans, the two 2026-06 reports); three
live probes of `get-eef-evidence` on `oak-prod`; a 24-agent research workflow
(six parallel document readers, fifteen adversarial verifiers — twelve claims
confirmed, three partially-true with corrections applied below, zero refuted;
three verifiers failed on an API session limit and their claims were
re-adjudicated first-hand by the author). Grounding follows
[`eef-corpus-grounding`](../../../rules/eef-corpus-grounding.md): every corpus
claim cites an `EEF_TOOLKIT_DATA` source path or file:line; items marked
*agent-side* are the author's inference, not corpus data.

---

## 1. The estate at a glance

- **Corpus**: `EEF_TOOLKIT_DATA`, the `as const` constant in
  `packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`
  (1,966 lines; the type authority per ADR-038/ADR-173 doctrine). Five
  top-level sections: `meta`, `methodology`, `strands` (30),
  `school_context_schema`, `uk_context`.
- **Reference duplicate**: `reference/eef-toolkit.json` is byte-equivalent in
  content — Python deep-equality over both parsed structures returns true;
  identical `data_version 0.2.0`, identical 30 strand ids, identical
  per-strand field counts (verified first-hand and independently by a
  workflow agent). Nothing was dropped on ingest.
- **Surfaces** (all three co-gated behind `OAK_CURRICULUM_MCP_EEF_ENABLED`,
  default ON since D7, 2026-06-08):
  1. Tool `get-eef-evidence` (`inspect-strand` + `evidence-for-move`,
     `detail: full|headline`) —
     `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`;
  2. Resource `eef://interpretation` —
     `packages/sdks/oak-curriculum-sdk/src/mcp/eef-interpretation-resource.ts`;
  3. Prompt `adapt-lesson` —
     `packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/adapt-lesson.ts`.
- No other app, CLI, search-index, or docs surface consumes the
  `eef-strands` exports (workflow consumer sweep, spot-verified first-hand).

## 2. What IS surfaced — the baseline the gaps read against

Envelope members pass through **verbatim** (`eef-evidence.ts` builds members
from the graph nodes, which are the full strand objects; the egress membrane
spreads, never rebuilds). Verified live on `oak-prod`: an
`inspect-strand eef-tl-feedback` call returned every nested field the strand
carries — `behind_the_average_by_phase` (primary 7 / secondary 5),
`applications` (oral 7 / written 5), `pp_relevance` + note,
`implementation_requirements` (CPD intensity, time-to-embed, key staff,
workload note), `number_of_studies`, `review_last_updated`, and
`update_history`. Per-strand evidence is therefore surfaced essentially
completely on drill-down. The envelope also carries `answerType`
(`strand-lookup` vs `context-subset`), member-induced `related_strand` edges,
the `frontier`, and once-per-envelope provenance (source + authors + licence
+ all nine `meta.caveats`). The 2026-06-11 owner reversal to the dual
content/structuredContent shape is implemented at the egress
(`universal-tool-shared.ts:208-221` emits summary + full JSON content blocks
plus `structuredContent`), so content-block-only clients receive the full
envelope. The 2026-06-09 live assessment's "no terse projection" finding
(§3.C of
[`eef-evidence-workflow-live-value-assessment-2026-06-09`](../../../reports/eef-evidence-workflow-live-value-assessment-2026-06-09.md))
is resolved: `detail: 'headline'` is live (probed 2026-06-12, 14 headline
members for `keyStage: KS3`).

## 3. Held in the corpus, surfaced nowhere

| Corpus region (source path) | Holds | Consumers | Status |
| --- | --- | --- | --- |
| `uk_context.pupil_premium_rates_2024_25`, `uk_context.national_averages` (`eef-toolkit.external-data.ts:1925-1937`) | PP funding rates (primary FSM £1,455, secondary FSM £1,035, LAC £2,530, service children £335); national PP/SEND-support/EHCP percentages; average school sizes | Zero (grep over `packages/` + `apps/`) | **Deliberate** — D2 table "Not projected" (`eef-d2-source-path-table.md:41-50`): school-leader context, owned by [`eef-school-leadership-evidence.plan.md`](../future/eef-school-leadership-evidence.plan.md), hard-gated on a ratified leader-value statement |
| `uk_context.key_stage_mapping` (`:1939-1964`) | KS→age/years for all six key stages incl. KS5 | Zero | Swept into the same leader-context deferral. *Agent-side*: this region is arguably teacher-facing too — it is the translation layer from "Year 8" (how teachers speak) to `KS3` (what the tool accepts); today the agent supplies that mapping from its own knowledge |
| `school_context_schema` beyond the three axis enums (`:1834-1899`) | `school_type` (7 values), `pupil_premium` (pp_band / pp_percentage / funding), `send_percentage`, `ofsted_grade` (4 values), `attainment` (KS2 reading/maths, Progress 8, disadvantage-gap months), `workforce` (teacher/TA counts, ratio) | Only the phase / key-stage / priorities enums (`raw-domains.ts:23-33`) | **Deliberate** — same leader-context deferral. The schema's own `description` says "Pass these to `recommend_for_context`" — a tool that never existed in this repo; a server-side context-matcher is doctrine-forbidden (Decision 10 / ADR-191) and the archived value trace declined the recommender ("the teacher is the expert") |
| `methodology.effect_size_to_months_conversion` (13-row table), `methodology.cost_measure.scale[].range_per_class_per_year_gbp`, `methodology.evidence_strength_measure.factors` (7 factors) + `scale_min`/`scale_max` | How months are derived from effect sizes; per-class £ bands; what earns or loses a padlock | Exported inside `corpusMethodology` (`corpus-meta.ts:32`), consumed only by the interpretation resource — whose `citeMethodology()` renders the impact measure, per-pupil cost rows, and the padlock one-liner only (`eef-interpretation-resource.ts:77-93`). Envelopes carry no methodology at all | **No recorded deferral decision found** for these sub-fields — an unowned gap, not a recorded choice |
| `declaredVsObservedDivergence` (`raw-domains.ts:136-146`) | The named unreachable vocabulary: phases `post_16` / `all_through` / `special`; `KS5`; priorities `improving_attendance` / `teacher_retention` (matches `eef-d2-source-path-table.md:118-123`) | Its unit test only | Computed and exported, never surfaced. The resource explains partial curation generically ("17 of 30 strands carry tags") but never names *which* declared values are unreachable; an agent asked about post-16 gets schema rejection with no in-band explanation. D3 records the boundary-rejection rationale (`eef-d3-mcp-contract.md:126-143`) — the *non-surfacing of the divergence record itself* has no recorded decision |
| `meta.schema_version`, `meta.data_version`, `meta.last_updated` | Snapshot versioning | `lastUpdated` exported; test-only | **Deliberate** — D1 V2: internal debugging metadata; D5 tests assert absence from envelopes. Freshness reaches consumers as caveat 8 prose only |

`meta.coverage` (age range 3–18, jurisdiction, evidence scope) is surfaced in
the resource (`citeSource()`) but not in envelopes — recorded here for
completeness; no defect claimed.

## 4. Surfaced, but not usefully

1. **The orientation layer never mentions EEF.** `get-curriculum-model` — the
   call every agent is instructed to make first, including by the
   `adapt-lesson` prompt itself — contains zero EEF references (grep over
   `tool-guidance-data.ts` / `tool-guidance-workflows.ts` is empty; verified
   first-hand after a workflow finding). An agent that does not already know
   `get-eef-evidence` exists will not learn it from orientation. The sharpest
   unowned discoverability finding of this research.
2. **Axis filtering reaches 17 of 30 strands.** `strandAxisIndex`
   (`raw-domains.ts:181-202`) is built from `school_context_relevance`,
   carried by 17/30 strands (`eef-d2-source-path-table.md:91`); the other 13
   are reachable only by id. Honestly documented (`answerType:
   'context-subset'`, the resource's partial-curation note, the frontier as
   compensation), and the 2026-06-09 live assessment showed the ergonomic
   risk is real (metacognition + secondary matched two strands). *Agent-side
   observation*: the nine strands carrying only the eight floor fields
   (individualised-instruction, learning-styles, mentoring,
   outdoor-adventure-learning, performance-pay, physical-activity,
   reducing-class-size, repeating-a-year, school-uniform — workflow count,
   spot-verified by live probe of school-uniform) skew heavily to the
   school-leadership set: extended curation followed the teacher frame.
3. **No whole-corpus query exists.** `evidence-for-move` requires at least
   one selector (`aggregated-eef-evidence.ts:173-180`), so "scan all 30
   headlines" requires enumerating all 30 ids explicitly; the resource's
   strand index carries `headline_summary` one-liners and tags but not the
   numeric impact/cost/evidence values (`eef-interpretation-resource.ts:103-118`).
4. **Multi-axis semantics are undocumented.** Combined selectors are AND
   (`matchesAxis`, `eef-evidence.ts:173-186`); the tool description's "any
   of `phase`, `keyStage`, `priority`" reads naturally as OR. One sentence
   in the description would close it.
5. **`number_of_studies` is internally inconsistent.** Present on four
   strands in two different locations: `headline.number_of_studies`
   (metacognition-and-self-regulation 355, one-to-one-tuition 123) and
   `school_context_relevance.number_of_studies` (feedback 155,
   peer-tutoring) — verified live and in source; matches
   `eef-d2-source-path-table.md:83` plus its prose note. EEF publishes study
   counts for every strand; this is snapshot-curation noise an agent must
   handle defensively.
6. **Contract/implementation divergence (benign direction).** The live tool
   emits `update_history` (verified live on feedback, 2026-06-12) although
   the D2 table records it "not projected … by choice" and the D3 V1 member
   set omits it — members travel verbatim, and the MCP `outputSchema` that
   would enforce the subset was deliberately deferred to
   `output-schemas-for-mcp-tools.plan.md` (owner-ratified 2026-06-06,
   `eef-d3-mcp-contract.md:185-193`). That plan needs an explicit
   disposition for this divergence when it lands: either `update_history`
   joins the ratified set or the schema strips it.
7. **Token-weight observations.** Every envelope repeats the full
   provenance block (~2.2k chars: source, authors, licence note, nine
   caveats) — deliberate (attribution as trust requirement,
   `eef-evidence.ts:30-44`); on headline scans it dominates the payload.
   Every envelope also carries an `oakContextHint` directing the agent to
   `get-curriculum-model` — irrelevant in a standalone-EEF flow; the owner's
   first-pass feedback (`tmp/first-pass-eef-tooling-feedback.md` item 3)
   asked to drop context hints from graph tools, and no recorded decision
   covers the hint's inclusion for EEF specifically
   (`formatToolResponse` includes it unless `includeContextHint: false`;
   the EEF egress does not set it).
8. **Stale and over-advertising docs.**
   `packages/sdks/oak-curriculum-sdk/docs/mcp/README.md:23-34` still
   describes two never-built EEF surfaces (`eef-explore-evidence-for-context`,
   `eef-evidence-grounded-lesson-plan` — the latter was historically a
   prompt name) and links a directory deleted at `9019bb86e`. The landing
   page lists the EEF resource even when the flag is off
   (`render-resources-section.ts:19` — recorded, deliberate behaviour;
   noted, not claimed as a defect).

## 5. Query capability over surfaced data

- **Headline-metric filters** (`impactMonths`, `costRating`, `costLabel`,
  `evidenceStrengthRating`, `evidenceStrengthLabel`): owner-deferred
  2026-06-03 with an evidence gate — promotion requires D7 green plus
  observed agent usage of the exact-match pattern
  ([`eef-tool-metric-filter-inputs.plan.md`](../future/eef-tool-metric-filter-inputs.plan.md)).
  Standing rules recorded at deferral: exact corpus values only;
  `impact_months` carries corpus `null` on 4 strands; `cost_rating`'s
  observed domain is the literal union {1, 2, 3, 5}.
- **Tag-based selection**: `tags` exist on all 30 strands
  (`strands[number].tags`, D2 floor) and are not a selector anywhere — and
  unlike metric filters, tag selection has **no recorded consideration or
  deferral** in any current, future, or archived plan this research found.
  Named here so the absence is a visible decision rather than an accident.

## 6. Corpus refresh and the licence/provenance position

### Timeline (first-hand from git and the estate)

| Date | Event |
| --- | --- |
| 2026-04-02 | Snapshot created (`meta.last_updated`; `data_version 0.2.0`) |
| 2026-04-11 | `eef-toolkit.json` lands in-repo (PR #78, `779ab475a`); credits EEF for data and John Roberts (Oak) for the EEF MCP prototype; acquisition mechanics unrecorded |
| 2026-04-30 | Structural validation at relocation (estate README table: 30 strands, 4 null-impact, 17/30 school-context, etc.); snapshot noted as 28 days old |
| 2026-05-10 | `eef-source-authority-clarification` session; commit `b6745068c` records corpus source authority; the "provenance pending EEF clarification" posture dates from this window |
| 2026-05-27 | TS corpus module created **with** Zod loader + freshness gating (`afdaa9909`; ADR-175, 180-day threshold) |
| 2026-05-31 | D0 doctrine pass: ADR-175 **withdrawn** — file deleted, number retired, the `Withdrawn` ADR lifecycle status created for it (`eef-d0-decontamination-ledger.md:24-25,53`) |
| 2026-06-04 | D5 physically deletes `freshness.ts` / `checkFreshness` / the Zod loader |
| 2026-06-08 | D7 ships the surface live by default (`d9f0d9061`) |

### Licence position

`meta.licence.name` is not a licence; it is a placeholder: "Repository-held
EEF Toolkit data snapshot; provenance pending EEF clarification".
`meta.licence.attribution_note` states the acquisition path is unknown ("may
have been downloaded from EEF or supplied to Oak by EEF") and designates the
repository copy the definitive implementation source until EEF clarifies
provenance and refresh mechanics. ADR-157 (Proposed, non-constraining) names
its other two data sources' licences precisely (Oak API: OGL v3.0; ontology:
OGL v3.0 data / MIT code) — the EEF entry has no licence line, and the
licensing audit named in ADR-157's scope has not happened. EEF's own site
terms are recorded nowhere in-repo.

**Exposure** (*agent-side assessment*): the dataset is served publicly on
`oak-prod` today under an unconfirmed redistribution right. The mitigation is
attribution-maximalism — every envelope carries the source organisation, URL,
six named authors, the licence note, and all nine caveats; every strand
carries `eef_url`; the obligation language requires linking users to EEF for
"the most current figures" (verified live in all three probes). A strong
good-faith posture; still an assumption, not a documented grant.

### Refresh position

The EEF Toolkit is a living systematic review updated roughly twice a year
(estate README currency note; corpus caveat 8 names the May 2025 and
October 2025 cycles). The snapshot is dated 2026-04-02 — ten weeks old at
this writing. *Agent-side inference*: on the observed cadence the next
upstream update lands around mid-2026; drift is a when, not an if.

By ratified doctrine there is **no automated freshness machinery** — that is
a decision, not a gap (D0; the data is the schema; an automated staleness
gate over fixed known data re-checks what the type carries). Refresh is a
manual, review-gated hand-copy: the corpus header commits to "a reviewed
replacement snapshot … copied into this module by hand when EEF clarifies
the supply path", and the estate README defines the pre-copy protocol
(re-validate against current upstream; re-apply the plan-body
first-principles check). Consumer-visible freshness is caveat prose only.

### What turns on the EEF clarification (decisions named, not made)

1. **Redistribution rights** for data already served publicly.
2. **The refresh supply path** itself (download, data-sharing agreement, or
   feed) — gates any snapshot update.
3. **The corpus backfill opportunity** — the sparse extended fields
   (`effectiveness` 7/30, `behind_the_average` 6/30, `implementation` 4/30,
   `closing_the_disadvantage_gap` 2/30) and study-level EPPI data (0/30,
   "requires EEF data access" per the strategy brief) are the largest pool
   of unsurfaced EEF value, and acquiring them needs exactly this channel.
4. **Whether a refreshed corpus revisits consumer-visible freshness**
   (currently excluded by D1 V2).

**Unowned item**: the "pending EEF clarification" dependency has no recorded
owner, action, or outreach plan anywhere in the repo. It has sat as a
passive blocker since at least 2026-05-10, in a directory named
`sector-engagement`.

## 7. Frame items — gaps that are not surfacing gaps

- **The Oak→EEF bridge.** Nothing in the data connects an Oak lesson,
  misconception, or unit to an EEF strand; the agent bridges unaided. This
  is ratified design (Decision 10 / ADR-191: the agent is the only
  reasoner; no server-side situation→strand mapping), the bridge deliverable
  was explicitly retired (ADR-194 context,
  `eef-evidence-workflow-design-directions-2026-06-09.md:29-46`), and the
  ontology-level crosswalk (EEF strands as KG nodes; "evidence-backed
  approaches for Year 5 fractions") is recorded as Not Started in
  [`evidence-integration-strategy.md`](../future/evidence-integration-strategy.md)
  (Levels 4/4b, gated on the formal ontology). The 2026-06-09 live
  assessment names the unaided bridge the central open value question.
- **The corpus is sparse relative to EEF's published toolkit.** EEF's site
  carries effectiveness/behind-the-average/implementation prose for **all**
  strands; the snapshot holds them for 7/6/4 of 30 respectively (D2 table
  cardinalities, independently recomputed twice this session). The richest
  unsurfaced EEF content therefore sits upstream of a corpus refresh —
  blocked on §6. Agents are pointed at `eef_url` for full detail, but the
  interpretation resource states only the 17/30 school-context coverage; it
  does not state that the deep-evidence fields are snapshot-sparse, so
  absence-in-snapshot can read as absence-at-EEF
  (the V1 doctrine "absent richer fields simply omitted, never fabricated"
  is honest about the strand, silent about the snapshot).

## 8. The actionable delta — items with no recorded owner or decision

The deliberate deferrals (leader context, metric filters, standalone
workflows, output schema, outcome evaluation) all have named homes and
gates. The items below surfaced in this research with **no recorded
disposition anywhere**; naming them is this report's job, their disposition
is the owner's:

1. EEF's invisibility in `get-curriculum-model` orientation (§4.1).
2. The methodology sub-fields exported but rendered nowhere — conversion
   table, per-class cost bands, padlock factors (§3).
3. Tag-based selection never considered (§5).
4. The undocumented AND semantics of combined axis selectors (§4.4).
5. The `update_history` contract/implementation divergence awaiting the
   output-schemas plan (§4.6).
6. The `oakContextHint` on EEF envelopes, unreconciled with the owner's
   first-pass feedback (§4.7).
7. The stale SDK docs README advertising never-built surfaces (§4.8).
8. `key_stage_mapping` sitting in the leader-context deferral despite being
   teacher-query-translation value (§3).
9. The unowned EEF provenance/refresh outreach (§6) — upstream of the
   largest unsurfaced-value pool (§7).
10. The divergence record (`declaredVsObservedDivergence`) computed but
    never surfaced to agents (§3).

## 9. Verification record

- All ten surfacing-stack modules read first-hand; the D2 source-path
  table, D3 contract, live plan V1/Non-Goals sections, four future plans,
  the 2026-06-09 live value assessment, and the 2026-06-11 revalidation
  report read first-hand.
- Three live `oak-prod` probes (2026-06-12): `inspect-strand` on a
  floor-only strand (school-uniform), `inspect-strand` on a rich strand
  (feedback), `evidence-for-move keyStage=KS3 detail=headline`.
- Snapshot parity (JSON ↔ TS) verified twice independently: the author's
  id-set/field-count comparison and a workflow agent's deep-equality check.
- Workflow: 24 agents (6 readers, 15 adversarial verifiers, 3 verifier
  failures on an API session limit — those claims re-adjudicated first-hand).
  Verdicts: 12 confirmed, 3 partially-true (corrections applied: the
  guidance-report node-kind divergence is an explicit decision B
  supersession, not silent drift; the duplicate prerequisiteFor-edge fix
  had already landed by verification time; one historic surface name was a
  prompt, not a tool), 0 refuted.
- The 2026-06-09 assessment's "no terse projection" finding was
  re-tested live and is resolved (`detail: 'headline'` shipped).
