# Plan: Curriculum API ↔ Partner Teacher Tool

## What's settled (not reopened here)

- **Value:** teachers need to find lessons by subject. Three observed sessions and the partner's request back this up.
- **API contract:** lessons are keyed by subject slug. The slugs are `biology`, `chemistry`, `physics` and `combined-science`. The schema is versioned, and no slug is renamed within a major version.

## What's open, and blocks one part of the plan

The subject mapping between our slugs and the tool's taxonomy has no agreed owner. The partner says we should define it; our team says the tool should. That's a disagreement over who owns the mapping, not a technical question. Nobody with authority over both sides has ruled, so this plan doesn't assume an answer. Instead it keeps the mapping in one place so that either answer fits without rework.

---

## Phase 0: Get the ownership decision (start now, alongside Phase 1)

1. **Find the decider.** Name someone with authority over both sides: a joint product lead, whoever signs the partnership agreement, or an escalation to both sides' sponsors. Until that person exists, the dispute can't close.
2. **Write a one-page decision brief** with both positions stated neutrally:
   - **API owns it:** one canonical mapping that every consumer shares. But we'd be encoding knowledge of a taxonomy we don't control, and every taxonomy change on their side would need a release from us.
   - **Tool owns it:** the mapping sits next to the taxonomy it targets, and our API stays consumer-agnostic. But each future partner has to solve `combined-science` again, possibly in inconsistent ways.
   - **Third option:** a mapping document that we publish and they approve, versioned separately from the API schema.
3. **Ask the decider two questions:**
   - Who owns the mapping?
   - How should `combined-science` resolve in a taxonomy that doesn't have it? The choices are listed under Phase 2.
4. **Set a deadline** that falls before Phase 2 has to ship, so the gap can't quietly turn into whatever someone happens to implement.

My recommendation to put in the brief: the tool owns the mapping, and we publish the slug list plus a plain description of what `combined-science` contains. This keeps the API's contract consumer-agnostic, which is what its versioning rules are designed to protect. It's still only a recommendation, not a ruling.

## Phase 1: Build everything that doesn't depend on the mapping

- **Connection:** auth, rate limits, environments, and pinning the tool to the API's current major version.
- **Lesson retrieval by slug:** for `biology`, `chemistry` and `physics`, a straight 1:1 mapping is very likely. Build and test these end to end, but still route them through the mapping layer described next rather than hardcoding them.
- **Mapping layer as its own component:** a small, versioned table of the form `api_slug → [tool_subject_ids]`, with an explicit "unmapped" state. Where the table lives (our API, the tool, or a shared config) is a deployment choice made once Phase 0 decides ownership. The code that reads it doesn't change.
- **Contract tests** against the published slug list, so a new slug in a later major version fails loudly instead of silently vanishing.

## Phase 2: Resolve `combined-science` (after the Phase 0 decision)

Whichever option the decider picks goes into the mapping table:

| Option | Effect for teachers | Risk |
|---|---|---|
| Map to biology + chemistry + physics | Combined lessons show up under all three | Duplicates in results; possibly the wrong level for single-science teachers |
| Map to a parent "Science" subject, if the tool has one or adds one | A clean single home | Requires a change to the tool's taxonomy |
| Leave unmapped and show under a separate filter | No misclassification | Teachers may not find these lessons, which undercuts the stated value |

Before launch, check the chosen option against the three observed sessions: would those teachers have found what they were looking for?

## Phase 3: Launch and maintain

- A pilot with a small group of teachers, tracking whether searches return results, broken down by subject.
- Mapping changes are versioned and owned according to the Phase 0 decision, with a named contact on each side.
- Major-version upgrades of the API trigger a review of the mapping, since that's the only point where slugs can change.

---

**Critical path:** Phases 0 and 1 run in parallel. Only Phase 2 waits on the decision. If Phase 0 stalls, the integration can still launch for the three single sciences with `combined-science` explicitly unmapped. That's a partial release, and it has to be agreed as one rather than left as the default outcome.
