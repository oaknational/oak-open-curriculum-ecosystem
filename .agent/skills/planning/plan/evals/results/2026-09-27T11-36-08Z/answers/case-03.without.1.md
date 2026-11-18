# Integration plan: curriculum API ↔ partner teacher tool

The working directory is empty, so this plan is based only on what you described. It doesn't draw on any code or docs.

## Core idea

Two things are settled: the goal (teachers find lessons by subject) and our API contract. One thing isn't: how subjects map between the two systems, and who owns that mapping. Build all the settled work now and keep the mapping in one small, swappable place. Meanwhile, push the ownership question to a decision with a deadline and a default that applies if nobody decides.

## 1. Split the ownership dispute into four questions

"Who owns the mapping" is usually four questions, and the disagreement is often about only one of them:

| Question | Recommended answer |
|---|---|
| **Vocabulary:** whose subject list is the reference? | **Ours.** It's already in our settled API contract. |
| **Mapping data:** who writes and updates the partner-label → our-subject-ID table? | **Partner.** They know their UI labels and when those change. |
| **Where it runs:** which system does the translation? | **Partner side**, calling our API with our subject IDs. |
| **Accountability:** who fixes it when a teacher searches "Maths" and gets nothing? | **Shared, with a named owner on each side.** Partner owns the mapping entries; we own the reference list and tell them before it changes. |

The idea behind this: the system that uses a published contract adapts to it. If we did the translation for this partner, we'd be starting a separate mapping job for every future partner.

**Fallback if the partner won't move:** we host the mapping table, but the partner still edits it, through a PR or admin UI. We run the translation; they keep responsibility for the content. That settles where it runs without us taking on their vocabulary.

## 2. Work that can start now

1. **Publish our subject list** as part of the contract, e.g. `GET /subjects` returning stable IDs, labels and hierarchy, plus a versioning and deprecation policy. The partner needs this under any ownership model.
2. **Partner builds against our API** using our subject IDs directly: auth, lesson search by subject ID, pagination, errors.
3. **Put the mapping behind a single interface**, `resolveSubject(partnerLabel) → ourSubjectId[]`. It returns a list because one partner label can cover several of our subjects, or none. At first it's backed by a hand-written table. Whoever ends up owning it replaces the implementation, and nothing else changes.
4. **Define what happens when a label doesn't map.** Never return silent empty results. Log it, show "no lessons for this subject yet", and report counts so gaps show up.

## 3. Resolving the mapping contract (runs in parallel)

1. **Collect real data.** Get the partner's full subject list and map it against ours. Sort each label into exact match, one-to-many, many-to-one, or no match. That turns the argument into a concrete list of disputed entries.
2. **Write a one-page proposal** with the ownership split above, the fallback, and the change process: how either side announces a vocabulary change, and how much notice they give.
3. **Hold a decision meeting** with someone on each side who can actually agree. Set a date and a default: if nothing is agreed by then, the partner-side mapping in §1 applies for launch and gets revisited after launch.
4. **Record the decision** in the integration agreement or contract appendix, not just in meeting notes.

## 4. Launch gates

- Mapping owner named in writing (both sides)
- Every partner subject label maps, or is explicitly marked as having no match
- Unmapped-search rate is monitored, with an alert threshold
- Notice period for changes to our subject list is agreed (e.g. 30 days)
- End-to-end check: a teacher picks each top-level subject in the partner tool and sees lessons

## Risks

- **Mapping goes stale quietly.** Either side renames a subject and searches start returning nothing. The fix is to make unmapped hits visible (§2.4) and agree a change-notice process.
- **Ownership slips back to "shared" with nobody accountable.** The fix is named people, not team names.
- **Scope creep into a general crosswalk service.** Only build one if a second partner needs it.

## What would sharpen this plan

- The partner's actual subject list, so the gap analysis can be done now
- Their specific objection: is it about effort, expertise, or liability?
- Whether more partners are expected. If so, us hosting a shared mapping becomes easier to justify.

I can draft the subject-list endpoint spec or the one-page ownership proposal next.
