# Assessment: benefits-application service spec, revision 3, for operation

**Answer: No, revision 3 is not ready to operate.** All three obligations are written as present-tense guarantees, but none of them is backed by an agreement, a working process or any evidence.

## 1. Scope

- **What was assessed:** revision 3, the three sentences you quoted. That was all the material I had.
- **What use was assessed:** running the service live for real applicants. The spec's promises (2 working days for identity checks, 10 working days to a decision) would then be commitments to the public.
- **Who decides:** the service owner, or whoever holds operational acceptance. The revision doesn't say who that is, which is a finding in itself. I supply findings, not the go-live decision.
- **Independence:** I only read the text and the facts you gave me. I didn't check them against the records office, the caseworker team or any operational data.

## 2. What operating the service requires

Every obligation needs:
- someone who has agreed to deliver it;
- a claim labelled as what it really is (a guarantee, a plan or an assumption);
- evidence that it holds in operation;
- a defined response when it fails.

## 3. The obligations and their status

| Obligation | Stated as | Actual status |
|---|---|---|
| Records office verifies identity within 2 working days | A guarantee | No agreement and no consultation. The 2-day figure has no source. |
| Caseworker team checks uploads for completeness | A guarantee (present tense) | Only "planned", according to the team's manager. It doesn't exist yet. |
| Applicants get a decision within 10 working days | A guarantee | No evidence. It depends on both obligations above, and neither holds. |

## 4. Findings

**False assurance (blocks operation)**
- **F1 – Identity verification.** The spec commits the county records office, a third party, to a 2-day turnaround. That party has agreed to nothing and hasn't been consulted. The service can't promise on another body's behalf.
- **F2 – Ten-day decision.** This promise to applicants rests on F1 and F3. Each working day the records office takes comes straight out of the 10-day window. Stating it as a guarantee overstates what the service can deliver.

**Misclassified claim (blocks operation)**
- **F3 – Completeness check.** "Are checked" describes a process that doesn't exist. It's an intention and should be labelled as one until it's in place and evidenced.

**Missing evidence (blocks operation)**
- **F4.** There's no operational evidence for any of the three time bounds: no pilot, no throughput data, no caseworker capacity figures. Evidence of reliability in live running is exactly what operation needs.

**Material omissions (block operation)**
- **F5 – No failure or recovery behaviour.** Nothing says what happens if:
  - the records office misses 2 days or can't verify someone;
  - an upload is incomplete: is the applicant told, is there a resubmission window, does the clock pause?
  - the 10-day decision is late: is the applicant told, is there an escalation route?
- **F6 – Undefined terms.** It isn't stated when the 10-day clock starts (submission, complete evidence, or verified identity). "Complete" isn't defined, and neither is the notification channel.
- **F7 – Excluded applicants.** Nothing covers people who can't be found in county records (recent movers, people without a fixed address, name changes). Nothing covers people who can't upload digitally. For a benefits service these are expected cases, not edge cases.

**Unresolved unknowns and authority (block operation)**
- **F8 – The records-office seam.** The records office's side of the arrangement is unknown: capacity, how requests are made, data-sharing basis, service level. The link between the service and the records office has no agreed interface.
- **F9 – No acceptance authority.** No one is named as able to accept go-live or any remaining risk.

## 5. Disposition: not ready for operation

"Ready with conditions" doesn't fit here. The conditions would amount to the entire basis for operating.

**Next actions, in order:**
1. **Get an agreement with the records office.** Consult them and agree a service level, a request interface and a data-sharing basis, then write both sides' obligations into the spec. Only they, together with the service owner, can settle F1 and F8.
2. **Get the completeness check running.** The caseworker team needs to put it in place with a written definition of "complete" and the path for incomplete uploads. Until then the spec should label it as planned. This settles F3.
3. **Write revision 4.** It should add failure and recovery behaviour, the clock-start rule, the notification channel and routes for excluded applicants (F5–F7). It should restate the 10-day figure as a target, derived from the agreed times upstream, until evidence supports it (F2).
4. **Gather evidence for the time bounds.** Run a pilot or a controlled trial on revision 4, recording the conditions and who reviewed the results. This settles F4.
5. **Name the acceptance authority** for going live and for any remaining risk (F9).

**Reassess when:** revision 4 exists, the records-office agreement is signed, or the completeness check is running. This assessment applies to revision 3 only and doesn't carry over to later revisions.
