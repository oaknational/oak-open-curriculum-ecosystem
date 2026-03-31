---
name: Merge main into branch
overview: "Merge 3 commits from main (PR #73 Sentry/OTel observability + 2 releases) into feat/mcp_app_ui, resolving 6 text conflicts and verifying 11 auto-merged files (2 HIGH risk, 9 Medium) line by line, following the repo's 7-phase pre-merge analysis process."
todos:
  - id: plan-review
    content: "Pre-requisite: invoke architecture, MCP, and code reviewers on THIS PLAN before executing"
    status: completed
  - id: pre-step
    content: Verify clean working tree, commit any uncommitted planning files, create backup branch
    status: pending
  - id: start-merge
    content: Execute git merge --no-ff origin/main and capture full conflict output
    status: pending
  - id: trivial-conflicts
    content: Resolve 4 trivial doc conflicts (invoke-code-reviewers.md, 3 plan index files)
    status: pending
  - id: keystone-conflict
    content: "Resolve register-resources.ts: combine branch widget removal + main observability wrapping (see detailed 10-step resolution)"
    status: pending
  - id: lockfile
    content: Delete pnpm-lock.yaml, run pnpm install to regenerate
    status: pending
  - id: commit-merge
    content: Commit the merge
    status: pending
  - id: verify-application-ts
    content: "Manually verify application.ts auto-merge: rename applied, helpers extracted, observability threaded"
    status: pending
  - id: verify-tools-list-override
    content: Verify tools-list-override.ts does NOT exist; only preserve-schema-examples.ts exists
    status: pending
  - id: grep-sweep
    content: "Grep sweep for stale references: tools-list-override, overrideToolsListHandler, oak-json-viewer, deleted widget paths"
    status: pending
  - id: verify-auto-merged-tests
    content: Verify auto-merged test files have correct observability parameters and no stale imports
    status: pending
  - id: verify-plan-config-automerges
    content: "Verify plan/config auto-merges line by line: architecture-and-infrastructure/README.md (both sides restructured sections — HIGH risk), prompts/README.md (both sides modified table), root package.json (version + scripts + deps), distilled.md, app package.json"
    status: pending
  - id: verify-register-json-resources
    content: "Confirm register-json-resources.ts has no call sites (confirmed duplicate — consolidation deferred to post-merge)"
    status: pending
  - id: verify-observability-completeness
    content: "Observability completeness: verify 4x maybeWrapResourceHandler in merged register-resources.ts AND walk observability threading map against merged files"
    status: pending
  - id: verify-branch-only-tests
    content: "Verify branch-only test files: do NOT add observability to register-resources.integration.test.ts (async wrapper breaks sync fake); verify auth/public-resources.ts has no imports from deleted widget files"
    status: pending
  - id: type-check
    content: Run pnpm type-check for fast feedback on signature mismatches
    status: pending
  - id: fix-breaks
    content: Fix any type-check failures from auto-merged signature mismatches
    status: pending
  - id: full-verify
    content: Run pnpm check (full clean rebuild + all gates)
    status: pending
  - id: contamination-check
    content: Run WS3 contamination check per child plan
    status: pending
  - id: invoke-reviewers
    content: Invoke MCP reviewer, code reviewer, and architecture reviewer on merge result
    status: pending
  - id: napkin
    content: Write session learnings to napkin (merge patterns, surprises, time sinks)
    status: pending
  - id: update-merge-guidance
    content: "Update existing pre-merge-analysis rule and guide with new learnings (see Phase 8b/8c): observability gap analysis, call-chain contracts, characterisation test inventory"
    status: pending
  - id: update-session-prompt
    content: Update session-continuation.prompt.md to reflect merge completion
    status: pending
  - id: consolidation
    content: Run full consolidation workflow per .agent/commands/consolidate-docs.md (10 steps)
    status: pending
isProject: false
---

# Plan to merge main into feat/mcp_app_ui

## Situation

`feat/mcp_app_ui` is ahead of and **3 commits behind** `main`. Main received:

