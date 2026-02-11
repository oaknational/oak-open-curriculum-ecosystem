# Ground Truth Quality Investigation

**Created**: 2026-01-23  
**Last Updated**: 2026-01-25  
**Status**: 🔄 **In Progress — Queries Need Investigation**  
**Last Action**: Added `--issues` CLI command

---

## 🚀 START HERE: Generate Issues Report

### Step 1: Run Issues Command

```bash
cd apps/oak-search-cli
pnpm benchmark --issues
```

This generates `issues-report-{date}.md` containing:

- **Summary stats**: % of queries with issues, distribution by metric/category/subject
- **Complete list**: All queries with any metric below "Good" threshold
- **Per-query details**: Expected slugs, top results, all 4 metrics with status

### Step 2: Review Generated Report

The report is sorted by severity (most issues first, then by MRR).

### Step 3: Investigate

**Pick any query** from the report and follow the template:
[ground-truth-session-template.md](../templates/ground-truth-session-template.md)

### Other Commands

```bash
pnpm ground-truth:validate           # Verify current state
pnpm benchmark --all                 # Full benchmark with per-query progress
pnpm benchmark -s SUBJECT -p PHASE --review  # Detailed per-query output
```

---

## Scope: Educator Lesson Search

**Current ground truths are specifically for:**

- **Content type**: Lessons (not units, sequences, or threads)
- **User persona**: Professional educators (teachers), not pupils/students
- **Search intent**: Finding curriculum content to teach

**All queries should assume the user is a professional teacher.**

---

## Cardinal Principles

1. **The search might be RIGHT. The expected slugs might be WRONG.**
2. **Form independent judgments BEFORE seeing search results or expected slugs.**
3. **Use the three-way comparison: YOUR rankings vs SEARCH vs EXPECTED.**
4. **Document evidence, not assumptions.**

**See**: [ground-truth-session-template.md](../templates/ground-truth-session-template.md) for the full protocol.

---

## Quality Thresholds (from IR-METRICS.md)

| Metric | Excellent | Good | Acceptable | Poor |
|--------|-----------|------|------------|------|
| **MRR** | > 0.90 | > 0.70 | > 0.50 | < 0.50 |
| **NDCG@10** | > 0.85 | > 0.75 | > 0.60 | < 0.60 |
| **P@3** | > 0.80 | > 0.60 | > 0.40 | < 0.40 |
| **R@10** | > 0.80 | > 0.60 | > 0.40 | < 0.40 |

**Any query with ANY metric below "Good" requires investigation.**

---

## Complete Inventory: All Problematic Queries (75)

### Tier 1: Most Severe (MRR < 0.50)

| # | Query | Subject | Category | MRR | NDCG | P@3 | R@10 |
|---|-------|---------|----------|-----|------|-----|------|
| 1 | `multiplikation timetables year 3` | maths/primary | imprecise-input | 0.125 | 0.054 | 0.000 | 0.200 |
| 2 | `counting in groups, skip counting` | maths/primary | natural-expression | 0.200 | 0.128 | 0.000 | 0.400 |
| 3 | `electrisity and magnits` | science/secondary | imprecise-input | 0.200 | 0.283 | 0.000 | 0.400 |
| 4 | `global warming effects` | geography/secondary | natural-expression | 0.200 | 0.210 | 0.000 | 0.333 |
| 5 | `plints and enimals` | science/primary | imprecise-input | 0.200 | 0.156 | 0.000 | 0.200 |
| 6 | `nutrision healthy food` | cooking/secondary | imprecise-input | 0.250 | 0.470 | 0.000 | 1.000 |
| 7 | `coordinate geometry proofs` | maths/secondary | cross-topic | 0.333 | 0.337 | 0.333 | 0.333 |
| 8 | `multiplication arrays year 3` | maths/primary | precise-topic | 0.333 | 0.466 | 0.333 | 0.600 |
| 9 | `narative writing storys iron man Year 3` | english/primary | imprecise-input | 0.333 | 0.278 | 0.333 | 0.500 |
| 10 | `rythm beat ks1` | music/primary | imprecise-input | 0.333 | 0.554 | 0.333 | 1.000 |
| 11 | `sacred texts and ethical teachings` | RE/secondary | cross-topic | 0.333 | 0.098 | 0.333 | 0.200 |

### Tier 2: Moderate MRR Issues (MRR = 0.50)

