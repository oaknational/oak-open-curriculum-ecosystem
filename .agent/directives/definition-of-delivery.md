---
fitness_line_target: 180
fitness_line_limit: 240
fitness_char_limit: 14000
fitness_line_length: 100
split_strategy: >-
  Grow worked beneficiary-chain examples and per-surface reachability
  recipes into docs/engineering/, not into this directive; this file
  holds only the foundational definition and the load-bearing criteria.
---

# Definition of Delivery

**Status**: Foundational directive (load-bearing for what every session,
plan, and gate treats as "done").
**Authority order**: this directive is authoritative on *what counts as
delivered*. It sits **above** the session/workflow surfaces
(`session-handoff`, `start-right-*`) and plan acceptance criteria for that
question; it **composes with** PDR-026 (per-session landing) and
`tdd-as-design.md` Corollary 3; it sits **below** `principles.md` for any
repository-wide rule.

## Foundational Definition

> Delivery is measured by **value received by a named beneficiary**, not by
> artefacts produced. "Done" is a producer word — *I finished my task*.
> "Delivered" is a beneficiary word — *someone received value they can use*.
> They are different questions, and the gap between them is where work goes
> to die: commits merge, a PR opens, a plan todo is checked, a gate goes
> green — and value reaches no one.

This is the load-bearing definition. Every criterion below derives from it.
PDR-026 named the same failure at the session scale ("activity mistaken for
progress"); this directive generalises it from the *session* unit to the
*beneficiary-received* unit.

## The Six Criteria

A thing is **delivered** only when ALL of these hold. Missing any one means
it is *in progress*, not delivered.

1. **Named beneficiary.** A specific consumer: an **end user**, a
   **developer-human**, or a **developer-agent** (an LLM or automation that
   consumes the surface). Anonymous "delivery" is the failure mode — force
   the naming.
2. **Real value, integrity intact.** The beneficiary can now do something
   they could not, or do it better/more safely — *and the value is the
   genuine article*. Correctness, preserved caveats, and being **within the
   consumer's budget** are *part of* the value, not a separable "quality"
   concern. A surface that returns data the consumer cannot use has not
   delivered value.
3. **Reachable in the beneficiary's real environment.** For an **end user**:
   whole and reachable in **production** (on `main`, which deploys). For a
   **developer/agent**: consumable in the estate they build in — a published,
   importable workspace package (`@oaknational/*`), discoverable and
   documented. Not on a branch, not orphaned, not behind an unreachable seam.
4. **Whole for its unit.** The increment is functional end-to-end for that
   beneficiary. A *reachable* non-functional fragment is a **defect**, not a
   partial delivery. Interdependent surfaces (e.g. a prompt and the tool it
   calls) are one unit; they deliver together or not at all.
5. **Observable signal of receipt.** Falsifiable evidence the beneficiary
   *can* get the value: a completable user journey, an integration/E2E test
   on the *real* path, an importable-and-exercised surface, or telemetry
   (per ADR-162). The boundary: delivery requires *can-receive* evidence —
   **not** *did-receive-at-scale* proof. Adoption is a later, separate signal;
   requiring it would make delivery undeclarable.
6. **No regression of others' value.** Delivering to one beneficiary must not
   subtract value already delivered to another; the change is operable and
   reversible where it touches shared surfaces.

## Delivery States: LANDED vs RELEASED

Beneficiary class splits delivery into two honest states:

- **LANDED** — delivered to **developers/agents**: consumable in the dev
  estate, integration-safe. May be gated **OFF** for end users.
- **RELEASED** — delivered to **end users**: whole and reachable in
  production, gate **ON**.

A **feature flag is the legitimate seam** between them. It lets
developer-value LAND on `main` (integration-safe, tested) without *falsely*
claiming end-user delivery. PDR-026's "landing" is the session-scoped
instance of LANDED; RELEASED is a distinct, later step. LANDED-only is a
valid, honest resting state — it is not half a delivery, it is a full
delivery to a different beneficiary.

## Delivery Chains: Fail at the Weakest Hop

Value often passes through intermediate consumers before reaching the end
user — e.g. **tool → agent → end user**. Each hop must receive *usable*
value; **delivery fails at the weakest hop.**

Worked example (the failure this directive was written from): an MCP tool
that returned its whole evidence graph (~16k tokens) failed the **agent**
hop — the orchestrating model, the tool's immediate consumer, could not
ingest the response within its context budget. Because the agent hop failed,
value could never reach the teacher. The tool produced an artefact; it
delivered to no one. A within-budget, selected, projected response is what
makes the agent hop succeed — which is why budget and selection are *part of
the value* (criterion 2), not optimisations.

## The Not-Delivery List (pointed, on purpose)

None of the following is delivery. Each is necessary scaffolding or a
producer milestone; naming the impostors is half the value of this doctrine:

- **Merged code** is not delivery.
- **A green gate** is not delivery.
- **An open PR** is not delivery.
- **A checked plan todo** is not delivery.
- **Code on a branch** is not delivery.
- **A registered-but-orphaned surface** (a prompt whose tool does not exist;
  a tool with no consumer) is not delivery — it is a defect.

## Relationship to Existing Doctrine

- **PDR-026 (Per-Session Landing Commitment)** — the session-scoped instance.
  PDR-026 governs what a *session* commits to land; this directive governs
  what it means for *value to have been received* by a beneficiary. Its
  §Landing target definition is the LANDED state at the session boundary.
- **`tdd-as-design.md` Corollary 3** — "a unit test is never enough to show
  that value is delivered." This directive is the delivery-side mirror of
  that testing-side claim: the observable signal of receipt (criterion 5) is
  the higher-scale test proving value flow.
- **PDR-085** — the portable Practice-Core mirror of this directive.

## What This Directive Is Not

- **It is not a quality checklist.** Quality (correctness, caveats, budget)
  is folded into criterion 2 because it is *part of the value*, not a parallel
  concern. The directive defines delivery; it does not enumerate gates.
- **It is not negotiable per session.** A foundational definition does not
  bend under closure or deadline pressure. "This case is special" applies to
  the work, never to the definition of whether the work was delivered.
- **It is not a release process.** The LANDED/RELEASED states name *what*
  each delivery state is; the mechanics of flipping a flag live in the
  relevant plan and runbook.

## Cross-References

- `practice-core/decision-records/PDR-085-definition-of-delivery.md` —
  portable mirror.
- `practice-core/decision-records/PDR-026-per-session-landing-commitment.md` — session landing.
- `tdd-as-design.md` §Three Corollaries — the value-flow corollary.
- `principles.md` — repository-wide rules (authoritative above this directive).
- The first application: the EEF gate-1a delivery plan (see the
  `sector-engagement/eef/` plan collection) rebuilds its acceptance criteria
  around these states and criteria.
