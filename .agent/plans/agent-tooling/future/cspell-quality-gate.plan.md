# cSpell Quality Gate — Strategic Plan

**Status**: Future (not started)
**Collection**: agent-tooling
**Thread**: [`agentic-engineering-enhancements`](../../../memory/operational/threads/agentic-engineering-enhancements.next-session.md)
**Related**:
[`no-warning-toleration`](../../../rules/no-warning-toleration.md);
[`never-ignore-signals`](../../../directives/principles.md);
[New ESLint rules start at warn](../../../rules/) (the warn-then-error escalation analog)

## Problem and Intent

cSpell runs in the editor and flags unknown words across the repo, but it is
**not a blocking quality gate**. As a result, two classes of issue accumulate
silently:

1. **Legitimate technical vocabulary re-flags repeatedly** because there is no
   shared project dictionary — e.g. `pathspec`, `forkbomb`, `niced`, `unstages`.
   Each contributor sees the same noise and the signal is trained to be ignored.
2. **Real typos slip through** because nothing fails on them — e.g. `bshelv`
   and possibly `unagreed` (both surfaced in `.agent/hooks/policy.json` on
   2026-06-15 when the file was opened in the IDE).

Without a gate, spelling drift is invisible until someone happens to open a file
in an editor that runs cSpell.

## End Goal, Mechanism, and Means

**End goal.** cSpell is a blocking quality gate; the repo is cSpell-clean; the
shared technical vocabulary lives in a project dictionary; real typos are fixed.

**Mechanism.** Make the spelling signal enforced rather than advisory: a project
cSpell configuration plus a curated dictionary removes the legitimate-vocabulary
noise, real typos are fixed in a one-time sweep, and the gate then keeps the
repo clean going forward. Per the warn-then-error escalation analog, the gate
may start non-blocking until the backlog is cleared, then escalate to blocking.

**Means (strategic moves; finalised at promotion).**

1. **Audit** the repo-wide cSpell findings to size the backlog and separate
   legitimate technical vocabulary from real typos.
2. **Curate a project dictionary** for the legitimate technical terms (the
   `pathspec` / `forkbomb` / `niced` / `unstages` class). Each added word is a
   deliberate decision, reviewed so the dictionary never masks a real typo.
3. **Fix real typos** in place — at minimum `bshelv`, and verify `unagreed`.
4. **Wire `cspell` into the canonical gate chain** (the `pnpm check` aggregate
   and/or the pre-commit chain), scoped to the appropriate file types and paths.
5. **Escalate to blocking** once the backlog is clear (warn first if the initial
   surface is large, then error — the established new-rule escalation posture).

## Domain Boundaries and Non-Goals

- **Non-goal**: prose style or grammar enforcement beyond spelling.
- **Non-goal**: a bespoke spell-checker — cSpell is the tool.
- **Non-goal**: bulk-adding every flagged word to the dictionary to force a green run; each word is reviewed (the dictionary is a curated allowlist, not a silencer).

## Dependencies and Sequencing

- No `blocking` prerequisites. Independent of the sibling [hook-policy-typescript-and-schema-unification](./hook-policy-typescript-and-schema-unification.plan.md) plan.
- `beneficial`: doing it alongside a documentation-quality pass amortises the review of flagged words.

## Strategic Acceptance Criteria and Success Signals

- A repo-wide cSpell run reports zero findings.
- `cspell` is part of the canonical gate chain and fails on a newly-introduced unknown word (demonstrated by a deliberately-misspelled probe).
- The project dictionary covers the legitimate technical vocabulary; each entry is a reviewed decision.
- The known real typos (`bshelv`, and `unagreed` if confirmed) are fixed at source.

## Risks and Unknowns

- **Large initial surface.** The repo-wide backlog may be sizable; the warn-first escalation keeps the gate from blocking work before the backlog is cleared.
- **Dictionary masking real typos.** Bulk-adding words to go green would defeat the gate's purpose; mitigated by reviewing each flagged word as typo-versus-vocabulary.
- **Scope of coverage.** Which file types and directories the gate covers (source, docs, memory, generated artefacts) is a promotion-time decision.

## Promotion Trigger

Owner prioritisation, OR the next typo that reaches a durable surface, OR promotion alongside a documentation-quality push. Coverage scope and the warn-then-error escalation point finalise at promotion to `current/`.