| # | Query | Subject | Category | MRR | NDCG | P@3 | R@10 |
|---|-------|---------|----------|-----|------|-----|------|
| 12 | `area and perimeter problems together` | maths/secondary | cross-topic | 0.500 | 0.746 | 0.667 | 1.000 |
| 13 | `being fair to everyone rights` | citizenship/secondary | natural-expression | 0.500 | 0.584 | 0.333 | 1.000 |
| 14 | `brush painting techneeques` | art/primary | imprecise-input | 0.500 | 0.603 | 0.333 | 1.000 |
| 15 | `databse querying lessons` | computing/secondary | imprecise-input | 0.500 | 0.665 | 0.667 | 1.000 |
| 16 | `ergonomics design human factors` | DT/secondary | cross-topic | 0.500 | 0.665 | 0.667 | 1.000 |
| 17 | `evoloution and adaptashun` | science/primary | imprecise-input | 0.500 | 0.535 | 0.667 | 0.750 |
| 18 | `finding the unknown number` | maths/secondary | natural-expression | 0.500 | 0.674 | 0.667 | 0.800 |
| 19 | `fitness and athletics together` | PE/secondary | cross-topic | 0.500 | 0.746 | 0.667 | 1.000 |
| 20 | `frankenstien monster creation` | english/secondary | imprecise-input | 0.500 | 0.651 | 0.667 | 1.000 |
| 21 | `french grammer avoir etre` | french/secondary | imprecise-input | 0.500 | 0.606 | 0.667 | 1.000 |
| 22 | `german grammer present tence` | german/secondary | imprecise-input | 0.500 | 0.506 | 0.333 | 0.750 |
| 23 | `green design environment friendly` | DT/secondary | natural-expression | 0.500 | 0.480 | 0.333 | 0.600 |
| 24 | `halfs and quarters` | maths/primary | imprecise-input | 0.500 | 0.402 | 0.667 | 0.600 |
| 25 | `healthy eating nutrition` | cooking/primary | precise-topic | 0.500 | 0.236 | 0.333 | 0.400 |
| 26 | `meditaton and prayer practices` | RE/secondary | imprecise-input | 0.500 | 0.484 | 0.333 | 0.800 |
| 27 | `melting ice, changes of state` | science/primary | natural-expression | 0.500 | 0.618 | 0.667 | 0.800 |
| 28 | `nutrision and helthy food` | cooking/primary | imprecise-input | 0.500 | 0.524 | 0.667 | 0.800 |
| 29 | `places of worship and religious festivals` | RE/primary | cross-topic | 0.500 | 0.643 | 0.667 | 0.800 |
| 30 | `portraits and colour expression` | art/secondary | cross-topic | 0.500 | 0.642 | 0.333 | 1.000 |
| 31 | `pythagorus theorum triangles` | maths/secondary | imprecise-input | 0.500 | 0.726 | 0.667 | 1.000 |
| 32 | `relegion stories primary` | RE/primary | imprecise-input | 0.500 | 0.450 | 0.333 | 0.400 |
| 33 | `religious founders and leaders` | RE/primary | precise-topic | 0.500 | 0.450 | 0.333 | 0.600 |
| 34 | `rythm patterns drums` | music/secondary | imprecise-input | 0.500 | 0.665 | 0.667 | 1.000 |
| 35 | `sharing equally into groups` | maths/primary | natural-expression | 0.500 | 0.673 | 0.667 | 0.800 |
| 36 | `singing beat, pulse` | music/primary | cross-topic | 0.500 | 0.213 | 0.333 | 0.500 |
| 37 | `vikins and anglo saxons` | history/primary | imprecise-input | 0.500 | 0.247 | 0.333 | 0.500 |
| 38 | `why do people pray` | RE/primary | natural-expression | 0.500 | 0.651 | 0.667 | 0.800 |

### Tier 3: Good MRR but Other Metrics Below Good

