# Observability

Observability plans for the Oak Open Curriculum Ecosystem. The scope is
the **five-axis** observability principle per
[ADR-162](../../../docs/architecture/architectural-decisions/162-observability-first.md):
engineering, product, usability, accessibility, and security.

**Status**: 🔄 Active (post-2026-04-18 restructure; bounded
corrective lane archived complete 2026-04-23)
**Foundational ADR**: [ADR-162 Observability-First](../../../docs/architecture/architectural-decisions/162-observability-first.md)
(**Accepted** 2026-04-19 at Phase 5 close).
**Direction-setting session**: [`docs/explorations/2026-04-18-observability-strategy-and-restructure.md`](../../../docs/explorations/2026-04-18-observability-strategy-and-restructure.md)
**Execution plan**: [`architecture-and-infrastructure/current/observability-strategy-restructure.plan.md`](../architecture-and-infrastructure/current/observability-strategy-restructure.plan.md).
**High-level plan**: [`high-level-observability-plan.md`](./high-level-observability-plan.md).
**Forward-motion evidence**: [`what-the-system-emits-today.md`](./what-the-system-emits-today.md)
— externally verifiable snapshot of what actually emits in code today
per axis and per runtime. Updated at every lane close. Read this
first if the question is "are we really making progress."

---

## Parent Foundation

The Sentry + OpenTelemetry parent foundation plan remains at its
original home and is **not** moved:

- [`architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md`](../architecture-and-infrastructure/active/sentry-otel-integration.execution.plan.md)
  — foundation closure + credential/evidence authority for the shared
  Sentry + OTel primitives.

Observability plans in this directory build on that foundation.

---

## Lifecycle Index

| Lifecycle | Role | Index |
|---|---|---|
| [`active/`](./active/) | In-progress execution (NOW) | Plans currently being worked on this branch. |
| [`current/`](./current/) | Queued and ready (NEXT) | Plans ready to promote to `active/` when implementation starts. |
| [`future/`](./future/) | Strategic backlog (LATER) | Strategic briefs and post-MVP future plans with promotion triggers. |
| [`archive/completed/`](./archive/completed/) | Completed plans | Historical record; **never updated**. |
| [`archive/superseded/`](./archive/superseded/) | Replaced by newer plans | Historical record; **never updated**. |

---

## Five-Axis Coverage (per ADR-162)

| Axis | Primary signal | Owning plan |
|---|---|---|
| Engineering | Errors, performance, health | `active/sentry-observability-maximisation-mcp.plan.md` |
| Product | What is used, by whom, how | `current/search-observability.plan.md` + (Phase 2) `current/observability-events-workspace.plan.md` |
| Usability | Did the user succeed | `active/sentry-observability-maximisation-mcp.plan.md` (L-9, L-12 — both **deferred to public beta 2026-04-20**; L-9 pending user-facing feedback surface, L-12 pending host-compat evidence for agentic-client runtimes) + (Phase 2) widget-session-outcome emission |
| Accessibility | Preferences, frustration proxies, incomplete-flow correlation | (Phase 2) `current/accessibility-observability.plan.md` |
| Security | Trust-boundary events (auth failure, rate-limit triggered) | (Phase 2) `current/security-observability.plan.md` |

Transport / bot / DDoS observability is Cloudflare's layer, not this
application's — cross-reference
[ADR-158](../../../docs/architecture/architectural-decisions/158-multi-layer-security-and-rate-limiting.md).

---

## Restructure Phase Map

The five-phase restructure (owned by the execution plan above)
completed 2026-04-19 with all phases landed:

1. **Phase 1** ✅ — directory skeleton + ADR-162 Proposed + move five existing observability plans.
2. **Phase 2** ✅ — populated `high-level-observability-plan.md`, authored
   six MVP `current/` plans + eleven `future/` plans each with a named
   promotion trigger.
3. **Phase 3** ✅ — two full explorations + six focused briefs under
   [`docs/explorations/`](../../../docs/explorations/).
4. **Phase 4** ✅ — revised `active/sentry-observability-maximisation-mcp.plan.md`
   for MVP classification and the `metrics.*` priority swap.
5. **Phase 5** ✅ — ADR-162 flipped Proposed → Accepted; landed
   `require-observability-emission` ESLint rule at `warn`.

