---
name: sentry-evidence-closure
overview: Run the Sentry evidence pass on the authoritative fresh preview, assemble a scrubbed date-stamped bundle, and close the parent Sentry plan without touching the Codex follow-up lane or broader search-observability scope.
todos:
  - id: phase1-prestate
    content: Phase 1 — record fresh-preview pre-state proof (scopes_supported, healthz, commit SHA mapping) without edits.
    status: completed
  - id: phase2-remote-smoke
    content: Phase 2 — run pnpm smoke:remote against oak-preview and capture a scrubbed transcript.
    status: completed
  - id: phase3-generate-signal
    content: Phase 3 — exercise preview endpoints to produce info log, MCP success transaction, handled error, validation failure; evaluate whether an unhandled-exception path is reachable without code changes.
    status: completed
  - id: phase4-sentry-queries
    content: Phase 4 — use sentry-ooc-mcp to confirm release tag, issues, mcp.server transaction, redaction spot-checks, and source-map resolution state.
    status: completed
  - id: phase5-owner-gates
    content: Phase 5 — stop-and-ask on kill-switch rehearsal and alerting baseline before attempting either.
    status: in_progress
  - id: phase6-bundle
    content: Phase 6 — assemble the scrubbed evidence bundle under evidence/2026-04-16-http-mcp-sentry-validation/ with the 12-item claims table.
    status: completed
  - id: phase7-parent-plan-handoff
    content: Phase 7 — edit only the parent plan, session-continuation prompt, and napkin to reflect closure or narrowed-follow-up state.
    status: completed
  - id: phase8-gates-commit-boundary
    content: Phase 8 — run markdownlint:root + practice:fitness, then stop at the commit boundary for owner approval.
    status: completed
isProject: false
---

# HTTP MCP Sentry Validation Closure

## Context

- Parent authority: [sentry-otel-integration.execution.plan.md](.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md). Two parent todos remain: `sentry-credential-provisioning` (in progress) and `deployment-and-evidence` (pending).
- Authoritative preview (fresh, reflects rolled-back auth): `https://poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements.vercel.thenational.academy/mcp`. Connected in IDE as `oak-preview`.
- Sentry access: `sentry-ooc-mcp` — `oak-national-academy/oak-open-curriculum-mcp` on `de.sentry.io`.
- Expected release tag: `VERCEL_GIT_COMMIT_SHA` for the preview that built from `0f9245f5`.
- Evidence target directory: `.agent/plans/architecture-and-infrastructure/evidence/2026-04-16-http-mcp-sentry-validation/`. Hygiene rules in [evidence/README.md](.agent/plans/architecture-and-infrastructure/evidence/README.md) — scrubbed summaries only; no raw event exports, tokens, or secret-bearing URLs.

## Hard invariants (owner-stated)

- Preserve authority split: parent Sentry plan owns closure; Codex plan is follow-up only.
- No broader search-observability work unless explicitly MCP-server-confined.
- No speculative reopening of shared auth metadata.
- Full 12-item bundle is the target; stop-and-ask if any one item requires owner action (e.g. env var change, alert rule config, source-map upload automation).

## Evidence contract (12 items from parent Phase 4)

Full list: info log · handled error · unhandled exception · HTTP request + outbound dependency trace · MCP transaction on live path · correct release tag · resolved source-map stack trace · alerting baseline wiring · kill-switch rehearsal (`SENTRY_MODE=off`) · MCP Insights metadata-only · release-resolution source · evidence hygiene notes.

Classification I will produce before proof work starts:
- Agent-provable (likely 9 items): info log, handled error, HTTP trace, MCP transaction, release tag, release-resolution source, MCP Insights metadata-only, redaction proof, hygiene notes.
- Owner-gated (likely 2): kill-switch rehearsal (Vercel env toggle + redeploy), alerting baseline (Sentry project alert rules).
- Possibly follow-up (1): source-map stack trace — only agent-provable if a release has source maps uploaded; runbook notes CI automation is not yet wired. Triggering an unhandled exception may also require an owner-approved route.

I will stop and ask immediately when any proof item crosses the owner boundary rather than silently deferring.

## Sequence

### Phase 1 — Record pre-state (fresh-preview proof)

- Capture proof the preview reflects rolled-back source: `/healthz` response and `/.well-known/oauth-protected-resource` output (already observed this turn: `scopes_supported: ["email"]`).
- Record the deployed commit SHA by querying the preview or Vercel metadata; compare against `0f9245f5`.
- No code or plan edits.

### Phase 2 — Remote baseline validation

- Run from repo root:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http \
  smoke:remote --remote-base-url \
  https://poc-oak-open-curriculum-mcp-git-feat-otelsentryenhancements.vercel.thenational.academy/mcp
