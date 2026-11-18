# Residents' dashboard: two-week delivery plan

## Main risk

Two weeks is enough time to build something. The bigger risk is building the wrong thing. You have a solution ("a dashboard") but you haven't defined the problem yet. So spend week one finding out what residents need, and week two building and testing the smallest useful version. Tell the councillor now that what arrives in two weeks is a **tested first release**, not the finished dashboard.

## Decide on day 1: which kind of dashboard?

These two options differ hugely in scope, so settle this first:

| | **Public, aggregate** (e.g. bin collection performance, pothole repair times, planning backlog) | **Personal, logged-in** (e.g. my council tax, my bin day, my open reports) |
|---|---|---|
| Needs sign-in or identity checks | No | Yes |
| UK GDPR / DPIA | Light | A DPIA is required, with Information Governance sign-off |
| Integration with back-office systems | Read-only data feeds | Live per-resident lookups |
| Possible in 2 weeks? | Yes, a thin slice | **No.** Aim for a prototype only |

If the councillor means the personal version, change the two-week goal to a clickable prototype that has been tested with residents.

## Week 1: Understand the need

**Days 1–2: Frame the problem**
- Meet the councillor for 30 minutes. Ask what prompted the request, which resident complaints or casework triggered it, and what success would look like. Write down the problem statement and agree it with them.
- Ask service leads which data exists, who owns it, how often it's updated and how reliable it is. Data availability will limit what you can build more than design will.

**Days 2–4: Lightweight research using data you already have**
You have no resident research, but you do have proxies for it:
- **Contact centre data:** the top 10 call and email reasons. Calls like "When is my bin day?" or "What's happening with my report?" show what residents can't find themselves.
- **Website analytics and site search terms:** what people look for and don't find.
- **Complaints and councillor casework themes.**
- **5–8 quick resident sessions:** in the library or customer service centre, or by phone. Include people who use assistive technology or have low digital confidence.

**Day 5: Choose what goes in**
- Rank candidate items by resident need and whether the data is available.
- Pick **2–3 items**, not 10.
- Get the councillor to sign off on that scope and on what is explicitly left out.

## Week 2: Build and test a thin slice

**Days 6–8: Build**
- Use your existing design system, e.g. the GOV.UK Design System or the council's own pattern library.
- Show plain-language headline numbers with context ("usually X days"), not dense charts.
- Show when each figure was last updated, and link to the related action (report it, pay it, contact us).

**Day 9: Test**
- Put it in front of 5 residents.
- Check accessibility against WCAG 2.2 AA. Public sector websites are legally required to meet this under the 2018 accessibility regulations. Test with a screen reader and keyboard only, and check it works on mobile.

**Day 10: Release**
- Fix what testing uncovered, publish an accessibility statement and add a feedback link.
- Brief the councillor on what shipped, what you learned and the proposed next steps.

## Governance to line up now
- Service owner and data owners named.
- IG/DPIA screening, even for aggregate data, to check small numbers can't identify individuals.
- A comms plan so residents aren't told the dashboard is "coming" before it has been scoped.
- A plan for maintaining it after launch. Someone has to own how fresh the data is.

## Key risks

| Risk | Mitigation |
|---|---|
| Scope creep from stakeholders | Day 5 sign-off with a written list of what's out |
| Data is poor or not available | Audit data on days 1–2; drop items with bad data rather than show wrong figures |
| Councillor expects the full thing in 2 weeks | Reset expectations on day 1; frame this as release 1 |
| Dashboard doesn't reduce contact | Record contact volumes now as a baseline and review after 4–6 weeks |

## Next step

Book the councillor conversation and send the data-owner request today. Both have lead times that could otherwise eat into week one.

I can also draft the councillor briefing note, the research discussion guide, or a data audit template.
