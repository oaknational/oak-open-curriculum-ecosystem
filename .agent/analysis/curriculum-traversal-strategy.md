# Curriculum Traversal Strategy

**Status**: Reference document — Comprehensive traversal analysis  
**Date**: 2025-12-28  
**Related**: [ADR-080](../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md), [Curriculum Structure Analysis](../analysis/curriculum-structure-analysis.md)

---

## Pattern Analysis: Mutual Exclusivity

### Are the 7 patterns mutually exclusive?

**NO** — Patterns can **combine**. Here's the relationship:

| Pattern | Can Combine With | Example |
|---------|------------------|---------|
| 1 (Simple Primary) | None | Standalone for KS1-KS2 |
| 2 (Simple KS3) | None | Standalone for KS3 |
| 3 (Tier variants) | Pattern 4 (exam boards) | Maths could have exam board sequences with tiers |
| 4 (Exam boards) | Pattern 3 (tiers), Pattern 6 (unit options) | English has both exam boards AND unit options |
| 5 (Exam subjects) | Pattern 3 (tiers), Pattern 4 (exam boards) | Science KS4 has exam boards, exam subjects, AND tiers |
| 6 (Unit options) | Pattern 4 (exam boards) | English, Geography, History, RE have both |
| 7 (No KS4) | None | Only cooking-nutrition |

**Combination Matrix for KS4:**

| Subject | Exam Boards | Tiers | Exam Subjects | Unit Options |
|---------|-------------|-------|---------------|--------------|
| Maths | — | ✓ | — | — |
| Science | ✓ (AQA, Edexcel, OCR) | ✓ | ✓ (Bio/Chem/Phys/Combined) | — |
| English | ✓ (AQA, Edexcel, Eduqas) | — | — | ✓ |
| Geography | ✓ (AQA, Edexcel B) | — | — | ✓ |
| History | ✓ (AQA, Edexcel) | — | — | ✓ |
| Religious Ed | ✓ (AQA, Core, Edexcel B, Eduqas) | — | — | ✓ |
| Art | — | — | — | ✓ |
| Design-Tech | — | — | — | ✓ |
| Others | ✓ | — | — | — |

---

## Do the 12 "Exam Board Variant" Subjects Include Science/Maths KS4?

**Science KS4: YES** — Science has exam board variants (AQA, Edexcel, OCR) but **also** has exam subjects and tiers nested within.

**Maths KS4: NO** — Maths has a **single sequence** (`maths-secondary`) with `ks4Options: null`. It has tiers but NOT exam board variants.

The 12 subjects with exam board variants are:

1. Citizenship (Core, GCSE)
2. Computing (AQA, Core, GCSE, OCR)
3. English (AQA, Edexcel, Eduqas)
4. French (AQA, Edexcel)
5. Geography (AQA, Edexcel B)
6. German (AQA, Edexcel)
7. History (AQA, Edexcel)
8. Music (AQA, Edexcel, Eduqas, OCR)
9. Physical Education (AQA, Core, Edexcel, GCSE, OCR)
10. Religious Education (AQA, Core, Edexcel B, Eduqas)
11. **Science** (AQA, Edexcel, OCR) ← Has exam subjects + tiers INSIDE each board
12. Spanish (AQA, Edexcel)

**Not in this list** (single sequence, no exam boards):

- Maths (has tiers but no exam board variants)
- Art (has unit options but no exam boards)
- Design-Technology (has unit options but no exam boards)
- Cooking-nutrition (no KS4)
- RSHE-PSHE (simple secondary sequence)

---

## API Routes for Each Pattern

### Pattern 1 & 2: Simple Flat (Primary/KS3)

**Primary Route:**

```http
GET /key-stages/{ks1|ks2}/subject/{subject}/lessons?limit=100&offset=0
```

**KS3 Route:**

```http
GET /key-stages/ks3/subject/{subject}/lessons?limit=100&offset=0
```

**Note**: Must paginate. API has known pagination bug (see ADR-083) — workaround is to filter by unit:

```http
GET /key-stages/{ks}/subject/{subject}/lessons?unit={unitSlug}
```

