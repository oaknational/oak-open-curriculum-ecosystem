# Evidence Integration Strategy: Curriculum + Pedagogical Evidence

> **Status**: future (strategic brief)
> **Date**: 10 April 2026
> **Author**: AI analysis (Claude Opus 4.6), commissioned by Jim Cresswell
> **Data reference**: `eef-toolkit.json` in this directory
>
> **Credits and attribution**:
>
> - **EEF Toolkit data**: Education Endowment Foundation
>   (<https://educationendowmentfoundation.org.uk>). Original research
>   authors: Higgins, Katsipataki, Kokotsaki, Coleman, Major, Coe.
> - **EEF MCP server prototype**: John Roberts (JR)
>   `<john.roberts@thenational.academy>`. When any aspect of this work
>   is integrated functionally into the repo, JR must be added to the
>   authors list.
> - **Oak Curriculum Ontology**: Mark Hodierne (MH)
>   `<mark@markhodierne.com>`. Primary author of the KG repo (170
>   commits). When any aspect of the KG is integrated, MH must be added
>   to the authors list.

---

## 1. Problem and Intent

Oak's MCP ecosystem answers **"what curriculum content exists?"** with
production-grade infrastructure (34 tools, semantic search at MRR 0.983,
schema-first types). But teachers also need **"how should I teach this
effectively?"** — which approaches are evidence-backed for their specific
context (subject, phase, pupil demographics, school priorities).

The EEF Teaching and Learning Toolkit provides that evidence layer: 30
research-synthesised teaching approaches with quantified impact, cost,
and evidence strength. A prototype MCP server demonstrates the concept.

The Oak Curriculum Ontology (`oak-curriculum-ontology`, v0.1.0) provides
the structural bridge: a formal W3C-compliant vocabulary
(Discipline → Strand → SubStrand → ContentDescriptor) that could anchor
the mapping between curriculum content and evidence strands.

**Intent**: Define the strategic path from three separate systems to a
unified capability — evidence-grounded curriculum discovery — and
capture the requirements that preserve the *impact* of an evidence
layer, not just its technical shape.

## 2. Three-Layer Architecture

```text
Layer 1: MCP Ecosystem (oak-mcp-ecosystem)
  Transport, tools, search, auth, deployment, quality gates
  → HOW users access the system

Layer 2: Ontology (oak-curriculum-ontology, v0.1.0)
  26 classes, 40+ OWL properties, 8 subjects, ~150K+ nodes
  Formal curriculum structure and vocabulary (RDF, OWL, SKOS, SHACL)
  Production-ready Neo4j export pipeline
  → WHAT the curriculum contains and how it's structured

Layer 3: Evidence (EEF Toolkit, future ontology extension)
  30 evidence strands, composite scoring, implementation guidance
  → WHY certain approaches work and for whom
```

Layer 1 is production-grade. Layer 2 exists and is stable. Layer 3 is
prototype-grade but conceptually proven. The integration path is:
extend Layer 2 with evidence properties, then surface through Layer 1.

## 3. What the EEF Demo Proves

The EEF MCP server prototype demonstrates that an evidence-grounded
pedagogical recommendation system can work as an MCP tool surface. Key
proven concepts:

- **Context-aware ranking** with transparent composite scoring
- **Caveats as first-class data** in every response
- **Implementation guidance** beyond "what works" to "how to do it"
- **Pedagogical workflow orchestration** via prompts
- **Responsible synthesis boundary** — pooled effects, never
  cherry-pickable individual studies

The prototype is stdio-only Python with no types, tests, auth, or
deployment envelope. The value is in the *design patterns*, not the
implementation.

## 4. Impact-Preserving Requirements

These are the requirements that ensure a production implementation
delivers the same *impact* as the prototype demonstrates, not just the
same technical features. Any implementation that omits these would
produce a technically correct but educationally weaker system.

### R1: Epistemic Honesty at the Response Level

Every recommendation or evidence citation MUST include:

- The impact estimate AND its evidence strength rating
- A caveat that the figure is a population average from research
  conditions, not a guaranteed outcome
- A note that implementation quality is the strongest moderator

**Why**: Without this, AI systems present research findings as
certainties. The EEF's own methodology exists precisely because
individual findings are unreliable — the synthesis is the product.

### R2: Transparent Scoring Methodology

The recommendation algorithm MUST expose its weighting to the user:

- Impact: 40% (normalised, months of additional progress)
- Evidence strength: 30% (quality rating 0-5)
- Cost-effectiveness: 20% (inverse of cost rating 1-5)
- Contextual relevance: 10% (phase match, focus match, PP relevance)

**Why**: Hidden scoring creates a black box that users cannot critique
or override. Teachers must understand *why* an approach is ranked
highly to exercise professional judgement about whether it applies to
their context.

### R3: Disadvantage Gap Priority

The scoring MUST weight Pupil Premium relevance:

- very_high: strongest contextual boost
- high: moderate boost
- moderate: small boost

The `closing_disadvantage_gap` focus MUST be a first-class query
parameter, not an afterthought filter.

**Why**: Oak's mission is explicitly "close the disadvantage gap."
The scoring system must encode this mission priority structurally.

### R4: Synthesis Boundary (No Cherry-Picking)

The system MUST serve pooled meta-analytic effects, never individual
study citations. If study-level data is ever added (EPPI roadmap), it
MUST be served as aggregate distributions for calibration (design
quality distribution, effect size IQR, % positive/negative), never as
individual study records.

**Why**: Individual studies are unreliable in isolation. The EEF's
random effects meta-analysis exists because the pooled effect is the
product. Exposing individual studies to AI generation creates
cherry-picking, sub-group overfitting, non-independent evaluation bias,
small-sample inflation, and effect size metric conflation risks.

### R5: Implementation Guidance as a First-Class Surface

Recommendations MUST be accompanied by practical implementation data:

- CPD intensity (low / moderate / high)
- Whether additional staff are needed
- Resource cost level
- Time to embed (e.g. "1-2 terms")
- Key staff roles involved
- Common pitfalls to avoid
- The EEF implementation framework stages
  (Explore → Prepare → Deliver → Sustain)

**Why**: "What works" without "how to do it" is not actionable.
Teachers need to know the investment required, not just the expected
return. A +8 month impact that requires "high CPD intensity" and
"2-6 months to embed" is a fundamentally different proposition from
one that requires "low CPD" and "1 term."

### R6: Pedagogical Workflow Orchestration

The system MUST support at least two orchestrated workflows (via
prompts or aggregated tools):

**Workflow A — Evidence-grounded lesson planning**:

1. Get context-appropriate recommendations (phase, subject, focus)
2. Select top 2-3 approaches
3. Get implementation guidance for each
4. Integrate into lesson plan with evidence summary + caveats
5. Structure pedagogically (starter → main → practice → plenary with
   metacognitive reflection)

**Workflow B — Pupil Premium strategy review**:

1. Assess current approaches against evidence
2. Find evidence-backed alternatives
3. Compare current vs recommended
4. Assess implementation quality fit

**Why**: Raw tool access without workflow guidance produces
inconsistent, shallow results. The workflows encode pedagogical
expertise about *how* to use evidence in planning.

### R7: Professional Judgement Framing

Every output MUST explicitly frame results as decision-support, not
automatic policy:

- "These are 'best bets' based on research evidence"
- "They should inform, not replace, professional judgement"
- "Implementation quality is the strongest moderator of actual impact"

**Why**: Evidence-informed teaching means teachers use evidence to
inform decisions, not that algorithms make decisions for them. This
framing is part of the product, not a disclaimer.

### R8: Partial Coverage Honesty

The system MUST be transparent about data completeness:

- Which strands have school context relevance data (17/30 currently)
- Which strands have full "behind the average" detail (6/30)
- Which strands have implementation guidance blocks (4/30)
- Where evidence is "insufficient" (null impact)

**Why**: Pretending completeness where it doesn't exist undermines
trust. Honest partial coverage is more valuable than false
comprehensiveness.

## 5. The Curriculum-Evidence Crosswalk

The highest-value integration artefact. Maps EEF's 30 evidence strands
to the ontology's curriculum content via the formal vocabulary.

### What the ontology provides

- `Discipline` → `Strand` → `SubStrand` → `ContentDescriptor`
  (conceptual anchors)
- `Programme` → `Unit` → `UnitVariant` → `Lesson`
  (structural anchors)
- `Thread` (cross-cutting progression anchors)
- 40+ OWL properties with formal inverses (bidirectional traversal)

### What the crosswalk adds

New classes and properties extending the ontology:

- `eef:EvidenceStrand` — maps to one of 30 EEF toolkit strands
- `eef:isEvidencedBy` — links ContentDescriptors/Units to evidence
- `eef:hasImpactFor` — phase-specific impact data
- `eef:hasCaveat` — first-class caveat data on every link

### What it enables

Queries that neither system can answer alone:

- "What evidence-backed approaches apply to Year 5 fractions?"
- "Which units in KS3 science have high-evidence support for
  disadvantaged pupils?"
- "What's the evidence coverage of this custom curriculum?"

### Mapping challenge

Some mappings are natural (metacognition → metacognitive strategies
in specific lessons). Others require expert pedagogical judgement
(collaborative learning → which specific curriculum content areas?).
The crosswalk quality determines the integration value.

## 6. Integration Levels

Levels 1-3 use the EEF JSON data directly with bulk-data
phase/subject matching. They do **not** depend on the KG alignment
audit or the formal ontology and can proceed independently.

Levels 4/4b require the formal ontology and depend on the KG
alignment audit (`knowledge-graph-integration/current/kg-alignment-audit.execution.plan.md`)
to establish join keys and overlap measurement.

| Level | What | Data Source | Depends On | Effort | Value |
|---|---|---|---|---|---|
| **1: Prompt composition** | Both MCP servers used simultaneously by AI client | EEF JSON | Nothing | None | Immediate concept validation |
| **2: Oak prompts reference EEF** | New prompts orchestrate calls to both servers | EEF JSON | Nothing | Low | Guided cross-server workflows |
| **3: Aggregated evidence tool** | Oak ingests EEF data, exposes through own tools with type safety | EEF JSON + bulk data (phase/subject matching) | Nothing | Moderate | Unified experience, deployed |
| **4: Ontology extension** | EEF strands as nodes in curriculum KG via formal vocabulary | Formal ontology (RDF/OWL) | KG alignment audit | Moderate-significant | Graph traversal queries |
| **4b: Neo4j-powered queries** | Extended ontology exported via existing pipeline | Neo4j (from ontology) | KG alignment audit + Level 4 | Moderate | Cypher-powered evidence queries |

**Important distinction**: the "graphs" in this repo (ADR-059's
curriculum concept map, the misconception graph, the prerequisite
graph) are simple JSON representations derived from bulk API data.
The Oak Curriculum Ontology is a formally modelled W3C-compliant
knowledge graph — a different order of thing. Levels 1-3 work with
the former. Levels 4/4b work with the latter.

## 7. EEF Data Reference

The `eef-toolkit.json` file in this directory contains the full EEF
Teaching and Learning Toolkit dataset (v0.2.0, April 2026):

- 30 evidence strands with headline metrics
- Methodology (effect size conversion table, impact/cost/evidence
  scales)
- UK context (PP rates, national averages, KS mapping)
- School context schema (input schema for recommendations)
- 17/30 strands with school context relevance mapping
- 8 caveats as structured data

This is the authoritative data reference for this plan collection.

### Data coverage

| Aspect | Coverage | Notes |
|---|---|---|
| Strand summaries | 30/30 | Complete |
| School context relevance | 17/30 | Phase, KS, priority, PP, implementation |
| Behind-the-average detail | 6/30 | Phase/subject breakdowns |
| Implementation blocks | 4/30 | CPD, staffing, time, pitfalls |
| Related guidance reports | 7/30 | Links to EEF guidance |
| Study-level EPPI data | 0/30 | Requires EEF data access |

## 8. Goals: Oak vs EEF vs Combined

### Where goals align

| Shared Goal | Oak | EEF | Combined |
|---|---|---|---|
| Support teachers | Content discovery + AI access | Evidence-grounded recommendations | Right content + right pedagogy for context |
| Close disadvantage gap | Search finds relevant content | PP-weighted recommendations | Content + evidence + PP targeting |
| Responsible AI | Structural (type safety, schema-first) | Epistemic (caveats, transparent scoring) | Both |
| MCP as interface | 34 tools for curriculum | 7 tools for evidence | Unified tool surface |
| UK education system | Curriculum (KS1-KS4) | Phases, KS, PP, Ofsted priorities | Complete mapping |

### Where goals diverge

| Dimension | Oak | EEF |
|---|---|---|
| Primary audience | Developers, AI agents, teachers | Teachers (through AI), school leaders |
| Scope | Entire curriculum (~12,700 lessons) | 30 evidence strands (curated) |
| Architecture priority | Platform correctness | Domain integrity |
| Maturity | Production (130+ ADRs, 11 gates) | Prototype (no tests, no auth) |
| Update cadence | Continuous (API → sdk-codegen) | Periodic (~2x/year living review) |

### What the combined system uniquely answers

| Question | Today | Combined |
|---|---|---|
| "Find me a Year 5 maths lesson on fractions" | Oak finds it | + evidence-backed teaching approaches for this context |
| "What works for disadvantaged KS1 readers?" | EEF recommends approaches | + Oak's KS1 reading lessons organised by evidence |
| "Plan a lesson on photosynthesis for Year 8" | Oak finds content, teacher designs pedagogy | + evidence says metacognition (+8m) and collaborative learning (+5m) with implementation guidance |
| "Review our PP strategy for primary maths" | EEF reviews against evidence | + maps to Oak's maths curriculum, identifies coverage gaps |

## 9. What Oak Can Learn from EEF's Design

1. **Caveats as first-class data** — every metric with its confidence
   signal (transferable to search results and curriculum tools)
2. **Transparent scoring** — exposed, not hidden (transferable to RRF
   retrieval strategy visibility)
3. **The synthesis boundary** — pooled effects, never cherry-pickable
   (transferable to curriculum data: validated content, not raw API)
4. **Domain-opinionated aggregated tools** — `recommend_for_context` is
   a recommendation engine, not just search (model for Oak's search
   evolution)
5. **Implementation guidance as product surface** — not just "what
   works" but CPD, staffing, time, pitfalls

## 10. Five Strategic Questions

The EEF material poses useful questions back to Oak's MCP strategy:

1. Do we want Oak's MCP value to stay primarily
   retrieval-and-structure, or also add judgement-support surfaces?
2. Where should pedagogical evidence live: prompts, resources,
   aggregated tools, MCP Apps, or a sibling server?
3. How much recommendation logic should be explicit and inspectable,
   rather than emerging implicitly from model prompting?
4. How do we preserve schema-first discipline while admitting richer
   product-level reasoning surfaces?
5. What would a genuinely teacher-helpful answer look like combining
   curriculum structure, evidence synthesis, and implementation caveats?

## 11. Dependencies and Sequencing

**Levels 1-3 are independently deliverable.** They use EEF JSON data
with bulk-data phase/subject matching. They do not require the ontology,
the KG alignment audit, or Neo4j. They can proceed on a demo branch
immediately.

**Levels 4/4b depend on the formal ontology.** They require the KG
alignment audit to establish join keys and overlap measurement before
the ontology can be safely extended with evidence properties.

| Dependency | Status | Blocks |
|---|---|---|
| Oak MCP ecosystem (Layer 1) | Production | Nothing — ready |
| EEF data (Layer 3 source) | v0.2.0, 30 strands | Nothing — data file available |
| Oak Curriculum Ontology (Layer 2) | v0.1.0, stable core | Level 4 only |
| KG alignment audit | Active, Phase 0 pending | Level 4 only |
| EPPI study-level data | Not yet accessible | Layer B calibration (R4) |
| Curriculum crosswalk mapping | Not started | Level 4 (highest-value artefact) |

## 12. Success Signals (Promotion Triggers)

**Levels 1-3** should be promoted to `current/` now — they are
independently valuable, demonstrate the composition concept, and
can ship on a demo branch without waiting for any KG work.

**Levels 4/4b** should be promoted when:

1. The KG alignment audit completes and establishes join keys
2. OR the EEF project reaches v0.5 (curriculum crosswalk readiness)

## 13. Risks and Unknowns

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Crosswalk mapping quality requires pedagogical expertise Oak may not have | Medium | High | Partner with EEF or curriculum specialists |
| EEF data update cadence (~2x/year) creates staleness | Low | Medium | Automated refresh pipeline at Level 3 |
| 17/30 strand coverage means some recommendations lack context | Known | Medium | R8 (partial coverage honesty) |
| EPPI data access may not materialise | Medium | Low | R4 works without EPPI — current synthesis is sufficient |
| Ontology extension could create maintenance burden | Low | Medium | Generated mappings where possible; manual only for expert judgement |

## 14. Non-Goals

- Replacing the EEF website or duplicating their full digital presence
- Building a general-purpose evidence synthesis platform
- Exposing individual study records (R4 explicitly forbids this)
- Automating pedagogical decisions (R7 — decision-support only)
- Full OWL/RDF alignment before the crosswalk proves value
