---
fitness_line_target: 200
fitness_line_limit: 280
fitness_char_limit: 16000
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

Where the quality gates reveal an issue, the issue must be fixed,
regardless of the location or cause. There is no such thing as an
acceptable failure, ever.

NEVER disable any quality gates or Git hooks.

### Gate taxonomy — nine complementary layers

Each layer catches a different class of defect; the layers compose:

1. **Formatting** (`format`, `markdownlint`) — consistent style, no merge noise.
2. **Type correctness** (`type-check`) — compile-time type safety.
3. **Linting** (`lint`) — code patterns, import boundaries, architectural rules.
   Custom lint rules (`@oaknational/eslint-plugin-standards`) encode
   architectural decisions as enforceable checks — workspace boundary rules,
   layer-direction constraints, file-count limits per directory, and prohibited
   import patterns. These turn ADRs into automated enforcement.
4. **Static analysis** (`knip`, `depcruise`) — unused code/exports/dependencies,
   circular dependencies, layer violations. These catch dead code and
   structural drift that linting and type-checking cannot see. Linting enforces
   _what you should do_; static analysis detects _what you forgot to clean up_.
5. **Testing** (`test`, `test:widget`, `test:e2e`, `test:ui`, `smoke`) —
   behavioural correctness at all levels.
6. **Mutation testing** (`mutate`) — test suite effectiveness. Proves tests
   actually detect real faults, not just exercise code paths.
7. **Build** (`build`) — production artefacts compile and bundle correctly.
8. **Specialist review** (sub-agents) — architectural compliance, security,
   documentation.
9. **Accessibility audit** (`test:a11y`) — WCAG 2.2 AA compliance for
   UI-shipping workspaces, zero-tolerance, both themes.

### Specialist Review Findings

Reviewer findings are action items by default. Accepted findings are
implementation work; rejected findings need written rationale; non-blocking
deferrals need owner-visible next action. Full invocation and disposition
policy lives at `.agent/memory/executive/invoke-code-reviewers.md`.

## Problem-Hiding Patterns

Fix the problem named by a gate; do not silence the signal that names it.
The expanded examples and cures live in
[Problem-Hiding Patterns](./problem-hiding-patterns.md).

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
- **Explicitly handle both success and error cases** - All
  functions must handle both success and error cases, i.e. use the
  Result type.
- **`void promise` swallows rejections** - Use
  `.catch(logger.error)` for cleanup promises in event handlers
  like `res.on('close')`
- **Distinct HTTP semantics** - NEVER collapse distinct HTTP status
  codes into a single error kind (e.g. 404 and 451 have different
  meanings). Per-service error types are cleaner than a unified
  error type — each service has different failure modes.

### Architecture Level

- **Long-term architectural excellence over expediency** - Prefer
  the strongest long-term foundation, but still ask the first
  question and reject speculative complexity. Worked failure-mode
  example: a shortcut that creates duplication across architectural
  layers is not a shortcut — it is a debt that compounds silently.
  Copying a function "because it's faster" creates two
  implementations that drift apart. The cost of the drift is
  invisible until it manifests as a real bug (wrong search results,
  inconsistent behaviour, stale configuration). The correct response
  is always to fix the boundary, not to duplicate across it. See
  [principles.md § Architectural Excellence Over Expediency][arch-excellence]
  for the principle and PDR-043 / ADR-172 for the three-structural-
  cues operationalisation.

[arch-excellence]: ../../.agent/directives/principles.md#architectural-excellence-over-expediency

- **SOLID principles** (loosely) - Focus on single responsibility and dependency inversion
- **Clean Architecture** (loosely) - Separate concerns into layers
- **Strict boundaries** - Clear interfaces between modules, no leaky abstractions
- **Single responsibility** - Each module/class/function does one thing well
- **TypeScript best practices** - See [TypeScript Practice](./typescript-practice.md)
- **SDKs do not own logging** - SDK functions return classified
  results; the app layer is responsible for observability. SDKs must
  not instantiate loggers or log internally. Pass results up; the
  app inspects and logs via its own logger instance.

## Refactoring Principles

- **Replace, don't layer** - NEVER create compatibility layers, replace old code with new code
- **No backward compatibility** - We have versioning for that;
  keep the system correct and functional
