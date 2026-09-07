---
name: oak-curriculum-principles-mcp-enabled
description: >-
  Ground Oak National Academy's six curriculum principles in Oak's *live*
  curriculum data using the Oak Curriculum MCP server. Use when creating or
  reviewing a curriculum, unit, lesson, or resource and you want to check it
  against real Oak content — verifying a teaching sequence against Oak's
  curriculum threads and the prior knowledge units state they assume, mining
  real pupil misconceptions
  to anticipate errors, checking vocabulary and key learning points, checking
  content-guidance and supervision levels, or finding exemplar Oak units and
  lessons that demonstrate a principle. Use whenever the user asks to "compare
  with Oak", "check this against Oak's curriculum", "find an Oak exemplar",
  "what does Oak do here", or to benchmark a draft against Oak. Requires the Oak
  Curriculum MCP. Pairs with the oak-curriculum-principles skill, which holds
  the principles in full, with the evidence base, and subject principles.
license: Curriculum principles © Oak National Academy. See references/sources.md.
compatibility: >-
  Requires the Oak Curriculum MCP server (mcp.thenational.academy/mcp)
  connected to the agent. Designed to be used alongside the
  oak-curriculum-principles skill. If the MCP is unavailable, fall back to that
  self-contained skill.
metadata:
  author: Oak National Academy
  version: '1.1.0'
---

# Oak Curriculum Principles — grounded in live data

This skill does one thing the self-contained `oak-curriculum-principles` skill can't: it anchors the six principles in Oak's **real curriculum** — ~164 threads, the prior knowledge each unit states it assumes, ~12,800 documented misconceptions with teacher responses, vocabulary with definitions, the national curriculum statements units record, and tens of thousands of lessons — through the **Oak Curriculum MCP**.

Use it to move from "this looks well-sequenced" to "this matches Oak's _Number_ thread progression, and the prior knowledge these units state they assume," and from "anticipate misconceptions" to "here are the misconceptions Oak has documented for this exact topic."

For the _meaning_ of each principle, the evidence base, and the subject guiding principles for 15 subjects, use `oak-curriculum-principles`. This skill assumes those principles and focuses on grounding them in data. Where the principles come from — Oak's published materials and the evidence Oak cites — is documented in `references/sources.md`.

## Before you start

1. **Call `get-curriculum-model` first.** It returns the domain model (key stages, subjects, entity hierarchy, threads, the property graph) and tool guidance in one call. The other tools are more accurate once it's loaded. Do this once per session.
2. **Tool names may be prefixed.** Depending on how the MCP is connected, tools may appear with a prefix (e.g. `mcp__<id>__get-threads`). Match tools by the suffix shown here (`get-threads`, `search`, `fetch`, …).
3. **Treat the data as a model, not a mandate.** Oak's curriculum is one high-quality reference, not the only right answer. Use it to inform judgement, exactly as the principles intend.

## What's available (and which principle it grounds)

The full tool-by-tool mapping with example calls and data shapes is in `references/grounding-each-principle.md`. The short version:

| Principle                       | Grounding data                                                           | Key tools                                                             |
| ------------------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------------------- |
| **Knowledge & vocabulary rich** | Keywords _with definitions_, key learning points, learning outcomes      | `get-lessons-summary`, `get-keywords`, `get-units-summary`            |
| **Sequenced & coherent**        | ~164 threads with year-ordered units; each unit's stated prior knowledge | `get-threads`, `get-thread-progressions`, `get-prior-knowledge-graph` |
| **Evidence-informed**           | ~12,800 misconceptions + teacher responses; teacher tips                 | `get-misconception-graph`, `get-lessons-summary`                      |
| **Flexible**                    | National curriculum statements; unit options; tiers; programme structure | `get-units-summary`, `browse-curriculum`, `fetch`                     |
| **Diverse**                     | The breadth of Oak content; diversity-related threads and exemplars      | `search`, `explore-topic`, `get-threads-units`                        |
| **Accessible**                  | Content guidance, supervision levels; prior knowledge for chunking       | `get-lessons-summary`, `get-prior-knowledge-graph`                    |