### Pattern 3: Tier Variants (Maths KS4)

**Route:**

```http
GET /sequences/maths-secondary/units?year=10
GET /sequences/maths-secondary/units?year=11
```

**Response shape:**

```json
{
  "data": [{
    "year": 10,
    "tiers": [
      { "tierSlug": "foundation", "units": [...] },
      { "tierSlug": "higher", "units": [...] }
    ]
  }]
}
```

**Processing:**

1. For each year (10, 11)
2. For each tier in `tiers[]`
3. For each unit in `tier.units[]`
4. Fetch lessons via `/key-stages/ks4/subject/maths/lessons?unit={unitSlug}`
5. Associate tier with each lesson

### Pattern 4: Exam Board Variants (12 subjects)

**Route 1: Get all sequences for a subject:**

```http
GET /subjects/{subject}
# Response includes `sequenceSlugs[]` with `ks4Options` for each
```

**Route 2: For each KS4 sequence:**

```http
GET /sequences/{sequence}/units?year=10
GET /sequences/{sequence}/units?year=11
```

**Processing:**

1. Get subject metadata to find all sequences
2. Filter sequences by `ks4Options !== null` for KS4
3. Query each sequence for years 10 and 11
4. Track exam board (from `ks4Options.slug`) for each unit/lesson

### Pattern 5: Exam Subject Split (Science KS4)

**Route:**

```http
GET /sequences/science-secondary-aqa/units?year=10
GET /sequences/science-secondary-aqa/units?year=11
GET /sequences/science-secondary-edexcel/units?year=10
# ... etc for each exam board
```

**Response shape:**

```json
{
  "data": [{
    "year": 10,
    "examSubjects": [
      {
        "examSubjectSlug": "biology",
        "tiers": [
          { "tierSlug": "foundation", "units": [...] },
          { "tierSlug": "higher", "units": [...] }
        ]
      },
      { "examSubjectSlug": "chemistry", "tiers": [...] },
      { "examSubjectSlug": "physics", "tiers": [...] },
      { "examSubjectSlug": "combined-science", "tiers": [...] }
    ]
  }]
}
```

**Processing:**

1. Get science sequences (science-secondary-aqa, science-secondary-edexcel, science-secondary-ocr)
2. For each sequence, for years 10 and 11
3. For each exam subject in `examSubjects[]`
4. For each tier in `examSubject.tiers[]`
5. For each unit in `tier.units[]`
6. Fetch lessons and associate exam board, exam subject, tier

**CRITICAL**: `/key-stages/ks4/subject/science/lessons` returns **EMPTY**. Must use sequences.

### Pattern 6: Unit Options (6 subjects)

**Route:** Same as Pattern 4 (exam board traversal)

**Detection:** Check for `unitOptions[]` in unit response:

```json
{
  "unitTitle": "Modern text: first study",
  "unitOptions": [
    { "unitTitle": "Animal Farm", "unitSlug": "modern-text-first-study-5139" },
    { "unitTitle": "Inspector Calls", "unitSlug": "modern-text-first-study-4896" }
  ]
}
```

**Processing:**

1. When encountering `unitOptions[]`, treat each option as a separate unit
2. Fetch lessons for each unit option slug
3. Track parent unit relationship

### Pattern 7: No KS4 (Cooking-nutrition)

**Processing:** Skip KS4 traversal entirely for this subject.

---

## Complete Traversal Algorithm

To acquire **all curriculum information** for **all subjects** and **all key stages**:

