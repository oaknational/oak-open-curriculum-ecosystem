---
name: "Honest Restructure Over Band-aid"
polarity: pattern
use_this_when: "A quality gate fires mid-authoring and the first tempting fix is to bypass, guard, compress, or assert around the gate."
category: agent
status: emerging
discovered: 2026-05-22
proven_in: "2026-05-22 → 2026-05-23 multi-agent gate-1a substrate-floor team session — 2 cross-agent worked instances (Foamy graph-view module split; Sparking binding-test deletion per no-conditional-tests doctrine). Awaiting third-instance for status: proven promotion."
proven_date: 2026-05-23
adjacent: ".agent/rules/local-broken-code-never-leaves.md (the principle); .agent/rules/dont-break-build-without-fix-plan.md (the doctrine); both establish WHAT must hold — this pattern names the response shape WHEN those rules fire mid-authoring"
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Treating quality gates as friction to route around instead of design signals to absorb."
  stable: true
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat*, not a failure mode to avoid.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Honest Restructure Over Band-aid

When a quality-gate fires mid-authoring — `max-lines` on a growing
file, a `no-conditional-tests` violation on an external-resource
guard, a lint-rule signal at a real conceptual seam — the emergent
team response was **honest architectural restructure rather than
band-aid to pass the gate**. The cure is taking the gate's signal
seriously as a load-bearing design observation; the anti-pattern is
treating the gate as a friction-to-route-around.

## Pattern

**Shape**: when a quality-gate fires, the response is governed by the
question *"what is the gate's signal telling me about my design?"*
The gate's body is rarely arbitrary: `max-lines: 250` exists because
modules over that line-count typically carry two concerns;
`no-conditional-tests` exists because conditional execution hides
the test's actual behaviour-coverage shape from the maintainer;
`@typescript-eslint/consistent-type-assertions` exists because `as`
assertions silently widen types at points the compiler cannot
verify.

The honest response surfaces the underlying design pressure the gate
is signalling and resolves it structurally — module extraction,
test deletion-and-relocation, type-shape refactor — rather than
shrinking prose, adding a guard, or asserting away the constraint.

## Empirical worked instances (2026-05-22 → 2026-05-23 session)

**Instance 1 — Foamy on WS4.4 graph-view authoring (2026-05-22 22:03Z)**:

Sparking's t20 first commit attempt blocked at pre-commit on 8 ESLint
errors in Foamy's untracked `packages/core/graph-core/src/graph-view/index.ts`
— 4× `Array type using 'ReadonlyArray<T>'` (the workspace's
`@typescript-eslint/array-type` rule); 2× `Don't use 'object' as a
type` (the `no-restricted-types` rule); and crucially: `File has too
many lines (400). Maximum allowed is 250` at the `max-lines` rule.

**Band-aid response would have been**: compress the prose; collapse
type aliases; abbreviate TSDoc; aim to get under 250 lines while
keeping the same architectural shape.

**Honest restructure was**: split `graph-view/index.ts` into 3
modules:

- `graph-view/index.ts` (28 lines, barrel re-exports);
- `graph-view/types.ts` (~175 lines, type-level utilities);
- `graph-view/interface.ts` (~100 lines, `GraphView` interface + TSDoc).

The `max-lines: 250` signal exposed a real conceptual boundary the
single file was conflating. The split produced architecturally
better shape than band-aid would have — each module has its own
bounded concern + clean boundary. Per Foamy's broadcast at 22:03:34Z:
*"the module split + the explicit primitive-leaf union per
`no-type-shortcuts` is architectural-excellence work, not just a
lint-pass band-aid."*

**Instance 2 — Sparking on t13a binding-test (2026-05-22 22:47Z)**:

Sparking's freshness.ts cycle initially included
`eef-freshness-binding.unit.test.ts` — a live-binding test that
would activate when t2-zod-loader landed the data file at the SDK's
expected location. The test used `describe.runIf(...)` for file-
existence gating.

The test-expert pre-execution dispatch surfaced that the file
violated `no-conditional-tests.md` §Forbidden mechanisms (the
`describe.runIf` shape) and §Diagnosis #3 "External-resource gating"
(the file-existence guard pattern is the exact anti-pattern the rule
forbids).

