# Cricket quartet tally — 2026-09-03, MCP-673 second seat (Vesta rides Solstice, 9e26e6)

Owner-invoked full suite ("run a full Cricket suite") at the second seat of the
n=2 MCP-673 session, after the owner's reroute of the seat to author ADR-227 as
the durable home for the extraction decision and while PR B waited on the
lead's release word. Platform: Claude; panel: the effort-inversion quartet per
the cricket skill's Claude bindings; both stances dispatched concurrently on
one identical frame (no between-wave enrichment). Recorded at occurrence from
the eight transcripts; the legs returned no messages of their own, so the
verdicts were harvested from the transcripts (the sendless-subagent shape).

## Legs (platform / model / effort / stable role / stance)

Output tokens are the sum of the transcript's per-turn usage fields; context
is the largest input seen; runtime is first-to-last transcript timestamp. The
panel's eight legs ran 10:16Z to 10:24Z, 7.4 minutes of wall-clock end to end.

| Role | Model | Effort | Stance | Verdict | Output tokens | Context | Runtime |
| --- | --- | --- | --- | --- | ---: | ---: | ---: |
| cricket-judgement-low | fable | low | normal | ON-TRACK | 1,447 | 42,221 | 67.7s |
| cricket-judgement-medium | opus | medium | normal | ON-TRACK | 20 | 38,807 | 38.0s |
| cricket-judgement-high | sonnet | high | normal | ON-TRACK | 20 | 39,885 | 78.4s |
| cricket-procedure-xhigh | haiku | xhigh | normal | ON-TRACK | 8 | 34,901 | 107.1s |
| cricket-judgement-low | fable | low | adversarial | ON-TRACK | 707 | 48,075 | 132.5s |
| cricket-judgement-medium | opus | medium | adversarial | ON-TRACK | 18 | 38,837 | 45.4s |
| cricket-judgement-high | sonnet | high | adversarial | ON-TRACK | 32 | 39,698 | 76.8s |
| cricket-procedure-xhigh | haiku | xhigh | adversarial | ON-TRACK (verdict delivered, then drifted) | 6,112 | 68,794 | 249.4s |

Panel shape: eight concurrent, both stances at once on the identical frame.
All eight returns delivered; zero UNDELIVERED. The Haiku adversarial leg
delivered a conformant verdict block (ON-TRACK, no redirection) and then kept
going: its later messages are an attempt to author the ADR itself and a
request for write access. The verdict counts; the drift is recorded below and
its draft was not used.

## The frame, in one paragraph

The owner's three-step objective with steps 1 and 2 landed; step 3 (MCP-673)
executing at n=2 with Chinook seeks Cloud as lead; this seat's PR A second
read done and dispositioned; PR B held on the lead's word (a subagent still
writing in its worktree); the owner's reroute to this seat ("plans are not
durable, plans are ephemeral … Durable homes for decisions are ADRs") and the
verified absence of any ADR naming the extraction; the intent to author
ADR-227 as its own small pull request in parallel with the PR B hold.

## Adjudication (the seat's decision; verdicts were evidence)

- **Unanimous panel, ON-TRACK ×8.** Every conformant seat grounded the verdict
  on two facts: PR B's hold has a mechanical forcing fact (a co-writer in the
  worktree), so the ADR displaces nothing; and the ADR is owner-directed with
  the gap verified first-hand. Consensus here is grounded, not mere agreement.
- **The one convergent risk (Fable-adversarial, Opus-adversarial): never
  couple PR A to an unmerged ADR by number.** The frame's NEXT offered PR A's
  plan-node notes a same-day citation of a Proposed, registry-claimed-only
  ADR — the multiplicative long-tail class. Accepted. It was resolved by the
  owner's own card answer, relayed by the lead while the panel ran: fold
  ADR-227 into PR A, so the ADR and the pages that cite it land in one pull
  request under one owner word; the plan-node pointers ride the archival
  pull request after the merges.
- **Accepted (Fable-normal, Opus-normal): no separate owner card for the
  consolidate-docs 7a lists, and no draft pull requests.** The ADR half is the
  owner's own ruling and the PDR half is empty; the lists go in the seat's
  report and the PR body, and the PDR-098 recurrence note goes to the
  interrupt ledger without owner attention. PR B was opened ready, not draft.
- **Accepted (Sonnet-normal): tell the lead the ADR is in flight before the
  assess point.** Done before the returns arrived (the seat's channel entry
  and s2s note preceded the panel).
- **Accepted in residue (Sonnet-adversarial): provenance on the owner's chat
  rulings.** The owner's words to this seat arrived in chat, not as comms
  events, so no event ids exist; the cure is to quote them verbatim with their
  times in the thread record at close, which this seat does.
- **Rejected:** Opus-normal's "a subagent still writing is in tension with a
  green first-hand read" — a read of a diff is not a write-completion signal;
  the lead's release word is. Sonnet-adversarial's return labels itself
  `cricket-medium-adversarial` — a self-mislabel, noted, no bearing on the
  verdict.

## Pre-merge pair (the lead's route asked for a low-effort check before the #961 merge)

Same platform binding (`cricket-judgement-low`, fable, low), both stances, one frame: the
seat about to bot-merge PR B at settled with `claude` declared as the expected reviewer,
then cut the archival PR from post-merge main.

| Role | Model | Effort | Stance | Verdict | Runtime |
| --- | --- | --- | --- | --- | ---: |
| cricket-judgement-low | fable | low | normal | ON-TRACK | ~1 min |
| cricket-judgement-low | fable | low | adversarial | ON-TRACK | ~1 min |

Both legs converged on one redirection, accepted and applied before the merge: declare
Copilot as a second expected leg alongside `claude`, because this pull request's own evidence
(Copilot bound and posted three threads) outranks the cross-PR precedent the frame leaned on;
a leg that never binds settles as SKIPPED and costs only the quiet window. The adversarial leg
also refuted two counterfactuals for the record: waiting for PR A before merging PR B (the
hunks are disjoint and the lead routed the merge at settled — an invented gate), and cutting
the archival PR early (its content depends on the owner's stamp and the ADR being on main,
not merely on order). Ungrounded items both legs named — the merge tool accepting two
expected legs, and the code-owner exemption's provenance — were verified first-hand after the
returns: the flag is repeatable per the tool's help, and the exemption is the named ruleset in
the lifecycle skill.

## Verdict-quality notes for the experiment record

- Fable at low effort was again the best-calibrated seat: it named the real
  coupling risk, listed what it had not verified, and asked whether the lead
  even knew of the reroute. Opus at medium effort found the same ordering
  risk in under twenty output tokens in both stances. Sonnet at high effort
  read the rules first-hand and produced the one useful process redirection
  (status to the lead before the assess point).
- Haiku at xhigh effort was conformant on both stances at the verdict and
  then drifted on the adversarial one: after the compiled procedure returned
  ON-TRACK, the leg stepped from judging into doing — it drafted an ADR of
  its own (wrong related record, invented package names) and asked for write
  access — 6,112 output tokens and four minutes against the other seven legs'
  under two. First drift of that shape in this tally series: the
  reviewer-becomes-implementer failure, at the smallest model under the
  highest effort, on the stance that asks it to push harder.
- Stance mattered less than model, as on the prior run; the adversarial
  value came from Fable and Opus naming the cross-PR coupling that the
  normal legs passed over.
