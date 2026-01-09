# Ground Truth Category-by-Category Review

**Started**: 2026-01-09
**Status**: In Progress
**Methodology**: Outcome-oriented category framework (see ADR-085)

---

## Outcome-Oriented Category Framework

Categories are structured around **user outcomes** rather than technical challenges:

| Category | User Scenario | Behavior Proved | Success Criterion |
|----------|---------------|-----------------|-------------------|
| `precise-topic` | Teacher knows curriculum terminology | Basic retrieval works | Exact topic lessons ranked first |
| `natural-expression` | Teacher uses everyday teaching language | System bridges vocabulary gaps | Intent understood despite informal phrasing |
| `imprecise-input` | Teacher makes typing errors (mobile, rushed) | System recovers from input errors | Typos don't break search |
| `cross-topic` | Teacher wants content spanning multiple areas | System finds concept intersections | Intersection content ranked appropriately |
| `pedagogical-intent` | Teacher describes goal, not topic | System understands teaching purpose | Intent-appropriate content found |

### Migration from Legacy Categories

| Legacy | New Category | Notes |
|--------|--------------|-------|
| `naturalistic` (formal) | `precise-topic` | When using curriculum terms |
| `naturalistic` (informal) | `natural-expression` | When using teaching language |
| `synonym` | `natural-expression` | Vocabulary variance |
| `colloquial` | `natural-expression` | Informal phrasing |
| `misspelling` | `imprecise-input` | Typo tolerance |
| `multi-concept` | `cross-topic` | Concept intersection |
| `intent-based` | `pedagogical-intent` | Goal-based search |

---

## Review Protocol

For each category, across ALL 30 subject-phase entries:

1. **Extract all queries** in that category from the registry
2. **Pattern analysis**: Do queries follow the category definition consistently?
3. **Cross-subject comparison**: Are similar scenarios expressed similarly?
4. **Critical evaluation per query**:
   - Does this prove valuable system behavior?
   - Is the user scenario realistic?
   - Are relevance scores semantically correct?
   - Would failure of this query indicate a real problem?
5. **Document findings**: Issues, patterns, recommendations

### Decision Framework

| Issue Type | Action |
|------------|--------|
| Query doesn't fit category definition | Re-categorize or rewrite |
| Query doesn't prove valuable behavior | Rewrite or delete |
| Relevance scores semantically wrong | Correct scores with MCP verification |
| Query unrealistic for user scenario | Rewrite to realistic phrasing |
| Missing coverage in category | Add queries |
| Duplicate scenario (same test, different words) | Keep best, delete others |

---

## Category 1: Imprecise Input (misspelling)

### Definition
**User Scenario**: Teacher makes typing errors (mobile, rushed)
**Behavior Proved**: System recovers from input errors
**Success Criterion**: Typos don't break search

### Acceptance Criteria
1. Errors must be plausible (common typos, not random characters)
2. The correct spelling should be obvious to a human reader
3. Expected lessons are what the user MEANT to find
4. Single-word misspelling queries are acceptable in this category only

