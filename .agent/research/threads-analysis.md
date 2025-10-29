# Threads: Curriculum Progression Pathways

**Date**: 2025-10-28

**Purpose**: Understanding how threads work in the Oak Curriculum as cross-unit conceptual strands that track progression.

---

## What Are Threads?

**Definition** (from ontology): A cross-unit conceptual strand that links units across the curriculum.

**Purpose**: Threads show how specific concepts, skills, or themes develop over time—from early years through to GCSE level.

**Key characteristic**: One thread can span multiple:

- Key stages (KS1 → KS2 → KS3 → KS4)
- Year groups (Year 1 → Year 11)
- Subjects (though most are subject-specific)
- Units within those contexts

---

## Thread Inventory

From `GET /threads`, there are **~200 threads** across all subjects:

### Subject-Specific Threads

**Maths threads** (examples):

- `number` - core number concepts
- `algebra` - algebraic thinking
- `geometry-21` - geometric concepts
- `probability` - probability and statistics
- `ratio-and-proportion` - multiplicative reasoning

**Science threads** ("Big Questions"):

- `bq01-biology-what-are-living-things-and-what-are-they-made-of`
- `bq02-biology-how-do-living-things-grow-and-reproduce`
- `bq03-biology-how-do-living-things-live-together-in-their-environments`
- `bq06-chemistry-how-do-we-explain-how-substances-behave`
- `bq11-physics-how-do-forces-make-things-happen`

**English threads**:

- `developing-reading-preferences`
- `developing-spelling-accuracy`
- `developing-grammatical-knowledge`
- `fiction-reading-spine`

**Geography threads**:

- `climate-and-weather`
- `mountains-volcanoes-and-earthquakes`
- `water-and-rivers`
- `land-use-and-settlement`

**Computing threads**:

- `programming`
- `data-and-information`
- `creating-media`
- `networks`

**Languages threads** (French, German, Spanish):

- `the-present` (present tense)
- `the-past` (past tense)
- `the-future-and-conditional`
- `grammar-61`

### Cross-Curricular Threads

**Physical Education threads** (framework):

- `move-movement-competence`
- `think-knowledge-of-healthy-active-living`
- `feel-personal-and-emotional`
- `connect-cultural-and-ethical-awareness`

**Design & Technology threads**:

- `design`
- `make`
- `effective-use-of-tools`
- `sensory-evaluation`

---

## Case Study 1: The "Number" Thread

**Thread**: `number`

**Total units**: 118 units (one of the largest threads)

**Progression example** (selected units in order):

### KS1 (Years 1-2) - Foundational Counting

```plaintext
Order 15: Counting, recognising and comparing numbers 0-10
Order 16: Addition and subtraction facts within 10
Order 19: Comparing quantities - part part whole relationships
Order 20: Composition of numbers 0 to 5
Order 24: Counting to and from 20
```

### KS2 (Years 3-6) - Place Value & Operations

```plaintext
Order 33: Comparing, ordering and partitioning 2-digit numbers
Order 37: Fractions: identify equal parts (halves, thirds, quarters)
Order 59: Representing 3-digit numbers, comparing and positioning on number lines
Order 68: Comparing, ordering and rounding 4-digit numbers
Order 96: Understand hundredths as parts of a whole
Order 114: Understand place value within numbers up to 7 digits
```

### KS3/KS4 (Years 7-11) - Abstract Number Concepts

```plaintext
Order 1: Place value (revisited at higher level)
Order 2: Properties of number: factors, multiples, squares and cubes
Order 3: Arithmetic procedures with integers and decimals
Order 7: Standard form
Order 8: Surds
Order 9: Arithmetic procedures: index laws
```

**Key observation**: The thread shows **clear hierarchical progression** from concrete counting to abstract mathematical concepts.

---

## Case Study 2: Biology "Big Question" Thread

**Thread**: `bq01-biology-what-are-living-things-and-what-are-they-made-of`

**Total units**: 32 units

**Progression example**:

### Primary (KS1/KS2) - Observable Features

```plaintext
Order 1: Naming and grouping animals
Order 2: Human body parts
Order 5: Identifying plants and their basic parts
Order 6: Living things and where they live
```

### Lower Secondary (KS3) - Systems

```plaintext
Order 9: Introduction to the human skeleton and muscles
Order 10: The human circulatory system
Order 13: Cells
Order 14: Human skeleton and muscles (deeper study)
Order 15: Human digestive system
```

### Upper Secondary (KS4) - Molecular & Cellular

```plaintext
Order 22: Biological molecules and enzymes
Order 23: Transport and exchange surfaces in humans
Order 24: Coordination and control: the human nervous system
Order 26: Photosynthesis: requirements and products
Order 27: Aerobic and anaerobic cellular respiration
Order 29: Coordination and control: maintaining a constant internal environment
Order 32: Eukaryotic and prokaryotic cells
```

