---
name: Music GT Phase 1C
overview: Phase 1C (Comparison) for Music primary and secondary. Run benchmarks, create three-way comparison tables (COMMIT vs SEARCH vs EXPECTED), answer critical questions, update .expected.ts files if needed, and record all metrics.
todos:
  - id: primary-q1-1c
    content: "PRIMARY Q1 (precise-topic): Comparison for syncopation rhythm music ks2"
    status: completed
  - id: primary-q2-1c
    content: "PRIMARY Q2 (natural-expression): Comparison for singing in tune for children"
    status: completed
  - id: primary-q3-1c
    content: "PRIMARY Q3 (imprecise-input): Comparison for rythm beat ks1"
    status: completed
  - id: primary-q4-1c
    content: "PRIMARY Q4 (cross-topic): Comparison for singing and beat together"
    status: completed
  - id: secondary-q5-1c
    content: "SECONDARY Q5 (precise-topic): Comparison for drum grooves rhythm"
    status: completed
  - id: secondary-q6-1c
    content: "SECONDARY Q6 (natural-expression): Comparison for teach folk songs sea shanty"
    status: completed
  - id: secondary-q7-1c
    content: "SECONDARY Q7 (imprecise-input): Comparison for rythm patterns drums"
    status: completed
  - id: secondary-q8-1c
    content: "SECONDARY Q8 (cross-topic): Comparison for film music and composition together"
    status: completed
  - id: phase2-validation
    content: "PHASE 2: Run type-check, ground-truth:validate, aggregate benchmarks"
    status: completed
  - id: phase3-docs
    content: "PHASE 3: Update checklist (22/30), current-state.md, prompt.md"
    status: completed
---

# Music Ground Truth Evaluation - Phase 1C (Comparison)

**Scope**: 8 queries (4 primary, 4 secondary)

**Pre-requisite**: Phase 1B COMMIT tables are complete. Rankings were formed BEFORE seeing search results or expected slugs.

---

## Phase 1C Structure (repeat for each of 8 queries)

### Step 1C.0: Pre-Comparison Verification

Confirm:

- COMMIT rankings were formed BEFORE benchmark
- Expected slugs (.expected.ts) have NOT been read yet
- Rankings are based solely on curriculum content analysis