| # | Query | Subject | Category | MRR | NDCG | P@3 | R@10 |
|---|-------|---------|----------|-----|------|-----|------|
| 39 | `algebra graphs, linear equations` | maths/secondary | cross-topic | 1.000 | 0.575 | 0.667 | 0.600 |
| 40 | `cam mechanisms automata` | DT/primary | precise-topic | 1.000 | 0.676 | 0.333 | 1.000 |
| 41 | `carbon cycle in ecosystems` | science/secondary | cross-topic | 1.000 | 0.480 | 0.333 | 0.250 |
| 42 | `cells and genetics inheritance` | science/secondary | cross-topic | 1.000 | 0.626 | 0.667 | 0.500 |
| 43 | `democracy and laws together` | citizenship/primary | cross-topic | 1.000 | 0.865 | 0.333 | 1.000 |
| 44 | `electromagnetic spectrum waves` | science/secondary | precise-topic | 1.000 | 0.851 | 0.333 | 1.000 |
| 45 | `energy nutrients and healthy eating` | cooking/primary | cross-topic | 1.000 | 0.723 | 0.333 | 0.667 |
| 46 | `estar states location Spanish` | spanish/primary | natural-expression | 1.000 | 0.801 | 0.333 | 1.000 |
| 47 | `factory age workers conditions` | history/secondary | natural-expression | 1.000 | 0.658 | 0.667 | 0.667 |
| 48 | `fench vocabulary primary` | french/primary | imprecise-input | 1.000 | 0.918 | 0.333 | 1.000 |
| 49 | `film music composition` | music/secondary | cross-topic | 1.000 | 0.646 | 0.333 | 1.000 |
| 50 | `gothic literature Year 8` | english/secondary | natural-expression | 1.000 | 0.615 | 0.333 | 0.667 |
| 51 | `grammar and punctuation in essay writing` | english/secondary | cross-topic | 1.000 | 0.626 | 0.667 | 0.500 |
| 52 | `healthy lunches, balanced meals` | cooking/primary | natural-expression | 1.000 | 0.709 | 0.667 | 1.000 |
| 53 | `holocost and nazi germany` | history/secondary | imprecise-input | 1.000 | 0.642 | 0.333 | 0.667 |
| 54 | `interior angles polygons` | maths/secondary | precise-topic | 1.000 | 0.559 | 0.667 | 0.800 |
| 55 | `ionic and covalent bonding` | science/secondary | cross-topic | 1.000 | 0.712 | 0.667 | 1.000 |
| 56 | `making French sentences negative KS3` | french/secondary | natural-expression | 1.000 | 0.232 | 0.333 | 0.333 |
| 57 | `maps and teamwork outdoor activities` | PE/primary | cross-topic | 1.000 | 0.762 | 0.333 | 0.750 |
| 58 | `multiplication area rectangles` | maths/primary | cross-topic | 1.000 | 0.705 | 0.667 | 1.000 |
| 59 | `multiplication times tables year 3` | maths/primary | precise-topic | 1.000 | 0.294 | 0.333 | 0.400 |
| 60 | `parliment functions and roles` | citizenship/primary | imprecise-input | 1.000 | 0.932 | 0.333 | 1.000 |
| 61 | `place value tens and ones` | maths/primary | precise-topic | 1.000 | 0.656 | 0.667 | 0.600 |
| 62 | `programming with data structures loops` | computing/secondary | cross-topic | 1.000 | 0.918 | 0.333 | 1.000 |
| 63 | `ratio proportion percentage` | maths/secondary | cross-topic | 1.000 | 0.676 | 0.333 | 1.000 |
| 64 | `resperation in humans` | science/secondary | imprecise-input | 1.000 | 0.680 | 0.667 | 0.800 |
| 65 | `revolution and slavery abolition` | history/secondary | cross-topic | 1.000 | 0.918 | 0.333 | 1.000 |
| 66 | `right and wrong philosophy` | RE/secondary | natural-expression | 1.000 | 0.463 | 0.333 | 0.600 |
| 67 | `sketching and materials properties` | DT/secondary | cross-topic | 1.000 | 0.655 | 0.333 | 1.000 |
| 68 | `spanish grammer conjugating verbs` | spanish/secondary | imprecise-input | 1.000 | 0.431 | 0.333 | 0.600 |
| 69 | `splitting numbers into parts` | maths/primary | natural-expression | 1.000 | 0.465 | 0.333 | 0.400 |
| 70 | `syncopation rhythm music ks2` | music/primary | precise-topic | 1.000 | 0.907 | 0.333 | 1.000 |
| 71 | `teach drawing skills beginers` | art/primary | imprecise-input | 1.000 | 0.918 | 0.333 | 1.000 |
| 72 | `teach french greetings to children` | french/primary | natural-expression | 1.000 | 0.787 | 0.333 | 0.500 |
| 73 | `tectonic plaits and earthqakes` | geography/secondary | imprecise-input | 1.000 | 0.865 | 0.333 | 1.000 |
| 74 | `verbs and adjectives in French grammar` | french/secondary | cross-topic | 1.000 | 0.787 | 0.333 | 0.500 |
| 75 | `verbs and questions in German` | german/secondary | cross-topic | 1.000 | 0.803 | 0.333 | 1.000 |

---

