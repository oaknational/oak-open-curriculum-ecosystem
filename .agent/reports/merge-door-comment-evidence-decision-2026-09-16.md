# Decision note: a vendor's zero-findings review result at the merge door

**Status:** RULED by the owner, 2026-09-16. Raised the same day by Zephyr guards Leeward
(281e44); the question as first put was malformed, and the record below says how.
**Retires when:** the door reads a configured vendor's completed zero-findings result as
the result it is, in `agent-tools/src/pr-watch/`.

## The owner's ruling

Verbatim, 2026-09-16: *"No findings means no problems, that IS a result, it shouldn't need
special treatment, it is a result that no further issue was found, that is a positive, why
is this causing confusion?"*

A completed review with zero findings is a **positive result**. It is not missing evidence,
not weak evidence, and not an exception needing a carve-out. The door must read it as an
ordinary review result.

## What I got wrong, recorded because the error is the useful part

I asked: *may weaker evidence settle a merge gate?* That question contains its own answer
and is the wrong question. The right one is: *what is a review result?*

GitHub's review object is a **transport** for a reviewer's result, not the result itself.
The Codex connector uses a different transport when it has nothing to report — a completion
comment naming the reviewed commit, plus a 👍 reaction. Its About text documents only the 👍;
the commit-bound comment is observed behaviour (#147, #149), not a vendor contract. Treating
the transport as the evidence turned a good result into "no evidence".

Three errors underneath that:

1. **Success looks like silence.** The door watches the channels that FINDINGS arrive on:
   review objects and threads. A zero-findings result puts nothing in those channels, so a
   clean round is indistinguishable from a vendor that never ran. This is the same generator
   already recorded that night — an empty result set read as a satisfied predicate — running
   in the opposite direction, and I did not see the inversion. "No evidence" and "evidence
   of nothing" are different states; an instrument that cannot separate them is wrong in
   both directions, not safe in one.
2. **The trust model was never stated.** I weighted "an issue comment is editable after
   posting" as decisive without naming the attacker it guards against. Anyone with write
   access to this repository can approve a pull request, dismiss reviews, or merge directly.
   The door exists to stop an AGENT settling a pull request nobody reviewed — not to stop a
   forger. Against that failure mode a configured vendor's completion comment is strong.
3. **The cost asymmetry was backwards.** Wrongly trusting the comment costs one merge with
   one vendor's review missing, the other vendor having reviewed — recoverable, and visible.
   Wrongly ignoring it stalls EVERY clean round, permanently: the door fails hardest exactly
   when the work is good. I treated the rare recoverable risk as decisive and the certain
   recurring cost as acceptable.

**Parallax failure, recorded.** With the owner asleep I consulted the Director, which was
right. But I handed over my own frame — "may weaker evidence settle a merge gate?" — and
received the answer that frame invites. Two agents, one frame, mutual reinforcement. The
different position came from the owner. A consultation inherits the asker's framing unless
the asker states the frame as a question too.

## The Director's verdict, recorded and superseded

Cauldron herds Lustre (880ff9), 2026-09-16, answered that the comment should downgrade the
refusal rather than satisfy the leg, on three grounds: a review object's commit binding is
structural and platform-made while a comment's is vendor-authored prose; an issue comment
stays editable after the fact; and the door's value is that it cannot be talked into a
merge. The reasoning is sound ON THE QUESTION AS I PUT IT. The owner's ruling replaces the
question, so the verdict does not govern. It is kept because the grounds still bound the
implementation: the preconditions below come from it.

## What the implementation should be

Not a carve-out. A reviewer's **reported result** binds a tip, and the review object and the
completion report are two transports of the same thing. The leg asks the two questions it
should always have asked: did this reviewer look at this tip, and did it report anything to
disposition. Zero findings answers the first YES and the second NO — which is a settled leg.

The preconditions are ordinary parsing hygiene, not suspicion, and each is mechanically
checkable:

1. The author is in the repository's live automatic-review configuration.
2. The comment is unedited (updated timestamp equals created timestamp), or last edited by
   its own author. Amended 2026-09-28: the connector now keeps one summary comment per pull
   request and rewrites it on every run (pull requests 264, 267 and 268). The grounds above
   guard against an edit by someone other than the reviewer; the author's own rewrite is its
   report. An edit by any other account, a deleted one included, still fails this precondition.
   `.agent/plans/delivery/landing-instruments-read-the-evidence.plan.md` records the shape.
3. It names a commit, and that abbreviated sha resolves to exactly one commit in the pull
   request's own commit list.
4. That commit is the current tip. Amended 2026-09-28: that commit binds the current tip, exactly
   or by content (the pull request's patch against the base unchanged since that commit, the
   pr-lifecycle SKILL's state machine item 3), so a pure sync never makes a clean comment stale.

A comment that fails a precondition must never read the same as no comment at all: the
refusal names WHICH precondition failed and quotes what it saw. A near-miss that reads as
silence puts the reader back where they started (Director's point, and it survives the
reframing intact).

**Amended 2026-10-27 — the third shape: a run the vendor could not complete.** The connector
over its usage quota posts no review object. It rewrites its summary's Code Review row to
**Failed**, naming the head it tried (`| 📝 **Code Review** | ⚠️ **Failed** … | `8f2b7fd` |
Manual request |`, pull requests 358 and 362, read first-hand that day), and posts a plain
comment: "Codex usage limits have been reached for code reviews. Please check with the admins
of this repo to increase the limits by adding credits." Read as it stood, the door refused
both as naming no reviewed commit, and a declaration of the vendor's unavailability could not
be proven, because its proof wanted an error review OBJECT, which the connector never posts:
a pull request the connector failed on could not reach SETTLE-READY by any path. This is the
error above in a third coat — the transport read as the evidence, and a vendor's answer read
as noise. The Failed row IS the vendor's answer: it looked at that commit and could not
review it. So the door reads the row, on preconditions 1 to 3, as the vendor's failed run on
that commit: a review whose body is the row as posted, which the error-review classifier
knows by its status word (the connector's closed vocabulary — Completed, Running, Failed —
not its message), so it satisfies no leg, is counted in the leg's detail, and proves a
declaration of unavailability on that head. The notice names no commit and reports nothing;
it is the vendor's word on its own service, so the door returns it as a notice the evidence
prints and nothing waits on. Neither is a refusal, and nothing else changed: a comment by an
expected reviewer that is not a report, a Failed or Running row, or the recorded notice is
still refused by name. A failed run is not a review, so the leg stays owed until the
checks-green timeout ends it (SETTLED-NO-REVIEW, not merge-eligible); the stand-in declared
under the 2026-09-28 ruling, now provable, is the path to SETTLE-READY.
`agent-tools/src/pr-watch/completion-comments.ts`, `completion-summary.ts`,
`vendor-error-reviews.ts` and `vendor-notices.ts` carry the readings.

## Disposition

- **#147**: landed on recorded premises at the owner's word, 2026-09-16, without waiting for
  the implementation. Copilot's leg was declared to the door; the Codex leg was the merging
  seat's own recomputation, recorded on the landing premises per the 2026-09-10 ruling.
- **The implementation**: the remaining half of slice 1 on
  `.agent/plans/delivery/landing-instruments-read-the-evidence.plan.md`. The tightening half
  (an empty-bodied review satisfies no leg and never anchors the quiet window) landed
  separately as pull request 149.

## Related surfaces

- `.agent/plans/delivery/landing-instruments-read-the-evidence.plan.md` — the sketch node
  carrying the implementation; unratified, governs no work.
- `.agent/plans/delivery/archive/review-round-predicates.plan.md` — the earlier sketch whose
  out-of-scope line prompted the consultation.
- `.agent/skills/change-custody/pr-lifecycle/SKILL-CANONICAL.md` — item 3, the canonical
  reviewer-leg definition.
- `docs/engineering/merge-bot.md` — the front door's contract.
