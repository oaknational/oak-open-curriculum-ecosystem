# ADR-129: Domain Specialist Capability Pattern

**Status**: Accepted. Amended 2026-05-10 to align the pattern with the
unified `*-expert` agent model.
**Date**: 2026-03-07
**Related**: [ADR-114 (Layered Sub-agent Prompt Composition)](114-layered-sub-agent-prompt-composition-architecture.md), [ADR-119 (Agentic Engineering Practice)](119-agentic-engineering-practice.md), [ADR-125 (Agent Artefact Portability)](125-agent-artefact-portability.md)

## Context

The repository has 12+ specialist reviewers (code, architecture, test, type, config, security, docs-adr, MCP, etc.). Over time, a repeatable pattern emerged for adding domain-specific expertise to the agent ecosystem: create a reviewer template, an active workflow skill, and a situational invocation rule.

The MCP reviewer followed this pattern informally. The Elasticsearch specialist capability plan formalised it further. However, no architectural decision recorded the pattern itself — each new specialist was designed from scratch or by copying an existing one, with no normative reference for what a complete domain specialist looks like.

This creates three risks:

1. **Inconsistency**: each specialist defines its own authority hierarchy and context model ad hoc.
2. **Incomplete rollout**: without a checklist, new specialists may ship without situational rules, platform adapters, or discoverability updates.
3. **Scope confusion**: without a clear capability split, reviewers accumulate active workflow responsibilities that belong in a companion skill.

## Decision

Codify the **domain specialist capability** as the standard shape for adding
domain-specific expertise to the agent ecosystem.

### 2026-05-10 Amendment: Unified Expert Model

The original triplet separated read-only reviewer templates from active
workflow skills. The current accepted direction is a unified `*-expert`
sub-agent template that can explore, advise, and review, with active-workflow
guidance folded into the expert prompt where that domain previously had a
paired skill. The situational rule remains the trigger surface, but it invokes
the expert rather than a `*-reviewer` identity.

Standalone active skills may remain temporarily while migration is in progress,
but the durable shape is:

| Artefact             | Purpose                                                          | Location                                         |
| -------------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| **Expert template**  | Domain expertise across explore, advise, and review modes        | `.agent/sub-agents/templates/<domain>-expert.md` |
| **Situational rule** | Trigger conditions for when to invoke the expert                 | `.agent/rules/invoke-<domain>-expert.md`         |
| **Adapters**         | Thin platform wrappers for the expert and its invocation surface | Per ADR-125                                      |

The old reviewer + skill split is historical unless a future ADR records a
domain-specific reason to keep the capabilities separate.

### Historical Triplet

A complete domain specialist consists of three artefacts:

| Artefact             | Purpose                                                            | Location                                           |
| -------------------- | ------------------------------------------------------------------ | -------------------------------------------------- |
| **Reviewer**         | Read-only specialist assessment against authoritative sources      | `.agent/sub-agents/templates/<domain>-reviewer.md` |
| **Skill**            | Active workflow for planning, research, and implementation support | `.agent/skills/<domain>-expert/SKILL.md`           |
| **Situational rule** | Trigger conditions for when to invoke the reviewer                 | `.agent/rules/invoke-<domain>-reviewer.md`         |

Historically, the reviewer and skill had distinct responsibilities:

- The **reviewer** observed, analysed, and reported. It did not modify code.
- The **skill** supported the working agent during active tasks.

Under the unified expert model, those responsibilities become modes of one
domain expert rather than separate canonical artefacts.

### Doctrine Hierarchy

Every domain specialist must enforce a consistent authority hierarchy when assessing work:

1. **Current official external documentation** — fetched live from the web, not cached or copied.
2. **Official packages and client sources** — npm packages, GitHub repositories, SDK documentation.
3. **Repository ADRs and research** — local constraints, accepted trade-offs, and current architecture as secondary context.
4. **Existing implementation** — evidence of current state, not authority for future decisions.

This hierarchy prevents the common failure mode where agents inherit stale local patterns instead of consulting current authoritative sources.

### Tiered Local Context

Domain specialists that require significant local context must tier their reading lists:

- **Must-read** (always loaded): the 3–5 most foundational documents for the domain. These provide essential architectural context that every review needs.
- **Consult-if-relevant** (loaded when the review touches that area): additional documents that provide depth on specific sub-topics. Loading these on every invocation wastes context window.

### Standard Rollout

New domain specialists follow a standard rollout sequence:

1. **Baseline audit** — confirm no equivalent artefacts exist; freeze the authority stack.
2. **Canonical artefacts** — create the reviewer template, skill, and situational rule in `.agent/`.
3. **Coordination updates** — add the specialist to the AGENT.md roster and the invocation guidance.
4. **Platform adapters** — create thin wrappers per ADR-125 across supported platforms.
5. **Discoverability** — update collection indexes, roadmaps, and session-entry guidance.
6. **Review and propagation** — specialist review pass; documentation propagation.

### Non-Goals

Not every domain needs a full triplet. This pattern applies when:

- The domain has authoritative external sources that evolve independently of the repo.
- Multiple areas of the codebase touch the domain, making situational invocation valuable.
- The review and active workflow responsibilities are distinct enough to warrant separation.

Simple, repo-internal concerns (e.g., a coding convention) are better served by a rule in `.agent/directives/` without the full triplet overhead.

## Rationale

### Why a triplet, not just a reviewer

A reviewer alone leaves the working agent without structured guidance during active tasks. The skill fills this gap. A reviewer and skill alone leave invocation to chance. The situational rule ensures the reviewer is triggered when relevant code is touched, without relying on agents to remember.

### Why a doctrine hierarchy

Without an explicit authority order, agents default to whatever context is most immediately available — usually existing repo code. This creates a feedback loop where local patterns are perpetuated regardless of whether they remain best practice. The hierarchy breaks this loop by requiring external consultation first.

### Why tiered context

Domain specialists with 20+ mandatory documents consume significant context window on every invocation. Tiering ensures essential context is always present while deeper references are loaded only when relevant, making the specialist practical to invoke frequently.

### Why not a generic "specialist template"

The triplet pattern is deliberately lightweight — three artefacts with clear responsibilities and a doctrine hierarchy. A generic template system would add abstraction without solving a real problem. If the pattern proves too rigid for a future domain, the ADR can be amended.

## Consequences

### Positive

- New domain specialists have a normative reference instead of copying ad hoc from existing ones.
- The reviewer/skill/rule distinction is a first-class architectural decision, reducing scope confusion.
- The doctrine hierarchy is consistent across all specialists, preventing authority inversion.
- Tiered context makes specialists practical to invoke without sacrificing depth.
- The standard rollout checklist prevents incomplete capability deployments.

### Trade-offs

- Each new domain specialist produces ~12 files across canonical locations and platform adapters. This is the cost of the portability architecture (ADR-125), not of this pattern — but the pattern makes it more visible.
- The triplet may be more structure than some domains need. The non-goals section provides guidance on when to use a simpler approach.
- The doctrine hierarchy assumes authoritative external sources exist. For purely internal domains, the hierarchy collapses to repo context only.

## References

- `.agent/sub-agents/templates/` — existing reviewer templates (13)
- `.agent/skills/` — existing skills (16)
- `.agent/rules/` — existing situational rules
- `.agent/memory/executive/invoke-code-reviewers.md` — reviewer invocation guidance
- `.agent/plans/agentic-engineering-enhancements/elasticsearch-specialist-capability.plan.md` — first explicit consumer of this pattern
