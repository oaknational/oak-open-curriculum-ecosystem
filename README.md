# Oak Open Curriculum Ecosystem

Tools for building AI applications on the [Oak National Academy Open Curriculum](https://open-api.thenational.academy/), using a generated, type-safe TypeScript SDK and [Model Context Protocol](https://modelcontextprotocol.io/) (MCP) servers, and semantic search over the curriculum data powered by Elasticsearch Serverless.

**Product and impact folks**: take a look at the [VISION.md](docs/foundation/VISION.md) for a high-level overview of the project.

> **Current status: Private Alpha** — This repository is under active early development. APIs, tools, and documentation may change. Public alpha is being planned, see [milestones/m1-open-public-alpha.md](.agent/milestones/m1-open-public-alpha.md) for details.

[![MIT Licence](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENCE)
[![OGL Data Licence](https://img.shields.io/badge/data_licence-OGL-green.svg)](LICENCE-DATA.md)

This repository is how Oak makes its openly-licensed, fully sequenced, and fully resourced curriculum available to AI systems and the wider education technology community, via SDKs, MCP servers, and semantic search. AI assistants like Claude, ChatGPT, and Gemini can search Oak's curriculum, explore lessons, units, threads, and sequences, and other structured educational content — helping teachers find, adapt, and use high-quality curriculum resources.

## Not a developer? Start here

**Product owners, school leaders, non-technical evaluators** — you do not need to read the technical content below. Start with:

- [VISION.md](docs/foundation/VISION.md) — what this project delivers, why it matters, and the investment case (no technical background required)
- [Curriculum Guide](docs/domain/curriculum-guide.md) — Oak's curriculum structure explained in plain language

## Developers and AI agents

- **Developers** — continue to [Quick Start](#quick-start) below
- **AI agents** — read the [start-right workflow](.agent/prompts/start-right.prompt.md), then [AGENT.md](.agent/directives/AGENT.md)

## What This Repo Provides

Three capabilities, all generated from the [Oak Open Curriculum](https://open-api.thenational.academy/) OpenAPI specification:

| Capability          | What it does                                                                                                                                                                                                  | Packages                                                                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| **Curriculum SDK**  | Typed TypeScript access to Oak's curriculum API — types, Zod validators, and MCP tool metadata, all generated from the OpenAPI schema                                                                         | [`oak-curriculum-sdk`](packages/sdks/oak-curriculum-sdk/)                                                                                    |
| **MCP Servers**     | AI assistants can search, browse, and fetch curriculum data through [Model Context Protocol](https://modelcontextprotocol.io/) — the standard that lets tools like ChatGPT and Claude connect to data sources | [`mcp-stdio`](apps/oak-curriculum-mcp-stdio/) (Claude Desktop, Cursor), [`mcp-http`](apps/oak-curriculum-mcp-streamable-http/) (web, Vercel) |
| **Semantic Search** | Hybrid lexical + semantic retrieval across lessons, units, threads, and curriculum sequences using Elasticsearch with reciprocal rank fusion                                                                  | [`oak-search-cli`](apps/oak-search-cli/), [`oak-search-sdk`](packages/sdks/oak-search-sdk/)                                                  |

The [Oak Open Curriculum API](https://open-api.thenational.academy/) provides the subset of Oak's curriculum data that is openly licensed and free of third-party copyright (most of it). Everything in this repository works with this open data.

## Quick Start

### Prerequisites

- **Node.js 24.x** — install via [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm), then run `nvm use` to activate the version in `.nvmrc`
- **pnpm** — run `corepack enable` (ships with Node.js) to auto-install the pinned version

### Install and verify

```bash
git clone https://github.com/oaknational/oak-open-curriculum-ecosystem.git
cd oak-open-curriculum-ecosystem
pnpm install
pnpm test && pnpm type-check && pnpm lint:fix
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
pnpm lint:fix       # Lint and auto-fix
pnpm build          # Build all workspaces
pnpm sdk-codegen    # Regenerate SDK + MCP artefacts from OpenAPI
```

**Full verification:**

```bash
pnpm make           # Full pipeline: install, build, type-check, doc-gen, lint, format
pnpm qg             # Quality gates: all checks + all test suites (UI, E2E, smoke)
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

| Directory        | Purpose                                                                                        |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| `apps/`          | MCP servers (stdio + HTTP) and the semantic search CLI                                         |
| `packages/sdks/` | Curriculum SDK (code-generation, MCP metadata) and Search SDK (ES retrieval)                   |
| `packages/core/` | Foundational packages: `Result<T, E>` type, env schema contracts, type helpers, ESLint configs |
| `packages/libs/` | Shared libraries: env-resolution pipeline, structured logger                                   |
| `docs/`          | Developer documentation, guides, and 100+ ADRs                                                 |

Architectural Decision Records (ADRs) are the architectural source of truth. These three foundational ADRs define the schema-first approach that underpins the codebase:

- [ADR-029](docs/architecture/architectural-decisions/029-no-manual-api-data.md) — No manual API data structures
- [ADR-030](docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) — SDK as single source of truth
- [ADR-031](docs/architecture/architectural-decisions/031-generation-time-extraction.md) — Generation-time extraction

See the [full ADR index](docs/architecture/architectural-decisions/) for all decisions.

## Engineering Practice

This repository is optimised for AI-assisted engineering governed by quality gates, specialist reviewers, and architectural decision records — see [.agent/HUMANS.md](.agent/HUMANS.md) for more information. The approach is documented in [ADR-119](docs/architecture/architectural-decisions/119-agentic-engineering-practice.md), and embodied in [the Practice](.agent/practice-core/README.md), a transferable, self-improving memetic system of principles, structures, agents, and tooling, enabling safer, human-AI collaboration and innovation without compromising on quality.

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
