# Architecture and Infrastructure Roadmap

**Status**: Active M2 blocker execution, queued cross-app standardisation, and an agreed next hardening promotion after the current improvement tranche.
**Last Updated**: 2026-04-17
**Session Entry**: [../../prompts/session-continuation.prompt.md](../../prompts/session-continuation.prompt.md)

---

## Purpose

Provide the strategic sequence for this collection while keeping execution
detail in lifecycle lanes:

- `active/` — now
- `current/` — next
- `future/` — later
- `archive/completed/` — historical evidence

Lane indexes:

1. [active/README.md](active/README.md)
2. [current/README.md](current/README.md)
3. [future/README.md](future/README.md)

---

## Current State

- The Sentry + OpenTelemetry foundation remains the immediate M2 blocker in
  [active/sentry-otel-integration.execution.plan.md](active/sentry-otel-integration.execution.plan.md),
  but implementation is now complete in both in-scope runtimes. Remaining
  closure work is live validation: Vercel credential provisioning plus the
  deployment evidence bundle.
- Foundation closure is done (2026-04-17). The next in-branch implementation
  lane is the MCP-server-confined executable plan
  [`observability/active/sentry-observability-maximisation-mcp.plan.md`](../observability/active/sentry-observability-maximisation-mcp.plan.md)
  (strategic parent: [`observability/future/sentry-observability-maximisation.plan.md`](../observability/future/sentry-observability-maximisation.plan.md)),
  which supersedes the archived `sentry-observability-expansion.plan.md`.
  Observability plans moved to [`../observability/`](../observability/) on 2026-04-18
  per the
  [observability strategy restructure](current/observability-strategy-restructure.plan.md).
- Broader search observability work is tracked in
  [`observability/current/search-observability.plan.md`](../observability/current/search-observability.plan.md)
  and is deferred to the next branch — the Search CLI maximisation mirror
  opens on that branch after the MCP branch merges.
- Cross-app config standardisation and security dependency triage remain the
  next queued executable items in [current/README.md](current/README.md).
- A new strategic umbrella,
  [future/oak-surface-isolation-and-generic-foundation-programme.plan.md](future/oak-surface-isolation-and-generic-foundation-programme.plan.md),
  now defines the later programme for separating generic foundations from Oak
  leaves across all affected workspaces.
- [current/quality-gate-hardening.plan.md](current/quality-gate-hardening.plan.md)
  has been promoted to `current/` (2026-04-11) and is the explicit first
  candidate once the current improvement tranche is complete.
- The existing nested codegen plan,
  [codegen/future/sdk-codegen-workspace-decomposition.md](codegen/future/sdk-codegen-workspace-decomposition.md),
  remains the tranche-4 companion strategy rather than a parallel direction.

---

## Milestone Context

```text
Milestone 2: Open Public Alpha       🔄 NOW
Post-M2: Structural separation       📋 NEXT
Milestone 3: Pre-beta hardening      📋 LATER
```

For high-level milestone framing, see [../high-level-plan.md](../high-level-plan.md).
The quality gate hardening plan has been promoted to current (2026-04-11):
[current/quality-gate-hardening.plan.md](current/quality-gate-hardening.plan.md).

---

## Execution Order

```text
Phase 1: Sentry + OTel foundation                     🔄 active
Phase 2: Config + dependency standardisation          ⏳ current
Phase 3: Oak surface isolation programme              📋 future
  Tranche 1: platform/runtime foundations             📋 future
  Tranche 2: design system                            📋 future
  Tranche 3: tooling/governance                       📋 future
  Tranche 4: SDK/codegen                              📋 future
  Tranche 5: search                                   📋 future
  Tranche 6: app surfaces                             📋 future
Phase 4: Quality/operations hardening                 📋 future
```

---

## Phase Details

### Phase 1 — Production Operability Foundation

- Active source:
  [active/sentry-otel-integration.execution.plan.md](active/sentry-otel-integration.execution.plan.md)
- Companion prompt:
  [../../prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md](../../prompts/architecture-and-infrastructure/sentry-otel-foundation.prompt.md)
- Immediate next lane (same branch):
  [`observability/active/sentry-observability-maximisation-mcp.plan.md`](../observability/active/sentry-observability-maximisation-mcp.plan.md)
  — closes every Sentry product loop for the MCP app before PR.
- Strategic envelope parent:
  [`observability/future/sentry-observability-maximisation.plan.md`](../observability/future/sentry-observability-maximisation.plan.md)
- Done when:
  the HTTP MCP server has the full maximised observability surface (Phase 1–4
  of the MCP plan closed), the Search CLI maximisation mirror opens on its
  own branch, Vercel credential provisioning remains in place, and the
  active foundation lane closes cleanly

### Phase 2 — Cross-App Standardisation

- Next queue:
  [current/config-architecture-standardisation-plan.md](current/config-architecture-standardisation-plan.md)
- Supporting queue:
  [current/security-dependency-triage.plan.md](current/security-dependency-triage.plan.md)
- Done when:
  config and dependency hygiene no longer block later structural work

### Phase 3 — Oak Surface Isolation and Generic Foundations

- Strategic umbrella:
  [future/oak-surface-isolation-and-generic-foundation-programme.plan.md](future/oak-surface-isolation-and-generic-foundation-programme.plan.md)
- Companion strategic plan:
  [codegen/future/sdk-codegen-workspace-decomposition.md](codegen/future/sdk-codegen-workspace-decomposition.md)
- Done when:
  the mixed foundations have been split or neutralised by tranche, Oak
  workspaces are visibly thin leaves, and one-way dependency direction is
  enforceable

### Phase 4 — Quality and Operational Hardening

- Strategic umbrellas:
  - [current/quality-gate-hardening.plan.md](current/quality-gate-hardening.plan.md) (promoted 2026-04-11)
  - [future/test-suite-audit-and-triage.plan.md](future/test-suite-audit-and-triage.plan.md)
  - [future/observability-and-quality-metrics.plan.md](future/observability-and-quality-metrics.plan.md)
- Quality gate hardening (promoted to current/ 2026-04-11):
  [current/quality-gate-hardening.plan.md](current/quality-gate-hardening.plan.md)
- Historical alignment reference:
  [future/stdio-http-server-alignment.md](future/stdio-http-server-alignment.md)
- Done when:
  later-phase hardening work has replaced the current strategic backlog

---

## Related Documents

1. [README.md](README.md)
2. [future/README.md](future/README.md)
3. [active/README.md](active/README.md)
4. [current/README.md](current/README.md)
5. [../../prompts/session-continuation.prompt.md](../../prompts/session-continuation.prompt.md)
