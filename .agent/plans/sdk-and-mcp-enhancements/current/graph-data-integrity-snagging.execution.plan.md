---
name: "graph-data-integrity-snagging"
overview: "Classify and fix graph data integrity defects across bulk data handling, extraction ordering, and generator invariants while preserving MCP pass-through boundaries."
todos:
  - id: phase-0-verify-taxonomy
    content: "Phase 0 (RED): Prove each issue and lock data vs extraction vs generation vs MCP taxonomy with deterministic evidence."
    status: pending
  - id: phase-1-fix-ordering-contract
    content: "Phase 1 (GREEN): Replace unreliable thread ordering with deterministic sequencing and establish a single canonical implementation surface."
    status: pending
  - id: phase-2-enforce-invariants
    content: "Phase 2 (GREEN): Enforce dedupe and self-loop prevention invariants across thread progression, prerequisite, and nc-coverage outputs."
    status: pending
  - id: phase-3-refactor-docs
    content: "Phase 3 (REFACTOR): Complete full quality gates and documentation propagation with explicit no-change rationales where applicable."
    status: pending
---

# Graph Data Integrity Snagging Plan

**Last Updated**: 2026-03-11  
**Status**: COMPLETED  
**Scope**: Repair graph integrity defects at the `oak-sdk-codegen` boundary and preserve MCP pass-through behaviour.

---

## Context

This queued plan addresses prerequisite/thread graph anomalies seen in generated vocab artefacts and reported from `oak-preview` MCP responses.

### Issue Taxonomy (Hypothesised; verified in Phase 0)

1. **Data layer defect**: `apps/oak-search-cli/bulk-downloads/maths-secondary.json` appears to contain duplicated `sequence[].unitSlug` records.
2. **Extraction logic defect**: `thread-extractor.ts` sorts by `unit.threads[].order`, but this field appears heavily tied and may be unreliable as progression ordering.
3. **Generation invariant defect**: graph generators appear to emit duplicate unit membership, duplicate edges, and self-loops when inputs contain duplicates.
4. **MCP presentation non-defect**: MCP aggregated graph tools appear to pass through generated vocab data without introducing these defects.

### Evidence and Claims Register

| Claim | Class | Evidence Reference | Verification Status |
|---|---|---|---|
| Bulk duplicate unit records exist in `maths-secondary.json` | `behaviour-change` | Phase 0 Task 0.1 command output | unverified |
| Extractor ordering assumption is misaligned with observed thread-order signal | `behaviour-change` | Phase 0 Task 0.2 command output | unverified |
| Generated outputs violate graph invariants (duplicates/self-loops) | `behaviour-change` | Phase 0 Task 0.3 command output | unverified |
| MCP layer is pass-through and should not host data-repair logic | `api-compat` | Phase 0 Task 0.4 static boundary verification | unverified |

---

## Architecture Boundaries

### Allowed Change Surface

- Primary implementation boundary: `packages/sdks/oak-sdk-codegen/**`.
- Downstream MCP runtime (`packages/sdks/oak-curriculum-sdk/**` and MCP app packages) is read-only for this plan unless boundary tests prove a required runtime contract change.

### Bulk Data Ownership Rule

- `apps/oak-search-cli/bulk-downloads/*.json` are treated as upstream snapshot artefacts for diagnosis.
- Do not hand-edit bulk JSON inputs as part of this snagging fix; normalise at extraction/generation boundaries.

### Simplification Rule for Duplicated Trees

- Target architecture after Phase 1: a single canonical implementation surface for extraction/generation logic (`src/bulk/**`), with `vocab-gen/**` reduced to orchestration/wrapper behaviour (no duplicated business logic).

---

## Foundation Alignment

- `.agent/directives/principles.md`: keep fixes simple, fail fast, no compatibility layers.
- `.agent/directives/testing-strategy.md`: TDD at all levels with deterministic proof.
- `.agent/directives/schema-first-execution.md`: generator-first; do not patch MCP runtime to compensate for generator defects.

First question applied continuously: **Could this be simpler without compromising quality?**

---

## Non-Goals

- Add dedupe/repair logic in MCP runtime to mask generator defects.
- Introduce compatibility wrappers or fallback registries around generated graph artefacts.
- Manually curate or rewrite bulk snapshot JSON files as a primary fix path.

---

## Quality Gate Strategy

Because this work changes generation and shared artefacts, use the canonical full-chain gates (plus `vocab-gen`) after each phase.

### After Each Task

```bash
pnpm type-check
pnpm lint
pnpm test
```

### After Each Phase

