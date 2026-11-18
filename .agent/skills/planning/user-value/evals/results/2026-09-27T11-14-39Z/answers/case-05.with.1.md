I found no interview notes in the working directory, so I haven't coded them. What follows is a structure for you to code the 12 interviews against. Stage names are a starting guess. Confirm, merge or drop them once you've placed the notes.

## 1. Two separate maps with shared stage IDs

The carer route has different stages and responsibilities, not just variations of the same ones. The carer has to establish that they can act for the person, coordinate two bookings that depend on each other, and pass information to someone who isn't in the conversation. Folding that into a single map as "variants" would hide the part that matters most.

Where both routes touch the same part of the service, the stages share an ID (for example, `S-BOOK`). That lets you compare the routes directly.

**Code each booking episode, not each person.** One person may book for themselves once and act as a carer another time. There may also be mixed cases, such as the patient booking the appointment while a carer arranges transport. Keep those as a flagged third pattern rather than forcing them into A or B.

## 2. Stages

**Route A: booking for yourself**

| ID | Stage | Owner |
|---|---|---|
| A0 | Trigger (referral, letter, recall, symptom) | Mixed |
| A1 | Find out how to book, and whether you're eligible | Ours |
| A2 (`S-BOOK`) | Choose and book a slot | Ours |
| A3 (`S-TRANSPORT`) | Arrange travel: own means or the transport provider | External, fixed |
| A4 (`S-CHANGE`) | Confirmations, reminders, changes, cancellations | Ours |
| A5 | Travel and arrival | External / person |
| A6 (`S-APPT`) | The appointment itself | Ours |
| A7 | Getting home; booking a follow-up | Mixed |

**Route B: a carer arranging for someone else**

| ID | Stage | Owner |
|---|---|---|
| B0 | Trigger, often learned second-hand from the patient or a third party | Mixed |
| B1 | Establish the right to act; gather the patient's details and needs | Ours / person |
| B2 | Line up availability across patient, carer, clinic and transport. This is often a loop, not a step. | Mixed |
| B3 (`S-BOOK`) | Book the appointment on the patient's behalf | Ours |
| B4 (`S-TRANSPORT`) | Book transport: lead times, eligibility, pickup windows | External, fixed |
| B5 | Pass details to the patient; decide who receives reminders | Ours / person |
| B6 (`S-CHANGE`) | Handle a change to either booking, which knocks on to the other | Mixed |
| B7 | Day of: pickup, whether the carer goes too, waiting | External / person |
| B8 (`S-APPT`) | The appointment, with the carer present, remote or absent | Ours |
| B9 | Return transport and follow-up, which starts the cycle again | Mixed |

I expect B2–B4 and B6, where the two bookings meet, to be where the routes differ most. Treat that as a hypothesis to check against the notes, not a finding.

**Endings to record on both maps.** Only "attended" counts as success:
- attended
- rescheduled
- cancelled by the person
- did not attend
- transport failed, so the appointment was missed
- gave up before booking
- never got started (for example, ineligible or unable to find the route in)

The last two only appear if the notes captured them. If they didn't, record the gap rather than leaving it out silently.

## 3. What to record at each stage

| Field | Notes |
|---|---|
| Observed actions | What the notes say people did |
| Decisions | Include what the decision depended on |
| Waiting and handoffs | Who else was involved, and for how long |
| Channels | Phone, online, letter, in person, through the carer |
| Behavioural difficulty signals | Only things that were observed: repeated contacts, workarounds, errors, backtracking, stopping, time taken |
| Need at this stage (inferred) | Label it as your inference, with the evidence behind it |
| Entry and exit conditions; recovery path | What happens when this stage goes wrong |
| Evidence | Interview IDs, and n/12 only after coding |
| Open questions for research | |

**No emotion lane.** Where a source records nothing, write "not recorded". Don't infer feelings from actions: calling three times is a behaviour, not frustration. Keep direct quotes only if the notes have them verbatim, and label them as quotes.

## 4. How to handle the transport provider

Keep the transport stages (A3, B4, B7, B9) on both maps. People's needs still arise there, and leaving them out would make the journey look smoother than it is. Mark those stages as **external and fixed**. Any response to a need there has to come from the parts you control, for example:

- Show transport lead times and pickup windows before someone chooses an appointment slot.
- Offer slots that fit the transport constraints.
- When transport fails, let people rebook quickly without a penalty, and don't record it as a missed appointment on their part.
- Send reminders and changes to the carer as well as the patient.
- Show the appointment and transport details together, so carers can manage both.

List transport-side problems as constraints, not as backlog gaps. If the evidence is strong, pass it to the provider as information, not as a change you're committing to.

## 5. Next steps

1. Code each interview's episode or episodes onto the stage IDs. Record the order of actions, and anything that doesn't fit a stage.
2. Revise the stages to match what actually happened.
3. Only then attach needs, and count how many of the 12 show each one.
4. Record what the notes can't tell you: emotions, anyone who couldn't get into the service at all, and how often each ending happens. Each of those needs further research.

If you share the notes, I can do the coding and fill in the maps.
