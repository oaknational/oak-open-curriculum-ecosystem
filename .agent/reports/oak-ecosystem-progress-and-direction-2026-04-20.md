---
title: "Oak Open Curriculum Ecosystem — Progress and Direction"
status: active
last_reviewed: 2026-04-20
audience: mixed (technical EdTech, AI, engineering leadership)
---

# Oak Open Curriculum Ecosystem — Progress and Direction (April 2026)

## Why this exists

Oak National Academy publishes a deeply resourced, fully sequenced UK
curriculum through a public, openly licensed API. The Oak Open Curriculum
Ecosystem is a small, disciplined project that turns that public asset into
AI-native infrastructure: typed SDKs, a standards-compliant MCP server, a
benchmarked hybrid semantic search service, and an MCP App extension
surface. The repository **code** is released under an open MIT licence so
the wider education, EdTech, and AI sectors can build on it directly;
the curriculum **content** that flows through it remains governed by Oak's
upstream API and Bulk Downloads terms (Open Government Licence v3.0 except
where otherwise stated).

The repository is also a working demonstration of what agentic engineering
can deliver when the engineering system around the agents is taken as
seriously as the agents themselves. Every line of code, configuration, test,
and documentation was authored by AI agents, directed by a single engineer.
The human role is system design — defining architectural constraints, quality
gates, and reviewer workflows; then giving direction and corrective
feedback. That this is possible at this quality level is itself a result,
and not a claim about replacing developers: it is a claim about leverage.

What follows is a snapshot of what has been built, what is being built right
now, what is intended next, and the impact the project is set up to have.
There are four reinforcing arenas of achievement here, none of which is the
single headline.

## Achievement arena 1 — Products that move the sector

The Ecosystem ships a working, end-to-end stack that serves three distinct
audiences on their own terms: teachers (via the AI clients they already use),
EdTech and AI developers (via SDKs and MCP), and AI agents themselves (as
first-class consumers of structured curriculum data through MCP).

For **teachers**, there is a fully standards-compliant Model Context Protocol
(MCP) server, deployed and live, that exposes Oak's high-quality, fully
sequenced curriculum directly inside ChatGPT, Claude, Cursor, and any other
MCP-capable client. The server exposes 36 capabilities — 29 tools, 3
resources, and 4 prompts — each generated end-to-end from the upstream
OpenAPI schema (more on this below). The MCP Apps extension infrastructure
(`@modelcontextprotocol/ext-apps`) is in place so that hosts which support
richer interaction can render visual, teacher-facing surfaces; the polished
exemplar of that — a self-directed `user_search` UI — is the next product
delivery (see "Currently in flight" below). The MCP App widget itself is
already a full React application, built by Vite and embedded as a committed
TypeScript constant, served as `text/html;profile=mcp-app` with Content
Security Policy metadata and Windows Forced Colours Mode support; a
session-start proxy fires a brand banner for the human user while delivering
structured text content to the AI agent from the same response.

For **EdTech and AI developers**, the same MCP server, plus the underlying
SDKs, makes Oak's curriculum straightforward to bring into their own
products, IDEs, and agent workflows. Schema-driven generation, typed
clients, and standards-compliant tool descriptors remove most of the
hand-built client, validation, and integration work that downstream teams
would otherwise carry — materially lowering the cost of building on Oak.

Underneath both audiences sits a **hybrid semantic search service** built on
Elasticsearch Serverless from Oak's bulk data, with all the code needed to
recreate it for internal or external use. The search system implements
four-way Reciprocal Rank Fusion — BM25 plus ELSER across both content fields
and structure fields — with an additional experimental reranking layer. It
has been benchmarked through a formal ground-truth protocol using a
known-answer-first methodology: find rich curriculum content, extract all
data, derive a natural-teacher query that cannot match on title alone, then
lock in metrics. Ground truths exist across four indices (lessons, units,
threads, sequences) covering 30 subject-phase pairs; early results show
strong retrieval quality, with the system reliably surfacing the correct
lesson or unit in the top results for well-formed teacher queries. The
ground-truth and evaluation systems continue to be refined. A
`STAGE_CONTRACT_MATRIX` embedded in source code tracks which code module
owns each Elasticsearch field at each of five ingest stages and one
retrieval stage — data lineage that is normally the province of dedicated
data-platform teams, here co-located with the product code it governs.

