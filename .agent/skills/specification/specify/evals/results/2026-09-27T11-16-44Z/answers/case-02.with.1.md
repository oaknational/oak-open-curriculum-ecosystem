# Specification: Streetlight Fault Reporting Service

**Revision:** 0.1 (draft, created 2026-09-27)
**Location:** this response only. Nothing has been saved to a file.
**Ready for:** discussion. It is **not ready for implementation**, because three blocking unknowns remain (§6).

---

## 1. Subject, scope and sources

**Subject:** a public online service where a resident reports a broken streetlight. The council forwards the report to the utility that owns the light, and the resident can see how the report is progressing.

**In scope:** the report from the resident, the council's forwarding, what the resident sees, and where the council's part meets the utility's.
**Out of scope:** how the utility actually repairs the light.

Each source says a different kind of thing, and the labels used below follow from that:

| Label | Source | What kind of claim it is | Limits |
|---|---|---|---|
| **[P]** | Two-page proposal | What the council intends | We don't know if it has been approved. Its statements are intentions, not adopted obligations. |
| **[S]** | One observed session | Something one person did | One resident, on a phone. It shows problems can happen, not how often. |
| **[U]** | Utility's published response times | The utility's own public commitments | They bind the utility, not the council. Published targets aren't the same as achieved times. We don't know when each clock starts. |
| **[I]** | Inference in this spec | Something the sources imply or require | Needs confirming. |
| **[?]** | None | Unknown | Handled in §6. |

---

## 2. Cases

**C1: success.** A resident sees a light that is out. On a phone, they give the location and a photo, and get a report reference [I]. Within one working day the council sends the report to the owning utility [P]. The utility acknowledges within one working day of receiving it [U], makes the light safe within two working days [U] and repairs it within ten [U]. At any point the resident can see the report's status [P], and they learn that it has been fixed [? whether by being told or by checking].

**Adverse cases:**

- **C2: photo fails.** The upload fails or the resident can't manage it. This was seen twice in one session [S]. What happens next is unknown: does the report go without a photo, or is it abandoned?
- **C3: slow submission.** Submitting takes 11 minutes [S]. There is no target, so we can't say whether that's acceptable.
- **C4: resident expects to be told.** The resident thinks they'll be notified when the light is fixed, but the service only lets them look up status [P vs S].
- **C5: owner can't be identified.** The light belongs to the council, is private, or its owner is unknown [?].
- **C6: dangerous fault.** For example, exposed wiring or a fallen column. The report arrives out of hours and waits up to one working day before it is forwarded [? safety].
- **C7: many reports of one fault.** Several residents report the same light [?].
- **C8: forwarding fails.** The channel to the utility is down, or the utility never acknowledges [?].
- **C9: no online access.** The resident can't use an online service [?].
- **C10: stale status.** The utility has fixed the light but the council's status still says "forwarded" [? no feed back from the utility is known].

---

## 3. Obligations

Each obligation reads: *condition → responsible party → behaviour → bounds → failure behaviour → evidence*.

**O1. Accept a report** [P, challenged by S]
When a resident submits a report, the service must record a location that is precise enough for the utility to find the light [bound ?]. It must also record a photo if the photo is required.
- **Open design choice (not resolved here; both options kept):**
  - (a) Photo required, as the proposal says.
  - (b) Photo optional, because C2 shows it can block a report.
  - What would settle it: whether utilities need photos to find or sort faults, and how many people drop out at the photo step.
- **If submission fails:** the resident is told the report wasn't submitted, and what they have entered is kept [I].
- **Evidence:** usability testing on phones with more than one participant, and drop-out counts at each step once the service is live.

**O2. Give the resident a reference** [I]
When a report is accepted, the service must show the resident a reference and confirm receipt. "See their report's status" [P] only works if the report can be identified. Whether residents give contact details is unknown (§6, U4).

**O3. Forward within one working day** [P]
The council must forward each accepted report to the owning utility within one working day. None of the key terms are defined yet:
- when the clock starts (submission time?)
- whose working-day calendar applies
- whether "forwarded" means sent or received by the utility
- what counts as a breach, and who acts on it

**If forwarding fails (C8):** the service keeps trying and escalates to named council staff [? who]. The resident's status must not say "forwarded" until the report has actually been sent [I].

**Evidence:** timestamps from submission to forwarding across all reports, with results reported by percentile against the one-day limit.

**O4. Identify the owner** [?]
The council must identify the owning utility for each report. How it does this is unknown. For C5, what happens is unknown. It must not be silently dropped.

**O5. Show status** [P]
When a resident has a reference, they must be able to see the report's current status. The list of statuses is undefined. The council can only honestly show "received" and "forwarded". Showing any later status (acknowledged, made safe, repaired) depends on the utility sending updates back, which no source mentions (§5).
- **Must not:** show a status the council hasn't received from the utility, or show an expected date as if the council had promised it [I].

