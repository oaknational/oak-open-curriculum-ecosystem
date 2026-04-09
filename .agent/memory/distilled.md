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
`napkin-2026-02-24.md` through `napkin-2026-04-07.md`
(sessions 2026-02-10 to 2026-04-07).

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

## Process

- **Narrative sections drift first**: when syncing plan state,
  inspect body status lines, decision tables, and current-state
  prose, not just frontmatter and todo checkboxes.
- **Gate-surface truth lives in execution paths**: when ADRs,
  governance docs, and workflows disagree about what runs where,
  treat workflow files, gate commands, and package scripts as the
  source of truth and reconcile the prose to them.
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
- `@oaknational` is confirmed npm org scope (no token yet)
- `src/bulk/generators/` duplicates `vocab-gen/generators/`
  files — both must be updated in parallel until resolved.
  **Decomposition**: strategic plan at
  `.agent/plans/architecture-and-infrastructure/codegen/future/`
  `sdk-codegen-workspace-decomposition.md`
  (M1 prerequisite satisfied, awaiting promotion).
  Turbo overrides are temporary — see ADR-065.
- **Zod 4 `.meta({ examples })` — verified and planned**: the MCP
  SDK v1.28.0 uses Zod 4's native `z4mini.toJSONSchema()` for v4
  schemas, which preserves `.meta()` data. The shim's removal
  condition #1 is met. Adoption plan at
  `ws3-off-the-shelf-mcp-sdk-adoption.plan.md`. Edge case:
  `z.preprocess()` fields lose `.meta()` when `io='input'`
  (per-field, not per-object — only 3 year params affected).
- Always add new public exports to the barrel file
  (`src/mcp-tools.ts`) — missing barrel exports cause
  `undefined` at runtime for `instanceof` checks
- Generated vocab files at `src/generated/vocab/` need
  `pnpm vocab-gen`, not `pnpm sdk-codegen`
- MCP tool counts: see ADR-123 for the canonical figure.
  Always distinguish generated vs aggregated (ADR-029/030)

## Elasticsearch

- ES client v9: `document` not `body` for `client.index()`
- ES client v9: spread readonly arrays before passing to
  mutable params (`[...synonymSet.synonyms_set]`)
- Classify network errors by `error.name` (e.g.
  `'AbortError'`, `'TypeError'`), not `error.message` —
  `message.includes('abort')` is too broad
- EsCurric MCP API key needs `feature_actions.read` Kibana
  privilege (in addition to `feature_agentBuilder.read`) for
  the `platform_core_search` tool to work
- ES Serverless shifts `_primary_term` during normal
  operation; OCC-based updates (lease renewal) must retry
  after fetching fresh `_seq_no`/`_primary_term` on 409
- Lifecycle wrappers (`withLifecycleLease`) must return the
  execution result when execution succeeds, even if the
  side-channel (renewal) failed — leases are defence-in-depth

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
  chain, not just the individual links.

## Build System (Domain-Specific)

- **Turbo overrides need ALL task types**: if a workspace
  has any `@package#task` override, it needs overrides for
  every task type it uses (build, test, type-check, lint,
  lint:fix). Missing overrides fall through to generic tasks
  with wrong inputs, causing stale cache hits.
- Turbo dependency model: ADR-065 (items 6–7)
- `pnpm check` is the canonical aggregate gate, but it does
  not include static-analysis sweeps (`pnpm knip`,
  `pnpm depcruise`) unless a plan explicitly requires them
- Empty directories persist after file deletion — always
  rmdir after deleting the last file. The portability
  validator checks for SKILL.md presence, so empty skill
  directories without SKILL.md cause false positives.
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
- **`console` ban means canonical logger**: the `no-console`
  rule forces injection of `@oaknational/logger`, not fallback
  to `process.stderr.write`. Build scripts without a logger
  should let errors propagate naturally (Node surfaces the
  stack trace).
- **sentry-mcp wrappers use `Awaited<TResult>`**: all three
  wrappers (`wrapToolHandler`, `wrapResourceHandler`,
  `wrapPromptHandler`) plus `observeMcpOperation` return
  `Promise<Awaited<TResult>>`. The app-level wrapper in
  `register-resource-helpers.ts` matches. Without `Awaited`,
  async handlers produce `Promise<Promise<X>>` at the type
  level when the handler param lacks the `Promise<T> | T`
  union. TypeScript inference hides this at the sentry level
  but not at the app level.
- **`vite-plugin-singlefile` is the canonical MCP Apps build
  pattern**: the host loads HTML via `document.write()` into a
  sandboxed iframe with no backing web server. External
  `<script src>` references resolve to nothing. All JS/CSS
  must be inlined. The plugin does NOT make the app "static" —
  the inlined JS runs as live React with full SDK lifecycle.
- **MCP Apps CSP goes on content items only**: declare
  `_meta.ui.csp.resourceDomains` on `contents[]` items in
  `registerAppResource`, NOT on the listing config. The MCP
  Apps spec is explicit: hosts read CSP from content items.
- **MCP tool `name` vs `title`**: `name` is the machine ID
  (kebab-case, used in `tools/call`). `title` (BaseMetadata,
  spec 2025-11-25) is the sole human display name —
  `annotations.title` was removed (redundant, all hosts read
  top-level `title`). Generated tools still need codegen
  template work for `title`.
- **Contrast pairings need usage context**: a design token
  that passes the 3:1 non-text threshold may fail 4.5:1
  for text. Always declare `context: 'text' | 'non-text'`
  in `contrast-pairings.ts` and validate accordingly.