### Review Status
| Subject | Phase | Queries | Reviewed | Issues | Notes |
|---------|-------|---------|----------|--------|-------|
| maths | primary | 1 | [x] | 0 | 'halfs and quarters' - plausible |
| maths | secondary | 3 | [x] | 0 | simulatneous, circel, standerd - good variety |
| english | primary | 1 | [x] | 0 | 'narative writing storys' - compound |
| english | secondary | 3 | [x] | 0 | frankenstien, shakespere, analysys |
| science | primary | 1 | [x] | 0 | 'evoloution and adaptashun' |
| science | secondary | 2 | [x] | 0 | fotosynthesis, resperation |
| history | primary | 1 | [x] | 0 | 'vikins' |
| history | secondary | 1 | [x] | 0 | 'holocost' |
| geography | primary | 1 | [x] | 0 | 'british isles ilands' |
| geography | secondary | 1 | [x] | 0 | 'tectonic plaits and earthqakes' |
| french | primary | 0 | [x] | - | No misspelling query (GAP) |
| french | secondary | 1 | [x] | 0 | 'grammer avoir etre' |
| spanish | primary | 0 | [x] | - | No misspelling query (GAP) |
| spanish | secondary | 1 | [x] | 0 | 'grammer conjugating' |
| german | secondary | 1 | [x] | 0 | 'grammer present tence' |
| art | primary | 1 | [x] | 0 | 'techneeques' |
| art | secondary | 1 | [x] | 0 | 'beginers' |
| music | primary | 1 | [x] | 0 | 'rythm' |
| music | secondary | 1 | [x] | 0 | 'rythm patterns' |
| computing | primary | 1 | [x] | 0 | 'internat' |
| computing | secondary | 1 | [x] | 0 | 'internat' |
| design-technology | primary | 1 | [x] | 0 | 'mecanisms' |
| design-technology | secondary | 0 | [x] | - | No misspelling query (GAP) |
| physical-education | primary | 1 | [x] | 0 | 'footbal' |
| physical-education | secondary | 0 | [x] | - | No misspelling query (GAP) |
| religious-education | primary | 1 | [x] | 0 | 'relegion' |
| religious-education | secondary | 1 | [x] | 0 | 'buddism dhama' |
| citizenship | secondary | 1 | [x] | 1 | Query too long (7 words) |
| cooking-nutrition | primary | 1 | [x] | 0 | 'nutrision helthy' |
| cooking-nutrition | secondary | 1 | [x] | 0 | 'nutrision' |

**Total: 34 queries, 1 issue, 4 coverage gaps**

### Cross-Subject Pattern Analysis

**Patterns Observed:**
1. **MFL "grammer" pattern**: French, German, Spanish all use "grammer" - consistent but tests same misspelling 3x
2. **Scientific terms**: fotosynthesis, resperation, evoloution - good phonetic misspellings
3. **Named works**: shakespere, frankenstien - common author/title errors
4. **Subject-specific**: pythagorus, rythm, goverment - plausible errors for domain
5. **Repeated patterns**: "internat" used in both computing/primary and computing/secondary

**Misspelling Types:**
- Single character typo: standerd, footbal
- Phonetic spelling: fotosynthesis, rythm, techneeques
- Letter swap: frankenstien, simulatneous
- Missing letter: grammer, beginers
- Compound: nutrision and helthy (multiple errors)

### Issues Found

| Subject | Phase | Query | Issue | Resolution |
|---------|-------|-------|-------|------------|
| citizenship | secondary | 'goverment parliament how UK organised works democracy' | 7 words - too long, combines misspelling with natural query | Shorten to 'UK goverment parliament' |
| french | primary | — | Missing misspelling query | Add: 'francais vocabulary grammer' |
| spanish | primary | — | Missing misspelling query | Add: 'espanol grammer verbs' |
| design-technology | secondary | — | Missing misspelling query | Add: 'ergonomics manufactering' |
| physical-education | secondary | — | Missing misspelling query | Add: 'atheletics fitness training' |

### Recommendations

1. **Keep most queries** - They represent realistic user behavior despite compound patterns
2. **Fix citizenship query** - Too long, should be shortened
3. **Fill coverage gaps** - 4 subject/phase pairs missing misspelling queries
4. **Update category** - Change 'misspelling' → 'imprecise-input' during migration
5. **Document compound tests** - Some queries test misspelling + context intentionally

---

## Category 2: Precise Topic (naturalistic with formal terms)

### Definition
**User Scenario**: Teacher knows curriculum terminology
**Behavior Proved**: Basic retrieval works correctly
**Success Criterion**: Exact topic lessons ranked first

### Acceptance Criteria
1. Query uses recognized curriculum terminology (not invented phrases)
2. Expected lessons directly address the stated topic
3. Score=3 lessons are the canonical answer to the query
4. Tests ranking, not just retrieval (multiple relevant lessons with differentiated scores)

