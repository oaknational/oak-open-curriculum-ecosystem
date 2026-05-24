# Handoff Messages Must Be Self-Contained

Operationalises
[ADR-150 (Continuity Surfaces, Session Handoff, and Surprise Pipeline)](../../docs/architecture/architectural-decisions/150-continuity-surfaces-session-handoff-and-surprise-pipeline.md)
and
[PDR-011 (Continuity Surfaces and the Surprise Pipeline)](../practice-core/decision-records/PDR-011-continuity-surfaces-and-surprise-pipeline.md).
Composes with [PDR-027 (Threads, Sessions, and Agent Identity)](../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
identity-disclosure shape and [PDR-063 (Mid-Cycle Retirement Protocol)](../practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md)
handoff-record shape.

## Rule

**Every handoff message — directed comms-event, mid-cycle handoff record, continuation-pointer note, or any inter-agent transfer of work — MUST be self-contained. The receiver cannot read the sender's transcript; the message IS the entire information transfer.**

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

## Forbidden patterns

- *"See our earlier discussion"* — the receiver has no earlier discussion.
- *"Remember the decision we made"* — the receiver was not there.
- *"The usual approach"* — the receiver does not know the usual.
- *"As I mentioned"* — the receiver did not hear it.
- *"The relevant plan / docs"* — the receiver cannot guess which.
- *"You know what to do next"* — the receiver does not.

## When the receiver IS your future self

After compaction, your future self IS a new receiver. Compaction-boundary handoff records (napkin entries, thread next-session records, claim notes) MUST follow this rule. A receiving-agent that happens to share your `agent_name` does NOT share your transcript memory after the compaction summary replaces it.

If runtime monitors, cron jobs, watchers, or loop instructions matter after the
compaction, flush their exact commands and intended state into the handoff and
verify them on first wake-up. Do not rely on the compaction summary or the
runtime process table to preserve that contract reliably.

## Source attribution

Graduated 2026-05-22 from `.agent/memory/operational/pending-graduations.md` candidate `handoff-messages-self-contained`. Worked-instance evidence: Mistbound Slipping Night → Stormbound Kiting Squall t12 commit handoff at 2026-05-22T15:42Z (`0f03f45c-a225-4d55-bb15-2e5c44abb678`), where the message named every staged file by path, the verify-staged fingerprint, the intent_id, three commit-landing options, all four reviewer verdicts, and the closed claim disposition — all substance the receiver needed to act without a clarifying question back.

## Cross-references

- Composes with [`start-right-team` SKILL §Continuation Pointer Contract](../skills/start-right-team/SKILL-CANONICAL.md) — that section covers the specific continuation-record-as-pointer case; this rule is the broader principle applied to every handoff message.
- Composes with [PDR-063 mid-cycle retirement protocol](../practice-core/decision-records/PDR-063-mid-cycle-retirement-protocol.md) — handoff records (PDR-063's Step 2) MUST follow this rule.
- Composes with [PDR-064 coordinator handoff two moments](../practice-core/decision-records/PDR-064-coordinator-handoff-two-moments.md) — pre-positioning events (Moment 1) MUST follow this rule.
- Composes with [`continuity-surface-commits-as-orphans.md`](continuity-surface-commits-as-orphans.md) — when handoff is chosen over commit, the handoff message names the unstaged files explicitly.
