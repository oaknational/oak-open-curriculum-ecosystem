# Data-grounded workflows

End-to-end recipes that use the Oak Curriculum MCP to apply the six principles to real work. Each assumes you have called `get-curriculum-model` once. Tool names may be prefixed in your setup — match by suffix.

---

## A. Benchmark a draft against Oak (create or review)

When you have a draft unit/lesson and want to compare it to Oak's equivalent.

1. **Find Oak's analogue.** `explore-topic({ query: "<topic>", subject, keyStage })` for a broad map, then `search({ query, scope: "lessons" })` (or `scope: "units"`) to pick the closest match.
2. **Pull the detail.** `get-lessons-summary({ lesson })` and/or `get-units-summary` / `fetch({ id: "unit:<slug>" })`.
3. **Compare, principle by principle:**
   - _Knowledge & vocabulary_ — are your keywords, definitions and key learning points as precise as Oak's?
   - _Sequenced_ — does your order match the thread progression (workflow B)?
   - _Evidence-informed_ — do you handle the misconceptions Oak documents (workflow C)?
   - _Accessible_ — same ambitious content, with scaffolded routes? Any content guidance to carry over?
4. **Report** using the review rubric in `oak-curriculum-principles`, citing the real Oak data as the benchmark.

---

## B. Verify or build a teaching sequence

When sequencing a topic across lessons or years.

1. `search({ query: "<concept>", scope: "threads", subject })` to find the relevant thread(s).
2. `get-thread-progressions` anchored by that thread's slug (`threadSlug` — a corpus key, not free text); units are ordered by teaching year, and same-year units are explicitly unordered. This is how Oak builds the concept over time.
3. `get-prior-knowledge-graph` anchored by the units' slugs (`unitSlugs`) for the prior knowledge each unit states it assumes. The statements name knowledge, not the units that teach it — read them against the earlier units in your sequence and judge whether each is already covered.
4. **Check your draft:** does it assume knowledge Oak introduces later? Does it skip a step Oak treats as foundational? Adjust the sequence, or note the deviation and your rationale.

**Anchors to sanity-check against:** `number` (110 units), `geometry-and-measure` (59), `ratio-and-proportion` (18) in maths; `exploring-the-gothic` (7) in English; `power-government-and-religion` (23) in history.

---

## C. Anticipate misconceptions from real data

When designing or reviewing for evidence-informed quality.

1. For a specific lesson: `get-lessons-summary({ lesson })` and read `misconceptionsAndCommonMistakes[]` (each has a `misconception` and a `response`) and `teacherTips[]`.
2. For a topic sweep: `get-misconception-graph` is an anchored, bounded query — discover the topic's lesson, unit, or thread slugs first (`search` scoped to the subject, or the browse tools), then call it with those slugs (corpus keys, not free text). For a single lesson, prefer the `misconceptionsAndCommonMistakes` field from `get-lessons-summary`.
3. **Design around the real errors:** add a diagnostic question that surfaces each misconception, choose representations that pre-empt it, and write the teacher response. A lesson that ignores the best-documented pitfall for its topic is not yet evidence-informed.

---

## D. Find exemplars of a principle

When you want a model to learn from or point to.

1. `explore-topic({ query, subject? })` or `search({ query, scope })` with a query that targets the principle, e.g. vocabulary teaching, diverse texts, practical science.
2. For diversity/breadth specifically, browse threads such as `cultural-spotlight` (99 units), `representation-and-identity` (22), `diversity` (12) via `get-threads-units`.
3. `fetch`/`get-lessons-summary` the best hits and extract the pattern worth reusing (how a keyword is defined, how a sequence retrieves prior knowledge, how a text selection balances windows and mirrors).

---

## E. Review an existing resource using the real Oak version

When auditing third-party or draft material.

1. Identify the Oak equivalent (workflow A, steps 1–2).
2. Run the **review rubric** from `oak-curriculum-principles`, but substitute real Oak data for each "strong looks like": Oak's keywords, Oak's thread order, Oak's misconceptions, Oak's national curriculum statements, Oak's content guidance.
3. Produce: summary judgement → principle-by-principle ratings with _located_ evidence → two or three priority actions → strengths to keep. Cite the specific Oak lesson/unit/thread used as the benchmark.

---

## F. Map to national-curriculum statements and check adaptability

When the concern is flexibility and the national curriculum statements a unit records.

1. `browse-curriculum({ subject, keyStage })` to see structure, sequences and options.
2. `get-units-summary` / `fetch({ id: "unit:<slug>" })` to read the national-curriculum statements the unit records and any `unitOptions`.
3. Map your material to the same national curriculum statements; use Oak's `unitOptions` as a model for offering teacher choice without forking the entitlement; confirm threads are signposted so localisation won't break coherence.

> **KS4 note:** tiers (foundation/higher), exam boards and exam subjects add complexity. Science KS4 must be traversed via the sequences route (the flat `key-stages/ks4/subject/science/lessons` route returns empty). See `get-curriculum-model` → structural patterns.

---

## Linking to the user's content

When you produce download links for Oak assets, use `download-asset({ lesson, type })` (HTTP transport only) — call once per asset type. On stdio transports, point the user to the lesson via its `oakUrl`. Always present Oak content with attribution and carry through any content guidance.
