# The council-to-utility handoff for streetlight reports

## The core problem

There are three parties, and each has a different idea of what "done" means:

| Party | What they think "done" means | Who they're accountable to |
|---|---|---|
| Council service | Report **sent** | Resident, but only for forwarding |
| Utility | Report **acknowledged** (1 working day), light **repaired** (10 working days) | Council, under contract |
| Resident | Light **fixed** | Nobody. They have no relationship with the utility. |

"Sent" is true, but it only describes something the council did. The resident reads it as "someone is dealing with it." Nobody owns the whole journey from report to working light. The council thinks its job ends at "sent". The utility's duty is owed to the council, not the resident. And the only person who notices whether the light still works is the resident, who has no way of doing anything with that knowledge.

## Where it can fail without anyone noticing

The status stays at "sent" in every one of these cases:

1. **Delivery fails.** An email bounces, an API call errors, or a mailbox isn't monitored. The council says "sent" when it was never received.
2. **Wrong owner.** Some lights belong to the council itself, a highways authority or a private estate. The utility ignores or rejects the report, and the rejection never gets back to the council.
3. **Rejected for missing data.** The asset ID is wrong or the location is too vague. The utility bounces it, and the resident still sees "sent".
4. **No acknowledgement.** The one-working-day promise only helps if someone is checking for it. If the council isn't watching for acknowledgements, a missing one is invisible.
5. **Treated as a duplicate.** The utility merges the report into an existing ticket, and the resident's reference number is lost.
6. **Repair overdue.** Day 10 passes and nobody chases it, because nobody is counting.
7. **Closed but not fixed.** The utility closes the ticket as "no fault found" or "fixed", but the light is still out. The resident has no route to reopen it.
8. **Urgent cases on the routine timescale.** A knocked-down column or exposed wiring is a safety hazard. It shouldn't wait 10 working days.

## What the contract gives you, and what it doesn't

The utility's commitments are useful because they are clear, time-bound checkpoints. The council can monitor against them. But a contractual duty to acknowledge within a day only protects residents if:
- the acknowledgement comes back in a form the council can process automatically,
- it carries the council's reference number and the utility's own reference,
- it can say "rejected, because…" as well as "accepted", and
- the council actually does something when it doesn't arrive.

Without those, the service levels exist on paper but give residents no real protection.

## Recommendations

**1. Show residents the states that actually happen.**
Submitted → Sent to [Utility] → Acknowledged (utility ref) → Repair due by [date] → Fixed / Closed ([reason])
Plus: *Not accepted: [reason], we're [re-routing / contacting you]*.

**2. Be honest about what "sent" means.** For example: "Sent to [Utility], who own this light. They aim to confirm within 1 working day and fix it within 10 working days (by [date])." This sets the right expectation and gives the resident a date to hold someone to.

**3. Have the council watch the service levels.**
- No acknowledgement by the end of the next working day: resend, then escalate to a named contact.
- No repair confirmation by day 10: chase, record the breach, and tell the resident.
- Report service-level performance as contract-management information.

**4. Close the loop.** Pass the utility's closure and its reason back to the resident. Let them say "still not working" and reopen the report under the same reference rather than starting a new one.

**5. Check routing before sending.** Match the report against an asset register of who owns which light, so wrong-owner reports are caught at the council's end and not lost at the utility.

**6. Separate urgent reports.** Put hazards like damaged columns or exposed wiring on their own route with their own response time, and possibly a phone number.

**7. Make one party answerable to the resident.** The council is the resident's point of contact, so it should own the outcome, not just the forwarding. The contract lets it pass the repair work to the utility. It doesn't let it pass on the responsibility for making sure the light gets fixed.

## In one line

The council tells residents a report was *sent*. The utility promises to *acknowledge* and *repair*. Residents assume it's *fixed*. Nothing currently connects those three. The fix is to track the utility's acknowledgement and repair deadlines, act when they're missed, and show all of it to the resident.
