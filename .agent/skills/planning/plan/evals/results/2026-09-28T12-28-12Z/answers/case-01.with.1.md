I didn't write a plan file. This repo has no `.agent/plans/` folder, so there's nowhere for a formal plan to go yet. Below is a draft plan. It governs no work until you, as owner, approve it.

## The main problem: the request names a solution, not a need

"Residents need a dashboard" says what to build but not what problem it solves. With no research and no agreed list of what residents need to see, whatever we build in two weeks would only reflect a guess about the councillor's intent. So the plan doesn't start by building a dashboard. It spends the first few days finding the need and the data that can meet it, then builds the smallest thing that meets that need.

**How I'd frame it:**
- **Gap:** unknown. Something prompted the councillor, such as complaints, casework, a committee question or a comparison with another council.
- **Who it affects:** assumed to be residents, but not yet known which ones.
- **Likely cause:** residents probably can't see the status or performance of something they care about (bins, repairs, planning, waiting times), so they phone or complain.
- **Constraints:** two weeks. It must meet public-sector accessibility law (PSBAR / WCAG 2.2 AA). Only publishable data can be used, and personal data risk must be handled.
- **Success:** residents find the answer to their most common question without having to contact the council.

## Two-week plan (starting 2026-09-28)

**Days 1–3: Find the need**
1. Spend 30 minutes with the councillor. Ask what prompted the request, which residents they have in mind, and what they would count as success. Find out whether the deadline is tied to an event.
2. Check existing evidence instead of commissioning new research:
   - contact-centre call reasons
   - top site searches
   - complaint categories
   - FOI request themes
3. Have 5–8 quick conversations with residents (at a library, a front desk or by phone) to test the top 2–3 candidate questions.
4. Audit the data for each candidate question: does it exist, who owns it, how often it updates, whether it's good enough, and whether it's safe to publish (small numbers can identify people).

**Day 3: Decision point.** Choose one or two resident questions that the data can answer reliably. The result may not be a dashboard. A status page or a simple table is often better.

**Days 4–10: Build the thinnest slice**
- Build only what answers the chosen questions, using the council's existing design system or GOV.UK patterns.
- Around day 8, test it with 3–5 residents, including at least one who uses assistive technology.

**Days 11–14: Make it safe to publish**
- Check accessibility, plain-English content and data refresh.
- Get the data owner's sign-off.
- Publish as a beta with a feedback link and an accessibility statement.

## Acceptance criteria and how each is proven
| Criterion | Proof |
|---|---|
| The chosen question is backed by evidence (call, search or complaint data, or resident sessions) | The service owner signs off the day-3 decision record |
| At least 4 of 5 test residents find the answer unaided | Owner-held: test notes from the day-8 session |
| Meets WCAG 2.2 AA | Automated checks (axe) in CI plus a manual screen-reader pass |
| Data is accurate and refreshes automatically | Tests on the data pipeline plus the data owner's sign-off |
| Nothing published can identify a person | The data protection or IG lead's sign-off |

## Out of scope
- Showing more than the one or two chosen questions.
- A councillor or internal performance view. If that's the real need, it's a different product for a different audience.
- Accounts, personalisation, and live integrations the data audit didn't approve.

## Decisions only you can make (each needs an answer by the date shown)
1. **Who owns this service?** This is the person who approves the plan and the day-3 decision. Needed by 2026-09-29.
2. **Is the two-week deadline fixed, and what is it tied to?** If it's a committee date, day 14 might be better as "evidence plus a tested prototype" than a live service. Needed by 2026-09-29.
3. **If the evidence shows residents don't need this,** do you accept a findings report as the outcome, or does something ship regardless? Needed by 2026-10-01, which is the day-3 decision point.

## Biggest risk
The councillor may expect a specific, many-chart dashboard. Show them the day-3 decision so they see their request being narrowed by evidence, rather than learning on day 14 that it was cut.

If you answer the three decisions, I can turn this into a formal plan document and hand the definition of resident needs to the `user-value` step.
