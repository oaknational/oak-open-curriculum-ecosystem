---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs (ADRs, governance, READMEs); this is the specialist refinement layer"
---

# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this before every session.
Every entry earned its place by changing behaviour.

**Source**: Distilled from archived napkins
`napkin-2026-02-24.md` through `napkin-2026-04-18.md`
(sessions 2026-02-10 to 2026-04-18).

**Permanent documentation**: Entries graduate to permanent
docs when stable and a natural home exists. Always graduate
useful understanding — fitness management handles the
consequences. What remains here is repo/domain-specific
context with no natural permanent home.

---

## User Preferences

- Plans must be **discoverable** (linked from README, roadmap,
  AND session prompt) AND **actionable** (status tracking tables,
  completion checklists, resolved open questions).
- Archive docs are historical records — never update them.
- When a plan is blocking a merge, simplify ruthlessly — minimum
  to unblock CI, capture rest as future work.
- Listen to user priorities, not document structure. Try it
  before assuming it will not work.
- Risk acceptance is a human decision. Agents classify severity
  and describe impact; agents do not accept risks or defer items
  on behalf of the owner.
- Onboarding simulations must be discovery-based: start at
  README.md only, no prescribed reading list, no access to
  onboarding planning documents. Describe personas by motivations
  ("anxious about looking foolish", "sceptical by default"), not
  by focus areas.

## Fitness Management

- **Char limit is the honest volume constraint** (not lines).
  Prose wrapping inflates line count; char count tracks real
  content volume. Use it as the primary volume metric.
- **User feedback is the correction signal**: when user feedback
  contradicts a napkin entry, apply the feedback fully. Do not
  negotiate a compromise with the original incorrect framing.
- **Fitness is the four-zone scale defined by
  [ADR-144](../../docs/architecture/architectural-decisions/144-two-threshold-fitness-model.md)**
  (`healthy`/`soft`/`hard`/`critical`). Operational rule here:
  ask "why is it growing?" before "what can I cut?" Graduation
  and restructuring are valid responses alongside compression.

## Process

- **Lead with narrative, not infrastructure**: on a multi-workstream
  initiative, write the ADR and README first. WS-0 (narrative) →
  WS-1 (factory) → WS-2+ (consumers).
- **Narrative sections drift first**: when syncing plan state,
  inspect body status lines, decision tables, and current-state
  prose — not just frontmatter and todo checkboxes.
- **Ignored estates need explicit sweeps**: when validating
  gitignored lanes, use `rg -uu` or run from inside the target
  directory; otherwise ignore rules create false-clean checks.
- **Reconcile parent when child changes runtime truth**: a child
  plan that evolves runtime architecture must reconcile the parent
  plan and closure proof in the same session.
- **CLI-first enumeration before owner questions**: research
  the generic REST surface (`sentry api`, `clerk api`, vendor-
  equivalent) before raising any owner question about observability
  or infrastructure state. "The specialist tool doesn't surface X"
  ≠ "X is unknowable from automation."
- **Validation closures: produce locally-producible evidence
  first**. For deployment validation lanes, generate every
  locally-producible proof under a session-specific release tag
  before asking. Only ask for owner action when tooling cannot
  reach the artefact.
- **Split client-compatibility out of deployment-validation
  lanes**: a client-specific compat issue emerging in an active
  deployment-validation lane spins into its own follow-up plan.
  Shared preview infra ≠ shared plan ownership.
- **Externally-verifiable-output beats internal-plan-compliance
  for forward-motion assurance** (watchlist; single-instance
  observation 2026-04-19, L-EH close). "Are we following the plan"
  is internally verifiable and vulnerable to self-deception; "what
  does the running system emit today that a stranger can observe"
  is externally verifiable and narrows the drift surface. Every
  lane close should produce an externally-verifiable artefact
  (command output, test result, recorded demo, populated cell in
  `what-the-system-emits-today.md`) — not just an "attempted" note.
  Applies: any initiative where planning density has outpaced
  execution density. Graduation trigger: second cross-session
  instance of external-evidence-surfaces-a-gap-that-plan-tracking-
  missed.
