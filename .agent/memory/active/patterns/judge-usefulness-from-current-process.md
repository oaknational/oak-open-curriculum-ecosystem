---
name: "Judge Usefulness From the Current Process, Never From Existence, Usage History, or Provenance"
polarity: anti-pattern
use_this_when: "Asked whether a surface, rule, process, or artefact is useful — and reaching for usage history ('never instantiated', 'was retired'), the past decision that created it ('PDR-X defines it'), or mere existence, instead of present need."
category: process
proven_in: "tracks/ and workstreams/ retirement — 2026-06-19 owner correction (Sandpiper lifts Downdraft)."
proven_date: 2026-06-19
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Answering 'is X useful now?' with usage history, provenance, or existence — none of which is evidence of present need, so the keep/retire call is made on the wrong test."
  stable: true
---

> **POLARITY: ANTI-PATTERN.** The failure mode is testing usefulness with the
> wrong evidence. The cure is the first-principles present-need test below.
> See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# Judge Usefulness From the Current Process, Never From Existence, Usage History, or Provenance

## Principle

When the question is *"is this surface / rule / process useful?"*, three answers
arrive fluently and are all **wrong tests**:

- **Existence** — "it's here, so it must do something."
- **Usage history** — "it was never instantiated" / "it was retired once" / "it's
  used a lot."
- **Provenance** — "PDR-X defines it" / "the decision that created it said so."

None of these is evidence of *present need*. The owner's sharpening:
*"existence is not proof of usefulness, and past plans are certainly not evidence
of what current processes should exist… we are asking, are they useful **now**?"*

The only valid test is **first-principles against the current process: does this
surface / rule / process fill a need that nothing else already fills, now?**
Existence, usage history, and the authoring decision are all silent on that.

## Worked instance — 2026-06-19 (Sandpiper lifts Downdraft)

Asked whether `tracks/` and `workstreams/` were useful, the first answers reached
for usage ("never instantiated") and provenance ("PDR-011 defines tracks";
"PDR-027 retired workstreams"). The owner rejected the test. Applied correctly:
`tracks/` (ephemeral per-session coordination cards) fills no unique current need
— the harness task list + napkin + claims/comms/conversations already cover it;
`workstreams/` (a layer between thread and lane) fills none — thread records carry
`## Lanes` directly. Both retired on the present-need test, not on their history.

## Related

- `existence-is-not-correctness-default-replace` (per-user memory) — that names
  the disposition (inherited shapes get *replaced*, not softened); this adds the
  **evaluation method**: judge by present need from first principles.
- [`fluency-is-a-failure-vector`](fluency-is-a-failure-vector.md) — leaning on a
  usage or provenance fact is a fluent substitute for the first-principles check.
- [`re-evaluate-removal-conditions`](re-evaluate-removal-conditions.md) — the
  adjacent "check whether the reason to keep it still holds" discipline.
