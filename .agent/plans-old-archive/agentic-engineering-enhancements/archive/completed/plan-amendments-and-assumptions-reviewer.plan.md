---
name: Plan Amendments and Assumptions Reviewer
overview: Amend the frontend-practice plan based on assumption audit findings and user-confirmed decisions, then create the assumptions-reviewer as a new specialist agent.
todos:
  - id: amend-oak-components
    content: "Amend frontend-practice plan: correct oak-components relationship to 'reference-only for value extraction, no dependency, no consumer adopts it'"
    status: completed
  - id: amend-phase3-reviewers
    content: "Amend frontend-practice plan: reduce Phase 3 from 10 to 5-6 reviewers (drop 4x architecture reviewers and test-reviewer)"
    status: completed
  - id: remove-provenance-uuid
    content: "Amend frontend-practice plan: remove Phase 5 (provenance UUID), R14, and related risk entries. Keep provenance index 18 update in Phase 1d"
    status: completed
  - id: amend-adr145-delivery
    content: "Amend frontend-practice plan: add explicit token-to-consumer delivery path in ADR-145 section (Vite bundles CSS into mcp-app.html)"
    status: completed
  - id: amend-blocking-gate
    content: "Amend frontend-practice plan: make blocking gate specific (importable CSS with minimal palette + semantic + light/dark themes, widget build bundles it)"
    status: completed
  - id: author-adr-assumptions
    content: "Author ADR-146 for assumptions-reviewer: meta-level plan reviewer with inverted doctrine hierarchy"
    status: completed
  - id: author-reviewer-template
    content: Author assumptions-reviewer.md template following ADR-129 triplet with inverted doctrine hierarchy
    status: completed
  - id: author-reviewer-skill
    content: Author assumptions-expert/SKILL.md active workflow for assumption auditing
    status: completed
  - id: author-reviewer-rule
    content: Author invoke-assumptions-reviewer.md with trigger conditions
    status: completed
  - id: update-invocation-matrix
    content: Add assumptions-reviewer to invoke-code-reviewers.md quick-triage checklist and gateway table
    status: completed
  - id: practice-core-note
    content: Add Practice Core note about assumption auditing as transferable pattern
    status: completed
  - id: platform-adapters
    content: Create platform adapters (Cursor, Claude Code, Codex, Gemini CLI) for assumptions-reviewer
    status: completed
  - id: validate-gates
    content: Run pnpm subagents:check and pnpm portability:check
    status: completed
  - id: update-session-prompt
    content: Update session continuation prompt to reflect streamlined plan and new assumptions-reviewer capability
    status: completed
isProject: false
---

# Plan Amendments and Assumptions Reviewer

## Context

The assumption audit challenged the frontend-practice plan on proportionality, consumer evidence, and technology commitment timing. The user has resolved the key open questions with domain knowledge:

- **Two workspaces**: confirmed needed for future multi-theme, multi-app work
- **DTCG JSON**: committed to as W3C direction
- **Workspace timing**: create now, consumed by Phase 4 from day one
- **Specialist agents**: create now alongside workspaces
- **Documentation**: full suite (ADRs + governance docs)
- **oak-components**: reference-only for colour/typeface/spacing values; no dependency; no consumer will adopt it

The audit also surfaced a structural gap: no existing reviewer questions assumptions or proportionality. This warrants a new `assumptions-reviewer` agent.

---

## Part A: Amend the Frontend-Practice Plan

The plan's architecture is confirmed correct. Specific amendments:

### A1. Correct oak-components relationship

In Part 2.3 (Workspace B) and Part 5 (Q5):

- Current text says "No formal relationship" and "used for colours/typefaces/sizing as a current convenience only"
- Amend to make explicit: **none of the consuming sites will use oak-components as a dependency**. The relationship is value extraction only — Oak palette hex codes, typeface names, and spacing scale values are referenced when authoring `@oaknational/oak-design-tokens`, then the relationship ends. No import, no peer dependency, no runtime coupling

### A2. Streamline Phase 3 reviewer count

Current Phase 3 invokes 10 reviewers. Reduce to 5-6 targeted reviewers:

**Keep:**

- `accessibility-reviewer` (exercising itself on the new a11y gate)
- `design-system-reviewer` (exercising itself on token architecture)
- `docs-adr-reviewer` (cross-reference consistency across 3 ADRs + 2 governance docs)
- `code-reviewer` (gateway triage exercise)
- `subagent-architect` (triplet quality for the 3 new agents)

**Drop:**

- 4x architecture reviewers (Barney, Betty, Fred, Wilma) — the ADRs will get architecture review when they are authored, not again in Phase 3
- `test-reviewer` — the a11y gate integration in ADR-121 is straightforward

