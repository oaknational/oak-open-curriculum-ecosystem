# Verify, Do Not Trust

When live coordination, routing, validation, or completion depends on a claim,
ask for artefacts and inspect them. Do not treat a peer's status statement,
handoff prose, owner recollection, sub-agent summary, or your own prior note as
verified state until the relevant evidence has been checked.

This rule graduates the 2026-05-24 Knowledge Curator finding captured in the
active napkin and `pending-graduations.md`: "verification asks need artefacts,
not trust confirmations".

## Rule

If a decision changes work ownership, route, completion status, gate state, or
knowledge disposition, verify it against the surface that would make it true.

Ask for and inspect concrete artefacts such as:

- claim IDs and the current `active-claims.json` entry;
- file paths and current file contents;
- comms event IDs and event bodies;
- transcript IDs or reviewer outputs when a review is the evidence;
- staged diff, git status, commit, or branch evidence;
- command output from the gate that actually covers the requirement.

Generic confirmations like "done", "still true", "looks good", "green",
"landed", or "processed" are routing hints, not proof.

Reviewer output is also evidence to test, not another substrate pointer to
trust. When absorbing reviewer findings, verify the highest-stakes claims
against live artefacts, identify reviewer blind spots, and then decide what to
absorb.

Fix verification must also return to the original defect location. A patch that
adds intended cure text elsewhere but leaves the contradicting source text in
place has not fixed the defect. Re-read the original offending line or section,
not only the new-content area, before declaring the tranche complete.

## Apply This Before

- closing or transferring a claim;
- reporting a plan item, gate, reviewer condition, or curation phase complete;
- moving source material to archive;
- accepting a handoff as current state;
- routing a peer based on a claim about another peer's status;
- absorbing sub-agent or reviewer findings into a durable artefact.
- closing a reviewer, revision, or fix tranche that was meant to remove or
  replace a specific defective statement.

## What To Do Instead

1. Name the specific fact that needs proving.
2. Name the artefact that would prove it.
3. Inspect that artefact directly.
4. Report the verdict with the artefact reference.

For curation work, this means a source is not "processed" because a pass log
says so. It is processed only when the source substance has a visible
disposition: permanent home, pending route, explicit duplicate skip, or named
blocker.

## Anti-Patterns

- Asking "are you done?" when the answer needs a claim, diff, event, or gate.
- Accepting silence after a broad status question as evidence.
- Treating a handoff record as live state without checking current claims,
  comms, and git.
- Trusting a sub-agent's cited source without opening the source.
- Calling an archive move a completed curation pass without disposition
  evidence for the archived substance.
- Checking only the intended cure location while the original defect location
  still carries contradictory text.

## Composition

- [`respect-active-agent-claims`](respect-active-agent-claims.md) — claims are
  a live ownership surface; read them before acting on scope.
- [`use-agent-comms-log`](use-agent-comms-log.md) — comms events are evidence
  surfaces, not just notifications.
- [`present-verdicts-not-menus`](present-verdicts-not-menus.md) — once the
  artefacts prove a verdict, present it instead of asking the owner to choose.
- [`knowledge-preservation-over-fitness-warnings`](knowledge-preservation-over-fitness-warnings.md)
  — process source substance before archive moves, even under fitness pressure.

## Worked Instances

- 2026-05-23 Scorched Director window: "don't trust, verify" was named as a
  deeper Director primitive after repeated trust-propagation failures on peer
  and routing state.
- 2026-05-24 Lanternlit plan refinement: reviewer-pass plus critical analysis
  caught trusted-but-unverified throughput and claim-state assertions.
- 2026-05-24 Knowledge Curator continuation: Shaded's read-only review caught
  a scoping defect in the archive-after-processing rule patch; the finding was
  verified against the rule's Scope section before absorption.
- 2026-05-24 PDR-066 revision: a blocker fix added new cure text while leaving
  the original contradicting statement in place; the durable check is to inspect
  the original defect location before calling the revision complete.