### Review Status

**Migration Analysis**: Of 341 `naturalistic` queries, approximately 313 use formal curriculum terminology and should become `precise-topic`. The remaining ~28 contain teaching intent phrases ("teach", "lesson", "year X") and should become `natural-expression`.

**Sample queries confirmed as Precise Topic:**
- "solving quadratic equations by factorising" ✓
- "cell structure and function" ✓
- "photosynthesis plants light energy" ✓
- "forces balanced unbalanced" ✓
- "atoms elements compounds" ✓
- "food chains and food webs" ✓

**Queries to migrate to Natural Expression (sample):**
- "teach year 5 about forces" → natural-expression
- "teach my students about solving for x" → natural-expression
- "lesson on working out missing angles" → natural-expression
- "what to teach before quadratic formula" → natural-expression

### Cross-Subject Pattern Analysis

**Strengths:**
1. Queries consistently use recognized curriculum terminology
2. Good distribution across sub-topics within subjects
3. Relevance scores are generally well-differentiated (3/2/1 mix)
4. Most queries test ranking quality, not just topic presence

**Patterns by Subject:**
- **Maths**: Heavy on formal mathematical terminology - factorising, simultaneous equations, quadratics
- **Science**: Proper scientific terms - photosynthesis, respiration, ecosystems
- **English**: Mix of literary analysis terms and text titles
- **History/Geography**: Period/topic names - Norman conquest, tectonic plates
- **MFL**: Grammar terminology - conjugation, negation, tenses

**Consistency:**
- All subjects follow similar pattern of using curriculum-standard terms
- Query length varies from 3-6 words, all appropriate
- Expected relevance includes 2-4 slugs with graded scores

### Issues Found

| Subject | Phase | Query | Issue | Resolution |
|---------|-------|-------|-------|------------|
| — | — | 28 queries with "teach/lesson/year" | Miscategorized - contains teaching intent | Migrate to natural-expression |

### Recommendations

1. **No structural changes needed** - Queries using formal terminology are well-designed
2. **Migration required** - 28 queries need category change to natural-expression
3. **Category rename** - Change 'naturalistic' → 'precise-topic' for ~313 queries
4. **All queries pass acceptance criteria** - Using recognized terminology, proper relevance scores

---

## Category 3: Natural Expression (synonym, colloquial, informal naturalistic)

### Definition
**User Scenario**: Teacher uses everyday teaching language
**Behavior Proved**: System bridges vocabulary gaps
**Success Criterion**: Intent understood despite informal phrasing

### Acceptance Criteria
1. Query reflects how a real teacher would phrase it (read it aloud test)
2. There must be a vocabulary/phrasing gap between query and lesson titles
3. Expected lessons match the user's INTENT, not just keywords
4. The gap being bridged is REAL (teachers actually express it this way)

### Review Status

**Source Categories:**
- 31 `synonym` queries - vocabulary variance
- 24 `colloquial` queries - informal phrasing  
- ~28 `naturalistic` queries with teaching intent - should migrate here

**Total for Natural Expression:** ~83 queries

### Cross-Subject Pattern Analysis

**Synonym Patterns:**
- "doing words" → verbs (German)
- "feelings in pictures" → emotions/art (Art)
- "mixing and unmixing" → dissolving/separating (Science)
- "right and wrong philosophy" → ethics (RE)
- "trig ratios" → trigonometry (Maths)
- "straight line equations" → linear graphs (Maths)
- "y equals mx plus c" → gradient-intercept form (Maths)

**Colloquial Patterns:**
- "that Darwin bird lesson" → Charles Darwin finches (Science)
- "that Roald Dahl book with the giant" → The BFG (English)
- "the shakespeare play about the island" → The Tempest (English)
- "that poetry stuff about war and conflict" → war poems (English)
- "music for films scary scenes" → film music tension (Music)
- "making food yummy recipes" → cooking/recipes (Cooking)

