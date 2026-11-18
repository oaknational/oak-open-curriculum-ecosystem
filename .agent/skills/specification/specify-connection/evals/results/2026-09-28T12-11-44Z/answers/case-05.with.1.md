# Seam analysis: resident reports forwarded by the council to the streetlight utility

**Headline:** As things stand, the connection does not support what residents rely on. The council's "sent" only means the report left the council. The utility's promises start when the utility receives the report. Nobody is responsible for the gap between the two, or for telling the resident what happened next.

I worked only from your description; I didn't have either document. So the revisions of both endpoints are unknown, and every point below that depends on wording should be checked against the actual service text and contract.

## 1. Endpoints, relation and reliance

| | |
|---|---|
| **Producer / delegator** | The council's streetlight reporting service. Revision unknown. |
| **Provider** | The utility's streetlight maintenance contract. Revision and counterparty unknown. |
| **Relation** | The council **delegates** the fault to the utility and **transforms** the resident's report into a utility work request. The resident's outcome **depends on** both. |
| **Intended reliance** | A resident reports a faulty light once and assumes it will be acted on, without chasing anyone. |
| **Entry question** | Does the council's "sent" plus the utility's acknowledge-in-1 / repair-in-10 give the resident "acted on"? |
| **Stopping condition** | That reliance is either supported, blocked by a named finding, or limited by a named unknown. |

## 2. What each party provides and assumes

**Council supplies:** a status of "sent". Its record says nothing about:
- delivery confirmation;
- checking who owns the light;
- what happens when the utility rejects a report or never acknowledges it;
- whether the resident gets any update after "sent".

Those gaps are findings, not things to assume.

**Utility supplies:** an acknowledgement within 1 working day and a repair within 10. This is presumably measured from receipt and only for valid reports on its own assets. The record doesn't say:
- who the acknowledgement goes to;
- whether exceptions pause the clock (network faults, access, permits);
- how it handles reports it rejects;
- whether it notifies anyone when the repair is done;
- whether reports forwarded by the council are covered by the contract.

**Resident assumes:**
- the right party received the report;
- someone will make sure it gets done;
- they will hear if it doesn't.

**Council implicitly assumes:** that forwarding the report hands over responsibility for it.

## 3. Composition test

- **Implication fails.** "Sent" does not mean received, accepted or repaired. The utility's clock only starts at receipt, and nothing the council promises establishes receipt.
- **Reachability is unknown.** Does the contract name the council's channel as a valid source of reports? If the contract is between the utility and, say, the highways authority or a regulator, the council may have no power to enforce the 10-day term. The resident certainly has none.
- **Responsibility for the gap is missing:**
  - nobody is named as watching the 1-day acknowledgement deadline;
  - there is no escalation route;
  - nobody has the job of closing the loop with the resident.
- **Composition effects:**
  - duplicate reports (several residents, or a resident who reports again directly to the utility);
  - a single point of failure in the forwarding channel (a mailbox or API);
  - "working days" versus the calendar days residents count;
  - version drift if the utility changes its intake address or format.

## 4. Meaning, effects, authority, failure, change

- **Transformation:** the report has to keep its meaning when it's converted:
  - The location (the resident's description or map pin) must map to the utility's asset ID.
  - The type of fault must survive, and so must urgency. A light that's out is different from a knocked-down column or exposed wiring.
  - A report in the right format is not the same as one that locates the right column.
- **Personal data:** passing the resident's contact details on needs a data-sharing basis, or the details must be removed. If they're removed, the utility can't contact the resident.
- **Authority:** forwarding a report gives the council no power to direct the repair. Whoever holds the contract is the one who can enforce it.
- **Failure and recovery:** undefined on both sides. There's no defined outcome for a delivery failure, a rejection, or a missed acknowledgement or repair deadline.
- **Things that reopen this analysis:**
  - a new contract revision or change to its SLA;
  - a change to the utility's intake channel;
  - a change to the council's status wording;
  - a change in who owns the lights;
  - new resident-facing promises.

## 5. Counterexamples: each side valid, the pair fails

| # | Case | Outcome |
|---|---|---|
| 1 | The email or API call fails after the council records "sent". | Fails silently. The utility never started its clock and the resident waits indefinitely. |
| 2 | The light belongs to someone else (private owner, highways authority, another utility). The utility rejects it correctly. | Fails. The rejection doesn't reach the resident, and the council has no step for re-routing it. |
| 3 | The utility sends its acknowledgement to a council mailbox nobody reads. | Both sides comply, yet no one notices the next failure. |
| 4 | A missed acknowledgement after 1 working day. | Fails. Nobody is watching the deadline, so there's no escalation. |
| 5 | The repair needs network work, so a contract exception pauses the 10 days. | The contract is honoured, but the resident's expectation fails and nobody tells them. |
| 6 | Location is lost in mapping, so the utility inspects the wrong column and closes it as "no fault found". | Both records show the job as completed. The light is still out. |
| 7 | Exposed wiring goes through the 10-day route. | A safety failure. There's no urgency path. |
| 8 | Forty residents report the same outage. | Either duplicate jobs or merged ones. If merged, 39 residents never hear an outcome. |
| 9 | The utility changes its intake address and the council keeps using the old one. | Same as case 1, but systematic. |

The seam survives none of these under the obligations as described.

## 6. Compatibility status

**It fails for the intended reliance as stated.** It would **hold under named conditions** if all of these were true:
1. Forwarding produces a delivery receipt and a utility reference number.
2. The council checks for an acknowledgement within 1 working day and escalates if there isn't one.
3. The utility returns rejections with reasons, and the council re-routes or tells the resident.
4. Completion or exception status comes back to the resident.
5. Ownership is checked before forwarding.
6. Emergencies use a separate urgent route.
7. The contract covers council-forwarded reports and names who enforces it.

## 7. Evidence missing

- The exact contract text, its revision and its counterparty. This decides reachability and enforcement.
- The council service specification and how reports are actually transmitted. This decides whether "sent" is the same as "delivered".
- Delivery failure rate and acknowledgement timeliness for forwarded reports. This tests counterexamples 1, 3 and 4.
- Rejection rate and accuracy of the ownership data. This tests counterexample 2.
- How often repairs miss the 10 days and which exceptions were used. This tests counterexample 5.
- Location accuracy and the rate of "no fault found" closures. This tests counterexample 6.

## 8. Changes needed from each party

- **Council service:**
  - Define "sent" precisely, or change the wording. For example: "forwarded to [utility]; they aim to acknowledge within 1 working day and repair within 10."
  - Own watching the acknowledgement deadline and escalating.
  - Pass rejections and outcomes back to the resident.
  - Check ownership before forwarding.
  - Provide an emergency route.
  - Establish a legal basis for sharing the resident's data.
- **Utility:**
  - Send the acknowledgement to the original sender, with a reference.
  - Define rejection behaviour and reasons.
  - Notify on completion.
  - Publish the exceptions that pause the 10 days.
  - Say what it needs to identify a location.
- **Contract owner:** confirm that council-forwarded reports are covered, and name who enforces the SLA.
- **Resident-facing promise:** state what residents can actually rely on. Today that's only "we passed it on".

The first two sets of changes are wording and design work on each endpoint's own specification. Deciding whether the repaired seam is ready for residents to rely on is a separate judgement, to be made against the evidence in section 7.
