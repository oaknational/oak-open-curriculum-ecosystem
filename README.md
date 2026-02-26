# Oak MCP Ecosystem

This repository is how Oak makes its curriculum available to AI tools and the wider education technology community. It powers the infrastructure that lets AI assistants help teachers find, adapt, and use Oak's openly-licensed curriculum.

> For an overview of the **impact** we aim to achieve with this repo, see [Vision](docs/foundation/VISION.md) — it explains what
> this repository delivers, why it matters for Oak's mission. No technical background required.

SDKs, MCP (Model Context Protocol) servers, and Elasticsearch-serverless-backed semantic search, all generated from the Oak Open Curriculum OpenAPI specification and the open API and bulk-download data.

## Repo Contents

This repo has roughly three distinct audiences:

- External developers, AI engineers, and ed-tech product teams who will benefit from the infrastructure and tools in this repo
- Contributors to this repo who will use the agentic engineering practice to build the product faster and to a higher standard than would otherwise be possible.
- Teachers and other end-users who will use the curriculum app to discover, access, and adapt curriculum content.

### External Facing

- Curriculum SDK generation and runtime - including a general OpenAPI -> SDK -> MCP tool generation pipeline
- Semantic search SDK
- MCP server
- Curriculum app — user-facing Oak product (discover, access, adapt curriculum content via MCP)

### Internal Facing

This repo is designed to support [agentic or augmented product engineering practice](.agent/directives/practice.md). It has extensive guidance for AI and human contributors ([docs](docs/README.md), [quick start](docs/foundation/quick-start.md), [guidance](.agent/directives/AGENT.md), [ADRs](docs/architecture/architectural-decisions/), [memory](.agent/memory/distilled.md)), strict and comprehensive [quality gates](.agent/directives/rules.md), and feedback loops to improve both.

It also has a large collection of repo specific agent skills, commands, sub-agents, and other tools to support the practice. While some of these are currently configured for Cursor only, the philosophy is that they should all be platform-agnostic, and we will continue to work towards that goal.

The tools are specific for this repo, but we hope that they demonstrate portable patterns and practices that can be applied elsewhere, and towards that end we try to maintain the boundary between the generic approach and the specific instances.

## Quick Start for AI Agents

Read [the start right workflow](.agent/prompts/start-right.prompt.md).

## Quick Start for Everyone

### Prerequisites

