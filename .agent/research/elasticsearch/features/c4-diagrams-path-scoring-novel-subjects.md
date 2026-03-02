# Path scoring rubric (for graph-generated learning journeys)

Goal:
Score candidate learning paths (concept → content sequences) so you can pick and present
the “best” pathways for a derived subject (e.g., Climate Change) under constraints
(key stage, tier, exam board, time budget, etc.).

This rubric is designed to be:

- explainable (you can show “why this path”)
- tunable (weights per audience/use-case)
- compatible with Elastic+Neo4j (uses signals from both)

---

## Quick evaluation rubric (summary view)

Use this as a fast checklist before diving into weights:

- Coverage: does the path cover core concepts?
- Ordering: are prerequisites respected?
- Coherence: do adjacent steps connect semantically?
- Progression fit: is it appropriate for the requested key stage?
- Content quality: are there strong TEACHES edges and search relevance?
- Diversity: does it span subjects without chaotic switching?
- Penalties: length, redundancy, gaps, and constraint risk are controlled.

## 1) Definitions

A **Path** is an ordered list of **Steps**.

A **Step** contains:

- 0..N concepts (what the step teaches)
- 1 primary content item (Lesson or Unit), optionally supplements
- evidence links (highlights, graph edges, snippets)

Notation:

- Path P has steps s1..sN
- Each step si points to content item ci
- Each content item ci is connected to concepts via TEACHES edges (Neo4j) with confidence
- Each content item may have Elastic scores/snippets for relevant queries

---

## 2) Scoring overview

We compute:

1. **StepScore(si)** for each step
2. **PathScore(P)** aggregated across steps + global penalties/bonuses

High-level:

PathScore(P) =
w_cov \* Coverage(P)

- w_ord \* Ordering(P)
- w_coh \* Coherence(P)
- w_prog \* ProgressionFit(P)
- w_qual \* ContentQuality(P)
- w_div \* Diversity(P)

* w_len \* LengthPenalty(P)
* w_red \* RedundancyPenalty(P)
* w_gap \* ConceptGapPenalty(P)
* w_risk \* ConstraintRiskPenalty(P)

Weights are tuned by audience (see section 7).

---

## 3) Core scoring dimensions (what “good” means)

### 3.1 Coverage(P) — does the path cover the derived subject?

Measures how well the path hits the derived subject’s concept set, weighted by importance.

Let DS be the derived subject concept set:

- DS concepts have weights (foundation/core/extension) and numeric weights (0..1)

Compute:

- For each DS concept d:
  - covered(d) = max TEACHES confidence over steps that include d
- Coverage(P) = sum_d ( weight(d) \* covered(d) ) / sum_d weight(d)

Notes:

- Use max-per-concept to avoid double-counting.
- You can require minimum coverage thresholds:
  - e.g. core coverage >= 0.7 before considering the path.

### 3.2 Ordering(P) — are prerequisites respected?

Rewards paths whose concept order aligns with PREREQ_OF edges.

Compute:

