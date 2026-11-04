No, the claim isn't justified. The evidence doesn't test either part of it, so the claim is **not ready** to be relied on.

**What I assessed:** revision 2 of the rescheduling feature specification, against one use: stating as an outcome that "the feature reduces missed appointments and gives equitable access." The full specification wasn't provided, only the claim and three pieces of evidence, so this judges the evidence against the claim, not the whole document. I'm not independent of the feature's owners in any formal sense, and I can't accept the claim or its risks on anyone's behalf.

## What the claim needs

The claim has two parts, and each is about what happens to people, not about the software:

1. **Fewer missed appointments.** This is a cause-and-effect claim. It needs a missed-appointment rate measured before and after (or against a comparison group), over enough time to see past normal ups and downs. It also needs the definition of "missed", the patient group, and the time window stated, plus other explanations ruled out: season, staffing, reminder changes, the mix of appointments.
2. **Equitable access.** This is a claim about how outcomes are spread across groups. It needs a stated definition of equity, which is a value choice someone has to make. It also needs results broken down by the relevant groups: age, disability, language, digital access, lack of a phone or internet, shift workers. And it needs a check on people who never use the feature, such as those who can't reach self-service rescheduling.

## The evidence

| Evidence | What it can support | Does it support the claim? |
|---|---|---|
| All automated tests pass | The code behaves as the tests expect | **No.** Tests check behaviour, not outcomes. The number of tests, what they cover and which revision they ran against aren't given. |
| 10 staff rated the demo 4.6/5 | Staff liked a demo | **No.** These are staff, not patients. It was a demo, not real use. The sample is tiny, and there's no method, question wording or spread of scores. It measures how pleasant the demo seemed, not attendance or access. |
| Live for one week | The feature was deployed | **No.** Being live isn't a result. No outcome data from that week is offered, and a week is too short for a missed-appointment rate that depends on bookings made weeks ahead. |

## Findings

- **False assurance:** passing tests and a good demo score are presented as proof of outcomes. This blocks the claim.
- **Mislabelled claim:** an outcome hypothesis is stated as established fact. "Equitable" is also a value choice that no one has defined or signed off. This blocks the claim.
- **Missing evidence:** there's no missed-appointment data (before, after or comparison) and no results broken down by group. This blocks the claim.
- **Missing coverage:** nothing addresses the people most likely to be left out, such as those without digital access, those needing assisted channels or non-English speakers. The staff demo can't reveal them. This blocks the equity part.
- **Unresolved unknowns:** the definition of a missed appointment, the population, the baseline, the minimum meaningful effect and the observation window are all unstated. This blocks the claim.
- **Unauthorised readiness:** no one is named with authority to make or accept this claim. This blocks the claim.

## What would change this

**Next step:** go back to the specification. Reword the claim as a hypothesis with a defined measure, population, window and equity definition. Then collect outcome evidence: missed-appointment rates against a baseline or comparison, broken down by the relevant groups, over at least one full booking cycle. Include a check on people who didn't use the feature.

**Who decides:** whoever owns the service outcome, likely a service or clinical lead. The assessor can't make that call. That person, or an equity/inclusion reviewer, should approve the definition of equity.

**Until then, the defensible statements are narrower:** "revision 2 passes its automated tests," "it has been deployed since [date]," and "staff rated the demo favourably."

**Reassess when:** outcome data arrives, the claim is reworded, or the specification moves past revision 2. This judgement doesn't carry over to later revisions.
