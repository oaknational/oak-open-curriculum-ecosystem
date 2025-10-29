# Oak Curriculum: A Three-Dimensional Model

**Date**: 2025-10-28

**Purpose**: Visualizing how Sequences, Programmes, and Threads interact to create Oak's curriculum structure.

---

## The Three Dimensions

Oak's curriculum operates in **three dimensions** simultaneously:

### Dimension 1: **Sequences** (Organisational)

- **What**: Curriculum structure for a subject
- **Span**: Multi-year, multi-key-stage
- **Purpose**: Organise units for API/data management
- **Example**: `science-secondary-aqa` (Years 7-11)

### Dimension 2: **Programmes** (Contextual)

- **What**: Teacher-facing curriculum pathway
- **Span**: Single key stage, specific context (tier, exam board)
- **Purpose**: Match how teachers navigate and plan
- **Example**: `biology-secondary-ks4-foundation-aqa` (Years 10-11, Foundation tier)

### Dimension 3: **Threads** (Conceptual)

- **What**: Progression pathway for a concept
- **Span**: Cross-year, cross-context
- **Purpose**: Show how ideas build over time
- **Example**: `bq01-biology-what-are-living-things-and-what-are-they-made-of` (Year 1 → Year 11)

---

## Visualising the Three Dimensions

```plaintext
                    THREADS (Conceptual Progression)
                           ↑
                           │
          ╔════════════════╪════════════════╗
          ║                │                ║
          ║    Thread A    │   Thread B     ║  (How concepts develop)
          ║    "Number"    │   "Biology:    ║
          ║                │   Living       ║
          ║    Order 1-118 │   Things"      ║
          ║                │   Order 1-32   ║
          ╚════════════════╧════════════════╝
                           │
      ┌────────────────────┼────────────────────┐
      │                    │                    │
SEQUENCES              PROGRAMMES         UNITS
(Data structure)    (Teacher view)    (Content blocks)
      │                    │                    │
      │                    │                    │
      ↓                    ↓                    ↓
┌──────────┐         ┌──────────┐         ┌──────────┐
│ science- │────────▶│ biology- │────────▶│ "Cells"  │──┐
│secondary-│         │secondary-│         └──────────┘  │
│   aqa    │         │   ks4-   │                       │
│          │         │foundation│         ┌──────────┐  │
│ Years    │         │   -aqa   │────────▶│ "Diffus- │◀─┤
│ 7-11     │         │          │         │  ion"    │  │
│          │         │ Years    │         └──────────┘  │
└──────────┘         │ 10-11    │                       │
      │              └──────────┘         ┌──────────┐  │
      │                    │              │ "Eukaryo-│◀─┤
      │              ┌──────────┐         │ tic cells│  │
      └─────────────▶│ biology- │────────▶└──────────┘  │
                     │secondary-│                       │
                     │   ks4-   │                       │
                     │  higher  │                    Belong to
                     │   -aqa   │                    Thread A
                     │          │                    (ordered)
                     │ Years    │
                     │ 10-11    │
                     └──────────┘

1 Sequence generates → Multiple Programmes → Multiple Units → Belong to Threads
```

---

## How They Interact: A Concrete Example

### The Unit: "Cells" (Year 7 Biology)

This single unit exists in **all three dimensions** simultaneously:

#### Sequence Dimension

```plaintext
Belongs to: science-secondary-aqa
Context: Year 7, KS3
Position: Unit 3 in Year 7
```

#### Programme Dimension

```plaintext
Appears in ALL these programmes:
  - biology-secondary-ks3 (general KS3)
  - combined-science-secondary-ks3 (if offered)
  - physics-secondary-ks3 (for school context)
  - chemistry-secondary-ks3 (for school context)

(All students doing science see this unit, regardless of later KS4 choices)
```

#### Thread Dimension

