---
name: "External Oak References — Deep Research and Plan-Impact Mapping"
overview: >
  Catalogue the three external Oak repositories the owner has named
  as reference sources (oak-curriculum-ontology, Aila,
  oak-ai-moderation-service); audit license compliance against the
  owner-set adoption rules (public on GitHub AND MIT-equivalent
  AND fully acknowledged); identify where each repo's content may
  change the direction of current/future plans in this repo; and
  schedule deep-research sessions per repo with explicit acceptance
  criteria. Strategic brief — not yet executable.
status: future
todos:
  - id: phase-0-license-audit
    content: "Phase 0: License audit and adoption-rule reconciliation against owner-stated rules."
    status: pending
  - id: phase-1-impact-map
    content: "Phase 1: Map each repo to potentially-affected current/future plans (hypothesis-shaped, not assertion)."
    status: pending
  - id: phase-2-research-sequence
    content: "Phase 2: Sequence the deep-research sessions; declare promotion criteria per repo."
    status: pending
  - id: phase-3-acknowledgement-mechanism
    content: "Phase 3: Define the acknowledgement mechanism for any adopted material."
    status: pending
isProject: false
---

# External Oak References — Deep Research and Plan-Impact Mapping

**Last Updated**: 2026-05-01
**Status**: 🔴 NOT STARTED — strategic brief, awaiting promotion to
`current/` per per-repo trigger
**Scope**: Cross-repo reference recognition for three external Oak
repositories owner-named on 2026-05-01. Plan-impact mapping and
research scheduling. Not an adoption plan — adoption is downstream.

---

## Problem and Intent

Owner stated 2026-05-01: three external Oak repositories are
reference targets for this repo's planning:

1. **`oak-curriculum-ontology`** — internal graphs (curriculum
   ontology, vocabulary, instance data) outside the scope of this
   repo for now. Already on the planning radar via
   `knowledge-graph-integration/oak-ontology-graph-opportunities.strategy.md`
   (2026-04-19).
