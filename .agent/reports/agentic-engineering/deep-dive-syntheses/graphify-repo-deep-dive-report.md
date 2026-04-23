# Graphify Repo Deep Dive Report

## Executive Summary

The local Graphify repo copy shows a real, fairly complete derived-graph
toolchain rather than just a graph-flavoured idea.

At a high level, Graphify combines:

- deterministic local extraction for code and some rationale;
- agent-orchestrated semantic extraction for docs, papers, images, and
  transcripts;
- graph analysis and clustering over the merged result; and
- several navigation outputs: `graph.json`, `GRAPH_REPORT.md`,
  `graph.html`, wiki articles, CLI query/path/explain commands, and an
  MCP server.

For Oak, the strongest conclusion is not "install Graphify into the
repo". It is more selective:

1. Graphify is a strong reference implementation for a **derived
   document-graph layer**.
2. Several of its concepts fit Oak very well:
   evidence-labelled edges, graph-topology reports, body-aware Markdown
   caching, incremental rebuilds, and optional MCP exposure of a
   derived graph.
3. Its install model and query-memory loop would need adaptation before
   use in a canonical-first Practice.

The most important boundary insight is this:

- Graphify is strongest here as an **internal, derived, advisory
  discovery plane** over canonical Practice artefacts.
- It is weakest if treated as an installer that gets to rewrite the
  repo's entry surfaces or as a feedback loop that lets derived answers
  silently become future truth.

## Scope and Method

This deep dive is based on source inspection of the local repo copy at
[`reference-local/repos/graphify/`](../../../reference-local/repos/graphify/),
not on an abstract reading of its homepage.

Primary sources inspected:

- [README.md](../../../reference-local/repos/graphify/README.md)
- [ARCHITECTURE.md](../../../reference-local/repos/graphify/ARCHITECTURE.md)
- [pyproject.toml](../../../reference-local/repos/graphify/pyproject.toml)
- [graphify/__main__.py](../../../reference-local/repos/graphify/graphify/__main__.py)
- [graphify/detect.py](../../../reference-local/repos/graphify/graphify/detect.py)
- [graphify/extract.py](../../../reference-local/repos/graphify/graphify/extract.py)
- [graphify/build.py](../../../reference-local/repos/graphify/graphify/build.py)
- [graphify/analyze.py](../../../reference-local/repos/graphify/graphify/analyze.py)
- [graphify/report.py](../../../reference-local/repos/graphify/graphify/report.py)
- [graphify/export.py](../../../reference-local/repos/graphify/graphify/export.py)
- [graphify/serve.py](../../../reference-local/repos/graphify/graphify/serve.py)
- [graphify/cache.py](../../../reference-local/repos/graphify/graphify/cache.py)
- [graphify/watch.py](../../../reference-local/repos/graphify/graphify/watch.py)
- [graphify/ingest.py](../../../reference-local/repos/graphify/graphify/ingest.py)
- representative tests in
  [tests/](../../../reference-local/repos/graphify/tests/)

This was a source-structure deep dive. I did **not** run Graphify or its
test suite in this session.

## What Graphify Actually Is

Graphify is two things at once:

1. a Python package + CLI (`graphifyy`) with graph, export, serve, and
   install logic;
2. a family of platform-specific skill/workflow files that tell an AI
   coding assistant how to build and use the graph.

That split is important.

The Python package is the durable mechanism. It owns:

- file detection and classification;
- structural extraction;
- graph construction;
- clustering and report generation;
- export and serving;
- caches, watch hooks, and small ingestion helpers.

The skill files are orchestration overlays. They own:

- how semantic extraction is delegated to subagents;
- how agent platforms are configured to read `GRAPH_REPORT.md`;
- when to call update, query, path, and explain;
- how much of the graph is "always on" in an agent's working posture.

So Graphify is not just "a library". It is a **toolchain plus agent
behaviour layer**.

## Core Pipeline

Graphify's architectural spine is explicit in
[ARCHITECTURE.md](../../../reference-local/repos/graphify/ARCHITECTURE.md):

`detect() -> extract() -> build_graph() -> cluster() -> analyze() -> report() -> export()`

### 1. Detect

[detect.py](../../../reference-local/repos/graphify/graphify/detect.py)
classifies a corpus into code, documents, papers, images, and
video/audio.

