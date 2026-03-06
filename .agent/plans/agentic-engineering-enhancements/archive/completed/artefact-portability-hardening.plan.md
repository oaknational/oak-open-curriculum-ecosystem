---
name: "Artefact Portability Hardening"
overview: "Address architectural review findings from Betty, Wilma, Fred, and Barney: define trigger content contract, build portability-wide validation, fix rule trigger compliance, resolve naming and documentation gaps."
todos:
  - id: phase-0-audit
    content: "Phase 0: Audit current state — verify .mdc content patterns, command counts, link integrity, and ADR cross-references"
    status: complete
  - id: phase-1-contracts
    content: "Phase 1: ADR and contract updates — add trigger content contract to ADR-125, add ADR-114 forward reference, fix naming inconsistency, document agent comprehension failure modes"
    status: complete
  - id: phase-2-trigger-compliance
    content: "Phase 2: Bring 9 Pattern B .mdc rule triggers into compliance with the new trigger content contract; create 6 Claude Code path-scoped rules"
    status: complete
  - id: phase-3-validation
    content: "Phase 3: Build validate-portability script covering commands, skills, rules, and classification — extend the sub-agent validation pattern"
    status: complete
  - id: phase-4-cleanup
    content: "Phase 4: Fix platform leakage in canonical content, resolve experience command gap, acknowledge plugin namespace in ADR-125"
    status: complete
  - id: phase-5-skill-taxonomy
    content: "Phase 5: Skill taxonomy — add classification frontmatter to ADR-125 and all SKILL.md files"
    status: complete
  - id: phase-6-new-skills
    content: "Phase 6: Create 5 new passive skills (systematic-debugging, receiving-code-review, finishing-branch, worktrees, parallel-agents)"
    status: complete
  - id: phase-7-plan-templates
    content: "Phase 7: Add plan templates to ADR-125 artefact taxonomy"
    status: complete
  - id: phase-8-context-optimisation
    content: "Phase 8: AGENT.md context optimisation — extract artefact tables to artefact-inventory.md"
    status: complete
  - id: phase-9-documentation-sync
    content: "Phase 9: Documentation sync — update counts, verify entry-point chains, run consolidation"
    status: complete
---

# Artefact Portability Hardening

**Last Updated**: 2026-03-05
**Status**: 🟢 COMPLETE (All phases 0–9 done)
**Scope**: Address all critical and important findings from the four-reviewer architectural review of ADR-125 and the agent artefact portability system.
**Parent**: [ADR-125 (Agent Artefact Portability)](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)
**Predecessor**: [ADR-125 (Agent Artefact Portability)](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md)

---

## Context

The agent artefact portability system (ADR-125) was implemented across four platforms (Cursor, Claude Code, Gemini CLI, Codex) for skills, commands, rules, and sub-agents. A four-reviewer architectural review identified structural compliance gaps:

### Issue 1: Rule triggers have no content contract (Fred C1, Barney C1)

ADR-125 correctly identifies `.mdc` triggers as a separate artefact type from thin wrappers but provides no contract for what a trigger should contain. The result: 7 of 17 `.mdc` files contain full substantive content (20-30 lines each) duplicating canonical sources like `rules.md`, `testing-strategy.md`, and various ADRs. Only 5 are pointer-only.

**Evidence**: `tdd-at-all-levels.mdc` (30 lines of TDD cycle), `cardinal-rule-types-from-schema.mdc` (22 lines of the 10-point Type Flow Discipline), `never-disable-checks.mdc` (21 lines, no canonical pointer at all).

**Root Cause**: ADR-125 defines what triggers ARE but not what they should CONTAIN. Phase 3 of the original plan marked these as "already correct" because they activate the right policies — but the content duplication within the trigger files themselves was not audited.

### Issue 2: No automated validation for commands, skills, or rules (Wilma C1, Barney C2)

Only sub-agents have `scripts/validate-subagents.mjs`. A broken pointer in a command wrapper (e.g., referencing a deleted canonical file) fails silently with no CI detection.

**Evidence**: `pnpm subagents:check` runs validation only for `.cursor/agents/` ↔ `.agent/sub-agents/templates/`. No equivalent exists for commands, skills, or rules.

**Root Cause**: The sub-agent validation was implemented as part of ADR-114 work. The ADR-125 execution plan intended to create validation but didn't include it as an explicit deliverable.