```typescript
async function traverseAllCurriculum() {
  const subjects = await getSubjects();
  
  for (const subject of subjects.data) {
    // Get sequence information for this subject
    const sequences = subject.sequenceSlugs;
    
    for (const sequence of sequences) {
      // Determine key stages covered by this sequence
      const keyStages = sequence.keyStages;
      
      for (const keyStage of keyStages) {
        const years = getYearsForKeyStage(keyStage);
        
        for (const year of years) {
          // Fetch units for this sequence and year
          const unitsResponse = await getSequenceUnits(sequence.sequenceSlug, year);
          
          // Detect pattern from response structure
          const pattern = detectPattern(unitsResponse, subject.subjectSlug, keyStage.keyStageSlug);
          
          // Process according to pattern
          await processUnits(unitsResponse, pattern, {
            subject: subject.subjectSlug,
            keyStage: keyStage.keyStageSlug,
            sequence: sequence.sequenceSlug,
            year,
            examBoard: sequence.ks4Options?.slug ?? null
          });
        }
      }
    }
  }
}

function detectPattern(response: SequenceUnitsResponse, subject: string, keyStage: string): Pattern {
  const yearData = response.data[0];
  
  if (!yearData) return 'empty';
  
  if ('examSubjects' in yearData && yearData.examSubjects) {
    return 'exam-subject-split'; // Pattern 5
  }
  
  if ('tiers' in yearData && yearData.tiers) {
    return 'tier-variants'; // Pattern 3
  }
  
  if (yearData.units?.some(u => 'unitOptions' in u && u.unitOptions)) {
    return 'unit-options'; // Pattern 6
  }
  
  return 'simple'; // Patterns 1, 2, 4
}
```

---

## Is Any Curriculum Information Missed?

### Accessed via Subject/KeyStage Traversal

| Data Type | Accessed | Notes |
|-----------|----------|-------|
| Lessons | ✓ | Via sequences + lessons endpoint |
| Units | ✓ | Via sequences endpoint |
| Unit metadata | ✓ | Via `/units/{slug}/summary` |
| Lesson metadata | ✓ | Via `/lessons/{slug}/summary` |
| Transcripts | ✓ | Via `/lessons/{slug}/transcript` |
| Quizzes | ✓ | Via `/lessons/{slug}/quiz` |
| Assets | ✓ | Via `/lessons/{slug}/assets` |
| Tier information | ✓ | From sequence traversal context |
| Exam board information | ✓ | From sequence `ks4Options` |
| Exam subject information | ✓ | From sequence traversal (science) |
| Unit options | ✓ | From sequence unit response |

### NOT Accessed via Subject/KeyStage Traversal

| Data Type | How to Access | Notes |
|-----------|---------------|-------|
| **Threads** | `GET /threads` + `GET /threads/{slug}/units` | Cross-subject conceptual progressions |
| **Thread associations** | In unit responses from sequences | Already captured during traversal |
| **Categories** | In unit responses | Already captured during traversal |
| **Programmes** | **NOT EXPOSED** | See wishlist item #5 — programmes are OWA-only |
| **RSHE-PSHE content** | API only (no bulk) | Must use API traversal |

### Thread Data

Threads are **cross-cutting** — they span subjects and years. They're accessible via:

```http
GET /threads                        # List all threads
GET /threads/{threadSlug}/units     # Get units in a thread
```

Thread associations are ALSO embedded in unit responses:

```json
{
  "unitSlug": "algebraic-manipulation",
  "threads": [
    { "threadTitle": "Algebra", "threadSlug": "algebra", "order": 2 }
  ]
}
```

**Recommendation**: Thread data is captured during traversal. The `/threads` endpoint provides a different view (units grouped by thread) that may be useful for progression analysis but is not required for complete lesson/unit ingestion.

---

## Static vs Dynamic Pattern Recognition

### Recommendation: Static Pattern Config with Validation

**Static encoding is preferred** because:

1. **Patterns are structural** — They describe API organisation, not runtime data variation
2. **Changes are breaking** — Oak would need to restructure their curriculum database
3. **Static enables type safety** — Pattern can be a discriminated union with exhaustive matching
4. **Dynamic detection adds complexity** — Every API call would need pattern sniffing

### Static Pattern Config

```typescript
// curriculum-patterns.ts (compile-time)
export const CURRICULUM_PATTERNS = {
  'maths:ks4': { pattern: 'tier-variants', traversal: 'tiers' },
  'science:ks4': { pattern: 'exam-subject-split', traversal: 'examSubjects+tiers' },
  'english:ks4': { pattern: 'exam-board-variants+unit-options', traversal: 'sequences+options' },
  'cooking-nutrition:ks4': { pattern: 'no-content', traversal: 'skip' },
  // All other subject:ks combinations default to 'simple'
} as const;

type PatternKey = keyof typeof CURRICULUM_PATTERNS;
```

