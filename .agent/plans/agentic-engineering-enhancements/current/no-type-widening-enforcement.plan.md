---
title: "No type-widening: an active enforcement layer for the strict-typing doctrine"
status: current
lane: current
type: strategic
thread: agentic-engineering-enhancements
date: 2026-06-07
owner_scope: >-
  Strategic brief for an ACTIVE enforcement layer for the repo's existing
  no-type-widening doctrine. Authored by Hidden Prowling Owl (eef thread) and
  handed to the agentic-engineering-enhancements strand (Eclipsed Watching Veil /
  next strand agent), which owns the validators + eslint-plugin-standards surface.
  Captures the owner's standing directive, the feasibility analysis, and what has
  already landed this session so the strand does not re-derive it. Execution
  decisions are finalised at promotion to current/.
  PROMOTED to current/ 2026-06-07 (Briny Plumbing Beacon): owner collapsed the
  promotion gate ("do item 2 AND the no-type-widening rule; do not wait for the
  EEF lane"). WS1 is the immediate next step; its message is authored via the 2a
  `createMessage` helper (born teaching). The WS1 type-checker predicate
  (literal-union widening vs legitimate arbitrary-string collection) is designed
  test-first at WS1 start; precision gates warn → error.
---

# No type-widening: an active enforcement layer

## Problem and intent

The no-type-widening doctrine **already exists** and is strong:
`docs/governance/typescript-practice.md` §Compiler-time Types ("No type widening
or destruction"; "Preserve type information — no widening, ever"), enforced by the
always-on rule `.agent/rules/no-type-shortcuts.md`, grounded in ADR-034 and
ADR-038, with the constant-type-predicate pattern in ADR-153.

**The gap is not content — it is firing.** The doctrine is passive prose, and
under context pressure ("make this type error go away") it loses to artefact
gravity (`.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md`).

**Worked instance (this session, 2026-06-07).** Building the EEF c1 finite-domain
constants, the author wrote `new Set<string>(OBSERVED_PHASES)` and kept a
pre-existing `STRAND_IDS: ReadonlySet<string>` — both widen a literal-union type to
`string` so a `.has()` call type-checks. typescript-practice.md **already forbade
this AND carried the exact anti-pattern as a worked example** (`Set<string>(ALLOWED_COLORS).has(s)`),
and a `code-expert` review **rationalised** the widening as "legitimate pragmatic."
Only the owner caught it. The documented rule did not fire; a reviewer ratified the
violation. (The napkin archive shows the *same* `new Set<string>(array)` "fix"
recommended historically — a recurring smell, not a one-off.)

**Owner directive (STANDING, 2026-06-07):** type widening is NEVER allowed, only
narrowing. The type flow is `external input → validation → known types →
strictly typed system`; the **only** function that takes `unknown` is the boundary
validator, which narrows. ANY instance of widening is an **immediate
stop-and-reassess trigger**.

**Intent:** make type widening unable to land silently — caught by an active
mechanism (a firing tripwire and/or an automated check), not by reviewer luck.

## Already landed this session (do NOT re-derive)

- **Doctrine made uniformly strict.** `typescript-practice.md` now states the flow
  above + "no widening, ever; any widening = immediate stop-and-reassess".
- **The worked examples now show the zero-widening form.** The membership-test
  example in ADR-153 (and the same pattern in ADR-038 and ADR-028) uses
  `xs.some((x) => x === value)`; strictness holds at the lookup site exactly as
  everywhere else — a widened `readonly string[]` / `Set<string>` view of a
  literal-union value is forbidden.
- **Code is strict.** `graph-corpus-sdk/src/eef-strands/`: the divergence
  membership sets are `Set<DeclaredPhase>` (the exact query domain), and
  `isValidStrandKey` narrows `unknown` via `EEF_STRAND_IDS.some((id) => id === value)`
  (no `string`, no cast). 37/37 green, type-check + lint clean.

## End goal, mechanism, means

- **End goal** — a type widening (a literal-union type discarded to `string` /
  `string[]` / `Set<string>` to satisfy a lookup or annotation) cannot reach a
  green tree silently: it is flagged automatically, or a stop-and-reassess tripwire
  fires before it lands.
- **Mechanism (the feasibility verdict):**
  - A **general** "no type widening" lint rule is **impractical** — widening
    detection in the general case needs whole-program type-flow analysis, and the
    same construct (`Set<string>`) is legitimate for a genuine set of arbitrary
    strings but forbidden over a literal-union-derived array. (This matches the
    owner's own "might not be practical".)
  - A **targeted, type-aware custom ESLint rule** (in
    `@oaknational/eslint-plugin-standards`, using typescript-eslint's type
    information) for the **recurring smells** is **feasible** and high-value:
    flag a `string` / `readonly string[]` / `Set<string>` annotation or
    construction whose initializer's type is a *narrower* literal union derived
    from an `as const` source (the `new Set<string>(<literalUnionArray>)` and
    `const xs: readonly string[] = <asConstArray>` shapes). Steer authors to the
    zero-widening `.some((x) => x === value)` membership form.
  - The **behavioural stop-and-reassess tripwire** (already adopted this session;
    a concrete instance of the metacognition "Friction Is Rarely the Thing It
    First Looks Like" clause — widening to dodge a type error is the
    inflate-into-a-workaround reflex) is the immediate, zero-build layer.
- **Means (workstreams, finalised at promotion):**
  - **WS1 — targeted lint rule.** Design the AST + type-checker predicate that
    distinguishes literal-union widening from legitimate `string` collections;
    start at `warn` (per `feedback_new_eslint_rules_start_warn`), escalate to
    `error` once precision is established (below).
  - **WS2 — tripwire wiring.** Wire "type widening" as a named active interrupt;
    coordinate with
    [`action-time-structural-interrupt-design-space.plan.md`](action-time-structural-interrupt-design-space.plan.md)
    (shared tripwire infrastructure) rather than minting a parallel mechanism.

## Domain boundaries and non-goals

- NOT a general whole-program widening detector (impractical; YAGNI).
- NOT rewriting historical archives / napkins (knowledge-preservation; only live
  doctrine + new code).
- Does not re-open the doctrine itself (already owner-ratified + strengthened).

## Dependencies and sequencing

- `blocking`: the `@oaknational/eslint-plugin-standards` workspace and the
  validators surface — Eclipsed Watching Veil's active area; coordinate rather
  than collide.
- `beneficial`: `action-time-structural-interrupt-design-space.plan.md` (the
  tripwire infra). Minimum shippable without it: WS1 (the lint rule) alone still
  catches the recurring smells; the tripwire is the behavioural complement.

## Strategic acceptance criteria and success signals

- A `new Set<string>(<asConstArray>)` / `readonly string[] = <asConstArray>` smell
  is flagged automatically (warn → error) with a fix-suggestion toward
  `.some((x) => x === value)`.
- A future widening attempt produces a stop-and-reassess, not a silent landing.

## Risks and unknowns

- **The hard part:** distinguishing literal-union widening from legitimate
  arbitrary-`string` collections at the rule level. The rule must be tuned until
  its false-positive rate is low enough to enforce as `error` — precision is the
  gate on shipping WS1, and reaching it is the work, not an optional extra. If a
  precise predicate proves genuinely unreachable after real effort, that is a
  finding to surface to the owner, with evidence — never a reason to settle for a
  permanently-advisory rule.

## Promotion trigger into current/

Promote when the agentic-engineering strand has capacity AND the
eslint-plugin-standards / validators work is at a coordination point with
Eclipsed's lane (so the rule lands without colliding). Owner may direct sooner.

## References

- `docs/governance/typescript-practice.md` §Compiler-time Types (strengthened
  this session).
- ADR-034 (System Boundaries and Type Assertions), ADR-038 (Compilation-Time
  Revolution), ADR-153 (Constant-Type-Predicate Pattern — example made strict).
- `.agent/rules/no-type-shortcuts.md`, `.agent/rules/unknown-is-type-destruction.md`.
- `.agent/directives/metacognition.md` §"Friction Is Rarely the Thing It First
  Looks Like" + PDR-029 amendment (the friction-as-workaround connection).
- `.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md`.