### Issue 3: Documentation and naming gaps (Fred I2-I5, Wilma C3)

- ADR-114 has no forward reference to ADR-125
- `quality-gates` canonical → `jc-gates` adapter breaks 1:1 naming correspondence
- `experience` command exists canonically but has no platform adapters (undocumented gap)
- Plugin-installed skills (Clerk) coexist in `.cursor/skills/` without ADR acknowledgement
- "Task tool" reference in canonical `start-right.md` is platform-specific leakage
- Agent comprehension failure (wrapper says "Read X" but agent doesn't) is undocumented

---

## Quality Gate Strategy

This plan modifies documentation, configuration, and validation scripts — not product code. Quality gates focus on structural integrity.

### After Each Task

```bash
pnpm markdownlint-check:root   # Markdown structure
pnpm subagents:check            # Sub-agent validation (existing)
```

### After Each Phase

```bash
pnpm markdownlint-check:root
pnpm subagents:check
node scripts/validate-portability.mjs  # Created in Phase 3
```

---

## Solution Architecture

### Key Insight

The sub-agent validation script (`scripts/validate-subagents.mjs`) already solves the "canonical ↔ wrapper integrity" problem for one artefact type. Generalising this pattern to commands, skills, and rules eliminates the drift risk identified by all four reviewers without inventing new infrastructure.

This exemplifies the first question from rules.md: **"Could it be simpler?"**

Answer: YES — reuse the existing validation pattern rather than building a separate system.

### Strategy

1. Define what triggers should contain (contract), then bring triggers into compliance
2. Extend the proven validation pattern to all artefact types
3. Fix documentation gaps and naming inconsistencies

**Non-Goals** (YAGNI):

- ❌ Generating adapters from a manifest (Betty/Wilma suggestion — valuable but separate plan)
- ❌ Hooks portability (tracked in `future/hooks-portability.plan.md`)
- ❌ Modifying product code or SDK workspaces
- ✅ Making the existing system fully self-consistent and self-validating

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/rules.md` — Core principles
2. **Re-read** `.agent/directives/testing-strategy.md` — Testing philosophy
3. **Re-read** `.agent/directives/schema-first-execution.md` — Type generation flow
4. **Ask**: "Does this deliver system-level value, not just fix the immediate issue?"
5. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Documentation Propagation Commitment

Before marking a phase complete:

1. Update ADR-125 if impacted
2. Update ADR-114 if impacted
3. Update `.agent/practice-core/practice.md` if impacted
4. Update `.agent/directives/AGENT.md` if impacted
5. Apply `.cursor/commands/jc-consolidate-docs.md` to ensure settled documentation is not trapped in plans

If no update is needed for a required surface, record an explicit no-change rationale.

---

## Resolution Plan

### Phase 0: Audit Current State

**Foundation Check-In**: Re-read ADR-125 §"Rules: Policies vs Activation Triggers" and §"The Thin Wrapper Contract".

#### Task 0.1: Classify all 17 `.mdc` rule triggers

Categorise each `.mdc` file as Pattern A (pointer-only) or Pattern B (substantive content). Record line count, canonical source (if any), and whether it currently has a pointer.

**Acceptance Criteria**:

1. ✅ All 17 `.mdc` files classified with line count and pattern designation
2. ✅ Each Pattern B file has its canonical source identified
3. ✅ Discrepancies between the ADR-125 §Phase 3 claims and actual state are documented

**Deterministic Validation**:

```bash
# Count .mdc files
ls .cursor/rules/*.mdc | wc -l
# Expected: 17

# For each, check if it references a canonical source
for f in .cursor/rules/*.mdc; do
  echo "=== $(basename $f) ==="
  wc -l < "$f"
  grep -c '.agent/' "$f" || echo "NO CANONICAL REFERENCE"
done
```

#### Task 0.2: Verify command inventory

Confirm exact counts: canonical active, canonical experiments, platform adapters per platform.

**Acceptance Criteria**:

1. ✅ Canonical command count verified (active vs experiment vs superseded)
2. ✅ Per-platform adapter count verified (Cursor, Claude, Gemini, Codex)
3. ✅ Any count discrepancy with ADR-125 documented

**Deterministic Validation**:

```bash
ls .agent/commands/*.md | wc -l                    # Active canonical
ls .agent/commands/experiments/*.md | wc -l         # Experiments
ls .cursor/commands/jc-*.md | wc -l                 # Cursor adapters
ls .claude/commands/jc-*.md | wc -l                 # Claude adapters
ls .gemini/commands/jc-*.toml | wc -l               # Gemini adapters
ls .agents/skills/jc-*/SKILL.md | wc -l             # Codex adapters
```

#### Task 0.3: Check link integrity

Verify that every wrapper references an existing canonical file.

**Acceptance Criteria**:

1. ✅ Every command wrapper references an existing `.agent/commands/*.md`
2. ✅ Every skill wrapper references an existing `.agent/skills/*/SKILL.md`
3. ✅ Every `.mdc` trigger references an existing canonical file (where it has a pointer)
4. ✅ Broken links documented

**Task Complete When**: Full audit spreadsheet of current state exists, all discrepancies documented.

---

### Phase 1: ADR and Contract Updates

**Foundation Check-In**: Re-read `rules.md` §"Define types well and define them ONCE".

#### Task 1.1: Add trigger content contract to ADR-125

Add a new subsection under "Rules: Policies vs Activation Triggers" defining what trigger files should contain.

**Contract**:

- A trigger MUST include `alwaysApply`/`globs`/`description` frontmatter (activation metadata)
- A trigger MUST include a reference to its canonical source (`.agent/directives/*.md`, `.agent/skills/*/SKILL.md`, or an ADR)
- A trigger MAY include a concise summary (max 5 lines) for immediate LLM context
- A trigger MUST NOT contain the full canonical policy — the canonical source is authoritative
- If trigger content exceeds 10 lines (excluding frontmatter), it should be reviewed for extraction

**Acceptance Criteria**:

1. ✅ ADR-125 §"Rules: Policies vs Activation Triggers" includes the trigger content contract
2. ✅ Contract distinguishes between frontmatter, pointer, optional summary, and prohibited duplication
3. ✅ Contract specifies the 10-line review threshold

#### Task 1.2: Add forward reference from ADR-114 to ADR-125

Add `[ADR-125 (Agent Artefact Portability)](125-agent-artefact-portability.md)` to ADR-114's Related field, with a brief note that ADR-125 extends the model to all artefact types.

**Acceptance Criteria**:

1. ✅ ADR-114 Related field includes ADR-125 reference
2. ✅ Brief note added (one sentence, not a structural change)

#### Task 1.3: Fix `quality-gates` / `jc-gates` naming inconsistency

Decide: rename the canonical file to `gates.md` (matching the adapter name) or rename all adapters to `jc-quality-gates` (matching the canonical name). Whichever direction, achieve 1:1 naming.

**Acceptance Criteria**:

1. ✅ Canonical filename and adapter filenames correspond 1:1
2. ✅ ADR-125 command table updated if filenames changed
3. ✅ No broken cross-references after rename

#### Task 1.4: Document agent comprehension failure modes

Add a "Known Limitations" section to ADR-125 documenting the risk that agents may not follow "Read and follow X" instructions, with recommended mitigations.

**Acceptance Criteria**:

1. ✅ Known limitation documented in ADR-125 §Consequences or a new §Limitations section
2. ✅ Practical mitigations listed (Cursor `@` injection, minimal fallback in wrappers, guards in canonical content)

**Phase 1 Complete Validation**:

```bash
pnpm markdownlint-check:root  # Expected: exit 0
```

---

### Phase 2: Rule Trigger Compliance

**Foundation Check-In**: Re-read the trigger content contract added in Phase 1.

For each of the 7 Pattern B `.mdc` files, reduce to: frontmatter + pointer + optional 5-line summary. The substantive content already exists in the canonical source.

#### Task 2.1: Identify and fix Pattern B triggers

**Files to update** (from Fred's audit):

| File | Substantive lines | Canonical source |
|------|------------------|------------------|
| `cardinal-rule-types-from-schema.mdc` | 22 | `.agent/directives/rules.md` §Cardinal Rule, `.agent/directives/schema-first-execution.md` |
| `tdd-at-all-levels.mdc` | 30 | `.agent/directives/testing-strategy.md` |
| `never-disable-checks.mdc` | 21 | `.agent/directives/rules.md` §Never Disable Checks |
| `generator-first-mindset.mdc` | 28 | `.agent/directives/schema-first-execution.md` |
| `use-result-pattern.mdc` | 26 | ADR-088 |
| `no-global-state-in-tests.mdc` | 24 | ADR-078 |
| `no-skipped-tests.mdc` | 23 | `.agent/directives/rules.md` |

**For each file**:

1. Preserve the `---` frontmatter block unchanged (activation metadata)
2. Replace substantive content with: pointer to canonical source + optional 5-line summary
3. Verify the canonical source actually contains the policy being activated

**Acceptance Criteria**:

1. ✅ All 7 Pattern B files reduced to ≤ 10 content lines (excluding frontmatter)
2. ✅ Each file includes a pointer to its canonical source
3. ✅ Canonical sources verified to contain the policy content being removed from triggers
4. ✅ No policy content exists only in a trigger (i.e., nothing is lost)

**Deterministic Validation**:

```bash
# Verify all .mdc files are within content budget
for f in .cursor/rules/*.mdc; do
  lines=$(sed '1,/^---$/d' "$f" | sed '/^---$/,$ d; /^$/d' | wc -l)
  echo "$(basename $f): $lines content lines"
done
# Expected: all ≤ 10

# Verify all .mdc files reference a canonical source
for f in .cursor/rules/*.mdc; do
  if ! grep -q '.agent/' "$f"; then
    echo "MISSING POINTER: $(basename $f)"
  fi
done
# Expected: no output (all have pointers)
```

**Phase 2 Complete Validation**:

```bash
pnpm markdownlint-check:root  # Expected: exit 0
```

---

### Phase 3: Validation Tooling

**Foundation Check-In**: Re-read `scripts/validate-subagents.mjs` — the pattern to replicate.

#### Task 3.1: Create `scripts/validate-portability.mjs`

Build a validation script that checks structural integrity for commands, skills, and rules across all platforms. Model on `validate-subagents.mjs`.

**Checks to implement**:

1. **Commands**: Every `.cursor/commands/jc-*.md` → verify matching `.agent/commands/*.md` exists. Repeat for `.claude/commands/`, `.gemini/commands/`, `.agents/skills/jc-*/`.
2. **Skills**: Every `.cursor/skills/*/SKILL.md` → verify matching `.agent/skills/*/SKILL.md` exists. Repeat for `.agents/skills/` (non-`jc-` prefixed).
3. **Rules**: Every `.cursor/rules/*.mdc` → verify it contains a reference to an existing `.agent/` path.
4. **Orphan detection**: Every `.agent/commands/*.md` (active) → verify at least one platform adapter exists. Same for `.agent/skills/*/SKILL.md`.
5. **Cross-platform consistency**: Same number of command adapters on each platform (currently 9 each).

**Acceptance Criteria**:

1. ✅ Script passes on current repo state (after Phase 2 fixes)
2. ✅ Script fails when a canonical file is missing (tested by temporarily renaming one)
3. ✅ Script fails when a wrapper references a non-existent canonical file
4. ✅ Script detects orphaned canonical files with no adapters
5. ✅ Script reports clearly which files are in violation

#### Task 3.2: Wire into quality gates

Add `validate-portability` to `package.json` scripts and ensure it runs as part of `pnpm make` / `pnpm qg`.

**Acceptance Criteria**:

1. ✅ `pnpm portability:check` (or equivalent) runs the validation
2. ✅ Validation is included in the quality gate sequence
3. ✅ CI will fail if portability invariants are violated

**Deterministic Validation**:

```bash
node scripts/validate-portability.mjs  # Expected: exit 0 with pass message
```

**Phase 3 Complete Validation**:

```bash
pnpm markdownlint-check:root
pnpm subagents:check
node scripts/validate-portability.mjs
```

---

### Phase 4: Cleanup and Documentation

**Foundation Check-In**: Re-read all three foundation documents.

#### Task 4.1: Fix platform leakage in canonical content

Replace "Task tool snippets" in `.agent/skills/start-right-quick/shared/start-right.md` with platform-neutral language (e.g., "invocation snippets" or "platform-specific invocation examples").

**Acceptance Criteria**:

1. ✅ No Cursor-specific tool names in any `.agent/skills/` or `.agent/commands/` file
2. ✅ Grep for "Task tool" in `.agent/` returns zero matches (excluding plan files)

#### Task 4.2: Resolve `experience` command gap

The canonical `experience.md` has no platform adapters. Document this explicitly: either mark it as superseded by `consolidate-docs` in ADR-125 (removing from active count) or create adapters.

**Acceptance Criteria**:

1. ✅ `experience.md` status is explicitly documented
2. ✅ ADR-125 command counts are accurate after resolution
3. ✅ `validate-portability.mjs` passes after resolution

#### Task 4.3: Acknowledge plugin namespace in ADR-125

Add a brief note to ADR-125 §Trade-offs acknowledging that platform directories (`.cursor/skills/`, `.agents/skills/`) may contain externally installed content alongside canonical wrappers.

**Acceptance Criteria**:

1. ✅ ADR-125 acknowledges plugin content coexistence
2. ✅ `validate-portability.mjs` correctly ignores plugin-installed content

#### Task 4.4: Foundation compliance checklist

- [ ] **rules.md**: No type shortcuts, no disabled checks, no compatibility layers
- [ ] **ADR-125**: All sections accurate and self-consistent after updates
- [ ] **ADR-114**: Forward reference added, no other changes needed
- [ ] **AGENT.md**: Artefact tables accurate after command count changes
- [ ] **practice.md**: No update needed (already reflects multi-platform architecture)
- [ ] Quality gates all pass

**Phase 4 Complete Validation**:

```bash
pnpm markdownlint-check:root
pnpm subagents:check
node scripts/validate-portability.mjs
```

---

### Phase 5: Skill Taxonomy ✅

Added `classification: active | passive` to ADR-125 Skills Structure Contract (rule 9). Updated Layer 1 table to show active/passive split. Added `classification` frontmatter to all 7 existing canonical SKILL.md files.

---

### Phase 6: New Passive Skills ✅

Created 5 new passive skills with canonical content and platform adapters (Cursor + Codex):

- `systematic-debugging` — structured debugging workflow
- `receiving-code-review` — processing review feedback
- `finishing-branch` — branch completion checklist
- `worktrees` — git worktree guidance
- `parallel-agents` — safe parallel sub-agent dispatch

Total skills: 12 (2 active, 10 passive).

---

### Phase 7: Plan Templates in Taxonomy ✅

Added plan templates row to ADR-125 Layer 1 table. Added Plan Template Contract section defining location, frontmatter, no-adapters, and lifecycle rules.

---

### Phase 8: AGENT.md Context Optimisation ✅

Extracted artefact inventory tables (Layer 1 + Layer 2) from AGENT.md to `.agent/directives/artefact-inventory.md`. AGENT.md reduced from 177 to 151 lines (26-line saving). Updated stale counts (was "7 skills" and "13 commands", now accurate in extracted file).

---

### Phase 9: Documentation Sync

- [ ] Verify entry-point chains resolve (CLAUDE.md → AGENT.md → rules.md, AGENT.md → artefact-inventory.md)
- [ ] Run `/jc-consolidate-docs` (includes non-repo plan check and platform-specific memory scan per updated workflow)
- [ ] Full quality gate pass

**Consolidation workflow update**: The `consolidate-docs.md` command now includes:

- Step 1 addition: check platform-specific plan locations (e.g., `~/.claude/plans/`) for non-repo plans with valuable content
- Step 3 addition: check platform-specific memory locations (e.g., `~/.claude/projects/<project>/memory/`) as additional distillation sources alongside the canonical napkin

---

## Success Criteria

### Phase 0 (Audit)

- ✅ Complete classification of all 17 `.mdc` files
- ✅ Exact command inventory with discrepancy documentation

### Phase 1 (Contracts)

- ✅ ADR-125 defines trigger content contract
- ✅ ADR-114 ↔ ADR-125 cross-reference is bidirectional
- ✅ Naming inconsistency resolved

### Phase 2 (Trigger Compliance)

- ✅ All 17 `.mdc` files comply with the trigger content contract
- ✅ No policy content exists only in a trigger file

### Phase 3 (Validation)

- ✅ `validate-portability.mjs` catches broken links, missing adapters, orphaned canonical files
- ✅ Validation is wired into quality gates

### Phase 4 (Cleanup)

- ✅ No platform-specific language in canonical content
- ✅ All command/ADR counts are accurate
- ✅ Full quality gate pass

### Phase 5 (Skill Taxonomy)

- ✅ All SKILL.md files have `classification` frontmatter
- ✅ ADR-125 Skills Structure Contract includes rule 9

### Phase 6 (New Skills)

- ✅ 5 new passive skills created with canonical + platform adapters
- ✅ Total skill count: 12 (2 active, 10 passive)

### Phase 7 (Plan Templates)

- ✅ Plan templates appear in ADR-125 Layer 1 table
- ✅ Plan Template Contract section added

### Phase 8 (Context Optimisation)

- ✅ AGENT.md under 155 lines
- ✅ Artefact inventory extracted to referenced document

### Phase 9 (Documentation Sync)

- ✅ All counts accurate across AGENT.md, artefact-inventory.md, and ADR-125
- ✅ Entry-point chains resolve correctly
- ✅ Quality gates pass

### Overall

- ✅ The portability system is fully self-consistent
- ✅ Structural drift is detectable by CI
- ✅ All four reviewers' critical and important findings addressed
- ✅ Skills classified as active/passive with 5 new passive skills
- ✅ Plan templates recognised in the artefact taxonomy
- ✅ AGENT.md context consumption reduced

---

## Dependencies

**Blocking**: None — this plan operates on documentation, configuration, and scripts only.

**Related Plans**:

- [ADR-125 (Agent Artefact Portability)](../../../../docs/architecture/architectural-decisions/125-agent-artefact-portability.md) — predecessor
- [Hooks Portability (future)](../future/hooks-portability.plan.md) — extends the same model to hooks
- [DevX Strictness Convergence](../../developer-experience/active/devx-strictness-convergence.plan.md) — ESLint work, separate concern

**Prerequisites**:

- ✅ ADR-125 exists and is accepted
- ✅ Three-layer model implemented across all four platforms
- ✅ `validate-subagents.mjs` exists as the pattern to replicate

---

## Notes

### Why This Matters (System-Level Thinking)

**Immediate Value**:

- **Consistency**: 7 rule triggers stop duplicating canonical policy content
- **Safety**: Broken wrapper links detected before they cause agent failures
- **Accuracy**: ADR counts and cross-references reflect reality

**System-Level Impact**:

- **Drift prevention**: Automated validation catches structural regression
- **Onboarding**: New contributors see a self-consistent, self-documenting system
- **Trust**: The portability system validates its own invariants, not just sub-agents
- **Evolution**: When hooks or a fifth platform are added, validation covers them too

**Risk of Not Doing**:

- **Silent drift**: Pattern B triggers diverge from canonical sources over time
- **Broken links**: Renamed canonical files break wrappers with no detection
- **Misleading ADR**: Counts and claims in ADR-125 become stale
- **Agent failures**: Agents follow broken "Read and follow X" pointers

---

## Review Provenance

This plan addresses findings from four architectural reviewers:

| Reviewer | Focus | Key findings addressed |
|----------|-------|----------------------|
| **Fred** (principles-first) | ADR compliance, boundary discipline | C1: trigger content contract; I1: platform leakage; I2: ADR-114 cross-ref; I3: experience gap; I4: naming; I5: plugin namespace |
| **Barney** (simplification) | Simplification, dependency direction | C1: trigger contract; C2: validation tooling; command lifecycle inconsistency |
| **Betty** (systems-thinking) | Cohesion, coupling, change cost | Adapter proliferation (deferred — generator is a separate plan) |
| **Wilma** (adversarial) | Resilience, failure modes | C1: no validation; C2: no link validation; C3: agent comprehension failure; drift scenarios; scale stress |

---

## References

- ADR-125: `docs/architecture/architectural-decisions/125-agent-artefact-portability.md`
- ADR-114: `docs/architecture/architectural-decisions/114-layered-sub-agent-prompt-composition-architecture.md`
- Validation pattern: `scripts/validate-subagents.mjs`
- Foundation documents:
  - `.agent/directives/rules.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/directives/schema-first-execution.md`

---

## Future Enhancements (Out of Scope)

- **Adapter generation from manifest** (Betty/Wilma suggestion) — valuable but separate plan when N*M growth becomes painful
- **Link validation in markdownlint** — if markdownlint gains link checking, integrate it
- **Trigger classes** (Barney suggestion: `policy-trigger`, `directive-trigger`, `skill-trigger`) — evaluate if the simpler contract in Phase 1 is sufficient first
- **Hooks portability** — tracked in `future/hooks-portability.plan.md`