- **Decompose precedents before reusing them** (watchlist; single
  instance 2026-04-19, L-EH initial vs Phase 5). A precedent is
  typically a bundle of independent decisions that happened to
  land together — severity, scope, wiring pattern, opt-out protocol,
  authorship venue. Reuse each only where its rationale applies in
  the new lane. "Mirroring the precedent" as a single decision is
  a failure mode that smuggles wrong defaults across contexts.
  Graduation trigger: second cross-session instance of a precedent-
  match producing a reviewer-caught wrong default.

- **Reviewer findings applied in-close, not deferred** (three
  cross-session instances 2026-04-19). The closing atomic commit
  is the default home for actionable reviewer findings; deferral
  requires written rationale. **Candidate for PDR-012 amendment**.
- **Duplicate type becomes load-bearing at three consumers**. Two-
  workspace type duplication is tolerated stably; the would-be third
  consumer forces canonicalisation. Use the three-consumer pressure
  as the planning trigger for consolidation.

Practice-governance Process rules graduated to PDRs 2026-04-18 —
see `.agent/practice-core/decision-records/` for: review-findings
routing (PDR-012), grounding and framing (PDR-013), reviewer
authority and dispatch (PDR-015), workaround hygiene (PDR-017),
planning discipline end-goals/workflow contracts (PDR-018), ADR
scope by reusability (PDR-019), test validity (PDR-021).
Quality-gate dismissal discipline graduated 2026-04-19 — see
PDR-025.

## Architecture (Agent Infrastructure)

<!-- "Implicit architectural intent is not enforced principle" graduated
2026-04-19 — codified as ADR-162 (Observability-First), now Accepted. -->

- **Full triplet portability requires 7 adapter types**: Cursor
  agents + skills + rules, Claude Code agents + rules, Codex
  agents + config, Gemini commands. Easy to miss one — always
  run `pnpm portability:check` after creating a new specialist.
- **Codex adapter descriptions must match exactly**:
  `.codex/agents/*.toml` descriptions must stay identical to the
  registration text in `.codex/config.toml`; the validator checks
  string equality, not semantic similarity.

## Repo-Specific Rules

- Elasticsearch: `oaksearch admin validate-aliases` proves alias **topology**
  only; `admin count` reports true parent docs. Do not equate green alias
  health with bulk freshness — see
  `apps/oak-search-cli/docs/INDEXING.md` (*Operational CLI* section).
- From `packages/sdks/oak-curriculum-sdk/`, repo root is
  `../../../` not `../../`
- `src/bulk/generators/` duplicates `vocab-gen/generators/` —
  update both in parallel. Decomposition plan at
  `codegen/future/sdk-codegen-workspace-decomposition.md`.
- **No "conscious exceptions" to ADR-078 exist**: ADR-078
  lists exactly one exception (subprocess-spawned tests). Any
  other claimed exception is fabricated — untracked exceptions
  are violations, not accepted trade-offs.
- **Zod 4 `.meta({ examples })` — verified and planned**: MCP
  SDK v1.28.0 preserves `.meta()` via `z4mini.toJSONSchema()`.
  Plan: `ws3-off-the-shelf-mcp-sdk-adoption.plan.md`. Edge case:
  `z.preprocess()` fields lose `.meta()` with `io='input'`
  (3 year params only).

## Testing (Domain-Specific)

- `ensurePathsOnSchema` creates a new object (spread) —
  use `toStrictEqual` not `toBe` for structural equality
- `server.e2e.test.ts` has a hardcoded aggregated tools
  list — must be updated when adding new aggregated tools
- **Test pyramid gap: pieces vs composition**: unit + E2E
  tests can all pass while the integrated product fails. For
  features spanning multiple modules (MCP tool → SDK → host),
  add a composition test. Materialised 2026-04-12:
  `mcp-app-composition.e2e.test.ts` caught knip/depcruise
  cleanup that broke the UI — the composition test IS the
  enforcement.

- **Module-level state in tests = integration, not unit**:
  any test that touches module-level singletons with IO must
  be `*.integration.test.ts`, even if it injects DI fakes
  for the new behaviour.
- **Supertest is E2E, not integration**: supertest's in-process
  HTTP server does real socket IO. Existing
  `error-handling.integration.test.ts` is a pre-existing
  misclassification. For middleware tests, call Express directly
  with mocks.