### Validation Safeguards

To detect when the static config no longer matches reality:

```typescript
/**
 * Validates that the API response structure matches the expected pattern.
 * Throws with a useful error message if the contract is violated.
 */
function validatePatternContract(
  subject: string,
  keyStage: string,
  response: SequenceUnitsResponse,
  expectedPattern: Pattern
): void {
  const actualPattern = detectPatternFromResponse(response);
  
  if (actualPattern !== expectedPattern) {
    throw new CurriculumContractViolationError({
      subject,
      keyStage,
      expectedPattern,
      actualPattern,
      responseSnapshot: JSON.stringify(response.data[0], null, 2).slice(0, 500),
      message: `API structure for ${subject}:${keyStage} has changed. ` +
        `Expected pattern "${expectedPattern}" but detected "${actualPattern}". ` +
        `This indicates the Oak API structure has been modified. ` +
        `Update CURRICULUM_PATTERNS in curriculum-patterns.ts and ADR-080.`,
    });
  }
}

function detectPatternFromResponse(response: SequenceUnitsResponse): Pattern {
  const yearData = response.data[0];
  if (!yearData) return 'empty';
  if ('examSubjects' in yearData) return 'exam-subject-split';
  if ('tiers' in yearData) return 'tier-variants';
  if (yearData.units?.some(u => 'unitOptions' in u)) return 'unit-options';
  return 'simple';
}
```

### Error Message Example

```text
CurriculumContractViolationError: API structure for science:ks4 has changed.
Expected pattern "exam-subject-split" but detected "tier-variants".

This indicates the Oak API structure has been modified.
Update CURRICULUM_PATTERNS in curriculum-patterns.ts and ADR-080.

Response snapshot:
{
  "year": 10,
  "tiers": [
    { "tierSlug": "foundation", ... }
  ]
}

See: docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md
```

### Integration Points

1. **At ingestion time** — Validate every sequence response before processing
2. **At SDK level** — Optional validation wrapper for MCP tools
3. **In tests** — Smoke tests that hit live API and validate patterns

### Smoke Test

```typescript
describe('Curriculum Pattern Contract', () => {
  it('validates maths:ks4 is tier-variants', async () => {
    const response = await sdk.getSequenceUnits('maths-secondary', 10);
    validatePatternContract('maths', 'ks4', response, 'tier-variants');
  });
  
  it('validates science:ks4 is exam-subject-split', async () => {
    const response = await sdk.getSequenceUnits('science-secondary-aqa', 10);
    validatePatternContract('science', 'ks4', response, 'exam-subject-split');
  });
});
```

---

## Summary: Complete Traversal Requirements

1. **Use `/subjects` to get all subjects and their sequences**
2. **For each sequence, for each year:**
   - Call `/sequences/{seq}/units?year={year}`
   - Detect pattern from response structure
   - Process units/lessons according to pattern
3. **Handle special cases:**
   - Science KS4: Use examSubjects → tiers → units traversal
   - Maths KS4: Use tiers → units traversal
   - Unit options: Treat each option as separate unit
   - Cooking-nutrition: Skip KS4
4. **Fetch lesson details separately** (if needed beyond what bulk provides):
   - `/lessons/{slug}/summary`
   - `/lessons/{slug}/transcript`
   - `/lessons/{slug}/quiz`
   - `/lessons/{slug}/assets`

This traversal will capture **100% of lessons and units** available in the API.

---

## Related Documents

- [ADR-080: Comprehensive Curriculum Structure](../../docs/architecture/architectural-decisions/080-curriculum-data-denormalization-strategy.md)
- [Curriculum Structure Analysis](../analysis/curriculum-structure-analysis.md)
- [Upstream API Wishlist](../plans/sector-engagement/ooc-api-wishlist/index.md)
- [Pattern-Aware Ingestion Plan](./semantic-search/archive/completed/pattern-aware-ingestion.md) — Implementation plan (completed)
- [Semantic Search README](./semantic-search/README.md) — Navigation hub
