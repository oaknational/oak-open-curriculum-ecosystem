---
name: Inherited Framing Without First-Principles Check
use_this_when: About to execute a plan body, rewrite an existing artefact, or translate an "old X to new X" — before writing code, tests, or doctrine, check whether the inherited shape is the right shape for the behaviour being proven
category: process
proven_in: .agent/memory/active/napkin.md (six instances, 2026-04-20/21)
proven_date: 2026-04-21
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Executing a plan's literal shape, non-goal, assertion-kind, file naming, or vendor-API literal without asking whether the artefact in front of the agent actually fits first principles — the artefact's gravity overrides the check"
  stable: true
---

## Principle

When a plan, spec, or existing artefact prescribes a shape — a test
shape, an assertion kind, a non-goal, a file name, a vendor-API
literal — the shape itself is inherited. The agent's default mode
is to execute it faithfully. That default is the failure mode. The
correct default is to run a **first-principles check** on the shape
before executing it. The artefact in front of the agent outweighs
a first-principles check by default; the pattern names the failure
mode so the check can be installed as a tripwire that fires on
shape-entry.

## The Three-Clause First-Principles Check

Run all three clauses before authoring tests, implementation, or
doctrine prescribed by a plan body. Any clause that fails must be
surfaced to the owner before code or doctrine is written.

1. **Shape clause.** Is the test-shape (or implementation-shape,
   or doctrine-shape) right for the **Oak-authored behaviour**
   being proven, or is it a vendor / configuration / framework
   assertion in disguise? If the shape proves "the vendor did its
   job" or "the config is set", the shape is wrong.
2. **Landing-path clause.** Does the file naming carry a tooling
   contract (pre-commit hook, CI gate inclusion/exclusion, lint
   config, test-runner include pattern) that constrains how or
   when this artefact can land? Silent mismatches produce dead
   tests, bypassed gates, or "lands-but-never-fires" artefacts.
3. **Vendor-literal clause.** Does any literal token taken from
   the plan body (especially vendor API values, config keys,
   package-export names, file paths) match the current upstream
   surface, or is it a doc-level word the plan borrowed? Plan
   prose drifts from vendor reality between plan-write and
   plan-execute.

## Instances

Six instances observed in the 2026-04-20 and 2026-04-21 sessions,
paired against the clause each instance invalidated.

### 2026-04-20 (same session, three instances)

1. **Instance 1 — tsup-retention non-goal inherited from prior
   plan draft.** Plan body carried a non-goal presupposing tsup
   would remain alongside esbuild; the owner's three-day-standing
   decision was esbuild-only. Agent executed the inherited
   non-goal without checking whether it still matched owner
   direction. (Clause 1, shape: the non-goal framed the problem
   wrongly.) Caught by owner; plan sanitised at commit `363037af`.
2. **Instance 2 — agent talked itself out of the owner's
   three-day-standing esbuild decision.** During re-planning the
   agent rationalised retaining tsup despite the owner's explicit
   prior call. (Clause 1, shape: inherited the "keep both"
   framing from the plan draft rather than re-deriving from
   owner direction.) Caught by owner.
3. **Instance 3 — probe assertion-kind translated forward
   without first-principles check.** Porting a health-probe from
   the legacy continuation prompt to `repo-continuity.md`
   preserved the *kind* of assertion the old code made ("these
   specific section headings must exist") — a configuration
   assertion, not a behaviour assertion. (Clause 1, shape: the
   assertion kind was wrong for a test-strategy-aligned probe.)
   Caught by owner mid-flight.

### 2026-04-21 (2026-04-21 session, three further instances)

4. **Instance 4 — §L-8 WS1 three-test spec asserted vendor /
   configuration behaviour, not Oak-authored behaviour.** The
   plan prescribed three integration tests at the build-config
   boundary; the Oak-authored logic worth testing was a single
   env-to-plugin-config translator. The three-test shape
   proved "the vendor did its job" not "Oak's translator is
   correct". (Clause 1, shape.) Caught in-flight during
   reading-the-spec-against-testing-strategy; no code written.
   Subsequent mitigation — invent a `buildMcpAppEsbuildOptions`
   wrapper with injected fake plugin factory — was itself the
   "complex test setup signals architectural problem" trap; the
   first-principles check prevented the second mistake too.
5. **Instance 5 — missed the documented RED file-naming
   directive.** Plan prescribed `*.integration.test.ts` files
   but the repo's quality-gate contract (ESLint, CI includes,
   pre-commit) carried a constraint the agent had not read
   before authoring the test files. (Clause 2, landing-path.)
   The file naming the plan asked for would have landed without
   firing in the intended gate.
