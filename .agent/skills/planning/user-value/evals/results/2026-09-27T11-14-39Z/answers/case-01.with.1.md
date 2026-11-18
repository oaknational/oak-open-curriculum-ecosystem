I've reworked A, B and C into a value, needs, journey and story model. I didn't write it to a file, because the repo has no backlog documents to update.

**How much of this is evidence:**
- **Only one thing has been observed:** the prototype accepts uploads, and staff then retype what's in them. That is the team's report about the prototype, not about a live service.
- **Everything about residents is a guess to be tested.** No resident research has happened.
- **Some rules must come from the council, not from me:** what evidence is required, who is eligible, what happens after a decision, what residents can be told about their case, and how documents are kept. I've listed these as questions for the council. I have not filled them in.

---

## 1. What the original items actually are

| Item | What it is | Problem |
|---|---|---|
| **A** "residents need a dashboard" | A proposed solution presented as a need | It doesn't say what the dashboard is for. |
| **B** "upload evidence so my application is approved" | A response plus an outcome | Approval depends on the council's decision under its rules, not on uploading. It also mixes three needs: knowing what to send, sending it, and knowing it arrived and can be used. |
| **C** "fewer calls so processing is faster" | A council target plus a guess about cause and effect | Fewer calls is a measure, not a caseworker need. Some calls are residents who genuinely need help. The problem we can actually see, retyping, isn't mentioned. |

**Aim of the service (my reading of C; the council needs to confirm it):** P1. Support applications are assessed accurately and on time, and residents can take part without needless effort.

**What the service could offer (a proposal, not a finding):** residents applying for support get:
- clear guidance on what evidence to provide;
- a way to provide it that suits them, with confirmation it was received;
- a truthful view of where their application stands.

Caseworkers get evidence they can assess without retyping it. **The service does not promise approval.**

## 2. Needs

All of these are guesses to be tested unless marked otherwise.

| ID | Who | Need (their goal and why) | From | Evidence status |
|---|---|---|---|---|
| N1 | Resident who has applied | Know where the application stands and whether they need to do anything, so they can plan and don't have to chase | A, B | Guess |
| N2 | Resident preparing to apply | Know which evidence applies to their situation and what forms are accepted, so they provide it once | B | Guess; also depends on council rules (Q1) |
| N3 | Resident submitting | Provide evidence in a way they can manage, and know it was received and can be used | B | Guess |
| N4 | Resident who can't upload or doesn't have the documents | A different route or help, so they aren't shut out | B | Guess. It's a known risk of upload-only services, but not researched here |
| N5 | Caseworker | Assess submitted evidence without re-entering it, so their time goes on assessment and copying errors are avoided | C | **Observed in the prototype** (retyping) |
| N6 | Caseworker | Spend less time on calls that only exist because residents lack information, while residents who need help can still reach someone | C | Guess; the mix of call reasons is unknown |

The table leaves out the **decision itself and what happens afterwards**, such as any review route. There's no council source for either, so these are marked as gaps rather than written as needs.

## 3. Proposed journey J1: applying for support with evidence

Every stage below is a proposal except the one marked *observed*.

| Stage | What happens | Needs | Channels and people | Unsuccessful endings and recovery | Open questions |
|---|---|---|---|---|---|
| 0. Trigger | A change in circumstances leads the resident to look for support | – | Word of mouth, advisers, council website | Never finds out about the support | How do people arrive? |
| 1. Check if it applies | Resident works out whether to apply | N2 | Web, phone, advice organisations | Gives up because it's unclear | Q1 |
| 2. Gather evidence | Resident collects documents, some held by others (employer, landlord) | N2, N4 | Other organisations | Document missing or delayed | Which documents cause trouble? |
| 3. Submit | Resident uploads, or uses another route | N3, N4 | Upload, post, in person, with help | Upload fails; wrong file; no device | Share of each channel |
| 4. Acknowledgement | Resident is told what was received | N3, N1 | Email, SMS, web | Nothing received; resident can't tell if it worked, so calls | – |
| 5. Wait | Resident waits for a decision | N1, N6 | Status view, phone | Status unclear, so calls | Q3 |
| 6. Council checks evidence | **Observed in the prototype:** staff retype uploaded contents | N5 | Case system | Copying errors; delay | Why is retyping needed: missing data fields, or the documents can't be viewed in the case system? |
| 7. More information needed | Council asks resident for more | N1, N2, N3 | Letter, email, web | Request missed; loops back to stage 2 | – |
| 8. Decision and after | Outcome is communicated | N1 | – | **Gap:** what follows is a council rule | Q4 |

Unsuccessful endings the service must handle honestly:
- the person who never gets in (stage 0 or 1);
- the person who stops at stage 2 or 3;
- the person refused at stage 8.

A clear, truthful message about a blocked ending is useful, but it doesn't count as a completed application.

## 4. Stories

These are all candidates. None is ready yet.

**S-B3: caseworker can use evidence without retyping it** (from C and B)
- **Change:** a caseworker assessing a case can see each uploaded item attached to the case record. They no longer retype the document itself.
- **Addresses:** N5, stage 6.
- **Acceptance:**
  - Uploaded items can be opened from the case record.
  - Each item is linked to the right applicant and case.
  - A caseworker can finish an assessment of a sample case without re-entering document contents.
