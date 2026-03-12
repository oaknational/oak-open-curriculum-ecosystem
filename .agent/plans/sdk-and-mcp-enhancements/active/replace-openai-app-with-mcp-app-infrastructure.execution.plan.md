---
name: "Replace OpenAI App with MCP App Infrastructure"
overview: "Dedicated execution plan for the OpenAI App to MCP Apps migration series. Makes the specialist review path explicit, names the Oak MCP Apps skills to use, and brings the roadmap into an active, execution-ready shape without changing product code."
source_research:
  - "../mcp-apps-support.research.md"
  - "../roadmap.md"
todos:
  - id: phase-0-specialist-alignment
    content: "Phase 0: Confirmed the specialist reviewer of record, aligned the MCP reviewer guidance, and removed roadmap drift around the previously proposed extra MCP specialist."
    status: completed
  - id: phase-1-plan-discoverability
    content: "Phase 1: Made this migration discoverable from the collection roadmap, active index, and collection README with explicit links."
    status: completed
  - id: phase-2-skill-references
    content: "Phase 2: Made the Oak MCP Apps skills explicit in the specialist reviewer and in the migration plans."
    status: completed
  - id: phase-3-domain-c-split
    content: "Phase 3: After the reframing ADR is accepted, split Domain C into dedicated execution plans for C1/C2, C5, C4/C6, and C3/C10."
    status: pending
  - id: phase-4-review
    content: "Phase 4: Ran docs, MCP, code, and subagent reviews on the documentation changes and captured follow-up actions."
    status: completed
---

# Replace OpenAI App with MCP App Infrastructure

**Last Updated**: 2026-03-07
**Status**: 🟢 ACTIVE
**Scope**: Documentation-only activation of the MCP Apps migration series. No product-code changes are made under this plan.

---

## Why This Is Active Now

The migration already has strong research and a detailed roadmap, but it is easy
to miss because there has not been a plainly named active execution plan for the
work.

This plan exists to fix that discoverability gap and to make the execution path
explicit:

1. the specialist reviewer of record
2. the Oak MCP Apps skills to use
3. the relationship between the roadmap and future Domain C execution plans

---

## Standalone Session Entry

Use this section to start a fresh session from this plan alone.

### Re-ground

Read:

1. `.agent/directives/AGENT.md`
2. `.agent/directives/principles.md`
3. `.agent/directives/testing-strategy.md`
4. `.agent/directives/schema-first-execution.md`
5. `.agent/plans/sdk-and-mcp-enhancements/roadmap.md`
6. `.agent/plans/sdk-and-mcp-enhancements/mcp-apps-support.research.md`

### Specialist Reviewer

The specialist reviewer of record for this migration is:

1. `.agent/sub-agents/templates/mcp-reviewer.md`

Use `mcp-reviewer` for MCP Apps migration planning, MCP Apps standards review,
resource metadata review, capability-negotiation review, and OpenAI App to MCP
Apps replacement work.

### Oak MCP Apps Skills

The Oak-specific skills for this work are:

1. `.agent/skills/mcp-migrate-oai/SKILL.md`
2. `.agent/skills/mcp-create-app/SKILL.md`
3. `.agent/skills/mcp-add-ui/SKILL.md`
4. `.agent/skills/mcp-convert-web/SKILL.md`

Use `mcp-migrate-oai` for the replacement work itself. The other three skills
cover post-migration additive work and must remain visible so follow-on work
does not drift back into OpenAI-specific patterns.

---

## Problem

The current collection has:

1. strong research in `mcp-apps-support.research.md`
2. a strong planning anchor in `roadmap.md`
3. a real MCP specialist reviewer in `mcp-reviewer`

It previously had two clarity problems:

1. the roadmap referred to a separate extra MCP specialist profile that did not
   exist in the repo
2. there is no plainly named active execution plan that says "this is the
   OpenAI App to MCP Apps infrastructure replacement work"

This plan fixes those documentation gaps without changing runtime code.

---

## Outcome

When this plan is complete:

1. the migration is clearly discoverable from the active index and collection
   README
2. `mcp-reviewer` is the explicit specialist reviewer of record for this work
3. the four Oak MCP Apps skills are explicitly referenced in the specialist
   reviewer and in the migration planning docs
4. the roadmap clearly points to the next executable split once the reframing
   ADR is accepted

---

## Scope

In scope:

1. specialist-reviewer naming and guidance alignment
2. plan and README discoverability updates
3. explicit skill references in the specialist reviewer and migration plans
4. review of these documentation changes by the relevant reviewer set

Out of scope:

1. runtime or generator implementation changes
2. writing the reframing ADR itself
3. creating the Domain C implementation plans in this same session
4. changing the stdio server scope

---

## Execution Phases

### Phase 0 — Specialist Alignment

1. Treat `mcp-reviewer` as the existing specialist reviewer for MCP Apps work.
2. Remove live roadmap references that imply a separate extra MCP specialist
   profile still needs to be created.
3. Preserve the simple architecture: one MCP specialist, not two overlapping
   MCP specialists.

### Phase 1 — Discoverability

1. Link this plan from `active/README.md`.
2. Make the collection `README.md` point clearly at this plan as the active
   OpenAI App replacement execution path.
3. Add this plan to the roadmap's related-documents and executable-plan
   references.

### Phase 2 — Skill References

Ensure the following are explicitly referenced where a future session would look
for guidance:

1. `mcp-migrate-oai`
2. `mcp-create-app`
3. `mcp-add-ui`
4. `mcp-convert-web`

### Phase 3 — Domain C Split

After the reframing ADR is accepted, create dedicated execution plans for:

1. C1/C2 — host-neutral boundary enforcement and toggle removal
2. C5 — tool metadata key migration
3. C4/C6 — MIME and resource metadata migration
4. C3/C10 — widget bridge migration and renderer simplification

This plan remains the active umbrella entry point until those child plans exist.

### Phase 4 — Reviews

Minimum specialist reviewers for the documentation changes under this plan:

1. `docs-adr-reviewer`
2. `mcp-reviewer`
3. `subagent-architect`

Invoke `code-reviewer` as well when repository review policy requires the
gateway reviewer on documentation changes.

`architecture-reviewer-fred`: invoke if the roadmap edits materially change ADR
or boundary commitments.

---

## Validation

Documentation integrity:

```bash
pnpm markdownlint:root
```

Reference sweep:

```bash
rg -n "mcp-extensions-expert|mcp-reviewer|mcp-migrate-oai|mcp-create-app|mcp-add-ui|mcp-convert-web" \
  .agent/plans/sdk-and-mcp-enhancements \
  .agent/sub-agents/templates \
  .cursor/agents \
  .claude/agents
```

---

## Related Documents

1. [../roadmap.md](../roadmap.md)
2. [../mcp-apps-support.research.md](../mcp-apps-support.research.md)
3. [../README.md](../README.md)
4. [README.md](README.md)
5. [oak-preview-mcp-snagging.execution.plan.md](../archive/completed/oak-preview-mcp-snagging.execution.plan.md)
