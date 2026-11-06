# Specification: Streetlight Repair Reporting Service

**Status:** Draft 0.1, based on three sources only
**Date:** 2026-09-27

## 0. How to read this document

Every statement carries one of these tags:

| Tag | Meaning | How much weight it bears |
|---|---|---|
| **[P]** | The proposal says so | It's what someone intends. Nobody has checked it can be done. |
| **[O]** | Seen in the one observed session | One person. It proves something can happen, not how often it happens. |
| **[U]** | In the utility's published response times | It's what the utility commits to. We don't know what it actually achieves. |
| **[I]** | My inference from the above | Needs confirming. |
| **[?]** | Unknown | An open question. Section 9 ranks them. |
| **[R]** | My recommendation | Not a requirement until someone agrees to it. |

Where no source covers a point, it's marked [?]. I haven't filled gaps with assumptions and presented them as fact.

---

## 1. Purpose

A resident reports a broken streetlight. The council forwards the report to the utility that owns the light. The resident can see what's happening to their report. **[P]**

**Out of scope, as far as we know:** the utility doing the repair itself, and any fault type other than streetlights. **[I]** The proposal only mentions streetlights. Whether the service should later cover other faults is **[?]**.

## 2. Actors

| Actor | What we know | What we don't |
|---|---|---|
| **Resident** | Reports online with a location and a photo **[P]**. At least one uses a phone **[O]**. | Whether they have to identify themselves or give contact details. Whether any non-online channel exists (phone, in person). Accessibility needs. **[?]** |
| **Council** | Receives reports and forwards each one to the owning utility within one working day **[P]**. | Whether forwarding is manual or automatic. Who does it. What happens if the council can't tell who owns the light. **[?]** |
| **Utility** | Owns lights. Publishes response times **[U]**. | Whether there is one utility or several. The proposal says "the owning utility", which suggests more than one could be involved **[I]**. Whether the utility sends status updates back to the council. **[?]** |

## 3. Evidence and its limits

1. **Proposal (2 pages).** Sets out intent. It gives no user research, volumes, costs or technical design, and doesn't say what "status" means.
2. **One observed session.** One resident, on a phone:
   - Took **11 minutes** to submit. **[O]**
   - **Gave up on the photo step twice.** **[O]** We don't know why: the interface, the camera or upload permissions, the connection, file size, or something else. **[?]** We also don't know if the report she finally submitted included a photo. **[?]**
   - Afterwards she **asked whether anyone would tell her when it was fixed.** **[O]** That fits two readings: she didn't notice or understand that she could check status, or she wants to be notified rather than having to check. Which one applies is **[?]**.
   - We can't tell if 11 minutes is typical. We don't know what she was trying to report, or anything about her circumstances.
3. **Utility response times [U].** Acknowledge within 1 working day, make safe within 2, repair within 10. We don't know:
   - when each clock starts (probably when the utility receives the report **[I]**)
   - how often the utility meets these times
   - what "make safe" means for a streetlight
   - whether these times apply to reports that come through the council.

## 4. Functional requirements

### FR-1 Submit a report
- **FR-1.1** A resident can submit a report online. **[P]**
- **FR-1.2** Submission must work on a phone. **[O]** One resident used one, so it's a real case. How big a share phones are is **[?]**.
- **FR-1.3** Target time to submit: **[?]**. The proposal gives none. The one observation (11 min) is a data point, not a baseline. **[R]** Measure it on a larger sample before setting a target. Eleven minutes is probably much longer than necessary for reporting one light, but that's an untested judgement.
- **FR-1.4** Whether a resident must identify themselves or can report anonymously: **[?]**. This determines whether FR-5 (notification) is possible at all.

### FR-2 Location
- **FR-2.1** A report includes a location. **[P]**
- **FR-2.2** How location is captured (GPS, map pin, address, a pole or asset number) is **[?]**.
- **FR-2.3** The location must be precise enough to identify the light and its owner. **[I]** The required precision, and whether the council has data that maps location to owner, are **[?]**. See FR-4.2.

### FR-3 Photo
- **FR-3.1** A report includes a photo. **[P]** Whether the photo is **mandatory** is **[?]**. The proposal's wording ("with a location and a photo") could be read either way.
- **FR-3.2** The photo step has caused failure at least once, twice in one session. **[O]**
- **FR-3.3** **[R]** Make the photo optional. Never let a failed photo upload block submission. Keep the rest of the report if the upload fails. Rationale: the photo's value to the utility is **[?]** and its cost to the resident has been observed **[O]**. Confirm the photo's value with the utility before deciding.
- **FR-3.4** What the utility uses photos for (confirming the fault, identifying the light, checking safety) is **[?]**.

