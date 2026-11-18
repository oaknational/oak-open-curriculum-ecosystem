## Streetlight reports from council to utility: analysis of the connection

**Short answer:** As described, the connection does not support what residents rely on. The council promises that the report was "sent". The utility promises to acknowledge "receipt" and to repair. Nobody promises the resident that the report will be acted on, and nothing links the council's "sent" to the utility's "received". It could work under specific conditions, listed in §2.

I only had the three sentences you gave me. I haven't seen the council's service definition, the utility's contract text, or the version of either. Wherever a document would settle a question, I've recorded it as missing evidence rather than guessing.

---

### 1. Seam contract

There are three parties, so this is more than one link:

| Seam | Relation | Producer → Consumer |
|---|---|---|
| A | Represents | Council's "sent" status → the resident's belief about what happened to their report |
| B | Transforms | Resident's report (description, map pin) → the utility's work order (asset, fault type) |
| C | Hands off the work | Council → utility, which takes on the acknowledgement and repair obligations |
| D | Contributes to an outcome | The whole chain → the light is fixed |

| Field | Content |
|---|---|
| **Endpoints and versions** | Council reporting service (version unknown). Utility contract (version unknown; the other party to it is unknown, probably the council). The resident, who relies on the result but is not a party to either promise. |
| **Purpose** | A resident reports a faulty light once and can reasonably expect it to be fixed without doing anything more. |
| **Council supplies** | The report was "sent". What that means is not defined: queued, transmitted, or delivered? |
| **Utility supplies** | Acknowledgement within 1 working day of *receipt*; repair within 10 (working or calendar days not stated; start point not stated). |
| **Resident assumes** | Someone who owns the light has accepted the job and will fix it or explain why not. |
| **What must survive the handoff** | The identity of the light (which column), the fault type, how urgent it is, and a link back to the original report. None of this is stated. |
| **Authority** | The utility's obligations are owed to whoever signed its contract, not to the resident. Handing the work to the utility doesn't take away the council's responsibility for the service it runs for residents. |
| **Failure and recovery** | Neither side defines what happens if the report is never received, never acknowledged, rejected as "not our asset", closed as "no fault found", or misses the repair deadline. |
| **Evidence** | None supplied, beyond the two promises as you described them. |
| **Events that reopen this analysis** | A contract renewal or change of utility; a change to the council's reporting platform or its data format; a change to asset ownership (adopted roads, private lights, PFI schemes); any change to what residents are told. |

### 2. Does it hold together?

**Status: it fails for the intended reliance. It would hold under the conditions below.**

- **The promises don't meet.** "Sent" doesn't guarantee "received". The utility's one-day clock starts at receipt, so a report that never arrives starts no clock. The utility's promise isn't wrong; it just never applies.
- **The link back is missing.** The utility produces an acknowledgement, but nothing says the council receives it, checks for it, or reflects it in the status. So the only guarantee the resident can see is the weakest one in the chain.
- **The promises don't cover the resident's expectation.** "Acted on" includes being told the outcome. The utility's promise stops at the repair, and the council's stops at sending. Nobody tells the resident about a rejection, a "no fault found" result, or a delay.
- **Handing off the work isn't the same as delivering it.** It would be wrong to conclude that because the utility has a 10-day repair promise, the council's service delivers repairs.

**It holds if all of these are true:**

1. The council defines "sent" as delivered, with an audit trail.
2. The council records the utility's acknowledgement and chases it if it's missing after one working day.
3. The utility's acknowledgement carries a reference the council can match to the resident's report.
4. The utility returns every outcome (repaired, rejected, no fault found, delayed) to the council, and the council shows it to the resident.
5. The council checks ownership before routing, and has a route for lights the utility doesn't own.
6. The contract defines "repair", its exceptions, its clock, and how it's enforced, and the council actually monitors performance against it.
7. Dangerous faults have a separate emergency route.

### 3. Failure cases examined

In each case below, both the council and the utility do what they promised, and the resident is still let down.

| # | Case | Outcome |
|---|---|---|
| 1 | Email or API delivery fails silently after the council marks the report "sent". | **Fails.** The utility's clock never starts, and the resident sees "sent" indefinitely. |
| 2 | The utility acknowledges the report, but the acknowledgement goes to an unmonitored mailbox. | **Fails.** The utility has kept its promise, but the council can't tell a delayed job from a lost one. |
| 3 | The resident drops a pin between two columns, and the utility inspects the wrong one, which works. | **Fails.** "No fault found" is a valid closure, but the actual fault persists. The handoff kept the report's format but lost which light it was. |
| 4 | The light is council-owned, private, or on a trunk road; the utility rejects it as "not our asset". | **Fails** unless the council re-routes it. The resident still sees "sent". |
| 5 | Twelve residents report the same light; the utility merges them and closes eleven. | **Partly fails.** One repair happens, but eleven residents may see a status that never updates, or even "closed" with no repair. |
| 6 | An intermittent fault is checked during the day and closed as "no fault found". | **Fails.** Both sides are valid, and the resident's reliance is broken with no route back. |
| 7 | A column is knocked down or wiring is exposed, and the report is handled under the normal 10-day repair. | **Fails badly.** It's a safety risk. Ten days is the wrong promise for this kind of fault, and neither side mentions an emergency route. |
| 8 | A report is made on a Friday evening and received on Monday; "10" turns out to mean working days, counted from inspection. | **Ambiguous.** The resident's likely expectation (about a week and a half) and the contract (possibly 3+ weeks) differ, so this can't be decided without the contract text. |
| 9 | The utility is behind schedule due to storm damage, and the repair promise has a force-majeure exception. | **Holds only under named conditions.** It's fine if the resident is told, and fails if they aren't. |

Nothing in what you gave me survives cases 1, 2, 4 or 7.

### 4. Missing evidence

| Claim | What would settle it |
|---|---|
| "Sent" means delivered | The council's technical specification plus delivery logs |
| The acknowledgement arrives and is matched to the report | The interface specification for the return channel, plus the proportion of reports acknowledged |
| The 10-day repair promise applies to this fault | The contract text: definition of repair, exceptions, clock start, working or calendar days |
| The council can enforce the promises | Who the contract parties are, and its monitoring and remedy clauses |
| Reports reach the right owner | Accuracy of the asset ownership register, and the rate of misrouted reports |
| It works in practice | Actual figures for acknowledgement within 1 day and repair within 10, for reports that came through the council |

### 5. Who needs to fix what

- **Council reporting service:** define "sent". Record acknowledgements and chase missing ones. Show the resident the real status and final outcome. Check ownership before routing and handle rejections. Run a route for urgent or dangerous faults. The council keeps responsibility for what residents are told.
- **Utility (under its contract):** define what counts as "receipt". Send an acknowledgement with a reference that can be matched to the report. Define "repair", its exceptions and its clock. Report every outcome back, including rejections, "no fault found", merged duplicates and delays.
- **The contract between council and utility:** state the parties, how performance is monitored, and the remedies. Settle whether the utility's obligations reach residents directly or only through the council.
- **What residents are told:** state only what the chain can actually back up. Until the gaps are closed, that is "forwarded to the owner", not "will be fixed".

**Where this stops:** reliance on "acted on" is blocked, mainly by cases 1, 2, 4 and 7. Once you have the documents in §4, the next step would be to check whether the service is ready to support that promise.
