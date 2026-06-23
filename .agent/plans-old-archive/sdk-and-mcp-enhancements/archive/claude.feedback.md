# Feedback on MCP Apps Standard Migration Plan

**Reviewer**: Claude (Opus 4.6, separate session)
**Date**: 2026-03-05
**Plan reviewed**: `mcp-apps-standard-migration.plan.md` (same directory)
**Status**: All 10 recommendations applied on 2026-03-05 (see plan changelog)

---

## Overall Assessment

The plan demonstrates strong domain knowledge, thorough evidence gathering (the OpenAI coupling inventory is excellent), and a well-reasoned reframing from "OpenAI-specific" to "MCP Apps standard first". The ADR compliance matrix is comprehensive.

However, the plan has structural issues that put it at odds with the plan architecture defined in ADR-117 and the executable plan templates. These are worth addressing before execution begins.

---

## Structural Feedback

### 1. Lifecycle mismatch — this reads as a strategic brief in an executable slot

The plan lives in `active/` but does not follow the executable plan template structure. Per `.agent/commands/plan.md`, executable plans (`active/`, `current/`) MUST have:

- TDD phase structure (RED/GREEN/REFACTOR)
- Per-task acceptance criteria with deterministic validation commands
- Quality gates after each phase

The current plan uses a "Domain A–D" structure with dependency ordering (A→B→C→D), which is closer to a **strategic roadmap** or **collection of plans** than a single executable plan.

**Suggestion**: Consider restructuring as:

1. A **roadmap** (`sdk-and-mcp-enhancements/roadmap.md` or similar) containing the strategic framing, reframing rationale, coupling inventory, ADR matrix, and domain dependency ordering.
2. **Separate executable plans** for each domain that moves to `active/` only when work begins — e.g., `mcp-apps-research.plan.md` (Domain A), `adapter-pattern-refactor.plan.md` (Domain C).

This aligns with the template guidance: "Facts are authoritative in one document and referenced by the others."

### 2. No TDD phases

The plan has no RED/GREEN/REFACTOR cycle structure. For Domain C (the refactoring backlog), TDD phases are essential — each refactor item (adapter boundary, MIME migration, widget JS migration) should have explicit test-first phases with acceptance criteria.

Domain A (research) and Domain B (specialist specification) are not implementation tasks and arguably don't need TDD phases — but they also shouldn't be in an `active/` executable plan. They're pre-execution activities.

### 3. Frontmatter todos are too coarse

The current frontmatter todos are domain-level labels:

```yaml
- id: research-source-refresh-and-link-health
  content: "Refresh mandatory and high-value source list..."
  status: pending
```

These should be specific, atomic tasks that can be individually completed and validated. Compare with the quality-fix-plan template which uses phase-level todos (`phase-0-foundation`, `phase-1-resolution`, etc.).

### 4. No per-task acceptance criteria

The plan has an "Exit Criteria" section (15 items) and a "Quality Gates and Validation Commands" section, but individual tasks within each domain lack specific acceptance criteria with deterministic validation commands. The template requires each task to have:

- Acceptance criteria (specific, checkable)
- Deterministic validation (commands with expected outputs)
- "Task complete when" statement

---

## Content Feedback

### 5. The reframing section is strong — promote it

The "OpenAI App vs MCP App: The Reframing" section (lines 54–61) is the most valuable part of the plan. Consider whether this insight deserves an ADR of its own, or at minimum should be referenced from the roadmap as a key architectural decision.

### 6. Missing non-goals section (YAGNI)

The plan doesn't explicitly state what is out of scope. The templates require a non-goals section. Candidates:

- Not building a separate OpenAI App (already stated, but not in a non-goals section)
- Not migrating to MCP Apps SDK on the server side if `@modelcontextprotocol/sdk` already suffices
- Not implementing ChatGPT-specific features (modals, Instant Checkout) in this plan

### 7. Could it be simpler? — the first question

The plan is ~500 lines. The ADR compliance matrix alone is ~30 rows spanning 7 columns. Some observations:

- The ADR matrix includes many ADRs with "None confirmed" gaps and generic planned actions like "Preserve X assumption". Consider trimming to ADRs with actual gaps or actions required by this migration.
- Superseded ADRs (4 rows) add noise — a single note that superseded ADRs are treated as anti-pattern references would suffice.
- The "Current State Evidence" section overlaps heavily with the "OpenAI coupling inventory summary" table. One or the other; the table is more scannable.

### 8. Domain A research scope could be tighter

Domain A includes 11 mandatory sources and 12 additional high-value sources (23 URLs total). The ChatGPT MCP Apps acceptance validation (the mandatory new deliverable) is the highest-value research task. Consider whether the full capability matrix, compatibility matrix, risk register, and confidence log are all necessary before Domain C can start, or whether a focused "can we drop the OpenAI-specific surface?" validation would unblock faster.

### 9. Domain B (specialist sub-agent) — is this needed?

The `mcp-extensions-expert` specialist profile is well-specified but raises the question: does this migration need a dedicated specialist sub-agent, or can the existing `architecture-reviewer-*` and `security-reviewer` sub-agents cover the review needs? The practice already has a rich reviewer roster. Adding a new specialist adds maintenance burden. Consider whether the escalation criteria and review checklist could be a review brief given to existing sub-agents instead.

### 10. Auth safety gap (item 8 in Domain C) is small and independent

The `tool-auth-checker.ts` defensive handling fix is a small, independent safety fix. It doesn't depend on Domains A or B. Consider extracting it as a standalone quality-fix plan that can be executed immediately rather than waiting for the full A→B→C dependency chain.

---

## Summary of Recommendations

| # | Recommendation | Priority |
|---|---------------|----------|
| 1 | Restructure as roadmap + separate executable plans per domain | High |
| 2 | Add TDD phases to Domain C refactor items | High |
| 3 | Make frontmatter todos atomic and phase-aligned | Medium |
| 4 | Add per-task acceptance criteria with deterministic validation | High |
| 5 | Promote the reframing insight to an ADR or roadmap-level decision | Medium |
| 6 | Add explicit non-goals section | Medium |
| 7 | Trim ADR matrix to rows with actual gaps/actions | Low |
| 8 | Tighten Domain A to focus on the ChatGPT acceptance validation | Medium |
| 9 | Reconsider whether Domain B specialist is needed vs existing reviewers | Low |
| 10 | Extract auth safety fix as standalone immediate plan | Medium |
