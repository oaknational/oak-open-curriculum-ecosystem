# Component: TDD Cycles

TDD is structured as **cycles**, not phases. Each cycle is a single
landing unit (one commit) that contains a failing test, the product
code that makes it pass, and any refactor of that code with the test
as its safety net. Tests and product code travel together. A
workstream is a sequence of cycles; a delivery is a sequence of
workstreams.

This applies at every level — unit, integration, E2E — and across
levels where a higher-level test requires several lower-level cycles
before it can be greened.

## The cycle (Red → Green → Refactor, in one commit)

**Red.** Write a test that specifies the next slice of behaviour.
Run it. It MUST fail. If it passes, the test is wrong — it is not
testing what you think.

**Green.** Write the minimal product code that makes the test pass.
No more. No less. Do not optimise. Do not add features the test does
not require.

**Refactor.** Improve the product code without changing behaviour.
Extract helpers, rename for clarity, add TSDoc, clean up imports.
The test stays green.

**Land it.** Commit the test, the product code, and the refactor as
one unit. The tree is green at the end of the commit.

If the cycle cannot be completed in a single landing — typically
because the slice of behaviour is too big — split it. Identify the
smaller pieces of behaviour the slice composes, write each as its
own cycle. The split is always possible; "too big to land in one
commit" is a slicing problem, not a TDD problem.

## Cycles at multiple levels

Every test level has its own cycle pattern:

- **Unit cycle**: a unit test + the pure function that makes it pass.
- **Integration cycle**: an integration test + the wiring/composition
  that makes it pass.
- **E2E cycle**: an E2E test + the product change that makes the
  running system pass it.

Higher-level tests describe broader behaviour. They typically
require multiple lower-level cycles to be in place before they can
be greened. The discipline:

1. Decide what the higher-level test will assert.
2. Identify the lower-level pieces it needs.
3. Land each piece as its own test+code cycle (each commit greens
   that cycle's test, no test left failing or skipped).
4. Land the higher-level test + the final wiring in one commit; the
   higher-level test goes green at the same moment its supporting
   pieces are complete.

The higher-level test is **not** written ahead of its supporting
pieces and left failing or skipped across multiple commits. That
shape — test-commit-ahead-of-code-commit, or test-skipped-pending-
later-unskip — is a violation of testing-strategy.md (see
"No skipped tests" and "TDD = test + product code as PAIRS").

## Atomic, independent cycles for parallel dispatch

Beyond being one commit each, cycles should be made independent
of each other where the work shape allows. Two cycles are
independent when completing one does not change what the other
does or how it is verified. In practice each independent cycle:

- Touches a separate file scope, OR overlaps with another cycle
  only in additive ways (no mutual edits to the same lines)
- Declares its starting state (typically: "branch HEAD at time
  of dispatch")
- Has executable acceptance criteria another agent can verify
  without reading the rest of the plan
- Carries a self-contained brief — no "ask the original author"
  dependencies; the cycle description is enough for any agent
  to pick it up and complete it

Independent cycles can be dispatched to parallel agents:

1. The orchestrator (or any agent that reaches the cycle) hands
   the cycle's brief to a worker.
2. The worker writes the test + product code + commits the
   single landing.
3. The orchestrator integrates the worker's commit on the next
   pull, runs gates, and continues.

Where cycles genuinely depend on each other — typically when a
higher-level test needs lower-level cycles in place first, or
when one cycle introduces an interface another cycle consumes —
declare the dependency explicitly in the cycle description.
Optionally add a `depends_on:` field to the YAML todo listing the
prerequisite cycle ids. Dependent cycles are queued behind their
prerequisites; they are not dispatched until the prerequisite
has landed.

The plan-author discipline: do not invent serial dependencies
that the work shape does not require. Pick the natural
decomposition the cycles already suggest — separate workspaces,
separate modules, separate features. Where natural decomposition
yields independent cycles, the cycles ARE parallel-safe; mark
them so the orchestrator can dispatch them concurrently. A
delivery is one commit per cycle, sequenced or parallel as the
dependency graph dictates; what cannot happen is a cycle landing
in two pieces.

## Both levels are required

A system without high-level tests does not prove it delivers value
end-to-end. A system without low-level tests is hard to debug when
high-level tests fail and gives slow feedback. Every workstream
ships tests at every level the change touches.

## Deterministic validation

Every cycle's acceptance includes shell commands with expected
outputs:

```bash
# Cycle's own test passes
pnpm test --filter @oaknational/curriculum-sdk
# Expected: exit 0, all tests pass (including the new one)

# Whole tree is green
pnpm test
# Expected: exit 0, no skipped tests, no failing tests
```

Every cycle ends in a green tree. No cycle leaves a failing or
skipped test behind for "later".
