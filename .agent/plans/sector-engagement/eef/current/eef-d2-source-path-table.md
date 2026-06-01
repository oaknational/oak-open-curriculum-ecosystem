# EEF D2 source-path table

The cross-cutting ledger the EEF graph-tool plan refers to as "the source-path
table". It audits every data-derivation seam at once: each row maps a raw
`EEF_TOOLKIT_DATA` source path to the D2 projection that exposes it, the corpus
cardinality (derived from the constant, not asserted), and the proof test.

D2 derives these **exhaustively from what the corpus structurally holds**, ahead
of D3. A row with no current D3 consumer is **retained, not trimmed**: D3 selects
its subset from this table later, and D6's output schema marks every non-floor
field optional to match the cardinality recorded here.

Cardinality legend: `N/30` = present on N of the 30 strands; `corpus-level` = a
single corpus-wide value. All counts verified against
`packages/sdks/graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts`.

## Strand identity and lookup

| Raw source path | D2 projection | Cardinality | Proof test |
| --- | --- | --- | --- |
| `strands[number]` | `EefStrand` (type) | 30/30 | `strand-lookup.unit.test.ts` |
| `strands[number].id` | `EefStrandId`, `EefStrandById`, `strandById`, `isValidStrandKey` | 30/30 | `strand-lookup.unit.test.ts` |

## Universal floor (present on all 30 strands)

| Raw source path | D2 projection | Cardinality | Proof test |
| --- | --- | --- | --- |
| `strands[number].headline.impact_months` | `HeadlineImpactMonths` (incl. `null`) | 30/30 (`null` on 4) | `strand-lookup.unit.test.ts` (literal narrowing) |
| `strands[number].headline.cost_rating` | `HeadlineCostRating` | 30/30 | type-checked via `EefStrand` |
| `strands[number].headline.cost_label` | `HeadlineCostLabel` | 30/30 | type-checked via `EefStrand` |
| `strands[number].headline.evidence_strength_rating` | `HeadlineEvidenceStrengthRating` | 30/30 | type-checked via `EefStrand` |
| `strands[number].headline.evidence_strength_label` | `HeadlineEvidenceStrengthLabel` | 30/30 | type-checked via `EefStrand` |
| `strands[number].definition` | `EefStrand` field access | 30/30 | type-checked via `EefStrand` |
| `strands[number].key_findings` | `EefStrand` field access | 30/30 | type-checked via `EefStrand` |
| `strands[number].tags` | `EefStrand` field access | 30/30 | type-checked via `EefStrand` |

## Corpus-sparse per-strand evidence (project as optional downstream)

These rows have no bound D3 consumer yet (D3 not ratified); they are retained so
D3 can select from them and D6 can mark them optional to match presence.

| Raw source path | D2 projection | Cardinality | Proof test |
| --- | --- | --- | --- |
| `strands[number].effectiveness` | `EefStrand` field access | 7/30 | type-checked via `EefStrand` |
| `strands[number].implementation` | `EefStrand` field access | 4/30 | type-checked via `EefStrand` |
| `strands[number].implementation.common_pitfalls` | `EefStrand` field access | 2/30 | type-checked via `EefStrand` |
| `strands[number].school_context_relevance` | `EefStrand` field access | 17/30 | type-checked via `EefStrand` |
| `strands[number].behind_the_average` | `EefStrand` field access | 6/30 | type-checked via `EefStrand` |
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
