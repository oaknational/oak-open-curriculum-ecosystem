# Grounding each principle in Oak data

For each of the six principles: the Oak Curriculum MCP tools that ground it, what to look for in the data, and an example call. Tool names may carry a prefix in your setup — match by suffix. Always call `get-curriculum-model` once before other tools.

IDs for `fetch` are prefixed: `lesson:<slug>`, `unit:<slug>`, `thread:<slug>`, `subject:<slug>`.

---

## 1. Knowledge and vocabulary rich

**Grounding data.** Oak lessons carry vocabulary _with pupil-facing definitions_, a short list of key learning points, and a single pupil outcome — a concrete model of "rich."

**Tools.** `get-lessons-summary`, `get-keywords`, `get-units-summary`, `fetch` (`lesson:` / `unit:`).

**What to look for.** `lessonKeywords[]` (each with `keyword` + `description`), `keyLearningPoints[]`, `pupilLessonOutcome`. Use these as a benchmark for whether your material teaches and defines the right vocabulary and states clear knowledge outcomes.

**Example.**

```text
get-lessons-summary({ lesson: "add-fractions-with-the-same-denominator" })
```

returns, among other fields:

```text
lessonKeywords: [
  { keyword: "Denominator", description: "the bottom number in a fraction. It shows how many parts a whole has been divided into." },
  { keyword: "Numerator",   description: "the top number in a fraction. It shows how many parts we have." }, ...
]
keyLearningPoints: [ "If fractions have the same denominator they can be added.", ... ]
pupilLessonOutcome: "I can add fractions with the same denominator."
```

**Use it:** does your draft teach and define these keywords, and state outcomes this crisply?

---

## 2. Sequenced and coherent

**Grounding data.** ~164 threads, each an _ordered_ set of units that build a concept across years; plus the prior knowledge each unit states it assumes. This is the principle's strongest data anchor.

**Tools.** `get-threads` (all threads + unit counts), `get-threads-units` (units in a thread), `get-thread-progressions` (one anchored thread's progression; units ordered by teaching year, same-year units unordered), `get-prior-knowledge-graph` (a unit's stated prior knowledge, as sentences), `search({ scope: "threads" })`.

**What to look for.** Where your topic sits in a thread; what Oak places before and after it; whether your sequence respects the same order.

**Real threads to anchor on.** `number` (110 units, Reception→Y11), `geometry-and-measure` (59), `ratio-and-proportion` (18), `exploring-the-gothic` (7), `power-government-and-religion` (23), `empire-persecution-and-resistance` (16), `physical-systems-and-processes` (34).

> Unit counts are live and can differ slightly between `get-threads` and the examples in `get-curriculum-model` (e.g. `number` shows 110 in the threads list vs 118 in a model example). Trust `get-threads` / `get-thread-progressions` and re-fetch for current numbers.

**Example.**

```text
search({ query: "fractions", scope: "threads", subject: "maths" })
get-thread-progressions({ threadSlug })   // the fractions thread, units ordered by teaching year
get-prior-knowledge-graph({ unitSlugs })   // what each unit states pupils should already know
```

**Use it:** if your unit assumes knowledge that Oak's thread teaches _later_, your sequence has a gap.

---

## 3. Evidence-informed

