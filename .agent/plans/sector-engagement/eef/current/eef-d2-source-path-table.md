# EEF D2 source-path table

The cross-cutting ledger the EEF graph-tool plan refers to as "the source-path
table". It audits every source path D2 currently projects: each row maps a raw
`EEF_TOOLKIT_DATA` source path to the D2 projection that exposes it, the corpus
cardinality (computed from the constant), and the proof test.

D2 derives these **exhaustively from what the corpus structurally holds**, ahead
of D3. Every row is retained for D3 to select its subset from later, and D6's
output schema marks every non-floor field optional to match the cardinality
recorded here.

Cardinality legend: `N/30` = present on N of the 30 strands; `corpus-level` = a
single corpus-wide value. Every count is a deterministic projection of the corpus,
not a hand-maintained figure: each is `strands.filter((s) => 'field' in s).length`,
recomputable from `EEF_TOOLKIT_DATA` at any moment, with the corpus as the sole
authority for this table's numbers.

> **The floor/sparse split needs no separate code structure — it is inherent in
> the corpus type.** The universal floor is exactly `keyof EefStrand` (the keys
> common to every member of the `EefStrand` union, hence present on all 30), and
> the union itself carries optionality (a member that lacks `effectiveness` simply
> has no such key). So the MCP output schema's optionality (D6) is **dictated by
> the graph-native view type**: a field optional in the type is optional in the
> schema to satisfy the `satisfies` compile-time tie — derived at the point of use,
> never counted, classified, or pre-built. This is not deferred work; there is no
> separate cardinality/floor structure to build, now or later. (A session-built
> `field-cardinality.ts` module restating this inherent fact was backed out as a
> zero-consumer surface — `principles.md`: product code used only by its own test
> is deleted; do not extract zero-consumer abstractions.)

**Not projected (intentional, recorded for honesty).** Two corpus surfaces are
deliberately left unprojected by this teacher-facing plan: the top-level
`uk_context` (key-stage→age/years mapping, national averages, pupil-premium rates
— school-leader context), and the `school_context_schema` enums other than
phase/key-stage/priority (`school_type`, `pp_band`, `ofsted_grade`,
`pupil_premium`, `attainment`, `workforce` — also school-leader context, owned by
the school-leadership follow-on plan). They are corpus data, but not teacher
cover-lesson value, so the table omits them by choice, not by oversight.

## Strand identity and lookup

| Raw source path | D2 projection | Cardinality | Proof test |
| --- | --- | --- | --- |
| `strands[number]` | `EefStrand` (type) | 30/30 | `strand-lookup.unit.test.ts` |
| `strands[number].id` | `EefStrandId`, `EefStrandById`, `strandById`, `isValidStrandKey` | 30/30 | `strand-lookup.unit.test.ts` |
| `strands[number].name` | `EefStrand` field access | 30/30 | type-checked via `EefStrand` |
| `strands[number].slug` | `EefStrand` field access | 30/30 | type-checked via `EefStrand` |
| `strands[number].eef_url` | `EefStrand` field access (attribution) | 30/30 | type-checked via `EefStrand` |

## Universal floor (present on all 30 strands)

| Raw source path | D2 projection | Cardinality | Proof test |
| --- | --- | --- | --- |
| `strands[number].headline.impact_months` | `HeadlineImpactMonths` (incl. `null`) | 30/30 (`null` on 4) | `strand-lookup.unit.test.ts` (literal narrowing) |
| `strands[number].headline.cost_rating` | `HeadlineCostRating` | 30/30 | type-checked via `EefStrand` |
| `strands[number].headline.cost_label` | `HeadlineCostLabel` | 30/30 | type-checked via `EefStrand` |
| `strands[number].headline.evidence_strength_rating` | `HeadlineEvidenceStrengthRating` | 30/30 | type-checked via `EefStrand` |
| `strands[number].headline.evidence_strength_label` | `HeadlineEvidenceStrengthLabel` | 30/30 | type-checked via `EefStrand` |
| `strands[number].headline.headline_summary` | `EefStrand` field access | 30/30 | type-checked via `EefStrand` |
| `strands[number].definition` | `EefStrand` field access | 30/30 | type-checked via `EefStrand` |
| `strands[number].key_findings` | `EefStrand` field access | 30/30 | type-checked via `EefStrand` |
| `strands[number].tags` | `EefStrand` field access | 30/30 | type-checked via `EefStrand` |