Important traits:

- wide file-type support, including `.docx`, `.xlsx`, images, and media;
- secret-like files are skipped by pattern;
- `.graphifyignore` provides user-level exclusion control;
- corpus size is explicitly assessed to warn when a graph may be
  unnecessary or overly expensive.

This is already a useful pattern for Oak: graphability is treated as a
question of corpus fit, not as a default assumption.

### 2. Structural extraction

[extract.py](../../../reference-local/repos/graphify/graphify/extract.py)
does a tree-sitter-based AST pass for many languages.

This layer extracts:

- files, classes, functions, methods, imports, and call relationships;
- rationale signals from docstrings and "why" comments;
- language-specific structural conventions.

This is entirely local and deterministic.

That matters for fit. Graphify is not "LLM all the way down"; it uses a
proper structural substrate where it can.

### 3. Semantic extraction boundary

The richer semantic layer is not embedded in the Python package. It is
orchestrated in the platform skill files, for example
[skill-codex.md](../../../reference-local/repos/graphify/graphify/skill-codex.md).

The skill files instruct the assistant to:

- run AST extraction in parallel with semantic work;
- dispatch subagents over docs, papers, images, and transcripts;
- produce JSON fragments with nodes, edges, and optional hyperedges;
- label every relationship as `EXTRACTED`, `INFERRED`, or `AMBIGUOUS`;
- attach `confidence_score` to every edge; and
- merge new semantic output with cached results.

This boundary is crucial for Oak. It means the Graphify *concept* is
reusable even if the exact subagent orchestration is not.

### 4. Build and cluster

[build.py](../../../reference-local/repos/graphify/graphify/build.py)
merges extraction fragments into a NetworkX graph, preserving edge
direction when requested and carrying hyperedges in graph metadata.

[cluster.py](../../../reference-local/repos/graphify/graphify/cluster.py)
then performs community detection:

- Leiden via `graspologic` when available;
- Louvain via NetworkX as fallback;
- second-pass splitting for oversized communities;
- deterministic size-based reindexing.

Graphify's clustering is intentionally topology-first rather than
embedding-first. Semantic similarity influences communities only through
edges already present in the graph.

### 5. Analyse, report, export

[analyze.py](../../../reference-local/repos/graphify/graphify/analyze.py)
extracts the human-facing interpretation layer:

- god nodes;
- surprising connections;
- suggested questions;
- knowledge gaps.

[report.py](../../../reference-local/repos/graphify/graphify/report.py)
then renders those into `GRAPH_REPORT.md`.

[export.py](../../../reference-local/repos/graphify/graphify/export.py)
fans the graph out into multiple forms:

- `graph.json`
- `graph.html`
- Obsidian-style outputs
- wiki outputs
- GraphML / Cypher / Neo4j-adjacent exports

This multiplicity is important. Graphify does not assume one graph
representation is enough for every audience.

## Evidence and Relationship Model

One of Graphify's strongest ideas is its explicit evidence taxonomy.

Relationships are labelled:

- `EXTRACTED`
- `INFERRED`
- `AMBIGUOUS`

and `INFERRED` edges carry a `confidence_score`.

This is reinforced throughout the implementation:

- [ARCHITECTURE.md](../../../reference-local/repos/graphify/ARCHITECTURE.md)
  defines the schema;
- [report.py](../../../reference-local/repos/graphify/graphify/report.py)
  surfaces confidence breakdowns and ambiguous edges;
- [tests/test_semantic_similarity.py](../../../reference-local/repos/graphify/tests/test_semantic_similarity.py)
  verifies special handling for semantic edges.

There are also richer graph constructs:

- `rationale_for` edges for "why" explanations;
- `semantically_similar_to` for non-structural conceptual proximity;
- hyperedges for group relationships that pairwise edges do not capture.

For Oak, this aligns very well with the Practice's direction towards
explicit claim/evidence distinctions. It also helps keep a derived graph
honest about what it knows versus what it inferred.

## Discovery Outputs

Graphify emits several distinct navigation surfaces, each with a
different job.

### `GRAPH_REPORT.md`

This is the high-level orientation layer. It summarises:

- corpus check;
- extraction mix;
- communities;
- god nodes;
- surprising connections;
- ambiguous edges;
- knowledge gaps;
- suggested questions.

