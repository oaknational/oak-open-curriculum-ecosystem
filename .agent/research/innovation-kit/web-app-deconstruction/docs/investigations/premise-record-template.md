# Premise record template

## Purpose

A premise record is required before proposing or implementing an Oak Innovation Kit capability. It prevents a current mechanism, package boundary or workaround from becoming a framework requirement without examining why it exists and whether a better system can remove it.

The record is complete only when it represents the current excellence as carefully as the current problems.

## Template

```markdown
---
id:
subject:
status: framing | testing | supported | rejected | superseded
decision_affected:
evidence_snapshot:
last_updated:
---

# Subject

## Current observation

- Literal behaviour:
- Inputs and outputs:
- State and authority:
- Dependencies and lifecycle:
- Excellence currently delivered:
- Difficult states and exceptions:
- Known failures or duplication:
- Historical reason or constraint:

## Purpose chain

| Layer                          | Statement | Evidence | Confidence |
| ------------------------------ | --------- | -------- | ---------- |
| Human or educational outcome   |           |          |            |
| Product or operational outcome |           |          |            |
| Applicable obligation          |           |          |            |
| Domain invariant               |           |          |            |
| Chosen system decision         |           |          |            |
| External constraint            |           |          |            |
| Current mechanism              |           |          |            |

## Premises

| ID  | Premise | Why it is believed | Invalidated or weakened by | What changes if false | Evidence needed |
| --- | ------- | ------------------ | -------------------------- | --------------------- | --------------- |

## Complexity classification

- Essential domain complexity:
- Trust or policy obligation:
- Chosen system complexity:
- Accidental or migration complexity:
- Compensating mechanism:
- Unknown:

## Challenge the system

- Can the outcome be achieved differently?
- Can the workflow or interaction change so this responsibility disappears?
- Can policy, content or rights handling change?
- Can one authority or data model remove translation, synchronization or reconciliation?
- Do several mechanisms compensate for the same underlying decision?
- Can those systems collapse into one coherent model?
- Can generation replace maintained parallel representations?
- Can the language, web platform, protocol or chosen framework provide this directly?
- Is this solving a problem created elsewhere that should be removed instead?

## Competing system designs

Include preserve, remove, absorb, combine, invert, generate, platform-native and redesigned-service candidates where credible.

| Candidate | Concepts and authorities | Outcomes and excellence preserved | New failure modes | Invalidators |
| --------- | ------------------------ | --------------------------------- | ----------------- | ------------ |

## Excellence contract

- Demonstrated user need, outcome and impact fidelity:
- Educational effectiveness, pedagogy and curriculum integrity:
- Product and service design, including adverse states and recovery:
- Content design, information architecture, provenance and rights:
- Interaction, visual craft, accessibility and inclusive use:
- Correctness and semantic integrity:
- Safeguarding, privacy, consent, rights and security:
- Identity, state and effect semantics:
- Failure acknowledgement and recovery:
- Determinism and reproducibility where applicable:
- Testability and diagnostic clarity:
- Reliability, operability and observability:
- Evolvability and conceptual coherence:
- Idiomatic language, platform, protocol and framework use:
- Framework-consumer API, documentation, examples, diagnostics and compatibility:
- Automated and human evidence required:

## Decisive investigations

| Question | Evidence or experiment | Result | Effect on premises and candidates |
| -------- | ---------------------- | ------ | --------------------------------- |

## Conclusion

- Outcome and obligations retained:
- Premises accepted:
- Premises rejected:
- Essential complexity:
- Mechanisms removed or combined:
- Selected system shape:
- Remaining unknowns:
- Evidence that would reopen the decision:
```

## Review questions

Before accepting the record, reviewers should be able to answer:

1. Does it explain what would fail, for whom, if the capability did not exist?
2. Does it represent the current system's excellent behaviour and hard-won knowledge?
3. Does it distinguish essential complexity from a chosen or historical system shape?
4. Does at least one credible candidate change or remove the original premise?
5. Does it examine whether several current systems can become one coherent authority?
6. Does it consider native and idiomatic mechanisms before custom framework machinery?
7. Does it treat framework convention as implementation guidance rather than evidence that an Oak requirement exists?
8. Does every premise state evidence that would invalidate or materially weaken it?
9. Do the candidate invalidators test lost outcomes and hidden complexity rather than implementation preference?
10. Is the selected boundary justified by semantics, authority, isolation, lifecycle or verifiable invariants?
11. Is implementation genuinely the next source of evidence, rather than a substitute for unanswered questions?

## Example challenges

| Current element                      | Do not begin with                             | Begin by asking                                                                                                                                      |
| ------------------------------------ | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Two router shells and provider trees | How to create one shared shell                | Which obligations truly require shared lifetime or client state, and can request, route or isolated interaction boundaries express them directly?    |
| Oak Components                       | How to split or replace the component package | Which visual and accessible interaction outcomes require maintained code, and which can be generated or provided by native elements and CSS?         |
| Curriculum SDK, search and graph     | How to standardise three APIs                 | Are these three necessary systems, or derived views of one authoritative curriculum model?                                                           |
| Pupil result workflow                | Which state library to use                    | What is the authoritative learning transition, and which current stores, URLs and compensation exist only because acknowledgement happens too early? |
| Teacher downloads                    | How to rebuild the download form              | Why is a download or generated archive the right outcome, and could resource representation or delivery change so the workflow disappears?           |
| Saved content                        | Which persistence adapter to build            | What user need requires durable identity-bound state, and could another product model satisfy it without replicated optimistic collections?          |
