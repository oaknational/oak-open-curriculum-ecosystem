The risky part here isn't the build. It's that nobody has said what problem the dashboard solves. With no research and two weeks, the likely failure is shipping a polished screen of numbers that residents don't use and that doesn't answer the councillor's real concern. So the plan should use the two weeks to **learn enough to build the right small thing, then ship that thing** (a working first version), not the whole dashboard.

## Reframe the deadline first (Day 1)

Talk to the councillor and whoever owns the deadline, and agree on this:

> "In two weeks we'll deliver a live, accessible first version covering the 2–3 things residents most need, based on evidence. The rest will follow in later releases."

If the two weeks is fixed by something outside the team (a committee meeting, a manifesto promise, a press date), find out what. It changes what counts as "done". Often a working demo is enough for a committee, and a public launch is a different bar.

## Week 1: Discovery-lite (Days 1–5)

| Day | Activity | Output |
|---|---|---|
| 1 | **Councillor interview (30–45 min).** What prompted this? What complaints or casework are they seeing? What would success look like in 3 months? | A problem statement, not a feature list |
| 1–2 | **Mine existing evidence** (no new research needed): contact-centre call reasons, top site searches, web analytics, complaints, FOI requests, casework themes, "where's my…" emails | A ranked list of what residents already ask about |
| 2–3 | **Quick guerrilla research.** 5–8 residents at the library or customer service desk, or on the phone via the contact centre. Include at least one person using assistive tech or with low digital confidence | Evidence of what residents need to see and why |
| 3 | **Data audit.** For each candidate item: does the data exist, who owns it, how fresh is it, can it be published, does it involve personal data? | A feasibility matrix |
| 4 | **Prioritisation workshop** with the councillor, service owner, data owner and a delivery lead. Rank items by resident need × data availability × effort | A scope of 2–3 items for v1, with the rest logged in a backlog |
| 5 | **Paper or clickable prototype**, tested with 3–5 residents | A validated design direction |

**What to look for:** residents usually want *their* thing (when's my bin collected, where's my planning application, is the road closed). Aggregate council performance stats are usually what councillors want. If the research shows that split, surface it. You may end up building one page for residents and a separate one for members.

## Week 2: Build and release (Days 6–10)

| Day | Activity |
|---|---|
| 6–8 | Build the 2–3 scoped items. Use existing data feeds and your existing design system or GOV.UK Frontend. No new data pipelines unless they're trivial. |
| 7 | Start the accessibility check now, not at the end. WCAG 2.2 AA is a legal requirement for UK public sector sites under PSBAR 2018. Charts need text or table alternatives. |
| 8 | Content review: plain English, and show when each figure was last updated. |
| 9 | Usability test the built version with 3–5 residents and fix the critical issues. |
| 9 | Publish the accessibility statement, add analytics and a feedback link ("Is this page useful?"). |
| 10 | Release as a **beta** labelled clearly as such, then do a show-and-tell with the councillor. |

## Governance to start on Day 1 (these can block launch)

- **DPIA screening:** do it early if any data could identify individuals, including small-number suppression in area-level stats.
- **Data owner sign-off** for publishing each dataset.
- **Comms and press office** if the councillor plans to announce it.
- **Hosting and security review:** check your council's lead time for this. It's often more than a week.

## Top risks

1. **Scope creep from stakeholders.** Keep the backlog visible and route every "can it also show…" into v2.
2. **Data turns out to be unavailable or poor quality.** You'll know by Day 3, so choose v1 items that have clean data.
3. **Publishing wrong or stale numbers publicly.** Show "last updated" timestamps and name an owner for each figure.
4. **No time to research properly.** Say so in the show-and-tell, and budget a proper discovery for the next phase.

## After launch (Weeks 3–6)

Look at usage data and the feedback link, then run proper research with more residents. Decide whether to expand, pivot or retire the dashboard, and report back to the councillor with evidence.

## Decisions I need from you

1. Can the two weeks mean "live beta of a thin slice", or has the whole dashboard been promised publicly?
2. Who is the service owner, meaning the person who can say no to scope?
3. Which team is building it (in-house, supplier, or a low-code tool), and is there an existing design system?

Once you have those answers I can turn this into a day-by-day plan with owners, or draft the councillor interview questions and the resident research script.