2. **Aila** (Oak's official prompts repo) — official prompts and
   resources around lesson planning, pedagogy. **Not on the
   planning radar in this repo today.**
3. **`oak-ai-moderation-service`** — examples of handling responses
   not suitable in an education setting. **Not on the planning
   radar in this repo today.**

Adoption rules (owner-stated 2026-05-01):

- Public on GitHub.
- MIT licensed (or MIT-equivalent — see Phase 0).
- Fully acknowledged where adopted.

The immediate outcome the owner wants is *not adoption*. The
outcome is:

- **Recognition** of where these resources may change direction in
  current and future plans;
- **Scheduling** of deep-research sessions into each repo so
  recognition can mature into informed plan revisions or cross-
  references.

This plan is the recognition + scheduling artefact. Adoption decisions
follow per-repo, after deep research and per-impact owner
authorisation.

---

## Domain Boundaries

**In scope**:

- Cataloguing the three repos with provenance and license findings.
- Mapping each repo to potentially-affected plans in this repo
  (hypothesis-shaped — "may change direction X if research finds Y").
- Sequencing deep-research sessions with per-repo promotion criteria.
- Defining the acknowledgement mechanism (where attribution lives,
  what form it takes).

**Out of scope**:

- Actually adopting any code, prompts, ontology, or moderation
  patterns. Adoption is per-repo, per-impact, and follows after
  deep research surfaces a concrete adoption target.
- Authoring an integration architecture (e.g. how this repo's MCP
  surfaces would call into a shared moderation service).
- Negotiating licensing exceptions. The adoption rules are
  owner-stated; deviations require owner direction.
- Deep research itself. The point of this plan is to *schedule*
  the research, not to do it inline.
- Modifications to the three external repos. We are consumers; any
  upstream change is a separate engagement.

---

## License and Visibility Audit

Owner direction 2026-05-01: **the rule is permissive-with-attribution,
not strictly MIT.** ISC, OGL-3-with-attribution, and similar
permissive licenses are acceptable.

Owner direction 2026-05-01: **the acknowledgement mechanism sketched
below (per-file header + repo-level NOTICE + README acknowledgement)
is approved.**

Findings from light scan 2026-05-01:

| Repo | GitHub | License | Adoption status |
|---|---|---|---|
| `oaknational/oak-curriculum-ontology` | **Public** | Dual: MIT (code) + OGL-3 (data/ontology/docs) — both permissive-with-attribution | **Adoption-eligible** |
| `oaknational/oak-ai-lesson-assistant` (Aila) | **Public** | **MIT** | **Adoption-eligible** |
| `oaknational/oak-ai-moderation-service` | **PRIVATE** | ISC | **Concepts-only** — see private-repo discipline below |

Adjacent finding (not in the original three but surfaced during the
scan): `oaknational/aila-atomic-concepts` is **private**, MIT-or-
unspecified. Description: *"Decomposing Oak's curriculum into its
smallest teachable units — atomic facts and concepts — to enable
structured QA, prerequisite derivation, and curriculum graph
construction. Science KS3 pilot."* Concepts-only by visibility.

**Local checkout added 2026-05-01** by owner at
`/Users/jim/code/oak/aila-atomic-concepts` for reference. Top-level
shape (light look): `README.md`, `atomic_concepts/`, `data/`,
`examples/`, `research.md`, `research_atomic_concepts_tvp.md`,
`tvp_atomic_concepts.md`, `tvp_findings_and_next_steps.md`,
`implementation_plan.md`, `adjusted_metrics_and_annotation_v3.md`,
`results/`. The local checkout enables conceptual learning under
the private-repo discipline below. **Directly relevant to
`graph-query-layer.plan.md`'s PrerequisiteGraph** as a conceptual
reference; specific concepts to harvest at deep-research time
(prerequisite-derivation methodology, atomic-concept granularity,
QA-from-graph evaluation patterns).

### Private-repo discipline (owner direction 2026-05-01)

Where a referenced repo is **private**, we can learn **concepts**
from it but cannot bypass its privacy choice by adding **content**
to this public repo. Specifically:

- ✅ Read and understand the private repo's design.
- ✅ Apply learned patterns and concepts in our own
  implementation, expressed in our own words and code.
- ✅ Cite the existence of the private repo as inspiration where
  load-bearing for context.
- ❌ Copy code, prompts, or schema verbatim.
- ❌ Quote distinctive content (specific phrasing, identifiers,
  configuration data) that would re-publish private material.
- ❌ Reproduce data fragments that are only present in the private
  repo.

This applies to `oak-ai-moderation-service` and
`aila-atomic-concepts`. The discipline is "concepts-eligible,
content-ineligible" — distinct from the public-repo "adoption-
eligible" status, where content can be lifted with attribution.

---

## Plan-Impact Map (Phase 1 outline; full map at promotion)

Hypothesis-shaped — "research may surface impact X". Not assertion.

### `oak-curriculum-ontology`

Potentially affects:

- **`graph-query-layer.plan.md`** (Increment 1, CURRENT): the
  ontology models programme, unit, unit variant, lesson, thread,
  exam board, tier, and National Curriculum alignment via RDF/OWL/SKOS.
  This repo's `PrerequisiteGraphView`, `MisconceptionGraphView`,
  and `EefStrandsGraphView` adapters currently invent their own
  shapes against this repo's data. **Research may surface that
  the ontology's edge types and node identifiers are the canonical
  Oak shape**, in which case the adapters should align (or
  consciously diverge with documented rationale). Existing
  strategy doc already notes "the ontology was produced by a
  separate team and should not be assumed to be a drop-in
  structural match" — alignment is informational, not constraining.
- **`cross-source-journeys.plan.md`** (Increment 3, FUTURE): if
  the ontology has cross-source linkages (curriculum → exam-board
  → assessment), those journeys may already be modelled and
  available for re-use.

### Aila (Oak's prompts repo)

Potentially affects:

- **`cross-source-journeys.plan.md`** (Increment 3, FUTURE): Aila
  contains Oak's official prompts for lesson planning and pedagogy.
  **Research may surface that Aila's prompts already orchestrate
  the kinds of teacher-question journeys that Increment 3
  contemplates** — in which case Increment 3 may shift from
  "design a journey orchestration" to "expose Aila-shaped journeys
  through this repo's MCP surface". This is the most plan-altering
  potential of the three repos.
- **`eef-evidence-corpus.plan.md`** (Increment 2, CURRENT):
  Aila's prompts may already incorporate EEF guidance language,
  which would inform the citation discipline (T12) and the
  user-value sense-checks across Increment 2.
- **Search-quality work** (paused thread): Aila prompts may
  already contain the queries / phrasings that ground-truth
  authoring is meant to capture. Research may surface that the
  ground-truth corpus should be seeded from Aila usage rather
  than designed from scratch.
- **Any plan touching teacher-facing language**: Aila is Oak's
  source of authoritative pedagogy phrasing.

### `oak-ai-moderation-service`

Potentially affects:

- **`graph-query-layer.plan.md` and `eef-evidence-corpus.plan.md`**
  (CURRENT): MCP tool responses that surface curriculum content,
  EEF evidence, or generated explanations may need moderation —
  particularly for student-facing applications downstream. The
  moderation service exposes a `moderate` API; **research may
  surface that this repo's MCP responses should be moderated
  before delivery** for any application context.
- **`cross-source-journeys.plan.md`** (Increment 3, FUTURE):
  cross-source journeys generate composed responses; moderation
  becomes more relevant as response complexity grows.
- **Any plan that produces LLM-generated prose**: the moderation
  service is the canonical Oak path for safety on educational
  content.

The full Phase 1 map records each impact as `{ repo, plan,
hypothesis, research_question, blocking? }`. Most impacts are
non-blocking — research may inform plans without halting them.

### Implication for Increment 1 readiness — light scan finding

**Light scan complete 2026-05-01. No blocking findings for
Increment 1 promotion.**

What the scan found in `oak-curriculum-ontology` (the most likely
source of Increment-1-relevant overlap):

- The ontology has top-level OWL classes for `Misconception`, `Thread`,
  `Programme`, `Unit`, `UnitVariant`, `Lesson`, `Phase`, `KeyStage`,
  `YearGroup`, `SubjectGroup`, `Subject`, `Scheme`, `Progression`,
  `ExamBoard`, `Tier`, `Keyword`, `KeyLearningPoint`,
  `PupilLessonOutcome`. **Non-trivial overlap** with the names
  Increment 1 uses (e.g. `MisconceptionNode`, `EefStrandsGraphView`'s
  strands which map conceptually to `Thread`).
- The overlap is at the **vocabulary layer**, not the structural
  layer. The ontology's `Misconception` class does not (per the
  light scan) define edge types between misconceptions; this repo's
  data also has no misconception edges (already a Phase B finding,
  with explicit NO TRACER carve-outs). There is no structural
  collision to resolve.