This is the surface Graphify tries hardest to make "always-on" for
agents via installed instructions and hooks.

### `graph.json`

This is the persistent graph substrate. It stores:

- nodes
- links
- community IDs
- confidence scores
- hyperedges

It is the basis for query/path/explain and MCP serving.

### `graph.html`

This is a client-side interactive visual graph with:

- search;
- community filtering;
- node inspection;
- neighbour navigation;
- hyperedge overlays.

For Oak, this is most interesting as a human exploration tool rather
than a canonical artefact.

### Wiki outputs

[wiki.py](../../../reference-local/repos/graphify/graphify/wiki.py)
generates a small navigable article set:

- `index.md`
- one page per community
- one page per god node

This is notable because it turns graph structure back into prose
navigation. That maps naturally to onboarding and orientation use cases.

### MCP server and CLI query surfaces

[serve.py](../../../reference-local/repos/graphify/graphify/serve.py)
exposes graph tools such as:

- `query_graph`
- `get_node`
- `get_neighbors`
- `get_community`
- `god_nodes`
- `graph_stats`
- `shortest_path`

Meanwhile
[__main__.py](../../../reference-local/repos/graphify/graphify/__main__.py)
offers CLI `query`, `path`, and `explain`.

This is one of the strongest fits with Oak, because the repo already has
graph-shaped MCP idioms and a graph-resource factory in the curriculum
SDK.

## Incremental and Feedback Mechanisms

Graphify is not a one-shot batch exporter. It has several loops worth
studying.

### Per-file cache

[cache.py](../../../reference-local/repos/graphify/graphify/cache.py)
stores semantic extraction results keyed by file hash.

The most interesting detail is that for Markdown files the hash is based
on the **body below YAML frontmatter**, not on the full raw bytes.

That means metadata-only churn does not force semantic re-extraction.
For Oak, where plan/status frontmatter changes frequently, this is a
very strong fit.

### Watch / update split

[watch.py](../../../reference-local/repos/graphify/graphify/watch.py)
distinguishes sharply between:

- code-only changes, which can trigger a local AST rebuild immediately;
- doc/paper/image changes, which set a `needs_update` flag and ask for a
  semantic refresh.

This is an elegant cost-control loop. Cheap changes stay cheap; semantic
refresh is explicit.

### Query-memory feedback loop

This is the most interesting and riskiest loop in the system.

[ingest.py](../../../reference-local/repos/graphify/graphify/ingest.py)
includes `save_query_result()`, which writes question/answer records to
`graphify-out/memory/`.

[detect.py](../../../reference-local/repos/graphify/graphify/detect.py)
then explicitly re-includes `graphify-out/memory/` on future detect runs.

So Graphify can learn from prior questions and answers, not only from the
original corpus.

That is a genuine memory mechanism, but it also creates a sharp boundary
question:

- should derived answers be allowed back into the graph?
- if yes, under what confidence or review model?
- how do you stop the graph from ingesting and then amplifying its own
  mistakes?

For Oak, this is probably the single most important caution from the
deep dive.

## Install and Always-On Behaviour

Graphify is quite opinionated about agent integration.

Through
[__main__.py](../../../reference-local/repos/graphify/graphify/__main__.py)
and the install tests in
[tests/test_install.py](../../../reference-local/repos/graphify/tests/test_install.py),
it can:

