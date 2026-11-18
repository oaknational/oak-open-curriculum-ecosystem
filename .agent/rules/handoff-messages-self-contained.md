---
classification: core
description: Every handoff message must be self-contained — the receiver cannot read your transcript.
---

# Handoff Messages Must Be Self-Contained

Operationalises
[PDR-011 (Continuity Surfaces and the Surprise Pipeline)](../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md).
Composes with [PDR-027 (Threads, Sessions, and Agent Identity)](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
identity-disclosure shape and [PDR-063 (Mid-Cycle Retirement Protocol)](../practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md)
handoff-record shape.

## Rule

**Every handoff message — directed comms-event, mid-cycle handoff record, continuation-pointer note, or any inter-agent transfer of work — MUST be self-contained. The receiver cannot read the sender's transcript; the message IS the entire information transfer.**

A later, more specific message from the same author settles an earlier ambiguous line, and the
receiver acknowledges its reading back before acting on it (2026-10-02: the ack was asked for
and confirmed before the line was acted on).

## Why this rule exists

Receiving agents cannot read the sending agent's transcript. This applies to:

- **Peer-to-peer handoffs** within the same platform (each Claude Code session is sandboxed; Mistbound's transcript is invisible to Stormbound).
- **Compaction-boundary self-handoffs** (your future self after compaction cannot reliably read your current transcript — only the summary survives).
- **Cross-platform handoffs** (Claude → Codex, Codex → Cursor, etc.).
- **Rotating-cast pickups** (the agent picking up an open claim has no session-history with the agent who opened it).

Without an explicit rule, agents default to abbreviated handoff messages assuming shared context that does not exist. The receiver then either acts on incomplete information or interrupts the sender for clarification — both failure modes.

## What "self-contained" requires

A handoff message MUST name:

1. **Every fact the receiver needs to act** — explicit, not "see our earlier discussion" or "as we agreed".
2. **Every decision the receiver needs to respect**, with WHO decided and WHEN. Reference the comms-event ID, plan section, ADR/PDR, or owner-direction artefact.
3. **Every artefact the receiver needs to read**, by FILE PATH (not "the plan" or "the docs"). Use absolute paths or paths relative to repo root.
4. **The next safe action** the receiver should take — explicit, with any preconditions named.
5. **The constraints or open questions** the receiver inherits, with the sender's view of options.
6. **The receiver's expected acknowledgement shape** if the protocol requires one (e.g., PDR-064 coordinator handoff Moment 2).

A receiver should be able to act WITHOUT a clarifying question back to the sender. If they need to ask, the message was incomplete.

A handoff's next-step list names the credential route beside each write
(the merge-bot's push command, the minted token), since a pickup reads the
steps, not the rule: steps that said "merge", "push", "request Copilot" with
the credential implicit produced three writes under the owner's credential in
one day (2026-09-24).

A handoff's content is of two kinds, and the receiver treats them differently. Owner rulings,
deliberate oddities and recorded mistakes are inherited as written: nothing in the tree can
recompute them. Lane state, branch state and pull-request state are recomputed from the live
surfaces before any act rests on them; the handoff says where to look, never what will be found.

A recorded decision names who will do it. Where nobody will, the record says "nobody": that
word is what gets the work staffed (2026-09-25, an owner decision recorded as routed through a
role no seat then held).

## Forbidden patterns

- *"See our earlier discussion"* — the receiver has no earlier discussion.
- *"Remember the decision we made"* — the receiver was not there.
- *"The usual approach"* — the receiver does not know the usual.
- *"As before"* for a method whose safety rests on an exact value — paste the
  value. "As before" carries the shape and drops the safety: a probe relayed
  without its deliberately invalid string came back with a valid one and
  created four production OAuth clients (2026-09-03).
- A constraint without the interest it protects — hand over the interest
  beside the rule. A rule compressed from its purpose ("no fourth commit" for
  "a bound review leg is expensive; spend none on something discretionary")
  misfires at the first case its author did not imagine, and the receiver
  cannot reason with it (2026-09-12).
- *"As I mentioned"* — the receiver did not hear it.
- *"The relevant plan / docs"* — the receiver cannot guess which.
- *"You know what to do next"* — the receiver does not.

## When the receiver IS your future self

After compaction, your future self IS a new receiver. Compaction-boundary handoff records (napkin entries, thread next-session records, claim notes) MUST follow this rule. A receiving-agent that happens to share your `agent_name` does NOT share your transcript memory after the compaction summary replaces it.

If runtime monitors, cron jobs, watchers, or loop instructions matter after the
compaction, flush their exact commands and intended state into the handoff and
verify them on first wake-up. Do not rely on the compaction summary or the
runtime process table to preserve that contract reliably. A summary keeps the
what and drops the where: resume from the handover a seat wrote, never from the
summary's line about it (2026-09-15: nine suppressed review findings went
unanswered because a resume read "the last settlement push" from the summary,
not the handover naming where they lived).

A handover transmits INTENT with authority and MECHANISM without it: the
receiver takes the intent as binding and re-derives the mechanism against the
live rules, running the cheapest oracle that can falsify it (a parser, the
command's `--help`, the rule the step would break) before following it
(2026-09-11: a succession record's forbidden `it.skipIf` and unparseable
workflow YAML). A handover to a lower-capability seat carries commands and
stop conditions, never "use judgement": every judgement already made becomes
a rule with its warrant, and every judgement not made goes to the owner's
list. Where a later message from the same author narrows an earlier
ambiguous line, the later governs: ask once, confirm, and proceed, rather
than re-running the frame (2026-10-02).

## Handoff artefacts teach by their form

A handoff message, continuation opener, or next-session record does not only
*transfer* information — it *teaches* the receiver by its voice. Beyond being
self-contained, it carries three form disciplines:

1. **Write as present-truth plus destination.** An opener written as a
   remediation-recap trains the next agent to think in remediation terms; one
   written as "here is what the system *is* and where it is going" trains
   present-truth thinking (the [`no-tombstones-for-removed-ideas`](no-tombstones-for-removed-ideas.md)
   shape, applied to the opener genre). Opener staleness is structural, not
   merely an authoring defect: a strong opener self-instructs cheap
   re-derivation from git and the live surfaces, so the receiver verifies
   rather than believes.
2. **Openers degrade in transit — launch from the canonical file.** Pasted
   openers arrive duplicated or garbled mid-token (observed across three
   sessions). The thread record and plan hold the exact text; the canonical
   file is the source, and a chat paste is lossy transport to be re-grounded
   against the file.
3. **An opener may compress canon but never silently extend it.** Summarising
   or pointing at durable surfaces is correct; a net-new commitment in an
   opener that has no durable source is a *proposal* and must be marked as
   such — the opener-genre sibling of the no-unauthorised-scope-invention
   discipline.

## Source attribution

Graduated 2026-05-22 from `.agent/memory/operational/pending-graduations.md` candidate `handoff-messages-self-contained`. Worked-instance evidence: Mistbound Slipping Night → Stormbound Kiting Squall t12 commit handoff at 2026-05-22T15:42Z (`0f03f45c-a225-4d55-bb15-2e5c44abb678`), where the message named every staged file by path, the verify-staged fingerprint, the intent_id, three commit-landing options, all four reviewer verdicts, and the closed claim disposition — all substance the receiver needed to act without a clarifying question back.

The §"Handoff artefacts teach by their form" discipline was graduated 2026-06-04
(owner-directed) from the `pending-graduations.md` "openers teach by their form"
candidate: present-truth-plus-destination form, transit-degradation (launch from
the canonical file; three-session evidence), and compress-but-never-extend scope.

## Inherited constraints carry their cure cost

A constraint's HARDNESS is repriced at every handoff: state its cure cost
alongside it, and let the receiver re-derive the urgency rather than
inheriting the adjective. Worked instance (2026-07-2x): the MCP-303
credentials-expiry "hard bound" rode five compaction boundaries unexamined
until the owner priced the cure — re-minting is "the work of seconds". A
handoff that transmits "hard" without the cure cost manufactures urgency
the facts never carried.

A constraint's breadth is repriced at the handoff as its hardness is: Sandpiper weaves Updraft found
that a peer's constraint "turned out on the second look not to be a broken rule but an over-broad
one" and had been "compressed from an interest into an action under closeout pressure", so the
receiver reads the interest behind an inherited action before obeying it (the seat's lesson of
2026-09-12, event 780b1462).

## Cross-references

- Composes with [`start-right-team` SKILL §Continuation Pointer Contract](../skills/start-right-team/SKILL-CANONICAL.md) — that section covers the specific continuation-record-as-pointer case; this rule is the broader principle applied to every handoff message.
- Composes with [PDR-063 mid-cycle retirement protocol](../practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md) — handoff records (PDR-063's Step 2) MUST follow this rule.
- Composes with [PDR-064 coordinator handoff two moments](../practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md) — pre-positioning events (Moment 1) MUST follow this rule.
- Composes with [`continuity-surface-commits-as-orphans.md`](continuity-surface-commits-as-orphans.md) — when handoff is chosen over commit, the handoff message names the unstaged files explicitly.
