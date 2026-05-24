---
name: Where the System State Is Observable at Plan-Author Time
polarity: pattern
category: planning
status: provisional
discovered: 2026-05-22
proven_in: "Single-arc origin: commit-queue-intent-scope-discipline plan (cycles 1.1, 1.2, 1.3). Metacognition pass at Cycle 1.3 surfaced that the inherited three-cycle decomposition (each describing an internal seam) was the load-bearing shape needing examination. Reshape produced workflow-seam invariants in a single test file and retired two scaffolding test files. Second-instance from a different plan/author would strengthen the pattern; current evidence is one author, one arc, ratified by owner correction *\"avoiding improving systems because it creates work in tests is a terrible trend — drive excellence, not avoid work\"*."
---

> **POLARITY: PATTERN.** This entry names a *shape to repeat at plan-author time*: a single diagnostic question that constrains test-shape decisions across every cycle in a multi-cycle plan.

# Where the System State Is Observable at Plan-Author Time

When planning a multi-cycle structural change, the first plan-author
question is **where the system state will be observable to a test**.
If the answer is "at one boundary" (the workflow seam, the public
API, the persisted record, the rendered output), every cycle's
tests should describe *that* boundary. Cycles that produce tests at
internal seams below the describing surface are scaffolding tests —
they exist for the implementer's confidence, not for the system's
durable description.

## The Question

> *Where will the system state this plan is moving toward be
> observable from a test, in the form it actually runs?*

Apply at plan-author time, before cycle decomposition is settled.
The answer is one of:

- **Workflow seam** (the public function or CLI entry that callers
  invoke).
- **Persisted record** (the file, database row, event-log entry the
  system writes when the state holds).
- **Rendered output** (the HTTP response body, CLI stdout, UI DOM
  state the user observes).
- **Effect on an external surface** (a downstream API call argued
  with the expected shape).

When the answer is one of these, the cycle decomposition has a
ratified constraint: **every cycle's tests describe the same
boundary**, even when the cycles' internal mechanics differ.

## The Anti-Shape (Scaffolding Tests)

Cycles produce scaffolding tests when their tests reach past the
workflow seam into the read mechanism, the helper function, the
intermediate object, or the assertion-on-argv. Diagnostic
signature:

- Test files named after internal seams (`commit-queue-record-staged-*`,
  `commit-queue-verify-staged-*`) rather than the workflow they
  describe.
- Fake/mock implementations re-implementing the seam's behaviour
  inside the test (argv parsing, response-shape mimicry).
- Assertions on argv strings, mock-call counts, or intermediate
  data shapes rather than on the system state the caller observes.

These tests are coupled to implementation choices. A future refactor
that changes the internal seam without changing the system state
breaks the scaffolding without removing user-observable behaviour.
That is the precise failure mode the test-strategy doctrine names
under §"NEVER create complex mocks" and §"Test real behaviour, not
implementation details" — but the anti-pattern fires *at plan-author
time*, before any test is written. Asking the describing-surface
question at plan-author time is the upstream cure.

## The Worked Instance

A three-cycle plan was originally decomposed:

- Cycle 1.1 — describe the record-staged read seam (scoped variant).
- Cycle 1.2 — describe the verify-staged read seam (scoped variant).
- Cycle 1.3 — describe the commit invocation (the workflow seam).

Cycle 1.3 metacognition pass surfaced: there is **one system state**
(commit honours the intent's file scope across peer staging drift),
and that state is observable at the workflow seam — `runCommitAndComplete`
called with a registered intent, observed via captured `runGitCommit`
arguments and a returned result. The three internal seams do not
each warrant their own describing surface; they are paths the
workflow walks through. Tests at the internal seams were
scaffolding the implementer's confidence, not describing the
system.

Reshape: Cycles 1.1 and 1.2 retained the read-seam product code
but dropped their scaffolding test files; Cycle 1.3 added workflow-
level invariants in a single test file using a capture-list pattern
on injected dependencies. Two test files deleted; one cycle of co-
designed test-and-product land at the right layer.

## How to Apply

At plan-author time, before drafting cycle acceptance criteria:

1. **State the describing surface.** One sentence: "The system state
   this plan moves toward is observable at <surface>."
2. **Tag each cycle's test boundary.** Every cycle's tests describe
   the same surface, even when internal mechanics differ.
3. **Surface any cycle that needs a different surface as a question.**
   If cycle N "needs to describe an internal seam" the question is
   whether the seam genuinely produces new observable state, or
   whether the cycle is asking for scaffolding. The default is the
   latter.
4. **Retire scaffolding tests at the end of the arc.** If
   intermediate cycles produce scaffolding tests, the closing cycle
   that lands the workflow-level test also retires them.

## Diagnostic Test

When reviewing a plan's cycle decomposition, ask: *would each
cycle's tests survive a refactor that changes the internal seam
without changing the observable workflow state?* If no, the tests
are scaffolding. If yes, they describe state.

## Cross-References

- `.agent/directives/tdd-as-design.md` §"One state, one describing
  surface" — foundational definition refined to name the
  describing-surface boundary explicitly.
- `.agent/directives/testing-strategy.md` §"Test real behaviour, not
  implementation details" + §"NEVER create complex mocks" — the
  downstream rules this pattern operationalises at plan-author time.
- [`patterns/passive-guidance-loses-to-artefact-gravity.md`](passive-guidance-loses-to-artefact-gravity.md) —
  upstream framing: at plan-author time the cure is mechanical
  (the question constrains the decomposition) rather than relying
  on test-shape vigilance during each cycle's authoring.
- `.agent/memory/operational/pending-graduations.md` 2026-05-22 —
  capture entry retained as audit trail.