```bash
pnpm clean
pnpm vocab-gen
pnpm sdk-codegen
pnpm build
pnpm doc-gen
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
```

---

## Resolution Plan

### Phase 0 (RED): Verify and lock issue taxonomy

#### Task 0.1: Prove bulk duplicate unit records

**Acceptance Criteria**

1. Duplicate `sequence[].unitSlug` records are proven directly from bulk files.
2. Evidence identifies affected file(s) and duplicate count.
3. Evidence is captured in this plan notes section without ambiguity.

**Deterministic Validation**

```bash
node <<'EOF'
const fs=require('fs');
const path=require('path');
const dir='apps/oak-search-cli/bulk-downloads';
const files=fs.readdirSync(dir).filter((f)=>f.endsWith('.json')&&f!=='schema.json'&&f!=='manifest.json');
const out=[];
for(const file of files){
  const data=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));
  const counts=new Map();
  for(const unit of data.sequence||[]) counts.set(unit.unitSlug,(counts.get(unit.unitSlug)||0)+1);
  const dups=[...counts.entries()].filter(([,n])=>n>1);
  if(dups.length) out.push({file,duplicateUnitSlugs:dups});
}
console.log(JSON.stringify(out,null,2));
EOF
```

**Expected**: output lists the affected file(s) and duplicate slugs; currently expected to include `maths-secondary.json`.

#### Task 0.2: Prove extractor ordering assumption mismatch

**Acceptance Criteria**

1. Current extractor ordering rule is identified in canonical and wrapper surfaces.
2. Data evidence shows tie-heavy `thread.order` values that cannot deterministically encode progression.

**Deterministic Validation**

```bash
rg "sort\\(\\(a, b\\) => a\\.order - b\\.order\\)" packages/sdks/oak-sdk-codegen/src/bulk/extractors/thread-extractor.ts packages/sdks/oak-sdk-codegen/vocab-gen/extractors/thread-extractor.ts
node <<'EOF'
const fs=require('fs');
const data=JSON.parse(fs.readFileSync('apps/oak-search-cli/bulk-downloads/maths-secondary.json','utf8'));
const byThread=new Map();
for(const unit of data.sequence){ for(const t of unit.threads||[]){ if(!byThread.has(t.slug)) byThread.set(t.slug,[]); byThread.get(t.slug).push(t.order);} }
let tied=0,total=0;
for(const [,orders] of byThread){ total++; if(new Set(orders).size===1 && orders.length>1) tied++; }
console.log(JSON.stringify({threads:total,allEntriesShareSingleOrderValue:tied},null,2));
EOF
```

**Expected**: extractor sort calls found; tie summary is non-trivial.

#### Task 0.3: Prove generation-layer invariant violations using typed graph exports

**Acceptance Criteria**

1. Duplicate units in thread outputs are quantified via exported graph data.
2. Prerequisite self-loops and duplicate edges are quantified via exported graph data.
3. Node payload duplication and nc-coverage blast radius are evidenced.

**Deterministic Validation**

```bash
pnpm tsx <<'EOF'
import { threadProgressionGraph, prerequisiteGraph, ncCoverageGraph } from './packages/sdks/oak-sdk-codegen/src/generated/vocab/index.ts';
let threadsWithDup=0;
for (const thread of threadProgressionGraph.threads) {
  const set=new Set(thread.units);
  if (set.size !== thread.units.length) threadsWithDup++;
}
const seen=new Set<string>();
let selfLoops=0;
let duplicateEdges=0;
for (const edge of prerequisiteGraph.edges) {
  if (edge.source !== 'thread') continue;
  if (edge.from === edge.to) selfLoops++;
  const key=`${edge.from}->${edge.to}`;
  if (seen.has(key)) duplicateEdges++;
  else seen.add(key);
}
let dupThreadSlugNodes=0;
let dupPriorKnowledgeNodes=0;
for (const node of prerequisiteGraph.nodes) {
  if (new Set(node.threadSlugs).size !== node.threadSlugs.length) dupThreadSlugNodes++;
  if (new Set(node.priorKnowledge).size !== node.priorKnowledge.length) dupPriorKnowledgeNodes++;
}
const ncCount = ncCoverageGraph.nodes.filter((node)=>node.unitSlug==='algebraic-manipulation').length;
console.log(JSON.stringify({threadsWithDup,selfLoops,duplicateEdges,dupThreadSlugNodes,dupPriorKnowledgeNodes,ncCoverageAlgebraicManipulationNodes:ncCount},null,2));
EOF
```

