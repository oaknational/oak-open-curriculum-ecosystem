# Oak MCP Ecosystem

**A type-safe, compile-time pipeline for generating SDKs and MCP servers from OpenAPI specifications.**

## What This Is

This monorepo demonstrates and implements a pattern where:

1. **OpenAPI Schema** (single source of truth)
2. **→ TypeScript SDK** (generated at `pnpm type-gen`)
3. **→ MCP Tools** (generated from the same schema)
4. **→ Type-safe everything** (no manual type definitions, no runtime assertions)

**Key principle**: If the OpenAPI schema changes, running `pnpm type-gen` updates the SDK, types, validators, and MCP tools automatically. Zero manual intervention.

## Implementation: Oak Open Curriculum

This pattern is implemented for the [Oak National Academy Curriculum API](https://www.thenational.academy/):

- **`packages/sdks/oak-curriculum-sdk`** – Generated SDK with runtime clients, Zod schemas, MCP tool metadata, and shared `parseSchema` helper that validates every request/response boundary
- **`apps/oak-curriculum-mcp-stdio`** – MCP server over stdio (for Claude Desktop, Cursor)
- **`apps/oak-curriculum-mcp-streamable-http`** – MCP server over HTTP (for web clients, Vercel deployment)
- **`apps/oak-open-curriculum-semantic-search`** – Hybrid search application using the SDK
- **Supporting libraries** under `packages/libs/` for logging, configuration, storage, and transport

**Architectural reference**: `apps/oak-notion-mcp` demonstrates the pattern isn't Oak-specific.

## Architecture Overview

| Directory        | Purpose                                                         |
| ---------------- | --------------------------------------------------------------- |
| `apps/`          | MCP servers and the Semantic Search web app                     |
| `packages/core/` | Core infrastructure (ESLint configs, Zod adapters)              |
| `packages/sdks/` | Generated SDKs (currently the Oak Curriculum SDK)               |
| `packages/libs/` | Shared libraries for logging, configuration, storage, transport |
| `docs/`          | Developer documentation, onboarding guides, ADRs                |

Architectural decisions are recorded as ADRs in [docs/architecture/architectural-decisions/](docs/architecture/architectural-decisions/). ADR-048 documents the shared parsing helper pattern introduced with the new `parseSchema` function.

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
   - Start with `apps/oak-open-curriculum-semantic-search/README.md` – hybrid search, admin endpoints, telemetry
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
- MCP servers, the Semantic Search app, and admin tooling import these helpers—no consumer duplicates schema knowledge. ADR-048 formalises this shared pattern.

## Documentation & Onboarding

- [docs/development/onboarding.md](docs/development/onboarding.md) – first-stop checklist for new developers and AI assistants.
- [docs/README.md](docs/README.md) – architecture and development index.
- Workspace READMEs (SDK + Semantic Search) explain local setup, admin workflows, and validation flow.

## Contributing

We are iterating internally but welcome interest. Before starting work:

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) for workflow, commit conventions, and helper usage expectations.
2. Review [GO.md](GO.md) for the grounding cadence.
3. Keep documentation close to your changes—onboarding, workspace READMEs, and ADRs should stay current.

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