- **How to check:** watch caseworkers using real case types.
- **Dependency:** a working link to the case system. If the system needs structured data fields, pulling out only those fields is a separate story, S-B3b. It stays conditional until we know why retyping happens.
- **To decide before it's ready:** what drives retyping, and the council's rules on handling documents (Q5).
- **Why first:** it's the only problem we've actually seen, and caseworkers are available to observe.

**S-B2: resident gets a receipt for what they sent** (from B)
- **Change:** after submitting, the resident gets confirmation listing each item received.
- **Addresses:** N3 and N1, stages 3 and 4.
- **Builds on:** the existing upload feature in the prototype.
- **Acceptance:**
  - The confirmation lists exactly what was stored.
  - A failed upload is reported clearly, with a way to retry or use another route.
  - Nothing is silently lost.

**S-B1: resident knows which evidence applies** (from B)
- **Change:** before applying, the resident sees which evidence is needed for their situation.
- **Addresses:** N2, stages 1 and 2.
- **Blocked by:** the council's source for evidence requirements (Q1). **I have not drafted requirement content.**

**S-B4: resident is told when evidence can't be used, and what to do** (from B)
- **Addresses:** N1, N2 and N3, stage 7.
- **Consequential failure:** a request the resident doesn't see must not quietly stall the case.

**S-B5: evidence from other routes lands in the same place** (from B and C)
- **Change:** evidence sent by post or in person is recorded on the case the same way as uploads, for example scanned by staff.
- **Addresses:** N4 and N5.
- **Why it matters:** without it, the non-digital route is likely to be treated worse than the upload route.

**S-A1: resident can see their status and anything outstanding** (from A)
- **Change:** a resident who has applied can see the current stage of their application and any action they need to take.
- **Addresses:** N1, stages 5 and 7.
- **Channel:** web page, SMS or email is left open. A "dashboard" is one option, not the requirement.
- **Needs from the council:** a defined list of stages and what residents may be told (Q3).
- **Acceptance:** what the resident sees matches the case record, and there are no stale or false "approved" signals.

**S-C1: caseworker sees what the resident sees** (from C)
- **Change:** on a call, a caseworker can see the same status and outstanding actions the resident sees, so answers are consistent.
- **Addresses:** N6. **Depends on:** S-A1.

## 5. Where A, B and C went

| Original | What happened | Replaced by | Why |
|---|---|---|---|
| A | Refined | N1, S-A1 (S-C1 follows from it) | The underlying need is visibility of status. "Dashboard" is kept as one possible channel, not required. |
| B | Split | N2, N3, N4; S-B1, S-B2, S-B4, S-B5 (shared S-B3) | Three separate needs. "So approved" dropped, because approval is a council decision. |
| C | Split | N5, N6; S-B3, S-C1; outcome guess H1 | Replaced a target with caseworker needs. Added the observed retyping problem. "Fewer calls" kept as a measure, not a goal. |

**How much each need is covered by a story:**

| Need | Status | Stories |
|---|---|---|
| N1 | Covered | S-A1, S-B2, S-B4 |
| N2 | Blocked | S-B1, waiting on Q1 |
| N3 | Covered | S-B2 |
| N4 | Partly covered | S-B5 only; help with *using* the service is a gap |
| N5 | Covered | S-B3 |
| N6 | Partly covered | S-C1, plus H1 |
| Decision and after | **Gap** | – |

## 6. Outcomes: guesses, not claims

- **H1:** S-A1, S-B2 and S-B4 may reduce calls that only happen because residents lack information.
  - **Other explanations:** seasonal demand, changes to the rules, letters.
  - **Risk:** fewer calls could also mean people who need help have stopped calling.
  - **What would tell these apart:** track *why* people call before and after the change, not just how many calls there are.
- **H2:** S-B3 may cut assessment time and copying errors. This is the most direct link to faster processing.
- A story passing its acceptance checks shows the feature works. It does **not** show that calls went down or that processing got faster.

## 7. Questions for the council, and research questions

These are listed for whoever owns them to decide on. I'm not commissioning any of them.

**Council rules and decisions:**
- **Q1:** Which evidence is required, and in what accepted forms?
- **Q3:** What are the defined status stages, and what may residents be told?
- **Q4:** What happens after a decision?
- **Q5:** How must documents be handled and kept, and what is the legal basis?
- **Q6:** Must upload stay optional?

**Research questions that would change the design:**
- Why do caseworkers retype? Is it the case system's data fields, or that documents can't be viewed there?
- Why do residents actually call?
- Which evidence causes residents the most trouble?
- Who can't or won't upload?

If the team needs a research method, the parallax-design-inquiry skill can help design one.

## 8. Review and limits

I reviewed this myself in the same session. No one independently challenged it.

The main risks it's designed against:
- S-B2 could pass while residents still upload the wrong evidence. S-B1 and S-B4 cover this.
- Reducing calls could shut out people who need help. N6 is worded to prevent this, and H1 notes the risk.
- The status view could give false reassurance. S-A1's acceptance checks cover this.

**Next step:** get answers to Q1, Q3 and Q5 from the service owner. Watch caseworkers retyping so S-B3 can be made ready. S-B3 and S-B2 are the strongest candidates to schedule first.

Reopen this model when:
- research is done;
- the council's rules arrive;
- a change is made to how the case system connects;
- anyone makes a claim about calls or processing time.
