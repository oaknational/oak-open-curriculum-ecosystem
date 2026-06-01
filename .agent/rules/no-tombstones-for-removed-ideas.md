# No Tombstones for Removed Ideas

Operationalises [`principles.md` §Strict and Complete](../directives/principles.md#strict-and-complete)
and [`principles.md` §Architectural Excellence Over Expediency](../directives/principles.md#architectural-excellence-over-expediency).
It is the prose-surface sibling of
[`replace-dont-bridge.md`](replace-dont-bridge.md): that rule keeps a
disproven shape out of the *code*; this rule keeps it out of the *writing*.

When an idea, design, or shape is found wrong and removed, describe the
correct design and stop. The corrected document should read as though the
wrong idea was never there — a reader who never saw the mistake should not
be able to reconstruct it from the text that replaced it.

The failure mode is memorialisation: keeping a dead idea alive by naming it
in order to reject it. The warning is gravity, not absence — a sentence that
says "we did not do X" re-instantiates X in the reader's head and invites the
next author to weigh it again. This reflex recurs across sessions and agents
and slips past vocabulary and structural checks precisely because it reads as
diligence rather than as preservation.

## Rule

When removing a wrong idea from a plan, ADR, PDR, governance doc, rule,
README, or code comment:

1. State the correct design in the positive: what the system *is* and *does*.
2. Delete the wrong idea's description rather than relabelling it.
3. Read the result as a first-time reader. If the dead idea is still
   reconstructable from the prose, it is not yet removed.

## Forbidden

- Rejection labels: "rejected", "to avoid", "the original X error",
  "X was wrong", reframe-consequence banners.
- **Negation-contrast framing** — the most insidious form, because it reads
  as precision: "DELETED, not reshaped", "built fresh, never a bridge",
  "X rather than Y", "A instead of B". The contrast keeps the rejected term
  (reshaped / bridge / Y / B) alive. State A and drop the "not Y".
- Prohibition lists that enumerate dead shapes ("no stub, no fallback, no
  compatibility layer, no …") where a single positive invariant carries the
  same force ("every operation is implemented with real logic and tests, or
  it is absent").

## Allowed Exception

Instructions to delete real code or files that still exist are deletion
discipline, not monuments: "delete `loader.ts`", "remove the response cap".
These are permitted until the code is gone; once it is gone, the instruction
goes with it. Git history carries the evolution.

The sanctioned history surfaces — ADR amendment logs, dated continuity
records, the napkin, `.agent/experience/` — legitimately record what changed
and why. Recording an evolution there is not a monument; the monument is the
dead idea re-stated as live-document guidance.

## Why This Rule Is Strict

A doc-level note in `distilled.md` and platform memory did not change the
write-time default — the reflex kept recurring, including inside edits made
to remove monuments. Promotion to the always-applied rule tier puts the
discipline in every session's context at the point of writing.

The write-time innate-immunity hook ([`policy.json`](../hooks/policy.json))
is the intended hard-enforcement layer, but the negation-contrast form is a
*structural* pattern (a negation bound to a dead concept), not a fixed
literal — a naive literal block on "never" / "rather than" / "instead of"
would have an unacceptable false-positive rate. The hook can carry only a
narrow set of genuinely high-signal banner literals; the structural form
needs a smarter detector or an output-time review pass. That enforcement
increment is tracked in
[`pending-graduations.md`](../memory/operational/pending-graduations.md).

## Related

- [`replace-dont-bridge.md`](replace-dont-bridge.md) — the code-surface
  sibling (don't preserve a wrong shape; here, don't memorialise one).
- [`no-hedging-vocabulary.md`](no-hedging-vocabulary.md) — adjacent
  write-time language discipline on doctrine surfaces.
- [`no-moving-targets-in-permanent-docs.md`](no-moving-targets-in-permanent-docs.md)
  — adjacent permanent-doc write-time discipline.
- [`knowledge-preservation-over-fitness-warnings.md`](knowledge-preservation-over-fitness-warnings.md)
  — the boundary: genuine history is preserved; live-guidance memorials are not.