- write sections to `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, Cursor rules,
  Copilot instructions, and other platform surfaces;
- install hooks or plugins that remind an assistant to read
  `GRAPH_REPORT.md` before using raw search tools;
- install git hooks to keep graph outputs fresh after code changes.

This is operationally clever, but it is also where the strongest
adoption risk lies for Oak.

Oak already has a carefully governed entry-point chain, authority order,
and adapter model. A Graphify-style install step should therefore be
treated as **inspiration**, not as something to run unchanged inside this
repo.

## Strong Alignment with Oak

Several Graphify ideas fit Oak unusually well.

### 1. Derived graph over a canonical estate

Oak already has:

- canonical doctrine;
- active, operational, and executive memory;
- rich planning and ADR estates;
- existing graph-shaped MCP surfaces.

So Graphify's best role here is the same role already identified in the
repo's earlier analysis:

- a derived navigation layer over the existing estate;
- never a replacement for the canonical artefacts themselves.

### 2. Practice and onboarding discovery

Graphify's outputs match some of Oak's live pain points well:

- `GRAPH_REPORT.md` as a "map before grep" onboarding layer;
- community pages for clustered reading order;
- shortest-path queries across ADRs, plans, and directives;
- hidden-hub and surprising-bridge detection across sprawling docs.

### 3. Internal MCP exposure

Oak already knows how to expose graphs over MCP. Graphify's MCP server
therefore looks less like a novelty and more like a reference pattern
for an internal document-graph tool.

### 4. Evidence labels and ambiguity

The `EXTRACTED` / `INFERRED` / `AMBIGUOUS` model fits neatly with
Oak's evidence discipline and reduces the temptation to present derived
document relationships as hard truth.

### 5. Body-aware caching

This is a particularly strong candidate for direct adaptation even if
Graphify itself is not adopted.

## Risks and Boundaries for Oak

The deep dive clarified several boundaries that should probably shape
any later plan.

### 1. Do not adopt the installer model unchanged

Graphify assumes it can write or amend local entry surfaces to make the
graph always-on. In Oak that would collide with:

- the existing `AGENTS.md` -> `AGENT.md` chain;
- the Practice's thin-adapter doctrine;
- local authority order and start-right grounding.

Any Oak integration should therefore be a thin local adapter or explicit
workflow, not a foreign installer.

### 2. Keep the graph derived and non-authoritative

Graphify itself often says this in spirit, but Oak should state it even
more strongly.

For Oak, the graph should remain:

- derived
- advisory
- queryable
- non-canonical

### 3. Be careful with self-ingesting query memory

The `graphify-out/memory` loop is inventive, but it could blur
canonical-vs-derived boundaries quickly in this repo.

My current judgement is:

- it is a powerful second-phase or third-phase feature;
- it is a bad first-phase feature for Oak.

If Oak pilots a derived document graph, I would start with:

- authored sources only;
- no auto-ingestion of graph answers;
- any memory feedback loop added later under explicit governance.

### 4. Scope the corpus tightly

Graphify is most useful on corpora that are large enough to be annoying
but still coherent. Oak should not start with a whole-repo graph.

The most plausible first corpora remain:

- ADRs;
- Practice Core + directives + memory README + practice-index;
- onboarding and operational strategy docs;
- maybe adjacent graph-related code and docs in a later slice.

### 5. Distinguish Graphify-the-concept from Graphify-the-workflow

Graphify's useful ideas are separable:

- evidence labels;
- graph report pattern;
- wiki exports;
- MCP graph query surface;
- cache strategy;
- watch/update split;
- query-memory loop.

Oak can borrow or adapt some of these without adopting the whole
workflow or distribution story.

## Strongest Candidate Concepts to Borrow

If a later Oak plan wants a bounded first slice, these look like the
highest-value concepts from Graphify:

1. **Graph report pattern**:
   a generated `GRAPH_REPORT.md`-style entry surface for a derived doc
   graph.
2. **Evidence-labelled relationships**:
   keep inferred and ambiguous edges visibly non-canonical.
3. **Body-aware Markdown cache**:
   ignore frontmatter-only churn.
4. **Internal query/path/explain interface**:
   probably via an internal MCP server or repo-local tool.
5. **Wiki-style derivative**:
   turn communities into navigable onboarding articles.
6. **Code-only rebuild vs semantic-refresh split**:
   cheap updates stay cheap.

The concept I would explicitly defer is:

- Graphify-style query-result ingestion back into the graph corpus.

## Implications for the Later Plan

This deep dive does not itself propose an implementation plan, but it
does narrow the design space.

The most likely good Oak direction is:

- use Graphify as a **reference architecture**, not a wholesale
  installer;
- keep the first pilot **derived, internal, and tightly scoped**;
- favour **Practice / ADR / onboarding** discovery over whole-repo
  graphing;
- start with **explicit and already-authored relationships** as seed
  edges, then decide later whether semantic inference earns its place;
- preserve a crisp boundary between canonical memory and any derived
  graph outputs.

If we later write a plan from this, I think the right ambition level is:

- not "add Graphify to the repo";
- but "pilot a derived document-graph discovery surface inspired by
  Graphify, integrated as a thin local adapter within Oak's Practice."