### FR-4 Forwarding to the utility
- **FR-4.1** The council forwards each report to the owning utility **within one working day**. **[P]**
- **FR-4.2** How the council determines the owner is **[?]**. So is what happens when the owner is unknown, disputed, or the council itself.
- **FR-4.3** The forwarding channel (email, API, the utility's own portal) is **[?]**.
- **FR-4.4** Handling of duplicate reports of the same light is **[?]**. **[R]** Decide this before launch, because it affects status for every resident who reported that light.
- **FR-4.5** Whether reports are triaged (for example, lights down or exposed wiring treated as emergencies) is **[?]**. **[R]** Provide an urgent-hazard route that doesn't wait for the one-working-day forwarding window, even if that route is simply "call this number".

### FR-5 Status and notification
- **FR-5.1** A resident can see their report's status. **[P]**
- **FR-5.2** Which statuses exist is **[?]**. **[I]** The utility's milestones suggest these candidates: *Submitted → Forwarded → Acknowledged by utility → Made safe → Repaired* (plus *Rejected / Duplicate / Not a council or utility matter*).
- **FR-5.3** **Critical dependency:** statuses after *Forwarded* can only be shown if the utility sends updates back to the council. Whether it does, and in what form, is **[?]**. If it doesn't, the proposal's status feature can show at most *Submitted* and *Forwarded*. **[I]**
- **FR-5.4** Whether residents are **notified** when status changes (push) or must look it up (pull) is **[?]**. The proposal only says residents can "see" status. The observed resident expected to be told. **[O]** **[R]** Treat "notify on repair" as a likely requirement, subject to FR-1.4 (contact details) and FR-5.3 (updates from the utility).
- **FR-5.5** How a resident finds their report again (reference number, account, link) is **[?]**.

## 5. Timing

Assuming the utility's clocks start when it receives the forwarded report **[I]**, a report could run as follows. Day 0 is the day of submission.

| Milestone | Source | Latest (working days after submission) |
|---|---|---|
| Council forwards | [P] | 1 |
| Utility acknowledges | [U] | 2 |
| Utility makes safe | [U] | 3 |
| Utility repairs | [U] | 11 |

- **[I]** From the resident's point of view, **nothing can be confirmed as received by the owner for up to two working days**, and repair can take **over two calendar weeks**. What status the resident sees during that gap matters.
- Several questions are open **[?]**:
  - Whose working-day calendar applies (the council's or the utility's)?
  - How are reports submitted out of hours or on non-working days counted?
  - Do the utility's times run from its receipt or from the original report?
- Whether the council will monitor the utility against these times, or publish performance, is **[?]**.
- Whether the council's one-day forwarding target is itself monitored, and what happens when it's missed, is **[?]**.

## 6. Data held about a report

| Field | Status |
|---|---|
| Location | Required **[P]** |
| Photo | Required or optional: **[?]**. See FR-3 |
| Fault description | **[?]**. Not mentioned |
| Resident contact | **[?]**. See FR-1.4 |
| Owning utility | Derived by the council **[I]**. Method **[?]** |
| Status and timestamps | Implied by FR-5 and section 5 **[I]** |
| Retention period, privacy basis, who can see photos (which may show people or homes) | **[?]** |

## 7. Non-functional requirements

- **Works on a phone.** **[O]** Must.
- **Accessibility.** No source mentions it. **[?]** **[R]** A public service will need to meet the applicable accessibility standard. Confirm which one.
- **Poor connectivity.** Unknown whether it contributed to the photo failures **[?]**. **[R]** Design so a partly completed report isn't lost.
- **Volumes, availability, cost:** all **[?]**.
- **Languages:** **[?]**.

## 8. Tensions and risks visible now

1. **Photo is in the proposal, and photo is where the observed resident failed.** Either the photo step becomes optional or much more robust, or completion rates may suffer. **[I]** from n=1.
2. **The proposal promises status, but the council may not have status after forwarding.** This depends entirely on the utility sending updates (FR-5.3).
3. **The proposal offers a status page to look at; the observed resident expected to be told.** If this holds more widely, the proposed feature doesn't meet the need. **[I]** from n=1.
4. **The published times are commitments, not measurements.** If status or notifications quote them to residents, missed targets become visible and attributable.

## 9. Open questions, in priority order

1. Does the utility send status updates back to the council, and in what form? (Blocks FR-5.)
2. Is there one utility or several, and how does the council determine ownership from a location? (Blocks FR-4.)
3. Is the photo required, and what does the utility actually use it for? (Decides FR-3.)
4. Will residents give contact details, and will they be notified? (Decides FR-1.4 and FR-5.4.)
5. How are urgent hazards handled?
6. How are duplicates handled?
7. What do "make safe" and the start of each clock mean in practice, and how often are the published times met?
8. What are typical submission time and completion rate? This needs more than one observed session. Several more sessions, including attempts at the photo step on different phones, would be the cheapest way to settle FR-1.3 and FR-3.
9. Is there a non-online channel, and what accessibility, language and privacy requirements apply?

Questions 1 to 4 need answers from the utility and the council before the design can be fixed. The rest can be settled during design.