Discovery tools that cut across all of these: `search` (scopes: `lessons`, `units`, `threads`, `sequences`, `suggest`), `explore-topic` (searches scopes in parallel), `browse-curriculum` (structure/facets), and `fetch` (prefixed IDs: `lesson:`, `unit:`, `thread:`, `subject:`).

## Core workflows

Step-by-step recipes with real slugs are in `references/workflows.md`. The headlines:

- **Benchmark a draft against Oak.** Find Oak's analogue (`explore-topic` / `search`), then compare your knowledge, vocabulary, sequence and misconception-handling against the real unit/lesson.
- **Verify or build a teaching sequence.** Use `get-threads` → `get-thread-progressions` to see how Oak orders the concept across years, and `get-prior-knowledge-graph` to read the prior knowledge each unit states it assumes — then judge whether your sequence teaches it first.
- **Anticipate misconceptions from real data.** Pull `get-misconception-graph` (or the `misconceptionsAndCommonMistakes` field on a lesson) for the topic, and design responses around the errors Oak has actually documented.
- **Find exemplars of a principle.** Use `search`/`explore-topic` to surface Oak units and lessons that demonstrate, say, strong vocabulary teaching or diverse text selection, and use them as models.
- **Review using the real Oak version.** When auditing a resource, fetch Oak's comparable lesson and review the draft against it, principle by principle (see the rubric in `oak-curriculum-principles`).

## Worked example (real data)

> **Task:** check a draft Year 5 lesson on adding fractions with the same denominator.
>
> 1. `get-curriculum-model` (orientation).
> 2. `search({ query: "add fractions same denominator", scope: "lessons", subject: "maths", keyStage: "ks2" })` → find Oak's lesson `add-fractions-with-the-same-denominator`.
> 3. `get-lessons-summary({ lesson: "add-fractions-with-the-same-denominator" })` → returns keywords _with definitions_ (`numerator`, `denominator`, `units`), key learning points, and a documented misconception: _"many children add both the numerators and denominators"_, with the recommended response (build unitising with concrete objects first).
> 4. **Knowledge & vocabulary:** does the draft teach and define those keywords? **Evidence-informed:** does it anticipate that exact misconception? **Sequenced:** `get-thread-progressions` for the _Number: Fractions_ thread shows what should come before and after.
> 5. Report against each principle, citing the real Oak data as the benchmark.

## Cautions

- **Components are optional.** Not every lesson has a video, transcript, quiz, or worksheet — check availability before assuming. Quizzes and misconceptions aren't present for every lesson.
- **KS4 is more complex** — tiers (foundation/higher), exam boards, and exam subjects. Science KS4 must be traversed via sequences, not the flat lessons route. See the structural patterns in `get-curriculum-model`.
- **Respect content guidance.** Where `contentGuidance` / `supervisionLevel` are present, carry them through to any derived material.
- **Attribute to Oak.** The curriculum data is Oak National Academy's, published under the [Open Government Licence v3.0](https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/) (OGL v3.0), which requires attribution. When output reproduces or is derived from Oak content or data, credit **Oak National Academy**, link to the relevant lesson/unit/thread on thenational.academy, and link to the OGL. The Oak name and logo are trademarks, **not** covered by the OGL — use only per the [brand guidelines](https://support.thenational.academy/using-the-oak-brand). Full terms: `references/sources.md`.
- **Verify before publishing.** Live data changes; re-fetch rather than relying on cached slugs for formal work. Confirm the national curriculum statements a unit records against the current statutory framework.

## References

- `references/grounding-each-principle.md` — each principle mapped to exact tools, what to look for, and example calls/outputs.
- `references/workflows.md` — end-to-end create and review recipes with real slugs.
- `references/sources.md` — attribution and the Oak Curriculum API.

For the principles' meaning, evidence and subject nuance, use **`oak-curriculum-principles`**.
