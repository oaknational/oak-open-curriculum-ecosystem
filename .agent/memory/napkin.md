## Napkin rotation — 2026-04-07

Rotated at 562 lines after P1b validation + P2 SDK alignment
+ documentation/infrastructure pass. Archived to
`archive/napkin-2026-04-07.md`. Merged 2 new entries into
`distilled.md`: MCP Apps CSP content-item placement, contrast
pairing usage context. Graduated 3 entries: `unknown` rule
(already marked), Zod v4 `.merge()` (already marked),
cross-workspace token dev loop (documented in widget
`vite.config.ts` TSDoc + README). Extracted 0 new patterns
(candidates assessed but none met all 4 barrier criteria —
most were domain-specific or single-occurrence). Previous
rotation: 2026-04-06 at 559 lines.

---

### Session 2026-04-08a — MCP protocol audit + tool naming

#### Surprises

**S1: `get-curriculum-model` had an unintended `tool_name` parameter.**
Expected: parameterless orientation tool. Actual: accepted an optional
`tool_name` string that retrieved per-tool help via `getToolSpecificHelp()`.
User confirmed this was never intended — per-tool info is already on each
tool's own description. Removed the parameter, deleted dead
`tool-help-lookup.ts` module and 15 tests.

**S2: MCP spec has two locations for tool display names.**
Expected: `annotations.title` was the canonical field. Actual: the
2025-11-25 spec added a top-level `title` on `BaseMetadata` (shared
across tools, resources, prompts, and server Implementation). The older
`annotations.title` (2025-06-18) remains supported. Our projection now
chains: `tool.title` → `tool.annotations.title` → `tool.name`.

**S3: Generated tools have no human-friendly title at all.**
Expected: generated tools would have titles from the codegen. Actual:
neither `title` nor `annotations.title` is set — the projection falls
back to `tool.name` (kebab-case like `get-lessons-summary`). Hosts
display these machine identifiers to users. Deferred to a codegen
template change.

**S4: 12,858 misconceptions exist but have no MCP surface.**
Expected: misconceptions would be exposed like prerequisites. Actual:
the full data pipeline exists (extractor, generator, typed loader, 6MB
JSON with 20 subjects) but no tool or resource exposes it. Plan created.

**S5: Server `Implementation` only declares `name` and `version`.**
Expected: would include branding. Actual: `icons`, `title`,
`description`, `websiteUrl` all supported by SDK v1.28.0 but not set.
Every MCP host shows "oak-curriculum-http v0.1.0" with no branding.

#### Corrections

- "Get Curriculum Model" → "Oak Curriculum Overview" (teacher-friendly)
- `annotations.title` kept for backwards compatibility but top-level
  `title` is now the primary field per 2025-11-25 spec

**S6: Vercel preview has doubled `dist/dist/` path for widget HTML.**
The error `ENOENT: no such file or directory, open '/var/task/apps/oak-curriculum-mcp-streamable-http/dist/dist/oak-banner.html'`
occurs when `get-curriculum-model` (or any widget tool) is called in
Claude Desktop against the Vercel preview. Root cause: `register-resources.ts`
line 156 uses `resolve(import.meta.dirname, '../dist/oak-banner.html')`.
Locally, `import.meta.dirname` is `src/` so `../dist/` resolves correctly.
On Vercel, tsup bundles to `dist/` so `import.meta.dirname` is already
`dist/`, and `../dist/` becomes `dist/dist/`. The fix needs to account
for the Vercel bundle layout where the built JS runs from `dist/` and
the widget HTML is a sibling in the same `dist/` directory.
Preview URL: `poc-oak-open-curriculum-mcp-git-feat-mcpappui.vercel.thenational.academy`
Vercel deployment: `vercel.com/oak-national-academy/poc-oak-open-curriculum-mcp/6jMHDLVbDvoP8Awp3AB5AXoo4SVX`
Log: `lk99p-1775627562768-61fab88abdd6`

#### Decisions

