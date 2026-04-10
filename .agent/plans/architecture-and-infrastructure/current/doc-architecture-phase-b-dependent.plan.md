---
name: "Documentation Architecture Phase B: Dependent Improvements"
overview: >
  Five documentation improvements that depend on Phase A outputs: documentation
  deduplication, operability practice, trade-off navigation guidance, Practice
  Core integration, and boundary enforcement evaluation.
todos:
  - id: i3-documentation-deduplication
    content: "I3: Deduplicate development-practice.md by delegating to principles.md"
    status: pending
  - id: i6-operability-practice
    content: "I6: Create operability practice document consolidating fragmented guidance"
    status: pending
  - id: i7-trade-off-navigation
    content: "I7: Add trade-off navigation section to principles.md"
    status: pending
  - id: i8-practice-core-integration
    content: "I8: Integrate applicable concepts into Practice Core for propagation"
    status: pending
  - id: i9b-boundary-enforcement
    content: "I9b: Evaluate import-x patterns against existing oak-eslint rules"
    status: pending
  - id: validation
    content: "Run full quality gates and verify no cross-reference breakage"
    status: pending
---

# Documentation Architecture Phase B: Dependent Improvements

**Last Updated**: 2026-04-10
**Status**: Queued — blocked by Phase A completion
**Scope**: Five improvements dependent on Phase A outputs
**Parent**: [architectural-documentation-excellence-synthesis.plan.md](./architectural-documentation-excellence-synthesis.plan.md)
**Depends on**: [doc-architecture-phase-a-immediate.plan.md](./doc-architecture-phase-a-immediate.plan.md)

---

## Context

Phase A creates the foundation documents (quality attribute register, fitness
function ADR, content contract) that Phase B references. These items cannot
start until their Phase A dependencies exist.

### Foundation Alignment

> "Architectural Excellence Over Expediency — Always choose long-term
> architectural clarity over short-term convenience." — principles.md

---

## Quality Gate Strategy

Mixed work: mostly documentation, I9b may involve code (ESLint config).

```bash
# After each documentation task
pnpm markdownlint:root
pnpm practice:fitness:informational

# After I9b (if code changes)
pnpm check  # Full canonical verification
```

---

## Task I3: Documentation Deduplication

**Depends on**: I1 (quality attribute register) — provides the "why" context
that makes delegation references meaningful.

**Files to modify**:

- `docs/governance/development-practice.md`
- `.agent/directives/AGENT.md` (if duplication confirmed)

**What**: Apply ADR-117's "facts authoritative in one document" principle to
the documentation itself. Refactor `development-practice.md` to follow the
`typescript-practice.md` pattern: delegate to principles.md for shared concepts,
retain only unique elaboration.

**Specific changes**:

1. `development-practice.md` §Design Principles — replace with a reference
   to `principles.md` §Code Design. Retain only development-practice-specific
   elaboration (e.g., git workflow, PR process) that doesn't exist in principles.
2. `development-practice.md` §Error Handling — replace with a reference to
   `principles.md` §Code Design (fail fast, result pattern). Retain only
   Oak-specific error handling examples.
3. `development-practice.md` §Quality Gates — verify alignment with AGENT.md
   §Development Commands. Remove any divergent listings.
4. `AGENT.md` §Cardinal Rule — verify it references principles.md rather than
   restating. If restated, replace with reference.

**Model to follow**: `typescript-practice.md` — which correctly delegates to
rules files and ADRs, adding only TypeScript-specific elaboration.

**Onboarding safety** (from onboarding review): `development-practice.md` is
item 1 in the governance README's "5-minute reading path." If deduplication
reduces it to mostly cross-references, a newcomer's first governance document
becomes a signpost page rather than substantive reading. After deduplication,
verify it retains enough standalone substance (git workflow, PR process,
quality gate sequencing) to remain a satisfying first read. If it becomes
mostly pointers, reorder the 5-minute path to lead with a more substantive
document.

**Acceptance Criteria**:

1. `development-practice.md` references principles.md for shared concepts
2. No principle is restated in different words across layers
3. All cross-references resolve correctly
4. markdownlint passes
5. Content not lost — any unique elaboration preserved in the correct layer
6. `development-practice.md` remains substantive enough to serve as a
   satisfying first read for a new developer (not merely a reference hub)

**Deterministic Validation**:

```bash
# 1. No duplicate principle statements (spot check)
# development-practice.md should reference, not restate
grep -c "principles.md" docs/governance/development-practice.md
# Expected: >= 3 references

# 2. Markdown lint
pnpm markdownlint:root
# Expected: exit 0
```

---

## Task I6: Operability Practice

**Depends on**: I1 (quality attribute register) — operability is quality
attribute #7; the practice document elaborates on what that means.

**File**: `docs/governance/operability-practice.md` (new)

**What**: Consolidate fragmented operability guidance into a single governance
document. Define what operability means for this system.

**Content to consolidate from**:

- `docs/operations/production-debugging-runbook.md` — diagnostic procedures
- `docs/operations/environment-variables.md` — runtime configuration
- `docs/governance/logging-guidance.md` — structured logging patterns
- ADR-051 (OpenTelemetry-compliant logging) — logging architecture
- The observability future plan — strategic direction
- `docs/agent-guidance/archive/sentry-guidance.md` — archived Sentry patterns

**Content structure**:

1. What operability means for this system (SDK/MCP tools context)
2. What we monitor and why (connect to quality attribute register)
3. What triggers investigation (error patterns, performance degradation)
4. What constitutes acceptable operation
5. Links to detailed guidance (runbook, logging, env vars) — not duplication
6. Connection to the observability future plan

**Staleness protection** (from Fred review): To prevent this document from
drifting from its source documents, add it to the `/jc-consolidate-docs`
checklist — each consolidation run should verify the operability practice
still accurately reflects the linked sources. This is the fitness function
for this document's integrity.

