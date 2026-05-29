---
fitness_line_target: 450
fitness_line_limit: 525
fitness_char_limit: 24000
fitness_line_length: 100
split_strategy: "This file is the source of truth for all principles. Extract only elaborated guidance to governance docs, never the principles themselves. The principles are operationalised through several mechanisms, including rules, sub-agents, and tooling."
---

# Principles

All of these principles MUST be followed at all times.

## First Question

Always apply the first question; **Ask: could it be simpler _without
compromising quality or value_?**. The answer will often be no, that is fine,
but bring real critical thinking to the question each time.

## Strict and Complete

**Strict and complete, everywhere, all the time.** Prefer explicit, strict,
total, fully checked systems over permissive, partial, or hand-wavy
ones. Do not invent optionality, fallback options, or implied
enforcement. Type precision is one of the clearest concrete
expressions of this tenet.

## Architectural Excellence Over Expediency

We **always, ALWAYS** choose long-term architectural excellence
over cheap, fast, or "good enough". This is absolute. The
cheap-fast option is not a respectable third choice next to "do
it right" — it is categorically excluded from consideration.
Decide between architectural-excellence shapes only.

This applies to design AND to how options are presented. When
surfacing options to the owner or a peer agent, do not include a
"cheap cure" / "quick fix" / "land it then iterate" option as
if it were a legitimate trade-off; presenting it as one is
itself the failure mode.

The doctrine is operationalised through composing structural
defences:

- **The three structural cues at output time** — vocabulary
  trip-list, conditional-discipline check before proposing
  structure, and first-principles framing question. See
  [ADR-172][adr-172] for the host adoption and the portable form
  at PDR-043. The hedging-vocabulary trip-list itself lives in the
  innate-immunity hook (`.agent/hooks/policy.json`); cataloguing
  it in this file would duplicate it. Cue 2 is intent-based: a
  proposed structure that means "the rule does not apply here"
  triggers the check even when it avoids the trip-list vocabulary.
- **Doctrine-authoring discipline** — at the moment a rule,
  principle, ADR, PDR, or governance document is authored or
  amended, the three tests of PDR-047 (substance / vocabulary /
  re-frame) catch self-violating clauses upstream of the
  enforcement scanner.
- **Memetic immune system** — the innate-immunity layer at
  write-time and the adaptive-immunity layer at consolidation-time
  enforce the principle structurally. See PDR-044.
- **Quality-gate fences** — `never-disable-checks`,
  `no-warning-toleration`, `replace-don't-bridge`,
  `dont-break-build-without-fix-plan`, `read-before-asking`, and
  adjacent rules each exist to defeat one expression of the
  rush impulse. The principle is their common generator.
- **Invented-urgency guard** — [`no-speed-pressure`](../rules/no-speed-pressure.md)
  names the failure mode where the agent supplies its own urgency
  to justify skipping the doctrine substrate; the urge is the
  diagnostic, not friction to refactor around.

The failure-mode shape (cheap fixes silently kill the diagnostic;
local optimisation under rush is global pessimisation; fences
accumulate while the generator stays unchanged) plus a worked
failure-mode example (shortcut-via-duplication) live at
[development-practice.md § Architecture Level][dev-arch].

[dev-arch]: ../../docs/governance/development-practice.md#architecture-level
[adr-172]: ../../docs/architecture/architectural-decisions/172-rush-impulse-three-structural-cues-adoption.md
[ts-practice]: ../../docs/governance/typescript-practice.md
[dev-doc]: ../../docs/governance/development-practice.md#documentation-practice
[dev-gates]: ../../docs/governance/development-practice.md#gate-taxonomy--nine-complementary-layers

## Owner Direction Beats Plan

Owner direction during a session beats the active plan. On conflict:
follow the direction, surface the conflict, update the plan at the
next safe checkpoint. Never silently ignore or abandon. Precedence
rule, not a licence to abandon planning discipline (PDR-018).

## Core Rules

### Cardinal Rule of This Repository

If the upstream OpenAPI schema changes, then running
`pnpm sdk-codegen` followed by a `pnpm build` MUST be sufficient to
bring all workspaces into alignment with the new schema.