**Expected**: currently non-zero values for invariant violations.

#### Task 0.4: Verify MCP pass-through boundary

**Acceptance Criteria**

1. Aggregated MCP graph tools are confirmed as pass-through consumers of generated data.
2. No generator-repair logic exists in MCP runtime.

**Deterministic Validation**

```bash
rg "from '@oaknational/sdk-codegen/vocab-data'" packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prerequisite-graph.ts
rg "dedupe|selfLoop|normali" packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prerequisite-graph.ts
```

**Expected**: direct imports from sdk-codegen vocab data; no repair logic.

---

### Phase 1 (GREEN): Fix extraction ordering contract and simplify ownership

#### Task 1.1: Implement deterministic progression ordering rule in canonical surface

**Acceptance Criteria**

1. Canonical extractor ordering no longer relies solely on tied `thread.order`.
2. Ordering is deterministic for equivalent inputs.
3. RED tests fail first, then pass after implementation.

#### Task 1.2: Reduce duplicate logic by making `src/bulk/**` canonical

**Acceptance Criteria**

1. Behavioural logic lives in one canonical surface (`src/bulk/**`).
2. `vocab-gen/**` uses canonical logic via imports/wrappers (no duplicated core logic).
3. Behavioural equivalence is proven by tests, not by text search.

**Deterministic Validation**

```bash
pnpm vitest run packages/sdks/oak-sdk-codegen/src/bulk/extractors/thread-extractor.unit.test.ts
pnpm vitest run packages/sdks/oak-sdk-codegen/vocab-gen/extractors/thread-extractor.unit.test.ts
```

**Expected**: both pass with shared behaviour.

---

### Phase 2 (GREEN): Enforce graph invariants

#### Task 2.1 (RED/GREEN): Dedupe unit membership in thread outputs

#### Task 2.2 (RED/GREEN): Remove self-loop prerequisite edges

#### Task 2.3 (RED/GREEN): Remove duplicate prerequisite edges

#### Task 2.4 (RED/GREEN): Dedupe node payload arrays (`priorKnowledge`, `threadSlugs`)

#### Task 2.5 (RED/GREEN or documented defer): Handle nc-coverage repeated unit-derived entries

**Acceptance Criteria**

1. No thread includes repeated `unitSlug`.
2. No prerequisite edge has `from === to`.
3. No duplicate thread-derived prerequisite edge exists.
4. Node payload arrays contain unique values.
5. nc-coverage decision is explicit with evidence (`fixed` or `deferred-with-rationale`).

**Deterministic Validation**

- Re-run Phase 0.3 typed graph-export checks.
- All invariant counters are zero or match explicit defer rationale.

---

### Phase 3 (REFACTOR): Documentation and closure

#### Task 3.1: Documentation propagation (with per-phase no-change rationale if unchanged)

**Required surfaces**

1. `docs/domain/DATA-VARIANCES.md` (clarify lesson-level known variance vs unit-level duplication impact).
2. `docs/architecture/architectural-decisions/086-vocab-gen-graph-export-pattern.md` (update or explicit no-change rationale if generator contract unchanged).
3. `.agent/plans/sdk-and-mcp-enhancements/current/README.md` (queued plan discoverability).
4. `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md` and `.agent/practice-core/practice.md` (explicit no-change rationale unless practice/governance changed).

Also run `.cursor/commands/jc-consolidate-docs.md` before closure.

#### Task 3.2: Final quality gates

- Run the full "After Each Phase" gate sequence above.

**Acceptance Criteria**

1. All gates pass.
2. Evidence-and-claims entries are updated to `verified` or explicit follow-up status.
3. MCP pass-through behaviour remains unchanged and reflects corrected generated data.

---

## Risks and Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Duplicate logic diverges between `src/bulk` and `vocab-gen` | Medium | High | Canonicalise behavioural logic in `src/bulk`; wrappers only in `vocab-gen` |
| Masking defects in MCP layer | Low | High | Keep all repair in sdk-codegen extraction/generation |
| Ordering rule remains non-deterministic | Medium | High | Determinism tests with tied orders and input permutation |
| Scope creep stalls snagging | Medium | Medium | Explicit defer rationale for non-critical blast-radius items |

---

## Success Criteria

1. Every reported anomaly is classified with explicit claim class and evidence.
2. Generated graph artefacts no longer contain duplicate-unit thread progressions, prerequisite self-loops, or duplicate prerequisite edges.
3. Canonical ownership is simplified to one behavioural implementation surface.
4. Documentation propagation is complete with explicit no-change rationales where applicable.
