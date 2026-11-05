I found nothing to work from: the working directory is empty and the git repo has no commits. So what follows is a draft built only from what can be said about exploratory projects in general. Every project-specific detail is a marked unknown, and I haven't invented any values.

# Draft: what an exploratory project can promise a funder

```text
ID / revision / subject / status:  FUNDER-PROMISE / r0 / exploratory research project (unnamed)
                                    / DRAFT, not adopted by anyone
Purpose, consumers, affected:       Tells the funder what they can rely on, and what they can't,
                                    when deciding to fund and to keep funding.
                                    Consumers: funder, project lead.
                                    Affected: research participants, data providers, team.
Boundary:                           Covers how the inquiry is run, reported and handed over.
                                    Excludes what the inquiry finds.
```

## The one rule everything else follows from

An exploratory project **can promise how the inquiry will be conducted. It cannot promise what the inquiry will find.** Anything about the result is a hypothesis, and it stays labelled as one.

## Test cases

- **The case that succeeds:** The main hypothesis is disproved at the first checkpoint. The team stops or changes direction, reports why and what it cost, and hands back the unspent money or a revised plan. **Every promise has been kept**, even though nothing "worked".
- **Cases where things go wrong:**
  1. An interim result is ambiguous and there is pressure to present it as good news.
  2. A data provider refuses access partway through.
  3. Spending runs past plan.
  4. A promising side direction appears that falls outside the agreed scope.
  5. An ethics issue appears with participants.

## Obligations: what can legitimately be promised

| # | Obligation (conditions → who → what, within which limits) | How it can fail, and what happens then | Evidence |
|---|---|---|---|
| P1 | The project lead pursues the **stated questions** using the **declared methods**, or records a reason for each change of method. | An undeclared change of method is reported at the next checkpoint. | Method log, compared against the protocol |
| P2 | At each **agreed checkpoint**, the lead reports a **continue / change direction / stop** recommendation, with reasons, against **stopping criteria set in advance**. | A missed checkpoint triggers notice to the funder within an agreed number of days. | Dated checkpoint reports |
| P3 | **All results are reported, including negative, null and ambiguous ones.** No selective reporting. Each claim is labelled: observed, inferred, or hypothesis. | Case 1 is resolved by labelling the result, not by choosing which results to show. | The report lists every result, traceable to the protocol |
| P4 | Spending stays within the **agreed budget and time envelope**. If variance crosses an **agreed threshold**, the funder is told before the money is spent. | Case 3: notify, re-plan, or stop. | Financial reports compared with the threshold |
| P5 | **Material changes are notified promptly.** A material change is a lost dependency, a change of scope, or a change of key personnel. | Case 2: notify, and say which questions can no longer be answered. | Notice log |
| P6 | Ethical, legal and data-handling constraints hold **throughout, whatever the results**. | Case 5: pause the affected work, escalate to the ethics authority, report. | Approvals and incident log |
| P7 | Where the outputs allow it, the project delivers **reproducible artefacts** (data, code, protocols) under agreed terms and licences. | If an artefact can't be released, the reason is stated. | Artefact inventory |
| P8 | At the end, the funder receives a **handoff** that says what is ready for which next use, and what is not. | — | The handoff document |

## Permitted variation

The project may, provided each change is recorded:
- change the order of the work and the tactics within a question;
- drop a question, with a reason;
- stop early.

Taking up an out-of-scope direction (case 4) needs the funder's agreement. It is not included in this promise.

## Must not be promised (no consumer may rely on these)

- A positive or favourable finding.
- A working product or prototype of a stated quality.
- Adoption, impact, or return on investment.
- Any particular performance figure.
- Results that generalise beyond the population and conditions actually tested.

These can be written as **hypotheses**, with the evidence that would confirm or disprove them. They should never be written as deliverables.

## Unknowns and how each is treated

| Unknown | Treatment | Effect on using this draft |
|---|---|---|
| The actual project, its questions and methods | **Blocks** adoption | Stays a draft until these are supplied |
| Funder identity, and what decision they will base on this | **Blocks** a readiness claim | Decides whether P2 and P8 are sufficient |
| Checkpoint dates, stopping criteria, budget-variance threshold, notice period | Bounded investigation: to be set by the lead and the funder together | Until then, P2, P4 and P5 can't be checked. Each needs a unit, a window and an action on breach. |
| Intellectual property and data-release terms | Bounded investigation | Limits P7 |
| Who approves out-of-scope pivots, and who resolves disputes | **Blocks** P4 and the permitted-variation rules | Needs a named decision-maker on both sides |

## Handoffs

- **Data providers and partners:** if the project depends on one (case 2), that relationship should go to `specify-connection`.
- **Funding decision:** if the funder will rely on this record to decide, send it to `assess-specification`, naming that decision.

**Readiness:** ready for discussion only. Not ready for a funding agreement.

I haven't saved this anywhere. To make it project-specific, send me:
- the project's questions and methods;
- who the funder is and what they will decide based on it;
- the budget and timeline.

Once I have those, I'll fill in the unknowns and write it to a file wherever you want it.