**Acceptance Criteria**:

1. Document exists at `docs/governance/operability-practice.md`
2. References the quality attribute register
3. Links to (not duplicates) existing operational guidance
4. Added to governance README contents list
5. Consolidation checklist updated with operability-practice staleness check
6. markdownlint passes

---

## Task I7: Trade-off Navigation Guidance

**Depends on**: I1 (quality attribute register) — provides the priority
ordering referenced by the navigation guidance.

**File**: `.agent/directives/principles.md` (modify)

**What**: Add a short "Navigating Tensions" section that connects the First
Question to the quality attribute register and provides a resolution path for
principle conflicts.

**Content** (to add after §Architectural Excellence Over Expediency):

```markdown
## Navigating Tensions

The principles are intentionally absolute — they represent the quality
attributes this system values most (see the
[Quality Attribute Register](../../docs/architecture/quality-attribute-register.md)).
When two principles appear to conflict, apply the First Question: the simpler
solution that preserves both is usually correct.

When genuine tension exists:
1. The quality attribute register provides the priority ordering
2. Document the trade-off reasoning in an ADR
3. The ADR records why one quality attribute was favoured over another
   in this specific context

This is not an exception mechanism — it is a navigation tool. The principles
remain absolute; the register helps determine which absolute applies when
context creates an apparent conflict.
```

**Acceptance Criteria**:

1. Section added to principles.md after §Architectural Excellence
2. References the quality attribute register
3. Does NOT weaken the absolute stance — adds navigation, not exceptions
4. markdownlint passes
5. principles.md remains within fitness line target (450 lines)

**Deterministic Validation**:

```bash
# 1. Section exists
grep "Navigating Tensions" .agent/directives/principles.md
# Expected: match found

# 2. References QA register
grep "quality-attribute-register" .agent/directives/principles.md
# Expected: match found

# 3. Fitness check
pnpm practice:fitness:informational
# Expected: principles.md within target

# 4. Markdown lint
pnpm markdownlint:root
# Expected: exit 0
```

---

## Task I8: Practice Core Integration

**Depends on**: I1, I2, I7, I9a — all must be complete and validated.

**Files to modify**: `.agent/practice-core/practice.md` and/or
`.agent/practice-core/practice-bootstrap.md`

**What**: Identify which synthesis concepts should propagate to other repos
through the Practice Core. Add them as portable concepts (not repo-specific
paths or ADR numbers — per the Practice Core boundary contract).

**Candidates for propagation**:

1. **Quality attribute register** — template for explicit quality priorities
2. **Fitness function framing** — quality gates as architectural fitness
   functions (concept, not specific gates)
3. **Document layer content contract** — directive/rule/governance distinction
4. **Agentic socio-technical architecture** — the novel human+AI team model

**Acceptance Criteria**:

1. Portable concepts added to practice-core files (substance, not pointers)
2. No repo-specific paths, ADR numbers, or local names in portable content
3. Practice Core boundary contract maintained (self-contained, links only
   to other practice-core files and the bridge)
4. CHANGELOG.md updated
5. markdownlint passes

---

## Task I9b: Boundary Enforcement Evaluation

**Depends on**: Coordinates with quality-gate-hardening plan's ESLint config
standardisation phase (external dependency).

**What**: Evaluate `eslint-plugin-import-x` patterns from the reference
document (`.agent/reference/architecture/boundary-enforcement-with-eslint.md`)
against existing `@oaknational/eslint-plugin-standards` rules.

**Evaluation questions**:

1. Does `import-x/no-restricted-paths` (zones) offer anything beyond our
   custom workspace boundary rules?
2. Could `import-x/no-relative-parent-imports` strengthen our layer direction
   enforcement?
3. Would `import-x/no-cycle` complement `dependency-cruiser`?
4. Are there patterns we should adopt, or are our custom rules sufficient?

**Output** (from Fred review): An ADR in all cases — both "adopt" and "retain
current approach" are architecturally significant decisions worth recording.

**Acceptance Criteria**:

1. ADR produced regardless of conclusion
2. Each `import-x` pattern assessed against existing enforcement
3. Clear recommendation: adopt, partially adopt, or retain current approach
4. If adoption recommended, specific migration steps identified
5. If retention recommended, rationale explains why current rules are sufficient

---

## Related Architectural Organisation Plans

These plans reshape the workspace structure and boundaries. The boundary
enforcement evaluation (I9b) and operability practice (I6) must align with
the architectural direction they set:

- [Oak Surface Isolation](../future/oak-surface-isolation-and-generic-foundation-programme.plan.md) — separating Oak-specific surfaces from generic foundations; affects I9b boundary enforcement scope
- [Workspace Topology Exploration](../../sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md) — four-tier layered architecture model; affects I9b ESLint tier enforcement rules
- [SDK Codegen Workspace Decomposition](../codegen/future/sdk-codegen-workspace-decomposition.md) — SDK codegen restructuring; affects I6 operability scope (which services exist)

**Alignment requirement**: I9b (boundary enforcement) must evaluate `import-x`
patterns in the context of the four-tier model, not just current structure.
I6 (operability) must account for any new services the topology exploration
introduces.

---

## Validation

After all five tasks complete:

```bash
pnpm markdownlint:root
pnpm practice:fitness:informational
pnpm check  # Full canonical verification
```

---

## Documentation Propagation

Before marking complete:

1. Governance README updated (I6 added to contents)
2. Practice Core CHANGELOG updated (I8)
3. Principles.md updated within fitness limits (I7)
4. Run `/jc-consolidate-docs`

---

## Consolidation

After all work complete and gates pass, run `/jc-consolidate-docs`.