```plaintext
Belongs to: bq01-biology-what-are-living-things-and-what-are-they-made-of
Thread Order: 13
Progression:
  ← Order 2: "Human body parts" (KS1)
  ← Order 6: "Living things and where they live" (KS2)
  → Order 14: "Human skeleton and muscles" (KS3)
  → Order 22: "Biological molecules and enzymes" (KS4)
```

**Result**: The "Cells" unit is:

1. **Organised** in a sequence (data structure)
2. **Navigable** via programmes (teacher pathway)
3. **Conceptually positioned** in a thread (learning progression)

---

## The Unit: "Eukaryotic and Prokaryotic Cells" (Year 10)

Same concept, more advanced:

### Sequence Dimension (Advanced)

```plaintext
Belongs to: science-secondary-aqa
Context: Year 10, KS4
Position: Within examSubjects > Biology > tiers
```

### Programme Dimension (Advanced)

```plaintext
Appears in ONLY these programmes:
  - biology-secondary-ks4-foundation-aqa
  - biology-secondary-ks4-higher-aqa
  - combined-science-secondary-ks4-foundation-aqa
  - combined-science-secondary-ks4-higher-aqa

(Different content depth for Foundation vs Higher)
```

### Thread Dimension (Advanced)

```plaintext
Belongs to: bq01-biology-what-are-living-things-and-what-are-they-made-of
Thread Order: 32
Progression:
  ← Order 13: "Cells" (KS3) - builds on this
  ← Order 22: "Biological molecules and enzymes" (KS4)
  → [Terminal unit in this thread]
```

**Result**: This advanced unit:

1. Exists in the same **sequence** as the KS3 "Cells" unit
2. Appears in **fewer programmes** (only KS4 Biology/Combined Science)
3. Comes **later** in the thread progression (order 32 vs 13)

---

## How Teachers Navigate

### Scenario 1: Programme-First Navigation (Most Common)

**Teacher thinking**: "I teach Year 10 Foundation Biology AQA"

**Navigation path**:

1. Find programme: `biology-secondary-ks4-foundation-aqa`
2. Browse units in that programme
3. Select unit to teach
4. _(Implicit)_ See thread progression in unit metadata

**What they see**: A curated list of units appropriate for their context (year, tier, exam board).

### Scenario 2: Thread-First Navigation (Planning/Understanding)

**Teacher thinking**: "How does the concept of 'cells' develop across the curriculum?"

**Navigation path**:

1. Find thread: `bq01-biology-what-are-living-things-and-what-are-they-made-of`
2. View all units in thread (ordered)
3. See progression from KS1 → KS4
4. Identify prerequisites and next steps

**What they see**: A learning progression showing conceptual development.

### Scenario 3: Search-First Navigation (Discovery)

**Teacher thinking**: "I need lessons on photosynthesis"

**Navigation path**:

1. Search: "photosynthesis"
2. Get results from multiple contexts (KS3, KS4, Foundation, Higher)
3. Filter by programme or thread as needed

**What they see**: All relevant content, with context to choose appropriate version.

---

## Why All Three Dimensions Matter

### For Data Management (Sequences)

**Sequences** are efficient for:

- **API responses**: Don't duplicate content across contexts
- **Data storage**: One sequence = many programmes (generated)
- **Maintenance**: Update once, propagates to all programmes

**But**: Not how teachers think

### For Teacher Navigation (Programmes)

**Programmes** are essential for:

- **Mental model**: Teachers think "I teach Year 10 Foundation"
- **Filtering**: Show only relevant content for context
- **URLs**: Match how teachers bookmark and share

**But**: Don't show conceptual progression

### For Learning Progression (Threads)

**Threads** are powerful for:

- **Pedagogical coherence**: See how ideas build
- **Planning**: Identify prerequisites and next steps
- **Assessment**: Understand expected progression
- **Continuity**: Cross-key-stage transitions

**But**: Not a navigation structure (too granular)

---

## The Optimal System: All Three Together

