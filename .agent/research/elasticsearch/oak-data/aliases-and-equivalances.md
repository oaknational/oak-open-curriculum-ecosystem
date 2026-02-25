# Curriculum Search Mining + Sense-Gated Expansion for Elastic (Serverless)  

_A practical guide for Oak bulk metadata + transcripts → bucketed synonym/relationship assets → TypeScript SDK integration_

> **Audience:** Engineers building a search SDK (TypeScript) over Elastic Serverless using hybrid retrieval (BM25 + ELSER) with filters, and a benchmark harness.  
> **Goal:** Improve retrieval for **domain language** and **domain relationships** (sense-dependent meaning), without polluting relevance via over-broad “synonyms”.

---

## 0) Overview (read this first)

### The core idea

You already have hybrid retrieval:

- BM25 and ELSER over metadata
- BM25 and ELSER over transcripts when present
- RRF combining them

That means _general semantic synonymy is largely solved by ELSER_. The remaining hard problems are:

- **Aliases & surface forms:** abbreviations, exam-board shorthand, hyphenation, symbol ↔ phrase, etc.
- **Sense-bound meaning:** “nutrition” means different things in different subjects/phases/contexts.
- **Domain relationships (not synonyms):** “nutrition” ↔ “macronutrients” ↔ “portion size” (helpful adjacency, not equivalence).

So the winning approach is:

1) **Mine per subject-phase** (sense) assets offline  
2) **Apply them with guardrails** online (filters → sense gating; query-time expansion → weak boosts)

### Two-part architecture

1) **Mining (offline):** process bulk JSON (per subject-phase) → emit small artifacts  
2) **Serving (online):** TypeScript SDK chooses which artifacts to apply based on filters + query shape

### Why bucketed “relationships” matter

If you treat relationships as synonyms, you _will_ harm precision. Instead, split into buckets and apply them differently:

| Bucket | Meaning | How to apply | Risk |
|---|---|---|---|
| **A. Alias / surface forms** | truly equivalent strings | strict synonym sets / normalization | Low |
| **B. Pedagogy paraphrase** | “way teachers say it” | query-time weak expansion | Medium |
| **C. Sense-bound meaning** | same token, different sense | **only** expand when sense known | High (if ungated) |
| **D. Related-term adjacency** | conceptual neighbors | query-time weak expansion | Medium |

---

## 1) Official Elastic building blocks you’ll use (with links)

### 1.1 `synonym_graph` token filter (multi-word correctness)

Use this rather than `synonym` for phrase synonyms; it produces a graph token stream that handles multiword synonyms correctly.  
Docs: <https://www.elastic.co/docs/reference/text-analysis/analysis-synonym-graph-tokenfilter>

Related concept (token graphs): <https://www.elastic.co/docs/manage-data/data-store/text-analysis/token-graphs>

> **Rule of thumb:** use `synonym_graph` primarily at **search-time** for phrase-safe expansions.

### 1.2 Synonyms API (Synonym Sets)

Use synonym sets so you can update synonym rules without editing files on nodes.  
API docs:

- Create/update synonym set: <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-synonyms-put-synonym>
- Get synonym set: <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-synonyms-get-synonym>  
Note: sets are limited to **10,000 rules per set** (so shard sets by subject-phase if needed).

### 1.3 Retriever framework + RRF

Elastic retrievers let you compose multiple first-stage retrievers and fuse them with Reciprocal Rank Fusion.  
Docs:

- Retrievers overview: <https://www.elastic.co/docs/solutions/search/retrievers-overview>
- RRF retriever: <https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever>

### 1.4 Analyze API (for testing analyzers & synonym behavior)

Use this to debug analysis chains and confirm synonym behavior.  
Docs: <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-analyze>

---

## 2) Why mining is best in Python (even if serving is TypeScript)

### 2.1 Python wins on iteration speed + NLP ecosystem

You can implement basic string mining in TS, but the moment you need:

- phrase extraction beyond naive n-grams
- lemmatisation / token normalization
- definitional pattern mining
- clustering / scoring / filtering

…Python is simply faster to build and tune.

### 2.2 You don’t need a DB (even for huge files)

A DB is useful for interactive analytics and joins across huge corpora, but you can avoid it if you:

