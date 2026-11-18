# The council–utility handoff: what "sent" promises and what residents rely on

**The main problem:** three parties each think of the report differently, and nobody checks that those views match.

| Party | What it thinks the report is | What it treats as "done" |
|---|---|---|
| Council | A message to forward | "Sent" (transmitted) |
| Utility | A contractual work item | Acknowledged within 1 working day, repaired within 10 |
| Resident | A request for a working light | Light fixed |

The council's status covers the least of the three, but residents read it as covering the most. "Sent" is true once the council has done its part. Residents tend to read it as "handled".

## Where the chain breaks

1. **Sent but never received.** The utility's promise only starts when it receives the report. Anything lost in transit is covered by nobody: the email bounces, the API rejects it, it lands in the wrong queue, the asset ID is wrong. The council shows "sent", the utility has no record, and the resident waits indefinitely.

2. **Nobody watches for the acknowledgement.** The utility commits to acknowledge within one working day, but nothing suggests the council checks for that acknowledgement or acts when it doesn't arrive. That turns the most useful check in the chain into a dead letter. A missing acknowledgement is the earliest and cheapest sign of failure, and nobody is looking for it.

3. **Nothing comes back after sending.** Repair and closure, and any rejections ("not our asset", "duplicate", "can't locate"), stay on the utility's side. The council's status freezes at "sent", so the resident can't tell a light that's queued from one that's been rejected or forgotten.

4. **Nobody tracks the deadlines.** Ten working days is a contractual commitment, but nothing described here measures it. No party is placed to notice or chase a breach, so the SLA can't be enforced in practice. Residents also don't know the timescale, so they either report again (duplicates) or give up.

5. **Unclear ownership of the resident.** The resident reported to the council, but the council's involvement effectively ends at forwarding. If the light is still out on day 15, it isn't clear who the resident should contact or who is accountable.

6. **Awkward cases.** Examples: lights the utility doesn't own (private, highways authority, or other assets), several reports about the same fault, faults that come back after "repair", and safety-critical faults such as exposed wiring or a knocked-down column. Those need a faster route than ten days.

## What would close the gaps

- **Treat the utility's acknowledgement as the real handoff.** Track separate states: sent → acknowledged → scheduled/rejected → repaired. Don't let "sent" stand in for the others.
- **Alert when the acknowledgement is late.** If none arrives within one working day, the council retries or escalates. This one control catches most lost reports.
- **Carry the utility's reference and status back to the council.** Surface it to residents, even if it's only acknowledged / rejected (with reason) / fixed.
- **Tell residents the real promise.** For example: "Forwarded to [utility]. They aim to repair within 10 working days. We'll update you." That sets the expectation to match the contract.
- **Track breaches of the 10-day deadline and assign an owner.** Someone at the council chases them and reports on them in contract reviews.
- **Route rejections back to the council.** Wrong owner or can't locate should come back for re-routing or a question to the resident, not disappear.
- **Add a fast lane for dangerous faults** that bypasses the standard SLA.
- **Pick a single point of contact** so the resident always knows who to ask.

## Bottom line

The handoff is designed around transmission, but residents are relying on the outcome. The utility's acknowledgement commitment is the piece that could link the two, and right now nobody uses it. Until acknowledgement and outcome flow back to the council, "sent" tells the resident very little and the council can't check whether the contract is being met.

*I've assumed the scenario as described: no existing acknowledgement handling or status feedback. If the council already receives acknowledgements or repair notices, the question becomes whether they're checked and shown to residents, rather than whether they exist.*