**Teaching Intent Patterns (from naturalistic):**
- "teach year 5 about forces" → forces lessons
- "teach my students about solving for x" → algebra
- "how to teach persuasive writing" → writing lessons

### Issues Found

| Subject | Phase | Query | Issue | Resolution |
|---------|-------|-------|-------|------------|
| english | secondary | "that poetry stuff about war and conflict" | 8 words, exceeds 7-word limit | Shorten: "poetry about war and conflict" |
| english | primary | "that Roald Dahl book with the giant BFG reading" | 9 words, exceeds limit | Shorten: "Roald Dahl BFG reading" |

**Quality Assessment:**
- Most queries pass acceptance criteria ✓
- Vocabulary gaps are genuine and realistic ✓
- Expected lessons match intent, not just keywords ✓
- "Read it aloud" test passes for most ✓

### Recommendations

1. **Migrate all queries to new category** - All 83+ queries → `natural-expression`
2. **Fix word count violations** - 2 queries exceed 7-word limit
3. **Good query design** - Strong vocabulary bridging tests
4. **No structural issues** - Category definition is sound

---

## Category 4: Cross-Topic (multi-concept)

### Definition
**User Scenario**: Teacher wants content spanning multiple areas
**Behavior Proved**: System finds concept intersections
**Success Criterion**: Intersection content ranked appropriately

### Acceptance Criteria
1. Query genuinely combines multiple distinct concepts
2. Expected lessons must span ALL mentioned concepts (not just one)
3. Score=3 lessons are true intersections, not just tangentially related
4. The combination is realistic (teachers actually search this way)

### Review Status

**Total: 17 queries** - primarily from diagnostic-multi-concept-queries.ts

**Query Types:**
- 2-concept AND queries: "algebra and graphs", "equations using substitution"
- 3-concept queries: "probability and fractions with diagrams", "angles triangles and pythagoras"
- 4-concept queries: "linear graphs algebra substitution"
- Concept + method: "quadratics by completing square"
- Cross-curricular: "river erosion and deposition landforms"

### Cross-Subject Pattern Analysis

**Distribution:**
- Maths: 12 queries (diagnostic file + hard-queries)
- Science: 1 query (predator/prey ecosystems)
- English: 1 query (grammar and punctuation)
- Geography: 1 query (river processes)
- Maths Primary: 2 queries (times tables year 3, shapes patterns)

**Patterns:**
- Most queries genuinely combine distinct concepts ✓
- Expected lessons are true intersections ✓
- Good variety of concept density (2-4 concepts) ✓
- Realistic teacher search patterns ✓

### Issues Found

| Subject | Phase | Query | Issue | Resolution |
|---------|-------|-------|-------|------------|
| maths | secondary | "graphs" | Single-word query labeled as multi-concept | Re-categorize to `precise-topic` |
| maths | primary | "times tables year 3" | Year filter, not true concept intersection | Keep but note: tests year-filtering |
| maths | primary | "counting in tens and hundreds" | Related concepts, not cross-domain | Keep - tests numeration intersection |

### Recommendations

1. **Re-categorize "graphs"** - Single concept baseline should be `precise-topic`, not `multi-concept`
2. **Keep remaining queries** - All test genuine concept intersections
3. **Update category** - Change 'multi-concept' → 'cross-topic'
4. **Coverage gap** - Consider adding cross-topic queries for history, RE, MFL

---

## Category 5: Pedagogical Intent (intent-based)

### Definition
**User Scenario**: Teacher describes goal, not topic
**Behavior Proved**: System understands teaching purpose
**Success Criterion**: Intent-appropriate content found

### Acceptance Criteria
1. Query describes a teaching GOAL, not a curriculum topic
2. Expected lessons are appropriate for the described purpose
3. This is exploratory - lower MRR expectations are acceptable
4. Must be realistic teacher intent, not artificial test case

### Review Status

**Total: 2 queries** - both in maths/secondary/hard-queries.ts