This reduces the feedback surface from ~20 items to ~8-10, which is proportional to the work.

### A3. Defer provenance UUID proposal

Remove Phase 5 (provenance UUID) from this plan entirely. The linear index problem is real but manageable with 2-3 repos. Create a separate future-queued item if needed.

Affected files:

- Remove `phase-1d-provenance` todo's UUID evolution proposal (keep the provenance index 18 update)
- Remove Phase 5 section
- Remove provenance UUID from Risks table
- Remove R14 from resolved decisions (no longer relevant to this plan)

### A4. Clarify ADR-145 token-to-consumer path

ADR-145 should explicitly state:

- Primary delivery: CSS custom properties bundled into the MCP App HTML resource via Vite (the existing `vite-plugin-singlefile` pipeline in `widget/vite.config.ts`)
- The widget imports the built CSS from `@oaknational/oak-design-tokens` — Vite inlines it into `mcp-app.html`
- No separate CDN or `_meta.ui.csp.resourceDomains` entry needed for tokens
- Future consumers (Astro sites, other apps) import the same CSS through their own build systems

### A5. Update blocking relationship text

The plan currently says "token infrastructure must exist" as the blocking gate. Amend to be specific: the gate is that `@oaknational/oak-design-tokens` produces importable CSS with a minimal Oak palette, semantic layer, and light+dark themes, and the widget build (`widget/vite.config.ts`) successfully bundles it.

---

## Part B: Create the Assumptions Reviewer

A new meta-level reviewer following the ADR-129 Domain Specialist Capability Pattern with an **inverted doctrine hierarchy**: project principles and simplicity-first assessment take priority over external expertise.

### B1. Author ADR for the assumptions-reviewer concept

New ADR (next available number) recording:

- **Problem**: The existing reviewer system questions code quality, architecture, security, types, tests, and documentation — but no reviewer questions whether the plan itself is proportional to the problem, whether blocking relationships are legitimate, or whether assumptions have evidence
- **Decision**: Create an `assumptions-reviewer` that operates at the plan/design level, not the code level
- **Key differentiator**: Inverted doctrine hierarchy — project principles (especially "Could it be simpler?") outrank external expertise
- **Assessment areas**: Proportionality, assumption validity, blocking legitimacy, consumer evidence, technology commitment timing, agent proliferation, simplification opportunities
- **Output format**: Assumption Audit (structured per-assumption evidence check)
- **Transferable pattern**: This is a meta-level capability applicable to any agentic engineering practice

### B2. Author `assumptions-reviewer.md` template

Following ADR-129 structure. Key sections:

- **Identity**: Meta-level plan and design reviewer
- **Doctrine hierarchy** (inverted): (1) Project principles/directives, (2) Architectural decisions, (3) Practice governance, (4) External expertise
- **Assessment areas**: 6 areas from the assumption audit methodology
- **Output format**: Assumption Audit with per-assumption evidence ratings
- **Trigger conditions**: Plan creation, plan marked decision-complete, blocking relationship assertions, 3+ new agents proposed, new workspace category proposals

### B3. Author `assumptions-expert/SKILL.md`

Active workflow skill for conducting assumption audits during planning phases. Steps:

1. Read the plan and all referenced blocking/dependency plans
2. For each assumption: state it, cite existing evidence, state what evidence is needed
3. Categorise assumptions (source material, technology choice, agent architecture, process/sequencing, value)
4. Rate each assumption: validated / partially validated / unvalidated
5. Produce structured Assumption Audit output

### B4. Author `invoke-assumptions-reviewer.md` rule

Trigger conditions:

- Any plan marked "DECISION-COMPLETE" or "READY FOR EXECUTION"
- Plans asserting blocking relationships over other workstreams
- Plans proposing 3+ new specialist agents
- Plans proposing new workspace categories or package topology changes
- Plans committing to technology choices before research phases complete

### B5. Update invocation matrix

Add `assumptions-reviewer` to the quick-triage checklist in `invoke-code-reviewers.md` and the gateway routing table.

### B6. Practice Core note

Add a note to the Practice Core about assumption auditing as a transferable meta-level capability for the next outgoing exchange.

### B7. Platform adapters

Create adapters for Cursor, Claude Code, Codex, and Gemini CLI per ADR-125.

### B8. Validate

Run `pnpm subagents:check` and `pnpm portability:check`.

---

## Part C: Update Session Continuation Prompt

Amend `session-continuation.prompt.md`:

- Keep the frontend-practice plan as blocking for WS3 Phases 4-5 (confirmed by user)
- Update the "next action" text to reflect the streamlined Phase 3
- Add a note about the assumptions-reviewer as a new capability
- Remove references to provenance UUID proposal
