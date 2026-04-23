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

## Plan Density Invariant

**No new plan in this directory lands without an existing plan
archiving in the same pass** until Wave 2 opens. The tree currently
carries 2 `active/` + 5 `current/` + 13 `future/` plans + 1
`archive/completed/` closure record + 10
explorations under `docs/explorations/`. Planning density has
materially outpaced execution density; the forward-motion risk is
another restructure rather than another emitter.

**Enforcement**: any author proposing a new plan in this directory
(including future/ strategic briefs) must name an existing plan that
closes in the same commit. If no such plan exists, the proposal is
rejected — the substance either lands in an existing plan's body or
goes to a napkin entry for later promotion.

**Scope clarification (2026-04-19)**: this invariant governs *plans*
in the observability directory tree. *Explorations* under
[`docs/explorations/`](../../../docs/explorations/) are governed by
the [explorations directory README](../../../docs/explorations/README.md);
explorations may land freely as their purpose is to weigh options
*before* committing plan capacity. The 2026-04-19 addition of
explorations 9 (warehouse selection) and 10 (Clerk-identity
downstream) is in scope of the explorations directory's lifecycle,
not this invariant.

**Exploration-density brake**: explorations have their own
lifecycle. A focused exploration brief older than 90 days with no
promotion trigger fired and no substantive body growth is reviewed
for closure (graduate to a plan or ADR, supersede with newer
evidence, or archive with rationale). Drift in exploration density
is a separate concern from plan density and is named here only to
flag that it is governed by a different rule, not by this
invariant.

**Exit condition**: rule lifts when
[`current/observability-events-workspace.plan.md`](./current/observability-events-workspace.plan.md)
moves from `current/` to `active/` (i.e. Wave 2 opens). At that
point the events workspace is being built, not planned, and the
ratio of execution-to-planning shifts.

**Rationale**: prevents the "perfect-planning trap" — planning work
substituting for forward motion. Pairs with the forward-motion
evidence artefact: plans propose; `what-the-system-emits-today.md`
observes.

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

---

## Explorations

Observability explorations live at
[`docs/explorations/`](../../../docs/explorations/). Each exploration is
dated and informs either an ADR or a specific plan.

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