- **Break down complexity** - Long functions/files indicate multiple responsibilities
- **Domain boundaries** - Create folders with index.ts as the public API when splitting files
- **Question architecture** - If DIP causes complexity, the architecture may need refactoring
- **Single source of truth** - One responsibility, one reason to change, one place for each concept
- **Progressive ESLint re-enablement** - When a pre-existing
  override exists in a file you touch, fix the root cause. Narrow
  directory-wide overrides to file-specific first

### File Moves Between Workspaces

When moving files between workspaces, check whether removed tests
should be recreated in the destination. Also verify ESLint
overrides, README relative links, and `tsconfig` include patterns
transfer correctly.

### Response Augmentation is Best-Effort

Wrap `augmentBody()` and similar decoration calls in try-catch so
decoration never fails the API call. Pure functions throw; middleware
boundary logs.

### Validation After Rewrites

After any major rewrite or re-architecture, validation against the
real system is non-negotiable before wiring into consumers.

### Plans Before Code

When a directive review reveals significant work, update the plan
BEFORE coding. Do not start implementation until the plan reflects
the current understanding.

## Git Workflow

### Branching Strategy

- [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow)
  — feature branches merge to main
- All changes via pull requests
- Main branch must always be deployable
- Prefer `git worktree` over `git stash` for baseline comparisons
  — stash risks lost work

### Commit Messages

- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format
- Enforced by `commitlint` pre-commit hook
- Examples: `feat:`, `fix:`, `docs:`, `test:`, `refactor:`

## Documentation Practice

- Plans are execution documents (what to do, in what order).
  Permanently useful information belongs in ADRs, not plans.
  Extract permanent knowledge to ADRs before archiving a plan.
- Plans must be **discoverable** AND **actionable**.
  Discoverable: linked from the README, the relevant roadmap, AND
  the session prompt. Actionable: status-tracking tables,
  completion checklists, and resolved (not deferred) open
  questions. A plan that meets one criterion but not the other is
  drift — readers either cannot find it or cannot execute it.
- Reconcile parent when child changes runtime truth: a child plan
  that evolves runtime architecture must reconcile the parent plan
  and any closure proof in the same session. Otherwise the parent
  drifts away from the system as it actually runs.
- Narrative sections drift first. When syncing plan state, inspect
  body status lines, decision tables, and current-state prose —
  not just frontmatter and todo checkboxes. Frontmatter is easy to
  keep in sync; prose is where stale truth hides.
- Plan-following is not principle-following. Re-apply the first
  question at every elaboration boundary; see
  `.agent/rules/re-apply-first-question-at-elaboration-boundaries.md`
  for the runtime discipline.
- ADR "Accepted (Revised)" status: use for documentation entropy
  fixes where the core decision is unchanged. Do not supersede —
  it adds overhead for no structural benefit.
- ADR Consequences sections should use past tense for completed
  actions — stale future tense creates a false impression of
  outstanding work.
- Fenced code blocks without language specifier fail markdownlint
  MD040.
- NEVER compress docs to meet line limits — split files by
  responsibility instead.
- When moving plan artefacts, grep for old paths in `*.ts`,
  `*.mjs`, `*.json`, not just `*.md` — test configs and CLI
  defaults hardcode plan paths.
- When researching external documentation, fetch `sitemap.xml`,
  `llms.txt`, or the docs index first; do not guess URL patterns.
- Session prompts in `.agent/prompts/` should be updated at end
  of each session, not just the napkin.
- Keep pushed checkpoint state and local worktree state explicitly
  separate in plans/prompts/checkpoints.

## Environment Configuration

- `.env.local` files MUST mirror the structure of
  `.env.example` (same section headers, same ordering, same
  documentation comments). Drift between the two is a
  documentation defect.

## Terminology

- "Build time" is ambiguous — both codegen-time and runtime have
  build steps. Say "codegen time" for SDK generation pipeline
  steps, "runtime build" for app compilation. Never use "build
  time" unqualified.

## Related Documentation

- [Testing Strategy](../../.agent/directives/testing-strategy.md) - TDD approach at all levels
- [TypeScript Practice](./typescript-practice.md) - Type safety rules
- [Tooling](../engineering/tooling.md) - Development tools and versions