We achieve this by ensuring that ALL static data structures, types,
type guards, Zod schemas, Zod validators, and other type related
information MUST be generated at compile time ONLY, and so flow from
the Open Curriculum OpenAPI schema in the SDK, and from there to the
apps. In other words, ALL the heavy lifting MUST happen at
sdk-codegen time, i.e. when `pnpm sdk-codegen` is run. All the
libraries, all the apps, all the MCP servers are simple consumers,
the complexity is in the SDK and ONLY in the code-generation process.
No ad-hoc types. If a type is missing, it is a generator bug — fix
the generator, not the consumer.

### Separate Framework from Consumer

Whenever we build something, clearly separate (a) a
purpose-specific, consumer-general framework from (b) the
Oak-specific consumer instance. The framework is the reusable
mechanism that solves a category of problem — usable by any
consumer. The consumer instance applies that framework to Oak's
domain and data. Distinct architectural layers MUST live in
distinct workspaces. Modules/directories may organise code inside a
layer, but they do not satisfy layer separation. If general mechanism
and Oak-specific configuration share a workspace, split the
workspace. The framework defines the contract; the consumer provides
the specifics. The test: "Could a non-Oak consumer use this component
unchanged?" If not, extract the Oak-specific parts.

### Context Specificity Gradient

Every capability decomposes by context specificity. Push functionality
to the lowest general layer that preserves architectural excellence;
keep the highest-specificity layer as thin as possible, preferably
configuration only.

Agent-work capabilities (collaboration, coordination, work management,
direction, lifecycle, identity, claims, handoff, review routing, and adjacent
concerns) are Practice-owned by default; host-local tooling implements them.
For product/tooling code, the scale is: many-repo capability -> repo-generic
layer -> purpose-specific reusable tool -> thin Oak-wide wrapper -> narrow
Oak-domain wrapper.

Oak-specific state is a pressure signal. Keep it minimal; generated state
beats authored state. Hand-rolled types beside generated SDK outputs mean
the generator or a lower layer may need to own more of the behaviour.

### Decompose at the Tension

When code resists clean classification or forces compromise
labels ("lifecycle-neutral", "shared", "cross-cutting"), that
resistance reveals hidden coupling. The response is to decompose
at the fault line — separate the concerns being conflated — not
to classify around the compromise. A barrel re-export that exists
to make something "work" is a symptom; the cure is to eliminate
the coupling that made the barrel necessary. Each tension resolved
this way produces cleaner boundaries and simpler classification.

### Code Design and Architectural Principles

- **TDD** - ALWAYS use TDD at ALL levels — unit, integration, AND
  E2E. Test and product code are two halves of one act of design;
  they land together as one atomic commit. See
  [tdd-as-design.md](tdd-as-design.md) for the foundational
  definition and atomic-landing invariant.
- **Keep it simple** - DRY, KISS, YAGNI, SOLID principles
- **NEVER create compatibility layers, no backwards
  compatibility** - replace old approaches with new approaches,
  never create compatibility layers, never prioritise backwards
  compatibility. When renaming, rename EVERYWHERE — interfaces,
  private functions, variable names, log keys, TSDoc. One concept
  = one name.
- **Keep it strict** - don't invent optionality, don't add fallback
  options. We know exactly what is needed, and the proper
  functioning of the system depends on acknowledging and embracing
  those restrictions, and the valuing insights offered by the type
  system.
- **Pure functions first** - Use TDD to design (_test first_, red,
  green, refactor), no side effects, no I/O
- **Consistent Naming** - Use consistent naming conventions for
  files, modules, functions, data structures, classes, constants,
  type information and CONCEPTS. For instance, if we use `keyStage`
  then that is the label, not `keyStageSlug` or `keyStageId`. If
  you need to add nuance, use TSDoc to provide context, links, and
  examples.
- **Semantic naming over mechanism naming** — Name modules and
  functions by WHY they exist, not HOW they work.
  `preserveSchemaExamplesInToolsList` over
  `overrideToolsListHandler`. The name should explain the removal
  condition.
- **Build up through scales** - Functions → Modules → Packages
  (`core`, `libs`, `apps`)
- **Clear boundaries at each scale** - Define boundaries between
  and within scales CLEARLY with index.ts files
- **Fail FAST** - Fail fast with helpful error messages, never
  silently. NEVER IGNORE ERRORS. Detect problems early (validate
  at entry points, not deep in the call stack), fail immediately
  (don't continue with invalid state), be specific (error messages
  must explain what went wrong and why), and guide resolution
  (where possible, indicate how to fix the problem).
  Anti-patterns: swallowing exceptions with empty catch blocks,
  logging errors but continuing execution, returning `null` or
  `undefined` to indicate failure, generic error messages
  ("An error occurred").
