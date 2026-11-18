# Council support application: value, needs, journey and story model

## 1. What's wrong with the current backlog items

| Item | As written | Problem |
|---|---|---|
| **A** | "Residents need a dashboard" | This names a solution, not a need. Nothing says what residents would use it for. |
| **B** | "Upload evidence so my support application is approved" | Uploading can't guarantee approval. Eligibility decides that, and it's policy. The real benefit is a decision made on complete information without being asked again. |
| **C** | "Fewer calls so processing is faster" | Fewer calls is a stand-in for the goal. Nobody has shown that calls slow processing, and some calls are necessary: assisted-digital users, vulnerable residents, complex cases. |
| **Prototype** | Uploads are accepted, but staff retype the contents | This is the only thing we have actually observed. Residents get to upload, but the council doesn't benefit yet, because the work has moved to caseworkers rather than gone away. |

## 2. How sure we are about each point

- **Observed**: seen in the prototype or current operations.
- **Assumed**: what the team believes, not yet validated. No resident research has happened, so every resident need below is assumed.
- **Policy**: a decision that belongs to the service or policy owner. The model leaves a placeholder and does not supply an answer.

## 3. Value model

| Who | Value | Source | Evidence |
|---|---|---|---|
| Resident | A decision on their application without avoidable delay or repeat requests | B, A | Assumed |
| Resident | Knowing where their application is and what, if anything, they need to do | A, C | Assumed |
| Caseworker | Using information residents have already provided without re-keying it | B, prototype | **Observed** (the retyping) |
| Caseworker | Less time on contact that exists only because residents lack information | C | Assumed. We don't know why people call. |
| Council | Decisions based on complete, accurately captured information | B | Assumed |
| Council | Staff time goes to assessment, not transcription or chasing | B, C | Partly observed |

Non-goals: the model does not aim to raise approval rates, and it does not aim to stop residents calling.

## 4. Needs

| ID | Need | Who | Source | Evidence |
|---|---|---|---|---|
| N1 | Know what information and documents are required before I start | Resident | B | Assumed. The list itself is **Policy**. |
| N2 | Provide what's required once, in a form I can manage | Resident | B | Assumed |
| N3 | Know my submission was received and is complete, or what's missing | Resident | B, C | Assumed |
| N4 | Know where my application is and roughly what happens next | Resident | A, C | Assumed |
| N5 | Still be able to talk to someone when I need to | Resident | C | Assumed. Protects against harm from "fewer calls". |
| N6 | Have submitted information in the case record without retyping it | Caseworker | B | **Observed** |
| N7 | Be able to check that captured information matches the source document | Caseworker | B | Assumed. Follows from N6. |
| N8 | Tell which calls are avoidable (status, missing items) and which need a person | Caseworker / service | C | Unknown. There is no call-reason data. |

## 5. Journey

| Stage | Resident | Caseworker | Needs | Items | Known pain |
|---|---|---|---|---|---|
| 1. Find out and check what's needed | Learns what to provide | none | N1 | B | none observed |
| 2. Apply and provide evidence | Fills in form, uploads documents | none | N2 | B | none observed |
| 3. Submission received | Gets confirmation (or doesn't) | Receives case | N3 | B, C | none observed |
| 4. Information captured | none | Gets data into the case record | N6, N7 | B | **Retyping (observed)** |
| 5. Missing or unclear information | Gets asked for more | Chases the resident | N2, N3 | B, C | Likely cause of calls (assumed) |
| 6. Waiting | Wonders about status | Handles contact | N4, N5, N8 | A, C | Assumed call driver |
| 7. Decision | Receives outcome | Decides under **Policy** | none | B | Outside this model's scope |

A dashboard (A) is one possible answer at stages 3 and 6. Notifications or plain status messages could meet N3 and N4 just as well. Treat A as a hypothesis to test against those needs, not as a commitment.

## 6. Stories

**S1 (B → N1).** As a resident applying for support, I want to know which documents and information are required before I start, so that I can gather them in one go.
- *AC:* The required items are shown before submission. The content comes from the policy owner (**Policy placeholder**, so the team does not write it).

**S2 (B → N2, N3).** As a resident, I want to submit my documents and get a clear confirmation of what was received, so that I know whether anything more is needed.
- *AC:* The confirmation lists what was received. The rules for when a submission counts as "complete" come from **Policy**.

**S3 (B, prototype → N6, N7).** As a caseworker, I want information from submitted documents available in the case record without retyping it, so that my time goes on assessment.
- *AC:* A defined set of fields reaches the case record without manual re-keying. Which fields is decided with the service owner. The caseworker can view the source document next to the captured values and correct them. Any correction is recorded.
- *Note:* This story is about removing re-keying. It deliberately doesn't name a technology (structured form fields, extraction, or something else).

**S4 (A, C → N4).** As a resident waiting for a decision, I want to see where my application is and whether I need to do anything, so that I don't have to contact the council to find out.
- *AC:* The stages shown match real case states. Nothing implies timescales or outcomes that **Policy** hasn't set.
- *Open question:* the channel (dashboard, messages or both) is chosen after the N4 assumption is tested.

**S5 (C → N5).** As a resident who needs help, I want to still reach a person, so that digital changes don't lock me out.
- *AC:* Contact routes stay visible at every stage. No change removes or hides assisted routes.

**S6 (C → N8).** As a service manager, I want to know the reasons people contact us, so that we can tell which calls are avoidable.
- *AC:* Call reasons are recorded in categories agreed with the contact team. The measure is avoidable contact, not total calls.

## 7. How the original items map to the model

| Original | Value | Needs | Stories | What changed |
|---|---|---|---|---|
| **A** | Know status and next step | N3, N4 | S2, S4 | Dashboard became a candidate solution for a stated need |
| **B** | Complete decision without repeat requests; no re-keying | N1, N2, N3, N6, N7 | S1, S2, S3 | "Approved" removed; the caseworker side of uploads added |
| **C** | Staff time on assessment; fewer avoidable contacts | N4, N5, N8 | S4, S5, S6 | "Fewer calls" became "avoidable contact", with a safeguard for residents who need a person |

## 8. Assumptions and decisions for the owners

These are recorded for the owners to deal with. They are not research tasks being commissioned.

**Assumptions (not yet validated):**
- Residents call mainly about status or missing items (behind S4 and S6).
- Residents would use a self-serve status view (behind A and S4).
- Missing or unclear evidence causes rework (behind S1 and S2).

**Policy decisions (for the policy owner, not the team):**
- The required evidence list.
- The rules for when a submission is complete.
- Decision timescales.
- Which captured fields are authoritative.

**Recommended priority:** S3 comes first. It is the only story backed by observed evidence, and without it uploads don't deliver value to anyone. S1 and S2 come next. S4 waits until the reasons people call are understood.
