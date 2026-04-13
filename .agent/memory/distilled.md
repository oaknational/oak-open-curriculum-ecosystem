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
`napkin-2026-02-24.md` through `napkin-2026-04-11.md`
(sessions 2026-02-10 to 2026-04-11g).

**Permanent documentation**: Entries graduate to permanent
docs when stable and a natural home exists. Always graduate
useful understanding — fitness management handles the
consequences. What remains here is repo/domain-specific
context with no natural permanent home.

---

## User Preferences

- British spelling, grammar, and date formats
- Plans must be **discoverable** (linked from README,
  roadmap, AND session prompt)
- Plans must be **actionable** (status tracking tables,
  completion checklists, resolved open questions)
- Archive docs are historical records — never update them
- When a plan is blocking a merge, simplify ruthlessly —
  do minimum to unblock CI, capture rest as future work
- Listen to user priorities, not document structure
- Try it before assuming it will not work
- Risk acceptance is a human decision. Agents classify
  severity and describe impact; agents do not accept risks
  or defer items on behalf of the owner
- Onboarding simulations must be discovery-based: start at
  README.md only, no prescribed reading list, no access to
  the onboarding planning documents. Describe personas by
  their motivations ("anxious about looking foolish",
  "sceptical by default"), not by focus areas

## Fitness Management

- **Char limit is the honest volume constraint**: after wrapping
  prose to 100 chars, line count inflates from short lines, headers,
  blank lines. The char limit tracks actual content volume regardless
  of formatting choices. Use it as the primary volume metric.
- **User feedback is the correction signal**: when user feedback
  contradicts a napkin entry, apply the feedback fully. Do not
  negotiate a compromise with the original incorrect framing.
- **Fitness limits are informational, not gates**: the soft
  limit says "consider whether this file is growing
  unnecessarily." The hard limit says "this file needs
  attention." Neither says "delete content until the number is
  green." Content justifies the space it occupies. When a file
  exceeds its target, ask "why is it growing?" before "what
  can I cut?" If the content is load-bearing, the answer may
  be graduation, restructuring, or accepting the overage —
  not compression.
- **Repetition between foundational docs is deliberate**: the
  testing rules in principles.md AND testing-strategy.md are
  intentional reinforcement, not duplication. Do not
  deduplicate across foundational Practice files.

## Process

