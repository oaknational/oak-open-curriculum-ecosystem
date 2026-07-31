---
fitness_line_target: 200
fitness_line_limit: 280
fitness_char_limit: 16000
fitness_line_length: 100
split_strategy: 'Extract growing sections to dedicated governance docs by responsibility'
---

# Development Practice

**Last Updated**: 2026-07-04  
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

- `pnpm test:e2e` - E2E tests (use mocks and dependency injection; no service
  credentials required)

For AI agent execution order, follow directive-defined one-gate-at-a-time runs
from the grounding directives/prompts first; aggregate commands remain
convenience workflows for local human development.

Where the quality gates reveal an issue, the issue must be fixed,
regardless of the location or cause. There is no such thing as an
acceptable failure, ever.

An enforcement-scope gap is not a requirement gap. Repo-wide standards
(Result over throw, strict types, the rule corpus) govern every workspace
regardless of where a lint rule happens to be wired; "not enforced here"
never implies "not required here". A missing or narrowly-scoped binding is
itself a defect — flag it and prefer the structural cure (extend the
enforcement), and never read an inherited non-conforming local convention as
ratified exemption.

NEVER disable any quality gates or Git hooks.

Session-local tool reports are evidence only inside the session that produced
them. Do not make a shell invocation of an interactive-session command, such as
Claude Code `/doctor`, a validation gate for plans or commits. Validate durable
changes through repo-local gates, settings diffs, generated artefacts, and
owner-supplied session evidence when the session surface itself is the subject.

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
policy lives at `.agent/memory/executive/invoke-code-experts.md`.

### Analysability Is Part of Correctness

