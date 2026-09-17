# The Codex Dialogues trial tally — operating record (2026-08-02 →)

The durable corpus of the-codex-dialogues trial window
([SKILL](../../skills/the-codex-dialogues/SKILL-CANONICAL.md) §"Trial
window"): one row per dialogue close, appended AT OCCURRENCE as part of
the close sequence. Comms events are transport — this file is the
storage (the same discipline as the
[cricket tallies](cricket-quartet-tally-2026-07-29.md); close events
are instance-tier untracked state under ADR-199/PDR-094, so the trial's
decision rule reads THIS corpus — always MAIN's copy of it, the sole
integration point: a row on an unmerged lane is in-flight and does not
count until its commit reaches main).

Each row conserves the close event's canonical `key=value;` body line
VERBATIM, decoded by the schema-version definitions in the SKILL
(§"Close-event schema versions"). Corrections are appended as notes,
never edited into the conserved line — the same immutability the
close-event definitions carry.

## Trial window state

- Window: 12 dialogues or 14 days from the first dialogue, whichever
  comes first. First dialogue closed 2026-08-02, so the 14-day window
  ends 2026-08-16.
- Counts are DERIVED AT READ TIME from the rows below, never authored
  here (`no-moving-targets-in-permanent-docs` §Authoring-Time Open-Set
  Clause): a dialogue counts toward the trial thresholds by its row's
  `outcome`; `non-evaluable` rows are excluded exactly as the SKILL's
  trial window states.

## Dialogue closes

### dlg-20260802-lockstep-pins (trial dialogue 1, closed 2026-08-02T12:50Z)

Pre-`close_schema`-key era; decodes as version 1 per the SKILL.

```text
dialogue_id=dlg-20260802-lockstep-pins; question_class=design-fork; turn_count=3; stop_reason=stabilised; outcome=position-changed; prior_confidence=medium; harness_version=claude-code 2.1.220; codex_cli_version=0.146.0; synthesis_ref=https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/713#issuecomment-5157991430;
```

### dlg-20260802-close-schema (trial dialogue 2, closed 2026-08-02T13:21Z)

Pre-`close_schema`-key era; decodes as version 1 per the SKILL.
NATIVE-SESSION re-run; confirmed with prior confidence medium (the
seat's post-dialogue confidence rose to high — the field conserves the
PRE-dialogue prior, per the field rules).

```text
dialogue_id=dlg-20260802-close-schema; question_class=design-fork; turn_count=3; stop_reason=stabilised; outcome=confirmed; prior_confidence=medium; harness_version=claude-code 2.1.220; codex_cli_version=0.146.0; synthesis_ref=https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/713#issuecomment-native-rerun-pending;
```

- **Correction (threaded comms event, 2026-08-02T13:23Z)**: the
  conserved line's `synthesis_ref` was composed before its synthesis
  surface existed (the compose-order violation the SKILL's field rules
  now name as the worked instance). The resolved durable ref is
  <https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/713#issuecomment-5158174931>.

### dlg-20260806-flor (trial dialogue 3, closed 2026-08-06T09:15Z)

Consensus-check over the capability-floor foundational structure after a
same-vendor adversarial debate had converged; the foreign prior refused
ratification as written and forced seven structural additions (whole-floor
witness tuple, anti-evasion set closure, staleness downgrade, continuous
domestic renewal, fail-closed binding semantics, error-bounded proxies,
amendment anti-erosion). Both sides moved; closed at stabilisation in
three exchanges.

```text
close_schema=1; dialogue_id=dlg-20260806-flor; question_class=consensus-check; turn_count=3; stop_reason=stabilised; outcome=position-changed; prior_confidence=high; harness_version=claude-code 2.1.223; codex_cli_version=0.146.0; synthesis_ref=.agent/reports/design/oak-components-capability-floor-shaping-debate-2026-08-06.md;
```

### dlg-20260806-solm (trial dialogue 4, closed 2026-08-06T11:02Z)

Owner-ordered consensus-check on the RATIFIED capability-floor mandate
at maximum interlocutor effort (`gpt-5.6-sol`, effort `max` via the
ambient Codex config — first max-effort dialogue of the trial). Six
structural findings; the seat's high-confidence "execution-ready"
prior refuted — two cures are SEMANTIC amendments (the MEETS-FLOOR
conformance predicate, witness defeasibility) now routed for owner
ratification as v2 floor semantics, four are staged additions behind
fail-closed absent-instrument entries. Closed at stabilisation in
three exchanges with an agreed staging shape.

```text
close_schema=1; dialogue_id=dlg-20260806-solm; question_class=consensus-check; turn_count=3; stop_reason=stabilised; outcome=position-changed; prior_confidence=high; harness_version=claude-code 2.1.223; codex_cli_version=0.146.1; synthesis_ref=.agent/reports/design/oak-components-capability-floor-shaping-debate-2026-08-06.md;
```