- process **one subject-phase** file at a time
- stream parse lesson-by-lesson (for very large files like maths-secondary)
- update in-memory counters/graphs
- write compact artifacts

This aligns perfectly with your data partitioning: each file is already a “sense” bucket.

### 2.3 Bonus: streaming is necessary anyway

Even if most files fit in memory, maths-secondary may not. Designing streaming-first prevents “special-case mode” later.

---

## 3) Mining outputs (what you will generate)

You want small, reviewable, versioned artifacts, per sense (subject-phase).

### 3.1 Artifact: `aliases.<sense>.json` (Bucket A: strict equivalences)

Contains only **high-confidence equivalences**:

- abbreviations ↔ expansions
- hyphenation/spacing variants
- stable symbol ↔ phrase mappings (maths heavy)
- exam-board shorthand if it’s truly equivalent

Example:

```json
{
  "sense": "maths-secondary",
  "equiv": [
    ["hcf", "highest common factor"],
    ["lcm", "lowest common multiple"]
  ],
  "variants": [
    ["co-ordinate", "coordinate"],
    ["fronted adverbial", "fronted-adverbial"]
  ]
}
```

**Do**

- keep it conservative
- prefer pattern-evidence (e.g., “X (Y)”)

**Do not**

- put conceptual neighbors here (nutrition ↔ calories, ratio ↔ proportion, etc.)
- make sense-ungated global equivalences

### 3.2 Artifact: `vocab.<sense>.json` (phrase dictionary)

Used by the TypeScript SDK to detect key phrases in queries.

Example:

```json
{
  "sense": "art-primary",
  "phrases": [
    {"t":"visual hierarchy","df":114},
    {"t":"typeface","df":88},
    {"t":"composition","df":132}
  ]
}
```

### 3.3 Artifact: `related.<sense>.json` (Bucket D: adjacency graph)

Term → top-K related terms with weights.
These are **expansion candidates**, not synonyms.

Example:

```json
{
  "sense": "dt-food-secondary",
  "related": {
    "nutrition": [
      {"t":"macronutrients","w":0.42},
      {"t":"portion size","w":0.29},
      {"t":"calories","w":0.27}
    ]
  }
}
```

### 3.4 Optional artifact: `sense-hints.json` (fallback classification)

If filters are absent, you can infer sense from query text (lightweight TF-IDF classifier).  
This should be conservative and used only when necessary.

---

## 4) Mining: how to do it (and what NOT to do)

### 4.1 Step 1 — Normalize the raw data

Your bulk files have structural variances and null/“NULL” edge cases. Normalize early.

**Do**

- treat missing keys, `null`, and `"NULL"` as null-equivalent
- canonicalize whitespace, punctuation, hyphenation
- preserve diacritics for MFL content; normalize apostrophes carefully

**Don’t**

- drop diacritics in French/Spanish etc. unless you intentionally do diacritic-folding at index time
- merge all subjects into one pot before mining: you’ll destroy sense boundaries

### 4.2 Step 2 — Extract “analysis records” per lesson

Create a stable internal record with:

- lesson title, unit title (when available)
- keywords (+ descriptions)
- outcomes / learning points
- misconceptions / teacher tips
- transcript sentences (if present)

**Do**

- keep fields labelled (so you can weight evidence: title > keywords > transcript)
- store short context snippets for review/debugging

### 4.3 Step 3 — Mine Bucket A (aliases): pattern-first

High-confidence signals:

- `Long form (ABBR)` and `ABBR (Long form)`
- `ABBR = Long form`
- consistent “title uses X, transcript uses Y” with strong evidence and low ambiguity

**Example (good)**

- “HCF (Highest Common Factor)” → `hcf, highest common factor`

**Example (bad)**

- “nutrition” co-occurs with “calories” → **NOT** a synonym

**Why “co-occurrence ⇒ synonym” is dangerous**
Co-occurrence mostly finds _relatedness_, not equivalence. That’s Bucket D.

### 4.4 Step 4 — Mine Bucket D (relationships): co-occurrence + definitional edges

You want neighbors that help discovery without overriding intent.

Good evidence signals:

- repeated co-occurrence within lesson/unit
- definitional patterns:
  - “X is…”
  - “X means…”
  - “X is a type of…”

**Do**

- keep only top-K neighbors per term
- prefer doc-frequency (across lessons) over raw frequency (within a single transcript)

**Don’t**

- let this bleed across subject-phase without explicit control

### 4.5 Step 5 — Validate with your benchmark harness

Turn bucket application on/off as feature flags:

- baseline
- +aliases only
- +aliases + related (sense-gated)
- etc.

Measure:

- recall@k improvements
- “precision regressions” list (where top results got worse)
- expansion-induced drift (query meaning shift)

---

## 5) Serving: applying mined assets in Elastic via your TypeScript SDK

### 5.1 Sense resolution (filters are the source of truth)

Input to SDK: free text + filters.

**Do**

- when subject/phase filters are present: treat that as the sense
- only use sense-hints/classifier when filters are absent

**Don’t**

- apply subject-specific expansions without a sense gate

### 5.2 Apply Bucket A via synonym sets (`synonym_graph`)

Implementation approach:

- one global synonym set: `syn_edu_general`
- per sense sets: `syn_<subject>_<phase>`

Operational details:

- use Synonyms API to upload/update sets  
  <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-synonyms-put-synonym>

**Do**

- shard synonym sets by sense to prevent cross-domain pollution
- keep strict synonym rules conservative

**Don’t**

- create a single massive global synonym set for everything

### 5.3 Apply Buckets B/C/D as query-time expansion (not strict synonyms)

Mechanics:

1) detect phrases in query using `vocab.<sense>.json`
2) fetch related terms from `related.<sense>.json`
3) add expansions as weak “should” clauses (lower boosts than original terms)
4) keep expansions bounded by filters

**Do**

- cap expansions (e.g. top 5–20 terms total)
- apply only when sense known / confidence high
- ensure original query terms dominate scoring

**Don’t**

- add expansions as mandatory “must” clauses
- add expansions with equal boost to original intent

### 5.4 Your 4 retrievers + RRF: keep the shape, refine the orchestration

You already have:

- BM25(metadata)
- ELSER(metadata)
- BM25(transcripts)
- ELSER(transcripts)

And a conditional path when transcripts are absent. That’s fine.

To simplify maintenance:

- keep one retriever plan
- transcript retrievers only run under `has_transcript:true` (if you model it as a filter), or you branch in code but keep the plan shape consistent

Then fuse with RRF:

- docs: <https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever>

**Do**

- tune weights / window sizes if you observe systematic dominance
- tie changes back to harness results

**Don’t**

- rely on “synonyms” to compensate for poor retriever blending

---

## 6) Elastic pitfalls: what to do and what not to do

### 6.1 Pitfall: synonym explosions

Synonyms can multiply tokens and degrade performance/relevance.

**Do**

- keep strict synonyms minimal (Bucket A only)
- prefer query-time expansions for relationships

**Don’t**

- stuff thousands of related terms into synonym sets

Use the Analyze API to see token expansion:
<https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-analyze>

### 6.2 Pitfall: multiword synonym bugs

If you use the wrong synonym filter, phrase handling breaks.

**Do**

- use `synonym_graph` for multiword synonyms  
  <https://www.elastic.co/docs/reference/text-analysis/analysis-synonym-graph-tokenfilter>

### 6.3 Pitfall: cross-sense pollution

Global synonyms for sense-bound terms will create regressions.

**Do**

- partition synonym sets by subject-phase
- apply only when sense is known (filters)

**Don’t**

- share “nutrition” expansions between Food Tech, PE, Biology, PSHE, etc. without a gate

---

## 7) Progressive rollout strategy (pragmatic and benchmark-friendly)

### Phase 1 — Strict aliases only (Bucket A)

- upload synonym sets per sense
- deploy behind a feature flag
- measure improvements and regressions

### Phase 2 — Related-term expansion (Bucket D)

- only when filters specify sense
- weak boost expansions
- cap top-K

### Phase 3 — Optional sense inference (if needed)

- only for unfiltered queries
- conservative: prefer “do nothing” over wrong expansion

---

## 8) Adding a Python workspace to a TypeScript + pnpm + Turbo monorepo

