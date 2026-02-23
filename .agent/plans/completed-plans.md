# Completed Plans

Index of archived plans across all collections. When a plan is completed,
move it to `archive/completed/`, add an entry here, and fix all references
at the source (clean break — no stubs, no redirects).

---

## Semantic Search

| Plan | Completed | Key Outcomes | Archive |
|------|-----------|--------------|---------|
| MCP Tool Snagging | 2026-02-23 | 5 SDK tool bugs (response augmentation, suggest, schema validation) fixed with TDD, smoke-tested end-to-end across 32 tools. Logger architectural bug also fixed with DI. | [archived plan](semantic-search/archive/completed/search-snagging.md) |
| Pre-Merge Widget Stabilisation (3h) | 2026-02-22 | Phases 0-5: 18 non-search renderers deleted, 3 renderers built (search, browse, explore), Zod contract tests, XSS hardening, Phase 5 resilience hardening (error containment, JSON.stringify, delegated clicks, four-way sync) | [archived plan](semantic-search/archive/completed/widget-search-rendering.md) |
| Search Dispatch Type Safety (3g) | 2026-02-22 | Eliminated `ScopeDispatcher` type erasure (B1) with switch-based `SearchDispatchResult` union + `default: never` exhaustiveness + `AssertNoSuggestions` invariant guard. Renamed `aggregated-search-sdk/` → `aggregated-search/`, `SEARCH_SDK_*` → `SEARCH_*` (W1). | [archived plan](semantic-search/archive/completed/search-dispatch-type-safety.md) |
| Phase 3a: MCP Search Integration | 2026-02-22 | Three MCP search tools wired (`search`, `browse-curriculum`, `explore-topic`), old REST search deleted, `search-sdk` promoted to `search`, adversarial review (B1-B4, W1-W8) | [archived plan](semantic-search/archive/completed/phase-3a-mcp-search-integration.md) |
| Thread Search SDK Integration | 2026-02 | SDK method, CLI command, benchmarks, 8 GTs across 5 subjects | [archived plan](semantic-search/archive/completed/thread-search-sdk-integration.plan.md) |
| Developer Onboarding Experience | 2026-02 | Onboarding journey, command/link integrity, release runbook | [archived plan](semantic-search/archive/completed/developer-onboarding-experience.plan.md) |
| Public Release Readiness | 2026-02 | Secrets, licence, package.json, docs, GitHub config, npm publish | [archived plan](semantic-search/archive/completed/public-release-readiness.plan.md) |
| 451 + Test Remediation | 2026-01 | HTTP 451 handling, E2E test compliance, stale docs | [archived plan](semantic-search/archive/completed/transcript-451-test-doc-remediation.plan.md) |
| Fail-Fast ES Credentials | 2026-02 | Silent degradation removed, fail-fast on missing creds | [archived plan](semantic-search/archive/completed/fail-fast-elasticsearch-credentials.md) |
| Search Response Tuning | 2026-02 | Response unification, type dedup, ES source filtering | [archived plan](semantic-search/archive/completed/search-response-tuning.md) |
| Env Architecture Overhaul | 2026-02 | `resolveEnv` pipeline, discriminated `RuntimeConfig` (ADR-116) | [archived plan](semantic-search/archive/completed/env-architecture-overhaul.md) |
| Search SDK + CLI | 2026-02 | SDK extraction, 16 I/O methods, `Result<T, E>` pattern | [archived plan](semantic-search/archive/completed/search-sdk-cli.plan.md) |

---

## SDK and MCP Enhancements

| Plan | Completed | Key Outcomes | Archive |
|------|-----------|--------------|---------|
| Folder Modernisation Meta Plan | 2026-02-22 | Legacy numbered plans archived under collection archive classes, disposition ledger established, governance docs normalised, and ADR-071 collision resolved by retaining widget URI ADR as 071 and renumbering dense-vector ADR to 118. | [archived plan](sdk-and-mcp-enhancements/archive/completed/folder-modernisation-meta-plan.md) |

---

## Adding Entries

When archiving a plan:

1. **Move** the plan file to `{collection}/archive/completed/`.
2. **Add an entry** to the table above (plan name, date, key outcomes, archive link).
3. **Fix all references** to the old `active/` path — update them to point
   directly to `archive/completed/`. Clean break, no stubs.
4. **Run** `/jc-consolidate-docs` to verify no stale references remain.

---

## Migration: Removing Existing Closeout Stubs

If a closeout stub exists in an `active/` directory (a file with
frontmatter `todos: []` and a redirect to `archive/completed/`):

1. Delete the stub from `active/`.
2. Add an entry to this index (if not already present).
3. Find all references to the deleted stub path
   (`rg "active/[stub-filename]" .agent/ .cursor/ docs/`).
4. Update each reference to point to `archive/completed/[filename]`.
5. Commit: `"chore: replace closeout stub with clean-break archival"`.
