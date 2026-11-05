## No, the outcome claim isn't justified

**Disposition: not ready** to be relied on as an outcome claim. Revision 2 can still be discussed, and it may be fine to build on. But none of the three pieces of evidence tests whether the feature reduces missed appointments or makes access more equitable.

### 1. What was assessed

- **Record:** revision 2 of the rescheduling feature specification, as you quoted it. You didn't give me its location or full text, so I've only assessed the claim and evidence you quoted.
- **Reliance:** the stated claim that "the feature reduces missed appointments and gives equitable access." The claim doesn't name a population, time period or setting, which is itself a finding.
- **Criteria I applied:** these are two claims about real-world impact. One says the feature causes a change. The other says the benefit is fairly spread across groups. Each would need:
  - a defined measure;
  - a baseline and a comparison group;
  - enough time to see results;
  - results broken down by group;
  - evidence tied to revision 2.
- **Independence:** I'm a reviewer separate from the authors, but I haven't checked any data myself. I'm not claiming more independence than that.

### 2. The evidence, piece by piece

| Evidence | What it can support | Status for this claim |
|---|---|---|
| All automated tests pass | The code does what its tests check | **Doesn't apply.** Tests check how the code behaves, not what happens to patients. |
| 10 staff rated the demo 4.6/5 | Staff liked a demo | **Doesn't apply.** Staff aren't the patients who miss appointments, a demo isn't real use, and 10 people is a small sample. It also doesn't say what the questions were or who ran the rating. |
| Live for one week | The feature is running | **Not evidence of an outcome.** No numbers were reported. And a week is too short: many rescheduled appointments won't have happened yet, so you can't count misses. |

### 3. Findings

**Claim labelled wrongly**
- "Reduces missed appointments" is a hypothesis about cause and effect, but it's written as a proven result.
- "Equitable access" is a value choice that hasn't been defined. It doesn't say equitable for whom, compared with what, or measured how.

**Misleading reassurance**
- Presenting passing tests and staff satisfaction as support for patient outcomes suggests evidence that doesn't exist. A green check isn't the same as adequate evidence.

**Missing evidence**
- No baseline rate of missed appointments.
- No comparison group, such as a phased rollout, matched sites or a controlled before-and-after comparison.
- No stated follow-up period that covers how far ahead appointments are usually booked.
- No accounting for seasonal patterns.
- None of the evidence records say which revision they tested, who produced them, when, how uncertain they are, or what they left out.

**Important gaps**
- **People who may be left out.** An equity claim needs results broken down by group. That means patients with limited digital access or skills, those who don't speak the main language, disabled patients and assistive-technology users, older patients, and those who can only use the phone. The spec doesn't mention a non-digital way to reschedule.
- **Ways it could make things worse.** Self-service rescheduling can favour the most digitally confident patients, who grab freed-up slots first. That could widen the gaps the claim says it narrows. It can also increase late cancellations and slot churn. None of this is examined.

**Open questions**
- How "missed appointment" is defined: no-show only, or late cancellation too?
- Which services and sites the claim covers.

**Authority not established**
- Nobody is named as having the authority to make this claim or accept its risks.

### 4. Conditions, next step and authority

Before the outcome claim could be relied on:

1. **Rewrite it as a hypothesis** with defined measures and a pre-stated expected effect. This goes back to the spec authors to revise.
2. **Measure outcomes against a baseline with a comparison group**, over a period that covers the booking horizon.
3. **Break the results down** by the groups above, with an equity threshold set in advance.
4. **Test usability with real patients**, including people using assistive technology and the non-digital route.
5. **Tie every evidence record to revision 2**, stating who produced it, when, what uncertainty it carries and what it excluded.

- **What you can honestly say now:** "Revision 2 is live, passes its automated tests, and staff rated a demo favourably. Whether it reduces missed appointments or improves equitable access has not yet been assessed."
- **Next step:** send the claim back to the spec authors to be reworded as above. Then design the measurement, including when to stop and what counts as success.
- **Who decides:** the owner of the claim, such as the service or clinical owner, together with whoever is responsible for equality impact. The material doesn't name them, and I don't hold that authority.
- **When to reassess:** when there's a new revision, when outcome data for a proper follow-up period is available, or when the claim's scope or owner changes.