- **Node.js 24.x** — install via [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm); the repo includes an `.nvmrc` file
- **pnpm** — run `corepack enable` (ships with Node.js) to auto-install the pinned version
- **gitleaks** — required for push; install from [gitleaks releases](https://github.com/gitleaks/gitleaks/releases)

### Install

1. **Clone & install**

   ```bash
   git clone https://github.com/oaknational/oak-open-data-ecosystem.git
   cd oak-open-data-ecosystem
   pnpm install
   ```

2. **Read the quick start guide** – [docs/foundation/quick-start.md](docs/foundation/quick-start.md) covers architecture, setup, key concepts, and development workflows (junior-to-mid-level friendly).

   For AI agents, onboarding starts with `start-right`:
   [command](.cursor/commands/jc-start-right.md), [prompt](.agent/prompts/start-right.prompt.md), or [skill](.agent/skills/start-right/SKILL.md), then [AGENT.md](.agent/directives/AGENT.md).

3. **Verify your local setup (no API keys required)**

   ```bash
   pnpm test
   pnpm type-check
   pnpm lint:fix
   ```

   If these pass, your toolchain is working and you can start contributing to SDK/docs work immediately.

4. **Configure environment variables** (only if your task needs external services)

   ```bash
   cp .env.example .env
   # populate OAK_API_KEY, ELASTICSEARCH_*, SEARCH_API_KEY, etc.
   ```

   `.env` and `.env.local` are local-only and are ignored by git.
   Keep `*.env` and `*.env.local` out of version control and use
   placeholders in `.env.example`.

   Each workspace README provides its own `.env.local` hints.

   > **Note**: Many development tasks work without environment variables:
   >
   > - `pnpm test` (unit tests)
   > - `pnpm type-check` (type checking)
   > - `pnpm lint:fix` (linting and autofix)
   > - `pnpm build` (SDK and library builds)
   >
   > Environment variables are only required for:
   >
   > - Running dev servers (`pnpm dev`)
   > - Integration/E2E tests (`pnpm test:e2e`)
   > - Smoke tests (`pnpm smoke:dev:stub`)

5. **Regenerate types & run quality gates**

   ```bash
   pnpm make   # install -> build (includes sdk-codegen via Turbo deps) -> type-check -> doc-gen -> lint:fix -> subagents:check -> markdownlint:root -> format:root
   pnpm qg     # full gate: format-check:root -> markdownlint-check:root -> subagents:check -> type-check -> lint -> test suites -> smoke
   ```

   `pnpm make` is the recommended first full pipeline run.
   `pnpm qg` is slower and runs UI/E2E/smoke suites that may require additional service configuration.
   For current caveats, see [Troubleshooting → Known Gate Caveats](docs/operations/troubleshooting.md#known-gate-caveats).

6. **Choose your starting point**

   **For SDK/Library contributors** (no env vars needed):
   - Start with `packages/sdks/oak-curriculum-sdk/README.md` – SDK generation, MCP tool generation, shared parsing helpers
   - Work on type generation scripts, runtime clients, or validation helpers

   **For search application contributors** (requires Elasticsearch + API keys):
   - Start with `apps/oak-search-cli/README.md` – hybrid search, admin endpoints, telemetry
   - Requires: `OAK_API_KEY`, `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`

   **For MCP server contributors** (requires `OAK_API_KEY`, `ELASTICSEARCH_URL`, and `ELASTICSEARCH_API_KEY`; HTTP auth mode also needs Clerk keys unless auth is disabled):
   - Stdio: `apps/oak-curriculum-mcp-stdio/README.md` – for Claude Desktop, Cursor
   - HTTP: `apps/oak-curriculum-mcp-streamable-http/README.md` – OAuth-enabled, Vercel-ready
   - In both apps, stub mode swaps the retrieval implementation, but startup env validation still requires Elasticsearch variables
   - Both import generated tools from the SDK - no manual tool definitions

## Key Commands (root)

```bash
# What is available

pnpm install        # Install dependencies
pnpm sdk-codegen    # Regenerate SDK + MCP artefacts from OpenAPI
pnpm build          # Build all workspaces
pnpm type-check     # Type-check apps and packages
pnpm doc-gen        # Generate TypeDoc/OpenAPI/markdown/AI docs
pnpm secrets:scan:all # Run secret scan (branches + tags + full history)
pnpm lint:fix       # Lint and auto-fix where possible
pnpm test           # Run unit + integration tests
pnpm test:ui        # Run Playwright suites
pnpm test:e2e       # Run end-to-end tests
pnpm smoke:dev:stub # Local smoke harness for MCP servers
pnpm subagents:check # Validate sub-agent wrapper/template standards
pnpm make           # Full pipeline (install -> build/sdk-codegen -> docs -> lint:fix -> subagents:check -> markdownlint:root -> format:root)
pnpm qg             # Quality gate (format-check:root -> markdownlint-check:root -> subagents:check -> type-check -> lint -> tests -> smoke)

# What actually gets used

pnpm fix # format:root -> markdownlint:root -> lint:fix
pnpm check # Build and validate EVERYTHING
```

## Type Safety & Validation

- The SDK emits generated Zod schemas for curriculum responses, search responses, and request parameter maps.
- `parseSchema`, `parseWithCurriculumSchema`, `parseEndpointParameters`, and `parseSearchResponse` wrap `schema.safeParse`, returning typed `ValidationResult` objects without manual assertions.
- MCP servers, the search system, and admin tooling import these helpers — no consumer duplicates schema knowledge ([ADR-048](docs/architecture/architectural-decisions/048-shared-parse-schema-helper.md)).

## Documentation

- [docs/foundation/quick-start.md](docs/foundation/quick-start.md) – quick-reference guide for new developers.
- [docs/README.md](docs/README.md) – architecture and development index.
- Workspace READMEs (SDK + Semantic Search) explain local setup, admin workflows, and validation flow.

## Agentic Engineering Practice

This repository is governed by an **agentic engineering practice** — a self-reinforcing system of principles, structures, specialist reviewers, and tooling that creates a safe environment for human-AI collaboration. The practice is what produces the product code; it is not the product code itself.

The practice operates in three layers: **philosophy** (the First Question, metacognition, the learning loop), **structure** (directives, plans, templates, ADRs, sub-agents, quality gates, institutional memory), and **tooling** (platform-specific bindings in `.cursor/rules/`, `.cursor/commands/`, `.cursor/agents/`).

The practice has enabled a single engineer, working with AI under the practice's governance, to produce the SDK, MCP servers, semantic search, 116 ADRs, and the practice itself ([ADR-119](docs/architecture/architectural-decisions/119-agentic-engineering-practice.md)).

The entry point is [`.agent/directives/AGENT.md`](.agent/directives/AGENT.md) — follow the links from there and the practice reveals itself. For a map of the whole system, see [`.agent/directives/practice.md`](.agent/directives/practice.md).

## What This Is

This monorepo makes the [Oak Open Curriculum](https://open-api.thenational.academy/) accessible to AI agents and searchable for teachers. It contains:

- **A Curriculum SDK** generated at compile time from the Oak Curriculum OpenAPI schema — TypeScript types, Zod validators, MCP tool metadata, search type generators
- **MCP servers** (stdio and HTTP) that expose the full curriculum to AI agents via the Model Context Protocol
- **A semantic search system** with 4-way Reciprocal Rank Fusion hybrid search (BM25 + ELSER) across 7 Elasticsearch Serverless indices, covering lessons, units, curriculum threads, and subject-phase sequences
- **Core packages** (`Result<T, E>`, environment resolution pipeline) and a **logging library**

### The Open Curriculum

The [Oak Open Curriculum API](https://open-api.thenational.academy/) provides a subset of Oak's curriculum data — specifically the content that is openly licensed and free of third-party copyright. Unlike the data behind [www.thenational.academy](https://www.thenational.academy/), the Open Curriculum is organised to support reuse: by developers, AI agents, and anyone building on Oak's curriculum.

Everything in this repository works with the Open Curriculum API. When you see "curriculum" in the codebase, it means the open, reusable subset.

### The Architectural Foundation

Everything flows from the OpenAPI schema:

1. **OpenAPI Schema** (single source of truth)
2. **→ TypeScript SDK** (generated at `pnpm sdk-codegen`)
3. **→ MCP Tools** (generated from the same schema)
4. **→ Type-safe everything** (no manual type definitions, no runtime assertions)

**The Cardinal Rule**: If the OpenAPI schema changes, running `pnpm sdk-codegen` updates the SDK, types, validators, and MCP tools automatically. Zero manual intervention.

Architectural Decision Records (ADRs) define how the system should work and are the architectural source of truth.
Start with the [ADR index](docs/architecture/architectural-decisions/), then the foundational ADRs:

- [ADR-029](docs/architecture/architectural-decisions/029-no-manual-api-data.md) - No manual API data structures
- [ADR-030](docs/architecture/architectural-decisions/030-sdk-single-source-truth.md) - SDK as single source of truth
- [ADR-031](docs/architecture/architectural-decisions/031-generation-time-extraction.md) - Generation-time extraction
- [ADR-048](docs/architecture/architectural-decisions/048-shared-parse-schema-helper.md) - Shared parsing helper pattern

## What's In The Repo

- **`packages/sdks/oak-curriculum-sdk`** – Generated SDK: runtime clients, Zod schemas, MCP tool metadata, Elasticsearch mapping generators, and shared `parseSchema` validation helpers
- **`packages/sdks/oak-search-sdk`** – Search SDK: Elasticsearch-backed retrieval, admin, and observability services with dependency injection. All methods return `Result<T, E>`.
- **`apps/oak-curriculum-mcp-stdio`** – MCP server over stdio (for Claude Desktop, Cursor)
- **`apps/oak-curriculum-mcp-streamable-http`** – MCP server over HTTP (for web clients, Vercel deployment)
- **`apps/oak-search-cli`** – Semantic search CLI: ingestion, 4-way RRF hybrid search, ground truth evaluation, query processing pipeline
- **`packages/core/result`** – Canonical `Result<T, E>` type used across the codebase
- **`packages/core/env`** – Environment schema contracts: shared Zod schemas for API keys, Elasticsearch, logging
- **`packages/libs/env-resolution`** – Environment resolution pipeline (`resolveEnv`): loads `.env` < `.env.local` < `process.env`, validates against Zod schemas, returns `Result`
- **`packages/libs/logger`** – Structured logging library
- **`docs/architecture/architectural-decisions/`** – 114 Architectural Decision Records documenting every significant design choice

## Architecture Overview

| Directory        | Purpose                                                                                              |
| ---------------- | ---------------------------------------------------------------------------------------------------- |
| `apps/`          | MCP servers (stdio + HTTP) and the semantic search CLI                                               |
| `packages/sdks/` | Curriculum SDK (code-generation, MCP metadata) and Search SDK (ES retrieval)                         |
| `packages/core/` | Foundational packages: `result` (Result type), `env` (schema contracts), ESLint configs, Zod adapter |
| `packages/libs/` | Shared libraries: `env-resolution` (env pipeline), `logger` (structured logging)                     |
| `docs/`          | Developer documentation, guides, 116 ADRs                                                            |

Architectural decisions are recorded as ADRs in [docs/architecture/architectural-decisions/](docs/architecture/architectural-decisions/). Key ADRs include schema-first generation ([ADR-029](docs/architecture/architectural-decisions/029-no-manual-api-data.md)), ELSER-only search embeddings ([ADR-076](docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md)), and the deterministic SDK / NL-in-MCP boundary ([ADR-107](docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md)).

## Vision

[Oak's mission](https://www.thenational.academy/about-us/who-we-are) is to
improve pupil outcomes and close the disadvantage gap by supporting teachers to
teach. This repository amplifies that mission through AI-native infrastructure.

See [docs/foundation/VISION.md](docs/foundation/VISION.md) for the full framing — capability staging,
non-goals, impact measures, evidence baselines, and the investment case.

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

## Support & Licensing

- Documentation – [docs/README.md](docs/README.md)
- Issues – <https://github.com/oaknational/oak-open-data-ecosystem/issues>
- Discussions – <https://github.com/oaknational/oak-open-data-ecosystem/discussions>
- Licence (code) – MIT (see [LICENSE](LICENSE))
- Licence (curriculum data) – see [LICENCE-DATA.md](LICENCE-DATA.md) for upstream terms
- Branding – see [BRANDING.md](BRANDING.md)
- Security – see [SECURITY.md](SECURITY.md)
