# Is the outcome claim justified?

**No.** The spec makes two outcome claims, and none of the three pieces of evidence measures either one.

## The claims

1. **"Reduces missed appointments."** This says the feature causes a change in a real-world rate.
2. **"Gives equitable access."** This says the benefit reaches different patient groups fairly, or at least doesn't disadvantage any of them.

## What each piece of evidence actually shows

| Evidence | What it does establish | Why it doesn't support the claims |
|---|---|---|
| All automated tests pass | The code does what the tests check. | Tests check the code against its spec, not what happens to patients. Passing tests can't show that no-shows went down or that access is fair. |
| 10 staff rated the demo 4.6/5 | Staff liked a demonstration. | Wrong people: patients reschedule, staff don't. Wrong setting: a demo isn't real use. Wrong measure: liking something isn't a behaviour change. Ten people is too few, and staff may be biased toward a feature built in-house. |
| Live for one week | Patients have been able to use it. | Being available isn't the same as having an effect. No missed-appointment figures are reported, no baseline, and no comparison. One week is too short to separate any change from normal week-to-week noise, and many appointments booked during it won't have happened yet. |

**The equity claim has no evidence at all.** Nothing is broken down by any patient group. A self-service rescheduling tool can make access *less* equal, because people with good digital access, time and fluency may grab freed-up slots first.

## What would justify the claims

**For "reduces missed appointments":**
- A clear definition of the metric, e.g. the no-show rate per scheduled appointment.
- A baseline figure from before launch.
- A comparison: ideally a staggered or randomised rollout, or at minimum before/after data that accounts for seasonal patterns.
- Enough time and volume to detect a realistic effect, planned in advance.
- A check that missed appointments aren't just being relabelled as late cancellations.

**For "equitable access":**
- Uptake and no-show changes broken down by relevant groups, such as age, language, disability, digital access, deprivation, and booking channel.
- An accessibility review against WCAG, plus a non-digital way to reschedule.
- Monitoring of who ends up getting the freed-up slots.

## Suggested rewording for revision 2

Keep the claim to what the evidence supports:

> "The rescheduling feature is implemented and passes its automated test suite. Staff rated a demo positively (mean 4.6/5, n=10). It has been live since [date]. Its effect on missed appointments and on equitable access has not yet been measured; an evaluation plan is in [section]."

Then either drop the outcome claims or explicitly label them as hypotheses until the data above exists.

I haven't seen revision 1, so I can't say whether this revision is better or worse than the last one.
