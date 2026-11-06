I didn't create a plan file. This repo has no `.agent/plans/` directory, so there's no plan schema or validator to write against. Below is the plan as a draft. Two decisions in it are for you and the councillor, not me.

## Diagnosis first

The request names a solution ("a dashboard") but not the problem. We don't know which residents it's for, what they're trying to do, or what goes wrong today. Committing to "build a dashboard in two weeks" would mean guessing at all of that. The likely result is a page of charts that nobody asked for, delivered on time.

**My recommendation:** keep the deadline but change what it delivers. By day 10 you should have **one tested slice that meets one confirmed resident need**, plus evidence of whether it works. Don't promise a complete dashboard.

## Problem framing (to confirm with the councillor on day 1)

- **Gap:** unknown. What prompted the request? Complaints, casework, a scrutiny question, a manifesto commitment?
- **Who it affects:** unknown. All residents, people with open requests or cases, tenants, ward residents?
- **Working guess (to test):** residents can't see something they need, such as the status of a report or request, service performance, or local information. So they phone, email or complain.
- **Constraints:** two weeks, accessibility regulations (WCAG 2.2 AA), UK GDPR if it shows personal data, and whatever data the council actually holds in usable form.
- **Success:** residents in the target group can answer their question without contacting the council.

## Sequence (Mon 28 Sep to Fri 9 Oct 2026)

| Days | Step | Output | Gate |
|---|---|---|---|
| 1–2 | **Find out what the councillor needs.** 30-minute conversation: what prompted it, who it's for, what "done" looks like on day 10. | Problem statement in the format above | **Gate 1:** councillor confirms the framing. Deadline: **30 Sep**. |
| 2–4 | **Quick evidence gathering, not a research programme.** Look at contact centre call reasons, complaint themes, FOI requests, web analytics and search terms. Hold 5–6 short resident conversations if you can recruit them. | 2–3 candidate needs, each with its evidence | — |
| 3–4 | **Data check** for each candidate: do we hold the data, how fresh is it, is it personal? | Feasibility for each candidate | — |
| 4 | **Choose one need.** | The single need and a thin-slice definition | **Gate 2:** service owner and councillor choose. Deadline: **2 Oct**. |
| 5–8 | **Build the thin slice.** Prefer public or aggregate data, because personal data triggers a DPIA and login work that won't fit in two weeks. | Working slice | — |
| 7–9 | **Test with 5 residents from the target group**, plus an accessibility check. | Test findings | — |
| 10 | **Go / no-go.** | Release, iterate, or stop, backed by evidence | **Gate 3:** service owner. Deadline: **9 Oct**. |

If Gate 1 or Gate 2 misses its deadline, the plan stops there and goes back to you. Nothing gets built on a guess because nobody made a decision in time.

## Acceptance criteria and how each is proven

1. **At least 4 of 5 test residents in the target group can answer the chosen question unaided.** Proof: owner-held. The service owner signs off the dated test notes.
2. **The data shown matches the source system when the slice is released.** Proof: repo-safe. An automated reconciliation test against the source.
3. **Meets WCAG 2.2 AA.** Proof: an automated axe check in CI (repo-safe) plus a manual keyboard and screen-reader pass (owner-held, recorded).
4. **The councillor agrees the slice addresses the problem confirmed at Gate 1.** Proof: owner-held, a dated written confirmation.

"Dashboard deployed" is deliberately not a criterion. It measures activity, not outcome.

## Out of scope for these two weeks

- Personalised or logged-in views, unless Gate 2 picks a need that requires them. In that case the timeline has to be renegotiated for the DPIA.
- More than one need or data source.
- Admin or editing tools for staff.
- Anything labelled "phase 2". Nobody has authorised further work, so the plan shouldn't imply it.

## Main risks

- **The councillor wants "a dashboard" as a visible deliverable.** Respond with the thin slice and its evidence. It's more defensible at scrutiny than a page of charts nobody uses.
- **You can't recruit residents in days 2–4.** Fall back to the contact and complaint data, and label the choice as a hypothesis. Testing on days 7–9 becomes the only check that it's right.
- **The data isn't usable.** You'll find out on day 4, which is still in time to pick a different need.

## Questions for you

1. **What happens on day 14?** A committee meeting, a public launch, or a manifesto commitment? That decides whether a tested prototype is acceptable or it has to be live.
2. **Who is the service owner** for Gates 2 and 3? It shouldn't be the councillor alone.

If you have a plan-tracking setup (the `.agent/plans/` estate this workflow expects, or Linear), tell me where and I'll write this up as a draft for approval.
