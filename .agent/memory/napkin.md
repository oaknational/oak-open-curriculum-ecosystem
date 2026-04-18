## Napkin rotation — 2026-04-18

Rotated at 557 lines after a dense two-day session window covering the
L-0b close, the reviewer-findings register discipline session, the
consolidation pass from that, and the observability strategy reframe.

Archived to `archive/napkin-2026-04-18.md`.

High-signal entries merged into `distilled.md` this rotation:

- **Compressed neutral labels smuggle scope and uncertainty** —
  generalises from "stretch" (2026-04-17) and "deferred" (2026-04-17
  and 2026-04-18 at two abstraction layers). Points at
  `patterns/findings-route-to-lane-or-rejection.md` (review layer) and
  `patterns/nothing-unplanned-without-a-promotion-trigger.md`
  (planning layer) as enforcement surfaces.
- **Nothing unplanned without a promotion trigger** — the planning-layer
  extension of the findings-routing pattern. Every `future/` plan
  carries a named, testable trigger.
- **Implicit architectural intent is not enforced principle** — naming
  is the upgrade path. Materialised when today's vendor-independence
  was lifted from "implied by ADR-078/143/154" into an ADR-162 clause
  with a conformance gate.

New patterns extracted this rotation window:

- `patterns/findings-route-to-lane-or-rejection.md` (2026-04-17) —
  review-layer no-smuggled-drops.
- `patterns/nothing-unplanned-without-a-promotion-trigger.md`
  (2026-04-18) — planning-layer no-smuggled-drops.

Annotations appended to existing patterns:

- `patterns/ground-before-framing.md` — `satisfies`-gate overclaim
  (second instance).
- `patterns/test-claim-assertion-parity.md` — `BYPASS_CANDIDATES`
  tautology (second instance).
- `patterns/findings-route-to-lane-or-rejection.md` — planning-layer
  observability-restructure application (second instance at a
  different abstraction layer).

ADRs landed in this window:

- ADR-160 (Non-Bypassable Redaction Barrier as Principle) Accepted.
- ADR-161 (Network-Free PR-Check CI Boundary) Accepted.
- ADR-143 §6 Superseded in part by ADR-160.
- ADR-162 (Observability-First with vendor-independence clause)
  scheduled as Phase 1 of the observability-strategy-restructure plan.

Explorations directory (`docs/explorations/`) established as a new
documentation tier between napkin and ADR. First entry is the
observability strategy session report at
`docs/explorations/2026-04-18-observability-strategy-and-restructure.md`.

Plan directory restructure pending: `.agent/plans/observability/`
comes in Phase 1 of the restructure plan.

Candidate doctrines that remain in the napkin stream pending
cross-session validation (watchlist):

- **MVP is a function of launch context** — single instance today.
  Generalises: launch commitment shape is the biggest MVP lever.
  Re-evaluate at next launch-scoping session.
- **Research as a first-class deliverable alongside code** — single
  instance today; validated by Sentry-as-PaaS framing. Re-evaluate
  when next exploration surfaces.
- **Deferred-preference beta-over-deprecating** (metrics.* over span-
  metrics) — single instance today. Re-evaluate when next deprecation
  signal arrives.
- **RED-by-new-file overstates TDD when implementation exists** —
  honest labelling as conformance harness. Single instance; watchlist.
- **ADR Open Questions close in the ADR, not in plan prose** —
  normative-decision-home rule. Single instance; watchlist.
- **Cloudflare-as-transport-security-layer** — layer-ownership
  principle. Single instance; watchlist.

Fitness state at rotation closure:

- `distilled.md` at ~275 lines after today's additions (soft zone,
  target 200, limit 275). Right at the limit; expect a pruning pass
  next consolidation. Three merged entries this rotation are
  load-bearing and pointer-shaped; no further compression obviously
  beneficial.
- Three foundational directives (`AGENT.md`, `principles.md`,
  `testing-strategy.md`) remain in known-deferred hard zone. No
  changes from this rotation.
- Napkin now starts fresh at this rotation-record entry.

Previous rotation: 2026-04-17 at 679 lines.

---
