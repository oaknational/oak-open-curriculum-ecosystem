# Oak MCP Ecosystem

**Infrastructure for AI agents and teacher search over Oak's openly-licensed curriculum — SDKs, MCP servers, and Elasticsearch-backed semantic search, all generated from the OpenAPI schema.**

## What This Is

This monorepo makes the [Oak Open Curriculum](https://open-api.thenational.academy/) accessible to AI agents and searchable for teachers. It contains:

- **A Curriculum SDK** generated at compile time from the Oak Curriculum OpenAPI schema — TypeScript types, Zod validators, MCP tool metadata, search type generators
- **MCP servers** (stdio and HTTP) that expose the full curriculum to AI agents via the Model Context Protocol
- **A semantic search system** with 4-way Reciprocal Rank Fusion hybrid search (BM25 + ELSER) across 7 Elasticsearch Serverless indices, covering lessons, units, curriculum threads, and subject-phase sequences
- **Shared libraries** for logging, configuration, storage, and transport

### The Open Curriculum

The [Oak Open Curriculum API](https://open-api.thenational.academy/) provides a subset of Oak's curriculum data — specifically the content that is openly licensed and free of third-party copyright. Unlike the data behind [www.thenational.academy](https://www.thenational.academy/), the Open Curriculum is organised to support reuse: by developers, AI agents, and anyone building on Oak's curriculum.

Everything in this repository works with the Open Curriculum API. When you see "curriculum" in the codebase, it means the open, reusable subset.

### The Architectural Foundation

Everything flows from the OpenAPI schema:

1. **OpenAPI Schema** (single source of truth)
2. **→ TypeScript SDK** (generated at `pnpm type-gen`)
3. **→ MCP Tools** (generated from the same schema)
4. **→ Type-safe everything** (no manual type definitions, no runtime assertions)

**The Cardinal Rule**: If the OpenAPI schema changes, running `pnpm type-gen` updates the SDK, types, validators, and MCP tools automatically. Zero manual intervention.

### Who Uses What

| If you are...                              | Start here                                                               |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| A teacher searching for curriculum content | The search system serves you (via products built on this infrastructure) |
| An AI agent accessing the curriculum       | MCP servers expose the full curriculum via tools                         |
| A developer building on the curriculum     | The SDK gives you typed access to the API                                |
| A contributor to this repo                 | Read on — the rest of this README is for you                             |

## What's In The Repo

- **`packages/sdks/oak-curriculum-sdk`** – Generated SDK: runtime clients, Zod schemas, MCP tool metadata, Elasticsearch mapping generators, and shared `parseSchema` validation helpers
- **`apps/oak-curriculum-mcp-stdio`** – MCP server over stdio (for Claude Desktop, Cursor)
- **`apps/oak-curriculum-mcp-streamable-http`** – MCP server over HTTP (for web clients, Vercel deployment)
- **`apps/oak-search-cli`** – Semantic search: ingestion, 4-way RRF hybrid search, ground truth evaluation, query processing pipeline. Currently being extracted into a standalone Search SDK + CLI ([ADR-107](docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md))
- **`packages/libs/`** – Shared libraries for logging, configuration, storage, and transport
- **`docs/architecture/architectural-decisions/`** – 107 Architectural Decision Records documenting every significant design choice

## Architecture Overview

| Directory        | Purpose                                                                  |
| ---------------- | ------------------------------------------------------------------------ |
| `apps/`          | MCP servers (stdio + HTTP) and the semantic search application           |
| `packages/sdks/` | Generated SDKs (Curriculum SDK with type-gen, Zod schemas, MCP metadata) |
| `packages/libs/` | Shared libraries for logging, configuration, storage, transport          |
| `packages/core/` | Core infrastructure (ESLint configs, Zod adapters)                       |
| `docs/`          | Developer documentation, onboarding guides, 107 ADRs                     |

Architectural decisions are recorded as ADRs in [docs/architecture/architectural-decisions/](docs/architecture/architectural-decisions/). Key ADRs include schema-first generation ([ADR-029](docs/architecture/architectural-decisions/029-no-manual-api-data.md)), ELSER-only search embeddings ([ADR-076](docs/architecture/architectural-decisions/076-elser-only-embedding-strategy.md)), and the deterministic SDK / NL-in-MCP boundary ([ADR-107](docs/architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md)).

## Quick Start

1. **Clone & install**

   ```bash
   git clone https://github.com/oaknational/oak-mcp-ecosystem.git
   cd oak-mcp-ecosystem
   pnpm install
   ```

2. **Read the onboarding guide** – [docs/development/onboarding.md](docs/development/onboarding.md) links the key READMEs, GO cadence, and validation tooling.

3. **Configure environment variables**

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
   > - `pnpm lint` (linting)
   > - `pnpm build` (SDK and library builds)
   >
   > Environment variables are only required for:
   >
   > - Running dev servers (`pnpm dev`)
   > - Integration/E2E tests (`pnpm test:e2e`)
   > - Smoke tests (`pnpm dev:smoke`)

4. **Regenerate types & run quality gates**

   ```bash
   pnpm make   # install -> type-gen -> build -> type-check -> doc-gen -> lint -> format
   pnpm qg     # format-check -> type-check -> lint -> markdownlint -> test suites -> smoke
   ```

5. **Choose your starting point**

   **For SDK/Library contributors** (no env vars needed):
   - Start with `packages/sdks/oak-curriculum-sdk/README.md` – SDK generation, MCP tool generation, shared parsing helpers
   - Work on type generation scripts, runtime clients, or validation helpers

   **For search application contributors** (requires Elasticsearch + API keys):
   - Start with `apps/oak-search-cli/README.md` – hybrid search, admin endpoints, telemetry
   - Requires: `OAK_API_KEY`, `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`

   **For MCP server contributors** (requires OAK_API_KEY minimum):
   - Stdio: `apps/oak-curriculum-mcp-stdio/README.md` – for Claude Desktop, Cursor
   - HTTP: `apps/oak-curriculum-mcp-streamable-http/README.md` – OAuth-enabled, Vercel-ready
   - Both import generated tools from the SDK - no manual tool definitions

## Key Commands (root)

```bash
pnpm install        # Install dependencies
pnpm type-gen       # Regenerate SDK + MCP artefacts from OpenAPI
pnpm build          # Build all workspaces
pnpm type-check     # Type-check apps and packages
pnpm doc-gen        # Generate TypeDoc/OpenAPI/markdown/AI docs
pnpm secrets:scan:all # Run secret scan (branches + tags + full history)
pnpm lint -- --fix  # Lint and auto-fix where possible
pnpm test           # Run unit + integration tests
pnpm test:ui        # Run Playwright suites
pnpm test:e2e       # Run end-to-end tests
pnpm dev:smoke      # Local smoke harness for MCP servers
pnpm make           # Full pipeline (install -> type-gen -> build -> docs -> lint -> format)
pnpm qg             # Quality gate (format-check -> type-check -> lint -> markdownlint -> tests -> smoke)
```

## Type Safety & Validation

- The SDK emits generated Zod schemas for curriculum responses, search responses, and request parameter maps.
- `parseSchema`, `parseWithCurriculumSchema`, `parseEndpointParameters`, and `parseSearchResponse` wrap `schema.safeParse`, returning typed `ValidationResult` objects without manual assertions.
- MCP servers, the search system, and admin tooling import these helpers — no consumer duplicates schema knowledge ([ADR-048](docs/architecture/architectural-decisions/048-shared-parse-schema-helper.md)).

## Documentation & Onboarding

- [docs/development/onboarding.md](docs/development/onboarding.md) – first-stop checklist for new developers and AI assistants.
- [docs/README.md](docs/README.md) – architecture and development index.
- Workspace READMEs (SDK + Semantic Search) explain local setup, admin workflows, and validation flow.

## Contributing

We welcome contributions from Oak team members and the wider community. Before starting work:

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) for workflow, commit conventions, and quality expectations.
2. Review [GO.md](GO.md) for the grounding cadence (ACTION → REVIEW, regular GROUNDING checkpoints).
3. Keep documentation close to your changes — onboarding, workspace READMEs, and ADRs should stay current.

Quality gate checklist:

```bash
pnpm make
pnpm qg
```

## Support & Licensing

- 📖 Documentation – [docs/README.md](docs/README.md)
- 🐛 Issues – <https://github.com/oaknational/oak-mcp-ecosystem/issues>
- 💬 Discussions – <https://github.com/oaknational/oak-mcp-ecosystem/discussions>
- 📄 Licence – MIT (see [LICENSE](LICENSE)) – Oak branding remains protected; curriculum data uses the [Open Government Licence](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/).

Built with ❤️ by [Oak National Academy](https://www.thenational.academy/).