You have two parallel “workspace systems”:

- pnpm workspaces for JS/TS packages
- Python project/workspace tooling for Python code

### 8.1 Directory layout (recommended)

Keep Python mining as tooling (not a runtime dependency of apps):

```text
repo/
  apps/
  packages/
  tools/
    search-mining/          # Python
      pyproject.toml
      src/...
      scripts/...
      README.md
      package.json          # thin wrapper so Turbo can run tasks
  turbo.json
  pnpm-workspace.yaml
```

### 8.2 Why you still add a `package.json` under the Python tool

Turborepo’s task graph is driven by JS workspace packages. You can still run tasks for non-JS projects by:

- putting them inside the repo
- ensuring Turbo can “see” them as a workspace member with a `package.json` + scripts

This is a known pattern: Turbo can include non-JS projects if they’re part of the workspace and expose scripts via `package.json`.  
(See discussion guidance: include it in workspaces + add a package.json with name/scripts.)

Turborepo structuring reference:
<https://turborepo.com/docs/crafting-your-repository/structuring-a-repository>

### 8.3 Python project tooling recommendation: `uv` workspaces

As of 2025–2026, `uv` provides fast environment management and supports **Python workspaces** (monorepo-style) natively.  
Docs: <https://docs.astral.sh/uv/concepts/projects/workspaces/>

**Minimal approach (single Python package under tools/)**

- `tools/search-mining/pyproject.toml` defines dependencies (spaCy, etc.)
- run via `uv run ...` in CI and locally

**Monorepo-style Python workspaces (if you later split into multiple Python packages)**

- root `pyproject.toml` becomes workspace root
- `tools/search-mining` becomes a member

`uv` workspace concept and member management:
<https://docs.astral.sh/uv/concepts/projects/workspaces/>

### 8.4 Wiring Python tasks into Turbo

Create `tools/search-mining/package.json`:

```json
{
  "name": "@tools/search-mining",
  "private": true,
  "scripts": {
    "mine": "uv run python -m mining.run --in ./data --out ./out",
    "lint": "uv run ruff check .",
    "format": "uv run ruff format .",
    "test": "uv run pytest -q"
  }
}
```

Then in `turbo.json`, add pipeline tasks:

```json
{
  "pipeline": {
    "mine": {
      "outputs": ["tools/search-mining/out/**"],
      "cache": true
    },
    "lint": { "cache": true },
    "test": { "cache": true }
  }
}
```

**Do**

- declare outputs so Turbo can cache mining artifacts
- keep artifacts in a stable folder (`out/`) with deterministic filenames

**Don’t**

- mix generated artifacts into source folders with unstable paths

### 8.5 Keeping JS/TS and Python dependency management clean

- pnpm manages JS/TS dependencies as normal
- Python dependencies are managed by `uv` inside the Python tool directory (or workspace root)
- avoid trying to “make pnpm install Python deps” — just make pnpm scripts call `uv`

---

## 9) “What to do next” checklist

### Mining

- [ ] Implement streaming loader for subject-phase JSON (handles large maths-secondary)
- [ ] Build normalization layer (null/“NULL”, whitespace, punctuation)
- [ ] Emit `aliases.<sense>.json`, `vocab.<sense>.json`, `related.<sense>.json`
- [ ] Add lightweight review tooling (print top candidates + contexts)

### Elastic integration

- [ ] Upload strict synonyms via Synonyms API (sharded by sense)  
      <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-synonyms-put-synonym>
- [ ] Ensure analyzers use `synonym_graph` for multiword synonym correctness  
      <https://www.elastic.co/docs/reference/text-analysis/analysis-synonym-graph-tokenfilter>
- [ ] Use Analyze API to validate tokenization and synonym behavior  
      <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-analyze>
- [ ] Apply related-term expansions only at query-time and only when sense is known
- [ ] Measure everything with your harness, bucket-by-bucket

### Monorepo

- [ ] Add `tools/search-mining/` Python package with `pyproject.toml`
- [ ] Add thin `package.json` wrapper for Turbo tasks
- [ ] Add `mine` task with declared outputs for caching
- [ ] Document how to run locally (`pnpm turbo run mine`)

---