### Step 1C.1: Run Benchmark Review Mode

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm benchmark -s music -p [primary|secondary] -c [category] --review
```

Record output including:

- Expected slugs with relevance scores (FIRST TIME SEEING THESE)
- Actual search results (top 10)
- ALL 4 metrics: MRR, NDCG@10, P@3, R@10

### Step 1C.2: Three-Way Comparison Table

| Slug | COMMIT Rank | SEARCH Rank | EXPECTED Score | Key Learning | Verdict |

Verdict options:

- Agreement: All three sources agree
- Search found better: Search ranked something higher that IS better
- COMMIT found better: Your analysis found something better
- Search under-ranked: COMMIT and EXPECTED agree, search ranked lower
- Expected was wrong: COMMIT and search agree expected slug is not optimal

### Step 1C.3: Critical Question

Answer: What are the BEST slugs for this query?

- Current GT is CORRECT
- Search found BETTER results
- COMMIT candidates are BETTER
- Mix is best

Justify with key learning quotes.

### Step 1C.4: Record Metrics and Update GT

Record all 4 metrics. If COMMIT rankings are better than expected, update `.expected.ts` file.

---

## PRIMARY Queries (music-primary.json)

### Q1: precise-topic - "syncopation rhythm music ks2"

**COMMIT Rankings** (from Phase 1B):

1. what-is-syncopation [3]
2. syncopation-in-songs [3]
3. syncopated-rhythms [3]
4. singing-and-playing-syncopated-rhythms [2]
5. layering-syncopated-rhythms-to-accompany-a-song [2]

```bash
pnpm benchmark -s music -p primary -c precise-topic --review
```

[Execute Steps 1C.0-1C.4]

### Q2: natural-expression - "singing in tune for children"

**COMMIT Rankings** (from Phase 1B):

1. singing-with-pitch-accuracy [3]
2. recognising-pitch-changes-in-our-singing-games [3]
3. my-singing-voice [2]
4. singing-echo-songs [2]
5. high-and-low-notes [2]

```bash
pnpm benchmark -s music -p primary -c natural-expression --review
```

[Execute Steps 1C.0-1C.4]

### Q3: imprecise-input - "rythm beat ks1"

**COMMIT Rankings** (from Phase 1B):

1. learning-about-beat [3]
2. learning-about-rhythm [3]
3. rhythm-and-beat [3]
4. feeling-the-pulse-and-playing-the-beat [2]
5. echoing-simple-rhythm-patterns [2]

```bash
pnpm benchmark -s music -p primary -c imprecise-input --review
```

[Execute Steps 1C.0-1C.4]

### Q4: cross-topic - "singing and beat together"

**COMMIT Rankings** (from Phase 1B):

1. singing-to-help-us-work-in-time-together [3]
2. playing-the-pulse-to-keep-in-time [3]
3. chanting-and-singing-in-time [3]
4. singing-and-moving-together [2]
5. singing-moving-and-playing-to-a-steady-pulse [2]

```bash
pnpm benchmark -s music -p primary -c cross-topic --review
```

[Execute Steps 1C.0-1C.4]

---

## SECONDARY Queries (music-secondary.json)

### Q5: precise-topic - "drum grooves rhythm"

**COMMIT Rankings** (from Phase 1B):

1. the-role-of-the-kick-and-snare-in-drum-grooves [3]
2. the-role-of-the-hi-hat-in-a-drum-groove [3]
3. creating-variation-to-a-fundamental-drum-groove [3]
4. synthesized-drum-sounds [2]
5. the-feel-of-the-kick-and-snare-in-an-rnb-groove [2]

```bash
pnpm benchmark -s music -p secondary -c precise-topic --review
```

[Execute Steps 1C.0-1C.4]

### Q6: natural-expression - "teach folk songs sea shanty"

**COMMIT Rankings** (from Phase 1B):

1. singing-sea-shanties [3]
2. modes-and-sea-shanties [3]
3. characteristics-of-folk-songs [2]
4. folk-dance-and-the-minor-scale [2]
5. playing-a-folk-melody-in-two-parts [2]

```bash
pnpm benchmark -s music -p secondary -c natural-expression --review
```

[Execute Steps 1C.0-1C.4]

### Q7: imprecise-input - "rythm patterns drums"

**COMMIT Rankings** (from Phase 1B):

1. the-role-of-the-kick-and-snare-in-drum-grooves [3]
2. context-and-technique-in-west-african-drumming [3]
3. creating-an-edm-drum-beat [3]
4. the-role-of-the-hi-hat-in-a-drum-groove [2]
5. composing-a-drum-beat-and-contrast-in-pop-song-structure [2]

```bash
pnpm benchmark -s music -p secondary -c imprecise-input --review
```

[Execute Steps 1C.0-1C.4]

### Q8: cross-topic - "film music and composition together"

**COMMIT Rankings** (from Phase 1B):

1. scoring-a-film-scene [3]
2. scoring-a-silent-movie [3]
3. using-film-music-to-establish-mood [3]
4. composing-music-for-an-extended-story [2]
5. how-music-shapes-film [2]

```bash
pnpm benchmark -s music -p secondary -c cross-topic --review
```

[Execute Steps 1C.0-1C.4]

---

## Phase 2: Validation

After ALL 8 queries complete:

```bash
cd apps/oak-open-curriculum-semantic-search
pnpm type-check
pnpm ground-truth:validate
pnpm benchmark -s music -p primary --verbose
pnpm benchmark -s music -p secondary --verbose
```

Record aggregate metrics:

| Phase | MRR | NDCG@10 | P@3 | R@10 |

|-------|-----|---------|-----|------|

| PRIMARY | | | | |

| SECONDARY | | | | |

---

## Phase 3: Documentation

Update files:

- [ground-truth-review-checklist.md](/.agent/plans/semantic-search/active/ground-truth-review-checklist.md) - Mark music/primary and music/secondary complete with metrics
- [current-state.md](/.agent/plans/semantic-search/current-state.md) - Update progress to 22/30
- [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md) - Update next session target

---

## Key Files

**Ground Truth Files** (update `.expected.ts` if COMMIT rankings are better):

- `src/lib/search-quality/ground-truth/music/primary/[category].expected.ts`
- `src/lib/search-quality/ground-truth/music/secondary/[category].expected.ts`

**Documentation Files**:

- [ground-truth-review-checklist.md](/.agent/plans/semantic-search/active/ground-truth-review-checklist.md)
- [current-state.md](/.agent/plans/semantic-search/current-state.md)
- [semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md)
