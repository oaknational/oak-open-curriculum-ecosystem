---
name: "Collaboration-CLI Interface Drift"
polarity: anti-pattern
use_this_when: "Composing any collaboration-CLI invocation from help text or skill prose alone, or reading a non-zero exit after a CLI write as proof the write failed."
category: agent
proven_in: "Longitudinal synthesis 2026-08-07, candidate C55 (adversary-surviving; novelty verified against the frictions register, which holds the instances but not the class): --help omitting required --id on write commands, claims heartbeat rejecting the sibling-standard --platform/--model while requiring --now (F-89), the commit-queue guard rejecting the commit skill's own prescribed label (F-116 family), heartbeat mode requiring a claim pre-claim roles cannot hold (F-73), and claims open crashing after a successful write."
proven_date: 2026-08-07
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Following the documented interface into failed writes, re-arm loops, or retried ambiguous writes — the drift converts documentation directly into failures because agents follow documentation by construction."
  stable: true
---

# Collaboration-CLI interface drift

The collaboration CLI's documented interface — help text, and the invocation
shapes prescribed by skills and rules — drifts from what the code actually
accepts, and the drift is invisible until a write fails (or worse, succeeds
while exiting non-zero). Recorded instances, each a frictions-register row or
napkin capture: `--help` omitting a required identity `--id` on write commands;
`claims heartbeat` rejecting the `--platform`/`--model` args every sibling
command requires while requiring a `--now` its siblings default (F-89); the
commit-queue guard rejecting the `index/head@<worktree>` label the commit skill
itself prescribes (F-116 family); heartbeat mode requiring a `--claim-id` that
pre-claim roles cannot hold (F-73); `claims open` writing no `status` field and
crashing AFTER a successful write, so exit-nonzero coexists with changed state.

Longitudinal evidence: surfaced as candidate C55 of the 2026-08-07
archive-scale synthesis (adversary-surviving; novelty verified — the register
holds the instances above, but no pattern carried the class), grounded across
five windows of the corpus — see
`.agent/reports/agentic-engineering/large-corpus-analysis-tooling/data/longitudinal-2026-08-map-result.json`
and the C55 row of the reduce checkpoint beside it.

Why it matters: agents follow the documented interface by construction — help
text and skill prose ARE the interface an agent sees. Every drift therefore
converts directly into failed writes, re-arm loops, or (the dangerous form)
ambiguous-write states read as failures and retried.

Cure shape:

- **Conformance-test the documentation against the parser**: help text and
  skill-prescribed invocation shapes are corpus-tested against the CLI's real
  argument parser, the same discipline the comms watcher applies to filters
  ("no hand-rolled fallback" — prove pass/leak counts against real output).
- **Treat exit-nonzero-after-write as ambiguous, not failed**: read state
  before retrying (the standing `exit-codes-in-band-never-piped` ambiguous-WRITE
  discipline); a crash after a successful write is this class's signature.
- **A skill that prescribes an invocation owns a working example**: when a
  guard or parser change lands, the grep for prescribing skills/rules is part
  of the change, not a follow-up.