**Key observation**: From **"What can we observe?"** (animals, body parts) to **"How does it work at a cellular level?"** (prokaryotic cells, cellular respiration).

---

## Case Study 3: English Reading Thread

**Thread**: `fiction-reading-spine`

(Would need to query to see full details, but the name suggests a curated reading progression)

---

## How Threads Work Across Programme Contexts

**Important insight**: Threads appear to **cross programme boundaries**.

**Example from Biology thread**:

- Units appear in multiple contexts:
  - Primary sequences (KS1, KS2)
  - Secondary KS3 sequence
  - Secondary KS4 sequences (different exam boards)
  - **But all belong to the same thread**

**This means**:

```plaintext
Thread: BQ01 Biology
  ├─ Unit: "Cells" (Year 7, KS3, all programmes)
  ├─ Unit: "Eukaryotic and prokaryotic cells" (Year 10, KS4)
  │    ├─ In programme: biology-secondary-ks4-foundation-aqa
  │    ├─ In programme: biology-secondary-ks4-higher-aqa
  │    ├─ In programme: biology-secondary-ks4-foundation-ocr
  │    └─ In programme: biology-secondary-ks4-higher-ocr
  └─ ... (all other thread units)
```

**Threads are programme-agnostic** - they show conceptual progression regardless of exam board or tier.

---

## Thread Naming Patterns

### 1. Descriptive Names (Most Common)

**Pattern**: What the thread is about

**Examples**:

- `number`, `algebra`, `geometry`
- `programming`, `networks`, `data-and-information`
- `climate-and-weather`, `mountains-volcanoes-and-earthquakes`

### 2. Big Questions (Sciences)

**Pattern**: `bqNN-subject-question`

**Examples**:

- `bq01-biology-what-are-living-things-and-what-are-they-made-of`
- `bq11-physics-how-do-forces-make-things-happen`
- `bq15-how-can-we-live-sustainably-to-protect-earth-for-a-better-future`

**Note**: These are pedagogical "inquiry questions" that frame the learning journey.

### 3. Skill Development (English, Languages)

**Pattern**: `developing-{skill}` or `{skill}-development`

**Examples**:

- `developing-reading-preferences`
- `developing-spelling-accuracy`
- `developing-grammatical-knowledge`

### 4. Framework Categories (PE)

**Pattern**: `{framework-area}-{specific-focus}`

**Examples**:

- `move-movement-competence`
- `think-knowledge-of-healthy-active-living`
- `feel-personal-and-emotional`

---

## Thread Metadata

From the API, each thread has:

```typescript
{
  "title": "BQ01 Biology: What are living things and what are they made of?",
  "slug": "bq01-biology-what-are-living-things-and-what-are-they-made-of"
}
```

**Minimal metadata at the thread level** - the richness comes from:

1. **The units within the thread** (accessed via `GET /threads/{threadSlug}/units`)
2. **The ordering of those units** (`unitOrder` field shows progression)

---

## How Units Reference Threads

From sequence/unit data, units can belong to multiple threads:

```typescript
{
  "unitTitle": "Cells",
  "threads": [
    {
      "threadTitle": "BQ01 Biology: What are living things...",
      "threadSlug": "bq01-biology-what-are-living-things-and-what-are-they-made-of",
      "order": 1
    }
  ]
}
```

**Key field**: `order` - shows where this unit sits in the thread's progression.

---

## Value of Threads

### 1. Pedagogical Progression

Threads make Oak's curriculum **explicitly progressive**:

- Not just "here are some Year 7 maths units"
- But "here's how number concepts build from Reception to Year 11"

### 2. Teacher Planning

Teachers can:

- **Trace prerequisites**: "What did students learn before this unit?"
- **Plan sequences**: "What comes next in this conceptual strand?"
- **Identify gaps**: "Have my students covered the earlier units in this thread?"

### 3. Cross-Key-Stage Continuity

Threads show **transition pathways**:

- Primary → Secondary transitions
- KS3 → KS4 progression
- Foundation → Higher tier relationships

### 4. AI Tool Opportunities

Threads enable powerful AI features:

**"Show me how fractions progress from Year 1 to Year 6"**

→ Query `number` thread, filter Years 1-6, find fraction-related units

**"What prior knowledge do students need for this KS4 unit?"**

→ Trace thread backwards to find prerequisite units

**"Compare Foundation and Higher tier coverage of this topic"**

→ Query thread, filter by tier, compare unit overlap

**"Find units that build on this concept"**

→ Query thread, find units with higher `order` values

---

## Threads vs Programmes

**Threads** and **programmes** serve different purposes:

| Aspect          | Programme                                   | Thread                                   |
| --------------- | ------------------------------------------- | ---------------------------------------- |
| **Purpose**     | Teacher navigation (what to teach when)     | Conceptual progression (how ideas build) |
| **Scope**       | Subject + Year + Context (tier, exam board) | Cross-year, cross-context                |
| **User-facing** | Yes (OWA URLs)                              | Implicit (not in URLs, but in unit data) |
| **Filters**     | Key stage, tier, exam board, pathway        | None (spans all contexts)                |
| **Example**     | `biology-secondary-ks4-foundation-aqa`      | `bq01-biology-what-are-living-things...` |

**Relationship**:

```plaintext
Programme (contextualised)
  ├─ Unit 1 (belongs to Thread A, order 5)
  ├─ Unit 2 (belongs to Thread A, order 12)
  ├─ Unit 3 (belongs to Thread B, order 3)
  └─ Unit 4 (belongs to Thread C, order 8)

Thread A (conceptual)
  ├─ Unit from Programme X (order 1)
  ├─ Unit from Programme Y (order 5)  ← This unit
  ├─ Unit from Programme Z (order 12) ← This unit
  └─ Unit from Programme W (order 20)
```

**Threads are programme-independent** - they show how concepts build regardless of when/where they're taught.

---

## Implementation in API

### Current Endpoints

1. **`GET /threads`** - List all threads (title + slug only)
2. **`GET /threads/{threadSlug}/units`** - Get all units in a thread with their order

### How to Use Threads

**Scenario 1: Find all units in a thread**

```typescript
GET /threads/number/units

Returns: Array of units with unitOrder showing progression
```

**Scenario 2: Find threads for a specific unit**

```typescript
GET /sequences/{sequence}/units
// or
GET /units/{unit}/summary

Response includes:
{
  "threads": [
    { "threadSlug": "...", "order": 5 }
  ]
}
```

**Scenario 3: Trace progression**

```typescript
1. Get unit details → see which threads it belongs to
2. Get full thread → see all units in progression
3. Filter by order < current unit → find prerequisites
4. Filter by order > current unit → find next steps
```

---

## AI Integration Opportunities

### Layer 4 Advanced Tools (Enabled by Threads)

**`trace-concept-progression`**:

```plaintext
Input: "Show me how fractions progress from KS1 to KS4"
Steps:
  1. Query "number" thread
  2. Filter units containing "fraction"
  3. Sort by order
  4. Group by key stage
  5. Return progression pathway
```

**`find-prerequisites`**:

```plaintext
Input: "What should students know before this unit?"
Steps:
  1. Get unit's thread(s) and order
  2. Query thread(s)
  3. Filter units with order < current
  4. Return prerequisite units
```

**`compare-programme-paths`**:

```plaintext
Input: "Compare Foundation vs Higher progression for this topic"
Steps:
  1. Identify thread for topic
  2. Get all units in thread
  3. Filter by tier (Foundation vs Higher)
  4. Compare coverage, depth, order
```

**`discover-cross-curricular-links`**:

```plaintext
Input: "What science topics relate to this geography unit?"
Steps:
  1. Look for shared threads between subjects
  2. Or: semantic search across thread names
  3. Find conceptual overlaps
```

---

## Threads in Ontology

**Current ontology status**: Threads are defined but underutilized.

**Updated relationship**:

```plaintext
Thread HAS_MANY Unit (ordered progression)
Unit BELONGS_TO_MANY Thread (unit can appear in multiple threads)
Unit IN_THREAD Thread (with specific order)
Thread SPANS_MANY KeyStage (cross-stage progression)
Thread SPANS_MANY Programme (programme-independent)
```

**Thread as a first-class entity** for curriculum navigation and understanding.

---

## Questions for Further Exploration

1. **Are threads manually curated?** Or generated from curriculum mapping?
2. **What's the authoring process?** How does Oak decide which units belong to which threads?
3. **Are there "hidden" threads?** Conceptual progressions not yet explicitly modeled?
4. **Cross-subject threads?** Do any threads span multiple subjects? (e.g., numeracy across maths/science)
5. **Thread completeness**: Are all units assigned to threads? Or are some "threadless"?

---

## Recommendation

**Threads are incredibly valuable** for:

1. Making curriculum progression explicit
2. Supporting teacher planning
3. Enabling sophisticated AI tools
4. Showing educational coherence

**Suggested API enhancements**:

1. **Thread metadata endpoint**: Return more info than just title/slug (key stages covered, subject(s), unit count)
2. **Thread filtering**: `GET /threads?subject=maths&keyStage=ks2`
3. **Unit-to-thread navigation**: Make it easy to jump from unit → threads → related units
4. **Thread visualisation data**: Provide data for rendering progression diagrams

**For AI wishlist**: Add thread navigation and progression tracking to Layer 4 tool requests.

---

## Related Documentation

- **Full thread list**: 200+ threads from `GET /threads`
- **Thread examples**: `number` (118 units), `bq01-biology` (32 units)
- **Ontology**: `docs/architecture/curriculum-ontology.md` (Thread entity)
- **API**: Threads accessible via `/threads` and embedded in unit responses