Authentication and authorisation are managed through Clerk, implementing the
MCP 2025-11-25 authorisation specification precisely: health and
well-known paths bypass Clerk, but all MCP methods including `initialize` go
through it; asset downloads use HMAC signatures with expiry, entirely
bypassing Clerk for that route family. The OAuth proxy layer has full
OpenTelemetry span instrumentation, timeout handling, and discriminated-union
error types. The service is currently in **invite-only alpha** at
`curriculum-mcp-alpha.oaknational.dev`; the M1 release was tagged v1.0.0
(the codebase is currently at v1.5.0 as of April 2026).

## Achievement arena 2 — Developer tooling that lowers the cost of building on Oak

The most quietly consequential thing in the repository may be the
code-generation pipeline.

The **Curriculum SDK** is a strict, type-safe TypeScript client for Oak's
public API and bulk data. It is *generated* end-to-end from the upstream
OpenAPI schema — when Oak updates the API, the SDK (types, validators, type
guards, and tool metadata alike) regenerates on its next build. Crucially,
the generation goes further than types: `pnpm sdk-codegen` simultaneously
emits TypeScript types, Zod schemas, *and* complete MCP tool files, each
embedding its own validation logic, type guards, and executor functions. The
two-executor pattern sidesteps a genuine TypeScript limitation: dynamic
dispatch on a path/method union creates uncallable types, so the generator
emits one file per endpoint, each with a `ValidRequestParams`-typed executor
and an `unknown`-typed wrapper. The result is that the MCP server contains
almost no hand-written API-shape code at all — a senior engineer reviewing a
tool file will find embedded, generated type guards with `as const` literal
arrays for enum values. Zero runtime schema parsing, zero type assertions,
zero drift. There are no hand-maintained data structures to catch up; any
change in the upstream API fails the build until `pnpm sdk-codegen` is run.
This is enforced as a cardinal rule in the repository: hand-maintained API
data structures are forbidden.

The same codegen pipeline processes per-subject bulk-data JSON downloads and
produces Elasticsearch mappings, knowledge graphs (prior knowledge,
misconception, vocabulary, thread progression), synonym data, and vocabulary
artefacts — all as committed TypeScript constants. Subpath exports
(`/api-schema`, `/mcp-tools`, `/search`, `/bulk`, `/vocab`, `/vocab-data`)
control tree-shaking and avoid loading hundreds of thousands of generated
lines into the TypeScript language server during linting.

The **search SDK** does the same job for the semantic search service, and the
MCP tools that power agent-facing search are themselves generated on top of
it. The result is a clean, layered toolkit — API SDK, search SDK, MCP server
— each of which can be adopted independently or composed together.

For external developers, this means typed, validated, low-friction access to
Oak from day one. For internal teams, it means new Oak capabilities can be
integrated once and then exposed consistently across SDK and MCP surfaces.
That property — *integrate once, expose everywhere, and remix fast* — is
the engine behind the Ecosystem's leverage thesis: small, independent,
composable parts drastically lower the cost of adopting Oak data and
correspondingly raise the rate at which new capabilities can be assembled
on top of it.

## Achievement arena 3 — Engineering as exemplar

The engineering bar in this repository is deliberately high, because in
agentic development low quality compounds fast and the system can collapse
suddenly when disorder becomes dominant. Several things are notable, and
some are genuinely ahead of standard industry practice.

**Disciplined, enforced architecture.** Core packages do one job and have no
dependencies. Libraries compose core packages but never import each other —
when functionality needs to be shared across libraries, it is factored out
into a new core package. Apps consume libraries and export nothing. This
dependency discipline is not just a convention: `dependency-cruiser` runs on
every commit (promoted to all four quality-gate surfaces after resolving 87
violations, including 44 circular dependencies, to zero) and the build fails
on any violation. The architecture stays honest because it is tested, not
trusted.

**Adapter-wrapped third-party services.** Every third-party integration —
Sentry, Elasticsearch, Clerk — sits behind a small local adapter. The two
benefits compound: if any service is unauthorised or unavailable the rest of
the system keeps working, and switching providers later is cheap rather than
catastrophic.

**Result-type error discipline.** The `@oaknational/result` package enforces
a discriminated-union error-handling pattern across the codebase. The
directive is explicit: do not throw, use the Result pattern. Error variants
(`not_found`, `server_error`, `rate_limited`, `network_error`) are
discriminated at the type level, and TypeScript's `never`-based
exhaustiveness checking ensures that adding a new error kind causes compile
failures at every switch — forcing every call site to handle it. This degree
of compile-time error-handling discipline is uncommon in Node.js codebases.

