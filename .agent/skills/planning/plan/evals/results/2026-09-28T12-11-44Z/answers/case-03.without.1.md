# Integration plan: curriculum API and the partner's teacher tool

## Settled (taken as given)

- **Value:** teachers need to find lessons by subject. Three observed sessions and the partner's request record this.
- **API contract:** lessons are keyed by subject slug. The slugs are `biology`, `chemistry`, `physics` and `combined-science`. The schema is versioned, and a slug is never renamed within a major version.

## The open decision, which blocks part of the work

**Question:** Who owns the mapping from API slugs to the tool's taxonomy, and what happens to `combined-science`, which has no subject in the tool?

**Status:** The partner says the API should own the mapping. Our team says the tool should. Nobody with authority over both has ruled, and this plan doesn't assume an answer. The first action is to get a ruling:

1. **Find the decider.** Name one person or forum with authority over both sides, such as the partnership owner or a joint steering contact. If no such person exists, that gap is the first problem to escalate.
2. **Bring a one-page decision request.** It should state the question, the two positions, the options below, what each option commits each side to, and a date by which the blocked work needs an answer.
3. **Offer a proposal, labelled as a proposal.** Split the question in two, because each side's position fits one part:
   - **The API owns what its slugs mean.** We would document what `combined-science` covers. We could also expose its component subjects as data, for example `components: [biology, chemistry, physics]`. This is an additive field, so it's allowed within the current major version.
   - **The tool owns how it places those slugs in its own taxonomy.** This is the usual consumer-side translation layer, and it avoids tying the API to one partner's taxonomy.

   The decider may reject this. Both "API owns it all" and "tool owns it all" remain valid rulings.

**Options for `combined-science` in the tool.** Whoever is ruled the owner picks one. Each option is listed with its main cost:

| Option | Cost |
|---|---|
| Show those lessons under Biology, Chemistry and Physics | Duplicates lessons across subjects. A teacher may not realise a lesson is combined-science content. |
| Add a "Combined Science" subject to the tool | Changes the partner's taxonomy, which is their product decision. |
| Leave those lessons out of the tool | Teachers who teach combined science can't find their lessons. |
| API tags each lesson with its component subjects | Needs content work on our side to tag each lesson accurately. |

**One fact would sharpen the decision:** do any of the three observed sessions involve teachers who teach combined science? If so, leaving those lessons out breaks the value everyone agreed on. If not, the cheapest option may be acceptable for a first release.

## Work that can start now

- **Slug subjects end to end:** access, auth, pagination and error handling for `biology`, `chemistry` and `physics`. These presumably map one-to-one to tool subjects; confirm that with the partner. This delivers most of the value without waiting for the ruling.
- **Version handling:** the tool should pin to the current major version and reject or log unknown slugs rather than crash, since new slugs can appear in minor versions.
- **Acceptance tests from the observed sessions:** for each session, a teacher searches for a subject and finds the expected lessons. Write the combined-science cases now and mark them pending.
- **Documentation:** document the slugs' meanings and the no-rename guarantee in the API's contract docs. This is ours to do under any ruling.

## Blocked until the ruling

- Implementing the mapping for `combined-science`, on whichever side is ruled the owner.
- The `components` field, or per-lesson subject tagging, if the ruling requires it.
- Running the pending combined-science acceptance tests.

## Risks

- **No ruling arrives.** Either side could then ship its own assumption, and the two could conflict. Mitigation: agree now that nobody ships `combined-science` handling until a ruling is made, and ship the three one-to-one subjects meanwhile.
- **Mapping built into the API for this one partner.** Future consumers would inherit this partner's taxonomy. Any addition to the API should describe our own subjects, not the tool's.
- **A later major version renames slugs.** If the tool owns the mapping, it breaks at that point. Whoever owns the mapping needs a notification path for major-version changes.

**Next step:** name the decider and send the decision request, with the proposal and the combined-science question from the observed sessions attached. Start the one-to-one subject work in parallel.