**Grounding data.** A large misconception graph — on the order of 12,800 documented misconceptions, each paired with a recommended teacher response (count is per the tool's own summary and is live/approximate) — spanning the curriculum subjects, plus per-lesson misconceptions and teacher tips.

**Tools.** `get-misconception-graph` (an anchored, bounded query — pass lesson, unit, or thread slugs discovered via `search` or the browse tools; corpus keys, not free text), `get-lessons-summary` (`misconceptionsAndCommonMistakes[]`, `teacherTips[]` for a single lesson — usually the better first call).

**What to look for.** The specific errors pupils make on your topic, and Oak's recommended response. Design diagnostic questions and representations around real misconceptions rather than guessed ones.

**Example.** From the fractions lesson summary:

```text
misconceptionsAndCommonMistakes: [
  { misconception: "many children add both the numerators and denominators together to get the sum.",
    response: "Pupils need to grasp units and unitising. ... Revisit fractions explaining that they're using unit fractions and this is shown by the denominator." }
]
```

**Use it:** a knowledge-rich lesson on this topic that _doesn't_ address numerator+denominator addition is missing the best-evidenced pitfall.

---

## 4. Flexible

**Grounding data.** Units map to national-curriculum statements; KS4 exposes tiers, exam boards and exam subjects; some units offer `unitOptions` (teacher choice). The programmes-vs-sequences distinction shows how one sequence serves many contextualised pathways.

**Tools.** `get-units-summary`, `browse-curriculum` (structure/facets), `get-sequences`, `fetch` (`unit:`).

**What to look for.** The national-curriculum statements Oak's units record, which you can map your own material to; `unitOptions` as a model for offering teacher choice without fragmenting entitlement; how Oak signposts threads so adaptation stays coherent.

**Example.**

```text
browse-curriculum({ subject: "history", keyStage: "ks4" })   // see options/structure
get-units-summary({ ... })                                    // read national curriculum statements + options
```

**Use it:** make your material modular and mapped to the national curriculum the way Oak's is, so a teacher can localise an example without breaking the sequence.

---

## 5. Diverse

**Grounding data.** The sheer breadth of Oak content, plus threads and units explicitly about representation, culture and diversity, give a benchmark for breadth and for windows-and-mirrors.

**Tools.** `search` / `explore-topic` (find the range of voices, contexts, texts), `get-threads-units`.

**Threads to explore.** `cultural-spotlight` (99 units), `representation-and-identity` (22), `diversity` (12), `identities-and-communities`, `modern-literature-strand-1-identity-belonging-and-community` (38).

**What to look for.** The variety of contexts and voices Oak uses for a topic; whether your selection offers both windows and mirrors; whether ambition is maintained alongside breadth.

**Example.**

```text
explore-topic({ query: "identity and belonging", subject: "english" })
get-threads-units({ thread: "representation-and-identity" })
```

**Use it:** benchmark your selection's breadth against Oak's, and borrow exemplar texts/contexts.

---

## 6. Accessible

**Grounding data.** Lessons carry content guidance and supervision levels; each unit's stated prior knowledge supports sensible chunking; assets include captioning.

**Tools.** `get-lessons-summary` (`contentGuidance`, `supervisionLevel`), `get-prior-knowledge-graph`, `get-lessons-assets`.

**What to look for.** Whether a topic carries content guidance you must carry through; where prior-knowledge boundaries suggest natural chunks; whether the same ambitious content is kept for all with scaffolded routes.

**Content guidance categories** (from the model): language and discrimination; upsetting/disturbing/sensitive content; nudity and sex; physical activity/equipment requiring safe use. **Supervision levels** run 1 (suggested) → 4 (adult support required). Use the `supervisionLevel` field rather than inferring.

**Example.**

```text
get-lessons-summary({ lesson: "<sensitive-topic-lesson>" })   // read contentGuidance + supervisionLevel
```

**Use it:** keep the destination ambitious for all; use prior knowledge to chunk; preserve any content guidance in derived material.

---

## Discovery tools (cross-cutting)

- `search({ query, scope, subject?, keyStage? })` — semantic + lexical search. Scope = `lessons` | `units` | `threads` | `sequences` | `suggest`. Use curriculum _topic_ terms ("trigonometry", "the Romans"); map assessment terms ("GCSE", "SATs") to `keyStage` filters, not the query. `subject` is a fixed slug set — note `physical-education`, `religious-education`, `rshe-pshe`, `cooking-nutrition`, `design-technology`, and that languages split into `french` / `german` / `spanish` (there is no generic `languages` subject). Confirm slugs via `get-subjects`.
- `explore-topic({ query, subject?, keyStage? })` — searches lessons, units and threads in parallel; best when you don't know the right scope.
- `browse-curriculum({ subject?, keyStage? })` — structured facets without a query.
- `fetch({ id })` — full detail by prefixed ID.
- `download-asset({ lesson, type })` — short-lived download link for slides/worksheets (HTTP transport only).
