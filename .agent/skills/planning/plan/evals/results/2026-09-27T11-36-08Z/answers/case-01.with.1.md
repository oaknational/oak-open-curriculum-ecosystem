I couldn't save this as a plan file: the workspace has no plan estate (no schema, templates or impact-area registry). So this is a draft plan (a "sketch") in chat, for you to approve or change.

## My recommendation

**Don't plan delivery of "a dashboard" yet.** What you have is a proposed solution with no problem behind it. There's no evidence of what residents need, and no definition of success. If you spend two weeks building the dashboard as asked, you'll probably ship something that looks finished but doesn't help anyone. Instead, use the two weeks to find out what residents need, then build and release the smallest thing that meets it.

## The problem, stated before the solution

- **Gap:** unknown. A councillor thinks residents lack visibility of *something*, but we don't know what.
- **Who it harms:** probably residents who currently phone, email or complain to get information they can't find. That's a guess to check, not a fact.
- **Mechanism (hypothesis):** if residents can look up the status or information they most often ask about, they'll contact the council less and trust it more.
- **Constraints:** two weeks, public-sector accessibility regulations (WCAG 2.2 AA), UK GDPR, and whatever data already exists.
- **Success:** residents can answer their most common question without contacting the council.

## Two-week sequence

**Week 1: define the need**
1. **Day 1: talk to the councillor for 30 minutes.** What prompted the request (complaints, casework, a political commitment)? What must exist at the two-week mark: a demo, a beta or a live service? This one answer decides the rest of the plan's scope.
2. **Days 1–3: use evidence you already have.** Look at contact-centre call reasons, top site searches, complaints, FOI themes and councillor casework. That's cheap, real data on what residents ask for.
3. **Days 3–5: talk to 5–8 residents with a paper or clickable prototype.** Identify the **top 1–3 questions** they need answered, such as "when is my bin collected", "what's happening with my report" or "what's changing on my street".
4. **Day 5: data check.** For each of those questions, is the data available, accurate and allowed to be published?

**Week 2: build the smallest useful version**
5. **Days 6–8: build one or two views** answering the top question(s) from existing data. Make them accessible from the start rather than fixing it later.
6. **Day 9: test with residents** on a phone and with a screen reader, then fix what breaks.
7. **Day 10: release as a labelled beta** with a feedback route, and log what's still unknown.

## Approval points (with fixed dates)

| Gate | Waiting on | Clears when | Expires |
|---|---|---|---|
| G1 Scope | Councillor + service owner | They confirm what's due at two weeks and agree the week-1 approach | 2026-09-30 |
| G2 Need | Service owner | They accept the top 1–3 resident questions and which data sources to use | 2026-10-02 |
| G3 Release | Service owner | They make the go/no-go call on the beta after resident testing | 2026-10-09 |

If a gate expires without a decision, the work stops and the gate goes back to that person. The team doesn't make the decision for them.

## Acceptance criteria and how to prove each

- **At least 4 of 5 test residents answer the top question unaided.** The service owner signs off the dated test notes. This can't be checked from the codebase.
- **No blocking WCAG 2.2 AA issues.** Proven by automated checks plus a manual keyboard and screen-reader pass.
- **Data shown matches the source system on the release date.** Proven by a reconciliation check.
- **Privacy review (DPIA screening) completed.** The data protection officer signs off.

## Out of scope

- Personalised accounts or logins.
- New data pipelines.
- Anything past the top 1–3 questions.
- Analytics dashboards for staff.
- Any claim that this is proven resident need. Eight conversations is only a signal.

## Risks

- **The data doesn't exist or isn't clean.** The day-5 check surfaces this early, and the fallback is a content page rather than a live dashboard.
- **The councillor wants their original idea regardless.** G1 and G2 are there to have that conversation early, not on day 10.

**One question for you:** what does the councillor expect to exist on 11 October: a demo, a beta, or a live service? The answer could shrink or reshape week 2. Once you've confirmed it, I can write this up as a proper plan document, or work through the resident-needs definition first.
