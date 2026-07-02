---
name: "Bounded Structured Output for Workflow Fan-Outs"
polarity: pattern
use_this_when: "Authoring a Workflow script that uses agent({schema}) fan-out, passing args into it, or consuming its verify-stage results."
category: agent
proven_in: "Workflow runs 2026-06-11 → 2026-06-12: 45-retry unbounded findings[] collapse; args-delivery instant failure; 3-of-15 verifier deaths on a session limit"
proven_date: 2026-06-12
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Silently dropped findings from oversize structured emits, zero-agent workflow failures from unparsed args, and unverified claims treated as verified after partial verifier loss."
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: bound every
> workflow output by construction and treat fan-out results as sparse.

## The shape

- **Cap array fields.** An `agent({schema})` whose array field is
  unbounded can exceed the tool-call size limit on emit; the subagent
  then fails schema validation and retries (one observed run made 45
  attempts), succeeding only by collapsing to a single item and
  silently dropping the rest. Cap arrays (top-N), keep per-finding
  fields terse, or paginate. A captured or emitted result is
  trustworthy only when its shape was bounded by construction.
- **Keep schemas small and flat; chunk large emits.** A deeply nested
  schema (an array of many objects each with many required string
  fields) multiplies the chance of one malformed field → validation
  reject → retry → the StructuredOutput retry cap (5) exhausts and the
  agent fails with no output (observed 2026-06-29: a scorer burned 143k
  tokens to fail, while lighter-framed siblings on the same schema
  succeeded — the harder the prompt, the longer the emit, the likelier
  the near-miss). Chunk a large matrix into one agent per row (small
  schema each); prefer a free-text return + parse when the structure is
  large and the consumer can parse; loosen required→optional and give an
  example when a complex object is unavoidable.
- **Guard `args` at script top.** A JSON-object `args` can arrive
  unparsed and fail the script instantly (`pipeline() expects an
  array`, zero agents run). Working guard:
  `typeof args === 'string' ? JSON.parse(args) : args`, then accept
  either the array or `.items`, throwing loud if empty. Relaunching
  with `resumeFromRunId` replays the journal cleanly after the fix.
- **Treat verify-stage results as sparse.** Verifiers can die mid-run
  (observed: 3 of 15 adversarial verifiers killed by a provider
  session limit while the workflow completed normally). Use
  `.filter(Boolean)` semantics, and route claims whose verifier died
  to explicit first-hand re-adjudication — never assume full
  verification coverage from a completed workflow.
- **Mind the data-transport physics.** Data passed as `Workflow(args)`
  rides through the OPERATOR'S context (~120k tokens observed for a
  leaves-sized payload), and hand-inlined data competes with code for
  the 524,288-char script cap (compact-vs-pretty JSON was the
  difference between fitting and breaching it). The shape that works
  for large stage inputs: committed checkpoint JSONs → schema-validated
  at build → stage-projected → compact-inlined into the artefact by the
  build, with a stage discriminant so wrong-stage seeding is a
  zero-spend typed failure (PDR-122 invariant 5).