- **Handle All Cases Explicitly** - Don't throw, use the result
  pattern `Result<T, E>`, handle all cases explicitly.
- **Preserve the error cause chain** - Always preserve the error
  cause chain, don't lose information, don't lose context, don't
  lose the ability to debug the problem.
- **No empty catch blocks** - Never use empty catch blocks, always
  handle errors explicitly and using the `Result<T, E>` pattern.
- **Document Everywhere** - ALL code, all decisions, all use
  cases MUST be documented: TSDoc on every file/module/function/
  data structure/class/constant/type; ADRs for major engineering
  or architectural decisions; markdown for use cases, public
  APIs, CLIs, troubleshooting. Observe progressive disclosure;
  do NOT create summary documents of each piece of work. TSDoc
  syntax detail and the documentation-structure discipline live
  at [docs/governance/typescript-practice.md][ts-practice] and
  [development-practice.md § Documentation Practice][dev-doc].
- **Onboarding** - Clear onboarding path from root README to
  workspace docs to TSDoc and ADRs, observing progressive
  disclosure throughout.
- **No machine-local paths** — Paths in version-controlled files
  MUST resolve identically on every machine. See
  [`.agent/rules/no-machine-local-paths.md`](../rules/no-machine-local-paths.md)
  for the forbidden / permitted shapes.
- **No symlinks** — Symlinks are forbidden. Structure workspaces
  properly and use the pnpm workspace dependency graph. Any
  discovered symlinks must be removed immediately as highest
  priority. Platform adapters (`.claude/`, `.cursor/`, `.agents/`)
  must be real files — thin pointers to canonical content — not
  symlinks. pnpm's own `node_modules` symlinks are managed by
  pnpm and are not in scope.
- **No shims, no hacks, no workarounds** — Do it properly or do
  something else. Never introduce shims, polyfills, compatibility
  wrappers, renamed globals, or any mechanism whose purpose is to
  make old code work with new contracts. Replace the old code. If
  the replacement is not ready, leave the old code disabled — do
  not bridge it.
- **Never use git to remove work** — We move forward via filesystem
  changes (Edit, Write, `rm`); git is for committed history only.
  Working-tree-overwrite commands silently wipe in-flight edits;
  reach for Edit, Write, or `rm` instead. See
  [`.agent/rules/never-use-git-to-remove-work.md`](../rules/never-use-git-to-remove-work.md)
  for the full rule and the `PreToolUse` hook enforcement.

### Refactoring

- **TDD** — see §Code Design above
- **NEVER create compatibility layers** - replace old approaches
  with new approaches
- **Don't extract single-consumer abstractions** — If a protocol
  has exactly one consumer, inline it. The test: "does anything
  else consume this?" If no, the extraction adds indirection and
  maintenance surface without value.
- **Splitting long files** - If a file exceeds 250 lines
  (`max-lines`), split it into smaller files defined by groupings
  of responsibility, keeping boundaries and public API clear with
  index.ts files, using TDD. Run lint after every substantive edit
  to catch violations early.
- **Splitting long functions** - If a function exceeds 50 lines
  (`max-lines-per-function`), split it into smaller, pure functions
  with a single responsibility, using TDD. Extract conditional
  phase dispatch, multi-branch logic, and accumulator loops into
  named helpers.
- **Reducing complexity in functions** - If a function is too
  complex, identify distinct responsibilities and split it into
  smaller, pure functions with a single responsibility, using TDD.
  ESLint counts `??` and `?.` as branches — five
  nullish-coalescing expressions in one function can breach the
  complexity limit.
- **Removing unused code** - If a function is not used, delete it.
  If product code is only used in tests, delete it. If a file is
  not used, delete it. Delete dead code.
- **Version with git, not with names** - Fix files in place, or
  replace old approaches with new approaches, NEVER create parallel
  versions using naming. Incorrect: `execute-tool-call.ts` and
  `execute-tool-call.v2.ts`. Correct: `execute-tool-call.ts` with
  a git history showing the evolution. Incorrect:
  `execute-tool-call.ts` and `execute-tool-call-correct.ts`.
  Correct: `execute-tool-call.ts` with a git history showing the
  evolution.

### Tooling

Use the right tool for the job:

- **Turborepo** for monorepo operations
- **pnpm** for monorepo definitions and package management
- **Vitest** for testing **runtime logic**
- **Playwright** for testing **runtime UI**
- **TypeScript** for compiler time types
- **ESLint** for syntax correctness, code-style adherence,
  **architectural boundary adherence**
- **Prettier** for code-style adherence
- **Typedoc** for documentation generation
- **Sentry** for observability (guidance archived to
  `docs/agent-guidance/archive/sentry-guidance.md`)

All workspace tooling configuration MUST follow the canonical
patterns defined in the base configs at the repo root. Workspace
configs extend base configs — they do not replace them. This applies
to `vitest.config.ts`, `tsconfig.json`, `eslint.config.ts`, and all
other tooling. Deviations cause silent quality-gate leaks (e.g. E2E
tests running under `pnpm test`, disabled lint rules, weakened
type-checking). See [Testing Strategy: Canonical Vitest
Configuration][vitest-config] for vitest-specific patterns. E2E
vitest configs may be workspace-specific when base defaults (include
paths, setup files) don't apply.

[vitest-config]: testing-strategy.md#canonical-vitest-configuration

### Code Quality

- **TDD** — see §Code Design above
- **NEVER disable checks** - Quality gates are NEVER disabled.
  Type checks, linting, formatting, tests, Git hooks (`--no-verify`),
  CI steps — none of them. The **`gate-off-fix-gate-on`** sequence
  (disable, fix, re-enable) is a named anti-pattern; the gate stays
  on throughout. See [`never-disable-checks.md`](../rules/never-disable-checks.md)
  for the operational discipline.
- **No warning toleration, anywhere** - Warnings are not deferrable
  in any system the repo influences (build, quality gates, runtime,
  monitoring). A warning is the cheap, early version of the failure
  it names. Fix the root cause in the same work-item, or escalate
  the warning to a hard error in the same commit. Acknowledged-and-
  deferred warnings consistently explode at the next stage. See
  `.agent/rules/no-warning-toleration.md` for the operational
  discipline (covers esbuild/tsc/ESLint/vitest/depcruise/knip and
  Sentry runtime/uptime surfaces).
- **Fix things** - All quality gates are blocking at all times,
  regardless of location, cause, or context.
- **Local broken code never leaves** — Broken code is never
  acceptable. The local-only constraint is not an excuse to tolerate
  brokenness; it is the discipline that prevents brokenness from
  reaching other agents, reviewers, CI, and production before you
  finish fixing it. Two halves, both held: (1) broken code must be
  fixed, not tolerated — "it's just broken locally" is not a stable
  resting position, it is an in-progress fix that has not yet landed;
  (2) local broken code never leaves the local environment — no
  `git push` until the change is proven to work, built, gated, and
  observed running in the form it is supposed to run (test passing,
  dev server returning the expected response, CLI exiting clean, UI
  rendering the expected state). "It compiles" is not "it works";
  the proof is observed behaviour, not the absence of red. Pushing
  broken code burns peer-agent and reviewer cycles on diagnosis the
  author could have closed with one more local check, and pollutes
  the shared branch with state nobody can trust. See
  [`local-broken-code-never-leaves.md`](../rules/local-broken-code-never-leaves.md)
  for the operational discipline.
- **Never weaken a gate to solve a testing problem** - If a test
  needs content that a gate forbids (e.g. an `eslint-disable`
  comment to test the `no-eslint-disable` rule), solve via string
  construction, fixtures, or test infrastructure — never exempt the
  test from the gate. The purpose of hardening is strictness; any
  exemption undermines the gate for all future code.
- **WE DON'T HEDGE** - It is worth doing or it doesn't exist.
  We don't create plan stubs, or fallbacks, or invent
  optionality or prefix unused variables with an underscore.
  We fix it, or we delete it, or we never create it in the
  first place.
