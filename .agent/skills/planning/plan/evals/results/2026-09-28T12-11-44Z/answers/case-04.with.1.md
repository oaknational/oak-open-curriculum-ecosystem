**Stage 5: Delivery plan** (a sketch until you ratify it)

The plan-node estate this skill expects (`.agent/plans/…`, schema, templates) isn't in this workspace, so I haven't written a node file. What follows is the sketch body. The gate expiry dates are my proposals for you to set.

- **Goal:** teachers using the partner tool reach our lessons through a correct subject mapping, and mapping failures show up instead of hiding.
- **User groups and value:**
  - Teachers get correct subject browsing. Faster lesson finding (V1) is a hypothesis.
  - The partner's engineers get a versioned contract and fixtures.
  - Our API team gets early warning when the partner side changes.
- **Mechanism:** an independent per-slug oracle, a completeness diff, and a versioned mapping with agreed change notice. Together these turn quiet mismaps into failing checks.

**Sequence**
1. **Us:** answer U2 (can rev 5 enumerate its slugs?) and write M7, the meaning of each slug. *Owner gate:* curriculum owner. Proposed expiry 2026-10-12.
2. **Partner:** agree M2–M6 and M8, and settle U3 (the notice period). *Owner gate:* both integration owners. Proposed expiry 2026-10-19. Blocks steps 4 and 5.
3. **Us:** build the per-slug fixture suite, with expected values from the curriculum owner, and include combined science (U1). This can start alongside step 2.
4. **Joint:** run the fixtures and the completeness diff against the *versioned* partner table.
5. **Reassess** MAP-1 for integration. Go live only on "ready" or "ready with conditions".

**Acceptance criteria**
- *repo-safe:* the fixture suite is green and the completeness diff is empty. Instrument: CI.
- *owner-held:* signed agreement to M2–M6 and M8. Held by the integration owners (names **unknown**).
- *owner-held:* a count of unmapped slugs reported from the partner's production logs.

**Out of scope:** measuring V1. That goes to inquiry design as its own item. Until it's measured, no launch copy claims faster lesson finding.

---

## The revision: partner splits "combined science" into three subjects, with immediate effect

I haven't been told the three new subjects' names, what rule the partner plans to use to split content, or whether the partner tool is live. All three are **unknown**.

**Changes to the value model**

| Claim | Before | After |
|---|---|---|
| V1 (faster finding) | Hypothesis | Still a hypothesis. Combined-science teachers now face *higher* risk of wrong or missing lessons. |
| V2 ("complete") | Promise, unverified | **Stale.** It was made against a taxonomy that no longer exists. Whether the mapping is complete against the new one is **unknown**. |
| V3 (schema tests) | Observed | Still observed and unchanged, because our API didn't change. It still says nothing about meaning. |

**Mapping contract, MAP-1 draft r1 → r2**
- *Semantic change:* I've been assuming our API has one `combined-science` slug (**unconfirmed**). If so, that slug now faces three partner subjects. This is exactly case A2, and M3 goes from theoretical to active.
- *Behaviour:* the partner has two routes.
  - **Map to all three.** This fits M3 and keeps our lessons reachable, but combined-science lessons appear under subjects they may not belong to.
  - **Split our lessons across the three.** This needs a finer-grained signal per lesson. Whether rev 5 carries one is **unknown**.
- *Authority:* if the split needs finer subject data from us, that's a **change to our API** (rev 6). Our API owner decides that, not this plan and not the partner.
- *Evidence:* no fixtures ever existed for combined science, so no evidence has been invalidated. U1 just got harder and more urgent.

**Seam**
- C2 (misfiling) and C4 (a partner taxonomy change we can't see) have **now happened as events**. They're no longer hypothetical.
- This isn't a contract breach: M6 was never agreed. It is direct evidence that M6 and M8 are needed.
- Compatibility is still *undecidable* for combined science. For every other slug it's unchanged.

**Readiness**
- Still **not ready** for integration.
- New blocking finding: an unresolved unknown about how the partner maps one slug to three subjects.
- New false-assurance risk: anyone pointing to our green schema tests as proof the split is handled.
- If the tool is live, combined-science results may be wrong **right now**. That's a question to put to the partner today, not something to assume either way.

**Plan changes**
- Add a new **step 0**, scheduled now:
  - Ask the partner for the three subject names, its mapping rule and whether the tool is live.
  - If it's live, ask for its unmapped and misrouted counts for combined science.
- Step 1 gains a decision for our API owner: does rev 5 carry enough per-lesson detail, or do we need rev 6? A rev 6 would **reopen every stage above**, because it changes our endpoint's revision.
- Step 3's combined-science fixtures now need expected values for each of the three new subjects.
- The expiries on steps 1 and 2 should come forward. Only you can set the new dates.

The only thing we've actually observed is that schema tests pass. The faster-finding claim is still a hypothesis, "complete" is now a stale promise, and the combined-science mapping is unknown. Nothing we have evidence for supports relying on the integration yet.
