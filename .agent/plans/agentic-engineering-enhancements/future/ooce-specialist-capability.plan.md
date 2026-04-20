# Oak Open Curriculum Ecosystem Specialist Capability — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements
**Pattern**: [ADR-129 (Domain Specialist Capability Pattern)](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)

## Problem and Intent

This repo has a rich ecosystem of internal packages with specific contracts,
patterns, and composition rules. Agents routinely misuse these libraries —
reaching for `try/catch` instead of `Result<T, E>`, constructing loggers
instead of injecting them, resolving env at call sites instead of startup,
using raw types instead of generated ones.

The architecture reviewers care about dependency direction and boundary
correctness. The OOCE specialist cares about **correct usage of the internal
APIs themselves** — it is the avatar of the repo itself.

## Scope

### In scope — Internal Package Contracts

| Package | Key Patterns | Common Mistakes |
|---------|-------------|----------------|
| `@oaknational/result` | `Result<T, E>`, `ok()`, `err()`, pattern matching | Using try/catch instead of Result; unwrapping without checking |
| `@oaknational/logger` | Sink architecture, DI injection, OTel format | Constructing logger directly; using console.log; wrong severity mapping |
| `@oaknational/env` | Env contract schemas, startup resolution | Accessing `process.env` directly; resolving at call site not startup |
| `@oaknational/env-resolution` | Resolution strategy, `resolveEnv()` | Missing `.env` isolation in tests; wrong `startDir` |
| `@oaknational/type-helpers` | Utility types, branded types | Reinventing type utilities that already exist |
| `@oaknational/sdk-codegen` | Generated types, vocab generation, synonyms | Editing generated files; wrong codegen command |
| `@oaknational/curriculum-sdk` | Public API surface, stub mode, retrieval service | Using internal types; bypassing stub mode in tests |
| `@oaknational/oak-search-sdk` | Search API, observability service | Coupling search-sdk to curriculum-sdk (banned per ADR-108) |
| `@oaknational/eslint-plugin-standards` | Custom lint rules, boundary enforcement | Disabling custom rules; wrong rule factory usage |

### In scope — Zod Patterns

Zod 4.x is used pervasively as the repo's runtime validation layer:

| Pattern | Where Used | Common Mistakes |
|---------|-----------|----------------|
| Env contract schemas | `@oaknational/env` | Wrong Zod version API (v3 vs v4 breaking changes) |
| OpenAPI adapter schemas | `openapi-zod-client-adapter` | Hand-writing schemas that should be generated |
| SDK response validation | curriculum-sdk, search-sdk | Overly permissive `.passthrough()` or missing `.strict()` |
| MCP tool input schemas | MCP apps | Schema/type divergence (Zod schema says one thing, TS type says another) |
| CLI argument validation | oak-search-cli | Validating too late (at use site not parse site) |

### In scope — Codegen Pipeline

The repo has a complex generation chain that agents frequently break:

```text
OpenAPI spec (external)
  → openapi-typescript (generates .d.ts types)
  → openapi-zod-client-adapter (generates Zod schemas)
  → oak-sdk-codegen (orchestrates generation)
  → oak-curriculum-sdk (consumes generated types)
  → vocab generation (pnpm vocab-gen, separate from sdk-codegen)
  → MCP tool descriptors (derived from SDK types)
```

| Rule | Why |
|------|-----|
| Never hand-edit files in `src/generated/` | They will be overwritten on next codegen run |
| `pnpm sdk-codegen` ≠ `pnpm vocab-gen` | Different generation stages with different inputs |
| Codegen before SDK build, SDK before app build | Turbo handles this, but manual runs must respect the order |
| Generated types are the source of truth | If the generated type disagrees with what you expect, fix the OpenAPI spec or the generator, not the generated file |

### In scope — Composition Patterns

- How apps wire internal packages together at startup
- Barrel file exports (`src/mcp-tools.ts`) and why missing exports cause
  `undefined` at runtime for `instanceof` checks
- Generated vocab files (`src/generated/vocab/`) need `pnpm vocab-gen`,
  not `pnpm sdk-codegen`
- Workspace dependency direction rules (which packages can import which)
- Test helper patterns (runtime stubs vs test fakes)

### Out of scope

