---
fitness_line_target: 150
fitness_line_limit: 200
fitness_char_limit: 12000
fitness_line_length: 100
split_strategy: 'Extract growing sections to dedicated governance docs by responsibility'
---

# Development Practice

**Last Updated**: 2026-02-28  
**Status**: Active guidance

NEVER disable checks of any kind, ever.

## Quality Gates

The quality gates must be run after all major changes, and before each commit:

- `pnpm sdk-codegen` - Type generation
- `pnpm build` - Build
- `pnpm type-check` - Type checking (TypeScript strict mode)
- `pnpm lint:fix` - Linting with auto-fix (ESLint)
- `pnpm format:root` - Code formatting (Prettier)
- `pnpm markdownlint:root` - Markdown lint
- `pnpm test` - Testing (Vitest)

Locally we can also run

- `pnpm test:e2e` - E2E tests (requires appropriate API keys set in the root `.env`)

For AI agent execution order, follow directive-defined one-gate-at-a-time runs
from the grounding directives/prompts first; aggregate commands remain
convenience workflows for local human development.

Where the quality gates reveal an issue, the issue must be fixed, regardless of the location or cause. There is no such thing as an acceptable failure, ever.

NEVER disable any quality gates or Git hooks.

## Design Principles

### Code Level

- **Prefer PURE functions** - almost all code should be pure functions with NO SIDE EFFECTS
- **DRY, KISS, and YAGNI** - Avoid duplication, keep it simple, build only what's needed
- **Mockable IO** - All external interactions must be injectable/mockable
- **No duplication** - NEVER create duplicate interfaces, types, classes, or functions
- **No unnecessary wrappers** - Use functions directly rather than wrapping them

### Error Handling

- **Fail FAST** - Detect and report errors immediately
- **Fail hard** - Crash with instructive, helpful error messages
- **Do not fail open** - Never continue with potentially invalid state
- **Do not fail silently** - Every error must be visible
- **Never swallow errors** - All errors must propagate or be handled explicitly
- **Preserve cause chains** - All errors must preserve the cause chain
- **No "sensible defaults"** - If a required argument is missing, throw an error
- **Explicitly handle both success and error cases** - All functions must handle both success and error cases, i.e. use the Result type.
- **`void promise` swallows rejections** - Use `.catch(logger.error)` for cleanup promises in event handlers like `res.on('close')`
- **Distinct HTTP semantics** - NEVER collapse distinct HTTP status codes into a single error kind (e.g. 404 and 451 have different meanings). Per-service error types are cleaner than a unified error type — each service has different failure modes.

### Architecture Level

- **Long-term architectural excellence over expediency** - Prefer the strongest long-term foundation, but still ask the first question and reject speculative complexity
- **SOLID principles** (loosely) - Focus on single responsibility and dependency inversion
- **Clean Architecture** (loosely) - Separate concerns into layers
- **Strict boundaries** - Clear interfaces between modules, no leaky abstractions
- **Single responsibility** - Each module/class/function does one thing well
- **TypeScript best practices** - See [TypeScript Practice](./typescript-practice.md)
- **SDKs do not own logging** - SDK functions return classified results; the app layer is responsible for observability. SDKs must not instantiate loggers or log internally. Pass results up; the app inspects and logs via its own logger instance.

## Refactoring Principles

- **Replace, don't layer** - NEVER create compatibility layers, replace old code with new code
- **No backward compatibility** - We have versioning for that; keep the system correct and functional
- **Break down complexity** - Long functions/files indicate multiple responsibilities
- **Domain boundaries** - Create folders with index.ts as the public API when splitting files
- **Question architecture** - If DIP causes complexity, the architecture may need refactoring
- **Single source of truth** - One responsibility, one reason to change, one place for each concept
- **Progressive ESLint re-enablement** - When a pre-existing override exists in a file you touch, fix the root cause. Narrow directory-wide overrides to file-specific first

### File Moves Between Workspaces

When moving files between workspaces, check whether removed tests should be recreated in the destination. Also verify ESLint overrides, README relative links, and `tsconfig` include patterns transfer correctly.

### Response Augmentation is Best-Effort

Wrap `augmentBody()` and similar decoration calls in try-catch so decoration never fails the API call. Pure functions throw; middleware boundary logs.

### Validation After Rewrites

After any major rewrite or re-architecture, validation against the real system is non-negotiable before wiring into consumers.

### Plans Before Code

When a directive review reveals significant work, update the plan BEFORE coding. Do not start implementation until the plan reflects the current understanding.

## Git Workflow

### Branching Strategy

- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow) - feature branches merge to main
- All changes via pull requests
- Main branch must always be deployable
- Prefer `git worktree` over `git stash` for baseline comparisons — stash risks lost work

### Commit Messages

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format
- Enforced by `commitlint` pre-commit hook
- Examples: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`

## Documentation Practice

- Plans are execution documents (what to do, in what order). Permanently useful information belongs in ADRs, not plans. Extract permanent knowledge to ADRs before archiving a plan.
- ADR "Accepted (Revised)" status: use for documentation entropy fixes where the core decision is unchanged. Do not supersede — it adds overhead for no structural benefit.
- ADR Consequences sections should use past tense for completed actions — stale future tense creates a false impression of outstanding work.
- Fenced code blocks without language specifier fail markdownlint MD040.
- NEVER compress docs to meet line limits — split files by responsibility instead.
- When moving plan artefacts, grep for old paths in `*.ts`, `*.mjs`, `*.json`, not just `*.md` — test configs and CLI defaults hardcode plan paths.
- When researching external documentation, fetch `sitemap.xml`, `llms.txt`, or the docs index first; do not guess URL patterns.
- Session prompts in `.agent/prompts/` should be updated at end of each session, not just the napkin.
- Keep pushed checkpoint state and local worktree state explicitly separate in plans/prompts/checkpoints.

## Related Documentation

- [Testing Strategy](../../.agent/directives/testing-strategy.md) - TDD approach at all levels
- [TypeScript Practice](./typescript-practice.md) - Type safety rules
- [Tooling](../engineering/tooling.md) - Development tools and versions
