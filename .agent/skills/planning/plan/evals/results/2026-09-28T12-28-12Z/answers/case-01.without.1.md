# Delivery plan: residents' dashboard in two weeks

## The core problem

You don't know what residents need, so two weeks isn't enough to build a finished dashboard. It is enough to find out what's needed and ship a small first version that works. I'd agree that with the councillor on day 1, framed as "we'll give you something live in two weeks that residents actually use." Don't frame it as "we can't do it."

**My recommendation:** use days 1–4 for fast discovery, days 5–7 for prototyping and testing, and days 8–10 to build and release one or two panels. Plan further versions after that.

---

## Day 0–1: Pin down the request

Meet the councillor for 30–45 minutes and ask:
- **What prompted this?** Complaints, a ward issue, a manifesto commitment, a comparison with another council?
- **Which resident problem should it fix?** For example, "I don't know when my bin is collected" or "I can't see progress on my pothole report."
- **What does success look like in two weeks, and in three months?**
- **Is the deadline tied to something fixed,** such as a committee date, a press release or an election? This tells you how much the deadline can move.

Also agree on a named decision-maker and a 15-minute check-in twice a week.

## Days 1–4: Fast discovery using evidence you already have

You have no resident research, but you do have resident data. Pull these sources:

| Source | What it tells you |
|---|---|
| Contact centre call reasons / CRM categories | What residents chase the council about most |
| Website analytics and site search terms | What they look for and can't find |
| Complaints, FOI requests, councillor casework | Recurring frustrations |
| "Report it" or service request data | Where status updates are missing |
| Other councils' dashboards | Patterns you can reuse |

Add **5–6 short resident conversations** of 20 minutes each. Recruit through the contact centre, libraries or a social media callout, and include at least one person who uses assistive technology or has low digital confidence.

**Output by day 4:** a ranked list of 3–5 things residents want to see, with evidence for each. Examples are bin days, report status, council tax balance, planning applications nearby and roadworks. Check each item against whether the data exists and can be accessed.

## Days 5–7: Prototype and test

- Build a clickable prototype of the top 1–2 needs. If you're in the UK, use the GOV.UK Prototype Kit or the design system.
- Test it with 5 residents and fix what confuses them.
- At the same time, confirm data feeds, APIs and ownership with the service teams, and start the governance checks below.

## Days 8–10: Build and release a thin slice

- Ship **one or two panels done properly**, not ten panels done badly.
- Add a feedback link and analytics from day one.
- Label it as beta or "new service – tell us what you think."

---

## Checks you can't skip, even on a two-week timeline

- **Accessibility:** WCAG 2.2 AA is a legal requirement for public sector sites in the UK under the Public Sector Bodies Accessibility Regulations 2018. You also need an accessibility statement. Every chart needs a text or table alternative.
- **Data protection:** if the dashboard shows any personal data (account balances, a resident's own reports), you need your DPO involved and probably a DPIA. That can take longer than two weeks, which is another reason to start with public, non-personal data.
- **Data accuracy:** wrong bin dates damage trust faster than having no dashboard. Name an owner for each data feed.
- **Content sign-off:** comms and service owners.

## Main risks

| Risk | Mitigation |
|---|---|
| The dashboard shows what's easy to show, not what's needed | Rank features by the discovery evidence, not by what data is available |
| Scope grows ("can it also show…") | Keep a visible backlog; anything new goes into the next version |
| Data can't be accessed in time | Check feasibility by day 4; fall back to the next-ranked need |
| The councillor expects a finished product | Agree on day 1 what "done" means |
| Nobody owns it after launch | Name a service owner before release |

## Roles (minimum)

- Product owner (council side, with authority to decide)
- User researcher / designer (these can be one person on this timeline)
- Developer with access to the data sources
- Part-time support from data owners, the DPO and comms

## What to tell the councillor

> "In two weeks, residents will have a live dashboard showing the one or two things they most need, based on evidence from our contact centre and residents. After that we'll add to it based on usage and feedback."

If you tell me your tech stack or CMS, which data sources you can realistically access, and whether you follow the GDS Service Standard, I can turn this into a day-by-day sprint board or a one-page brief for the councillor.