- **Never delegate foundational Practice doc edits to sub-
  agents**: principles.md, testing-strategy.md, schema-first-
  execution.md, AGENT.md are the operating system of the
  repo. Sub-agents optimise for their stated objective ("cut
  N lines") without understanding pedagogical value, concrete
  examples, or deliberate reinforcement. These files require
  full session context. Consolidation of these files is
  curation, not optimisation — "does each piece serve its
  purpose?" not "how do I make it shorter?"
- **Lead with narrative, not infrastructure**: when starting a
  multi-workstream initiative, write the ADR and README first.
  Documentation that declares "what we're doing and why" frames
  all subsequent technical work and prevents infrastructure-for-
  infrastructure's-sake. WS-0 (narrative) before WS-1 (factory)
  before WS-2+ (consumers) is not arbitrary; each stage depends
  on the meaning established by the previous one.
- **Review plans, not just code**: see pattern
  `patterns/pre-implementation-plan-review.md`. Proven across
  3 sessions (19+ findings caught before implementation; Gap 2
  session caught 5 structural corrections from 5 reviewers).
- **Narrative sections drift first**: when syncing plan state,
  inspect body status lines, decision tables, and current-state
  prose, not just frontmatter and todo checkboxes.
- **Ground plans in verified data, not memory**: never classify
  effort/impact or propose interventions from stale counts or
  napkin memories. Run the actual tools, read the actual files,
  verify the actual state BEFORE drafting a plan. Plans built
  on assumptions get rejected. See also pattern
  `patterns/tool-output-framing-bias.md`.
- **Review scope separation**: when a comprehensive review spans
  multiple commits, separate in-scope findings from pre-existing
  issues. Fix in-scope, track pre-existing as a gated follow-up.
  Never conflate scope by fixing everything in one session.
- **Ignored estates need explicit sweeps**: when validating
  gitignored research or staging lanes, use `rg -uu` or run the
  search from inside the target directory; otherwise ignore rules
  can create false-clean hygiene checks.

## Architecture (Agent Infrastructure)

- **ADR-125 thin wrapper scope**: the thin wrapper contract applies
  to platform adapters wrapping canonical content, NOT to canonical
  command-to-skill relationships. Commands and skills are sibling
  Layer 1 artifacts. A "thick" orchestrating command is sound per
  ADR-135's process_executor example.
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
- `src/bulk/generators/` duplicates `vocab-gen/generators/`
  files — both must be updated in parallel until resolved.
  **Decomposition**: strategic plan at
  `.agent/plans/architecture-and-infrastructure/codegen/future/`
  `sdk-codegen-workspace-decomposition.md`
  (M1 prerequisite satisfied, awaiting promotion).
  Turbo overrides are temporary — see ADR-065.
- **No "conscious exceptions" to ADR-078 exist**: any claim
  of a deliberate, documented exception for direct-import
  logger singletons (or similar) is fabricated. ADR-078 lists
  exactly one exception (subprocess-spawned tests). Untracked
  exceptions are violations, not accepted trade-offs.
- **Zod 4 `.meta({ examples })` — verified and planned**: the MCP
  SDK v1.28.0 uses Zod 4's native `z4mini.toJSONSchema()` for v4
  schemas, which preserves `.meta()` data. The shim's removal
  condition #1 is met. Adoption plan at
  `ws3-off-the-shelf-mcp-sdk-adoption.plan.md`. Edge case:
  `z.preprocess()` fields lose `.meta()` when `io='input'`
  (per-field, not per-object — only 3 year params affected).

## Testing (Domain-Specific)

- `ensurePathsOnSchema` creates a new object (spread) —
  use `toStrictEqual` not `toBe` for structural equality
- `server.e2e.test.ts` has a hardcoded aggregated tools
  list — must be updated when adding new aggregated tools
- Capturing calls in a typed array (`const calls: T[] = []`)
  beats `vi.fn().mock.calls` which leaks `any`
- **Test pyramid gap: pieces vs composition**: unit + E2E
  tests can all pass while the integrated product fails. If
  a feature spans multiple modules (e.g. MCP tool → SDK →
  host rendering), add a composition test that proves the
  chain, not just the individual links. **Materialised
  2026-04-12**: 39 files of knip/depcruise cleanup broke the
  MCP App UI; all existing tests passed. Fixed by adding
  `mcp-app-composition.e2e.test.ts` (MCP client SDK lifecycle
  test). Distilled learnings without enforcement mechanisms
  are advisory — the composition test IS the enforcement.

- **Module-level state in tests = integration, not unit**:
  any test that touches module-level singletons with IO must
  be `*.integration.test.ts`, even if it injects DI fakes
  for the new behaviour.
- **Supertest is E2E, not integration**: supertest creates an
  in-process HTTP server with real socket IO. By the testing
  strategy definitions, this is an E2E test. The existing
  `error-handling.integration.test.ts` using supertest is a
  pre-existing misclassification. For middleware composition
  tests, call Express directly with mock objects — no HTTP,
  no IO. Materialised 2026-04-13: test-reviewer caught this
  during pre-implementation review of Gap 2.
- **Supertest E2E has a transport blind spot**: supertest
  tests JSON-RPC but not SSE transport serialisation. For
  MCP servers, the transport layer IS part of the product
  contract — `_meta` fields, session lifecycle, and event
  streaming all happen there. Use MCP client SDK
  (`Client` + `StreamableHTTPClientTransport`) for full-
  fidelity E2E tests alongside supertest.

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
- ADR-108 bans search-sdk → curriculum-sdk dependency.
  Shared data lives in `@oaknational/sdk-codegen/synonyms`
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
- **`_meta.ui.visibility` is an array**: `["model"]`,
  `["app"]`, or `["model", "app"]`. Controls who can call
  the tool. Missing = both. `registerAppTool` normalises both
  nested `_meta.ui.resourceUri` and legacy flat key formats.
- **MCP Apps handler composition**: use `addEventListener`
  for all notification events (`toolinput`, `toolresult`,
  `toolcancelled`, `hostcontextchanged`). The `on*` property
  setters are deprecated since ext-apps 1.5. `onteardown` and
  `onerror` are NOT deprecated (request handlers, not events).
- **MCP SDK `registerTool` uses unexported generics**: the
  generic constraints (`ZodRawShapeCompat`, `AnySchema`) are
  not exported. No plain function can satisfy
  `Pick<McpServer, 'registerTool'>`. Test at the right level
  — unit test the handler function directly, not through
  `registerHandlers` → `McpServer`.
- **Runtime derivation from schema, not hardcoded codegen**:
  the cardinal rule means the runtime schema IS the source of
  truth. Hardcoding values the schema already contains creates
  a stale copy. Correct approach: runtime extraction from the
  imported schema object, with the TYPE flowing from the schema
  type system at compile time. `API_HTTP_METHODS` is derived
  from `schema.paths` at runtime, not from a generated literal.
- **MCP App UI debugging: test with reference host first**.
  Cursor caches MCP tool `_meta` and does not reliably refresh
  on disconnect/reconnect. If the reference host (`ext-apps
  basic-host`) renders the widget but Cursor doesn't, it's a
  client cache issue, not a server bug. Hours were lost
  investigating correct server code due to this.
