# Graphify Analysis for Oak and the Practice

Date: 13 April 2026

## Purpose

Assess how <https://github.com/safishamsi/graphify> could be useful to this
repository, and which of its concepts could be integrated directly into the
Practice while clearly acknowledging the source of inspiration.

## Attribution Requirement

Any Oak adoption of Graphify-inspired ideas should treat attribution as
non-negotiable.

Minimum standard:

- name **Graphify** explicitly
- name **Safi Shamsi** explicitly
- link to the upstream repository:
  <https://github.com/safishamsi/graphify>
- link to the specific upstream artefact(s) that inspired the Oak adaptation,
  not just the repo homepage
- describe Oak's result as **inspired by** or **adapted from** Graphify,
  not as an original invention
- make clear that Oak's derived graph outputs are advisory/navigation aids,
  not canonical truth

This matters for both ethics and architecture. Ethically, it gives proper
credit. Architecturally, it prevents future readers from mistaking an adapted
Oak-native implementation for a concept that emerged from nowhere.

## Executive Summary

Graphify is a strong conceptual fit for this repository, but only in a
specific role:

- **Best fit**: a **derived navigation, synthesis, and memory layer** over
  large, mixed-format repo corpora such as ADRs, plans, research notes,
  memory files, and graph-related SDK code.
- **Poor fit**: a new source of truth, a replacement for schema-first/codegen
  discipline, or a wholesale installer that rewrites this repo's `AGENTS.md`,
  hooks, or always-on instructions.

The repo already has deep graph DNA:

- the Practice says **concepts are the unit of exchange**
- the repo already ships graph-shaped MCP resources and tools
- ADR-059 already defined a schema-level concept map for agent context
- ADR-157 formalised multi-source graph integration and attribution
- the Practice is already moving towards evidence-based, non-hand-wavy claims

Because of that, Graphify would not introduce a new worldview here. It would
mainly offer a more operational, corpus-navigation-oriented implementation of
ideas this repo already values.

### Metacognitive correction

My earlier framing overstated the risk that Graphify would "compete" with the
Practice as such.

That is not the strongest reading of the idea. A better framing is:

- the current memory artefacts remain canonical in their existing roles
- the graph becomes a **derived, orthogonal memory plane**
- if the existing memory artefacts are included in the graph, the result is
  not a rival memory system but a topology and retrieval layer over the memory
  estate that already exists

Under that framing, the important caution is not conceptual competition. It is
**implementation discipline**: avoiding repo mutations or activation patterns
that create unclear precedence between the graph layer and the canonical
Practice artefacts.

### Exploratory status

This document is intentionally exploratory.

- **No implementation path has been decided**
- **No adoption decision has been made**
- **Multiple forward paths are plausible**
- the goal here is to clarify the option space, trade-offs, and fit

At this stage, the right output is not "the answer". It is a clear map of the
possible ways forward.

## What Graphify Actually Adds

From the upstream project, the load-bearing ideas are:

- a three-pass pipeline: deterministic AST extraction, optional transcript
  generation, then semantic extraction over docs/images/transcripts
- persistent outputs: `graph.json`, `GRAPH_REPORT.md`, `graph.html`, cache
- graph-level navigation primitives: query, path, explain
- explicit evidence labelling on edges:
  `EXTRACTED`, `INFERRED`, `AMBIGUOUS`
- graph-topology-based community detection rather than embedding-first
  clustering
- optional MCP serving of the derived graph so agents can query it as a tool
- per-file caching, including a useful optimisation where Markdown frontmatter
  changes do not invalidate semantic cache entries

Those ideas matter here because this repo contains:

- a large monorepo codebase
- a very large `.agent/` estate
- many plans, ADRs, research notes, and governance docs
- existing memory files (`napkin.md`, `distilled.md`, patterns, experience)
- existing graph, ontology, and MCP workstreams that are spread across code
  and prose

This is exactly the sort of estate where structural navigation becomes more
useful than repeated raw-file search.

### Concept-to-source attribution map

If Oak adopts any of the following ideas, these are the minimum upstream links
that should be cited alongside the adaptation:

| Oak adaptation idea | Upstream concept | Minimum source link(s) |
| --- | --- | --- |
| Persistent derived graph outputs | `graph.json`, `GRAPH_REPORT.md`, cached reruns | <https://github.com/safishamsi/graphify/blob/v4/README.md> |
| Three-pass extraction pipeline | detect -> extract -> build/cluster/analyse/report | <https://github.com/safishamsi/graphify/blob/v4/README.md>, <https://github.com/safishamsi/graphify/blob/v4/ARCHITECTURE.md> |
| Evidence-labelled relationships | `EXTRACTED`, `INFERRED`, `AMBIGUOUS` | <https://github.com/safishamsi/graphify/blob/v4/README.md> |
| Query / path / explain interaction model | graph navigation primitives | <https://github.com/safishamsi/graphify/blob/v4/README.md> |
| MCP exposure of derived graphs | local graph query server | <https://github.com/safishamsi/graphify/blob/v4/README.md>, <https://github.com/safishamsi/graphify/blob/v4/graphify/serve.py> |
| Markdown-frontmatter-insensitive cache strategy | body-only hashing for markdown cache invalidation | <https://github.com/safishamsi/graphify/blob/v4/graphify/cache.py> |
| Topology/community report pattern | god nodes, surprising connections, suggested questions | <https://github.com/safishamsi/graphify/blob/v4/README.md>, <https://github.com/safishamsi/graphify/blob/v4/ARCHITECTURE.md> |

## Repo Alignment

### Existing overlap in Oak

This repo already contains several directly adjacent ideas:

- [`docs/architecture/architectural-decisions/059-knowledge-graph-for-agent-context.md`](../../docs/architecture/architectural-decisions/059-knowledge-graph-for-agent-context.md)
  treats a compact concept graph as agent orientation data.