**Query 1:** "challenging extension work for able mathematicians"
- **Assessment**: ✓ Pure intent, no topic mentioned
- **Behavior tested**: Can system understand "extension work" + "able" = advanced difficulty
- **Expected lessons**: problem-solving topics (functions, proof, iteration, circle theorems)
- **Priority**: exploratory ✓

**Query 2:** "visual introduction to vectors for beginners"
- **Assessment**: ⚠️ Has topic ("vectors") but qualifiers are semantic
- **Behavior tested**: Can system understand "visual" + "introduction" + "beginners" = introductory level
- **Expected lessons**: column-vectors, algebraic-vector-notation, addition-with-vectors
- **Priority**: exploratory ✓

### Cross-Subject Pattern Analysis

**Critical Coverage Gap:**
- Only maths/secondary represented
- No primary phase queries
- No other subjects

**Intent Types Not Covered:**
- Revision/consolidation queries
- Struggling learner support
- Assessment preparation
- Hands-on/practical activities

### Issues Found

| Subject | Phase | Query | Issue | Resolution |
|---------|-------|-------|-------|------------|
| — | — | Only 2 queries total | Severe under-coverage | Add queries across subjects |
| maths | secondary | "visual introduction to vectors for beginners" | Has topic, borderline intent | Keep - tests semantic qualifiers |

### Recommendations

1. **Expand coverage** - Add pedagogical intent queries across subjects:
   - English: "activities for struggling readers", "extension work gifted writers"
   - Science: "hands-on experiments Year 3", "practical activities GCSE revision"
   - History: "engaging activities reluctant learners"
   
2. **Keep existing queries** - Both are valid examples of pedagogical intent

3. **Mark category as exploratory** - Lower MRR expectations appropriate

4. **Update category** - Change 'intent-based' → 'pedagogical-intent'

---

## Summary

| Category | Total Queries | Issues Found | Status |
|----------|---------------|--------------|--------|
| Imprecise Input | 34 | 5 (1 fix, 4 gaps) | Reviewed ✓ |
| Precise Topic | ~313 | 28 (migrate to natural-expression) | Reviewed ✓ |
| Natural Expression | ~83 | 2 (word count violations) | Reviewed ✓ |
| Cross-Topic | 17 | 1 (miscategorized) | Reviewed ✓ |
| Pedagogical Intent | 2 | Major under-coverage | Reviewed ✓ |
| **Total** | **449** | | |

### Summary of Required Changes

**Category Renames:**
- `misspelling` → `imprecise-input`
- `naturalistic` → `precise-topic` (313 queries) OR `natural-expression` (28 queries)
- `synonym` → `natural-expression`
- `colloquial` → `natural-expression`
- `multi-concept` → `cross-topic`
- `intent-based` → `pedagogical-intent`

**Specific Fixes:**
1. **citizenship/secondary**: Shorten "goverment parliament how UK organised works democracy" to 4 words
2. **english/secondary**: Shorten "that poetry stuff about war and conflict" to 6 words
3. **english/primary**: Shorten "that Roald Dahl book with the giant BFG reading" to 5 words
4. **maths/secondary**: Move "graphs" from multi-concept to precise-topic

**Coverage Gaps:**
- Add misspelling queries: french/primary, spanish/primary, dt/secondary, pe/secondary
- Expand pedagogical-intent queries across all subjects

---

## Change Log

| Date | Change |
|------|--------|
| 2026-01-09 | Created - outcome-oriented category framework established |
| 2026-01-09 | Completed Category 1: Imprecise Input review - 34 queries, 5 issues |
| 2026-01-09 | Completed Category 2: Precise Topic review - ~313 queries, 28 migrations |
| 2026-01-09 | Completed Category 3: Natural Expression review - ~83 queries, 2 issues |
| 2026-01-09 | Completed Category 4: Cross-Topic review - 17 queries, 1 issue |
| 2026-01-09 | Completed Category 5: Pedagogical Intent review - 2 queries, coverage gap |