- `54309a6a` feat(observability): add Sentry + OTel foundation for HTTP MCP server (PR #73) — **359 files, 20,583 insertions**
- `9c0d4b6e` chore(release): 1.2.0
- `59e840c8` chore(release): 1.3.0

The branch completed WS3 Phase 1: deleted 22 legacy widget files, renamed `tools-list-override.ts` to `preserve-schema-examples.ts`, and simplified `register-resources.ts`.

### Conceptual alignment

The two branches are **complementary, not conflicting**:

- **Branch direction**: clean-break widget removal, semantic rename for architectural clarity
- **Main direction**: observability infrastructure (Sentry + OTel) throughout, modular extraction of helper functions

The resolution is always "both together": observability wrapping on all resource handlers **without** the deleted widget, and the renamed `preserve-schema-examples.ts` **with** main's structural improvements to `application.ts`.

---

## Pre-merge analysis (Phases 1-4 — COMPLETE)

### 6 Text Conflicts

| #   | File                                                 | Category              | Resolution                                       |
| --- | ---------------------------------------------------- | --------------------- | ------------------------------------------------ |
| 1   | `invoke-code-reviewers.md`                           | Trivial               | Accept main's version, re-apply branch additions |
| 2   | `agentic-engineering-enhancements/README.md`         | Trivial               | Accept both entries                              |
| 3   | `agentic-engineering-enhancements/current/README.md` | Trivial               | Accept both entries                              |
| 4   | `agentic-engineering-enhancements/roadmap.md`        | Trivial               | Accept both entries                              |
| 5   | `**register-resources.ts`**                          | **Semantic keystone** | Manual merge — see detailed resolution below     |
| 6   | `pnpm-lock.yaml`                                     | Mechanical            | Regenerate with `pnpm install`                   |

### Silent Breaks in Auto-Merged Files (the real risk)

11 files changed on both sides auto-merge cleanly but may have semantic breaks. All 11 are listed below (the other 6 changed-on-both-sides files are the text conflicts listed above):

| #   | File                                                              | Risk     | What to verify                                                                                                                                                                                                                        |
| --- | ----------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A   | `**application.ts`**                                              | **HIGH** | Branch's rename (`preserveSchemaExamplesInToolsList`) lands in `initializeCoreEndpoints`, not orphaned. Main's extracted helpers (health, static content) used — no inline duplicates. `observability` parameter threaded throughout. |
| B   | `**architecture-and-infrastructure/README.md`** (plan index)      | **HIGH** | Both sides restructured sections. Branch added "Recently Completed" and archived CI plan; main added "Active Now" with sentry plan, "Strategic Backlog", updated milestone text, and moved paths from `current/` to `active/`. Verify no duplicate section headers, no mangled tables, both sides' structural changes present, CI plan in "Recently Completed" with archived path. |
| C   | `**handlers-tool-registration.integration.test.ts`**              | Medium   | `observability: createFakeHttpObservability()` parameter present in `registerAndCapture()`. Branch's widget test block removed.                                                                                                       |
| D   | `**create-stubbed-http-app.ts`**                                  | Medium   | `observability` parameter present in `createApp()` call. `createHttpObservabilityOrThrow` imported.                                                                                                                                   |
| E   | `**public-resource-auth-bypass.e2e.test.ts`**                     | Medium   | Test setup matches new observability signatures.                                                                                                                                                                                      |
| F   | `**widget-metadata.e2e.test.ts`**                                 | Medium   | Test setup matches new signatures.                                                                                                                                                                                                    |
| G   | `**prompts/README.md`**                                           | Medium   | Branch updated session-continuation row description and references; main added new sentry-otel prompt row. Verify both changes present, table aligned, no duplicated or dropped rows.                                                 |
| H   | `**package.json` (root)**                                         | Medium   | Branch bumped `dependency-cruiser`, `knip`, `turbo` versions; main bumped `version` to `1.3.0` and added `codex-reviewer-resolve` script. Verify version is `1.3.0`, new script present, branch's dependency bumps intact, valid JSON. |
| I   | `**auth-enforcement.e2e.test.ts**`                                | Medium   | Observability wiring may have changed test setup. Verify test setup matches new signatures.                                                                                                                                           |
| J   | `**distilled.md**`                                                | Medium   | No duplicate entries between branch and main additions. Verify no mangled markdown from overlapping hunk boundaries.                                                                                                                  |
| K   | `**package.json` (app)**                                          | Medium   | Sentry deps from main present. Verify no missing or duplicated dependency entries.                                                                                                                                                    |

### Rename collision: `tools-list-override.ts` to `preserve-schema-examples.ts`

Branch **deleted** `tools-list-override.ts` and **created** `preserve-schema-examples.ts` (with renamed function). Git should detect the rename via content similarity. After merge:

- Verify `tools-list-override.ts` does NOT exist
- Verify `preserve-schema-examples.ts` exists with branch's content
- Two new test files from main reference `tools-list-override` in JSDoc comments (not imports) — update stale comments

### New infrastructure from main that must be preserved

- `[packages/core/observability/](packages/core/observability/)` — new core observability package
- `[packages/libs/sentry-mcp/](packages/libs/sentry-mcp/)` — new Sentry MCP wrapper library
- `[apps/.../src/observability/](apps/oak-curriculum-mcp-streamable-http/src/observability/)` — HTTP-level observability module
- `[apps/.../src/register-resource-helpers.ts](apps/oak-curriculum-mcp-streamable-http/src/register-resource-helpers.ts)` — `maybeWrapResourceHandler`, `ResourceRegistrar` type, `WidgetResourceOptions`
- `[apps/.../src/app/health-endpoints.ts](apps/oak-curriculum-mcp-streamable-http/src/app/health-endpoints.ts)` — extracted health endpoints
- `[apps/.../src/app/static-content.ts](apps/oak-curriculum-mcp-streamable-http/src/app/static-content.ts)` — extracted static content mounting
- ADR-143 (coherent structured fan-out for observability)

### Widget files: delete/keep reconciliation

All 22 files the branch deleted still exist on main but were NOT modified on main. Git will honour the branch's deletion. No modify/delete conflicts expected. Verified by dry-run.

### Files changed only on one side (automatic resolution)

52 files in `streamable-http/src/` were changed ONLY on main. Git takes main's version automatically, bringing all observability infrastructure. Key files:

- `handlers.ts` — main only. Adds `wrapToolHandler` (Sentry), `observability` param, extracts `createMcpHandler` to `mcp-handler.ts`, adds `deriveWidgetDomain`. Git takes main's version.
- `register-prompts.ts` — main only. Refactored to loop, added `wrapPromptHandler` with observability. Git takes main's version.
- `auth-routes.ts` — main only. Passes `observability` to `createMcpHandler`. Git takes main's version.
- `bootstrap-helpers.ts`, `bootstrap-security.ts`, `oauth-and-caching-setup.ts` — main only. All gain `observability` parameter. Git takes main's version.

24 files in `streamable-http/src/` were changed ONLY on the branch. Almost all are widget deletions. Two production files need post-merge attention:

- `register-resources.integration.test.ts` — tests resource registration without observability; may need observability fake parameter
- `auth/public-resources.ts` — may reference deleted widget resources

---

## Product Code Gap Analysis: Post-Merge Observability Coverage

Main's PR #73 adds a complete observability layer. Every MCP protocol surface (tools, resources, prompts, request handling) is instrumented with Sentry spans. After merge, the coverage must be complete.

### Observability threading map

| Layer                      | Wrapping mechanism                                 | Source file                               | Merge outcome                | Gap risk     |
| -------------------------- | -------------------------------------------------- | ----------------------------------------- | ---------------------------- | ------------ |
| HTTP request spans         | `observability.withSpan`                           | `mcp-handler.ts` (new from main)          | Automatic                    | None         |
| Tool handlers              | `wrapToolHandler` from `@oaknational/sentry-mcp`   | `handlers.ts` (main only)                 | Automatic                    | None         |
| **Resource handlers**      | `**maybeWrapResourceHandler`**                     | `**register-resources.ts` (CONFLICT)**    | **Manual merge required**    | **HIGH**     |
| **Composition root**       | `observability` param threading to all subsystems  | `**application.ts` (changed both sides)** | **Auto-merge needs verify**  | **MEDIUM**   |
| Prompt handlers            | `wrapPromptHandler` from `@oaknational/sentry-mcp` | `register-prompts.ts` (main only)         | Automatic                    | None         |
| Bootstrap phases           | `observability.withSpanSync`                       | `bootstrap-helpers.ts` (main only)        | Automatic                    | None         |
| Auth setup                 | `measureAuthSetupStep`                             | `auth-routes.ts` (main only)              | Automatic                    | None         |
| OAuth proxy                | `observability` param                              | `oauth-and-caching-setup.ts` (main only)  | Automatic                    | None         |
| Asset download             | `captureHandledError`/`withSpan`                   | `asset-download-route.ts` (main only)     | Automatic                    | None         |
| Security middleware        | `observability.withSpanSync`                       | `bootstrap-security.ts` (main only)       | Automatic                    | None         |
| Cleanup errors             | `captureHandledError`                              | `mcp-handler.ts` (new from main)          | Automatic                    | None         |
| `tools/list` override      | Not wrapped (custom handler in `preserve-schema-examples.ts`) | `preserve-schema-examples.ts` (branch)    | Automatic                    | Low — HTTP request span from `mcp-handler.ts` still covers the MCP call; no per-tool `wrapToolHandler` applies to custom `tools/list` handlers |

**Two files require manual attention**: `register-resources.ts` (text conflict, manual merge required) and `application.ts` (auto-merged but changed on both sides — must be verified line-by-line as the composition root where observability threads into all subsystems). All other layers arrive automatically because the branch did not change those files.

### What "wrap each resource handler" means concretely

Each resource registration function body must change from branch's plain pattern to main's wrapped pattern:

**Branch (plain):**

```typescript
server.registerResource(name, uri, metadata, () => {
  return { contents: [{ uri, mimeType, text }] };
});
```

**Required (wrapped):**

```typescript
server.registerResource(
  name,
  uri,
  metadata,
  maybeWrapResourceHandler(
    name,
    () => { return { contents: [{ uri, mimeType, text }] }; },
    observability,
  ),
);
```

This must be applied to all four resource functions: `registerDocumentationResources`, `registerCurriculumModelResource`, `registerPrerequisiteGraphResource`, `registerThreadProgressionsResource`.

### Characterisation test safety net (necessary but not sufficient)

Main added `register-resources-observability.characterisation.test.ts` which:

1. Calls `registerAllResources(server, { observability })` and asserts resources are registered
2. Spies on `createMcpObservationOptions` and asserts it was called (proves `maybeWrapResourceHandler` was exercised)

**Trust level**: This test proves wrapping was *invoked at least once*, not that *every* resource handler was individually wrapped. A partial mistake (one function omits wrapping while others keep it) could still pass `toHaveBeenCalled()`. Additionally, if `createMcpObservationOptions()` returned a falsy value, handlers would fall through unwrapped while the spy still recorded calls.

This test is a **necessary safety net** but not sufficient proof of complete coverage. The keystone resolution approach (starting from main's base and only removing widget code) mitigates this by preserving wrapping by default rather than re-adding it.

Additionally: `handlers-observability.characterisation.test.ts` tests tool wrapping, `handlers-mcp-span.characterisation.test.ts` tests MCP request spanning. These arrive from main and run automatically.

### Call-chain contract: handlers.ts to register-resources.ts

Main's `handlers.ts` (which Git takes automatically) calls:

```typescript
registerAllResources(server, {
  widgetDomain: deriveWidgetDomain(options.runtimeConfig),
  observability: options.observability,
});
registerPrompts(server, options.observability);
```

The merged `register-resources.ts` MUST satisfy this calling convention:

- Accept `(server: ResourceRegistrar, options?: WidgetResourceOptions)` signature
- Re-export `registerPrompts` from `register-prompts.ts`
- Re-export `ResourceRegistrar` and `WidgetResourceOptions` from `register-resource-helpers.ts`

### Post-widget-removal dead code (harmless, cleanup deferred)

These items become dead code after widget removal but cause no errors:

- `deriveWidgetDomain()` in `handlers.ts`, `WidgetResourceOptions.widgetDomain`, and the `WidgetResourceOptions` name itself — a single coherent cleanup: rename type, remove dead field, remove dead function
- Comment in characterisation test: "the widget and documentation resources" — stale text

Note: `RESOURCE_MIME_TYPE` is NOT dead code post-merge — keystone step 4 already removes its import. Do NOT fix the above items during merge (scope creep). Flag for post-merge cleanup as a single consolidated work item.

---

## Execution Plan (Phases 5-7)

### Pre-requisite: Sub-agent plan review (COMPLETE — two rounds)

**Round 1**: Invoked architecture-reviewer-barney, architecture-reviewer-wilma, mcp-reviewer, and code-reviewer. All blocking findings addressed below. Key corrections applied:

- Promoted `application.ts` to first-class observability seam (Barney)
- Fixed `auth/public-resources.ts` verification — `WIDGET_URI` is intentionally retained (Barney, MCP reviewer)
- Added merge-state hygiene and rollback strategy (Wilma)
- Downgraded characterisation test trust level from "primary proof" to "necessary but not sufficient" (Wilma)
- Fixed `register-resources.integration.test.ts` guidance: do NOT add observability (async wrapper breaks sync test fake) — keep omitting it since the parameter is optional (Code reviewer, MCP reviewer)
- Step 10 now explicitly includes `registerPrompts` re-export (Code reviewer)
- Step 1 clarified: edit single SDK import to drop `WIDGET_URI` only (Code reviewer)
- Noted `register-json-resources.ts` as potential duplicate surface from main (Barney)

**Round 2**: Invoked all 4 architecture reviewers (Barney, Betty, Fred, Wilma), mcp-reviewer, security-reviewer, and code-reviewer with explicit observability-completeness remit. Key corrections applied:

- Added `setupOAuthAndCaching` to Phase 6 step 1 verification checklist (MCP reviewer, Code reviewer)
- Added Phase 6 step 8: `register-json-resources.ts` call-site verification — confirmed duplicate, 5/7 reviewers flagged (Barney, Betty, Fred, Wilma, Code reviewer)
- Added Phase 6 step 9: observability completeness verification — 4x `maybeWrapResourceHandler` count + threading map walkthrough (Fred, Wilma, Code reviewer)
- Added `tools/list` custom handler to observability threading map with gap note (Code reviewer)
- Added rollback note: `pnpm install` required after `git reset --hard` (Wilma)
- Removed RESOURCE_MIME_TYPE from dead code list — incorrectly attributed and already handled by keystone step 4 (Fred)
- Corrected step 10 language: type re-exports preserve API parity, not functionally required by call chain (Barney, MCP reviewer)
- Consolidated dead code follow-ups into single coherent work item (Betty, Fred)
- Reworded WIDGET_URI follow-up as conscious ADR-057 deviation with restoration deadline (Fred, Security reviewer)
- Reworded `register-json-resources.ts` follow-up from "assess whether" to "consolidate — confirmed duplicate" (Fred, Barney)
- Simplified Phase 8b from new skill creation to updating existing guidance (Barney)
- Added 4 new risks: OAuth redaction gap, auth data in logs, WIDGET_URI telemetry amplification, widget E2E vacuous pass (Security reviewer)
- Added security review of observability payloads to post-merge follow-ups (Security reviewer)

### Rollback strategy

Before starting the merge:

- Create a backup branch at current HEAD: `git branch pre-merge-backup`
- If merge goes wrong before commit: `git merge --abort`
- If merge goes wrong after commit: `git reset --hard pre-merge-backup` then `pnpm install` (reset restores the old lockfile but does not revert `node_modules` or Turbo caches on disk)

### Phase 5: Execute merge

**Pre-step 1**: Verify the working tree is clean (`git status`). If there is an in-progress merge, abort it with `git merge --abort`. If there are uncommitted changes, handle them before proceeding. The merge MUST start from a clean baseline.

**Pre-step 2**: Verify planning files (this merge plan, session prompt, napkin) are committed. If any have uncommitted changes, commit them before starting the merge — `git merge --abort` wipes staged-but-uncommitted files.

**Pre-step 3**: Create backup branch at current HEAD: `git branch pre-merge-backup`

**Step order** (dependency-aware):

1. **Start the merge**: `git merge --no-ff origin/main` (let it stop at conflicts)
2. **Trivial conflicts** (4 doc files): accept both sides' entries, deduplicate
3. **Semantic keystone** — `register-resources.ts`: see detailed resolution below
4. **Lockfile**: delete `pnpm-lock.yaml`, regenerate with `pnpm install`
5. **Commit the merge**

### Phase 5 Detail: `register-resources.ts` resolution

**Simplest correct approach** (per Barney): take main's `register-resources.ts` as the base, remove widget-only code, restore the branch's widget-removal JSDoc comment. This preserves main's observability wrapping by default and reduces the chance of accidental omission.

Concrete steps:

1. Start from main's version of the file as the base
2. Edit the single SDK import line to drop `WIDGET_URI` only — keep `DOCUMENTATION_RESOURCES`, `CURRICULUM_MODEL_RESOURCE`, etc.
3. Remove the `AGGREGATED_TOOL_WIDGET_HTML` import from `./aggregated-tool-widget.js`
4. Remove `registerAppResource` and `RESOURCE_MIME_TYPE` imports from `@modelcontextprotocol/ext-apps/server`
5. Remove `WIDGET_CSP` constant
6. Remove `registerWidgetResource` function entirely
7. Remove the `registerWidgetResource(server, options)` call from `registerAllResources`
8. Restore branch's module-level JSDoc comment about widget removal and WS3 Phase 2-3 restoration
9. Keep all observability wrapping (`maybeWrapResourceHandler` on all remaining functions) — this is already correct in main's base
10. Keep re-exports: `export { registerPrompts } from './register-prompts.js'` (required by the `handlers.ts` call contract) AND `export type { ResourceRegistrar, WidgetResourceOptions } from './register-resource-helpers.js'` (preserves module API parity with main — no current consumer imports these types through `register-resources.ts`, but removing them changes the public surface during a merge)

**Note**: `register-json-resources.ts` is a new file from main that partially duplicates the resource registration surface. Do NOT wire it into the keystone resolution — park as separate follow-up tidy-up to avoid normalising two sources of truth.

### Phase 6: Post-merge verification of auto-merged files

After resolving conflicts and committing:

1. **`application.ts`** (first-class observability seam — changed on both sides) — open file, verify line by line:

- Import: `import { preserveSchemaExamplesInToolsList } from './preserve-schema-examples.js'` (not `tools-list-override`)
- Call site in `initializeCoreEndpoints`: `preserveSchemaExamplesInToolsList(server)` (not `overrideToolsListHandler`)
- No inline `addHealthEndpoints`/`mountStaticContentRoutes` functions (should use imports from `./app/`)
- `observability: HttpObservability` is required in `CreateAppOptions`
- `observability` threaded to all `runBootstrapPhase`, `setupBaseMiddleware`, `setupSecurityMiddleware`, `setupOAuthAndCaching`, `setupAuthRoutes`, `initializeCoreEndpoints`, `mountAssetDownloadProxy` calls
- `PhasedTimer` imported from `@oaknational/logger`
- Logger created via `options.observability.createLogger(...)` (not `createHttpLogger`)
- No duplicate route mounting (two hunks both adding similar setup)
- Correct bootstrap ordering preserved

2. **`tools-list-override.ts`** — verify file does NOT exist after merge. If it does, delete it.
3. **Grep sweep for stale references** — search across `apps/oak-curriculum-mcp-streamable-http` for any remaining references to `tools-list-override`, `overrideToolsListHandler`, `oak-json-viewer`, and deleted widget paths. Fix JSDoc/comments only (no import references should exist).
4. **`handlers-tool-registration.integration.test.ts`** — verify `observability: createFakeHttpObservability()` is in the `registerAndCapture()` call
5. **`create-stubbed-http-app.ts`** — verify `createHttpObservabilityOrThrow` import and `observability` in `createApp` call
6. **E2E tests** — verify test setup in `widget-metadata.e2e.test.ts`, `public-resource-auth-bypass.e2e.test.ts`, `auth-enforcement.e2e.test.ts` matches new signatures
7. **Plan and config auto-merges** — verify each line by line:

- `architecture-and-infrastructure/README.md` (**HIGH** risk — both sides restructured this file): verify section structure is coherent — should have "Active Now" (with sentry plan from main), "Queued Work", "Strategic Backlog", "Active Plans" (CI plan removed by branch), "Recently Completed" (CI plan archived by branch), "Documents" (sentry entry from main), "Milestone Alignment" (main's updated text). No duplicate section headers. No mangled table rows. CI plan path should reference `archive/completed/`. Plan paths should use `active/` not `current/` where main moved them.
- `prompts/README.md`: verify session-continuation row has branch's updated description AND main's new sentry-otel-foundation row is present. No duplicated or dropped rows. Table column alignment intact.
- Root `package.json`: verify `version` is `1.3.0`, `codex-reviewer-resolve` script present in scripts, branch's `dependency-cruiser` (`^17.3.10`), `knip` (`^6.1.0`), `turbo` (`^2.8.21`) version bumps intact. Validate JSON structure is parseable.
- `distilled.md`: verify no duplicate entries between branch and main additions, no mangled markdown from overlapping hunk boundaries.
- App `package.json`: verify Sentry deps from main present, no missing or duplicated dependency entries.

8. **`register-json-resources.ts` — confirm no call sites exist**. Grep across the entire `apps/oak-curriculum-mcp-streamable-http` workspace for imports of `register-json-resources`. This file is a confirmed duplicate of the four resource registration functions in `register-resources.ts`. If it has no call sites (expected based on `origin/main` analysis), it is inert and consolidation is deferred to post-merge. If it IS wired in, it must be verified for `maybeWrapResourceHandler` coverage immediately — an unwrapped duplicate path would be a silent observability gap.
9. **Observability completeness verification** — two checks:

- **Per-resource wrapping count**: Search the merged `register-resources.ts` for occurrences of `maybeWrapResourceHandler`. Must find exactly 4 (one each for `registerDocumentationResources`, `registerCurriculumModelResource`, `registerPrerequisiteGraphResource`, `registerThreadProgressionsResource`). Fewer than 4 means a resource lost its wrapping.
- **Threading map walkthrough**: Walk each row of the "Observability threading map" table against the actual merged files. Confirm each layer's wrapping mechanism is present: `observability.withSpan` in `mcp-handler.ts`, `wrapToolHandler` in `handlers.ts`, `maybeWrapResourceHandler` in `register-resources.ts`, `observability` parameter in `application.ts` threading to all subsystems, `wrapPromptHandler` in `register-prompts.ts`, `observability.withSpanSync` in `bootstrap-helpers.ts` and `bootstrap-security.ts`, `measureAuthSetupStep` in `auth-routes.ts`, `observability` in `oauth-and-caching-setup.ts`, `captureHandledError`/`withSpan` in `asset-download-route.ts`.

10. **Branch-only test files** — verify:

- `register-resources.integration.test.ts`: do NOT add `{ observability: createFakeHttpObservability() }`. The `options` parameter is optional, so existing calls `registerAllResources(server)` remain valid. Adding observability would break: `wrapResourceHandler` returns an async handler, but the test fake explicitly throws on Promise-returning callbacks. Leave as-is; production always passes observability via `handlers.ts`.
- `auth/public-resources.ts`: verify no imports from deleted widget **files** — the `WIDGET_URI` import from `@oaknational/curriculum-sdk` is intentionally retained per ADR-057 (harmless no-op during WS3 interim). Do NOT remove it.

11. **Run `pnpm type-check`** immediately — this is the single fastest way to catch auto-merge signature mismatches. If type-check fails, fix each error before proceeding.

### Phase 7: Full verification and review

`pnpm type-check` already ran in Phase 6 step 11 for fast feedback. Phase 7 runs the full gate suite, which includes type-check.

1. `pnpm check` (full clean rebuild + all gates including type-check)
2. Contamination check (per WS3 child plan)
3. Invoke **MCP reviewer** on the merge result (register-resources.ts changes touch MCP protocol)
4. Invoke **code reviewer** on the overall merge quality
5. Invoke **architecture reviewer** (Barney for simplification, Wilma for resilience) on the structural integration of observability + widget removal

---

## Risks and mitigations

| Risk                                                                           | Likelihood | Mitigation                                                                                                                                                                                  |
| ------------------------------------------------------------------------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `application.ts` auto-merge produces incorrect result                          | Medium     | First-class seam: manual line-by-line verification in Phase 6 step 1; check for duplicate route mounting, correct bootstrap ordering, and behaviour-correct but type-valid silent corruption |
| `architecture-and-infrastructure/README.md` auto-merge garbles section structure | High       | Both sides restructured sections (branch added "Recently Completed", main added "Active Now"/"Strategic Backlog"). Line-by-line verification in Phase 6 step 7; check for duplicate section headers, mangled tables, lost sections |
| Git doesn't detect rename and creates modify/delete conflict                   | Low        | Dry-run showed clean auto-merge; if rename not detected, manually apply; grep sweep in Phase 6 step 3 catches stale references                                                             |
| `observability` parameter missing in auto-merged test files                    | High       | `pnpm type-check` will catch immediately; fix before commit if possible                                                                                                                     |
| Resource handlers missing `maybeWrapResourceHandler` wrapping                  | Medium     | Starting from main's base (preserves wrapping by default) + characterisation test (necessary but not sufficient) + manual visual check                                                      |
| Branch-only `register-resources.integration.test.ts` breaks with new signature | Low        | The `options` parameter is optional; existing one-arg calls remain valid. Do NOT add observability (async wrapper breaks sync test fake)                                                     |
| In-progress merge state blocks `git merge`                                     | Medium     | Pre-step 1: verify clean working tree or `git merge --abort`; backup branch at pre-step 2                                                                                                  |
| `lockfile` regeneration shifts transitive versions                             | Low        | Compare lockfile diff size; CI uses frozen lockfile check                                                                                                                                    |
| `register-json-resources.ts` creates duplicate resource registration surface   | Low        | Do NOT wire into keystone resolution; flag for post-merge follow-up                                                                                                                          |
| `WidgetResourceOptions` name misleading post-widget-removal                    | Certain    | Note for post-merge follow-up; do NOT rename during merge (scope creep)                                                                                                                     |
| Stale comments reference `tools-list-override`                                 | Certain    | Grep sweep in Phase 6 step 3 catches all occurrences across the workspace                                                                                                                   |
| `deriveWidgetDomain` becomes dead code                                         | Certain    | Harmless; flag for post-merge cleanup                                                                                                                                                        |
| OAuth form-encoded secrets may appear in observability payloads (pre-existing)  | Medium     | Pre-existing in main's observability code, not introduced by merge. `REDACTED_QUERY_KEYS` covers URL params but `/oauth/token` form bodies (`code`, `code_verifier`, `refresh_token`) may flow to Sentry. Flag for post-merge security review |
| Auth success handler logs `clientId`/`scopes`/`userId` to Sentry (pre-existing) | Low       | Pre-existing in main. `handleAuthSuccess()` identifiers flow to Sentry when `enableLogs` is true. Flag for post-merge privacy review                                                         |
| `WIDGET_URI` auth bypass creates unauthenticated telemetry amplification surface | Low       | Bypass for a non-existent resource still generates request-span activity. Conscious ADR-057 deviation with restoration deadline in Phase 2-3                                                  |
| Widget metadata E2E passes vacuously when widget tool allowlist is empty        | Low        | No explicit assertion that widget resource is NOT registered during WS3 interim. Bad merge could reintroduce widget without a failing test                                                    |

---

## Phase 8: Lessons, improvements, and consolidation

### 8a. Napkin — capture session learnings

Write to `.agent/memory/napkin.md` with a session heading covering:

- What the merge analysis process revealed vs what the original plan predicted
- Any surprises from auto-merge behaviour (rename detection, observability threading)
- Time sinks and what could have been done faster
- Patterns that worked well (e.g. dry-run first, fork-point comparison, characterisation test safety nets)
- Corrections made after reviewer feedback

### 8b. Update existing merge guidance with new learnings

The repo already has a rule (`.agent/rules/pre-merge-divergence-analysis.md`) and a guide (`docs/engineering/pre-merge-analysis.md`). A brand-new multi-platform skill would be overbuilt — the genuinely new learning from this session is a small set of extensions to the existing guidance. Update the rule and guide (see 8c below) rather than creating a new skill.

### 8c. Improve the pre-merge analysis guide

Update `docs/engineering/pre-merge-analysis.md` with insights from this session:

- Add Phase 3.5: "Observability and cross-cutting concern gap analysis" — trace instrumentation wrappers across all protocol surfaces; identify which layers need manual work vs arrive automatically
- Add to Phase 4: "Call-chain contract verification" — after identifying the keystone conflict, trace callers in auto-merged files to verify they pass the right arguments to manually-merged interfaces
- Add to Phase 4: "Characterisation test inventory" — identify existing tests that guard integration seams; these are the automated safety net for the merge
- Add to Phase 6: "Files changed only on one side" — explicitly categorise files by which side changed them to predict Git's automatic resolution direction

### 8d. Update session continuation prompt

Update `.agent/prompts/session-continuation.prompt.md` to:

- Mark the merge as complete
- Set Phase 2 as the immediate next priority
- Remove the pre-Phase-2 blocker note

### 8e. Run the consolidation workflow

Follow `.agent/commands/consolidate-docs.md` in full:

1. Verify documentation is current — extract any plan content to permanent locations
2. Update plan status lines, completion markers, cross-references
3. Check ephemeral locations for content that has matured into settled documentation
4. Check `.agent/experience/` files for applied technical patterns
5. Extract code patterns to `.agent/memory/code-patterns/` if any qualify
6. Rotate napkin if it exceeds ~500 lines (follow distillation skill)
7. Keep `distilled.md` within size constraints
8. Run `pnpm practice:fitness` (or `pnpm practice:fitness:informational`)
9. Check the practice box (`.agent/practice-core/incoming/`)
10. Optionally record a brief experience in `.agent/experience/`

---

## Post-merge follow-up items (NOT in merge scope, for next session)

### Widget dead code cleanup (single coherent work item)

- Rename `WidgetResourceOptions` to `ResourceRegistrationOptions` or similar
- Remove `WidgetResourceOptions.widgetDomain` field (dead — passed but never consumed)
- Remove `deriveWidgetDomain()` from `handlers.ts` (dead — returns a hostname string nothing reads)
- Update characterisation test comment "the widget and documentation resources" to reflect widget removal
- Consider whether `register-resource-helpers.ts` should be absorbed into `register-resources.ts` now that widget-specific helpers are removed

### Confirmed duplicates

- Consolidate `register-json-resources.ts` — confirmed duplicate of the four resource registration functions in `register-resources.ts` (5 reviewers flagged; no current call sites on main, but two files exporting identical functions invites future drift)

### ADR-057 deviation: WIDGET_URI auth bypass

- `WIDGET_URI` remains in `PUBLIC_RESOURCE_URIS` during WS3 Phase 1 as a conscious ADR-057 deviation. The bypass targets a URI with no registered resource, which widens the unauthenticated allowlist surface and generates unnecessary telemetry on probes (Security reviewer finding). Restore synchronisation invariant in Phase 2-3 when widget resource is re-registered, or remove bypass if widget is not re-registered.

### Test coverage for observability

- Upgrade `register-resources.integration.test.ts` fake to support async resource handlers (ADR-078 compliance item — current sync constraint prevents testing the production observability path; Code reviewer, Fred)
- Consider adding per-resource wrapping assertions to characterisation tests (current `toHaveBeenCalled()` only proves wrapping was invoked at least once, not that all four resource paths are wrapped)
- Consider adding explicit E2E assertion that widget resource is NOT registered during WS3 interim (Security reviewer — current E2E can pass vacuously)

### Security review of observability payloads (pre-existing in main, not introduced by merge)

- Review OAuth form-encoded redaction: `REDACTED_QUERY_KEYS` covers URL params but `/oauth/token` form bodies (`code`, `code_verifier`, `refresh_token`) may flow to Sentry unredacted (Security reviewer — blocking-severity finding on main's implementation)
- Review auth success handler logging: `handleAuthSuccess()` logs `clientId`, `scopes`, `userId` to Sentry when `enableLogs` is true (Security reviewer — privacy exposure)

### Resume WS3

- Resume WS3 Phase 2 per the phase companion plan
