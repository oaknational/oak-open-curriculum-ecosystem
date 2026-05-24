---
name: Fabricated Gate as Avoidance
polarity: anti-pattern
use_this_when: A pending-graduation entry, plan slice, or queued artefact is classified as deferred under gate-shaped vocabulary (`size: XL`, `vaporware-gated`, `sequenced-deferral pointer`, `N>=3-validation`, `dedicated-session-required`) — check whether the gate is a real epistemic / dependency / capacity constraint or a fabricated escape hatch the substance does not require
category: agent
proven_in: .agent/memory/operational/pending-graduations.md (7 due items classified as DEFER-DEDICATED-SESSION or HELD-PLAN-GATED before owner correction, 2026-05-10)
proven_date: 2026-05-10
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Self-reinforcing accumulation of substance-ready doctrine in pending registers because the deferral language on each entry is read as authoritative scheduling discipline rather than as the avoidance signal it has become"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** This entry names a *failure mode to
> avoid*, not a shape to repeat. The "pattern" is the agent's
> disposition to treat self-authored gate vocabulary as authoritative
> scheduling discipline. Recognising the gate as fabricated is the
> first move in not repeating the deferral.

## Principle

A graduation candidate carries two layers: the **substance** (the
doctrine, cure, or decision the entry has captured) and the **gate
language** the capturing agent attached when first registering the
entry. The gate language is heuristic — *"this looks XL"*, *"second
instance not yet observed"*, *"plan execution will validate"* — and
written in good faith, often by an agent under context pressure.

Across multiple consolidation passes, the gate language ossifies.
Subsequent agents read the entry, see the gate, and *honour* it:
they classify the substance under the gate's status (deferred /
sequenced / vaporware-gated) without asking whether the gate
applies to the substance *as it now stands*.

The gate is fabricated when:

1. The substance is fully captured in the entry body (someone could
   draft the PDR/ADR/rule/pattern from the entry alone).
2. The named dependency does not actually constrain authoring — the
   "carrier plan" or "second instance" or "fresh session" is a
   convenience reference rather than a structural prerequisite.
3. The gate vocabulary has *replaced* the substance assessment —
   the next reader sees `size: XL` and stops at the size, never
   reaching the substance question *"is this graduation-ready?"*.

The cure is to read the entry's substance, not its self-deferral
language. If the substance is graduation-ready, the gate vocabulary
is documentation drift, not constraint.

## Worked Instance — 2026-05-10 graduation pass

Owner-invoked deep consolidation. Pre-flight Explore-agent triage of
the pending-graduations register classified all 7 `due` items, both
`partially-graduated` items, and the 1 `quarantined` item:

| Verdict | Items |
| --- | --- |
| DRAIN-NOW | 0 |
| DRAIN-WITH-OWNER-NOD | 0 |
| DEFER-DEDICATED-SESSION | 4 (all XL with sequenced-deferral pointers) |
| HELD-PLAN-GATED | 3 (all `vaporware-gated`) |
| OWNER-RETHINK | 1 (quarantined) |
| PARTIALLY-GRADUATED (by-design partial) | 1 |

Every gate the entries cited was self-authored:

- The **30%-context-budget for directive-file processing** entry
  (DUE-1) explicitly said *"PDR landing is itself directive-shaped
  work that requires <30% context, which this session does not
  have"*. But the entry's substance is a Practice-Core PDR — not a
  directive-file edit. The 30% rule applies to directive-file
  edits; PDR drafting is not directive-file editing. The gate
  cited the wrong scope.
- The **orchestrator-vs-gate cure** (DUE-2) said *"combined
  directive + script + skill scope exceeds this drain session's
  context budget; sequenced for next slot"*. Then was deferred
  for >5 days while the substance sat fully captured.
- **Vaporware-gated** entries (DUE-5, DUE-6, DUE-7) gated graduation
  on plan execution that, on inspection, was not a prerequisite
  for the doctrine — the plans were *applications* of the
  doctrine, not its source.

Owner correction:

> *"this IS the session where we graduate the pending graduates,
> they have been stuck for a long time, we have an overly and
> accidentally restrictive graduation policy. Nothing is deferred,
> the made up gates never applied, they are just avoidance. Do it
> ALL in session."*

