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
