# HTTP MCP Sentry Validation — 2026-04-16

Scope: HTTP MCP server (`oak-curriculum-mcp-streamable-http`) only. This is
the closing evidence bundle for parent Sentry/OTel plan item 5 ("Deploy with
`SENTRY_MODE=sentry` and produce evidence bundle").

## Pre-state

| Item | Value |
| --- | --- |
| Branch HEAD | `0f9245f5` (`fix: undo oauth scope changes`) |
| Fresh preview target | `https://curriculum-mcp-alpha.oaknational.dev/mcp` (Vercel preview alias `oak-preview`, backed by the current branch) |
| OAuth metadata probe | `GET /.well-known/oauth-protected-resource` → `scopes_supported: ["email"]` (matches branch, confirms preview is no longer stale) |
| Auth fix status | Accepted by preview: 401 with `WWW-Authenticate: Bearer resource_metadata=...` on anonymous `POST /mcp` |
| Sentry project | `oak-national-academy/oak-open-curriculum-mcp` (region `de.sentry.io`, project id `4511206384795728`) |

## Session Release Tag

Local-trigger evidence uses `SENTRY_RELEASE_OVERRIDE` (precedence defined in
`packages/libs/sentry-node/src/config-resolution.ts`) so events are isolated
from the preview's `1.5.0` release:

| Purpose | Release tag |
| --- | --- |
| Sentry-on local trigger | `evidence-2026-04-16-http-mcp-sentry-validation` |
| Sentry-off kill-switch rehearsal | `evidence-2026-04-16-http-mcp-sentry-validation-KILLSWITCH` |

## 12-Item Claims Table

The parent plan at
`.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`
(§ "Manual and Deployment Proof") enumerates twelve manual/deployment claims.

| # | Claim | Status | Evidence source |
| --- | --- | --- | --- |
| 1 | One info log | **MET** | Remote smoke + local-dev bootstrap both emit `INFO`-level structured logs (`bootstrap.complete`, `Oak Curriculum MCP Server listening on port 3333`) with trace/span IDs attached on the live path. |
| 2 | One handled error | **MET** | Local trigger. Release `evidence-2026-04-16-http-mcp-sentry-validation`, title `EvidenceGenerationHandledError`, culprit `POST /mcp`. Captured via `observability.captureHandledError` from a temporary `__test_generate_errors` tool (removed in same commit). |
| 3 | One unhandled exception | **MET** | Local trigger, same release, title `EvidenceGenerationUnhandledError`, culprit `POST /mcp`. Thrown from the same tool; captured by the MCP server Sentry wrapper. A rejected-promise path is also present as `EvidenceGenerationRejectionError` for completeness. |
| 4 | One HTTP request showing route context plus outbound dependency tracing | **MET** | Preview baseline (release `1.5.0`): Sentry Explore for the preview shows `mcp.server`, `http.client`, and `bootstrap` spans with `culprit: POST /mcp` and outbound HTTP children. See Phase 4 MCP queries below. |
| 5 | One traced MCP call on the authoritative live path | **MET** | Same preview traces (`1.5.0`) — MCP transactions span `POST /mcp` → tool-level `mcp.server` spans, matching the wrapper instrumentation from `wrapMcpServerWithSentry()`. |
| 6 | Correct release tag | **MET** | Preview events tagged `release: 1.5.0` (auto-resolved from `APP_VERSION` / root `package.json`). Local-trigger events tagged with the session release tag above via `SENTRY_RELEASE_OVERRIDE`, demonstrating the override path. |
| 7 | Resolved source-map stack trace | **MET** | Source maps uploaded with `sentry sourcemap upload --release <tag> dist/` (2 artefacts). Live events resolve to `../src/__test-tools__/register-test-error-tool.ts` rather than `dist/index.js`. Script at `apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`, wired via `pnpm sourcemaps:upload`. Uses the modern `sentry` CLI (<https://cli.sentry.dev/>). |
| 8 | Alerting baseline wiring | **MET** | Rule `521866` on `oak-national-academy/oak-open-curriculum-mcp`: `status: active`, `projects: ["oak-open-curriculum-mcp"]`, `FirstSeenEventCondition` trigger, `SlackNotifyServiceAction` to `#sentry-alert-testing`. CLI-validated 2026-04-17 via `sentry api projects/.../rules/521866/` — see [`alerting-baseline-enumeration-note.md` § "Outcome (validated 2026-04-17)"](./alerting-baseline-enumeration-note.md). Rule is currently a smoke-testing shape; tightening it towards a production-grade signal (env/severity gating, frequency, channel) is tracked as a non-blocking follow-up in the `sentry-observability-expansion.plan.md` EXP-F lane, not as a gate on the wiring claim. |
| 9 | Kill-switch rehearsal (`SENTRY_MODE=off`) | **MET** | Same local build + test tool, restarted with `SENTRY_MODE=off` and release tag `evidence-2026-04-16-http-mcp-sentry-validation-KILLSWITCH`. All three error modes triggered; Sentry Explore returns zero events for that release. |
| 10 | MCP Insights populated with metadata only | **MET** | Preview traces populate MCP Insights (`mcp.server` spans with tool name, method, duration, status) with no JSON-RPC envelope content. Confirmed via `search_events` on the preview; event payloads contain only metadata. |
| 11 | Release-resolution source used by the shared builder | **MET** | Preview events show `release: 1.5.0` from the `root_package_json` source; local-trigger events show `release: evidence-2026-04-16-http-mcp-sentry-validation` from the `SENTRY_RELEASE_OVERRIDE` source. Both precedence branches in `resolveSentryRelease` are now demonstrated on live events. |
| 12 | Evidence hygiene notes confirming only scrubbed artefacts were stored | **MET** | No raw event exports, no tokens, no absolute user paths are committed in this bundle. All in-line quotes are brief textual snippets. Tokens on test events were additionally server-side scrubbed to `[REDACTED]` by Sentry. |

## Key Evidence Snippets

### Fresh preview pre-state

```text
GET https://curriculum-mcp-alpha.oaknational.dev/.well-known/oauth-protected-resource
→ 200 OK
{ "scopes_supported": ["email"], ... }
```

Matches branch state; stale `offline_access/openid/...` scopes from the
previous stale preview are gone.

### Remote smoke transcript (scrubbed)

Smoke-remote against `oak-preview` returned the expected auth-required
response surface (401 + `WWW-Authenticate`) plus handshake-reachable
`.well-known/*` metadata. Full transcript omitted from git tracking per
hygiene rule 2; safe conclusion is recorded here.

### Sentry MCP queries

All queries scoped to `oak-national-academy/oak-open-curriculum-mcp`.

- `find_releases` → contains `1.5.0` (auto-resolved on preview).
- `search_events dataset=spans query="release:1.5.0"` → `mcp.server`,
  `http.client`, and `bootstrap` spans present; attribute keys metadata-only.
- `search_events dataset=errors query="release:evidence-2026-04-16-http-mcp-sentry-validation"` →
  three events (`Handled`, `Unhandled`, `Rejection`), culprit `POST /mcp`,
  frames resolved to `../src/__test-tools__/register-test-error-tool.ts`.
- `search_events dataset=errors query="release:evidence-2026-04-16-http-mcp-sentry-validation-KILLSWITCH"` →
  zero results.

### Local-trigger test tool (temporary, now removed)

A short-lived MCP tool (`__test_generate_errors`) lived at
`apps/oak-curriculum-mcp-streamable-http/src/__test-tools__/register-test-error-tool.ts`.
It was gated behind `ENABLE_TEST_ERROR_TOOL=true`, only registered when that
flag was set, and was removed in the same closure commit. Its sole purpose
was to generate items 2, 3, and 9 deterministically under a session-specific
release tag.

### Source-map upload command (enduring)

```bash
pnpm build
RELEASE=<release-tag> pnpm sourcemaps:upload
```

Script: `apps/oak-curriculum-mcp-streamable-http/scripts/upload-sourcemaps.sh`.
Requires the modern `sentry` CLI to be installed and authenticated. CLI
defaults pinned to `oak-national-academy / oak-open-curriculum-mcp` and URL
`https://de.sentry.io` so the script cannot touch any other project.

### Kill-switch rehearsal

```bash
SENTRY_MODE=off \
SENTRY_RELEASE_OVERRIDE=evidence-2026-04-16-http-mcp-sentry-validation-KILLSWITCH \
ENABLE_TEST_ERROR_TOOL=true \
DANGEROUSLY_DISABLE_AUTH=true \
PORT=3333 pnpm start
```

All three error modes were triggered against the `KILLSWITCH` tag; Sentry
Explore returned zero events for that tag. Outbound Sentry delivery is
fully gated by `SENTRY_MODE`.

## Outstanding owner action

None. All 12 claims are MET as of 2026-04-17.

Item 8 closed when the owner created rule `521866` on
`oak-national-academy/oak-open-curriculum-mcp` and the next-session
CLI validation confirmed the alerting wiring is active and scoped to
the project. See
[`alerting-baseline-enumeration-note.md` § "Outcome (validated 2026-04-17)"](./alerting-baseline-enumeration-note.md).
The rule's current shape (no environment/severity gating, long
`frequency`, `#sentry-alert-testing` channel) is intentionally a
smoke-testing baseline; promoting it to a production-grade signal is
a non-blocking follow-up in the
`sentry-observability-expansion.plan.md` EXP-F lane.

## Hygiene Notes

- No raw event payloads, stack traces, tokens, cookies, or absolute user
  paths are stored in this directory.
- Sentry's server-side scrubbing additionally redacted the `EVIDENCE-*`
  tokens on the test events; the raw tokens are not retained anywhere in
  git.
- Source-map artefacts are uploaded to Sentry, not committed.
- The temporary `__test_generate_errors` tool is removed in the same commit
  that lands this bundle; `ENABLE_TEST_ERROR_TOOL` has no effect after that
  commit.