- External library usage (Express, Clerk, ES, Sentry — each has own specialist)
- Architecture decisions about boundaries (architecture reviewers own this)
- Generic TypeScript patterns (type-reviewer owns this)
- Generic code quality (code-reviewer owns this)

## Doctrine Hierarchy

This specialist is unique — its primary authority is **internal**, not external:

1. **Internal package READMEs** — each package's README is the primary authority
   for that package's API and patterns
2. **Internal package source** — the actual implementation and types
3. **Repository ADRs** — ADR-078 (DI), ADR-108 (search/curriculum boundary),
   ADR-051 (OTel logging), and others that govern internal patterns
4. **Distilled learnings** — `.agent/memory/active/distilled.md` entries about
   internal package gotchas
5. **Testing strategy** — `.agent/directives/testing-strategy.md` for how
   internal packages should be tested

## Deployment Context

**Monorepo with Turborepo orchestration**. Key constraints:

- All internal packages are workspace dependencies (`workspace:*`)
- Build order matters — codegen before SDK, SDK before apps
- Barrel files must be complete — missing exports break runtime
- Generated files must not be hand-edited

## Deliverables

1. Canonical reviewer template: `.agent/sub-agents/templates/ooce-reviewer.md`
2. Canonical skill: `.agent/skills/ooce-expert/SKILL.md`
3. Canonical situational rule: `.agent/rules/invoke-ooce-reviewer.md`
4. Platform adapters (Claude, Cursor, Codex)
5. Discoverability updates
6. Validation

## Must-Read Tier

Every internal package README:

- `packages/core/result/README.md`
- `packages/libs/logger/README.md`
- `packages/core/env/README.md`
- `packages/core/env-resolution/README.md`
- `packages/core/type-helpers/README.md`
- `packages/sdks/oak-curriculum-sdk/README.md`
- `packages/sdks/oak-search-sdk/README.md`
- `packages/sdks/oak-sdk-codegen/README.md`
- `packages/libs/eslint-plugin-standards/README.md`

## Overlap Boundaries

| Specialist | Owns | Does NOT own |
|-----------|------|-------------|
| **ooce-reviewer** | Internal package API usage, composition patterns, generated file handling | External lib usage, boundary direction, generic TS |
| **architecture reviewers** | Dependency direction, boundary correctness | Internal API correctness |
| **type-reviewer** | Generic TypeScript type safety | Package-specific type patterns |
| **code-reviewer** | General code quality, gateway triage | Internal package domain knowledge |
| **test-reviewer** | Test structure and TDD compliance | Package-specific test patterns (stubs vs fakes) |

## Gap Analysis Findings (2026-03-14)

The following concerns were identified during a full tech-stack gap analysis and
routed to OOCE as sub-scopes rather than separate specialists:

### Routed here (locked in)

- **Zod patterns**: Zod 4.x pervasive throughout — env contracts, OpenAPI
  adapters, SDK validation, CLI args. v3→v4 breaking changes are a recurring
  agent mistake. Added as explicit in-scope section above.
- **Codegen pipeline**: Complex multi-stage generation chain (OpenAPI → types →
  Zod → SDK → vocab → MCP descriptors). Agents edit generated files, use wrong
  commands, break the order. Added as explicit in-scope section above.
- **TypeDoc generation**: TypeDoc 0.28.x generates API docs. Small surface area
  — fits here as part of the "generated files" concern (don't hand-edit, run
  the right command).

### Routed elsewhere

- **CI/CD config** (GitHub Actions, semantic-release): routed to config-reviewer
  scope expansion — CI config is tooling config.
- **Vercel deployment specifics**: routed to Express specialist — already in
  scope as "Vercel deployment specifics".
- **Redis/caching**: surface area too small for any specialist — a few files in
  one CLI. Code-reviewer + architecture reviewers suffice.
- **Secrets lifecycle**: routed to security-reviewer — secret rotation is a
  security concern.
- **Hono**: pinned dependency override, not actively used as framework. Monitor;
  if it becomes active, route to Express/web-framework specialist.

## Promotion Trigger

This plan promotes to `current/` when:

1. A session involves significant cross-package work
2. The internal package ecosystem is stable enough to document authoritatively
3. No conflicting work is in progress on the agent artefact layer