- Server-info-branding plan is **blocking for PR #76 merge**
- Misconception graph MCP surface is **post-merge**
- Resource templates, prompt completion, per-primitive icons are **future**
- Generated tool titles deferred to codegen template change

### Session 2026-04-08b — Branding + architecture alignment

#### Surprises

**S7: sentry-mcp `wrapResourceHandler` type doesn't handle async.**
Expected: wrapping an async handler would preserve the return type.
Actual: `TResult | Promise<TResult>` creates double-Promise when TResult
is already `Promise<X>`. Widget handler bypasses wrapper. Fix needed in
`@oaknational/sentry-mcp` package.

**S8: server-harness.js was importing non-existent modules.**
Expected: `dist/src/application.js` would exist as a separate file.
Actual: tsup `bundle: true` produces a single `dist/src/index.js` — no
individual module files. The harness was broken since bundling was enabled.
Fixed with multi-entry tsup.

**S9: reviewers passed code that shouldn't exist.**
Expected: architecture-reviewer-wilma and barney would flag the
`widget-html-provider.ts` workaround as "should not exist." Actual: both
gave COMPLIANT verdicts on a well-structured extraction of a workaround.
User corrected: reviewers must assess what *should* exist. Subagent
principles updated.

**S10: `readFileSync` IS the official pattern (async variant).**
Expected: Node filesystem APIs would be wrong for MCP Apps. Actual: the
official `basic-server-react` example uses `fs.readFile` (async,
`node:fs/promises`). The pattern is correct; our error was using the sync
variant.

#### Corrections

- "Never wave away pre-existing issues" — all issues are blocking per
  principles, regardless of when introduced
- Reviewers must assess what *should* exist, not just what does
- Research official docs FIRST, before implementing
- `readFileSync` → `readFile` (async) per official example
- Flat tsup output eliminates the need for path resolution workarounds

#### Decisions

- Widget-pipeline-idiomatic-alignment plan created for post-merge
- 9 reviewer findings tracked to closure
- Sentry wrapper async fix is T4, widget observability is T5 (blocked)
- Build ordering documentation is T3

### Session 2026-04-08c — Widget pipeline idiomatic alignment execution

#### Resolutions

All 7 tasks from the widget-pipeline-idiomatic-alignment plan completed:
- T1: Annotation tests consolidated to single toEqual
- T2: `validateWidgetHtmlExists` with DI (ADR-078), called at bootstrap
- T3: Build ordering documented; stale Build Output Structure and Build
  Configuration sections fixed (pre-existing drift found by docs-adr-reviewer)
- T4: `Awaited<TResult>` across all 4 sentry-mcp wrappers + app-level wrapper
- T5: Widget resource wrapped with Sentry observability (unblocked by T4)
- T8: Token watcher: async exec, workspace root derivation, existence guard,
  rebuild lock with try/finally, path-safe startsWith
- File split: `register-widget-resource.ts` extracted (max-lines trigger)

#### Surprises

**S11: Sentry wrappers type-checked clean even without Awaited fix.**
Expected: `satisfies` assertions on async handler results would fail at
type-check (RED phase). Actual: TypeScript's inference resolves `TResult`
from the `Promise<TResult> | TResult` union correctly, so the sentry-level
wrappers already handled async handlers. The real blockage was at the
app-level wrapper in `register-resource-helpers.ts` where the handler
parameter was `(...args) => TResult` (no Promise union), making `TResult =
Promise<X>` for async handlers. The fix was still correct and necessary.

**S12: Pre-existing deployment-architecture.md had extensive drift.**
Expected: only the new Build Ordering section needed review. Actual: the
"Build Output Structure" showed single entry, chunks, and DTS (all wrong),
and the "Build Configuration" tsup code block had nearly every field wrong
(single entry, dts true, es2023, skipNodeModulesBundle). docs-adr-reviewer
caught both as critical. Fixed in-scope.

#### Surprises

