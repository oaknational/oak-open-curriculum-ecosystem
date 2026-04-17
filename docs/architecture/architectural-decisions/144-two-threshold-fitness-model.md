# ADR-144: Three-Zone Fitness Model

**Status**: Accepted
**Date**: 2026-04-17
**Supersedes**: ADR-144 (two-threshold model, 2026-04-01) — amended in place. Git
history preserves the prior revision.
**Related**: [ADR-131 (Self-Reinforcing Improvement Loop)](131-self-reinforcing-improvement-loop.md),
[ADR-119 (Agentic Engineering Practice)](119-agentic-engineering-practice.md),
[ADR-127 (Documentation as Foundational Infrastructure)](127-documentation-as-foundational-infrastructure.md),
[ADR-150 (Continuity Surfaces, Session Handoff, and Surprise Pipeline)](150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)

## Context

The original fitness system used a single `fitness_line_count` field per governed
document. That field inflated over time because agents could extend the ceiling
freely.

The two-threshold revision (this ADR, 2026-04-01) separated soft
(`fitness_line_target`) from hard (`fitness_line_limit`) thresholds. It fixed
the gaming problem but introduced a semantic cliff. In practice the binary
"warning vs blocking violation" model proved too coarse:

- A one-line overage above the hard limit triggered the same "blocking
  violation" response as a fifty-line overage. Agents could not distinguish
  "address at the next refinement" from "emergency, stop everything".
- Because "blocking" felt disproportionate for moderate overages, the live
  Practice drifted into teaching that fitness is advisory, not a blocking gate.
  `.agent/memory/napkin.md` (2026-04-16), `.agent/prompts/session-continuation.prompt.md`,
  and `.agent/memory/distilled.md` §Fitness Management all arrived at "limits
  are informational, not gates". The ADR said blocking; the Practice said
  advisory; three incompatible teachings lived in the repo simultaneously.
- The original framing treated the loop-failure case (content vastly
  exceeding the ceiling) as the same class of event as the routine case
  (moderate overage). But the loop-failure case is a diagnostic signal about
  the Practice itself per ADR-131 §The Self-Referential Property, not a
  routine file-management event.

The two-threshold model solved gaming but created the cliff. The three-zone
model replaces the cliff with a graduated scale.

## Decision

The model has four **zone labels** (`healthy`, `soft`, `hard`, `critical`) but
**three actionable zones** on top of the default healthy state. The name
"three-zone" refers to the graduated severity scale — _think about it_ → _do
something soon_ → _loop failure_ — that sits above `healthy`. Fitness results
land in one of the four zone labels per metric, derived from the declared
thresholds and a single global ratio.

| Zone       | Condition                                                    | Meaning                                          | Required response                                                                                                                |
| ---------- | ------------------------------------------------------------ | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| `healthy`  | count ≤ target (or ≤ hard limit where no target is declared) | Within design envelope                           | None                                                                                                                             |
| `soft`     | target < count ≤ hard limit                                  | Drifting; refinement opportunity                 | Consider refinement at the next natural boundary — consolidation, plan closure, or refactor touching the file. **Never blocks.** |
| `hard`     | hard limit < count ≤ hard limit × `CRITICAL_RATIO`           | Overweight; remediate before the next closure    | Remediate before closing the current consolidation cycle. Advisory at routine commit; **blocking at consolidation closure**.     |
| `critical` | count > hard limit × `CRITICAL_RATIO`                        | Loop failure — governance has not fired upstream | Stop routine work. Open a remediation lane. Conduct a loop-health post-mortem (see §Loop Health below). **Blocking always.**     |

`CRITICAL_RATIO` is declared once in the validator
(`scripts/validate-practice-fitness.mjs`) as a named constant. Its current
value is `1.5`. The ratio applies uniformly to `fitness_line_limit`,
`fitness_char_limit`, and `fitness_line_length`. No per-file
`fitness_*_critical` frontmatter field exists; if a file legitimately needs
divergent critical-zone behaviour, the correct response is to adjust its hard
limit, not to introduce per-file ratios. This choice follows
`.agent/directives/principles.md` §Strict ("do not invent optionality").

For metrics with only a hard ceiling (`fitness_char_limit`,
`fitness_line_length`), there is no `soft` zone — the metric is `healthy`,
`hard`, or `critical`. The overall zone for a file is the worst zone across
all its declared metrics.

### Exit code semantics

| Mode                     | Invoked via                                                                     | Exits 1 on           |
| ------------------------ | ------------------------------------------------------------------------------- | -------------------- |
| `--informational`        | `pnpm practice:fitness:informational`, `pnpm check`                             | Nothing (always 0)   |
| strict (default)         | `pnpm practice:fitness`                                                         | `critical`           |
| strict + `--strict-hard` | Consolidation closure gate (used by `consolidate-docs` step 8 when closing out) | `hard` or `critical` |

