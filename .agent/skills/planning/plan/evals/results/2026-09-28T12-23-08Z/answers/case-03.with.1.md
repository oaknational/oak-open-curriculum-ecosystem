# Integration plan: curriculum API → partner teacher tool

This is a draft plan. Nobody has approved it, so it doesn't govern any work yet. There's no repository to put it in, so here it is in full. I didn't redo the settled parts (the value and the API contract). I did analyse the one unresolved part: how our subject slugs line up with the tool's subjects. I haven't taken a side on who owns that.

## 1. Where our API and the tool fail to line up

**What each side has.** We supply a fixed set of subject slugs for each major version. The tool needs every lesson to sit under one of its own subjects so teachers can find it.

**Status:**
- **Biology, chemistry, physics:** these should line up, but only if the tool has matching subjects that mean the same thing. Nobody has checked, because we don't have a versioned copy of the tool's subject list.
- **Combined-science:** this fails. The tool has no subject to put it under.
- **Future slugs:** we can't tell yet. Our contract says slugs are never renamed within a major version, but it doesn't say whether new ones can be added.

**Ways it breaks even though each side works correctly on its own:**
1. **Combined-science lessons disappear.** The data passes validation but the lessons never show up. Because each side thinks the other owns the mapping, this is the most likely result if nobody acts.
2. **Combined-science is copied into biology, chemistry and physics.** Lessons then show up under the wrong subject or at the wrong depth, depending on what combined-science actually covers.
3. **We add a new slug in a minor version.** The contract allows it by staying silent, so those lessons disappear the same way as in case 1.
4. **The partner changes their subject list.** Our versioning doesn't cover their changes, so the mapping goes stale without anyone noticing.
5. **Both sides build their own mapping.** Lessons get translated twice, and the two versions can disagree.

**What the mapping has to do, whoever owns it:**
- Cover every slug in the pinned major version, with an explicit rule for combined-science.
- Fail loudly on a slug it doesn't know (an error or alert), never drop it silently.
- Record which API major version and which version of the tool's subject list it was built against.
- Get reopened whenever either side changes.

**Gaps in our own API contract.** These are ours to fill whatever the ruling, and the mapping owner can't do the job without them:
- **(a)** What combined-science covers, and whether its lessons also appear under biology, chemistry or physics.
- **(b)** Whether new slugs can be added within a major version.

## 2. The plan

```yaml
type: delivery
status: sketch
serves: <strategic node for "teachers find lessons by subject">   # to be named
depends_on: []
owner_gates:
  - id: mapping-ownership
    awaiting: ruling from an authority over both parties on who owns the subject-mapping contract
    clears_when: that authority records the owner and where the ruling lives
    expires: 2026-10-12   # placeholder; use the strategic node's gate_expiry_default
```

**Before escalating:** check the partnership or integration agreement first. If it already says who is responsible for translating data, that settles it and we don't need an approval step. If the gate expires, we escalate again. Nobody's position wins by default because the other side stayed quiet.

**Goal:** teachers using the partner's tool find our lessons by subject, including combined-science lessons.

**Who gets what:**
- **Teachers:** they can find every lesson under a subject they recognise. This is backed by the three observed sessions and the partner's request.
- **The partner:** a predictable feed of lessons whose subject changes are announced ahead of time.
- **Our team:** a mapping written down against specific versions, so changes on either side can't break it without anyone noticing.

**Why this should work:** the slugs are stable, and the mapping covers every slug, is tied to specific versions and fails loudly on anything new. Together those mean every lesson has a place in the tool's subject list, and we find out about gaps instead of teachers.

**Steps:**
1. **Now:** get the tool's subject list as a named, versioned artefact, and pin the API major version the integration uses.
2. **Now, our side:** fill gaps (a) and (b) in our API contract.
3. **Now:** set up access and fetching lessons by slug against the pinned version, with tests that check responses against the schema.
4. **Only after the ownership ruling:** whoever is ruled the owner writes the mapping so it meets every requirement in section 1.
5. **After step 4:** gather the evidence for the acceptance criteria below.

**Acceptance criteria and how each is proven:**

| Criterion | Proof |
|---|---|
| **AC1.** Every slug in the pinned version maps to a tool subject. | A coverage test built from the schema's slug list. This is testable in our repo only if the mapping lands with us; otherwise the partner has to confirm it. |
| **AC2.** An unknown slug causes an error or alert, never a silent drop. | A test that feeds in a made-up slug. |
| **AC3.** The mapping records both version identifiers. | Checked when the mapping is reviewed. |
| **AC4.** In an observed session, a teacher finds a combined-science lesson by subject in the tool. | A dated record kept alongside the existing value evidence. Only a person can confirm this, not a test. |

**Out of scope:**
- Deciding who owns the mapping.
- Adding a combined-science subject to the partner's tool.
- Renaming or splitting our combined-science slug. That would be a major-version change and needs its own decision.

## 3. Recommendation and what's open

- **Don't ship to teachers until the mapping exists.** A biology/chemistry/physics-only release would hide combined-science lessons without anyone noticing, which is case 1 above. If someone wants to ship that way anyway, whoever owns the product has to accept that gap explicitly. It shouldn't slip in by default.
- **Still to decide:**
  - Who is the joint authority for the ruling.
  - The real deadline for the approval step (2026-10-12 is my placeholder).
  - Who builds the integration code. The plan statement doesn't say, and this is the same ownership dispute in another form.
- **Not done:** the planning process calls for an independent review before approval, and that hasn't been run.
