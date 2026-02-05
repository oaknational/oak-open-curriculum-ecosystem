# Multi-Index Ground Truths Plan

**Status**: Active  
**Created**: 2026-02-05  
**Priority**: Medium (post-lesson-GT foundation)

---

## Context

We have 30 foundational ground truths for `oak_lessons` with MRR=1.000. Now we need ground truths for other searchable indexes:

| Index | Documents | Target GTs | Purpose |
|-------|-----------|------------|---------|
| `oak_lessons` | 12,833 | 30 (done) | Individual lesson search |
| `oak_units` | 1,665 | 2 | Unit/planning search |
| `oak_threads` | 164 | 1 | Curriculum progression search |
| `oak_sequences` | 30 | 1 | Programme-level search (maybe filter) |

---

## Work Items

### Phase 1: Infrastructure (Required First)

#### 1.1 Create Index-Specific Test Scripts

Create test query scripts for each index, similar to `test-query.ts` for lessons.

**Files to create:**
- `src/lib/search-quality/test-query-units.ts`
- `src/lib/search-quality/test-query-threads.ts`
- `src/lib/search-quality/test-query-sequences.ts`

**Each script must:**
- Target the correct index (`oak_unit_rollup`, `oak_threads`, `oak_sequences`)
- Apply appropriate filters (subject, phase, key_stage as relevant)
- Run through the RRF pipeline (or appropriate search mechanism)
- Output results with scores for ground truth design

**Effort**: ~2 hours

#### 1.2 Extend Benchmark System

Decide: Separate benchmark runners per index, or unified with index parameter?

**Option A**: Separate runners
- `pnpm benchmark:lessons --all`
- `pnpm benchmark:units --all`
- `pnpm benchmark:threads --all`

**Option B**: Unified with flag
- `pnpm benchmark --index lessons --all`
- `pnpm benchmark --index units --all`

**Recommendation**: Option A (separate) for simplicity. These are small test suites.

**Effort**: ~3 hours

---

### Phase 2: Unit Ground Truths (2 GTs)

**Protocol**: [ground-truth-protocol-units.md](../../prompts/semantic-search/ground-truth-protocol-units.md)

#### 2.1 Primary Unit GT

| Field | Value |
|-------|-------|
| Subject | Maths or English |
| Phase | Primary |
| Focus | Topic with rich enrichment data |

**Steps:**
1. Use test script to explore unit search behaviour
2. Find unit with `description` and `why_this_why_now` populated
3. Design realistic planning query
4. Capture top 3 results with relevance scores
5. Create entry file

#### 2.2 Secondary Unit GT

| Field | Value |
|-------|-------|
| Subject | Science or Maths |
| Phase | Secondary |
| Focus | Complex topic hierarchy |

**Steps:** Same as 2.1

**Effort**: ~1 hour per GT

---

### Phase 3: Thread Ground Truth (1 GT)

**Protocol**: [ground-truth-protocol-threads.md](../../prompts/semantic-search/ground-truth-protocol-threads.md)

| Field | Value |
|-------|-------|
| Subject | Maths |
| Focus | Core progression (Number or Algebra) |

**Notes:**
- Threads are predominantly Maths
- 164 documents — high precision required
- Test whether "progression" vocabulary helps

**Effort**: ~1 hour

---

### Phase 4: Sequence Ground Truth (1 GT)

**Protocol**: [ground-truth-protocol-sequences.md](../../prompts/semantic-search/ground-truth-protocol-sequences.md)

| Field | Value |
|-------|-------|
| Subject | Maths |
| Phase | Secondary |
| Focus | Validate search works at all |

**Notes:**
- 30 documents — may be filter, not search
- Single GT validates the mechanism works
- Low priority if sequences are navigation-only

**Effort**: ~30 minutes

---

## Directory Structure

```
src/lib/search-quality/
├── ground-truth/
│   ├── entries/              # Lesson GTs (existing)
│   │   ├── maths-primary.ts
│   │   └── ...
│   ├── units/                # Unit GTs (new)
│   │   └── entries/
│   │       ├── maths-primary.ts
│   │       └── science-secondary.ts
│   ├── threads/              # Thread GTs (new)
│   │   └── entries/
│   │       └── maths.ts
│   ├── sequences/            # Sequence GTs (new)
│   │   └── entries/
│   │       └── maths-secondary.ts
│   ├── types.ts              # Extended for all index types
│   └── index.ts              # Updated exports
├── test-query.ts             # Lessons (existing)
├── test-query-units.ts       # Units (new)
├── test-query-threads.ts     # Threads (new)
└── test-query-sequences.ts   # Sequences (new)
```

---

## Success Criteria

| Index | Target GTs | Success Metric |
|-------|------------|----------------|
| Units | 2 | MRR ≥ 0.8 |
| Threads | 1 | MRR = 1.0 (small index) |
| Sequences | 1 | MRR = 1.0 (tiny index) |

---

## Dependencies

- Lesson GTs complete (done)
- Understanding of search behaviour per index
- Access to bulk data for exploration

---

## Timeline

| Phase | Estimated Effort |
|-------|------------------|
| Infrastructure | 5 hours |
| Unit GTs | 2 hours |
| Thread GT | 1 hour |
| Sequence GT | 0.5 hours |
| **Total** | **~8.5 hours** |

---

## Related Documents

| Document | Purpose |
|----------|---------|
| [ground-truth-protocol-lessons.md](../../prompts/semantic-search/ground-truth-protocol-lessons.md) | Lessons pattern |
| [ground-truth-protocol-units.md](../../prompts/semantic-search/ground-truth-protocol-units.md) | Units protocol |
| [ground-truth-protocol-threads.md](../../prompts/semantic-search/ground-truth-protocol-threads.md) | Threads protocol |
| [ground-truth-protocol-sequences.md](../../prompts/semantic-search/ground-truth-protocol-sequences.md) | Sequences protocol |
| [ADR-106](/docs/architecture/architectural-decisions/106-known-answer-first-ground-truth-methodology.md) | Methodology |