**Non-mutating environment resolution.** Instead of `dotenv.config()`
mutating `process.env`, a five-source hierarchy (repo `.env` → repo
`.env.local` → app `.env` → app `.env.local` → `process.env`) is processed
with non-mutating `dotenv.parse()`. The resolved config is a discriminated
union (`AuthEnabledRuntimeConfig | AuthDisabledRuntimeConfig`) so the type
system *statically guarantees* Clerk key presence downstream of the
auth-enabled branch. An entire class of runtime null checks is eliminated
by construction.

**Non-bypassable redaction barrier.** Every telemetry fan-out path (Sentry
`beforeSend`, `beforeSendTransaction`, `beforeSendSpan`, `beforeSendLog`,
`beforeSendMetric`, breadcrumb filtering) must apply the shared redactor
before any sink receives data. Rather than maintaining an enumerated list of
paths — which reads as exhaustive but becomes a footgun when new fan-out
paths are added — the architecture enforces a closure property: any new path
that does not wire the redactor and add a fixture-mode conformance test is a
violation detectable by code review and lint. The `@oaknational/observability`
package is browser-safe by construction, enforced by a `no-node-only-imports`
structural test.

**MCP-aware observability.** Since all MCP traffic flows through a single
`/mcp` endpoint with method in the body (JSON-RPC-over-HTTP), standard
Sentry transaction grouping collapses everything into one bucket. The
integration extracts MCP methods from breadcrumb and event data and
synthesises readable transaction names like `POST /mcp tools/call`. This is
protocol-aware observability that recognises MCP's transport shape, not
generic HTTP middleware.

**Compile-time accessibility compliance.** The design token build script
reads DTCG JSON tokens, generates CSS, then validates every declared
contrast pairing against WCAG AA thresholds before the build succeeds.
Triadic entries (foreground/middle/background) expand to three pairwise
checks. Accessibility regressions are structurally impossible to ship.

**More forms of automated checking than most projects carry.** The
repository runs approximately 20 distinct quality-gate steps in `pnpm check`
— secret scanning, codegen, build, type-check, doc-gen, lint, unit tests,
widget tests, E2E tests, UI tests, accessibility tests, widget visual tests,
widget accessibility tests, smoke tests, shell lint, sub-agent validation,
portability parity, dead-export detection, dependency-graph enforcement, and
markdown lint. These run across four named surfaces (pre-commit, pre-push,
CI, and aggregate) with a designed invariant: pre-push and CI run the exact
same check set, so a CI-only failure is definitionally an environment issue,
never a missing check. The orthogonality of the gates is the point: they
catch different classes of drift, and together they prevent low-grade entropy
from accumulating.

**Documentation as a first-class surface.** The repository carries 158+
Architectural Decision Records so that "why was it done this way?" is almost
always answerable, a dedicated onboarding flow for new contributors,
TSDoc-driven generated docs, and a progressive-disclosure documentation
hierarchy from root README down to per-workspace TSDoc. Network-free CI is
formalised as doctrine: no PR-check pipeline may make real network calls,
enforced by code review and a future depcruise lint rule on workflow files.

In short, one of the explicit roles of this repository is to be an exemplar
of good software engineering practice — and the evidence for that claim is
in the mechanisms, not just the aspiration.

## Achievement arena 4 — Agentic engineering, and the Practice

The path from "agents write code" to "agents produce a production system
under governance" ran through several pioneering steps that are now
consolidated into one framework. Several of those steps, and several
properties of the resulting framework, are genuinely novel — they have no
clear precedent in published agentic engineering practice.

**Guardrails as part of the agent loop.** Traditional engineering guardrails
— automated tests, linters, type-checkers — were repurposed as first-class,
reliable feedback for agents, not just for humans. Failing a gate is an
event the agent can observe, reason about, and correct, and gates are wired
into the workflow at the right points to make that loop tight.

**Stabilising frameworks for longer-horizon work.** Several frameworks were
built and tested for the things long-running agentic work tends to break:
session-state memory, learning loops, reusable rules, plan lifecycles, and
continuity across sessions.

**The Practice.** All of the above was then consolidated, extended, and
hardened into *the Practice* — a complete agentic engineering framework
covering research, planning, development, validation, release, guardrails,
multiple forms of memory and feedback loop, and self-improvement. Three
properties matter, and each is backed by a specific mechanism:

1. **It is portable.** A small *Practice Core* — a bounded package of eight
   files including the core practice document, the lineage and bootstrap
   guides, a provenance chain, and a changelog — physically travels between
   repositories through a deliberate *plasmid exchange mechanism*. The
   provenance chain (`provenance.yml`) records every repository the package
   has visited, with each entry capturing the purpose and context that shaped
   that evolution. Receiving repos get a formal inbox (the Practice Box),
   checked at session start and during consolidation, with a nine-step
   integration protocol. Integration operates at *concept level, not file
   level* — two repos may implement the same idea under different names, and
   the system compares concepts rather than diffing files. The Practice Core
   has already traversed six distinct repositories; each added its own
   context and learnings. There is no established pattern elsewhere for
   portable self-improving governance that learns from each deployment and
   returns changed.

2. **It is self-improving**, through a carefully engineered knowledge flow
   with fitness functions at every stage. Raw session observations are
   captured continuously in a *napkin* (which triggers rotation at a line
   ceiling). Cross-session rules are distilled into a *distilled memory*
   read at every session start. Recurring solutions graduate into *pattern
   instances* (repo-local, with a four-criterion barrier to entry) and then
   into *general patterns* (ecosystem-agnostic, authored fresh when
   instance accumulation makes the abstraction legible — 75 patterns exist
   today across code, architecture, process, testing, and agent
   infrastructure). Patterns that prove durable graduate into ADRs. Portable
   governance decisions graduate into PDRs that travel with the Practice
   Core. The self-improvement is also *distributed*: because the exchange
   mechanism sends the Core between repos, improvements proven in one
   Practice repo travel back into the others. The rate of improvement is
   designed to accelerate as more repositories contribute, because each
   repo surfaces different learnings shaped by different work.

3. **It is self-referential.** Rules about rule creation, patterns about
   distillation quality, and learnings about consolidation all flow
   through the same loop. Governed documents declare their own health
   targets in YAML frontmatter, and a three-zone fitness model
   (healthy/soft/hard/critical, where critical = hard limit × 1.5 and
   always blocks) applies to the Practice's own documents — preventing
   documentation bloat during cross-repo exchange and triggering a
   mandatory post-mortem if the critical zone is breached.

Beyond these three headline properties, several specific mechanisms within
the Practice are worth naming because they are, to the best of our
knowledge, original contributions:

**Three-type continuity model.** Session continuity is decomposed into three
independently-failing types: *operational* (can the next session act?),
*epistemic* (does the next session carry the right uncertainty?), and
*institutional* (does learning outlive this session?). Most agent continuity
systems preserve only operational state; losing epistemic state causes the
next session to resume with false confidence. The lightweight/deep split
(quick handoff vs. deep consolidation with an explicit gate between them)
addresses a real failure mode: a single heavy closeout ritual either gets
skipped entirely or relied on without question, oscillating between the two
failure states.