Routine work proceeds uninterrupted in `soft` and `hard` zones because the
actionable response there is "plan remediation", not "halt progress". `critical`
is always blocking because it signals that the earlier zones failed to elicit
the required remediation.

### Key Principles

1. **One scale, one vocabulary everywhere.** The four zone names (`healthy`,
   `soft`, `hard`, `critical`) are used verbatim in the validator output, in
   `.agent/commands/consolidate-docs.md`, in `.agent/memory/distilled.md`, in
   `.agent/prompts/session-continuation.prompt.md`, in the outgoing
   practice-context file, and in any future fitness-related surface. One
   concept = one name (`.agent/directives/principles.md` §Code Design).

2. **Hard limits and critical thresholds are constants, not formulas.** Hard
   limits are declared in frontmatter per file. The critical threshold is a
   single ratio applied globally. Neither grows with content.

3. **Reaching `hard` is routine; reaching `critical` is not.** The `hard`
   zone is the expected target of the refinement loop — files naturally drift
   there between consolidations. The `critical` zone is a diagnostic signal
   that the loop has failed upstream.

4. **`fitness_char_limit` and `fitness_line_length` are non-adjustable.**
   Only the user may change them, and only in exceptional circumstances.

5. **Fitness management does not block graduation.** Graduation checks
   stability and natural home; fitness management runs after graduation.

6. **No backward compatibility.** The two-threshold language ("warning",
   "blocking violation", "advisory, not a blocking gate", "informational, not
   gates") is retired in the same change. All live surfaces adopt the zone
   vocabulary. `.agent/directives/principles.md` §Refactoring: "NEVER create
   compatibility layers."

## Loop Health

Reaching `critical` is always a loop-health signal, not a routine state.
ADR-131 §The Self-Referential Property requires that the Practice's own
governance applies to itself: _"If rules about rule creation cannot be refined
through the same loop, the enforcement stage is exempt from its own governance."_

When a file reaches `critical`, the required response includes — in addition
to local remediation — a short post-mortem:

1. **Why did the earlier zones not fire?** Was `pnpm practice:fitness` run at
   the expected cadence (session handoff, consolidation closure)? If not,
   which cadence has degraded?
2. **Was the limit set incorrectly?** Is the `fitness_line_limit` (or
   `fitness_char_limit`) too low for the file's legitimate role, or has the
   file's role changed such that its natural size is now larger than its
   declared ceiling?
3. **Is the file a symptom of a missing graduation?** Content accumulation
   often signals that a governance home (ADR, governance doc, README) is
   missing for material that `.agent/memory/distilled.md` or the napkin has
   been holding.

The post-mortem is short by design — three questions, not a full session. Its
purpose is to surface loop-level failure modes before they re-emerge.

## Consequences

### Positive

- Graduated response matches graduated severity. The false dichotomy between
  "ignore" and "halt" is retired.
- Consistent vocabulary across every live surface. Agents learn one mental
  model.
- The `critical` zone names the loop-failure case as a distinct event, giving
  it the diagnostic treatment it requires instead of burying it inside
  "blocking violation" language.
- Routine commit flow is no longer interrupted by near-limit drift;
  consolidation closure still enforces.

### Negative

- One additional threshold (the `CRITICAL_RATIO` multiplier) must be
  internalised. It is a single global constant, not a per-file field, so the
  burden is small.
- Surface-consistency discipline is required: the zone vocabulary must appear
  verbatim on every live surface. `scripts/validate-fitness-vocabulary.mjs`
  (invoked via `pnpm practice:vocabulary`) scans live markdown and script
  surfaces for the retired two-threshold phrases and exits 1 if any appear
  outside permitted locations (this ADR itself, outgoing broadcast
  artefacts, archives, and experience files).

### Neutral

- Validator changes: a zone classifier, one new mode flag (`--strict-hard`),
  and updated output formatting. The existing exported surface
  (`evaluateFitnessFile`, `getExitCode`, `shouldInspectFitnessPath`) extends
  rather than being replaced.
- No renaming of frontmatter fields. `fitness_line_target`,
  `fitness_line_limit`, `fitness_char_limit`, and `fitness_line_length`
  retain their names.
- Existing file-level ratios (`fitness_line_limit` is ~1.3× `fitness_line_target`
  across most governed files) are unchanged. The new critical threshold is
  derived from `fitness_line_limit`, not from `fitness_line_target`.