**O6. Tell the resident when it's fixed** [? not in proposal]
The proposal only lets residents look up status. The observed resident asked to be told [S], but that is one request. Adding notification changes the proposal, needs council authority, and depends on U4 and on the utility sending updates back.

**O7. Utility response times** [U, belong to the utility]

| Stage | Limit | When the clock starts |
|---|---|---|
| Acknowledge | 1 working day | Utility receives the report [?, assumed] |
| Make safe | 2 working days | Unknown: receipt or acknowledgement? |
| Repair | 10 working days | Unknown |

- If the clocks run one after another from the utility receiving the report, a resident could wait up to about 11 working days from submitting to repair. It could be more if "make safe" and "repair" are counted separately. This is not known.
- "Make safe" isn't defined for an unlit streetlight. For a light that is simply out, it may mean nothing.
- The council may *display* these as the utility's published targets. It must not present them as council commitments.

**O8. Dangerous faults** [? absent from all sources]
The service must not be the only route for a dangerous fault (C6). What the alternative is, is unknown. **This blocks deployment** (U1).

---

## 4. What is left open, and what no one may rely on

- **Left open:** the interface design, the technology, how the council sends reports to the utility, and how many steps the form has. None is fixed by any source.
- **No one may rely on:**
  - the service notifying residents (unless O6 is adopted)
  - the displayed status being more current than the latest update from the utility
  - utility times being council guarantees
  - submission taking any particular time, since there is no target

---

## 5. The council–utility boundary (the main dependency)

| Side | What we know |
|---|---|
| Council → utility | Forward within 1 working day [P]. Format and channel unknown. |
| Utility → council | Acknowledgement is published [U], but **who it goes to is unknown**. Any update on "made safe" or "repaired" going back to the council is **unknown and not in any source**. |

O5 (status beyond "forwarded"), O6 (notification) and C10 (stale status) all depend on the utility sending updates back. **Recommend handing this off to `specify-connection`**, with both sides named and the intended use: "the resident sees accurate status through to repair".

---

## 6. Unknowns and how each is handled

| # | Unknown | Handling | What it affects |
|---|---|---|---|
| U1 | Route for dangerous faults (C6, O8) | **Blocks** deployment | Public safety |
| U2 | Whether the utility sends status updates back (§5) | **Blocks** implementation of O5 beyond "forwarded" | O5, O6, C10 |
| U3 | How the owner is identified, and what happens for lights no utility owns (O4, C5) | **Blocks** implementation of O3 | Every report |
| U4 | Contact details: collected, optional, or none | Short investigation with the council, as a design decision | O2, O6, privacy |
| U5 | Photo required or optional (O1) | Short investigation: ask utilities if they use photos, and test with 5+ phone users | Drop-outs |
| U6 | When each clock starts, and whose working-day calendar applies (O3, O7) | Short investigation: ask the utility and the council | What residents are told about timing |
| U7 | Duplicate reports (C7) | Short investigation | Utility workload, status per resident |
| U8 | Non-online channel (C9) | Council decision; may be an equality duty | Who is excluded |
| U9 | Keeping and deleting photos and locations, and the privacy of people in photos | Council decision (data protection) | O1 |
| U10 | Whether the proposal has been approved | Confirm with the council | Whether [P] items are obligations or proposals |
| U11 | Target time to submit a report | Accept as an unknown for now, if the council agrees. Measure once live before setting a target. | C3 |

I've accepted no unknown on the council's behalf. Only the council can accept U8, U9 and U11.

---

## 7. Evidence we have and evidence we need

- **Have:**
  - one observed session (shows problems exist, not how often)
  - the utility's published targets (not how it actually performs)
  - the proposal's stated intent
- **Need:**
  - Phone usability testing with several residents, including people with access needs, recording where they drop out. Expected results must come from what residents need, not from how the build behaves.
  - Forwarding timestamps checked against O3.
  - The utility's actual response-time performance, not just its published targets.
  - A check comparing the status the council shows against the utility's records (C10).
- **Won't prove:** none of this shows the service is worth having for residents. That is a separate question (`user-value`).

---

## Summary

**Known from sources:**
- the report contents, the one-day forwarding limit and status lookup (from the proposal, though we don't know if it was approved)
- the utility's three published times (utility commitments, and we don't know when the clocks start)
- one resident's trouble with the photo step, and their wish to be told when it's fixed

**Inferred:** the report reference, the rule against showing status the council hasn't received, and keeping what a resident has entered when submission fails.

**Unknown and blocking:**
- a route for dangerous faults
- whether the utility sends status updates back
- how the owner is identified

**Handoffs:**
- the council–utility boundary → `specify-connection`
- once U1–U3 are resolved → `assess-specification`, for implementation readiness
- whether residents would use and value it → `user-value`