- The ontology is OGL-3 data — adoption-eligible per the new rule,
  but adoption shape is "informational alignment of names", not
  "ingest the ontology as the runtime data model".

What the scan found in `oak-ai-lesson-assistant` (Aila): public,
MIT, monorepo with `apps/` and `packages/`. Likely contains prompts
relevant to **Increment 3 (cross-source-journeys, FUTURE)**. Not
relevant to Increment 1 — Increment 1 is a structured query layer,
not journey orchestration.

What the scan found in `oak-ai-moderation-service`: reference-only
(private). Relevant to plans that produce LLM prose. Increment 1
produces structured tool-call responses, not LLM prose. Not
relevant to Increment 1.

**Recommendation**: do not block Increment 1 promotion. The
ontology-alignment opportunity is informational and feeds forward;
it can be addressed as a post-`pnpm sdk-codegen` decision (e.g.
"should `MisconceptionNode` be renamed to align with
`curric:Misconception`?") rather than a pre-promotion gate. The
existing strategy doc's framing ("don't assume drop-in match") is
sound and survives the scan.

If the owner wishes to expose `aila-atomic-concepts` (private,
prerequisite-derivation work) into this repo's planning, that is
a separate decision and would warrant a deeper research pass before
Increment 1 — but only if the owner intends that content to inform
the adapter shapes, which is owner judgement, not scan output.

---

## Dependencies and Sequencing Assumptions

- License audit completes before any plan-impact assertion
  hardens. A repo whose license excludes adoption is research-only,
  not adoption-eligible; the impact map's "research_question"
  framing accommodates both.
- Per-repo deep research can run in parallel; no sequencing between
  the three.
- Acknowledgement mechanism (Phase 3) is light infrastructure but
  must exist before any code or content is adopted; it does not
  block deep research itself.

---

## Success Signals (Justify Promotion)

This plan promotes from `future/` to `current/` when:

1. ✅ Owner has clarified the "MIT-equivalent" rule (strict MIT vs
   permissive-with-attribution including ISC and OGL).
2. ✅ Phase 1 plan-impact map is owner-reviewed and the
   "blocking vs informational" classification per impact is
   confirmed.
3. ✅ Per-repo deep-research sessions have a sequence and an owner
   willing to review their output.
4. ✅ Acknowledgement mechanism (Phase 3) is sketched at least at
   the convention level — where attributions live, what form they
   take, who maintains them.

---

## Risks and Unknowns

- **License surprise on Aila**: Aila has not been inspected
  locally; if its license excludes adoption, the impact map for
  Aila collapses to "informational only — research informs
  but does not adopt". This is still useful but is a different
  shape.
- **OGL on ontology data**: if OGL is excluded from "MIT-equivalent",
  the curriculum ontology's data/instances/docs become
  research-only; only the script tooling (MIT) is adoption-eligible.
- **Moderation coupling**: introducing moderation as a downstream
  dependency on `oak-ai-moderation-service` adds operational
  surface (a service to call, error modes, latency budget). Even
  without code adoption, *architectural* dependency is a
  significant decision.
- **Plan-impact bias**: hypothesis-shaped impacts are easy to
  list; the danger is that the impact map proliferates speculative
  links rather than concentrating on the load-bearing ones.
  Mitigation: every impact entry has a stated research question
  whose answer determines whether the impact is real.
- **The user is one judgement-source**: the research output should
  surface to the owner; we should not silently re-shape current
  plans based on agent-only reading of external repos.

---

## Promotion Trigger

This plan promotes to `current/` when a specific repo's research
becomes the next session's primary work — at which point a
`current/`-lane executable plan is authored from the per-repo
section of this brief, and this brief's per-repo entry links to it.

The "MIT-equivalent" rule was confirmed by the owner 2026-05-01:
permissive-with-attribution is fine.

Per-repo research order (chosen 2026-05-01):

1. **Aila** (`oaknational/oak-ai-lesson-assistant`) first — public,
   MIT, largest plan-altering potential (Increment 3 may
   fundamentally re-shape), least-known of the three. Also
   adoption-eligible, so research can surface concrete adoption
   targets.
2. **`oak-curriculum-ontology`** second — public, dual MIT/OGL,
   moved up from third because the moderation service became
   reference-only (private) and the ontology's adoption-eligible
   status plus its overlap with Increment 1's vocabulary makes it
   the higher-leverage second target. Extends the existing
   `oak-ontology-graph-opportunities.strategy.md` rather than
   starting fresh.
3. **`oak-ai-moderation-service`** third — reference-only
   (private). Lower priority because adoption is not on the table;
   research surfaces patterns that this repo's own moderation
   layer (if any) can mirror, but the payoff per session is
   smaller than the two adoption-eligible repos.

Adjacent: if the owner wishes to surface `aila-atomic-concepts`
(private, prerequisite-derivation work) into this repo's planning,
it slots between Aila and the curriculum ontology in the order; it
is reference-only by visibility but is the closest content match
to Increment 1's PrerequisiteGraph.

---

## Acknowledgement Mechanism (Phase 3 outline)

For any code, prompt, ontology fragment, or moderation pattern
adopted from one of these repos, attribution must accompany the
adoption. Sketch:

- **Per-file attribution**: the destination file carries a header
  comment naming the source repo, the source path, the source
  license, and the date of adoption.
- **Repo-level NOTICE**: a NOTICE / ATTRIBUTION file at the repo
  root (or under `docs/`) lists every adopted source with the same
  metadata.
- **Repo-level acknowledgement in README**: the project README
  acknowledges Oak National Academy as the source of any adopted
  content from these three repos (per the curriculum ontology's
  attribution requirement).
- **Per-license requirements**: MIT requires the copyright +
  permission notice; ISC the same; OGL the "Contains public sector
  information licensed under the Open Government Licence v3.0."
  string. The acknowledgement mechanism handles each.

This sketch is owner-reviewable at promotion. Implementation lives
in the first per-repo execution plan that adopts material.

---

## How This Plan Differs From Existing Surfaces

- **`oak-ontology-graph-opportunities.strategy.md`** (already in
  `knowledge-graph-integration/`): focuses on the curriculum
  ontology specifically and on graph integration. This plan is
  cross-repo and is impact-mapping, not adoption-strategising.
  Sibling, not superseding.
- **`sector-engagement/external-knowledge-sources/`**: scope is
  third-party knowledge sources Oak consumes. The three repos here
  are Oak-internal; different concern, different home.
- **`sector-engagement/knowledge-graph-adoption/`**: scope is
  *external organisations using Oak's KG assets* — the inverse of
  this plan's direction. Sibling.

---

## References

- **Locally-checked-out copies** (license inspection only; not
  adoption sources):
  - `oak-curriculum-ontology` — `oaknational/oak-curriculum-ontology`
    on GitHub.
  - `oak-ai-moderation-service` — `oaknational/oak-ai-moderation-service`
    on GitHub.
- **Aila** — Oak's prompts repository (GitHub URL to be confirmed
  at Phase 0).