## Corpus-sparse per-strand evidence (project as optional downstream)

These rows are retained for D3 to select from and for D6 to mark optional to
match presence; D3 binds its consumer subset when it is ratified.

| Raw source path | D2 projection | Cardinality | Proof test |
| --- | --- | --- | --- |
| `strands[number].effectiveness` | `EefStrand` field access | 7/30 | type-checked via `EefStrand` |
| `strands[number].implementation` | `EefStrand` field access | 4/30 | type-checked via `EefStrand` |
| `strands[number].implementation.common_pitfalls` | `EefStrand` field access | 2/30 | type-checked via `EefStrand` |
| `strands[number].school_context_relevance` | `EefStrand` field access | 17/30 | type-checked via `EefStrand` |
| `strands[number].behind_the_average` | `EefStrand` field access | 6/30 | type-checked via `EefStrand` |
| `strands[number].closing_the_disadvantage_gap` | `EefStrand` field access | 2/30 | type-checked via `EefStrand` |
| `strands[number].related_guidance_reports` | `EefStrand` field access | 7/30 | type-checked via `EefStrand` |

## Observed applicability domains (from `school_context_relevance`)

| Raw source path | D2 projection | Cardinality | Proof test |
| --- | --- | --- | --- |
| `strands[number].school_context_relevance.most_relevant_phases` | `ObservedPhase` | 17/30 | `raw-domains.unit.test.ts` |
| `strands[number].school_context_relevance.most_relevant_key_stages` | `ObservedKeyStage` | 17/30 | `raw-domains.unit.test.ts` |
| `strands[number].school_context_relevance.most_relevant_priorities` | `ObservedPriority` | 17/30 | `raw-domains.unit.test.ts` |

## Declared metadata domains (from `school_context_schema`) + divergence

Declared enums are typed raw metadata only. A declared value becomes a D3 filter
input **only if** D3 ratifies it and the divergence record shows it yields a
non-empty result.

| Raw source path | D2 projection | Cardinality | Proof test |
| --- | --- | --- | --- |
| `school_context_schema.properties.phase.enum` | `DeclaredPhase` (6 values) | corpus-level | `raw-domains.unit.test.ts` |
| `school_context_schema.properties.key_stage.enum` | `DeclaredKeyStage` (6 values) | corpus-level | `raw-domains.unit.test.ts` |
| `school_context_schema.properties.priorities.items.enum` | `DeclaredPriority` (15 values) | corpus-level | `raw-domains.unit.test.ts` |

**Declared-vs-observed divergence** (`declaredVsObservedDivergence`, derived not
asserted) — declared values no strand carries:

- `phase`: `post_16`, `all_through`, `special`
- `keyStage`: `KS5`
- `priority`: `improving_attendance`, `teacher_retention`

## Edge facts

| Raw source path | D2 projection | Cardinality | Proof test |
| --- | --- | --- | --- |
| `strands[number].related_strands` | `relatedStrandEdges` (`RelatedStrandEdge[]`) | 17/30 | `raw-domains.unit.test.ts` |

## Corpus-level provenance and methodology

| Raw source path | D2 projection | Cardinality | Proof test |
| --- | --- | --- | --- |
| `meta` | `corpusMeta` | corpus-level | `corpus-meta.unit.test.ts` |
| `meta.caveats` | `corpusCaveats` | corpus-level | `corpus-meta.unit.test.ts` |
| `meta.last_updated` | `lastUpdated` | corpus-level | `corpus-meta.unit.test.ts` |
| `methodology` | `corpusMethodology` | corpus-level | `corpus-meta.unit.test.ts` |
