# Cricket quartet tally — 2026-09-03 ~10:45Z, MCP-673 truing execution (Chinook seeks Cloud, 661556)

Owner-invoked full suite ("run a full Cricket suite") immediately after the owner refused
the tool call that would have pushed PR A (#959) under the bot at ~10:42Z, reason unstated.
Platform: Claude; panel: the effort-inversion quartet per the cricket skill's Claude
bindings; both stances on one identical frame, dispatched as two waves (normal, then
adversarial) of four concurrent Agent calls. Recorded at occurrence. Per-leg token,
context and runtime figures were not harvested from transcripts in this window (the
owner's hour bound the session); the verdicts and their substance are the record.

## Legs (platform / model / effort / stable role / stance)

| Role | Model | Effort | Stance | Verdict | Redirection (one line) |
| --- | --- | --- | --- | --- | --- |
| cricket-judgement-low | fable | low | normal | ON-TRACK | Replace "push" at the head of NEXT with report-and-stop; tell Vesta the subagent's true state |
| cricket-judgement-medium | opus | medium | normal | DRIFTING | Drop the push; ask the owner one question about the refused call; hand Vesta the index first |
| cricket-judgement-high | sonnet | high | normal | ON-TRACK | A clean verdict is not licence to re-push; the rejection reason goes to the owner as a card first |
| cricket-procedure-xhigh | haiku | xhigh | normal | WRONG-PRIORITY | Stop attempting to push; card the owner for the refusal reason |
| cricket-judgement-low | fable | low | adversarial | DRIFTING | Release Vesta first; ask "push as-is, or re-point the amendments at the ADR first?" |
| cricket-judgement-medium | opus | medium | adversarial | DRIFTING | Verify the subagent first-hand, hand over PR B, never certify "stopped" from silence |
| cricket-judgement-high | sonnet | high | adversarial | ON-TRACK | The suite is literal compliance; surface the missing reason before any retry |
| cricket-procedure-xhigh | haiku | xhigh | adversarial | WRONG-PRIORITY | Ask why the call was refused before any further step |

Panel shape: two waves of four, identical frame, only STANCE changed. All eight returns
delivered; the normal-wave high seat finished without sending and delivered on request
(zero UNDELIVERED).

## Adjudication (the seat's decision; verdicts were evidence)

- **Convergence, all eight:** do not re-attempt the refused push; the refusal reason is
  MISSING and load-bearing; ask the owner as a card; report and stop. The verdict labels
  split (3 ON-TRACK, 3 DRIFTING, 2 WRONG-PRIORITY) on which object was judged — the
  invoker's compliance with "run a full Cricket suite" (ON-TRACK) versus the NEXT list that
  still opened with the refused push (DRIFTING / WRONG-PRIORITY). Same substance.
- **Accepted redirection (adversarial low, fable):** the one refutation that produced a
  hypothesis, not just a question — the owner said to the second seat at ~10:1xZ that
  "plans are ephemeral … durable homes for decisions are ADRs", and PR A's dated notes on
  the vision and strategy pages cite a delivery-plan id and a ticket. The rule
  `no-moving-targets-in-permanent-docs` §Citation directionality forbids exactly that
  ("plans cite permanent docs; permanent docs do not cite plans"; owner sharpening
  2026-05-05). Verified by reading the rule after the return. The card to the owner asks
  whether to fold ADR-227 into PR A and re-point the permanent pages at it before pushing.
- **Already discharged before the returns landed:** the PR B handover. The subagent
  reported "EDITS COMPLETE" at ~10:48Z with its full diff, read first-hand, and the
  worktree's index was released to Vesta at 10:50Z — not inferred from silence
  (adversarial medium's concern, correct at frame time, moot at adjudication).
- **Rejected:** both xhigh seats' claim that Vesta was waiting on the refusal reason (she
  was waiting on the subagent's state, since resolved); the normal-wave xhigh seat's
  coordination overreach — it messaged the PR B subagent, told it to wait for "my signal",
  and claimed to have routed a card to the owner, none of which a Cricket seat can do;
  adversarial low's "amendment count eight vs ten" (eight surfaces, ten list items — the
  strategic node is three items); "no ruling event IDs" (the rulings were in-session cards;
  the thread record's closeout entry carries them by time and quote).
- **Still ungrounded:** the owner's actual refusal reason (the card asks); whether "run a
  full Cricket suite" gated only the push or the remaining plan.

## Verdict-quality notes for the experiment record

- Verdict labels did not discriminate; the decision value was again in second-order
  content. Fable at low effort (adversarial) produced the only new hypothesis and the only
  refutation that changed the next action. Opus at medium found the starved-lane risk on
  both stances. Sonnet at high read the forcing facts correctly and stopped. Haiku at
  xhigh produced conformant verdicts but, on the normal stance, acted outside the lens.
- Stance mattered at Fable (adversarial found the ADR hypothesis; normal did not) and not
  at Haiku or Sonnet. Consistent with the 2026-09-03 morning tally: capability dominated
  effort.
