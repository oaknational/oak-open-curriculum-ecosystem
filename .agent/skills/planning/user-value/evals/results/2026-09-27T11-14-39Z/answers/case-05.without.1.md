The working directory is empty, so I haven't seen the 12 interview notes. What follows is a structure built from your three constraints. It contains no findings yet. If you share the notes, I can code them into it.

---

# Appointment journey: two-lane structure

## 1. Design decisions

| Decision | Why |
|---|---|
| **Two lanes on a shared stage spine**, not one merged journey | Carers do things that self-bookers never do: coordinating with the person, booking on someone else's behalf, and arranging transport. Merging the routes would hide those steps. A shared spine still lets you compare the routes stage by stage. |
| **Observed friction replaces the emotion curve** | The notes record actions, not reliable feelings. A made-up emotion curve would present guesses as findings. Friction is coded from what people actually did (see §4). |
| **Every step is tagged with who controls it** | You can't change the transport service. Opportunities are only logged against steps you control or against the handoffs with the provider. |
| **Every cell cites participants (e.g. P03, P07 · 2/5)** | With about 12 interviews split across two lanes, each lane may have only 5–7 people. Counts stop a single story from being read as a pattern. |

## 2. Stage spine

| # | Shared stage | Self-booker lane | Carer lane |
|---|---|---|---|
| 1 | **Trigger** | Notices need / receives letter | Person raises need, carer spots letter, or clinic contacts carer |
| 2 | **Coordinate** | *(not applicable)* | Agrees on timing, access needs and consent with the person |
| 3 | **Book** | Books for self | Books on behalf: identity/authority checks, relays the person's details |
| 4 | **Arrange travel** | Makes own way (may use transport) | **Arranges transport (external)**: eligibility, booking, pickup times |
| 5 | **Prepare & confirm** | Checks details, reminders | Confirms with clinic, transport **and** the person, often through several channels |
| 6 | **Get there** | Travels | Travels with the person, or hands over to transport and tracks it |
| 7 | **Attend** | Attends | Present / partly present / absent; relays information |
| 8 | **After** | Follow-up, rebooking | Passes outcomes to the person, rebooks, rearranges transport |

Stage 2 applies only to carers. Stage 4 is a small step for self-bookers and a major one for carers. Keep the empty cells visible, because the gaps are a finding in themselves.

## 3. Per-stage template (fill once for each lane)

```
STAGE: [n. name]                         LANE: [Self | Carer]
Actors:            e.g. carer, person, clinic reception, transport provider
Observed actions:  verb-first, from notes          — [P02, P05]
Touchpoints:       phone / portal / letter / SMS / transport line
Friction signals:  coded (see §4)                  — [code · P ids · n/N]
Workarounds:       what people did to cope         — [P ids]
Control:           OURS | HANDOFF | EXTERNAL (fixed)
Opportunities:     only if OURS or HANDOFF
Open questions:    gaps the notes can't answer
```

## 4. Friction codes (from behaviour, not emotion)

| Code | Observable evidence in notes |
|---|---|
| `REPEAT` | Gave the same information more than once, or re-entered details |
| `CHASE` | Called or checked back to confirm something that should already have been confirmed |
| `WORKAROUND` | Used an off-system method (own spreadsheet, calendar, asked a neighbour) |
| `HELP` | Had to ask someone to complete a step |
| `DELAY` | A gap or wait between steps that the participant mentioned or that shows in the timeline |
| `ERROR` | Wrong time or place, missed pickup, rebooked |
| `ABANDON` | Stopped, postponed or gave up on a step |
| `SYNC` | Had to reconcile two schedules, e.g. appointment vs transport pickup (mostly carers) |

If a participant *said* how they felt, record it as a quote with the P id. Don't turn it into a score.

## 5. Control boundary (transport)

| Tag | Meaning | Example opportunity types |
|---|---|---|
| **OURS** | Clinic/booking steps you run | Booking-on-behalf flow, confirmations, appointment timing |
| **HANDOFF** | Where your process meets the transport provider | Appointment times that allow for pickup windows, which transport info you surface, one confirmation that covers both |
| **EXTERNAL** | The provider's own service | **Record the friction, don't design for it.** Note it as a constraint the other stages must absorb. |

Carer-lane Stages 4–6 will probably collect the most EXTERNAL friction. The useful design questions sit next to them: how Stages 3 and 5 can reduce `SYNC` and `CHASE` given a transport service that won't change.

## 6. Cross-lane view (after filling)

| Stage | Self: top friction (n/N) | Carer: top friction (n/N) | Control | Divergence note |
|---|---|---|---|---|

## 7. Before synthesis

- **Assign lanes by route, not by role.** Some participants may be mixed: a carer who also books for themselves, or a self-booker who uses transport. Tag them and decide which lane they belong in.
- **Report counts per lane.** "3 of 6 carers" rather than "3 of 12".
- **Filling the emotion gap needs new data.** If you need emotional evidence later, add a short follow-up, such as asking each participant to rate the hardest step. Don't infer it from these notes.

---

If you share the notes, I'll assign the lanes, code the friction and fill in §3 and §6 with participant references.