```plaintext
┌─────────────────────────────────────────────────────────┐
│                  OAK CURRICULUM MODEL                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  SEQUENCES (Backend)                                    │
│  ├─ Efficient data structure                            │
│  ├─ API responses                                       │
│  └─ Single source of truth                              │
│                                                         │
│  PROGRAMMES (Frontend)                                  │
│  ├─ Teacher-facing navigation                           │
│  ├─ Context-aware filtering                             │
│  └─ OWA URL structure                                   │
│                                                         │
│  THREADS (Pedagogical)                                  │
│  ├─ Conceptual progression                              │
│  ├─ Cross-context continuity                            │
│  └─ Planning & assessment                               │
│                                                         │
└─────────────────────────────────────────────────────────┘

       ▼ Units exist at the intersection ▼

    ┌────────┐
    │  UNIT  │ ← Belongs to a Sequence (organisation)
    │        │ ← Appears in Programmes (contexts)
    │ "Cells"│ ← Positioned in Threads (progression)
    └────────┘
```

---

## Implications for AI Tools

### Layer 1-2 Tools (Current)

**Primarily navigate via sequences**:

- `get-sequences-units` (sequence-first)
- `get-key-stages-subject-lessons` (implicitly programme-like)
- `search` (returns lessons with context)

**Challenge**: Can't easily filter by programme or trace threads

### Layer 3-4 Tools (Future)

**Need all three dimensions**:

**Programme-aware**:

- "Find Year 10 Foundation Biology lessons" → programme filtering
- "Generate OWA URLs" → programme slugs required

**Thread-aware**:

- "Show me how fractions progress" → thread traversal
- "What are prerequisites for this unit?" → thread ordering
- "Compare Foundation vs Higher coverage" → thread + programme intersection

**Integrated navigation**:

- Start with programme (context)
- Explore via threads (progression)
- Fetch from sequences (data)

---

## Curriculum Structure Matrix

|                     | **Sequences**              | **Programmes**                 | **Threads**                   |
| ------------------- | -------------------------- | ------------------------------ | ----------------------------- |
| **Primary purpose** | Data organisation          | Teacher navigation             | Conceptual progression        |
| **Scope**           | Multi-year, multi-context  | Single-year, single-context    | Cross-year, cross-context     |
| **User**            | API consumers              | Teachers                       | Curriculum designers/Teachers |
| **Mutability**      | Relatively stable          | Can change (contexts change)   | Evolves with curriculum       |
| **Cardinality**     | ~50 sequences              | ~200+ programmes               | ~200 threads                  |
| **API exposure**    | Native (GET /sequences)    | Indirect (materialized in OWA) | Native (GET /threads)         |
| **In URLs?**        | No (API uses, OWA doesn't) | Yes (OWA: /programmes/{slug})  | No                            |

---

## Recommendation: Expose All Three

**Current API** exposes:

- ✅ Sequences (well documented)
- ❌ Programmes (must be inferred)
- ✅ Threads (documented but underutilized)

**Enhanced API** should expose:

- ✅ Sequences (keep)
- ✅ **Programmes** (add `/programmes` endpoint - see Item #5 in wishlist)
- ✅ Threads (keep, enhance metadata)

**Benefits**:

1. **Clearer conceptual model**: All three dimensions explicit
2. **Flexible navigation**: Choose dimension based on need
3. **Powerful AI tools**: Can leverage all three for sophisticated features
4. **Better teacher UX**: Match mental models (programmes) AND show progression (threads)

---

## Summary

Oak's curriculum is **three-dimensional**:

1. **Sequences** = How we **store** curriculum (efficient, multi-context)
2. **Programmes** = How teachers **navigate** curriculum (contextual, year-specific)
3. **Threads** = How concepts **progress** (cross-context, developmental)

**Units** exist at the intersection of all three, making Oak's curriculum:

- **Organised** (sequences)
- **Accessible** (programmes)
- **Coherent** (threads)

This three-dimensional model is what makes Oak unique and powerful - but it needs to be exposed properly in the API for AI tools to leverage it fully.