## Hypotheses Section (Assumptions to Question)

**⚠️ These are hypotheses, NOT conclusions. Each must be verified through investigation.**

### Prior Session Hypotheses (2026-01-24)

These were stated in previous sessions but should be treated as unverified:

| Hypothesis | Query | To Verify |
|------------|-------|-----------|
| "Typo + tokenization issue" | `multiplikation timetables year 3` | Run Phase 1B discovery |
| "Severe typos exceed fuzzy limits" | `plints and enimals` | Run Phase 1B discovery |
| "Fuzzy false positive (magnits → magnify)" | `electrisity and magnits` | Run Phase 1B discovery |
| "Multiple typos exceed fuzzy limits" | `narative writing storys iron man Year 3` | Run Phase 1B discovery |
| "Query may need redesign" | `counting in groups, skip counting` | Run Phase 1A analysis |
| "Cross-topic intersection may not exist" | Various cross-topic queries | Run Phase 1B discovery |

### How to Verify Hypotheses

For each hypothesis:

1. **Run Phase 1A**: Analyse query design BEFORE looking at data
2. **Run Phase 1B**: Discover candidates independently using bulk data + MCP
3. **COMMIT rankings**: Before seeing search results or expected slugs
4. **Run Phase 1C**: Three-way comparison to determine actual cause

**Do NOT accept hypotheses as fact until verified through the protocol.**

---

## Investigation Protocol

### Required for Each Query

Follow [ground-truth-session-template.md](../templates/ground-truth-session-template.md) exactly:

1. **Phase 1A**: Query analysis (no tools, no data — reflection only)
2. **Phase 1B**: Independent discovery (bulk data + MCP), then COMMIT rankings
3. **Phase 1C**: Three-way comparison (YOUR rankings vs SEARCH vs EXPECTED)

### Possible Outcomes

| Outcome | Evidence Pattern | Action |
|---------|------------------|--------|
| **GT is wrong** | Your discovery finds better slugs than expected | Update GT |
| **Search is wrong** | Expected slugs are correct but poorly ranked | Document as search gap |
| **Query is wrong** | Query doesn't test claimed capability | Redesign query |
| **Both are partially right** | Best answer combines sources | Update GT with improvements |

### Bias Prevention Checklist

Before completing any investigation, verify:

- [ ] Did I COMMIT rankings BEFORE running benchmark?
- [ ] Did I COMMIT rankings BEFORE reading `.expected.ts` files?
- [ ] Are my rankings based on curriculum content, not search results?
- [ ] Can I justify my rankings without reference to search output?
- [ ] Is my three-way comparison table complete with all three sources?

---

## Session Log

| Date | Action | Status |
|------|--------|--------|
| 2026-01-25 | CLI improvements: Added `--issues` command, removed redundant `--verbose` | ✅ |
| 2026-01-24 | Query redesign: 22 queries updated for teacher persona | ✅ |
| 2026-01-24 | GT updates: 3 queries where search returned better results | ✅ |
| 2026-01-24 | Validation: All 164 queries pass | ✅ |
| 2026-01-24 | Full inventory: 75 queries identified needing investigation | ✅ |

---

## Future Functionality (Excluded from Stats)

### `coding for beginners programming basics introduction`

| Metric | Value |
|--------|-------|
| MRR | 0.000 |
| Category | `future-intent` |
| Reason | Requires Level 4 intent classification |

This query is excluded from aggregate statistics but tracked for future capability development.

---

## Commands Reference

```bash
cd apps/oak-search-cli

# Generate issues report (START HERE)
pnpm benchmark --issues

# Full benchmark with per-query progress
pnpm benchmark --all

# Detailed per-query output
pnpm benchmark -s SUBJECT -p PHASE --review

# Validate ground truths
pnpm ground-truth:validate

# Search bulk data
jq -r '.sequence[] | .unitTitle as $unit | .unitLessons[] | "\(.lessonSlug)|\(.lessonTitle)|Unit: \($unit)"' bulk-downloads/SUBJECT-PHASE.json
```

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ground-truth-session-template.md](../templates/ground-truth-session-template.md) | **Linear execution protocol — USE THIS** |
| [semantic-search.prompt.md](../../prompts/semantic-search/semantic-search.prompt.md) | Methodology, cardinal rules |
| [IR-METRICS.md](../../../../apps/oak-search-cli/docs/IR-METRICS.md) | Metric definitions |
| [GROUND-TRUTH-GUIDE.md](../../../../apps/oak-search-cli/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md) | Design principles |
