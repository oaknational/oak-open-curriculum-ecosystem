[![AI Code Assurance](https://sonarcloud.io/api/project_badges/ai_code_assurance?project=oaknational_oak-open-curriculum-ecosystem)](https://sonarcloud.io/summary/new_code?id=oaknational_oak-open-curriculum-ecosystem)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=oaknational_oak-open-curriculum-ecosystem&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=oaknational_oak-open-curriculum-ecosystem)

# Oak Open Curriculum Ecosystem

The [Oak National Academy Open Curriculum](https://open-api.thenational.academy/)
becomes AI-native infrastructure through four co-equal value streams: a
[Model Context Protocol](https://modelcontextprotocol.io/docs/getting-started/intro)
(MCP) [app](https://modelcontextprotocol.io/extensions/apps/overview) that puts
[Oak inside ChatGPT, Claude, Copilot, and Gemini](docs/strategy/stream-mcp-app.md) —
the AI assistants teachers already use; [engineering tools](docs/strategy/stream-engineering-tools.md)
for the wider ecosystem to build with — a generated, type-safe TypeScript SDK, a semantic
search service, graph tools generated from Oak data, and evidence surfaces grounded in the
wider education sector; an [openly documented framework for agentic engineering](docs/strategy/stream-agentic-framework.md)
that delivers AI-amplified innovation without trading away rigour or excellence; and the
[Oak Innovation Kit](docs/strategy/stream-innovation-kit.md), which exists to turn those
latent capabilities into excellent working experiences that expand understanding, generate
trustworthy evidence, and compound what real use proves reusable.

> **We're turning Oak's open curriculum into AI-native infrastructure — for teachers and the wider ecosystem — and transforming how we build and curate digital products, agent-first, to do it well.**

Everything here serves the same ends: helping teachers find, adapt, and use
high-quality curriculum resources; helping the organisations that serve
schools build better tools, faster; and giving the wider world of education —
sector bodies, edtech, and the AI platforms now working in classrooms — open
components, open data access, and an openly documented engineering practice
to build on. Public goods, built in the open.

**Building capabilities.** Representing knowledge as graphs is a strength we apply
across domains — Oak's curriculum, the EEF evidence surface, AI-enhanced
development, and how we run our own work.
The Oak Innovation Kit is intended to bring these capabilities, the design system, and the
agent-first Practice together to make ambitious possibilities tangible and testable.

**Vision and strategy**: Start with [VISION.md](VISION.md) — the two-part vision (Oak's curriculum made AI-native for teachers and the ecosystem; and how we build and curate it, agent-first). Then the [strategy](docs/strategy/README.md) — the diagnosis, the four value streams, and how we'll know it's working. For the live delivery roadmap, see the [release-planning corpus](.agent/plans/README.md) (the prior estate is conserved in [the 2026-07 backlog](.agent/plans-backlog-2026-07/BACKLOG.md)).

---

---

**Current status: Public Beta** — The MCP app server is live at `mcp.thenational.academy/mcp`. Anyone can create an Oak account to connect; there is no invitation or allowlist.

---

---

[![MIT Licence](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENCE)
[![OGL Data Licence](https://img.shields.io/badge/data_licence-OGL-green.svg)](LICENCE-DATA.md)

This is how we make Oak's openly licensed, fully sequenced, fully resourced
curriculum easier to build on. We provide the Oak Curriculum SDK; the canonical
MCP server, both an end-user app surface and a developer tool; the OpenAPI-to-MCP
server pipeline; hybrid semantic search; and knowledge-graph surfaces — modular
building blocks for education applications.

We also explore what's possible with MCP Apps in the AI assistants teachers already use —
the [canonical target platforms](docs/strategy/stream-mcp-app.md): ChatGPT, Claude, Copilot,
and Gemini, and others. AI
assistants can search Oak's curriculum and explore lessons, units, threads,
sequences, and other structured content — helping teachers find, adapt, and use
high-quality curriculum resources.

We also develop a reusable, self-improving Practice for agentic-first
engineering: a plain-text framework that lets agents from major vendors
collaborate, keep learning, and keep operational knowledge in the repository
where it stays useful.

Putting Oak inside the AI assistants teachers already use, giving the wider
ecosystem the tools to build with Oak curriculum content, openly documenting the
Practice that delivers AI-enhanced innovation, and using the Innovation Kit to make
new possibilities tangible and testable are four co-equal value streams — none
secondary. **Beyond Oak-hosted products**, we publish a
deliberate set of reusable sector components — the OpenAPI-to-MCP pipeline,
SDK-generation patterns, hybrid-search tooling, MCP and MCP App scaffolds, graph
projection conventions, and the openly documented Practice — so other
organisations can lower the cost of building curriculum-aware applications
without starting from scratch. The canonical inventory and scope for each asset
are set out in [What This Repo Provides](#what-this-repo-provides) below.

**Product owners, school leaders, non-technical evaluators** — you don't need to read the technical content below. Start with:

- [VISION.md](VISION.md) — the two-part vision: what this project delivers (for teachers and the wider ecosystem), and how we build and curate it agent-first; why it matters and the investment case
- [Strategy](docs/strategy/README.md) — the diagnosis, the four value streams (app, tools, framework, Innovation Kit), the alignment to Oak's goals, and how we'll measure success
- [Curriculum Guide](docs/domain/curriculum-guide.md) — Oak's curriculum structure explained in plain language
- [Progress update (April 2026)](.agent/reports/oak-ecosystem-progress-update-2026-04-20.md) — what has been delivered, what is next, and why it matters; newer reports land in [.agent/reports/](.agent/reports/README.md)

## Developers and AI agents

- **New here?** — open an agent session and run `/oak-under-the-hood`; the orientation
  lens works out whether you want a quick answer, an overview, or a guided
  hands-on walk that can set up your machine, and meets you there
- **Developers** — continue to [Quick Start](#quick-start) below, then
  [Working with this Repo for Devs](docs/engineering/working-with-this-repo-for-devs.md): the
  practical guide to how you direct the work, what the agents do around you, and what keeps
  the quality honest
- **Oak teammates joining via Claude Code (or another AI coding agent)** — Quick Start as above, then [MCP servers for contributors](docs/engineering/mcp-servers-for-contributors.md) for the sanctioned MCP set
- **AI agents** — read the [start-right-quick workflow](.agent/skills/start-right-quick/shared/start-right.md), then [AGENT.md](.agent/directives/AGENT.md), then scan the [five foundational ADRs](docs/architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes) — the architectural source of truth

### Working with agents

This repository is designed for agentic development. Start agent sessions by
naming the relevant start-right workflow and the outcome you want. The
start-right workflow grounds the agent in the repo's live rules, plans,
claims, comms, and git state before it acts.

For Claude Code, Cursor, Gemini, or another slash-command surface, a single
agent session might start with:

```text
/oak-start-right-quick find the most frequent user-impact bug from Sentry,
create a plan for resolving it, then execute it
```

For a coordinated team:

```text
/oak-start-right-team you are part of a team of agents working on the
knowledge graph enhancement plan, please continue
```

For existing threads, prefer a pointer to the thread continuation record rather
than restating live state in the prompt:

```text
/oak-start-right-team continue agentic-engineering-enhancements from
.agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md.
Treat this opener as a hypothesis until live grounding confirms it.
```

In Codex, use the same skill names through `/skills` or `$skill-name` mentions:

```text
$oak-start-right-team continue agentic-engineering-enhancements from
.agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md.
Treat this opener as a hypothesis until live grounding confirms it.
```

Use `oak-wrap` at the end of every session so the next
agent inherits the real state rather than a chat transcript guess. In team
sessions, `oak-start-right-team` should name the closeout owner; only that owner
runs the full handoff, while other team members leave boundary-scoped closeout
notes.

**Browse the documentation by section**:
[Foundation](docs/foundation/README.md) (vision and the agentic
engineering system) ·
[Governance](docs/governance/README.md) (development, TypeScript,
testing, accessibility, security) ·
[Architecture](docs/architecture/README.md) (ADRs, OpenAPI pipeline,
provider system) ·
[Design](docs/design/README.md) (design decision records for the
design system) ·
[Engineering](docs/engineering/README.md) (workflow, tooling,
extending) ·
[Operations](docs/operations/README.md) (env vars, troubleshooting, [runbook index](docs/operations/README.md#runbook-index)) ·
[Domain](docs/domain/README.md) (curriculum data) ·
[Docs index](docs/README.md).

## What This Repo Provides

Three capabilities, powered by three open education data sources:

| Capability          | What it does                                                                                                                                                    | Packages                                                                                         |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Curriculum SDK**  | Typed TypeScript access to Oak's curriculum API — types, Zod validators, and MCP tool metadata, all generated from the OpenAPI schema                           | [`oak-curriculum-sdk`](packages/sdks/oak-curriculum-sdk/)                                        |
| **MCP Servers**     | AI assistants and developer tools can search, browse, and fetch curriculum data through [Model Context Protocol](https://modelcontextprotocol.io/) and MCP Apps | [`mcp-http`](apps/oak-curriculum-mcp-streamable-http/) (canonical server workspace, web, Vercel) |
| **Semantic Search** | Hybrid lexical + semantic retrieval across lessons, units, threads, and curriculum sequences using Elasticsearch with reciprocal rank fusion                    | [`oak-search-cli`](apps/oak-search-cli/), [`oak-search-sdk`](packages/sdks/oak-search-sdk/)      |

Together, shipped products and reusable sector-facing components are the pillars
of _compositional curriculum intelligence_, framed in depth in [VISION.md](VISION.md); hosted surfaces versus reusable components are distinguished in [Sector reusable components](#sector-reusable-components) below.

### Sector reusable components

Partners and external builders should anchor adoption claims on the reusable
fabric enumerated here — the OpenAPI-to-MCP pipeline, SDK generation patterns,
hybrid-search tooling, MCP/MCP App scaffolds, graph projection conventions, and
the Practice — versus Oak-hosted APIs and deployments. Supporting playbooks and partner obligations
grow from [.agent/plans-backlog-2026-07/sector-engagement/current/sector-reusable-components-adoption.plan.md](.agent/plans-backlog-2026-07/sector-engagement/current/sector-reusable-components-adoption.plan.md).

### Data Sources

This repository integrates three open education data sources, each answering a different question that teachers ask:

| Source                                                                                                                                                         | What It Provides                                                                                                                                             | Licence                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| [Oak Open Curriculum API](https://open-api.thenational.academy/)                                                                                               | Lessons, units, threads, sequences, quizzes, and transcripts — openly licenced, fully sequenced, fully resourced curriculum content                          | [OGL v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/) |
| [Oak Curriculum Ontology](https://github.com/oaknational/oak-curriculum-ontology)                                                                              | Oak's formal semantic representation of curriculum structure aligned to the National Curriculum for England (2014), using W3C standards (RDF/OWL/SKOS/SHACL) | OGL v3.0 (data) + MIT (code)                                                           |
| [Education Endowment Foundation (EEF) Teaching and Learning Toolkit](https://educationendowmentfoundation.org.uk/education-evidence/teaching-learning-toolkit) | 30 research-synthesised teaching approaches with quantified impact, cost, and evidence strength ratings                                                      | Attribution required                                                                   |

Together these sources enable **evidence-grounded curriculum discovery**: AI
agents can search for content (Oak API), understand where it fits in the
curriculum structure (ontology), and recommend evidence-backed teaching
approaches (the EEF Toolkit — openly licensed material from an independent,
external organisation, brought together with Oak's own). They also equip internal
Oak teams and external builders with
high-quality integration primitives spanning curriculum API access, MCP, search,
ontology alignment, and evidence surfaces. Organisational reuse of Oak's delivery
patterns—not merely calling the upstream REST API—is set out above in
[Sector reusable components](#sector-reusable-components). See
[ADR-157](docs/architecture/architectural-decisions/157-multi-source-open-education-integration.md)
for the integration architecture and [LICENCE-DATA.md](LICENCE-DATA.md) for
full licence terms.

### MCP Server Capabilities

The MCP servers expose curriculum data through the three [MCP primitive types](https://modelcontextprotocol.io/docs/learn/server-concepts):

- **Tools** (model-controlled): 37 curriculum tools (24 generated from the OpenAPI schema plus 13 aggregated compositions) covering search/browse/fetch flows, orientation via `get-curriculum-model`, the curriculum graph tools (`get-thread-progressions` for year-ordered sequences, `get-prior-knowledge-graph`, `get-misconception-graph`, `get-keyword-graph`), EEF evidence, `download-asset`, and the user-search pair. The AI decides when to use them. See [`apps/oak-curriculum-mcp-streamable-http/README.md`](apps/oak-curriculum-mcp-streamable-http/README.md) as the canonical count.
- **Resources** (application-controlled): The curriculum model, a getting-started guide, and the EEF evidence-interpretation guide as pre-loadable context for MCP clients that support resource injection. The curriculum graphs are deliberately tool-only — served anchored and bounded by the graph tools rather than as whole-corpus dumps.
- **Prompts** (user-controlled): Seven workflow templates (`find-lessons`, `lesson-planning`, `explore-curriculum`, `learning-progression`, `curriculum-mapping`, `adapt-lesson`, `continue-progression`) that guide users through common curriculum tasks — including the position-anchored entry point: state what your class just covered and plan the next step from Oak's sequence, building on what came before.

The standalone stdio workspace has been retired and removed. The
canonical MCP server workspace is now
[`apps/oak-curriculum-mcp-streamable-http/`](apps/oak-curriculum-mcp-streamable-http/README.md);
any future stdio support is expected to come from a separate stdio
entry point generalised from that workspace rather than a parallel
standalone app. See the
[HTTP MCP server README](apps/oak-curriculum-mcp-streamable-http/README.md),
[ADR-123](docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md),
and
[ADR-128](docs/architecture/architectural-decisions/128-stdio-workspace-retirement-and-http-transport-consolidation.md).

## Quick Start

### Prerequisites

- **Node.js 24.x** — install via [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm), then run `nvm use` or `fnm use` to activate the version in `.nvmrc`
- **pnpm** — run `corepack enable` (ships with Node.js) to auto-install the pinned version
- **bun** (optional, for `pnpm dev:widget-in-host`) — install via [bun.sh](https://bun.sh/docs/installation)
- **lsof** (optional, for `apps/oak-curriculum-mcp-streamable-http/scripts/restart-dev-server.sh`) — pre-installed on macOS; on Debian/Ubuntu use `sudo apt install lsof`; source/build instructions at [github.com/lsof-org/lsof](https://github.com/lsof-org/lsof)
- **GNU `timeout`** (optional, for the agent-collaboration comms watcher's self-termination guard) — the canonical watcher is wrapped in `timeout`/`gtimeout` so a watcher whose agent has gone away cannot linger as an orphan process. macOS: `brew install coreutils` (GNU coreutils; the binary installs as `gtimeout`); Debian/Ubuntu and most Linux ship it with GNU coreutils as `timeout` (`sudo apt install coreutils` if missing). The watcher runs un-guarded if neither binary is on `PATH`, so it is needed only to enforce the dead-watcher cleanup (see [`comms-all-channels-watcher`](.agent/rules/comms-all-channels-watcher.md) and friction F-101).
- **sentry** (optional, for dev-time Sentry issue triage, event inspection,
  and Sentry Seer) — install only when you need local Sentry operator tooling;
  see [Sentry CLI usage](docs/operations/sentry-cli-usage.md) for the
  `sentry-cli` vs dev-`sentry` split and workspace invocation details.
- **Linear plugin** (Claude Code users) — issue tracking through Linear's
  hosted MCP server. The tracked [`.claude/settings.json`](.claude/settings.json)
  enables `linear@claude-plugins-official`, so Claude Code offers to install it
  on first launch in this repository — accept the prompt, then authenticate with
  `/mcp`. The full sanctioned MCP set is listed in
  [MCP servers for contributors](docs/engineering/mcp-servers-for-contributors.md).
- **MCPJam** (optional, for MCP server development and validation only) —
  inspects, runs conformance checks, and authors/runs evals against the MCP
  server; backs the optional `mcpjam` entry in `.mcp.json`. Installed
  by `pnpm install`; run commands with `pnpm exec mcpjam <command>`, the inspector
  GUI with `pnpm dlx @mcpjam/inspector@latest`, and authenticate for the hosted
  eval and project features with `pnpm exec mcpjam login`. The companion
  `mcp-inspector` skill installs at the machine level via
  `pnpm dlx skills add mcpjam/inspector --skill mcp-inspector`.

### Install and verify

```bash
git clone https://github.com/oaknational/oak-open-curriculum-ecosystem.git
cd oak-open-curriculum-ecosystem
pnpm install
pnpm test && pnpm type-check && pnpm lint
```

If these pass, your toolchain is working. No API keys are required for unit tests, type-checking, linting, or building.

**Before your first push**: install [gitleaks](https://github.com/gitleaks/gitleaks/releases) (`brew install gitleaks` on macOS). The pre-push hook runs a secrets scan and will block pushes if gitleaks is not installed.

### Get an API key (optional)

Many tasks work without environment variables. To run dev servers, integration tests, or search workflows, you need an Oak API key:

1. Request a free key: <https://open-api.thenational.academy/docs/about-oaks-api/api-keys>
2. Copy the example environment file for the workspace you are running and add
   your key there:

```bash
# HTTP MCP server
cp apps/oak-curriculum-mcp-streamable-http/.env.example \
  apps/oak-curriculum-mcp-streamable-http/.env.local

# Search CLI
cp apps/oak-search-cli/.env.example apps/oak-search-cli/.env.local

# Edit the relevant .env.local and set OAK_API_KEY=your_key_here
```

See [environment variables guide](docs/operations/environment-variables.md) for Elasticsearch, Clerk, and other service credentials.

### Next steps

The [Architecture](#architecture) section below summarises the schema-first design and key directories. For the development process, commit conventions, and quality expectations, see [CONTRIBUTING.md](CONTRIBUTING.md). Each workspace README provides area-specific setup (see links in the capability table above).

For the shape of the curriculum data and per-key-stage variance, see the [Curriculum Guide](docs/domain/curriculum-guide.md) and [Data Variances](docs/domain/DATA-VARIANCES.md). For how MCP tools execute against the OpenAPI schema at runtime, see [openapi-pipeline.md → Schema-First Tool Invocation](docs/architecture/openapi-pipeline.md#execution-model-schema-first-tool-invocation).

## Key Commands

**Daily development:**

```bash
pnpm test           # Unit + integration tests
pnpm type-check     # Type-check all workspaces
pnpm lint           # Read-only lint verification
pnpm build          # Build all workspaces
pnpm sdk-codegen    # Regenerate SDK + MCP artefacts from OpenAPI
```

**Widget development** (from `apps/oak-curriculum-mcp-streamable-http/`):

```bash
pnpm dev:widget          # Standalone widget dev server with token live-reload
pnpm dev:widget-in-host  # Widget rendered inside MCP Apps basic-host (requires bun)
pnpm test:widget         # Widget unit + integration tests
pnpm test:widget:ui      # Playwright visual tests (light + dark themes)
pnpm test:widget:a11y    # Playwright axe-core WCAG 2.2 AA gate
```

**Full verification:**

```bash
pnpm make           # Full convenience pipeline with auto-fix steps; review file changes afterwards
pnpm check          # Canonical full verification gate: clean rebuild + tests + docs + formatting/linting fixes
pnpm fix            # Auto-fix: format + markdownlint + lint
pnpm clean          # Remove build artefacts (dist/, .turbo)
```

## Architecture

Everything flows from the OpenAPI schema:

1. **OpenAPI Schema** (single source of truth)
2. **→ TypeScript SDK** (generated at `pnpm sdk-codegen`)
3. **→ MCP Tools** (generated from the same schema)
4. **→ Type-safe everything** (no manual type definitions, no runtime assertions)

**The Cardinal Rule**: If the OpenAPI schema changes, running `pnpm sdk-codegen` updates the SDK, types, validators, and MCP tools automatically. Zero manual intervention.

Search uses Elasticsearch with 4-way reciprocal rank fusion (ELSER sparse vectors, BM25, synonym expansion, and phrase boosting) to achieve high-accuracy retrieval across curriculum structures. See the [search architecture](apps/oak-search-cli/docs/ARCHITECTURE.md) for details and the [OpenAPI pipeline](docs/architecture/openapi-pipeline.md) for the generation architecture.

| Directory          | Purpose                                                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `apps/`            | The canonical HTTP MCP server and the semantic search CLI                                                                                                |
| `packages/sdks/`   | Curriculum SDK (code-generation, MCP metadata) and Search SDK (ES retrieval)                                                                             |
| `packages/core/`   | Foundational packages: `Result<T, E>` type, env schema contracts, observability primitives, type helpers, ESLint configs                                 |
| `packages/libs/`   | Shared libraries: env-resolution, structured logging, search contracts, fidelity-review tooling, and Sentry adapters                                     |
| `packages/design/` | Design token pipeline and reusable design primitives: DTCG source format, CSS custom property generation, WCAG AA contrast validation, Ink UI primitives |
| `demos/`           | Demonstration web apps at full estate standards: the Curriculum Hub (live search + content stack) and the design-system showcase                         |
| `agent-tools/`     | Agent workflow CLIs: `claude-agent-ops`, `cursor-session-from-claude-session`, and `codex-reviewer-resolve`                                              |
| `docs/`            | Developer documentation, guides, and the full ADR index                                                                                                  |

### Workspace Summaries

**Apps:**

| Workspace                                                                        | Purpose                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`oak-curriculum-mcp-streamable-http`](apps/oak-curriculum-mcp-streamable-http/) | Canonical MCP server — Streamable HTTP transport, Vercel deployment, the full curriculum tool set (the workspace README is the authoritative inventory), resources, prompts, and MCP App widget              |
| [`oak-search-cli`](apps/oak-search-cli/)                                         | Search CLI — admin operations, bulk ingestion, blue/green index lifecycle ([ADR-130](docs/architecture/architectural-decisions/130-blue-green-index-swapping.md)), evaluation, and ground-truth benchmarking |

**SDKs:**

| Workspace                                                 | Purpose                                                                                                                                                               |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`oak-curriculum-sdk`](packages/sdks/oak-curriculum-sdk/) | Curriculum API SDK — generated types, Zod validators, MCP tool metadata, all flowing from the OpenAPI schema                                                          |
| [`oak-search-sdk`](packages/sdks/oak-search-sdk/)         | Search SDK — hybrid lexical (BM25) + semantic (ELSER) retrieval, admin services, observability, and blue/green index lifecycle management (zero downtime index swaps) |
| [`oak-sdk-codegen`](packages/sdks/oak-sdk-codegen/)       | Schema-driven code generation — OpenAPI → TypeScript types, Zod schemas, ES mappings, MCP tool definitions                                                            |

**Core and Libraries:**

**Core packages:**

| Workspace                                                | Purpose                                                               |
| -------------------------------------------------------- | --------------------------------------------------------------------- |
| [`result`](packages/core/result/README.md)               | `Result<T, E>` type for explicit error handling without exceptions    |
| [`env`](packages/core/env/README.md)                     | Env schema contracts — Zod-based validation for environment variables |
| [`observability`](packages/core/observability/README.md) | Provider-neutral redaction and active-span helpers                    |
| [`type-helpers`](packages/core/type-helpers/README.md)   | Shared type-level utilities                                           |
| [`oak-eslint`](packages/core/oak-eslint/README.md)       | Custom ESLint rules enforcing architectural boundaries                |

**Libraries:**

| Workspace                                                                   | Purpose                                                                       |
| --------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| [`@oaknational/logger`](packages/libs/logger/README.md)                     | Structured logger with sink fan-out, redaction, and trace correlation         |
| [`@oaknational/env-resolution`](packages/libs/env-resolution/README.md)     | Environment resolution pipeline — `.env` discovery, validation, and injection |
| [`@oaknational/fidelity-review`](packages/libs/fidelity-review/README.md)   | Shared fidelity capture/diff/report core for the demo apps                    |
| [`@oaknational/search-contracts`](packages/libs/search-contracts/README.md) | Canonical semantic-search field and stage contracts                           |
| [`@oaknational/sentry-node`](packages/libs/sentry-node/README.md)           | Shared Sentry Node config, sinks, fixture runtime, and flush helpers          |

**Design:**

| Workspace                                                   | Purpose                                                                            |
| ----------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| [`design-tokens-core`](packages/design/design-tokens-core/) | Pure functions for DTCG token parsing and WCAG AA contrast validation              |
| [`oak-design-tokens`](packages/design/oak-design-tokens/)   | Oak-specific token definitions (palette, semantic, component) and CSS build output |
| [`oak-design-ink`](packages/design/oak-design-ink/)         | Reusable Oak React primitives for Ink-based terminal interfaces                    |

Architectural Decision Records (ADRs) are the architectural source of truth. These three foundational ADRs define the schema-first approach that underpins the codebase:

- [ADR-029](docs/architecture/architectural-decisions/029-no-manual-api-data.md) — No manual API data structures
- [ADR-030](docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) — SDK as single source of truth
- [ADR-031](docs/architecture/architectural-decisions/031-generation-time-extraction.md) — Generation-time extraction

See the [full ADR index](docs/architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes) for all decisions (start with the "5 ADRs in 15 Minutes" block).

### Architectural invariants

Six stable, ADR-backed properties make this repository what it is. Each links to its authoritative doc, which always carries the detail:

1. **The SDK updates itself from the API spec** — when the upstream OpenAPI schema changes, regeneration brings every workspace into alignment with zero manual type work (the Cardinal Rule above; [OpenAPI pipeline](docs/architecture/openapi-pipeline.md)).
2. **Two data feeds, both deliberate** — the live API powers the SDK and MCP tools ([OpenAPI pipeline](docs/architecture/openapi-pipeline.md)), while bulk-downloaded curriculum data is the source of truth for search ingestion and graph derivation ([semantic search architecture](docs/agent-guidance/semantic-search-architecture.md)).
3. **The curriculum graphs are derived from the bulk data** — prior knowledge, misconceptions, keywords, and progressions served as anchored graph tools ([graph-stack topology, ADR-173](docs/architecture/architectural-decisions/173-graph-stack-topology.md)).
4. **EEF evidence grounds the pedagogy** — the Teaching and Learning Toolkit is integrated for evidence-based support ([Data Sources](#data-sources)).
5. **The bulk data populates the semantic search** — ingestion builds the search indices from it ([ingestion guide](apps/oak-search-cli/docs/INGESTION-GUIDE.md)).
6. **The Search SDK serves both sides** — creating and operating search instances as well as querying them ([Search SDK](packages/sdks/oak-search-sdk/README.md)).

## Engineering Practice

This repository began as an exploration of what co-pilot style AI support could
provide, but evolved rapidly into an agent-first engineering system. As of
February 2026, for at least the previous six months, every line of code,
configuration, and documentation has been written entirely by agents. Humans
focus on system design: defining guardrails, architectural constraints, quality
gates, and reviewer workflows; then providing direction and corrective feedback.

The result of this approach is **[the Practice](.agent/practice-core/README.md)**
— a transferable, self-improving system of principles, structures, specialist
agents, and tooling that governs how work happens. The Practice is not a static
rulebook; it contains a [**self-reinforcing improvement loop**](docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md) that learns from
every session and evolves its own governance. The core cycle:

1. **Capture** — agents continuously log mistakes, corrections, and patterns to
   a session napkin
2. **Refine** — periodic distillation extracts high-signal entries into a
   curated reference
3. **Graduate** — the consolidation workflow moves settled patterns into
   permanent documentation (ADRs, governance docs, READMEs)
4. **Enforce** — permanent docs become rules and directives that govern the
   next session's work

The loop is self-referential: it improves not just the product code but the
Practice itself. Rules about rule creation, patterns about distillation quality,
and insights about consolidation all flow through the same cycle.

The Practice also travels between repositories via a
[plasmid exchange mechanism](docs/architecture/architectural-decisions/124-practice-propagation-model.md)
— a package of seven portable files that carry the improvement loop to new
contexts. Different repos stress-test the Practice against different work,
surfacing learnings that travel back to the origin. If a repo already has
a Practice, then the income Practice is analysed and the best parts are
integrated into the incumbent Practice. This allows the benefits
of the learning loop to be compounded through multiple repos, while allowing
the Practice to adapt itself to suit the context of each project.

The impact of these systems is to enable **agentic engineering speed and
optionality without sacrificing quality**, while minimising the loss of
visibility that comes from delegating work to agents. Quality gates, specialist
reviewers, and the learning loop provide assurance comparable to manual code
review, while the Practice's self-improving nature means governance strengthens
over time rather than eroding.

**Further reading:**

- [Working with this Repo for Devs](docs/engineering/working-with-this-repo-for-devs.md) — the practical guide: how you direct the work and what the agents do around you
- [How the Agentic Engineering System Works](docs/foundation/agentic-engineering-system.md) — the Practice explained as an integrated engineering system
- [The Practice](.agent/practice-core/README.md) — the same system, as an operational blueprint for AI agents
- [ADR-119](docs/architecture/architectural-decisions/119-agentic-engineering-practice.md) — naming, boundary, and three-layer model
- [ADR-131](docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md) — the improvement loop, interaction map, and self-referential property
- [ADR-124](docs/architecture/architectural-decisions/124-practice-propagation-model.md) — how the Practice travels between repos
- [.agent/HUMANS.md](.agent/HUMANS.md) — contributor context

## Credits and Attribution

This repository brings together work from multiple contributors and open
education organisations. See [ATTRIBUTION.md](ATTRIBUTION.md) for full
details, citations, and licence terms for each source.

- **[Education Endowment Foundation](https://educationendowmentfoundation.org.uk/)** — Teaching and Learning Toolkit data. Citation: Higgins, S., Katsipataki, M., Kokotsaki, D., Coleman, R., Major, L.E., & Coe, R. _Teaching and Learning Toolkit_. Education Endowment Foundation.
- **Mark Hodierne** — [Oak Curriculum Ontology](https://github.com/oaknational/oak-curriculum-ontology), primary author
- **John Roberts** — EEF MCP server prototype
- **Heather W** — Oak Curriculum Hub demo web UI (`demos/oak-curriculum-hub`)

## Contributing

This repository is open-source under the MIT licence. You are free to read,
fork, and learn from the code.

At this time, we are not accepting external contributions (pull requests). This may change in the future; watch the repository for updates.

If you find a security issue, please follow our
[security policy](SECURITY.md).

Oak team members: see [CONTRIBUTING.md](CONTRIBUTING.md) for workflow,
commit conventions, and quality expectations.

## Support and Licensing

- Documentation: [docs/README.md](docs/README.md)
- Issues: <https://github.com/oaknational/oak-open-curriculum-ecosystem/issues>
- Licence (code): MIT — see [LICENCE](LICENCE)
- Licence (curriculum data): see [LICENCE-DATA.md](LICENCE-DATA.md) for upstream terms
- Attribution: see [ATTRIBUTION.md](ATTRIBUTION.md) for credits and citations
- Branding is copyright Oak National Academy: [BRANDING.md](BRANDING.md)
- Security: [SECURITY.md](SECURITY.md)