Execution now proceeds through the five-wave MVP ordering (see
[`high-level-observability-plan.md` §Execution Waves](./high-level-observability-plan.md#execution-waves--cross-plan-mvp-order)).
Wave 1 foundations remain in place: L-EH initial ✅, L-DOC initial ✅,
L-12-prereq ✅ (closed by primitives-consolidation 2026-04-19). The
bounded post-root-green corrective lane is now closed and archived at
[`archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`](./archive/completed/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md).
Manual preview `/healthz`, preview-release, preview-traffic, and
preview/Sentry evidence are owner-handled separately. Broader runtime
simplification is tracked separately in
[`future/mcp-http-runtime-canonicalisation.plan.md`](./future/mcp-http-runtime-canonicalisation.plan.md).
The focused local startup/release boundary follow-up is tracked in
[`current/mcp-local-startup-release-boundary.plan.md`](./current/mcp-local-startup-release-boundary.plan.md).

---

## Explorations

Observability explorations live at
[`docs/explorations/`](../../../docs/explorations/). Each exploration is
dated and informs either an ADR or a specific plan.

---

## Substrate plans (cross-axis infrastructure)

Per [`high-level-observability-plan.md` §Substrate](./high-level-observability-plan.md):

- [`archive/completed/fix-dev-boot-release-resolution.plan.md`](./archive/completed/fix-dev-boot-release-resolution.plan.md)
  — ✅ **COMPLETED** (Cycle 1 landed on `feat/eef_exploration`).
  `resolveDevelopmentRelease` falls through to a `local-dev`
  placeholder in development when both `VERCEL_BRANCH_URL` and
  `VERCEL_GIT_COMMIT_SHA` are absent; preview and production retain
  their hard-fail. `missing_git_sha` error kind and orphaned skipped/
  todo tests were deleted as part of the same landing.
- [`current/feat-eef-exploration-completion.plan.md`](./current/feat-eef-exploration-completion.plan.md)
  — 🟢 **CURRENT.** Unified seventeen-step linear plan to complete and
  merge `feat/eef_exploration`. Step 1 comprehensive sub-agent review;
  step 2 applies findings; step 3 integrates `no-speed-pressure` rule
  across the rule estate; steps 4–5 backfill reviewer dispatch on the
  four landed plan-3 commits; steps 6–11 cycle 2 per-workspace real-IO
  audits; steps 12–13 cycle 3 `no-real-io-in-tests` ESLint rule
  (author + wire to root); step 14 `pnpm check` green; step 15 dev
  boot + MCP tool exercise + clean shutdown; step 16 pre-merge
  divergence analysis; step 17 owner-gated merge readiness with
  release-readiness-reviewer synthesis. Supersedes two predecessor
  plans:
  [`archive/superseded/eef-branch-merge-readiness.plan.superseded-by-unified-2026-05-04.md`](./archive/superseded/eef-branch-merge-readiness.plan.superseded-by-unified-2026-05-04.md)
  and
  [`../architecture-and-infrastructure/archive/superseded/smoke-test-retirement-recovery-and-completion.plan.superseded-by-unified-2026-05-04.md`](../architecture-and-infrastructure/archive/superseded/smoke-test-retirement-recovery-and-completion.plan.superseded-by-unified-2026-05-04.md)
  whose verification work overlapped duplicatively.
- [`current/pr-93-sonar-quality-gate-resolution.plan.md`](./current/pr-93-sonar-quality-gate-resolution.plan.md)
  — 🟢 **CURRENT.** PR 93 Sonar resolution lane for unclaimed script/env
  findings, hotspot cleanup, and generated SDK duplication disposition.
  Generated/built SDK duplication is explicitly routed to the architecture
  codegen future plan and is not hand-fixed in PR 93.
- [`future/pr-93-sonar-oak-eslint-claim-overlap.plan.md`](./future/pr-93-sonar-oak-eslint-claim-overlap.plan.md)
  — 🔵 **FUTURE.** Claim-overlap follow-up for the remaining `oak-eslint`
  Sonar TODO-comment findings once Silvered Hiding Silhouette's paused
  claim is unpaused, closed, or explicitly coordinated.
- [`future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md`](./future/replace-sentry-mode-with-observability-sinks.plan.damaged-paused-2026-05-04.md)
  — 🛑 **DAMAGED — PAUSED — SUPERSEDED.** Multi-sink + fixture
  orthogonality rename (`SENTRY_MODE` → `OBSERVABILITY_SINKS` +
  `OBSERVABILITY_FIXTURES`). Owner-directed pause 2026-05-04: the
  rename concept is real future work but its current plan body has
  unnamed foundational tension; resumption requires naming the tension
  in a durable artefact (PDR or ADR amendment) and re-shaping the
  plan body. WS1 of the rename (commit `a3a0222a`) already landed —
  observability schemas + sink-registry types coexist with the legacy
  `SENTRY_MODE` consumer flow under the pause. ADR-171 (was cycle 2)
  and the READMEs/.env.example updates (was cycle 3) are deferred
  with the rename. Earlier supersession heritage:
  `observability-multi-sink-and-fixtures-shape.plan.md` (archived as
  superseded 2026-05-03) plus
  `archive/superseded/observability-config-coherence.plan.pre-orthogonal-axes-2026-05-02.md`
  and
  `archive/superseded/local-dev-sentry-boundary-regression-investigation.plan.pre-shape-fix-2026-05-02.md`.

---

## Related

- [`high-level-plan.md`](../high-level-plan.md) — repo-wide plan index.
- [`architecture-and-infrastructure/roadmap.md`](../architecture-and-infrastructure/roadmap.md)
  — wider architecture roadmap (the parent foundation plan is listed there).
- [ADR-143](../../../docs/architecture/architectural-decisions/143-coherent-structured-fan-out-for-observability.md)
  — structural sink-and-redaction architecture (companion to ADR-162).
- [ADR-160](../../../docs/architecture/architectural-decisions/160-non-bypassable-redaction-barrier-as-principle.md)
  — non-bypassable redaction barrier (every emission enumerated here passes
  through this barrier).
- [ADR-161](../../../docs/architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md)
  — network-free PR-check CI boundary (governs where vendor-CLI observability
  work may run).
