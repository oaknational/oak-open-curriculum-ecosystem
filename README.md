# Oak MCP Ecosystem

This monorepo contains Oak National Academy’s Model Context Protocol (MCP) ecosystem:

- **`packages/sdks/oak-curriculum-sdk`** – the generated TypeScript SDK for the Oak Open Curriculum API. It exports runtime clients, Zod schemas, MCP tool metadata, and the shared `parseSchema` helper that validates every request/response boundary.
- **`apps/oak-open-curriculum-semantic-search`** – a Next.js App Router workspace that indexes curriculum content into Elasticsearch Serverless and serves hybrid (lexical + semantic) search, suggestions, admin tooling, and telemetry.
- **`apps/oak-curriculum-mcp-*`** – MCP servers (stdio and streamable HTTP) that surface the SDK to AI assistants such as Codex, Claude, and Gemini.
- **Supporting libraries** under `packages/libs/` for logging, configuration, storage, and transport.

If the curriculum API changes, run `pnpm type-gen`. The SDK, MCP tool catalogues, search validators, and docs regenerate automatically and continue to rely on the shared parsing helpers without manual updates.

## Architecture Overview

| Directory        | Purpose                                                         |
| ---------------- | --------------------------------------------------------------- |
| `apps/`          | MCP servers and the Semantic Search web app                     |
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

4. **Regenerate types & run quality gates**

   ```bash
   pnpm make   # install -> type-gen -> build -> type-check -> doc-gen -> lint -> format
   pnpm qg     # format-check -> type-check -> lint -> markdownlint -> test suites -> smoke
   ```

5. **Explore the workspaces**
   - `packages/sdks/oak-curriculum-sdk/README.md` – SDK usage, MCP tool generation, shared parsing helper guidance.
   - `apps/oak-open-curriculum-semantic-search/README.md` – indexing pipeline, admin endpoints, zero-hit observability, hybrid search contracts.
   - `apps/oak-curriculum-mcp-stdio/` & `apps/oak-curriculum-mcp-streamable-http/` – running MCP servers locally or via Vercel.

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
