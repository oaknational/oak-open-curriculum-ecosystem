# Developer Onboarding

**Last Updated**: 2026-02-25  
**Status**: Active onboarding guide

Welcome to the Oak MCP ecosystem. Oak's mission is to improve pupil outcomes and close the disadvantage gap by supporting teachers to teach. This repository turns Oak's openly-licensed curriculum into AI-native infrastructure — SDKs, MCP servers, and semantic search — so that AI tools can help teachers find, adapt, and use high-quality curriculum content. Your engineering work here has a direct path to teacher impact and pupil outcomes.

This guide points you to the documentation, plans, and tooling you need in your first pass through the repository.

> **Note**: This repo works with the [Oak Open Curriculum API](https://open-api.thenational.academy/) — Oak's openly-licensed curriculum data, organised to support reuse. See the root README for context on how this relates to Oak's main site.
>
> **Canonical path**: this is the single onboarding source of truth.
>
> **Audience**: human contributors (especially junior-to-mid-level developers).
>
> **AI agents**: onboarding starts with the `start-right` workflow:
>
> - Cursor command: [`.cursor/commands/jc-start-right.md`](../../.cursor/commands/jc-start-right.md)
> - Prompt: [`.agent/prompts/start-right.prompt.md`](../../.agent/prompts/start-right.prompt.md)
> - Skill: [`.agent/skills/start-right/SKILL.md`](../../.agent/skills/start-right/SKILL.md)
>   Then continue with [`.agent/directives/AGENT.md`](../../.agent/directives/AGENT.md).
>
> **Architecture source of truth**: Architectural Decision Records (ADRs) define how the system should work and are the architectural source of truth.

## Prerequisites

Before cloning, ensure you have:

**Required** (clone, build, test):

- **Node.js 24.x** — install via [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm). The repo includes an `.nvmrc` file, so `nvm use` or `fnm use` will select the correct version.
- **pnpm** — run `corepack enable` to auto-install the pinned pnpm version (currently 10.x). Corepack ships with Node.js and reads the version from `package.json`.

**Required for push**:

- **gitleaks** — a binary secret scanner. Install from [gitleaks releases](https://github.com/gitleaks/gitleaks/releases). The husky pre-push hook runs `gitleaks detect`; your first push will fail with a confusing binary-not-found error if gitleaks is not installed.

## 0. Choose Your Path

Pick the path that matches your first task. If you are not sure, **start with the SDK/docs path** — it requires no credentials and lets you explore the codebase safely.

| Path                       | What you will do                                                                                           | Credentials needed                                                                                                                                                                                                                                                                             |
| -------------------------- | ---------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| SDK/docs path              | Work on the SDK (Software Development Kit) generation pipeline, TypeScript types, documentation, and tests | None                                                                                                                                                                                                                                                                                           |
| MCP server path            | Build features for the MCP (Model Context Protocol) servers that connect AI tools to curriculum data       | `OAK_API_KEY`                                                                                                                                                                                                                                                                                  |
| Search/release path        | Work on the semantic search application, Elasticsearch indexing, or npm releases                           | Multiple (`OAK_API_KEY`, `ELASTICSEARCH_*`, release credentials)                                                                                                                                                                                                                               |
| Lead/senior developer path | Understand architecture, review process, extension points, and team workflow                               | None to start                                                                                                                                                                                                                                                                                  |
| Strategic / leadership     | Understand vision, impact, and investment case                                                             | None — start with [VISION.md](../VISION.md), then [Curriculum Guide](../curriculum-guide.md), then [roadmap milestones](../../.agent/plans/high-level-plan.md). For technical depth: [ADR index](../architecture/architectural-decisions/), [practice.md](../../.agent/directives/practice.md) |

## What's Different About This Repo

Before diving in, read these six points. They explain the engineering culture and why the rules exist.

1. **Schema-first generation** — All types, validators, and MCP (Model Context Protocol — a standard for connecting AI tools to data sources) tool metadata are generated from the OpenAPI (a machine-readable specification describing an HTTP API) schema at compile time. Nobody writes type definitions by hand. If the upstream API changes, `pnpm sdk-codegen` updates everything automatically.

2. **Strict TDD (Test-Driven Development) at all levels** — Tests are written _before_ code, at every level: unit, integration, and end-to-end. The cycle is Red (write a failing test), Green (write minimal code to pass), Refactor (improve without changing behaviour). For example, to add a new pure function in the SDK, you would first write a unit test specifying the expected behaviour, run it to confirm it fails, then implement the function, and run the test again to confirm it passes.

3. **No type shortcuts** — `as`, `any`, `!`, and `Record<string, unknown>` are all banned. Type information is structural truth; widening it destroys knowledge. Use type guards and Zod (a TypeScript-first runtime validation library) schemas to narrow types to known, specific types.

4. **No disabled quality gates** — Quality gates (type-check, lint, format, test) are never disabled, never bypassed, never worked around. They are the structural immune system of the codebase: they communicate intended structure, detect variance early, and reduce entropy. Without them, the repository would slowly degrade and eventually die. They are both a statement of a goal and the means to achieve it.

5. **Result pattern** — Functions return `Result<T, E>` instead of throwing exceptions. Every error is handled explicitly. No silent failures.

6. **Agentic engineering practice** — AI sub-agents review code, architecture, types, tests, and security during development. Human developers follow the same rules the agents follow. The practice is what produces the product code; it is not the product code itself. See [practice.md](../../.agent/directives/practice.md) for details.

---

## Day 1 Essentials

Steps 1-4 below get you to a working, verified local setup. Everything after that is reference material — read it when you need it.

**Estimated time to first verified setup**:

| Contribution level                | Time estimate |
| --------------------------------- | ------------- |
| SDK/docs (no credentials)         | ~15 minutes   |
| MCP server (one API key)          | ~30 minutes   |
| Full stack (multiple credentials) | 1-2 hours     |

### 1. Understand the Core Architecture

Everything flows from the OpenAPI schema through a compile-time pipeline:

```text
OpenAPI Spec (single source of truth)
         |
    pnpm sdk-codegen (compile time)
         |
    +-----------------------------------------------+
    |                    |                           |
TypeScript SDK      MCP Tools             Search Type Generators
(types, clients,  (metadata, validators,  (ES mappings, index docs,
 Zod schemas)      input/output shapes)    search constants)
    |                    |                           |
Runtime Apps        MCP Servers            Semantic Search
(admin, CLI)      (stdio, HTTP)           (4-way RRF hybrid)
```

**The Cardinal Rule**: If the upstream API changes, `pnpm sdk-codegen` is sufficient to update everything.

Read the full explanation: [OpenAPI Pipeline Architecture](../architecture/openapi-pipeline.md)

Start with the [ADR (Architectural Decision Record)](../architecture/architectural-decisions/) index, then read this foundational set:

- [ADR-029](../architecture/architectural-decisions/029-no-manual-api-data.md) — No manual API data structures
- [ADR-030](../architecture/architectural-decisions/030-sdk-single-source-truth.md) — SDK as single source of truth
- [ADR-031](../architecture/architectural-decisions/031-generation-time-extraction.md) — Generation-time extraction

For an expanded architectural introduction, see [Start Here: 5 ADRs in 15 Minutes](../architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes) in the ADR index.

### 2. Read the Grounding Docs

1. [`.agent/directives/AGENT.md`](../../.agent/directives/AGENT.md) — the canonical agent entry point. Links to rules, testing strategy, schema-first execution, and essential reading.
2. [`.agent/directives/rules.md`](../../.agent/directives/rules.md) — British spelling, TDD, no disabled quality gates, type safety, and all other mandatory rules.
3. [`.agent/directives/practice.md`](../../.agent/directives/practice.md) — a map of the agentic engineering practice: the system of rules, workflows, sub-agents, and quality gates that governs how work happens.
4. Relevant plans and context documents for the area you're working on (e.g., `.agent/plans/semantic-search/*` for search features).

### 3. Understand the Repository Layout

- [`README.md`](../../README.md) — high-level description of the ecosystem and shared parsing helpers.
- [`packages/sdks/oak-sdk-codegen/README.md`](../../packages/sdks/oak-sdk-codegen/README.md) — OpenAPI/code-generation pipeline and generated artefacts.
- [`packages/sdks/oak-curriculum-sdk/README.md`](../../packages/sdks/oak-curriculum-sdk/README.md) — Runtime SDK exports consumed by applications.
- [`apps/oak-search-cli/README.md`](../../apps/oak-search-cli/README.md) — ingestion, admin flows, hybrid search.
- MCP server READMEs (`apps/oak-curriculum-mcp-*`) — running stdio/HTTP servers locally or on Vercel.

### 4. Install, Verify, and Regenerate

**Verify (no API keys required)**:

```bash
pnpm install
pnpm test       # Unit/integration suites — you should see all tests passing, no failures
pnpm type-check # TypeScript compilation checks — you should see no errors
pnpm lint:fix   # Linting and auto-fixes — you should see no remaining errors
```

If these pass, your toolchain is working and you can start contributing to SDK/docs work immediately.

**Full pipeline (may require API keys for some steps)**:

```bash
pnpm make       # install → build (includes sdk-codegen) → type-check → doc-gen → lint:fix → subagents:check → markdownlint:root → format:root
```

See [Build System](./build-system.md) for the single source of truth on all command definitions, caching, and gate ordering.

### You're Ready When...

- [ ] `pnpm test` passes with no failures
- [ ] `pnpm type-check` reports no errors
- [ ] `pnpm lint:fix` reports no remaining issues
- [ ] You have read the three foundational ADRs (029, 030, 031)
- [ ] You know which path you are following (SDK/docs, MCP server, search, or leadership)

---

## Reference — Read When You Need It

### 5. Run Full Quality Gates

```bash
pnpm qg  # format-check:root → markdownlint-check:root → subagents:check → type-check → lint → test → test:ui → test:e2e → smoke:dev:stub
```

Use `pnpm qg` once you are ready to run full-gate validation across UI, E2E, and smoke suites. This is slower and typically requires service credentials.
For AI agent execution order, directive-defined one-gate-at-a-time runs take
precedence (see
[`start-right-thorough.prompt.md`](../../.agent/prompts/start-right-thorough.prompt.md));
`pnpm qg` remains a convenience aggregate for human local workflows.

See [Environment Variables Guide](./environment-variables.md) for complete setup details when you're ready.

#### Known Gate Caveats

As of **20 February 2026**, this suite is known to fail in clean local runs:

- `apps/oak-curriculum-mcp-streamable-http/tests/widget/widget-rendering.spec.ts` (fails in `pnpm qg` via `test:ui`)

If `pnpm qg` fails, run the affected suite directly and check latest issues/ADRs/plans before assuming local setup problems.

### 6. Shared Parsing Helpers

- `parseSchema`, `parseWithCurriculumSchema`, `parseEndpointParameters`, and `parseSearchResponse` use `schema.safeParse` with generated `_input`/`_output` types.
- Request validators (`request-validators.ts`) and search validators (`search-response-validators.ts`) import these helpers; **never** re-implement validation logic in consumers.
- ADR-048 documents this pattern and when to extend it (e.g. for new request payloads).

### 7. Workspace Priorities

- **Curriculum SDK** (`packages/sdks/oak-curriculum-sdk`) — The type generation pipeline. Keep generation scripts deterministic, update docs via `pnpm doc-gen`, and ensure new helpers are exported from `src/validation/index.ts`.
- **Semantic Search** (`apps/oak-search-cli`) — The largest workspace (a workspace is a package within this monorepo). 4-way RRF hybrid search across 7 Elasticsearch indices, with ingestion, query processing, ground truth evaluation, and benchmark suite. See [ARCHITECTURE.md](../../apps/oak-search-cli/docs/ARCHITECTURE.md) for the full picture.
- **MCP Servers** — Expose the curriculum to AI agents. Consume SDK exports directly; configuration examples live in the app READMEs.

**Domain ADR handoffs** (read when you start work in that area):

- **SDK generation**: [ADR-029](../architecture/architectural-decisions/029-no-manual-api-data.md), [ADR-030](../architecture/architectural-decisions/030-sdk-single-source-truth.md), [ADR-031](../architecture/architectural-decisions/031-generation-time-extraction.md), [ADR-048](../architecture/architectural-decisions/048-shared-parse-schema-helper.md)
- **Semantic search**: [ADR-063](../architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md), [ADR-074](../architecture/architectural-decisions/074-elastic-native-first-philosophy.md), [ADR-076](../architecture/architectural-decisions/076-elser-only-embedding-strategy.md)
- **MCP runtime/auth**: [ADR-107](../architecture/architectural-decisions/107-deterministic-sdk-nl-in-mcp-boundary.md), [ADR-113](../architecture/architectural-decisions/113-mcp-spec-compliant-auth-for-all-methods.md), [ADR-115](../architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md)

### 8. Documentation Expectations

- Update the relevant README whenever behaviour or setup changes.
- Add or update ADRs when a new architectural rule emerges (e.g. shared parsing, ingestion flow).
- Document architectural patterns and generation improvements.
- When renaming commands in `package.json`, search all markdown files for the old name and update them. See the [Command Naming](./build-system.md#command-naming-source-of-truth) section in the Build System docs.

### 9. Quality Gate Checklist

```bash
pnpm format:root        # Format code
pnpm markdownlint:root  # Lint markdown
pnpm type-check         # Verify types compile
pnpm lint:fix           # Check and auto-fix code style
pnpm test               # Unit and integration tests
pnpm doc-gen            # Generate API documentation
```

Keep CI green locally; no `--no-verify` or disabled lint rules. See [Build System](./build-system.md) for details on caching and gate ordering.

### 10. Understand Curriculum Data Variances

The Oak curriculum data has significant variances across subjects and key stages. Before working on search or ingestion:

- **Start here**: [Curriculum Guide](../curriculum-guide.md) — plain-language overview of how the curriculum is organised, what makes KS4 different, and what it means for search
- **Then read**: [Data Variances](../data/DATA-VARIANCES.md) — transcript availability, structural patterns, KS4 complexity
- **Key insight**: MFL subjects (French, Spanish, German) have 0% transcript coverage; Maths has 100%
- **Key insight**: KS4 has tiers, exam boards, and `ks4Options` that don't exist in KS1-3
- **Key insight**: Only 3 subjects (English, Science, RE) have categories

### 11. The Development Workflow

See the [Development Workflow](./workflow.md) for the complete lifecycle: branching, TDD, quality gates, commits, PRs, CI, AI sub-agent review, human review, merge, and release.

### 12. The Agentic Engineering Practice

This repository uses an **agentic engineering practice** — a system where AI agents and human developers work together under shared rules and quality gates. Here is what this means for you.

**What the AI sub-agents do**: During development, the AI agent working on code invokes specialist reviewers that check for specific concerns:

| Sub-agent                 | What it checks                                          |
| ------------------------- | ------------------------------------------------------- |
| `code-reviewer`           | Code quality, security, maintainability                 |
| `architecture-reviewer-*` | Module boundaries, dependency direction, coupling risks |
| `test-reviewer`           | TDD compliance, test quality, mock simplicity           |
| `type-reviewer`           | Type safety, generics, schema-to-type flow              |
| `security-reviewer`       | Auth, secrets, PII exposure, injection risks            |
| `docs-adr-reviewer`       | Documentation completeness, ADR accuracy                |

**When they run**: Sub-agents run during AI-assisted development, not in CI. They are invoked after non-trivial changes and their findings are addressed during the development session.

**What about napkin.md and distilled.md?**: These are AI institutional memory files in `.agent/memory/`. The napkin captures session-level learnings; the distilled file is a curated rulebook of hard-won patterns. You can ignore them unless you are curious about what the AI agents have learned. The [Sustainability and Scaling](../../.agent/directives/practice.md#sustainability-and-scaling) section of practice.md explains how these files and the broader documentation volume are managed.

**What is expected of human developers**: Follow the same rules the AI agents follow — TDD at all levels, no type shortcuts, no disabled quality gates, Result pattern for error handling. The rules apply equally to humans and AI. See [rules.md](../../.agent/directives/rules.md).

**How AI review fits the PR lifecycle**: AI sub-agent reviews happen during development. They are advisory and inform the code as it is written. CI gates and human review happen at PR time. See the [Development Workflow](./workflow.md) for the full lifecycle.

**For managers**: The practice enables a single engineer working with AI to produce high-quality, well-architected software at significant velocity. The extensive ADR catalogue, comprehensive quality gate suite, and specialist sub-agent reviewers are evidence of engineering maturity. The practice is documented in [ADR-119](../architecture/architectural-decisions/119-agentic-engineering-practice.md) and mapped in [practice.md](../../.agent/directives/practice.md).

### 13. Useful References

- [docs/README.md](../README.md) — Documentation hub
- [Data Variances](../data/DATA-VARIANCES.md) — Subject/key stage differences
- [docs/architecture/architectural-decisions/](../architecture/architectural-decisions/) — ADRs
- [docs/agent-guidance/development-practice.md](../agent-guidance/development-practice.md) — Code standards
- [Testing Strategy](../../.agent/directives/testing-strategy.md) — TDD approach at all levels
- [ontology-data.ts](../../packages/sdks/oak-curriculum-sdk/src/mcp/ontology-data.ts) — Domain model and structural patterns
- [Release and Publishing](./release-and-publishing.md) — SDK publishing, operator runbook, rollback procedures
- [Extension Points](./extending.md) — How to add new MCP tools, search indices, SDK helpers, and core packages

If you run into problems, check the [Troubleshooting Guide](./troubleshooting.md) first.