## Appendix A: Quick “Do / Don’t” reference

### Synonyms

✅ Do: strict equivalences (ABBR ↔ expansion, spelling variants)  
❌ Don’t: conceptual neighbors as synonyms

### Sense gating

✅ Do: apply sense assets only when filters specify subject-phase  
❌ Don’t: global expansions for sense-bound terms

### Relationship expansion

✅ Do: query-time weak “should” expansions with caps  
❌ Don’t: treat relationships as equivalence or “must” clauses

### Tooling

✅ Do: Python for mining, TypeScript for serving  
❌ Don’t: make the online system depend on heavyweight NLP

---

## Appendix B: Useful Elastic docs index (start here)

- Retrievers overview: <https://www.elastic.co/docs/solutions/search/retrievers-overview>
- RRF retriever: <https://www.elastic.co/docs/reference/elasticsearch/rest-apis/retrievers/rrf-retriever>
- synonym_graph token filter: <https://www.elastic.co/docs/reference/text-analysis/analysis-synonym-graph-tokenfilter>
- Token graphs (synonyms): <https://www.elastic.co/docs/manage-data/data-store/text-analysis/token-graphs>
- Synonyms API (create/update): <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-synonyms-put-synonym>
- Analyze API: <https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-indices-analyze>

---

## Appendix C: Subject-specific complexity

### Maths secondary — the most complex subject

Maths secondary has dramatically more vocabulary complexity than other subjects:

| Aspect | Maths | Typical Subject |
|--------|-------|-----------------|
| Synonym file size | 375 lines | 30-180 lines |
| Concepts per domain | 30+ | 10-20 |
| Notation variants | High | Low |

**Key challenges**:

- **Notation variance**: "y = mx + c" vs "y equals mx plus c" vs "gradient intercept form"
- **Spoken vs written**: "sohcahtoa" vs "sine cosine tangent" vs "opposite adjacent hypotenuse"
- **Cross-topic relationships**: Algebra concepts appear in geometry, graphs, and statistics
- **Level-dependent vocabulary**: KS3 "solve equations" vs KS4 "simultaneous equations"

**Diagnostic queries** (from `diagnostic-synonym-queries.ts`) reveal that phrase synonyms like "straight line" → "linear" need special handling because ES synonym filters apply after tokenisation.

### Science secondary — underdeveloped

Science synonyms (37 lines) are significantly underdeveloped compared to maths:

| Gap | Example |
|-----|---------|
| Physics vocabulary | Newton's laws, forces, energy transfer |
| Chemistry vocabulary | Equations, reactions, periodic table |
| Biology vocabulary | Cells, genetics, ecosystems |
| Practical terminology | Apparatus, method, variables |

**KS4 complexity**: Science has three exam board variants (AQA, Edexcel, OCR), each with different terminology emphasis.

**Recommendation**: Expand science synonyms following the maths pattern, with sub-domain organisation (physics, chemistry, biology).

---

## Appendix D: Future direction

> **Note**: Static vocabulary analysis (mining) will eventually move **upstream** to the bulk-data generation pipeline (i.e., where Oak's curriculum data is assembled), rather than being part of sdk-codegen. This keeps vocabulary extraction close to the source data.

The current TypeScript synonym files in `packages/sdks/oak-curriculum-sdk/src/mcp/synonyms/` are manually curated. Future mining outputs would supplement (not replace) this corpus.

---

## Related Documents

| Document | Relationship |
|----------|--------------|
| [README.md](./README.md) | Index and reading order |
| [handling-existing-synonymish-things.md](./handling-existing-synonymish-things.md) | Managing existing synonym corpus |
| [data-and-domain-vocabulary.md](./data-and-domain-vocabulary.md) | Structural vocabulary and definitions |
| [elasticsearch-approaches.md](./elasticsearch-approaches.md) | Elastic-native implementation patterns |
| [uses-of-structured-domain-knowledge.md](./uses-of-structured-domain-knowledge.md) | Survey of all vocabulary levers |
| [python-mining-workspace.md](./python-mining-workspace.md) | Mining pipeline scope and governance |
| [documentation-gap-analysis.md](./documentation-gap-analysis.md) | Gaps and remediation plan |