**S13: vite-plugin-singlefile IS the canonical MCP Apps pattern.**
Expected: it was a wrong simplification that made the React app static.
Actual: every official MCP Apps example uses it. The host loads HTML via
`document.write()` into a sandboxed iframe with no backing web server —
external `<script src>` references resolve to nothing. All JS/CSS MUST
be inline. Confirmed by disabling the plugin: Vite produces separate
files that cannot load. The built artefact contains `createRoot`,
`useApp`, `PostMessageTransport`, and all MCP Apps lifecycle handlers.
The widget IS a live React app.

**S14: 6-reviewer adversarial plan review caught the wrong premise.**
Expected: Phase 4.5 plan would be sound after metacognition. Actual:
assumptions-reviewer questioned whether singlefile removal was solving
the right problem, MCP-reviewer confirmed it was the canonical pattern
with official doc citations, architecture-reviewer found blocking type
issues in the metadata shape work. The plan was revised to drop the
widget half entirely. First time a plan-level review caught a fundamental
premise error before any code was written.

#### Corrections

- All reviewer findings are blocking — no "non-blocking" classification
- `readBuiltWidgetHtml` given DI parameter for path (was closing over module
  constant, inconsistent with ADR-078)
- `changedPath.startsWith(dir)` is path-fragile without trailing separator
- "Static HTML" framing was wrong — the confusion was delivery mechanism
  vs runtime behaviour

### Session 2026-04-08d — pnpm defaults and `.npmrc`

#### Resolutions

- Moved pnpm-only settings out of `.npmrc` (npm 9+ unknown-project-config
  warnings), then removed non-default hoisting/linking overrides entirely.
- Workspace install now uses **pnpm defaults**; internal packages already use
  `workspace:` protocol, so linking stays correct without `linkWorkspacePackages`
  or `preferWorkspacePackages`.
- Deleted project `.npmrc` when it contained only comments; add one back for
  registry/auth if needed.
- Permanent doc: `docs/engineering/build-system.md` § pnpm workspace
  configuration; ADR-012 Implementation updated.

#### Surprises

**S15: npm “unknown config” is not pnpm deprecation.** npm reads project
`.npmrc` and does not recognise pnpm-specific keys; pnpm still supports them
when set in `pnpm-workspace.yaml` or other pnpm config surfaces.

### Session 2026-04-08e/09 — Phase 4.5 execution

#### Potentially flaky test

`@oaknational/oak-curriculum-mcp-streamable-http#test:e2e` — intermittent
failure during `pnpm check`. The E2E tests for `get-curriculum-model` failed
once during a gate run but passed on a subsequent run of `pnpm test:e2e` in
isolation and on a later `pnpm check` run. Likely test coupling, race
condition, or shared state mutation. Needs investigation: check test
isolation, shared server instances, and any global state in the E2E harness.
File: `apps/oak-curriculum-mcp-streamable-http/e2e-tests/get-curriculum-model.e2e.test.ts`

### Session 2026-04-09 — Phase 4.5 wrap-up docs sync

### Session 2026-04-09b — CI dependency enforcement gap

#### Surprises

**S18: Nested worktrees under the repo can give false-clean dependency runs.**
Expected: a clean worktree under `.claude/worktrees/` would behave like CI.
Actual: Node walked up to the parent checkout's `node_modules`, so undeclared
workspace imports such as `@oaknational/observability` resolved successfully
even though the workspace did not declare them. A sibling worktree outside the
repo root reproduced the real failure.

**S19: `knip` already catches undeclared workspace imports precisely; the
blocking gates do not.** Expected: ESLint or dependency-cruiser would clearly
flag missing direct dependencies before runtime. Actual: `dependency-cruiser`
does not police manifest completeness, and the blocking `pnpm check` path does
not run `knip`. In an isolated Turbo run on PR #76, `@oaknational/sdk-codegen`
failed with `ERR_MODULE_NOT_FOUND` for undeclared
`@oaknational/observability`; targeted `knip` also flagged undeclared
`@elastic/elasticsearch` and a stale `@modelcontextprotocol/ext-apps`
dependency in the same workspace.