Substance was preserved correctly per the per-write rule (no entry
was compressed). The failure was downstream: the entries' own
deferral language was treated as authoritative scheduling
discipline rather than as an avoidance signal accumulated under
context pressure.

## The Diagnostic

When triaging a pending-graduation entry (or any queued artefact
with self-described deferral):

1. **Read the substance, not the size tag.** Can a competent agent
   draft the target artefact from this entry's body alone? If yes,
   the substance is graduation-ready. The size tag is a tag, not
   a verdict.
2. **Name the gate's actual constraint.** *"vaporware-gated on
   WS11.3 execution"* — does WS11.3 execution affect the doctrine's
   correctness, or only its empirical worked-instance count? If
   only the latter, the substance graduates with explicit
   hypothesis-status; the gate is a falsifiability discipline that
   travels with the artefact, not a graduation block.
3. **Distinguish epistemic gates from capacity gates.** *"N≥3
   validation required"* is an epistemic gate when it preserves the
   hypothesis-vs-doctrine distinction; it is a capacity gate when
   it has been used to defer authoring under context pressure.
   Capacity gates dissolve when the session has the capacity. The
    2026-05-07 *"sequenced for next slot"* gate accumulated >5
   sessions with capacity but was not crossed.
4. **Notice when the gate's vocabulary tracks the deferring agent's
   pressure, not the substance's readiness.** Multiple entries
   tagged `XL` with `sequenced-deferral pointer` written *during*
   the same session is a signal that the agent is shedding load,
   not that all the substance is genuinely XL.

## Composition

This pattern composes with:

- [`eager-rounding-off-on-partial-structures`](eager-rounding-off-on-partial-structures.md):
  the rounding-off pattern names the disposition that produces
  fabricated gates under failure pressure. Fabricated-gate vocabulary
  is a specific shape of rounding — a partial classification (`XL`,
  `vaporware-gated`) is rounded into a whole verdict (deferred).
- [`templates-encode-failure-modes`](templates-encode-failure-modes.md):
  the pending-graduations metadata schema (size / trigger / status)
  is a template that institutionalised the deferral framing. The
  schema fields are useful — but the *vocabulary* in the values
  has accumulated avoidance shape that the schema itself does not
  require.
- [`mechanical-sequence-is-activity-bias-diagnostic`](mechanical-sequence-is-activity-bias-diagnostic.md):
  classifying entries one-by-one through the gate vocabulary
  *feels* like progress (each entry receives a verdict) while the
  queue depth never decreases. Mechanical-ness without queue depth
  reduction is the diagnostic that the classification activity is
  serving the deferral, not the graduation.
- `feedback_no_speed_pressure`: the absence of urgency does not
  imply the absence of work. Substance ready for graduation should
  graduate; "no speed pressure" is not licence for indefinite
  deferral.

## Cure (structural, not discretionary)

When the next consolidation pass meets a pending-graduation entry:

1. Read the entry's body before reading its inline metadata tag.
2. Ask the substance question: *"is the doctrine / cure / decision
   captured here graduation-ready?"* Answer in terms of substance
   completeness, not gate vocabulary.
3. If yes, graduate it. Mark the entry `status: graduated`. Do not
   re-classify under the gate.
4. If no, name the *missing substance* (not the missing gate
   condition). Missing substance is a real prerequisite; missing
   gate condition is usually fabricated.
5. After processing, audit any new entries this session adds. Any
   new `vaporware-gated` or `sequenced-deferral pointer` entry
   must name a *real* constraint that survives the substance test
   in step 2 — or the vocabulary is the failure mode firing again.

## Source Surfaces

- Pending-graduations register entries surfaced 2026-05-10 (DUE-1
  through DUE-7, PART-1, PART-2, QUAR-1).
- Owner correction 2026-05-10 in the `knowledge graduation` session
  (Sylvan Fruiting Glade `a53e45`).
- Plan
  `/Users/jim/.claude/plans/jc-session-handoff-jc-consolidate-docs-serialized-fiddle.md`
  — the in-session reframe that triggered this capture.