6. **Instance 6 — trusted a plan-body vendor-API literal
   without checking the vendor's current surface.** Plan
   mentioned a Sentry-related export/config key lifted from
   earlier prose; the live vendor surface had moved. (Clause 3,
   vendor-literal.) The literal was doc-level, not code-level.

Instances 4, 5, 6 were caught by external friction mechanisms
(owner in-flight review, reading spec against directive, cross-
checking vendor docs) rather than by a pre-installed tripwire —
which is itself the symptom naming the
`passive-guidance-loses-to-artefact-gravity` pattern (see
[`passive-guidance-loses-to-artefact-gravity.md`](passive-guidance-loses-to-artefact-gravity.md)).

## Anti-pattern

Executing a plan's prescribed shape faithfully because it is
written down. "The plan says do X, so I will do X" — without
asking whether X is the right shape for the behaviour being
proven. This is the artefact's gravity overriding a first-
principles check.

The failure mode is particularly strong when:

- The plan was authored by a prior agent session and the current
  agent inherits it at session start without a ratification step.
- The prescribed shape uses familiar vocabulary (TDD,
  integration test, non-goal) so it reads as legitimate on
  surface scan.
- The artefact is "mechanical translation" of something older —
  file-rename, library-swap, probe-port, test-kind carry-over.

## Countermeasure

Install the three-clause check as a **Family-A tripwire** that
fires at shape-entry, not at post-hoc review. The Family-A
tripwire layers are documented in the Perturbation-Mechanism
Bundle PDR candidate (drafted in Session 3 of the staged
doctrine-consolidation plan; landing date TBD).

The first installed tripwire is:

- **Always-applied rule** at
  [`.agent/rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md)
  (authored in Session 1 Task 1.4 of the staged plan; front-
  loaded to cover Sessions 2–3 before the full bundle lands).

Further Family-A tripwires (target: at least two complementary
layers so no single failure mode fully exposes the agent) land
in Session 4 of the staged plan — e.g. a standing-decision
register surface file read explicitly by `start-right-quick`
and `start-right-thorough`, and a per-session-open metacognition
prompt that asks the inherited-framing question by name.

## Forward References

- **[`.agent/rules/plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md)** —
  the first installed Family-A tripwire that cites this pattern.
- **Perturbation-Mechanism Bundle PDR** — [PDR-029](../../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md)
  (landed Session 3, 2026-04-21; amended twice 2026-04-21).
  Retroactively governs this pattern and the Family-A tripwire
  rule; names Class A.1 (plan-body inherited-framing) and the
  required layers.
- **Session 4 Family-A installation** — landed 2026-04-21.
  Class A.1 Layer 1 (this pattern's plan-body rule) was already
  in place from Session 1; Class A.1 Layer 2 is the existing
  foundation-directive grounding (per PDR-029's second
  2026-04-21 Amendment Log entry retracting the
  "standing-decision register surface" prescription).
- **Related pattern**: [`passive-guidance-loses-to-artefact-gravity.md`](passive-guidance-loses-to-artefact-gravity.md) —
  why passive guidance alone (documented-but-not-enforced) is
  insufficient when the artefact's gravity is strong.
