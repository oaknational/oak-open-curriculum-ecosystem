---
id: consolidation-induction
node_type: delivery
name: "Consolidation induction — one action, either direction"
overview: "A consolidation session becomes a single agent-inducible action: canonical skill-homed dispatch brief; the prompt files become thin pointers."
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: planning-and-intent-estate
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: consolidation-signal
    kind: beneficial
owner_gates: []
last_updated: 2026-07-31
---

# Consolidation induction — one action, either direction

## Goal

Starting a consolidation session is one action from either direction:
an agent self-inducts by invoking a skill, or inducts a dedicated
session by dispatching a sub-agent with a canonical brief — where today
the entry point is a markdown prompt only the owner can paste.
(No Linear ticket by design: owner-ruled untracked subtree.)

## Mechanism

SSOT repair plus one composition: the dedicated-consolidation session
prompt's substance moves to one canonical skill-homed **dispatch
brief** (the prompts already compose existing skills — start-right,
consolidate-until-done, metacognition — so the brief is thin);
`.agent/prompts/agentic-engineering/dedicated-consolidation-session.md`
becomes a thin pointer per the documentation-is-infrastructure SSOT
rule. Self-induction = invoking the skill in-session; dedicated
induction = an Agent dispatch carrying the brief (the 2026-07-30
dedicated pass and the owner-flagged director-handoff curation are the
worked precedents). Minimum shippable without the signal dependency:
induction works with a hand-read of the pressure; the signal makes the
decision-input computed.

## Acceptance criteria (each with a proof — required)

- One canonical home for the session contract; the prompt file points
  and carries no second copy — `repo-safe`: link validator plus a
  grep-clean check for duplicated contract text.
- An agent can induct a dedicated consolidation session as a single
  dispatch whose brief needs no session-specific authoring —
  `owner-held`: the first induced session runs end-to-end and its
  closeout names this plan.
- Self-induction is one skill invocation — `repo-safe`: the skill
  resolves and its canonical file carries the contract.

## Out of scope

Automatic induction (a signal never starts a session by itself —
owner/Director word does); scheduling infrastructure; any change to
the consolidation skills' internal workflow.

## Todos

Sliced at pickup by the implementer.
