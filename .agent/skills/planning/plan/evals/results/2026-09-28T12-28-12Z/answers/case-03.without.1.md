# Plan: Curriculum API ↔ Partner Teacher Tool Integration

## Where things stand

| Item | Status | Source |
|---|---|---|
| **Value:** teachers need to find lessons by subject | Settled | Three observed sessions plus the partner's request |
| **API contract:** lessons keyed by subject slug (`biology`, `chemistry`, `physics`, `combined-science`); schema versioned; a slug is never renamed within a major version | Settled | Written contract |
| **Subject-mapping contract:** how slugs map to the tool's taxonomy, and who owns that mapping | **Not settled** | The partner says the API should own it. Our team says the tool should. Nobody with authority over both has decided. |

This plan doesn't decide who owns the mapping. Two sides with equal standing disagree, and choosing between them is not an engineering call. The plan instead does three things: it builds everything that doesn't depend on the answer, it structures the work so that either answer is cheap to adopt, and it gets the question in front of someone who can decide it.

---

## Phase 0: Get the ownership decision made (start now, in parallel)

1. **Find the decision-maker.** This is someone with authority over both the API and the partnership, such as a partnership owner or a joint product lead. If no such role exists, that gap is the first thing to escalate.
2. **Write a one-page decision brief** that both sides review before it goes up, so neither can say it misrepresents them. It should include:
   - The question: who defines and maintains the mapping from API slugs to the tool's subjects?
   - The concrete case that forces it: `combined-science` has no equivalent in the tool.
   - Both positions, each stated in its own side's terms.
   - What each option commits the owner to. That means maintenance whenever either taxonomy changes, a versioning obligation, who fields support tickets about wrong mappings, and who decides edge cases like `combined-science`.
   - Things that are true under either option. The "slugs never renamed within a major version" guarantee means a mapping keyed on slug is stable no matter who holds it.
3. **Set a date for the decision** and state which work is blocked until then: only Phase 2.

## Phase 1: Build what doesn't depend on the decision

- **Lesson retrieval by slug.** The partner's client calls the API by subject slug, pinned to a major version. This follows directly from the settled contract.
- **Version handling.** Every request states the major version it expects. Any mapping, wherever it ends up, is keyed on the pair (major version, slug), so the "no renames within a major" guarantee carries through.
- **Mapping kept as a separate piece of data, not logic.** The integration reads one small table (slug → tool subject(s), per major version) through a single interface. Neither side hard-codes the mapping in its own code. The table's location (API response, API endpoint, or tool config) is the only thing the ownership decision changes.
- **Defined handling for slugs with no mapping.** A slug with no entry is logged and surfaced. It is never silently dropped or guessed. The tool shows no match rather than a wrong match.
- **Contract tests** against the four current slugs, using the three observed teacher sessions as acceptance scenarios.

## Phase 2: The mapping itself (blocked until the owner is decided)

After the ruling, the owner:

1. **Decides how `combined-science` maps.** The options include mapping it to several tool subjects, adding a subject to the tool, mapping it to a broader parent category, or excluding it for now. This is a curriculum and product judgment, which is exactly why it belongs to the owner and why this plan doesn't pre-empt it.
2. Populates the mapping table for the three straightforward slugs and for `combined-science`.
3. Publishes the table at the location that matches the ruling, and commits to how it will maintain it.

## Phase 3: Rollout

- Pilot with a small group of teachers and re-run the three observed-session scenarios.
- Monitor unmapped-slug events and "no lessons found" searches, especially science searches.
- Broaden the rollout once `combined-science` searches return what teachers expect.

---

## Open questions (separate from ownership)

- **Adding and removing slugs.** The contract forbids renames within a major version but doesn't say whether a minor version can **add** a slug, or whether any version can remove one. A new slug in a minor release would reach the mapping unannounced. Whoever owns the contract should clarify this. The unmapped-slug handling in Phase 1 covers the risk in the meantime.
- **Major-version transitions.** When a new major version renames slugs, who updates the mapping, and how much notice does the partner get? This belongs in the brief because it's part of what ownership costs.

## Main risk

The main risk is that the ownership question drifts undecided and someone quietly hard-codes a mapping on one side to get unblocked. That would make the disputed choice by default and bury it in code. Keeping the mapping as a separate table read through one interface, with a set decision date, is what prevents this.