**S20: Standalone workspace verification exposed a second missing type-only
dependency.** Expected: once the codegen workspace deps were fixed, the isolated
Turbo reproduction would be clean. Actual: `@oaknational/logger` failed
standalone type-check/build until `@types/express` was declared locally.

#### Resolutions

- Added `@oaknational/observability` and `@elastic/elasticsearch` to
  `packages/sdks/oak-sdk-codegen` `devDependencies`
- Removed stale `@modelcontextprotocol/ext-apps` from the same workspace
- Added `@types/express` to `packages/libs/logger` `devDependencies`
- Updated the quality-gate-hardening plan to record that knip promotion must
  cover manifest completeness, and that dependency-cruiser is complementary
  rather than sufficient for that class of failure

#### Decisions

- Use sibling worktrees outside the repo root for CI-style dependency debugging
  when undeclared imports are suspected
- Treat `knip` as the canonical detector for undeclared workspace imports until
  a blocking manifest-completeness gate is promoted

#### Surprises

**S16: active docs can drift long after the code is correct.**
Expected: once `c4d37089` landed, the live plan/prompt/README stack would
already reflect the final Phase 4.5 contract. Actual: the code correctly used
present `inputSchema` values with `{}` for no-input tools, but the active
Phase 4.5 plan, session prompt, README, and ADR text still described the older
"omit inputSchema" / legacy-schema-field story. Some live docs also still
quoted the old 31-tool inventory after `user-search` and `user-search-query`
landed.

#### Behaviour change

- When a refactor lands, audit the live planning/docs stack immediately, not
  just the product code and tests.
- Treat active plans, prompts, collection indexes, workspace READMEs, and
  factual ADR sections as one consistency surface for pre-merge work.
- Prefer resilient wording in READMEs, but keep canonical ADR/tool-count docs
  numerically truthful when they are used as the source of record.

### Session 2026-04-09b — Phase 4.5 wrap-up complete

#### Resolutions

- Phase 4.5 wrap-up finished on `feat/mcp_app_ui`: comprehensive example-bearing
  TSDoc landed across the public universal-tools surface and the streamable-HTTP
  handler registration seam.
- Added a shared generated-tool descriptor helper so `tools/list`,
  registration, and executor summaries all resolve titles the same way:
  top-level `title` first, `annotations.title` fallback only in one place until
  codegen catches up.
- Generated-tool metadata now fails fast on missing title/description and on
  missing/non-object `toolMcpFlatInputSchema`; tests cover both drift cases.
- Final proof/evidence captured:
  `pnpm type-check`, filtered SDK/server tests, `pnpm doc-gen`, contamination
  greps, reviewer superset, upstream `basic-host` smoke, and full `pnpm check`
  all passed on 2026-04-09.

#### Surprises

**S17: final gate failures can be test-fixture hygiene, not production logic.**
The only failing step in the first aggregate `pnpm check` rerun was
`@oaknational/curriculum-sdk#lint:fix`, caused by new failure-path tests using
unused destructured placeholders and a type assertion. Replacing those with an
`omitProperty()` helper and a runtime `Object.defineProperty()` override kept
the tests honest and satisfied the no-unused-vars / no-type-assertion rules.

### Session 2026-04-09c — handoff and consolidation

#### Resolutions

- Archived the completed Phase 4.5 companion plan and re-pointed the live
  roadmap, umbrella, parent plan, active index, and session prompt to the
  Phase 6 merge-handoff state.
- Checked `~/.claude/plans/` for Oak-specific plan residue; the Phase 4.5
  external note duplicated the canonical repo plan and did not contain new
  grounding that needed extraction.
- Ran `pnpm practice:fitness:informational` during closeout. It reported
  existing background fitness pressure in directives/governance docs, but no
  new blocking issue created by this session and no additional graduation work
  that belonged inside this branch closeout.

### Session 2026-04-09d — quality gate sequencing

#### Resolutions

- Architecture-and-infrastructure planning now treats
  `future/quality-gate-hardening.plan.md` as the explicit first promotion
  candidate once the current improvement tranche is complete.