- **Adoption rule statement**: owner direction 2026-05-01 (this
  session).
- Existing strategy: `knowledge-graph-integration/oak-ontology-graph-opportunities.strategy.md`.
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/practice-core/decision-records/PDR-032-reference-tier-as-curated-library.md`
    (relevant to how reference material is curated and promoted).

---

## Future Per-Repo Plans (Stubs)

Each of these will be authored from this brief when its turn comes
in the promotion order:

- `external-oak-references/current/aila-deep-research.plan.md` —
  to be authored.
- `external-oak-references/current/oak-ai-moderation-service-deep-research.plan.md` —
  to be authored.
- `external-oak-references/current/oak-curriculum-ontology-deep-research.plan.md` —
  to be authored (extends the existing strategy doc rather than
  duplicating it).

---

## Owner Decisions — 2026-05-01

The five questions originally posed were resolved by owner direction
on 2026-05-01:

1. **License rule**: permissive-with-attribution is fine (not strictly MIT).
2. **Per-repo order**: agent decides. Chosen order: Aila → curriculum
   ontology → moderation service. Reasoning: moderation service is
   private (reference-only), so adoption-eligible repos take
   priority; Aila has highest plan-altering potential.
3. **Light scan to gate Increment 1**: complete; no blocking findings.
   Recommendation is to promote Increment 1 and let ontology-alignment
   feed forward as a post-`pnpm sdk-codegen` decision.
4. **Acknowledgement mechanism**: approved as sketched (per-file
   header + repo-level NOTICE + README acknowledgement of Oak
   National Academy).
5. **Thread home**: this work moves to a new thread *Connecting Oak
   Resources*, which contains both internal Oak knowledge-graph
   work and external Oak references. The previously-named
   *Exploring Open Education Resources* thread is the new home for
   the external (third-party) knowledge-source work that was under
   `sector-engagement/external-knowledge-sources/`.