**Band-aid response would have been**: refactor the guard to a
manual `it.skip` or `if (!fs.existsSync(...)) return` early-exit;
keep the test in this cycle's bundle.

**Honest restructure was**: **delete the binding test entirely from
gate-1a**; defer the live binding to t2-zod-loader's cycle (when the
data file actually lands + the typed loader path exists); amend the
plan §Phase G narrative to reflect the gate's two-phase activation
(*structurally active* via synthetic unit tests + *operationally
active* when t2 lands the data file via the typed loader).

The `no-conditional-tests` rule's signal exposed a real test-shape
mismatch — the binding test wanted runtime resources that didn't
exist yet, and the cleanest cure was to acknowledge the temporal
dependency in the plan + delete the premature test, not gate the
test around the resource.

## When to apply

- A quality-gate fires mid-authoring (lint rule, max-lines,
  no-conditional-tests, type-assertion rule, etc).
- The author's first instinct is to add a guard / compress prose /
  use `as` to satisfy the gate's literal complaint.
- The gate is one the repo cares about (in the `.husky/pre-commit`
  chain, not advisory-only).

**The honest-restructure question** to ask before reaching for the
band-aid: *"is the gate signalling a real design concern, or is it
arbitrary?"* If real (which it nearly always is in this repo's
gate set), the response is restructure. If genuinely arbitrary, the
gate itself is the bug — escalate to owner direction on rule
disposition, do not band-aid past it.

## Why this generalises beyond the two instances

Both worked instances share the same underlying structural reading:
the quality-gate's body encodes an architectural commitment, and
the failure-mode of "band-aid past the gate" is **rounding off the
architectural commitment under pressure**. The honest-restructure
response keeps the commitment intact by absorbing it into the
design rather than circumventing it.

This connects to the broader `eager-rounding-off-on-partial-structures`
pattern (`.agent/memory/active/patterns/eager-rounding-off-on-partial-structures.md`):
when pressure mounts, agents round off the disciplines they were
following — they treat the discipline as a friction to clear rather
than a substantive constraint that earned its place. The honest-
restructure pattern is the named cure: when a gate fires, ask what
discipline it encodes, then absorb that discipline into the design.

## Cost vs value

- **Cost**: honest restructure typically requires more design work
  than band-aid (Foamy's module split was substantially more thought
  than compressing prose; Sparking's binding-test deletion required
  a plan amendment + clear narrative on the two-phase activation).
  Estimate: 2-5× the time of the band-aid alternative.
- **Value**: the resulting design is structurally better in the
  ways the gate was guarding against. The improvement compounds
  across future cycles (the next contributor to graph-view files
  inherits the 3-module split's clarity; the t2 cycle author
  inherits an honest plan narrative about when the freshness gate
  becomes operationally active).
- **Net**: each honest-restructure earns its cost when the gate's
  underlying signal would have surfaced again later. In both worked
  instances, the band-aid would have re-fired or compounded at
  later cycles.

## Adjacent rules + patterns

- [`local-broken-code-never-leaves`](../../../rules/local-broken-code-never-leaves.md):
  the rule establishing that broken local state must be cured before
  push. This pattern is the response-shape when the cure has more
  than one viable path.
- [`dont-break-build-without-fix-plan`](../../../rules/dont-break-build-without-fix-plan.md):
  the doctrine that all quality gates are blocking always. This
  pattern is how to respond to the gates without paying the
  band-aid debt later.
- [`eager-rounding-off-on-partial-structures`](eager-rounding-off-on-partial-structures.md):
  the deeper failure-mode this pattern counters.

## Surface

This pattern emerges naturally when:

- The gate's signal is treated as informative rather than annoying;
- The author has authoring budget to absorb the restructure now
  rather than later;
- The team's discipline supports honest design conversation about
  whether to restructure (reviewer cadence + reciprocal-review +
  owner-direction surface all reinforce this).

## Graduation status

Captured for graduation in
[`pending-graduations.md`](../../operational/pending-graduations.md)
under the 2026-05-23 first-out closeout entry "Honest-restructure-
over-band-aid pattern confirmed across 2 agents in 2 cycles". Status
is `emerging` (n=2 cross-agent confirmation in single session);
promotion to `proven` awaits a third-instance observation in a
future session.
