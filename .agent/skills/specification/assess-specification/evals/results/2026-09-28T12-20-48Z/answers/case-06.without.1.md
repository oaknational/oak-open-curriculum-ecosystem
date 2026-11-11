**No, revision 3 isn't ready to operate.** The spec presents all three statements as settled facts. Two of them depend on parties who haven't committed to anything, and the third depends on those two.

## Clause-by-clause

| Clause | As written | Actual status | Can it be relied on? |
|---|---|---|---|
| Identity verification by the county records office within 2 working days | Stated as a fact about operation | No agreement exists and the office hasn't been consulted. It hasn't agreed to do the work, the 2-day timing, a volume, or a way to hand over requests. | **No.** This is an assumption about an outside party. |
| Completeness check by the caseworker team | Stated as a fact | The manager calls it "planned". There's no confirmed staffing, procedure or start date, and the spec gives no timing for it. | **No.** It's an intention, and the spec doesn't say how long it takes. |
| Decision notified within 10 working days | Stated as a promise to applicants | It rests on the two clauses above. One has no basis and the other has no timing, so nobody can show the 10 days is achievable. | **No.** It's a promise with nothing confirmed underneath it. |

## Why it matters

- **The applicant-facing promise is the biggest risk.** Applicants will plan around 10 days. If the records office never agreed to verify identities, or does it slowly, the service breaks a commitment it made to people who may be in financial need. That creates complaints and possible legal exposure.
- **Nothing covers failure.** The spec doesn't say what happens if verification is late or refused, or if an upload is incomplete: whether the clock pauses, whether the applicant is told, or whether the case is escalated.
- **"Revision 3" suggests maturity it doesn't have.** Being on a third draft doesn't make these dependencies more real. Only the parties involved can do that.

## What would make it ready

1. **Records office:** get a signed agreement (an SLA or memorandum of understanding) covering scope, the 2-day turnaround, expected volumes, how requests are sent and returned, and who to escalate to. If they won't commit to 2 days, rewrite the clause to whatever they will commit to.
2. **Caseworker team:** confirm the check is resourced and live, with a written procedure and a turnaround time. Add that time to the spec.
3. **The 10-day promise:** recalculate it from the committed times (verification + completeness check + decision-making + notification, plus a buffer). Say whether time spent waiting on the applicant, such as for missing evidence, stops the clock.
4. **Failure handling:** say what happens when a dependency misses its time, and what applicants are told when that happens.
5. **Wording:** until those commitments exist, mark each dependent clause as an assumption or pending item with a named owner. Don't write it as settled fact.

Until at least steps 1 and 2 are done, revision 3 is a design intent, not a specification you can run the service on.
