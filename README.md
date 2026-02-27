# Oak MCP Ecosystem

Tools for building AI applications on the Oak National Academy curriculum.

> **Status: Private Alpha** — This repository is under active development. APIs, tools, and documentation may change. See [milestones](.agent/milestones/) for the progression path.

[![MIT Licence](https://img.shields.io/badge/licence-MIT-blue.svg)](LICENCE)
[![OGL Data Licence](https://img.shields.io/badge/data_licence-OGL-green.svg)](LICENCE-DATA.md)

This repository is how Oak makes its curriculum available to AI tools and the wider education technology community. It powers the infrastructure that lets AI assistants like Claude and ChatGPT search Oak's curriculum, plan lessons, and access structured educational data — helping teachers find, adapt, and use Oak's openly-licensed curriculum.

> For the broader vision — impact, capability staging, and the investment case — see [VISION.md](docs/foundation/VISION.md). No technical background required.

- **Product owners, school leaders, non-technical evaluators** — start with [VISION.md](docs/foundation/VISION.md) for what this project delivers and why, then the [Curriculum Guide](docs/domain/curriculum-guide.md) for Oak's curriculum structure in plain language
- **Developers** — jump to [Quick Start](#quick-start) below
- **AI agents** — read the [start-right workflow](.agent/prompts/start-right.prompt.md), then [AGENT.md](.agent/directives/AGENT.md)

## What's In This Repo

SDKs, MCP ([Model Context Protocol](https://modelcontextprotocol.io/) — a standard that lets AI tools like ChatGPT and Claude connect to data sources) servers, and Elasticsearch-backed semantic search — all generated from the [Oak Open Curriculum](https://open-api.thenational.academy/) OpenAPI specification.

| Package                                      | Purpose                                                                                    |
| -------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `packages/sdks/oak-curriculum-sdk`           | Generated SDK: TypeScript types, Zod validators, MCP tool metadata                         |
| `packages/sdks/oak-search-sdk`               | Search SDK: Elasticsearch-backed retrieval with dependency injection                       |
| `apps/oak-curriculum-mcp-stdio`              | MCP server over stdio (for Claude Desktop, Cursor)                                         |
| `apps/oak-curriculum-mcp-streamable-http`    | MCP server over HTTP (for web clients, Vercel deployment)                                  |
| `apps/oak-search-cli`                        | Semantic search CLI: ingestion, hybrid search, ground truth evaluation                     |
| `packages/core/result`                       | Canonical `Result<T, E>` type                                                              |
| `packages/core/env`                          | Environment schema contracts (shared Zod schemas)                                          |
| `packages/libs/env-resolution`               | Environment resolution pipeline (`resolveEnv`)                                             |
| `packages/libs/logger`                       | Structured logging library                                                                 |
| `docs/architecture/architectural-decisions/` | Over 100 ADRs (Architectural Decision Records) documenting every significant design choice |

### The Open Curriculum

The [Oak Open Curriculum API](https://open-api.thenational.academy/) provides the subset of Oak's curriculum data that is openly licensed and free of third-party copyright. Everything in this repository works with this open data. When you see "curriculum" in the codebase, it means the open, reusable subset.

## Quick Start

### Prerequisites

- **Node.js 24.x** — install via [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm), then run `nvm use` (or `fnm use`) to activate the version in `.nvmrc`
- **pnpm** — run `corepack enable` (ships with Node.js) to auto-install the pinned version
- **gitleaks** — required for push; `brew install gitleaks` on macOS, or install from [gitleaks releases](https://github.com/gitleaks/gitleaks/releases)

### Install

```bash
git clone https://github.com/oaknational/oak-open-data-ecosystem.git
cd oak-open-data-ecosystem
pnpm install
```

Read [docs/foundation/quick-start.md](docs/foundation/quick-start.md) for architecture, setup, key concepts, and development workflows.

### Verify Your Setup (no API keys required)

```bash
pnpm test
pnpm type-check
pnpm lint:fix
```

If these pass, your toolchain is working and you can start contributing immediately.

### Environment Variables (only for external services)

```bash
cp .env.example .env
# populate OAK_API_KEY, ELASTICSEARCH_*, etc.
```

Many tasks work without environment variables (`pnpm test`, `pnpm type-check`, `pnpm lint:fix`, `pnpm build`). Variables are only required for running dev servers, E2E tests, and smoke tests. Each workspace README provides its own `.env.local` hints.

### Run the Full Pipeline

```bash
pnpm make   # Full pipeline: install, build, type-check, generate docs, lint, format
pnpm qg     # Quality gates: format, markdownlint, type-check, lint, all test suites, smoke
```

`pnpm make` is the recommended first full pipeline run.
`pnpm qg` is slower and runs UI/E2E/smoke suites that may require additional service configuration.
See [Troubleshooting](docs/operations/troubleshooting.md#known-gate-caveats) for current caveats.

### Choose Your Starting Point

**SDK/Library work** (no env vars needed):
Start with [packages/sdks/oak-curriculum-sdk/README.md](packages/sdks/oak-curriculum-sdk/README.md)

**Search application work** (requires Elasticsearch + API keys):
Start with [apps/oak-search-cli/README.md](apps/oak-search-cli/README.md)

**MCP server work** (requires `OAK_API_KEY` + Elasticsearch credentials; HTTP auth mode also needs Clerk keys):

- Stdio: [apps/oak-curriculum-mcp-stdio/README.md](apps/oak-curriculum-mcp-stdio/README.md) — for Claude Desktop, Cursor
- HTTP: [apps/oak-curriculum-mcp-streamable-http/README.md](apps/oak-curriculum-mcp-streamable-http/README.md) — OAuth-enabled, Vercel-ready

## Key Commands

```bash
pnpm install        # Install dependencies
pnpm sdk-codegen    # Regenerate SDK + MCP artefacts from OpenAPI
pnpm build          # Build all workspaces
pnpm type-check     # Type-check apps and packages
pnpm doc-gen        # Generate TypeDoc/OpenAPI/markdown/AI docs
pnpm lint:fix       # Lint and auto-fix
pnpm test           # Unit + integration tests
pnpm test:ui        # Playwright suites
pnpm test:e2e       # End-to-end tests
pnpm smoke:dev:stub # Local smoke harness for MCP servers
pnpm make           # Full pipeline (install, build, check, lint, format)
pnpm qg             # Quality gates (all checks + all test suites)
pnpm fix            # Auto-fix (format, markdownlint, lint)
pnpm check          # Build and validate everything
```

## Architecture

Everything flows from the OpenAPI schema:

1. **OpenAPI Schema** (single source of truth)
2. **→ TypeScript SDK** (generated at `pnpm sdk-codegen`)
3. **→ MCP Tools** (generated from the same schema)
4. **→ Type-safe everything** (no manual type definitions, no runtime assertions)

**The Cardinal Rule**: If the OpenAPI schema changes, running `pnpm sdk-codegen` updates the SDK, types, validators, and MCP tools automatically. Zero manual intervention.

| Directory        | Purpose                                                                      |
| ---------------- | ---------------------------------------------------------------------------- |
| `apps/`          | MCP servers (stdio + HTTP) and the semantic search CLI                       |
| `packages/sdks/` | Curriculum SDK (code-generation, MCP metadata) and Search SDK (ES retrieval) |
| `packages/core/` | Foundational packages: `result`, `env` (schema contracts), ESLint configs    |
| `packages/libs/` | Shared libraries: `env-resolution` (env pipeline), `logger`                  |
| `docs/`          | Developer documentation, guides, and ADRs                                    |

ADRs define how the system works and are the architectural source of truth. These three foundational ADRs define the schema-first generation approach that underpins the entire codebase:

- [ADR-029](docs/architecture/architectural-decisions/029-no-manual-api-data.md) — No manual API data structures
- [ADR-030](docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) — SDK as single source of truth
- [ADR-031](docs/architecture/architectural-decisions/031-generation-time-extraction.md) — Generation-time extraction

See the [ADR index](docs/architecture/architectural-decisions/) for the full list.

## Engineering Practice

This repository uses AI-assisted engineering governed by comprehensive quality gates, specialist reviewers, and over 100 architectural decision records. The approach is documented in [ADR-119](docs/architecture/architectural-decisions/119-agentic-engineering-practice.md).

The practice operates through [directives](.agent/directives/AGENT.md), [plans](.agent/plans/), and [platform-specific tooling](.cursor/). The `.agent/` directory contains the practice infrastructure, including session memory and experience records — see [.agent/README.md](.agent/README.md) for an explanation of what these files are and why they exist.

## Contributing

This repository is open-source under the MIT licence. You are free to read,
fork, and learn from the code.

At this time, we are not accepting external contributions (pull requests,
issues, or feature requests). This may change in the future; watch the
repository for updates.

If you find a security issue, please follow our
[security policy](SECURITY.md).

Oak team members: see [CONTRIBUTING.md](CONTRIBUTING.md) for workflow,
commit conventions, and quality expectations.

## Support and Licensing

- Documentation: [docs/README.md](docs/README.md)
- Issues: <https://github.com/oaknational/oak-open-data-ecosystem/issues>
- Discussions: <https://github.com/oaknational/oak-open-data-ecosystem/discussions>
- Licence (code): MIT — see [LICENCE](LICENCE)
- Licence (curriculum data): see [LICENCE-DATA.md](LICENCE-DATA.md) for upstream terms
- Branding: [BRANDING.md](BRANDING.md)
- Security: [SECURITY.md](SECURITY.md)