**Friction-ratchet counter.** When three or more independent friction signals
fire against the same solution shape during code review — lint size cap hit,
dependency cycle detected, reviewer finding that added code rather than
removing it, ADR amended to match implementation rather than vice versa,
vendor-rule exception added — the system escalates from individual-fix mode
to solution-class review. A sunk-cost phrase detector flags specific language
patterns ("we'd have to throw away X", "we've already committed to this
approach") as reasoning that must be named explicitly before being accepted.

**Cross-platform session takeover.** The `cursor-session-from-claude-session`
CLI reads Claude's local session history, scores sessions against keyword
needles with a weighted matching system (display match 3, sub-agent content
2, file history 2, time-window 1), and generates a takeover bundle
containing a formal reintegration contract with named owner, acceptance
signal, and stop/escalate rule.

**Continuity as monitored infrastructure.** A health probe checks the
continuity prompt file for staleness and structural completeness. Agent
infrastructure health — portability parity, state freshness, continuity
contract presence — is aggregated into a single pass/warn/fail report via
`pnpm agent-tools:claude-agent-ops health`. Agent session continuity is a
monitored property of the system, not an informal habit.

**Automated portability enforcement.** A CI gate verifies that every
canonical command has adapters on all four platforms (Cursor, Claude Code,
Gemini CLI, .agents/) and every reviewer agent has adapters on all three
agent platforms. Drift fails the build. Platform adapter files are typically
seven lines: frontmatter plus a pointer to the canonical template. The
substance never duplicates. 19 specialist sub-agent reviewer types are
defined, each following a three-layer prompt composition architecture
(components, templates, consumer wrappers) with the same dependency-direction
discipline applied to product code.

**Experience records.** The repository maintains `.agent/experience/` — a
corpus that records not technical documentation but *what it was like*.
Qualitative shifts in understanding, surprises that changed mental models,
moments of recognition. Entries have been maintained over eight months by
both human and AI contributors. Whether read as genuine phenomenological
reports or as useful metaphors, maintaining this record as engineering
infrastructure has no clear precedent in agent system design.

**Deliberate recursive grounding.** The GO workflow enforces an
ACTION/REVIEW/GROUNDING cadence in which every third task is literally:
re-read the GO workflow and re-apply it, including re-adding this
instruction. The comment in the source is "the recursion is the point." This
is a designed drift-prevention mechanism: the cadence reinjects itself into
the task list to prevent long sessions from losing their operating frame.

## Currently in flight

Public alpha (M2) is concentrated in two named lanes. The first —
**observability** — is largely delivered: a Sentry and OpenTelemetry
integration grounded in a five-axis observability principle (engineering,
product, usability, accessibility, security; ratified in ADR-162). Runtime
integration is in place, including the MCP-aware transaction rewriting
described above; what remains is credential provisioning and a deployment
evidence bundle for the HTTP MCP server.

The second lane — the **user-facing MCP App search experience** — has been
scoped and designed but is not yet built. It will be a polished,
self-directed semantic search surface for teachers that simultaneously
demonstrates the full capabilities of the search service and exemplifies
how the MCP Apps extension should be used.

The first **knowledge graph alignment audit** has now completed — a
canonical overlap check between the formal Oak Curriculum Ontology (RDF/OWL/
SKOS/SHACL, maintained in `oaknational/oak-curriculum-ontology`) and the
search-facing records, with a deliberate direct-use-first stance: any
commitment to Neo4j, Stardog, or another serving platform is held back
until a real direct-use baseline and prototype comparison exist. The audit
identified which join keys are reliable (thread slug) and which are not yet
(programme, unit, lesson — different identifier systems). The result feeds
a broader knowledge-graphs integration arc (Oak ontology, misconception
graph, EEF evidence) rather than locking it.

In parallel, the **Practice itself** continues to evolve: governance-plane
integration, hallucination and evidence-guard adoption, a Reviewer Gateway
upgrade, and an expanding roster of specialist sub-agent reviewers
(Elasticsearch, MCP, Clerk, and Sentry shipped; Express, web/API
security, privacy and web/API GDPR, planning, TDD, and DevX held in the
deferred backlog with explicit promotion triggers). Mutation testing is
queued as a pre-beta gate.

## Next directions

In the near term, closing the two M2 lanes opens **public alpha** to anyone
on the internet. Beyond that, **public beta** (M3) is scoped around
production Clerk migration (social providers, public sign-up, edge rate
limiting), operational alerting on the observability foundation, and
hardening of the exemplar teacher-facing UI. Research and planning already
exist for a follow-on PostHog integration as part of the broader
observability and product-analytics surface; whether it lands inside or
after the public-beta window is an open sequencing decision rather than a
settled scope item.

Two longer arcs sit beyond the milestone gates. The first is to make the
**search service available from the upstream Oak API itself**, so its
discovery affordances flow into Oak's primary product surface and into
every downstream tool that already consumes that API. The second is to keep
**deepening the Practice and its memory and continuity systems**. Agents
do the work with the repository, so the project context must live *in* the
repository. Institutional knowledge about what was done no longer sits
mostly with developers — they are doing less and less of the actual coding.
The Practice is how that institutional knowledge continues to exist, and
how it stays useful to both developers and agents.

## The research pipeline — an option portfolio, not a backlog

The repository carries a substantial body of research and planning that
deserves explicit description, because its depth and structure are
themselves a form of value.

**Scale.** 750 plan files across 10 named collections (SDK and MCP
enhancements, semantic search, knowledge-graph integration, agentic
engineering enhancements, architecture and infrastructure, security and
privacy, developer experience, user experience, observability, compliance).
173 research files covering knowledge graphs, Elasticsearch and Neo4j
architecture, open curriculum concepts, Finnish curriculum APIs, the EEF
Toolkit, auth systems, and more. 33 completed plans are indexed. 75
reusable patterns in the institutional memory.

**Structure.** Plans have explicit lifecycle lanes (active, future, icebox,
archive) with formal promotion triggers and dormancy rules. The
semantic-search future backlog alone is organised into nine numbered
workstream folders covering schema authority, retrieval quality, vocabulary
and semantic assets, runtime governance, MCP consumer integration, and an
evaluation-and-evidence track. Nothing is promoted into an execution plan
without an explicit trigger; nothing is dropped without being iceboxed with
a rationale. Ideas like fan-out/fan-in multi-agent MCP servers live in the
icebox with explicit conditions for promotion rather than in informal notes.

**Notable future directions.** Several specific directions are scoped with
enough structure to be promotable to executable plans:

- **International curriculum interoperability.** The Finnish National Agency
  for Education (Opetushallitus) public curriculum APIs — ePerusteet,
  TOTSU-Amosaa, OPS-Ylops — are mapped as a real second consumer of the
  OpenAPI → SDK → MCP pipeline. This is not a hypothetical; it is a scoped
  pipeline-generalisation demonstration contingent on a named prerequisite.

- **EEF evidence integration.** A three-layer architecture (MCP ecosystem
  as transport, Oak Curriculum Ontology as structural bridge, EEF Toolkit
  as evidence source) with a *null-impact guard* — a mechanism to prevent
  recommending teaching approaches with no measurable effect. The plan
  credits named EEF research authors and flags contributor licence
  obligations.

- **Knowledge-graph surfaces.** Six active plans covering a graph resource
  factory, misconception graph, EEF evidence surface, National Curriculum
  knowledge taxonomy, education skills, and agent guidance consolidation —
  plus future plans for direct ontology use, graph-serving prototypes, and
  Stardog vs. Neo4j comparison.

- **Semantic search maturation.** Nine workstream folders covering MFL
  multilingual embeddings, transcript mining, graph-RAG integration,
  natural-language paraphrase surfaces, and a dedicated evaluation-and-
  evidence track.

**Contributor attribution.** Plans record named individuals (Mark Hodierne
for the ontology, John Roberts for the EEF MCP prototype, Gareth Manning
for education skills) and treat their upstream work as first-class
dependencies with licence obligations, not just copy-paste sources.

This is not bloat or a useless backlog. Nothing is promoted into a plan
without explicit triggers to activate or drop it, multiple plan classes
each carry their own validation mechanism, and dormant plans either fire,
evolve, or close on a schedule. The depth is governed — and the governed
depth is enough to give the project a multi-year option pipeline rather
than a single roadmap.

## What is deliberately out of scope (for now)

This is a deliberate scope boundary worth naming explicitly, because the
omission is principled rather than incidental. The Ecosystem's current
product surface is for **teachers, developers, and AI agents acting on
their behalf**. It does not address **tutoring, learner-facing chat, or
any other surface where learners (including children) would interact with
the system directly**. Learner-facing AI carries safeguarding, moderation,
and pedagogical-framing requirements — alongside the evaluation and
risk-control work that has to come before any learner-direct scope can be
promoted — which materially exceed what an adult-facing infrastructure
project needs to satisfy. Those requirements deserve their own separately
governed programme — research, ADRs, threat modelling, and policy work —
before any product capability is built on top of them. Within the current
roadmap horizon, no learner-facing features are planned; if and when they
are considered, they will sit behind that separate programme rather than
being grafted onto this one.

## Impact

The intended impact path moves through three orders of effect. First, Oak
itself can deliver SDK, MCP, and search infrastructure safely and quickly
under the Practice — already true today. Second, Oak teams and external
developers can build new things faster on typed APIs, search primitives,
MCP access, and (later) graph-augmented navigation — already enabled, with
public-alpha and public-beta opening adoption. Third, the tools and
workflows those builders create *can* reduce teacher planning workload and
improve teaching quality — Oak's stated mission, and the outcome the first
two orders exist to serve.

The MIT licence on the **code** is a deliberate amplifier across all three
orders. Every adopter is a potential contributor of patterns, evidence, and
improvements back into the Ecosystem; every external use of the framework
should make the framework itself more robust. Combine that with the
self-improving Practice that propagates between repositories, and the value
of the investment is designed to compound as reuse, evidence, and
contributions accumulate.

There is, candidly, a lot more in here than first appearance suggests. The
claims in this report — about self-improvement, portability, compile-time
safety, governance, and search quality — are backed by specific, inspectable
mechanisms throughout the repository, not by aspiration. The repository is
built to teach itself to anyone who reads it; the mechanisms are the
evidence.

---

*Figures, milestone states, and lane statuses in this report are accurate
as of April 2026. For the live state of any lane, the
[high-level plan on `main`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/main/.agent/plans/high-level-plan.md)
is the source of truth.*