- For each adjacent step (si, si+1), examine concept sets Ci and Cj
- Count satisfied prerequisite relations:
  satisfied = number of edges (c in Ci) -[:PREREQ_OF]-> (c' in Cj)
- Count violated relations:
  violated = number of edges (c' in Cj) -[:PREREQ_OF]-> (c in Ci)

Ordering(P) = normalize( satisfied - alpha \* violated )

Where:

- alpha > 1 (violations should hurt more than satisfaction helps)
- normalize scales into 0..1 across candidates

Explainability:

- “Step 2 comes before Step 3 because ‘Energy balance’ is a prerequisite for
  ‘Greenhouse effect’.”

### 3.3 Coherence(P) — does each step connect to the next?

Measures whether consecutive steps are “about adjacent ideas” rather than random jumps.

Signals:

- RELATED_TO weights between concepts across adjacent steps
- Semantic similarity between step content embeddings (Elastic vectors)
- Overlap in key terms / curriculum tags

Example:
Coherence(P) =
mean over i of (
0.5 \* GraphRelatedness(Ci, Cj)

- 0.5 \* EmbeddingSimilarity(ci, cj)
  )

GraphRelatedness could be:

- average RELATED_TO weight for concept pairs across steps (c in Ci, c' in Cj)
- or 1 / (shortestPathDistance+1) between key concepts

### 3.4 ProgressionFit(P) — is it age/KS appropriate?

Rewards paths aligned to the target key stage and avoids “too advanced too early”.

Signals:

- content.keyStage matches constraint
- concept “difficulty” proxy (inferred from where it appears in curriculum)
- prerequisite distance from typical KS progression

Compute a penalty if:

- content KS mismatches (hard exclusion or strong penalty)
- concept appears mainly in later KS and is introduced too early

ProgressionFit(P) = 1 - penalty

Implementation tip:

- Precompute a “typical KS distribution” for each concept:
  concept.ksMode, concept.ksMin, concept.ksMax, etc.

### 3.5 ContentQuality(P) — are steps backed by strong content?

Not all lessons/units are equally good fits even if concept links exist.

Signals:

- TEACHES confidence (Neo4j)
- Elastic relevance scores to the derived subject’s query bundle
- availability/completeness flags (has video? has quiz? has worksheet?)
- editorial rating if available

Step content quality:
Quality(ci) =
0.6 \* maxConceptTeachConfidence(ci)

- 0.4 \* normalizedElasticRelevance(ci)

ContentQuality(P) = mean_i Quality(ci)

Explainability:

- “This lesson is included because it strongly teaches ‘Carbon cycle’ (0.92) and
  matches the subject search intent.”

### 3.6 Diversity(P) — does it span subjects without being chaotic?

For derived subjects, a path should bridge disciplines, but not switch every step.

Diversity is a balance:

- Reward: inclusion of multiple subjects in meaningful blocks
- Penalize: excessive subject switching step-to-step

Compute:

- subjectSet = unique subjects in path
- switchCount = number of times subject changes between adjacent steps

Diversity(P) =
beta \* normalize(|subjectSet|)

- gamma \* normalize(switchCount)

Typical:

- for “Climate Change” you want subjectSet >= 3 (e.g. science + geography + economics)
- but you don’t want switchCount nearly equal to N

Explainability:

- “This pathway includes geography and economics after core science foundations.”

---

## 4) Penalties (what makes a path “bad”)

### 4.1 LengthPenalty(P)

Penalize paths that are too long for the context (time budget or attention).

Two approaches:

- Soft: penalty increases after N steps
- Hard: disqualify if N exceeds maxSteps

Example:
LengthPenalty(P) = max(0, (N - targetN) / targetN )

### 4.2 RedundancyPenalty(P)

Penalize repeating the same concepts too often without adding new ones.

Compute:

- redundancy = sum over concepts of max(0, countAppearances(c) - 1)
  RedundancyPenalty = normalize(redundancy)

### 4.3 ConceptGapPenalty(P)

Penalize when important derived subject concepts are not covered.

ConceptGapPenalty(P) = 1 - Coverage(P) (or separate core gaps only)

### 4.4 ConstraintRiskPenalty(P)

Penalize including content that “almost matches” constraints but may mislead:

Examples:

- GCSE lesson without specified tier when user requested Higher
- content tagged incorrectly or weak confidence edges
- content with missing key stage

ConstraintRiskPenalty(P) =
mean_i risk(ci)
where risk(ci) increases if:

- keyStage missing
- TEACHES edges below threshold
- examBoard/tier ambiguous under a strict request

---

## 5) Constructing candidate paths (so scoring is meaningful)

You need a generator that proposes multiple plausible paths:

Strategy A: Graph-first

- Start from derived subject concept set
- Expand prerequisites for core concepts
- Topologically sort a DAG approximation
- Pick best content per “concept cluster” step

Strategy B: Content-first

- Use Elastic to retrieve candidate content for each concept
- Build a bipartite graph (Concept ↔ Content)
- Select sequence that maximizes coverage + ordering + coherence

Strategy C: Hybrid beam search (recommended)

- Stepwise build path with a beam:
  - each partial path expands by adding next concept block + best content
  - scoring used as heuristic during search
- Enables constraints and diversity balancing naturally

---

## 6) Practical default weights (starting point)

For a derived subject pathway for teachers (planning):

w_cov = 0.25 (coverage matters most)
w_ord = 0.20 (prereqs respected)
w_coh = 0.15 (adjacent coherence)
w_prog = 0.15 (KS appropriateness)
w_qual = 0.15 (content fit quality)
w_div = 0.10 (cross-disciplinary balance)

Penalties:
w_len = 0.10
w_red = 0.10
w_gap = 0.25 (or just use 1 - Coverage)
w_risk = 0.20

Notes:

- Some weights overlap; keep the model simple first.
- Tune based on observed user satisfaction and editorial feedback.

---

## 7) Weight profiles by audience

### Students (guided learning)

- Increase coherence and progression fit
- Decrease diversity (too many subject jumps is confusing)

Example profile:
w_cov 0.25, w_ord 0.20, w_coh 0.20, w_prog 0.20, w_qual 0.10, w_div 0.05

### Teachers (planning)

- Balance coherence with diversity
- Ensure explainability and coverage

Example profile:
w_cov 0.25, w_ord 0.20, w_coh 0.15, w_prog 0.15, w_qual 0.15, w_div 0.10

### Curriculum designers (authoring)

- Increase diversity and coverage
- Tolerate longer paths
- Higher penalty for gaps in core concepts

Example profile:
w_cov 0.30, w_ord 0.15, w_coh 0.10, w_prog 0.10, w_qual 0.10, w_div 0.25
and higher w_gap

### MCP / AI assistant tool outputs

- Increase constraint risk penalty
- Favor conservative, well-supported edges (confidence)

Example profile:
w_risk high, require TEACHES confidence >= threshold, and stricter filters

---

## 8) Explainability template (what to show users)

For a chosen path P:

- “This pathway is ordered to respect prerequisites.”
- For each step:
  - teaches concepts: top 3 with confidence
  - why now: prereq link from previous step (if exists)
  - evidence: 1–2 highlight snippets from ES
  - constraint fit: KS/board/tier match badges

This turns a black-box score into a transparent story.

---

## 9) Minimal implementation checklist

- Precompute or cache:
  - concept → typical key stage distribution
  - concept relatedness (RELATED_TO) weights
- Store on TEACHES edges:
  - confidence, method, pipelineVersion
- During scoring:
  - normalize ES scores and graph scores within the candidate set
  - keep weights configurable per client/audience
- Add guardrails:
  - enforce hard constraints when required (KS strict, exam board strict)
  - set minimum confidence for inferred edges in “safe mode”
