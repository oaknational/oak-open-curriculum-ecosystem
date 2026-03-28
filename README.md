# Oak Open Curriculum Ecosystem

Tools for building AI applications on the [Oak National Academy Open Curriculum](https://open-api.thenational.academy/), using a generated, type-safe TypeScript SDK and [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) servers, and semantic search over the curriculum data powered by Elasticsearch Serverless.

**Strategic Overview**: For the vision, delivery roadmap, and engineering approach, see the [Strategic Overview](docs/foundation/strategic-overview.md).

---

> **Current status: Invite-Only Alpha (M1 complete)** — The server is live at `curriculum-mcp-alpha.oaknational.dev`. Open public alpha (M2) is next. See the [high-level plan](.agent/plans/high-level-plan.md) for milestone detail.

---

[![MIT Licence](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENCE)
[![OGL Data Licence](https://img.shields.io/badge/data_licence-OGL-green.svg)](LICENCE-DATA.md)

This repository is how Oak makes its openly-licensed, fully sequenced, and fully resourced curriculum available to AI systems and the wider education technology community, via SDKs, MCP servers, and semantic search. AI assistants like Claude, ChatGPT, and Gemini can search Oak's curriculum, explore lessons, units, threads, and sequences, and other structured educational content — helping teachers find, adapt, and use high-quality curriculum resources.

## Not a developer? Start here

**Product owners, school leaders, non-technical evaluators** — you do not need to read the technical content below. Start with:

- [Strategic Overview](docs/foundation/strategic-overview.md) — reading guide connecting vision, roadmap, and engineering approach
- [VISION.md](docs/foundation/VISION.md) — what this project delivers, why it matters, and the investment case
- [Curriculum Guide](docs/domain/curriculum-guide.md) — Oak's curriculum structure explained in plain language

## Developers and AI agents

- **Developers** — continue to [Quick Start](#quick-start) below
- **AI agents** — read the [start-right-quick workflow](.agent/skills/start-right-quick/shared/start-right.md), then [AGENT.md](.agent/directives/AGENT.md)

## What This Repo Provides

Three capabilities, all generated from the [Oak Open Curriculum](https://open-api.thenational.academy/) OpenAPI specification:

| Capability          | What it does                                                                                                                                                                                                  | Packages                                                                                                                                                                                          |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Curriculum SDK**  | Typed TypeScript access to Oak's curriculum API — types, Zod validators, and MCP tool metadata, all generated from the OpenAPI schema                                                                         | [`oak-curriculum-sdk`](packages/sdks/oak-curriculum-sdk/)                                                                                                                                         |
| **MCP Servers**     | AI assistants can search, browse, and fetch curriculum data through [Model Context Protocol](https://modelcontextprotocol.io/) — the standard that lets tools like ChatGPT and Claude connect to data sources | [`mcp-http`](apps/oak-curriculum-mcp-streamable-http/) (canonical server workspace, web, Vercel), [`mcp-stdio`](apps/oak-curriculum-mcp-stdio/) (legacy stdio workspace, not actively maintained) |
| **Semantic Search** | Hybrid lexical + semantic retrieval across lessons, units, threads, and curriculum sequences using Elasticsearch with reciprocal rank fusion                                                                  | [`oak-search-cli`](apps/oak-search-cli/), [`oak-search-sdk`](packages/sdks/oak-search-sdk/)                                                                                                       |

The [Oak Open Curriculum API](https://open-api.thenational.academy/) provides the subset of Oak's curriculum data that is openly licensed and free of third-party copyright (most of it). Everything in this repository works with this open data.

### MCP Server Capabilities

The MCP servers expose curriculum data through the three [MCP primitive types](https://modelcontextprotocol.io/docs/learn/server-concepts):

- **Tools** (model-controlled): 31 curriculum tools (23 generated from the OpenAPI schema, 8 aggregated) including orientation via `get-curriculum-model` and `download-asset`. The AI decides when to use them.
- **Resources** (application-controlled): Curriculum model, prerequisite graph, and learning progressions as pre-loadable context for MCP clients that support resource injection.
- **Prompts** (user-controlled): Four workflow templates (`find-lessons`, `lesson-planning`, `explore-curriculum`, `learning-progression`) that guide users through common curriculum tasks.

The standalone stdio workspace is now a legacy transitional surface. Future
stdio support should come from a separate stdio entry point generalised from the
HTTP MCP server workspace rather than from continued parallel maintenance of the
standalone stdio app. See the [HTTP MCP server README](apps/oak-curriculum-mcp-streamable-http/README.md),
[ADR-123](docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md),
and [ADR-128](docs/architecture/architectural-decisions/128-stdio-workspace-retirement-and-http-transport-consolidation.md).

## Quick Start

### Prerequisites

- **Node.js 24.x** — install via [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm), then run `nvm use` or `fnm use` to activate the version in `.nvmrc`
- **pnpm** — run `corepack enable` (ships with Node.js) to auto-install the pinned version

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
2. Copy the example environment file and add your key:

```bash
cp .env.example .env
# Edit .env: set OAK_API_KEY=your_key_here
```

See [environment variables guide](docs/operations/environment-variables.md) for Elasticsearch, Clerk, and other service credentials.

### Next steps

The full [Quick Start Guide](docs/foundation/quick-start.md) covers architecture, key concepts, and development workflows. Each workspace README provides area-specific setup (see links in the capability table above).

## Key Commands

**Daily development:**

```bash
pnpm test           # Unit + integration tests
pnpm type-check     # Type-check all workspaces
pnpm lint           # Read-only lint verification
pnpm build          # Build all workspaces
pnpm sdk-codegen    # Regenerate SDK + MCP artefacts from OpenAPI
```

**Full verification:**

```bash
pnpm make           # Full convenience pipeline with auto-fix steps; review file changes afterwards
pnpm qg             # Read-only quality gates: format-check, markdownlint-check, subagents, portability, root script tests, workspace tests, UI, E2E, smoke
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

| Directory        | Purpose                                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `apps/`          | The canonical HTTP MCP server, the legacy stdio MCP workspace, and the semantic search CLI                               |
| `packages/sdks/` | Curriculum SDK (code-generation, MCP metadata) and Search SDK (ES retrieval)                                             |
| `packages/core/` | Foundational packages: `Result<T, E>` type, env schema contracts, observability primitives, type helpers, ESLint configs |
| `packages/libs/` | Shared libraries: env-resolution, structured logging, search contracts, and Sentry adapters                              |
| `agent-tools/`   | Agent workflow CLIs: `claude-agent-ops` and `cursor-session-from-claude-session`                                         |
| `docs/`          | Developer documentation, guides, and 130+ ADRs                                                                           |

### Workspace Summaries

**Apps:**

| Workspace                                                                        | Purpose                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`oak-curriculum-mcp-streamable-http`](apps/oak-curriculum-mcp-streamable-http/) | Canonical MCP server — Streamable HTTP transport, Vercel deployment, 31 curriculum tools, resources, and prompts                                                                                                                                  |
| [`oak-curriculum-mcp-stdio`](apps/oak-curriculum-mcp-stdio/)                     | **Legacy** stdio MCP workspace — not actively maintained; future stdio support will be generalised from the HTTP server ([ADR-128](docs/architecture/architectural-decisions/128-stdio-workspace-retirement-and-http-transport-consolidation.md)) |
| [`oak-search-cli`](apps/oak-search-cli/)                                         | Search CLI — admin operations, bulk ingestion, blue/green index lifecycle ([ADR-130](docs/architecture/architectural-decisions/130-blue-green-index-swapping.md)), evaluation, and ground-truth benchmarking                                      |

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
| [`@oaknational/search-contracts`](packages/libs/search-contracts/README.md) | Canonical semantic-search field and stage contracts                           |
| [`@oaknational/sentry-node`](packages/libs/sentry-node/README.md)           | Shared Sentry Node config, sinks, fixture runtime, and flush helpers          |
| [`@oaknational/sentry-mcp`](packages/libs/sentry-mcp/README.md)             | Metadata-only MCP observation wrappers                                        |

Architectural Decision Records (ADRs) are the architectural source of truth. These three foundational ADRs define the schema-first approach that underpins the codebase:

- [ADR-029](docs/architecture/architectural-decisions/029-no-manual-api-data.md) — No manual API data structures
- [ADR-030](docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) — SDK as single source of truth
- [ADR-031](docs/architecture/architectural-decisions/031-generation-time-extraction.md) — Generation-time extraction

See the [full ADR index](docs/architecture/architectural-decisions/) for all decisions.

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

- [How the Agentic Engineering System Works](docs/foundation/agentic-engineering-system.md) — the Practice explained as an integrated engineering system
- [The Practice](.agent/practice-core/README.md) — the same system, as an operational blueprint for AI agents
- [ADR-119](docs/architecture/architectural-decisions/119-agentic-engineering-practice.md) — naming, boundary, and three-layer model
- [ADR-131](docs/architecture/architectural-decisions/131-self-reinforcing-improvement-loop.md) — the improvement loop, interaction map, and self-referential property
- [ADR-124](docs/architecture/architectural-decisions/124-practice-propagation-model.md) — how the Practice travels between repos
- [.agent/HUMANS.md](.agent/HUMANS.md) — contributor context

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
- Branding is copyright Oak National Academy: [BRANDING.md](BRANDING.md)
- Security: [SECURITY.md](SECURITY.md)
