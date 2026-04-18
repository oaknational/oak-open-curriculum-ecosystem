## 2026-04-18 — Practice structural observations: generalisation discipline, third genesis scenario, PDR-as-first-class question (commits 3466840a, 709e504c, fb20bc4a)

Continuation of 2026-04-18. After the observability reframe + Core
enhancements commit (3466840a), the session surfaced two further
structural observations that produced PDR-005, PDR-006, two new Active
Learned Principles, and a proposed PDR-007 on Core architecture.

**Structural observation 1 — wholesale transplantation is a distinct
third genesis scenario.** Owner has done this manually "a few times"
and consistently hits surprise-leftover / incomplete-transition /
contradiction failure modes. Root cause: the Core is file-level-
portable; the applied Practice sits on an unnamed portability
gradient. Transplantation forces the gradient to become explicit —
and without a vocabulary for it, the explicit-making happens by
eyeball and fails silently. Named the gradient (fully-portable /
portable-with-adaptation / hybrid / local); specified classification-
first process with four-audit close; landed as PDR-005.

**Structural observation 2 — the generalisation discipline was
operating implicitly throughout today.** User observation: "sometimes
an example or even a principle seems ecosystem specific, purely
because it has only been seen in that ecosystem and has not yet been
properly generalised." This parses as a meta-principle about the
knowledge flow's extraction step: the extraction has a depth
parameter that has never been named. Tested against today's three
pattern extractions — all three (findings-routing, planning-trigger,
compressed-labels) pass context-tests at higher abstraction layers
than pitched. Graduated as an Active Learned Principle ("generalise
where generalisation doesn't cost utility; test candidate forms
against three unrelated contexts"). First real use of the
explorations tier established earlier today — wrote
`docs/explorations/2026-04-18-depth-of-generalisation-in-pattern-extraction.md`
to weigh options for retroactive consolidation. Concluded Option C
(pointer annotations now, full consolidation at next pass).

**Structural observation 3 (emerged while auditing outgoing) —
PDRs may be first-class Core infrastructure, not a provisional
peer.** Observation: outgoing/ contains PDR-shaped topic notes
(explorations-documentation-tier, practice-decision-records-peer-
directory, three-dimension-fitness-functions) alongside genuine
ephemeral support material. Also contains pattern duplicates from
memory/patterns/. The three homes (memory/patterns, outgoing,
PDRs) have overlapping purposes, and the overlap generates drift.

Proposed resolution (pending PDR-007): collapse three homes to two.
`practice-core/decisions/` becomes first-class Core directory holding
all portable Practice-governance knowledge (current PDRs plus
governance-shaped cross-ecosystem patterns promoted in).
`memory/patterns/` holds repo-specific patterns only (technical,
ecosystem-specific). Outgoing sharpened to ephemeral support only —
any file in it that carries substance found nowhere else is a
defect.

PDRs currently have a uniform shape (Context/Decision/Rationale/
Consequences); pattern-shaped promotions would use a pattern-shaped
template body. Unified home, template-variant bodies. Would add a
`pdr_kind` frontmatter field (governance / pattern / constraint).

This is proposed as PDR-007 — not executed today. The restructure is
substantive and deserves authorship in a dedicated session. The
current state (3 homes) remains valid; the proposed state (2 homes)
is cleaner.

**Rate of structural change is high.** Three PDRs today (004, 005,
006); PDR-007 proposed. Two new Active Learned Principles.
Explorations tier established and used. Knowledge-flow depth
parameter named. This is a lot of Practice-layer change for one
session. At some point the right move will be to pause structural
evolution and consolidate — but the work keeps producing productive
structural questions, so continuing feels correct for now. Flag for
awareness next session: if structural-change rate doesn't slow, it
may warrant a deliberate pause-and-consolidate pass.

**Session commits (most recent first)**:

- `fb20bc4a` — PDR-005 (transplantation) + generalisation discipline
  + portability gradient Active Principles + exploration + pattern
  annotations.
- `709e504c` — PDR-006 (dev tooling per ecosystem).
- `3466840a` — Practice Core enhancements (Five Audiences,
  explorations tier, PDR-004, Active Principles, outgoing
  restructure, docs/architecture historical/).
- `b0a6f6ae` — Handoff + consolidation from observability reframe.
- `2319a614` — Session report + restructure plan (observability).
- `bdffc770` — Consolidation pass from L-0b close.
- `d08c6969` — L-0b redaction barrier conformance + reviewer
  register.

Branch is 8 commits ahead of remote; push pending owner instruction.

---

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