- **Supertest E2E has a transport blind spot**: supertest
  tests JSON-RPC but not SSE transport serialisation. For
  MCP servers, the transport layer IS part of the product
  contract — `_meta` fields, session lifecycle, and event
  streaming all happen there. Use MCP client SDK
  (`Client` + `StreamableHTTPClientTransport`) for full-
  fidelity E2E tests alongside supertest.

## Linting and Code Quality

- **Any rule at `'warn'` is a rule that's off.** Warnings
  scroll past; only `'error'` enforces. Materialised: 13 type
  assertions accumulated silently under `'warn'` severity.
- **`@ts-expect-error` in a test means the test is testing what
  types already enforce.** If a test needs `@ts-expect-error` to
  compile, the type system is already asserting the constraint;
  the test is redundant. Delete the test, don't suppress the
  types. (PDR-020 covers the RED-phase counterpart: never suppress
  to hide a RED-phase type-check failure.)
- **Self-justifying eslint-disable comments embed false
  assumptions.** "unavoidable: bridging incompatible types"
  rationalises the violation. Ask: WHY are the types
  incompatible?

## Build System (Domain-Specific)

- `pnpm check` is the canonical aggregate gate and includes
  `pnpm knip` and `pnpm depcruise` (added 2026-04-12)
- Empty directories persist after file deletion — always
  rmdir after deleting the last file. The portability
  validator checks for SKILL.md presence, so empty skill
  directories without SKILL.md cause false positives.
- **`lint:fix` can silently revert manual edits**: `pnpm check`
  runs `lint:fix` internally. If an edit introduces code that the
  linter "fixes" back, the edit is lost mid-pipeline. Always
  verify the edited file AFTER the full `pnpm check`, not just
  after a single gate.
- **Blanket `replace_all` corrupts mixed-case code**: in files
  containing mixed-case identifiers (e.g. code templates), never
  use blanket substring replacement. `prerequisite` matches
  `prerequisiteFor` and `prerequisiteGraph`, producing invalid
  identifiers. Rewrite the file or use exact-match replacements.
- **Verify reviewer fixes are on disk**: a fix recorded in the
  napkin or conversation summary is not a fix applied on disk.
  Always verify the file's actual content after claiming a fix.
  Three sessions (2026-04-11d/e/f) recorded the same fix as
  "done" before discovering it was never persisted.
- **Knip: standalone scripts need `entry`, not just `project`**:
  knip only traces dependency trees from `entry` points.
  Scripts invoked via `tsx` (not imported by the main entry)
  must be listed as entries. `project` defines the file set;
  `entry` defines the dependency graph roots.
- **Knip: root workspace requires `workspaces["."]`**: top-
  level `entry`/`project` fields are ignored when `workspaces`
  is defined. Must use `workspaces["."]` for root entries.
- **"Never edit generated files" is load-bearing**: Phase 2
  knip hand-trimmed generated barrel files instead of fixing
  generators. The fix was straightforward once the correct
  approach (edit generators, not output) was applied. This
  principle prevents a real class of regeneration footguns.
- **ESLint `lint:fix` can merge value+type imports**: when
  value and type imports share a source module, auto-fix may
  merge them into a single `import type` statement, making
  value symbols unavailable at runtime. Use inline `type`
  keyword on individual specifiers:
  `import { applyTheme, type McpUiHostContext } from '...'`

## Architecture (Domain-Specific)

- Aggregated tools return `Promise<CallToolResult>` directly
  — they do NOT go through `ToolExecutionResult`
- `AggregatedToolName` type derives from
  `keyof typeof AGGREGATED_TOOL_DEFS`
- When removing an entry from `LIB_PACKAGES`, check ALL
  packages that called `createLibBoundaryRules` with that
  name — zone uses `../${otherLib}/**` relative paths
- When splitting a core package with runtime deps: schemas
  stay in core, runtime pipeline moves to libs
- When extracting types from a composition root, the root
  may still need a local `import type` for its own usage
- **Non-UI hosts degrade gracefully**: tools with `_meta.ui`
  still work in non-MCP-Apps hosts (Claude Code, CLI). The
  host ignores `_meta.ui` and the tool returns text content
  normally. No fallback code needed — the protocol handles it.
- **MCP SDK `registerTool` uses unexported generics**: test
  handler functions directly, not through `registerHandlers`
  → `McpServer`.
