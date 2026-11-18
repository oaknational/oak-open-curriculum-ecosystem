# Plan sketch: curriculum API ↔ partner teacher tool integration

There's no repository, so I couldn't check this against the plan schema, the impact-areas list or the templates. Fields that depend on them are marked **⟨unverified⟩**. The plan is `status: sketch` and doesn't authorise any work until an owner ratifies it.

## The key point

The open decision isn't the combined-science mapping itself. It's **who owns the mapping contract.** Both sides have a reasonable claim, and neither can settle it alone:

- **API side:** we publish the slugs and promise they stay stable within a major version.
- **Tool side:** the partner owns the taxonomy that teachers actually browse.

A mapping written by one side can be broken by a change on the other side. So whoever owns it also has to watch for changes on both sides. Choosing an owner means choosing who carries that duty, and only someone with authority over both parties can make that choice.

I haven't built an answer into the plan. The ownership question is an owner gate. Work that doesn't depend on it goes ahead. Work that does is blocked.

## Frontmatter (draft)

```yaml
type: delivery
status: sketch
serves: ⟨unverified: name the strategic node this integration serves⟩
impact_areas: ⟨unverified: from the closed registry, likely the curriculum API's public contract⟩
depends_on:
  - mapping-ownership ruling: blocking (for AC3–AC5 only)
owner_gates:
  - id: mapping-contract-owner
    awaiting: ruling by a party with authority over both our API and the partner tool
    clears_when: a named owner of the slug-to-taxonomy mapping contract is recorded, with the ruler's word at a traceable pointer
    expires: ⟨absolute date needed. Set it from the strategic node's gate_expiry_default. I don't have that value and haven't invented one⟩
```

I checked for an existing ruling that would make this gate unnecessary. The statement doesn't give one: the API contract covers slugs, not how they map onto a consumer's taxonomy. If an ADR or agreement exists that does cover it, it replaces the gate. If the gate expires with no ruling, nothing is shipped by default. Expiry leads to escalation, not a decision.

## Goal
Teachers using the partner tool can find curriculum lessons by subject.

## Users and value
- **Teachers:** find lessons by subject without leaving the tool. This is the settled value, backed by three observed sessions and the partner's request.
- **Partner developers:** build against a stable, versioned API and can trust that the slugs they rely on won't change within a major version.
- **Our API team:** the integration uses the published contract as it stands, with no special-case changes for this partner.

## Mechanism
Lessons are keyed by subject slug, and slugs never change within a major version. A consumer that pins a major version and translates slugs into its own subjects can therefore offer subject browsing that stays correct over time. What remains is that translation step, and whoever owns it.

## What the mapping owner must define (whoever it is)

This is the content the ruling unlocks. I list it so the owner knows what they're taking on, not to answer it early:

1. **The three single-science slugs:** confirm which tool subject each maps to. This is probably one-to-one, but I've assumed that, not verified it.
2. **`combined-science`:** the tool has no matching subject. The options change what teachers see:
   - Show combined-science lessons under biology, chemistry *and* physics. They're easy to find but duplicated, and the lesson's real subject is hidden.
   - Show them under a broader parent subject, if the tool has one.
   - Add the subject to the tool. That means a taxonomy change on the partner's side.
   - Leave them out. Teachers can't find those lessons at all, which directly undercuts the settled value.
3. **How change is handled:** what happens when we add a slug, release a new major version, or the partner changes their taxonomy.
4. **What happens with an unmapped slug:** the lessons are hidden, shown under a fallback subject, or cause an error. It must be observable, never a silent drop.

## Acceptance criteria and proofs

| # | Criterion | Proof |
|---|---|---|
| AC1 | The tool's client pins an API major version and gets lessons by each of the four slugs | `repo-safe`: contract test against the versioned schema |
| AC2 | A slug the mapping doesn't know about is handled as the contract specifies and is observable | `repo-safe`: test with a made-up fifth slug |
| AC3 | The mapping contract exists, has the owner named in the ruling, and covers items 1–4 above | `owner-held`: the ruling party confirms; record where their confirmation lives |
| AC4 | The chosen combined-science outcome is tested | `repo-safe`: fixture-based test; the case must be decided under AC3 first |
| AC5 | Teachers find lessons by subject in the live tool, including combined-science lessons if the ruling keeps them visible | `owner-held`: the partner observes this in their deployment; record the dated observation |

## Out of scope
- Renaming or splitting `combined-science`. That breaks the major-version promise and would need a new major version, which nobody has authorised.
- Changing the partner's taxonomy, unless the ruling says to.
- Other subjects, search beyond subject, and any integration features that go beyond the settled value.

## Order of work
1. **Now, not blocked:** the versioned client plus AC1 and AC2. The unknown-slug test uses a placeholder behaviour, clearly labelled as a placeholder until AC3 is done.
2. **Now:** send the ownership question to someone with authority over both sides, as one decision with the four items above attached.
3. **After the ruling:** the mapping owner writes the mapping contract (AC3). The contract's own content is a separate specification job.
4. **Then:** implement and test the mapping (AC4) and get the partner's observation (AC5).

Each step becomes a single-PR slice when an implementer picks it up. The review dispositions ledger is empty.

## Still needed before ratification
- The strategic node for `serves` and its gate-expiry default.
- Impact areas from the registry.
- **Who has authority over both sides.** Nobody has been identified yet. If nobody holds that authority, the gate can't clear, and the fix is to set up a joint agreement, not to wait longer.
- Once a repository exists, this sketch needs to be committed there as a self-contained node so a fresh session can work from it.
