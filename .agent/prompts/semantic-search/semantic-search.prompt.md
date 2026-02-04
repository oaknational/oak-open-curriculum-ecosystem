# Semantic Search — Ground Truth Protocol

**Status**: 🔄 Phase 1 — Minimum Viable Ground Truths  
**Target**: One ground truth per subject-phase pair (~33 total)  
**Last Updated**: 2026-01-27

---

## The Protocol

For each subject-phase pair:

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

| Result | Action |
|--------|--------|
| Top 3 are reasonable | Lock in ground truth |
| Top 3 are NOT reasonable | Evaluate why → refine query OR suggest system fix |

### Step 7: Lock In or Iterate

Repeat steps 4-6 until satisfied, then record the ground truth.

---

## Key Principles

- **DO NOT match on lesson title alone** — The query must reflect natural teacher search behaviour
- **Test against actual search** — Iterate based on real results
- **Top 3 evaluation** — Reasonable results = ground truth locked in
- **Pragmatic** — We need baseline coverage now; refinement comes later

---

## Subject-Phase Coverage Target

| Phase | Subjects |
|-------|----------|
| Primary | ~15 |
| Secondary | ~18 (including KS4 science variants) |
| **Total** | **~33 ground truths** |

---

## Bulk Data Commands

```bash
cd apps/oak-open-curriculum-semantic-search

# List all subject-phase files
ls bulk-downloads/*.json

# List all units with lesson counts
jq -r '.sequence[] | "\(.unitSlug): \(.unitTitle) (\(.unitLessons | length) lessons)"' \
  bulk-downloads/{subject}-{phase}.json

# Get full lesson data
jq '.lessons[] | select(.lessonSlug == "TARGET-LESSON")' bulk-downloads/{subject}-{phase}.json
```

---

## Recording a Ground Truth

When a ground truth is locked in, record it in `queries-redesigned.md`:

```markdown
### [subject]/[phase]: [topic]

**Query**: "[the natural-phrasing query]"
**Subject Filter**: `[subject]`
**Key Stage**: [KS1/KS2/KS3/KS4]

**Target Lesson**: `[lesson-slug]`
**Top 3 Reasonable**: Yes

**Summary**: [Brief summary of lesson content that informed the query]
```

---

## Phase 2 (Later)

Once Phase 1 baseline is established (~33 ground truths), expand to complexity-weighted coverage (~99 total) with multiple expected slugs per query and graded relevance scores.