For findings from static instruments (CodeQL, Sonar, lint), "false positive"
is usually the wrong frame: an alert on code whose safety the instrument
cannot see is a true positive about **analysability**, and only source-shape
cures are durable states for instrument findings. Dismissal is doubly
non-durable: the safety stays invisible to every future scan, and positional
alert identity makes suppression a recurring tax — the same alerts return
under new numbers on rewrite. Worked instance (2026-07-29, PR #635): five
CodeQL alerts headed for evidence-bearing dismissal were instead fixed at
source on the owner's one question ("why should I dismiss issues detected by
CodeQL?"); a ~39M-pair differential then proved one "false positive" regex
was a real super-linear backtracking vector the dismissal path would have
preserved. Fix-first is the default disposition; a dismissal needs grounds
that the instrument's frame — not just its finding — is inapplicable.

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

- **Survey the workspace before proposing new infrastructure** - Before
  proposing a new schema, validation pipeline, parsing helper, env-loading
  mechanism, or observability primitive, survey the existing workspace
  packages: `ls packages/core/ packages/libs/`, read each README whose name
  plausibly matches the capability, and grep for existing usage sites. The
  repo has dedicated `core/`/`libs/` packages for many capabilities
  (env schema contracts, env resolution, `Result`, build metadata, logging);
  the right proposal is usually an extension of one of them, not a parallel
  implementation (worked instance 2026-04-25: a proposed app-local Sentry env
  schema duplicated `@oaknational/env` and `@oaknational/env-resolution`; the
  correct fix was a new schema inside the existing package).
- **SOLID principles** (loosely) - Focus on single responsibility and dependency inversion
- **Clean Architecture** (loosely) - Separate concerns into layers
- **Strict boundaries** - Clear interfaces between modules, no leaky abstractions
- **Single responsibility** - Each module/class/function does one thing well
- **TypeScript best practices** - See [TypeScript Practice](./typescript-practice.md)
- **SDKs do not own logging** - SDK functions return classified
  results; the app layer is responsible for observability. SDKs must
  not instantiate loggers or log internally. Pass results up; the
  app inspects and logs via its own logger instance.

### Coordination Topology

- **Design for many checkouts on many machines by default** - for any
  coordination-state, path-resolution, or identity feature, the
  multi-checkout worktree topology (ADR-197) is the case to satisfy
  first; a single checkout is the degenerate case that satisfies it
  trivially. Resolving a path by walking up from the current directory
  lands in the LOCAL checkout — in a many-checkout world, the wrong
  registry. When tempted to simplify with "currently we run one
  checkout", that framing is the tripwire to re-ground, not a licence.

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
- **Warn-first ESLint rule development** - A brand-new custom ESLint
  rule may start at `warn` only while its violation surface is being
  designed and triaged. The same lane must name the promotion point to
  `error`; normal quality gates still require zero warnings.

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
- PR or issue references like `#108` can fail markdownlint MD018
  if wrapping moves them to the start of a line. Use `PR-#108`,
  `issue #108`, or rewrap so the `#` token stays mid-line.
- A wrapped prose line that begins with a list marker (`+`, `-`,
  `*` then a space) trips MD004/MD032 — markdownlint reads it as a
  nested list item. Never let a marker char start a wrapped line;
  reword, rewrap, or use commas. On this misfire, `--fix` is
  destructive: it fragments the continuous prose into a broken
  list. Cure by rewording or rewrapping the source line yourself;
  never blind-run the autofix over prose that trips these rules.
- `+` is never a prose connector ("model + fixture") — write "and",
  or "&" in tight labels. Bullets are pinned to `-` by MD004, but the
  gate misdiagnoses a prose `+` at line-start as a mis-styled bullet
  (previous bullet), and a mid-line `+` is invisible until a rewrap
  moves it — so rewording connectors is a self-check before declaring
  authored markdown done. Reserve `+` for genuine syntax inside
  fenced code blocks.
- A bare `|` inside a table cell breaks MD056 column counting —
  even inside inline-code backticks, even as TS union syntax
  (`<EefStrand \| EefStrandHeadline>`). Escape it as `\|`.
- Write the plain meaning, not coined status-jargon: "safe to
  delete", not "reclaimable". Before using a coined adjective or
  status term, ask what it actually means for the reader and write
  that instead (or alongside, if the term is load-bearing jargon the
  reader already knows). Agent-authored artefacts accrete invented
  vocabulary that reads as ceremony and forces decoding.
- For prose artefacts (READMEs, ADR/PDR/governance bodies,
  runbooks), acceptance criteria name the _decision_ and the
  _audience outcome_ — discoverability and accuracy, not exact
  phrasing. Reserve executable tests and `rg` guards for code
  contracts, generated surfaces, or forbidden runtime exposure;
  asserting a specific markdown sentence shape across files
  precisely constrains markdown implementation rather than
  documentation behaviour and shifts maintenance cost without
  paying for it. Validation is reviewer/read-through plus
  formatting/link hygiene.
- NEVER compress docs to meet line limits — split files by
  responsibility instead.
- A README is a stable index/summary; detailed content lives in
  separate file(s) it links to. When a README accretes detail,
  split the detail into a sibling file and leave the README as the
  index. (Owner convention, 2026-06-20; first applied in the
  `docs/strategy/` README-index refactor.)
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

## Code That Generates Code Is Product Code

Codegen, vocab-gen, and generator directories are repeatedly
misclassified as build-scripts exempt from logger and lint
discipline, and corrected each time: **a generator's output is
product code, so the generator is product code** — full `no-console`
/ logger discipline, lint, and type strictness apply. The
script-vs-src boundary itself is governed by
[ADR-168](../architecture/architectural-decisions/168-typescript-6-baseline-and-workspace-script-architectural-rules.md):
workspace `scripts/` directories sit outside the unit-test surface
with narrow, declared lint relaxations only (still TypeScript,
type-checked, and knip-covered); complexity forces promotion into
`src/`; and the repo root has no scripts zone at all (§5a dissolved
it — repo validators live in `src/` as tested modules).

## Related Documentation

- [Testing Strategy](../../.agent/directives/testing-strategy.md) - TDD approach at all levels
- [TypeScript Practice](./typescript-practice.md) - Type safety rules
- [Tooling](../engineering/tooling.md) - Development tools and versions
