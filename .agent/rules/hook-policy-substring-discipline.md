# Hook-Policy Substring-Match Discipline in Instructive Content

The repo's `PreToolUse` hook policy is a substring-matcher. It blocks
literal forbidden-pattern strings regardless of the surrounding
natural-language context. The matcher does not parse negation, hedging,
guards, or instructional framing — *"do not use X"* and *"use X"*
trip the same filter when *X* is on the trip-list.

This recurs across sessions and agents: comms-event bodies, dispatch
briefs, napkin entries, coordinator instructions, and other
agent-authored content that *describes* a forbidden pattern in order
to warn against it are blocked at write-time, even though the intent
is to enforce the rule rather than invoke the pattern.

## The Rule

When authoring instructional content that references a forbidden
pattern — content in comms-event bodies, dispatch briefs to
sub-agents, napkin entries, team-start broadcasts, conversation
threads, or any narrative surface that warns peers/sub-agents away
from a pattern — **use generic descriptive language for the pattern,
not the literal string that the hook matches**.

Examples:

- whole-tree staging glob → *"whole-tree shortcut"* or *"the staging
  glob shortcut that picks up every modified file"*
- the hook-bypass flag on `git commit` → *"the hook-bypass flag"*
  or *"the verify-skip flag"*
- environment-variable hook-skip mechanisms → *"environment-variable
  hook-skip"*
- `core.hooksPath=/dev/null` reroute → *"hook-redirect mechanism"*

The literal forbidden-pattern strings belong only in:

- the rule's canonical home (where the hook policy expects them to
  enumerate the trip-list);
- agent execution contexts where the pattern is being deliberately
  invoked (which is itself gated by the rule covering that pattern,
  e.g. fresh per-invocation owner authorisation for hook-skip
  attempts).

In every other surface — every instructive context — the descriptive
substitute is the correct shape.

## Why this rule exists

The hook-policy matcher cannot distinguish "do not use X" from "use
X". The cost of upgrading the matcher to a context-aware parser
(negation-aware, multi-token, semantic) is structurally high and
slow. The cost of applying descriptive substitution at write-time
is near-zero and portable across every agent-authored surface.

Three+ independent cross-session instances confirm the pattern is a
recurring blocker, not an isolated mishap. Every recurrence consumes
a coordinator-brief retry cycle or an agent re-edit cycle. The
discipline cure removes the friction at the surface where the
content originates.

## In-Scope Surfaces

- comms-event bodies (broadcast, group, directed)
- dispatch briefs to sub-agents (Agent-tool invocations)
- napkin entries
- team-start broadcasts and coordinator-cadence instructions
- conversation threads and decision-thread entries
- any agent-authored narrative content that warns or instructs

## Excluded Surfaces (Why)

- the canonical home of each forbidden-pattern rule (the trip-list
  must enumerate its members literally for the hook to load them);
- the hook policy configuration itself;
- archived material (historical content; not a live write surface);
- test fixtures that demonstrate the rule by example.

The recursive-exclusion shape is the same as for
[`no-hedging-vocabulary`](no-hedging-vocabulary.md): a structural
enforcer that names its own pathogen must exclude the documents
that define the pathogen.

## What to Do When the Hook Blocks You

If the hook blocks a write because of substring-matching in
instructive context:

1. **Do not try to bypass.** The block is correct behaviour at the
   matcher layer; the cure is at the content-authoring layer.
2. **Rewrite using descriptive language.** Substitute the literal
   forbidden pattern with the descriptive form named above.
3. **Verify the rewrite preserves substance.** Descriptive
   substitution must keep the instruction's meaning; a substitution
   that loses precision is a different defect.
4. **If no descriptive substitute exists**, the surface may be the
   canonical home of the rule itself — confirm via the rule's path
   and proceed.

## Doctrinal Anchors

- the hook policy file enumerating the trip-list (the canonical
  literal home)
- [`no-verify-requires-fresh-authorisation`](no-verify-requires-fresh-authorisation.md) —
  the prohibition the hook policy operationalises for one family of
  forbidden patterns
- [`no-hedging-vocabulary`](no-hedging-vocabulary.md) — the
  structural-enforcer recursive-exclusion pattern this rule mirrors

## Source Landing

Three+ cross-session instances across multiple agents in the
2026-05-21 → 2026-05-22 multi-agent dual-lane window. Graduated
2026-05-22 from `pending-graduations.md` entry
*"Hook-policy substring-matching in instructive content is a
recurring blocker"*.
