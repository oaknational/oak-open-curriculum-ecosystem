# Ground Truth Queries: Redesign

**Status**: 🔄 Phase 1 — Minimum Viable Ground Truths  
**Target**: One ground truth per subject-phase pair (~33 ground truths)  
**Last Updated**: 2026-01-27

---

## The Protocol

For each subject-phase pair, execute these steps:

### Step 1: Find a Rich Unit

Target units with 5+ lessons.

```bash
jq -r '.sequence[] | select(.unitLessons | length >= 5) |
  "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/{subject}-{phase}.json
```

### Step 2: Pick a Lesson and Extract ALL Data

```bash
jq '.lessons[] | select(.lessonSlug == "TARGET-LESSON") | {
  title: .lessonTitle,
  keywords: [.lessonKeywords[]?.keyword],
  keyLearning: [.keyLearningPoints[]?.keyLearningPoint],
  hasTranscript: (.transcript_sentences | length > 0),
  transcript: (.transcript_sentences | .[0:500])
}' bulk-downloads/{subject}-{phase}.json
```

### Step 3: Summarise the Lesson Content

Create a summary from ALL available data: title, keywords, key learning, transcript (if available).

### Step 4: Design a Query Around the Summary

Ask: "What would a teacher type to find content like this?"

**Critical**: DO NOT match on lesson title alone. The query must reflect natural teacher search behaviour.

### Step 5: Run the Query

Execute the query against the search system and examine results.

### Step 6: Evaluate Top 3 Results

| Result                   | Action                                            |
| ------------------------ | ------------------------------------------------- |
| Top 3 are reasonable     | Lock in ground truth                              |
| Top 3 are NOT reasonable | Evaluate why → refine query OR suggest system fix |

### Step 7: Lock In or Iterate

Repeat steps 4-6 until satisfied, then record the ground truth.

---

## Subject-Phase Coverage

| Subject           | Primary | Secondary | Notes      |
| ----------------- | ------- | --------- | ---------- |
| maths             | ❌      | ❌        |            |
| science           | ❌      | ❌        |            |
| english           | ❌      | ❌        |            |
| history           | ❌      | ❌        |            |
| geography         | ❌      | ❌        |            |
| computing         | ❌      | ❌        |            |
| art               | ❌      | ❌        |            |
| music             | ❌      | ❌        |            |
| design-technology | ❌      | ❌        |            |
| PE                | ❌      | ❌        |            |
| RE                | ❌      | ❌        |            |
| french            | ❌      | ❌        |            |
| german            | —       | ❌        | No primary |
| spanish           | ❌      | ❌        |            |
| citizenship       | —       | ❌        | No primary |
| cooking-nutrition | ❌      | ❌        |            |
| physics           | —       | ❌        | KS4 only   |
| chemistry         | —       | ❌        | KS4 only   |
| biology           | —       | ❌        | KS4 only   |
| combined-science  | —       | ❌        | KS4 only   |

**Legend**: ✅ Complete | ❌ Not started | — Not applicable

**Total**: ~33 ground truths (one per subject-phase pair)

---

## Refinement (Phase 2)

Once baseline coverage is established, we will add more queries for complexity-weighted coverage (~99 total). But first we need to prove the protocol works.

---

## Completed Ground Truths

Ground truths will be recorded here as they are completed.

(None yet)