- **Don't hide problems — fix them or delete them** - `void
  <expr>` to silence unused-variable lint and underscore-prefixing
  unused identifiers are banned. They hide dead state instead of
  removing it. No adapters, no compatibility layers, no half
  measures: use the value, restructure the code, or delete the
  binding. See
  [Problem-Hiding Patterns](../../docs/governance/problem-hiding-patterns.md).
- **Quality gates** - Run ALL gates after changes. The gate
  taxonomy has nine complementary layers (formatting, type
  correctness, linting, static analysis, testing, mutation
  testing, build, specialist review, accessibility audit), each
  catching a different class of defect. Full taxonomy with the
  per-layer scope and tooling lives at
  [development-practice.md § Quality Gates][dev-gates].
- **No unused code** - If a function is not used, delete it. If
  product code is only used in tests, delete it. If a file is not
  used, delete it. Delete dead code. Static analysis tools (knip,
  dependency-cruiser) enforce this at scale.
- **Misleading docs are blocking** - Docs that misstate behaviour
  or point at retired surfaces are a quality-gate blocker. Missing
  docs prompt verification; misleading docs are trusted and acted
  on. Fix immediately — never defer, never TODO. Pairs with PDR-026
  §Landing target definition.
- **Target-architecture wording needs consuming-runtime evidence** -
  Present-tense architectural claims ("the SDK exposes the target
  schema", "all consumers migrated", "the app uses the new
  endpoint") MUST be backed by at least one consuming-runtime
  instance verified at write time. A shared package exposing a
  target schema is not proof that an app has migrated; the proof
  is the import resolved in a built composition root. Use future
  tense or "intended" when authoring without runtime evidence;
  reserve present tense for verified state. ADRs, runbooks, and
  operator docs fail this rule loudest because they are cited as
  authority. Companion to "Misleading docs are blocking": that rule
  fires after the misstatement lands; this rule prevents authoring
  the misstatement in the first place.

### Compiler Time Types and Runtime Validation

Type precision is one expression of strict, complete, schema-driven practice.
Operational detail lives in [TypeScript Practice][ts-practice].

### Testing

Tests prove runtime behaviour. TypeScript proves types; ESLint and
static analysis prove structural rules. **Foundationally, a test
describes a system state and product code is the path that guides the
system into that state — they are two halves of one act of design,
not two outputs of two acts.** See [TDD as Design][tdd-as-design] for
the load-bearing definition and the atomic-landing invariant. For
test-type taxonomy, full rules, examples, and recipes, see
[Testing Strategy][testing], [Testing TDD Recipes][tdd-recipes], and
[ADR-078: Dependency Injection for Testability][di].

[tdd-as-design]: tdd-as-design.md
[testing]: testing-strategy.md
[tdd-recipes]: ../../docs/engineering/testing-tdd-recipes.md
[di]: ../../docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md

Universal testing principles:

- use TDD at every affected test level;
- test behaviour through public interfaces, not implementation details;
- assert effects, not internal constants or configuration collections;
- each proof happens once and must prove product code;
- unit tests are pure, in-process, and mock-free;
- integration tests import code directly and use only simple DI fakes;
- E2E tests prove running-system behaviour;
- tests must never read or mutate `process.env`, global objects, module cache,
  ambient env files, or `process.cwd()` — smoke composition roots only;
- no skipped tests, no conditional tests, no complex mocks, no complex test
  logic, no process spawning in in-process tests. Conditional tests are an
  architectural-failure symptom — remove them, fix the ambiguity in product
  code, write deterministic behaviour-proving tests.

### Developer Experience

- **No commented out code** - Fix it or delete it
- **Inline docs everywhere** - ALL files, modules, functions, data
  structures, classes, constants, and type information MUST have
  inline jsdoc/tsdoc comments that can be compiled by `typedoc`
  to generate documentation.

### Architectural Model

Use the conventional monorepo topology documented in the
[architecture overview][architecture]. Architectural boundaries are
enforced by custom ESLint rules.

[architecture]: ../../docs/architecture/README.md

### Layer Role Topology

Apps are **thin user interfaces**. SDKs and libraries own **all
domain-specific logic and mechanisms**. Apps compose SDK capabilities
through their public API surfaces; apps NEVER reimplement domain
logic that an SDK already provides.

Concretely:

- **SDKs own**: query shapes (retrievers, filters, highlights),
  query processing (noise removal, phrase detection), score
  processing (normalisation, filtering), field inventories, data
  contracts, and type definitions. If two consumers would need the
  same logic, it belongs in an SDK.
- **Apps own**: CLI commands, request assembly (combining SDK-built
  retrievers with app-specific index resolution and pagination),
  operational tooling (ingestion, admin commands), and user-facing
  presentation. These are integration concerns, not domain logic.
- **The test**: "Could another app need this?" If yes, it belongs
  in a package, not an app. If an app contains domain logic that
  duplicates an SDK, that is a boundary violation — collapse it by
  importing from the SDK.

This is not aspirational; it is a structural constraint. Violations
cause silent drift: the SDK gets tuned but the app's copy does not,
producing different behaviour for the same input.