- [`docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md`](../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
  formalises graph-shaped integration across Oak API, ontology, and EEF data,
  with explicit attribution.
- [`packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts`](../../packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts)
  shows the repo already knows how to expose graph-shaped resources and tools
  cleanly.
- [`docs/architecture/architectural-decisions/062-knowledge-graph-svg-visualization.md`](../../docs/architecture/architectural-decisions/062-knowledge-graph-svg-visualization.md)
  shows there is already interest in graph visualisation as a human aid.
- [`docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md`](../../docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md)
  and the current MCP code establish a clear split between public curriculum
  server surfaces and internal engineering machinery.
- [`.agent/practice-core/practice.md`](../practice-core/practice.md)
  makes the Practice explicitly concept-centric.
- [`.agent/plans/agentic-engineering-enhancements/current/hallucination-and-evidence-guard-adoption.plan.md`](../plans/agentic-engineering-enhancements/current/hallucination-and-evidence-guard-adoption.plan.md)
  already pushes the repo towards explicit claim/evidence discipline.

Graphify aligns strongly with all of that.

### Where Graphify is genuinely additive

Graphify is strongest where the repo currently has volume and conceptual
spread, but not yet a compact navigational overlay:

- cross-document synthesis across ADRs, active plans, and research notes
- memory-topology over `napkin`, `distilled`, patterns, plans, ADRs, and
  implementation files
- onboarding into large internal documentation estates
- tracing conceptual paths between code, ADRs, plans, and supporting research
- surfacing "god nodes" and surprising bridges in sprawling text-heavy corpora
- turning mixed-format research bundles into something queryable

### Where Graphify would duplicate or cut across existing discipline

Graphify is a bad fit if used to:

- replace schema-first/codegen authority
- replace formal ontology work with an LLM-derived graph
- become the canonical representation of repo architecture
- mutate this repo's agent entry surfaces and hooks as if it owned them

This repo is canonical-first. Graphify should stay a **derived view**.

## Empirical Fit Check

I ran Graphify's own `detect()` logic locally against several repo scopes.
That is not a full graph build, but it is a useful sizing signal.

| Scope | Files | Approx words | Graphify's own verdict | Interpretation |
| --- | ---: | ---: | --- | --- |
| repo root | 2446 | 1,088,355 | large corpus warning | too expensive for routine repo-wide semantic runs |
| `.agent/` | 1327 | 2,011,620 | large corpus warning | very high-value graph target, but only if scoped or cached carefully |
| `.agent/practice-core/` | 7 | 16,988 | "may not need a graph" | too small to justify Graphify alone |
| `.agent/directives/` | 7 | 10,363 | "may not need a graph" | too small to justify Graphify alone |
| `packages/sdks/oak-curriculum-sdk/src/mcp/` | 109 | 46,166 | "may not need a graph" | small enough to read directly, but AST graphing could still help |
| `docs/architecture/architectural-decisions/` | 152 | 134,450 | no small-corpus warning | very plausible target |
| `.agent/plans/sdk-and-mcp-enhancements/active/` | 12 | 19,454 | "may not need a graph" | small enough to reason about directly |

### What this means

- **Do not default to one giant graph for the whole repo.**
- **Do consider targeted graphs** for:
  - ADRs
  - `.agent/` research + plans
  - graph/ontology-related code and docs taken together
  - imported external corpora such as ontology docs, EEF notes, papers, and
    screenshots

The sweet spot is not "everything". It is "large enough to be annoying, small
enough to be coherent".

## Part A: How Graphify Could Be Useful to This Repo

### 1. Documentation and planning navigation

This is the clearest win.

The repo has a substantial planning and governance estate. A Graphify-style
derived graph could help answer questions like:

- Which ADRs are central to current MCP work?
- Which active plans share concepts but do not link to each other?
- Which documents are acting as hidden hubs for the Practice?
- What path connects a plan assumption to the directive or ADR it depends on?

That would complement existing grep-heavy workflows with structure-first
navigation.

### 2. Onboarding and architectural orientation

Graphify's `GRAPH_REPORT.md` idea maps very well onto repo onboarding.

For a newcomer, the most useful questions are often:

- What are the core abstractions here?
- Which files and documents are central?
- What surprising couplings exist?
- Where should I start reading for a given topic?

This repo currently answers that through good documentation, but mostly via
manual reading order and local discovery. A generated "map before grep" report
would accelerate that.

### 3. Cross-linking code and prose

The repo has lots of valuable architectural prose, but the path from prose to
implementation can still be expensive to reconstruct.

Graphify's big practical value is not "make a graph because graphs are cool".
It is making these transitions cheaper:

- ADR -> plan -> package -> module -> test
- research note -> implementation plan -> shipping code
- concept -> source attribution -> MCP surface

That would be useful across the MCP and graph-related lanes in particular.

### 4. External-source integration work

This repo actively integrates or studies external knowledge sources:

- Oak Curriculum Ontology
- EEF Toolkit
- research documents
- screenshots/diagrams/notes in `.agent/research/`

Graphify is especially well suited to these mixed corpora because it can build
one queryable graph across code, markdown, PDFs, and images. That is stronger
than its value on a neat, code-only workspace.

### 5. Optional derived MCP access for internal engineering work

Graphify's MCP server idea is attractive, but only for **internal engineering
navigation**, not for the public curriculum MCP server.

The public server should keep serving curriculum/domain data. A repo-topology
or Practice-topology graph would be a different concern and should live in a
separate internal tool or internal MCP server.

## Part B: How Graphify Concepts Could Be Integrated Into the Practice

### 1. Orthogonal memory plane over the existing memory estate

This is the most important corrected framing.

If the graph includes the existing memory artefacts, then Graphify is not best
understood as "another memory file". It is better understood as a **memory
topology layer** across:

- `napkin.md`
- `distilled.md`
- `patterns/`
- plans
- ADRs
- experience records
- relevant code and tests

That creates a different affordance from the existing memory files:

- the files remain the authored/canonical memory artefacts
- the graph becomes a derived retrieval surface over their relationships
- path queries become a way of traversing memory, not replacing it

This is orthogonal in a useful way:

- `napkin` captures
- `distilled` curates
- permanent docs graduate
- the graph connects

That is a strong fit with the Practice's concept-centric worldview.

### 2. "Map before grep" as an optional Practice move

This is the cleanest concept to import.

For large, messy corpora, the Practice could gain an explicit move:

- before doing broad raw-file search, first consult a compact topology report
- use that report to identify central nodes, communities, and candidate paths
- only then drop into file-level inspection

This should be optional and corpus-sensitive, not universal.

For example:

- yes for `.agent/` as a whole, the ADR estate, or a mixed research bundle
- no for `.agent/practice-core/` or `.agent/directives/` alone

### 3. Evidence-labelled relationships

Graphify's `EXTRACTED` / `INFERRED` / `AMBIGUOUS` taxonomy fits this repo's
evidence-based claims direction remarkably well.

The Practice already wants:

- claim -> cite -> verify
- explicit abstention when evidence is missing
- lower tolerance for confident but weakly-supported assertions

A repo-native adaptation could use Graphify's idea in two places:

- research synthesis and exploratory topology work
- incoming Practice/core comparison or cross-repo concept exchange

That would make it easier to distinguish:

- directly evidenced relationships
- plausible but derived links
- uncertain relationships that need human review

### 4. Path-based navigation over the Practice estate

The Practice already contains rich conceptual structure:

- directives
- skills
- plans
- ADRs
- memory
- rules

A `query / path / explain` model would be very natural here. Example queries:

- "What connects `start-right-quick` to evidence-based claims?"
- "Why does `schema-first-execution.md` matter for MCP tools?"
- "Which documents explain the knowledge flow most directly?"

This is more useful than a flat full-text search result list because the user
often wants relationships, not just mentions.

The most important memory-specific use cases would be things like:

- "What connects this napkin entry to a settled distilled rule?"
- "Which ADRs and plans are closest to this pattern?"
- "Where did this recurring concept first appear, and where did it graduate?"
- "What links this current MCP workstream back to prior graph research?"

### 5. Cache strategy that ignores frontmatter-only markdown churn

This is a subtle but excellent idea from Graphify.

This repo changes YAML frontmatter and status markers frequently in plans.
A derived-graph cache that keys on Markdown body content rather than full file
bytes would avoid expensive pointless rebuilds when only status metadata
changes.

That concept could be adopted even if Graphify itself is not.

### 6. Community-level reports for governance hygiene

Graphify's report sections map well onto doc hygiene tasks:

- god nodes -> overloaded docs / true hubs
- surprising connections -> hidden coupling between workstreams
- thin communities -> orphaned mini-estates
- ambiguous edges -> claims that need stronger linking or clearer wording

This would complement existing documentation review work nicely.

## Possible Paths Forward

Nothing below is a committed direction. These are plausible paths that could be
taken individually or in combination.

### Path 1: Run Graphify as an explicit repo dependency with a binary

One option is to use Graphify much like other explicit repo tools such as
`depcruise` or `knip`: install it as a dependency-like tool with a stable
binary entrypoint and invoke it deliberately for selected workflows.

Implications:

- **Python 3 becomes an explicit repo requirement** for anyone using this lane
- the tool stays external and attributable
- Oak gets immediate access to the actual Graphify workflow and outputs
- no need to reimplement the system before learning from it

This path is strongest if the immediate goal is learning-by-use.

Constraints:

- do not use Graphify's repo-mutating installer model unchanged
- keep activation explicit or tightly scoped
- document Python 3 as a real prerequisite, not an accidental one

Potential usage shape:

- local binary invocation over selected corpora
- optional wrapper command in `agent-tools/` or package scripts
- pilot lanes only, not blanket always-on usage

### Path 2: Adopt some Graphify code into Oak-native mechanisms

Another option is selective code adoption or adaptation from the Graphify repo
to enhance or create Oak-native learning mechanisms.

Candidate areas:

- cache behaviour such as Markdown body-only hashing
- query / path / explain graph interaction patterns
- graph report generation ideas
- derived graph MCP serving for local engineering use

This path is strongest if Oak wants tighter integration with existing Practice
infrastructure and a smaller runtime surface than full-tool adoption.

Constraints:

- stronger maintenance responsibility shifts to Oak
- attribution must stay explicit at the artefact level
- the adapted implementation should still preserve the distinction between
  canonical memory and derived graph memory

### Path 3: Adopt Graphify concepts without adopting the tool or code

This is the lightest-weight path.

Oak could adopt concepts such as:

- orthogonal graph memory over existing memory artefacts
- evidence-labelled relationships (`EXTRACTED` / `INFERRED` /
  `AMBIGUOUS`)
- "map before grep"
- path-based memory traversal
- community/god-node reporting for large document estates

This path is strongest if the repo wants conceptual uplift first and tool
decisions later.

### Path 4: Hybrid approach

This may be the most realistic medium-term path:

- use Graphify directly on a pilot corpus
- learn which capabilities matter in Oak's context
- then decide whether to keep using it externally, adapt selected code, or
  absorb selected concepts into the Practice

This reduces premature commitment in either direction.

### Path 5: Stay in exploration only for now

A valid outcome of this report is to decide nothing yet.

That would still be productive if it sharpens:

- the criteria for a future pilot
- the boundaries between canonical memory and derived graph memory
- the attribution standard for any future adoption

### Illustrative pilot path: explicit, scoped external use

If a first practical experiment were wanted, one path would be to use Graphify
directly, but only on selected corpora, for example:

- `docs/architecture/architectural-decisions/`
- selected `.agent/research/` bundles
- a combined lane of graph-related ADRs, plans, and MCP code
- imported external corpora around ontology/EEF/research work

This gives immediate value without altering repo conventions too early.

### Illustrative pilot path: repo-native concept adoption

If the concepts prove useful, one later path would be to implement an
Oak-native version in the normal Oak way:

- CLI home: `agent-tools/`
- canonical workflow or passive guidance: `.agent/skills/`
- durable doctrine: ADR or governance doc if the approach becomes settled

Good candidate commands:

- `pnpm agent-tools:practice-graph report`
- `pnpm agent-tools:practice-graph query`
- `pnpm agent-tools:practice-graph path`

This would preserve the repo's canonical-first structure.

The right design target is not "Graphify beside the Practice". It is
"Graphify-style graph memory as an orthogonal layer within the Practice
architecture".

If Oak does this, each durable artefact should carry explicit attribution:

- ADR: "Inspired by Graphify by Safi Shamsi" plus direct source links
- CLI README: source links for the workflow model being adapted
- skill/workflow doc: acknowledgement plus source links for the interaction
  model (`query` / `path` / `explain`, evidence labelling, or report shape)

### Boundary to keep across all paths: keep public curriculum MCP surfaces separate

Do **not** mix a Practice/repo graph into the public curriculum MCP server.

Reasons:

- wrong audience
- wrong domain
- weakens the separation between Oak's public data surfaces and internal
  engineering support tooling

If graph querying becomes useful in-session for engineering work, expose it via
a separate internal MCP server or local CLI.

## What Not To Do

### 1. Do not install Graphify's always-on repo mutations blindly

Graphify's default platform integration model writes to repo-level surfaces
such as `AGENTS.md` and hooks. In this repo that is risky because those files
already participate in a carefully structured canonical/thin-adapter Practice.

Using Graphify's installer unchanged would likely create one of:

- duplicate always-on instructions
- drift between canonical `.agent/` content and top-level entry-point wording
- hook conflicts
- duplicate activation pathways with unclear precedence inside the Practice

### 2. Do not let Graphify outputs masquerade as authority

This repo already has strict source-of-truth rules:

- OpenAPI -> sdk-codegen for Oak API types and tool contracts
- ontology extraction / typed consumers for KG work
- explicit attribution for external data sources

Graphify outputs should remain:

- derived
- query-oriented
- navigational
- advisory

Never canonical.

### 3. Do not use it on tiny, self-contained Practice slices

For `.agent/practice-core/` and `.agent/directives/`, Graphify's own detection
logic says the corpus is small enough that a graph may not be needed.

The Practice should not fetishise graphs where careful reading is cheaper.

## Best Immediate Candidates

If there were to be a short pilot, I would pick these in order:

1. **ADR graph pilot**
   - Corpus: `docs/architecture/architectural-decisions/`
   - Goal: central ADRs, latent clusters, path queries between decisions

2. **Practice-support graph pilot**
   - Corpus: selected `.agent/research/` plus related active plans
   - Goal: make research-to-plan-to-implementation paths cheaper to trace

3. **MCP graph lane pilot**
   - Corpus: `packages/sdks/oak-curriculum-sdk/src/mcp/` plus related ADRs/plans
   - Goal: map code/prose alignment in the graph-related SDK surface

I would not start with the whole repo.

## Suggested Practice Wording for Acknowledgement

If Oak adopts any of these ideas directly, the acknowledgement should be
explicit and modest. Suggested wording:

> This workflow is inspired by Graphify by Safi Shamsi, especially its
> corpus-to-graph pipeline, evidence-labelled relationships, and
> query/path/explain interaction model. Oak adapts those ideas to its own
> canonical-first, schema-first Practice and does not treat derived graph
> output as authoritative truth.

Suggested companion link block:

- Repository: <https://github.com/safishamsi/graphify>
- README: <https://github.com/safishamsi/graphify/blob/v4/README.md>
- Architecture notes: <https://github.com/safishamsi/graphify/blob/v4/ARCHITECTURE.md>
- MCP server implementation: <https://github.com/safishamsi/graphify/blob/v4/graphify/serve.py>
- Cache implementation: <https://github.com/safishamsi/graphify/blob/v4/graphify/cache.py>

That acknowledgement could live in:

- an ADR if the concept becomes durable
- `agent-tools/README.md` if implemented as a CLI
- a skill file if introduced as a repeatable workflow

## Attribution Checklist for Future Oak Implementation

Before merging any Graphify-inspired Oak artefact, check:

- Does it name Graphify and Safi Shamsi explicitly?
- Does it link to the upstream repository?
- Does it link to the exact upstream file(s) embodying the borrowed idea?
- Does it say "inspired by" or "adapted from", rather than implying origin?
- Does it preserve Oak's source-of-truth boundaries?

## Bottom Line

Graphify looks highly relevant to this repo, but the forward path is still open.

The most important current conclusion is not a decision. It is a clarified
option space:

- run Graphify explicitly as an external tool, accepting Python 3 as an
  explicit requirement
- adopt selected Graphify code into Oak-native mechanisms
- adopt selected Graphify concepts into the Practice
- combine those paths
- or remain in exploration until a better pilot presents itself

Across all of those paths, Graphify is most promising as:

- a scoped topology tool for large documentation/research estates
- an orthogonal memory layer that includes the existing memory artefacts in
  the graph
- a path/query/explain model for navigating the Practice
- a source of design inspiration for evidence-labelled derived graphs

The strongest current stance is not "Graphify everywhere" and not "Graphify
never". It is:

**pure exploration of multiple paths, with explicit attribution, clear
source-of-truth boundaries, and no premature decision.**

## Notes on Method

This analysis used:

- local reading of Oak repo directives, ADRs, plans, and MCP graph code
- local inspection of the Graphify source tree
- a local run of Graphify's `detect()` logic against selected repo scopes

It did **not** run a full Graphify semantic extraction over this repo. That
would be a separate pilot, and should be done on a deliberately chosen corpus
rather than the whole monorepo.

## Source Material Reviewed

### Upstream Graphify

- <https://github.com/safishamsi/graphify>
- <https://github.com/safishamsi/graphify/blob/v4/README.md>
- <https://github.com/safishamsi/graphify/blob/v4/ARCHITECTURE.md>
- <https://github.com/safishamsi/graphify/blob/v4/graphify/serve.py>
- <https://github.com/safishamsi/graphify/blob/v4/graphify/cache.py>

### Oak repo material

- [`docs/architecture/architectural-decisions/059-knowledge-graph-for-agent-context.md`](../../docs/architecture/architectural-decisions/059-knowledge-graph-for-agent-context.md)
- [`docs/architecture/architectural-decisions/062-knowledge-graph-svg-visualization.md`](../../docs/architecture/architectural-decisions/062-knowledge-graph-svg-visualization.md)
- [`docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md`](../../docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md)
- [`docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md`](../../docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
- [`.agent/practice-core/practice.md`](../practice-core/practice.md)
- [`.agent/practice-core/practice-lineage.md`](../practice-core/practice-lineage.md)
- [`.agent/plans/sdk-and-mcp-enhancements/active/open-education-knowledge-surfaces.plan.md`](../plans/sdk-and-mcp-enhancements/active/open-education-knowledge-surfaces.plan.md)
- [`.agent/plans/sdk-and-mcp-enhancements/active/graph-resource-factory.plan.md`](../plans/sdk-and-mcp-enhancements/active/graph-resource-factory.plan.md)
- [`.agent/plans/sdk-and-mcp-enhancements/active/misconception-graph-mcp-surface.plan.md`](../plans/sdk-and-mcp-enhancements/active/misconception-graph-mcp-surface.plan.md)
- [`.agent/plans/sdk-and-mcp-enhancements/active/eef-evidence-mcp-surface.plan.md`](../plans/sdk-and-mcp-enhancements/active/eef-evidence-mcp-surface.plan.md)
- [`.agent/plans/sdk-and-mcp-enhancements/active/upstream-api-reference-metadata.plan.md`](../plans/sdk-and-mcp-enhancements/active/upstream-api-reference-metadata.plan.md)
- [`.agent/plans/agentic-engineering-enhancements/current/hallucination-and-evidence-guard-adoption.plan.md`](../plans/agentic-engineering-enhancements/current/hallucination-and-evidence-guard-adoption.plan.md)
- [`packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts`](../../packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts)
- [`packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.ts`](../../packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prior-knowledge-graph.ts)
- [`packages/sdks/oak-curriculum-sdk/src/mcp/source-attribution.ts`](../../packages/sdks/oak-curriculum-sdk/src/mcp/source-attribution.ts)
- [`apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts`](../../apps/oak-curriculum-mcp-streamable-http/src/register-resources.ts)