```

- Expected pass set from [smoke-assertions/index.ts](apps/oak-curriculum-mcp-streamable-http/smoke-tests/smoke-assertions/index.ts): health, accept-header, Clerk JWKS, initialise handshake, tool catalogue (≥ 28), validation failures, successful tool call, synonym canonicalisation.
- Capture scrubbed output excerpts for the evidence bundle.

### Phase 3 — Generate Sentry signal on the live path

Exercise the preview over the `oak-preview` MCP connection and/or `curl` to produce:

- Info log baseline (e.g. `/healthz` + one catalogue request).
- MCP success transaction: call one public tool (e.g. `get-changelog`) → expect native `mcp.server` transaction under `tools/call`.
- Handled error: call an authenticated tool without a bearer token → structured 401 / handled auth failure.
- Validation-failure path: call a tool with schema-invalid args → handled error captured.
- Unhandled exception path: before triggering, confirm which existing route actually throws under the current build. If none reliably throws without code changes, stop-and-ask rather than introduce a debug route on this branch.

### Phase 4 — Gather evidence via Sentry MCP

Using `sentry-ooc-mcp`:

- `find_releases` — confirm the release string used by the preview; compare to `VERCEL_GIT_COMMIT_SHA` and the `package.json` version per [vercel-environment-config.md](apps/oak-curriculum-mcp-streamable-http/docs/vercel-environment-config.md) resolution policy.
- `search_issues` + `search_issue_events` — confirm the handled error(s) and (if triggered) unhandled exception surfaced with correct grouping, release tag, and environment.
- `search_events` — confirm one `mcp.server` transaction exists for a tool call on the live path, with metadata-only capture (no arguments, no payload bodies) per the MCP metadata contract.
- Inspect one event's stack trace for source-map resolution. If stack frames are minified/unresolved, record it as a follow-up item and stop-and-ask about triggering source-map upload (per [sentry-deployment-runbook.md](docs/operations/sentry-deployment-runbook.md) Step 3 — automation not yet wired).
- Spot-check one breadcrumb / span attribute set for redaction compliance (no `authorization`, no `cookie`, no secret-bearing URL segments).

### Phase 5 — Owner-gated items (stop-and-ask)

Before proceeding, confirm with the owner:

- Kill-switch rehearsal: temporarily set `SENTRY_MODE=off` on the Vercel preview, redeploy, re-run Phase 3 probes, confirm zero outbound delivery in Sentry, then revert.
- Alerting baseline: whether Sentry project alert rules (new issue, spike, p95 latency) are already configured or need creation. If already configured, record scrubbed screenshots of rule titles only.

### Phase 6 — Assemble evidence bundle

Create `.agent/plans/architecture-and-infrastructure/evidence/2026-04-16-http-mcp-sentry-validation/`:

- `README.md` — claims table keyed to the 12 proof items, with evidence source per row (Sentry event ID excerpt, smoke test transcript excerpt, scrubbed dashboard note, or owner confirmation).
- `smoke-remote-transcript.txt` — scrubbed.
- `sentry-evidence-notes.md` — which Sentry MCP queries returned which claims; no raw event JSON.
- `release-resolution.md` — the precedence source that won for this preview.
- `redaction-checks.md` — the spot-checked event attribute keys with PASS/FAIL per the redaction contract.
- `hygiene.md` — confirms no raw payloads, tokens, or secret-bearing URLs were stored.

### Phase 7 — Close parent plan and handoff surfaces only

Edit exactly these files:

- [sentry-otel-integration.execution.plan.md](.agent/plans/architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md):
  - Flip `sentry-credential-provisioning` to `status: completed`.
  - Flip `deployment-and-evidence` to `status: completed` (or `status: in_progress` with narrowed follow-up if any proof item is owner-gated or deferred).
  - Update the "Road to Provably Working Sentry" table steps 4 and 5.
  - Update the 2026-04-16 execution snapshot and "Next steps" to reflect closure state.
- [session-continuation.prompt.md](.agent/prompts/session-continuation.prompt.md):
  - Rewrite the Live Continuity Contract `Current state`, `Current objective`, and `Next safe step` blocks to reflect whichever closure state was achieved.
  - Drop the stale-preview caveat; keep the Codex split invariant.
- `.agent/memory/active/napkin.md` — add one session entry for the validation pass (surprise/behaviour change format per [napkin skill](.agent/skills/napkin/SKILL.md)).

No other surfaces touched. Child plan `sentry-canonical-alignment.plan.md`, companion plans `sentry-observability-expansion.plan.md` / `search-observability.plan.md`, and the Codex follow-up plan remain unchanged.

### Phase 8 — Post-edit gates and commit boundary

- Run `pnpm markdownlint:root` over edited markdown.
- Run `pnpm practice:fitness` to confirm napkin stays within fitness bands (or rotate if it crosses the hard limit — rotation not expected this session).
- Do not run full `pnpm check` unless a markdown or plan edit introduces an unexpected gate signal, since no TypeScript or config code is changing.
- Stop before committing; surface the planned commit message(s) and diff summary for owner approval. Commits and pushes remain owner-authorised per session protocol.

## Risks

- **Source-map resolution may be absent**: runbook states CI upload is not yet automated. If observed, classify as follow-up, do not block closure.
- **Unhandled-exception trigger not available without code changes**: if I cannot find an existing path that reliably throws, stop and ask rather than add a debug route to this branch.
- **MCP metadata contract proof requires sampling**: I will spot-check rather than exhaustively; explicitly state this in the bundle.
- **Releases may share a version across preview builds**: per the Vercel metadata policy, the root `package.json` version is the authoritative release and may recur across commits. Record the `VERCEL_GIT_COMMIT_SHA` alongside the release string to keep the mapping unambiguous.

## Out of scope

- Any edits to `sentry-canonical-alignment.plan.md`, `sentry-observability-expansion.plan.md`, `search-observability.plan.md`, `codex-mcp-server-compatibility.plan.md`, collection READMEs or roadmaps.
- Code changes in any workspace. This is a pure evidence + documentation pass.
- Source-map upload automation (tracked under parent WS6 / `sentry-observability-expansion.plan.md` EXP-E).
- Any OAuth metadata experimentation.
