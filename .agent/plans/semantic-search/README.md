# Semantic Search Planning Documents

**Status**: Phase 1 Complete | Ready for Search Quality Evaluation  
**Last Updated**: 2025-12-10

---

## Quick Start

For new implementation sessions, read in this order:

1. **Foundation Documents** (MUST READ FIRST)
   - `.agent/directives-and-memory/rules.md` - TDD, quality gates, no type shortcuts
   - `.agent/directives-and-memory/schema-first-execution.md` - All types from field definitions
   - `.agent/directives-and-memory/testing-strategy.md` - Test types and TDD approach

2. **Requirements & Context** - `requirements.md`
   - Strategic goals and business success criteria
   - Risk mitigation strategies
   - Cost model (spoiler: $0/month for AI/ML features)
   - Demo scenarios for validation
   - Common issues and solutions
   - ADR requirements per phase

3. **Entry Point** - `.agent/prompts/semantic-search/semantic-search.prompt.md`
   - Current state summary
   - Phase status and next steps
   - Quick reference for commands and file locations

---

## Current Status

### Data Completeness ✅ VERIFIED (2025-12-10)

| Index             | Count   | Status |
| ----------------- | ------- | ------ |
| `oak_lessons`     | **314** | ✅     |
| `oak_units`       | 36      | ✅     |
| `oak_unit_rollup` | 244     | ✅     |
| `oak_threads`     | 201     | ✅     |
| `oak_sequences`   | 2       | ✅     |

All 36 Maths KS4 units have their lessons indexed.

### Ground Truth ✅ FIXED (2025-12-10)

Ground truth expectations based on **upstream Oak API content**:

- Pythagoras queries expect Pythagoras lessons from `right-angled-trigonometry` unit
- Trigonometry queries expect trig lessons (sine, cosine, tangent ratios)
- Methodology documented in `ground-truth.ts`

---

## Document Structure

```
.agent/plans/semantic-search/
├── README.md                      # This file - navigation hub
├── requirements.md                # Strategic context, risks, costs, demos
├── phase-1-foundation.md          # ✅ Complete - two-way hybrid
├── phase-2-dense-vectors.md       # ⏸️ If needed - three-way evaluation
├── phase-3-plus-roadmap.md        # 📋 Future - NER, RAG, knowledge graph
├── reference/                     # Reference documentation
│   ├── reference-data-completeness-policy.md
│   ├── reference-es-serverless-feature-matrix.md
│   └── reference-ir-metrics-guide.md
└── archive/                       # Superseded documents
    ├── maths-ks4-implementation-plan.md  # Original 3000-line plan
    └── search-ui-plan.md                 # UI plan (deferred, see requirements.md)
```

---

## Phase Documents

| Document                     | Status | Purpose                                         |
| ---------------------------- | ------ | ----------------------------------------------- |
| **requirements.md**          | ✅     | Strategic context, risks, costs, demo scenarios |
| **phase-1-foundation.md**    | ✅     | Two-way hybrid search, data ingestion           |
| **phase-2-dense-vectors.md** | ⏸️     | Three-way evaluation (if Phase 1 insufficient)  |
| **phase-3-plus-roadmap.md**  | 📋     | NER, RAG, knowledge graph, LTR                  |

### Reference Documents

| Document                                      | Purpose                               |
| --------------------------------------------- | ------------------------------------- |
| **reference-data-completeness-policy.md**     | Policy on what data to upload in full |
| **reference-es-serverless-feature-matrix.md** | Feature adoption tracking             |
| **reference-ir-metrics-guide.md**             | IR metrics (MRR, NDCG) explained      |

### Archived Documents

| Document                             | Reason for Archive                     |
| ------------------------------------ | -------------------------------------- |
| **maths-ks4-implementation-plan.md** | Superseded - content now in phase docs |
| **search-ui-plan.md**                | Outdated (November 2025)               |

---

## Next Steps

1. **Run smoke tests** to establish baseline metrics:

   ```bash
   cd apps/oak-open-curriculum-semantic-search
   pnpm dev  # Start server in one terminal
   pnpm test:smoke  # Run benchmarks in another
   ```

2. **Decision Point**:
   - **If targets met** (MRR > 0.70, NDCG@10 > 0.75): Stay with Phase 1
   - **If targets not met**: Proceed to Phase 2

---

## Quality Gates

Run after every piece of work, from repo root:

```bash
pnpm type-gen          # Generate types from schema
pnpm build             # Build all workspaces
pnpm type-check        # TypeScript validation
pnpm lint:fix          # Auto-fix linting
pnpm format:root       # Format root files
pnpm markdownlint:root # Markdown lint
pnpm test              # Unit and integration tests
pnpm test:e2e          # E2E tests
pnpm test:e2e:built    # E2E on built artifacts
pnpm test:ui           # Playwright UI tests
pnpm smoke:dev:stub    # Smoke tests
```

All gates must pass. No exceptions.

---

## Key File Locations

### Ground Truth and Metrics

```
apps/oak-open-curriculum-semantic-search/src/lib/search-quality/
├── ground-truth.ts     # Query expectations (FIXED 2025-12-10)
├── metrics.ts          # MRR, NDCG calculations
└── index.ts            # Public exports
```

### Smoke Tests

```
apps/oak-open-curriculum-semantic-search/smoke-tests/
└── search-quality.smoke.test.ts  # Benchmark test suite
```

### RRF Query Builders

```
apps/oak-open-curriculum-semantic-search/src/lib/hybrid-search/
├── rrf-query-builders.ts           # Two-way (BM25 + ELSER)
├── rrf-query-builders-three-way.ts # Three-way (Phase 2)
└── rrf-query-helpers.ts            # Shared helpers
```

---

## Getting Help

1. **Re-read foundation documents** - rules.md, schema-first, testing-strategy
2. **Check the prompt** - semantic-search.prompt.md has current state
3. **Review phase docs** - phase-1, phase-2, phase-3+
4. **Check ADRs** - Previous decisions in `docs/architecture/architectural-decisions/`

---

**Ready to start?** Read `.agent/prompts/semantic-search/semantic-search.prompt.md`
