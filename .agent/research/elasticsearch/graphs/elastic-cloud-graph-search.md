
# Elastic Cloud Graph and Relationship Search Capabilities (Graph + “Graph-adjacent” features)

This document focuses **strictly on Elastic’s ecosystem**: Elastic Cloud, Elasticsearch, and Kibana. It explains Elastic’s **official** graph functionality (Graph UI + Graph Explore API) and the **graph-adjacent** features that help you connect entities and concepts for search: entity-centric indexing with Transforms, co-occurrence discovery with significance-based aggregations, and relationship modeling patterns (nested, parent/child).

> Dataset context: the Oak National Academy OAKS API (subjects, key stages, units, lessons, etc.) can be modeled as a concept-rich corpus where “implicit relationships” (concept co-occurrence, curricular proximity, topical overlap) are valuable for discovery and navigation.

---

## 1) What “Graph” means in Elastic Cloud

Elastic’s Graph features are **graph exploration on top of an Elasticsearch index**, not a separate graph database. Graph finds relationships between **indexed terms** (vertices) based on **co-occurrence in documents** (edges), with relevance and significance scoring to prioritize meaningful connections.

- Overview of Graph analytics features (Kibana UI + Graph Explore API):  
  [Graph (Elastic Docs)](https://www.elastic.co/docs/explore-analyze/visualize/graph)

Elastic also publishes a product-oriented overview emphasizing Graph as an API- and UI-driven tool for surfacing relevant relationships while leveraging Elasticsearch’s distributed execution and indexing at scale:

- Product page:  
  [Graph: Explore Connections in Elasticsearch Data](https://www.elastic.co/elasticsearch/graph)

### Why this matters for search

Graph effectively lets you build **“related concepts / related entities”** features and exploratory navigation (a “concept map”) without modeling an explicit ontology in a graph database. It’s especially useful when you have rich documents (e.g., lesson records) that connect many terms (subject, topic tags, unit IDs, outcomes, keywords) and you want to tease out **statistically significant** associations.

---

## 2) Kibana Graph UI (interactive graph exploration)

Kibana includes an interactive Graph application that lets you explore connections visually. Elastic’s Graph docs and Kibana docs describe Graph as an interactive tool that works directly with existing indices—no extra graph storage required.

- Graph in Kibana / Graph analytics feature docs:  
  [Graph (Kibana Guide)](https://www.elastic.co/guide/en/kibana/current/xpack-graph.html)

- Graph docs (current):  
  [Graph (Elastic Docs)](https://www.elastic.co/docs/explore-analyze/visualize/graph)

### Typical workflow in Kibana Graph

1. **Select an index / data view** (e.g., `lessons`, `units`, or a combined “curriculum_content” index).
2. **Choose vertex fields** (e.g., `subject.keyword`, `unit_id`, `concepts.keyword`, `key_stage.keyword`).
3. Optionally apply a **query filter** to focus the exploration (e.g., “KS3 only”).
4. Expand nodes to discover connected terms; tune settings to reduce noise (common terms) and emphasize meaningful links.
5. Save the workspace if your governance allows it.

#### Saving workspaces / governance

Graph workspaces can summarize large volumes of data, and Elastic provides explicit controls for how (or whether) workspaces can be saved:

- Save policy configuration (`xpack.graph.savePolicy`):  
  [Configure Graph (Elastic Docs)](https://www.elastic.co/docs/explore-analyze/visualize/graph/graph-configuration)

---

## 3) Graph Explore API (`POST /{index}/_graph/explore`)

Elastic exposes Graph programmatically via the **Graph Explore API**, returning vertices and connections as JSON so you can build custom UI experiences (e.g., “related topics” panels, guided discovery, concept navigation, recommendation-like flows).

- API reference (current):  
  [Explore graph analytics (Graph Explore API)](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-graph-explore)

- API group page:  
  [Graph explore endpoints](https://www.elastic.co/docs/api/doc/elasticsearch/group/endpoint-graph)

### How Graph Explore works (conceptually)

A Graph explore request typically contains:

- A **seed query** (foreground set) identifying documents of interest
- Vertex definitions (which fields supply candidate terms)
- Optional connection steps (“spider out” / multi-hop exploration)
- Controls for sampling and significance

The API reference itself notes that Graph uses **samples** to improve speed and stay focused on meaningfully connected terms, and that very small sample sizes can produce poor signal.

- API notes on sampling behavior:  
  [Explore graph analytics (Graph Explore API)](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-graph-explore)

### Tuning Graph: `sample_size`, `use_significance`, and `min_doc_count`

Elastic documents practical tuning guidance (and limitations) for Graph explorations, including increasing `sample_size`, disabling `use_significance` for forensic “show me everything” analysis, and lowering `min_doc_count`.

- Graph troubleshooting:  
  [Troubleshooting and limitations of graph analytics features](https://www.elastic.co/docs/explore-analyze/visualize/graph/graph-troubleshooting)

Elastic engineers (including Mark Harwood) have also discussed how Graph prioritizes connections and surfaces interesting links first:

- Elastic Discuss thread (Graph significance / prioritization):  
  [X-Pack Graph Significance Level (Discuss)](https://discuss.elastic.co/t/x-pack-graph-significance-level/88602)

---

## 4) “Graph-adjacent” search features inside Elastic

Graph is the dedicated graph exploration capability, but Elastic has several other **official** features that support graph-like modeling and relationship-driven search experiences.

### 4.1 Co-occurrence discovery with significance aggregations

Graph relies on significance concepts similar to Elasticsearch’s **significant_terms** family of aggregations. You can use these directly to power “related concepts” suggestions without the Graph API (or alongside it for deeper control).

- significant_terms aggregation (reference):  
  [Significant terms aggregation](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-significantterms-aggregation)

This aggregation finds terms that are “uncommonly common” in your focused result set compared to a broader background set—useful for extracting concept associations from search results (e.g., terms strongly associated with “photosynthesis” in lesson content).

### 4.2 Relationship analysis with adjacency matrices

For controlled, explicit co-occurrence analysis across a predefined set of filters (e.g., a set of core concepts you want to compare), Elasticsearch provides the **adjacency_matrix** aggregation.

- adjacency_matrix aggregation (reference):  
  [Adjacency matrix aggregation](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-adjacency-matrix-aggregation)

This returns a matrix of intersections between named filters—useful for analyzing pairwise overlaps that resemble edges in a concept graph.

### 4.3 Entity-centric indexing with Transforms (building “node views”)

A common “graph-adjacent” pattern is to build an **entity-centric index** where each document represents a single entity (lesson, unit, concept, teacher, etc.), summarizing the relationships that entity has to others.

Elastic’s **Transforms** are designed for this and explicitly mention pivoting data into “entity-centric” indices.

- Transforms overview:  
  [Transform overview (entity-centric indexing)](https://www.elastic.co/docs/explore-analyze/transforms/transform-overview)

- Broader transforms docs hub:  
  [Transforming data](https://www.elastic.co/docs/explore-analyze/transforms)

Example in education:
- Source: lesson documents referencing multiple concepts
- Transform: concept-centric index where each “concept” doc lists units/lessons where it appears, counts, and related facets (key stage, subject distribution)

This gives you a “node document” per concept with adjacency-like fields, enabling fast filtering, faceting, and UI navigation.

### 4.4 Modeling explicit hierarchies and relationships (nested and join)

Elastic recommends denormalizing where possible, but it provides explicit modeling tools when you need them.

#### Nested fields (arrays of objects)

- Nested field type (reference):  
  [Nested field type](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/nested)

Nested is useful when you have arrays of objects and need correct per-object matching (e.g., topic objects with attributes).

#### Parent/child relationships (join field)

- Join field type (parent/child) (reference):  
  [Join field type](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/parent-join)

The docs caution that joins add overhead and should be used sparingly; denormalization is usually better for search performance. Also note that Elastic’s documentation indicates the join field is **“Serverless Unavailable”**—important if you’re targeting Elastic Cloud Serverless specifically.

---

## 5) How these capabilities pertain to search (practical patterns)

Below are vendor-supported patterns that map directly to end-user search experiences.

### Pattern A: “Related concepts” / “Users also explored” panels
- Use Graph Explore API to return connected concepts/topics given a seed query or a selected lesson/unit.
- Display top related concept terms with explanation (doc_count / significance scores).
- Allow click-through to filter lessons by the related concept.

### Pattern B: “Concept map” navigation
- Use Kibana Graph for analyst exploration and QA of relationships.
- Use Graph Explore API for production UI: seed from a concept, expand to neighbors, repeat.
- Use Transforms to generate concept-centric nodes for quick drill-down and fast facet rendering.

### Pattern C: Curriculum hierarchy + implicit links
- Model explicit hierarchy in documents (`subject`, `key_stage`, `unit_id`, etc.) for facet navigation.
- Use Graph / significant_terms to find implicit cross-links (concept-to-concept or unit-to-unit associations).
- Use adjacency_matrix to analyze overlap among curated concept sets (curriculum planning, diagnostics).

### Pattern D: Relevance and AI-enhanced ranking (optional, still Elastic-native)
While this doc is about graph, Elastic’s modern search stack lets you combine relationship signals with semantic/AI workflows (e.g., reranking). If you do hybrid retrieval, you can still use Graph-derived relationship signals as boosts.

- Semantic search workflows:  
  [Semantic search (Elasticsearch reference)](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html)

- Semantic reranking overview:  
  [Semantic re-ranking](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html)

---

## 6) Applying this to the OAKS curriculum dataset (example mapping)

With an OAKS “lesson” index, each lesson document might include:

- `lesson_id` (keyword)
- `title` (text)
- `subject` (keyword)
- `key_stage` (keyword)
- `unit_id` (keyword)
- `concepts` (keyword array) — curated topics/keywords
- `keywords` (keyword array) — extracted terms / tags

Then:

- **Graph UI / API:** treat `concepts` as vertices; explore concept neighborhoods and cross-subject links.
- **significant_terms:** for a given query (e.g., “photosynthesis”), suggest strongly associated concepts.
- **Transforms:** build a `concepts_index` where each concept doc includes counts and lists of related units/subjects.
- **Adjacency matrix:** compare overlap among a curated list of concepts in a given key stage.
- **Nested:** if concepts have structured metadata (name + strand + difficulty), store as nested.
- **Join field (sparingly):** consider only if you truly need parent/child mechanics and you’re not on serverless.

---

## Sources (official Elastic / Elastic Discuss)

### Graph (UI + API)
- [Graph (Elastic Docs)](https://www.elastic.co/docs/explore-analyze/visualize/graph)  
- [Graph Explore API (operation reference)](https://www.elastic.co/docs/api/doc/elasticsearch/operation/operation-graph-explore)  
- [Graph API endpoints group](https://www.elastic.co/docs/api/doc/elasticsearch/group/endpoint-graph)  
- [Graph troubleshooting (sample_size, use_significance, min_doc_count)](https://www.elastic.co/docs/explore-analyze/visualize/graph/graph-troubleshooting)  
- [Configure Graph (save policies / xpack.graph.savePolicy)](https://www.elastic.co/docs/explore-analyze/visualize/graph/graph-configuration)  
- [Graph product page](https://www.elastic.co/elasticsearch/graph)  
- [Elastic Discuss: X-Pack Graph Significance Level](https://discuss.elastic.co/t/x-pack-graph-significance-level/88602)

### Aggregations for relationship discovery
- [Significant terms aggregation](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-significantterms-aggregation)  
- [Adjacency matrix aggregation](https://www.elastic.co/docs/reference/aggregations/search-aggregations-bucket-adjacency-matrix-aggregation)

### Modeling relationships
- [Nested field type](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/nested)  
- [Join field type (parent/child)](https://www.elastic.co/docs/reference/elasticsearch/mapping-reference/parent-join)

### Entity-centric indexing
- [Transform overview (entity-centric indices)](https://www.elastic.co/docs/explore-analyze/transforms/transform-overview)  
- [Transforming data](https://www.elastic.co/docs/explore-analyze/transforms)

### Text analysis (supporting better vertices)
- [Text analysis (Elastic Docs)](https://www.elastic.co/docs/manage-data/data-store/text-analysis)  
- [Analyzer reference](https://www.elastic.co/docs/reference/text-analysis/analyzer-reference)

### Optional: semantic / AI workflows (Elastic-native)
- [Semantic search](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-search.html)  
- [Semantic re-ranking](https://www.elastic.co/guide/en/elasticsearch/reference/current/semantic-reranking.html)