- This was kept as a sequencing/docs change only; `knip` and `depcruise` still
  fail on the current baseline, so promoting them into blocking gates now would
  break `pnpm check`, `pre-commit`, and `pre-push`.

### Session 2026-04-09e — sdk-codegen dependency classification

#### Patterns to Remember

- For `packages/sdks/oak-sdk-codegen`, classify package dependencies from the
  published surface defined by `package.json` `exports` plus `tsup.config.ts`
  `entry: ['src/**/*.ts', ...]`, not from `code-generation/` or `vocab-gen/`
  scripts. Imports used only by generator CLIs or build-time helpers belong in
  `devDependencies` even if they run as real Node processes during local
  `pnpm sdk-codegen` or `pnpm vocab-gen`.

### Session 2026-04-09f — Turbo self-build test dependency

#### Surprises

**S21: source-imported tests were accidentally proving a build artefact
precondition.** Expected: in-process tests would prove imported code behaviour,
while build artefact validation would be handled by `pnpm build` and
built-system coverage. Actual: `@oaknational/oak-curriculum-mcp-streamable-http`
source tests failed whenever `dist/oak-banner.html` was absent because
`createApp()` called `validateWidgetHtmlExists()` during bootstrap. The issue
was the test seam, not Turbo's refusal to build the package first.

#### Resolutions

- Added an explicit `createApp()` widget-validation seam so in-process tests can
  inject a no-op validator and stay independent of `dist/`
- Updated the quality-gate-hardening plan to record the correct response for
  this class of issue: keep build validation at build / built-system level

### Session 2026-04-09g — built artefact import proof

#### Surprises

**S22: `tsx` masked a Node ESM subpath defect in MCP SDK imports.**
Expected: if the streamable-HTTP app booted in dev, the built artefact would
resolve the same imports. Actual: source/dev ran under `tsx`, which tolerated
extensionless `@modelcontextprotocol/sdk/...` subpaths, while plain Node 24 ESM
rejected them in built code. The app-side imports were one layer; the deeper
production crash came from generated `@oaknational/sdk-codegen` MCP runtime
files still emitting `@modelcontextprotocol/sdk/types` without `.js`.

#### Resolutions

- Fixed the MCP tool generator source of truth so emitted runtime and contract
  files use Node-compatible `@modelcontextprotocol/sdk/types.js` specifiers,
  then regenerated the checked-in MCP tool outputs.
- Added a built-artifact E2E proof that spawns plain `node` to import
  `apps/oak-curriculum-mcp-streamable-http/dist/application.js`, so the repo
  now catches dev-loader-vs-built-loader drift without relying on network or
  extra file reads during the test body.

### Session 2026-04-09h — ESLint resolver standardisation

#### Surprises

**S23: `import-x/no-unresolved` can disagree with both TypeScript and Node on
package-export `.js` subpaths.** Expected: once the generated MCP SDK imports
used `.js`, lint and type-check would agree. Actual: `tsc` under
`moduleResolution: bundler` and plain Node ESM both resolved
`@modelcontextprotocol/sdk/types.js`, but the shared ESLint resolver stack
returned a false negative, so lint failed on the runtime-correct specifier.

**S24: resolver-side `projectService: true` was noise, not the fix.**
Expected: the mismatch might be a lint-project selection issue. Actual: the
false negative reproduced even with explicit projects; the useful correction
was chaining a Node-aware resolver alongside the TypeScript resolver, while
leaving parser-side `projectService: true` in place only where typed lint still
needs it.

#### Resolutions

- Standardised active workspace ESLint configs on
  `import-x/resolver-next` with chained TypeScript + Node resolvers
- Removed resolver-side `projectService: true` from workspace configs; kept
  parser-side `projectService: true` where typed lint still needs it
- Verified the original generated-file lint failure is green without backing
  out the required `.js` suffixes

#### Behaviour change

- Treat runtime/module-resolution truth as authoritative when lint disagrees;
  fix the resolver stack, not the imports
- Audit and standardise ESLint config across active workspaces rather than
  patching one package at a time
